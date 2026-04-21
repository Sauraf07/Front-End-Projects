import { useState, useRef } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const inputRef = useRef();

  // Add Todo using useRef
  const addTodo = () => {
    const text = inputRef.current.value;

    if (text.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      text: text
    };

    setTodos([...todos, newTodo]);

    // Clear input
    inputRef.current.value = "";
  };

  // Delete Todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">To-Do App</h1>

      {/* Input Section */}
      <div className="input-group mb-3">
        <input
          ref={inputRef}
          type="text"
          className="form-control"
          placeholder="Enter task"
        />
        <button className="btn btn-primary" onClick={addTodo}>
          Add
        </button>
      </div>

      {/* Todo List */}
      <ul className="list-group">
        {todos.length === 0 ? (
          <p className="text-center">No tasks available</p>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="list-group-item d-flex justify-content-between"
            >
              {todo.text}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;