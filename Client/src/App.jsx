import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import './App.css';
import axios from 'axios';
import icon from './assets/icon.png';
import addTask from '../src/assets/notes.png';

function App() {

  const backendUrl = import.meta.env.VITE_BACK_END;
  
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch Todos from server
  const fetchTodos = () => {
    axios.get(backendUrl + '/todo')
      .then((res) => setTodos(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add Task
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!task.trim()) {
      toast.error("Please Enter Task");
      return;
    }

    axios.post(backendUrl + '/add', { task })
      .then(() => {
        toast.success("Task Added!");
        setTask("");
        fetchTodos();
      })
      .catch(() => toast.error("Error adding task"));
  };

  // Toggle done state
  const handleClick = (id) => {
    axios.put(backendUrl + `/edit/${id}`)
      .then(() => {
        fetchTodos();
      })
      .catch(() => toast.error("Error updating task"));
  };

  // Delete Task
  const handleDelete = (id) => {
    axios.delete(backendUrl + `/delete/${id}`)
      .then(() => {
        toast.success("Task Deleted");
        fetchTodos();
      })
      .catch(() => toast.error("Error deleting task"));
  };

  // Start Editing
  const startEditing = (task, id) => {
    setIsEditing(true);
    setEditTask(task);
    setEditId(id);
  };

  // Cancel Editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditTask("");
    setEditId(null);
  };

  // Submit Edited Task
  const submitEdit = () => {
    if (!editTask.trim()) {
      toast.error("Please enter updated task");
      return;
    }

    axios.put(backendUrl + `/update/${editId}`, { task: editTask })
      .then(() => {
        toast.success("Task Updated!");
        fetchTodos();
        cancelEditing();
      })
      .catch(() => toast.error("Error updating task"));
  };

  return (
    <>
      <Toaster />
      <div className="container">
        <div className="todo-app">
          <h2>To-Do App <img src={icon} alt="Logo" /></h2>

          <form className="row" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <button type="submit">Add Task</button>
          </form>

          <div className="todo-data">
            <ul>
              {todos.length > 0 ? (
                todos.map((data) => (
                  <li key={data._id}>
                    {isEditing && editId === data._id ? (
                      <div className="edit-mode">
                        <input
                          type="text"
                          value={editTask}
                          onChange={(e) => setEditTask(e.target.value)}
                          className="edit-input"
                        />
                        <div className="btn">
                          <button id="tick" onClick={submitEdit}>
                            <i className="fa-solid fa-check"></i>
                          </button>
                          <button id="cancel" onClick={cancelEditing}>
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span onClick={() => handleClick(data._id)}>
                          {data.done ? (
                            <i className="fa-solid fa-check"></i>
                          ) : (
                            <i className="fa-regular fa-circle"></i>
                          )}
                          {" "}{data.task}
                        </span>
                        <div className="btn">
                          <button id="pen" onClick={() => startEditing(data.task, data._id)}>
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button id="trash" onClick={() => handleDelete(data._id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))
              ) : (
                <div className="info-tag">
                  <img id="img-tag" src={addTask} alt="No Tasks" />
                  <p id="p-tag">
                    No todo list! Click add task button to create your thoughts. Let's get started!
                  </p>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
