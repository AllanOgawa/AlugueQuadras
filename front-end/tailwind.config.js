/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: '#FF7300', // Cor primária
                secondary: '#FF9238', // Cor secundária
                // accent: '#28a745', // Cor de destaque
            },
        },
    },
    plugins: [],
}