/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        primary: "#14b8a6",
        primaryDark: "#0f766e",
        primaryLight: "#a7f3d0",

        background: "#f0fdf4",
        surface: "#ffffff",
        border: "#ccfbf1",

        textPrimary: "#0f172a",
        textSecondary: "#475569",
        textMuted: "#94a3b8",

        height: "#3b82f6",
        weight: "#6366f1",
        temperature: "#f97316",
        heartRate: "#f43f5e",
        spo2: "#06b6d4",
        bmi: "#a855f7",

        success: "#059669",
        warning: "#f59e0b",
        danger: "#dc2626",
        info: "#0891b2",
        treatment: "#8b5cf6",
      },
      fontFamily: {
        sans: ["Inter_400Regular"],
        heading: ["Poppins_600SemiBold"],
        mono: ["JetBrainsMono_400Regular"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        card: "0 4px 12px rgba(15,23,42,0.08)",
      },
    },
  },

  plugins: [],
};