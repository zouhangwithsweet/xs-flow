import ts from 'rollup-plugin-typescript'

export default {
  input: 'src/index.ts',
  output: {
    name: 'StreamFlow',
    globals: {
      xstream: 'xstream'
    },
    file: 'dist/index.js',
    format: 'iife',
  },
  plugins: [
    ts({
      exclude: "node_modules/**",
      typescript: require("typescript")
    })
  ],
  external: ['xstream']
}
