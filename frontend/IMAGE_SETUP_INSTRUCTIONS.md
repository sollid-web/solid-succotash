# Image Setup Instructions

## Required Images

To complete the homepage and contact page updates, add these 3 images to the `frontend/public/images/` directory:

### 1. Office Location Map
- **Filename:** `office-location-map.jpg`
- **Source:** Image 1 (map with "Registered Office - London, United Kingdom")
- **Location:** `/public/images/office-location-map.jpg`
- **Used on:** Contact page (embedded map section)
- **Dimensions:** Optimize for 1200x600px or similar landscape aspect ratio

### 2. Welcome Mobile (Woman with Laptop)
- **Filename:** `welcome-mobile.jpg`
- **Source:** Image 2 (woman in beige blazer at desk)
- **Location:** `/public/images/welcome-mobile.jpg`
- **Used on:** 
  - Homepage hero (mobile/tablet view)
  - Contact page (mobile view only)
- **Dimensions:** Optimize for 768x1024px (portrait, 3:4 aspect ratio)

### 3. Welcome Desktop (Man in Office)
- **Filename:** `welcome-desktop.jpg`
- **Source:** Image 3 (man in suit with arms crossed)
- **Location:** `/public/images/welcome-desktop.jpg`
- **Used on:** Homepage hero (desktop view)
- **Dimensions:** Optimize for 1920x1080px (landscape, 16:9 aspect ratio)

## Steps to Add Images

1. Save the 3 images from the attachments
2. Optimize them for web (compress to reduce file size while maintaining quality)
3. Place them in: `frontend/public/images/`
4. Ensure filenames match exactly as listed above

## Image Optimization Tips

- Use tools like TinyPNG or ImageOptim to compress
- Target file sizes: <300KB per image
- Format: JPEG for photos (best compression)
- Quality: 80-85% is usually sufficient

## Responsive Behavior

### Homepage:
- **Mobile (<1024px):** Shows `welcome-mobile.jpg` (portrait, woman)
- **Desktop (≥1024px):** Shows `welcome-desktop.jpg` (landscape, man)

### Contact Page:
- **Map:** Always visible on all devices (responsive aspect ratio)
- **Welcome Image:** Only visible on mobile (<1024px), shows `welcome-mobile.jpg`

## File Structure

```
frontend/
└── public/
    └── images/
        ├── office-location-map.jpg    (Image 1 - Map)
        ├── welcome-mobile.jpg          (Image 2 - Woman)
        └── welcome-desktop.jpg         (Image 3 - Man)
```

---

**Status:** Code updated ✅ | Images pending upload
