// import eslint from '@rollup/plugin-eslint'
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel'
// import { terser } from "rollup-plugin-terser";
// import * as restClient from 'typed-rest-client/RestClient';

const pkg = require('./package.json')

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'palBundle',
        },
        {
            file: pkg.cdn,
            format: 'umd',
            name: 'pal'
        },
        {
            file: pkg.module,
            format: 'es'
        }
    ],
    plugins: [
        commonjs(),
        builtins(),
        typescript({ tsconfig: './tsconfig.browser.json' }),
        // eslint({ exclude: 'package.json' }),
        nodeResolve({
            jsnext: true,
            preferBuiltins: true,
            browser: true
        }),
        globals(),
        json(),
        babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
        // terser() // minify generated es bundle
    ]
};