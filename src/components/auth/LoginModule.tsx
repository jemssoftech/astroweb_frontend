"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MobileInput from "./MobileInput";
import OtpInput from "./OtpInput";

export default function LoginModule() {
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationId, setverificationId] = useState("");
  console.log(verificationId || "");
  // Placeholder API function for sending OTP
  const sendOtp = async (number: string) => {
    setLoading(true);
    setMobileNumber(number);
    // Simulate API call
    const payload = {
      countryCode: "91",
      fcm: Math.random().toString(36).substring(2, 12), // Auto-generates a random 10-character alphanumeric string
      mobileNumber: number,
      user_type: "vendor",
      isMobile: true,
    };
    try {
      const response = await fetch("/api/login", {
        method: "POST",

        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.status === 1) {
        setverificationId(data?.verificationId);
        setLoading(false);
        setStep("otp");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Placeholder API function for verifying OTP
  const verifyOtp = async (otp: string) => {
    setLoading(true);
    const payload = {
      countryCode: "91",
      mobileNumber: mobileNumber,
      verificationId: verificationId,
      code: otp,
    };
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log(data);

      if (data.status === 1) {
        // After successful verification, you would typically redirect or update global auth state
        console.log("OTP Verified for", mobileNumber, "with OTP", otp);
        alert("Login successful!");
        // You might want to close a modal or redirect user here.
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    // Simulate resend API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    alert("OTP Resent!");
  };

  const goBack = () => {
    setStep("mobile");
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px] relative">
      <AnimatePresence mode="wait">
        {step === "mobile" ? (
          <motion.div
            key="mobile"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <MobileInput
              onSendOtp={sendOtp}
              loading={loading}
              initialNumber={mobileNumber}
            />
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-full h-full"
          >
            <OtpInput
              mobileNumber={mobileNumber}
              onVerifyOtp={verifyOtp}
              loading={loading}
              onResend={handleResend}
              onBack={goBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
