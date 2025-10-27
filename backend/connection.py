# backend/connection.py (Extended)
import os
import logging
from datetime import datetime
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
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    # Relationship
    course = db.relationship('Course', backref='payments')


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
        return jsonify({"success": True, "enrollment_id": entry.id}), 201
    except Exception as e:
        db.session.rollback()
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


# Add API endpoints
# @app.route("/admin/internships", methods=["GET"])
# @jwt_required()
# def get_all_internships():
#     try:
#         internships = InternshipPosting.query.all()
#         internships_list = [{
#             'id': i.id,
#             'title': i.title,
#             'description': i.description,
#             'detailed_description': i.detailed_description,
#             'category': i.category,
#             'duration': i.duration,
#             'internship_type': i.internship_type,
#             'location': i.location,
#             'skills': i.skills,
#             'eligibility': i.eligibility,
#             'perks': i.perks,
#             'image_url': i.image_url,
#             'internship_code': i.internship_code,
#             'slug': i.slug,
#             'is_active': i.is_active,
#             'total_applications': i.total_applications,
#             'created_at': i.created_at.isoformat(),
#             'updated_at': i.updated_at.isoformat()
#         } for i in internships]
#         return jsonify({'success': True, 'internships': internships_list})
#     except Exception as e:
#         app.logger.error(f"Error fetching internships: {e}")
#         return jsonify({'error': 'Failed to fetch internships'}), 500


# ... (keep other existing endpoints)
# @app.route("/admin/internships", methods=["POST"])
# @jwt_required()
# def create_internship():
#     try:
#         data = request.get_json()
        
#         # Validate required fields
#         required_fields = ['title', 'description', 'category', 'duration', 'internship_type']
#         for field in required_fields:
#             if field not in data or not data[field]:
#                 return jsonify({'error': f'{field} is required'}), 400
        
#         # Generate unique internship code and slug
#         internship_code = f"INT-{uuid.uuid4().hex[:8].upper()}"
#         slug = data['title'].lower().replace(' ', '-') + f"-{uuid.uuid4().hex[:6]}"
        
#         # Create new internship posting
#         new_internship = InternshipPosting(
#             title=data['title'],
#             description=data['description'],
#             detailed_description=data.get('detailed_description', ''),
#             category=data['category'],
#             duration=data['duration'],
#             internship_type=data['internship_type'],
#             location=data.get('location', ''),
#             skills=data.get('skills', []),
#             eligibility=data.get('eligibility', ''),
#             perks=data.get('perks', []),
#             image_url=data.get('image_url', ''),
#             internship_code=internship_code,
#             slug=slug,
#             is_active=data.get('is_active', True)
#         )
        
#         db.session.add(new_internship)
#         db.session.commit()
        
#         return jsonify({
#             'success': True,
#             'message': 'Internship created successfully',
#             'internship': {
#                 'id': new_internship.id,
#                 'title': new_internship.title,
#                 'description': new_internship.description,
#                 'detailed_description': new_internship.detailed_description,
#                 'category': new_internship.category,
#                 'duration': new_internship.duration,
#                 'internship_type': new_internship.internship_type,
#                 'location': new_internship.location,
#                 'skills': new_internship.skills,
#                 'eligibility': new_internship.eligibility,
#                 'perks': new_internship.perks,
#                 'image_url': new_internship.image_url,
#                 'internship_code': new_internship.internship_code,
#                 'slug': new_internship.slug,
#                 'is_active': new_internship.is_active,
#                 'total_applications': new_internship.total_applications,
#                 'created_at': new_internship.created_at.isoformat(),
#                 'updated_at': new_internship.updated_at.isoformat()
#             }
#         }), 201
        
#     except Exception as e:
#         db.session.rollback()
#         app.logger.error(f"Error creating internship: {e}")
#         return jsonify({'error': 'Failed to create internship'}), 500


# @app.route("/admin/internships/<int:internship_id>", methods=["PUT"])
# @jwt_required()
# def update_internship(internship_id):
#     try:
#         internship = InternshipPosting.query.get(internship_id)
        
#         if not internship:
#             return jsonify({'error': 'Internship not found'}), 404
        
#         data = request.get_json()
        
#         # Update fields if provided
#         if 'title' in data:
#             internship.title = data['title']
#         if 'description' in data:
#             internship.description = data['description']
#         if 'detailed_description' in data:
#             internship.detailed_description = data['detailed_description']
#         if 'category' in data:
#             internship.category = data['category']
#         if 'duration' in data:
#             internship.duration = data['duration']
#         if 'internship_type' in data:
#             internship.internship_type = data['internship_type']
#         if 'location' in data:
#             internship.location = data['location']
#         if 'skills' in data:
#             internship.skills = data['skills']
#         if 'eligibility' in data:
#             internship.eligibility = data['eligibility']
#         if 'perks' in data:
#             internship.perks = data['perks']
#         if 'image_url' in data:
#             internship.image_url = data['image_url']
#         if 'is_active' in data:
#             internship.is_active = data['is_active']
        
#         db.session.commit()
        
#         return jsonify({
#             'success': True,
#             'message': 'Internship updated successfully',
#             'internship': {
#                 'id': internship.id,
#                 'title': internship.title,
#                 'description': internship.description,
#                 'detailed_description': internship.detailed_description,
#                 'category': internship.category,
#                 'duration': internship.duration,
#                 'internship_type': internship.internship_type,
#                 'location': internship.location,
#                 'skills': internship.skills,
#                 'eligibility': internship.eligibility,
#                 'perks': internship.perks,
#                 'image_url': internship.image_url,
#                 'internship_code': internship.internship_code,
#                 'slug': internship.slug,
#                 'is_active': internship.is_active,
#                 'total_applications': internship.total_applications,
#                 'created_at': internship.created_at.isoformat(),
#                 'updated_at': internship.updated_at.isoformat()
#             }
#         })
        
#     except Exception as e:
#         db.session.rollback()
#         app.logger.error(f"Error updating internship: {e}")
#         return jsonify({'error': 'Failed to update internship'}), 500


# @app.route("/admin/internships/<int:internship_id>", methods=["DELETE"])
# @jwt_required()
# def delete_internship(internship_id):
#     try:
#         internship = InternshipPosting.query.get(internship_id)
        
#         if not internship:
#             return jsonify({'error': 'Internship not found'}), 404
        
#         # Soft delete - just set is_active to False
#         internship.is_active = False
#         db.session.commit()
        
#         return jsonify({
#             'success': True,
#             'message': 'Internship deactivated successfully'
#         })
        
#     except Exception as e:
#         db.session.rollback()
#         app.logger.error(f"Error deleting internship: {e}")
#         return jsonify({'error': 'Failed to delete internship'}), 500

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
    