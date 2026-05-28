"use client";

import { useEffect, useState } from "react";

interface Todo {
  id: number;
  title: string;
}

export default function DataFetcher() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul className="list-disc ml-5 mt-4">
      {todos.map((todo) => (
        <li key={todo.id} className="text-zinc-600 dark:text-zinc-400">
          {todo.title}
        </li>
      ))}
    </ul>
  );
}
