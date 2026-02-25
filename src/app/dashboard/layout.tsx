"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/dashboard/Sidebar";
import { getAuthToken, getUser } from "@/src/lib/auth";

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

  if (!isAuthenticated) return null; // Prevent flicker before redirect

  return (
    <div className="flex h-screen w-full bg-[#ecf0f5] font-sans antialiased overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
