"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { Package, Users, Globe, TrendingUp, Shield, Clock } from "lucide-react";

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  description?: string;
}

function StatItem({
  icon,
  value,
  label,
  suffix = "",
  description,
}: StatItemProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2500; // 2.5 seconds
    const steps = 60;
    const increment = value / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setDisplayValue(Math.floor(increment * currentStep));

      if (currentStep >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div ref={ref} className="group flex flex-col items-center p-8 text-center">
      <div className="from-primary/20 to-primary/10 mb-6 rounded-2xl bg-gradient-to-br p-5 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="from-primary mb-3 bg-gradient-to-r to-cyan-900 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
        {formatNumber(displayValue)}
        {suffix}
      </div>
      <div className="text-foreground mb-2 text-lg font-semibold">{label}</div>
      {description && (
        <div className="text-muted-foreground max-w-xs text-sm">
          {description}
        </div>
      )}
    </div>
  );
}

export default function EnhancedStatsSection() {
  return (
    <section className="from-background to-card/50 relative w-full overflow-hidden bg-gradient-to-b py-10">
      {/* Background decoration */}
      <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>
      <div className="bg-primary/5 absolute top-0 left-1/4 h-96 w-96 rounded-full blur-3xl"></div>
      <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Growing{" "}
            <span className="from-primary bg-gradient-to-r to-cyan-900 bg-clip-text text-transparent">
              Wild
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
            Join a new wave of explorers finding hidden gems through our quirky,
            AI-powered product hunt. It&apos;s like thrifting, but futuristic.
          </p>
        </div>

        <div className="mx-auto mb-16 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <StatItem
            icon={<Package className="text-primary h-10 w-10" />}
            value={3902}
            suffix="+"
            label="Products Curated"
            description="We’ve combed through Amazon so you don’t have to. Curated by our robot with taste"
          />
          <StatItem
            icon={<Users className="text-primary h-10 w-10" />}
            value={18}
            suffix="+"
            label="Happy Users"
            description="Total shoppers discovering products they love"
          />
          <StatItem
            icon={<Globe className="text-primary h-10 w-10" />}
            value={2}
            suffix="+"
            label="Countries"
            description="Global reach with new countries added weekly"
          />
        </div>
      </div>
    </section>
  );
}
