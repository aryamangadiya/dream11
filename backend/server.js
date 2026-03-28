import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "375bf52c-85b3-4cac-b103-f7505c88958d";

let locked = false;


// root
app.get("/", (req, res) => {
  res.send("Dream11 Backend Running");
});


// get today's IPL match
app.get("/match", async (req, res) => {
  try {

    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`
    );

    const data = await response.json();

    const iplMatch = data.data?.find(match =>
      match.name?.includes("IPL")
    );

    res.json(iplMatch);

  } catch (err) {
    res.json({ error: err.message });
  }
});


// live score
app.get("/live", async (req, res) => {

  try {

    const response = await fetch(
      `https://api.cricapi.com/v1/cricScore?apikey=${API_KEY}`
    );

    const data = await response.json();

    const iplMatch = data.data?.find(match =>
      match.tournament?.includes("IPL")
    );

    if (iplMatch?.score) {
      locked = true;
    }

    res.json({
      match: iplMatch,
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
