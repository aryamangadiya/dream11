import { useEffect, useState } from "react";

export default function App() {

const BACKEND = "https://dream11-hflf.onrender.com";

const [match,setMatch] = useState(null)
const [players,setPlayers] = useState([])
const [selected,setSelected] = useState([])
const [role,setRole] = useState("ALL")
const [credits,setCredits] = useState(100)


// Get Match

useEffect(()=>{

fetch(`${BACKEND}/match`)
.then(res=>res.json())
.then(data=>setMatch(data))

},[])


// Get Players

useEffect(()=>{

fetch(`${BACKEND}/matchDetails`)
.then(res=>res.json())
.then(data=>{

console.log("DATA",data)

const players =
data?.matchHeader?.players || []

const formatted = players.map(p=>({

id:p.id,
name:p.name,
imageId:p.faceImageId,
team:p.teamId,
role:p.role || "BAT",
credits:8 + Math.random()*2

}))

setPlayers(formatted)

})

},[])



// Select Player

const togglePlayer = (player)=>{

const exists = selected.find(p=>p.id===player.id)

if(exists){

setSelected(selected.filter(p=>p.id!==player.id))
setCredits(credits + player.credits)

}else{

if(selected.length>=11){
alert("Max 11 players")
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


// Filter

const filtered = players.filter(p=>{

if(role==="ALL") return true
return p.role===role

})


// Image

const getImg = (player)=>{

if(player.imageId){
return `https://static.cricbuzz.com/a/img/v1/152x152/i1/c${player.imageId}/player_face.jpg`
}

return `https://ui-avatars.com/api/?name=${player.name}`

}



return(

<div style={{
padding:"10px",
background:"#f0f2f5",
minHeight:"100vh"
}}>


{/* Header */}

<div style={{
background:"#333",
color:"white",
padding:"10px",
borderRadius:"10px",
marginBottom:"10px"
}}>

Players {selected.length}/11  
Credits {credits.toFixed(1)}

</div>


{/* Tabs */}

<div style={{
display:"flex",
justifyContent:"space-around",
background:"white",
padding:"10px",
borderRadius:"10px",
marginBottom:"10px"
}}>

{["ALL","WK","BAT","AR","BOWL"].map(r=>(
<button
key={r}
onClick={()=>setRole(r)}
>
{r}
</button>
))}

</div>



{/* Players */}

{filtered.map((p,i)=>(

<div
key={i}
style={{
background:"white",
padding:"10px",
marginBottom:"8px",
borderRadius:"10px",
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}
>

<div style={{display:"flex"}}>

<img
src={getImg(p)}
style={{
width:"40px",
height:"40px",
borderRadius:"50%",
marginRight:"10px"
}}
/>

<div>

<div>{p.name}</div>
<div>{p.role}</div>

</div>

</div>


<button
onClick={()=>togglePlayer(p)}
>
+
</button>

</div>

))}


</div>

)

}
