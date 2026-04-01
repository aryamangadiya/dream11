import express from "express"
import cors from "cors"

const app = express()

app.use(cors())

let team1 = null
let team2 = null
let locked = false


// IPL Schedule

const IPL_SCHEDULE = {

"2026-04-01": ["Lucknow Super Giants","Delhi Capitals"],
"2026-04-02": ["Kolkata Knight Riders","Sunrisers Hyderabad"],
"2026-04-03": ["Chennai Super Kings","Punjab Kings"]

}


// Detect Match

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


// Squads + Roles

const IPL_SQUADS = {

"Lucknow Super Giants":[

{name:"KL Rahul",role:"WK"},
{name:"Nicholas Pooran",role:"WK"},
{name:"Marcus Stoinis",role:"AR"},
{name:"Quinton de Kock",role:"WK"},
{name:"Krunal Pandya",role:"AR"},
{name:"Deepak Hooda",role:"AR"},
{name:"Ravi Bishnoi",role:"BOWL"},
{name:"Avesh Khan",role:"BOWL"},
{name:"Mohsin Khan",role:"BOWL"},
{name:"Mark Wood",role:"BOWL"},
{name:"Ayush Badoni",role:"BAT"}

],

"Delhi Capitals":[

{name:"David Warner",role:"BAT"},
{name:"Prithvi Shaw",role:"BAT"},
{name:"Rishabh Pant",role:"WK"},
{name:"Mitchell Marsh",role:"AR"},
{name:"Axar Patel",role:"AR"},
{name:"Lalit Yadav",role:"AR"},
{name:"Kuldeep Yadav",role:"BOWL"},
{name:"Anrich Nortje",role:"BOWL"},
{name:"Khaleel Ahmed",role:"BOWL"},
{name:"Mukesh Kumar",role:"BOWL"},
{name:"Ishant Sharma",role:"BOWL"}

]

}



// Match

app.get("/match",(req,res)=>{

res.json({
team1,
team2
})

})



// Squads

app.get("/squads",(req,res)=>{

if(!team1 || !team2){

return res.json([])

}

const players = [

...(IPL_SQUADS[team1] || []).map(p=>({
...p,
team:"team1"
})),

...(IPL_SQUADS[team2] || []).map(p=>({
...p,
team:"team2"
}))

]

res.json(players)

})



// Playing XI (after toss placeholder)

app.get("/playingXI",(req,res)=>{

res.json({
playingXI:[]
})

})



// Lock after first ball

app.get("/lock",(req,res)=>{

res.json({
locked
})

})



app.listen(5000,()=>{
console.log("Server running")
})
