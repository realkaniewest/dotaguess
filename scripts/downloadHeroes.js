#!/usr/bin/env node
/**
 * Downloads hero data from OpenDota API and saves to backend/data/heroes.json
 * Also downloads hero portraits to public/heroes/
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OPENDOTA_API = 'https://api.opendota.com/api/heroStats';
const HEROES_DIR = path.join(__dirname, '../frontend/public/heroes');
const DATA_DIR = path.join(__dirname, '../backend/data');
const CDN_BASE = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function slugify(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

async function main() {
  ensureDir(HEROES_DIR);
  ensureDir(DATA_DIR);

  console.log('Fetching hero data from OpenDota API...');
  const rawHeroes = await fetchJson(OPENDOTA_API);
  console.log(`Got ${rawHeroes.length} heroes`);

  const heroes = rawHeroes.map(h => ({
    id: h.id,
    name: h.name, // npc_dota_hero_antimage
    localized_name: h.localized_name,
    primary_attr: h.primary_attr, // agi/str/int/all
    attack_type: h.attack_type, // Melee/Ranged
    roles: h.roles || [],
    legs: h.legs || 2,
    base_health: h.base_health || 200,
    base_mana: h.base_mana || 75,
    base_armor: h.base_armor || 0,
    base_attack_min: h.base_attack_min || 0,
    base_attack_max: h.base_attack_max || 0,
    base_str: h.base_str || 0,
    base_agi: h.base_agi || 0,
    base_int: h.base_int || 0,
    str_gain: h.str_gain || 0,
    agi_gain: h.agi_gain || 0,
    int_gain: h.int_gain || 0,
    move_speed: h.move_speed || 300,
    attack_range: h.attack_range || 150,
    projectile_speed: h.projectile_speed || 0,
    slug: slugify(h.localized_name),
    icon: `/heroes/${slugify(h.localized_name)}.png`,
    silhouette: `/silhouettes/${slugify(h.localized_name)}.png`,
    // Abilities from OpenDota
    abilities: h['1_pick'] !== undefined ? [] : [], // placeholder
  }));

  // Save heroes.json
  const heroesFile = path.join(DATA_DIR, 'heroes.json');
  fs.writeFileSync(heroesFile, JSON.stringify(heroes, null, 2));
  console.log(`Saved ${heroes.length} heroes to ${heroesFile}`);

  // Download hero portraits
  console.log('\nDownloading hero portraits...');
  let downloaded = 0;
  let failed = 0;

  for (const hero of heroes) {
    const heroName = hero.name.replace('npc_dota_hero_', '');
    const url = `${CDN_BASE}/${heroName}.png`;
    const dest = path.join(HEROES_DIR, `${hero.slug}.png`);

    if (fs.existsSync(dest)) {
      process.stdout.write('.');
      downloaded++;
      continue;
    }

    try {
      await downloadFile(url, dest);
      process.stdout.write('+');
      downloaded++;
      await new Promise(r => setTimeout(r, 100)); // rate limit
    } catch (err) {
      process.stdout.write('x');
      failed++;
    }
  }

  console.log(`\nDownloaded: ${downloaded}, Failed: ${failed}`);
  console.log('\nDone! Run the silhouette generator next.');
}

main().catch(console.error);
