import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";


export default [
    { languageOptions: { globals: globals.browser } },

    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReactConfig,
    {
        env: {
            node: true,
            es6: true,
        },
        rules: {
            'react/react-in-jsx-scope': 'off',  // No need for React import with modern React
            '@typescript-eslint/no-var-requires': 'off'
        },
        settings: {
            react: {
                version: 'detect',  // ESLint auto-detects React version
            },
        },
    }
];