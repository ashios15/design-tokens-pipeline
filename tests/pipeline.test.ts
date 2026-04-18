import { describe, it, expect } from "vitest";
import { flattenTokens } from "../src/parser";
import { generate } from "../src/generators";

describe("flattenTokens", () => {
  it("flattens nested token groups into flat list", () => {
    const input = {
      color: {
        primary: {
          500: { $value: "#3b82f6", $type: "color" },
        },
      },
    };
    const result = flattenTokens(input, "ds");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      name: "color-primary-500",
      cssVar: "--ds-color-primary-500",
      value: "#3b82f6",
      type: "color",
    });
  });

  it("handles tokens without prefix", () => {
    const input = {
      spacing: {
        md: { $value: "16px", $type: "dimension" },
      },
    };
    const result = flattenTokens(input);
    expect(result[0].cssVar).toBe("--spacing-md");
  });
});

describe("generators", () => {
  const tokens = flattenTokens({
    color: {
      primary: { $value: "#3b82f6", $type: "color" },
    },
    spacing: {
      md: { $value: "16px", $type: "dimension" },
    },
  });

  it("generates CSS custom properties", () => {
    const css = generate(tokens, "css");
    expect(css).toContain(":root {");
    expect(css).toContain("--color-primary: #3b82f6");
    expect(css).toContain("--spacing-md: 16px");
  });

  it("generates SCSS variables", () => {
    const scss = generate(tokens, "scss");
    expect(scss).toContain("$color-primary: #3b82f6");
    expect(scss).toContain("$spacing-md: 16px");
  });

  it("generates TypeScript constants", () => {
    const ts = generate(tokens, "ts");
    expect(ts).toContain("export const tokens = {");
    expect(ts).toContain('"#3b82f6"');
  });

  it("generates valid JSON", () => {
    const json = generate(tokens, "json");
    const parsed = JSON.parse(json);
    expect(parsed["color-primary"].value).toBe("#3b82f6");
  });

  it("generates Tailwind config", () => {
    const tw = generate(tokens, "tailwind");
    expect(tw).toContain("export const tokens =");
    expect(tw).toContain("var(--color-primary)");
  });
});
