"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sparkles, FileText, Download } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-background to-cream-dark" />
        
        {/* Decorative patterns */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L30 60M0 30L60 30M0 0L60 60M60 0L0 60' stroke='%238B1538' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-radial from-accent/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-secondary/5 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent-dark mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Free Online Biodata Maker</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Create Beautiful{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-primary to-accent">
              Wedding Biodatas
            </span>{" "}
            in Minutes
          </h1>

          {/* Hindi tagline */}
          <p className="text-xl md:text-2xl text-secondary font-serif mb-4">
            सुंदर शादी का बायोडाटा बनाएं
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Design stunning matrimonial biodatas with our easy-to-use editor. Choose from
            traditional and modern templates, customize every detail, and download
            as a professional PDF.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/editor">
              <Button size="xl" variant="primary" className="group">
                <FileText className="w-5 h-5 transition-transform group-hover:scale-110" />
                Create Your Biodata
              </Button>
            </Link>
            <a href="#templates">
              <Button size="xl" variant="outline">
                View Templates
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-1">4+</div>
              <div className="text-sm text-muted-foreground">Templates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                <Download className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-sm text-muted-foreground">PDF Export</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Free to Use</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto fill-muted"
          preserveAspectRatio="none"
        >
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
        </svg>
      </div>
    </section>
  );
}
