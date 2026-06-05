import Link from "next/link";

/**
 * Minimal Admin Landing Page.
 * Secure, clean, mobile-friendly portal landing for authorized admins.
 */
export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center items-center w-full">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        {/* Modern Minimalist Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">
            Manage projects, property catalogs, and system data.
          </p>
        </div>

        <div className="space-y-4">
          {/* Add Upcoming Project Module */}
          <Link
            href="/admin/add-project"
            className="flex items-center p-5 border border-slate-100 bg-slate-50/50 rounded-2xl hover:border-amber-300 hover:bg-amber-50/10 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors mr-4 shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-sm md:text-base group-hover:text-amber-900 transition-colors">
                Add Upcoming Project
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ingest, normalize, and save new launching properties.
              </p>
            </div>
            <div className="text-slate-300 group-hover:text-amber-500 transition-colors ml-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Manage Projects Module (Edit/Delete) */}
          <Link
            href="/admin/edit-project"
            className="flex items-center p-5 border border-slate-100 bg-slate-50/50 rounded-2xl hover:border-amber-300 hover:bg-amber-50/10 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors mr-4 shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-sm md:text-base group-hover:text-amber-900 transition-colors">
                Manage Projects
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Search, update details, or delete property listings.
              </p>
            </div>
            <div className="text-slate-300 group-hover:text-amber-500 transition-colors ml-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Builder Applications Module */}
          <Link
            href="/admin/builder-applications"
            className="flex items-center p-5 border border-slate-100 bg-slate-50/50 rounded-2xl hover:border-amber-300 hover:bg-amber-50/10 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors mr-4 shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-sm md:text-base group-hover:text-amber-900 transition-colors">
                Builder Applications
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review and approve developer workspace onboarding submissions.
              </p>
            </div>
            <div className="text-slate-300 group-hover:text-amber-500 transition-colors ml-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Project Moderation Module */}
          <Link
            href="/admin/project-moderation"
            className="flex items-center p-5 border border-slate-100 bg-slate-50/50 rounded-2xl hover:border-amber-300 hover:bg-amber-50/10 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors mr-4 shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-sm md:text-base group-hover:text-amber-900 transition-colors">
                Project Moderation
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review pending properties submitted by registered builders.
              </p>
            </div>
            <div className="text-slate-300 group-hover:text-amber-500 transition-colors ml-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center md:justify-end">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
          >
            ← Back to User Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

