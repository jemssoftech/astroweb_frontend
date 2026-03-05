"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/dashboard/Sidebar";
import { getAuthToken, getUser, logout } from "@/src/lib/auth";
import { useSocket } from "@/src/context/SocketContext";
import DashboardNavbar from "@/src/components/dashboard/DashboardNavbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { socket, isConnected } = useSocket();

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

  // Socket: Token Verification
  useEffect(() => {
    // Only attempt verification if authenticated via basic checks and connected to socket
    if (isAuthenticated && isConnected && socket) {
      const token = getAuthToken();
      if (token) {
        // Emit verification event
        // Backend could respond via acknowledgment callback
        socket.emit(
          "verify-access-token",
          { token },
          (response: { valid?: boolean }) => {
            if (response && response.valid === false) {
              handleInvalidToken();
            }
          },
        );

        // Or backend could emit 'token-invalid' / 'access-token-invalid'
        const onTokenInvalid = () => {
          handleInvalidToken();
        };

        const onTokenResponse = (response: {
          valid?: boolean;
          status?: number;
          message?: string;
        }) => {
          if (
            response &&
            (response.valid === false ||
              response.status === 401 ||
              response.message === "Invalid token")
          ) {
            handleInvalidToken();
          }
        };

        socket.on("token-invalid", onTokenInvalid);
        socket.on("access-token-invalid", onTokenInvalid);
        socket.on("verify-access-token-response", onTokenResponse);

        return () => {
          socket.off("token-invalid", onTokenInvalid);
          socket.off("access-token-invalid", onTokenInvalid);
          socket.off("verify-access-token-response", onTokenResponse);
        };
      }
    }
  }, [isAuthenticated, isConnected, socket, handleInvalidToken]);

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
