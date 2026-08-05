import { nodeConfig } from "./node.mjs";

export const nestjsConfig = [
  ...nodeConfig,
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-extraneous-class": "off",
    },
  },
];
