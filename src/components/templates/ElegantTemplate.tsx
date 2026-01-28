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
 * ElegantTemplate - Luxurious design with gold accents and refined typography
 * Features centered layout with ornamental decorations
 */
export function ElegantTemplate({ biodata, template, scale = 1 }: TemplateProps) {
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
        padding: spacing(20),
      }}
    >
      {/* Elegant Gold Border Frame */}
      <div
        className="pointer-events-none absolute inset-3"
        style={{
          border: `3px double ${template.colors.primary}`,
          borderRadius: spacing(2),
        }}
      />
      <div
        className="pointer-events-none absolute inset-5"
        style={{
          border: `1px solid ${template.colors.accent}`,
          borderRadius: spacing(2),
        }}
      />

      {/* Ornamental Corners */}
      <OrnamentalCorner position="top-left" color={template.colors.primary} scale={scale} />
      <OrnamentalCorner position="top-right" color={template.colors.primary} scale={scale} />
      <OrnamentalCorner position="bottom-left" color={template.colors.primary} scale={scale} />
      <OrnamentalCorner position="bottom-right" color={template.colors.primary} scale={scale} />

      {/* Content */}
      <div
        className="relative z-10 flex h-full flex-col"
        style={{ padding: spacing(24) }}
      >
        {/* Header with Om symbol */}
        <div className="mb-4 text-center" style={{ marginBottom: spacing(12) }}>
          <div
            style={{
              fontSize: fontSize(24),
              color: template.colors.primary,
              lineHeight: 1,
            }}
          >
            ॐ
          </div>
          {biodata.meta.religiousInvocation && getInvocationText(
            biodata.meta.religiousInvocation.preset,
            biodata.meta.religiousInvocation.customText
          ) && (
            <p
              className="mt-1"
              style={{
                fontSize: fontSize(9),
                color: template.colors.secondary,
                letterSpacing: "0.2em",
                marginTop: spacing(4),
              }}
            >
              {getInvocationText(
                biodata.meta.religiousInvocation.preset,
                biodata.meta.religiousInvocation.customText
              )}
            </p>
          )}
        </div>

        {/* Decorative Header Divider */}
        <div className="mb-4 flex items-center justify-center" style={{ marginBottom: spacing(12) }}>
          <div
            style={{
              flex: 1,
              height: spacing(1),
              background: `linear-gradient(90deg, transparent, ${template.colors.primary})`,
            }}
          />
          <div
            className="px-4"
            style={{
              padding: `0 ${spacing(16)}`,
            }}
          >
            <span
              className="font-bold uppercase tracking-widest"
              style={{
                fontFamily: template.fonts.heading,
                fontSize: fontSize(22),
                color: template.colors.primary,
                letterSpacing: "0.15em",
              }}
            >
              BIODATA
            </span>
          </div>
          <div
            style={{
              flex: 1,
              height: spacing(1),
              background: `linear-gradient(270deg, transparent, ${template.colors.primary})`,
            }}
          />
        </div>

        {/* Photo - Centered with elegant frame */}
        {biodata.photo?.url && (
          <div
            className="mx-auto mb-4"
            style={{ marginBottom: spacing(14) }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                width: biodata.photo.size === "small" ? spacing(85) : biodata.photo.size === "large" ? spacing(130) : spacing(110),
                height: biodata.photo.size === "small" ? spacing(106) : biodata.photo.size === "large" ? spacing(162) : spacing(137),
                borderRadius: biodata.photo.shape === "circle" ? "50%" : biodata.photo.shape === "oval" ? "50% / 55%" : spacing(4),
                border: `4px double ${template.colors.primary}`,
                boxShadow: `0 0 0 2px ${template.colors.background}, 0 0 0 4px ${template.colors.accent}`,
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

        {/* Name with decorative underline */}
        <div className="mb-4 text-center" style={{ marginBottom: spacing(14) }}>
          <h1
            className="font-bold"
            style={{
              fontFamily: template.fonts.heading,
              fontSize: fontSize(20),
              color: template.colors.secondary,
              letterSpacing: "0.03em",
            }}
          >
            {personName}
          </h1>
          <div
            className="mx-auto mt-2"
            style={{
              width: spacing(100),
              height: spacing(2),
              background: `linear-gradient(90deg, transparent, ${template.colors.primary}, ${template.colors.primary}, transparent)`,
              marginTop: spacing(6),
            }}
          />
        </div>

        {/* Sections */}
        <div className="flex-1 space-y-2" style={{ gap: spacing(8) }}>
          {visibleSections.map((section) => {
            const visibleFields = getVisibleFields(section.fields);
            if (visibleFields.length === 0) return null;

            return (
              <div key={section.id} style={{ marginBottom: spacing(10) }}>
                {/* Section Title with elegant styling */}
                <div className="mb-2 text-center" style={{ marginBottom: spacing(6) }}>
                  <h3
                    className="inline-block font-semibold uppercase tracking-wider"
                    style={{
                      fontFamily: template.fonts.heading,
                      fontSize: fontSize(10),
                      color: template.colors.primary,
                      letterSpacing: "0.1em",
                      padding: `${spacing(2)} ${spacing(16)}`,
                      borderBottom: `2px solid ${template.colors.accent}`,
                    }}
                  >
                    {section.title}
                  </h3>
                </div>

                {/* Fields - Two column elegant layout */}
                <div
                  className="grid grid-cols-2 gap-2"
                  style={{ gap: `${spacing(3)} ${spacing(20)}` }}
                >
                  {visibleFields.map((field) => (
                    <div
                      key={field.id}
                      className="flex gap-2"
                      style={{
                        gap: spacing(8),
                        paddingTop: spacing(2),
                        paddingBottom: spacing(2),
                      }}
                    >
                      <span
                        className="shrink-0 font-medium"
                        style={{
                          fontSize: fontSize(9),
                          color: template.colors.secondary,
                          width: "45%",
                        }}
                      >
                        {field.label}:
                      </span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: fontSize(9),
                          color: template.colors.text,
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

        {/* Footer ornament */}
        <div
          className="mt-4 flex items-center justify-center gap-3"
          style={{ marginTop: spacing(12), gap: spacing(12) }}
        >
          <span style={{ color: template.colors.primary, fontSize: fontSize(10) }}>✧</span>
          <span style={{ color: template.colors.accent, fontSize: fontSize(14) }}>❧</span>
          <span style={{ color: template.colors.primary, fontSize: fontSize(10) }}>✧</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Ornamental corner decorations for elegant template
 */
function OrnamentalCorner({
  position,
  color,
  scale,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color: string;
  scale: number;
}) {
  const size = 32 * scale;
  const offset = 10 * scale;

  const positionStyles: Record<string, React.CSSProperties> = {
    "top-left": { top: offset, left: offset, transform: "rotate(0deg)" },
    "top-right": { top: offset, right: offset, transform: "rotate(90deg)" },
    "bottom-left": { bottom: offset, left: offset, transform: "rotate(-90deg)" },
    "bottom-right": { bottom: offset, right: offset, transform: "rotate(180deg)" },
  };

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        ...positionStyles[position],
        width: size,
        height: size,
      }}
    >
      {/* L-shaped corner with decorative element */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 3 * scale,
          backgroundColor: color,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 3 * scale,
          height: "100%",
          backgroundColor: color,
        }}
      />
      {/* Inner dot decoration */}
      <div
        style={{
          position: "absolute",
          top: 8 * scale,
          left: 8 * scale,
          width: 4 * scale,
          height: 4 * scale,
          backgroundColor: color,
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

export default ElegantTemplate;
