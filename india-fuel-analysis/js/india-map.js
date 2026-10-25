(function () {
 "use strict";
 // Positions are normalized to the supplied India outline image; city coordinates are approximate map-image placements.
 const cities=[
 {name:"Delhi",x:27,y:20,lat:28.6139,lon:77.2090,aliases:["delhi","new delhi"]},
 {name:"Mumbai",x:19,y:53,lat:19.0760,lon:72.8777,aliases:["mumbai","bombay"]},
 {name:"Pune",x:24,y:55,lat:18.5204,lon:73.8567,aliases:["pune"]},
 {name:"Hyderabad",x:43,y:62,lat:17.3850,lon:78.4867,aliases:["hyderabad","secunderabad"]},
 {name:"Bengaluru",x:36,y:77,lat:12.9716,lon:77.5946,aliases:["bengaluru","bangalore"]},
 {name:"Chennai",x:47,y:77,lat:13.0827,lon:80.2707,aliases:["chennai","madras"]},
 {name:"Kolkata",x:77,y:46,lat:22.5726,lon:88.3639,aliases:["kolkata","calcutta"]},
 {name:"Ahmedabad",x:17,y:45,lat:23.0225,lon:72.5714,aliases:["ahmedabad"]},
 {name:"Jaipur",x:27,y:33,lat:26.9124,lon:75.7873,aliases:["jaipur"]},
 {name:"Lucknow",x:48,y:33,lat:26.8467,lon:80.9462,aliases:["lucknow"]},
 {name:"Kochi",x:33,y:88,lat:9.9312,lon:76.2673,aliases:["kochi","cochin"]},
 {name:"Bhopal",x:38,y:48,lat:23.2599,lon:77.4126,aliases:["bhopal"]},
 {name:"Nagpur",x:47,y:53,lat:21.1458,lon:79.0882,aliases:["nagpur"]},
 {name:"Visakhapatnam",x:59,y:61,lat:17.6868,lon:83.2185,aliases:["visakhapatnam","vizag"]},
 {name:"Chandigarh",x:27,y:17,lat:30.7333,lon:76.7794,aliases:["chandigarh"]},
 {name:"Surat",x:21,y:50,lat:21.1702,lon:72.8311,aliases:["surat"]}
 ];
 // Stable illustrative demo values only for cities with no saved city-linked records; these are not real measurements.
 const demoLitres=[428.6,612.4,284.9,536.2,391.7,475.3,702.8,318.5,249.6,366.1,197.4,288.8,344.7,231.5,175.9,407.2];
 function records(){try{return window.FuelStore?.getRecords?.()||JSON.parse(localStorage.getItem("fuel_records_v1")||"[]")}catch(_){return[]}}
 function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
 function render(){
  const group=document.getElementById("indiaFuelMarkers"),tooltip=document.getElementById("indiaMapTooltip"),summary=document.getElementById("indiaCitySummary");
  if(!group||!tooltip||!summary)return;
  const all=records();
  const data=cities.map((city,i)=>{
    const hits=all.filter(r=>{
      const savedCity=String(r.city||"").trim().toLowerCase();
      if(savedCity) return savedCity===city.name.toLowerCase() || city.aliases.includes(savedCity);
      const n=String(r.notes||"").toLowerCase();
      return city.aliases.some(a=>new RegExp("(^|[^a-z])"+a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"([^a-z]|$)","i").test(n));
    });
    const actual=hits.reduce((s,r)=>s+(Number(r.litres)||0),0);
    return {...city,litres:hits.length?actual:demoLitres[i],count:hits.length,isDemo:hits.length===0};
  });
  const max=Math.max(1,...data.map(c=>c.litres));
  group.innerHTML=data.map(c=>{
    const size=8+(c.litres/max)*7;
    return `<button type="button" class="fuel-city-marker ${c.isDemo?"demo-data":"has-data"}" style="left:${c.x}%;top:${c.y}%" aria-label="${escapeHtml(c.name)}: ${c.litres.toFixed(1)} litres${c.isDemo?", illustrative demo value":", recorded"}" data-city="${escapeHtml(c.name)}"><span class="marker-halo" style="opacity:.85;width:${size*3}px;height:${size*3}px"></span><span class="marker-core" style="width:${size}px;height:${size}px"></span><span class="marker-label">${escapeHtml(c.name)}</span></button>`;
  }).join("");
  function show(c){
    tooltip.innerHTML=`<strong>${escapeHtml(c.name)}</strong><span>${c.litres.toLocaleString("en-IN",{maximumFractionDigits:2})} L fuel consumed</span><small>${c.isDemo?"Illustrative demo value — no city-linked records yet":`${c.count} linked record${c.count===1?"":"s"}`}</small>`;
    tooltip.classList.add("is-visible");
    group.querySelectorAll(".fuel-city-marker").forEach(el=>el.classList.toggle("is-active",el.dataset.city===c.name));
  }
  data.forEach(c=>{const m=group.querySelector(`[data-city="${c.name}"]`);m.addEventListener("mouseenter",()=>show(c));m.addEventListener("focus",()=>show(c));m.addEventListener("click",()=>show(c))});
  summary.innerHTML=[...data].sort((a,b)=>b.litres-a.litres).slice(0,4).map(c=>`<div class="city-summary-item"><span class="city-summary-dot ${c.isDemo?"demo-data":"has-data"}"></span><span>${escapeHtml(c.name)}${c.isDemo?' <small class="demo-tag">DEMO</small>':""}</span><strong>${c.litres.toLocaleString("en-IN",{maximumFractionDigits:2})} L</strong></div>`).join("");
  const actualCities=data.filter(c=>!c.isDemo).length;
  const foot=document.getElementById("indiaMapFootnote");
  if(foot)foot.textContent=`${actualCities} cities have saved city-linked records. Other city totals are illustrative demo values and are replaced automatically when you add records for those cities.`;
 }
 window.addEventListener("DOMContentLoaded",render);
 window.addEventListener("storage",render);
 window.addEventListener("fuel-records-updated",render);
 document.addEventListener("click",e=>{if(e.target.closest("[data-nav-target='overview'],[data-page='overview']"))setTimeout(render,80)});
 window.renderIndiaFuelMap=render;
})();