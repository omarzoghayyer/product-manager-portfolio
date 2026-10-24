const a=`---
title: Your title
subtitle: Optional one-line subtitle
description: One or two sentences shown on the Writing page. Defaults to the subtitle.
date: 2026-01-31
draft: true
---

Start writing here. Files whose names start with an underscore (like this one) are never published.
`,l=Object.assign({"./posts/_template.md":a});function c(t){const e=/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(t);if(!e)return{data:{},body:t};const s={};for(const n of e[1].split(/\r?\n/)){const r=n.indexOf(":");if(r===-1)continue;const o=n.slice(0,r).trim();let i=n.slice(r+1).trim();/^(['"]).*\1$/.test(i)&&(i=i.slice(1,-1)),i==="true"?i=!0:i==="false"&&(i=!1),o&&(s[o]=i)}return{data:s,body:e[2].trim()}}function u(t,e){const s=t.split("/").pop().replace(/\.md$/,""),{data:n,body:r}=c(e);return{slug:s,title:n.title||s,subtitle:n.subtitle||"",description:n.description||n.subtitle||"",date:n.date||"",draft:n.draft===!0,body:r}}const f=Object.entries(l).filter(([t])=>!t.split("/").pop().startsWith("_")).map(([t,e])=>u(t,e)).filter(t=>!t.draft).sort((t,e)=>(e.date||"").localeCompare(t.date||""));function d(t){return f.find(e=>e.slug===t)||null}function p(t){if(!t)return"";const e=new Date(`${t}T12:00:00`);return Number.isNaN(e.getTime())?t:e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}export{p as f,d as g,f as p};
