# Design Tokens Pipeline

A CLI tool that transforms **design tokens** (JSON / W3C DTCG format) into platform-specific outputs: **CSS custom properties**, **SCSS variables**, **Tailwind theme config**, **TypeScript constants**, and **flat JSON**.

![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)
![CLI](https://img.shields.io/badge/CLI-tool-orange)
![Vitest](https://img.shields.io/badge/Vitest-tested-6E9F18)

## Quick Start

```bash
# Generate CSS variables from tokens
npx design-tokens tokens/base.tokens.json --format css --out dist/variables.css

# Generate Tailwind config with custom prefix
npx design-tokens tokens/base.tokens.json --format tailwind --out dist/tokens.ts --prefix ds

# Generate all formats
npx design-tokens tokens/base.tokens.json --format css --out dist/variables.css
npx design-tokens tokens/base.tokens.json --format scss --out dist/_tokens.scss
npx design-tokens tokens/base.tokens.json --format tailwind --out dist/tailwind-tokens.ts
npx design-tokens tokens/base.tokens.json --format ts --out dist/tokens.ts
npx design-tokens tokens/base.tokens.json --format json --out dist/tokens.json
```

## Token Input Format (W3C DTCG)

```json
{
  "color": {
    "primary": {
      "500": { "$value": "#3b82f6", "$type": "color" }
    }
  },
  "spacing": {
    "md": { "$value": "16px", "$type": "dimension" }
  }
}
```

## Output Examples

### CSS
```css
:root {
  /* color */
  --color-primary-500: #3b82f6;
  /* dimension */
  --spacing-md: 16px;
}
```

### Tailwind
```ts
export const tokens = {
  color: { "primary-500": "var(--color-primary-500)" },
  spacing: { md: "var(--spacing-md)" },
} as const;
```

### SCSS
```scss
$color-primary-500: #3b82f6;
$spacing-md: 16px;
```

## Architecture

```
src/
├── cli.ts          # CLI entry point with arg parsing
├── types.ts        # Token, FlatToken, PipelineConfig types
├── parser.ts       # Recursive token flattening (handles nested groups)
└── generators.ts   # Output generators (CSS, SCSS, Tailwind, TS, JSON)
tokens/
└── base.tokens.json    # Example token source (W3C DTCG format)
tests/
└── pipeline.test.ts    # Unit tests for parser + all 5 generators
```

## Running Tests

```bash
npm test
```

## License

MIT
