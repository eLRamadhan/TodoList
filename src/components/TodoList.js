import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Swal from "sweetalert2";

const TodoList = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const [data, setData] = useState([]);
    const [newTodoName, setNewTodoName] = useState('');
    const [addingNewTodo, setAddingNewTodo] = useState(false);
    const [newSubTodoName, setNewSubTodoName] = useState('');
    const [addingNewSubTodo, setAddingNewSubTodo] = useState(false);
    const [currentParentId, setCurrentParentId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://94.74.86.174:8080/api/checklist', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                setData(response.data.data);
            } catch (error) {
                console.error('Failed to fetch data:', error.message);
            }
        };

        fetchData();
    }, []);

    const handleCheckboxChange = async (parentId, itemId) => {
        try {
            setData((prevData) =>
                prevData.map((parentItem) => {
                    if (parentItem.id === parentId) {
                        return {
                            ...parentItem,
                            items: parentItem.items.map((item) =>
                                item.id === itemId ? { ...item, itemCompletionStatus: !item.itemCompletionStatus } : item
                            ),
                        };
                    }
                    return parentItem;
                })
            );

            await axios.put(
                `http://94.74.86.174:8080/api/checklist/${parentId}/item/${itemId}`,
                {
                    itemCompletionStatus: data.find((parentItem) => parentItem.id === parentId).items.find((item) => item.id === itemId).itemCompletionStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
        } catch (error) {
            console.error(`Failed to update item with id ${itemId}:`, error.message);
        }
    };


    const handleDeleteTodo = async (id) => {
        try {
            await axios.delete(`http://94.74.86.174:8080/api/checklist/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            Swal.fire({
                icon: 'error',
                title: 'Berhasil!',
                text: 'Data Berhasil dihapus.',
            });
            setData((prevData) => prevData.filter((todo) => todo.id !== id));
        } catch (error) {
            console.error(`Failed to delete todo with id ${id}:`, error.message);
        }
    };

    const handleAddTodoClick = () => {
        setAddingNewTodo(true);
        setAddingNewSubTodo(false);
    };

    const handleAddSubTodoClick = (parentId) => {
        setAddingNewSubTodo(true);
        setAddingNewTodo(false);
        setCurrentParentId(parentId);
    };

    const handleAddTodoSubmit = async () => {
        try {
            const response = await axios.post(
                'http://94.74.86.174:8080/api/checklist',
                {
                    name: newTodoName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data Berhasil ditambahkan.',
            });
            const newTodo = response.data.data;
            setData((prevData) => [...prevData, newTodo]);
            setNewTodoName('');
            setAddingNewTodo(false);
        } catch (error) {
            console.error('Failed to add new todo:', error.message);
        }
    };

    const handleAddSubTodoSubmit = async () => {
        try {
            const response = await axios.post(
                `http://94.74.86.174:8080/api/checklist/${currentParentId}/item`,
                {
                    itemName: newSubTodoName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data Berhasil ditambahkan.',
            });
            const newSubTodo = response.data.data;
            setData((prevData) =>
                prevData.map((parentItem) =>
                    parentItem.id === currentParentId
                        ? { ...parentItem, items: parentItem.items ? [...parentItem.items, newSubTodo] : [newSubTodo] }
                        : parentItem
                )
            );
            setNewSubTodoName('');
            setAddingNewSubTodo(false);
            setCurrentParentId(null);
        } catch (error) {
            console.error('Failed to add new sub todo:', error.message);
        }
    };

    const handleRenameSubTodo = async (parentId, itemId, newName) => {
        try {
            await axios.put(
                `http://94.74.86.174:8080/api/checklist/${parentId}/item/rename/${itemId}`,
                { itemName: newName },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data Berhasil diubah.',
            });
            setData((prevData) =>
                prevData.map((parentItem) =>
                    parentItem.id === parentId
                        ? {
                            ...parentItem,
                            items: parentItem.items.map((item) =>
                                item.id === itemId ? { ...item, name: newName, editing: false, newName: '' } : item
                            ),
                        }
                        : parentItem
                )
            );
        } catch (error) {
            console.error('Failed to rename sub todo:', error.message);
        }
    };


    const handleDeleteSubTodo = async (checklistId, checklistItemId) => {
        try {
            await axios.delete(`http://94.74.86.174:8080/api/checklist/${checklistId}/item/${checklistItemId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            Swal.fire({
                icon: 'error',
                title: 'Berhasil!',
                text: 'Data Berhasil dihapus.',
            });
            setData((prevData) =>
                prevData.map((parentItem) =>
                    parentItem.id === checklistId
                        ? {
                            ...parentItem,
                            items: parentItem.items.filter((item) => item.id !== checklistItemId),
                        }
                        : parentItem
                )
            );
        } catch (error) {
            console.error('Failed to delete sub todo:', error.message);
        }
    };
    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center">
                <h2>To-Do List</h2>
                <Link to="/" onClick={handleLogout} className="btn btn-outline-danger btn-sm mx-1">
                    Logout
                </Link>
            </div>
            <ul className="list-group">
                {data.map((todo) => (
                    <li key={todo.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <span>{todo.name}</span>
                            <div className="btn-group">
                                <button
                                    className="btn btn-outline-success btn-sm mx-1"
                                    onClick={() => handleAddSubTodoClick(todo.id)}
                                    disabled={addingNewTodo}
                                >
                                    + Sub Todo
                                </button>
                                <button
                                    className="btn btn-outline-danger btn-sm mx-1"
                                    onClick={() => handleDeleteTodo(todo.id)}
                                    disabled={addingNewTodo || addingNewSubTodo}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        {todo.items && todo.items.length > 0 && (
                            <ul className="list-group mt-2">
                                {todo.items.map((subtask) => (
                                    <li key={subtask.id} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            {subtask.editing ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={subtask.newName}
                                                        onChange={(e) =>
                                                            setData((prevData) =>
                                                                prevData.map((parentItem) =>
                                                                    parentItem.id === todo.id
                                                                        ? {
                                                                            ...parentItem,
                                                                            items: parentItem.items.map((item) =>
                                                                                item.id === subtask.id ? { ...item, newName: e.target.value } : item
                                                                            ),
                                                                        }
                                                                        : parentItem
                                                                )
                                                            )
                                                        }
                                                    />
                                                    <div className="btn-group">
                                                        <button
                                                            className="btn btn-outline-succes btn-sm mx-1 me-2"
                                                            onClick={() => handleRenameSubTodo(todo.id, subtask.id, subtask.newName)}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-secondary btn-sm mx-1"
                                                            onClick={() =>
                                                                setData((prevData) =>
                                                                    prevData.map((parentItem) =>
                                                                        parentItem.id === todo.id
                                                                            ? {
                                                                                ...parentItem,
                                                                                items: parentItem.items.map((item) =>
                                                                                    item.id === subtask.id ? { ...item, editing: false } : item
                                                                                ),
                                                                            }
                                                                            : parentItem
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{subtask.name}</span>
                                                    <div className="btn-group">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input mx-2"
                                                            checked={subtask.itemCompletionStatus}
                                                            onChange={() => handleCheckboxChange(todo.id, subtask.id)}
                                                        />
                                                        <button
                                                            className="btn btn-outline-primary btn-sm mx-1 me-2"
                                                            onClick={() =>
                                                                setData((prevData) =>
                                                                    prevData.map((parentItem) =>
                                                                        parentItem.id === todo.id
                                                                            ? {
                                                                                ...parentItem,
                                                                                items: parentItem.items.map((item) =>
                                                                                    item.id === subtask.id ? { ...item, editing: true, newName: item.name } : item
                                                                                ),
                                                                            }
                                                                            : parentItem
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            Rename
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm mx-1"
                                                            onClick={() => handleDeleteSubTodo(todo.id, subtask.id)}
                                                            disabled={addingNewTodo || addingNewSubTodo}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}



                    </li>
                ))}
                {addingNewTodo && (
                    <li className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter new todo name"
                                value={newTodoName}
                                onChange={(e) => setNewTodoName(e.target.value)}
                            />
                            <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleAddTodoSubmit}>
                                Add
                            </button>
                        </div>
                    </li>
                )}
                {addingNewSubTodo && (
                    <li className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter new sub todo name"
                                value={newSubTodoName}
                                onChange={(e) => setNewSubTodoName(e.target.value)}
                            />
                            <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleAddSubTodoSubmit}>
                                Add
                            </button>
                        </div>
                    </li>
                )}
                {!addingNewTodo && !addingNewSubTodo && (
                    <li className="list-group-item">
                        <button className="btn btn-outline-success btn-sm mx-1" onClick={handleAddTodoClick}>
                            + Add New Todo
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default TodoList;
