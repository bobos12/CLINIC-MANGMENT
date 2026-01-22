# CSS/SCSS Architecture Documentation

This document describes the CSS/SCSS architecture for the EYE-CLYNIC frontend application.

## 📁 Folder Structure

```
frontend/src/styles/
├── base/                    # Base design system
│   ├── _variables.scss      # Design tokens (colors, typography, spacing)
│   ├── _typography.scss     # Typography styles
│   ├── _reset.scss          # CSS reset and base styles
│   └── _index.scss          # Base styles index
│
├── components/              # Component-specific styles
│   ├── layout/             # Layout components
│   │   ├── _sidebar.scss   # Sidebar navigation styles
│   │   ├── _header.scss    # Top header styles
│   │   └── _index.scss     # Layout components index
│   │
│   └── ui/                 # UI components
│       ├── _buttons.scss   # Button component styles
│       ├── _inputs.scss    # Input, select, textarea styles
│       ├── _tables.scss    # Table component styles
│       ├── _cards.scss     # Card component styles
│       └── _index.scss     # UI components index
│
├── pages/                  # Page-specific styles
│   ├── _dashboard.scss     # Dashboard page styles
│   ├── _login.scss         # Login page styles
│   └── _index.scss         # Pages index
│
├── features/               # Feature-specific styles
│   ├── _patients.scss      # Patients feature styles
│   ├── _visits.scss        # Visits feature styles
│   └── _index.scss         # Features index
│
├── main.scss               # Main stylesheet (imports all)
└── README.md               # This file
```

## 🎨 Design System

### Colors

#### Primary Palette
- **Primary**: `#2F9CCA` - Main brand color
- **Secondary**: `#384152` - Secondary brand color
- **Tertiary**: `#66748C` - Tertiary brand color

#### Extended Palettes
- **Grey**: 50-950 scale for neutral colors
- **State**: 50-950 scale for state colors
- **Dark**: 50-950 scale for dark theme colors

#### Semantic Colors
- **Success**: `#10B981`
- **Error**: `#EF4444`
- **Warning**: `#F59E0B`
- **Info**: `#3B82F6`

### Typography

#### Font Family
- **Primary**: `Mulish` (Regular, Medium, Bold)

#### Font Sizes
- **H1**: `40px` (Bold)
- **H2**: `26px` (Bold)
- **H3**: `20px` (Bold)
- **LG**: `16px` (Regular/Medium/Bold)
- **MD**: `14px` (Regular/Medium/Bold)
- **SM**: `12px` (Regular/Medium/Bold)

### Spacing

Spacing scale uses consistent values:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### Layout

- **Sidebar Width**: `280px`
- **Header Height**: `72px`
- **Container Max Width**: `1440px`
- **Grid Columns**: `12`

## 📝 Usage

### Importing Styles

All styles are imported globally through `main.scss` which is imported in `main.jsx`:

```javascript
// frontend/src/main.jsx
import './styles/main.scss';
```

### Using Design Tokens

In your SCSS files, import variables:

```scss
@import '../base/variables';

.my-component {
  color: $color-primary;
  padding: $spacing-md;
  font-size: $font-size-md;
}
```

### Component-Specific Styles

Each component should have its own SCSS file in the appropriate folder:

- **Layout components** → `styles/components/layout/`
- **UI components** → `styles/components/ui/`
- **Page styles** → `styles/pages/`
- **Feature styles** → `styles/features/`

## 🎯 Best Practices

1. **Use Variables**: Always use design tokens from `_variables.scss` instead of hardcoded values
2. **Component Isolation**: Each component should have its own SCSS file
3. **BEM Naming**: Use BEM (Block Element Modifier) naming convention for CSS classes
4. **No Frameworks**: Use pure CSS/SCSS only, no Tailwind or other CSS frameworks
5. **Responsive Design**: Use mobile-first approach with media queries
6. **Maintainability**: Keep styles organized and well-commented

## 🔧 Development

### Adding New Styles

1. Create a new SCSS file in the appropriate folder
2. Import variables: `@import '../base/variables';`
3. Write your styles following the design system
4. Import the new file in the appropriate `_index.scss`

### Modifying Design Tokens

Update values in `styles/base/_variables.scss`. Changes will propagate throughout the application.

## 📱 Responsive Breakpoints

Default breakpoints (can be added to variables if needed):
- Mobile: `max-width: 768px`
- Tablet: `max-width: 1024px`
- Desktop: `min-width: 1025px`

## 🚀 Build Process

SCSS files are compiled by Vite during the build process. No additional build step is required.
