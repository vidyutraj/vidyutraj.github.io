# Company Logos

Place company logo images here. Supported formats: PNG, SVG, JPG

## Naming Convention

Use lowercase company names with hyphens:
- `ups.png` for UPS
- `google.png` for Google
- `microsoft.svg` for Microsoft

## Logo Specifications

- Recommended size: 64x64px to 128x128px
- Format: PNG with transparency or SVG
- Aspect ratio: Square (1:1) preferred
- Background: Transparent or white

## Usage

Logos are referenced in `src/data/experience.ts`:

```typescript
{
  company: 'UPS',
  logo: '/logos/ups.png', // Path relative to public folder
  logoAlt: 'UPS Logo',
  // ...
}
```

If a logo is not provided, a default building icon will be displayed.

