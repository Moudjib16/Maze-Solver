import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="bg-amber-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="inline-block rotate-[-2deg] rounded-full border-2 border-slate-900 bg-rose-300 px-3 py-1 text-xs font-extrabold uppercase tracking-widest shadow-[2px_2px_0_0_#0f172a]">
          Dead end
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">404 — this corridor goes nowhere</h1>
        <p className="mt-2 text-sm font-medium text-slate-600">
          The page you sniffed for doesn&apos;t exist. Head back to the entrance.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-violet-600 px-6 py-3 text-sm font-extrabold text-white shadow-[3px_3px_0_0_#0f172a] transition-transform hover:-translate-y-0.5"
        >
          ← Back home
        </Link>
      </div>
    </div>
  );
}
