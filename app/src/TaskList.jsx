import React from 'react';

const TaskList = ({ tasks, onDelete, onToggle }) => (
  <ul>
    {tasks.map(task => (
      <li key={task.id}>
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={() => onToggle(task)} 
        />
        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
          {task.title}
        </span>
        <button onClick={() => onDelete(task.id)}>❌</button>
      </li>
    ))}
  </ul>
);

export default TaskList;
