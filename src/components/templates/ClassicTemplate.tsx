"use client";

import React from "react";
import {
  TemplateProps,
  getVisibleSections,
  getVisibleFields,
  getPersonName,
  formatFieldValue,
} from "./types";
import { getInvocationText } from "@/constants/invocations";

/**
 * ClassicTemplate - Traditional design with elegant borders and serif fonts
 * Timeless Indian wedding biodata aesthetic
 */
export function ClassicTemplate({ biodata, template, scale = 1 }: TemplateProps) {
  const visibleSections = getVisibleSections(biodata.sections);
  const personName = getPersonName(biodata);

  const fontSize = (size: number) => `${size * scale}px`;
  const spacing = (size: number) => `${size * scale}px`;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        fontFamily: template.fonts.body,
        color: template.colors.text,
        padding: spacing(24),
      }}
    >
      {/* Decorative Double Border */}
      <div
        className="pointer-events-none absolute inset-4 rounded-sm border-2"
        style={{ borderColor: template.colors.border }}
      />
      <div
        className="pointer-events-none absolute inset-6 rounded-sm border"
        style={{ borderColor: template.colors.border, opacity: 0.5 }}
      />

      {/* Corner Flourishes */}
      <CornerDecoration position="top-left" color={template.colors.accent} scale={scale} />
      <CornerDecoration position="top-right" color={template.colors.accent} scale={scale} />
      <CornerDecoration position="bottom-left" color={template.colors.accent} scale={scale} />
      <CornerDecoration position="bottom-right" color={template.colors.accent} scale={scale} />

      {/* Content Area */}
      <div className="relative z-10 flex h-full flex-col" style={{ padding: spacing(16) }}>
        {/* Header */}
        <div className="mb-4 text-center" style={{ marginBottom: spacing(16) }}>
          {biodata.meta.religiousInvocation && getInvocationText(
            biodata.meta.religiousInvocation.preset,
            biodata.meta.religiousInvocation.customText
          ) && (
            <p
              className="tracking-widest opacity-80"
              style={{
                fontSize: fontSize(10),
                color: template.colors.secondary,
                letterSpacing: "0.15em",
              }}
            >
              {getInvocationText(
                biodata.meta.religiousInvocation.preset,
                biodata.meta.religiousInvocation.customText
              )}
            </p>
          )}
          <h1
            className="mt-2 font-bold uppercase tracking-wide"
            style={{
              fontFamily: template.fonts.heading,
              fontSize: fontSize(28),
              color: template.colors.primary,
              letterSpacing: "0.1em",
              marginTop: spacing(8),
            }}
          >
            BIODATA
          </h1>
          <div
            className="mx-auto mt-2"
            style={{
              width: spacing(80),
              height: spacing(2),
              background: `linear-gradient(90deg, transparent, ${template.colors.accent}, transparent)`,
              marginTop: spacing(8),
            }}
          />
        </div>

        {/* Photo Section (if photo exists) */}
        {biodata.photo?.url && (
          <div
            className="mx-auto mb-4"
            style={{
              marginBottom: spacing(16),
            }}
          >
            <div
              className="overflow-hidden"
              style={{
                width: biodata.photo.size === "small" ? spacing(80) : biodata.photo.size === "large" ? spacing(140) : spacing(110),
                height: biodata.photo.size === "small" ? spacing(100) : biodata.photo.size === "large" ? spacing(175) : spacing(137),
                borderRadius: biodata.photo.shape === "circle" ? "50%" : biodata.photo.shape === "rounded" ? spacing(8) : spacing(4),
                border: `${spacing(3)} solid ${template.colors.border}`,
              }}
            >
              <img
                src={biodata.photo.url}
                alt={personName}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Name Banner */}
        <div
          className="mb-4 text-center"
          style={{
            padding: `${spacing(10)} ${spacing(20)}`,
            backgroundColor: template.colors.primary,
            marginBottom: spacing(16),
            borderRadius: spacing(4),
          }}
        >
          <h2
            className="font-semibold uppercase tracking-wide"
            style={{
              fontFamily: template.fonts.heading,
              fontSize: fontSize(18),
              color: "#FFFFFF",
              letterSpacing: "0.05em",
            }}
          >
            {personName}
          </h2>
        </div>

        {/* Sections */}
        <div className="flex-1 space-y-3" style={{ gap: spacing(12) }}>
          {visibleSections.map((section) => {
            const visibleFields = getVisibleFields(section.fields);
            if (visibleFields.length === 0) return null;

            return (
              <div key={section.id} style={{ marginBottom: spacing(12) }}>
                {/* Section Title */}
                <div
                  className="mb-2 flex items-center"
                  style={{
                    marginBottom: spacing(8),
                    borderBottom: `2px solid ${template.colors.accent}`,
                    paddingBottom: spacing(4),
                  }}
                >
                  <h3
                    className="font-semibold uppercase tracking-wide"
                    style={{
                      fontFamily: template.fonts.heading,
                      fontSize: fontSize(11),
                      color: template.colors.secondary,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {section.title}
                  </h3>
                </div>

                {/* Fields Grid */}
                <div
                  className="grid grid-cols-2 gap-x-4"
                  style={{
                    gap: `${spacing(4)} ${spacing(16)}`,
                  }}
                >
                  {visibleFields.map((field) => (
                    <div
                      key={field.id}
                      className="flex"
                      style={{
                        paddingTop: spacing(2),
                        paddingBottom: spacing(2),
                      }}
                    >
                      <span
                        className="shrink-0 font-medium"
                        style={{
                          width: "45%",
                          fontSize: fontSize(10),
                          color: template.colors.text,
                        }}
                      >
                        {field.label}:
                      </span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: fontSize(10),
                          color: template.colors.text,
                          opacity: 0.9,
                        }}
                      >
                        {formatFieldValue(field)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Corner decoration component for classic template
 */
function CornerDecoration({
  position,
  color,
  scale,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color: string;
  scale: number;
}) {
  const size = 24 * scale;
  const positionStyles: Record<string, React.CSSProperties> = {
    "top-left": { top: 16 * scale, left: 16 * scale },
    "top-right": { top: 16 * scale, right: 16 * scale },
    "bottom-left": { bottom: 16 * scale, left: 16 * scale },
    "bottom-right": { bottom: 16 * scale, right: 16 * scale },
  };

  const borderStyles: Record<string, string> = {
    "top-left": "border-l-2 border-t-2",
    "top-right": "border-r-2 border-t-2",
    "bottom-left": "border-l-2 border-b-2",
    "bottom-right": "border-r-2 border-b-2",
  };

  return (
    <div
      className={`pointer-events-none absolute ${borderStyles[position]}`}
      style={{
        ...positionStyles[position],
        width: size,
        height: size,
        borderColor: color,
      }}
    />
  );
}

export default ClassicTemplate;
