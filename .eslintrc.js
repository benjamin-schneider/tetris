module.exports = {
    "extends": "airbnb",
    "rules": {
        "func-names": "off",
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4]
    },
    "env": {
        "jest": true,
    },

};