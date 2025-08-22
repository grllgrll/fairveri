# FairVeri Website

FAIR Veri Prensiplerini Öğrenin ve Veri Setinizi Değerlendirin | Learn FAIR Data Principles and Assess Your Dataset

A comprehensive bilingual (Turkish/English) web application for learning and implementing FAIR (Findable, Accessible, Interoperable, Reusable) data principles with interactive assessment tools.

## Project Structure

```
fairveri-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with header/footer
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles with design system
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── button.tsx      # Button component
│   │   │   └── card.tsx        # Card components
│   │   ├── layout/             # Layout components
│   │   │   ├── header.tsx      # Site header with navigation
│   │   │   └── footer.tsx      # Site footer
│   │   └── features/           # Feature-specific components
│   │       └── feature-card.tsx # Feature display card
│   ├── lib/                    # Utility functions
│   │   └── utils.ts            # Common utilities (cn, formatDate, etc.)
│   └── data/                   # JSON data files
│       ├── features.json       # Feature definitions
│       └── navigation.json     # Navigation structure
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Features

### Core Features
- **Interactive FAIR Assessment Tool**: Comprehensive 15-question assessment covering all FAIR principles
- **Bilingual Support**: Full Turkish and English language support with automatic detection
- **Learning Resources**: Educational content and examples for each FAIR principle
- **Progress Tracking**: Save and resume assessment progress with local storage
- **Export Capabilities**: Export assessment results as PDF reports
- **Dark Mode**: Complete dark/light theme support with system preference detection

### Technical Features
- **Modern Stack**: Next.js 15 with App Router, TypeScript, Tailwind CSS, Mantine UI
- **Performance Optimized**: Code splitting, lazy loading, and bundle optimization
- **Security Focused**: CSP headers, HTML sanitization, XSS protection
- **Accessibility**: WCAG compliant with proper ARIA attributes and keyboard navigation
- **Mobile-First**: Responsive design optimized for all device sizes
- **SEO Optimized**: Proper metadata, OpenGraph tags, and structured data
- **Error Monitoring**: Production error tracking and reporting system

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with JavaScript enabled

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd fairveri-website
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open application:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Analyze bundle size:**
   ```bash
   npm run build:analyze
   ```

## Deployment Guide

### Environment Configuration

Create a `.env.local` file (copy from `.env.example`) and configure:

```bash
# Required for production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Error reporting (optional)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-public-sentry-dsn@sentry.io/project-id

# Security
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
CSP_REPORT_URI=https://your-domain.com/api/csp-report
```

### Platform-Specific Deployment

#### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Set environment variables in Netlify dashboard

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Traditional Server
1. Build the application: `npm run build`
2. Copy `.next`, `public`, `package.json` to server
3. Install production dependencies: `npm ci --only=production`
4. Start with process manager: `pm2 start npm --name "fairveri" -- start`

### Security Checklist

- [ ] Environment variables properly configured
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Security headers configured (handled by next.config.ts)
- [ ] Content Security Policy properly set
- [ ] Error reporting configured for production monitoring
- [ ] Regular dependency updates scheduled

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:analyze` | Build with bundle analyzer |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npm run type-check` | Run TypeScript type checking |

## Technology Stack

### Core Framework
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript development
- **React 19**: UI library with latest features

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Mantine UI**: Component library for complex components
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

### State & Data Management
- **Zustand**: Lightweight state management
- **React Hook Form**: Form handling and validation
- **Local Storage**: Client-side persistence

### Development Tools
- **ESLint**: Code linting and formatting
- **Webpack Bundle Analyzer**: Bundle size analysis
- **PostCSS**: CSS processing

### Production Features
- **Error Monitoring**: Custom error tracking system
- **HTML Sanitization**: XSS protection for user content
- **Code Splitting**: Dynamic imports for performance
- **PWA Support**: Service worker ready

## Architecture Overview

### Directory Structure
```
src/
├── app/                     # Next.js App Router pages
│   ├── assessment/          # Assessment tool page
│   ├── learn/              # Learning resources page
│   ├── resources/          # Additional resources page
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # Base UI components
│   ├── features/           # Feature-specific components
│   ├── layout/             # Layout components
│   ├── dynamic/            # Code-split components
│   └── providers/          # Context providers
├── lib/                    # Utility libraries
│   ├── assessment-store.ts # Assessment state management
│   ├── html-sanitizer.ts   # XSS protection utilities
│   ├── error-monitoring.ts # Error tracking system
│   └── pdf-export.ts       # PDF generation
├── contexts/               # React contexts
│   ├── language-context.tsx # i18n management
│   ├── theme-context.tsx    # Theme management
│   └── user-preferences.tsx # User settings
├── locales/                # Translation files
│   ├── tr.json             # Turkish translations
│   └── en.json             # English translations
├── data/                   # Static data
│   └── assessment-questions.json # FAIR assessment questions
└── styles/                 # CSS and styling
    ├── globals.css         # Global styles
    └── mantine.css         # Mantine customizations
```

### Key Features Implementation

#### Internationalization (i18n)
- Custom React context for language management
- Automatic browser language detection
- Local storage persistence
- Dynamic content loading

#### Assessment System
- 15-question FAIR principle assessment
- Progress tracking and saving
- PDF export with charts and visualizations
- Comprehensive scoring system

#### Performance Optimization
- Dynamic imports for large components
- Intersection Observer for lazy loading
- Bundle splitting and code optimization
- Image optimization and lazy loading

#### Security Implementation
- Content Security Policy (CSP) headers
- HTML sanitization for user content
- XSS protection mechanisms
- Secure environment variable handling

## Performance Optimization

### Bundle Analysis
Run `npm run build:analyze` to analyze bundle size and optimize:
- Large dependencies are code-split
- Dynamic imports for non-critical components
- Tree shaking for unused code elimination

### Core Web Vitals
- **LCP**: Optimized with image loading and code splitting
- **FID**: Minimized JavaScript execution time
- **CLS**: Stable layouts with proper sizing

### Monitoring
- Error tracking with custom monitoring system
- Performance metrics collection
- User analytics (optional, with consent)

## Contributing

### Development Guidelines
1. **Code Style**: Follow existing patterns and use TypeScript
2. **Components**: Use the established component structure
3. **Translations**: Add new strings to both tr.json and en.json
4. **Testing**: Ensure components work in both languages and themes
5. **Security**: Never commit secrets or sensitive data

### Pull Request Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes following coding standards
4. Add translations for new text content
5. Test in both languages and themes
6. Submit pull request with detailed description

### Adding New Features
1. Create components in appropriate directories
2. Add translations to locale files
3. Update this README if significant changes
4. Ensure mobile responsiveness
5. Test accessibility compliance

## Troubleshooting

### Common Issues

**Build Errors:**
- Ensure all environment variables are set
- Check TypeScript errors with `npm run type-check`
- Verify all dependencies are installed

**Runtime Errors:**
- Check browser console for detailed error messages
- Verify translation keys exist in both language files
- Ensure components are properly imported

**Performance Issues:**
- Run bundle analyzer to identify large dependencies
- Check for memory leaks in React components
- Verify images are properly optimized

### Getting Help
- Check the issues section for known problems
- Review the troubleshooting section in .env.example
- Ensure you're using supported Node.js version (18+)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- FAIR Data Principles community for guidance and resources
- Contributors to the open source libraries used in this project
- Turkish academic community for translation validation
