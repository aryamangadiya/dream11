// ================= BACKEND (server.js) =================

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// -------- In-memory DB (for now) --------
let users = [];
let leagues = [
  {
    id: 1,
    name: "Aryaman IPL League",
    code: "IPL123",
    max: 10,
    members: []
  }
];

let teams = [];
let leaderboard = [];

// -------- JOIN LEAGUE --------
app.post('/join', (req, res) => {
  const { username, code } = req.body;

  const league = leagues.find(l => l.code === code);

  if (!league) return res.status(404).send("League not found");

  if (league.members.includes(username)) {
    return res.send(league);
  }

  if (league.members.length >= league.max) {
    return res.send("League full");
  }

  league.members.push(username);
  users.push({ username });

  res.send(league);
});

// -------- CREATE TEAM --------
app.post('/team', (req, res) => {
  const { username, matchId, players } = req.body;

  if (players.length !== 11) {
    return res.send("Team must have 11 players");
  }

  const roleCount = {
    WK: 0,
    BAT: 0,
    AR: 0,
    BOWL: 0
  };

  const teamCount = {};

  players.forEach(p => {
    roleCount[p.role]++;
    teamCount[p.team] = (teamCount[p.team] || 0) + 1;
  });

  if (roleCount.WK < 1) return res.send("Min 1 WK required");
  if (roleCount.BAT < 3) return res.send("Min 3 BAT required");
  if (roleCount.AR < 1) return res.send("Min 1 AR required");
  if (roleCount.BOWL < 2) return res.send("Min 2 BOWL required");

  if (Math.max(...Object.values(teamCount)) > 8) {
    return res.send("Max 8 players from one team");
  }

  teams.push({ username, matchId, players });

  res.send("Team saved successfully");
});

// -------- SCORING ENGINE --------
function calculatePoints(player, role, isCaptain, isViceCaptain) {
  let points = 0;

  // Batting
  if (player.runs) {
    points += player.runs;
    points += (player.fours || 0) * 4;
    points += (player.sixes || 0) * 6;

    if (player.runs >= 100) points += 16;
    else if (player.runs >= 75) points += 12;
    else if (player.runs >= 50) points += 8;
    else if (player.runs >= 25) points += 4;

    if (player.runs === 0 && player.balls > 0 && role !== "BOWL") {
      points -= 2;
    }

    if (player.balls >= 10) {
      let sr = (player.runs / player.balls) * 100;

      if (sr > 170) points += 6;
      else if (sr > 150) points += 4;
      else if (sr >= 130) points += 2;
      else if (sr <= 70 && sr >= 60) points -= 2;
      else if (sr < 60 && sr >= 50) points -= 4;
      else if (sr < 50) points -= 6;
    }
  }

  // Bowling
  if (player.wickets) {
    points += player.wickets * 30;

    if (player.lbwBowled) {
      points += player.lbwBowled * 8;
    }

    if (player.wickets >= 5) points += 12;
    else if (player.wickets === 4) points += 8;
    else if (player.wickets === 3) points += 4;
  }

  if (player.dotBalls) points += player.dotBalls;
  if (player.maidens) points += player.maidens * 12;

  if (player.overs >= 2) {
    let eco = player.runsConceded / player.overs;

    if (eco < 5) points += 6;
    else if (eco < 6) points += 4;
    else if (eco <= 7) points += 2;
    else if (eco >= 10 && eco < 11) points -= 2;
    else if (eco >= 11 && eco <= 12) points -= 4;
    else if (eco > 12) points -= 6;
  }

  // Fielding
  if (player.catches) {
    points += player.catches * 8;
    if (player.catches >= 3) points += 4;
  }

  if (player.stumpings) points += player.stumpings * 12;
  if (player.runoutDirect) points += player.runoutDirect * 12;
  if (player.runoutIndirect) points += player.runoutIndirect * 6;

  if (player.playingXI) points += 4;
  if (player.substitute) points += 4;

  if (isCaptain) points *= 2;
  else if (isViceCaptain) points *= 1.5;

  return Math.round(points);
}

// -------- REAL LIVE DATA --------
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_KEY = "375bf52c-85b3-4cac-b103-f7505c88958d";

app.get('/live/:matchId', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`
    );

    const data = await response.json();

    // Filter IPL matches
    const iplMatch = data.data.find(m => m.name.includes("IPL"));

    if (!iplMatch) {
      return res.send({ message: "No IPL match live" });
    }

    res.send({
      match: iplMatch.name,
      score: iplMatch.score,
      status: iplMatch.status
    });

  } catch (err) {
    res.send({ error: "Failed to fetch live data" });
  }
});

// -------- LEADERBOARD (MOCK) --------
app.get('/leaderboard', (req, res) => {
  const data = users.map(u => {
    return {
      user: u.username,
      points: Math.floor(Math.random() * 200) // temp random
    };
  });

  // sort descending
  data.sort((a, b) => b.points - a.points);

  res.send(data);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
app.get('/points', (req, res) => {
  const mockPlayers = [
    { name: "Kohli", runs: 45, balls: 30, fours: 5, sixes: 2, playingXI: true },
    { name: "Bumrah", wickets: 2, overs: 4, runsConceded: 25, dotBalls: 10, playingXI: true }
  ];

  let total = 0;

  mockPlayers.forEach(p => {
    total += calculatePoints(p, "BAT", false, false);
  });

  res.send({ total });
});