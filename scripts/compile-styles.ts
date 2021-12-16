/* eslint-disable no-console */
import fs from 'fs';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';

const run = async () => {
  try {
    const css = fs.readFileSync(`./src/styles/wordle.css`);
    const result = await postcss([postcssImport as any, tailwindcss('./tailwind.config.js' as any), autoprefixer]).process(css, {
      from: undefined,
    });

    fs.writeFileSync('./build/wordle.css', result.toString());

    console.log('Style compilation complete.');
  } catch (error) {
    console.error(error);
  }
};

run();
