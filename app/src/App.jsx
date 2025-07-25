import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file for styling

const API_URL = 'https://to-do-list-two-sand-94.vercel.app';

fetch(`${API_URL}/tasks`, {
  method: "POST","GET","UPDATE" , "DELETE"
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newTask),
})

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!newTask) return;

    try {
      const response = await axios.post(API_URL, { name: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId)); // Remove deleted task from UI
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    try {
      const response = await axios.put(`http://localhost:5000/tasks/${taskId}`, updatedTask);
      setTasks(tasks.map((task) => (task.id === taskId ? response.data : task))); // Update task in UI

      // Reload the page to reflect changes
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const toggleCompletion = async (taskId, completed) => {
    try {
      const updatedTask = { completed: !completed };
      await updateTask(taskId, updatedTask);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <div className="input-section">
        <input
          type="text"
          className="task-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button className="add-button" onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span className="task-name">{task.name}</span>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompletion(task.id, task.completed)}
            />
            <button className="delete-button" onClick={() => deleteTask(task.id)}>Delete</button>
            <button
              className="update-button"
              onClick={() =>
                updateTask(task.id, {
                  name: prompt('Update task:', task.name),
                  completed: task.completed, // Preserve the task's completion status
                })
              }
            >
              Update
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
