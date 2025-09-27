# Animation System Guide

This guide explains how to use the lightweight, accessible animation system implemented across the application.

## Features

- ✅ Page transitions (marketing + /app)
- ✅ Micro-interactions for buttons, cards, modals, drawers, tabs
- ✅ List/table item entrance updates (fade/slide)
- ✅ Respects `prefers-reduced-motion`
- ✅ Easy feature toggle via environment variables

## Environment Configuration

```bash
# .env.local
ENABLE_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
```

Set `NEXT_PUBLIC_ENABLE_ANIMATIONS=false` to disable all animations instantly.

## Core Components

### MotionProvider
Wraps the entire app and handles:
- Reduced motion detection
- Global animation defaults
- Context for animation state

### PageTransition
Handles smooth page transitions between routes.

## Usage Examples

### 1. Animated Button
```tsx
import AnimatedButton from "@/components/anim/AnimatedButton";

<AnimatedButton 
  className="bg-blue-500 text-white"
  onClick={handleClick}
>
  Click me
</AnimatedButton>
```

### 2. Animated Modal/Drawer
```tsx
import AnimatedModal from "@/components/anim/AnimatedModal";

<AnimatedModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)}
  className="max-w-lg"
>
  <div className="p-6">
    <h2>Modal Content</h2>
    <p>This modal slides in smoothly</p>
  </div>
</AnimatedModal>
```

### 3. Animated Table Rows
```tsx
import AnimatedTableRow from "@/components/anim/AnimatedTableRow";

{data.map((item, index) => (
  <AnimatedTableRow key={item.id} index={index}>
    <div className="flex items-center space-x-4 p-4">
      <span>{item.name}</span>
      <span>{item.status}</span>
    </div>
  </AnimatedTableRow>
))}
```

### 4. Animated Tab Content
```tsx
import AnimatedTabContent from "@/components/anim/AnimatedTabContent";

<AnimatedTabContent key={activeTab}>
  <div className="p-4">
    <h3>Tab Content</h3>
    <p>Content fades in when tab changes</p>
  </div>
</AnimatedTabContent>
```

### 5. Skeleton Loading
```tsx
import Skeleton from "@/components/anim/Skeleton";

// Basic skeleton
<Skeleton />

// Custom dimensions
<Skeleton width="w-32" height="h-8" />

// Multiple skeletons
<div className="space-y-2">
  <Skeleton width="w-full" height="h-4" />
  <Skeleton width="w-3/4" height="h-4" />
  <Skeleton width="w-1/2" height="h-4" />
</div>
```

### 6. Custom Animations
```tsx
import { MDiv, fadeInUp, hoverScale } from "@/components/anim/motion";

// Fade in animation
<MDiv {...fadeInUp}>
  <p>This content fades in from below</p>
</MDiv>

// Hover scale effect
<MDiv {...hoverScale} className="p-4 bg-gray-100 rounded">
  <p>Hover me to see scale effect</p>
</MDiv>
```

## Available Animation Presets

### Motion Components
- `MDiv` - Animated div
- `MButton` - Animated button

### Animation Presets
- `hoverScale` - Scale on hover/tap (1.02/0.98)
- `fadeInUp` - Fade in from below
- `fadeIn` - Simple fade in

## Performance Guidelines

1. **Use transforms only** - Avoid animating `height`, `width`, `top`, `left`
2. **Keep durations short** - 120-220ms for micro-interactions
3. **Animate containers** - Not hundreds of individual children
4. **Respect reduced motion** - Automatically handled by MotionProvider

## Accessibility

- Automatically respects `prefers-reduced-motion` system setting
- Can be disabled globally via environment variable
- Uses semantic HTML elements
- Maintains focus management in modals

## Integration with Existing Components

To add animations to existing components:

1. **Buttons**: Replace with `AnimatedButton` or wrap with `MButton` + `hoverScale`
2. **Modals**: Replace with `AnimatedModal` or add `AnimatePresence` wrapper
3. **Tables**: Wrap row content with `AnimatedTableRow` or use `MDiv` + `fadeInUp`
4. **Tabs**: Wrap content with `AnimatedTabContent`
5. **Loading**: Replace loading spinners with `Skeleton` components

## Testing

1. Test with animations enabled (default)
2. Test with `NEXT_PUBLIC_ENABLE_ANIMATIONS=false`
3. Test with system `prefers-reduced-motion` enabled
4. Verify all interactions still work (click, hover, focus)
5. Check performance on slower devices

## Troubleshooting

- **Animations not working**: Check `NEXT_PUBLIC_ENABLE_ANIMATIONS` is not "false"
- **Layout shifts**: Ensure you're using `transform` properties, not layout properties
- **Performance issues**: Reduce animation complexity or disable for that component
- **Accessibility**: Verify `prefers-reduced-motion` is being respected

