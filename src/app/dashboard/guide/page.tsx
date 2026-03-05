"use client";
import React from "react";
import Iconify from "@/src/components/Iconify";

export default function GuidePage() {
  const backendUrl =
    process.env.NEXT_PUBLIC_AUTH_BASE_URL || "https://api.astroweb.in";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Iconify icon="lucide:book-open" className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">API Integration Guide</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Everything you need to know to start building with Astro Web APIs.
        </p>
      </div>

      {/* Configuration Section */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-sm transition-colors">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <Iconify icon="lucide:settings" className="text-blue-500" />
          1. Configuration
        </h2>

        <div className="space-y-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400">
            <p className="mb-4">
              To connect your application to our services, you need to set up
              your environment variables. The most important one is the{" "}
              <strong>Backend URL</strong>.
            </p>
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-blue-400 overflow-x-auto">
              NEXT_PUBLIC_AUTH_BASE_URL={backendUrl}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border border-slate-100 dark:border-white/10 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10">
              <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                <Iconify icon="lucide:alert-circle" />
                Important Note
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300/80">
                In Next.js, always prefix your environment variables with{" "}
                <code>NEXT_PUBLIC_</code> if you need to access them on the
                client side.
              </p>
            </div>
            <div className="p-5 border border-slate-100 dark:border-white/10 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10">
              <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                <Iconify icon="lucide:info" />
                Backend Endpoint
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300/80">
                Your primary API base URL is{" "}
                <code className="break-all">{backendUrl}</code>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* API Key Section */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-sm transition-colors">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <Iconify icon="lucide:key" className="text-emerald-500" />
          2. API Authentication
        </h2>

        <div className="space-y-4 text-slate-600 dark:text-slate-400">
          <p>
            All API calls require authentication. You can find your API key in
            the dashboard header or settings. There are two ways to include it
            in your requests:
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                A. Header-based (Recommended)
              </h3>
              <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-blue-400 overflow-x-auto">
                <span className="text-slate-500">
                  {"//"} Configuration for axios or fetch
                </span>
                <br />
                headers: {"{"}
                <br />
                &nbsp;&nbsp;&quot;Authorization&quot;: &quot;Bearer
                YOUR_ACCESS_TOKEN&quot;,
                <br />
                &nbsp;&nbsp;&quot;Content-Type&quot;:
                &quot;application/json&quot;
                <br />
                {"}"}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                B. Query Parameter
              </h3>
              <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-blue-400 overflow-x-auto">
                {backendUrl}/api/ashtakvarga?api_key=YOUR_API_KEY
              </div>
              <p className="text-xs text-slate-500 italic">
                Note: Check specific endpoint documentation for available
                parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-sm transition-colors">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <Iconify icon="lucide:code-2" className="text-violet-500" />
          3. Usage Example
        </h2>

        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Here&apos;s a sample code snippet to fetch{" "}
            <strong>Ashtakvarga</strong> details using fetch API:
          </p>

          <div className="bg-slate-900 rounded-xl p-6 font-mono text-xs sm:text-sm text-blue-300 overflow-x-auto leading-relaxed">
            <span className="text-purple-400">const</span> response ={" "}
            <span className="text-purple-400">await</span>{" "}
            <span className="text-yellow-400">fetch</span>(
            <span className="text-emerald-400">
              `{"${"}process.env.NEXT_PUBLIC_AUTH_BASE_URL{"}"}/api/ashtakvarga`
            </span>
            , {"{"}
            <br />
            &nbsp;&nbsp;method:{" "}
            <span className="text-emerald-400">&quot;POST&quot;</span>
            ,<br />
            &nbsp;&nbsp;headers: {"{"}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-emerald-400">
              &quot;Content-Type&quot;
            </span>:{" "}
            <span className="text-emerald-400">
              &quot;application/json&quot;
            </span>
            ,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-emerald-400">
              &quot;Authorization&quot;
            </span>:{" "}
            <span className="text-emerald-400">
              `Bearer {"${"}token{"}"}`
            </span>
            <br />
            &nbsp;&nbsp;{"}"},<br />
            &nbsp;&nbsp;body: <span className="text-yellow-400">JSON</span>.
            <span className="text-yellow-400">stringify</span>({"{"}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;day:{" "}
            <span className="text-orange-400">12</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;month:{" "}
            <span className="text-orange-400">3</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;year:{" "}
            <span className="text-orange-400">1995</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;hour:{" "}
            <span className="text-orange-400">10</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;min:{" "}
            <span className="text-orange-400">30</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;lat:{" "}
            <span className="text-orange-400">22.57</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;lon:{" "}
            <span className="text-orange-400">88.36</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;tzone:{" "}
            <span className="text-orange-400">5.5</span>
            <br />
            &nbsp;&nbsp;{"}"})<br />
            {"}"});
            <br />
            <br />
            <span className="text-purple-400">const</span> data ={" "}
            <span className="text-purple-400">await</span> response.
            <span className="text-yellow-400">json</span>();
            <br />
            <span className="text-yellow-400">console</span>.
            <span className="text-yellow-400">log</span>(data);
          </div>
        </div>
      </section>

      {/* Footer Support */}
      <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/20 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 transition-colors">
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          Need more help or custom integrations?
        </p>
        <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:opacity-90 transition-all">
          Contact Support
        </button>
      </div>
    </div>
  );
}
