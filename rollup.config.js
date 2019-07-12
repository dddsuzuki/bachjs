import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/index.js',
  output: {
    file: './lib/bundle.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      runtimeHelpers: true,
    })
  ]
};
