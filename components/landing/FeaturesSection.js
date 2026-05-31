"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Building2,
  BellRing,
  BarChart3,
  MapPin,
  IndianRupee,
  ChevronRight,
  Shield,
  Calculator,
  Search,
  Star,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Section({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function CoreFlows() {
  const router = useRouter();
  const flows = [
    {
      id: "buy",
      label: "Looking to Buy",
      badge: "Watchlist",
      accentStr: "text-brand-teal border-brand-tealBorder",
      accentBgStr: "bg-brand-tealBg",
      iconColor: "#0D9488",
      icon: Search,
      tagline: "Discover. Compare. Decide.",
      desc: "Set your intent. We'll track the market and alert you when it's the right moment to act.",
      highlighted: false,
      features: [
        { icon: Building2, label: "40+ Property Types", sub: "Residential, Commercial, Farmland & more" },
        { icon: IndianRupee, label: "Budget & Loan Planner", sub: "Pre-approval, down payment, EMI calc" },
        { icon: MapPin, label: "City & Locality Intel", sub: "Sector-level price intelligence" },
        { icon: TrendingUp, label: "Appreciation Forecast", sub: "Future value projection at possession" },
        { icon: BellRing, label: "Watchlist Alerts", sub: "Price moves, builder news, RERA flags" },
      ],
      cta: "Create My Watchlist",
      ctaGrad: "bg-brand-teal",
      ctaShadow: "shadow-[0_4px_16px_rgba(13,148,136,0.24)]",
    },
    {
      id: "bought",
      label: "Already Bought",
      badge: "Portfolio",
      accentStr: "text-brand-amber border-brand-amberBorder",
      accentBgStr: "bg-brand-amberBg",
      iconColor: "#D97706",
      icon: BarChart3,
      tagline: "Track. Analyse. Grow.",
      desc: "Live valuations, rental yields, loan tracking, and smart alerts — your complete property intelligence hub.",
      highlighted: true,
      features: [
        { icon: TrendingUp, label: "Live Market Valuation", sub: "4-source median formula, 3-level compare" },
        { icon: IndianRupee, label: "Rental Yield Analytics", sub: "Your rent vs market, yield %, EMI offset" },
        { icon: Calculator, label: "Appreciation Engine", sub: "Compound growth with year-wise breakdown" },
        { icon: BellRing, label: "Builder Fraud Alerts", sub: "Daily RERA, news, courts, social scan" },
        { icon: Shield, label: "FollowProperty Dashboard", sub: "Stock-market UI across all properties" },
      ],
      cta: "Track My Portfolio",
      ctaGrad: "bg-gradient-to-br from-brand-amberLight to-[#EA580C]",
      ctaShadow: "shadow-brand-amber",
    },
  ];

  return (
    <Section className="py-[88px] bg-brand-bgAlt relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div variants={fadeUp} custom={0} className="text-center mb-[52px]">
          <div className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full border border-brand-border bg-brand-bgCard mb-3.5 shadow-brand">
            <span className="text-[10px] text-brand-slateLight tracking-[0.1em] uppercase">
              Two Paths. One Platform.
            </span>
          </div>
          <h2 className="text-[clamp(26px,4vw,40px)] font-bold text-brand-navy tracking-tight mb-3">
            Which investor are you?
          </h2>
          <p className="text-[17px] text-brand-slate leading-relaxed max-w-[480px] mx-auto">
            Whether you're hunting your next deal or managing what you own —
            FollowProperty gives you the intelligence edge.
          </p>
        </motion.div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 max-w-[860px] mx-auto">
          {flows.map((flow, idx) => {
            const Icon = flow.icon;
            return (
              <motion.div
                key={flow.id}
                variants={fadeUp}
                custom={idx + 1}
                className={`bg-brand-bgCard rounded-[20px] overflow-hidden relative cursor-pointer transition-all duration-[0.35s] ${
                  flow.highlighted ? "border-[1.5px] border-brand-amberBorder shadow-brand-lg" : "border border-brand-border shadow-brand-md"
                }`}
                whileHover={{
                  y: -5,
                  boxShadow: flow.highlighted
                    ? "0 20px 60px rgba(217,119,6,0.14), 0 4px 16px rgba(15,22,41,0.09)"
                    : "0 20px 60px rgba(15,22,41,0.11)",
                }}
              >
                <div
                  className={`h-[3px] ${flow.highlighted ? "bg-gradient-to-r from-brand-amber to-[#EA580C]" : "bg-brand-teal"}`}
                />

                {flow.highlighted && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-brand-amberBg border border-brand-amberBorder rounded-full py-1 px-2.5">
                    <Star size={10} fill="#D97706" color="#D97706" />
                    <span className="text-[10px] text-brand-amber font-semibold tracking-[0.04em]">
                      Core Feature
                    </span>
                  </div>
                )}

                <div className="pt-[26px] px-[26px] pb-[22px]">
                  <div className="flex items-start gap-3.5 mb-[18px]">
                    <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center border ${flow.accentBgStr} ${flow.accentStr}`}>
                      <Icon size={20} color={flow.iconColor} />
                    </div>
                    <div>
                      <div className={`inline-block text-[10px] font-bold py-1 px-2 rounded-[5px] mb-1.5 border tracking-[0.06em] uppercase ${flow.accentBgStr} ${flow.accentStr}`}>
                        {flow.badge}
                      </div>
                      <h3 className="text-[20px] font-bold text-brand-navy tracking-tight mb-0.5">
                        {flow.label}
                      </h3>
                      <p className={`text-[12px] font-medium ${flow.id === "buy" ? "text-brand-teal" : "text-brand-amber"}`}>
                        {flow.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-[14px] text-brand-slate leading-relaxed mb-5">
                    {flow.desc}
                  </p>

                  <ul className="list-none p-0 mb-[22px]">
                    {flow.features.map((f, i) => {
                      const FIcon = f.icon;
                      return (
                        <li key={i} className="flex items-start gap-2.5 mb-[9px]">
                          <div className={`w-[26px] h-[26px] rounded-[7px] shrink-0 flex items-center justify-center mt-px ${flow.accentBgStr}`}>
                            <FIcon size={12} color={flow.iconColor} />
                          </div>
                          <div>
                            <div className="text-[14px] text-brand-navyMid font-semibold">
                              {f.label}
                            </div>
                            <div className="text-[12px] text-brand-slate mt-[2px]">
                              {f.sub}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <button
                    onClick={() => router.push(flow.id === "buy" ? "/watchlist" : "/portfolio")}
                    className={`w-full flex items-center justify-center gap-2 p-[13px] rounded-xl border-none cursor-pointer font-semibold text-[14px] text-white transition-all duration-[0.22s] hover:-translate-y-[1px] ${flow.ctaGrad} ${flow.ctaShadow}`}
                  >
                    {flow.cta} <ChevronRight size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
