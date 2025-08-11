"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/api";
import { Mail, Lock, Loader2 } from "lucide-react";

const authSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});
type AuthSchema = z.infer<typeof authSchema>;

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthSchema) => {
    if (loading) return;
    setLoading(true);
    try {
      if (isLogin) {
        const res = await loginUser(data.email, data.password);
        localStorage.setItem("token", res.token);
        toast.success("Logged in successfully!");
        router.refresh();
        router.push("/");
      } else {
        const res = await registerUser(data.email, data.password);
        localStorage.setItem("token", res.user.token);
        toast.success(res.message || "Registration successful!");
        setIsLogin(true);
      }
      reset();
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const passwordAuto = isLogin ? "current-password" : "new-password";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur sm:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isLogin ? "Please sign in to continue" : "Join us to get started"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pl-10 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              />
            </div>
            {errors?.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder={isLogin ? "Your password" : "Create a password"}
                autoComplete={passwordAuto}
                aria-invalid={!!errors.password}
                {...register("password")}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pl-10 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              />
            </div>
            {errors?.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 font-semibold text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLogin ? "Login" : "Register"}
          </motion.button>

          <p className="text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-blue-600 underline-offset-4 hover:text-blue-700 hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}