const r=(e,s)=>{const t=URL.createObjectURL(e),a=new FileReader;a.onloadend=()=>{const o=a.result;console.log("Image uploaded:",{fileName:e.name,fileSize:e.size,fileType:e.type,imageUrlPrefix:o.substring(0,30)+"...",imagePreview:t}),s(o,t)},a.readAsDataURL(e)},n=e=>{e.startsWith("blob:")&&URL.revokeObjectURL(e)};export{n as c,r as h};
//# sourceMappingURL=imageHandlers-mTahlW39.js.map
