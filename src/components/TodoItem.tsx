"use client";

import { Todo } from "@/store/useTodoStore";
import { deleteTodo, toggleTodo, updateTodo } from "@/lib/api";
import { useTodoStore } from "@/store/useTodoStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Trash2, Pen, Check, X } from "lucide-react";
import { useState } from "react";

export default function TodoItem({ todo }: { todo: Todo }) {
  const { todos, setTodos } = useTodoStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);
  const token = localStorage.getItem("token");

  const handleToggle = async () => {
    if (toggling) return;
    if (!token) {
      toast.error("You must be logged in to add a todo.");
      return;
    }
    setToggling(true);
    try {
      const res = await toggleTodo(todo.id, todo.completed, token);
      setTodos(todos.map((t) => (t.id === todo.id ? res.todos : t)));
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);
    if (!token) {
      toast.error("You must be logged in to add a todo.");
      return;
    }
    try {
      const res = await deleteTodo(todo.id, token);
      setTodos(todos.filter((t) => t.id !== todo.id));
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (editedTitle.trim() === todo.title.trim()) {
      toast.error("No changes were made");
      setIsEditing(false);
      return;
    }

    if (!editedTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    if (!token) {
      toast.error("You must be logged in to add a todo.");
      return;
    }
    setLoading(true);
    try {
      const res = await updateTodo(todo.id, editedTitle.trim(), token);
      setTodos(todos.map((t) => (t.id === todo.id ? res.todos : t)));
      toast.success(res.message);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center border px-4 py-2 rounded mb-2"
    >
      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="flex-1 mr-4 p-1 border rounded outline-none"
        />
      ) : (
        <span
          className={`flex-1 ${
            todo.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {todo.title}
        </span>
      )}

      <div className="flex gap-3 items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={toggling}
          className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
        />

        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={handleUpdate} disabled={loading}>
              <Check
                size={18}
                className="text-green-600 font-bold hover:scale-110 cursor-pointer"
              />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedTitle(todo.title); // reset changes
              }}
              disabled={loading}
            >
              <X size={18} className="text-red-500 hover:scale-110 cursor-pointer" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(true)} disabled={loading}>
              <Pen size={18} className="text-blue-500 hover:scale-110 cursor-pointer" />
            </button>
            <button onClick={handleDelete} disabled={loading}>
              <Trash2
                size={18}
                className={`${
                  loading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-500 hover:scale-110 cursor-pointer"
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
