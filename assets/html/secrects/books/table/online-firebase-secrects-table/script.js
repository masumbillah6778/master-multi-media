import { auth, db, provider, signInWithPopup, signOut, onAuthStateChanged, collection, doc, getDocs, setDoc, deleteDoc, query, orderBy } from "./firebase.js";

const ALLOWED_EMAIL="masumbillah6778@gmail.com";
let records=[], editingId=null, currentUser=null;

function escapeHTML(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}
function formatDate(d){if(!d)return "";const p=d.split("-");return p.length===3?p[2]+"-"+p[1]+"-"+p[0]:d;}
function changeHTML(v){v=String(v||"").trim();if(!v)return `<span class="normal-value">-</span>`;if(v.startsWith("+"))return `<span class="add-value">${escapeHTML(v)}</span>`;if(v.startsWith("-"))return `<span class="remove-value">${escapeHTML(v)}</span>`;return `<span class="normal-value">${escapeHTML(v)}</span>`;}
function toast(m){const x=document.getElementById("toast");x.textContent=m;x.style.display="block";setTimeout(()=>x.style.display="none",1800);}
function col(){if(!currentUser)throw Error("Not signed in");return collection(db,"app1_users",currentUser.uid,"records");}

function loginUI(){
 if(document.getElementById("loginScreen"))return;
 const b=document.createElement("div");b.id="loginScreen";b.style.cssText="position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;background:#eef3f7";
 b.innerHTML=`<div style="width:min(430px,100%);background:#fff;border-radius:24px;padding:30px;box-shadow:0 10px 35px #0002;text-align:center"><div style="font-size:50px">🔐</div><h2 style="margin:8px 0;color:#117d73">অনলাইন ডাটা সিস্টেম</h2><p style="color:#64748b">অনুমোদিত Google/Gmail দিয়ে প্রবেশ করুন</p><button id="googleLoginBtn" style="border:0;border-radius:12px;padding:14px 22px;background:#117d73;color:#fff;font-size:17px;font-weight:bold;cursor:pointer;width:100%">🔑 Google দিয়ে Login</button><div id="loginError" style="margin-top:14px;color:#dc2626;font-size:14px"></div></div>`;
 document.body.appendChild(b);
 document.getElementById("googleLoginBtn").onclick=async()=>{const btn=document.getElementById("googleLoginBtn"),err=document.getElementById("loginError");btn.disabled=true;btn.textContent="⏳ Login হচ্ছে...";try{await signInWithPopup(auth,provider);}catch(e){err.textContent="Login ব্যর্থ: "+(e.code||e.message);btn.disabled=false;btn.textContent="🔑 Google দিয়ে Login";}};
}
function showLogin(){loginUI();document.getElementById("loginScreen").style.display="flex";}
function hideLogin(){const x=document.getElementById("loginScreen");if(x)x.style.display="none";}
function userBar(){let b=document.getElementById("userBar");if(!b){b=document.createElement("div");b.id="userBar";b.className="no-print";b.style.cssText="background:#0f6f67;color:#fff;padding:8px 15px;display:flex;align-items:center;justify-content:flex-end;gap:12px;font-size:14px;flex-wrap:wrap";document.body.insertBefore(b,document.body.firstChild);}b.innerHTML=`<span>👤 ${escapeHTML(currentUser.email)}</span><button id="logoutBtn" style="border:0;border-radius:8px;padding:7px 12px;background:#fff;color:#0f6f67;font-weight:bold">Logout</button>`;document.getElementById("logoutBtn").onclick=()=>signOut(auth);}

async function load(){records=[];const snap=await getDocs(query(col(),orderBy("createdAt","asc")));snap.forEach(d=>records.push({id:d.id,...d.data()}));renderTable();updateDashboard();}
window.showSection=function(id,button){document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelectorAll(".nav button").forEach(b=>b.classList.remove("active"));if(button)button.classList.add("active");renderTable();updateDashboard();};
function renderTable(){const tb=document.getElementById("tableBody"),s=document.getElementById("search").value.trim().toLowerCase(),a=records.filter(r=>[r.name,r.date,r.details,r.manpower,r.change].join(" ").toLowerCase().includes(s));tb.innerHTML="";if(!a.length){tb.innerHTML='<tr><td colspan="7" style="text-align:center;padding:30px;color:#64748b;background:#fff">কোনো তথ্য পাওয়া যায়নি।</td></tr>';return;}a.forEach((r,i)=>{const tr=document.createElement("tr");tr.innerHTML=`<td class="serial">${i+1}.</td><td>${escapeHTML(r.name)}</td><td class="date-cell">${formatDate(r.date)}</td><td class="details-cell">${escapeHTML(r.details)}</td><td class="manpower">${escapeHTML(r.manpower||"-")}</td><td class="manpower">${changeHTML(r.change)}</td><td class="action-cell no-print"><button class="edit-btn" onclick="editRecord('${r.id}')">✏️ Edit</button><button class="delete-btn" onclick="deleteRecord('${r.id}')">🗑 Delete</button></td>`;tb.appendChild(tr);});}

document.getElementById("dataForm").addEventListener("submit",async e=>{e.preventDefault();if(!currentUser)return alert("আগে Google Login করুন।");const item={name:document.getElementById("name").value.trim(),date:document.getElementById("date").value,details:document.getElementById("details").value.trim(),manpower:document.getElementById("manpower").value.trim(),change:document.getElementById("change").value.trim(),createdAt:Date.now(),ownerUid:currentUser.uid,ownerEmail:currentUser.email.toLowerCase()};if(item.change&&!/^[+-]/.test(item.change))return alert("যুক্ত করার জন্য + এবং অপসারণের জন্য - চিহ্ন ব্যবহার করুন।");const id=Date.now()+"_"+Math.random().toString(36).slice(2,8);try{await setDoc(doc(col(),id),item);records.push({id,...item});resetForm();renderTable();updateDashboard();toast("✅ তথ্য Online-এ সফলভাবে সংরক্ষণ হয়েছে");}catch(e){alert("তথ্য সংরক্ষণ করা যায়নি:\n\n"+e.message);}});
window.resetForm=function(){document.getElementById("dataForm").reset();document.getElementById("formHeading").textContent="➕ ফরম পূরণ";editingId=null;};
window.editRecord=function(id){const r=records.find(x=>x.id===id);if(!r)return;document.getElementById("editId").value=id;document.getElementById("editName").value=r.name||"";document.getElementById("editDate").value=r.date||"";document.getElementById("editDetails").value=r.details||"";document.getElementById("editManpower").value=r.manpower||"";document.getElementById("editChange").value=r.change||"";document.getElementById("editModal").style.display="flex";};
document.getElementById("editForm").addEventListener("submit",async e=>{e.preventDefault();const id=document.getElementById("editId").value,r=records.find(x=>x.id===id);if(!r)return;const change=document.getElementById("editChange").value.trim();if(change&&!/^[+-]/.test(change))return alert("যুক্ত করার জন্য + এবং অপসারণের জন্য - চিহ্ন ব্যবহার করুন।");const u={name:document.getElementById("editName").value.trim(),date:document.getElementById("editDate").value,details:document.getElementById("editDetails").value.trim(),manpower:document.getElementById("editManpower").value.trim(),change,createdAt:r.createdAt||Date.now(),ownerUid:currentUser.uid,ownerEmail:currentUser.email.toLowerCase()};try{await setDoc(doc(col(),id),u,{merge:true});Object.assign(r,u);closeModal();renderTable();updateDashboard();toast("✅ তথ্য পরিবর্তন সফল হয়েছে");}catch(e){alert("পরিবর্তন সংরক্ষণ করা যায়নি:\n\n"+e.message);}});
window.closeModal=function(){document.getElementById("editModal").style.display="none";};
window.deleteRecord=async function(id){const r=records.find(x=>x.id===id);if(!r||!confirm("আপনি কি এই তথ্যটি Delete করতে চান?"))return;try{await deleteDoc(doc(col(),id));records=records.filter(x=>x.id!==id);renderTable();updateDashboard();toast("🗑 তথ্য Delete করা হয়েছে");}catch(e){alert("তথ্য Delete করা যায়নি:\n\n"+e.message);}};
function updateDashboard(){document.getElementById("totalCount").textContent=records.length;document.getElementById("addCount").textContent=records.filter(r=>String(r.change||"").startsWith("+")).length;document.getElementById("removeCount").textContent=records.filter(r=>String(r.change||"").startsWith("-")).length;}
document.getElementById("search").addEventListener("input",renderTable);
window.printTable=function(){const b=document.querySelectorAll(".nav button")[2];showSection("viewSection",b);setTimeout(()=>window.print(),200);};
document.getElementById("editModal").addEventListener("click",e=>{if(e.target===e.currentTarget)closeModal();});

onAuthStateChanged(auth,async user=>{if(!user){currentUser=null;records=[];showLogin();return;}if((user.email||"").toLowerCase()!==ALLOWED_EMAIL){alert("এই Google account অনুমোদিত নয়।\n\nঅনুমোদিত Gmail: "+ALLOWED_EMAIL);await signOut(auth);return;}currentUser=user;hideLogin();userBar();try{await load();}catch(e){console.error(e);alert("Firebase থেকে তথ্য লোড করা যায়নি।\n\nFirestore Rules পরীক্ষা করুন।\n\n"+e.message);}});


/* ===== JSON BACKUP / FULL RESTORE ===== */
function downloadFile(name, content, type){
  const blob=new Blob([content],{type:type||"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function makeJSONBackup(){
  if(!currentUser)return alert("আগে Google Login করুন।");
  try{
    await load();
    const payload={
      backupVersion:2,
      app:"online-secrect-table",
      firebaseProject:"online-secrect-table",
      ownerUid:currentUser.uid,
      ownerEmail:(currentUser.email||"").toLowerCase(),
      exportedAt:new Date().toISOString(),
      recordCount:records.length,
      records:records.map(r=>({
        id:r.id,
        name:r.name||"",
        date:r.date||"",
        details:r.details||"",
        manpower:r.manpower||"",
        change:r.change||"",
        createdAt:Number(r.createdAt)||Date.now(),
        ownerUid:r.ownerUid||currentUser.uid,
        ownerEmail:r.ownerEmail||((currentUser.email||"").toLowerCase())
      }))
    };
    const stamp=new Date().toISOString().replace(/[:.]/g,"-").replace("T","_").slice(0,19);
    downloadFile("online-secrect-table-backup-"+stamp+".json",JSON.stringify(payload,null,2));
    toast("✅ JSON Backup Download হয়েছে");
  }catch(e){console.error(e);alert("Backup করা যায়নি:\n\n"+e.message);}
}
function validateJSONBackup(p){
  if(!p||typeof p!=="object"||!Array.isArray(p.records))throw new Error("JSON Backup format সঠিক নয়।");
  if(p.app!=="online-secrect-table"||p.firebaseProject!=="online-secrect-table")throw new Error("এটি এই অ্যাপের Backup ফাইল নয়।");
  const email=(currentUser.email||"").toLowerCase();
  for(const r of p.records){
    if(!r.id||typeof r.id!=="string")throw new Error("Backup-এর কোনো রেকর্ডে সঠিক Record ID নেই।");
    if(r.ownerUid&&r.ownerUid!==currentUser.uid)throw new Error("Backup-এ অন্য ব্যবহারকারীর তথ্য আছে। Restore বন্ধ করা হয়েছে।");
    if(r.ownerEmail&&String(r.ownerEmail).toLowerCase()!==email)throw new Error("Backup-এ অন্য Gmail-এর তথ্য আছে। Restore বন্ধ করা হয়েছে।");
  }
}
async function restoreJSONBackup(file){
  if(!currentUser)return alert("আগে Google Login করুন।");
  let p;
  try{p=JSON.parse(await file.text());validateJSONBackup(p);}
  catch(e){alert("❌ Restore করা যায়নি:\n\n"+e.message);return;}
  if(!p.records.length)return alert("এই Backup ফাইলে কোনো তথ্য নেই।");
  if(!confirm("এই Backup-এ "+p.records.length+"টি তথ্য আছে।\n\nমূল Record ID রেখে Firestore-এ Restore হবে। বর্তমান তথ্য মুছে ফেলা হবে না।\n\nRestore করতে OK চাপুন।"))return;
  let ok=0,fail=0;
  for(const r of p.records){
    try{
      await setDoc(doc(col(),r.id),{
        name:String(r.name||""),date:String(r.date||""),details:String(r.details||""),
        manpower:String(r.manpower||""),change:String(r.change||""),
        createdAt:Number(r.createdAt)||Date.now(),
        ownerUid:currentUser.uid,
        ownerEmail:(currentUser.email||"").toLowerCase()
      },{merge:false});
      ok++;
    }catch(e){console.error("Restore failed",r.id,e);fail++;}
  }
  try{await load();}catch(e){console.error(e);}
  alert("Restore সম্পন্ন।\n\nসফল: "+ok+"\nব্যর্থ: "+fail);
}
function exportCSV(){
  if(!currentUser)return alert("আগে Google Login করুন।");
  const q=v=>'"'+String(v??"").replace(/"/g,'""')+'"';
  const rows=[["ক্রমিক","নাম","তারিখ","বিস্তারিত","জনবল","যুক্ত / অপসারণ"],
    ...records.map((r,i)=>[i+1,r.name||"",formatDate(r.date||""),r.details||"",r.manpower||"",r.change||""])];
  const csv="\uFEFF"+rows.map(r=>r.map(q).join(",")).join("\r\n");
  downloadFile("online-secrect-table.csv",csv,"text/csv;charset=utf-8");
  toast("✅ CSV Download হয়েছে");
}
document.getElementById("jsonBackupBtn")?.addEventListener("click",makeJSONBackup);
document.getElementById("jsonRestoreBtn")?.addEventListener("click",()=>document.getElementById("jsonRestoreFile").click());
document.getElementById("jsonRestoreFile")?.addEventListener("change",async e=>{
  const file=e.target.files&&e.target.files[0];
  if(file)await restoreJSONBackup(file);
  e.target.value="";
});
document.getElementById("csvExportBtn")?.addEventListener("click",exportCSV);
document.getElementById("a4PrintBtn")?.addEventListener("click",()=>{
  const b=document.querySelectorAll(".nav button")[2];
  showSection("viewSection",b);
  setTimeout(()=>window.print(),200);
});

