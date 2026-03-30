import { useEffect, useState } from "react";

export default function App() {

const BACKEND = "https://dream11-hflf.onrender.com";

const [match,setMatch] = useState(null)
const [players,setPlayers] = useState([])
const [selected,setSelected] = useState([])
const [role,setRole] = useState("ALL")
const [playingXI,setPlayingXI] = useState([])
const [locked,setLocked] = useState(false)


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

}else{

if(selected.length>=11){
alert("Only 11 players allowed")
return
}

setSelected([...selected,player])

}

}


// Role Filter

const filtered = players.filter(p=>{

if(role==="ALL") return true

return p.role === role

})


// Image

const getImg = (id)=>{

return `https://static.cricbuzz.com/a/img/v1/72x72/i1/c${id}/player.jpg`

}


// Team Count

const team1Count =
selected.filter(p=>
p.teamId===match?.matchInfo?.team1?.teamId
).length

const team2Count =
selected.filter(p=>
p.teamId===match?.matchInfo?.team2?.teamId
).length



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

{match && (

<div
style={{
background:"#333",
color:"white",
padding:"10px",
borderRadius:"8px",
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
Players  
{selected.length}/11
</div>

<div>
{match.matchInfo.team1.teamSName}
{team1Count}
:
{team2Count}
{match.matchInfo.team2.teamSName}
</div>

</div>

</div>

)}


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

{filtered.map((p,i)=>{

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
padding:"10px",
borderRadius:"8px",
display:"flex",
alignItems:"center",
justifyContent:"space-between"
}}
>

<div
style={{
display:"flex",
alignItems:"center"
}}
>

<img
src={getImg(p.imageId)}
style={{
width:"50px",
borderRadius:"50%",
marginRight:"10px"
}}
/>

<div>

<div>
<b>{p.name}</b>
</div>

{isPlaying && (
<div
style={{
color:"green",
fontSize:"12px"
}}
>
Announced
</div>
)}

</div>

</div>


<button

onClick={()=>togglePlayer(p)}

style={{
background:isSelected?"red":"green",
color:"white",
border:"none",
padding:"8px",
borderRadius:"50%"
}}

>

{isSelected?"-":"+"}

</button>


</div>

)

})}



{/* Lock */}

{locked && (

<div
style={{
position:"fixed",
bottom:"10px",
left:"10px",
right:"10px",
background:"red",
color:"white",
padding:"10px",
textAlign:"center",
borderRadius:"8px"
}}
>

Teams Locked

</div>

)}



</div>

)

}
