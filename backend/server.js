import express from "express"
import cors from "cors"
import * as cheerio from "cheerio"

const app = express()

app.use(cors())

let MATCH_ID = null


// Auto detect today's IPL match

async function getTodayMatch(){

try{

const response = await fetch(
"https://www.cricbuzz.com/api/html/matches-menu",
{
headers:{
"User-Agent":"Mozilla/5.0"
}
}
)

const data = await response.json()

for(const type of data.matches){

for(const series of type.seriesMatches || []){

if(series.seriesName?.includes("Indian Premier League")){

const match =
series.seriesAdWrapper?.matches?.[0]

MATCH_ID =
match?.matchInfo?.matchId

return

}

}

}

}catch(err){

console.log("match detect failed")

}

}


// Call once at startup
getTodayMatch()


// Root
app.get("/",(req,res)=>{

res.send("Dream11 Backend Running")

})



// Squads

app.get("/squads", async (req,res)=>{

try{

if(!MATCH_ID){

await getTodayMatch()

}

const response = await fetch(
`https://www.cricbuzz.com/cricket-match-squads/${MATCH_ID}`,
{
headers:{
"User-Agent":"Mozilla/5.0"
}
}
)

const html = await response.text()

const $ = cheerio.load(html)

const players = []

$(".cb-col-50").each((i,team)=>{

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
console.log("Server running")
})
