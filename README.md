# Frontend - Next.js Application

Modern Next.js 14 frontend for WolvCapital investment platform.

## Architecture

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with brand theme
- **Components**: React Server Components + Client Components

## Directory Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout with metadata
│   │   ├── page.tsx      # Homepage route
│   │   └── globals.css   # Global styles + Tailwind
│   └── components/       # Reusable React components
│       └── HomePage.tsx  # Main homepage component
├── public/               # Static assets (images, icons)
│   ├── images/          # Image assets
│   │   └── legal/       # Legal page thumbnails
│   └── favicon.svg      # Site favicon
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.js   # Tailwind theme (brand colors)
├── postcss.config.js    # PostCSS config
└── next.config.js       # Next.js config
```

## Features

- **Flip Visa Card**: Interactive 3D card component with accessibility
- **Legal Links**: Terms, Privacy, Risk Disclosure, Legal Disclaimer
- **Responsive Design**: Mobile-first with Tailwind breakpoints
- **Brand Theme**: Custom colors matching WolvCapital identity
- **SEO Optimized**: Metadata, Open Graph, Twitter Cards
- **Performance**: Next/Image optimization, lazy loading

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Brand Colors

- Primary: `#0b2f6b`
- Secondary: `#2563eb`
- Accent: `#1d4ed8`
- Gold: `#fde047`
- Dark: `#071d42`

## Integration with Django

The frontend runs independently on port 3000. For production:

1. Build the frontend: `npm run build`
2. Serve via Next.js standalone or integrate with Django reverse proxy
3. Configure CORS if Django API is used

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=https://wolvcapital.com
```

## Scripts

- `npm run dev` - Development server (port 3000)
- `npm run build` - Production build
- `npm start` - Start production server
- `npm run lint` - ESLint check
- `npm run type-check` - TypeScript validation

## Components

### HomePage

Main landing page with:
- Hero section with background image and overlay
- Flip Visa card (click/keyboard accessible)
- Investment plan cards
- Stats section
- Legal & Compliance links

### FlipVisaCard

Interactive 3D card component:
- Click to flip
- Keyboard accessible (Enter/Space)
- Respects reduced motion preferences
- Mobile responsive

## Legal Pages

Link tiles for:
- `/terms` - Terms of Service
- `/legal-disclaimer` - Legal Disclaimer
- `/risk-disclosure` - Risk Disclosure
- `/privacy` - Privacy Policy

*(Page implementations not included in this frontend; link to Django routes or create separate Next.js pages)*

## Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

### Docker

```bash
docker build -t wolvcapital-frontend .
docker run -p 3000:3000 wolvcapital-frontend
```

### Static Export

```bash
npm run build
# Deploy out/ folder to CDN
```

## Troubleshooting

- **Port 3000 in use**: Change port in package.json scripts (`-p 3001`)
- **Image 404s**: Ensure images exist in `public/images/`
- **TypeScript errors**: Run `npm run type-check`
- **Styling issues**: Clear `.next` folder and rebuild

## Future Enhancements

- [ ] API integration with Django backend
- [ ] User dashboard pages
- [ ] Investment plan detail pages
- [ ] Transaction history
- [ ] Authentication flow
- [ ] Admin panel frontend
- [ ] Real-time notifications
- [ ] Progressive Web App (PWA) features

---

**Separate from Django** - This frontend is independent and can be deployed separately or served alongside Django.
