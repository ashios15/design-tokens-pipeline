import type { Token, TokenGroup, FlatToken } from "./types";

function isToken(value: unknown): value is Token {
  return typeof value === "object" && value !== null && "$value" in value;
}

export function flattenTokens(
  group: TokenGroup,
  prefix: string = "",
  path: string[] = []
): FlatToken[] {
  const result: FlatToken[] = [];

  for (const [key, value] of Object.entries(group)) {
    const currentPath = [...path, key];
    const kebabName = currentPath.join("-");

    if (isToken(value)) {
      result.push({
        path: currentPath,
        name: kebabName,
        cssVar: `--${prefix ? prefix + "-" : ""}${kebabName}`,
        value: value.$value,
        type: value.$type,
      });
    } else if (typeof value === "object" && value !== null) {
      result.push(...flattenTokens(value as TokenGroup, prefix, currentPath));
    }
  }

  return result;
}
