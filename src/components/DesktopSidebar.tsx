"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import Iconify from "./Iconify";
import { getNavigationLinks, type NavLink } from "@/src/lib/navigationConfig";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const links = useMemo(() => getNavigationLinks(), []);

  const toggleMenu = (text: string) => {
    setOpenMenus((prev) =>
      prev.includes(text) ? prev.filter((t) => t !== text) : [...prev, text],
    );
  };

  const isChildActive = (children: NavLink[] | undefined): boolean => {
    if (!children) return false;
    return children.some((child) => child.url === pathname);
  };

  const renderNavItem = (link: NavLink, index: number) => {
    const hasChildren = link.children && link.children.length > 0;
    const isOpen = openMenus.includes(link.text);
    const isActive = link.url === pathname;
    const isParentActive = isChildActive(link.children);

    // Auto-open menu if child is active
    if (isParentActive && !openMenus.includes(link.text)) {
      setOpenMenus((prev) => [...prev, link.text]);
    }

    if (hasChildren) {
      return (
        <li key={index}>
          <button
            onClick={() => toggleMenu(link.text)}
            className={`sidebar-btn w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
              isParentActive
                ? "sidebar-btn-active-parent"
                : "sidebar-btn-default"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`sidebar-icon-wrap ${
                  isParentActive
                    ? "sidebar-icon-active"
                    : "sidebar-icon-default"
                }`}
              >
                <Iconify icon={link.icon} className="text-base" />
              </span>
              <span className="text-sm font-medium tracking-wide">
                {link.text}
              </span>
            </div>
            <Iconify
              icon="mdi:chevron-down"
              className={`text-base transition-transform duration-300 opacity-60 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Submenu */}
          <ul
            className={`mt-1 ml-3 pl-3 border-l border-white/10 space-y-0.5 overflow-hidden transition-all duration-300 ${
              isOpen ? "max-h-[500px] opacity-100 pb-2" : "max-h-0 opacity-0"
            }`}
          >
            {link.children?.map((child, childIndex) => {
              const isChildItemActive = child.url === pathname;
              return (
                <li key={childIndex}>
                  <Link
                    href={child.url || "#"}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                      isChildItemActive
                        ? "sidebar-child-active"
                        : "sidebar-child-default"
                    }`}
                  >
                    <Iconify icon={child.icon} className="text-sm opacity-80" />
                    <span>{child.text}</span>
                    {isChildItemActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      );
    }

    return (
      <li key={index}>
        <Link
          href={link.url || "#"}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
            isActive ? "sidebar-link-active" : "sidebar-link-default"
          }`}
          aria-current={isActive ? "page" : undefined}
        >
          <span
            className={`sidebar-icon-wrap ${
              isActive ? "sidebar-icon-active" : "sidebar-icon-default"
            }`}
          >
            <Iconify icon={link.icon} className="text-base" />
          </span>
          <span className="text-sm font-medium tracking-wide">{link.text}</span>
          {isActive && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary sidebar-dot-glow" />
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      <style>{`
        .sidebar-root {
          width: 268px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: var(--card);
          border-right: 1px solid var(--border);
          flex-shrink: 0;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        /* Brand header */
        .sidebar-brand {
          padding: 20px 16px 16px;
          border-bottom: 1px solid var(--border);
        }
        .sidebar-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          padding: 6px 8px;
          border-radius: 12px;
          transition: background 0.2s;
        }
        .sidebar-logo-wrap:hover {
          background: rgba(249,115,22,0.07);
        }
        .sidebar-logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--primary) 0%, #c2410c 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 14px rgba(249,115,22,0.2);
          flex-shrink: 0;
        }
        .sidebar-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }
        .sidebar-brand-main {
          font-size: 17px;
          font-weight: 700;
          color: var(--foreground);
          letter-spacing: -0.3px;
        }
        .sidebar-brand-sub {
          font-size: 10px;
          color: var(--primary);
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        /* Nav scroll area */
        .sidebar-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 12px 10px;
          scrollbar-width: thin;
          scrollbar-color: rgba(249,115,22,0.2) transparent;
        }
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(249,115,22,0.18);
          border-radius: 99px;
        }

        /* Nav list */
        .sidebar-nav { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }

        /* Icon wrapper */
        .sidebar-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .sidebar-icon-default {
          background: var(--accent);
          color: var(--muted-foreground);
        }
        .sidebar-icon-active {
          background: linear-gradient(135deg, var(--primary), #c2410c);
          color: #fff;
          box-shadow: 0 0 12px rgba(249,115,22,0.4);
        }

        /* Regular link (no children) */
        .sidebar-link-default {
          color: var(--muted-foreground);
        }
        .sidebar-link-default:hover {
          background: var(--accent);
          color: var(--foreground);
        }
        .sidebar-link-default:hover .sidebar-icon-wrap {
          background: rgba(249,115,22,0.1);
          color: var(--primary);
        }
        .sidebar-link-active {
          background: rgba(249,115,22,0.1);
          color: var(--foreground);
          box-shadow: inset 0 0 0 1px rgba(249,115,22,0.2);
        }

        /* Parent button */
        .sidebar-btn { cursor: pointer; border: none; background: transparent; }
        .sidebar-btn-default { color: var(--muted-foreground); }
        .sidebar-btn-default:hover {
          background: var(--accent);
          color: var(--foreground);
        }
        .sidebar-btn-default:hover .sidebar-icon-wrap {
          background: rgba(249,115,22,0.1);
          color: var(--primary);
        }
        .sidebar-btn-active-parent {
          background: rgba(249,115,22,0.08);
          color: var(--primary);
          box-shadow: inset 0 0 0 1px rgba(249,115,22,0.15);
        }

        /* Child links */
        .sidebar-child-default {
          color: #64748b;
        }
        .sidebar-child-default:hover {
          background: rgba(255,255,255,0.04);
          color: #cbd5e1;
        }
        .sidebar-child-active {
          background: rgba(249,115,22,0.12);
          color: #f97316;
          font-weight: 500;
        }

        /* Active dot glow */
        .sidebar-dot-glow {
          box-shadow: 0 0 6px rgba(249,115,22,0.8);
          animation: dot-pulse 2s ease-in-out infinite;
        }
        @keyframes dot-pulse {
          0%, 100% { box-shadow: 0 0 4px rgba(249,115,22,0.6); }
          50% { box-shadow: 0 0 10px rgba(249,115,22,1); }
        }

        /* Footer */
        .sidebar-footer {
          padding: 12px 14px;
          border-top: 1px solid var(--border);
          background: var(--muted);
        }
        .sidebar-footer-inner {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sidebar-footer-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--secondary), var(--background));
          border: 1.5px solid rgba(249,115,22,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: var(--primary);
          flex-shrink: 0;
        }
        .sidebar-footer-text {
          flex: 1;
          min-width: 0;
        }
        .sidebar-footer-copy {
          font-size: 11px;
          color: var(--muted-foreground);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-footer-tagline {
          font-size: 10px;
          color: rgba(249,115,22,0.5);
          letter-spacing: 0.5px;
        }
      `}</style>

      <aside className="hidden md:block sidebar-root">
        {/* Brand Header */}
        <div className="sidebar-brand">
          <Link href="/" className="sidebar-logo-wrap">
            <div className="sidebar-logo-icon">
              <img
                src="/image/logo.png"
                alt="AstroWeb Logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-main">AstroWeb</span>
              <span className="sidebar-brand-sub">Cosmic Guide</span>
            </div>
          </Link>
        </div>

        {/* Scrollable Nav */}
        <div className="sidebar-scroll">
          <ul className="sidebar-nav">
            {links.map((link, index) => renderNavItem(link, index))}
          </ul>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-inner">
            <div className="sidebar-footer-avatar">
              <Iconify icon="mdi:weather-night" className="text-sm" />
            </div>
            <div className="sidebar-footer-text">
              <div className="sidebar-footer-copy">© 2024 AstroWeb</div>
              <div className="sidebar-footer-tagline">Stars align for you</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
