import globals from "globals";

import { baseConfig } from "./base.mjs";

export const nodeConfig = [
  ...baseConfig,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
];
