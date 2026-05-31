import Link from "next/link";
import { Building2 } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-brand-bg w-full font-sans">
      {/* Left side - fixed info panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] xl:w-[50%] bg-brand-navy text-white p-12 xl:p-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 mb-20 w-max">
            <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-brand-amberLight to-[#EA580C] flex items-center justify-center shadow-[0_2px_10px_rgba(217,119,6,0.30)]">
              <Building2 size={15} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[17px] text-white tracking-[-0.025em]">
              FollowProperty
            </span>
          </Link>

          <h1 className="text-4xl md:text-[42px] leading-[1.1] font-bold tracking-[-0.02em] mb-5">
            Your property, finally measurable.
          </h1>
          <p className="text-brand-slateLight text-[17px] leading-relaxed max-w-md">
            Investor-grade tracking, alerts and analytics for Indian real estate.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-14 max-w-md">
            <div className="bg-[#1A253A] border border-white/5 p-5 rounded-2xl shadow-sm">
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-brand-slateLight font-medium">Properties</div>
            </div>
            <div className="bg-[#1A253A] border border-white/5 p-5 rounded-2xl shadow-sm">
              <div className="text-2xl font-bold text-white mb-1">₹12K Cr</div>
              <div className="text-sm text-brand-slateLight font-medium">Tracked</div>
            </div>
            <div className="bg-[#1A253A] border border-white/5 p-5 rounded-2xl shadow-sm">
              <div className="text-2xl font-bold text-white mb-1">98%</div>
              <div className="text-sm text-brand-slateLight font-medium">Accuracy</div>
            </div>
            <div className="bg-[#1A253A] border border-white/5 p-5 rounded-2xl shadow-sm">
              <div className="text-2xl font-bold text-white mb-1">4.8★</div>
              <div className="text-sm text-brand-slateLight font-medium">Rated</div>
            </div>
          </div>
        </div>

        <div className="text-[13px] text-brand-slateLight font-medium">
          © FollowProperty
        </div>
      </div>

      {/* Right side - dynamic content */}
      <div className="w-full lg:w-[55%] xl:w-[50%] flex items-center justify-center p-6 sm:p-12">
        {children}
      </div>
    </div>
  );
}
