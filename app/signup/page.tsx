"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, User } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const sendOtp = async () => {
    if (!form.name || !form.email) {
      setMsg("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMsg(data.message || data.error);

      if (res.ok) {
        if (data.userExists) {
          setMsg("Account already exists. Redirecting to login...");
          setTimeout(() => router.replace("/login"), 2000);
        } else {
          setStep("otp");
        }
      }
    } catch (error) {
      setMsg("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setMsg("Enter a valid OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp, name: form.name }),
      });

      const data = await res.json();
      setMsg(data.message || data.error);

      if (res.ok) {
        router.replace("/");
      }
    } catch (error) {
      setMsg("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-sm bg-white border border-gray-300 rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-1">Create Account</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          {step === "form"
            ? "Sign up with your email."
            : `OTP sent to ${form.email}`}
        </p>

        {/* Name Input */}
        <label className="block text-sm mb-1 font-medium">Name</label>
        <div className="relative mb-4">
          <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="pl-10 pr-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
            disabled={step === "otp"} // disable after sending OTP
          />
        </div>

        {/* Email Input */}
        <label className="block text-sm mb-1 font-medium">Email</label>
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="pl-10 pr-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
            disabled={step === "otp"} // disable after sending OTP
          />
        </div>

        {/* OTP Input */}
        {step === "otp" && (
          <>
            <label className="block text-sm mb-1 font-medium mt-2">OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-black"
              disabled={loading}
            />

            {/* Resend OTP button */}
            <button
              onClick={sendOtp}
              className="text-sm text-blue-600 hover:underline mb-4"
              disabled={loading}
            >
              Resend OTP
            </button>
          </>
        )}

        {/* Button */}
        <button
          onClick={step === "form" ? sendOtp : verifyOtp}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading
            ? step === "form"
              ? "Sending OTP..."
              : "Verifying..."
            : step === "form"
            ? "Get OTP"
            : "Verify OTP"}
        </button>

        {/* Message */}
        {msg && (
          <p
            className={`mt-4 text-center text-sm ${
              msg.toLowerCase().includes("error") ||
              msg.toLowerCase().includes("fail")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {msg}
          </p>
        )}

        {/* Already have account */}
        <p className="text-sm text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-black underline hover:text-gray-900">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
