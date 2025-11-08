# Migration Guide: Upgrading to Professional Animations

This guide helps you update existing components to use the new professional animation system.

## Quick Migration Checklist

- [ ] Replace hardcoded timing values with `durations` constants
- [ ] Replace generic easing with professional curves from `easings`
- [ ] Update animation variants to use new professional variants
- [ ] Add hardware acceleration hints where needed
- [ ] Replace CSS "all" transitions with specific properties
- [ ] Update scroll animations to use new hooks
- [ ] Test on mobile devices
- [ ] Verify reduced motion support

## Step-by-Step Migration

### 1. Update Imports

#### Before
```typescript
// Scattered imports
import { motion } from 'framer-motion';
```

#### After
```typescript
import { motion } from 'framer-motion';
import { 
  easings, 
  durations, 
  pageTransitionVariants,
  buttonPressVariants,
  // ... other variants you need
} from '@/lib/animation-utils';
```

---

### 2. Replace Hardcoded Timing

#### Before
```typescript
<motion.div
  transition={{ duration: 0.3, ease: "easeInOut" }}
>
```

#### After
```typescript
<motion.div
  transition={{ 
    duration: durations.normal, 
    ease: easings.material 
  }}
>
```

---

### 3. Update Animation Variants

#### Before
```typescript
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
}
```

#### After
```typescript
import { scrollAnimationVariants } from '@/lib/animation-utils';

// Use the professional variant directly
<motion.div variants={scrollAnimationVariants} />

// Or customize if needed
const variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: durations.moderate,
      ease: easings.decelerate
    }
  }
}
```

---

### 4. Update Button Animations

#### Before
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
```

#### After
```typescript
import { buttonPressVariants } from '@/lib/animation-utils';

<motion.button
  variants={buttonPressVariants}
  initial="rest"
  whileHover="hover"
  whileTap="press"
>
```

Or use CSS class:
```html
<button className="btn-professional">
```

---

### 5. Update Page Transitions

#### Before
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.4 }}
>
```

#### After
```typescript
import { pageTransitionVariants } from '@/lib/animation-utils';

<motion.div
  initial="initial"
  animate="animate"
  exit="exit"
  variants={pageTransitionVariants}
>
```

---

### 6. Update Modal Animations

#### Before
```typescript
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="modal-content">
        {/* content */}
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

#### After
```typescript
import { 
  modalAnimationVariants, 
  backdropAnimationVariants 
} from '@/lib/animation-utils';

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
        {/* content */}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

---

### 7. Update Scroll Animations

#### Before
```typescript
const [ref, inView] = useInView({ threshold: 0.1 });

<div ref={ref}>
  <motion.div
    initial={{ opacity: 0 }}
    animate={inView ? { opacity: 1 } : { opacity: 0 }}
  >
```

#### After
```typescript
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { scrollAnimationVariants } from '@/lib/animation-utils';

const { ref, isVisible } = useScrollAnimation();

<motion.div
  ref={ref}
  initial="hidden"
  animate={isVisible ? "visible" : "hidden"}
  variants={scrollAnimationVariants}
>
```

Or use Framer Motion's built-in:
```typescript
<motion.div
  initial="hidden"
  whileInView="visible"
  variants={scrollAnimationVariants}
  viewport={{ once: true, margin: "-50px" }}
>
```

---

### 8. Update Staggered Lists

#### Before
```typescript
<motion.ul>
  {items.map((item, i) => (
    <motion.li
      key={i}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.1 }}
    >
      {item}
    </motion.li>
  ))}
</motion.ul>
```

#### After
```typescript
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

---

### 9. Update CSS Transitions

#### Before
```css
.button {
  transition: all 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
}
```

#### After
```css
.button {
  transition: 
    transform var(--duration-fast) var(--ease-material),
    box-shadow var(--duration-fast) var(--ease-material);
  will-change: transform, box-shadow;
}

.button:hover {
  transform: translateY(-2px) scale(1.01);
}

.button:active {
  transform: translateY(0) scale(0.99);
}
```

Or use the utility class:
```html
<button class="btn-professional">
```

---

### 10. Add Hardware Acceleration

#### Before
```typescript
<motion.div
  animate={{ x: 100 }}
>
```

#### After
```typescript
<motion.div
  animate={{ x: 100 }}
  style={{
    transform: 'translate3d(0, 0, 0)',
    backfaceVisibility: 'hidden',
    perspective: 1000,
    willChange: 'transform',
  }}
>
```

---

## Common Patterns

### Pattern 1: Fade In on Mount

#### Before
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
```

#### After
```typescript
import { fadeAnimationVariants } from '@/lib/animation-utils';

<motion.div
  variants={fadeAnimationVariants}
  initial="hidden"
  animate="visible"
>
```

---

### Pattern 2: Slide In from Side

#### Before
```typescript
<motion.div
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.4 }}
>
```

#### After
```typescript
import { slideAnimationVariants } from '@/lib/animation-utils';

<motion.div
  variants={slideAnimationVariants}
  initial="hidden"
  animate="visible"
>
```

---

### Pattern 3: Scale In

#### Before
```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
```

#### After
```typescript
import { scaleAnimationVariants } from '@/lib/animation-utils';

<motion.div
  variants={scaleAnimationVariants}
  initial="hidden"
  animate="visible"
>
```

---

## CSS Class Replacements

### Buttons
```html
<!-- Before -->
<button class="transition-all duration-300 hover:-translate-y-1">

<!-- After -->
<button class="btn-professional">
```

### Cards
```html
<!-- Before -->
<div class="transition-all duration-300 hover:-translate-y-2">

<!-- After -->
<div class="card-professional">
```

### Scroll Reveals
```html
<!-- Before -->
<div class="opacity-0 animate-fade-in">

<!-- After -->
<div class="scroll-reveal">
```

---

## Configuration Updates

If you need to adjust timing globally:

```typescript
// src/lib/animation-config.ts
export const ANIMATION_TIMING = {
  instant: 100,   // Adjust this
  fast: 200,      // Adjust this
  normal: 300,    // Adjust this
  moderate: 400,  // Adjust this
  slow: 500,      // Adjust this
};
```

---

## Testing Checklist

After migration, test:

- [ ] Animations feel smooth on desktop
- [ ] Animations feel smooth on mobile
- [ ] Reduced motion is respected
- [ ] No layout shifts during animations
- [ ] 60fps maintained (check DevTools)
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Touch interactions feel responsive

---

## Common Issues & Solutions

### Issue: Animations feel too slow
**Solution**: Adjust duration in `animation-config.ts` or use a faster duration constant

### Issue: Animations feel janky
**Solution**: 
1. Check if you're animating expensive properties (width, height, etc.)
2. Ensure hardware acceleration is enabled
3. Use transform and opacity only

### Issue: Stagger not working
**Solution**: Make sure parent has `variants={staggerChildren}` and children have `variants={listItemVariants}`

### Issue: Scroll animation not triggering
**Solution**: Check viewport settings and rootMargin values

### Issue: Modal animation stutters
**Solution**: Use separate variants for backdrop and content, ensure proper z-index

---

## Need Help?

- Full documentation: `ANIMATION_SYSTEM.md`
- Quick reference: `ANIMATION_QUICK_REFERENCE.md`
- Before/After examples: `BEFORE_AFTER_COMPARISON.md`
- Configuration: `src/lib/animation-config.ts`

---

## Gradual Migration Strategy

You don't have to migrate everything at once:

1. **Week 1**: Migrate buttons and links
2. **Week 2**: Migrate cards and hover effects
3. **Week 3**: Migrate page transitions
4. **Week 4**: Migrate modals and dropdowns
5. **Week 5**: Migrate scroll animations
6. **Week 6**: Polish and optimize

Take your time and test thoroughly at each step!
