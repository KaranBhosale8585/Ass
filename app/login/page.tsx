"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

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
  const [msg, setMsg] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const router = useRouter();

  const sendOtp = async () => {
    if (!email || !email.includes("@")) {
      return setMsg({ text: "Enter a valid email address.", type: "error" });
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.status === 404 && !data.userExists) {
        setMsg({
          text: "No account found. Redirecting to signup...",
          type: "error",
        });
        setTimeout(() => router.replace("/signup"), 2000);
        return;
      }

      if (res.ok) {
        setMsg({ text: "OTP has been sent to your email.", type: "success" });
        setStep("otp");
      } else {
        setMsg({ text: data.error || "Failed to send OTP.", type: "error" });
      }
    } catch {
      setMsg({
        text: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      return setMsg({ text: "Enter a valid OTP.", type: "error" });
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        router.replace("/");
      } else {
        setMsg({
          text: data.error || "OTP verification failed.",
          type: "error",
        });
      }
    } catch {
      setMsg({
        text: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white text-black">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm border border-gray-200 rounded-lg shadow p-6 bg-white">
          <h2 className="text-2xl font-semibold text-center mb-2">Sign In</h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Please login to continue to your account.
          </p>

          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full py-2 border border-gray-300 rounded-md bg-white"
              disabled={loading || step === "otp"}
            />
          </div>

          {step === "email" && (
            <button
              onClick={sendOtp}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition mb-4 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          )}

          {step === "otp" && (
            <>
              <p className="mb-2 text-sm text-gray-600">
                OTP sent to <strong>{maskEmail(email)}</strong>
              </p>

              <label className="block text-sm font-medium mb-1">OTP</label>
              <input
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 bg-white"
                disabled={loading}
              />

              <div className="flex justify-between items-center text-sm mb-4">
                <button
                  onClick={sendOtp}
                  className="text-black underline hover:text-gray-700"
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
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Sign In"}
              </button>
            </>
          )}

          {msg && (
            <p
              className={`mt-4 text-center text-sm whitespace-pre-wrap ${
                msg.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {msg.text}
            </p>
          )}

          <p className="text-sm text-center mt-4 text-gray-500">
            Don’t have an account?{" "}
            <a href="/signup" className="underline hover:text-black">
              Create one
            </a>
          </p>
        </div>
      </div>

      {/* Image Section (Only visible on desktop) */}
      <div className="hidden md:block md:w-1/2 h-full">
        <img
        src="/Illustration.png"
        alt="Sign In Illustration"
        className="w-full h-[100vh] object-cover rounded-l-lg"
      />
      </div>
    </div>
  );
}
