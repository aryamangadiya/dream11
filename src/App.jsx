import { useState, useEffect } from "react";

export default function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [live, setLive] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [points, setPoints] = useState(0);

  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const [alerts, setAlerts] = useState([]);

  const players = [
    { name: "Virat Kohli", role: "BAT", team: "RCB", img: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
    { name: "Rohit Sharma", role: "BAT", team: "MI", img: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
    { name: "MS Dhoni", role: "WK", team: "CSK", img: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
    { name: "Hardik Pandya", role: "AR", team: "MI", img: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
    { name: "Ravindra Jadeja", role: "AR", team: "CSK", img: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
    { name: "Jasprit Bumrah", role: "BOWL", team: "MI", img: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
    { name: "Mohammed Shami", role: "BOWL", team: "GT", img: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
    { name: "Shubman Gill", role: "BAT", team: "GT", img: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
    { name: "Suryakumar Yadav", role: "BAT", team: "MI", img: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
    { name: "Rashid Khan", role: "BOWL", team: "GT", img: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
    { name: "Glenn Maxwell", role: "AR", team: "RCB", img: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
    { name: "KL Rahul", role: "WK", team: "LSG", img: "https://cdn-icons-png.flaticon.com/512/147/147144.png" },
    { name: "Trent Boult", role: "BOWL", team: "RR", img: "https://cdn-icons-png.flaticon.com/512/147/147144.png" }
  ];

  // MOCK PLAYING XI (simulate API)
  const playingXI = [
    "Virat Kohli",
    "Rohit Sharma",
    "MS Dhoni",
    "Hardik Pandya",
    "Ravindra Jadeja",
    "Jasprit Bumrah",
    "Shubman Gill",
    "Suryakumar Yadav",
    "Rashid Khan",
    "KL Rahul",
    "Trent Boult"
  ];

  const joinLeague = async () => {
    const res = await fetch("http://localhost:5000/join", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username, code: "IPL123" })
    });

    const data = await res.json();
    if (data.name) setJoined(true);
    else alert(data);
  };

  const togglePlayer = (player) => {
    const exists = selectedPlayers.find(p => p.name === player.name);

    if (exists) {
      setSelectedPlayers(selectedPlayers.filter(p => p.name !== player.name));
      if (captain === player.name) setCaptain(null);
      if (viceCaptain === player.name) setViceCaptain(null);
    } else {
      if (selectedPlayers.length >= 11) {
        alert("Max 11 players allowed");
        return;
      }
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const createTeam = async () => {
    if (selectedPlayers.length !== 11) {
      alert("Select exactly 11 players");
      return;
    }

    if (!captain || !viceCaptain) {
      alert("Select Captain and Vice Captain");
      return;
    }

    if (captain === viceCaptain) {
      alert("Captain and Vice Captain cannot be same");
      return;
    }

    const res = await fetch("http://localhost:5000/team", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username,
        matchId: 1,
        players: selectedPlayers,
        captain,
        viceCaptain
      })
    });

    const data = await res.text();
    alert(data);
  };

  // CHECK PLAYING XI ALERTS
  const checkPlayingXI = () => {
    const notPlaying = selectedPlayers.filter(
      p => !playingXI.includes(p.name)
    );

    if (notPlaying.length > 0) {
      setAlerts(notPlaying.map(p => p.name));
    } else {
      setAlerts([]);
    }
  };

  useEffect(() => {
    if (!joined) return;

    const interval = setInterval(async () => {
      const res = await fetch("http://localhost:5000/live/1");
      const data = await res.json();
      setLive(data);

      const lb = await fetch("http://localhost:5000/leaderboard");
      const lbData = await lb.json();
      setLeaderboard(lbData);

      const pts = await fetch("http://localhost:5000/points");
      const ptsData = await pts.json();
      setPoints(ptsData.total);

      // CHECK ALERTS
      checkPlayingXI();

    }, 5000);

    return () => clearInterval(interval);
  }, [joined, selectedPlayers]);

  return (
    <div style={{
      padding: "10px",
      fontFamily: "Arial",
      textAlign: "center",
      background: "#f5f7fb",
      minHeight: "100vh"
    }}>
      {!joined ? (
        <div>
          <h1>Join League</h1>
          <input onChange={(e) => setUsername(e.target.value)} />
          <br /><br />
          <button onClick={joinLeague}>Join</button>
        </div>
      ) : (
        <div>
          <h1>🏏 Fantasy IPL</h1>

          {/* ALERT */}
          {alerts.length > 0 && (
            <div style={{
              background: "#ffcccc",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px"
            }}>
              ⚠ Players not in Playing XI:
              {alerts.map((p, i) => (
                <div key={i}>{p}</div>
              ))}
            </div>
          )}

          <h2>Live Match</h2>
          {live && (
            <div>
              <p>{live.match}</p>
              <p>{live.status}</p>
            </div>
          )}

          <h2>Your Points: {points}</h2>

          <h2>Create Team ({selectedPlayers.length}/11)</h2>

          <div>
            {["ALL", "WK", "BAT", "AR", "BOWL"].map(f => (
              <button key={f} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "10px"
          }}>
            {players
              .filter(p => filter === "ALL" || p.role === filter)
              .map((p, i) => {
                const selected = selectedPlayers.find(sp => sp.name === p.name);

                return (
                  <div key={i} style={{
                    padding: "10px",
                    borderRadius: "12px",
                    background: selected ? "#d4f8d4" : "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}>
                    <div onClick={() => togglePlayer(p)}>
                      <img src={p.img} style={{ width: "50px", borderRadius: "50%" }} />
                      <br />
                      <b>{p.name}</b>
                      <br />
                      {p.role}
                    </div>

                    {selected && (
                      <div>
                        <button onClick={() => {
                          if (viceCaptain === p.name) {
                            alert("Already VC");
                            return;
                          }
                          setCaptain(p.name);
                        }}>
                          {captain === p.name ? "C ✅" : "C"}
                        </button>

                        <button onClick={() => {
                          if (captain === p.name) {
                            alert("Already Captain");
                            return;
                          }
                          setViceCaptain(p.name);
                        }}>
                          {viceCaptain === p.name ? "VC ✅" : "VC"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          <br />

          <button onClick={createTeam}>Submit Team</button>

          <h2>Leaderboard</h2>
          <ul>
            {leaderboard.map((u, i) => (
              <li key={i}>{i + 1}. {u.user} - {u.points}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}