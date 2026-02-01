# Wedding Biodata Generator

Create beautiful, customizable Indian wedding biodatas online with multiple templates and PDF export.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- 📝 Intuitive form with standard biodata fields
- 🎨 4 templates: Classic, Modern, Elegant, Royal
- 🖼️ Custom backgrounds and photo upload
- 📥 PDF export (A4 format)
- 💾 Auto-save to browser storage
- 📤 Import/Export JSON

## Getting Started

### Prerequisites

- Node.js 24.6.0 or higher
- npm

### Installation

```bash
git clone https://github.com/yourusername/wedding-biodata-generator.git
cd wedding-biodata-generator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── ui/                # Base UI components
│   ├── landing/           # Landing page
│   ├── editor/            # Editor components
│   ├── form/              # Form components
│   ├── preview/           # Preview
│   └── templates/         # Template renderers
├── context/               # State management
├── hooks/                 # Custom hooks
├── lib/                   # Utilities & PDF generation
├── types/                 # TypeScript types
└── constants/             # Configuration
```

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: Lucide React

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | Run ESLint |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Templates](docs/TEMPLATES.md)
- [Contributing](CONTRIBUTING.md)

## License

MIT License - see [LICENSE](LICENSE) file

---

Made with ❤️ for Indian weddings
