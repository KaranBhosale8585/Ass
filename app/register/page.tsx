"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";
import Header from "@/components/Header";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: !form.name.trim(),
      email: !form.email.trim(),
      password: !form.password.trim(),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      setMsg("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMsg(data.message || data.error);

      if (res.ok) {
        router.push("/login");
      }
    } catch {
      setMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
        <div className="w-full max-w-md border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    setErrors({ ...errors, name: false });
                  }}
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:border-black`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">Name is required.</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setErrors({ ...errors, email: false });
                  }}
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:border-black`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">Email is required.</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setErrors({ ...errors, password: false });
                  }}
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:border-black`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  Password is required.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-900 transition"
            >
              Sign Up
            </button>
          </form>

          {msg && (
            <p className="text-sm text-center mt-4 text-red-600">{msg}</p>
          )}

          <div className="text-sm text-center mt-6 text-gray-700">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline hover:text-black transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
