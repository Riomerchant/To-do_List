from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

DATA_FILE = 'db.json'

def read_tasks():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def write_tasks(tasks):
    with open(DATA_FILE, 'w') as f:
        json.dump(tasks, f)

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(read_tasks())

@app.route('/tasks', methods=['POST'])
def add_task():
    task = request.json
    tasks = read_tasks()
    task['id'] = len(tasks) + 1
    task['completed'] = False
    tasks.append(task)
    write_tasks(tasks)
    return jsonify(task)

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    tasks = read_tasks()
    tasks = [task for task in tasks if task['id'] != task_id]
    write_tasks(tasks)
    return '', 204

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    updated_task = request.json
    tasks = read_tasks()
    
    for task in tasks:
        if task['id'] == task_id:
            task.update(updated_task)  # Update task with new data
            break
    
    write_tasks(tasks)  # Write updated tasks back to the file
    return jsonify(updated_task)  # Return the updated task to the frontend

if __name__ == '__main__':
    app.run(debug=True)
