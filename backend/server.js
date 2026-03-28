import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "375bf52c-85b3-4cac-b103-f7505c88958d";

let locked = false;


// Get Today's Match
app.get("/match", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`
    );

    const data = await response.json();

    const ipl = data.data?.find(m =>
      m.name?.includes("IPL")
    );

    res.send(ipl);

  } catch (err) {
    res.send({ error: "match fetch failed" });
  }
});


// Get Squad
app.get("/squad/:id", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.cricapi.com/v1/match_squad?apikey=${API_KEY}&id=${req.params.id}`
    );

    const data = await response.json();

    res.send(data);

  } catch (err) {
    res.send({ error: "squad fetch failed" });
  }
});


// Playing XI
app.get("/playingXI/:id", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.cricapi.com/v1/match_info?apikey=${API_KEY}&id=${req.params.id}`
    );

    const data = await response.json();

    res.send(data);

  } catch (err) {
    res.send({ error: "playing XI fetch failed" });
  }
});


// Live Score
app.get("/live/:id", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.cricapi.com/v1/cricScore?apikey=${API_KEY}&unique_id=${req.params.id}`
    );

    const data = await response.json();

    if (data.score && data.score[0]?.o > 0) {
      locked = true;
    }

    res.send({
      live: data,
      locked
    });

  } catch (err) {
    res.send({ error: "live fetch failed" });
  }
});


app.get("/lock", (req, res) => {
  res.send({ locked });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running");
});