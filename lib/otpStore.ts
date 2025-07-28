type OTPRecord = {
  otp: string;
  expires: number;
};

export const otpStore = new Map<string, OTPRecord>();
