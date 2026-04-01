import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

// IPL Match ID (Change automatically later)
const MATCH_ID = 149640


// Match Info
app.get("/match", async (req,res)=>{

try{

const response = await fetch(
`https://www.cricbuzz.com/api/cricket-match-squads/${MATCH_ID}`,
{
headers:{
"User-Agent":"Mozilla/5.0"
}
})

const data = await response.json()

res.json(data)

}catch(err){

res.json({
error:"failed"
})

}

})



// Squads
app.get("/squads", async (req,res)=>{

try{

const response = await fetch(
`https://www.cricbuzz.com/api/cricket-match-squads/${MATCH_ID}`,
{
headers:{
"User-Agent":"Mozilla/5.0"
}
})

const data = await response.json()

res.json(data)

}catch(err){

res.json({
error:"failed squads"
})

}

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
