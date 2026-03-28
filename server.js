const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "YOUR_CRICAPI_KEY"; // we will add shortly

let teamsLocked = false;
let playingXI = [];


// Get today's IPL match
app.get("/match", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`
    );

    const data = await response.json();

    const iplMatch = data.data.find(m => m.name.includes("IPL"));

    res.send(iplMatch);

  } catch (err) {
    res.send({ error: "Match fetch failed" });
  }
});


// Get squad
app.get("/squad/:matchId", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.cricapi.com/v1/match_squad?apikey=${API_KEY}&id=${req.params.matchId}`
    );

    const data = await response.json();

    res.send(data);

  } catch (err) {
    res.send({ error: "Squad fetch failed" });
  }
});


// Get playing XI
app.get("/playingXI/:matchId", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.cricapi.com/v1/match_info?apikey=${API_KEY}&id=${req.params.matchId}`
    );

    const data = await response.json();

    playingXI = data.data.teamInfo;

    res.send(playingXI);

  } catch (err) {
    res.send({ error: "Playing XI fetch failed" });
  }
});


// Live score
app.get("/live/:matchId", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.cricapi.com/v1/cricScore?apikey=${API_KEY}&unique_id=${req.params.matchId}`
    );

    const data = await response.json();

    // Lock team after first ball
    if (data.score && data.score[0].o > 0) {
      teamsLocked = true;
    }

    res.send({
      score: data.score,
      locked: teamsLocked
    });

  } catch (err) {
    res.send({ error: "Live fetch failed" });
  }
});


// Lock status
app.get("/lock", (req, res) => {
  res.send({ locked: teamsLocked });
});


// Leaderboard placeholder (will upgrade next)
app.get("/leaderboard", (req, res) => {
  res.send([
    { user: "Aryaman", points: 0 },
    { user: "Arun", points: 0 },
    { user: "Nitesh", points: 0 }
  ]);
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});