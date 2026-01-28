"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { TEMPLATE_LIST } from "@/constants/templates";
import { cn } from "@/lib/utils";

export function SampleGallery() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);

  const nextSlide = React.useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TEMPLATE_LIST.length);
  }, []);

  const prevSlide = React.useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TEMPLATE_LIST.length) % TEMPLATE_LIST.length);
  }, []);

  // Auto-advance carousel
  React.useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isHovering, nextSlide]);

  return (
    <section id="templates" className="bg-muted py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Beautiful Templates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates, 
            each crafted to reflect the richness of Indian matrimonial traditions.
          </p>
        </div>

        {/* Carousel */}
        <div 
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Main Preview */}
          <div className="relative aspect-[3/4] max-h-[600px] w-full max-w-md mx-auto">
            {TEMPLATE_LIST.map((template, index) => (
              <Card
                key={template.id}
                className={cn(
                  "absolute inset-0 overflow-hidden transition-all duration-500 ease-out",
                  index === activeIndex
                    ? "opacity-100 scale-100 z-10"
                    : index === (activeIndex + 1) % TEMPLATE_LIST.length
                    ? "opacity-50 scale-95 translate-x-[60%] z-0"
                    : index === (activeIndex - 1 + TEMPLATE_LIST.length) % TEMPLATE_LIST.length
                    ? "opacity-50 scale-95 -translate-x-[60%] z-0"
                    : "opacity-0 scale-90 z-0"
                )}
              >
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: template.colors.background,
                  }}
                >
                  {/* Template Preview Content */}
                  <div className="p-8 h-full flex flex-col">
                    {/* Header */}
                    <div 
                      className="text-center mb-6 pb-4"
                      style={{ borderBottom: `2px solid ${template.colors.border}` }}
                    >
                      <div
                        className="text-3xl font-display font-bold mb-2"
                        style={{ color: template.colors.primary }}
                      >
                        ॥ श्री गणेशाय नमः ॥
                      </div>
                      <div
                        className="text-xl font-serif"
                        style={{ color: template.colors.secondary }}
                      >
                        Wedding Biodata
                      </div>
                    </div>

                    {/* Sample Content */}
                    <div className="flex-1 space-y-4">
                      {/* Photo placeholder */}
                      <div className="flex justify-center mb-4">
                        <div 
                          className="w-24 h-28 rounded-lg"
                          style={{ 
                            backgroundColor: template.colors.border,
                            border: `2px solid ${template.colors.secondary}`
                          }}
                        />
                      </div>

                      {/* Sample fields */}
                      {["Personal Details", "Education", "Family"].map((section) => (
                        <div key={section}>
                          <div
                            className="text-sm font-semibold mb-2"
                            style={{ color: template.colors.secondary }}
                          >
                            {section}
                          </div>
                          <div className="space-y-1">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="h-3 rounded"
                                style={{
                                  backgroundColor: `${template.colors.text}15`,
                                  width: `${80 - i * 10}%`,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Template Name Badge */}
                    <div className="text-center pt-4">
                      <span
                        className="inline-block px-4 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: `${template.colors.secondary}15`,
                          color: template.colors.secondary,
                        }}
                      >
                        {template.name}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 p-2 rounded-full bg-card border border-border shadow-lg hover:bg-muted transition-colors"
            aria-label="Previous template"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 p-2 rounded-full bg-card border border-border shadow-lg hover:bg-muted transition-colors"
            aria-label="Next template"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {TEMPLATE_LIST.map((template, index) => (
            <button
              key={template.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === activeIndex
                  ? "bg-primary w-8"
                  : "bg-border hover:bg-primary/50"
              )}
              aria-label={`View ${template.name} template`}
            />
          ))}
        </div>

        {/* Template Grid (Desktop) */}
        <div className="hidden md:grid grid-cols-4 gap-6 mt-12">
          {TEMPLATE_LIST.map((template, index) => (
            <Card
              key={template.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg group",
                index === activeIndex && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <div
                className="aspect-[3/4] p-4 relative"
                style={{ backgroundColor: template.colors.background }}
              >
                {/* Mini preview */}
                <div
                  className="text-center text-xs font-display font-bold mb-2"
                  style={{ color: template.colors.primary }}
                >
                  ॥ श्री ॥
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded"
                      style={{
                        backgroundColor: `${template.colors.text}20`,
                        width: `${90 - i * 10}%`,
                      }}
                    />
                  ))}
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-3 text-center">
                <h3 className="font-medium text-sm text-foreground">{template.name}</h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
