type OTPRecord = {
  otp: string;
  expires: number;
};

declare global {
  var otpStore: Map<string, OTPRecord> | undefined;
}

export const otpStore: Map<string, OTPRecord> = global.otpStore || new Map();

if (process.env.NODE_ENV !== "production") {
  global.otpStore = otpStore;
}
