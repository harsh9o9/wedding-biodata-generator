# Indian Wedding Biodata Generator

Create beautiful, customizable Indian wedding biodatas online. Choose from traditional and modern templates, add your personal details, and download as a professional PDF.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 📝 **Easy Form Input** - Intuitive form with all standard biodata fields
- 🎨 **Multiple Templates** - Classic, Modern, Elegant, and Royal designs
- 🖼️ **Custom Backgrounds** - Choose from provided backgrounds or upload your own
- 📷 **Photo Support** - Upload and position your photo with various frame styles
- 🌐 **Bilingual Support** - English and Hindi labels for all fields
- ✏️ **Fully Customizable** - Add, remove, or reorder sections and fields
- 📥 **PDF Export** - Download professional A4-sized PDFs
- 💾 **Auto-Save** - Your progress is automatically saved to browser storage
- 📤 **Import/Export** - Save and load biodata as JSON files

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/biodata-generator.git
cd biodata-generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── editor/            # Editor page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles & Tailwind config
├── components/
│   ├── ui/                # Base UI components (Button, Input, etc.)
│   ├── landing/           # Landing page components
│   ├── editor/            # Editor layout components
│   ├── form/              # Form input components
│   ├── preview/           # Preview container
│   └── templates/         # Template renderers
├── context/
│   └── BiodataContext.tsx # State management
├── hooks/                 # Custom React hooks
├── lib/
│   ├── utils.ts          # Utility functions
│   ├── validators.ts     # Form validation
│   └── pdf-generator.ts  # PDF generation
├── types/
│   └── biodata.ts        # TypeScript types
└── constants/
    ├── fields.ts         # Default biodata fields
    ├── templates.ts      # Template configurations
    └── theme.ts          # Color & style constants
```

## 🎨 Customization

### Templates

Four built-in templates are available:

- **Classic Traditional** - Timeless design with traditional borders
- **Modern Minimal** - Clean, contemporary look
- **Elegant Gold** - Luxurious design with gold accents
- **Royal Heritage** - Rich, regal Indian aesthetics

### Color Theme

The app uses an Indian wedding-inspired color palette:

- **Saffron** `#FF6B35` - Primary accent
- **Maroon** `#8B1538` - Traditional elegance
- **Gold** `#D4A84B` - Luxury accents
- **Cream** `#FFF9F0` - Warm backgrounds

### Fonts

- **Noto Sans** - Primary body font with Devanagari support
- **Noto Serif** - Secondary body font
- **Playfair Display** - Elegant heading font

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Sample background images included for demonstration
- Inspired by traditional Indian wedding biodata formats
- Built with love for the Indian diaspora worldwide

---

Made with ❤️ for Indian weddings
