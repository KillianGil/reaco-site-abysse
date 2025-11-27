"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { LenisProvider } from "@/providers/LenisProvider";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Overlay, DepthGauge, Navbar, OceanDecorations } from "@/components/UI";

gsap.registerPlugin(ScrollTrigger);

const Scene = dynamic(
  () => import("@/components/Canvas/Scene").then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => null,
  }
);

function PageContent() {
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    ScrollTrigger.refresh();
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <>
      <Scene scrollProgress={scrollProgress} />
      <Navbar />
      <DepthGauge scrollProgress={scrollProgress} />
      <OceanDecorations scrollProgress={scrollProgress} />
      <Overlay />
      
      {/* Grain overlay for texture */}
      <div className="grain-overlay" />
    </>
  );
}

export default function Home() {
  return (
    <LenisProvider>
      <main className="relative">
        <PageContent />
      </main>
    </LenisProvider>
  );
}
