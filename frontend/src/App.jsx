import { useEffect, useState } from "react";

export default function App() {

const BACKEND = "https://dream11-hflf.onrender.com";

const [match,setMatch] = useState(null)
const [players,setPlayers] = useState([])
const [selected,setSelected] = useState([])
const [role,setRole] = useState("ALL")
const [playingXI,setPlayingXI] = useState([])
const [locked,setLocked] = useState(false)

const [credits,setCredits] = useState(100)

const [captain,setCaptain] = useState(null)
const [viceCaptain,setViceCaptain] = useState(null)

const [showFormation,setShowFormation] = useState(false)


// Match
useEffect(()=>{

fetch(`${BACKEND}/match`)
.then(res=>res.json())
.then(data=>setMatch(data))

},[])


// Squad
useEffect(() => {

fetch(`${BACKEND}/matchDetails`)
.then(res => res.json())
.then(data => {

const team1 =
data?.matchHeader?.team1?.players || []

const team2 =
data?.matchHeader?.team2?.players || []

const formatted = [

...team1.map(p=>({
id:p.id,
name:p.name,
imageId:p.faceImageId,
team:"team1",
role:p.role
})),

...team2.map(p=>({
id:p.id,
name:p.name,
imageId:p.faceImageId,
team:"team2",
role:p.role
}))

]

setPlayers(formatted)

})

},[])

// Playing XI

useEffect(()=>{

const interval = setInterval(()=>{

fetch(`${BACKEND}/playingXI`)
.then(res=>res.json())
.then(data=>{

const xi =
data?.matchHeader?.players || []

setPlayingXI(xi)

})

},10000)

return ()=>clearInterval(interval)

},[])


// Lock

useEffect(()=>{

const interval = setInterval(()=>{

fetch(`${BACKEND}/lock`)
.then(res=>res.json())
.then(data=>setLocked(data.locked))

},5000)

return ()=>clearInterval(interval)

},[])



// Select Player

const togglePlayer = (player)=>{

if(locked) return

const exists = selected.find(p=>p.id===player.id)

if(exists){

setSelected(
selected.filter(p=>p.id!==player.id)
)

setCredits(credits + player.credits)

}else{

if(selected.length>=11){
alert("Only 11 players allowed")
return
}

if(credits < player.credits){
alert("Not enough credits")
return
}

setSelected([...selected,player])
setCredits(credits - player.credits)

}

}


// Role Filter

const filtered = players.filter(p=>{

if(role==="ALL") return true

return p.role === role

})


// Image

const getImg = (id) => {

if(!id)
return "https://cdn-icons-png.flaticon.com/512/149/149071.png"

return `https://static.cricbuzz.com/a/img/v1/152x152/i1/c${id}/player_face.jpg`

}


// Team Count

const team1Count =
selected.filter(p=>p.team==="team1").length

const team2Count =
selected.filter(p=>p.team==="team2").length



// Formation

const wk = selected.filter(p=>p.role==="WK")
const bat = selected.filter(p=>p.role==="BAT")
const ar = selected.filter(p=>p.role==="AR")
const bowl = selected.filter(p=>p.role==="BOWL")



return(

<div
style={{
padding:"10px",
fontFamily:"Arial",
background:"#f0f2f5",
minHeight:"100vh"
}}
>


{/* Header */}

<div
style={{
background:"#333",
color:"white",
padding:"12px",
borderRadius:"10px",
marginBottom:"10px"
}}
>

<div
style={{
display:"flex",
justifyContent:"space-between"
}}
>

<div>
Players {selected.length}/11
</div>

<div>
Credits {credits.toFixed(1)}
</div>

</div>


{match && (

<div
style={{
textAlign:"center",
marginTop:"5px"
}}
>

{match.matchInfo.team1.teamSName}
{" "}
{team1Count}
:
{team2Count}
{" "}
{match.matchInfo.team2.teamSName}

</div>

)}

</div>


{/* Role Tabs */}

<div
style={{
display:"flex",
justifyContent:"space-around",
background:"white",
padding:"10px",
borderRadius:"8px",
marginBottom:"10px"
}}
>

{["ALL","WK","BAT","AR","BOWL"].map(r=>(
<button
key={r}
onClick={()=>setRole(r)}
style={{
padding:"8px",
background:role===r?"#0f9d58":"white",
color:role===r?"white":"black",
border:"1px solid #ddd",
borderRadius:"5px"
}}
>
{r}
</button>
))}

</div>



{/* Player List */}

{!showFormation && filtered.map((p,i)=>{

const isSelected =
selected.find(s=>s.id===p.id)

const isPlaying =
playingXI.find(x=>x.id===p.id)

return(

<div
key={i}
style={{
background:"white",
marginBottom:"8px",
padding:"12px",
borderRadius:"12px",
display:"flex",
alignItems:"center",
justifyContent:"space-between",
boxShadow:"0 2px 6px rgba(0,0,0,0.1)"
}}
>

<div style={{display:"flex",alignItems:"center"}}>

<img
src={getImg(p.imageId)}
style={{
width:"50px",
height:"50px",
borderRadius:"50%",
marginRight:"12px"
}}
/>

<div>

<div style={{fontWeight:"600"}}>
{p.name}
</div>

<div style={{
fontSize:"12px",
color:"#888"
}}>
{p.role} • {p.credits.toFixed(1)}
</div>

{isPlaying && (
<div style={{color:"green",fontSize:"12px"}}>
Playing XI
</div>
)}

</div>

</div>


<button

onClick={()=>togglePlayer(p)}

style={{
background:isSelected?"#ff4d4f":"#00a650",
color:"white",
border:"none",
width:"32px",
height:"32px",
borderRadius:"50%",
fontSize:"18px",
cursor:"pointer"
}}

>

{isSelected?"−":"+"}

</button>

</div>

)

})}



{/* Formation Screen */}

{showFormation && (

<div
style={{
background:"green",
padding:"20px",
borderRadius:"12px",
color:"white"
}}
>

<h3>Wicket Keepers</h3>
<div>{wk.map(p=>p.name)}</div>

<h3>Batters</h3>
<div>{bat.map(p=>p.name)}</div>

<h3>All Rounders</h3>
<div>{ar.map(p=>p.name)}</div>

<h3>Bowlers</h3>
<div>{bowl.map(p=>p.name)}</div>

</div>

)}



{/* Buttons */}

<div
style={{
position:"fixed",
bottom:"10px",
left:"10px",
right:"10px",
display:"flex",
gap:"10px"
}}
>

<button
onClick={()=>setShowFormation(!showFormation)}
style={{
flex:1,
padding:"12px",
background:"#0f9d58",
color:"white",
border:"none",
borderRadius:"8px"
}}
>

{showFormation?"Back":"Preview Team"}

</button>


<button

disabled={selected.length!==11}

onClick={()=>alert("Select Captain")}

style={{
flex:1,
padding:"12px",
background:selected.length===11?"#333":"gray",
color:"white",
border:"none",
borderRadius:"8px"
}}
>

Continue

</button>

</div>



</div>

)

}
