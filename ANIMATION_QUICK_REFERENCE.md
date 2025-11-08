# Animation Quick Reference Guide 🎨

## Most Common Use Cases

### 1. Button with Smooth Hover

```tsx
import { motion } from 'framer-motion';
import { buttonPressVariants } from '@/lib/animation-utils';

<motion.button
  variants={buttonPressVariants}
  initial="rest"
  whileHover="hover"
  whileTap="press"
  className="btn-professional"
>
  Click Me
</motion.button>
```

Or with CSS only:
```html
<button class="btn-professional">Click Me</button>
```

### 2. Card with Hover Effect

```tsx
import { motion } from 'framer-motion';
import { cardEntranceVariants } from '@/lib/animation-utils';

<motion.div
  initial="hidden"
  animate="visible"
  variants={cardEntranceVariants}
  className="card-professional"
>
  Card Content
</motion.div>
```

Or with CSS only:
```html
<div class="card-professional">Card Content</div>
```

### 3. Scroll-Triggered Animation

```tsx
import { motion } from 'framer-motion';
import { scrollAnimationVariants } from '@/lib/animation-utils';

<motion.div
  initial="hidden"
  whileInView="visible"
  variants={scrollAnimationVariants}
  viewport={{ once: true, margin: "-50px" }}
>
  Reveals on scroll
</motion.div>
```

Or with CSS + Hook:
```tsx
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

function Component() {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div ref={ref} className={isVisible ? 'scroll-reveal visible' : 'scroll-reveal'}>
      Content
    </div>
  );
}
```

### 4. Staggered List Animation

```tsx
import { motion } from 'framer-motion';
import { staggerChildren, listItemVariants } from '@/lib/animation-utils';

<motion.ul
  initial="hidden"
  animate="visible"
  variants={staggerChildren}
>
  {items.map((item, i) => (
    <motion.li key={i} variants={listItemVariants}>
      {item}
    </motion.li>
  ))}
</motion.ul>
```

### 5. Modal/Dialog

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { modalAnimationVariants, backdropAnimationVariants } from '@/lib/animation-utils';

<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        variants={backdropAnimationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="modal-overlay"
      />
      <motion.div
        variants={modalAnimationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="modal-content"
      >
        Modal Content
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### 6. Dropdown Menu

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { dropdownAnimationVariants } from '@/lib/animation-utils';

<AnimatePresence>
  {isOpen && (
    <motion.div
      variants={dropdownAnimationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="dropdown-menu"
    >
      {menuItems.map((item, i) => (
        <div key={i} className="dropdown-item">
          {item}
        </div>
      ))}
    </motion.div>
  )}
</AnimatePresence>
```

### 7. Page Transition

```tsx
// Already handled by PageTransition component
import PageTransition from '@/components/page-transition';

export default function Page() {
  return (
    <PageTransition>
      <YourContent />
    </PageTransition>
  );
}
```

### 8. Smooth Scroll to Element

```tsx
import { smoothScrollTo } from '@/lib/smooth-scroll-utils';

function handleClick() {
  smoothScrollTo('section-id', {
    offset: 100,
    duration: 800,
  });
}
```

### 9. Loading Spinner

```html
<div class="loading-spinner">
  <!-- Your spinner icon -->
</div>
```

### 10. Notification/Toast

```tsx
import { motion } from 'framer-motion';
import { notificationVariants } from '@/lib/animation-utils';

<motion.div
  variants={notificationVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
  className="notification-enter"
>
  Notification message
</motion.div>
```

## CSS Utility Classes

### Hover Effects
```html
<div class="hover-lift">Lifts on hover</div>
<div class="hover-scale">Scales on hover</div>
<div class="hover-glow">Glows on hover</div>
```

### Scroll Animations
```html
<div class="scroll-reveal">Single reveal</div>
<div class="scroll-reveal-stagger">Staggered reveal</div>
```

### Loading States
```html
<div class="loading-spinner">Spinner</div>
<div class="loading-pulse">Pulse</div>
<div class="skeleton">Skeleton</div>
```

### Animation Delays
```html
<div class="animate-in delay-100">Delayed 100ms</div>
<div class="animate-in delay-200">Delayed 200ms</div>
<div class="animate-in delay-300">Delayed 300ms</div>
```

## Common Patterns

### Fade In on Mount
```tsx
import { motion } from 'framer-motion';
import { fadeAnimationVariants } from '@/lib/animation-utils';

<motion.div
  variants={fadeAnimationVariants}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>
```

### Slide In from Side
```tsx
import { motion } from 'framer-motion';
import { slideAnimationVariants } from '@/lib/animation-utils';

<motion.div
  variants={slideAnimationVariants}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>
```

### Scale In
```tsx
import { motion } from 'framer-motion';
import { scaleAnimationVariants } from '@/lib/animation-utils';

<motion.div
  variants={scaleAnimationVariants}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>
```

## Timing Reference

```typescript
import { durations } from '@/lib/animation-utils';

durations.instant   // 100ms - Hover, focus
durations.fast      // 200ms - Button press
durations.normal    // 300ms - Dropdown
durations.moderate  // 400ms - Modal
durations.slow      // 500ms - Page transition
```

## Easing Reference

```typescript
import { easings } from '@/lib/animation-utils';

easings.apple       // Smooth, natural (default)
easings.material    // UI elements
easings.emphasized  // Important actions
easings.decelerate  // Elements entering
easings.accelerate  // Elements leaving
easings.smooth      // Flowing animations
easings.expressive  // Playful interactions
```

## Configuration

Adjust all animations in one place:

```typescript
// src/lib/animation-config.ts
export const ANIMATION_TIMING = {
  instant: 100,   // Change this
  fast: 200,      // Change this
  // ...
};
```

## Tips

1. **Use CSS classes for simple animations** - Faster and more performant
2. **Use Framer Motion for complex animations** - More control and flexibility
3. **Always test on mobile** - Animations should feel good on all devices
4. **Respect reduced motion** - System handles this automatically
5. **Keep it subtle** - Less is more with animations

## Need Help?

- Full documentation: `ANIMATION_SYSTEM.md`
- Configuration: `src/lib/animation-config.ts`
- Examples: `src/lib/animation-utils.ts`
