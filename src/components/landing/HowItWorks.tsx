"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FileEdit, Palette, Download, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileEdit,
    title: "Fill Your Details",
    description:
      "Enter your personal information, family details, education, and more using our easy form.",
    color: "from-secondary to-secondary-dark",
  },
  {
    number: "02",
    icon: Palette,
    title: "Choose Your Style",
    description:
      "Select from our beautiful templates, customize colors, and add your photo and background.",
    color: "from-primary to-primary-dark",
  },
  {
    number: "03",
    icon: Download,
    title: "Download PDF",
    description:
      "Preview your biodata and download it as a high-quality PDF, ready to share with families.",
    color: "from-accent to-accent-dark",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%238B1538' stroke-width='1' fill='none'/%3E%3Ccircle cx='50' cy='50' r='20' stroke='%238B1538' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Create Your Biodata in 3 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No account needed. Just open the editor and start creating your
            perfect matrimonial biodata.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-secondary via-primary to-accent" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="relative group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Step card */}
                  <div className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Number badge */}
                    <div
                      className={`absolute -top-4 left-8 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-white font-bold text-lg">
                        {step.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="mt-6 mb-6">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                        <step.icon className="w-8 h-8 text-foreground" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-semibold text-xl text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow (mobile) */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center py-4">
                      <ArrowRight className="w-6 h-6 text-primary rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/editor">
            <Button size="xl" variant="primary" className="group">
              Start Creating Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            No sign-up required • 100% free • Your data stays private
          </p>
        </div>
      </div>
    </section>
  );
}
