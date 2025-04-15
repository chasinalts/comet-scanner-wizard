import{a as l}from"./vendor-react-CTBdW232.js";import{j as a,m as b}from"./vendor-ui-B2A3YeRo.js";const S=(s,e)=>{const c=URL.createObjectURL(s),r=new FileReader;r.onloadend=()=>{const n=r.result;e(n,c)},r.readAsDataURL(s)},x=s=>{s.startsWith("blob:")&&URL.revokeObjectURL(s)},p=()=>{const[s,e]=l.useState(()=>{const t=localStorage.getItem("admin_questions");return t?JSON.parse(t):[]});return l.useEffect(()=>{localStorage.setItem("admin_questions",JSON.stringify(s))},[s]),l.useEffect(()=>()=>{s.forEach(t=>{t.options?.forEach(o=>{o.imagePreview&&x(o.imagePreview)})})},[s]),{questions:s,setQuestions:e,addQuestion:t=>{const o={id:`question-${Date.now()}`,type:t,text:"",required:!1,...t==="choice"&&{options:[]},...t==="text"&&{placeholderVariable:""}};e(d=>[...d,o])},updateQuestion:(t,o)=>{e(d=>d.map(i=>i.id===t?{...i,...o}:i))},deleteQuestion:t=>{e(o=>o.filter(d=>d.id!==t))}}},j=()=>{const[s,e]=l.useState(()=>{const o=localStorage.getItem("admin_sections");return o?JSON.parse(o):[]});return l.useEffect(()=>{localStorage.setItem("admin_sections",JSON.stringify(s))},[s]),{sections:s,setSections:e,addSection:()=>{const o={id:`section-${Date.now()}`,title:"New Section",code:"",isMandatory:!1};e(d=>[...d,o])},updateSection:(o,d)=>{e(i=>i.map(m=>m.id===o?{...m,...d}:m))},deleteSection:o=>{e(d=>d.filter(i=>i.id!==o))},reorderSections:o=>{e(o)}}},u=({label:s,error:e,helperText:c,required:r,children:n,fullWidth:t=!1})=>a.jsxs("div",{className:`${t?"w-full":""} space-y-1`,children:[s&&a.jsxs("label",{className:"block text-sm font-medium text-gray-700",children:[s,r&&a.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),a.jsx("div",{className:"mt-1",children:n}),(e||c)&&a.jsx("div",{className:"mt-1",children:e?a.jsx(b.p,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},className:"text-sm text-red-600",children:e}):c?a.jsx("p",{className:"text-sm text-gray-500",children:c}):null})]}),h=({label:s,error:e,helperText:c,required:r,fullWidth:n,...t})=>a.jsx(u,{label:s,error:e,helperText:c,required:r,fullWidth:n,children:a.jsx("input",{className:`
          block rounded-md shadow-sm
          ${n?"w-full":"w-auto"}
          ${e?"border-red-500 focus:ring-red-500 focus:border-red-500":"border-gray-300 focus:ring-blue-500 focus:border-blue-500"}
          disabled:bg-gray-50 disabled:text-gray-500
        `,...t})}),y=({label:s,error:e,helperText:c,required:r,fullWidth:n,...t})=>a.jsx(u,{label:s,error:e,helperText:c,required:r,fullWidth:n,children:a.jsx("textarea",{className:`
          block rounded-md shadow-sm
          ${n?"w-full":"w-auto"}
          ${e?"border-red-500 focus:ring-red-500 focus:border-red-500":"border-gray-300 focus:ring-blue-500 focus:border-blue-500"}
          disabled:bg-gray-50 disabled:text-gray-500
        `,...t})}),w=({label:s,error:e,helperText:c,required:r,fullWidth:n,children:t,...o})=>a.jsx(u,{label:s,error:e,helperText:c,required:r,fullWidth:n,children:a.jsx("select",{className:`
          block rounded-md shadow-sm
          ${n?"w-full":"w-auto"}
          ${e?"border-red-500 focus:ring-red-500 focus:border-red-500":"border-gray-300 focus:ring-blue-500 focus:border-blue-500"}
          disabled:bg-gray-50 disabled:text-gray-500
        `,...o,children:t})}),N=({label:s,error:e,helperText:c,required:r,...n})=>a.jsx(u,{error:e,helperText:c,required:r,children:a.jsxs("div",{className:"flex items-center",children:[a.jsx("input",{type:"checkbox",className:`
            rounded border-gray-300 text-blue-600 shadow-sm
            focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50
            ${e?"border-red-500":""}
          `,...n}),s&&a.jsxs("label",{className:"ml-2 block text-sm text-gray-900",children:[s,r&&a.jsx("span",{className:"text-red-500 ml-1",children:"*"})]})]})});export{N as C,w as S,h as T,j as a,y as b,S as h,p as u};
