import { Shield, Bell, Rabbit } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/utils/supabase/client";

export default function Landing({ user }) {
  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];

  const handleGetStarted = async () => {
    if (!user) {
      const { origin } = window.location;
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/`,
        },
      });
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Smart Price Tracking for Modern Shoppers
          </h1>
          <h2 className="text-4xl font-bold text-orange-600 mb-4 tracking-tight">
            Never Miss a Price Drop
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Track prices from Amazon, Walmart, and more. We monitor 24/7 and send you instant alerts so you can buy at the perfect moment.
          </p>

          <div className="mb-16">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-gray-900 text-gray-50 shadow hover:bg-gray-900/90 h-12 px-8 text-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-gray-900 text-gray-50 shadow hover:bg-gray-900/90 h-12 px-8 text-lg"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="w-full bg-orange-500 text-white py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {Array(10).fill("SMART * PRICE * TRACKER * APP * ").map((text, i) => (
            <span key={i} className="text-lg font-bold tracking-widest mx-4">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">
            Why Choose DealDrop?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
