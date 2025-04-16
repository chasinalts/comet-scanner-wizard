import{j as e,m as y,A as F,R as q,a as ee}from"./vendor-ui-B2A3YeRo.js";import{a as x,e as ae}from"./vendor-react-CTBdW232.js";import{L as te,u as re,c as se,b as le}from"./index-CY7Hya_3.js";import{c as R,h as V,a as ne,b as ie,u as de,T as U,C as L,d as z,S as P}from"./FormField-Boi-LoQB.js";const N=x.forwardRef(({children:u,variant:s="primary",size:f="md",isLoading:i=!1,loadingText:k,leftIcon:h,rightIcon:p,fullWidth:v=!1,disabled:r,className:l="",...d},m)=>{const C="inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors",w={primary:"bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",secondary:"bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",danger:"bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",ghost:"text-gray-600 hover:bg-gray-100 focus:ring-gray-500"},$={sm:"px-3 py-1.5 text-sm",md:"px-4 py-2 text-base",lg:"px-6 py-3 text-lg"};return e.jsx(y.button,{ref:m,whileTap:{scale:.98},disabled:r||i,className:`
          ${C}
          ${w[s]}
          ${$[f]}
          ${v?"w-full":""}
          ${r||i?"opacity-60 cursor-not-allowed pointer-events-none":""}
          ${l}
        `,...d,children:i?e.jsxs(e.Fragment,{children:[e.jsx(te,{size:"sm",color:s==="secondary"||s==="ghost"?"gray":"white"}),k&&e.jsx("span",{className:"ml-2",children:k})]}):e.jsxs(e.Fragment,{children:[h&&e.jsx("span",{className:"mr-2",children:h}),u,p&&e.jsx("span",{className:"ml-2",children:p})]})})});N.displayName="Button";const oe=x.forwardRef(({children:u,size:s="md",...f},i)=>{const k={sm:"p-1.5",md:"p-2",lg:"p-3"};return e.jsx(N,{ref:i,size:s,className:k[s],...f,children:u})});oe.displayName="IconButton";const ce=()=>e.jsx(y.div,{initial:{opacity:0},animate:{opacity:1},className:"relative w-8 h-8",children:e.jsx(y.div,{animate:{rotate:360},transition:{duration:1,repeat:1/0,ease:"linear"},className:"absolute inset-0 border-2 border-blue-500 dark:border-blue-400 rounded-full border-t-transparent"})}),ge=()=>e.jsx("svg",{className:"w-6 h-6 text-gray-400 dark:text-gray-500 mb-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"})}),me=()=>e.jsx(y.svg,{initial:{scale:1},animate:{scale:[1,1.1,1]},transition:{duration:1.5,repeat:1/0},className:"w-8 h-8 text-blue-500 dark:text-blue-400 mb-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4v16m0-16l-4 4m4-4l4 4"})}),xe=()=>e.jsx(y.svg,{initial:{scale:0},animate:{scale:1},className:"w-8 h-8 text-red-500 mb-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})});function B({onFileSelect:u,accept:s="image/*",maxSize:f=5,title:i="Upload File",description:k="Drag and drop a file here, or click to select",variant:h="default",isLoading:p=!1}){const[v,r]=x.useState(!1),[l,d]=x.useState(null),m=ae.useRef(null),C=o=>o.size>f*1024*1024?{type:"size",message:`File size exceeds ${f}MB limit`}:!s.includes("*")&&!s.includes(o.type)?{type:"type",message:"Invalid file type"}:null,w=x.useCallback(o=>{if(o.preventDefault(),r(!1),d(null),p)return;const I=o.dataTransfer.files[0];if(I){const S=C(I);if(S){d(S);return}u(I)}},[u,f,s,p]),$=x.useCallback(o=>{o.preventDefault(),p||(r(!0),d(null))},[p]),D=x.useCallback(o=>{o.preventDefault(),r(!1)},[]),b=()=>{p||(d(null),m.current?.click())},A=o=>{if(p)return;const I=o.target.files?.[0];if(I){const S=C(I);if(S){d(S);return}u(I)}o.target.value=""},j=h==="compact";return e.jsxs(y.div,{onClick:b,onDrop:w,onDragOver:$,onDragLeave:D,initial:{opacity:0},animate:{opacity:1,borderColor:v?"#3B82F6":l?"#EF4444":void 0,scale:v?1.02:1},transition:{duration:.2},className:`
        relative cursor-pointer
        ${j?"p-3":"p-6"}
        rounded-lg border-2 border-dashed
        ${p?"cursor-wait ":""}
        ${l?"border-red-500 bg-red-50 dark:bg-red-900/20":v?"border-blue-500 bg-blue-50 dark:bg-blue-900/20":"border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"}
        transition-colors duration-200
      `,children:[e.jsx("input",{ref:m,type:"file",accept:s,onChange:A,className:"hidden",disabled:p}),e.jsx(F,{mode:"wait",children:p?e.jsxs(y.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:"absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm",children:[e.jsx(ce,{}),e.jsx(y.div,{initial:{opacity:0,y:5},animate:{opacity:1,y:0},className:"text-blue-500 dark:text-blue-400 font-medium mt-2",children:"Uploading..."})]},"loading"):l?e.jsxs(y.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:"absolute inset-0 flex flex-col items-center justify-center bg-red-50/50 dark:bg-red-900/30 rounded-lg backdrop-blur-sm",children:[e.jsx(xe,{}),e.jsxs(y.div,{initial:{opacity:0,y:5},animate:{opacity:1,y:0},className:"text-red-500 dark:text-red-400 font-medium text-center",children:[l.message,e.jsx("p",{className:"text-sm mt-1 text-red-400 dark:text-red-300",children:"Click or drag a new file to try again"})]})]},"error"):v?e.jsxs(y.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:"absolute inset-0 flex flex-col items-center justify-center bg-blue-50/50 dark:bg-blue-900/30 rounded-lg backdrop-blur-sm",children:[e.jsx(me,{}),e.jsx(y.div,{initial:{opacity:0,y:5},animate:{opacity:1,y:0},className:"text-blue-500 dark:text-blue-400 font-medium",children:"Drop to upload"})]},"dragging"):e.jsx(y.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:`text-center ${j?"space-y-1":"space-y-2"}`,children:e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx(ge,{}),e.jsx("div",{className:`${j?"text-sm":"text-base"} font-medium text-gray-900 dark:text-white`,children:i}),e.jsx("p",{className:`${j?"text-xs":"text-sm"} text-gray-500 dark:text-gray-400`,children:k}),e.jsxs("p",{className:`${j?"text-xs":"text-sm"} text-gray-400 dark:text-gray-500`,children:["Max size: ",f,"MB"]})]})},"normal")})]})}const ue=()=>{const[u,s]=x.useState(()=>{const r=localStorage.getItem("admin_contents");return r?JSON.parse(r):[]});x.useEffect(()=>{localStorage.setItem("admin_contents",JSON.stringify(u)),console.log("Contents saved to localStorage:",u)},[u]),x.useEffect(()=>()=>{u.forEach(r=>{r.imageUrl&&r.imageUrl.startsWith("blob:")&&R(r.imageUrl)})},[]);const f=x.useCallback(r=>{const l=`content-${Date.now()}`,d=Date.now(),m={...r,id:l,createdAt:d,updatedAt:d};return s(C=>[...C,m]),l},[]),i=x.useCallback((r,l)=>{s(d=>d.map(m=>m.id===r?{...m,...l,updatedAt:Date.now()}:m))},[]),k=x.useCallback(r=>{s(l=>{const d=l.find(m=>m.id===r);return d?.imageUrl&&d.imageUrl.startsWith("blob:")&&R(d.imageUrl),l.filter(m=>m.id!==r)})},[]),h=x.useCallback(async(r,l,d="Uploaded Image")=>(console.log(`Starting upload of ${l} image:`,{fileName:r.name,fileSize:r.size,fileType:r.type}),new Promise((m,C)=>{try{V(r,(w,$)=>{console.log(`Adding ${l} content to storage`);const D=f({type:l,title:d,content:"",imageUrl:w,scale:1});console.log(`${l} image added with ID:`,D),m(D)})}catch(w){console.error(`Error uploading ${l} image:`,w),C(w)}})),[f]),p=x.useCallback((r,l)=>{i(r,{scale:l})},[i]),v=x.useCallback((r,l)=>{i(r,{displayText:l})},[i]);return{contents:u,addContent:f,updateContent:i,deleteContent:k,uploadImage:h,updateImageScale:p,updateImageDisplayText:v}},he=({className:u="",onClick:s})=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:`w-5 h-5 ${u}`,fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",onClick:s,children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})});function ve(){const{currentUser:u}=re(),{showToast:s}=se(),{theme:f}=le(),{questions:i,addQuestion:k,updateQuestion:h,deleteQuestion:p}=ne(),{sections:v,addSection:r,updateSection:l,deleteSection:d,reorderSections:m}=ie(),{deleteContent:C,uploadImage:w,updateImageScale:$,updateImageDisplayText:D}=ue(),{getBannerImage:b,getScannerImages:A}=de(),[j,o]=x.useState(null),[I,S]=x.useState(null),W=a=>{const t=i.find(c=>c.id===a);if(!t)return;const n={id:`option-${Date.now()}`,text:"",value:"",scale:1};h(a,{options:[...t.options||[],n]}),s("success","New answer option added")},_=(a,t)=>n=>{const c=i.find(g=>g.id===a);c&&h(a,{options:c.options?.map(g=>g.id===t?{...g,text:n.target.value,value:n.target.value.toLowerCase()}:g)})},J=(a,t)=>n=>{const c=i.find(g=>g.id===a);c&&h(a,{options:c.options?.map(g=>g.id===t?{...g,scale:parseFloat(n.target.value)}:g)})},Y=async(a,t,n)=>{if(j){s("error","Please wait for the current upload to complete");return}try{o({questionId:a,optionId:t}),await new Promise(c=>{V(n,(g,Z)=>{const Q=i.find(T=>T.id===a);Q&&(h(a,{options:Q.options?.map(T=>T.id===t?{...T,imageUrl:g,imagePreview:Z,scale:1}:T)}),c())})}),s("success","Image uploaded successfully")}catch{s("error","Failed to upload image")}finally{o(null)}},G=(a,t)=>{const n=i.find(c=>c.id===a);n&&h(a,{options:n.options?.map(c=>c.id===t?{...c,imageUrl:void 0,imagePreview:void 0,scale:void 0}:c)})},H=(a,t)=>n=>{const c=i.find(g=>g.id===a);c&&h(a,{options:c.options?.map(g=>g.id===t?{...g,linkedSectionId:n.target.value||void 0}:g)})},K=async a=>{if(j){s("error","Please wait for the current upload to complete");return}try{o({contentType:"banner"});const t=await w(a,"banner","Banner Image");S(t),s("success","Banner image uploaded successfully")}catch(t){s("error","Failed to upload banner image"),console.error("Error uploading banner image:",t)}finally{o(null)}},X=async a=>{if(j){s("error","Please wait for the current upload to complete");return}try{o({contentType:"scanner"});const t=await w(a,"scanner","Scanner Variation");S(t),console.log("Scanner image uploaded with ID:",t),console.log("Current scanner images:",A()),s("success","Scanner image uploaded successfully")}catch(t){s("error","Failed to upload scanner image"),console.error("Error uploading scanner image:",t)}finally{o(null)}},E=a=>t=>{const n=parseFloat(t.target.value);$(a,n),S(a)},O=(a,t)=>{D(a,t)},M=a=>{C(a),I===a&&S(null),s("success","Image deleted successfully")};return u?.isOwner?e.jsxs("div",{className:`max-w-7xl mx-auto p-6 space-y-12 ${f==="dark"?"dark":""}`,children:[e.jsx("h1",{className:"text-3xl font-bold mb-8 text-gray-900 dark:text-white",children:"Admin Dashboard"}),e.jsxs("section",{className:"space-y-8",children:[e.jsx("h2",{className:"text-2xl font-semibold text-gray-900 dark:text-white",children:"Image Management"}),e.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700",children:[e.jsx("h3",{className:"text-xl font-medium text-gray-900 dark:text-white mb-4",children:"Banner Image"}),e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("div",{className:"mb-4",children:b()?e.jsx("div",{className:"relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden",children:e.jsx("img",{src:b()?.src,alt:b()?.alt||"Banner image",className:"w-full h-full object-contain",style:{transform:`scale(${b()?.scale||1})`}})}):e.jsx("div",{className:"aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center",children:e.jsx("p",{className:"text-gray-500 dark:text-gray-400",children:"No banner image uploaded"})})}),b()&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",children:["Image Scale (",((b()?.scale||1)*100).toFixed(0),"%)"]}),e.jsx("input",{type:"range",min:"0.1",max:"2",step:"0.1",value:b()?.scale||1,onChange:E(b()?.id||""),className:"w-full"},`banner-scale-${b()?.id}-${b()?.scale}`)]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",children:"Display Text"}),e.jsx(U,{value:b()?.displayText||"",onChange:a=>O(b()?.id||"",a.target.value),placeholder:"Enter text to display on the banner",className:"w-full"})]}),e.jsx("div",{className:"flex justify-end",children:e.jsx(N,{variant:"danger",size:"sm",onClick:()=>M(b()?.id||""),children:"Remove Banner Image"})})]})]}),e.jsx("div",{children:e.jsx(B,{onFileSelect:K,accept:"image/*",title:"Upload Banner Image",description:"Drag and drop or click to upload a banner image",maxSize:5,isLoading:j?.contentType==="banner"})})]})})]}),e.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700",children:[e.jsx("h3",{className:"text-xl font-medium text-gray-900 dark:text-white mb-4",children:"Scanner Variations"}),e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[A().map(a=>e.jsx("div",{className:"group border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200",children:e.jsxs("div",{className:"p-4 space-y-4",children:[e.jsxs("div",{className:"relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden",children:[e.jsx("img",{src:a.src,alt:a.alt,className:"w-full h-full object-contain",style:{transform:`scale(${a.scale||1})`}}),e.jsx("button",{onClick:()=>M(a.id),className:"absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity",title:"Delete image",children:e.jsx(he,{className:"w-4 h-4"})})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",children:["Image Scale (",((a.scale||1)*100).toFixed(0),"%)"]}),e.jsx("input",{type:"range",min:"0.1",max:"2",step:"0.1",value:a.scale||1,onChange:E(a.id),className:"w-full"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",children:"Display Text"}),e.jsx(U,{value:a.displayText||"",onChange:t=>O(a.id,t.target.value),placeholder:"Enter text to display",className:"w-full"})]})]})},a.id)),e.jsx("div",{className:"border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm p-4",children:e.jsx(B,{onFileSelect:X,accept:"image/*",title:"Add Scanner Variation",description:"Drag and drop or click to upload",maxSize:5,isLoading:j?.contentType==="scanner"})})]})})]})]}),e.jsxs("section",{className:"space-y-8",children:[e.jsx("h2",{className:"text-2xl font-semibold text-gray-900 dark:text-white",children:"Template Builder"}),e.jsxs("div",{className:"space-y-6",children:[e.jsx(N,{onClick:r,children:"Add New Section"}),e.jsx(q,{axis:"y",values:v,onReorder:m,className:"space-y-4",children:v.map(a=>e.jsxs(ee,{value:a,className:"bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx(U,{value:a.title,onChange:t=>l(a.id,{title:t.target.value}),className:"text-lg font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800",placeholder:"Section Title"}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx(L,{label:"Mandatory",checked:a.isMandatory,onChange:t=>l(a.id,{isMandatory:t.target.checked})}),e.jsx(N,{variant:"danger",size:"sm",onClick:()=>d(a.id),children:"Delete Section"})]})]}),e.jsx(z,{value:a.code,onChange:t=>l(a.id,{code:t.target.value}),className:"w-full font-mono text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",rows:5,placeholder:"Enter section code here..."})]},a.id))})]})]}),e.jsxs("section",{className:"space-y-8",children:[e.jsx("h2",{className:"text-2xl font-semibold text-gray-900 dark:text-white",children:"Questions"}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex space-x-4",children:[e.jsx(N,{onClick:()=>k("text"),children:"Add Text Question"}),e.jsx(N,{onClick:()=>k("choice"),children:"Add Choice Question"}),e.jsx(N,{onClick:()=>k("boolean"),children:"Add Yes/No Question"})]}),e.jsx(F,{mode:"popLayout",children:e.jsx(y.div,{className:"space-y-8",children:i.map(a=>e.jsxs(y.div,{layout:!0,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,scale:.95},className:"bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700",children:[e.jsxs("div",{className:"flex justify-between items-start mb-6",children:[e.jsx(z,{value:a.text,onChange:t=>h(a.id,{text:t.target.value}),className:"w-full text-lg font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",placeholder:"Enter your question..."}),e.jsx(N,{variant:"danger",size:"sm",onClick:()=>p(a.id),className:"ml-4",children:"Delete"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",children:[e.jsx(L,{label:"Required Question",checked:a.required,onChange:t=>h(a.id,{required:t.target.checked})}),(a.type==="text"||a.type==="boolean")&&e.jsxs(P,{label:"Link to Code Section",value:a.linkedSectionId||"",onChange:t=>h(a.id,{linkedSectionId:t.target.value||void 0}),className:"text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",children:[e.jsx("option",{value:"",children:"None"}),v.map(t=>e.jsx("option",{value:t.id,children:t.title||`Section ${t.id}`},t.id))]})]}),a.type==="text"&&e.jsx(U,{label:"Placeholder Variable Name",value:a.placeholderVariable||"",onChange:t=>h(a.id,{placeholderVariable:t.target.value}),placeholder:"e.g., {{USER_INPUT}}",className:"text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 mb-6"}),a.type==="choice"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 dark:text-white",children:"Answer Options"}),e.jsx(N,{onClick:()=>W(a.id),children:"Add Option"})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:e.jsx(F,{mode:"popLayout",children:a.options?.map(t=>e.jsx(y.div,{layout:!0,initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:"group border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200",children:e.jsxs("div",{className:"p-4 space-y-4",children:[e.jsx(U,{label:"Option Text",value:t.text,onChange:_(a.id,t.id),placeholder:"Enter answer option text",className:"text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"}),e.jsxs(P,{label:"Link to Code Section",value:t.linkedSectionId||"",onChange:n=>H(a.id,t.id)(n),className:"text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",children:[e.jsx("option",{value:"",children:"None"}),v.map(n=>e.jsx("option",{value:n.id,children:n.title||`Section ${n.id}`},n.id))]}),e.jsx("div",{className:"pt-4",children:t.imageUrl?e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden",children:e.jsx("img",{src:t.imagePreview||t.imageUrl,alt:t.text||"Option image",className:"w-full h-full object-contain",style:{transform:`scale(${t.scale||1})`}})}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",children:["Image Scale (",((t.scale||1)*100).toFixed(0),"%)"]}),e.jsx("input",{type:"range",min:"0.1",max:"2",step:"0.1",value:t.scale||1,onChange:J(a.id,t.id),className:"w-full"})]}),e.jsx("div",{className:"flex justify-end",children:e.jsx(N,{variant:"danger",size:"sm",onClick:()=>G(a.id,t.id),children:"Remove Image"})})]}):e.jsx(B,{onFileSelect:n=>Y(a.id,t.id,n),accept:"image/*",title:"Add Answer Image",description:"Drag and drop or click to upload",maxSize:2,variant:"compact",isLoading:j?.questionId===a.id&&j?.optionId===t.id})})]})},t.id))})})]})]},a.id))})})]})]})]}):e.jsx("div",{className:"p-8 text-center text-gray-900 dark:text-white",children:"You don't have permission to access this page."})}export{ve as default};
