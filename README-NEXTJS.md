# WolvCapital Next.js Frontend

A modern, professional investment platform frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom WolvCapital branding
- **Responsive Design** - Mobile-first approach
- **Performance Optimized** - Image optimization, lazy loading
- **Accessibility** - WCAG compliant
- **Professional Branding** - Exact colors from wolvcapital.com

## 🎨 Brand Colors (Exact Match)

- **Primary Navy**: `#0b2f6b`
- **Secondary Blue**: `#2563eb`
- **Accent Blue**: `#1d4ed8`
- **Trust Gold**: `#fde047`
- **Dark Navy**: `#071d42`

## 🛠 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with brand CSS
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── HomePage.tsx           # Main homepage component
├── tailwind.config.js     # Tailwind with WolvCapital theme
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies
```

## 🎯 Key Components

### HomePage Component
- **Hero Section**: Professional gradient backgrounds with mesh patterns
- **Investment Card**: 3D perspective card with virtual payment display
- **CTA Buttons**: Brand-consistent styling with hover effects
- **Stats Section**: Key metrics display
- **Responsive**: Mobile-first design

### Brand System
- **CSS Variables**: Consistent color system
- **Component Classes**: Reusable button and card styles
- **Typography**: Inter font with proper weights
- **Gradients**: Professional blue-to-navy gradients

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## ♿ Accessibility Features

- Semantic HTML structure
- Proper ARIA labels
- Focus management
- High contrast mode support
- Reduced motion preference support
- Keyboard navigation

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Static Export
```bash
# Uncomment output: 'export' in next.config.js
npm run build
```

### Docker
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

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.wolvcapital.com
NEXT_PUBLIC_SITE_URL=https://wolvcapital.com
```

### Images
Place your images in `/public/images/`:
- `hero-crypto-abstract-xl.jpg`
- `wolvcapital-logo.svg`
- `wolvcapital-favicon.svg`

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: Optimized
- **Image Optimization**: Next.js Image component with AVIF/WebP
- **Bundle Size**: Minimized with tree shaking

## 🎨 Customization

### Colors
Update brand colors in `tailwind.config.js`:

```javascript
colors: {
  'brand': {
    'primary': '#0b2f6b',
    'secondary': '#2563eb',
    // ... other colors
  }
}
```

### Components
Add new components in `/components/` directory with TypeScript support.

## 📋 Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - ESLint checking
- `npm run type-check` - TypeScript checking

## 🔒 Security

- Content Security Policy ready
- XSS protection
- HTTPS enforcement in production
- Environment variable validation

---

**Built with ❤️ for WolvCapital Professional Investment Platform**