import { Link } from "react-router-dom";
import { Aperture } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <header className="flex justify-center pt-10">
        <Link
          to="/login"
          className="flex items-center gap-2.5 rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
        >
          <Aperture size={26} aria-hidden="true" className="text-gold" />
          <span className="font-serif text-2xl text-charcoal">Frameora</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="font-serif text-[28px] leading-9 text-charcoal">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-charcoal/60">{subtitle}</p>}
          </div>
          <div className="rounded-card border border-sand bg-white p-6 shadow-subtle sm:p-8">
            {children}
          </div>
        </div>
      </main>

      <footer className="pb-8 text-center text-xs text-charcoal/50">
        Every moment. Beautifully preserved.
      </footer>
    </div>
  );
}