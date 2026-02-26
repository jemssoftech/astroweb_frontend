"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MobileInput from "./MobileInput";
import OtpInput from "./OtpInput";

export default function LoginModule() {
  const router = useRouter();
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationId, setverificationId] = useState("");

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
      const userAuth = data;
      if (userAuth.status === 1 || userAuth.data?.status === 1) {
        // We now also receive the user tokens through data.userAuth from the proxy route

        console.log("OTP Verified! User Auth Payload:", userAuth);
        const payload = {
          mobileNumber: userAuth?.data?.mobileNumber,
          email: "admin@gmail.com",
          role: "user",
        };
        try {
          const response = await fetch("/api/user", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          const data = await response.json();
          console.log("User API Response:", data);

          if (data.accessToken) {
            // Store tokens in cookies
            document.cookie = `accessToken=${data.accessToken}; path=/; max-age=7200; Secure; SameSite=Lax`;
            if (data.refreshToken) {
              document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=86400; Secure; SameSite=Lax`;
            }
            if (data.user) {
              // Store user details in localStorage
              localStorage.setItem("user", JSON.stringify(data.user));
            }

            toast.success(
              data.message || userAuth.message || "Successfully logged in!",
            );

            // Redirect to home/dashboard
            router.push("/dashboard");
          } else if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(userAuth.message);
          }
        } catch (error) {
          console.log(error);
          toast.success(userAuth.message);
        }
      } else {
        toast.error(
          userAuth.message || userAuth.data?.message || "Invalid OTP",
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    // Simulate resend API call
    try {
      const payload = {
        countryCode: "91",
        fcm: Math.random().toString(36).substring(2, 12), // Auto-generates a random 10-character alphanumeric string
        mobileNumber: mobileNumber,
        user_type: "vendor",
        isMobile: true,
      };
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.status === 1) {
        toast.success("OTP Resent!");
        setverificationId(data?.verificationId);
        setLoading(false);
        setStep("otp");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
    <div className="container xl:max-w-[1440px] mx-auto bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px] relative">
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
