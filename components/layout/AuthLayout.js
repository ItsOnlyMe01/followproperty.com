import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-brand-bg w-full font-sans">
      {/* Left side - fixed info panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] xl:w-[50%] bg-brand-navy text-white p-12 xl:p-16 relative overflow-hidden">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-brand-blue/25 to-transparent rounded-full -mr-24 -mt-24 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-linear-to-tr from-brand-amber/15 to-transparent rounded-full -mb-24 pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-20 w-max">
            <img src="/favicon.svg" alt="FollowProperty Logo" className="w-7 h-7 object-contain" />
            <span className="font-bold text-[17px] text-white tracking-[-0.025em]">
              FollowProperty
            </span>
          </Link>

          <h1 className="text-4xl md:text-[42px] leading-[1.1] font-bold tracking-[-0.02em] mb-5">
            Your property, finally measurable.
          </h1>
          <p className="text-brand-slate-light text-[17px] leading-relaxed max-w-md">
            Investor-grade tracking, alerts and analytics for Indian real estate.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-14 max-w-md">
            <div className="bg-[#1A253A] border border-white/5 p-5 rounded-2xl shadow-sm">
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-brand-slate-light font-medium">Properties</div>
            </div>
            <div className="bg-[#1A253A] border border-white/5 p-5 rounded-2xl shadow-sm">
              <div className="text-2xl font-bold text-white mb-1">₹12K Cr</div>
              <div className="text-sm text-brand-slate-light font-medium">Tracked</div>
            </div>
            <div className="bg-[#1A253A] border border-white/5 p-5 rounded-2xl shadow-sm">
              <div className="text-2xl font-bold text-white mb-1">98%</div>
              <div className="text-sm text-brand-slate-light font-medium">Accuracy</div>
            </div>
            <div className="bg-[#1A253A] border border-white/5 p-5 rounded-2xl shadow-sm">
              <div className="text-2xl font-bold text-white mb-1">4.8★</div>
              <div className="text-sm text-brand-slate-light font-medium">Rated</div>
            </div>
          </div>
        </div>

        <div className="text-[13px] text-brand-slate-light font-medium">
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
