"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/dashboard/Sidebar";
import { getAuthToken, getUser, logout } from "@/src/lib/auth";
import DashboardNavbar from "@/src/components/dashboard/DashboardNavbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      // Defer execution to the next microtask to avoid synchronous state updates
      // during the effect execution (which causes the cascading render warning).
      await Promise.resolve();

      const token = getAuthToken();
      const user = getUser();

      if (!token || !user) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    };

    verifyAuth();
  }, [router]);

  const handleInvalidToken = React.useCallback(() => {
    console.warn("Socket: Token is invalid. Logging out.");
    logout();
    router.push("/login");
  }, [router]);

  // API: Token Verification
  useEffect(() => {
    if (isAuthenticated) {
      const token = getAuthToken();
      if (token) {
        import("@/src/lib/api").then(({ default: api }) => {
          api
            .post("/api/auth.web/verify-token", { token })
            .then((res) => {
              if (res.data && res.data.valid === false) {
                handleInvalidToken();
              }
            })
            .catch((err) => {
              console.error("Token verification failed:", err);
              // Optional: handle failed verification (e.g., 401)
              if (err.response?.status === 401) {
                handleInvalidToken();
              }
            });
        });
      }
    }
  }, [isAuthenticated, handleInvalidToken]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) return null; // Prevent flicker before redirect

  return (
    <div
      className={`flex h-screen w-full bg-[#ecf0f5] dark:bg-slate-950 font-sans antialiased overflow-hidden transition-colors duration-300`}
    >
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-y-auto relative">
        <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        {/* Backdrop when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
