const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-CJC0UbMN.js","assets/vendor-ui-B2A3YeRo.js","assets/vendor-react-CTBdW232.js","assets/Signup-CQFsznol.js","assets/ScannerWizard-CMVnnZ6X.js","assets/FormField-DjtN2c4a.js","assets/AdminDashboard-DMvPu8BX.js"])))=>i.map(i=>d[i]);
import{j as e,A as E,m as f}from"./vendor-ui-B2A3YeRo.js";import{b as V,g as J,a as c,u as L,N as b,c as F,L as k,B as H,R as G,d as x,e as K}from"./vendor-react-CTBdW232.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=s(n);fetch(n.href,i)}})();var y={},N;function Q(){if(N)return y;N=1;var t=V();return y.createRoot=t.createRoot,y.hydrateRoot=t.hydrateRoot,y}var X=Q();const Y=J(X),Z="modulepreload",ee=function(t){return"/comet-scanner-wizard/"+t},_={},S=function(r,s,a){let n=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),d=o?.nonce||o?.getAttribute("nonce");n=Promise.allSettled(s.map(u=>{if(u=ee(u),u in _)return;_[u]=!0;const m=u.endsWith(".css"),g=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${g}`))return;const l=document.createElement("link");if(l.rel=m?"stylesheet":Z,m||(l.as="script"),l.crossOrigin="",l.href=u,d&&l.setAttribute("nonce",d),document.head.appendChild(l),m)return new Promise((h,v)=>{l.addEventListener("load",h),l.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${u}`)))})}))}function i(o){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=o,window.dispatchEvent(d),!d.defaultPrevented)throw o}return n.then(o=>{for(const d of o||[])d.status==="rejected"&&i(d.reason);return r().catch(i)})},te=30*60*1e3,A=15*60*1e3,re=5,O=t=>{const r=localStorage.getItem(`login_attempts_${t}`);if(r){const s=JSON.parse(r);return Date.now()-s.lastAttempt>=A?(localStorage.removeItem(`login_attempts_${t}`),{count:0,lastAttempt:Date.now()}):s}return{count:0,lastAttempt:Date.now()}},se=t=>{const s={count:O(t).count+1,lastAttempt:Date.now()};localStorage.setItem(`login_attempts_${t}`,JSON.stringify(s))},ne=t=>{localStorage.removeItem(`login_attempts_${t}`)},P=(t,r)=>{const s=Math.random().toString(36).substring(2),a={username:t,isOwner:r,lastActivity:Date.now(),createdAt:Date.now()};return localStorage.setItem(`session_${s}`,JSON.stringify(a)),s},oe=t=>{const r=localStorage.getItem(`session_${t}`);if(!r)return null;const s=JSON.parse(r);return Date.now()-s.lastActivity>te?(localStorage.removeItem(`session_${t}`),null):s},ae=t=>{localStorage.removeItem(`session_${t}`)},I=()=>{const t="ChasinAlts",r="Chaseburger856!";if(!localStorage.getItem(`user_${t}`)){const s={username:t,password:r,isOwner:!0,createdAt:Date.now(),permissions:{contentManagement:!0,userManagement:!0,systemConfiguration:!0,mediaUploads:!0,securitySettings:!0,siteCustomization:!0}};localStorage.setItem(`user_${t}`,JSON.stringify(s))}},ie=t=>{const r=O(t);return r.count>=re&&Date.now()-r.lastAttempt<A},M=c.createContext(void 0),C={authenticate:async(t,r)=>{if(ie(t))throw new Error("Account is temporarily locked. Please try again later.");await new Promise(a=>setTimeout(a,1e3));const s=localStorage.getItem(`user_${t}`);if(s){const a=JSON.parse(s);if(a.password===r){ne(t);const n=P(t,a.isOwner);localStorage.setItem("current_session_id",n);const{password:i,...o}=a;return o}}throw se(t),new Error("Invalid credentials")},createUser:async(t,r,s)=>{if(await new Promise(o=>setTimeout(o,1e3)),localStorage.getItem(`user_${t}`))throw new Error("Username already exists");const a={username:t,password:r,isOwner:s,createdAt:Date.now(),permissions:s?{contentManagement:!0,userManagement:!0,systemConfiguration:!0,mediaUploads:!0,securitySettings:!0,siteCustomization:!0}:{contentManagement:!1,userManagement:!1,systemConfiguration:!1,mediaUploads:!1,securitySettings:!1,siteCustomization:!1}};localStorage.setItem(`user_${t}`,JSON.stringify(a));const{password:n,...i}=a;return i}};function z({children:t}){const[r,s]=c.useState(null),[a,n]=c.useState(!0);c.useEffect(()=>{I(),(()=>{const g=localStorage.getItem("current_session_id");if(g){const l=oe(g);if(l){const h=localStorage.getItem(`user_${l.username}`);if(h){const v=JSON.parse(h),{password:Pe,...B}=v;s(B)}}else localStorage.removeItem("current_session_id")}n(!1)})()},[]);const u={currentUser:r,login:async(m,g)=>{try{const l=await C.authenticate(m,g);s(l)}catch(l){throw l}},signup:async(m,g,l)=>{try{const h=await C.createUser(m,g,l);s(h);const v=P(m,l);localStorage.setItem("current_session_id",v)}catch(h){throw h}},logout:async()=>{const m=localStorage.getItem("current_session_id");m&&(ae(m),localStorage.removeItem("current_session_id")),s(null)},isLoading:a};return e.jsx(M.Provider,{value:u,children:!a&&t})}function R(){const t=c.useContext(M);if(t===void 0)throw new Error("useAuth must be used within an AuthProvider");return t}const ce={currentStep:1,progress:{step1Complete:!1},answers:{},sections:[],questions:[]},W=c.createContext(void 0);function le(t,r){switch(r.type){case"SET_STEP":return{...t,currentStep:r.payload};case"SET_PROGRESS":return{...t,progress:{...t.progress,...r.payload}};case"SET_ANSWER":return{...t,answers:{...t.answers,[r.payload.questionId]:r.payload.value}};case"SET_SECTIONS":return{...t,sections:r.payload};case"SET_QUESTIONS":return{...t,questions:r.payload};default:return t}}function de({children:t}){const[r,s]=c.useReducer(le,ce);return e.jsx(W.Provider,{value:{state:r,dispatch:s},children:t})}function ze(){const t=c.useContext(W);if(t===void 0)throw new Error("useWizard must be used within a WizardProvider");return t}const $=c.createContext(void 0),ue={initial:{opacity:0,y:-20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20}},me=({type:t,message:r})=>{const s={success:"bg-green-500",error:"bg-red-500",info:"bg-blue-500"}[t],a={success:e.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M5 13l4 4L19 7"})}),error:e.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})}),info:e.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})})}[t];return e.jsxs(f.div,{variants:ue,initial:"initial",animate:"animate",exit:"exit",className:`${s} text-white p-4 rounded-lg shadow-lg flex items-center space-x-3`,children:[e.jsx("span",{className:"flex-shrink-0",children:a}),e.jsx("p",{className:"text-sm font-medium",children:r})]})},ge=({children:t})=>{const[r,s]=c.useState([]),a=c.useCallback((n,i)=>{const o=Date.now().toString();s(d=>[...d,{id:o,type:n,message:i}]),setTimeout(()=>{s(d=>d.filter(u=>u.id!==o))},5e3)},[]);return e.jsxs($.Provider,{value:{showToast:a},children:[t,e.jsx("div",{className:"fixed top-4 right-4 z-50 space-y-2",children:e.jsx(E,{mode:"popLayout",children:r.map(n=>e.jsx(me,{type:n.type,message:n.message},n.id))})})]})},Re=()=>{const t=c.useContext($);if(!t)throw new Error("useToast must be used within a ToastProvider");return t},D=c.createContext(void 0),he=({children:t})=>{const[r,s]=c.useState(()=>localStorage.getItem("theme")||"dark");c.useEffect(()=>{localStorage.setItem("theme",r),document.documentElement.classList.remove("light","dark"),document.documentElement.classList.add(r)},[r]);const a=()=>{s(n=>n==="dark"?"light":"dark")};return e.jsx(D.Provider,{value:{theme:r,toggleTheme:a},children:t})},U=()=>{const t=c.useContext(D);if(t===void 0)throw new Error("useTheme must be used within a ThemeProvider");return t},T=({children:t,requireOwner:r=!1})=>{const{currentUser:s,isLoading:a}=R(),n=L();return a?e.jsx("div",{className:"min-h-screen flex items-center justify-center",children:e.jsxs("div",{className:"flex flex-col items-center space-y-4",children:[e.jsxs("svg",{className:"animate-spin h-8 w-8 text-blue-600",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{className:"text-gray-600",children:"Loading..."})]})}):s?r&&!s.isOwner?e.jsx(b,{to:"/scanner",state:{error:"Owner access required"},replace:!0}):e.jsx(e.Fragment,{children:t}):e.jsx(b,{to:"/login",state:{from:n},replace:!0})},pe=()=>{const{theme:t,toggleTheme:r}=U();return e.jsx(f.button,{onClick:r,className:`
        fixed top-4 right-4 p-2 rounded-full
        flex items-center justify-center
        backdrop-blur-sm
        ${t==="dark"?"bg-gray-800/80 text-yellow-400 hover:bg-gray-700/80":"bg-white/80 text-gray-800 hover:bg-gray-100/80"}
        shadow-lg
        transition-colors
        z-50
      `,whileHover:{scale:1.05},whileTap:{scale:.95},"aria-label":"Toggle theme",children:t==="dark"?e.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"})}):e.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"})})})},w=({children:t})=>{const{currentUser:r,logout:s}=R(),{theme:a}=U(),n=F(),i=L(),o=async()=>{try{await s(),n("/login")}catch(u){console.error("Failed to log out:",u)}},d=u=>i.pathname.startsWith(u);return e.jsx("div",{className:`min-h-screen ${a==="dark"?"dark":""}`,children:e.jsxs("div",{className:"min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200",children:[e.jsx("header",{className:"bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"h-16 flex items-center justify-between",children:[e.jsx("div",{className:"flex items-center",children:e.jsx(f.h1,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},className:"text-2xl font-bold text-gray-900 dark:text-white",children:"COMET Scanner Wizard"})}),e.jsx(E,{mode:"wait",children:r&&e.jsxs(f.div,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},exit:{opacity:0,x:20},className:"flex items-center space-x-4",children:[e.jsxs("div",{className:"text-sm text-gray-600 dark:text-gray-300",children:[r.isOwner&&e.jsx("span",{className:"bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium mr-2",children:"Owner"}),e.jsx("span",{children:r.username})]}),e.jsx("button",{onClick:o,className:"text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors",children:"Logout"})]})})]}),r&&e.jsxs("nav",{className:"flex space-x-8 -mb-px",children:[e.jsx(k,{to:"/scanner",className:`border-b-2 py-4 px-1 inline-flex items-center text-sm font-medium transition-colors ${d("/scanner")?"border-blue-500 text-blue-600 dark:text-blue-400":"border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"}`,children:"Scanner Templates"}),r.isOwner&&e.jsx(k,{to:"/admin",className:`border-b-2 py-4 px-1 inline-flex items-center text-sm font-medium transition-colors ${d("/admin")?"border-blue-500 text-blue-600 dark:text-blue-400":"border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"}`,children:"Admin Dashboard"})]})]})}),e.jsxs("main",{className:"relative",children:[e.jsx(pe,{}),e.jsx(E,{mode:"wait",children:e.jsx(f.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.2},children:t},"content")})]}),e.jsx("footer",{className:"bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between",children:[e.jsxs("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:["© ",new Date().getFullYear()," COMET Scanner Wizard"]}),e.jsx("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:"Version 1.0.0"})]})})]})})},fe=({size:t="md",color:r="primary",fullScreen:s=!1,text:a})=>{const n={sm:"h-4 w-4",md:"h-8 w-8",lg:"h-12 w-12"}[t],i={primary:"text-blue-600",white:"text-white",gray:"text-gray-600"}[r],o=e.jsxs("div",{className:"flex flex-col items-center space-y-3",children:[e.jsx(f.div,{animate:{rotate:360},transition:{duration:1,repeat:1/0,ease:"linear"},children:e.jsxs("svg",{className:`${n} ${i}`,xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]})}),a&&e.jsx("span",{className:`text-sm font-medium ${i}`,children:a})]});return s?e.jsx("div",{className:"fixed inset-0 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center z-50",children:o}):o},j=({message:t="Loading..."})=>e.jsx("div",{className:"min-h-[200px] flex flex-col items-center justify-center p-4",children:e.jsxs(f.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.3},className:"flex flex-col items-center",children:[e.jsx(fe,{size:"lg"}),e.jsx("p",{className:"mt-4 text-gray-600 dark:text-gray-400 font-medium",children:t})]})}),xe=()=>{const[t,r]=c.useState(!1),[s,a]=c.useState([]);return c.useEffect(()=>{},[]),null},ve=c.lazy(()=>S(()=>import("./Login-CJC0UbMN.js"),__vite__mapDeps([0,1,2]))),ye=c.lazy(()=>S(()=>import("./Signup-CQFsznol.js"),__vite__mapDeps([3,1,2]))),we=c.lazy(()=>S(()=>import("./ScannerWizard-CMVnnZ6X.js"),__vite__mapDeps([4,1,2,5]))),je=c.lazy(()=>S(()=>import("./AdminDashboard-DMvPu8BX.js"),__vite__mapDeps([6,1,2,5])));function be(){return e.jsx(H,{children:e.jsx(z,{children:e.jsx(de,{children:e.jsx(he,{children:e.jsxs(ge,{children:[e.jsx(xe,{}),e.jsxs(G,{children:[e.jsx(x,{path:"/login",element:e.jsx(w,{children:e.jsx(c.Suspense,{fallback:e.jsx(j,{message:"Loading login page..."}),children:e.jsx(ve,{})})})}),e.jsx(x,{path:"/signup",element:e.jsx(w,{children:e.jsx(c.Suspense,{fallback:e.jsx(j,{message:"Loading signup page..."}),children:e.jsx(ye,{})})})}),e.jsx(x,{path:"/scanner",element:e.jsx(T,{children:e.jsx(w,{children:e.jsx(c.Suspense,{fallback:e.jsx(j,{message:"Loading scanner wizard..."}),children:e.jsx(we,{})})})})}),e.jsx(x,{path:"/admin",element:e.jsx(T,{requireOwner:!0,children:e.jsx(w,{children:e.jsx(c.Suspense,{fallback:e.jsx(j,{message:"Loading admin dashboard..."}),children:e.jsx(je,{})})})})}),e.jsx(x,{path:"/",element:e.jsx(b,{to:"/scanner",replace:!0})}),e.jsx(x,{path:"*",element:e.jsx(b,{to:"/scanner",replace:!0})})]})]})})})})})}const Se=()=>{I();const t=localStorage.getItem("user_ChasinAlts");if(!t)return console.error("Admin account initialization failed"),!1;try{const r=JSON.parse(t);return r.username!=="ChasinAlts"?(console.error("Admin username mismatch"),!1):r.isOwner?["contentManagement","userManagement","systemConfiguration","mediaUploads","securitySettings","siteCustomization"].every(n=>r.permissions[n])?!0:(console.error("Admin missing required permissions"),!1):(console.error("Admin is not set as owner"),!1)}catch(r){return console.error("Error verifying admin setup:",r),!1}},Ee="serviceWorker"in navigator,ke=()=>{if(!Ee){console.log("Service workers are not supported in this browser");return}window.addEventListener("load",()=>{const t=`${window.location.origin}/service-worker.js`;navigator.serviceWorker.register(t).then(r=>{console.log("Service Worker registered with scope:",r.scope),r.update(),r.onupdatefound=()=>{const s=r.installing;s&&(s.onstatechange=()=>{s.state==="installed"&&(navigator.serviceWorker.controller?(console.log("New content is available; please refresh."),window.dispatchEvent(new CustomEvent("swUpdate"))):console.log("Content is cached for offline use."))})}}).catch(r=>{console.error("Error during service worker registration:",r)})})},Ne={sampleRate:.1},_e=()=>{Ce()&&(Te(),window.addEventListener("load",()=>{setTimeout(()=>{Ae()},1e3)}))},Ce=()=>Math.random()<Ne.sampleRate,Te=()=>{if(window.PerformanceObserver)try{new PerformanceObserver(n=>{const i=n.getEntries(),o=i[i.length-1];o&&p({name:"largest-contentful-paint",value:o.startTime,category:"paint"})}).observe({type:"largest-contentful-paint",buffered:!0}),new PerformanceObserver(n=>{n.getEntries().forEach(o=>{o.name==="first-input"&&p({name:"first-input-delay",value:o.processingStart-o.startTime,category:"interaction"})})}).observe({type:"first-input",buffered:!0}),new PerformanceObserver(n=>{let i=0;n.getEntries().forEach(o=>{o.hadRecentInput||(i+=o.value)}),p({name:"cumulative-layout-shift",value:i,category:"layout"})}).observe({type:"layout-shift",buffered:!0}),new PerformanceObserver(n=>{const i=n.getEntries()[0];if(i){const o=i;p({name:"time-to-first-byte",value:o.responseStart-o.requestStart,category:"navigation"}),p({name:"dom-content-loaded",value:o.domContentLoadedEventEnd-o.fetchStart,category:"navigation"}),p({name:"window-loaded",value:o.loadEventEnd-o.fetchStart,category:"navigation"})}}).observe({type:"navigation",buffered:!0})}catch(t){console.error("Error setting up performance observers:",t)}},q={},p=t=>{q[t.name]=t.value},Le=t=>{const r=performance.now();return()=>{const s=performance.now()-r;p({name:t,value:s})}},Ae=()=>{const t={...q};if(window.performance){performance.getEntriesByType("paint").forEach(a=>{a.name==="first-paint"?t.firstPaint=a.startTime:a.name==="first-contentful-paint"&&(t.firstContentfulPaint=a.startTime)});const s=performance.getEntriesByType("navigation")[0];s&&(t.timeToFirstByte=s.responseStart-s.requestStart,t.domContentLoaded=s.domContentLoadedEventEnd-s.fetchStart,t.windowLoaded=s.loadEventEnd-s.fetchStart)}return t},Oe={init:_e,recordMetric:p,startTiming:Le};Se();Y.createRoot(document.getElementById("root")).render(e.jsx(K.StrictMode,{children:e.jsx(z,{children:e.jsx(be,{})})}));ke();Oe.init();export{fe as L,pe as T,ze as a,U as b,Re as c,R as u};
