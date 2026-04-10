# m780f - Microsoft Word Simulator

A high-fidelity, web-based Microsoft Word simulator optimized for mobile and tablet devices. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Ribbon Interface:** Authentic Word-like tabs (File, Home, Insert, Layout, View).
- **Document Editor:** Rich text editing with support for formatting (Bold, Italic, Underline, Lists, Alignment).
- **Insert Tools:** Support for inserting tables and images.
- **Virtual Keyboard:** Custom on-screen keyboard with PC-like keys (Shift, Tab, Ctrl, Alt, etc.).
- **Mobile Optimized:** 
  - Auto-collapsing ribbon in landscape mode.
  - Smart auto-scroll to keep the cursor visible while typing.
  - Responsive design for phones and tablets.
- **Focus Mode:** Toggle the ribbon to maximize writing space.

## Tech Stack

- **Framework:** React 19
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Build Tool:** Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/m780f.git
   cd m780f
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages using GitHub Actions.

1. Go to your repository settings on GitHub.
2. Navigate to **Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. The included workflow in `.github/workflows/deploy.yml` will handle the rest.

## License

MIT License
