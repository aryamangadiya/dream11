import express from "express"
import cors from "cors"

const app = express()

app.use(cors())

let team1 = null
let team2 = null


// IPL 2026 Schedule (extendable)

const IPL_SCHEDULE = {

"2026-04-01": ["Lucknow Super Giants","Delhi Capitals"],
"2026-04-02": ["Kolkata Knight Riders","Sunrisers Hyderabad"],
"2026-04-03": ["Chennai Super Kings","Punjab Kings"],
"2026-04-04": ["Delhi Capitals","Mumbai Indians"]

}


// Detect today's match

function detectMatch(){

const today = new Date()
.toISOString()
.split("T")[0]

const match = IPL_SCHEDULE[today]

if(match){

team1 = match[0]
team2 = match[1]

}

}

detectMatch()

setInterval(detectMatch,60000)



// Squads

const IPL_SQUADS = {

"Lucknow Super Giants":[
"KL Rahul",
"Nicholas Pooran",
"Marcus Stoinis",
"Quinton de Kock",
"Krunal Pandya",
"Deepak Hooda",
"Ravi Bishnoi",
"Avesh Khan",
"Mohsin Khan",
"Mark Wood",
"Ayush Badoni"
],

"Delhi Capitals":[
"David Warner",
"Prithvi Shaw",
"Rishabh Pant",
"Mitchell Marsh",
"Axar Patel",
"Lalit Yadav",
"Kuldeep Yadav",
"Anrich Nortje",
"Khaleel Ahmed",
"Mukesh Kumar",
"Ishant Sharma"
]

}


app.get("/match",(req,res)=>{

res.json({
team1,
team2
})

})


app.get("/squads",(req,res)=>{

if(!team1 || !team2){

return res.json([])

}

const players = [

...(IPL_SQUADS[team1] || []).map(p=>({

name:p,
team:"team1",
role:"BAT",
credits:8 + Math.random()*2

})),

...(IPL_SQUADS[team2] || []).map(p=>({

name:p,
team:"team2",
role:"BAT",
credits:8 + Math.random()*2

}))

]

res.json(players)

})


app.listen(5000,()=>{
console.log("Server running")
})
