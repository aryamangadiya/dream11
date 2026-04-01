import express from "express"
import cors from "cors"
import * as cheerio from "cheerio"

const app = express()

app.use(cors())

let team1 = null
let team2 = null


// Detect today's IPL match

async function detectMatch(){

try{

const response = await fetch(
"https://www.cricbuzz.com/cricket-schedule/series/ipl-2026",
{
headers:{
"User-Agent":"Mozilla/5.0"
}
}
)

const html = await response.text()

const $ = cheerio.load(html)

const todayMatch =
$(".cb-col-100.cb-col .cb-col-75").first().text()

if(todayMatch){

const teams =
todayMatch.split(" vs ")

team1 = teams[0]?.trim()
team2 = teams[1]?.trim()

}

}catch(err){

console.log("detect error",err)

}

}


// Run every 30 mins

setInterval(detectMatch,1800000)

detectMatch()



// Sample IPL squads (expand later)

const IPL = {

"Lucknow Super Giants":[
"KL Rahul",
"Quinton de Kock",
"Marcus Stoinis",
"Nicholas Pooran",
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



// Squads

app.get("/squads",(req,res)=>{

if(!team1 || !team2){

return res.json({
message:"Match not detected yet"
})

}

const players = [

...(IPL[team1] || []).map(p=>({
name:p,
team:"team1",
credits:8 + Math.random()*2,
role:"BAT"
})),

...(IPL[team2] || []).map(p=>({
name:p,
team:"team2",
credits:8 + Math.random()*2,
role:"BAT"
}))

]

res.json(players)

})



app.get("/match",(req,res)=>{

res.json({
team1,
team2
})

})


app.listen(5000,()=>{
console.log("Server running")
})
