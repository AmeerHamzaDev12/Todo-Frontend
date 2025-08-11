"use client";

import { useEffect, useState } from "react";
import { fetchTodos } from "@/lib/api";
import { useTodoStore } from "@/store/useTodoStore";
import TodoForm from "@/components/TodoForm";
import TodoItem from "@/components/TodoItem";
import AuthForm from "@/components/RegForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function HomePage() {
  const { todos, setTodos } = useTodoStore();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!token) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await fetchTodos(token);
        if (data.success === false) {
          toast.error(data.message);
          setIsAuthorized(false);
          localStorage.removeItem("token");
          router.push("/login");
          setLoading(false);
          return;
        }
        toast.success(data.message || "Todos loaded");
        setTodos(data.todos);
        setIsAuthorized(true);
      } catch (err: any) {
        toast.error(err.message || "Failed to load todos");
        setIsAuthorized(false);
        localStorage.removeItem("token");
        setLoading(false);
      }
    })();
  }, [token, setTodos]);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthorized(false);
    router.push("/login");
    toast.success("Logged out successfully!");
  };
  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AuthForm />
      </div>
    );
  }
  if (loading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-bold text-5xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto mt-10 p-4">
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2 mx-120"
        aria-label="Logout"
        title="Logout"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
      <h1 className="text-2xl font-bold mb-4">📝 My Todo App</h1>
      
      <TodoForm />
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </main>
  );
}
