// pages/signup.tsx
"use client";

import { useState } from "react";
import { Mail, User } from "lucide-react";
import Link from "next/link";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [msg, setMsg] = useState("");

  const sendOtp = async () => {
    if (!form.name || !form.email) return setMsg("All fields are required.");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMsg(data.message || data.error);
    if (res.ok) setStep("otp");
  };

  const verifyOtp = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, otp }),
    });
    const data = await res.json();
    setMsg(data.message || data.error);
    if (res.ok) window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md border rounded-xl shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {step === "form" ? "Sign up" : "Verify OTP"}
        </h2>

        {step === "form" ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="pl-10 w-full py-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="Email address"
                    className="pl-10 w-full py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={sendOtp}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition"
            >
              Get OTP
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full py-2 px-3 border rounded-md"
              />
            </div>
            <button
              onClick={verifyOtp}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900"
            >
              Verify OTP
            </button>
          </>
        )}

        {msg && <p className="mt-4 text-center text-sm text-red-600">{msg}</p>}

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-black">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
