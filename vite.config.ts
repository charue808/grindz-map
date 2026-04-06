import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { varlockVitePlugin } from '@varlock/vite-integration';


export default defineConfig({ plugins: [tailwindcss(), varlockVitePlugin(), sveltekit()] });
