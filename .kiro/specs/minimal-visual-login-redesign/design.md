# Design Document

## Overview

This design transforms both login pages (`/login` and `/switch-account`) into minimal, visual-first experiences that seamlessly integrate with the main site's aesthetic. The design prioritizes visual communication over text, ensures single-page layouts without scrolling, and maintains consistency with the main site's `ProfessionalBackground` component and color scheme.

## Architecture

### Component Structure

```
Login Pages Architecture
├── ProfessionalBackground (shared with main site)
├── Minimal Header
│   ├── Animated Logo Icon
│   ├── Gradient Title Text
│   └── Subtitle (minimal)
├── Visual Content Card
│   ├── Previous Account Flow (login page)
│   ├── First-time Flow (login page)
│   └── 3-Step Visual Process (switch-account page)
└── Minimal Footer (optional)
```

### Layout Strategy

**Single-Page Constraint**: Both pages must fit entirely within viewport height
- **Desktop**: 1920x1080 minimum support
- **Mobile**: 375x667 minimum support
- **Tablet**: 768x1024 minimum support

**Visual Hierarchy**: 
1. Background (professional animated grid)
2. Logo/Brand (prominent, animated)
3. Primary Action (largest, most prominent)
4. Secondary Actions (smaller, less prominent)
5. Minimal Text (essential only)

## Components and Interfaces

### 1. Background Component Integration

**Use Existing**: `ProfessionalBackground` component from main site
- Animated green grid patterns
- Interactive mouse glow effects
- Floating orbs animation
- Consistent with main site aesthetic

### 2. Minimal Header Design

```typescript
interface MinimalHeader {
  logo: {
    size: 'large' | 'extra-large';
    animation: 'glow' | 'pulse';
    color: 'emerald' | 'orange' | 'blue';
  };
  title: {
    text: string;
    gradient: boolean;
    size: 'xl' | '2xl' | '3xl';
  };
  subtitle: {
    text: string;
    maxLength: 30; // characters
  };
}
```

### 3. Visual Action Cards

#### Login Page Card Structure
```typescript
interface LoginCard {
  type: 'previous-account' | 'first-time';
  layout: 'single-column';
  maxHeight: '60vh';
  
  previousAccount?: {
    avatar: string;
    name: string;
    username: string;
    primaryAction: VisualButton;
    secondaryAction: VisualButton;
  };
  
  firstTime?: {
    description: string; // max 20 characters
    primaryAction: VisualButton;
  };
}
```

#### Switch Account Card Structure
```typescript
interface SwitchAccountCard {
  layout: 'three-column-grid';
  steps: [
    {
      id: 1;
      icon: 'logout';
      color: 'orange';
      title: 'Sign Out';
      description: 'Open logout'; // max 15 characters
      state: 'active' | 'completed' | 'waiting';
      action?: VisualButton;
    },
    {
      id: 2;
      icon: 'confirm';
      color: 'blue';
      title: 'Confirm';
      description: 'Complete logout'; // max 15 characters
      state: 'active' | 'completed' | 'waiting';
      action?: VisualButton;
    },
    {
      id: 3;
      icon: 'github';
      color: 'emerald';
      title: 'Login';
      description: 'Choose account'; // max 15 characters
      state: 'active' | 'completed' | 'waiting';
      action?: LoadingSpinner;
    }
  ];
}
```

### 4. Visual Button Component

```typescript
interface VisualButton {
  size: 'large' | 'medium';
  variant: 'primary' | 'secondary';
  gradient: {
    from: string;
    to: string;
  };
  icon: LucideIcon;
  text: string; // max 20 characters
  animation: {
    hover: 'scale' | 'glow';
    loading?: 'spinner' | 'pulse';
  };
}
```

## Data Models

### Visual State Management

```typescript
interface LoginPageState {
  currentView: 'direct-login' | 'account-selection';
  previousAccount: PreviousAccount | null;
  isRedirecting: boolean;
  error: string | null;
}

interface SwitchAccountState {
  currentStep: 1 | 2 | 3;
  stepStates: {
    [key: number]: 'active' | 'completed' | 'waiting';
  };
}

interface PreviousAccount {
  username: string;
  name: string;
  avatar_url: string;
  last_login: string;
}
```

### Visual Theme Configuration

```typescript
interface VisualTheme {
  colors: {
    primary: 'emerald'; // matches main site
    secondary: 'orange' | 'blue';
    background: 'professional-grid';
    text: {
      primary: 'white';
      secondary: 'gray-400';
      accent: 'emerald-300';
    };
  };
  
  animations: {
    logoGlow: {
      duration: 3000;
      colors: ['emerald-300', 'emerald-500', 'emerald-300'];
    };
    buttonHover: {
      scale: 1.02;
      duration: 200;
    };
    pageTransition: {
      type: 'fade-slide';
      duration: 300;
    };
  };
}
```

## Error Handling

### Visual Error States

```typescript
interface ErrorDisplay {
  style: 'minimal-banner';
  position: 'top-of-card';
  colors: {
    background: 'red-500/10';
    border: 'red-500/20';
    text: 'red-300';
  };
  maxHeight: '60px';
  animation: 'fade-in';
}
```

### Error Types and Visual Treatment

1. **Authentication Errors**: Red banner with icon
2. **Network Errors**: Orange banner with retry button
3. **Validation Errors**: Yellow banner with guidance

## Testing Strategy

### Visual Regression Testing

1. **Viewport Testing**:
   - Desktop: 1920x1080, 1366x768
   - Tablet: 768x1024, 1024x768
   - Mobile: 375x667, 414x896

2. **Animation Testing**:
   - Logo glow animations
   - Button hover effects
   - Page transition smoothness
   - Loading state animations

3. **Accessibility Testing**:
   - Color contrast ratios
   - Keyboard navigation
   - Screen reader compatibility
   - Focus indicators

### User Experience Testing

1. **Single-Page Constraint**:
   - No scrolling required on any viewport
   - All content visible without interaction
   - Clear visual hierarchy

2. **Minimal Text Effectiveness**:
   - Users understand actions without reading
   - Visual cues are sufficient for navigation
   - Information density is appropriate

3. **Brand Consistency**:
   - Matches main site aesthetic
   - Consistent color usage
   - Seamless visual transition

## Implementation Details

### Page Structure Redesign

#### Login Page (`/login`)

**Current Issues**:
- Too much text content
- Generic background (not matching main site)
- Requires scrolling on smaller viewports
- Inconsistent with main site design

**New Design**:
```
┌─────────────────────────────────────┐
│         ProfessionalBackground      │
│                                     │
│    🟢 [Large Emerald GitHub Icon]   │
│         AutoDoc AI (gradient)       │
│       Choose your GitHub account    │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  Previous Account (if exists)   │ │
│  │  👤 John Doe (@johndoe)        │ │
│  │  [Continue] (large, emerald)    │ │
│  │           or                    │ │
│  │  [Switch Account] (secondary)   │ │
│  └─────────────────────────────────┘ │
│                                     │
│  OR (first time):                   │
│  ┌─────────────────────────────────┐ │
│  │     Connect GitHub              │ │
│  │  Generate professional READMEs  │ │
│  │                                 │ │
│  │  [Sign in with GitHub] (large)  │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### Switch Account Page (`/switch-account`)

**Current Issues**:
- Too much explanatory text
- Vertical layout requires scrolling
- Steps are not visually distinct
- Doesn't match main site aesthetic

**New Design**:
```
┌─────────────────────────────────────┐
│         ProfessionalBackground      │
│                                     │
│    🟠 [Large Orange Logout Icon]    │
│         Switch Account (gradient)   │
│        Quick 3-step process         │
│                                     │
│ ┌─────────┬─────────┬─────────────┐ │
│ │ Step 1  │ Step 2  │   Step 3    │ │
│ │🟠 Logout│🔵 Confirm│ 🟢 Login   │ │
│ │Sign Out │Complete │Choose new   │ │
│ │[Open]   │[Continue│[Redirecting]│ │
│ └─────────┴─────────┴─────────────┘ │
│                                     │
│              [← Back]               │
└─────────────────────────────────────┘
```

### Color Scheme Integration

**Main Site Colors** (from ProfessionalBackground):
- Primary: `rgba(0, 255, 136, *)` (emerald/green)
- Background: Black to gray-950 gradients
- Accents: Green variations

**Login Page Colors**:
- Logo: Emerald gradient (matches main site)
- Primary buttons: Emerald gradient
- Secondary buttons: White/gray with emerald accents
- Background: ProfessionalBackground component

**Switch Account Colors**:
- Step 1: Orange gradient (logout action)
- Step 2: Blue gradient (confirmation)
- Step 3: Emerald gradient (success, matches main site)
- Logo: Orange gradient (indicates switching action)

### Animation Strategy

1. **Logo Animations**: Consistent glow effect matching main site
2. **Button Interactions**: Subtle scale and color transitions
3. **Page Transitions**: Smooth fade-in effects
4. **Loading States**: Consistent spinner designs
5. **Step Progression**: Color and icon transitions

### Responsive Behavior

**Desktop (1920x1080)**:
- Three-column grid for switch account steps
- Large buttons and icons
- Generous spacing

**Tablet (768x1024)**:
- Maintained three-column grid
- Slightly smaller elements
- Optimized touch targets

**Mobile (375x667)**:
- Single column layout for switch steps
- Stacked vertically but still no scroll
- Larger touch targets
- Condensed spacing

This design ensures both pages provide a minimal, visual-first experience that seamlessly integrates with the main site while maintaining functionality and accessibility across all devices.