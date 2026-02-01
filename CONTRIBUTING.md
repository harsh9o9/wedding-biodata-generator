# Contributing to Indian Wedding Biodata Generator

Thank you for your interest in contributing to the Indian Wedding Biodata Generator! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Documentation](#documentation)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful in all interactions and follow these principles:

- Be inclusive and welcoming
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 24.6.0 or higher
- npm
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   
   Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**
   
   ```bash
   git clone https://github.com/YOUR_USERNAME/wedding-biodata-generator.git
   cd wedding-biodata-generator
   ```

3. **Install dependencies**
   
   ```bash
   npm install
   ```

4. **Create a branch**
   
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Start the development server**
   
   ```bash
   npm run dev
   ```

6. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Making Changes

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-new-template`)
- `fix/` - Bug fixes (e.g., `fix/pdf-generation-error`)
- `docs/` - Documentation changes (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/simplify-context`)
- `style/` - Style/UI changes (e.g., `style/update-colors`)

### Commit Message Format

Follow the conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `chore`: Build process or auxiliary tool changes

Examples:
```bash
feat(templates): add new minimalist template design
fix(pdf): resolve font rendering issue in PDF export
docs(readme): update installation instructions
```

## Pull Request Process

1. **Update your branch**
   
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run quality checks**
   
   ```bash
   npm run lint
   npm run build
   ```

3. **Push your changes**
   
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request**
   
   - Go to the repository on GitHub
   - Click "Compare & pull request"
   - Fill in the PR template with:
     - Description of changes
     - Related issue numbers
     - Screenshots (for UI changes)

5. **Code Review**
   
   - Address reviewer feedback
   - Keep the PR updated with the latest main branch
   - Ensure all CI checks pass

## Coding Standards

### TypeScript

- Use strict TypeScript typing
- Avoid `any` type; use `unknown` if type is truly unknown
- Export types/interfaces from dedicated type files
- Use explicit return types for functions

```typescript
// Good
export function calculateAge(birthDate: Date): number {
  // implementation
}

// Avoid
export function calculateAge(birthDate: any) {
  // implementation
}
```

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop typing

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  // implementation
}
```

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Create custom classes only when necessary
- Follow mobile-first responsive design
- Use CSS variables for theme colors

```tsx
// Good - Using Tailwind utilities
<button className="rounded-lg bg-saffron-500 px-4 py-2 text-white hover:bg-saffron-600">
  Click me
</button>
```

### File Organization

```
src/
├── app/           # Next.js pages and layouts
├── components/    # React components
│   ├── ui/       # Base UI components
│   └── [feature]/ # Feature-specific components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── types/         # TypeScript types
└── constants/     # Constants and configurations
```

## Documentation

### Code Comments

- Add JSDoc comments for exported functions and components
- Explain complex logic with inline comments
- Keep comments up-to-date with code changes

```typescript
/**
 * Generate a PDF from biodata content
 * @param biodata - The biodata object to convert
 * @returns Promise<Blob> - PDF file as Blob
 * @throws Error if PDF generation fails
 */
export async function generatePDF(biodata: Biodata): Promise<Blob> {
  // implementation
}
```

### README Updates

- Update README.md for new features
- Include usage examples
- Add screenshots for UI changes

## Questions?

If you have questions, feel free to:

1. Open a GitHub issue
2. Start a discussion in the Discussions tab
3. Reach out to maintainers

Thank you for contributing! 🙏
