import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "c011163aabmsh3f4190a70668fb1p1a8c6cjsn68652f44fc1f";
const API_HOST = "cricbuzz-cricket.p.rapidapi.com";

let matchId = null;
let locked = false;


// Root
app.get("/", (req, res) => {
  res.send("Dream11 Backend Running");
});


// Get live IPL match
app.get("/match", async (req, res) => {
  try {

    const response = await fetch(
      "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live",
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": API_HOST
        }
      }
    );

    const data = await response.json();

    const iplMatch = data.typeMatches
      .flatMap(t => t.seriesMatches)
      .flatMap(s => s.seriesAdWrapper?.matches || [])
      .find(m =>
        m.matchInfo?.seriesName?.includes("IPL")
      );

    matchId = iplMatch?.matchInfo?.matchId;

    res.json(iplMatch);

  } catch (err) {
    res.json({ error: err.message });
  }
});


// Get playing XI + live score
app.get("/live", async (req, res) => {

  try {

    if (!matchId) {
      return res.json({ message: "Match not started" });
    }

    const response = await fetch(
      `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/scard`,
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": API_HOST
        }
      }
    );

    const data = await response.json();

    // Lock after first ball
    if (data.scoreCard?.length > 0) {
      locked = true;
    }

    res.json({
      data,
      locked
    });

  } catch (err) {
    res.json({ error: err.message });
  }

});


// lock
app.get("/lock", (req, res) => {
  res.json({ locked });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running");
});
