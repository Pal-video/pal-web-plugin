import axios from 'axios';
import eslint from '@rollup/plugin-eslint'
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel'

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
        typescript({ tsconfig: './tsconfig.json' }),
        eslint({ exclude: 'package.json' }),
        nodeResolve({
            jsnext: true,
            preferBuiltins: true,
            browser: true
        }),
        globals(),
        json(),
        builtins(),
        babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
        // terser() // minify generated es bundle
        // axios(),
    ]
};