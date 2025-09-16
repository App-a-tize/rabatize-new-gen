// Metro configuration for Expo in a monorepo
// Ensures the app resolves React and other packages from its own node_modules first
// and works well with workspace symlinks.

const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

/** @type {import('metro-config').ConfigT} */
const config = getDefaultConfig(projectRoot);

// 1) Watch the monorepo root so changes in shared packages are picked up
config.watchFolders = [workspaceRoot];

// 2) Prefer resolving from the app's node_modules first, then the workspace root
config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ],
  // 3) Avoid climbing above nodeModulesPaths to resolve modules (prevents pulling React from the workspace root)
  disableHierarchicalLookup: true,
  // 4) Allow symlinked packages in a monorepo
  unstable_enableSymlinks: true,
};

module.exports = config;
