// src/components/TodoList.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles

const TodoList = ({ todos }) => {
    return (
        <div className="container mt-5">
            <h2>To-Do List</h2>
            <ul className="list-group">
                {todos.map((todo) => (
                    <li key={todo.id} className="list-group-item">
                        {todo.title}
                        {todo.subtasks && todo.subtasks.length > 0 && (
                            <ul className="list-group mt-2">
                                {todo.subtasks.map((subtask) => (
                                    <li key={subtask.id} className="list-group-item">{subtask.title}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
