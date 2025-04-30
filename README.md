
# FaceVote - Secure Voting System

A simple Flask-based application that implements face recognition for secure voting.

## Features

- Voter registration with face capture
- Face verification for voting
- Admin dashboard to approve/reject voters
- Voting results visualization
- Simple, minimal tech stack

## Technology Stack

- **Backend**: Python with Flask
- **Database**: SQLite
- **Face Recognition**: face_recognition library
- **Frontend**: HTML, CSS, JavaScript
- **UI Framework**: Bootstrap 5

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   pip install flask face_recognition numpy opencv-python werkzeug
   ```
3. Run the application:
   ```
   python app.py
   ```
4. Visit `http://localhost:5000` in your browser

## Default Admin Credentials

- Username: admin
- Password: admin123

## System Requirements

- Python 3.6+ 
- Webcam for face registration and verification
- Modern web browser

## Project Structure

- `app.py` - Main Flask application
- `templates/` - HTML templates
- `static/` - CSS, JavaScript, and other static files
- `facevote.db` - SQLite database (created on first run)
