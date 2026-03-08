const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const heroesPath = path.join(__dirname, 'data', 'heroes.json');

function loadHeroes() {
  if (!fs.existsSync(heroesPath)) return [];
  return JSON.parse(fs.readFileSync(heroesPath, 'utf-8'));
}

// Get all heroes
app.get('/api/heroes', (req, res) => {
  const heroes = loadHeroes();
  res.json(heroes);
});

// Get daily hero (deterministic by date)
app.get('/api/daily', (req, res) => {
  const heroes = loadHeroes();
  if (!heroes.length) return res.status(404).json({ error: 'No heroes loaded' });

  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % heroes.length;
  res.json({ hero: heroes[index], date: today.toISOString().split('T')[0] });
});

// Get hero by id
app.get('/api/heroes/:id', (req, res) => {
  const heroes = loadHeroes();
  const hero = heroes.find(h => h.id === parseInt(req.params.id));
  if (!hero) return res.status(404).json({ error: 'Hero not found' });
  res.json(hero);
});

// Guess validation
app.post('/api/guess', (req, res) => {
  const { guessedHeroId, targetHeroId } = req.body;
  const heroes = loadHeroes();
  const guessed = heroes.find(h => h.id === guessedHeroId);
  const target = heroes.find(h => h.id === targetHeroId);

  if (!guessed || !target) return res.status(400).json({ error: 'Invalid hero ids' });

  const result = {
    heroId: guessed.id,
    name: guessed.localized_name,
    correct: guessed.id === target.id,
    hints: {
      primary_attr: {
        value: guessed.primary_attr,
        status: guessed.primary_attr === target.primary_attr ? 'correct' : 'wrong'
      },
      attack_type: {
        value: guessed.attack_type,
        status: guessed.attack_type === target.attack_type ? 'correct' : 'wrong'
      },
      roles: {
        value: guessed.roles,
        status: compareRoles(guessed.roles, target.roles)
      },
      legs: {
        value: guessed.legs,
        status: guessed.legs === target.legs ? 'correct' : Math.abs(guessed.legs - target.legs) <= 2 ? 'partial' : 'wrong'
      }
    }
  };

  res.json(result);
});

function compareRoles(guessedRoles, targetRoles) {
  const common = guessedRoles.filter(r => targetRoles.includes(r));
  if (common.length === targetRoles.length && common.length === guessedRoles.length) return 'correct';
  if (common.length > 0) return 'partial';
  return 'wrong';
}

app.listen(PORT, () => {
  console.log(`DotaGuess backend running on http://localhost:${PORT}`);
});
