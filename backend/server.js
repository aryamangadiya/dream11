import express from "express"
import cors from "cors"
import cheerio from "cheerio"

const app = express()

app.use(cors())

// Match ID (RR vs CSK today)
const MATCH_ID = 149640


// Squads

app.get("/squads", async (req,res)=>{

try{

const response = await fetch(
`https://www.cricbuzz.com/cricket-match-squads/${MATCH_ID}`
)

const html = await response.text()

const $ = cheerio.load(html)

const players = []

$(".cb-col.cb-col-50").each((i,team)=>{

$(team).find(".cb-player-card-name").each((j,p)=>{

players.push({

name:$(p).text().trim(),
role:"BAT",
team:i===0?"team1":"team2",
credits:8 + Math.random()*2

})

})

})

res.json(players)

}catch(err){

res.json({
error:"failed squads"
})

}

})



app.listen(5000,()=>{
console.log("server running")
})
