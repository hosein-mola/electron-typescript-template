module.exports = {
  // Extending standard configurations
  extends: [
    "eslint:recommended", 
    "plugin:prettier/recommended", 
    "plugin:vite/recommended",
    "plugin:react/recommended"
  ],
  
  // Adding custom rules
  rules: {
    // �️ Spacing Rules  
    "prettier/prettier": "error",
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1, "maxBOF": 0 }],
    "space-before-function-paren": ["error", "always"],
    "space-in-parens": ["error", "never"],
    "space-infix-ops": "error",
    "keyword-spacing": ["error", { "before": true, "after": true }],

    // � Tab & Indentation  
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "no-tabs": "error",

    // � Line Breaks  
    "linebreak-style": ["error", "unix"],
    "padding-line-between-statements": [
      "error",
      { "blankLine": "always", "prev": "function", "next": "function" },
      { "blankLine": "always", "prev": "block-like", "next": "*" },
      { "blankLine": "always", "prev": "import", "next": "function" },
      { "blankLine": "always", "prev": "directive", "next": "*" }
    ],

    // � Extra Readability Enhancements  
    "newline-before-return": "error",
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "semi-spacing": ["error", { "before": false, "after": true }],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "eol-last": ["error", "always"],

    // �‍� React-specific Rules
    "react/prop-types": "off",  // Disable prop-types rule if you use TypeScript or prefer another method.
    "react/jsx-uses-react": "off",  // React 17 JSX transform doesn't need `import React`.
    "react/jsx-uses-vars": "error", // Prevent unused variables in JSX.
    
    // � Managing State, Dispatch, and useEffect
    "react/jsx-sort-props": [
      "error", 
      { "callbacksLast": true, "noSortAlphabetically": false, "ignoreCase": true }
    ], // Sort props alphabetically and place callbacks at the end.
    "react/jsx-no-constructed-context-values": "error", // Prevent inline function/arrow function creation in JSX (helps avoid re-renders).
    "react/state-in-constructor": ["error", "never"], // State should not be initialized in constructors.
    "react/no-access-state-in-setstate": "error", // Avoid accessing `this.state` in `setState`.
    "react/no-unused-state": "warn", // Warn when state is not used in the component.
    "react-hooks/exhaustive-deps": ["warn", {
      "additionalHooks": "(useRecoilState|useSetRecoilState)" // Enable exhaustive deps for other state hooks.
    }],
    "react-hooks/rules-of-hooks": "error" // Ensures that hooks are called in valid places.
  }
};
