"use strict";var e=require("os"),t=require("crypto"),i=require("fs/promises"),r=require("mime"),s=require("path"),a=require("url"),o=require("./utils.js"),n=require("fs"),c=require("assert");const h={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"};exports.FileRef=class{location;options;constructor(e,t={}){this.location=e,this.options=t}isUrl(e){return/^https?:\/\//.test(e)}async save(t=e.tmpdir(),i=!1){if(o.ensureDirSync(t),Buffer.isBuffer(this.location))return this.wrapWithDiscard(await this.saveFromBase64(t,this.location));if(this.isUrl(this.location)){const e=await this.saveFromUrl(t,new a.URL(this.location));return this.wrapWithDiscard(e)}return i?this.wrapWithDiscard(await this.saveFromFile(t)):{path:this.location,discard:()=>Promise.resolve()}}wrapWithDiscard(e){return{path:e,discard:()=>i.rm(e,{force:!0})}}getName(e){const i=this.options.name??e?.inferredName??t.randomUUID();let a=s.extname(i);return a?i:(a="dat",e?.mimeType&&(a=r.getExtension(e.mimeType)??a),`${i}.${a}`)}getSavingPath(e,t){const i=s.extname(t),r=s.basename(t,i);for(let t=0;;t++){const a=0===t?"":`-${t}`,o=s.join(e,`${r}${a}${i}`);if(!n.existsSync(o))return o}}async saveFromBase64(e,t){const r=t.toString("binary"),s=this.getName(),a=this.getSavingPath(e,s);return await i.writeFile(a,r,"binary"),a}async saveFromUrl(e,t){const r=s.basename(t.pathname);let a;const o="https:"===t.protocol?await import("https"):await import("http");return await new Promise(((s,c)=>{o.get(t,{headers:h},(t=>{const i=t.headers["content-disposition"]?.match(/attachment; filename="?(.+[^"])"?$/i)?.[1]??r,o=t.headers["content-type"],c=this.getName({mimeType:o,inferredName:i});a=this.getSavingPath(e,c);const h=n.createWriteStream(a);t.pipe(h),h.on("finish",(()=>{h.close(),s(a)}))})).on("error",(e=>{a?i.rm(a,{force:!0}).finally((()=>{c(e.message)})):c(e.message)}))}))}async saveFromFile(e){if(c("string"==typeof this.location,"impossible"),!n.existsSync(this.location))return Promise.reject(new Error(`Source file ${this.location} doesn't exist`));const t=this.getName({inferredName:s.basename(this.location)}),r=this.getSavingPath(e,t);return await i.cp(this.location,r,{force:!0}),r}};
