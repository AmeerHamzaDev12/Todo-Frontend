"use client";
import { string, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTodo } from "@/lib/api";
import { useTodoStore } from "@/store/useTodoStore";
import toast from "react-hot-toast";
import { useState } from "react";

const schema = z.object({
  title: z.string().min(1, "Text is required"),
});

type FormData = z.infer<typeof schema>;

export default function TodoForm() {
  const { todos, setTodos } = useTodoStore();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const titleValue = watch("title");

  const onSubmit = async (data: FormData) => {
    if (loading) return;
    if (!token) {
    toast.error("You must be logged in to add a todo.");
    return;
  }
    setLoading(true);
    try {
      const res = await addTodo(data.title,token);
      setTodos([res.todo, ...todos]);
      reset();
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mb-4">
      <div className="w-full">
        <input
          {...register("title")}
          className="w-full border p-2 rounded"
          placeholder="Add a todo..."
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || !titleValue || titleValue.trim() === ''}
        className="h-10 px-4 py-2 rounded text-white transition 
            disabled:bg-gray-400 disabled:cursor-not-allowed
            bg-blue-600 hover:bg-blue-700"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
