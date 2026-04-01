import express from "express"
import cors from "cors"

const app = express()

app.use(cors())

// IPL 2026 schedule

const SCHEDULE = {
"2026-04-01": {
matchId:"69832136",
team1:"LSG",
team2:"DC"
},
"2026-04-02": {
matchId:"69832138",
team1:"KKR",
team2:"SRH"
}
}


function getToday(){

const today = new Date()
.toISOString()
.split("T")[0]

return SCHEDULE[today]

}



// Match

app.get("/match",(req,res)=>{

res.json(getToday())

})



// Squads (placeholder — next step real squads)

app.get("/squads",(req,res)=>{

const match = getToday()

if(!match) return res.json([])

res.json({
team1:match.team1,
team2:match.team2
})

})



// Live

app.get("/live",(req,res)=>{

res.json(getToday())

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
