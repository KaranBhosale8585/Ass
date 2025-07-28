"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

// Helper to mask email
const maskEmail = (email: string) => {
  const [user, domain] = email.split("@");
  const maskedUser = user.length > 1 ? user[0] + "***" : "*";
  return `${maskedUser}@${domain}`;
};

export default function OtpLogin() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const router = useRouter();

  const sendOtp = async () => {
    if (!email || !email.includes("@"))
      return toast.error("Enter a valid email.");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "OTP sent to your email");
        setStep("otp");
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 4) return toast.error("Enter a valid OTP.");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Login successful!");
        router.replace("/");
      } else {
        toast.error(data.error || "OTP verification failed.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-1">Sign In</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Login to access your account.
        </p>

        {/* Email Field - Always Visible */}
        <label className="block text-sm mb-1 font-medium" htmlFor="email">
          Email
        </label>
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 pr-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || step === "otp"} // disable if OTP is being entered
          />
        </div>

        {/* Send OTP Button - Only show if step is email */}
        {step === "email" && (
          <button
            onClick={sendOtp}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 mb-4"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {/* OTP Section - Shown after email is submitted */}
        {step === "otp" && (
          <>
            <div className="mb-3 text-sm text-green-600">
              OTP sent to <strong>{maskEmail(email)}</strong>
            </div>

            <label className="block text-sm mb-1 font-medium" htmlFor="otp">
              OTP
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />

            <div className="flex justify-between items-center text-sm mb-4">
              <button
                onClick={sendOtp}
                className="text-blue-600 hover:underline"
                type="button"
                disabled={loading}
              >
                Resend OTP
              </button>
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                  className="h-4 w-4"
                />
                Keep me logged in
              </label>
            </div>

            <button
              onClick={verifyOtp}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Sign in"}
            </button>
          </>
        )}

        <p className="text-sm text-center mt-4 text-gray-500">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
