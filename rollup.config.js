import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  moduleName: 'react-ripq',
  format: 'cjs',
  external: ['react', 'react-dom', 'prop-types', 'redux', 'react-redux'],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs({ 
      include: [
        'node_modules/**'
      ],
      exclude: [
        'node_modules/process-es6/**'
      ],
      namedExports: {
        'node_modules/react/react.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render']
      }
    }),
    globals(),
    builtins({
      preferBuiltins: true
    })
  ],
  dest: 'dist/index.js'
}