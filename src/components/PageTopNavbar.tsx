"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { getUser, logout } from "@/src/lib/auth";
import Iconify from "./Iconify";

interface NavLink {
  icon?: string;
  text: string;
  href: string;
  target?: string;
  badge?: string;
}

export default function PageTopNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const mounted = useSyncExternalStore(
    () => {
      // hydration doesn't change after first mount
      return () => {};
    },
    () => true,
    () => false,
  );

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  const user = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => getUser(),
    () => null,
  );

  const isAuthenticated = user !== null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const routes: Record<string, string> = {
      "/": "Dashboard",
      "/horoscope": "Horoscope",
      "/match-checker": "Match Checker",
      "/numerology": "Numerology",
      "/life-predictor": "Life Predictor",
      "/api-builder": "API Builder",
      "/donate": "Donate",
      "/contact-us": "Contact Us",
      "/about": "About",
      "/person-list": "Person List",
    };
    return routes[pathname] || "Page";
  };

  const quickLinks: NavLink[] = [
    {
      icon: "carbon:gateway-api",
      text: "API",
      href: "/api-builder",
      badge: "New",
    },
    { icon: "openmoji:love-letter", text: "Donate", href: "/donate" },
    { icon: "heroicons-outline:mail", text: "Contact", href: "/contact-us" },
  ];

  const mobileLinks: NavLink[] = [
    { icon: "mdi:home", text: "Home", href: "/" },
    {
      icon: "fluent:book-star-20-filled",
      text: "Horoscope",
      href: "/horoscope",
    },
    {
      icon: "bi:arrow-through-heart-fill",
      text: "Match",
      href: "/match-checker",
    },
    { icon: "mdi:numbers", text: "Numerology", href: "/numerology" },
    { icon: "gis:map-time", text: "Life Predictor", href: "/life-predictor" },
  ];

  const profileLinks: NavLink[] = [
    {
      icon: "mdi:account-outline",
      text: "Profile",
      href: "/dashboard/profile",
    },

    {
      icon: "line-md:list",
      text: "Person List",
      href: "/dashboard/person-list",
    },
  ];

  const notifications = [
    {
      id: 1,
      icon: "mdi:star",
      title: "New Horoscope",
      description: "Daily horoscope ready",
      time: "2m",
      unread: true,
    },
    {
      id: 2,
      icon: "mdi:heart",
      title: "Match Result",
      description: "Compatibility report ready",
      time: "1h",
      unread: true,
    },
    {
      id: 3,
      icon: "mdi:update",
      title: "Update",
      description: "New features added",
      time: "1d",
      unread: false,
    },
  ];
  console.log(user);
  return (
    <>
      <nav className="sticky top-0 z-40 w-full transition-all duration-300 border-b border-white/5 bg-card backdrop-blur-2xl">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 gap-4 max-w-(--breakpoint-2xl) mx-auto">
          {/* Left Section: Logo & Breadcrumbs */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all active:scale-95"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Iconify
                icon={isMenuOpen ? "tabler:x" : "tabler:menu-2"}
                className="w-6 h-6"
              />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
              <Link
                href="/"
                className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
              >
                <Iconify icon="tabler:home" className="w-5 h-5" />
              </Link>
              <Iconify
                icon="tabler:chevron-right"
                className="w-4 h-4 text-muted-foreground/40"
              />
              <span className="px-3 py-1 bg-primary/5 text-primary rounded-lg border border-primary/10 truncate">
                {getPageTitle()}
              </span>
            </div>

            <h1 className="sm:hidden font-bold text-lg truncate bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
          </div>

          {/* Center: Hero Search */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Iconify
                  icon="tabler:search"
                  className="w-5 h-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-12 py-2.5 bg-accent/40 hover:bg-accent/60 focus:bg-background rounded-2xl text-sm border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-flex items-center gap-1 h-6 px-1.5 font-mono text-[10px] font-medium text-muted-foreground/60 bg-background border border-border rounded-md">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all active:scale-95"
            >
              <Iconify icon="tabler:search" className="w-6 h-6" />
            </button>

            <div className="hidden lg:flex items-center gap-1">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                    pathname === link.href
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {link.icon && (
                    <Iconify icon={link.icon as string} className="w-4 h-4" />
                  )}
                  <span>{link.text}</span>
                  {link.badge && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="w-px h-6 bg-border/60 mx-1 hidden sm:block" />

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all active:scale-95 relative group"
              aria-label="Toggle theme"
            >
              {mounted ? (
                <div className="relative w-6 h-6">
                  <motion.div
                    initial={false}
                    animate={{
                      rotate: theme === "dark" ? 0 : 90,
                      opacity: theme === "dark" ? 1 : 0,
                    }}
                    className="absolute inset-0"
                  >
                    <Iconify icon="tabler:moon" className="w-6 h-6" />
                  </motion.div>
                  <motion.div
                    initial={false}
                    animate={{
                      rotate: theme === "light" ? 0 : -90,
                      opacity: theme === "light" ? 1 : 0,
                    }}
                    className="absolute inset-0"
                  >
                    <Iconify icon="tabler:sun" className="w-6 h-6" />
                  </motion.div>
                </div>
              ) : (
                <Iconify
                  icon="tabler:loader"
                  className="w-6 h-6 animate-spin opacity-20"
                />
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`p-2.5 rounded-xl transition-all active:scale-95 relative group ${
                  isNotificationOpen
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                }`}
              >
                <Iconify icon="tabler:bell" className="w-6 h-6" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background ring-4 ring-primary/5" />
              </button>

              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 bg-card/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-5 py-4 border-b border-white/5 bg-linear-to-br from-primary/10 to-transparent">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">Notifications</span>
                        <button className="text-xs font-bold text-primary hover:underline">
                          Mark all read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 cursor-pointer transition-colors group ${n.unread ? "bg-primary/5" : ""}`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${n.unread ? "bg-primary/10 text-primary" : "bg-accent text-muted-foreground"}`}
                          >
                            <Iconify icon={n.icon} className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                              {n.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {n.description}
                            </p>
                            <span className="text-[10px] font-medium text-muted-foreground/60 mt-2 block">
                              {n.time} ago
                            </span>
                          </div>
                          {n.unread && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary self-center" />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-white/5 text-center bg-accent/30">
                      <Link
                        href="/notifications"
                        className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1.5"
                        onClick={() => setIsNotificationOpen(false)}
                      >
                        See all notifications
                        <Iconify
                          icon="tabler:arrow-right"
                          className="w-3.5 h-3.5"
                        />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Section */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-primary/10 transition-all active:scale-95 group"
                aria-label="User Profile"
              >
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 ring-2 ring-transparent group-aria-expanded:ring-primary/30 transition-all">
                  <span className="text-xs font-bold text-white uppercase">
                    {user?.username?.charAt(0) || "G"}
                  </span>
                </div>
                <Iconify
                  icon="tabler:chevron-down"
                  className={`hidden sm:block w-4 h-4 text-muted-foreground transition-transform duration-300 ${isProfileOpen ? "rotate-180 text-primary" : "group-hover:text-primary"}`}
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-64 bg-card/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-5 border-b border-white/5 bg-linear-to-br from-primary/10 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl ring-2 ring-white/20">
                          <span className="text-lg font-bold text-white">
                            {user?.username?.charAt(0) || "G"}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">
                            {user?.username || "Guest"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user?.userEmail || "Welcome!"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 space-y-0.5">
                      {profileLinks.map((link, index) => (
                        <Link
                          key={index}
                          href={link.href}
                          target={link.target}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                            {link.icon && (
                              <Iconify icon={link.icon} className="w-4 h-4" />
                            )}
                          </div>
                          <span className="flex-1">{link.text}</span>
                          {link.target === "_blank" && (
                            <Iconify
                              icon="tabler:external-link"
                              className="w-3.5 h-3.5 opacity-40"
                            />
                          )}
                        </Link>
                      ))}
                    </div>

                    <div className="p-2 border-t border-white/5 bg-accent/30">
                      {isAuthenticated ? (
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 w-full transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                            <Iconify icon="tabler:logout" className="w-4 h-4" />
                          </div>
                          Logout
                        </button>
                      ) : (
                        <Link
                          href="/login"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-primary hover:bg-primary/10 w-full transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Iconify icon="tabler:login" className="w-4 h-4" />
                          </div>
                          Login
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden px-4 pb-4 overflow-hidden"
            >
              <div className="relative">
                <Iconify
                  icon="tabler:search"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-accent/60 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/20 transition-all font-medium"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 h-full w-80 bg-card border-r border-white/10 z-51 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <Link
                  href="/"
                  className="flex items-center gap-3 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center p-2 shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform">
                    <img
                      src="/image/logo.png"
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-bold text-xl tracking-tight">
                    AstroWeb
                  </span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all active:scale-95"
                >
                  <Iconify icon="tabler:x" className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
                <div className="space-y-1">
                  <p className="px-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-2">
                    Main Menu
                  </p>
                  {mobileLinks.map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all group ${
                        pathname === link.href
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          pathname === link.href
                            ? "bg-white/20"
                            : "bg-accent/40 group-hover:bg-primary/20"
                        }`}
                      >
                        {link.icon && (
                          <Iconify icon={link.icon} className="w-5 h-5" />
                        )}
                      </div>
                      <span className="flex-1">{link.text}</span>
                      <Iconify
                        icon="tabler:chevron-right"
                        className={`w-4 h-4 opacity-20 ${pathname === link.href ? "opacity-100" : ""}`}
                      />
                    </Link>
                  ))}
                </div>

                <div className="space-y-1">
                  <p className="px-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-2">
                    Quick Access
                  </p>
                  {quickLinks.map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all group ${
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-primary/5 text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/40 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        {link.icon && (
                          <Iconify
                            icon={link.icon as string}
                            className="w-5 h-5"
                          />
                        )}
                      </div>
                      <span className="flex-1">{link.text}</span>
                      {link.badge && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-primary text-white rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-white/5 bg-accent/20">
                <div className="bg-card/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                    <span className="font-bold text-white text-sm">
                      {user?.username?.charAt(0) || "G"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {user?.username || "Guest"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate italic">
                      Enjoy AstroWeb!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
