import Nav from "@/components/landing/CTASection";
import Hero from "@/components/landing/HeroSection";
import CoreFlows from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "FollowProperty - India's Property Intelligence Platform",
  description: "Monitor value, builder risks, legal alerts, and appreciation in one place. Built for serious property investors.",
};

export default function Home() {
  return (
    <div className="bg-brand-bg min-h-screen font-sans antialiased">
      <Nav />
      <Hero />
      <CoreFlows />
      <Footer />
    </div>
  );
}
