import DesktopSidebar from "@/src/components/DesktopSidebar";
import PageFooter from "@/src/components/PageFooter";
import PageTopNavbar from "@/src/components/PageTopNavbar";
import { ThemeProvider } from "@/src/components/theme-provider";

import { Public_Sans } from "next/font/google";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="en">
      <div
        className={`antialiased min-h-screen flex flex-col w-full h-full font-sans m-0 p-0 ${publicSans.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className={`${publicSans.className}`}
            style={{
              backgroundColor: "var(--background)",
              margin: 0,
              padding: 0,
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <div className="flex h-screen overflow-hidden">
              <DesktopSidebar />
              <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <PageTopNavbar />
                {/* Main Content - Independent scroll */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  <main className="container mx-auto lg:w-full pt-16 mt-4 px-4">
                    {children}
                  </main>
                  <div className="container mx-auto px-4">
                    <PageFooter />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </div>
    </div>
  );
}
