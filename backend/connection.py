# backend/connection.py (Extended)
import os
import logging
from datetime import datetime
from sqlalchemy import JSON
from werkzeug.utils import secure_filename
import uuid
import json

from PIL import Image
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

# Keep your existing mail helpers
from mailconnect import send_email_notification, send_email_notify

# Add this constant with your other configurations
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_course_image(file_obj):
    """Save uploaded course image and return the URL path"""
    if not file_obj or file_obj.filename == "":
        return None
    
    if not allowed_file(file_obj.filename):
        raise ValueError("Invalid file type")
    
    # Generate unique filename
    filename = secure_filename(file_obj.filename)
    ext = filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    
    # Create courses subdirectory if it doesn't exist
    courses_dir = os.path.join(UPLOAD_FOLDER, 'courses')
    os.makedirs(courses_dir, exist_ok=True)
    
    filepath = os.path.join(courses_dir, unique_filename)
    
    # Save and optimize image
    file_obj.save(filepath)
    
    # Optional: Resize/optimize the image
    try:
        with Image.open(filepath) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Resize if too large (max 1200px width)
            max_width = 1200
            if img.width > max_width:
                ratio = max_width / img.width
                new_size = (max_width, int(img.height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # Save optimized
            img.save(filepath, quality=85, optimize=True)
    except Exception as e:
        app.logger.warning(f"Image optimization failed: {e}")
    
    # Return URL path (relative to uploads folder)
    return f"/uploads/courses/{unique_filename}"

# --------------- INTERNSHIP MANAGEMENT ENDPOINTS -----------------

def save_internship_image(file_obj):
    """Save uploaded internship image and return the URL path"""
    if not file_obj or file_obj.filename == "":
        return None
    
    if not allowed_file(file_obj.filename):
        raise ValueError("Invalid file type")
    
    filename = secure_filename(file_obj.filename)
    ext = filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    
    internships_dir = os.path.join(UPLOAD_FOLDER, 'internships')
    os.makedirs(internships_dir, exist_ok=True)
    
    filepath = os.path.join(internships_dir, unique_filename)
    file_obj.save(filepath)
    
    # Optional: Optimize image
    try:
        with Image.open(filepath) as img:
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            max_width = 1200
            if img.width > max_width:
                ratio = max_width / img.width
                new_size = (max_width, int(img.height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            img.save(filepath, quality=85, optimize=True)
    except Exception as e:
        app.logger.warning(f"Image optimization failed: {e}")
    
    return f"/uploads/internships/{unique_filename}"

def save_uploaded_file(file_obj, dest_folder=None):
    """Save uploaded file with proper directory creation"""
    if dest_folder is None:
        dest_folder = UPLOAD_FOLDER
    
    if not file_obj or file_obj.filename == "":
        return None
    
    # Create directory if it doesn't exist
    os.makedirs(dest_folder, exist_ok=True)
    
    filename = secure_filename(file_obj.filename)
    ts = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    safe_name = f"{ts}_{filename}"
    path = os.path.join(dest_folder, safe_name)
    
    file_obj.save(path)
    return path

#  after the save_project_image function
def save_payment_screenshot(file_obj):
    """Save uploaded payment screenshot and return the URL path"""
    if not file_obj or file_obj.filename == "":
        return None
    
    if not allowed_file(file_obj.filename):
        raise ValueError("Invalid file type")
    
    filename = secure_filename(file_obj.filename)
    ext = filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    
    payment_screenshots_dir = os.path.join(UPLOAD_FOLDER, 'payment_screenshots')
    os.makedirs(payment_screenshots_dir, exist_ok=True)
    
    filepath = os.path.join(payment_screenshots_dir, unique_filename)
    file_obj.save(filepath)
    
    # Optional: Optimize image
    try:
        with Image.open(filepath) as img:
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            max_width = 1200
            if img.width > max_width:
                ratio = max_width / img.width
                new_size = (max_width, int(img.height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            img.save(filepath, quality=85, optimize=True)
    except Exception as e:
        app.logger.warning(f"Image optimization failed: {e}")
    
    return f"/uploads/payment_screenshots/{unique_filename}"

# --------------- PROJECT MANAGEMENT ENDPOINTS -----------------

def save_project_image(file_obj):
    """Save uploaded project image and return the URL path"""
    if not file_obj or file_obj.filename == "":
        return None
    
    if not allowed_file(file_obj.filename):
        raise ValueError("Invalid file type")
    
    filename = secure_filename(file_obj.filename)
    ext = filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    
    projects_dir = os.path.join(UPLOAD_FOLDER, 'projects')
    os.makedirs(projects_dir, exist_ok=True)
    
    filepath = os.path.join(projects_dir, unique_filename)
    file_obj.save(filepath)
    
    # Optional: Optimize image
    try:
        with Image.open(filepath) as img:
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            max_width = 1200
            if img.width > max_width:
                ratio = max_width / img.width
                new_size = (max_width, int(img.height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            img.save(filepath, quality=85, optimize=True)
    except Exception as e:
        app.logger.warning(f"Image optimization failed: {e}")
    
    return f"/uploads/projects/{unique_filename}"

# --------------- basic paths & folders -----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "static")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(FRONTEND_DIR, exist_ok=True)

# --------------- Flask app + logging -------------------
app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-this'  # Change this in production
jwt = JWTManager(app)

logging.basicConfig(level=logging.DEBUG)
app.logger.setLevel(logging.DEBUG)

# --------------- load DB config -----------
try:
    import config as cfg
    DB_HOST = getattr(cfg, "DB_HOST", os.environ.get("DB_HOST", "localhost"))
    DB_PORT = getattr(cfg, "DB_PORT", os.environ.get("DB_PORT", 5432))
    DB_NAME = getattr(cfg, "DB_NAME", os.environ.get("DB_NAME", "postgres"))
    DB_USER = getattr(cfg, "DB_USER", os.environ.get("DB_USER", "postgres"))
    DB_PASSWORD = getattr(cfg, "DB_PASSWORD", os.environ.get("DB_PASSWORD", ""))
except Exception:
    DB_HOST = os.environ.get("DB_HOST", "localhost")
    DB_PORT = os.environ.get("DB_PORT", 5432)
    DB_NAME = os.environ.get("DB_NAME", "postgres")
    DB_USER = os.environ.get("DB_USER", "postgres")
    DB_PASSWORD = os.environ.get("DB_PASSWORD", "")

# --------------- SQLAlchemy config -----------------------
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# --------------- Extended ORM models ---------------------
# Existing models (keep as is)
class CourseEnrollment(db.Model):
    __tablename__ = "course_enrollments"
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    mobile = db.Column(db.String(20), nullable=False)
    type = db.Column(db.String(50))
    message = db.Column(db.Text)

class DemoRequest(db.Model):
    __tablename__ = "demo_requests"
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50))
    mobile = db.Column(db.String(20), nullable=False)

class Inquiry(db.Model):
    __tablename__ = "inquiries"
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    mobile = db.Column(db.String(20), nullable=False)
    type = db.Column(db.String(50))
    message = db.Column(db.Text)

class PclInfo(db.Model):
    __tablename__ = "pclinfo"
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    mobile = db.Column(db.String(20), nullable=False)
    message = db.Column(db.Text)
    date = db.Column(db.DateTime, server_default=db.func.now())

# --------------- NEW MODELS for Course Management ---------------
class Admin(db.Model):
    __tablename__ = "admins"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    is_active = db.Column(db.Boolean, default=True)

class Course(db.Model):
    __tablename__ = "courses"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    detailed_description = db.Column(db.Text)
    level = db.Column(db.String(50))
    rating = db.Column(db.Float, default=4.5)
    students = db.Column(db.String(20), default="0")
    duration = db.Column(db.String(50))
    price = db.Column(db.String(20))
    original_price = db.Column(db.String(20))
    discount = db.Column(db.String(20))
    image_url = db.Column(db.String(500))
    category = db.Column(db.String(100))
    instructor = db.Column(db.String(100))
    slug = db.Column(db.String(200), unique=True, nullable=False)
    course_fees = db.Column(db.String(20))
    course_code = db.Column(db.String(50), unique=True)
    total_amount = db.Column(db.String(20))
    features = db.Column(db.JSON)  # Store as JSON array
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

class Payment(db.Model):
    __tablename__ = "payments"
    id = db.Column(db.Integer, primary_key=True)
    payment_id = db.Column(db.String(100), unique=True, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    student_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    mobile = db.Column(db.String(20), nullable=False)
    gstin = db.Column(db.String(50))
    billing_address = db.Column(db.Text)
    landmark = db.Column(db.Text)
    district = db.Column(db.String(100))
    state = db.Column(db.String(100))
    preferred_start_date = db.Column(db.Date)
    training_mode = db.Column(db.String(50))
    batch_preference = db.Column(db.String(20))  # 'weekdays' or 'weekend'
    payment_method = db.Column(db.String(50))  # 'neft', 'gpay', 'razorpay'
    payment_status = db.Column(db.String(50), default='pending')  # 'pending', 'completed', 'failed'
    amount = db.Column(db.Float)
    transaction_id = db.Column(db.String(200))
    payment_gateway_response = db.Column(db.JSON)
    payment_screenshot = db.Column(db.String(500))  # NEW FIELD
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    # Relationship
    course = db.relationship('Course', backref='payments')
# ----------- NEW MODEL FOR INTERNSHIP APPLICATIONS -----------


class Internship(db.Model):
    __tablename__ = "internship"
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    mobile = db.Column(db.String(20), nullable=False)
    internship = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text)
    cv_path = db.Column(db.Text)
    date = db.Column(db.DateTime, server_default=db.func.now())


class InternshipApplication(db.Model):
    __tablename__ = "internship_applications"
    id = db.Column(db.Integer, primary_key=True)
    enrollment_id = db.Column(db.String(100), unique=True, nullable=False)
    internship_id = db.Column(db.Integer, db.ForeignKey('internship_postings.id'), nullable=False)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    mobile = db.Column(db.String(20), nullable=False)
    experience_level = db.Column(db.String(50), default='Fresher')
    portfolio_url = db.Column(db.String(500))
    github_url = db.Column(db.String(500))
    motivation = db.Column(db.Text, nullable=False)
    resume_path = db.Column(db.Text)
    gstin = db.Column(db.String(50))
    billing_address = db.Column(db.Text)
    landmark = db.Column(db.String(100))
    district = db.Column(db.String(100))
    state = db.Column(db.String(100))
    preferred_start_date = db.Column(db.Date)
    preferred_time = db.Column(db.String(50), default='Full-Time')
    availability = db.Column(db.String(50), default='Immediate')
    payment_status = db.Column(db.String(50), default='pending')  # pending, approved, rejected
    validation_code = db.Column(db.String(10))
    date = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    # Relationship
    internship = db.relationship('InternshipPosting', backref='applications')


# Add this new ORM model
class InternshipPosting(db.Model):
    __tablename__ = "internship_postings"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    detailed_description = db.Column(db.Text)
    category = db.Column(db.String(100))
    duration = db.Column(db.String(50))
    internship_type = db.Column(db.String(50))  # remote, onsite, hybrid
    location = db.Column(db.String(200))
    skills = db.Column(db.JSON)  # Array of skills
    eligibility = db.Column(db.Text)
    perks = db.Column(db.JSON)  # Array of perks
    image_url = db.Column(db.String(500))
    internship_code = db.Column(db.String(50), unique=True)
    slug = db.Column(db.String(200), unique=True)
    is_active = db.Column(db.Boolean, default=True)
    total_applications = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())


# Update the ProjectEnrollment model to include payment_screenshot
# Add this field to the ProjectEnrollment class:
class ProjectEnrollment(db.Model):
    __tablename__ = 'project_enrollments'
    
    id = db.Column(db.Integer, primary_key=True)
    enrollment_id = db.Column(db.String(100), unique=True, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project_postings.id'), nullable=False)
    student_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    mobile = db.Column(db.String(20), nullable=False)
    gstin = db.Column(db.String(50))
    billing_address = db.Column(db.Text)
    landmark = db.Column(db.Text)
    district = db.Column(db.String(100))
    state = db.Column(db.String(100))
    preferred_start_date = db.Column(db.Date)
    preferred_time = db.Column(db.String(50))
    team_size = db.Column(db.String(20))
    payment_method = db.Column(db.String(50))
    payment_status = db.Column(db.String(50), default='pending')
    amount = db.Column(db.Float)
    transaction_id = db.Column(db.String(200))
    validation_code = db.Column(db.String(10))
    payment_screenshot = db.Column(db.String(500))  # NEW FIELD
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    project = db.relationship('ProjectPosting', backref='enrollments')


# Update the ProjectPosting model to include pricing fields
# Add these fields to the ProjectPosting class:
class ProjectPosting(db.Model):
    __tablename__ = 'project_postings'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    detailed_description = db.Column(db.Text)
    category = db.Column(db.String(100))
    duration = db.Column(db.String(50))
    project_type = db.Column(db.String(50))
    technologies = db.Column(JSON)
    difficulty_level = db.Column(db.String(50))
    prerequisites = db.Column(JSON)
    learning_outcomes = db.Column(JSON)
    image_url = db.Column(db.String(500))
    project_code = db.Column(db.String(50), unique=True)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    total_enrollments = db.Column(db.Integer, default=0)
    
    # NEW PRICING FIELDS
    price = db.Column(db.String(20))
    original_price = db.Column(db.String(20))
    course_fees = db.Column(db.String(20))
    total_amount = db.Column(db.String(20))
    discount = db.Column(db.String(20))
    level = db.Column(db.String(50))
    rating = db.Column(db.Float, default=4.5)
    students_count = db.Column(db.String(20), default="0")
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


@app.route("/pclinfo", methods=["POST"])
def save_pclinfo():
    data = parse_request_data()
    app.logger.debug("/pclinfo data: %s", data)
    
    attachment_path = None
    if "file" in request.files:
        attachment_path = save_uploaded_file(request.files["file"])

    # Send enhanced email notification with attachment
    handle_email_notification(data, attachment_path, use_enhanced=True)

    try:
        entry = PclInfo(
            fname=data.get("fname") or "",
            lname=data.get("lname") or "",
            email=data.get("email") or "",
            mobile=data.get("mobile") or "",
            message=data.get("message"),
        )
        db.session.add(entry)
        db.session.commit()
        app.logger.info(f"PclInfo saved with ID: {entry.id}")
        return jsonify({"success": True, "id": entry.id}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error("DB insert error /pclinfo: %s", e)
        return jsonify({"error": "Database insert failed"}), 500

# Update the create_project_enrollment endpoint to handle payment screenshot
@app.route("/api/project-enrollments", methods=["POST"])
def create_project_enrollment():
    try:
        app.logger.info("=== Starting Project Enrollment Submission ===")
        
        # Generate unique enrollment ID
        enrollment_id = f"PROJ_ENR_{str(uuid.uuid4())[:12].upper()}"
        
        # Get project slug from form data
        project_slug = request.form.get('project_slug')
        if not project_slug:
            return jsonify({'error': 'Project slug is required'}), 400
        
        # Get project
        project = ProjectPosting.query.filter_by(slug=project_slug).first()
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        # Validate validation code
        validation_code = request.form.get('validation_code', '').lower()
        if validation_code != 'm2nz':
            return jsonify({'error': 'Invalid validation code'}), 400
        
        # Handle payment screenshot upload
        payment_screenshot_path = None
        if 'payment_screenshot' in request.files:
            screenshot_file = request.files['payment_screenshot']
            app.logger.info(f"Screenshot file received: {screenshot_file.filename}")
            
            if screenshot_file and screenshot_file.filename:
                try:
                    # Validate file
                    if screenshot_file.content_length and screenshot_file.content_length > 5 * 1024 * 1024:
                        return jsonify({'error': 'Screenshot file size exceeds 5MB limit'}), 400
                    
                    allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
                    file_ext = os.path.splitext(screenshot_file.filename)[1].lower()
                    
                    if file_ext not in allowed_extensions:
                        return jsonify({'error': 'Invalid screenshot format. Please upload JPG, PNG, GIF, or WebP'}), 400
                    
                    payment_screenshot_path = save_payment_screenshot(screenshot_file)
                    app.logger.info(f"Payment screenshot saved: {payment_screenshot_path}")
                    
                except ValueError as e:
                    return jsonify({'error': str(e)}), 400
                except Exception as e:
                    app.logger.error(f"Error saving screenshot: {e}")
                    return jsonify({'error': 'Failed to upload screenshot'}), 500
        
        # Parse preferred start date
        preferred_start_date = None
        date_str = request.form.get('preferred_start_date')
        if date_str:
            try:
                preferred_start_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                pass
        
        # Create enrollment
        enrollment = ProjectEnrollment(
            enrollment_id=enrollment_id,
            project_id=project.id,
            student_name=request.form.get('name'),
            email=request.form.get('email'),
            mobile=request.form.get('mobile'),
            gstin=request.form.get('gstin'),
            billing_address=request.form.get('billing_address'),
            landmark=request.form.get('landmark'),
            district=request.form.get('district'),
            state=request.form.get('state'),
            preferred_start_date=preferred_start_date,
            preferred_time=request.form.get('preferred_time'),
            team_size=request.form.get('team_size'),
            payment_method=request.form.get('payment_method'),
            validation_code=validation_code,
            payment_screenshot=payment_screenshot_path  # Save screenshot path
        )
        
        db.session.add(enrollment)
        
        # Update project enrollment count
        project.total_enrollments = (project.total_enrollments or 0) + 1
        
        db.session.commit()
        
        # Send email notification
        email_data = {
            'fullName': request.form.get('name'),
            'email': request.form.get('email'),
            'mobile': request.form.get('mobile'),
            'project': project.title,
            'enrollment_id': enrollment_id,
            'team_size': request.form.get('team_size'),
            'start_date': request.form.get('preferred_start_date')
        }
        handle_email_notification(email_data)
        
        return jsonify({
            'success': True,
            'enrollment_id': enrollment_id,
            'project': project.title,
            'message': 'Enrollment submitted successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating project enrollment: {e}")
        import traceback
        app.logger.error(traceback.format_exc())
        return jsonify({'error': 'Failed to process enrollment request'}), 500


# Update the get_all_project_enrollments endpoint to include payment_screenshot
@app.route("/admin/project-enrollments", methods=["GET"])
@jwt_required()
def get_all_project_enrollments():
    try:
        enrollments = db.session.query(ProjectEnrollment, ProjectPosting).join(ProjectPosting).all()
        enrollments_list = []
        
        for enrollment, project in enrollments:
            # Build full screenshot URL
            screenshot_url = None
            if enrollment.payment_screenshot:
                screenshot_url = enrollment.payment_screenshot
                if not screenshot_url.startswith('http'):
                    screenshot_url = f"http://localhost:7000{screenshot_url}"
            
            enrollments_list.append({
                'id': enrollment.id,
                'enrollment_id': enrollment.enrollment_id,
                'student_name': enrollment.student_name,
                'email': enrollment.email,
                'mobile': enrollment.mobile,
                'project_title': project.title,
                'project_code': project.project_code,
                'team_size': enrollment.team_size,
                'preferred_time': enrollment.preferred_time,
                'preferred_start_date': enrollment.preferred_start_date.isoformat() if enrollment.preferred_start_date else None,
                'payment_method': enrollment.payment_method,
                'payment_status': enrollment.payment_status,
                'amount': enrollment.amount,
                'district': enrollment.district,
                'state': enrollment.state,
                'payment_screenshot': screenshot_url,  # NEW FIELD
                'created_at': enrollment.created_at.isoformat()
            })
        
        return jsonify({'success': True, 'enrollments': enrollments_list})
        
    except Exception as e:
        app.logger.error(f"Error fetching project enrollments: {e}")
        return jsonify({'error': 'Failed to fetch enrollments'}), 500


# Add endpoint to serve payment screenshots
@app.route("/uploads/payment_screenshots/<filename>")
def serve_payment_screenshot(filename):
    try:
        screenshots_dir = os.path.join(UPLOAD_FOLDER, 'payment_screenshots')
        if not os.path.exists(screenshots_dir):
            app.logger.error(f"Payment screenshots directory does not exist: {screenshots_dir}")
            return jsonify({'error': 'Screenshots directory not found'}), 404
        
        file_path = os.path.join(screenshots_dir, filename)
        if not os.path.exists(file_path):
            app.logger.error(f"Payment screenshot file not found: {file_path}")
            return jsonify({'error': 'Screenshot file not found'}), 404
        
        return send_from_directory(screenshots_dir, filename)
    except Exception as e:
        app.logger.error(f"Error serving payment screenshot {filename}: {e}")
        return jsonify({'error': 'Failed to serve screenshot'}), 500


@app.route("/admin/project-enrollments/<int:enrollment_id>/status", methods=["PUT"])
@jwt_required()
def update_project_enrollment_status(enrollment_id):
    data = parse_request_data()
    
    try:
        enrollment = ProjectEnrollment.query.get(enrollment_id)
        if not enrollment:
            return jsonify({'error': 'Enrollment not found'}), 404
        
        enrollment.payment_status = data.get('status', 'pending')
        enrollment.transaction_id = data.get('transaction_id')
        enrollment.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Enrollment status updated'})
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating enrollment status: {e}")
        return jsonify({'error': 'Failed to update enrollment status'}), 500



# Also ensure the get_project_by_slug returns pricing fields
@app.route("/api/projects/<slug>", methods=["GET"])
def get_project_by_slug(slug):
    try:
        project = ProjectPosting.query.filter_by(slug=slug, is_active=True).first()
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        image_url = project.image_url
        if image_url and not image_url.startswith('http'):
            image_url = f"http://localhost:7000{image_url}"
        
        project_data = {
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'detailed_description': project.detailed_description,
            'category': project.category,
            'duration': project.duration,
            'project_type': project.project_type,
            'difficulty_level': project.difficulty_level,
            'technologies': project.technologies or [],
            'prerequisites': project.prerequisites or [],
            'learning_outcomes': project.learning_outcomes or [],
            'image_url': image_url,
            'slug': project.slug,
            'project_code': project.project_code,
            'total_enrollments': project.total_enrollments,
            # Pricing fields
            'price': project.price,
            'original_price': project.original_price,
            'course_fees': project.course_fees,
            'total_amount': project.total_amount,
            'discount': project.discount,
            'level': project.level,
            'rating': project.rating,
            'students_count': project.students_count
        }
        return jsonify({'success': True, 'project': project_data})
    except Exception as e:
        app.logger.error(f"Error fetching project: {e}")
        return jsonify({'error': 'Failed to fetch project'}), 500
    
    
# --------------- create tables ---------------------
with app.app_context():
    try:
        db.create_all()
        app.logger.info("Database tables created / verified")
        
        # Create default admin if not exists
        admin = Admin.query.filter_by(username='admin').first()
        if not admin:
            admin = Admin(
                username='admin',
                email='admin@pclinfo.com',
                password_hash=generate_password_hash('admin123')  # Change this!
            )
            db.session.add(admin)
            db.session.commit()
            app.logger.info("Default admin created")
    except Exception as e:
        app.logger.error("Error creating tables: %s", e)

# --------------- helper functions --------------
def parse_request_data():
    if request.is_json:
        return request.get_json() or {}
    return request.form.to_dict(flat=True)

def save_uploaded_file(file_obj, dest_folder=UPLOAD_FOLDER):
    if not file_obj or file_obj.filename == "":
        return None
    filename = secure_filename(file_obj.filename)
    ts = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    safe_name = f"{ts}_{filename}"
    path = os.path.join(dest_folder, safe_name)
    file_obj.save(path)
    return path

def handle_email_notification(data, attachment_path=None, use_enhanced=False):
    try:
        if use_enhanced:
            success = send_email_notification(data, attachment_path)
        else:
            success = send_email_notify(data)
        return success
    except Exception as e:
        app.logger.error(f"Email notification error: {e}")
        return False

# --------------- AUTH ENDPOINTS -----------------
@app.route("/admin/login", methods=["POST"])
def admin_login():
    data = parse_request_data()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    admin = Admin.query.filter_by(username=username, is_active=True).first()
    
    if admin and check_password_hash(admin.password_hash, password):
        access_token = create_access_token(identity=str(admin.id))
        return jsonify({
            'success': True,
            'access_token': access_token,
            'admin': {
                'id': admin.id,
                'username': admin.username,
                'email': admin.email
            }
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

# --------------- COURSE MANAGEMENT ENDPOINTS -----------------
@app.route("/admin/courses", methods=["GET"])
@jwt_required()
def get_all_courses_admin():
    try:
        courses = Course.query.all()
        courses_list = []
        for course in courses:
            courses_list.append({
                'id': course.id,
                'title': course.title,
                'description': course.description,
                'detailed_description': course.detailed_description,
                'level': course.level,
                'rating': course.rating,
                'students': course.students,
                'duration': course.duration,
                'price': course.price,
                'original_price': course.original_price,
                'discount': course.discount,
                'image_url': course.image_url,
                'category': course.category,
                'instructor': course.instructor,
                'slug': course.slug,
                'course_fees': course.course_fees,
                'course_code': course.course_code,
                'total_amount': course.total_amount,
                'features': course.features,
                'is_active': course.is_active,
                'created_at': course.created_at.isoformat(),
                'updated_at': course.updated_at.isoformat()
            })
        return jsonify({'success': True, 'courses': courses_list})
    except Exception as e:
        app.logger.error(f"Error fetching courses: {e}")
        return jsonify({'error': 'Failed to fetch courses'}), 500

# Add this to your backend/connection.py - Replace the upload file serving section

# Add CORS headers for uploaded files
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Fix the uploaded file serving endpoint
@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        app.logger.error(f"Error serving file {filename}: {e}")
        return jsonify({'error': 'File not found'}), 404

# Updated create_course endpoint with better error handling
@app.route("/admin/courses", methods=["POST"])
@jwt_required()
def create_course():
    try:
        app.logger.info("Creating new course...")
        
        # Handle file upload
        image_url = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename:
                try:
                    image_url = save_course_image(file)
                    app.logger.info(f"Image saved: {image_url}")
                except ValueError as e:
                    return jsonify({'error': str(e)}), 400
        
        # Get form data
        data = request.form.to_dict()
        app.logger.info(f"Form data received: {list(data.keys())}")
        
        # Parse JSON fields - handle both string and array formats
        features = []
        if 'features' in data:
            features_data = data['features']
            if isinstance(features_data, str):
                try:
                    features = json.loads(features_data)
                except json.JSONDecodeError:
                    # If it's not JSON, split by newline or comma
                    features = [f.strip() for f in features_data.replace('\n', ',').split(',') if f.strip()]
            elif isinstance(features_data, list):
                features = features_data
        
        # Generate unique slug
        base_slug = data.get('title', '').lower().replace(' ', '-')
        slug = base_slug
        counter = 1
        while Course.query.filter_by(slug=slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        # Generate course code if not provided
        course_code = data.get('course_code')
        if not course_code:
            course_code = f"PCL-{str(uuid.uuid4())[:8].upper()}"
        
        # Use uploaded image URL or provided URL
        final_image_url = image_url or data.get('image_url', '')
        
        # Create course with validation
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400
        
        course = Course(
            title=data.get('title'),
            description=data.get('description', ''),
            detailed_description=data.get('detailed_description', ''),
            level=data.get('level', 'Beginner'),
            rating=float(data.get('rating', 4.5)),
            students=data.get('students', '0'),
            duration=data.get('duration', ''),
            price=data.get('price', '0'),
            original_price=data.get('original_price', '0'),
            discount=data.get('discount', ''),
            image_url=final_image_url,
            category=data.get('category', ''),
            instructor=data.get('instructor', ''),
            slug=slug,
            course_fees=data.get('course_fees', '0'),
            course_code=course_code,
            total_amount=data.get('total_amount', '0'),
            features=features
        )
        
        db.session.add(course)
        db.session.commit()
        
        app.logger.info(f"Course created successfully: {course.id}")
        
        return jsonify({
            'success': True, 
            'course_id': course.id, 
            'slug': course.slug,
            'image_url': final_image_url,
            'message': 'Course created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating course: {e}")
        import traceback
        app.logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

# Updated update_course endpoint
@app.route("/admin/courses/<int:course_id>", methods=["PUT"])
@jwt_required()
def update_course(course_id):
    try:
        course = Course.query.get(course_id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        
        app.logger.info(f"Updating course {course_id}...")
        
        # Handle file upload
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename:
                try:
                    image_url = save_course_image(file)
                    course.image_url = image_url
                    app.logger.info(f"New image uploaded: {image_url}")
                except ValueError as e:
                    return jsonify({'error': str(e)}), 400
        
        # Get form data
        data = request.form.to_dict()
        
        # Parse JSON fields
        if 'features' in data:
            features_data = data['features']
            if isinstance(features_data, str):
                try:
                    course.features = json.loads(features_data)
                except json.JSONDecodeError:
                    course.features = [f.strip() for f in features_data.replace('\n', ',').split(',') if f.strip()]
            elif isinstance(features_data, list):
                course.features = features_data
        
        # Update other fields
        update_fields = ['title', 'description', 'detailed_description', 'level', 
                        'students', 'duration', 'price', 'original_price', 'discount',
                        'category', 'instructor', 'course_fees', 'total_amount']
        
        for field in update_fields:
            if field in data:
                setattr(course, field, data[field])
        
        if 'rating' in data:
            course.rating = float(data['rating'])
        
        # Only update image_url from form if no new file was uploaded
        if 'image' not in request.files and 'image_url' in data:
            course.image_url = data['image_url']
        
        course.updated_at = datetime.utcnow()
        db.session.commit()
        
        app.logger.info(f"Course {course_id} updated successfully")
        
        return jsonify({
            'success': True, 
            'message': 'Course updated successfully',
            'image_url': course.image_url
        })
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating course: {e}")
        import traceback
        app.logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

# Enhanced get_public_courses with full image URL
@app.route("/api/courses", methods=["GET"])
def get_public_courses():
    try:
        courses = Course.query.filter_by(is_active=True).all()
        courses_list = []
        for course in courses:
            # Build full image URL
            image_url = course.image_url
            if image_url and not image_url.startswith('http'):
                # Convert relative path to full URL
                image_url = f"http://localhost:7000{image_url}"
            
            courses_list.append({
                'id': course.id,
                'title': course.title,
                'description': course.description,
                'detailed_description': course.detailed_description,
                'level': course.level,
                'rating': course.rating,
                'students': course.students,
                'duration': course.duration,
                'price': course.price,
                'original_price': course.original_price,
                'discount': course.discount,
                'image_url': image_url,
                'category': course.category,
                'instructor': course.instructor,
                'slug': course.slug,
                'course_fees': course.course_fees,
                'course_code': course.course_code,
                'total_amount': course.total_amount,
                'features': course.features or []
            })
        return jsonify({'success': True, 'courses': courses_list})
    except Exception as e:
        app.logger.error(f"Error fetching public courses: {e}")
        return jsonify({'error': 'Failed to fetch courses'}), 500

# Enhanced get_course_by_slug with full image URL
@app.route("/api/courses/<slug>", methods=["GET"])
def get_course_by_slug(slug):
    try:
        course = Course.query.filter_by(slug=slug, is_active=True).first()
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        
        # Build full image URL
        image_url = course.image_url
        if image_url and not image_url.startswith('http'):
            image_url = f"http://localhost:7000{image_url}"
        
        course_data = {
            'id': course.id,
            'title': course.title,
            'description': course.description,
            'detailed_description': course.detailed_description,
            'level': course.level,
            'rating': course.rating,
            'students': course.students,
            'duration': course.duration,
            'price': course.price,
            'original_price': course.original_price,
            'discount': course.discount,
            'image_url': image_url,
            'category': course.category,
            'instructor': course.instructor,
            'slug': course.slug,
            'course_fees': course.course_fees,
            'course_code': course.course_code,
            'total_amount': course.total_amount,
            'features': course.features or []
        }
        return jsonify({'success': True, 'course': course_data})
    except Exception as e:
        app.logger.error(f"Error fetching course: {e}")
        return jsonify({'error': 'Failed to fetch course'}), 500
    
@app.route("/admin/courses/<int:course_id>", methods=["DELETE"])
@jwt_required()
def delete_course(course_id):
    try:
        course = Course.query.get(course_id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        
        course.is_active = False  # Soft delete
        course.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Course deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting course: {e}")
        return jsonify({'error': 'Failed to delete course'}), 500

# --------------- PAYMENT ENDPOINTS -----------------
@app.route("/api/payments", methods=["POST"])
def create_payment():
    data = parse_request_data()
    
    try:
        # Generate unique payment ID
        payment_id = f"PAY_{str(uuid.uuid4())[:12].upper()}"
        
        # Get course
        course = Course.query.filter_by(slug=data.get('course_slug')).first()
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        
        payment = Payment(
            payment_id=payment_id,
            course_id=course.id,
            student_name=data.get('name'),
            email=data.get('email'),
            mobile=data.get('mobile'),
            gstin=data.get('gstin'),
            billing_address=data.get('billing_address'),
            landmark=data.get('landmark'),
            district=data.get('district'),
            state=data.get('state'),
            preferred_start_date=datetime.strptime(data.get('start_date'), '%Y-%m-%d').date() if data.get('start_date') else None,
            training_mode=data.get('training_mode'),
            batch_preference=data.get('batch_preference'),
            payment_method=data.get('payment_method'),
            amount=float(course.total_amount)
        )
        
        db.session.add(payment)
        db.session.commit()
        
        # Send email notification
        email_data = {
            'fullName': data.get('name'),
            'email': data.get('email'),
            'mobile': data.get('mobile'),
            'course': course.title,
            'amount': course.total_amount,
            'payment_id': payment_id
        }
        handle_email_notification(email_data)
        
        return jsonify({
            'success': True, 
            'payment_id': payment_id,
            'course': course.title,
            'amount': course.total_amount
        }), 201
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating payment: {e}")
        return jsonify({'error': 'Failed to process payment request'}), 500

@app.route("/admin/payments", methods=["GET"])
@jwt_required()
def get_all_payments():
    try:
        payments = db.session.query(Payment, Course).join(Course).all()
        payments_list = []
        
        for payment, course in payments:
            payments_list.append({
                'id': payment.id,
                'payment_id': payment.payment_id,
                'student_name': payment.student_name,
                'email': payment.email,
                'mobile': payment.mobile,
                'course_title': course.title,
                'course_code': course.course_code,
                'payment_method': payment.payment_method,
                'payment_status': payment.payment_status,
                'amount': payment.amount,
                'training_mode': payment.training_mode,
                'preferred_start_date': payment.preferred_start_date.isoformat() if payment.preferred_start_date else None,
                'created_at': payment.created_at.isoformat()
            })
        
        return jsonify({'success': True, 'payments': payments_list})
        
    except Exception as e:
        app.logger.error(f"Error fetching payments: {e}")
        return jsonify({'error': 'Failed to fetch payments'}), 500

@app.route("/admin/payments/<int:payment_id>/status", methods=["PUT"])
@jwt_required()
def update_payment_status(payment_id):
    data = parse_request_data()
    
    try:
        payment = Payment.query.get(payment_id)
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404
        
        payment.payment_status = data.get('status', 'pending')
        payment.transaction_id = data.get('transaction_id')
        payment.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Payment status updated'})
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating payment status: {e}")
        return jsonify({'error': 'Failed to update payment status'}), 500

# --------------- Keep existing endpoints ---------------------
# (Your existing enroll, demo, inquire, pclinfo, internship endpoints remain unchanged)

@app.route("/enroll", methods=["POST"])
def enroll_course():
    data = parse_request_data()
    app.logger.debug("/enroll data: %s", data)
    handle_email_notification(data, use_enhanced=False)
    
    try:
        entry = CourseEnrollment(
            full_name=data.get("fullName") or data.get("full_name") or "",
            email=data.get("email") or "",
            mobile=data.get("mobile") or "",
            type=data.get("type") or "",
            message=data.get("message"),
        )
        db.session.add(entry)
        db.session.commit()
        app.logger.info(f"Course enrollment saved with ID: {entry.id}")
        return jsonify({"success": True, "enrollment_id": entry.id}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error("DB insert error /enroll: %s", e)
        return jsonify({"error": "Database insert failed"}), 500


@app.route("/admin/internships", methods=["GET"])
@jwt_required()
def get_all_internships_admin():
    try:
        internships = InternshipPosting.query.all()
        internships_list = []
        for internship in internships:
            internships_list.append({
                'id': internship.id,
                'title': internship.title,
                'description': internship.description,
                'detailed_description': internship.detailed_description,
                'category': internship.category,
                'duration': internship.duration,
                'internship_type': internship.internship_type,
                'location': internship.location,
                'skills': internship.skills,
                'eligibility': internship.eligibility,
                'perks': internship.perks,
                'image_url': internship.image_url,
                'internship_code': internship.internship_code,
                'slug': internship.slug,
                'is_active': internship.is_active,
                'total_applications': internship.total_applications,
                'created_at': internship.created_at.isoformat(),
                'updated_at': internship.updated_at.isoformat()
            })
        return jsonify({'success': True, 'internships': internships_list})
    except Exception as e:
        app.logger.error(f"Error fetching internships: {e}")
        return jsonify({'error': 'Failed to fetch internships'}), 500


@app.route("/admin/internships", methods=["POST"])
@jwt_required()
def create_internship():
    try:
        app.logger.info("Creating new internship...")
        
        # Handle file upload
        image_url = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename:
                try:
                    image_url = save_internship_image(file)
                    app.logger.info(f"Image saved: {image_url}")
                except ValueError as e:
                    return jsonify({'error': str(e)}), 400
        
        # Get form data
        data = request.form.to_dict()
        
        # Parse JSON fields
        skills = []
        if 'skills' in data:
            skills_data = data['skills']
            if isinstance(skills_data, str):
                try:
                    skills = json.loads(skills_data)
                except json.JSONDecodeError:
                    skills = [s.strip() for s in skills_data.replace('\n', ',').split(',') if s.strip()]
            elif isinstance(skills_data, list):
                skills = skills_data
        
        perks = []
        if 'perks' in data:
            perks_data = data['perks']
            if isinstance(perks_data, str):
                try:
                    perks = json.loads(perks_data)
                except json.JSONDecodeError:
                    perks = [p.strip() for p in perks_data.replace('\n', ',').split(',') if p.strip()]
            elif isinstance(perks_data, list):
                perks = perks_data
        
        # Generate unique slug and code
        base_slug = data.get('title', '').lower().replace(' ', '-')
        slug = base_slug
        counter = 1
        while InternshipPosting.query.filter_by(slug=slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        internship_code = data.get('internship_code')
        if not internship_code:
            internship_code = f"INT-{str(uuid.uuid4())[:8].upper()}"
        
        final_image_url = image_url or data.get('image_url', '')
        
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400
        
        internship = InternshipPosting(
            title=data.get('title'),
            description=data.get('description', ''),
            detailed_description=data.get('detailed_description', ''),
            category=data.get('category', ''),
            duration=data.get('duration', '3 Months'),
            internship_type=data.get('internship_type', 'remote'),
            location=data.get('location', ''),
            skills=skills,
            eligibility=data.get('eligibility', ''),
            perks=perks,
            image_url=final_image_url,
            internship_code=internship_code,
            slug=slug,
            is_active=data.get('is_active', 'true').lower() == 'true'
        )
        
        db.session.add(internship)
        db.session.commit()
        
        app.logger.info(f"Internship created successfully: {internship.id}")
        
        return jsonify({
            'success': True,
            'internship_id': internship.id,
            'slug': internship.slug,
            'image_url': final_image_url,
            'message': 'Internship created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating internship: {e}")
        import traceback
        app.logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500


@app.route("/admin/internships/<int:internship_id>", methods=["PUT"])
@jwt_required()
def update_internship(internship_id):
    try:
        internship = InternshipPosting.query.get(internship_id)
        if not internship:
            return jsonify({'error': 'Internship not found'}), 404
        
        app.logger.info(f"Updating internship {internship_id}...")
        
        # Handle file upload
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename:
                try:
                    image_url = save_internship_image(file)
                    internship.image_url = image_url
                    app.logger.info(f"New image uploaded: {image_url}")
                except ValueError as e:
                    return jsonify({'error': str(e)}), 400
        
        data = request.form.to_dict()
        
        # Parse JSON fields
        if 'skills' in data:
            skills_data = data['skills']
            if isinstance(skills_data, str):
                try:
                    internship.skills = json.loads(skills_data)
                except json.JSONDecodeError:
                    internship.skills = [s.strip() for s in skills_data.replace('\n', ',').split(',') if s.strip()]
            elif isinstance(skills_data, list):
                internship.skills = skills_data
        
        if 'perks' in data:
            perks_data = data['perks']
            if isinstance(perks_data, str):
                try:
                    internship.perks = json.loads(perks_data)
                except json.JSONDecodeError:
                    internship.perks = [p.strip() for p in perks_data.replace('\n', ',').split(',') if p.strip()]
            elif isinstance(perks_data, list):
                internship.perks = perks_data
        
        # Update other fields
        update_fields = ['title', 'description', 'detailed_description', 'category',
                        'duration', 'internship_type', 'location', 'eligibility']
        
        for field in update_fields:
            if field in data:
                setattr(internship, field, data[field])
        
        if 'is_active' in data:
            internship.is_active = data['is_active'].lower() == 'true'
        
        if 'image' not in request.files and 'image_url' in data:
            internship.image_url = data['image_url']
        
        internship.updated_at = datetime.utcnow()
        db.session.commit()
        
        app.logger.info(f"Internship {internship_id} updated successfully")
        
        return jsonify({
            'success': True,
            'message': 'Internship updated successfully',
            'image_url': internship.image_url
        })
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating internship: {e}")
        import traceback
        app.logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500


@app.route("/admin/internships/<int:internship_id>", methods=["DELETE"])
@jwt_required()
def delete_internship(internship_id):
    try:
        internship = InternshipPosting.query.get(internship_id)
        if not internship:
            return jsonify({'error': 'Internship not found'}), 404
        
        internship.is_active = False  # Soft delete
        internship.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Internship deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting internship: {e}")
        return jsonify({'error': 'Failed to delete internship'}), 500


# Public endpoints for listing internships
@app.route("/api/internships", methods=["GET"])
def get_public_internships():
    try:
        internships = InternshipPosting.query.filter_by(is_active=True).all()
        internships_list = []
        for internship in internships:
            image_url = internship.image_url
            if image_url and not image_url.startswith('http'):
                image_url = f"http://localhost:7000{image_url}"
            
            internships_list.append({
                'id': internship.id,
                'title': internship.title,
                'description': internship.description,
                'category': internship.category,
                'duration': internship.duration,
                'internship_type': internship.internship_type,
                'location': internship.location,
                'image_url': image_url,
                'slug': internship.slug,
                'internship_code': internship.internship_code
            })
        return jsonify({'success': True, 'internships': internships_list})
    except Exception as e:
        app.logger.error(f"Error fetching public internships: {e}")
        return jsonify({'error': 'Failed to fetch internships'}), 500


@app.route("/api/internships/<slug>", methods=["GET"])
def get_internship_by_slug(slug):
    try:
        internship = InternshipPosting.query.filter_by(slug=slug, is_active=True).first()
        if not internship:
            return jsonify({'error': 'Internship not found'}), 404
        
        image_url = internship.image_url
        if image_url and not image_url.startswith('http'):
            image_url = f"http://localhost:7000{image_url}"
        
        internship_data = {
            'id': internship.id,
            'title': internship.title,
            'description': internship.description,
            'detailed_description': internship.detailed_description,
            'category': internship.category,
            'duration': internship.duration,
            'internship_type': internship.internship_type,
            'location': internship.location,
            'skills': internship.skills or [],
            'eligibility': internship.eligibility,
            'perks': internship.perks or [],
            'image_url': image_url,
            'slug': internship.slug,
            'internship_code': internship.internship_code
        }
        return jsonify({'success': True, 'internship': internship_data})
    except Exception as e:
        app.logger.error(f"Error fetching internship: {e}")
        return jsonify({'error': 'Failed to fetch internship'}), 500



# ----------- INTERNSHIP APPLICATION ENDPOINTS -----------

@app.route("/api/internship-applications", methods=["POST"])
def create_internship_application():
    try:
        app.logger.info("=== Starting Internship Application Submission ===")
        
        # Log received form data
        app.logger.info(f"Form data keys: {list(request.form.keys())}")
        app.logger.info(f"Files: {list(request.files.keys())}")
        
        # Generate unique enrollment ID
        enrollment_id = f"INT_APP_{str(uuid.uuid4())[:12].upper()}"
        app.logger.info(f"Generated enrollment ID: {enrollment_id}")
        
        # Get internship by slug
        internship_slug = request.form.get('internship_slug')
        app.logger.info(f"Looking for internship with slug: {internship_slug}")
        
        if not internship_slug:
            app.logger.error("Missing internship_slug")
            return jsonify({'error': 'Internship slug is required'}), 400
        
        internship = InternshipPosting.query.filter_by(slug=internship_slug).first()
        
        if not internship:
            app.logger.error(f"Internship not found for slug: {internship_slug}")
            return jsonify({'error': 'Internship not found'}), 404
        
        app.logger.info(f"Found internship: {internship.title}")
        
        # Validate validation code
        validation_code = request.form.get('validation_code', '').strip().lower()
        app.logger.info(f"Validation code received: {validation_code}")
        
        if validation_code != 'm2nz':
            app.logger.error(f"Invalid validation code: {validation_code}")
            return jsonify({'error': 'Invalid validation code'}), 400
        
        # Validate required fields
        required_fields = ['fname', 'lname', 'email', 'mobile', 'motivation']
        missing_fields = [field for field in required_fields if not request.form.get(field)]
        
        if missing_fields:
            app.logger.error(f"Missing required fields: {missing_fields}")
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
        
        # Handle resume upload
        resume_path = None
        if 'resume' in request.files:
            resume_file = request.files['resume']
            app.logger.info(f"Resume file received: {resume_file.filename}")
            
            if resume_file and resume_file.filename:
                try:
                    # Create resumes directory if it doesn't exist
                    resumes_dir = os.path.join(UPLOAD_FOLDER, 'resumes')
                    os.makedirs(resumes_dir, exist_ok=True)
                    app.logger.info(f"Resumes directory: {resumes_dir}")
                    
                    # Validate file
                    if resume_file.content_length and resume_file.content_length > 5 * 1024 * 1024:
                        return jsonify({'error': 'Resume file size exceeds 5MB limit'}), 400
                    
                    allowed_extensions = {'.pdf', '.doc', '.docx'}
                    file_ext = os.path.splitext(resume_file.filename)[1].lower()
                    
                    if file_ext not in allowed_extensions:
                        return jsonify({'error': 'Invalid resume format. Please upload PDF, DOC, or DOCX'}), 400
                    
                    # Save file
                    filename = secure_filename(resume_file.filename)
                    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
                    unique_filename = f"{timestamp}_{filename}"
                    full_path = os.path.join(resumes_dir, unique_filename)
                    
                    resume_file.save(full_path)
                    resume_path = f"/uploads/resumes/{unique_filename}"
                    app.logger.info(f"Resume saved successfully: {resume_path}")
                    
                except Exception as e:
                    app.logger.error(f"Error saving resume: {e}")
                    import traceback
                    app.logger.error(traceback.format_exc())
                    return jsonify({'error': f'Failed to upload resume: {str(e)}'}), 500
        else:
            app.logger.warning("No resume file in request")
            return jsonify({'error': 'Resume is required'}), 400
        
        # Parse preferred start date
        preferred_start_date = None
        date_str = request.form.get('preferred_start_date')
        if date_str:
            try:
                preferred_start_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                app.logger.info(f"Parsed start date: {preferred_start_date}")
            except ValueError as e:
                app.logger.warning(f"Invalid date format: {date_str} - {e}")
                # Continue without date rather than failing
        
        # Create application record
        app.logger.info("Creating InternshipApplication record...")
        
        application = InternshipApplication(
            enrollment_id=enrollment_id,
            internship_id=internship.id,
            fname=request.form.get('fname').strip(),
            lname=request.form.get('lname').strip(),
            email=request.form.get('email').strip(),
            mobile=request.form.get('mobile').strip(),
            experience_level=request.form.get('experience_level', 'Fresher'),
            portfolio_url=request.form.get('portfolio_url', '').strip() or None,
            github_url=request.form.get('github_url', '').strip() or None,
            motivation=request.form.get('motivation').strip(),
            resume_path=resume_path,
            gstin=request.form.get('gstin', '').strip() or None,
            billing_address=request.form.get('billing_address', '').strip() or None,
            landmark=request.form.get('landmark', '').strip() or None,
            district=request.form.get('district', '').strip() or None,
            state=request.form.get('state', '').strip() or None,
            preferred_start_date=preferred_start_date,
            preferred_time=request.form.get('preferred_time', 'Full-Time'),
            availability=request.form.get('availability', 'Immediate'),
            payment_status='pending',
            validation_code=validation_code
        )
        
        db.session.add(application)
        app.logger.info("Application added to session")
        
        # Update internship total applications
        internship.total_applications = (internship.total_applications or 0) + 1
        app.logger.info(f"Updated total applications: {internship.total_applications}")
        
        # Commit to database
        db.session.commit()
        app.logger.info("Database commit successful")
        
        # Send email notification
        try:
            email_data = {
                'fullName': f"{request.form.get('fname')} {request.form.get('lname')}",
                'email': request.form.get('email'),
                'mobile': request.form.get('mobile'),
                'internship': internship.title,
                'enrollment_id': enrollment_id,
                'experience_level': request.form.get('experience_level', 'Fresher')
            }
            handle_email_notification(email_data)
            app.logger.info("Email notification sent")
        except Exception as email_error:
            # Log but don't fail the request if email fails
            app.logger.error(f"Email notification failed: {email_error}")
        
        app.logger.info("=== Application submitted successfully ===")
        
        return jsonify({
            'success': True,
            'enrollment_id': enrollment_id,
            'internship': internship.title,
            'message': 'Application submitted successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"=== ERROR in create_internship_application ===")
        app.logger.error(f"Error: {str(e)}")
        import traceback
        app.logger.error(traceback.format_exc())
        return jsonify({
            'error': 'Failed to submit application. Please try again.',
            'details': str(e) if app.debug else None
        }), 500


# Keep only THIS ONE (remove the other)
@app.route("/uploads/resumes/<filename>")
def serve_resume(filename):
    try:
        resumes_dir = os.path.join(UPLOAD_FOLDER, 'resumes')
        if not os.path.exists(resumes_dir):
            app.logger.error(f"Resumes directory does not exist: {resumes_dir}")
            return jsonify({'error': 'Resumes directory not found'}), 404
        
        file_path = os.path.join(resumes_dir, filename)
        if not os.path.exists(file_path):
            app.logger.error(f"Resume file not found: {file_path}")
            return jsonify({'error': 'Resume file not found'}), 404
        
        return send_from_directory(resumes_dir, filename)
    except Exception as e:
        app.logger.error(f"Error serving resume {filename}: {e}")
        return jsonify({'error': 'Failed to serve resume'}), 500

@app.route("/admin/internship-applications", methods=["GET"])
@jwt_required()
def get_all_internship_applications():
    try:
        # Join applications with internships to get full details
        applications = db.session.query(
            InternshipApplication, 
            InternshipPosting
        ).join(InternshipPosting).all()
        
        applications_list = []
        
        for application, internship in applications:
            applications_list.append({
                'id': application.id,
                'enrollment_id': application.enrollment_id,
                'fname': application.fname,
                'lname': application.lname,
                'email': application.email,
                'mobile': application.mobile,
                'internship_title': internship.title,
                'internship_slug': internship.slug,
                'internship_code': internship.internship_code,
                'experience_level': application.experience_level,
                'portfolio_url': application.portfolio_url,
                'github_url': application.github_url,
                'motivation': application.motivation,
                'resume_path': application.resume_path,
                'gstin': application.gstin,
                'billing_address': application.billing_address,
                'district': application.district,
                'state': application.state,
                'preferred_start_date': application.preferred_start_date.isoformat() if application.preferred_start_date else None,
                'preferred_time': application.preferred_time,
                'availability': application.availability,
                'payment_status': application.payment_status,
                'date': application.date.isoformat(),
                'updated_at': application.updated_at.isoformat()
            })
        
        return jsonify({'success': True, 'applications': applications_list})
        
    except Exception as e:
        app.logger.error(f"Error fetching internship applications: {e}")
        return jsonify({'error': 'Failed to fetch applications'}), 500


@app.route("/admin/internship-applications/<int:application_id>/status", methods=["PUT"])
@jwt_required()
def update_internship_application_status(application_id):
    data = parse_request_data()
    
    try:
        application = InternshipApplication.query.get(application_id)
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        application.payment_status = data.get('status', 'pending')
        application.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'message': 'Application status updated'
        })
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating application status: {e}")
        return jsonify({'error': 'Failed to update application status'}), 500


@app.route("/admin/internship-applications/<int:application_id>", methods=["DELETE"])
@jwt_required()
def delete_internship_application(application_id):
    try:
        application = InternshipApplication.query.get(application_id)
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Delete resume file if exists
        if application.resume_path and os.path.exists(application.resume_path):
            try:
                os.remove(application.resume_path)
            except Exception as e:
                app.logger.warning(f"Failed to delete resume file: {e}")
        
        db.session.delete(application)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Application deleted'})
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting application: {e}")
        return jsonify({'error': 'Failed to delete application'}), 500

    
# ----------- projects APPLICATION ENDPOINTS -----------

@app.route("/admin/projects", methods=["GET"])
@jwt_required()
def get_all_projects_admin():
    try:
        projects = ProjectPosting.query.all()
        projects_list = []
        for project in projects:
            projects_list.append({
                'id': project.id,
                'title': project.title,
                'description': project.description,
                'detailed_description': project.detailed_description,
                'category': project.category,
                'duration': project.duration,
                'project_type': project.project_type,
                'technologies': project.technologies,
                'difficulty_level': project.difficulty_level,
                'prerequisites': project.prerequisites,
                'learning_outcomes': project.learning_outcomes,
                'image_url': project.image_url,
                'project_code': project.project_code,
                'slug': project.slug,
                'is_active': project.is_active,
                'total_enrollments': project.total_enrollments,
                'created_at': project.created_at.isoformat(),
                'updated_at': project.updated_at.isoformat()
            })
        return jsonify({'success': True, 'projects': projects_list})
    except Exception as e:
        app.logger.error(f"Error fetching projects: {e}")
        return jsonify({'error': 'Failed to fetch projects'}), 500



# Update create_project endpoint to handle pricing fields
@app.route("/admin/projects", methods=["POST"])
@jwt_required()
def create_project():
    try:
        app.logger.info("Creating new project...")
        
        # Handle file upload
        image_url = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename:
                try:
                    image_url = save_project_image(file)
                    app.logger.info(f"Image saved: {image_url}")
                except ValueError as e:
                    return jsonify({'error': str(e)}), 400
        
        # Get form data
        data = request.form.to_dict()
        
        # Parse JSON fields
        technologies = []
        if 'technologies' in data:
            tech_data = data['technologies']
            if isinstance(tech_data, str):
                try:
                    technologies = json.loads(tech_data)
                except json.JSONDecodeError:
                    technologies = [t.strip() for t in tech_data.replace('\n', ',').split(',') if t.strip()]
            elif isinstance(tech_data, list):
                technologies = tech_data
        
        prerequisites = []
        if 'prerequisites' in data:
            prereq_data = data['prerequisites']
            if isinstance(prereq_data, str):
                try:
                    prerequisites = json.loads(prereq_data)
                except json.JSONDecodeError:
                    prerequisites = [p.strip() for p in prereq_data.replace('\n', ',').split(',') if p.strip()]
            elif isinstance(prereq_data, list):
                prerequisites = prereq_data
        
        learning_outcomes = []
        if 'learning_outcomes' in data:
            outcomes_data = data['learning_outcomes']
            if isinstance(outcomes_data, str):
                try:
                    learning_outcomes = json.loads(outcomes_data)
                except json.JSONDecodeError:
                    learning_outcomes = [o.strip() for o in outcomes_data.replace('\n', ',').split(',') if o.strip()]
            elif isinstance(outcomes_data, list):
                learning_outcomes = outcomes_data
        
        # Generate unique slug and code
        base_slug = data.get('title', '').lower().replace(' ', '-')
        slug = base_slug
        counter = 1
        while ProjectPosting.query.filter_by(slug=slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        project_code = data.get('project_code')
        if not project_code:
            project_code = f"PROJ-{str(uuid.uuid4())[:8].upper()}"
        
        final_image_url = image_url or data.get('image_url', '')
        
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400
        
        # Create project with pricing fields
        project = ProjectPosting(
            title=data.get('title'),
            description=data.get('description', ''),
            detailed_description=data.get('detailed_description', ''),
            category=data.get('category', ''),
            duration=data.get('duration', '4 Weeks'),
            project_type=data.get('project_type', 'individual'),
            technologies=technologies,
            difficulty_level=data.get('difficulty_level', 'Intermediate'),
            prerequisites=prerequisites,
            learning_outcomes=learning_outcomes,
            image_url=final_image_url,
            project_code=project_code,
            slug=slug,
            is_active=data.get('is_active', 'true').lower() == 'true',
            # NEW PRICING FIELDS
            price=data.get('price', ''),
            original_price=data.get('original_price', ''),
            course_fees=data.get('course_fees', ''),
            total_amount=data.get('total_amount', ''),
            discount=data.get('discount', ''),
            level=data.get('level', ''),
            rating=float(data.get('rating', 4.5)),
            students_count=data.get('students_count', '0')
        )
        
        db.session.add(project)
        db.session.commit()
        
        app.logger.info(f"Project created successfully: {project.id}")
        
        return jsonify({
            'success': True,
            'project_id': project.id,
            'slug': project.slug,
            'image_url': final_image_url,
            'message': 'Project created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating project: {e}")
        import traceback
        app.logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500


# Update update_project endpoint to handle pricing fields
@app.route("/admin/projects/<int:project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id):
    try:
        project = ProjectPosting.query.get(project_id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        app.logger.info(f"Updating project {project_id}...")
        
        # Handle file upload
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename:
                try:
                    image_url = save_project_image(file)
                    project.image_url = image_url
                    app.logger.info(f"New image uploaded: {image_url}")
                except ValueError as e:
                    return jsonify({'error': str(e)}), 400
        
        data = request.form.to_dict()
        
        # Parse JSON fields (same as create)
        if 'technologies' in data:
            tech_data = data['technologies']
            if isinstance(tech_data, str):
                try:
                    project.technologies = json.loads(tech_data)
                except json.JSONDecodeError:
                    project.technologies = [t.strip() for t in tech_data.replace('\n', ',').split(',') if t.strip()]
            elif isinstance(tech_data, list):
                project.technologies = tech_data
        
        if 'prerequisites' in data:
            prereq_data = data['prerequisites']
            if isinstance(prereq_data, str):
                try:
                    project.prerequisites = json.loads(prereq_data)
                except json.JSONDecodeError:
                    project.prerequisites = [p.strip() for p in prereq_data.replace('\n', ',').split(',') if p.strip()]
            elif isinstance(prereq_data, list):
                project.prerequisites = prereq_data
        
        if 'learning_outcomes' in data:
            outcomes_data = data['learning_outcomes']
            if isinstance(outcomes_data, str):
                try:
                    project.learning_outcomes = json.loads(outcomes_data)
                except json.JSONDecodeError:
                    project.learning_outcomes = [o.strip() for o in outcomes_data.replace('\n', ',').split(',') if o.strip()]
            elif isinstance(outcomes_data, list):
                project.learning_outcomes = outcomes_data
        
        # Update other fields including pricing
        update_fields = ['title', 'description', 'detailed_description', 'category',
                        'duration', 'project_type', 'difficulty_level',
                        'price', 'original_price', 'course_fees', 'total_amount',
                        'discount', 'level', 'students_count']
        
        for field in update_fields:
            if field in data:
                setattr(project, field, data[field])
        
        if 'rating' in data:
            project.rating = float(data['rating'])
        
        if 'is_active' in data:
            project.is_active = data['is_active'].lower() == 'true'
        
        if 'image' not in request.files and 'image_url' in data:
            project.image_url = data['image_url']
        
        project.updated_at = datetime.utcnow()
        db.session.commit()
        
        app.logger.info(f"Project {project_id} updated successfully")
        
        return jsonify({
            'success': True,
            'message': 'Project updated successfully',
            'image_url': project.image_url
        })
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating project: {e}")
        import traceback
        app.logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route("/admin/projects/<int:project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):
    try:
        project = ProjectPosting.query.get(project_id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        project.is_active = False  # Soft delete
        project.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Project deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting project: {e}")
        return jsonify({'error': 'Failed to delete project'}), 500


# Public endpoints for listing projects
@app.route("/api/projects", methods=["GET"])
def get_public_projects():
    try:
        projects = ProjectPosting.query.filter_by(is_active=True).all()
        projects_list = []
        for project in projects:
            image_url = project.image_url
            if image_url and not image_url.startswith('http'):
                image_url = f"http://localhost:7000{image_url}"
            
            projects_list.append({
                'id': project.id,
                'title': project.title,
                'description': project.description,
                'category': project.category,
                'duration': project.duration,
                'project_type': project.project_type,
                'difficulty_level': project.difficulty_level,
                'technologies': project.technologies or [],
                'image_url': image_url,
                'slug': project.slug,
                'project_code': project.project_code,
                'total_enrollments': project.total_enrollments
            })
        return jsonify({'success': True, 'projects': projects_list})
    except Exception as e:
        app.logger.error(f"Error fetching public projects: {e}")
        return jsonify({'error': 'Failed to fetch projects'}), 500

# --------------- static serving -----------------

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    index_file = os.path.join(app.static_folder, "index.html")
    if os.path.exists(index_file):
        return send_from_directory(app.static_folder, "index.html")
    return jsonify({"error": "Frontend not found"}), 404

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=7000)
    