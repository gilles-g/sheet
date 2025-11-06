import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  external: ['@hotwired/stimulus'],
  plugins: [
    nodeResolve(),
    typescript({ 
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist'
    })
  ]
};
