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
 * RoyalTemplate - Rich, regal design inspired by royal Indian aesthetics
 * Features ornate borders, deep colors, and majestic typography
 */
export function RoyalTemplate({ biodata, template, scale = 1 }: TemplateProps) {
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
        padding: spacing(16),
      }}
    >
      {/* Royal Ornate Border - Multiple layers */}
      <div
        className="pointer-events-none absolute inset-2"
        style={{
          border: `4px solid ${template.colors.primary}`,
          borderRadius: spacing(4),
        }}
      />
      <div
        className="pointer-events-none absolute inset-4"
        style={{
          border: `2px solid ${template.colors.secondary}`,
          borderRadius: spacing(2),
        }}
      />
      <div
        className="pointer-events-none absolute inset-6"
        style={{
          border: `1px solid ${template.colors.accent}`,
          borderRadius: spacing(2),
        }}
      />

      {/* Royal Corner Emblems */}
      <RoyalCorner position="top-left" colors={template.colors} scale={scale} />
      <RoyalCorner position="top-right" colors={template.colors} scale={scale} />
      <RoyalCorner position="bottom-left" colors={template.colors} scale={scale} />
      <RoyalCorner position="bottom-right" colors={template.colors} scale={scale} />

      {/* Top Crest */}
      <div
        className="absolute left-1/2 top-3 -translate-x-1/2"
        style={{
          top: spacing(12),
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: spacing(50),
            height: spacing(24),
            backgroundColor: template.colors.secondary,
            borderRadius: `0 0 ${spacing(25)} ${spacing(25)}`,
            border: `2px solid ${template.colors.accent}`,
            borderTop: "none",
          }}
        >
          <span
            style={{
              color: template.colors.accent,
              fontSize: fontSize(14),
            }}
          >
            ॐ
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex h-full flex-col"
        style={{ padding: spacing(28) }}
      >
        {/* Header */}
        {biodata.meta.religiousInvocation && getInvocationText(
          biodata.meta.religiousInvocation.preset,
          biodata.meta.religiousInvocation.customText
        ) && (
          <div className="mb-3 text-center" style={{ marginBottom: spacing(8) }}>
            <p
              style={{
                fontSize: fontSize(9),
                color: template.colors.accent,
                letterSpacing: "0.25em",
              }}
            >
              {getInvocationText(
                biodata.meta.religiousInvocation.preset,
                biodata.meta.religiousInvocation.customText
              )}
            </p>
          </div>
        )}

        {/* Royal Title Banner */}
        <div
          className="relative mx-auto mb-4 text-center"
          style={{
            marginBottom: spacing(14),
            padding: `${spacing(10)} ${spacing(40)}`,
            backgroundColor: template.colors.primary,
            clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
          }}
        >
          <h1
            className="font-bold uppercase tracking-widest"
            style={{
              fontFamily: template.fonts.heading,
              fontSize: fontSize(22),
              color: template.colors.secondary,
              letterSpacing: "0.12em",
              textShadow: `1px 1px 0 ${template.colors.accent}`,
            }}
          >
            BIODATA
          </h1>
        </div>

        {/* Photo with royal frame */}
        {biodata.photo?.url && (
          <div
            className="mx-auto mb-4"
            style={{ marginBottom: spacing(12) }}
          >
            <div
              className="relative"
              style={{
                padding: spacing(4),
                background: `linear-gradient(135deg, ${template.colors.secondary}, ${template.colors.primary})`,
                borderRadius: biodata.photo.shape === "circle" ? "50%" : spacing(4),
              }}
            >
              <div
                className="overflow-hidden"
                style={{
                  width: biodata.photo.size === "small" ? spacing(75) : biodata.photo.size === "large" ? spacing(115) : spacing(95),
                  height: biodata.photo.size === "small" ? spacing(93) : biodata.photo.size === "large" ? spacing(143) : spacing(118),
                  borderRadius: biodata.photo.shape === "circle" ? "50%" : spacing(2),
                  border: `3px solid ${template.colors.accent}`,
                }}
              >
                <img
                  src={biodata.photo.url}
                  alt={personName}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Name with royal styling */}
        <div className="mb-4 text-center" style={{ marginBottom: spacing(12) }}>
          <h2
            className="font-bold"
            style={{
              fontFamily: template.fonts.heading,
              fontSize: fontSize(18),
              color: template.colors.primary,
              letterSpacing: "0.05em",
            }}
          >
            {personName}
          </h2>
          <div
            className="mx-auto mt-2 flex items-center justify-center gap-2"
            style={{
              marginTop: spacing(6),
              gap: spacing(8),
            }}
          >
            <div
              style={{
                width: spacing(30),
                height: spacing(2),
                backgroundColor: template.colors.accent,
              }}
            />
            <div
              style={{
                width: spacing(8),
                height: spacing(8),
                backgroundColor: template.colors.accent,
                transform: "rotate(45deg)",
              }}
            />
            <div
              style={{
                width: spacing(30),
                height: spacing(2),
                backgroundColor: template.colors.accent,
              }}
            />
          </div>
        </div>

        {/* Sections */}
        <div className="flex-1 space-y-2" style={{ gap: spacing(8) }}>
          {visibleSections.map((section) => {
            const visibleFields = getVisibleFields(section.fields);
            if (visibleFields.length === 0) return null;

            return (
              <div key={section.id} style={{ marginBottom: spacing(10) }}>
                {/* Royal Section Header */}
                <div
                  className="mb-2 flex items-center gap-2"
                  style={{
                    marginBottom: spacing(6),
                    gap: spacing(8),
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: spacing(1),
                      background: `linear-gradient(90deg, ${template.colors.primary}, ${template.colors.accent})`,
                    }}
                  />
                  <h3
                    className="shrink-0 font-semibold uppercase tracking-wide"
                    style={{
                      fontFamily: template.fonts.heading,
                      fontSize: fontSize(10),
                      color: template.colors.primary,
                      letterSpacing: "0.08em",
                      padding: `${spacing(3)} ${spacing(12)}`,
                      backgroundColor: template.colors.background,
                      border: `1px solid ${template.colors.accent}`,
                      borderRadius: spacing(2),
                    }}
                  >
                    {section.title}
                  </h3>
                  <div
                    style={{
                      flex: 1,
                      height: spacing(1),
                      background: `linear-gradient(270deg, ${template.colors.primary}, ${template.colors.accent})`,
                    }}
                  />
                </div>

                {/* Fields */}
                <div
                  className="grid grid-cols-2 gap-2"
                  style={{ gap: `${spacing(4)} ${spacing(16)}` }}
                >
                  {visibleFields.map((field) => (
                    <div
                      key={field.id}
                      className="flex gap-2"
                      style={{
                        gap: spacing(8),
                        paddingTop: spacing(2),
                        paddingBottom: spacing(2),
                        borderBottom: `1px dotted ${template.colors.border}`,
                      }}
                    >
                      <span
                        className="shrink-0 font-medium"
                        style={{
                          width: "45%",
                          fontSize: fontSize(9),
                          color: template.colors.primary,
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

        {/* Royal Footer */}
        <div
          className="mt-3 flex items-center justify-center gap-3"
          style={{
            marginTop: spacing(10),
            gap: spacing(12),
          }}
        >
          <span style={{ color: template.colors.accent, fontSize: fontSize(12) }}>❖</span>
          <span style={{ color: template.colors.primary, fontSize: fontSize(8), letterSpacing: "0.1em" }}>
            शुभ विवाह
          </span>
          <span style={{ color: template.colors.accent, fontSize: fontSize(12) }}>❖</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Royal corner decoration component
 */
function RoyalCorner({
  position,
  colors,
  scale,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  colors: { primary: string; secondary: string; accent: string };
  scale: number;
}) {
  const size = 36 * scale;
  const offset = 6 * scale;

  const positionStyles: Record<string, React.CSSProperties> = {
    "top-left": { top: offset, left: offset },
    "top-right": { top: offset, right: offset },
    "bottom-left": { bottom: offset, left: offset },
    "bottom-right": { bottom: offset, right: offset },
  };

  const rotations: Record<string, string> = {
    "top-left": "rotate(0deg)",
    "top-right": "rotate(90deg)",
    "bottom-left": "rotate(-90deg)",
    "bottom-right": "rotate(180deg)",
  };

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        ...positionStyles[position],
        width: size,
        height: size,
        transform: rotations[position],
      }}
    >
      {/* Outer L */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 4 * scale,
          backgroundColor: colors.primary,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 4 * scale,
          height: "100%",
          backgroundColor: colors.primary,
        }}
      />
      {/* Inner accent */}
      <div
        style={{
          position: "absolute",
          top: 6 * scale,
          left: 6 * scale,
          width: "70%",
          height: 2 * scale,
          backgroundColor: colors.accent,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 6 * scale,
          left: 6 * scale,
          width: 2 * scale,
          height: "70%",
          backgroundColor: colors.accent,
        }}
      />
      {/* Diamond decoration */}
      <div
        style={{
          position: "absolute",
          top: 12 * scale,
          left: 12 * scale,
          width: 6 * scale,
          height: 6 * scale,
          backgroundColor: colors.secondary,
          transform: "rotate(45deg)",
        }}
      />
    </div>
  );
}

export default RoyalTemplate;
