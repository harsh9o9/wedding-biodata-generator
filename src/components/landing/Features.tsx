"use client";

import { Card, CardContent } from "@/components/ui/Card";
import {
  Palette,
  FileText,
  Download,
  Shield,
  Smartphone,
  Sparkles,
  Languages,
  Image as ImageIcon,
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Beautiful Templates",
    description:
      "Choose from traditional and modern designs crafted specifically for Indian wedding biodatas.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: FileText,
    title: "Easy Customization",
    description:
      "Add, remove, or rearrange sections. Customize every field to match your needs perfectly.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Download,
    title: "PDF Download",
    description:
      "Download your biodata as a high-quality PDF, ready to print or share digitally.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data stays on your device. Nothing is uploaded to servers. Complete privacy guaranteed.",
    color: "text-peacock",
    bgColor: "bg-peacock/10",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description:
      "Create biodatas on any device - phone, tablet, or computer. Responsive design for all screens.",
    color: "text-royal-blue",
    bgColor: "bg-royal-blue/10",
  },
  {
    icon: Languages,
    title: "Bilingual Support",
    description:
      "Add content in English and Hindi. Our fonts support Devanagari script beautifully.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: ImageIcon,
    title: "Photo & Backgrounds",
    description:
      "Upload your photo and choose from beautiful traditional backgrounds or solid colors.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Sparkles,
    title: "100% Free",
    description:
      "No hidden fees, no watermarks, no account required. Just create and download your biodata.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our biodata generator is packed with features to help you create
            the perfect matrimonial biodata.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
