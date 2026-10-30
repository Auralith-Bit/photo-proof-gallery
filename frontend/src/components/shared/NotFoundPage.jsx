import { Link } from "react-router-dom";
import { Aperture, Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ivory px-4 text-center">
      <Link
        to="/"
        className="flex items-center gap-2.5 rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
      >
        <Aperture size={26} className="text-gold" aria-hidden="true" />
        <span className="font-serif text-2xl text-charcoal">Frameora</span>
      </Link>

      <div className="flex flex-col items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand/70 text-olive">
          <Compass size={24} aria-hidden="true" />
        </span>
        <p className="font-serif text-6xl leading-none text-charcoal/15">404</p>
        <h1 className="font-serif text-2xl text-charcoal">This page wandered off</h1>
        <p className="max-w-sm text-sm text-charcoal/60">
          The link may be mistyped or the gallery it pointed to no longer exists.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-control bg-charcoal px-4 text-sm font-medium text-white transition-colors hover:bg-charcoal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          Back to dashboard
        </Link>
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center rounded-control border border-sand bg-white px-4 text-sm font-medium text-charcoal transition-colors hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          Visit homepage
        </Link>
      </div>
    </main>
  );
}