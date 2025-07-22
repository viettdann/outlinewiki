# CLAUDE - Rosé Pine Theme Implementation

> This file documents the Rosé Pine theme feature implementation for future Claude Code sessions.

## Feature Summary
Complete Rosé Pine color scheme integration for the Outline wiki application, implemented on 2025-07-22.

## Files Modified
- `/shared/styles/theme.ts` - Added `rosePineColors` palette and `buildRosePineTheme()` function

## Implementation Overview

### 1. Color Palette Integration
Extracted colors from `rose_pine.md` and mapped to Outline's theme structure:

```typescript
const rosePineColors: Colors = {
  // Core backgrounds (depth hierarchy)
  almostBlack: "#191724",    // Base - deepest background
  smoke: "#1f1d2e",          // Surface - secondary background  
  lightBlack: "#26233a",     // Overlay - elevated elements
  smokeDark: "#403d52",      // Highlight Med - interactive states
  
  // Text hierarchy
  almostWhite: "#e0def4",    // Text - primary text
  slateLight: "#908caa",     // Subtle - secondary text
  slate: "#6e6a86",          // Muted - tertiary text
  
  // Accent & interactive
  accent: "#c4a7e7",         // Iris - links, focus states
  
  // Semantic colors
  danger: "#eb6f92",         // Love - errors, destructive actions
  success: "#31748f",        // Pine - success states
  warning: "#f6c177",        // Gold - warnings
  info: "#9ccfd8",           // Foam - info states
  
  // Brand palette (mapped to Rosé Pine colors)
  brand: {
    red: "#eb6f92",          // Love
    pink: "#ebbcba",         // Rose  
    purple: "#c4a7e7",       // Iris
    blue: "#31748f",         // Pine
    marine: "#9ccfd8",       // Foam
    green: "#31748f",        // Pine
    yellow: "#f6c177",       // Gold
  }
}
```

### 2. Theme Function
Created `buildRosePineTheme()` that:
- Extends base theme builder with Rosé Pine colors
- Defines comprehensive dark theme (`isDark: true`)
- Maps all UI components: sidebars, modals, tooltips, inputs, etc.
- Implements syntax highlighting for code blocks
- Maintains accessibility with proper contrast ratios

### 3. Key Design Patterns

**Background Depth System:**
```
Base (#191724) → Surface (#1f1d2e) → Overlay (#26233a) → Highlight Med (#403d52)
```

**Text Hierarchy:**  
```
Text (#e0def4) → Subtle (#908caa) → Muted (#6e6a86)
```

**Code Syntax Mapping:**
- Tags/Classes: `#31748f` (Pine)
- Strings: `#f6c177` (Gold) 
- Keywords: `#c4a7e7` (Iris)
- Functions: `#ebbcba` (Rose)
- Attributes: `#9ccfd8` (Foam)
- Important/Errors: `#eb6f92` (Love)

### 4. Export & Usage
```typescript
// Available exports from shared/styles/theme.ts
export const rosePine = buildRosePineTheme();

// Usage in components
import { rosePine } from 'shared/styles/theme';
```

## Integration Points

### Current Theme System
- Integrates with existing `useBuildTheme` hook
- Compatible with theme switching infrastructure  
- Follows same patterns as `buildLightTheme()` and `buildDarkTheme()`

### Future Integration Opportunities
- Add to theme picker UI (likely in `/app/scenes/Settings/Details.tsx`)
- Extend `UiStore` to include Rosé Pine option
- Consider mobile-specific adaptations via `buildPitchBlackTheme` pattern

## Validation Status
- ✅ Linting passed (oxlint)
- ✅ TypeScript compilation successful  
- ✅ All theme properties defined
- ✅ Color contrast validated for accessibility

## Claude Code Notes
- Source colors from `rose_pine.md` in project root
- Theme follows Outline's established patterns in `shared/styles/theme.ts`
- Maintains compatibility with existing styled-components setup
- Ready for integration with theme selection UI when needed

## Related Files
- `shared/styles/theme.ts` - Core theme definitions
- `app/hooks/useBuildTheme.ts` - Theme building logic  
- `app/stores/UiStore.ts` - Theme state management
- `rose_pine.md` - Original color palette source