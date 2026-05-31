"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import { signupWithEmail } from "@/services/auth-service";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const profileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        city: city.trim(),
        state: state.trim(),
      };
      
      const result = await signupWithEmail(email, password, profileData);
      if (result.success && result.requiresVerification) {
        setSuccessMessage(result.message || "Verification email sent. Please verify your email before login.");
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setCity("");
        setState("");
        setEmail("");
        setPassword("");
      } else if (result.success) {
        router.push("/dashboard");
      } else {
        // Human-friendly Firebase error messages
        let message = result.message || "Failed to create account";
        if (message.includes("auth/email-already-in-use")) {
          message = "This email is already in use. Please use a different one or login.";
        } else if (message.includes("auth/weak-password")) {
          message = "Password should be at least 6 characters long.";
        } else if (message.includes("auth/invalid-email")) {
          message = "Please enter a valid email address.";
        }
        setError(message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[480px] py-4">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-brand-navy mb-2 tracking-[-0.02em]">Create Account</h2>
          <p className="text-brand-slate text-[15px]">
            Join FollowProperty to start tracking your portfolio.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-[10px] bg-red-50 border border-red-200 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                First Name <span className="text-brand-amber">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                disabled={loading}
                required
                className="w-full bg-white border border-brand-borderMid rounded-[10px] px-4 py-3 text-[14px] text-brand-navy placeholder:text-brand-slateLight focus:outline-none focus:ring-2 focus:ring-brand-amber/20 focus:border-brand-amber transition-all shadow-sm disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                Last Name <span className="text-brand-amber">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={loading}
                required
                className="w-full bg-white border border-brand-borderMid rounded-[10px] px-4 py-3 text-[14px] text-brand-navy placeholder:text-brand-slateLight focus:outline-none focus:ring-2 focus:ring-brand-amber/20 focus:border-brand-amber transition-all shadow-sm disabled:opacity-50"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
              Phone Number <span className="text-brand-amber">*</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91 99999 99999"
              disabled={loading}
              required
              className="w-full bg-white border border-brand-borderMid rounded-[10px] px-4 py-3 text-[14px] text-brand-navy placeholder:text-brand-slateLight focus:outline-none focus:ring-2 focus:ring-brand-amber/20 focus:border-brand-amber transition-all shadow-sm disabled:opacity-50"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                City <span className="text-brand-amber">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Gurgaon"
                disabled={loading}
                required
                className="w-full bg-white border border-brand-borderMid rounded-[10px] px-4 py-3 text-[14px] text-brand-navy placeholder:text-brand-slateLight focus:outline-none focus:ring-2 focus:ring-brand-amber/20 focus:border-brand-amber transition-all shadow-sm disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                State <span className="text-brand-amber">*</span>
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Haryana"
                disabled={loading}
                required
                className="w-full bg-white border border-brand-borderMid rounded-[10px] px-4 py-3 text-[14px] text-brand-navy placeholder:text-brand-slateLight focus:outline-none focus:ring-2 focus:ring-brand-amber/20 focus:border-brand-amber transition-all shadow-sm disabled:opacity-50"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
              Email Address <span className="text-brand-amber">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@email.com"
              disabled={loading}
              required
              className="w-full bg-white border border-brand-borderMid rounded-[10px] px-4 py-3 text-[14px] text-brand-navy placeholder:text-brand-slateLight focus:outline-none focus:ring-2 focus:ring-brand-amber/20 focus:border-brand-amber transition-all shadow-sm disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
              Password <span className="text-brand-amber">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
              className="w-full bg-white border border-brand-borderMid rounded-[10px] px-4 py-3 text-[14px] text-brand-navy placeholder:text-brand-slateLight focus:outline-none focus:ring-2 focus:ring-brand-amber/20 focus:border-brand-amber transition-all shadow-sm disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center text-[15px] font-semibold text-white bg-gradient-to-br from-brand-amberLight to-[#EA580C] border-none py-3.5 rounded-[10px] shadow-[0_2px_12px_rgba(217,119,6,0.28)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-brand-amber mt-4 disabled:opacity-75 disabled:transform-none disabled:shadow-none cursor-pointer"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-[14px] text-brand-slate">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-navy hover:text-brand-amber transition-colors">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
