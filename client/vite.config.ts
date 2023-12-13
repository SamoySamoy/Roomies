import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import Unfonts from 'unplugin-fonts/vite';

export default defineConfig({
  plugins: [
    react(),
    Unfonts({
      // Custom fonts.
      custom: {
        /**
         * Fonts families lists
         */
        families: [
          {
            /**
             * Name of the font family.
             */
            name: 'Inter',
            /**
             * Local name of the font. Used to add `src: local()` to `@font-rule`.
             */
            local: 'Inter',
            /**
             * Regex(es) of font files to import. The names of the files will
             * predicate the `font-style` and `font-weight` values of the `@font-rule`'s.
             */
            src: './src/assets/fonts/Inter/static/*.ttf',

            /**
             * This function allow you to transform the font object before it is used
             * to generate the `@font-rule` and head tags.
             */
            transform(font) {
              // console.log(font);
              // if (font.basename === 'Roboto-Bold') {
              //   // update the font weight
              //   font.weight = 700;
              // }

              // we can also return null to skip the font
              return font;
            },
          },
        ],

        /**
         * Defines the default `font-display` value used for the generated
         * `@font-rule` classes.
         */
        display: 'auto',

        /**
         * Using `<link rel="preload">` will trigger a request for the WebFont
         * early in the critical rendering path, without having to wait for the
         * CSSOM to be created.
         */
        preload: true,

        /**
         * Using `<link rel="prefetch">` is intended for prefetching resources
         * that will be used in the next navigation/page load
         * (e.g. when you go to the next page)
         *
         * Note: this can not be used with `preload`
         */
        prefetch: false,

        /**
         * define where the font load tags should be inserted
         * default: 'head-prepend'
         *   values: 'head' | 'body' | 'head-prepend' | 'body-prepend'
         */
        injectTo: 'head-prepend',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
