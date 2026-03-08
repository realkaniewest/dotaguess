const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://raw.githubusercontent.com/odota/dotaconstants/master/build/hero_abilities.json';
const outDir = path.join(__dirname, '../frontend/public/data');
const outFile = path.join(outDir, 'abilities.json');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading hero abilities...');
  fs.mkdirSync(outDir, { recursive: true });

  const json = await fetchJson(url);
  const result = {};

  for (const heroName of Object.keys(json)) {
    const data = json[heroName];
    const slug = heroName.replace('npc_dota_hero_', '');
    const abilities = (data.abilities || []).filter(function(a) {
      return a.indexOf('empty') === -1 && a.indexOf('hidden') === -1 && a.indexOf('attribute_bonus') === -1;
    });
    if (abilities.length > 0) {
      result[slug] = abilities;
    }
  }

  fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
  console.log('Saved abilities for', Object.keys(result).length, 'heroes to', outFile);
  console.log('Sample (antimage):', result['antimage']);
}

main().catch(console.error);
