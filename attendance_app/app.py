from flask import Flask, render_template, request, redirect, jsonify
import pandas as pd
import os

app = Flask(__name__)

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
        # Process bulk attendance data
        # For now, just return success
        return jsonify({'message': 'Attendance synced successfully', 'count': len(data)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3002)
