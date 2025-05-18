import { useEffect, useState } from "react";

const filterType = {
  ALL: "ALL",
  DONE: "DONE",
  PENDING: "PENDING",
};

const AddTodo = ({ addTodo }) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const input = event.target;
      const text = input.value.trim();
      if (text) {
        addTodo(text);
        input.value = "";
      }
    }
  };

  return (
    <input
      type="text"
      placeholder="Adicione aqui sua nova tarefa"
      onKeyDown={handleKeyPress}
    />
  );
};

const TodoFilter = ({ handleFilter }) => {
  return (
    <div className="center-content">
      <a href="#" id="filter-all" onClick={() => handleFilter(filterType.ALL)}>
        Todos os itens
      </a>
      <a
        href="#"
        id="filter-done"
        onClick={() => handleFilter(filterType.DONE)}
      >
        Concluídos
      </a>
      <a
        href="#"
        id="filter-pending"
        onClick={() => handleFilter(filterType.PENDING)}
      >
        Pendentes
      </a>
    </div>
  );
};

const TodoItem = ({ todo, markTodoAsDone }) => {
  const handleClick = () => {
    markTodoAsDone(todo.id);
  };

  return (
    <>
      {todo.done ? (
        <li style={{ textDecoration: "line-through" }}>{todo.text}</li>
      ) : (
        <li>
          {todo.text}
          <button onClick={handleClick}>Concluir</button>
        </li>
      )}
    </>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState(filterType.ALL);

  const filteredList = todos.filter((item) => {
    if (filter === filterType.ALL) return true;
    if (filter === filterType.PENDING) return !item.done;
    if (filter === filterType.DONE) return item.done;
  });

  console.log(filter);
  console.log(todos);

  useEffect(() => {
    console.log("useEffect");
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:3000/todos");
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados");
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchTodos();
  }, [filter]);

  const addTodo = (text) => {
    const newTodo = { id: crypto.randomUUID(), text, done: false };
    fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao realizar o Post");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Post bem-sucedido");
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch((error) => {
        throw new Error("Erro ao inserir nova task");
      });
  };

  const markTodoAsDone = (id) => {
    const URL_PUT = `http://localhost:3000/todos/${id}`;
    const task = todos.find((todo) => todo.id === id);

    const newTask = { ...task, done: true };

    fetch(URL_PUT, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao realizar o PUT");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Put bem-sucedido");
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === id ? data : todo))
        );
      })
      .catch((error) => {
        throw new Error("Erro ao atualizar task");
      });
  };

  const handleFilter = (newFilter) => setFilter(newFilter);

  return (
    <>
      <h1>To-Do List</h1>
      <div className="center-content">
        Versão inicial da aplicação de lista de tarefas para a disciplina
        SPODWE2
      </div>
      <TodoFilter handleFilter={handleFilter} />
      <AddTodo addTodo={addTodo} />
      <ul id="todo-list">
        {filteredList.map((todo, index) => (
          <TodoItem key={index} todo={todo} markTodoAsDone={markTodoAsDone} />
        ))}
      </ul>
    </>
  );
};

export { TodoList };