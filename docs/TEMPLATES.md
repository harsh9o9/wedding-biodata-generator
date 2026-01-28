# Templates Documentation

This document describes the template system in the Indian Wedding Biodata Generator.

## Table of Contents

- [Overview](#overview)
- [Available Templates](#available-templates)
- [Template Structure](#template-structure)
- [Creating Custom Templates](#creating-custom-templates)
- [Template Colors](#template-colors)
- [Best Practices](#best-practices)

## Overview

Templates define the visual appearance of the biodata. Each template consists of:

1. **Preview Component**: HTML/CSS component for live preview in the editor
2. **PDF Component**: @react-pdf/renderer component for PDF export
3. **Configuration**: Color scheme, fonts, and layout settings

## Available Templates

### 1. Classic Traditional

A timeless design inspired by traditional Indian biodata formats.

**Key Features:**
- Double border frame with corner decorations
- Centered layout
- Sanskrit blessing header ("॥ श्री गणेशाय नमः ॥")
- Serif typography for elegance
- Two-column field layout

**Color Scheme:**
- Primary: Maroon (#8B1538)
- Secondary: Dark brown (#4A3728)
- Accent: Gold (#D4A84B)
- Background: Cream (#FFF9F0)

### 2. Modern Minimal

A clean, contemporary design for those who prefer simplicity.

**Key Features:**
- Top color bar accent
- Left-aligned photo with right-aligned name
- Card-based sections
- Sans-serif typography
- Subtle borders

**Color Scheme:**
- Primary: Deep teal (#1A5F7A)
- Secondary: Charcoal (#374151)
- Accent: Coral (#FF6B6B)
- Background: White (#FFFFFF)

### 3. Elegant Gold

A luxurious design with rich gold accents.

**Key Features:**
- Double decorative border
- Om symbol header
- Centered symmetrical layout
- Elegant script fonts
- Gold dividers and accents

**Color Scheme:**
- Primary: Rich gold (#C4A84B)
- Secondary: Deep burgundy (#722F37)
- Accent: Antique gold (#B8860B)
- Background: Ivory (#FFFFF0)

### 4. Royal Heritage

A regal design inspired by royal Indian aesthetics.

**Key Features:**
- Triple border frame
- Banner-style title
- Decorative dividers
- Bold typography
- Dotted field separators

**Color Scheme:**
- Primary: Royal purple (#4A0E4E)
- Secondary: Deep magenta (#800040)
- Accent: Bright gold (#FFD700)
- Background: Pale lavender (#F8F4FF)

## Template Structure

### Configuration Object

```typescript
interface BiodataTemplate {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent?: string;
  };
  features: string[];
}
```

### Example Configuration

```typescript
const classicTemplate: BiodataTemplate = {
  id: "classic",
  name: "Classic Traditional",
  description: "Timeless design with traditional borders and elegant typography",
  thumbnail: "/templates/classic-thumb.png",
  colors: {
    primary: "#8B1538",
    secondary: "#4A3728",
    accent: "#D4A84B",
    background: "#FFF9F0",
    text: "#1A1410",
    border: "#D4A84B",
  },
  fonts: {
    heading: "Playfair Display",
    body: "Noto Sans",
  },
  features: ["Traditional borders", "Sanskrit header", "Centered layout"],
};
```

## Creating Custom Templates

### Step 1: Create Preview Component

Create a new file in `src/components/templates/`:

```typescript
// src/components/templates/CustomTemplate.tsx
import React from "react";
import { Biodata, BiodataTemplate } from "@/types/biodata";

interface CustomTemplateProps {
  biodata: Biodata;
  template: BiodataTemplate;
  scale?: number;
}

export function CustomTemplate({ biodata, template, scale = 1 }: CustomTemplateProps) {
  // Get visible sections and fields
  const visibleSections = biodata.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div
      className="relative h-full w-full"
      style={{
        padding: `${40 * scale}px`,
        fontFamily: template.fonts.body,
        color: template.colors.text,
      }}
    >
      {/* Header */}
      <header className="text-center">
        <h1 style={{ 
          color: template.colors.primary,
          fontFamily: template.fonts.heading 
        }}>
          BIODATA
        </h1>
      </header>

      {/* Sections */}
      {visibleSections.map((section) => (
        <section key={section.id}>
          <h2 style={{ color: template.colors.secondary }}>
            {section.title}
          </h2>
          {/* Render fields */}
        </section>
      ))}
    </div>
  );
}
```

### Step 2: Create PDF Component

Add the PDF version in `src/lib/pdf-generator.ts`:

```typescript
function CustomPDFTemplate({
  biodata,
  template,
}: {
  biodata: Biodata;
  template: BiodataTemplate;
}) {
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: "Noto Sans",
      backgroundColor: template.colors.background,
    },
    // Add more styles...
  });

  return createElement(
    Document,
    null,
    createElement(
      Page,
      { size: "A4", style: styles.page },
      // Add PDF elements...
    )
  );
}
```

### Step 3: Register Template

Add the template configuration in `src/constants/templates.ts`:

```typescript
export const TEMPLATES: Record<TemplateId, BiodataTemplate> = {
  // ... existing templates
  custom: {
    id: "custom",
    name: "Custom Template",
    description: "Your custom design",
    thumbnail: "/templates/custom-thumb.png",
    colors: {
      primary: "#YOUR_COLOR",
      // ...
    },
    fonts: {
      heading: "Your Font",
      body: "Your Font",
    },
    features: ["Feature 1", "Feature 2"],
  },
};
```

### Step 4: Update Template Registry

Add to the template component map in `src/components/templates/index.ts`:

```typescript
import { CustomTemplate } from "./CustomTemplate";

export const TEMPLATE_COMPONENTS = {
  // ... existing
  custom: CustomTemplate,
};
```

## Template Colors

### Indian Wedding Color Palette

| Color | Hex | Meaning |
|-------|-----|---------|
| Saffron | #FF6B35 | Auspiciousness, purity |
| Maroon | #8B1538 | Fertility, prosperity |
| Gold | #D4A84B | Wealth, prosperity |
| Red | #DC2626 | Love, passion |
| Green | #059669 | New beginnings |
| Pink | #EC4899 | Tenderness, love |
| Cream | #FFF9F0 | Purity, peace |

### Color Accessibility

Ensure sufficient contrast ratios:
- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **UI components**: 3:1 minimum

Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify.

## Best Practices

### 1. Responsive Scaling

Templates should scale proportionally:

```typescript
// Use scale prop for all dimensions
<div style={{ padding: `${40 * scale}px` }}>
  <h1 style={{ fontSize: `${24 * scale}px` }}>
    Title
  </h1>
</div>
```

### 2. Print Optimization

For PDF output:
- Use CMYK-friendly colors when possible
- Avoid very thin lines (< 0.5pt)
- Test actual print output

### 3. Content Overflow

Handle long content gracefully:
- Truncate with ellipsis for single-line fields
- Allow wrapping for address/description fields
- Test with maximum length content

### 4. Image Handling

Photo considerations:
- Support different shapes (square, circle, rounded)
- Maintain aspect ratio
- Provide placeholder for missing photo

### 5. Cultural Sensitivity

- Include appropriate religious symbols (optional)
- Support bilingual labels (English/Hindi)
- Respect traditional layout expectations

## Troubleshooting

### Common Issues

**1. PDF fonts not loading**
- Ensure fonts are registered with @react-pdf/renderer
- Check font URL accessibility

**2. Color mismatch between preview and PDF**
- Use RGB colors consistently
- Test both outputs side by side

**3. Layout shifts on different data**
- Test with empty fields
- Test with maximum length content
- Use fixed widths where appropriate
