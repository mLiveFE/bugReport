module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "commonjs": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};