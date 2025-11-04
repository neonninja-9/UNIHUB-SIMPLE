from flask import Flask, render_template, request, redirect, jsonify
import pandas as pd
import os
from twilio.rest import Client
import os

app = Flask(__name__)

# Twilio credentials (replace with your actual credentials)
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', 'your_account_sid')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', 'your_auth_token')
TWILIO_WHATSAPP_NUMBER = os.getenv('TWILIO_WHATSAPP_NUMBER', 'whatsapp:+1234567890')  # Your Twilio WhatsApp number
TEACHER_WHATSAPP_NUMBER = os.getenv('TEACHER_WHATSAPP_NUMBER', 'whatsapp:+0987654321')  # Teacher's WhatsApp number

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

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

        # Send WhatsApp notifications to absent students
        for student in absent_students:
            try:
                message = client.messages.create(
                    body=f"Dear {student['name']}, you were marked absent on {student['date']}. Please contact your teacher if this is incorrect.",
                    from_=TWILIO_WHATSAPP_NUMBER,
                    to=f"whatsapp:{student['whatsapp']}"
                )
                print(f"Sent absent notification to {student['name']}: {message.sid}")
            except Exception as e:
                print(f"Failed to send message to {student['name']}: {str(e)}")

        # Send summary to teacher
        if absent_students:
            summary = f"Attendance Summary for {data[0].get('date', 'Today')}:\n"
            summary += f"Total absent: {len(absent_students)}\n"
            for student in absent_students:
                summary += f"- {student['name']}\n"

            try:
                teacher_message = client.messages.create(
                    body=summary,
                    from_=TWILIO_WHATSAPP_NUMBER,
                    to=TEACHER_WHATSAPP_NUMBER
                )
                print(f"Sent summary to teacher: {teacher_message.sid}")
            except Exception as e:
                print(f"Failed to send summary to teacher: {str(e)}")

        return jsonify({'message': 'Attendance synced successfully', 'count': len(data), 'absent_notifications': len(absent_students)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3002)
