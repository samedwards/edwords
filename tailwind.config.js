const defaultConfig = require('tailwindcss/defaultConfig');
const colors = require('tailwindcss/colors');

module.exports = {
  purge: false,
  darkMode: false,
  theme: {
    colors: {
      slate: colors.slate,
      gray: colors.gray,
      neutral: colors.neutral,
      stone: colors.stone,
      amber: colors.amber,
      black: colors.black,
      blue: colors.blue,
      cyan: colors.cyan,
      emerald: colors.emerald,
      fuchsia: colors.fuchsia,
      green: colors.green,
      indigo: colors.indigo,
      lime: colors.lime,
      orange: colors.orange,
      pink: colors.pink,
      purple: colors.purple,
      red: colors.red,
      rose: colors.rose,
      sky: colors.sky,
      teal: colors.teal,
      transparent: 'transparent',
      violet: colors.violet,
      white: colors.white,
      yellow: colors.yellow,
    },
    fontFamily: {
      sans: ['WorkSan', ...defaultConfig.theme.fontFamily.sans],
    },
    extend: {
      padding: {
        26: '6.5rem',
      },
      zIndex: {
        '1': 1,
        dropdown: 1100,
        header: 1000,
        drawer: 1200,
        modal: 1300,
        toast: 1400,
      },
    },
  },
  plugins: [require('@tailwindcss/ui')],
};
