from flask import Flask, render_template, request, redirect, jsonify
import pandas as pd
import os
import requests
import re

app = Flask(__name__)

# Whapi.Cloud credentials
WHAPI_TOKEN = os.getenv('WHAPI_TOKEN', 'JuyXkWpiXJ3vNbmYlUT3sN9HxtWL6Wrl')
WHAPI_URL = 'https://gate.whapi.cloud/messages/text'
TEACHER_WHATSAPP_NUMBER = os.getenv('TEACHER_WHATSAPP_NUMBER', '919876543210')  # Teacher's WhatsApp number (format: 919876543210)

def format_phone_number(phone):
    """Format phone number to Whapi.Cloud format (e.g., 919876543210 - no + sign, just digits)"""
    # Remove any non-digit characters except leading +
    if phone.startswith('+'):
        phone = phone[1:]
    # Remove any spaces, dashes, or other characters
    phone = re.sub(r'\D', '', phone)
    # Ensure it starts with country code (default to 91 for India if 10 digits)
    if len(phone) == 10:
        phone = f'91{phone}'
    return phone

def send_whatsapp_message(to, message):
    """Send WhatsApp message using Whapi.Cloud API"""
    try:
        formatted_phone = format_phone_number(to)
        response = requests.post(
            WHAPI_URL,
            headers={
                'Authorization': f'Bearer {WHAPI_TOKEN}',
                'Content-Type': 'application/json'
            },
            json={
                'to': formatted_phone,
                'body': message
            }
        )
        
        if response.ok:
            data = response.json()
            return {'success': True, 'message_id': data.get('id'), 'phone': formatted_phone}
        else:
            return {'success': False, 'error': response.text, 'status_code': response.status_code}
    except Exception as e:
        return {'success': False, 'error': str(e)}

# Excel file load
df = pd.read_excel("Contact Information (Responses).xlsx")

# Normalize column names
df.columns = df.columns.str.strip().str.lower()

# Auto-detect columns
name_col = next((c for c in df.columns if 'name' in c), None)
enroll_col = next((c for c in df.columns if 'enroll' in c or 'roll' in c), None)

students = df.to_dict(orient='records')

# Default attendance = Present
attendance_records = [{'name': s[name_col], 'roll': s[enroll_col], 'status': 'P'} for s in students]

@app.route('/')
def home():
    return render_template('attendance.html',
                           students=students,
                           attendance=attendance_records,
                           name_col=name_col,
                           enroll_col=enroll_col)

@app.route('/submit', methods=['POST'])
def submit():
    # Update attendance based on form input
    for record in attendance_records:
        roll = record['roll']
        status = request.form.get(str(roll))
        if status:  # if selected (A or OD)
            record['status'] = status
        else:
            record['status'] = 'P'  # default present
    return redirect('/show')

@app.route('/show')
def show():
    return render_template('attendance.html',
                           students=students,
                           show=True,
                           attendance=attendance_records,
                           name_col=name_col,
                           enroll_col=enroll_col)

@app.route('/api/attendance/bulk', methods=['POST'])
def bulk_attendance():
    try:
        data = request.get_json()
        absent_students = []

        # Process bulk attendance data and collect absent students
        for record in data:
            if record.get('status') == 'absent':
                # Find student details from the Excel data
                student = next((s for s in students if str(s.get(enroll_col, '')) == str(record.get('studentId', ''))), None)
                if student:
                    whatsapp_number = student.get('whatsapp', '')  # Assuming 'whatsapp' column exists
                    if whatsapp_number:
                        absent_students.append({
                            'name': student.get(name_col, 'Unknown'),
                            'whatsapp': whatsapp_number,
                            'date': record.get('date', 'Unknown')
                        })

        # Send WhatsApp notifications to absent students using Whapi.Cloud
        for student in absent_students:
            message_body = f"Dear {student['name']}, you were marked absent on {student['date']}. Please contact your teacher if this is incorrect."
            result = send_whatsapp_message(student['whatsapp'], message_body)
            
            if result['success']:
                print(f"Sent absent notification to {student['name']}: Message ID {result.get('message_id', 'N/A')}")
            else:
                print(f"Failed to send message to {student['name']}: {result.get('error', 'Unknown error')}")

        # Send summary to teacher using Whapi.Cloud
        if absent_students:
            summary = f"Attendance Summary for {data[0].get('date', 'Today')}:\n"
            summary += f"Total absent: {len(absent_students)}\n"
            for student in absent_students:
                summary += f"- {student['name']}\n"

            result = send_whatsapp_message(TEACHER_WHATSAPP_NUMBER, summary)
            if result['success']:
                print(f"Sent summary to teacher: Message ID {result.get('message_id', 'N/A')}")
            else:
                print(f"Failed to send summary to teacher: {result.get('error', 'Unknown error')}")

        return jsonify({'message': 'Attendance synced successfully', 'count': len(data), 'absent_notifications': len(absent_students)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3002)
