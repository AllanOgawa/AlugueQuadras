/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            boxShadow: {
                '3xl': '0 35px 60px -15px #000000',
            }
        },
    },
    plugins: [],
}