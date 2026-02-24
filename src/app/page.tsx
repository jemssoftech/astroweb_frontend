"use client";

import LandingNavbar from "@/src/components/landing-page/LandingNavbar";
import LandingHero from "@/src/components/landing-page/LandingHero";
import LandingFeatures from "@/src/components/landing-page/LandingFeatures";
import LandingAchievements from "@/src/components/landing-page/LandingAchievements";
import LandingReviews from "@/src/components/landing-page/LandingReviews";
import LandingPricing from "@/src/components/landing-page/LandingPricing";
import LandingFAQ from "@/src/components/landing-page/LandingFAQ";
import LandingContact from "@/src/components/landing-page/LandingContact";
import LandingCTA from "@/src/components/landing-page/LandingCTA";
import LandingFooter from "@/src/components/landing-page/LandingFooter";

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-[#0A0A0E] text-white overflow-x-hidden pt-[76px]">
      <LandingHero />
      <LandingFeatures />
      <LandingReviews />
      <LandingAchievements />
      <LandingPricing />
      <LandingFAQ />
      <LandingCTA />
      <LandingContact />
    </div>
  );
}
