#!/usr/bin/env node
/**
 * Expo CLI 54.x occasionally publishes packages missing the `autoAddConfigPlugins` helper.
 * This postinstall script ensures the helper exists so `expo install` does not crash
 * when it tries to auto apply config plugins.
 */
const fs = require('fs');
const path = require('path');

const targetPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo',
  'node_modules',
  '@expo',
  'cli',
  'build',
  'src',
  'install',
  'utils',
  'autoAddConfigPlugins.js'
);

if (fs.existsSync(targetPath)) {
  return;
}

const targetDir = path.dirname(targetPath);
fs.mkdirSync(targetDir, { recursive: true });

const fileContents = `"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
function autoAddConfigPluginsAsync() {
  // No-op fallback generated because the published CLI did not include the helper.
  return Promise.resolve();
}
function getNamedPlugins() {
  return [];
}
exports.autoAddConfigPluginsAsync = autoAddConfigPluginsAsync;
exports.getNamedPlugins = getNamedPlugins;
`;

fs.writeFileSync(targetPath, fileContents, 'utf8');

const mapPath = `${targetPath}.map`;
if (!fs.existsSync(mapPath)) {
  fs.writeFileSync(mapPath, '', 'utf8');
}

console.warn(
  '[postinstall] Patched Expo CLI: created missing autoAddConfigPlugins.js helper to avoid install crashes.'
);
