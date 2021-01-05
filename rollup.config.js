import typescript from 'rollup-plugin-typescript2'
import {terser} from 'rollup-plugin-terser'
import pkg from './package.json'

/** @type {import('rollup').RollupOptions} */
const config = {
  input: `src/userflow.ts`,
  output: [
    {
      file: pkg.main,
      name: 'userflow.js',
      format: 'umd',
      sourcemap: true
    },
    {file: pkg.module, format: 'es', sourcemap: true},
    {
      file: 'dist/userflow.snippet.js',
      format: 'iife',
      strict: false,
      plugins: [terser()]
    }
  ],
  plugins: [typescript({useTsconfigDeclarationDir: true})]
}

export default config
