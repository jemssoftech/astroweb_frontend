import LoginModule from "@/src/components/auth/LoginModule";

export const metadata = {
  title: "Login | Astrology Learning",
  description: "Login securely with Mobile Number and OTP",
};

export default function LoginPage() {
  return (
    <div className="min-h-[100vh] bg-[#0F172A] flex items-center justify-center p-4">
      <LoginModule />
    </div>
  );
}
