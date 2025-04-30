
from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import sqlite3
import os
import base64
import datetime
import json
import numpy as np
import cv2
import face_recognition
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'facevote_secret_key'  # Change this in production

# Initialize database
def init_db():
    conn = sqlite3.connect('facevote.db')
    c = conn.cursor()
    
    # Create voters table
    c.execute('''
    CREATE TABLE IF NOT EXISTS voters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        face_encoding TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        has_voted INTEGER DEFAULT 0
    )
    ''')
    
    # Create candidates table
    c.execute('''
    CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        party TEXT NOT NULL
    )
    ''')
    
    # Create votes table
    c.execute('''
    CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        voter_id INTEGER NOT NULL,
        candidate_id INTEGER NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (voter_id) REFERENCES voters (id),
        FOREIGN KEY (candidate_id) REFERENCES candidates (id)
    )
    ''')
    
    # Create admin table
    c.execute('''
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )
    ''')
    
    # Insert default admin if not exists
    c.execute("SELECT * FROM admins WHERE username = 'admin'")
    if not c.fetchone():
        admin_password = generate_password_hash('admin123')
        c.execute("INSERT INTO admins (username, password) VALUES (?, ?)", 
                 ('admin', admin_password))
    
    # Insert default candidates if not exists
    c.execute("SELECT * FROM candidates")
    if not c.fetchall():
        candidates = [
            ('John Smith', 'Democratic Party'),
            ('Sarah Johnson', 'Republican Party'),
            ('Michael Williams', 'Independent'),
            ('Jessica Brown', 'Green Party')
        ]
        c.executemany("INSERT INTO candidates (name, party) VALUES (?, ?)", candidates)
    
    conn.commit()
    conn.close()

# Initialize the database
init_db()

# Helper function to get database connection
def get_db():
    conn = sqlite3.connect('facevote.db')
    conn.row_factory = sqlite3.Row
    return conn

# Face encoding handling
def base64_to_face_encoding(base64_string):
    # Remove the data:image prefix if present
    if 'base64,' in base64_string:
        base64_string = base64_string.split('base64,')[1]
    
    # Convert base64 to image
    img_data = base64.b64decode(base64_string)
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    # Convert BGR to RGB (face_recognition uses RGB)
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Find face locations
    face_locations = face_recognition.face_locations(rgb_img)
    
    if not face_locations:
        return None
    
    # Get face encodings
    face_encodings = face_recognition.face_encodings(rgb_img, face_locations)
    
    if not face_encodings:
        return None
    
    # Return the first face encoding
    return json.dumps(face_encodings[0].tolist())

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        face_image = data.get('faceImage')
        
        # Process face image to get encoding
        face_encoding = base64_to_face_encoding(face_image)
        
        if not face_encoding:
            return jsonify({'success': False, 'message': 'No face detected in image'}), 400
        
        # Save to database
        conn = get_db()
        c = conn.cursor()
        c.execute("INSERT INTO voters (name, email, face_encoding) VALUES (?, ?, ?)",
                 (name, email, face_encoding))
        conn.commit()
        voter_id = c.lastrowid
        conn.close()
        
        return jsonify({'success': True, 'voterId': voter_id})
    
    return render_template('register.html')

@app.route('/vote', methods=['GET', 'POST'])
def vote():
    if request.method == 'POST':
        data = request.get_json()
        face_image = data.get('faceImage')
        candidate_id = data.get('candidateId')
        
        # Process face image to get encoding
        new_face_encoding = base64_to_face_encoding(face_image)
        
        if not new_face_encoding:
            return jsonify({'success': False, 'message': 'No face detected in image'}), 400
        
        # Convert string to numpy array for comparison
        new_face_encoding_array = np.array(json.loads(new_face_encoding))
        
        # Get all approved voters who haven't voted
        conn = get_db()
        c = conn.cursor()
        c.execute("SELECT id, face_encoding FROM voters WHERE status = 'approved' AND has_voted = 0")
        voters = c.fetchall()
        
        matched_voter_id = None
        
        # Compare face with all stored faces
        for voter in voters:
            stored_encoding = np.array(json.loads(voter['face_encoding']))
            
            # Compare faces with a threshold
            results = face_recognition.compare_faces([stored_encoding], new_face_encoding_array, tolerance=0.6)
            
            if results[0]:
                matched_voter_id = voter['id']
                break
        
        if not matched_voter_id:
            conn.close()
            return jsonify({'success': False, 'message': 'Face verification failed'}), 401
        
        # Record the vote
        try:
            c.execute("INSERT INTO votes (voter_id, candidate_id) VALUES (?, ?)",
                     (matched_voter_id, candidate_id))
            c.execute("UPDATE voters SET has_voted = 1 WHERE id = ?", (matched_voter_id,))
            conn.commit()
            conn.close()
            return jsonify({'success': True})
        except Exception as e:
            conn.rollback()
            conn.close()
            return jsonify({'success': False, 'message': str(e)}), 500
    
    # GET request: render the voting page
    # Get candidates for the form
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM candidates")
    candidates = c.fetchall()
    conn.close()
    
    return render_template('vote.html', candidates=candidates)

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        data = request.form if request.form else request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        conn = get_db()
        c = conn.cursor()
        c.execute("SELECT * FROM admins WHERE username = ?", (username,))
        admin_user = c.fetchone()
        
        if admin_user and check_password_hash(admin_user['password'], password):
            session['admin_logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            return render_template('admin.html', error="Invalid credentials")
    
    if session.get('admin_logged_in'):
        return redirect(url_for('admin_dashboard'))
        
    return render_template('admin.html')

@app.route('/admin/dashboard')
def admin_dashboard():
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin'))
    
    # Get pending voters for approval
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM voters")
    voters = c.fetchall()
    
    # Get voting results
    c.execute("""
        SELECT c.name, c.party, COUNT(v.id) as vote_count
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidate_id
        GROUP BY c.id
    """)
    results = c.fetchall()
    
    # Calculate statistics
    c.execute("SELECT COUNT(*) FROM voters WHERE status = 'approved'")
    total_approved_voters = c.fetchone()[0]
    
    c.execute("SELECT COUNT(*) FROM votes")
    total_votes = c.fetchone()[0]
    
    voter_turnout = 0
    if total_approved_voters > 0:
        voter_turnout = (total_votes / total_approved_voters) * 100
        
    conn.close()
    
    return render_template('admin_dashboard.html', 
                          voters=voters, 
                          results=results, 
                          total_votes=total_votes,
                          total_approved_voters=total_approved_voters,
                          voter_turnout=voter_turnout)

@app.route('/api/approve_voter/<int:voter_id>', methods=['POST'])
def approve_voter(voter_id):
    if not session.get('admin_logged_in'):
        return jsonify({'success': False, 'message': 'Not authorized'}), 401
    
    conn = get_db()
    c = conn.cursor()
    c.execute("UPDATE voters SET status = 'approved' WHERE id = ?", (voter_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/reject_voter/<int:voter_id>', methods=['POST'])
def reject_voter(voter_id):
    if not session.get('admin_logged_in'):
        return jsonify({'success': False, 'message': 'Not authorized'}), 401
    
    conn = get_db()
    c = conn.cursor()
    c.execute("UPDATE voters SET status = 'rejected' WHERE id = ?", (voter_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
