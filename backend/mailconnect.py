import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from config import *

def normalize_data_keys(data):
    """
    Normalize frontend data keys to match expected backend keys
    Handles different form structures (enroll, demo, inquiry, pclinfo, internship)
    """
    normalized = {}
    
    # Handle name fields - multiple possible structures
    if data.get('fname'):
        normalized['fname'] = data.get('fname')
    if data.get('lname'):
        normalized['lname'] = data.get('lname')
    
    # If fullName exists but not fname/lname, split it
    if data.get('fullName') or data.get('full_name'):
        full_name = data.get('fullName') or data.get('full_name')
        if not normalized.get('fname') and not normalized.get('lname'):
            name_parts = full_name.split(' ', 1)
            normalized['fname'] = name_parts[0] if len(name_parts) > 0 else ''
            normalized['lname'] = name_parts[1] if len(name_parts) > 1 else ''
        normalized['full_name'] = full_name
    
    # Copy other standard fields
    normalized['email'] = data.get('email', '')
    normalized['mobile'] = data.get('mobile', '')
    normalized['message'] = data.get('message', '')
    normalized['type'] = data.get('type', '')
    normalized['internship'] = data.get('internship', '')
    
    return normalized

def send_email_notify(data):
    """
    Simple notification email for basic forms (enroll, demo, inquiry)
    """
    normalized_data = normalize_data_keys(data)
    
    gmail_user = gmail_users
    gmail_password = gmail_passwords
    to_email = sent_email
    
    # Determine form type for subject
    form_type = normalized_data.get('type', 'General')
    full_name = normalized_data.get('full_name') or f"{normalized_data.get('fname', '')} {normalized_data.get('lname', '')}".strip()
    
    subject = f"New {form_type} Inquiry from {full_name}"
    
    # Build email body
    body_parts = [f"New {form_type} Inquiry Received:\n"]
    
    if full_name:
        body_parts.append(f"Name: {full_name}")
    
    if normalized_data.get('email'):
        body_parts.append(f"Email: {normalized_data['email']}")
    
    if normalized_data.get('mobile'):
        body_parts.append(f"Mobile: {normalized_data['mobile']}")
    
    if normalized_data.get('type'):
        body_parts.append(f"Type: {normalized_data['type']}")
    
    if normalized_data.get('message'):
        body_parts.append(f"Message: {normalized_data['message']}")
    
    body = "\n".join(body_parts)
    
    message = MIMEMultipart()
    message["From"] = gmail_user
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))
    
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(gmail_user, gmail_password)
        server.sendmail(gmail_user, to_email, message.as_string())
        server.quit()
        print("✅ Email sent successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False

def send_email_notification(data, attachment_path=None):
    """
    Enhanced notification email with attachment support (pclinfo, internship)
    """
    normalized_data = normalize_data_keys(data)
    
    gmail_user = gmail_users
    gmail_password = gmail_passwords
    to_email = sent_email
    
    # Determine subject based on form type
    fname = normalized_data.get('fname', '')
    lname = normalized_data.get('lname', '')
    full_name = normalized_data.get('full_name') or f"{fname} {lname}".strip()
    
    # Check if this is internship or pclinfo based on data structure
    if normalized_data.get('internship'):
        subject = f"New Internship Application from {full_name}"
        form_type = "Internship Application"
    else:
        subject = f"New Inquiry from {full_name}"
        form_type = "General Inquiry"
    
    # Build comprehensive email body
    body_parts = [f"{form_type} Received:\n"]
    
    if fname and lname:
        body_parts.append(f"Name: {fname} {lname}")
    elif full_name:
        body_parts.append(f"Name: {full_name}")
    
    if normalized_data.get('email'):
        body_parts.append(f"Email: {normalized_data['email']}")
    
    if normalized_data.get('mobile'):
        body_parts.append(f"Mobile: {normalized_data['mobile']}")
    
    # Add type field if present (course enrollment, demo request, etc.)
    if normalized_data.get('type'):
        body_parts.append(f"Type: {normalized_data['type']}")
    
    # Add internship field if present
    if normalized_data.get('internship'):
        body_parts.append(f"Internship Position: {normalized_data['internship']}")
    
    if normalized_data.get('message'):
        body_parts.append(f"Message:\n{normalized_data['message']}")
    
    # Add attachment info if present
    if attachment_path and os.path.exists(attachment_path):
        body_parts.append(f"\n📎 Attachment: {os.path.basename(attachment_path)}")
    
    body = "\n".join(body_parts)
    
    message = MIMEMultipart()
    message["From"] = gmail_user
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))
    
    # ✅ Add attachment if provided and file exists
    if attachment_path and os.path.exists(attachment_path):
        try:
            with open(attachment_path, "rb") as f:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(f.read())
                encoders.encode_base64(part)
                part.add_header(
                    "Content-Disposition",
                    f'attachment; filename="{os.path.basename(attachment_path)}"',
                )
                message.attach(part)
                print(f"📎 Attachment added: {os.path.basename(attachment_path)}")
        except Exception as e:
            print(f"❌ Failed to attach file {attachment_path}: {e}")
    
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(gmail_user, gmail_password)
        server.sendmail(gmail_user, to_email, message.as_string())
        server.quit()
        print("✅ Email with attachment sent successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False

# Optional: Add a test function to verify email configuration
def test_email_config():
    """
    Test function to verify email configuration works
    """
    test_data = {
        'fullName': 'Test User',
        'email': 'test@example.com',
        'mobile': '1234567890',
        'type': 'Test',
        'message': 'This is a test email configuration'
    }
    
    print("Testing email configuration...")
    result = send_email_notify(test_data)
    return result



        # import smtplib
# import os
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
# from email.mime.base import MIMEBase
# from email import encoders
# from config import *

# def send_email_notify(data):
#     gmail_user = gmail_users
#     gmail_password = gmail_passwords

#     to_email = sent_email
#     subject = f"New Inquiry"
#     body = f"""
#  New Inquiry Received:

# Details: {data}
# """

#     message = MIMEMultipart()
#     message["From"] = gmail_user
#     message["To"] = to_email
#     message["Subject"] = subject
#     message.attach(MIMEText(body, "plain"))

#     try:
#         server = smtplib.SMTP("smtp.gmail.com", 587)
#         server.starttls()
#         server.login(gmail_user, gmail_password)
#         server.sendmail(gmail_user, to_email, message.as_string())
#         server.quit()
#         print(" Email sent successfully!")
#     except Exception as e:
#         print(f" Failed to send email: {e}")


# def send_email_notification(data, attachment_path=None):
#     gmail_user = gmail_users
#     gmail_password = gmail_passwords

#     to_email = sent_email
    
#     # Fix: Handle missing fname gracefully and proper string concatenation
#     fname = data.get('fname', '')
#     lname = data.get('lname', '')
#     full_name = f"{fname} {lname}".strip()
    
#     # Use full_name or fallback to email for subject
#     subject_name = full_name if full_name else data.get('email', 'Unknown')
#     subject = f"New Inquiry from {subject_name}"
    
#     # Fix: Better formatting and handle missing fields
#     body = f"""
#  New Inquiry Received:

# Full Name: {full_name}
# Email: {data.get('email', 'Not provided')}
# Mobile: {data.get('mobile', 'Not provided')}
# Type: {data.get('type', 'Not specified')}
# Internship: {data.get('internship', 'Not specified')}
# Message: {data.get('message', 'No message provided')}
# """

#     message = MIMEMultipart()
#     message["From"] = gmail_user
#     message["To"] = to_email
#     message["Subject"] = subject
#     message.attach(MIMEText(body, "plain"))

#     # Add attachment if provided and file exists
#     if attachment_path and os.path.exists(attachment_path):
#         try:
#             with open(attachment_path, "rb") as f:
#                 part = MIMEBase("application", "octet-stream")
#                 part.set_payload(f.read())
#                 encoders.encode_base64(part)
#                 part.add_header(
#                     "Content-Disposition",
#                     f'attachment; filename="{os.path.basename(attachment_path)}"',
#                 )
#                 message.attach(part)
#         except Exception as e:
#             print(f"Failed to attach file: {e}")
#             # Don't return here, still try to send email without attachment

#     try:
#         server = smtplib.SMTP("smtp.gmail.com", 587)
#         server.starttls()
#         server.login(gmail_user, gmail_password)
#         server.sendmail(gmail_user, to_email, message.as_string())
#         server.quit()
#         print(" Email sent successfully!")
#         return True
#     except Exception as e:
#         print(f" Failed to send email: {e}")
#         return False


# # Alternative function specifically for internship applications
# def send_internship_notification(data, cv_path=None):
#     """
#     Dedicated function for internship applications with better error handling
#     """
#     try:
#         gmail_user = gmail_users
#         gmail_password = gmail_passwords
#         to_email = sent_email
        
#         fname = data.get('fname', '')
#         lname = data.get('lname', '')
#         full_name = f"{fname} {lname}".strip()
        
#         subject = f"New Internship Application from {full_name}"
        
#         body = f"""
# New Internship Application Received:

# Applicant Details:
# - Full Name: {full_name}
# - Email: {data.get('email', 'Not provided')}
# - Mobile: {data.get('mobile', 'Not provided')}
# - Internship Type: {data.get('internship', 'Not specified')}
# - Message: {data.get('message', 'No message provided')}

# CV Attachment: {'Yes' if cv_path and os.path.exists(cv_path) else 'No'}
# """

#         message = MIMEMultipart()
#         message["From"] = gmail_user
#         message["To"] = to_email
#         message["Subject"] = subject
#         message.attach(MIMEText(body, "plain"))

#         # Add CV attachment if provided
#         if cv_path and os.path.exists(cv_path):
#             try:
#                 with open(cv_path, "rb") as f:
#                     part = MIMEBase("application", "octet-stream")
#                     part.set_payload(f.read())
#                     encoders.encode_base64(part)
                    
#                     filename = os.path.basename(cv_path)
#                     part.add_header(
#                         "Content-Disposition",
#                         f'attachment; filename="{filename}"',
#                     )
#                     message.attach(part)
#                     print(f"CV attached: {filename}")
#             except Exception as e:
#                 print(f"Failed to attach CV: {e}")

#         # Send email
#         server = smtplib.SMTP("smtp.gmail.com", 587)
#         server.starttls()
#         server.login(gmail_user, gmail_password)
#         server.sendmail(gmail_user, to_email, message.as_string())
#         server.quit()
#         print("Internship application email sent successfully!")
#         return True
        
#     except Exception as e:
#         print(f"Failed to send internship email: {e}")
#         # Print more detailed error information
#         import traceback
#         traceback.print_exc()
#         return False
    
    
