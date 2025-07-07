// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.strict,             // tambahan aturan lebih ketat
  // tseslint.configs['strict-type-checked'], // opsional: gunakan jika pakai type-aware
);
