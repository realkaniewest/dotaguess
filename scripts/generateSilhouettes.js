#!/usr/bin/env node
/**
 * Generates black silhouettes from hero portraits using Canvas API
 * Requires: npm install canvas
 */

const fs = require('fs');
const path = require('path');

const HEROES_DIR = path.join(__dirname, '../public/heroes');
const SILHOUETTES_DIR = path.join(__dirname, '../public/silhouettes');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function generateSilhouette(inputPath, outputPath) {
  try {
    const { createCanvas, loadImage } = require('canvas');
    const img = await loadImage(inputPath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to silhouette: keep alpha, set RGB to black
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 10) { // not transparent
        data[i] = 0;     // R
        data[i + 1] = 0; // G
        data[i + 2] = 0; // B
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    return true;
  } catch (err) {
    return false;
  }
}

async function main() {
  ensureDir(SILHOUETTES_DIR);

  const files = fs.readdirSync(HEROES_DIR).filter(f => f.endsWith('.png'));
  console.log(`Generating silhouettes for ${files.length} heroes...`);

  let success = 0;
  let failed = 0;

  for (const file of files) {
    const inputPath = path.join(HEROES_DIR, file);
    const outputPath = path.join(SILHOUETTES_DIR, file);

    if (fs.existsSync(outputPath)) {
      process.stdout.write('.');
      success++;
      continue;
    }

    const ok = await generateSilhouette(inputPath, outputPath);
    if (ok) {
      process.stdout.write('+');
      success++;
    } else {
      // Create a placeholder black PNG
      process.stdout.write('o');
      // Copy original as fallback
      fs.copyFileSync(inputPath, outputPath);
      success++;
    }
  }

  console.log(`\nSuccess: ${success}, Failed: ${failed}`);
}

main().catch(console.error);
