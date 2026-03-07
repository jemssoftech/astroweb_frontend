"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Iconify from "@/src/components/Iconify";
import { getUser } from "@/src/lib/auth";

interface QuickLink {
  href: string;
  icon: string;
  iconColor: string;
  title: string;
  text: string;
  badge?: string;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
  iconBg: string;
}

export default function Home() {
  const [shuffledLinks, setShuffledLinks] = useState<QuickLink[]>([]);
  const [user] = useState<ReturnType<typeof getUser>>(() => getUser());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Stats data
  const stats: StatCard[] = [
    {
      title: "Total Readings",
      value: "2,847",
      change: "+12.5%",
      changeType: "positive",
      icon: "solar:chart-bold-duotone",
      iconBg: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+8.2%",
      changeType: "positive",
      icon: "solar:users-group-rounded-bold-duotone",
      iconBg: "bg-green-500/10 text-green-500",
    },
    {
      title: "Matches Made",
      value: "456",
      change: "+23.1%",
      changeType: "positive",
      icon: "solar:hearts-bold-duotone",
      iconBg: "bg-pink-500/10 text-pink-500",
    },
    {
      title: "Predictions",
      value: "892",
      change: "-2.4%",
      changeType: "negative",
      icon: "solar:star-bold-duotone",
      iconBg: "bg-amber-500/10 text-amber-500",
    },
  ];

  const quickLinks: QuickLink[] = [
    {
      href: "/playground/life-predictor",
      icon: "solar:calendar-bold-duotone",
      iconColor: "text-purple-500",
      title: "Life Predictor",
      text: "Know good and bad periods of your life years ahead",
      badge: "Popular",
    },
    {
      href: "/playground/horoscope",
      icon: "solar:sun-bold-duotone",
      iconColor: "text-orange-500",
      title: "Horoscope",
      text: "Predict a person's character, speech, body & general life",
    },
    {
      href: "/playground/match-checker",
      icon: "solar:hearts-bold-duotone",
      iconColor: "text-pink-500",
      title: "Match Checker",
      text: "Check astro chemistry for romance & relationship",
      badge: "New",
    },
    {
      href: "/playground/birth-chart",
      icon: "solar:planet-bold-duotone",
      iconColor: "text-blue-500",
      title: "Birth Chart",
      text: "Generate detailed Vedic birth chart analysis",
    },
    {
      href: "/playground/transit",
      icon: "solar:routing-bold-duotone",
      iconColor: "text-green-500",
      title: "Transits",
      text: "Track planetary movements and their effects",
    },
    {
      href: "/playground/remedies",
      icon: "solar:magic-stick-3-bold-duotone",
      iconColor: "text-amber-500",
      title: "Remedies",
      text: "Discover astrological remedies for life challenges",
    },
  ];

  const recentActivity = [
    {
      action: "Horoscope Generated",
      user: "John Doe",
      time: "2 minutes ago",
      icon: "solar:sun-bold-duotone",
      iconColor: "text-orange-500",
    },
    {
      action: "Match Analysis",
      user: "Jane Smith",
      time: "15 minutes ago",
      icon: "solar:hearts-bold-duotone",
      iconColor: "text-pink-500",
    },
    {
      action: "Life Prediction",
      user: "Mike Johnson",
      time: "1 hour ago",
      icon: "solar:calendar-bold-duotone",
      iconColor: "text-purple-500",
    },
    {
      action: "Birth Chart Created",
      user: "Sarah Wilson",
      time: "3 hours ago",
      icon: "solar:planet-bold-duotone",
      iconColor: "text-blue-500",
    },
  ];

  useEffect(() => {
    const shuffle = (array: QuickLink[]) => {
      let newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };
    setShuffledLinks(shuffle(quickLinks));

    // Update time every minute
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const displayLinks = shuffledLinks.length > 0 ? shuffledLinks : quickLinks;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* WELCOME HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/90 via-primary to-primary/80 rounded-2xl p-6 md:p-8 text-white shadow-lg">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-white/80 text-sm font-medium">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold mt-1">
                {getGreeting()}, {user?.name || "Welcome"}! 👋
              </h1>
              <p className="text-white/80 mt-2 max-w-xl">
                Explore the ancient wisdom of Vedic Astrology. Get personalized
                predictions and insights for your life journey.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/horoscope"
                className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Iconify icon="solar:sun-bold-duotone" width={20} height={20} />
                New Reading
              </Link>
              <a
                href="https://github.com/astroweb/astroweb"
                target="_blank"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/20"
              >
                <Iconify icon="mdi:github" width={20} height={20} />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-default"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                  <Iconify icon={stat.icon} width={24} height={24} />
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.changeType === "positive"
                      ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                      : stat.changeType === "negative"
                        ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-4 text-foreground">
                {stat.value}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* QUICK LINKS - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Iconify
                    icon="solar:widget-bold-duotone"
                    width={24}
                    height={24}
                    className="text-primary"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Quick Actions
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Access popular features
                  </p>
                </div>
              </div>
              <Link
                href="/features"
                className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
              >
                View All
                <Iconify
                  icon="solar:arrow-right-linear"
                  width={16}
                  height={16}
                />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayLinks.slice(0, 6).map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="group relative bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 hover:border-primary/50 overflow-hidden"
                >
                  {link.badge && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-primary text-white uppercase tracking-wider">
                      {link.badge}
                    </span>
                  )}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${link.iconColor}`}
                  >
                    <Iconify icon={link.icon} width={28} height={28} />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {link.text}
                  </p>
                  <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore
                    <Iconify
                      icon="solar:arrow-right-linear"
                      width={16}
                      height={16}
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* RECENT ACTIVITY */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Iconify
                    icon="solar:history-bold-duotone"
                    width={20}
                    height={20}
                    className="text-primary"
                  />
                  <h3 className="font-semibold text-foreground">
                    Recent Activity
                  </h3>
                </div>
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  View all
                </button>
              </div>
              <div className="divide-y divide-border">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg bg-muted ${activity.iconColor}`}
                      >
                        <Iconify icon={activity.icon} width={18} height={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activity.user}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DONATE CTA */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                  <Iconify icon="solar:heart-bold" width={24} height={24} />
                </div>
                <h3 className="font-bold text-lg">Support This Project</h3>
                <p className="text-white/80 text-sm mt-2">
                  Help us keep Vedic Astrology free and accessible to everyone.
                </p>
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold text-sm mt-4 hover:bg-white/90 transition-colors"
                >
                  <Iconify icon="iconoir:donate" width={18} height={18} />
                  Donate Now
                </Link>
              </div>
            </div>

            {/* OPEN SOURCE INFO */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-muted rounded-lg">
                  <Iconify
                    icon="mdi:github"
                    width={24}
                    height={24}
                    className="text-foreground"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Open Source</h3>
                  <p className="text-xs text-muted-foreground">MIT Licensed</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                This is a non-profit, open source project. Contributions are
                welcome!
              </p>
              <div className="flex gap-2">
                <a
                  href="https://github.com/astroweb/astroweb"
                  target="_blank"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-foreground text-background px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Iconify icon="solar:star-bold" width={16} height={16} />
                  Star
                </a>
                <a
                  href="https://github.com/astroweb/astroweb/fork"
                  target="_blank"
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-border text-foreground px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Iconify icon="solar:copy-bold" width={16} height={16} />
                  Fork
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src="/horozontal_logo.png"
                alt="AstroWeb Logo"
                className="h-12 w-auto object-contain"
              />
              <div>
                <h3 className="font-bold text-foreground">AstroWeb</h3>
                <p className="text-sm text-muted-foreground">
                  Making Vedic Astrology accessible to all
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Iconify
                  icon="mdi:twitter"
                  width={20}
                  height={20}
                  className="text-muted-foreground hover:text-foreground"
                />
              </a>
              <a
                href="#"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Iconify
                  icon="mdi:discord"
                  width={20}
                  height={20}
                  className="text-muted-foreground hover:text-foreground"
                />
              </a>
              <a
                href="https://github.com/astroweb/astroweb"
                target="_blank"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Iconify
                  icon="mdi:github"
                  width={20}
                  height={20}
                  className="text-muted-foreground hover:text-foreground"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
