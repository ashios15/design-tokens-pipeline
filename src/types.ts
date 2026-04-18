export interface Token {
  $value: string;
  $type?: string;
  $description?: string;
}

export interface TokenGroup {
  [key: string]: Token | TokenGroup;
}

export type OutputFormat = "css" | "scss" | "tailwind" | "ts" | "json";

export interface PipelineConfig {
  input: string;
  outputs: OutputConfig[];
  prefix?: string;
  watch?: boolean;
}

export interface OutputConfig {
  format: OutputFormat;
  outputPath: string;
}

export interface FlatToken {
  path: string[];
  name: string;        // kebab-case joined path
  cssVar: string;      // --prefix-name
  value: string;
  type?: string;
}
