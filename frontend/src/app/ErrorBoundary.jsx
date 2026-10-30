import { Component } from "react";
import { Aperture, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (typeof console !== "undefined" && import.meta.env?.DEV) {
      // Dev-only diagnostics; never surfaced to the user.
      console.error("Frameora error boundary:", error, info);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.assign("/dashboard");
  };

  render() {
    if (this.state.hasError) {
      return (
        <main
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ivory px-4 text-center"
        >
          <Aperture size={30} className="text-gold" aria-hidden="true" />
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-2xl text-charcoal">Something went wrong</h1>
            <p className="max-w-sm text-sm text-charcoal/60">
              We hit an unexpected error rendering this page. Reloading usually clears it.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-control bg-charcoal px-4 text-sm font-medium text-white transition-colors hover:bg-charcoal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              <RefreshCw size={15} aria-hidden="true" /> Reload page
            </button>
            <button
              type="button"
              onClick={this.handleHome}
              className="inline-flex h-10 items-center justify-center rounded-control border border-sand bg-white px-4 text-sm font-medium text-charcoal transition-colors hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              Back to dashboard
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}