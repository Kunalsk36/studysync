import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The monorepo root also has a package-lock.json (shared Prettier
  // tooling from Phase 1) — pin the workspace root explicitly so Turbopack
  // doesn't have to guess between the two lockfiles.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
