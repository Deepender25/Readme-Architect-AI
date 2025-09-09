# Grid Loading Animation System

## Overview
This project now uses a unified grid-based loading animation system that matches the design from `bg1.txt`. All loading animations have been updated to use consistent colors, movements, and design patterns that align with the site's green color palette.

## Color Palette
- Primary: `rgba(0, 255, 136, X)` 
- Secondary: `#00ff88`
- Background grid: `rgba(0, 255, 136, 0.1)`
- Glow effects: `rgba(0, 255, 136, 0.5-0.7)`

## Components

### 1. GridLoadingAnimation (Main Component)
**Path**: `src/components/ui/grid-loading-animation.tsx`

```tsx
<GridLoadingAnimation 
  size="md"                    // sm, md, lg, xl
  speed="normal"              // slow, normal, fast  
  intensity={3}               // 1-5 (number of concurrent animations)
  message="Loading..."        // Optional message
  showMessage={true}          // Show/hide message
  className="custom-class"    // Additional styling
/>
```

### 2. GridLoader (Simplified Version)
```tsx
<GridLoader size="md" className="mr-2" />
```

### 3. Updated Legacy Components
All existing loading components now use the grid animation:

#### CubeLoader
- **Maintains original API** - no breaking changes
- Now renders grid animation instead of cube
- Supports all original props (size, variant, message, etc.)

#### LoadingAnimation  
- **Maintains original API** - no breaking changes
- Updated to use grid animation
- Same props as before

#### LoadingPage
- Updated to use grid animation
- Same API and functionality

## Utility Functions

### Loading Contexts
Pre-configured loading animations for common use cases:

```tsx
import { 
  PageLoader,      // Large loader for full pages
  ModalLoader,     // Medium loader for modals
  InlineLoader,    // Small loader for inline content
  ButtonLoader,    // Tiny loader for buttons
  OverlayLoader    // XL loader for full-screen overlays
} from '@/utils/loading-utils';

// Usage
<PageLoader message="Loading page..." />
<InlineLoader />
<ButtonLoader />
```

### createGridLoader Function
```tsx
import { createGridLoader } from '@/utils/loading-utils';

// Create custom loader
const myLoader = createGridLoader('modal', {
  message: 'Processing...',
  variant: 'intense'  // minimal, default, intense
});
```

### Loading State Hook
```tsx
import { useLoadingState } from '@/utils/loading-utils';

function MyComponent() {
  const { loading, startLoading, stopLoading } = useLoadingState();
  
  const handleAction = async () => {
    startLoading();
    await doSomething();
    stopLoading();
  };
  
  return <LoadingWrapper loading={loading}>{content}</LoadingWrapper>;
}
```

## CSS-Only Version
**Path**: `src/styles/grid-loader.css`

For static HTML contexts:

```html
<div class="grid-loader-container">
  <div class="grid-loader-bg grid-loader-md">
    <div class="grid-loader-squares">
      <div class="grid-square" style="left: 20px; top: 20px;"></div>
      <div class="grid-square" style="left: 40px; top: 40px;"></div>
      <!-- Add more squares as needed -->
    </div>
    <div class="grid-loader-fade"></div>
  </div>
  <div class="grid-loader-message">Loading...</div>
</div>
```

## Size Configuration

| Size | Container | Grid Size | Use Case |
|------|-----------|-----------|----------|
| sm   | 120px     | 15px      | Inline, buttons |
| md   | 160px     | 20px      | Cards, modals |
| lg   | 200px     | 25px      | Pages, main content |
| xl   | 240px     | 30px      | Full screen overlays |

## Speed Configuration

| Speed  | Interval | Use Case |
|--------|----------|----------|
| slow   | 1200ms   | Subtle background loading |
| normal | 800ms    | Standard loading states |  
| fast   | 500ms    | Button/inline loading |

## Intensity Levels

| Level | Squares | Use Case |
|-------|---------|----------|
| 1     | 1       | Minimal, subtle |
| 2     | 2       | Light activity |
| 3     | 3       | Standard loading |
| 4     | 4       | Active processing |
| 5     | 5       | Heavy computation |

## Migration Guide

### From CubeLoader
No changes needed - API remains the same:
```tsx
// This still works exactly the same
<CubeLoader size="md" showMessage message="Loading..." />
```

### From LoadingAnimation  
No changes needed - API remains the same:
```tsx
// This still works exactly the same
<LoadingAnimation size="lg" message="Loading..." />
```

### From Custom Spinners
Replace with grid loader:
```tsx
// Old
<div className="spinner" />

// New  
<GridLoader size="md" />
```

## Demo Page
Visit `/loading-demo` to see all loading animations in action and test different configurations.

## File Structure
```
src/
├── components/ui/
│   ├── grid-loading-animation.tsx  # Main component
│   ├── cube-loader.tsx            # Updated legacy component  
│   ├── loading-animation.tsx      # Updated legacy component
│   └── loading-page.tsx           # Updated legacy component
├── styles/
│   └── grid-loader.css            # CSS-only version
├── utils/
│   └── loading-utils.tsx          # Utility functions and hooks
└── app/
    └── loading-demo/
        └── page.tsx               # Demo page
```

## Performance Features
- GPU-accelerated animations
- Reduced motion support for accessibility
- High contrast mode support
- Optimized rendering with `contain: layout style paint`
- Responsive sizing for mobile devices

## Browser Support
- Modern browsers with CSS Grid support
- Fallbacks for older browsers via progressive enhancement
- Mobile-optimized with responsive breakpoints
