/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xxl': '1440px',
      }
    },
  },
  plugins: [],
}

// /** @type {import('tailwindcss').Config} */
//    module.exports = {
//      content: [
//        './pages/**/*.{js,ts,jsx,tsx,mdx}',
//        './components/**/*.{js,ts,jsx,tsx,mdx}',
//        './app/**/*.{js,ts,jsx,tsx,mdx}',
//      ],
//      theme: {
//        extend: {},
//      },
//      plugins: [],
//    }