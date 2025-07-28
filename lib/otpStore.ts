// lib/otpStore.ts

type OTPRecord = {
  otp: string;
  expires: number;
};

// Declare global to prevent hot reload issues in dev
declare global {
  var otpStore: Map<string, OTPRecord> | undefined;
}

// Create or reuse the global store
export const otpStore: Map<string, OTPRecord> = global.otpStore || new Map();

if (process.env.NODE_ENV !== "production") {
  global.otpStore = otpStore;
}
