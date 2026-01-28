# Architecture Documentation

This document describes the technical architecture of the Indian Wedding Biodata Generator application.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Application Structure](#application-structure)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Component Architecture](#component-architecture)
- [PDF Generation](#pdf-generation)
- [Performance Considerations](#performance-considerations)

## Overview

The Indian Wedding Biodata Generator is a Next.js application that allows users to create, customize, and export wedding biodatas. The application runs entirely client-side with no backend dependencies, storing all data in browser localStorage.

### Key Design Principles

1. **Client-Side First**: All operations happen in the browser
2. **Privacy Focused**: No data sent to servers
3. **Progressive Enhancement**: Works without JavaScript for basic viewing
4. **Responsive Design**: Mobile-first approach
5. **Accessibility**: WCAG 2.1 AA compliant

## Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React Framework | 16.x |
| TypeScript | Type Safety | 5.x |
| Tailwind CSS | Styling | 4.x |
| Radix UI | Accessible Components | Latest |
| @react-pdf/renderer | PDF Generation | 3.x |
| Lucide React | Icons | Latest |

## Application Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── editor/            # Editor route
│   │   ├── page.tsx       # Editor page
│   │   ├── error.tsx      # Error boundary
│   │   └── loading.tsx    # Loading state
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── error.tsx          # Global error boundary
│   ├── not-found.tsx      # 404 page
│   ├── sitemap.ts         # SEO sitemap
│   └── robots.ts          # SEO robots.txt
│
├── components/
│   ├── ui/                # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── ...
│   │
│   ├── landing/           # Landing page components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── ...
│   │
│   ├── editor/            # Editor components
│   │   ├── EditorLayout.tsx
│   │   ├── TemplateSelector.tsx
│   │   └── ...
│   │
│   ├── form/              # Form components
│   │   ├── BiodataForm.tsx
│   │   ├── FormSection.tsx
│   │   └── ...
│   │
│   ├── preview/           # Preview components
│   │   └── PreviewContainer.tsx
│   │
│   └── templates/         # Template renderers
│       ├── ClassicTemplate.tsx
│       ├── ModernTemplate.tsx
│       └── ...
│
├── context/
│   └── BiodataContext.tsx # Global state management
│
├── hooks/
│   ├── useBiodataForm.ts  # Form handling hook
│   ├── useDebounce.ts     # Debounce utility
│   ├── useLocalStorage.ts # Storage hook
│   └── useMediaQuery.ts   # Responsive hook
│
├── lib/
│   ├── utils.ts           # Utility functions
│   ├── validators.ts      # Validation logic
│   └── pdf-generator.ts   # PDF generation
│
├── types/
│   └── biodata.ts         # TypeScript definitions
│
└── constants/
    ├── fields.ts          # Default biodata fields
    ├── templates.ts       # Template configurations
    └── theme.ts           # Theme constants
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                            │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BiodataContext                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   State     │  │   Reducer   │  │   Action Dispatchers    │  │
│  │  (Biodata)  │←─│             │←─│  (updateField, etc.)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                      ▼
         ┌──────────────────┐    ┌──────────────────┐
         │   localStorage   │    │  Preview/Export  │
         │   (Persistence)  │    │   (PDF, JSON)    │
         └──────────────────┘    └──────────────────┘
```

### State Updates

1. User inputs data in form
2. Form dispatches action to BiodataContext
3. Reducer updates state immutably
4. Components re-render with new data
5. Auto-save triggers to localStorage (debounced)
6. Preview updates with debounced biodata

## State Management

### BiodataContext

The application uses React Context with useReducer for state management:

```typescript
// State shape
interface Biodata {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  meta: BiodataMeta;
  sections: BiodataSection[];
  photo?: BiodataPhoto;
  templateId: TemplateId;
  background: BiodataBackground;
  customStyles?: CustomStyles;
}

// Available actions
type BiodataAction =
  | { type: "UPDATE_FIELD"; sectionId: string; fieldId: string; value: string }
  | { type: "ADD_FIELD"; sectionId: string; field: BiodataField }
  | { type: "REMOVE_FIELD"; sectionId: string; fieldId: string }
  | { type: "ADD_SECTION"; section: BiodataSection }
  | { type: "REMOVE_SECTION"; sectionId: string }
  | { type: "REORDER_SECTIONS"; sectionIds: string[] }
  | { type: "SET_TEMPLATE"; templateId: TemplateId }
  | { type: "SET_BACKGROUND"; background: BiodataBackground }
  | { type: "IMPORT_DATA"; data: Biodata }
  | { type: "RESET" };
```

### Persistence Strategy

- **Auto-save**: Every state change triggers a debounced save (500ms)
- **Storage Key**: `biodata_generator_data`
- **Error Handling**: Graceful degradation if localStorage unavailable
- **Quota Management**: Warning when approaching storage limits

## Component Architecture

### Component Hierarchy

```
EditorPage
├── BiodataProvider (Context)
│   ├── Header (Navigation)
│   └── EditorLayout
│       ├── FormPanel
│       │   ├── Tabs (Content, Design, Settings)
│       │   ├── BiodataForm
│       │   │   └── FormSection[]
│       │   │       └── DynamicField[]
│       │   ├── TemplateSelector
│       │   └── BackgroundSelector
│       │
│       └── PreviewPanel
│           └── PreviewContainer
│               └── TemplateComponent (dynamic)
```

### Component Design Patterns

1. **Compound Components**: Used for complex UI like Accordion, Tabs
2. **Render Props**: For flexible form field rendering
3. **Controlled Components**: All form inputs are controlled
4. **Memoization**: Heavy components wrapped with React.memo

## PDF Generation

### Architecture

```
Biodata State
     │
     ▼
┌────────────────┐
│ PDF Template   │  (React-PDF components)
│ Selection      │
└────────────────┘
     │
     ▼
┌────────────────┐
│ @react-pdf/    │  (Render to PDF)
│ renderer       │
└────────────────┘
     │
     ▼
┌────────────────┐
│ Blob/Download  │
└────────────────┘
```

### PDF Templates

Each template is implemented twice:
1. **Preview Component**: HTML/CSS for live preview
2. **PDF Component**: @react-pdf/renderer for export

Templates share the same data structure but render differently for each output.

### Font Handling

- Fonts registered with @react-pdf/renderer
- Google Fonts loaded via CDN
- Fallback to system fonts if loading fails

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**
   - Dynamic imports for templates
   - Route-based splitting by Next.js

2. **Memoization**
   - `useMemo` for expensive computations
   - `useCallback` for event handlers
   - `React.memo` for pure components

3. **Debouncing**
   - Preview updates: 300ms debounce
   - Auto-save: 500ms debounce

4. **Image Optimization**
   - Background images compressed
   - User photos compressed before storage
   - next/image for automatic optimization

### Performance Metrics (Targets)

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Cumulative Layout Shift | < 0.1 |
| Lighthouse Score | > 90 |

### Bundle Analysis

Run bundle analysis:
```bash
npm run analyze
```

## Error Handling

### Error Boundaries

1. **Global Error Boundary** (`app/error.tsx`)
   - Catches unhandled errors
   - Shows recovery UI

2. **Editor Error Boundary** (`app/editor/error.tsx`)
   - Specific to editor page
   - Offers data clearing option

### Error Recovery

- LocalStorage errors: Fallback to memory state
- PDF generation errors: User-friendly messages
- Network errors: Graceful degradation

## Security Considerations

1. **XSS Prevention**: User input sanitized before rendering
2. **No Server Data**: All data stays client-side
3. **Content Security Policy**: Strict CSP headers
4. **Dependencies**: Regular security audits

## Future Considerations

- **PWA Support**: Add service worker for offline use
- **Cloud Sync**: Optional account-based storage
- **Collaboration**: Share drafts via links
- **i18n**: Multi-language support beyond Hindi
