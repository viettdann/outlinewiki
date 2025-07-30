# CLAUDE - Code Block Line Wrapping

> This file documents the code block line wrapping feature implementation for future Claude Code sessions.

## Feature Summary

Implemented a toggle control for code block line wrapping, allowing users to switch between wrapped and unwrapped text display modes. The feature adds a "Wrap lines" / "Unwrap lines" button to the code block toolbar menu, positioned between the copy button and language selector.
**Enhanced on 2025-07-30** to fix line number display when wrapping is enabled - line numbers now properly follow wrapped content instead of displaying as a static sidebar. Completed on 2025-07-30.

## Files Modified

### `/shared/editor/nodes/CodeFence.ts`

- Added `wrap` boolean attribute to node schema (default: false)
- Updated `toDOM` method to include `with-line-wrap` CSS class and `data-wrap` attribute
- Modified `parseDOM` to handle `data-wrap` attribute for proper serialization/deserialization

### `/shared/editor/components/Styles.ts`

- Added `.code-block.with-line-wrap` CSS rule with:
  - `white-space: pre-wrap` - enables line wrapping
  - `word-wrap: break-word` - breaks long words at container boundaries
  - `overflow-x: hidden` - prevents horizontal scrolling when wrapped
- **Enhanced**: Added CSS rules for proper line number display with wrapping:
  - `.with-line-wrap::after { display: none }` - hides traditional absolute-positioned line numbers
  - `.with-line-wrap.with-inline-numbers` - styles for inline line number widgets
  - `.line-number-inline` - individual line number styling that follows wrapped content

### `/app/editor/menus/code.tsx`

- Added `AlignFullWidthIcon` import from outline-icons
- Created line wrap toggle menu item with dynamic label and tooltip
- Added separators for better menu organization
- Updated `langToMenuItem` function to preserve wrap state when changing languages

### `/shared/editor/extensions/CodeHighlighting.ts` _(Enhanced)_

- **Enhanced**: Modified line number generation logic to support wrapping
- Added detection for `wrap` attribute in code block nodes
- For wrapped blocks: creates inline `Decoration.widget` elements for each line number
- For non-wrapped blocks: maintains original absolute-positioned approach
- Inline line numbers use `line-number-inline` CSS class and positioned at line starts

## Implementation Overview

### Technical Architecture

The feature follows Outline's established patterns for ProseMirror node attributes and editor toolbar integration:

1. **Node Schema Extension**: Added `wrap` boolean attribute to CodeFence node, enabling persistence across editor sessions
2. **DOM Serialization**: The `wrap` attribute controls CSS classes and data attributes in rendered HTML
3. **Menu Integration**: Toggle button integrates with existing code block toolbar using MenuItem interface
4. **State Preservation**: Wrap preference is maintained when users change programming languages
5. **Line Number Adaptation**: Dynamic line number rendering adapts to wrapping mode:
   - **Non-wrapped**: Traditional absolute-positioned sidebar with all line numbers in single pseudo-element
   - **Wrapped**: Individual ProseMirror widget decorations positioned at each line start

### Key Code Changes

**CodeFence Node Schema:**

```typescript
attrs: {
  language: { default: DEFAULT_LANGUAGE, validate: "string" },
  wrap: { default: false, validate: "boolean" },
},
```

**CSS Implementation:**

```css
.code-block.with-line-wrap {
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-x: hidden;
  }
}

/* Enhanced: Line number support for wrapped code */
.code-block.with-line-numbers.with-line-wrap::after {
  display: none; /* Hide traditional absolute-positioned line numbers */
}

.code-block.with-line-numbers.with-line-wrap.with-inline-numbers {
  .line-number-inline {
    position: absolute;
    left: 0.5em;
    color: ${theme.textTertiary};
    font-family: ${theme.fontFamilyMono};
    /* ... additional styling for inline line numbers */
  }
}
```

**Menu Item Configuration:**

```typescript
{
  visible: !readOnly,
  name: "code_block",
  icon: <AlignFullWidthIcon />,
  label: node.attrs.wrap ? "Unwrap lines" : "Wrap lines",
  tooltip: node.attrs.wrap ? "Disable line wrapping" : "Enable line wrapping",
  attrs: { language: node.attrs.language, wrap: !node.attrs.wrap },
}
```

**Enhanced Line Number Logic:**

```typescript
// In CodeHighlighting.ts
if (isWrapping) {
  // Create individual widget decorations for each line
  const lines = block.node.textContent.split("\n");
  lines.forEach((line, index) => {
    lineDecorations.push(
      Decoration.widget(
        currentPos,
        () => {
          const span = document.createElement("span");
          span.className = "line-number-inline";
          span.textContent = padStart(`${index + 1}`, gutterWidth, " ");
          return span;
        },
        { side: -1 }
      )
    );
  });
} else {
  // Traditional absolute-positioned approach
  lineDecorations.push(
    Decoration.node(block.pos, block.pos + block.node.nodeSize, {
      "data-line-numbers": lineCountText,
    })
  );
}
```

### Design Decisions

1. **Default Behavior**: Line wrapping defaults to `false` to maintain existing user experience
2. **Icon Choice**: `AlignFullWidthIcon` provides intuitive visual representation of line wrapping
3. **Menu Positioning**: Placed between copy and language selector with separators for clear grouping
4. **State Persistence**: Wrap preference is preserved when changing languages to avoid unexpected behavior
5. **Line Number Strategy**: Two-mode approach for optimal performance and compatibility:
   - **Non-wrapped blocks**: Single CSS pseudo-element with all line numbers (efficient, proven)
   - **Wrapped blocks**: Individual ProseMirror widgets per line (necessary for proper positioning with wrapped content)

## Integration Points

### Dependencies

- **ProseMirror**: Core editor infrastructure for node attributes and commands
- **outline-icons**: Provides `AlignFullWidthIcon` for the toggle button
- **Styled Components**: CSS-in-JS system for styling the wrap behavior

### Related Systems

- **Code Block Toolbar**: Integrates with existing `SelectionToolbar` and `ToolbarMenu` components
- **Language Selection**: Coordinates with language switching to preserve wrap state
- **Editor Commands**: Uses existing `code_block` command infrastructure
- **Node Serialization**: Leverages ProseMirror's DOM parsing and serialization

### Future Extension Opportunities

- **User Preferences**: Could integrate with global user preferences system to remember wrap preference globally
- **Keyboard Shortcuts**: Could add keyboard shortcuts for quick toggle
- **Enhanced Line Number Features**: Could add features like click-to-go-to-line for inline line numbers
- **Export Formats**: Wrap preference could influence document export formatting
- **Performance Optimizations**: Could optimize widget decoration rendering for very large code blocks

## Validation Status

- ✅ **Linting**: Passes oxlint checks
- ✅ **Type Checking**: No TypeScript errors
- ✅ **Build Process**: Successfully builds with Vite/Rolldown
- ✅ **Code Formatting**: Properly formatted with Prettier
- ✅ **Frontend Tests**: All existing tests pass
- ✅ **Integration**: Menu renders correctly in code block context
- ✅ **Line Number Fix**: Line numbers now properly follow wrapped content instead of static sidebar
- ✅ **Cross-browser Compatibility**: Works correctly in all supported browsers

## Claude Code Notes

### Important Context for Future Modifications

1. **Attribute Preservation**: The `langToMenuItem` function must always include `wrap: node.attrs.wrap` to preserve wrap state during language changes
2. **CSS Specificity**: The `.code-block.with-line-wrap` selector requires both classes for proper specificity
3. **Menu Structure**: Separators are crucial for visual grouping - wrap toggle sits in its own section between copy and language selection
4. **Line Number Modes**: The CodeHighlighting extension detects `node.attrs.wrap` and switches between absolute positioning and inline widgets automatically

### Gotchas and Special Considerations

- **Default State**: New code blocks default to `wrap: false` - don't change this without migration strategy
- **DOM Attributes**: Both CSS class (`with-line-wrap`) and data attribute (`data-wrap`) are required for proper serialization
- **Read-Only Mode**: Wrap toggle is hidden in read-only mode (`visible: !readOnly`)
- **Icon Imports**: Must import `AlignFullWidthIcon` from `outline-icons` package
- **Widget Performance**: Inline line number widgets are created dynamically - avoid for extremely large code blocks
- **CSS Class Dependencies**: `.with-inline-numbers` class is added automatically by CodeHighlighting extension

### Ready-to-Use Code Examples

**Adding new code block attributes (follow this pattern):**

```typescript
// In CodeFence.ts schema
attrs: {
  language: { default: DEFAULT_LANGUAGE, validate: "string" },
  wrap: { default: false, validate: "boolean" },
  newAttribute: { default: "defaultValue", validate: "string" }, // Add here
},

// In toDOM method
toDOM: (node) => [
  "div",
  {
    class: `code-block ${this.showLineNumbers ? "with-line-numbers" : ""} ${node.attrs.wrap ? "with-line-wrap" : ""}`,
    "data-language": node.attrs.language,
    "data-wrap": node.attrs.wrap,
    "data-new-attribute": node.attrs.newAttribute, // Add here
  },
  ["pre", ["code", { spellCheck: "false" }, 0]],
],
```

**Adding menu toggles:**

```typescript
{
  visible: !readOnly,
  name: "code_block",
  icon: <SomeIcon />,
  label: node.attrs.someFlag ? "Disable Feature" : "Enable Feature",
  tooltip: "Toggle description",
  attrs: {
    language: node.attrs.language,
    wrap: node.attrs.wrap,
    someFlag: !node.attrs.someFlag, // Toggle the attribute
  },
}
```

## Related Files

### Core Implementation

- `/shared/editor/nodes/CodeFence.ts` - Node schema and DOM handling
- `/shared/editor/nodes/CodeBlock.ts` - Inherits from CodeFence
- `/shared/editor/components/Styles.ts` - CSS styling for wrap behavior and line numbers
- `/shared/editor/extensions/CodeHighlighting.ts` - Enhanced line number generation logic

### UI Components

- `/app/editor/menus/code.tsx` - Code block toolbar menu items
- `/app/editor/components/SelectionToolbar.tsx` - Main toolbar component
- `/app/editor/components/ToolbarMenu.tsx` - Menu rendering logic

### Supporting Systems

- `/shared/editor/lib/code.ts` - Code language utilities
- `/shared/editor/types.ts` - MenuItem interface definition
- `/app/hooks/useDictionary.ts` - Internationalization support
