import express from "express"
import cors from "cors"

const app = express()

app.use(cors())

let team1 = null
let team2 = null

// Today's IPL Match
async function getTodayMatch(){

try{

const res = await fetch(
"https://www.iplt20.com/api/matches"
)

const data = await res.json()

const today = new Date()
.toISOString()
.split("T")[0]

const todayMatch =
data.find(m =>
m.matchDate.startsWith(today)
)

team1 = todayMatch?.team1
team2 = todayMatch?.team2

}catch(err){

console.log("match error")

}

}

getTodayMatch()

setInterval(getTodayMatch,60000)


// Squads

app.get("/squads", async (req,res)=>{

try{

const response = await fetch(
"https://www.iplt20.com/api/players"
)

const players = await response.json()

const filtered = players.filter(p=>

p.team === team1 ||
p.team === team2

)

res.json(filtered)

}catch(err){

res.json([])

}

})



// Match

app.get("/match",(req,res)=>{

res.json({
team1,
team2
})

})



// Playing XI (after toss)

app.get("/playingXI",(req,res)=>{

res.json({
playingXI:[]
})

})



// Lock

app.get("/lock",(req,res)=>{

res.json({
locked:false
})

})


app.listen(5000,()=>{
console.log("Server running")
})
