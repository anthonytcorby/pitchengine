import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'wts-green': '#00FF41',
                'wts-dark': '#050D05',
                'wts-black': '#000000',
                'wts-card': 'rgba(20, 30, 20, 0.6)',
            },
            fontFamily: {
                sans: ['var(--font-outfit)', 'sans-serif'],
                display: ['var(--font-rajdhani)', 'sans-serif'],
                outfit: ['var(--font-outfit)', 'sans-serif'],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
            animation: {
                marquee: 'marquee 25s linear infinite',
                float: 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 3s infinite',
                shimmer: 'shimmer 8s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    'from': { backgroundPosition: '200% 0' },
                    'to': { backgroundPosition: '-200% 0' }
                }
            }
        },
    },
    plugins: [],
};
export default config;
