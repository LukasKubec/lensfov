(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function r(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(t){if(t.ep)return;t.ep=!0;const a=r(t);fetch(t.href,a)}})();const V=[{id:"full-frame",label:"Full Frame (36 x 24 mm)",width:36,height:24},{id:"aps-c",label:"APS-C (23.6 x 15.7 mm)",width:23.6,height:15.7},{id:"custom",label:"Custom sensor...",width:0,height:0,isCustom:!0}],X=[{id:"people",label:"People (~0.55 m)",widthMeters:.55,singular:"person",plural:"people",icon:`
      <svg class="subject-icon" viewBox="0 0 24 48" aria-hidden="true">
        <circle cx="12" cy="8" r="6" fill="currentColor" />
        <path d="M12 18c5 0 9 4 9 9v9h-5v-9c0-2.2-1.8-4-4-4s-4 1.8-4 4v9H3v-9c0-5 4-9 9-9z" fill="currentColor" />
        <path d="M7 45l2-12h6l2 12H7z" fill="currentColor" />
      </svg>
    `},{id:"car",label:"Car (~1.9 m)",widthMeters:1.9,singular:"car",plural:"cars",icon:`
      <svg class="subject-icon" viewBox="0 0 64 36" aria-hidden="true">
        <path d="M10 18l6-8c1.2-1.6 3-2.5 5-2.5h22c2 0 3.8 0.9 5 2.5l6 8z" fill="currentColor" />
        <rect x="6" y="18" width="52" height="10" rx="4" fill="currentColor" />
        <circle cx="20" cy="28" r="4" fill="#ffffff" />
        <circle cx="44" cy="28" r="4" fill="#ffffff" />
      </svg>
    `},{id:"yoda",label:"Yoda (~0.45 m)",widthMeters:.45,singular:"Yoda",plural:"Yodas",icon:`
      <svg class="subject-icon" viewBox="0 0 48 40" aria-hidden="true">
        <path d="M6 16l-6-6 10-4 8 4 6-4 6 4 8-4 10 4-6 6" opacity="0.75" fill="currentColor" />
        <path d="M12 18c0 8 6 14 12 14s12-6 12-14z" fill="currentColor" />
        <rect x="18" y="26" width="12" height="10" fill="currentColor" />
      </svg>
    `},{id:"banana",label:"Banana (~0.18 m)",widthMeters:.18,singular:"banana",plural:"bananas",icon:`
      <svg class="subject-icon" viewBox="0 0 48 32" aria-hidden="true">
        <path d="M6 6c2 14 16 23 32 24-3 3-7 4-11 4C16 34 7 27 6 14z" fill="currentColor" />
      </svg>
    `},{id:"soccer-field",label:"Soccer / football field (~68 m)",widthMeters:68,singular:"field",plural:"fields",icon:`
      <svg class="subject-icon" viewBox="0 0 80 40" aria-hidden="true">
        <rect x="4" y="4" width="72" height="32" rx="4" ry="4" fill="none" stroke="currentColor" stroke-width="4" />
        <line x1="40" y1="4" x2="40" y2="36" stroke="currentColor" stroke-width="2" />
        <circle cx="40" cy="20" r="7" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>
    `}],l=document.querySelector("#app");if(!l)throw new Error("Application root element not found");l.innerHTML=`
  <div class="layout">
    <header>
      <h1>Angle of View Calculator</h1>
      <p class="intro">
        Enter one or more focal lengths (e.g. <code>35mm, 50</code>) to compare their angles of view for the selected sensor size.
      </p>
    </header>

    <form class="controls" id="calculator-form">
      <label for="focal-input">Focal length (mm)</label>
      <input
        id="focal-input"
        name="focal-input"
        type="text"
        placeholder="35, 50, 85mm"
        autocomplete="off"
      />

      <fieldset class="sensor-options">
        <legend>Sensor format</legend>
        <div class="sensor-options-grid">
          ${V.map((e,s)=>`
              <label class="sensor-option">
                <input
                  type="radio"
                  name="sensor-option"
                  value="${e.id}"
                  ${s===0?"checked":""}
                />
                <span>${e.label.replace(" ","<br />")}</span>
              </label>
            `).join("")}
        </div>
        <div id="custom-sensor" class="custom-sensor" hidden>
         <div>
           <label for="sensor-width">Sensor width (mm)</label>
           <input id="sensor-width" name="sensor-width" type="number" min="1" step="0.1" />
         </div>
        <div>
          <label for="sensor-height">Sensor height (mm)</label>
          <input id="sensor-height" name="sensor-height" type="number" min="1" step="0.1" />
        </div>
      </div>
      </fieldset>

      <label for="distance-input">Subject distance (m)</label>
      <input
        id="distance-input"
        name="distance-input"
        type="number"
        min="0.5"
        step="0.5"
        value="10"
      />

      <label for="subject-select">Subject type</label>
      <select id="subject-select" name="subject-select">
        ${X.map(e=>`<option value="${e.id}">${e.label}</option>`).join("")}
      </select>



      <button type="submit">Calculate</button>
      <p class="note">Values update automatically; the button is there for keyboard users.</p>
    </form>

    <section class="messages" id="messages" aria-live="polite"></section>

    <section class="overlay-hero" id="overlay-hero" >
      <h2>Layered field of view</h2>
      <p class="overlay-copy">See how focal lengths overlap and how many subjects fit across the frame at the chosen distance.</p>
      <div id="chart-overlay" class="overlay" role="img" aria-label="Layered angle of view comparison"></div>
    </section>

    <section class="results" id="results"></section>

    <section class="visualisation" id="visualisation">
      <h2>Field of view comparison</h2>
      <div class="visual-panels">
        <div class="panel">
          <h3>Relative width</h3>
          <div id="chart-bars" class="chart" role="img" aria-label="Field of view bar chart"></div>
        </div>
      </div>
    </section>
  </div>
`;const ne=l.querySelector("#calculator-form"),D=l.querySelector("#focal-input"),L=Array.from(l.querySelectorAll('input[name="sensor-option"]')),N=l.querySelector("#custom-sensor"),k=l.querySelector("#sensor-width"),q=l.querySelector("#sensor-height"),Y=l.querySelector("#distance-input"),W=l.querySelector("#subject-select"),F=l.querySelector("#results"),le=l.querySelector("#messages"),O=l.querySelector("#chart-bars"),R=l.querySelector("#chart-overlay"),T=l.querySelector("#overlay-hero"),B=l.querySelector("#visualisation");if(!ne||!D||L.length===0||!N||!k||!q||!Y||!W||!F||!le||!O||!R||!T||!B)throw new Error("Calculator UI failed to initialise");const ge=180/Math.PI,be=e=>{const s=e.split(/[\s,;]+/).map(t=>t.trim()).filter(Boolean);if(s.length===0)return{values:[],invalidTokens:[]};const r=new Set,o=[];return s.forEach(t=>{const a=t.replace(/mm$/i,""),i=Number.parseFloat(a);if(!Number.isFinite(i)||i<=0){o.push(t);return}r.add(Math.round(i*10)/10)}),{values:Array.from(r).sort((t,a)=>t-a),invalidTokens:o}},E=e=>e*ge,ye=(e,s,r)=>{const o=E(2*Math.atan(s/(2*e))),t=E(2*Math.atan(r/(2*e))),a=E(2*Math.atan(Math.sqrt(s**2+r**2)/(2*e)));return{focal:e,horizontal:o,vertical:t,diagonal:a}},Me=()=>{const e=L.find(t=>t.checked)?.value,s=V.find(t=>t.id===e);if(!s)return null;if(!s.isCustom)return{width:s.width,height:s.height};const r=Number.parseFloat(k.value),o=Number.parseFloat(q.value);return!Number.isFinite(r)||r<=0||!Number.isFinite(o)||o<=0?null:{width:r,height:o}},$e=()=>X.find(s=>s.id===W.value)??null,p=e=>`${e.toFixed(1)} deg`,ee=e=>e.length>0?e[0].toUpperCase()+e.slice(1):e,xe=(e,s,r,o,t)=>{const a=[];r||a.push("Add at least one focal length to see the results."),e.length>0&&a.push(`Could not parse: ${e.join(", ")}`),s||a.push("Set a valid sensor size for calculations."),o||a.push("Enter a valid subject distance in meters."),t||a.push("Select a subject type."),le.innerHTML=a.length?`<p>${a.join(" ")}</p>`:""},te=(e,s)=>e<=0?`0 ${s.plural}`:e===1?`1 ${s.singular}`:`${e} ${s.plural}`,se=(e,s)=>{if(e.length===0){F.innerHTML="",F.hidden=!0,B.hidden=!0,T.hidden=!0;return}F.hidden=!1,B.hidden=!1,T.hidden=!1;const r=e.map(t=>`
        <tr>
          <th scope="row">${t.focal.toFixed(1)} mm</th>
          <td>${p(t.horizontal)}</td>
          <td>${p(t.vertical)}</td>
          <td>${p(t.diagonal)}</td>
          <td>${te(t.subjectsAcross,s)}</td>
        </tr>
      `).join(""),o=e.map(t=>`
        <article class="result-card">
          <header>
            <h3>${t.focal.toFixed(1)} mm</h3>
          </header>
          <dl>
            <div>
              <dt>Horizontal</dt>
              <dd>${p(t.horizontal)}</dd>
            </div>
            <div>
              <dt>Vertical</dt>
              <dd>${p(t.vertical)}</dd>
            </div>
            <div>
              <dt>Diagonal</dt>
              <dd>${p(t.diagonal)}</dd>
            </div>
            <div>
              <dt>${ee(s.plural)}</dt>
              <dd>${te(t.subjectsAcross,s)}</dd>
            </div>
          </dl>
        </article>
      `).join("");F.innerHTML=`
    <div class="results-table">
      <table>
        <thead>
          <tr>
            <th scope="col">Focal length</th>
            <th scope="col">Horizontal</th>
            <th scope="col">Vertical</th>
            <th scope="col">Diagonal</th>
            <th scope="col">${ee(s.plural)} across</th>
          </tr>
        </thead>
        <tbody>
          ${r}
        </tbody>
      </table>
    </div>
    <div class="results-cards">${o}</div>
  `},ae=e=>{if(e.length===0){O.innerHTML="";return}const s=Math.max(...e.map(o=>o.horizontal)),r=e.map(o=>{const t=o.horizontal/s*100;return`
        <div class="bar">
          <div class="bar-label">${o.focal.toFixed(1)} mm</div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${t}%">
              <span>${p(o.horizontal)} (${t.toFixed(2)} %)</span>
            </div>
          </div>
        </div>
      `}).join("");O.innerHTML=r},oe=["#22d3ee","#60a5fa","#a855f7","#f97316","#f43f5e","#10b981"],re=(e,s,r)=>{if(e.length===0||r===null){R.innerHTML="";return}const o=[...e].sort((n,c)=>c.horizontal-n.horizontal),t=900,a=560,i=Math.round(a*.23),d=t/2,m=a-30,f=Math.max(i+80,Math.round(a*.35)),v=Math.max(280,m-f),M=t*.48,h=o.map((n,c)=>{const y=n.horizontal/2*Math.PI/180,j=Math.tan(y)*v,C=Math.min(j,M);return{metric:n,halfAngleRad:y,spreadX:C,colour:oe[c%oe.length]}}),$=Math.max(...o.map(n=>n.frameWidthMeters),0),x=h.map((n,c)=>{const y=f,j=d-n.spreadX,C=d+n.spreadX;return`
        <polygon
          points="${d},${m} ${j},${y} ${C},${y}"
          fill="${n.colour}"
          fill-opacity="${.16+c*.08}"
          stroke="${n.colour}"
          stroke-width="2"
        >
          <title>${n.metric.focal.toFixed(1)} mm — ${p(n.metric.horizontal)} horizontal</title>
        </polygon>
      `}).join(""),A=Math.max(...o.map(n=>n.subjectsAcross),0),g=Math.min(A,88),H=Math.max(A-g,0),_=28,ie=Math.min(4,Math.max(1,Math.ceil(g/_))),b=Math.max(1,Math.min(_,Math.ceil(g/ie))),u=Math.max(1,Math.ceil(g/b)),ce=h.map(n=>$===0?0:n.metric.frameWidthMeters/$),de=n=>{for(let c=h.length-1;c>=0;c-=1)if(n<=ce[c]/2)return h[c].colour;return"#94a3b8"},ue=Math.max(...h.map(n=>n.spreadX),160),G=Math.max(320,Math.min(ue*1.75,t*.88)),P=42,U=Math.max(72,i-32),w=Math.max(10,Math.min(24,U/u*.18));let S=Math.min(1.8,Math.max(.6,(U-Math.max(u-1,0)*w)/(u*P))),I=P*S,J=u*I+Math.max(u-1,0)*w;const K=28,Q=Math.max(48,f-K-32);if(J>Q){const n=(Q-Math.max(u-1,0)*w)/(u*P);S=Math.max(.55,Math.min(S,n)),I=P*S,J=u*I+Math.max(u-1,0)*w}const he=Math.max(14,Math.min(28,G/b*.18)),pe=s.icon.trim(),me=g>0?Array.from({length:g}).map((n,c)=>{const j=(c%b+.5)/b,C=Math.abs(j-.5),ve=de(C);return`
              <span
                class="overlay-subject"
                data-row="${Math.floor(c/b)}"
                style="color: ${ve}; animation-delay: ${c*22}ms"
              >
                ${pe}
              </span>
            `}).join(""):'<span class="overlay-subject-empty">Move closer to fit one into frame</span>',Z=H>0?`<span class="overlay-subject-more">+${H} ${H===1?s.singular:s.plural}</span>`:"",fe=h.map(n=>`
        <div class="legend-item">
          <span class="swatch" style="background:${n.colour}"></span>
          <span>${n.metric.focal.toFixed(1)} mm</span>
        </div>
      `).join("");R.innerHTML=`
    <div class="overlay-stage">
      <svg viewBox="0 0 ${t} ${a}" role="presentation" aria-hidden="true">
        <defs>
          <marker
            id="center-dot"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
          >
            <circle cx="3" cy="3" r="3" fill="#475569" />
          </marker>
        </defs>
        <line
          x1="${d}"
          y1="${m}"
          x2="${d}"
          y2="${f}"
          stroke="#cbd5f5"
          stroke-width="2"
          stroke-dasharray="6"
        />
        ${x}
        <circle cx="${d}" cy="${m}" r="4" fill="#334155" />
      </svg>
      <div class="overlay-subject-layer" aria-hidden="true">
        ${g>0||H>0?`
              <div
                class="overlay-subject-block"
                style="
                  --grid-width: ${G}px;
                  --grid-top: ${K}px;
                  --icon-scale: ${S};
                  --row-gap: ${w}px;
                  --column-gap: ${he}px;
                "
              >
                <div class="overlay-subject-grid" style="--columns: ${b}; --rows: ${u};">
                  ${me}
                </div>
                ${Z?`<div class="overlay-subject-meta">${Z}</div>`:""}
              </div>
            `:""}
      </div>
    </div>
    <div class="overlay-legend legend" aria-hidden="true">${fe}</div>
  `},z=()=>{const{values:e,invalidTokens:s}=be(D.value),r=Me(),o=r!==null,t=Y.value.trim(),a=t===""?NaN:Number.parseFloat(t),i=Number.isFinite(a)&&a>0,d=i?a:null,m=$e(),f=m!==null,v=m??X[0];if(xe(s,o,e.length>0,i,f),!o||!i||!f||e.length===0){se([],v),ae([]),re([],v,null);return}const M=e.map(h=>{const $=ye(h,r.width,r.height),x=d!==null?2*d*Math.tan($.horizontal*Math.PI/180/2):0,A=x>0?Math.max(0,Math.floor(x/v.widthMeters)):0;return{...$,frameWidthMeters:x,subjectsAcross:A}});se(M,v),ae(M),re(M,v,d)},we=()=>{const e=L.find(r=>r.checked)?.value;V.find(r=>r.id===e)?.isCustom?(N.hidden=!1,k.focus()):(N.hidden=!0,k.value="",q.value=""),z()};L.forEach(e=>{e.addEventListener("change",we)});W.addEventListener("change",()=>{z()});ne.addEventListener("submit",e=>{e.preventDefault(),z()});const Se=[D,k,q,Y];Se.forEach(e=>{e.addEventListener("input",()=>{z()})});z();
