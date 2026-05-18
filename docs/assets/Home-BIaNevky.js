import{r as d,j as e,L as s,c as i}from"./index-DSOhYP4d.js";import{R as g,S as m}from"./ReaderNotification-ChA1ck66.js";import{B as l}from"./button-BQ6fk0Do.js";import{n as y,t as b,i as f}from"./insights-D7vAqZ8L.js";import{m as a}from"./proxy-DmJdV3MZ.js";import{A as n,C as v,a as w}from"./cpu-BlW3K_9e.js";import"./index-StjfYw9h.js";const h=[{id:"satellite-forecast-2030",title:"Satellite Launch Growth – 2030 Forecast Using Linear & Log-Linear Models",company:"Independent Research",company_logo_url:"/images/logos/satellite.png",industry:"Space & Data",sector:"Forecasting & Analytics",thumbnail_url:y,problem_statement:"Constellations like Starlink caused a sharp jump in satellites entering orbit between 2019–2020. I wanted to see what baseline models would predict for 2030 using UCS data from 2000–2022.",problem_description:`
**Context:** Global satellite launches accelerated sharply in the last five years, driven mostly by LEO internet constellations.  
**Pain:** Public forecasts are often hand-wavy or based on fleet announcements, not historical launch behavior.
`,root_cause_analysis:`
- Industry reports often extrapolate from company goals, not real launch cadence  
- Yearly growth became nonlinear after 2019 due to reusable rockets  
- Simple forecasts rarely show uncertainty or model behavior
`,proposed_solution:`
- Fit two quick baselines using historical UCS counts  
- **Linear regression** for a conservative trajectory  
- **Log-linear regression** to capture exponential growth post-2019  
- Compare both and bracket a reasonable 2030 range  
- Include the exact code snippet so others can reproduce it
`,expected_impact:`
- Transparent, reproducible forecasting baseline  
- Gives analysts a starting point before layering domain knowledge  
- Shows how much model choice alone can swing a 2030 estimate
`,key_learnings:`
- Growth is highly nonlinear after 2019  
- Even simple models disagree by more than 2x, so ranges matter  
- The 2019–2020 Starlink spike introduces structural breaks that should be modeled separately  
- Publishing the code builds trust and keeps analysis accountable
`,key_learnings:`
- Growth is highly nonlinear after 2019  
- Even simple models disagree by more than 2x, so ranges matter  
- The 2019–2020 Starlink spike introduces structural breaks that should be modeled separately  
- Publishing the code builds trust and keeps analysis accountable
`,created_date:"2025-11-07",featured:!1,likes:100,problem_description_extra:`
        ### Code Used
        \`\`\`python
        import pandas as pd
        import numpy as np
        from sklearn.linear_model import LinearRegression

        df = pd.read_csv("ucs_satellites_by_year.csv")
        X = df[['year']].values
        y = df['total'].values

        lin = LinearRegression().fit(X, y)
        loglin = LinearRegression().fit(X, np.log(y))

        print("2030 linear:", lin.predict([[2030]]))
        print("2030 log-linear:", np.exp(loglin.predict([[2030]])))
        \`\`\`

        ### Original Post on X
        I first shared the quick result here:  
        https://x.com/your-post-here
`},{id:"tesla-autopilot-safety",title:"Tesla Autopilot - Open Safety Program",company:"Tesla",company_logo_url:"/images/logos/tesla.png",industry:"Automotive",sector:"Safety & Compliance",thumbnail_url:b,problem_statement:"Lack of transparent safety data undermines public trust in autonomous vehicle technology",problem_description:`
**Context:** Highly scrutinized product with complex edge cases.  
**Pain:** Public trust, policy engagement, and developer focus misaligned due to opaque signals.
    `,root_cause_analysis:`
- No consistent external reporting for safety indicators  
- Safety reviews buried in internal tooling  
- Weak feedback loop from incidents → product priorities
    `,proposed_solution:`
- **Open Safety Dashboard** with rate-based indicators  
- Structured **incident taxonomy** + weekly triage  
- Executive **policy brief** pipeline connected to telemetry
    `,expected_impact:`
- Better regulator & community alignment  
- Faster corrective action on high-severity patterns  
- Stronger internal focus on risk-adjusted priorities
    `,key_learnings:`
- Narratives follow **trusted numbers**  
- Public safety metrics reduce speculation & improve cooperation  
- Incident taxonomy unlocks compounding insights
    `,featured:!0,likes:2,created_date:"2025-01-23"}];function L(){const o=d.useMemo(()=>{const t=h.filter(c=>c.featured);if(t.length>=4)return t.slice(0,4);const r=4-t.length,u=h.filter(c=>!c.featured).slice(0,r);return[...t,...u]},[]),p=d.useMemo(()=>[...f].sort((t,r)=>new Date(r.created_date)-new Date(t.created_date)).slice(0,3),[]),x=[...o,...p];return e.jsxs("div",{className:"relative",children:[e.jsx(g,{items:x,type:"case study"}),e.jsxs("section",{className:"relative min-h-[90vh] flex items-center justify-center overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 geometric-pattern opacity-20"}),e.jsx("div",{className:"relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center",children:e.jsxs(a.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.8},children:[e.jsxs("div",{className:"inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-sm text-[var(--primary)] font-medium mb-8",children:[e.jsx(m,{className:"w-4 h-4"}),"Platform · Telemetry · Automation"]}),e.jsx("h1",{className:"text-5xl md:text-7xl font-bold tracking-tight mb-6",children:"Omar Zoghayyer"}),e.jsx("p",{className:"text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto font-light",children:"Technical product lead for platform tools, telemetry, and game infrastructure at EA."}),e.jsx("p",{className:"text-lg text-gray-500 mb-12 max-w-2xl mx-auto",children:"I partner with engineering and QA across studios to design and scale the tooling, data pipelines, and automation that keep our games performant and stable."}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 justify-center",children:[e.jsx(s,{to:i("TheOS"),children:e.jsxs(l,{size:"lg",className:"bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white px-8 py-6 text-base",children:["View My Work",e.jsx(n,{className:"w-5 h-5 ml-2"})]})}),e.jsx(s,{to:i("About"),children:e.jsx(l,{size:"lg",variant:"outline",className:"border-gray-300 px-8 py-6 text-base",children:"About & Timeline"})})]})]})}),e.jsx(a.div,{className:"absolute top-1/4 left-10 w-16 h-16 bg-blue-100 rounded-2xl opacity-50",animate:{y:[0,-15,0],rotate:[0,8,0]},transition:{duration:6,repeat:1/0,ease:"easeInOut"}}),e.jsx(a.div,{className:"absolute bottom-1/4 right-10 w-14 h-14 bg-blue-200 rounded-full opacity-40",animate:{y:[0,15,0],scale:[1,1.08,1]},transition:{duration:5,repeat:1/0,ease:"easeInOut"}})]}),e.jsx("section",{className:"py-24 bg-white",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-6 lg:px-8",children:[e.jsxs("div",{className:"text-center mb-16",children:[e.jsx("h2",{className:"text-3xl md:text-4xl font-bold mb-4",children:"What I Do"}),e.jsx("p",{className:"text-lg text-gray-600 max-w-2xl mx-auto",children:"I focus on systems that give teams the right signals, kill noise, and turn quality and performance into something automatic inside the pipeline."})]}),e.jsxs("div",{className:"grid md:grid-cols-3 gap-8",children:[e.jsx(a.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5,delay:.1},viewport:{once:!0},className:"group",children:e.jsxs("div",{className:"bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300",children:[e.jsx("div",{className:"w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",children:e.jsx(v,{className:"w-6 h-6 text-white"})}),e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"Platform Tools"}),e.jsx("p",{className:"text-gray-600",children:"Developer tooling that accelerates workflows - logging, profiling, validation, and the infrastructure that supports them."})]})}),e.jsx(a.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5,delay:.2},viewport:{once:!0},className:"group",children:e.jsxs("div",{className:"bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300",children:[e.jsx("div",{className:"w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",children:e.jsx(w,{className:"w-6 h-6 text-white"})}),e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"Telemetry & Observability"}),e.jsx("p",{className:"text-gray-600",children:"Unified telemetry pipelines and dashboards that surface performance, stability, and user-impact signals earlybefore they hit players."})]})}),e.jsx(a.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5,delay:.3},viewport:{once:!0},className:"group",children:e.jsxs("div",{className:"bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300",children:[e.jsx("div",{className:"w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",children:e.jsx(m,{className:"w-6 h-6 text-white"})}),e.jsx("h3",{className:"text-xl font-semibold mb-3",children:"Automation & ML"}),e.jsx("p",{className:"text-gray-600",children:"Pipeline guardrails, not manuals. ML detects crashes, ANRs, and visual issues so QA scales without headcount.                "})]})})]})]})}),o.length>0&&e.jsx("section",{className:"py-24",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-6 lg:px-8",children:[e.jsxs("div",{className:"flex justify-between items-end mb-12",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-3xl md:text-4xl font-bold mb-4",children:"Featured Work"}),e.jsx("p",{className:"text-lg text-gray-600",children:"Real problems solved across gaming and platform tools"})]}),e.jsx(s,{to:i("CaseStudies"),children:e.jsxs(l,{variant:"outline",className:"hidden md:flex items-center gap-2",children:["View All Cases",e.jsx(n,{className:"w-4 h-4"})]})})]}),e.jsx("div",{className:"grid md:grid-cols-2 lg:grid-cols-3 gap-8",children:o.map((t,r)=>e.jsx(a.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5,delay:r*.1},viewport:{once:!0},children:e.jsx(s,{to:`${i("CaseStudyDetail")}?id=${t.id}`,state:{caseStudy:t},className:"block group",children:e.jsxs("div",{className:"bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300",children:[t.thumbnail_url&&e.jsx("div",{className:"aspect-video bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden",children:e.jsx("img",{src:t.thumbnail_url,alt:t.title,className:"w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",loading:"lazy",width:640,height:360})}),e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx("span",{className:"text-xs font-medium text-[var(--primary)] bg-blue-50 px-3 py-1 rounded-full",children:t.industry}),e.jsx("span",{className:"text-xs text-gray-500",children:t.company})]}),e.jsx("h3",{className:"text-xl font-semibold mb-2 group-hover:text-[var(--primary)] transition-colors",children:t.title}),e.jsx("p",{className:"text-gray-600 text-sm line-clamp-2",children:t.problem_statement})]})]})})},t.id))}),e.jsx("div",{className:"text-center mt-12 md:hidden",children:e.jsx(s,{to:i("CaseStudies"),children:e.jsxs(l,{variant:"outline",className:"w-full sm:w-auto",children:["View All Cases",e.jsx(n,{className:"w-4 h-4 ml-2"})]})})})]})}),e.jsx("section",{className:"py-24 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white",children:e.jsx("div",{className:"max-w-4xl mx-auto px-6 lg:px-8 text-center",children:e.jsxs(a.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.8},viewport:{once:!0},children:[e.jsx("h2",{className:"text-3xl md:text-4xl font-bold mb-6",children:"Contact Me"}),e.jsx("p",{className:"text-lg text-blue-100 mb-8 max-w-2xl mx-auto",children:"Have a question, want to compare notes, or just say hi? I try to respond within a day or two."}),e.jsx(s,{to:i("Contact"),children:e.jsxs(l,{size:"lg",variant:"outline",className:"bg-white text-[var(--primary)] hover:bg-gray-50 border-0 px-8 py-6 text-base",children:["Say Hello",e.jsx(n,{className:"w-5 h-5 ml-2"})]})})]})})})]})}export{L as default};
