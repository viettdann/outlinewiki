# CLAUDE - Rosé Pine Theme Implementation

> This file documents the Rosé Pine theme feature implementation for future Claude Code sessions.

## Feature Summary
Complete Rosé Pine color scheme implementation and UI integration for the Outline wiki application. Theme implementation completed on 2025-07-22, UI integration completed on 2025-07-24.

## Files Modified
- `/shared/styles/theme.ts` - Added `rosePineColors` palette and `buildRosePineTheme()` function
- `/app/stores/UiStore.ts` - Added `RosePine` enum value to Theme enum and set as default theme
- `/app/scenes/Settings/Preferences.tsx` - Added "Rosé Pine" option to theme selector dropdown
- `/app/hooks/useBuildTheme.ts` - Added theme building logic for Rosé Pine theme
- `/app/actions/definitions/settings.tsx` - Added Rose Pine theme action for command palette

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

### 5. UI Integration (Added 2025-07-24)

**Theme Enum Extension:**
```typescript
export enum Theme {
  Light = "light",
  Dark = "dark",
  RosePine = "rosepine",  // NEW
  System = "system",
}
```

**Theme Selector UI:**
```typescript
const themeOptions: Option[] = React.useMemo(
  () =>
    [
      { type: "item", label: t("Light"), value: Theme.Light },
      { type: "item", label: t("Dark"), value: Theme.Dark },
      { type: "item", label: "Rosé Pine", value: Theme.RosePine }, // NEW
      { type: "item", label: t("System"), value: Theme.System },
    ] satisfies Option[],
  [t]
);
```

**Theme Building Logic:**
```typescript
const theme = useMemo(
  () =>
    isPrinting
      ? buildLightTheme(customTheme)
      : isMobile
        ? resolvedTheme === "dark"
          ? buildPitchBlackTheme(customTheme)
          : resolvedTheme === "rosepine"
          ? buildRosePineTheme(customTheme) // NEW
          : buildLightTheme(customTheme)
        : resolvedTheme === "dark"
          ? buildDarkTheme(customTheme)
          : resolvedTheme === "rosepine"
          ? buildRosePineTheme(customTheme) // NEW
          : buildLightTheme(customTheme),
  [customTheme, isMobile, isPrinting, resolvedTheme]
);
```

## Integration Points

### Current Theme System
- ✅ Fully integrated with existing `useBuildTheme` hook
- ✅ Compatible with theme switching infrastructure  
- ✅ Follows same patterns as `buildLightTheme()` and `buildDarkTheme()`
- ✅ Available in Settings → Preferences → Appearance
- ✅ Supports localStorage persistence via `UiStore`
- ✅ Works with view transitions for smooth theme switching
- ✅ Mobile support with consistent experience across devices

### User Experience
- **Access**: Settings → Preferences → Appearance → "Rosé Pine" OR Command Palette (Cmd/Ctrl+K) → "rose pine"
- **Default Theme**: Rose Pine is now the default theme for new users
- **Persistence**: Theme choice saved across browser sessions
- **Responsiveness**: Instant theme switching with smooth transitions
- **Cross-platform**: Consistent experience on desktop and mobile

## Validation Status
- ✅ Linting passed (oxlint clean)
- ✅ TypeScript compilation successful (yarn build clean)
- ✅ All theme properties defined
- ✅ Color contrast validated for accessibility
- ✅ Theme switching functional in development
- ✅ UI integration complete and tested

## Claude Code Notes

### Theme Selection Flow
The complete theme selection process:
1. User selects theme in Settings → Preferences → Appearance OR Command Palette
2. `handleThemeChange` calls `ui.setTheme(theme as Theme)` OR action executes `stores.ui.setTheme(Theme.RosePine)`
3. `UiStore.setTheme()` updates the observable theme value
4. `useBuildTheme` hook detects change via `ui.resolvedTheme`
5. Hook returns appropriate theme object based on selection
6. Styled-components ThemeProvider updates all components

### Default Theme Configuration
- **Location**: `app/stores/UiStore.ts:104`
- **Setting**: `this.theme = data.theme || Theme.RosePine;`
- **Behavior**: Rose Pine is now the default theme for new users or when no theme preference is stored

### Implementation Details
- Source colors from `rose_pine.md` in project root
- Theme follows Outline's established patterns in `shared/styles/theme.ts`
- Maintains compatibility with existing styled-components setup
- Full integration with theme selection UI completed
- Command palette integration with action system and analytics tracking

### Troubleshooting
- If theme doesn't appear: Check Theme enum includes the new value
- If theme doesn't apply: Verify buildRosePineTheme is imported and called in useBuildTheme
- If mobile issues: Check both mobile and desktop branches in theme selection logic

## Related Files
- `shared/styles/theme.ts` - Core theme definitions and buildRosePineTheme function
- `app/hooks/useBuildTheme.ts` - Theme building logic with Rosé Pine integration
- `app/stores/UiStore.ts` - Theme state management with RosePine enum and default theme setting
- `app/scenes/Settings/Preferences.tsx` - Theme selection UI
- `app/actions/definitions/settings.tsx` - Command palette theme action with analytics
- `rose_pine.md` - Original color palette source