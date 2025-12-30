/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Teal (Primary)

        primary: {
          DEFAULT: "#1A2D69", // 500: Main color
          dark: "#17285d", // 600: Darker shade
          light: "#5876c7", // 400: Lighter shade
          hover: "#5876c7", // 400: For hover effects
          text: "#101d46", // 800: Dark text color
          border: "#a3b2df", // 200: Light border
          bg: "#e9ecf6", // 50: Background
          focus: "#7d94d3", // 300: Focus ring
          active: "#142352", // 700: Active state
          disabled: "#c8d0eb", // 100: Disabled
        },
        //  purple
        // primary: {
        //   DEFAULT: "#8207DB", // main purple
        //   dark: "#6400A8", // darker shade
        //   light: "#B47CFF", // lighter purple
        //   hover: "#9B4FE0", // hover effect
        //   text: "#59168B", // for text
        //   border: "#D6BBFB", // for borders
        //   bg: "#F9F5FF", // background tint
        //   focus: "#A067E8", // focus effect
        //   active: "#5E00B3", // active press color
        //   disabled: "#E9D7FB", // disabled button bg
        // },
        // green
        // primary: {
        //   DEFAULT: '#0a6c74',  // 500: The main teal color
        //   dark: '#095b62',     // 600: Darker shade
        //   light: '#2fbacb',    // 400: Lighter shade
        //   hover: '#2fbacb',    // 400: For hover effects
        //   text: '#063c42',     // 800: Dark text color
        //   border: '#8dd9e1',   // 200: Light border
        //   bg: '#e6f7f8',       // 50: Background
        //   focus: '#5ecad6',    // 300: Focus ring
        //   active: '#074b52',   // 700: Active state
        //   disabled: '#bde8eb', // 100: Disabled
        // },

        // red
        // primary: {
        //   DEFAULT: '#cc0000',  // 500: The main teal color
        //   dark: '#b30000',     // 600: Darker shade
        //   light: '#ff1a1a',    // 400: Lighter shade
        //   hover: '#ff1a1a',    // 400: For hover effects
        //   text: '#800000',     // 800: Dark text color
        //   border: '#ff8080',   // 200: Light border
        //   bg: '#ffe6e6',       // 50: Background
        //   focus: '#ff4d4d',    // 300: Focus ring
        //   active: '#990000',   // 700: Active state
        //   disabled: '#ffb3b3', // 100: Disabled
        // },
        // Yellow
        secondary: {
          DEFAULT: "#facc15", // 500: Main yellow
          dark: "#eab308", // 600
          light: "#ffeb3a", // 400
          hover: "#ffeb3a", // 400
          text: "#854d0e", // 900: Strong text
          border: "#fff59a", // 200: Soft border
          bg: "#fffdea", // 50: Background
          focus: "#fff072", // 300
          active: "#ca8a04", // 700
          disabled: "#fff9c2", // 100
        },
      },
    },
    fontFamily: {
      NotoSerifKhmer: ["Noto Serif Khmer", "serif"],
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar": {
          "scrollbar-width": "thin",
          "scrollbar-color": "#1A2D69 #e9ecf6", // thumb / track
        },
        ".scrollbar::-webkit-scrollbar": {
          width: "8px",
        },
        ".scrollbar::-webkit-scrollbar-track": {
          background: "#e9ecf6", // bg 50
          borderRadius: "8px",
        },
        ".scrollbar::-webkit-scrollbar-thumb": {
          backgroundColor: "#1A2D69", // primary DEFAULT
          borderRadius: "8px",
        },
        ".scrollbar::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#5876c7", // primary 400 for hover
        },
      });
    },
  ],

   
    // purple
  //   plugins: [
  //   function ({ addUtilities }) {
  //     addUtilities({
  //       ".scrollbar-purple": {
  //         "scrollbar-width": "thin",
  //         "scrollbar-color": "#8207DB #F0E6FF", // thumb / track
  //         // "scroll-behavior": "smooth",
  //       },
  //       ".scrollbar-purple::-webkit-scrollbar": {
  //         width: "8px",
  //       },
  //       ".scrollbar-purple::-webkit-scrollbar-track": {
  //         background: "#F0E6FF",
  //         borderRadius: "8px",
  //       },
  //       ".scrollbar-purple::-webkit-scrollbar-thumb": {
  //         backgroundColor: "#8207DB",
  //         borderRadius: "8px",
  //       },
  //       ".scrollbar-purple::-webkit-scrollbar-thumb:hover": {
  //         backgroundColor: "#9B4FE0",
  //       },
  //     });
  //   },
  // ],

  // plugins: [
  //   function ({ addUtilities }) {
  //     addUtilities({
  //       ".scrollbar": {
  //         "scrollbar-width": "thin",
  //         "scrollbar-color": "#0a6c74 #e6f7f8", // thumb / track
  //       },
  //       ".scrollbar::-webkit-scrollbar": {
  //         width: "8px",
  //       },
  //       ".scrollbar::-webkit-scrollbar-track": {
  //         background: "#e6f7f8",
  //         borderRadius: "8px",
  //       },
  //       ".scrollbar::-webkit-scrollbar-thumb": {
  //         backgroundColor: "#0a6c74",
  //         borderRadius: "8px",
  //       },
  //       ".scrollbar::-webkit-scrollbar-thumb:hover": {
  //         backgroundColor: "#2fbacb",
  //       },
  //     });
  //   },
  // ],
};
