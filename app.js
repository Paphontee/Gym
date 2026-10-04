/* สมุดยิม: PWA สำหรับบันทึกการเล่นยิม ข้อมูลเก็บในเครื่อง (localStorage) และซิงก์กับ Google Drive ได้ถ้าตั้งค่าไว้ */
/* ---------- default program ---------- */
const DEFAULT_PROGRAM = {days:[
  {id:'mon',name:'วันจันทร์',wd:1,title:'Upper หนัก + ขา 1 ท่า',light:false,ex:[
    {id:'m1',n:'Squat',alt:'หรือ leg press',sets:3,lo:6,hi:8,rest:150,inc:5,unit:'kg'},
    {id:'m2',n:'Bench press',alt:'',sets:3,lo:6,hi:8,rest:150,inc:2.5,unit:'kg'},
    {id:'m3',n:'Barbell row',alt:'หรือ chest-supported row',sets:3,lo:8,hi:10,rest:120,inc:2.5,unit:'kg'},
    {id:'m4',n:'Dumbbell shoulder press',alt:'',sets:3,lo:8,hi:10,rest:90,inc:2,unit:'kg'},
    {id:'m5',n:'Lat pulldown',alt:'',sets:3,lo:10,hi:12,rest:90,inc:2.5,unit:'kg'},
    {id:'m6',n:'Dumbbell curl',alt:'',sets:2,lo:10,hi:12,rest:60,inc:1,unit:'kg'},
    {id:'m7',n:'Triceps pushdown',alt:'',sets:2,lo:10,hi:12,rest:60,inc:2.5,unit:'kg'}]},
  {id:'wed',name:'วันพุธ',wd:3,title:'ขา 2 ท่า + Upper เสริม',light:false,ex:[
    {id:'w1',n:'Romanian deadlift',alt:'',sets:3,lo:8,hi:10,rest:120,inc:5,unit:'kg'},
    {id:'w2',n:'Leg curl',alt:'หรือ walking lunge',sets:3,lo:10,hi:12,rest:90,inc:2.5,unit:'kg'},
    {id:'w3',n:'Incline dumbbell press',alt:'',sets:3,lo:8,hi:10,rest:120,inc:2,unit:'kg'},
    {id:'w4',n:'Pull-up',alt:'หรือ assisted pull-up',sets:3,lo:6,hi:10,rest:120,inc:2.5,unit:'bw'},
    {id:'w5',n:'Seated cable row',alt:'',sets:3,lo:10,hi:12,rest:90,inc:2.5,unit:'kg'},
    {id:'w6',n:'Lateral raise',alt:'',sets:3,lo:12,hi:15,rest:60,inc:1,unit:'kg'},
    {id:'w7',n:'Plank',alt:'หรือ cable crunch',sets:2,lo:30,hi:45,rest:60,inc:0,unit:'sec'}]},
  {id:'fri',name:'วันศุกร์',wd:5,title:'Upper เบา ไม่มีขา',light:true,ex:[
    {id:'f1',n:'Machine chest press',alt:'',sets:3,lo:10,hi:12,rest:75,inc:2.5,unit:'kg'},
    {id:'f2',n:'Close-grip lat pulldown',alt:'หรือ machine row',sets:3,lo:10,hi:12,rest:75,inc:2.5,unit:'kg'},
    {id:'f3',n:'Dumbbell shoulder press',alt:'',sets:2,lo:10,hi:12,rest:75,inc:2,unit:'kg'},
    {id:'f4',n:'Lateral raise',alt:'',sets:3,lo:12,hi:15,rest:60,inc:1,unit:'kg'},
    {id:'f5',n:'Incline dumbbell curl',alt:'',sets:3,lo:10,hi:12,rest:60,inc:1,unit:'kg'},
    {id:'f6',n:'Overhead triceps extension',alt:'',sets:3,lo:10,hi:12,rest:60,inc:1,unit:'kg'},
    {id:'f7',n:'Face pull',alt:'',sets:2,lo:15,hi:15,rest:60,inc:2.5,unit:'kg'}]}
], archive:{}};
const APP_VERSION='v7'; // keep in step with VERSION in sw.js
const COLORS=['--accent','--teal','--green','--purple','--yellow','--red','--blue'];
const TH_DAY=['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
const TH_SHORT=['จ','อ','พ','พฤ','ศ','ส','อา'];
const TH_MON=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const PRESETS=[
  {name:'ไข่ไก่ 1 ฟอง',p:6,k:75,c:0.5,f:5},{name:'อกไก่สุก 100 g',p:31,k:165,c:0,f:3.6},{name:'นมจืด 200 ml',p:7,k:130,c:10,f:7},
  {name:'เวย์ 1 สกู๊ป',p:24,k:120,c:3,f:1.5},{name:'ข้าวสวย 1 ทัพพี',p:2,k:80,c:17,f:0.2},{name:'กะเพราไก่ไข่ดาว',p:28,k:600,c:65,f:25},
  {name:'นมถั่วเหลือง 250 ml',p:8,k:120,c:10,f:4},{name:'กล้วยหอม 1 ลูก',p:1.3,k:105,c:27,f:0.4}];
const ACT=[{v:1.2,l:'นั่งทำงานหรือเรียน แทบไม่ได้ออกกำลัง'},{v:1.375,l:'ออกกำลัง 1–3 วันต่อสัปดาห์'},{v:1.55,l:'ออกกำลัง 3–5 วันต่อสัปดาห์ หรือเดินเยอะทุกวัน'},{v:1.725,l:'ออกกำลังหนัก 6–7 วันต่อสัปดาห์'},{v:1.9,l:'งานใช้แรงหนัก และซ้อมทุกวัน'}];
const GOALS={cut:{l:'ลดไขมัน',adj:-0.15,p:2.2,d:'กินน้อยกว่าที่ใช้ประมาณ 15% โปรตีนสูงเพื่อรักษากล้าม'},maint:{l:'คงน้ำหนัก',adj:0,p:2.0,d:'กินเท่าที่ใช้ เหมาะกับการสร้างกล้ามไปพร้อมลดไขมันช้าๆ (recomposition)'},lean:{l:'เพิ่มกล้ามแบบลีน',adj:0.10,p:1.8,d:'กินเกินประมาณ 10% ไขมันขึ้นน้อย'},bulk:{l:'เพิ่มกล้ามเร็ว',adj:0.15,p:1.8,d:'กินเกินประมาณ 15% น้ำหนักขึ้นเร็ว แต่ไขมันขึ้นตามมากกว่า'}};

/* ---------- utils ---------- */
const $=s=>document.querySelector(s);
const pad=n=>String(n).padStart(2,'0');
const keyOf=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fromKey=k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)};
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const monday=d=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x};
const daysBetween=(a,b)=>Math.round((fromKey(b)-fromKey(a))/864e5);
const thDate=d=>`${d.getDate()} ${TH_MON[d.getMonth()]}`;
const thDateY=d=>`${d.getDate()} ${TH_MON[d.getMonth()]} ${d.getFullYear()+543}`;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>{const x=parseFloat(v);return isFinite(x)?x:null};
const fmt=n=>{if(n==null||!isFinite(n))return '–';return (Math.round(n*10)/10).toLocaleString('th-TH')};
const r05=n=>Math.round(n*2)/2;
const e1rm=s=>(s.w>0&&s.r>0)?s.w*(1+Math.min(s.r,15)/30):0;
const todayKey=()=>keyOf(new Date());
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const clone=o=>JSON.parse(JSON.stringify(o));
const fmtRest=s=>{s=+s||0;if(s<120&&s%60!==0||s<60)return `${s} วินาที`;return `${fmt(s/60)} นาที`};
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('show'),2000)}

/* ---------- state ---------- */
const S={profile:{},sessions:{},food:{},view:'today',dayPick:null,foodDate:null,weekOff:0,draft:null,fallback:null,sheet:null};
const prog=()=>S.profile.program||DEFAULT_PROGRAM;
const days=()=>prog().days;
const dayOf=id=>days().find(d=>d.id===id)||null;
const colorOf=id=>{const i=days().findIndex(d=>d.id===id);return i<0?'--muted':COLORS[i%COLORS.length]};
function exMap(){const m={};const a=prog().archive||{};Object.keys(a).forEach(k=>m[k]=Object.assign({archived:true},a[k]));days().forEach(d=>d.ex.forEach(e=>m[e.id]=Object.assign({day:d.id},e)));return m}
const schedDay=date=>days().find(d=>d.wd===date.getDay())||null;

/* ---------- storage (this device) ---------- */
const LS='gymlog3:v1', LS_BK='gymlog3:lastBackup', LS_DRIVE='gymlog3:drive', LS_DRIVE_LAST='gymlog3:driveLast';
function lsLoad(){try{const d=JSON.parse(localStorage.getItem(LS)||'null');if(d){S.profile=d.profile||{};S.sessions=d.sessions||{};S.food=d.food||{}}}catch(e){}}
function lsSave(){
  try{localStorage.setItem(LS,JSON.stringify({profile:S.profile,sessions:S.sessions,food:S.food}))}
  catch(e){toast('พื้นที่ในเครื่องเต็ม ดาวน์โหลดไฟล์สำรองไว้ก่อน')}
  if(!lsSave.asked&&navigator.storage&&navigator.storage.persist){lsSave.asked=true;navigator.storage.persist().catch(()=>{})}
}
function save(kind,id){
  const now=Date.now();
  if(kind==='p')S.profile.savedAt=now;
  if(kind==='s'&&S.sessions[id])S.sessions[id].savedAt=now;
  if(kind==='f'&&S.food[id])S.food[id].savedAt=now;
  lsSave();Drive.schedule();
}
/* merge another copy (backup file or Drive) into local data: newer savedAt wins per day */
function mergeIn(o){
  let n=0;
  const mm=(src,dst)=>Object.keys(src||{}).forEach(k=>{const v=src[k];if(!v||typeof v!=='object')return;if(!dst[k]||(v.savedAt||0)>(dst[k].savedAt||0)){dst[k]=clone(v);n++}});
  mm(o.sessions,S.sessions);mm(o.food,S.food);
  if(o.profile&&(o.profile.savedAt||0)>(S.profile.savedAt||0)){S.profile=clone(o.profile);n++}
  lsSave();return n;
}

/* ---------- Google Drive sync (optional, your own Drive) ----------
   Stores one file, gymlog-data.json, in the app's hidden folder (appDataFolder).
   Needs a Google OAuth client ID in config.js. Nothing goes to any other server. */
const Drive={
  token:null,exp:0,fileId:null,busy:false,timer:null,err:null,
  enabled(){return !!(window.GYMLOG_CONFIG&&GYMLOG_CONFIG.googleClientId)},
  connected(){try{return localStorage.getItem(LS_DRIVE)==='on'}catch(e){return false}},
  last(){try{return +localStorage.getItem(LS_DRIVE_LAST)||0}catch(e){return 0}},
  valid(){return !!this.token&&Date.now()<this.exp-60000},
  loadGis(){return new Promise((res,rej)=>{
    if(window.google&&google.accounts&&google.accounts.oauth2)return res();
    const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.async=true;s.onload=()=>res();s.onerror=()=>rej(new Error('gis'));document.head.appendChild(s)})},
  async auth(){
    await this.loadGis();
    return new Promise((res,rej)=>{
      const tc=google.accounts.oauth2.initTokenClient({client_id:GYMLOG_CONFIG.googleClientId,scope:'https://www.googleapis.com/auth/drive.appdata',
        callback:r=>{if(r.error)return rej(new Error('auth'));this.token=r.access_token;this.exp=Date.now()+(+r.expires_in||3600)*1000;res()},
        error_callback:()=>rej(new Error('auth'))});
      tc.requestAccessToken({prompt:this.connected()?'':'consent'});
    });
  },
  async api(url,opt={}){
    const r=await fetch(url,Object.assign({},opt,{headers:Object.assign({Authorization:'Bearer '+this.token},opt.headers||{})}));
    if(r.status===401||r.status===403){this.token=null;throw new Error('auth')}
    if(!r.ok)throw new Error('http');return r;
  },
  async findFile(){
    const q=encodeURIComponent("name='gymlog-data.json' and trashed=false");
    const j=await (await this.api(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id)`)).json();
    return j.files&&j.files[0]?j.files[0].id:null;
  },
  async upload(){
    const body=JSON.stringify(backupObj());
    if(this.fileId){await this.api(`https://www.googleapis.com/upload/drive/v3/files/${this.fileId}?uploadType=media`,{method:'PATCH',headers:{'Content-Type':'application/json'},body});return}
    const meta={name:'gymlog-data.json',parents:['appDataFolder'],mimeType:'application/json'},b='gymlog'+Date.now();
    const mp=`--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n--${b}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${b}--`;
    const r=await this.api('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',{method:'POST',headers:{'Content-Type':'multipart/related; boundary='+b},body:mp});
    this.fileId=(await r.json()).id;
  },
  /* interactive=true only from a tap (Google's sign-in popup needs a user gesture) */
  async sync(interactive){
    if(!this.enabled()||this.busy||!navigator.onLine)return;
    if(!this.valid()&&!interactive){this.err='needauth';renderStatus();return}
    this.busy=true;this.err=null;renderStatus();
    try{
      if(!this.valid())await this.auth();
      localStorage.setItem(LS_DRIVE,'on');
      if(!this.fileId)this.fileId=await this.findFile();
      let n=0;
      if(this.fileId){const remote=await (await this.api(`https://www.googleapis.com/drive/v3/files/${this.fileId}?alt=media`)).json();if(remote&&remote.sessions)n=mergeIn(remote)}
      await this.upload();
      localStorage.setItem(LS_DRIVE_LAST,String(Date.now()));
      if(n&&!/editor|calc/.test(S.view)){const ae=document.activeElement;if(!(ae&&/INPUT|SELECT|TEXTAREA/.test(ae.tagName)))render()}
    }catch(e){this.err=e&&e.message==='auth'?'needauth':'fail'}
    this.busy=false;renderStatus();
  },
  schedule(){if(!this.connected())return;if(!this.valid()){this.err='needauth';return}clearTimeout(this.timer);this.timer=setTimeout(()=>this.sync(false),3000)},
  disconnect(){
    try{if(this.token&&window.google)google.accounts.oauth2.revoke(this.token,()=>{})}catch(e){}
    this.token=null;this.fileId=null;this.err=null;try{localStorage.removeItem(LS_DRIVE)}catch(e){}renderStatus();
  }
};
window.addEventListener('online',()=>Drive.schedule());
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&Drive.connected()&&Drive.valid())Drive.sync(false)});

/* ---------- workout logic ---------- */
function activeDay(){
  const s=S.sessions[todayKey()];
  if(s&&s.day&&dayOf(s.day)) return dayOf(s.day);
  if(S.dayPick&&dayOf(S.dayPick)) return dayOf(S.dayPick);
  return schedDay(new Date());
}
function ensureSession(day){const k=todayKey();if(!S.sessions[k])S.sessions[k]={date:k,day:day.id,sets:{}};return S.sessions[k]}
function setsFor(sess,ex){
  let a=sess.sets[ex.id];
  if(!a){a=sess.sets[ex.id]=[]}
  while(a.length<ex.sets)a.push({w:null,r:null,done:false});
  return a;
}
function histOf(exId,beforeKey){
  return Object.keys(S.sessions).filter(k=>!beforeKey||k<beforeKey).sort()
    .map(k=>({key:k,sets:((S.sessions[k].sets||{})[exId]||[]).filter(s=>s.done)})).filter(h=>h.sets.length);
}
function topOf(ex,sets){
  if(ex.unit==='kg') return sets.reduce((a,b)=>e1rm(b)>e1rm(a)?b:a,sets[0]);
  return sets.reduce((a,b)=>((b.w||0)>(a.w||0)||((b.w||0)===(a.w||0)&&(b.r||0)>(a.r||0)))?b:a,sets[0]);
}
function scoreOf(ex,sets){const t=topOf(ex,sets);if(!t)return 0;return ex.unit==='kg'?e1rm(t):(t.w||0)*1000+(t.r||0)}
function sparkVal(ex,sets){const t=topOf(ex,sets);return ex.unit==='kg'?e1rm(t):(t.r||0)}
const fmtTop=(ex,s)=>!s?'–':ex.unit==='sec'?`${s.r||0} วินาที`:ex.unit==='bw'?((s.w||0)>0?`+${fmt(s.w)} kg × ${s.r||0}`:`${s.r||0} ครั้ง`):`${fmt(s.w)} kg × ${s.r||0}`;
function suggest(ex){
  const h=histOf(ex.id,todayKey()); const last=h[h.length-1];
  if(!last) return {w:null,up:false,text:ex.unit==='sec'?`เริ่มที่ ${ex.lo} วินาที แล้วค่อยเพิ่ม`:`ครั้งแรก: เลือกน้ำหนักที่ทำได้ ${ex.lo}–${ex.hi} ครั้งโดยยังเหลือแรง 1–2 ครั้ง`};
  const ds=last.sets,d=fromKey(last.key),reps=ds.map(s=>s.r||0).join(', ');
  const allTop=ds.length>=ex.sets&&ds.every(s=>(s.r||0)>=ex.hi);
  if(ex.unit==='sec') return allTop?{w:null,up:true,text:`ครั้งก่อนได้ครบ ${ex.hi} วินาที ลองเพิ่มเวลาหรือเปลี่ยนเป็นท่าที่ยากขึ้น`}:{w:null,up:false,text:`ครั้งก่อน (${thDate(d)}) ทำได้ ${reps} วินาที`};
  const topW=Math.max(...ds.map(s=>s.w||0));
  if(!topW){
    if(ex.unit==='bw') return allTop?{w:null,up:true,text:`ครั้งก่อนได้ครบ ${ex.hi} ครั้งทุกเซ็ต ลองถ่วงน้ำหนักเพิ่ม หรือลดแรงช่วยลง`}:{w:null,up:false,text:`ครั้งก่อน (${thDate(d)}) ทำได้ ${reps} ครั้ง พยายามเพิ่มอีก 1–2 ครั้ง`};
    return {w:null,up:false,text:`ครั้งก่อน (${thDate(d)}) ทำได้ ${reps} ครั้ง ใส่น้ำหนักด้วย แอปจะบอกได้ว่าเมื่อไหร่ควรเพิ่ม`};
  }
  if(allTop&&ex.inc){const nw=r05(topW+ex.inc);return {w:nw,up:true,text:`ครั้งก่อน ${fmt(topW)} kg ครบ ${ex.hi} ครั้งทุกเซ็ต วันนี้เพิ่มเป็น ${fmt(nw)} kg`}}
  return {w:topW,up:false,text:`ครั้งก่อน (${thDate(d)}) ${fmt(topW)} kg × ${reps} ใช้น้ำหนักเดิม พยายามเพิ่มอีก 1–2 ครั้ง`};
}
function dayProgress(sess,day){let total=0,done=0;day.ex.forEach(ex=>{const a=sess&&sess.sets[ex.id];total+=Math.max(ex.sets,a?a.length:0);if(a)done+=a.filter(s=>s.done).length});return {total,done}}

/* progressive overload status */
function overload(ex){
  const h=histOf(ex.id);
  if(h.length<2) return {cls:'na',label:'ข้อมูลยังน้อย',text:h.length?'บันทึกอีกอย่างน้อย 1 ครั้งเพื่อเริ่มเทียบ':'ยังไม่เคยบันทึกท่านี้',h};
  const sc=h.map(x=>scoreOf(ex,x.sets));
  const max=Math.max(...sc), bi=sc.indexOf(max);
  const since=h.length-1-bi, last=sc[sc.length-1], prevMax=Math.max(...sc.slice(0,-1));
  if(last>prevMax) return {cls:'up',label:'เพิ่มขึ้น',text:'ครั้งล่าสุดทำได้ดีที่สุดเท่าที่เคยบันทึก',h};
  if(ex.unit==='kg'&&last<max*0.95&&since>=2) return {cls:'down',label:'ลดลง',text:'ทำได้น้อยกว่าสถิติเกิน 5% เช็กการนอน การกิน และความล้าสะสม',h};
  if(since>=3) return {cls:'stall',label:'ติดที่เดิม',text:`ไม่ทำลายสถิติมา ${since} ครั้งแล้ว ลองลดน้ำหนักลงประมาณ 10% แล้วไต่ขึ้นใหม่ หรือเปลี่ยนเป็นท่าทดแทน`,h};
  return {cls:'ok',label:'ปกติ',text:since?`ยังไม่ทำลายสถิติ ${since} ครั้ง ยังถือว่าปกติ`:'ทรงตัวที่สถิติเดิม',h};
}
function sparkSVG(vals,colorVar){
  if(vals.length<2) return '';
  const W=300,H=56,p=6,mn=Math.min(...vals),mx=Math.max(...vals),rg=mx-mn||1;
  const pts=vals.map((v,i)=>[p+i*(W-2*p)/(vals.length-1),H-p-(v-mn)/rg*(H-2*p)]);
  const d=pts.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' ');
    return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="var(${colorVar})" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>`;
}

/* goals */
function goalInfo(g,EXM){
  const ex=EXM[g.ex]; if(!ex) return null;
  const h=histOf(g.ex); let achieved=null, bestAt=null;
  h.forEach(x=>x.sets.forEach(s=>{if((s.w||0)>=g.kg&&(s.r||0)>=g.reps&&!achieved)achieved=x.key;if((s.r||0)>=g.reps&&(!bestAt||(s.w||0)>(bestAt.w||0)))bestAt=s}));
  if(ex.unit==='bw'){
    let bestR=0;h.forEach(x=>x.sets.forEach(s=>{if((s.w||0)>=g.kg)bestR=Math.max(bestR,s.r||0)}));
    return {ex,achieved,pct:Math.min(100,bestR/g.reps*100),now:`ทำได้สูงสุด ${bestR} ครั้ง${g.kg>0?` ที่ +${fmt(g.kg)} kg`:''}`,eta:null};
  }
  const goalE=g.kg*(1+Math.min(g.reps,15)/30);
  const pts=h.map(x=>({k:x.key,e:Math.max(...x.sets.map(e1rm))})).filter(p=>p.e>0);
  const curE=pts.length?Math.max(...pts.map(p=>p.e)):0;
  const eqW=curE/(1+Math.min(g.reps,15)/30);
  let eta=null;
  const recent=pts.filter(p=>daysBetween(p.k,todayKey())<=56);
  if(!achieved&&recent.length>=3&&daysBetween(recent[0].k,recent[recent.length-1].k)>=14){
    const xs=recent.map(p=>daysBetween(recent[0].k,p.k)),ys=recent.map(p=>p.e),n=xs.length;
    const mx=xs.reduce((a,b)=>a+b)/n,my=ys.reduce((a,b)=>a+b)/n;
    let num_=0,den=0;xs.forEach((x,i)=>{num_+=(x-mx)*(ys[i]-my);den+=(x-mx)**2});
    const slope=den?num_/den:0;
    if(slope>0.005){const dd=Math.ceil((goalE-curE)/slope);eta=addDays(new Date(),Math.max(0,dd))}
    else eta='flat';
  }
  return {ex,achieved,pct:Math.min(100,curE/goalE*100),now:curE?`ตอนนี้เทียบได้ประมาณ ${fmt(r05(eqW))} kg × ${g.reps} (คำนวณจากเซ็ตที่ดีที่สุด)`:'ยังไม่มีบันทึกท่านี้',bestAt,eta};
}

/* ---------- rest timer ---------- */
const T={end:0,iv:null};
function startTimer(sec,label){T.end=Date.now()+sec*1000;$('#tMsg').textContent=label;$('#timer').hidden=false;$('#timer').classList.remove('over');clearInterval(T.iv);T.iv=setInterval(tick,250);tick()}
function tick(){const left=Math.round((T.end-Date.now())/1000),el=$('#timer');
  if(left<=0){if(!el.classList.contains('over')){el.classList.add('over');$('#tMsg').textContent='ได้เวลาเซ็ตถัดไป';try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}}$('#tTime').textContent='0:00';if(left<-30)stopTimer();return}
  $('#tTime').textContent=Math.floor(left/60)+':'+pad(left%60)}
function stopTimer(){clearInterval(T.iv);$('#timer').hidden=true}

/* ---------- render ---------- */
function setDayColor(day){document.documentElement.style.setProperty('--day',day?`var(${colorOf(day.id)})`:'var(--accent)')}
function ringSVG(done,total,label){const r=34,c=2*Math.PI*r,p=total?done/total:0;
  return `<svg class="ring" viewBox="0 0 84 84" role="img" aria-label="${esc(label)}"><circle cx="42" cy="42" r="${r}" fill="none" stroke="var(--line)" stroke-width="9"/><circle cx="42" cy="42" r="${r}" fill="none" stroke="var(--day)" stroke-width="9" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p)}" transform="rotate(-90 42 42)"/><circle cx="42" cy="42" r="9" fill="var(--bg)" stroke="var(--line)" stroke-width="2"/></svg>`}
function renderTop(){
  const now=new Date(),dateLine=`${TH_DAY[now.getDay()]} ${thDate(now)}`;let h;
  if(S.view==='today'){const day=activeDay();
    if(day){const {done,total}=dayProgress(S.sessions[todayKey()],day);
      h=`<div><p class="date">${dateLine}</p><h1>${esc(day.name)}</h1><p class="sub">${esc(day.title)}<br>ทำแล้ว ${done} จาก ${total} เซ็ต</p></div>${ringSVG(done,total,`ทำแล้ว ${done} จาก ${total} เซ็ต`)}`}
    else h=`<div><p class="date">${dateLine}</p><h1>วันพัก</h1><p class="sub">ฟื้นตัววันนี้ แล้วค่อยลุยวันถัดไป</p></div>${ringSVG(0,0,'วันพัก')}`}
  else{const t={food:'อาหาร',progress:'พัฒนาการ',report:'สรุปสัปดาห์',settings:'ตั้งค่า',editor:'แก้ไขโปรแกรม',calc:'คำนวณสารอาหาร'}[S.view];h=`<div><p class="date">${dateLine}</p><h1>${t}</h1></div>`}
  $('#top').innerHTML=h;
}
function nextWorkout(){for(let i=1;i<=7;i++){const d=addDays(new Date(),i),k=schedDay(d);if(k)return {d,k}}return null}
function lastBackup(){try{return +localStorage.getItem(LS_BK)||0}catch(e){return 0}}
function lastBackupTxt(){const t=lastBackup();return `<p class="muted" style="font-size:14px">${t?`สำรองล่าสุด ${thDate(new Date(t))}`:'ยังไม่เคยดาวน์โหลดไฟล์สำรอง'}</p>`}
function backupNudge(){
  if(Drive.connected())return '';const has=Object.keys(S.sessions).length+Object.keys(S.food).length;if(!has)return '';
  const t=lastBackup();if(t&&Date.now()-t<7*864e5)return '';
  return `<section class="panel" style="display:flex;gap:10px;align-items:center;justify-content:space-between"><span style="font-size:14px">${t?`สำรองข้อมูลล่าสุดเมื่อ ${thDate(new Date(t))}`:'ยังไม่ได้สำรองข้อมูล'} เก็บไฟล์ไว้ใน Drive กันหาย</span><button type="button" class="btn" data-act="exjson" style="flex:none">สำรองเลย</button></section>`;
}
function renderToday(){
  const day=activeDay();setDayColor(day);
  const sess=S.sessions[todayKey()];
  const chips=`<div class="chips" role="group" aria-label="เลือกตาราง">${days().map(d=>`<button type="button" class="chip" data-act="pick" data-day="${esc(d.id)}" aria-pressed="${!!day&&d.id===day.id}">${esc(d.name)}</button>`).join('')}</div>`;
  if(!day){const n=nextWorkout();
    return backupNudge()+`<section class="panel">${n?`<h2>ครั้งถัดไป: ${esc(n.k.name)} ${thDate(n.d)}</h2><p class="muted">${esc(n.k.title)}</p>`:`<h2>ยังไม่มีวันฝึกในโปรแกรม</h2>`}<p class="muted">ถ้าวันนี้จะเล่นชดเชย เลือกตารางด้านล่างได้เลย</p></section>${chips}`}
  let h=backupNudge()+chips;
  h+=`<p class="note">${day.light?'วันเบา: ทุกเซ็ตเหลือแรงไว้ 2–3 ครั้ง ถ้าคาบพละหนัก ทำแค่ 2 เซ็ตต่อท่าก็พอ':'เซ็ตสุดท้ายของแต่ละท่าให้เหลือแรงไว้ 1–2 ครั้ง กด ✓ เมื่อจบเซ็ตเพื่อเริ่มจับเวลาพัก'}</p>`;
  if(!day.ex.length) h+=`<section class="panel"><p class="muted">วันนี้ยังไม่มีท่า ไปที่ ตั้งค่า > แก้ไขโปรแกรม เพื่อเพิ่มท่า</p></section>`;
  day.ex.forEach((ex,i)=>{
    const sg=suggest(ex),sec=ex.unit==='sec';
    const base=sess&&sess.sets[ex.id]?sess.sets[ex.id]:[];
    const arr=base.slice();while(arr.length<ex.sets)arr.push({w:null,r:null,done:false});
    h+=`<article class="ex"><div class="ex-head"><span class="ex-num" aria-hidden="true">${i+1}</span><div>
      <h3 class="ex-name"><button type="button" class="nm-btn" data-act="hist" data-ex="${esc(ex.id)}" aria-label="ดูประวัติ ${esc(ex.n)}">${esc(ex.n)}<span class="chev" aria-hidden="true">›</span></button> ${ex.alt?`<small>${esc(ex.alt)}</small>`:''}</h3>
      <p class="ex-target">${ex.sets} × ${ex.lo===ex.hi?ex.lo:ex.lo+'–'+ex.hi}${sec?' วินาที':''}, พัก ${fmtRest(ex.rest)}${ex.unit==='kg'?`<button type="button" class="plbtn" data-act="plate" data-ex="${esc(ex.id)}" aria-label="คิดแผ่นน้ำหนัก ${esc(ex.n)}">แผ่น</button>`:''}</p>
      <p class="hint ${sg.up?'up':''}">${esc(sg.text)}</p></div></div><div class="sets">`;
    arr.forEach((s,j)=>{
      h+=`<div class="set ${s.done?'done':''} ${sec?'sec':''}"><span class="sn">${j+1}</span>
        ${sec?'':`<label class="f"><input type="number" inputmode="decimal" step="0.5" min="0" aria-label="${esc(ex.n)} เซ็ต ${j+1} น้ำหนัก" data-ex="${esc(ex.id)}" data-i="${j}" data-k="w" value="${s.w??''}" placeholder="${sg.w??''}"><span>${ex.unit==='bw'?'kg ถ่วง':'kg'}</span></label>`}
        <label class="f"><input type="number" inputmode="numeric" min="0" aria-label="${esc(ex.n)} เซ็ต ${j+1} ${sec?'วินาที':'ครั้ง'}" data-ex="${esc(ex.id)}" data-i="${j}" data-k="r" value="${s.r??''}" placeholder="${ex.lo}"><span>${sec?'วิ':'ครั้ง'}</span></label>
        <button type="button" class="tick" data-act="tick" data-ex="${esc(ex.id)}" data-i="${j}" aria-pressed="${!!s.done}" aria-label="จบเซ็ต ${j+1}">✓</button></div>`});
    h+=`</div></article>`});
  return h;
}
function macroT(k){return num(S.profile[k])}
function proteinTarget(){const p=num(S.profile.protein);if(p)return p;const bw=num(S.profile.bw);return bw?Math.round(bw*1.6):null}
function renderFood(){
  setDayColor(activeDay());
  const k=S.foodDate||todayKey(),d=fromKey(k),day=S.food[k]||{items:[],water:0};
  const tp=proteinTarget(),tk=num(S.profile.kcal),tc=macroT('carb'),tf=macroT('fat'),sum=f=>day.items.reduce((a,b)=>a+(b[f]||0),0),p=sum('p'),kc=sum('k'),cb=sum('c'),ft=sum('f'),isToday=k===todayKey();
  const meter=(lbl,v,t,u)=>`<div class="meter"><div class="lbl"><span>${lbl}</span><span><span class="big">${fmt(v)}</span> ${t?`/ ${fmt(t)} ${u}`:u}</span></div>${t?`<div class="bar"><i style="width:${Math.min(100,v/t*100)}%"></i></div>`:''}</div>`;
  return `<button type="button" class="btn" data-act="calc" style="width:100%;margin:0 0 12px">${tk?'คำนวณสารอาหารที่ต้องการใหม่':'คำนวณสารอาหารที่ต้องการ (TDEE และสัดส่วน)'}</button><div class="weeknav"><button type="button" class="btn ghost" data-act="fprev" aria-label="วันก่อนหน้า">‹</button><b>${isToday?'วันนี้':TH_DAY[d.getDay()]} ${thDate(d)}</b><button type="button" class="btn ghost" data-act="fnext" aria-label="วันถัดไป" ${isToday?'disabled':''}>›</button></div>
  <section class="panel">
    ${meter('พลังงาน',kc,tk,'kcal')}${meter('โปรตีน',p,tp,'g')}${(tc||cb)?meter('คาร์บ',cb,tc,'g'):''}${(tf||ft)?meter('ไขมัน',ft,tf,'g'):''}
    ${!tk?`<p class="muted">กดปุ่มคำนวณด้านบนเพื่อตั้งเป้าพลังงานและสารอาหารทั้งหมด</p>`:''}
    <div class="water"><span>น้ำ (แก้ว)</span><button type="button" class="round" data-act="w-" aria-label="ลดน้ำ 1 แก้ว">−</button><span class="cnt">${day.water||0}</span><button type="button" class="round" data-act="w+" aria-label="เพิ่มน้ำ 1 แก้ว">+</button></div>
  </section>
  <section class="panel"><h2>เพิ่มอาหาร</h2><div class="form">
    <label class="f full"><input id="fn" type="text" placeholder="ชื่ออาหาร" aria-label="ชื่ออาหาร"></label>
    <label class="f"><input id="fp" type="number" inputmode="decimal" min="0" placeholder="0" aria-label="โปรตีน กรัม"><span>g โปรตีน</span></label>
    <label class="f"><input id="fk" type="number" inputmode="numeric" min="0" placeholder="0" aria-label="พลังงาน kcal"><span>kcal</span></label>
    <label class="f"><input id="fc" type="number" inputmode="decimal" min="0" placeholder="0" aria-label="คาร์บ กรัม"><span>g คาร์บ</span></label>
    <label class="f"><input id="ff" type="number" inputmode="decimal" min="0" placeholder="0" aria-label="ไขมัน กรัม"><span>g ไขมัน</span></label>
    <button type="button" class="btn full" data-act="fadd">เพิ่มอาหาร</button></div>
    <p class="muted" style="margin:12px 0 0;font-size:14px">กดเพิ่มเร็ว (ค่าประมาณ)</p>
    <div class="presets">${PRESETS.map((x,i)=>`<button type="button" class="chip" data-act="preset" data-i="${i}">${esc(x.name)}<small>${x.k} kcal, โปรตีน ${x.p} g</small></button>`).join('')}</div></section>
  <section class="panel"><h2>กินไปแล้ว</h2>${day.items.length?`<ul class="items">${day.items.map(it=>`<li><span>${esc(it.name||'อาหาร')}<br><span class="muted" style="font-size:14px">${fmt(it.k)} kcal, P ${fmt(it.p)} g${it.c!=null?`, C ${fmt(it.c)} g`:''}${it.f!=null?`, F ${fmt(it.f)} g`:''}</span></span><button type="button" class="x" data-act="fdel" data-id="${esc(it.id)}" aria-label="ลบ ${esc(it.name||'อาหาร')}">×</button></li>`).join('')}</ul>`:`<p class="muted">ยังไม่มีรายการ เพิ่มมื้อแรกจากด้านบนได้เลย</p>`}</section>`;
}
function renderProgress(){
  setDayColor(activeDay());
  const EXM=exMap(), goals=S.profile.goals||[];
  // goals
  let g='';
  goals.forEach(goal=>{const gi=goalInfo(goal,EXM);if(!gi)return;
    let eta='';
    if(gi.achieved) eta=`<span class="done-t">ถึงเป้าแล้ว เมื่อ ${thDate(fromKey(gi.achieved))}</span>`;
    else if(gi.eta==='flat') eta='ช่วง 8 สัปดาห์ล่าสุดยังไม่ขยับ ดูคำแนะนำในส่วน progressive overload ด้านล่าง';
    else if(gi.eta instanceof Date){eta=`ถ้าพัฒนาเท่านี้ต่อไป น่าจะถึงประมาณ ${thDateY(gi.eta)}`;if(goal.by){eta+=gi.eta<=fromKey(goal.by)?' ทันกำหนด':' ช้ากว่ากำหนด'}}
    else if(gi.ex.unit!=='bw') eta='ต้องมีบันทึกอย่างน้อย 3 ครั้งในช่วง 2 สัปดาห์ขึ้นไป จึงจะประเมินวันถึงเป้าได้';
    const tgt=gi.ex.unit==='bw'?`${goal.reps} ครั้ง${goal.kg>0?` ที่ +${fmt(goal.kg)} kg`:''}`:`${fmt(goal.kg)} kg × ${goal.reps}`;
    g+=`<div class="goal"><div class="gh"><div><b>${esc(gi.ex.n)}</b><br><span class="muted" style="font-size:14px">เป้า ${tgt}${goal.by?`, ภายใน ${thDate(fromKey(goal.by))}`:''}</span></div><button type="button" class="x" data-act="gdel" data-id="${esc(goal.id)}" aria-label="ลบเป้าหมาย ${esc(gi.ex.n)}">×</button></div>
      <div class="bar"><i style="width:${gi.achieved?100:gi.pct}%;${gi.achieved?'background:var(--green)':''}"></i></div>
      <p style="margin:6px 0 0;font-size:14px">${esc(gi.now)}</p>${eta?`<p class="muted" style="margin:2px 0 0;font-size:14px">${eta}</p>`:''}</div>`});
  const opts=[];days().forEach(d=>d.ex.forEach(e=>{if(e.unit!=='sec')opts.push(`<option value="${esc(e.id)}">${esc(e.n)} (${esc(d.name)})</option>`)}));
  let h=`<section class="panel"><h2>เป้าหมาย</h2>${g||'<p class="muted">ยังไม่มีเป้าหมาย ลองตั้งเป้าท่าหลักสักท่า เช่น Bench press</p>'}
    <details ${goals.length?'':'open'}><summary class="add">+ เพิ่มเป้าหมาย</summary><div class="form3">
      <label class="full"><span class="cap">ท่า</span><span class="f"><select id="gex">${opts.join('')}</select></span></label>
      <label><span class="cap">น้ำหนัก</span><span class="f"><input id="gkg" type="number" inputmode="decimal" step="0.5" min="0" placeholder="80"><span>kg</span></span></label>
      <label><span class="cap">จำนวนครั้ง</span><span class="f"><input id="greps" type="number" inputmode="numeric" min="1" value="5"><span>ครั้ง</span></span></label>
      <label class="full"><span class="cap">ภายในวันที่ (ไม่ใส่ก็ได้)</span><span class="f"><input id="gby" type="date"></span></label>
      <button type="button" class="btn full" data-act="gadd">เพิ่มเป้าหมาย</button></div></details></section>`;
  // bodyweight
  const log=S.profile.bwLog||{},lk=Object.keys(log).sort(),latest=lk.length?log[lk[lk.length-1]]:null,bg=num(S.profile.bwGoal);
  let bwTxt='';
  if(latest!=null){
    const start=log[lk[0]];bwTxt=`ล่าสุด ${fmt(latest)} kg (${thDate(fromKey(lk[lk.length-1]))})`;
    if(lk.length>1){const dlt=latest-start;bwTxt+=`, ${dlt>=0?'+':''}${fmt(dlt)} kg จากครั้งแรก`}
    if(bg!=null){const tot=bg-start,done=latest-start;const pct=tot?Math.max(0,Math.min(100,done/tot*100)):100;bwTxt+=`<div class="bar"><i style="width:${Math.abs(latest-bg)<0.05?100:pct}%"></i></div><span class="muted" style="font-size:14px">เป้า ${fmt(bg)} kg${Math.abs(latest-bg)<0.05?', ถึงแล้ว':`, เหลืออีก ${fmt(Math.abs(bg-latest))} kg`}</span>`}
  }
  h+=`<section class="panel"><h2>น้ำหนักตัว</h2>${bwTxt?`<p style="margin:0 0 4px">${bwTxt}</p>`:'<p class="muted">บันทึกสัปดาห์ละครั้ง ตอนเช้าก่อนกินข้าว จะเทียบได้แม่นที่สุด</p>'}
    ${sparkSVG(lk.slice(-20).map(k=>log[k]),'--accent')}
    <div class="form3"><label><span class="cap">น้ำหนักวันนี้</span><span class="f"><input id="bwv" type="number" inputmode="decimal" step="0.1" min="0" placeholder="${latest??''}"><span>kg</span></span></label>
      <label><span class="cap">เป้าหมาย</span><span class="f"><input id="bwg" type="number" inputmode="decimal" step="0.1" min="0" value="${bg??''}"><span>kg</span></span></label>
      <button type="button" class="btn full" data-act="bwsave">บันทึกน้ำหนักตัว</button></div></section>`;
  // overload
  const list=[];days().forEach(d=>d.ex.forEach(e=>list.push(Object.assign({day:d.id,dayName:d.name},e))));
  const res=list.map(ex=>({ex,o:overload(ex)}));
  const cnt=c=>res.filter(r=>r.o.cls===c).length, tracked=res.filter(r=>r.o.cls!=='na').length;
  h+=`<section class="panel"><h2>เช็ก progressive overload</h2>
    <p class="muted" style="font-size:14px">${tracked?`จาก ${tracked} ท่าที่มีข้อมูล: เพิ่มขึ้น ${cnt('up')}, ปกติ ${cnt('ok')}, ติดที่เดิม ${cnt('stall')}, ลดลง ${cnt('down')}`:'กด ✓ บันทึกเซ็ตในแท็บวันนี้อย่างน้อย 2 ครั้งต่อท่า แล้วผลจะขึ้นที่นี่'}</p>
    <p class="muted" style="font-size:13px;margin-top:-4px">เทียบจากเซ็ตที่ดีที่สุดของแต่ละครั้ง (น้ำหนัก × ครั้ง คำนวณเป็นแรงสูงสุดโดยประมาณ)</p>
    ${res.map(({ex,o})=>{const hs=o.h.slice(-12);
      return `<details class="ov"><summary><span class="nm">${esc(ex.n)}</span><span class="pill ${o.cls}">${o.label}</span><span class="sm">${esc(ex.dayName)}${o.h.length?`, ล่าสุด ${fmtTop(ex,topOf(ex,o.h[o.h.length-1].sets))}`:''}</span></summary>
      <div class="body"><p style="margin:0 0 4px;font-size:14px">${esc(o.text)}</p>${sparkSVG(hs.map(x=>sparkVal(ex,x.sets)),colorOf(ex.day))}
      ${hs.length?`<ul class="prog">${hs.slice(-5).reverse().map(x=>`<li><span class="muted">${thDate(fromKey(x.key))}</span><span>${fmtTop(ex,topOf(ex,x.sets))}</span></li>`).join('')}</ul><button type="button" class="link" data-act="hist" data-ex="${esc(ex.id)}">ดูประวัติทั้งหมด</button>`:''}</div></details>`}).join('')}
  </section>`;
  return h;
}
function weekData(off){
  const start=addDays(monday(new Date()),off*7),end=addDays(start,7),sk=keyOf(start),ek=keyOf(end),EXM=exMap();
  const keys=Object.keys(S.sessions).filter(k=>k>=sk&&k<ek).sort();
  let sets=0,vol=0,trained=0;const best={};
  keys.forEach(k=>{const s=S.sessions[k];let any=false;
    Object.entries(s.sets||{}).forEach(([id,arr])=>{const ex=EXM[id];arr.filter(x=>x.done).forEach(x=>{any=true;sets++;if(ex&&ex.unit==='kg'&&x.w>0&&x.r>0)vol+=x.w*x.r;
      if(!best[id])best[id]=[];best[id].push(x)})});
    if(any)trained++});
  return {start,end,sk,ek,sets,vol,trained,best,EXM};
}
function renderReport(){
  setDayColor(activeDay());
  const W=weekData(S.weekOff),P=weekData(S.weekOff-1),nd=days().length;
  let h=`<div class="weeknav"><button type="button" class="btn ghost" data-act="wprev" aria-label="สัปดาห์ก่อน">‹</button><b>${thDate(W.start)} – ${thDate(addDays(W.end,-1))}</b><button type="button" class="btn ghost" data-act="wnext" aria-label="สัปดาห์ถัดไป" ${S.weekOff>=0?'disabled':''}>›</button></div>`;
  const dv=P.vol?Math.round((W.vol-P.vol)/P.vol*100):null;
  h+=`<div class="stats"><div class="stat"><b>${W.trained}/${nd}</b><span>วันที่ฝึก</span></div><div class="stat"><b>${W.sets}</b><span>เซ็ตทั้งหมด</span></div><div class="stat"><b>${fmt(W.vol/1000)}</b><span>ตันที่ยกรวม${dv!=null?` <span class="${dv>=0?'up-t':'down-t'}">${dv>=0?'+':''}${dv}%</span>`:''}</span></div></div>`;
  h+=`<section class="panel"><div class="days">${[0,1,2,3,4,5,6].map(i=>{const s=S.sessions[keyOf(addDays(W.start,i))];const did=s&&Object.values(s.sets||{}).some(a=>a.some(x=>x.done));const col=did?`var(${colorOf(s.day)})`:'transparent';return `<div>${TH_SHORT[i]}<i style="background:${col};border-color:${did?col:'var(--line)'}"></i></div>`}).join('')}</div></section>`;
  const order=[];days().forEach(d=>d.ex.forEach(e=>order.push(e.id)));
  const ids=Object.keys(W.best).sort((a,b)=>{const ia=order.indexOf(a),ib=order.indexOf(b);return (ia<0?999:ia)-(ib<0?999:ib)});
  if(ids.length){
    h+=`<section class="panel"><h2>เซ็ตที่ดีที่สุดของแต่ละท่า</h2><ul class="prog">${ids.map(id=>{const ex=W.EXM[id];if(!ex)return '';
      const cur=topOf(ex,W.best[id]),prev=histOf(id,W.sk),lastTop=prev.length?topOf(ex,prev[prev.length-1].sets):null;
      const prevBest=prev.length?Math.max(...prev.map(x=>scoreOf(ex,x.sets))):0,pr=prevBest>0&&scoreOf(ex,W.best[id])>prevBest;
      return `<li><span>${esc(ex.n)}<br><span class="muted" style="font-size:14px">${lastTop?`ครั้งก่อน ${fmtTop(ex,lastTop)}`:'ครั้งแรก'}</span></span><span style="text-align:right">${fmtTop(ex,cur)}${pr?`<br><span class="pr">สถิติใหม่</span>`:''}</span></li>`}).join('')}</ul></section>`;
  } else h+=`<section class="panel"><h2>ยังไม่มีการฝึกในสัปดาห์นี้</h2><p class="muted">ไปที่แท็บวันนี้แล้วกด ✓ ทุกครั้งที่จบเซ็ต สรุปจะขึ้นที่นี่อัตโนมัติ</p></section>`;
  const tp=proteinTarget(),vals=[0,1,2,3,4,5,6].map(i=>{const f=S.food[keyOf(addDays(W.start,i))];return f?f.items.reduce((a,b)=>a+(b.p||0),0):null}),logged=vals.filter(v=>v!=null&&v>0);
  if(logged.length){
    const max=Math.max(tp||0,...logged)*1.15||1,Wd=320,H=150,bw=28,gap=(Wd-20-7*bw)/6;
    let svg=`<svg class="chart" viewBox="0 0 ${Wd} ${H+22}" role="img" aria-label="โปรตีนต่อวันในสัปดาห์นี้">`;
    vals.forEach((v,i)=>{const x=10+i*(bw+gap),hh=v?v/max*H:0,hit=tp&&v>=tp;
      svg+=`<rect x="${x}" y="${H-hh}" width="${bw}" height="${hh}" rx="5" fill="${hit?'var(--green)':'var(--accent)'}" opacity="${hit?1:.6}"/>`;
      if(v)svg+=`<text x="${x+bw/2}" y="${H-hh-5}" text-anchor="middle" font-size="11" fill="var(--muted)">${Math.round(v)}</text>`;
      svg+=`<text x="${x+bw/2}" y="${H+16}" text-anchor="middle" font-size="12" fill="var(--muted)">${TH_SHORT[i]}</text>`});
    if(tp){const y=H-tp/max*H;svg+=`<line x1="4" x2="${Wd-4}" y1="${y}" y2="${y}" stroke="var(--ink)" stroke-dasharray="4 4" stroke-width="1.2"/><text x="${Wd-4}" y="${y-5}" text-anchor="end" font-size="11" fill="var(--ink)">เป้า ${tp} g</text>`}
    svg+='</svg>';
    const avg=Math.round(logged.reduce((a,b)=>a+b,0)/logged.length),hits=tp?logged.filter(v=>v>=tp).length:null;
    h+=`<section class="panel"><h2>โปรตีนรายวัน</h2>${svg}<p class="muted" style="margin-top:8px">เฉลี่ย ${avg} g ต่อวัน (จาก ${logged.length} วันที่บันทึก)${hits!=null?`, ถึงเป้า ${hits} วัน`:''}</p></section>`;
  } else h+=`<section class="panel"><h2>โปรตีนรายวัน</h2><p class="muted">บันทึกอาหารในแท็บอาหาร แล้วกราฟโปรตีนของสัปดาห์จะขึ้นที่นี่</p></section>`;
  return h;
}
function renderSettings(){
  setDayColor(activeDay());
  const bw=S.profile.bw??'',p=S.profile.protein??'',k=S.profile.kcal??'',auto=num(bw)?Math.round(num(bw)*1.6):null;
  const sched=days().slice().sort((a,b)=>((a.wd+6)%7)-((b.wd+6)%7));
  return `<section class="panel"><h2>โปรแกรมฝึก</h2><ul class="sched">${sched.map(d=>`<li><b>${TH_DAY[d.wd]}</b>: ${esc(d.name)}, ${d.ex.length} ท่า${d.title?`<br><span class="muted" style="font-size:14px">${esc(d.title)}</span>`:''}</li>`).join('')}</ul>
    <button type="button" class="btn" data-act="edit">แก้ไขโปรแกรม</button></section>
  <section class="panel"><h2>การแจ้งเตือน</h2><p class="muted" style="font-size:15px;margin:0 0 10px">สร้างไฟล์ปฏิทินตามวันในโปรแกรม แล้วเปิดเพื่อเพิ่มลงปฏิทินของมือถือหรือ Google Calendar ปฏิทินจะเตือนให้ทุกสัปดาห์ ถ้าแก้โปรแกรม ให้ลบนัดเก่าแล้วเพิ่มไฟล์ใหม่</p>
    <div class="form3"><label><span class="cap">เวลาไปยิม</span><span class="f"><input id="nt" type="time" value="${esc(S.profile.notifyTime||'17:00')}"></span></label>
    <label><span class="cap">เตือนล่วงหน้า</span><span class="f"><select id="na">${[[0,'ตรงเวลา'],[15,'15 นาที'],[30,'30 นาที'],[60,'1 ชั่วโมง']].map(([v,l])=>`<option value="${v}" ${(S.profile.notifyAlarm??30)==v?'selected':''}>${l}</option>`).join('')}</select></span></label>
    <label class="chk full"><input type="checkbox" id="nsum" ${S.profile.notifySummary===false?'':'checked'}> เตือนดูสรุปทุกวันอาทิตย์ 20:00</label>
    <button type="button" class="btn full" data-act="ics">ดาวน์โหลดไฟล์ปฏิทิน (.ics)</button></div></section>
  <section class="panel"><h2>เป้าโภชนาการ</h2>
    <label class="field"><span>น้ำหนักตัว</span><span class="f"><input id="sbw" type="number" inputmode="decimal" min="0" step="0.1" value="${bw}" placeholder="เช่น 60"><span>kg</span></span></label>
    <label class="field"><span>เป้าโปรตีนต่อวัน ${auto?`(เว้นว่าง = ${auto} g จาก 1.6 g ต่อน้ำหนักตัว 1 kg)`:''}</span><span class="f"><input id="sp" type="number" inputmode="numeric" min="0" value="${p}" placeholder="${auto??''}"><span>g</span></span></label>
    <label class="field"><span>เป้าพลังงานต่อวัน (ไม่ใส่ก็ได้)</span><span class="f"><input id="sk" type="number" inputmode="numeric" min="0" value="${k}" placeholder="–"><span>kcal</span></span></label>
    <div class="form3" style="margin:0 0 12px"><label><span class="cap">คาร์บต่อวัน</span><span class="f"><input id="sc" type="number" inputmode="numeric" min="0" value="${S.profile.carb??''}" placeholder="–"><span>g</span></span></label>
    <label><span class="cap">ไขมันต่อวัน</span><span class="f"><input id="sf" type="number" inputmode="numeric" min="0" value="${S.profile.fat??''}" placeholder="–"><span>g</span></span></label></div>
    <div class="row"><button type="button" class="btn" data-act="ssave">บันทึกเป้าหมาย</button><button type="button" class="btn ghost" data-act="calc">คำนวณให้อัตโนมัติ</button></div></section>
  <section class="panel"><h2>แผ่นน้ำหนัก</h2><p class="muted" style="font-size:14px">ใช้กับปุ่ม "แผ่น" ในแท็บวันนี้ แอปจะบอกว่าต้องใส่แผ่นอะไรข้างละกี่แผ่น</p>
    <label class="field"><span>น้ำหนักบาร์เปล่าที่ใช้ประจำ</span><span class="f"><input id="sbar" type="number" inputmode="decimal" step="0.5" min="0" value="${barKg()}"><span>kg</span></span></label>
    <span class="muted" style="display:block;font-size:14px;margin:0 0 4px">แผ่นที่ยิมมี (แตะเพื่อเปิด/ปิด)</span>
    <div class="chips" style="margin:0">${PLATE_ALL.map(p=>`<button type="button" class="chip" data-act="pltog" data-p="${p}" aria-pressed="${platesAvail().includes(p)}">${fmtP(p)} kg</button>`).join('')}</div></section>
  <section class="panel"><h2>ที่เก็บข้อมูล</h2>
    <p style="font-size:15px;margin:0 0 6px">ข้อมูลอยู่ในเครื่องนี้ ไม่ได้ส่งไปเซิร์ฟเวอร์ของใคร ถ้าอยากให้อยู่นอกเครื่องด้วย ให้เชื่อม Google Drive ของคุณ หรือดาวน์โหลดไฟล์สำรองไปเก็บเอง</p>
    <h3 style="font-size:16px;margin:14px 0 6px">Google Drive</h3>
    ${Drive.enabled()?(Drive.connected()?`<div class="row"><button type="button" class="btn" data-act="dsync">ซิงก์ตอนนี้</button><button type="button" class="link" data-act="ddisc">เลิกเชื่อมต่อ</button></div>`:`<button type="button" class="btn" data-act="dsync">เชื่อมต่อ Google Drive</button>`):`<p class="muted" style="font-size:14px">ยังไม่ได้ตั้งค่า ใส่ Google Client ID ในไฟล์ config.js ตามขั้นตอนใน README</p>`}
    <p id="status" class="muted" style="font-size:14px;margin-top:8px"></p>
    <h3 style="font-size:16px;margin:14px 0 6px">ไฟล์สำรอง</h3>
    <p class="muted" style="font-size:14px">บนมือถือจะมีหน้าต่างแชร์ขึ้นมา เลือกบันทึกลง Google Drive, iCloud Drive หรือ OneDrive ได้ ไฟล์ .csv เปิดใน Excel หรือ Google Sheets ได้</p>
    ${lastBackupTxt()}
    <div class="stack"><button type="button" class="btn ghost" data-act="exjson">ดาวน์โหลดไฟล์สำรอง (.json)</button>
    <button type="button" class="btn ghost" data-act="excsv">ส่งออกบันทึกการฝึก (.csv)</button>
    <label class="btn ghost" style="text-align:center;cursor:pointer">กู้คืนจากไฟล์สำรอง<input id="imp" type="file" accept=".json,application/json" hidden></label></div>
    ${S.fallback?`<p class="muted" style="font-size:14px;margin-top:10px">ดาวน์โหลดไม่สำเร็จ คัดลอกข้อความด้านล่างไปเก็บไว้แทน</p><textarea class="code" id="fbtxt" readonly>${esc(S.fallback)}</textarea><button type="button" class="btn ghost" data-act="copyfb" style="margin-top:6px">คัดลอก</button>`:''}
    <details style="margin-top:10px"><summary class="add">กู้คืนจากข้อความที่คัดลอกไว้</summary><textarea class="code" id="pastetxt" placeholder="วางข้อความ JSON ที่นี่"></textarea><button type="button" class="btn ghost" data-act="imppaste" style="margin-top:6px">กู้คืน</button></details>
  </section>
  <section class="panel"><h2>ติดตั้งแอป</h2>${isStandalone()?'<p class="muted" style="margin:0">เปิดเป็นแอปอยู่แล้ว ใช้งานได้แม้ไม่มีเน็ต</p>':installEvt?'<button type="button" class="btn" data-act="install">ติดตั้งลงเครื่อง</button>':isIOS()?'<p style="margin:0;font-size:15px">เปิดหน้านี้ใน Safari กดปุ่มแชร์ แล้วเลือก "เพิ่มไปยังหน้าจอโฮม"</p>':'<p style="margin:0;font-size:15px">เปิดเมนูของเบราว์เซอร์ แล้วเลือก "ติดตั้งแอป" หรือ "เพิ่มไปยังหน้าจอหลัก"</p>'}
    <div class="row" style="margin-top:12px"><button type="button" class="btn ghost" data-act="checkupd">ตรวจหาเวอร์ชันใหม่</button><span class="muted" style="font-size:13px">เวอร์ชัน ${APP_VERSION}</span></div></section>
  <section class="panel"><h2>เริ่มใหม่</h2><p class="muted">ลบบันทึกการฝึกและอาหารทั้งหมด (โปรแกรมและเป้าหมายยังอยู่) ย้อนกลับไม่ได้ แนะนำให้ดาวน์โหลดไฟล์สำรองก่อน</p><button type="button" class="btn danger" data-act="reset">ลบบันทึกทั้งหมด</button></section>`;
}
function renderStatus(){const el=$('#status');if(!el)return;
  const t=Drive.last();
  el.textContent=!Drive.enabled()?'':Drive.busy?'กำลังซิงก์…':!Drive.connected()?'ยังไม่ได้เชื่อมต่อ':Drive.err==='needauth'?'ต้องกดซิงก์อีกครั้งเพื่อยืนยันกับ Google':Drive.err==='fail'?'ซิงก์ไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองใหม่':t?`ซิงก์ล่าสุด ${thDate(new Date(t))} ${pad(new Date(t).getHours())}:${pad(new Date(t).getMinutes())} น. ไฟล์อยู่ในโฟลเดอร์ซ่อนของแอปใน Drive ของคุณ`:'เชื่อมต่อแล้ว';
  const bn=$('#drivebar');if(bn)bn.hidden=!(Drive.connected()&&!Drive.valid()&&!Drive.busy);
}
function renderEditor(){
  setDayColor(activeDay());
  const D=S.draft;
  let h=`<p class="note">แก้ชื่อท่า เซ็ต ช่วงจำนวนครั้ง เวลาพัก และน้ำหนักที่เพิ่มต่อครั้ง กดบันทึกโปรแกรมเมื่อเสร็จ บันทึกเก่าของท่าที่ลบจะยังอยู่ในสรุป</p>`;
  D.days.forEach((d,i)=>{
    h+=`<section class="panel ed-day"><h2><i style="background:var(${COLORS[i%COLORS.length]})"></i>${esc(d.name||'วันฝึก')}</h2>
      <div class="two"><label><span class="cap">ชื่อ</span><span class="f"><input type="text" data-p="${i}.name" value="${esc(d.name)}"></span></label>
      <label><span class="cap">วันในสัปดาห์</span><span class="f"><select data-p="${i}.wd">${[1,2,3,4,5,6,0].map(w=>`<option value="${w}" ${d.wd===w?'selected':''}>${TH_DAY[w]}</option>`).join('')}</select></span></label></div>
      <label><span class="lbl-cap">โฟกัสของวัน</span><span class="f"><input type="text" data-p="${i}.title" value="${esc(d.title)}" placeholder="เช่น Upper หนัก"></span></label>
      <label class="chk"><input type="checkbox" data-p="${i}.light" ${d.light?'checked':''}> วันเบา (เหลือแรง 2–3 ครั้งทุกเซ็ต)</label>`;
    d.ex.forEach((e,j)=>{
      h+=`<div class="ed-ex"><div class="ed-top"><b>${j+1}</b><span class="f"><input type="text" data-p="${i}.ex.${j}.n" value="${esc(e.n)}" aria-label="ชื่อท่า" placeholder="ชื่อท่า"></span>
        <span class="ed-btns"><button type="button" class="mini" data-act="exup" data-d="${i}" data-j="${j}" aria-label="เลื่อนขึ้น" ${j?'':'disabled'}>↑</button><button type="button" class="mini" data-act="exdn" data-d="${i}" data-j="${j}" aria-label="เลื่อนลง" ${j<d.ex.length-1?'':'disabled'}>↓</button><button type="button" class="mini del" data-act="exdel" data-d="${i}" data-j="${j}" aria-label="ลบท่า ${esc(e.n)}">×</button></span></div>
        <div class="ed-alt"><span class="f"><input type="text" data-p="${i}.ex.${j}.alt" value="${esc(e.alt)}" placeholder="ท่าทดแทน (ไม่ใส่ก็ได้)" aria-label="ท่าทดแทน"></span></div>
        <div class="ed-grid">
          <label><span class="cap">เซ็ต</span><span class="f"><input type="number" inputmode="numeric" min="1" max="10" data-p="${i}.ex.${j}.sets" value="${e.sets}"></span></label>
          <label><span class="cap">${e.unit==='sec'?'วินาที ต่ำสุด':'ครั้ง ต่ำสุด'}</span><span class="f"><input type="number" inputmode="numeric" min="1" data-p="${i}.ex.${j}.lo" value="${e.lo}"></span></label>
          <label><span class="cap">${e.unit==='sec'?'วินาที สูงสุด':'ครั้ง สูงสุด'}</span><span class="f"><input type="number" inputmode="numeric" min="1" data-p="${i}.ex.${j}.hi" value="${e.hi}"></span></label>
          <label><span class="cap">พัก (วินาที)</span><span class="f"><input type="number" inputmode="numeric" min="0" step="15" data-p="${i}.ex.${j}.rest" value="${e.rest}"></span></label>
          <label><span class="cap">เพิ่มทีละ (kg)</span><span class="f"><input type="number" inputmode="decimal" min="0" step="0.5" data-p="${i}.ex.${j}.inc" value="${e.inc}"></span></label>
          <label><span class="cap">ประเภท</span><span class="f"><select data-p="${i}.ex.${j}.unit"><option value="kg" ${e.unit==='kg'?'selected':''}>น้ำหนัก</option><option value="bw" ${e.unit==='bw'?'selected':''}>บอดี้เวต</option><option value="sec" ${e.unit==='sec'?'selected':''}>จับเวลา</option></select></span></label>
        </div></div>`});
    h+=`<div class="row" style="margin-top:10px"><button type="button" class="btn ghost" data-act="exadd" data-d="${i}">+ เพิ่มท่า</button>${D.days.length>1?`<button type="button" class="link" data-act="daydel" data-d="${i}">ลบวันนี้ออกจากโปรแกรม</button>`:''}</div></section>`});
  h+=`<div class="row" style="margin-bottom:12px"><button type="button" class="btn ghost" data-act="dayadd">+ เพิ่มวันฝึก</button><button type="button" class="link" data-act="progdefault">ใช้โปรแกรมเริ่มต้น</button></div>
    <div class="savebar"><div class="box"><button type="button" class="btn ghost" data-act="edcancel">ยกเลิก</button><button type="button" class="btn" data-act="edsave">บันทึกโปรแกรม</button></div></div>`;
  return h;
}
/* ---------- nutrition calculator ---------- */
function calcState(){
  if(!S.calc){const c=S.profile.calc?clone(S.profile.calc):{};
    S.calc=Object.assign({sex:'m',age:null,h:null,w:num(S.profile.bw),bf:null,act:1.55,goal:'lean',fatPct:25,meals:4},c)}
  return S.calc;
}
function calcCompute(c){
  const age=num(c.age),h=num(c.h),w=num(c.w),bf=num(c.bf);
  if(!age||!h||!w) return {err:'กรอกอายุ ส่วนสูง และน้ำหนักให้ครบ แล้วผลจะขึ้นทันที'};
  if(age<13||age>80) return {err:'เครื่องคิดนี้ใช้กับอายุ 13–80 ปี'};
  if(h<120||h>230||w<30||w>250) return {err:'ตรวจส่วนสูง (120–230 cm) และน้ำหนัก (30–250 kg) อีกครั้ง'};
  if(bf!=null&&(bf<3||bf>60)) return {err:'เปอร์เซ็นต์ไขมันควรอยู่ระหว่าง 3–60 หรือเว้นว่างไว้'};
  const mif=10*w+6.25*h-5*age+(c.sex==='m'?5:-161);
  const lbm=bf!=null?w*(1-bf/100):null, katch=lbm?370+21.6*lbm:null;
  const bmr=katch??mif, tdee=bmr*c.act, G=GOALS[c.goal]||GOALS.maint;
  let adj=G.adj, teen=age<18; if(teen&&adj<-0.10) adj=-0.10;
  const kcal=Math.round(tdee*(1+adj)/10)*10;
  const protein=Math.round(w*G.p);
  const fat=Math.round(Math.max(0.6*w,kcal*c.fatPct/100/9));
  const carb=Math.max(0,Math.round((kcal-protein*4-fat*9)/4));
  const td=Math.min(6,Math.max(1,days().length)), cTrain=Math.round(carb*1.15), cRest=Math.max(0,Math.round((7*carb-td*cTrain)/(7-td)));
  return {age,h,w,bf,lbm,mif,katch,bmr,tdee,kcal,adj,teen,G,protein,fat,carb,td,cTrain,cRest,
    fiber:Math.round(kcal/1000*14),water:Math.round((w*35+500)/100)/10,wk:(kcal-tdee)*7/7700,
    pMeal:Math.round(protein/c.meals),kMeal:Math.round(kcal/c.meals/10)*10};
}
function calcOut(){
  const c=calcState(),r=calcCompute(c);
  if(r.err) return `<section class="panel"><p class="muted" style="margin:0">${r.err}</p></section>`;
  const pk=r.protein*4,ck=r.carb*4,fk=r.fat*9,tot=pk+ck+fk||1,pc=v=>Math.round(v/tot*100);
  const row=(a,b)=>`<li><span>${a}</span><span style="text-align:right"><b>${b}</b></span></li>`;
  const sgn=v=>(v>0?'+':'')+fmt(v);
  return `<section class="panel"><p class="muted" style="margin:0">พลังงานที่ควรกินต่อวัน (${r.G.l})</p>
    <p style="margin:2px 0 4px;font-size:40px;font-weight:700;line-height:1.1">${r.kcal.toLocaleString('th-TH')} <span style="font-size:18px;font-weight:500">kcal</span></p>
    <p class="muted" style="margin:0 0 12px;font-size:14px">${Math.abs(r.wk)<0.02?'น้ำหนักควรทรงตัว':`น้ำหนักจะ${r.wk>0?'ขึ้น':'ลง'}ประมาณ ${fmt(Math.abs(r.wk))} kg ต่อสัปดาห์`}</p>
    <div style="display:flex;height:14px;border-radius:99px;overflow:hidden;margin:0 0 10px" role="img" aria-label="สัดส่วนพลังงาน โปรตีน ${pc(pk)}% คาร์บ ${pc(ck)}% ไขมัน ${pc(fk)}%"><i style="width:${pc(pk)}%;background:var(--accent)"></i><i style="width:${pc(ck)}%;background:var(--yellow)"></i><i style="width:${pc(fk)}%;background:var(--green)"></i></div>
    <div class="stats" style="margin:0">
      <div class="stat"><b>${r.protein} g</b><span><i style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent)"></i> โปรตีน ${pc(pk)}%</span></div>
      <div class="stat"><b>${r.carb} g</b><span><i style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--yellow)"></i> คาร์บ ${pc(ck)}%</span></div>
      <div class="stat"><b>${r.fat} g</b><span><i style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--green)"></i> ไขมัน ${pc(fk)}%</span></div></div>
    <button type="button" class="btn" data-act="capply" style="width:100%;margin-top:12px">ใช้เป็นเป้าหมายในแอป</button></section>
  ${r.teen?`<section class="panel"><p style="margin:0;font-size:15px">อายุต่ำกว่า 18 ปี สูตรเหล่านี้ทำมาสำหรับผู้ใหญ่ ตัวเลขเป็นค่าประมาณ ร่างกายยังโตอยู่จึงไม่ควรลดแคลอรี่มาก แอปจำกัดการลดไว้ที่ไม่เกิน 10% ถ้าจะคุมอาหารจริงจัง ควรปรึกษาหมอหรือนักโภชนาการ</p></section>`:''}
  <section class="panel"><h2>ที่มาของตัวเลข</h2><ul class="prog">
    ${row('BMR (Mifflin-St Jeor)',`${Math.round(r.mif).toLocaleString('th-TH')} kcal`)}
    ${r.katch?row('BMR (Katch-McArdle จาก % ไขมัน, ใช้ค่านี้)',`${Math.round(r.katch).toLocaleString('th-TH')} kcal`):''}
    ${row(`TDEE (BMR × ${c.act})`,`${Math.round(r.tdee).toLocaleString('th-TH')} kcal`)}
    ${row(`ปรับตามเป้าหมาย (${sgn(Math.round(r.adj*100))}%)`,`${sgn(Math.round(r.kcal-r.tdee))} kcal`)}
    ${row('โปรตีน',`${fmt(r.protein/r.w)} g ต่อน้ำหนักตัว 1 kg`)}
    ${row('ไขมัน',`${c.fatPct}% ของพลังงาน (ขั้นต่ำ 0.6 g/kg)`)}
    ${row('คาร์บ','พลังงานที่เหลือทั้งหมด')}
    ${r.lbm?row('มวลไร้ไขมัน',`${fmt(r.lbm)} kg`):''}
  </ul></section>
  <section class="panel"><h2>แบ่งเป็นมื้อ (${c.meals} มื้อ)</h2><ul class="prog">
    ${row('พลังงานต่อมื้อ',`~${r.kMeal} kcal`)}${row('โปรตีนต่อมื้อ',`~${r.pMeal} g`)}</ul>
    <p class="muted" style="font-size:14px;margin:8px 0 0">โปรตีนกระจายหลายมื้อดีกว่ากินรวดเดียว มื้อก่อนหรือหลังเล่นยิม 1–2 ชั่วโมง ควรมีทั้งโปรตีนและคาร์บ</p></section>
  <section class="panel"><h2>วันฝึกกับวันพัก (ไม่บังคับ)</h2><p class="muted" style="font-size:14px;margin:0 0 6px">ถ้าอยากปรับตามวัน ให้กินคาร์บมากขึ้นในวันฝึก ${r.td} วัน และน้อยลงในวันพัก โดยรวมทั้งสัปดาห์ยังเท่าเดิม</p><ul class="prog">
    ${row('วันฝึก',`คาร์บ ${r.cTrain} g, ~${(Math.round((r.kcal+(r.cTrain-r.carb)*4)/10)*10).toLocaleString('th-TH')} kcal`)}
    ${row('วันพัก',`คาร์บ ${r.cRest} g, ~${(Math.round((r.kcal+(r.cRest-r.carb)*4)/10)*10).toLocaleString('th-TH')} kcal`)}</ul></section>
  <section class="panel"><h2>อื่นๆ</h2><ul class="prog">
    ${row('ใยอาหาร',`${r.fiber} g ต่อวัน`)}${row('น้ำดื่ม (วันที่เล่นยิม)',`~${fmt(r.water)} ลิตร`)}${row('ช่วงโปรตีนที่ใช้ได้',`${Math.round(r.w*1.6)}–${Math.round(r.w*2.2)} g`)}</ul>
    <p class="muted" style="font-size:14px;margin:8px 0 0">ตัวเลขทั้งหมดคลาดเคลื่อนได้ราว 10% ใช้ไป 2–3 สัปดาห์แล้วดูน้ำหนักตัวจริง ถ้าไม่เป็นไปตามที่คาด ให้ปรับพลังงานขึ้นหรือลงครั้งละ 100–200 kcal</p></section>`;
}
function renderCalc(){
  setDayColor(activeDay());const c=calcState();
  const chip=(k,v,l)=>`<button type="button" class="chip" data-act="csel" data-k="${k}" data-v="${v}" aria-pressed="${c[k]===v}">${l}</button>`;
  return `<p class="note">กรอกข้อมูลด้านล่าง ผลจะคำนวณให้ทันที แล้วกดใช้เป็นเป้าหมาย แท็บอาหารจะติดตามให้ทุกวัน</p>
  <section class="panel"><h2>ข้อมูลร่างกาย</h2>
    <div class="chips" role="group" aria-label="เพศ">${chip('sex','m','ชาย')}${chip('sex','f','หญิง')}</div>
    <div class="form3" style="grid-template-columns:repeat(3,1fr)">
      <label><span class="cap">อายุ</span><span class="f"><input type="number" inputmode="numeric" data-c="age" value="${c.age??''}" placeholder="ปี"><span>ปี</span></span></label>
      <label><span class="cap">ส่วนสูง</span><span class="f"><input type="number" inputmode="decimal" data-c="h" value="${c.h??''}" placeholder="170"><span>cm</span></span></label>
      <label><span class="cap">น้ำหนัก</span><span class="f"><input type="number" inputmode="decimal" step="0.1" data-c="w" value="${c.w??''}" placeholder="60"><span>kg</span></span></label>
      <label class="full"><span class="cap">% ไขมันในร่างกาย (ถ้ารู้ ไม่ใส่ก็ได้)</span><span class="f"><input type="number" inputmode="decimal" data-c="bf" value="${c.bf??''}" placeholder="–"><span>%</span></span></label></div></section>
  <section class="panel"><h2>กิจกรรมต่อสัปดาห์</h2><span class="f"><select data-c="act" aria-label="ระดับกิจกรรม">${ACT.map(a=>`<option value="${a.v}" ${c.act===a.v?'selected':''}>${a.l}</option>`).join('')}</select></span>
    <p class="muted" style="font-size:14px;margin:8px 0 0">เล่นยิม 3 วันกับคาบพละ ส่วนใหญ่อยู่ระดับ 3–5 วันต่อสัปดาห์</p></section>
  <section class="panel"><h2>เป้าหมาย</h2><div class="chips" role="group" aria-label="เป้าหมาย" style="margin-bottom:6px">${Object.entries(GOALS).map(([k,g])=>chip('goal',k,g.l)).join('')}</div>
    <p class="muted" style="font-size:14px;margin:0 0 10px">${(GOALS[c.goal]||GOALS.maint).d}</p>
    <div class="form3"><label><span class="cap">สัดส่วนไขมัน</span><span class="f"><select data-c="fatPct">${[20,25,30,35].map(v=>`<option value="${v}" ${c.fatPct===v?'selected':''}>${v}% ของพลังงาน</option>`).join('')}</select></span></label>
      <label><span class="cap">จำนวนมื้อต่อวัน</span><span class="f"><select data-c="meals">${[3,4,5].map(v=>`<option value="${v}" ${c.meals===v?'selected':''}>${v} มื้อ</option>`).join('')}</select></span></label></div></section>
  <div id="calcOut">${calcOut()}</div>`;
}

function render(){
  const v=S.view;
  $('#main').innerHTML=v==='today'?renderToday():v==='food'?renderFood():v==='progress'?renderProgress():v==='report'?renderReport():v==='editor'?renderEditor():v==='calc'?renderCalc():renderSettings();
  renderTop();
  const tabV=v==='editor'?'settings':v==='calc'?'food':v;
  document.querySelectorAll('nav.tabs button').forEach(b=>b.setAttribute('aria-current',b.dataset.view===tabV?'page':'false'));
  document.querySelector('.wrap').style.paddingBottom=v==='editor'?'220px':'';
  renderStatus();
}

/* ---------- bottom sheet ---------- */
function openSheet(html){$('#sheetBody').innerHTML=html;$('#sheet').hidden=false;document.body.classList.add('noscroll');$('#sheet .sheet-box').scrollTop=0}
function closeSheet(){const s=$('#sheet');if(!s||s.hidden)return;s.hidden=true;S.sheet=null;document.body.classList.remove('noscroll')}

/* ---------- exercise history ---------- */
function renderHist(exId){
  const EXM=exMap(),ex=EXM[exId];if(!ex)return '';
  const h=histOf(exId),kg=ex.unit==='kg';
  let best=null,bestKey=null,bestScore=0;const prs=new Set();
  h.forEach(x=>{const sc=scoreOf(ex,x.sets);if(sc>bestScore){bestScore=sc;best=topOf(ex,x.sets);bestKey=x.key;prs.add(x.key)}});
  const fmtSet=s=>ex.unit==='sec'?`${s.r||0} วิ`:ex.unit==='bw'?((s.w||0)>0?`+${fmt(s.w)}×${s.r||0}`:`${s.r||0}`):`${fmt(s.w)}×${s.r||0}`;
  const rows=h.slice(-10).reverse().map(x=>{const t=topOf(ex,x.sets);
    return `<li><div class="hd"><span>${thDateY(fromKey(x.key))}</span>${prs.has(x.key)?'<span class="pill up">สถิติใหม่</span>':''}</div>
      <div class="hs">${x.sets.map(fmtSet).join(', ')}${ex.unit==='bw'?' ครั้ง':''}</div>
      <div class="ht muted">ดีที่สุด ${fmtTop(ex,t)}${kg?` · 1RM ≈ ${fmt(e1rm(t))} kg`:''}</div></li>`}).join('');
  const head=`<div class="sh-head"><h2>${esc(ex.n)}${ex.archived?' <small class="muted">(ไม่อยู่ในโปรแกรมแล้ว)</small>':''}</h2><button type="button" class="x" data-act="sheetclose" aria-label="ปิด">×</button></div>`;
  if(!h.length)return head+'<p class="muted">ยังไม่มีบันทึกของท่านี้ กด ✓ จบเซ็ตในแท็บวันนี้ แล้วกลับมาดูได้</p>';
  return head+`<div class="stats"><div class="stat"><b>${h.length}</b><span>ครั้งที่บันทึก</span></div>
    <div class="stat"><b>${kg?fmt(e1rm(best)):fmtTop(ex,best)}</b><span>${kg?'1RM สูงสุด (kg)':'ดีที่สุด'}</span></div>
    <div class="stat"><b style="font-size:18px">${bestKey?thDate(fromKey(bestKey)):'–'}</b><span>วันทำสถิติ</span></div></div>
    ${sparkSVG(h.slice(-20).map(x=>sparkVal(ex,x.sets)),'--day')}
    <ul class="hist">${rows}</ul>${h.length>10?`<p class="muted" style="font-size:13px;margin:8px 0 0">แสดง 10 ครั้งล่าสุดจากทั้งหมด ${h.length} ครั้ง</p>`:''}`;
}

/* ---------- plate calculator ---------- */
const PLATE_ALL=[25,20,15,10,5,2.5,1.25,0.5];
const fmtP=p=>(+p).toLocaleString('th-TH',{maximumFractionDigits:2});
const PLATE_STYLE={25:['#D8322B','#fff'],20:['#2E63C9','#fff'],15:['#E5B21E','#2a2a2a'],10:['#2E9A5B','#fff'],5:['#F2F2F2','#2a2a2a'],2.5:['#6E6E6E','#fff'],1.25:['#BDBDBD','#2a2a2a'],0.5:['#DADADA','#2a2a2a']};
const PLATE_H={25:120,20:110,15:96,10:82,5:66,2.5:52,1.25:44,0.5:38};
const BARS=[20,15,10,7.5];
const barKg=()=>num(S.profile.barKg)??20;
const platesAvail=()=>{const p=Array.isArray(S.profile.plates)&&S.profile.plates.length?S.profile.plates:[25,20,15,10,5,2.5,1.25];return p.slice().sort((x,y)=>y-x)};
function plateCalc(target,bar,avail){
  if(!(target>0))return null;
  const q=v=>Math.round(v*4)/4;
  if(target<bar-1e-9)return {below:true,bar,target};
  let rem=q((target-bar)/2);const side=rem,list=[];
  for(const p of avail){while(rem>=p-1e-9){list.push(p);rem=q(rem-p)}}
  return {below:false,bar,target,side,list,got:bar+(side-rem)*2,missing:Math.round(rem*2*100)/100};
}
function plateTarget(ex){
  const sess=S.sessions[todayKey()],arr=(sess&&sess.sets[ex.id])||[];
  const open=arr.find(s=>!s.done&&s.w>0);if(open)return open.w;
  const sg=suggest(ex);if(sg.w)return sg.w;
  const any=arr.find(s=>s.w>0);return any?any.w:null;
}
function plateResult(st){
  const r=plateCalc(st.w,st.bar,platesAvail());
  if(!r)return '<p class="muted" style="margin:10px 0 0">ใส่น้ำหนักรวมที่ต้องการยก</p>';
  if(r.below)return `<p class="muted" style="margin:10px 0 0">น้ำหนักน้อยกว่าบาร์เปล่า (${fmtP(r.bar)} kg) ใช้บาร์ที่เบากว่าหรือดัมเบลแทน</p>`;
  const vis=r.list.slice().reverse().map(p=>{const [c,t]=PLATE_STYLE[p]||['#999','#fff'];return `<i class="pl" style="--c:${c};--t:${t};--h:${PLATE_H[p]||50}px">${fmtP(p)}</i>`}).join('');
  return `<div class="bar-vis" role="img" aria-label="แผ่นข้างละ ${r.list.map(fmtP).join(', ')}"><span class="tip"></span>${vis}<span class="collar"></span><span class="rod"></span></div>
    <p class="pl-txt">${r.list.length?`ข้างละ <b>${r.list.map(fmtP).join(' + ')}</b> kg (${r.list.length} แผ่น)`:'บาร์เปล่า ไม่ต้องใส่แผ่น'}</p>
    ${r.missing>0?`<p class="hint" style="margin-top:6px">ใส่ได้ใกล้สุด <b>${fmtP(r.got)} kg</b> ขาดอีก ${fmtP(r.missing)} kg เพราะไม่มีแผ่นเล็กพอ</p>`:''}`;
}
function renderPlate(){
  const st=S.sheet,bars=BARS.includes(st.bar)?BARS:BARS.concat([st.bar]);
  return `<div class="sh-head"><h2>แผ่นน้ำหนัก${st.exName?`<br><small class="muted" style="font-weight:400;font-size:14px">${esc(st.exName)}</small>`:''}</h2><button type="button" class="x" data-act="sheetclose" aria-label="ปิด">×</button></div>
    <div class="pl-row"><button type="button" class="btn ghost" data-act="plw" data-d="-2.5" aria-label="ลด 2.5 กิโลกรัม">−2.5</button>
      <label class="f big"><input id="plw" type="number" inputmode="decimal" step="0.5" min="0" value="${st.w??''}" placeholder="เช่น 60" aria-label="น้ำหนักรวม"><span>kg รวม</span></label>
      <button type="button" class="btn ghost" data-act="plw" data-d="2.5" aria-label="เพิ่ม 2.5 กิโลกรัม">+2.5</button></div>
    <div class="chips" style="margin:10px 0 0"><span class="muted" style="font-size:14px;align-self:center">บาร์</span>${bars.map(b=>`<button type="button" class="chip" data-act="plbar" data-b="${b}" aria-pressed="${st.bar===b}">${fmtP(b)} kg</button>`).join('')}</div>
    <div id="plres">${plateResult(st)}</div>
    <p class="muted" style="font-size:13px;margin:12px 0 0">แผ่นที่มี: ${platesAvail().map(fmtP).join(', ')} kg · เปลี่ยนได้ที่ ตั้งค่า > แผ่นน้ำหนัก</p>`;
}

/* ---------- backup ---------- */
function backupObj(){return {app:'gymlog3',version:2,exportedAt:new Date().toISOString(),profile:S.profile,sessions:S.sessions,food:S.food}}
function csvText(){
  const EXM=exMap(),q=v=>{v=String(v??'');return /[",\n]/.test(v)?`"${v.replace(/"/g,'""')}"`:v};
  const rows=[['วันที่','วันฝึก','ท่า','เซ็ต','น้ำหนัก (kg)','ครั้งหรือวินาที','หน่วย']];
  Object.keys(S.sessions).sort().forEach(k=>{const s=S.sessions[k],d=dayOf(s.day);
    Object.entries(s.sets||{}).forEach(([id,arr])=>{const ex=EXM[id];arr.forEach((x,i)=>{if(!x.done)return;rows.push([k,d?d.name:s.day,ex?ex.n:id,i+1,x.w??'',x.r??'',ex&&ex.unit==='sec'?'วินาที':'ครั้ง'])})})});
  return '\uFEFF'+rows.map(r=>r.map(q).join(',')).join('\n');
}
const isTouch=()=>matchMedia('(pointer: coarse)').matches;
async function download(filename,data,mime){
  mime=mime||(/\.json$/.test(filename)?'application/json':/\.csv$/.test(filename)?'text/csv':/\.ics$/.test(filename)?'text/calendar':'text/plain');
  const blob=new Blob([data],{type:mime+';charset=utf-8'});
  const done=()=>{S.fallback=null;if(/\.json$/.test(filename)){try{localStorage.setItem(LS_BK,String(Date.now()))}catch(_){}}render()};
  // phones: share sheet, so the file can go straight to Google Drive, iCloud Drive, Files…
  if(isTouch()&&!/\.ics$/.test(filename)&&navigator.canShare){
    try{const file=new File([blob],filename,{type:mime});
      if(navigator.canShare({files:[file]})){await navigator.share({files:[file],title:filename});toast('ส่งไฟล์แล้ว');done();return}
    }catch(e){if(e&&e.name==='AbortError')return}
  }
  try{
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),4000);toast('ดาวน์โหลดแล้ว');done();
  }catch(e){S.fallback=data;render()}
}
async function importText(txt){
  let o;try{o=JSON.parse(txt)}catch(e){toast('อ่านไฟล์ไม่ได้ ต้องเป็นไฟล์สำรอง .json จากแอปนี้');return}
  if(!o||typeof o!=='object'||!o.sessions||!o.food){toast('ไฟล์นี้ไม่ใช่ไฟล์สำรองของสมุดยิม');return}
  if(!confirm('รวมข้อมูลจากไฟล์เข้ากับข้อมูลตอนนี้ไหม (ถ้าวันเดียวกัน จะใช้อันที่แก้ล่าสุด)'))return;
  const n=mergeIn(o);render();toast(`กู้คืนแล้ว ${n} รายการ`);Drive.schedule();
}

/* ---------- calendar file (.ics) for phone notifications ---------- */
function icsEsc(s){return String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n')}
function icsFold(line){
  const enc=new TextEncoder();if(enc.encode(line).length<=74)return line;
  const out=[];let cur='',lim=74;
  for(const ch of line){if(enc.encode(cur+ch).length>lim){out.push(cur);cur=ch;lim=73}else cur+=ch}
  out.push(cur);return out.join('\r\n ');
}
function icsText(time,alarm,summaryOn){
  const [hh,mm]=(time||'17:00').split(':').map(Number),p2=n=>String(n).padStart(2,'0');
  const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+Z$/,'Z');
  const BY=['SU','MO','TU','WE','TH','FR','SA'];
  const L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//gymlog//TH','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:สมุดยิม'];
  const ev=(uidv,wd,h,m,dur,sum,desc,al)=>{
    let d=new Date();d.setHours(0,0,0,0);while(d.getDay()!==wd)d=addDays(d,1);
    const ds=`${d.getFullYear()}${p2(d.getMonth()+1)}${p2(d.getDate())}T${p2(h)}${p2(m)}00`;
    L.push('BEGIN:VEVENT',`UID:${uidv}@gymlog`,`DTSTAMP:${stamp}`,`DTSTART:${ds}`,`DURATION:${dur}`,`RRULE:FREQ=WEEKLY;BYDAY=${BY[wd]}`,
      `SUMMARY:${icsEsc(sum)}`,`DESCRIPTION:${icsEsc(desc)}`);
    if(al!=null)L.push('BEGIN:VALARM','ACTION:DISPLAY',`DESCRIPTION:${icsEsc(sum)}`,`TRIGGER:-PT${al}M`,'END:VALARM');
    L.push('END:VEVENT');
  };
  days().forEach(d=>ev('day-'+d.id,d.wd,hh,mm,'PT1H30M',`ไปยิม: ${d.name}`,`${d.title}\n`+d.ex.map((e,i)=>`${i+1}. ${e.n} ${e.sets}×${e.lo===e.hi?e.lo:e.lo+'-'+e.hi}`).join('\n'),alarm));
  if(summaryOn)ev('weekly-summary',0,20,0,'PT15M','ดูสรุปผลประจำสัปดาห์','เปิดสมุดยิม แท็บสรุป และสำรองข้อมูล',0);
  L.push('END:VCALENDAR');
  return L.map(icsFold).join('\r\n')+'\r\n';
}

/* ---------- install & updates ---------- */
let installEvt=null;
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;if(S.view==='settings')render()});
window.addEventListener('appinstalled',()=>{installEvt=null;toast('ติดตั้งแล้ว');if(S.view==='settings')render()});
let swWaiting=null;
function showUpdate(w){swWaiting=w;const el=$('#update');if(el)el.hidden=false}
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./sw.js').then(reg=>{
      if(reg.waiting&&navigator.serviceWorker.controller)showUpdate(reg.waiting);
      reg.addEventListener('updatefound',()=>{const nw=reg.installing;nw&&nw.addEventListener('statechange',()=>{if(nw.state==='installed'&&navigator.serviceWorker.controller)showUpdate(nw)})});
      setInterval(()=>reg.update().catch(()=>{}),60*60*1000);
    }).catch(()=>{});
    let reloading=false;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)return;reloading=true;location.reload()});
  });
}

/* ---------- events ---------- */
function onField(e){
  const t=e.target;
  if(t.id==='plw'&&S.sheet&&S.sheet.type==='plate'){S.sheet.w=num(t.value);const el=$('#plres');if(el)el.innerHTML=plateResult(S.sheet);return}
  if(t.id==='sbar'){S.profile.barKg=num(t.value);save('p','me');return}
  if(t.dataset.c&&S.view==='calc'){const c=calcState(),k=t.dataset.c;c[k]=(k==='act'||k==='fatPct'||k==='meals')?num(t.value):(t.value===''?null:num(t.value));const o=$('#calcOut');if(o)o.innerHTML=calcOut();return}
  if(t.dataset.ex&&S.view==='today'){const day=activeDay();if(!day)return;const sess=ensureSession(day),ex=day.ex.find(x=>x.id===t.dataset.ex);if(!ex)return;
    setsFor(sess,ex)[+t.dataset.i][t.dataset.k]=num(t.value);save('s',sess.date);return}
  if(t.dataset.p&&S.draft){
    const parts=t.dataset.p.split('.');let o=S.draft.days;
    for(let i=0;i<parts.length-1;i++)o=o[parts[i]];
    const f=parts[parts.length-1];
    if(f==='wd'&&o.name==='วัน'+TH_DAY[o.wd]){o.name='วัน'+TH_DAY[parseInt(t.value,10)];if(e.type==='change')setTimeout(render,0)}
    if(t.type==='checkbox')o[f]=t.checked;
    else if(['sets','lo','hi','rest','wd'].includes(f))o[f]=parseInt(t.value,10);
    else if(f==='inc')o[f]=num(t.value)??0;
    else o[f]=t.value;
    if(f==='unit'&&e.type==='change')render();
  }
}
document.addEventListener('input',onField);
document.addEventListener('change',e=>{
  if(e.target.id==='imp'){const f=e.target.files&&e.target.files[0];if(f)f.text().then(importText);e.target.value='';return}
  if(e.target.tagName==='SELECT'||e.target.type==='checkbox')onField(e);
});
document.addEventListener('click',async e=>{
  const nb=e.target.closest('nav.tabs button');
  if(nb){if(S.view==='editor'&&!confirm('ออกจากหน้าแก้ไขโดยไม่บันทึกไหม'))return;closeSheet();S.draft=null;S.view=nb.dataset.view;if(S.view==='food')S.foodDate=null;render();window.scrollTo(0,0);return}
  const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='sheetclose'){closeSheet();return}
  if(a==='hist'){S.sheet={type:'hist',ex:b.dataset.ex};openSheet(renderHist(b.dataset.ex));return}
  if(a==='plate'){const ex=exMap()[b.dataset.ex];if(!ex)return;S.sheet={type:'plate',ex:ex.id,exName:ex.n,w:plateTarget(ex),bar:barKg()};openSheet(renderPlate());return}
  if(a==='plw'){const st=S.sheet;if(!st||st.type!=='plate')return;st.w=r05(Math.max(0,(st.w??st.bar)+ +b.dataset.d));openSheet(renderPlate());return}
  if(a==='plbar'){const st=S.sheet;if(!st||st.type!=='plate')return;st.bar=+b.dataset.b;openSheet(renderPlate());return}
  if(a==='pltog'){const p=+b.dataset.p,cur=platesAvail(),nx=cur.includes(p)?cur.filter(x=>x!==p):cur.concat([p]);if(!nx.length){toast('ต้องมีแผ่นอย่างน้อย 1 ขนาด');return}S.profile.plates=nx.sort((x,y)=>y-x);save('p','me');render();return}
  if(a==='pick'){const d=b.dataset.day,s=S.sessions[todayKey()];if(s){s.day=d;save('s',s.date)}else S.dayPick=d;render();return}
  if(a==='tick'){
    const day=activeDay(),sess=ensureSession(day),ex=day.ex.find(x=>x.id===b.dataset.ex),arr=setsFor(sess,ex),s=arr[+b.dataset.i];
    if(!s.done){const row=b.closest('.set'),wi=row.querySelector('[data-k="w"]'),ri=row.querySelector('[data-k="r"]');
      if(wi&&s.w==null&&wi.placeholder!=='')s.w=num(wi.placeholder);
      if(s.r==null)s.r=num(ri.value)??ex.lo;
      s.done=true;startTimer(ex.rest,arr.some(x=>!x.done)?`พัก ${fmtRest(ex.rest)} ก่อนเซ็ตถัดไป`:'จบท่านี้แล้ว พักแล้วไปท่าต่อไป');
    } else s.done=false;
    save('s',sess.date);render();const p=dayProgress(sess,day);if(p.done===p.total)toast('ครบทุกเซ็ตแล้ว เก่งมาก');return}
  if(a==='t30'){T.end=Math.max(T.end,Date.now())+30000;$('#timer').classList.remove('over');tick();return}
  if(a==='tstop'){stopTimer();return}
  // food
  const fk=S.foodDate||todayKey(),fday=()=>{if(!S.food[fk])S.food[fk]={date:fk,items:[],water:0};return S.food[fk]};
  const addItem=(name,p,k,c,f)=>{fday().items.push({id:uid('i'),name,p,k,c,f});save('f',fk);render()};
  if(a==='fadd'){const name=$('#fn').value.trim(),p=num($('#fp').value)||0,c=num($('#fc').value),f=num($('#ff').value);let k=num($('#fk').value)||0;
    if(!k&&(p||c||f))k=Math.round(p*4+(c||0)*4+(f||0)*9);
    if(!p&&!k){toast('ใส่พลังงานหรือสารอาหารอย่างน้อยหนึ่งช่อง');$('#fk').focus();return}addItem(name||'อาหาร',p,k,c,f);toast('เพิ่มแล้ว');return}
  if(a==='preset'){const x=PRESETS[+b.dataset.i];addItem(x.name,x.p,x.k,x.c,x.f);toast(`เพิ่ม ${x.name} แล้ว`);return}
  if(a==='fdel'){const d=fday();d.items=d.items.filter(i=>i.id!==b.dataset.id);save('f',fk);render();return}
  if(a==='w+'||a==='w-'){const d=fday();d.water=Math.max(0,(d.water||0)+(a==='w+'?1:-1));save('f',fk);render();return}
  if(a==='fprev'){S.foodDate=keyOf(addDays(fromKey(fk),-1));render();return}
  if(a==='fnext'){const n=keyOf(addDays(fromKey(fk),1));S.foodDate=n>=todayKey()?null:n;render();return}
  if(a==='wprev'){S.weekOff--;render();return}
  if(a==='wnext'){if(S.weekOff<0)S.weekOff++;render();return}
  // goals & bodyweight
  if(a==='gadd'){const ex=$('#gex').value,kg=num($('#gkg').value),reps=parseInt($('#greps').value,10),by=$('#gby').value||null;
    const EXM=exMap();if(!ex||!EXM[ex]){toast('เลือกท่าก่อน');return}
    if(EXM[ex].unit==='kg'&&!(kg>0)){toast('ใส่น้ำหนักเป้าหมาย');$('#gkg').focus();return}
    if(!(reps>0)){toast('ใส่จำนวนครั้ง');return}
    S.profile.goals=(S.profile.goals||[]).concat([{id:uid('g'),ex,kg:kg||0,reps,by}]);save('p','me');render();toast('เพิ่มเป้าหมายแล้ว');return}
  if(a==='gdel'){if(!confirm('ลบเป้าหมายนี้ไหม'))return;S.profile.goals=(S.profile.goals||[]).filter(g=>g.id!==b.dataset.id);save('p','me');render();return}
  if(a==='bwsave'){const v=num($('#bwv').value),g=num($('#bwg').value);
    if(v==null&&g==null){toast('ใส่น้ำหนักวันนี้หรือเป้าหมาย');return}
    if(v!=null){S.profile.bwLog=Object.assign({},S.profile.bwLog||{},{[todayKey()]:v});S.profile.bw=v}
    S.profile.bwGoal=g;save('p','me');render();toast('บันทึกแล้ว');return}
  // settings
  if(a==='calc'){S.view='calc';render();window.scrollTo(0,0);return}
  if(a==='csel'){calcState()[b.dataset.k]=b.dataset.v;render();return}
  if(a==='capply'){const c=calcState(),r=calcCompute(c);if(r.err){toast(r.err);return}
    Object.assign(S.profile,{kcal:r.kcal,protein:r.protein,carb:r.carb,fat:r.fat,bw:r.w,calc:clone(c)});save('p','me');S.view='food';S.foodDate=null;render();window.scrollTo(0,0);toast('ตั้งเป้าสารอาหารแล้ว');return}
  if(a==='ssave'){S.profile.bw=num($('#sbw').value);S.profile.protein=num($('#sp').value);S.profile.kcal=num($('#sk').value);S.profile.carb=num($('#sc').value);S.profile.fat=num($('#sf').value);save('p','me');toast('บันทึกเป้าหมายแล้ว');render();return}
  if(a==='exjson'){download(`gymlog-backup-${todayKey()}.json`,JSON.stringify(backupObj()));return}
  if(a==='excsv'){download(`gymlog-workouts-${todayKey()}.csv`,csvText());return}
  if(a==='copyfb'){const t=$('#fbtxt');try{await navigator.clipboard.writeText(t.value);toast('คัดลอกแล้ว')}catch(_){t.select();toast('เลือกข้อความแล้ว กดคัดลอกเองได้เลย')}return}
  if(a==='imppaste'){const t=$('#pastetxt').value.trim();if(t)importText(t);return}
  if(a==='dsync'){await Drive.sync(true);if(!Drive.err){toast('ซิงก์กับ Google Drive แล้ว');if(S.view==='settings')render()}else if(Drive.err==='fail')toast('ซิงก์ไม่สำเร็จ');return}
  if(a==='ddisc'){if(!confirm('เลิกเชื่อมต่อ Google Drive ไหม ข้อมูลในเครื่องและใน Drive ยังอยู่'))return;Drive.disconnect();render();return}
  if(a==='install'){if(installEvt){installEvt.prompt();try{await installEvt.userChoice}catch(_){}installEvt=null;render()}return}
  if(a==='update'){if(swWaiting)swWaiting.postMessage('SKIP_WAITING');return}
  if(a==='checkupd'){
    if(!('serviceWorker' in navigator)){location.reload();return}
    toast('กำลังตรวจ…');
    try{const reg=await navigator.serviceWorker.getRegistration();if(!reg){location.reload();return}
      await reg.update();
      if(reg.waiting){showUpdate(reg.waiting);toast('มีเวอร์ชันใหม่ กดปุ่มอัปเดตด้านบน')}
      else if(reg.installing){toast('กำลังโหลดเวอร์ชันใหม่ รอสักครู่แล้วจะมีปุ่มอัปเดต')}
      else toast(`เป็นเวอร์ชันล่าสุดแล้ว (${APP_VERSION})`)}
    catch(e){toast('ตรวจไม่สำเร็จ ลองใหม่ตอนมีอินเทอร์เน็ต')}
    return}
  if(a==='ics'){S.profile.notifyTime=$('#nt').value||'17:00';S.profile.notifyAlarm=+$('#na').value;S.profile.notifySummary=$('#nsum').checked;save('p','me');
    download('gymlog-schedule.ics',icsText(S.profile.notifyTime,S.profile.notifyAlarm,S.profile.notifySummary),'text/calendar');return}
  if(a==='reset'){if(!confirm(Drive.connected()?'ลบบันทึกในเครื่องนี้ทั้งหมดไหม (ถ้าเชื่อม Drive อยู่ ข้อมูลใน Drive จะถูกรวมกลับมาตอนซิงก์ ให้เลิกเชื่อมต่อก่อนถ้าจะเริ่มใหม่จริงๆ)':'ลบบันทึกการฝึกและอาหารทั้งหมดจริงไหม'))return;
    S.sessions={};S.food={};lsSave();render();toast('ลบข้อมูลแล้ว');
    Drive.schedule();return}
  // editor
  if(a==='edit'){S.draft=clone(prog());if(!S.draft.archive)S.draft.archive={};S.view='editor';render();window.scrollTo(0,0);return}
  const D=S.draft;
  if(D){
    const di=+b.dataset.d,j=+b.dataset.j;
    if(a==='exadd'){D.days[di].ex.push({id:uid('x'),n:'',alt:'',sets:3,lo:8,hi:12,rest:90,inc:2.5,unit:'kg'});render();const ins=document.querySelectorAll(`[data-p^="${di}.ex."][data-p$=".n"]`);if(ins.length)ins[ins.length-1].focus();return}
    if(a==='exdel'){const ex=D.days[di].ex[j];if(ex.n&&!confirm(`ลบท่า ${ex.n} ไหม`))return;D.days[di].ex.splice(j,1);render();return}
    if(a==='exup'||a==='exdn'){const arr=D.days[di].ex,k=a==='exup'?j-1:j+1;if(k<0||k>=arr.length)return;[arr[j],arr[k]]=[arr[k],arr[j]];render();return}
    if(a==='dayadd'){const used=D.days.map(d=>d.wd),wd=[2,4,6,0,1,3,5].find(w=>!used.includes(w))??6;D.days.push({id:uid('d'),name:'วัน'+TH_DAY[wd],wd,title:'',light:false,ex:[]});render();return}
    if(a==='daydel'){const d=D.days[di];if(!confirm(`ลบ ${d.name} ออกจากโปรแกรมไหม`))return;D.days.splice(di,1);render();return}
    if(a==='progdefault'){if(!confirm('แทนที่โปรแกรมที่กำลังแก้ด้วยโปรแกรมเริ่มต้นไหม'))return;const arch=D.archive;S.draft=clone(DEFAULT_PROGRAM);S.draft.archive=arch||{};render();return}
    if(a==='edcancel'){S.draft=null;S.view='settings';render();return}
    if(a==='edsave'){
      for(const d of D.days){if(!String(d.name).trim()){toast('ตั้งชื่อวันฝึกให้ครบ');return}
        for(const e of d.ex){
          if(!String(e.n).trim()){toast(`${d.name}: มีท่าที่ยังไม่ได้ใส่ชื่อ`);return}
          if(!(e.sets>=1&&e.sets<=10)){toast(`${e.n}: จำนวนเซ็ตต้องอยู่ระหว่าง 1–10`);return}
          if(!(e.lo>=1)||!(e.hi>=e.lo)){toast(`${e.n}: ช่วงครั้งไม่ถูกต้อง (สูงสุดต้องไม่น้อยกว่าต่ำสุด)`);return}
          if(!(e.rest>=0))e.rest=60; if(!(e.inc>=0))e.inc=0;
          e.n=String(e.n).trim();e.alt=String(e.alt||'').trim();}}
      const newIds=new Set();D.days.forEach(d=>d.ex.forEach(e=>newIds.add(e.id)));
      prog().days.forEach(d=>d.ex.forEach(e=>{if(!newIds.has(e.id)&&histOf(e.id).length)D.archive[e.id]={n:e.n,unit:e.unit,sets:e.sets,lo:e.lo,hi:e.hi,inc:e.inc}}));
      newIds.forEach(id=>{if(D.archive[id])delete D.archive[id]});
      S.profile.program=clone(D);S.draft=null;save('p','me');S.view='settings';render();window.scrollTo(0,0);
      toast('บันทึกโปรแกรมแล้ว');return}
  }
});

document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
/* ---------- boot ---------- */
lsLoad();
{const v=new URLSearchParams(location.search).get('view');if(['today','food','progress','report','settings'].includes(v))S.view=v}
render();
let lastDay=todayKey();
setInterval(()=>{if(todayKey()!==lastDay){lastDay=todayKey();S.dayPick=null;if(S.view!=='editor')render()}},60000);
