import{r as t,a as p,j as e,L as f}from"./vendor-react-CSSImZ_M.js";import{u as g}from"./index-Bph1kvnV.js";import{m as c}from"./vendor-framer-Cbqpt-xa.js";import"./vendor-other-B8UD1HAJ.js";import"./vendor-supabase-Be-ScRHE.js";const b={initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20}},S=()=>{const[r,d]=t.useState(""),[n,m]=t.useState(""),[l,i]=t.useState(""),[a,o]=t.useState(!1),{login:u}=g(),x=p(),h=async s=>{if(s.preventDefault(),!r.trim()||!n.trim()){i("Please enter both username and password");return}try{i(""),o(!0),await u(r,n),x("/wizard/step1")}catch{i("Failed to sign in. Please check your credentials.")}finally{o(!1)}};return e.jsxs(c.div,{variants:b,initial:"initial",animate:"animate",exit:"exit",className:"min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"sm:mx-auto sm:w-full sm:max-w-md",children:[e.jsx("h2",{className:"text-center text-3xl font-extrabold text-gray-900",children:"COMET Scanner Wizard"}),e.jsx("h3",{className:"mt-2 text-center text-xl text-gray-600",children:"Sign in to your account"})]}),e.jsx("div",{className:"mt-8 sm:mx-auto sm:w-full sm:max-w-md",children:e.jsxs("div",{className:"bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10",children:[l&&e.jsx(c.div,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},className:"rounded-md bg-red-50 p-4 mb-4",children:e.jsxs("div",{className:"flex",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("svg",{className:"h-5 w-5 text-red-400",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})})}),e.jsx("div",{className:"ml-3",children:e.jsx("p",{className:"text-sm text-red-700",children:l})})]})}),e.jsxs("form",{className:"space-y-6",onSubmit:h,children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"username",className:"block text-sm font-medium text-gray-700",children:"Username"}),e.jsx("div",{className:"mt-1",children:e.jsx("input",{id:"username",name:"username",type:"text",required:!0,value:r,onChange:s=>d(s.target.value),className:"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"})})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"password",className:"block text-sm font-medium text-gray-700",children:"Password"}),e.jsx("div",{className:"mt-1",children:e.jsx("input",{id:"password",name:"password",type:"password",required:!0,value:n,onChange:s=>m(s.target.value),className:"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"})})]}),e.jsx("div",{children:e.jsxs("button",{type:"submit",disabled:a,className:`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${a?"bg-blue-400 cursor-not-allowed":"bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"}`,children:[a?e.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}):null,a?"Signing in...":"Sign in"]})})]}),e.jsxs("div",{className:"mt-6",children:[e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-0 flex items-center",children:e.jsx("div",{className:"w-full border-t border-gray-300"})}),e.jsx("div",{className:"relative flex justify-center text-sm",children:e.jsx("span",{className:"px-2 bg-white text-gray-500",children:"New to COMET Scanner?"})})]}),e.jsx("div",{className:"mt-6 text-center",children:e.jsx(f,{to:"/signup",className:"text-blue-600 hover:text-blue-500 font-medium",children:"Create an account"})})]})]})})]})};export{S as default};
