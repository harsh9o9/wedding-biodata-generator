"use client";

import React from "react";
import {
  TemplateProps,
  getVisibleSections,
  getVisibleFields,
  getPersonName,
  formatFieldValue,
} from "./types";

/**
 * ModernTemplate - Clean, contemporary design with minimal aesthetics
 * Features clear typography and structured layout
 */
export function ModernTemplate({ biodata, template, scale = 1 }: TemplateProps) {
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
        padding: spacing(32),
        backgroundColor: 'transparent',
      }}
    >
      {/* Subtle top accent bar */}
      <div
        className="absolute left-0 right-0 top-0"
        style={{
          height: spacing(4),
          background: `linear-gradient(90deg, ${template.colors.primary}, ${template.colors.accent})`,
        }}
      />

      {/* Content Area */}
      <div className="flex h-full flex-col">
        {/* Header Section */}
        <div
          className="mb-6 flex items-start gap-6"
          style={{
            marginBottom: spacing(24),
            gap: spacing(24),
          }}
        >
          {/* Photo (left aligned for modern) */}
          {biodata.photo?.url && (
            <div
              className="shrink-0 overflow-hidden shadow-lg"
              style={{
                width: biodata.photo.size === "small" ? spacing(70) : biodata.photo.size === "large" ? spacing(110) : spacing(90),
                height: biodata.photo.size === "small" ? spacing(87) : biodata.photo.size === "large" ? spacing(137) : spacing(112),
                borderRadius: biodata.photo.shape === "circle" ? "50%" : biodata.photo.shape === "rounded" ? spacing(8) : spacing(2),
                border: `${spacing(2)} solid ${template.colors.border}`,
              }}
            >
              <img
                src={biodata.photo.url}
                alt={personName}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Name and basic info */}
          <div className="flex-1">
            <p
              className="mb-1 uppercase tracking-widest"
              style={{
                fontSize: fontSize(9),
                color: template.colors.secondary,
                letterSpacing: "0.2em",
                marginBottom: spacing(4),
              }}
            >
              Wedding Biodata
            </p>
            <h1
              className="font-bold"
              style={{
                fontFamily: template.fonts.heading,
                fontSize: fontSize(26),
                color: template.colors.primary,
                lineHeight: 1.2,
              }}
            >
              {personName}
            </h1>
            <div
              className="mt-2"
              style={{
                width: spacing(60),
                height: spacing(3),
                backgroundColor: template.colors.accent,
                marginTop: spacing(8),
              }}
            />
          </div>
        </div>

        {/* Sections Grid - Modern card style */}
        <div
          className="grid flex-1 grid-cols-2 gap-4"
          style={{
            gap: spacing(16),
          }}
        >
          {visibleSections.map((section) => {
            const visibleFields = getVisibleFields(section.fields);
            if (visibleFields.length === 0) return null;

            return (
              <div
                key={section.id}
                className="rounded-lg"
                style={{
                  padding: spacing(14),
                  backgroundColor: `${template.colors.background}`,
                  border: `1px solid ${template.colors.border}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                {/* Section Header */}
                <div
                  className="mb-3 flex items-center gap-2"
                  style={{
                    marginBottom: spacing(10),
                    gap: spacing(8),
                  }}
                >
                  <div
                    className="rounded"
                    style={{
                      width: spacing(4),
                      height: spacing(16),
                      backgroundColor: template.colors.primary,
                    }}
                  />
                  <h3
                    className="font-semibold uppercase tracking-wide"
                    style={{
                      fontFamily: template.fonts.heading,
                      fontSize: fontSize(10),
                      color: template.colors.primary,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {section.title}
                  </h3>
                </div>

                {/* Fields List */}
                <div
                  className="space-y-1"
                  style={{ gap: spacing(6) }}
                >
                  {visibleFields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-baseline gap-2"
                      style={{
                        paddingTop: spacing(3),
                        paddingBottom: spacing(3),
                        gap: spacing(8),
                        borderBottom: `1px solid ${template.colors.border}`,
                      }}
                    >
                      <span
                        className="shrink-0 font-medium"
                        style={{
                          width: "40%",
                          fontSize: fontSize(9),
                          color: template.colors.secondary,
                        }}
                      >
                        {field.label}
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

        {/* Footer accent */}
        <div
          className="mt-4 flex items-center justify-center gap-2"
          style={{
            marginTop: spacing(16),
            gap: spacing(8),
          }}
        >
          <div
            style={{
              width: spacing(40),
              height: spacing(1),
              backgroundColor: template.colors.border,
            }}
          />
          <span
            style={{
              fontSize: fontSize(8),
              color: template.colors.secondary,
              letterSpacing: "0.1em",
            }}
          >
            ✦
          </span>
          <div
            style={{
              width: spacing(40),
              height: spacing(1),
              backgroundColor: template.colors.border,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ModernTemplate;
