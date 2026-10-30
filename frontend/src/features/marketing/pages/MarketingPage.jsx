import { Link } from "react-router-dom";
import {
  Aperture,
  ArrowRight,
  BarChart3,
  Check,
  Images,
  Layers,
  Lock,
  QrCode,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import { cn } from "../../../lib/utils";

const FEATURES = [
  {
    eyebrow: "The gallery",
    icon: Images,
    title: "Beautiful photo galleries, built for viewing",
    body: "Every album opens as a calm, photography-first collection. A responsive grid streams in without jumping, and a distraction-free full-screen viewer puts the work front and centre.",
    points: [
      "Responsive, photography-first layout",
      "Distraction-free full-screen viewer",
      "Lazy-loaded grids that stay visually stable",
    ],
    images: [
      { seed: "frameora-gallery-wide", wide: true },
      { seed: "frameora-gallery-a" },
      { seed: "frameora-gallery-b" },
    ],
  },
  {
    eyebrow: "Privacy & security",
    icon: ShieldCheck,
    title: "Private access, without the account",
    body: "Clients never sign up. They scan a QR code or open a link, enter the password you set, and step straight into their collection — nothing leaks before that gate is passed.",
    points: [
      "Password-protected links",
      "No client accounts to create or manage",
      "Photos revealed only after verification",
    ],
    images: [
      { seed: "frameora-privacy-wide", wide: true },
      { seed: "frameora-privacy-a" },
    ],
  },
  {
    eyebrow: "Sharing",
    icon: QrCode,
    title: "Share in seconds with a QR code",
    body: "Generate a QR code for any album, download it as a crisp PNG, and place it on a print, a table card, or an event sign. Scanning opens the album route; the password still protects the photos.",
    points: [
      "One downloadable QR per album",
      "Scan-to-open from any phone camera",
      "Regenerate the access link anytime",
    ],
    images: [{ seed: "frameora-qr-a" }, { seed: "frameora-qr-b" }],
  },
  {
    eyebrow: "Your studio",
    icon: Layers,
    title: "Organized albums, clients, and insight",
    body: "A focused workspace keeps everything in order: albums, a professional upload manager, a lightweight client directory, honest analytics, and studio branding that flows into every gallery.",
    points: [
      "Album & client management",
      "Drag-and-drop upload manager",
      "Studio branding & preferences",
    ],
    images: [
      { seed: "frameora-studio-wide", wide: true },
      { seed: "frameora-studio-a" },
    ],
  },
];

const PHOTOGRAPHER_STEPS = [
  "Create an album",
  "Assign a client (optional)",
  "Set an album password",
  "Upload photographs",
  "Share the link or QR code",
];

const CLIENT_STEPS = [
  "Scan the QR or open the link",
  "Enter the password",
  "Browse the private gallery",
  "Open photos full-screen",
  "Download only when permitted",
];

function scrollToFeatures() {
  const el = document.getElementById("features");
  if (!el) return;
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

function ImageBlock({ images }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {images.map((img) => (
        <div
          key={img.seed}
          className={cn(
            "overflow-hidden rounded-card border border-sand bg-sand/50",
            img.wide ? "col-span-2 aspect-[16/10]" : "aspect-square"
          )}
        >
          <img
            src={`https://picsum.photos/seed/${img.seed}/${img.wide ? 900 : 500}/${img.wide ? 560 : 500}`}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function FeatureRow({ feature, index }) {
  const flip = index % 2 === 1;
  const Icon = feature.icon;
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={cn("order-1", flip && "lg:order-2")}>
        <ImageBlock images={feature.images} />
      </div>
      <div className={cn("order-2", flip && "lg:order-1")}>
        <span className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-olive">
          <Icon size={15} aria-hidden="true" />
          {feature.eyebrow}
        </span>
        <h3 className="mt-3 font-serif text-2xl leading-tight text-charcoal md:text-[28px]">
          {feature.title}
        </h3>
        <p className="mt-3 text-[15px] leading-7 text-charcoal/70">{feature.body}</p>
        <ul className="mt-5 flex flex-col gap-2.5">
          {feature.points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm text-charcoal/80">
              <Check size={16} className="mt-0.5 shrink-0 text-olive" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StepList({ title, icon: Icon, steps }) {
  return (
    <div className="rounded-card border border-sand bg-white p-6 shadow-subtle md:p-8">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-charcoal">
        <Icon size={18} className="text-olive" aria-hidden="true" />
        {title}
      </h3>
      <ol className="mt-5 flex flex-col gap-4">
        {steps.map((step, i) => (
          <li key={step} className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ivory text-[13px] font-semibold text-olive">
              {i + 1}
            </span>
            <span className="pt-0.5 text-sm text-charcoal/80">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      {/* Public header */}
      <header className="sticky top-0 z-30 border-b border-sand bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
          >
            <Aperture size={24} className="text-gold" aria-hidden="true" />
            <span className="font-serif text-xl text-charcoal">Frameora</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={scrollToFeatures}
              className="hidden rounded-control px-3 py-2 text-sm font-medium text-charcoal/70 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 sm:block"
            >
              Features
            </button>
            <Link
              to="/login"
              className="rounded-control px-3 py-2 text-sm font-medium text-charcoal/70 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
            >
              Sign In
            </Link>
            <Button size="sm" onClick={undefined} asChild={false}>
              <Link to="/register" className="flex items-center gap-1.5">
                Get Started <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="overflow-hidden border-b border-sand">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="mb-5 block h-px w-10 bg-gold" aria-hidden="true" />
              <p className="text-[13px] font-semibold uppercase tracking-wide text-olive">
                Private client galleries for photographers
              </p>
              <h1 className="mt-3 font-serif text-4xl leading-[1.1] text-charcoal md:text-5xl lg:text-[56px]">
                Every moment.
                <br />
                Beautifully preserved.
              </h1>
              <p className="mt-5 max-w-md text-[16px] leading-7 text-charcoal/70">
                Create private photo albums, share them effortlessly, and give every client a
                gallery worth remembering.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild={false}>
                  <Link to="/register" className="flex items-center gap-2">
                    Get Started <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" onClick={scrollToFeatures}>
                  Explore Features
                </Button>
              </div>
              <p className="mt-6 flex items-center gap-2 text-[13px] text-charcoal/50">
                <Lock size={13} aria-hidden="true" />
                No client accounts. Password-protected links. QR-ready.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 overflow-hidden rounded-card border border-sand bg-sand/50">
                <img
                  src="https://picsum.photos/seed/frameora-hero-wide/1000/620"
                  alt="A photographer's edited portrait"
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-card border border-sand bg-sand/50">
                <img
                  src="https://picsum.photos/seed/frameora-hero-a/520/520"
                  alt=""
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-card border border-sand bg-sand/50">
                <img
                  src="https://picsum.photos/seed/frameora-hero-b/520/520"
                  alt=""
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 border-b border-sand">
          <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl leading-tight text-charcoal md:text-4xl">
                A studio built around the photograph
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-charcoal/70">
                Everything you need to organize, protect, and deliver your work — designed to stay
                out of the way of the images themselves.
              </p>
            </div>
            <div className="mt-16 flex flex-col gap-20 md:mt-20 md:gap-28">
              {FEATURES.map((feature, index) => (
                <FeatureRow key={feature.title} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="border-b border-sand">
          <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl leading-tight text-charcoal md:text-4xl">
                Two experiences, one seamless handoff
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-charcoal/70">
                You manage the studio. Your client simply opens the gallery.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
              <StepList title="For photographers" icon={Upload} steps={PHOTOGRAPHER_STEPS} />
              <StepList title="For clients" icon={Users} steps={CLIENT_STEPS} />
            </div>
          </div>
        </section>

        {/* Final CTA — the one dark band */}
        <section className="bg-charcoal">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-4 py-20 text-center md:px-8 md:py-28">
            <Aperture size={30} className="text-gold" aria-hidden="true" />
            <h2 className="max-w-2xl font-serif text-3xl leading-tight text-white md:text-4xl">
              Ready to preserve every moment?
            </h2>
            <p className="max-w-md text-[15px] leading-7 text-white/70">
              Set up your studio, create your first album, and share a private gallery in minutes.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" variant="secondary" asChild={false}>
                <Link to="/register" className="flex items-center gap-2">
                  Get Started <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Button>
              <Link
                to="/login"
                className="rounded-control px-5 py-3 text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                Sign in to your workspace
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-sand bg-ivory">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 py-8 text-center md:flex-row md:px-8 md:text-left">
          <div className="flex items-center gap-2.5">
            <Aperture size={20} className="text-gold" aria-hidden="true" />
            <span className="font-serif text-lg text-charcoal">Frameora</span>
            <span className="hidden text-[13px] text-charcoal/50 sm:inline">
              — Every moment. Beautifully preserved.
            </span>
          </div>
          <nav className="flex items-center gap-5 text-sm text-charcoal/60">
            <Link to="/features" onClick={scrollToFeatures} className="hover:text-charcoal rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60">
              Features
            </Link>
            <Link to="/login" className="hover:text-charcoal rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-charcoal rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60">
              Create account
            </Link>
          </nav>
          <p className="text-[13px] text-charcoal/40">© {new Date().getFullYear()} Frameora</p>
        </div>
      </footer>
    </div>
  );
}