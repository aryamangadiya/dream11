import { useEffect,useState } from "react"

export default function App(){

const BACKEND =
"https://dream11-hflf.onrender.com"

const [players,setPlayers] = useState([])
const [selected,setSelected] = useState([])
const [role,setRole] = useState("ALL")

const [credits,setCredits] = useState(100)


// Fetch Squads

useEffect(()=>{

fetch(`${BACKEND}/squads`)
.then(res=>res.json())
.then(data=>{

console.log(data)

const team1 =
data?.team1?.players || []

const team2 =
data?.team2?.players || []

const formatted = [

...team1.map(p=>({

id:p.id,
name:p.name,
image:p.faceImageId,
role:p.role || "BAT",
team:"team1",
credits:8 + Math.random()*2

})),

...team2.map(p=>({

id:p.id,
name:p.name,
image:p.faceImageId,
role:p.role || "BAT",
team:"team2",
credits:8 + Math.random()*2

}))

]

setPlayers(formatted)

})

},[])


// Image

const getImg = (id)=>{

return
`https://static.cricbuzz.com/a/img/v1/72x72/i1/c${id}/player_face.jpg`

}



// Select

const toggle = (p)=>{

const exists =
selected.find(x=>x.id===p.id)

if(exists){

setSelected(
selected.filter(x=>x.id!==p.id)
)

setCredits(credits + p.credits)

}else{

if(selected.length>=11){
alert("Only 11 players")
return
}

if(credits < p.credits){
alert("No credits")
return
}

setSelected([...selected,p])
setCredits(credits - p.credits)

}

}



// Filter

const filtered =
players.filter(p=>{

if(role==="ALL")
return true

return p.role===role

})



return(

<div
style={{
padding:"10px",
background:"#f5f5f5",
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

</div>



{/* Tabs */}

<div
style={{
display:"flex",
justifyContent:"space-around",
background:"white",
padding:"10px",
borderRadius:"10px",
marginBottom:"10px"
}}
>

{["ALL","WK","BAT","AR","BOWL"]
.map(r=>(
<button
onClick={()=>setRole(r)}
style={{
padding:"8px",
background:
role===r
?"#0f9d58"
:"white",
color:
role===r
?"white"
:"black",
border:"1px solid #ccc",
borderRadius:"5px"
}}
>
{r}
</button>
))}

</div>



{/* Players */}

{filtered.map(p=>(

<div
style={{
background:"white",
padding:"12px",
marginBottom:"8px",
borderRadius:"10px",
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}
>

<div
style={{
display:"flex",
alignItems:"center"
}}
>

<img
src={getImg(p.image)}
style={{
width:"45px",
height:"45px",
borderRadius:"50%",
marginRight:"10px"
}}
/>

<div>

<div
style={{
fontWeight:"600"
}}
>
{p.name}
</div>

<div
style={{
fontSize:"12px",
color:"#777"
}}
>
{p.role}
</div>

</div>

</div>



<button
onClick={()=>toggle(p)}
style={{
background:"#00a650",
color:"white",
border:"none",
width:"32px",
height:"32px",
borderRadius:"50%"
}}
>

+

</button>

</div>

))}



{/* Bottom */}

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
style={{
flex:1,
padding:"12px",
background:"#0f9d58",
color:"white",
border:"none",
borderRadius:"8px"
}}
>
Preview Team
</button>

<button
style={{
flex:1,
padding:"12px",
background:"gray",
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
