import express from "express";
import cors from "cors";


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
      "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/upcoming",
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": API_HOST
        }
      }
    );

    const data = await response.json();

    let match = null;

    data.typeMatches?.forEach(type => {

      if (type.matchType === "League") {

        type.seriesMatches?.forEach(series => {

          const name =
            series.seriesAdWrapper?.seriesName?.toLowerCase();

          if (name?.includes("indian premier")) {
            match = series.seriesAdWrapper?.matches?.[0];
          }

        });

      }

    });

    if (!match) {
      return res.json({ message: "No IPL match found" });
    }

    matchId = match.matchInfo.matchId;

    res.json(match);

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
