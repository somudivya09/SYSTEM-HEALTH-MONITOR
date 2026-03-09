let cpuData=[]
let memoryData=[]
let networkData=[]
let labels=[]


let cpuChart=new Chart(document.getElementById("cpuChart"),{

type:"line",

data:{
labels:labels,
datasets:[{
label:"CPU Usage %",
data:cpuData
}]
}

})


let memoryChart=new Chart(document.getElementById("memoryChart"),{

type:"line",

data:{
labels:labels,
datasets:[{
label:"Memory Usage %",
data:memoryData
}]
}

})


let networkChart=new Chart(document.getElementById("networkChart"),{

type:"line",

data:{
labels:labels,
datasets:[{
label:"Network Usage (MB)",
data:networkData
}]
}

})


function fetchMetrics(){

fetch("/metrics")

.then(res=>res.json())

.then(data=>{

let time=new Date().toLocaleTimeString()

labels.push(time)

cpuData.push(data.cpu)
memoryData.push(data.memory)
networkData.push(data.network)


if(labels.length>10){

labels.shift()
cpuData.shift()
memoryData.shift()
networkData.shift()

}


cpuChart.update()
memoryChart.update()
networkChart.update()



document.getElementById("cpuBar").style.width=data.cpu+"%"
document.getElementById("memoryBar").style.width=data.memory+"%"
document.getElementById("diskBar").style.width=data.disk+"%"


let statusBox=document.getElementById("statusIndicator")

statusBox.className="status-box"

if(data.status==="HEALTHY"){

statusBox.classList.add("status-healthy")
statusBox.innerText="🟢 System Healthy"

}

else if(data.status==="MODERATE"){

statusBox.classList.add("status-moderate")
statusBox.innerText="🟡 Moderate Load"

}

else{

statusBox.classList.add("status-critical")
statusBox.innerText="🔴 System Critical"

}



/* processes table */

let table=document.querySelector("#processTable tbody")

table.innerHTML=""

data.processes.forEach(p=>{

let row=document.createElement("tr")

let name=document.createElement("td")
name.innerText=p.name

let cpu=document.createElement("td")
cpu.innerText=p.cpu_percent+"%"

row.appendChild(name)
row.appendChild(cpu)

table.appendChild(row)

})



/* recommendations */

let rec=document.getElementById("recommendations")

rec.innerHTML=""

data.recommendations.forEach(r=>{

let li=document.createElement("li")

li.innerText=r

rec.appendChild(li)

})

})

}

setInterval(fetchMetrics,3000)