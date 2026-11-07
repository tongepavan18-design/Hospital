import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, CalendarDays, Users, Stethoscope, FileText, Receipt,
  FlaskConical, Settings, Search, Plus, Menu, Bell, Languages,
  LayoutDashboard, Clock3, ChevronRight, Download, Trash2, X,
  HeartPulse, UserRound, CheckCircle2, Wallet, ClipboardList
} from "lucide-react";
import { supabase } from "./supabase";

const translations = {
  en: {
    dashboard:"Dashboard", patients:"Patients", appointments:"Appointments", doctors:"Doctors",
    prescriptions:"Prescriptions", billing:"Billing", reports:"Lab reports", settings:"Settings",
    overview:"Hospital overview", todayPatients:"Today's patients", todayAppointments:"Appointments",
    revenue:"Today's collection", pending:"Pending payments", quickActions:"Quick actions",
    addPatient:"Add patient", bookAppointment:"Book appointment", newPrescription:"New prescription",
    recentAppointments:"Recent appointments", patient:"Patient", doctor:"Doctor", time:"Time",
    status:"Status", actions:"Actions", search:"Search patients, doctors…", name:"Full name",
    phone:"Mobile number", age:"Age", gender:"Gender", address:"Address", save:"Save",
    cancel:"Cancel", date:"Date", notes:"Notes", specialty:"Specialty", fee:"Consultation fee",
    token:"Token", visit:"Visit type", inPerson:"In person", followup:"Follow-up",
    scheduled:"Scheduled", completed:"Completed", waiting:"Waiting", cancelled:"Cancelled",
    create:"Create", noData:"No records yet", demo:"Demo mode — data stays in this browser",
    allPatients:"All patients", allAppointments:"All appointments", amount:"Amount",
    paid:"Paid", unpaid:"Unpaid", prescription:"Prescription", diagnosis:"Diagnosis",
    medicine:"Medicine", dosage:"Dosage", duration:"Duration", instructions:"Instructions",
    addMedicine:"Add medicine", print:"Print / Save PDF", close:"Close", selectPatient:"Select patient",
    selectDoctor:"Select doctor", dashboardSub:"A clear view of your clinic today",
    patientAdded:"Patient saved", appointmentAdded:"Appointment booked", billingAdded:"Bill recorded"
  },
  hi: {
    dashboard:"डैशबोर्ड", patients:"मरीज़", appointments:"अपॉइंटमेंट", doctors:"डॉक्टर",
    prescriptions:"प्रिस्क्रिप्शन", billing:"बिलिंग", reports:"लैब रिपोर्ट", settings:"सेटिंग्स",
    overview:"अस्पताल का विवरण", todayPatients:"आज के मरीज़", todayAppointments:"अपॉइंटमेंट",
    revenue:"आज की वसूली", pending:"बाकी भुगतान", quickActions:"त्वरित कार्य",
    addPatient:"मरीज़ जोड़ें", bookAppointment:"अपॉइंटमेंट बुक करें", newPrescription:"नया प्रिस्क्रिप्शन",
    recentAppointments:"हाल के अपॉइंटमेंट", patient:"मरीज़", doctor:"डॉक्टर", time:"समय",
    status:"स्थिति", actions:"कार्य", search:"मरीज़, डॉक्टर खोजें…", name:"पूरा नाम",
    phone:"मोबाइल नंबर", age:"उम्र", gender:"लिंग", address:"पता", save:"सेव करें",
    cancel:"रद्द करें", date:"तारीख", notes:"नोट्स", specialty:"विशेषज्ञता", fee:"जांच शुल्क",
    token:"टोकन", visit:"विज़िट प्रकार", inPerson:"क्लिनिक में", followup:"फॉलो-अप",
    scheduled:"निर्धारित", completed:"पूरा", waiting:"प्रतीक्षा", cancelled:"रद्द",
    create:"बनाएं", noData:"अभी कोई रिकॉर्ड नहीं", demo:"डेमो मोड — डेटा इसी ब्राउज़र में रहेगा",
    allPatients:"सभी मरीज़", allAppointments:"सभी अपॉइंटमेंट", amount:"राशि",
    paid:"भुगतान हुआ", unpaid:"बाकी", prescription:"प्रिस्क्रिप्शन", diagnosis:"निदान",
    medicine:"दवा", dosage:"खुराक", duration:"अवधि", instructions:"निर्देश",
    addMedicine:"दवा जोड़ें", print:"प्रिंट / PDF सेव", close:"बंद करें", selectPatient:"मरीज़ चुनें",
    selectDoctor:"डॉक्टर चुनें", dashboardSub:"आज के क्लिनिक का पूरा विवरण",
    patientAdded:"मरीज़ सेव हुआ", appointmentAdded:"अपॉइंटमेंट बुक हुआ", billingAdded:"बिल सेव हुआ"
  },
  mr: {
    dashboard:"डॅशबोर्ड", patients:"रुग्ण", appointments:"अपॉइंटमेंट", doctors:"डॉक्टर",
    prescriptions:"प्रिस्क्रिप्शन", billing:"बिलिंग", reports:"लॅब रिपोर्ट", settings:"सेटिंग्स",
    overview:"हॉस्पिटलचा आढावा", todayPatients:"आजचे रुग्ण", todayAppointments:"अपॉइंटमेंट",
    revenue:"आजची जमा", pending:"बाकी पेमेंट", quickActions:"जलद कामे",
    addPatient:"रुग्ण जोडा", bookAppointment:"अपॉइंटमेंट बुक करा", newPrescription:"नवीन प्रिस्क्रिप्शन",
    recentAppointments:"अलीकडील अपॉइंटमेंट", patient:"रुग्ण", doctor:"डॉक्टर", time:"वेळ",
    status:"स्थिती", actions:"कृती", search:"रुग्ण किंवा डॉक्टर शोधा…", name:"पूर्ण नाव",
    phone:"मोबाईल नंबर", age:"वय", gender:"लिंग", address:"पत्ता", save:"सेव्ह करा",
    cancel:"रद्द करा", date:"तारीख", notes:"नोंदी", specialty:"विशेषता", fee:"तपासणी फी",
    token:"टोकन", visit:"भेटीचा प्रकार", inPerson:"प्रत्यक्ष", followup:"फॉलो-अप",
    scheduled:"नियोजित", completed:"पूर्ण", waiting:"प्रतीक्षा", cancelled:"रद्द",
    create:"तयार करा", noData:"अजून कोणतीही नोंद नाही", demo:"डेमो मोड — डेटा या ब्राउझरमध्ये राहील",
    allPatients:"सर्व रुग्ण", allAppointments:"सर्व अपॉइंटमेंट", amount:"रक्कम",
    paid:"पेमेंट झाले", unpaid:"बाकी", prescription:"प्रिस्क्रिप्शन", diagnosis:"निदान",
    medicine:"औषध", dosage:"डोस", duration:"कालावधी", instructions:"सूचना",
    addMedicine:"औषध जोडा", print:"प्रिंट / PDF सेव्ह", close:"बंद करा", selectPatient:"रुग्ण निवडा",
    selectDoctor:"डॉक्टर निवडा", dashboardSub:"आजच्या क्लिनिकचा संपूर्ण आढावा",
    patientAdded:"रुग्ण सेव्ह झाला", appointmentAdded:"अपॉइंटमेंट बुक झाली", billingAdded:"बिल सेव्ह झाले"
  }
};

const initialDoctors = [
  {id:"d1", name:"Dr. Add doctor name", specialty:"General Medicine", fee:300},
  {id:"d2", name:"Dr. Add doctor name", specialty:"Consultant", fee:400}
];
const seed = {
  patients: [],
  doctors: initialDoctors,
  appointments: [],
  bills: [],
  prescriptions: []
};
const readStore = () => {
  try { return JSON.parse(localStorage.getItem("ashirvad_data")) || seed; }
  catch { return seed; }
};
const today = () => new Date().toISOString().slice(0,10);
const money = n => "₹" + Number(n || 0).toLocaleString("en-IN");
const id = prefix => prefix + "-" + Date.now().toString(36).toUpperCase();

function Modal({title, children, onClose}) {
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="modal" onMouseDown={e=>e.stopPropagation()}>
    <div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X size={18}/></button></div>{children}
  </section></div>;
}
function App() {
  const [data,setData] = useState(readStore);
  const [page,setPage] = useState("dashboard");
  const [lang,setLang] = useState("en");
  const [query,setQuery] = useState("");
  const [modal,setModal] = useState("");
  const [toast,setToast] = useState("");
  const [mobileNav,setMobileNav] = useState(false);
  const t = key => translations[lang][key] || key;
  useEffect(()=>{ localStorage.setItem("ashirvad_data",JSON.stringify(data)); },[data]);
  useEffect(()=>{ if(toast){const x=setTimeout(()=>setToast(""),2600);return ()=>clearTimeout(x);} },[toast]);
  const nav = [
    ["dashboard",LayoutDashboard],["patients",Users],["appointments",CalendarDays],
    ["doctors",Stethoscope],["prescriptions",FileText],["billing",Receipt],["reports",FlaskConical]
  ];
  const todayAppts = data.appointments.filter(a=>a.date===today());
  const todayBills = data.bills.filter(b=>b.date===today());
  const collection = todayBills.filter(b=>b.paid).reduce((s,b)=>s+Number(b.amount),0);
  const pending = data.bills.filter(b=>!b.paid).reduce((s,b)=>s+Number(b.amount),0);
  const filteredPatients = data.patients.filter(p=>(p.name+" "+p.phone).toLowerCase().includes(query.toLowerCase()));
  const filteredAppts = data.appointments.filter(a=>{
    const p=data.patients.find(x=>x.id===a.patientId);
    return ((p?.name||"")+" "+(a.doctorName||"")).toLowerCase().includes(query.toLowerCase());
  });
  function savePatient(e) {
    e.preventDefault(); const f=new FormData(e.currentTarget);
    const p={id:id("PAT"),name:f.get("name"),phone:f.get("phone"),age:Number(f.get("age")||0),gender:f.get("gender"),address:f.get("address"),createdAt:today()};
    setData(d=>({...d,patients:[p,...d.patients]})); setModal("");setToast(t("patientAdded"));
  }
  function saveAppointment(e) {
    e.preventDefault(); const f=new FormData(e.currentTarget);
    const doc=data.doctors.find(x=>x.id===f.get("doctorId"));
    const a={id:id("APT"),patientId:f.get("patientId"),doctorId:doc?.id,doctorName:doc?.name||"",date:f.get("date"),time:f.get("time"),status:"scheduled",token:todayAppts.length+1,notes:f.get("notes")};
    setData(d=>({...d,appointments:[a,...d.appointments]}));setModal("");setToast(t("appointmentAdded"));
  }
  function saveDoctor(e) {
    e.preventDefault(); const f=new FormData(e.currentTarget);
    setData(d=>({...d,doctors:[...d.doctors,{id:id("DOC"),name:f.get("name"),specialty:f.get("specialty"),fee:Number(f.get("fee")||0)}]}));
    setModal("");setToast("Doctor added");
  }
  function saveBill(e) {
    e.preventDefault();const f=new FormData(e.currentTarget);
    const b={id:id("BILL"),patientId:f.get("patientId"),date:today(),amount:Number(f.get("amount")||0),description:f.get("description"),paid:f.get("paid")==="on"};
    setData(d=>({...d,bills:[b,...d.bills]}));setModal("");setToast(t("billingAdded"));
  }
  function savePrescription(e) {
    e.preventDefault();const f=new FormData(e.currentTarget);
    const p={id:id("RX"),patientId:f.get("patientId"),doctorId:f.get("doctorId"),date:today(),diagnosis:f.get("diagnosis"),medicine:f.get("medicine"),dosage:f.get("dosage"),duration:f.get("duration"),instructions:f.get("instructions")};
    setData(d=>({...d,prescriptions:[p,...d.prescriptions]}));setModal("");setToast("Prescription saved");
  }
  async function syncCloud() {
    if(!supabase){setToast("Supabase not configured. Follow SETUP.md to connect.");return;}
    setToast("Cloud connection is configured. Add the SQL schema and sign in before syncing real records.");
  }
  const patientName = pid => data.patients.find(p=>p.id===pid)?.name || "Unknown patient";
  const pageTitle = t(page);
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?"open":""}`}>
      <div className="brand"><div className="brand-mark"><HeartPulse/></div><div><b>Ashirvad Hospital</b><small>Clinic management</small></div><button className="icon-btn close-nav" onClick={()=>setMobileNav(false)}><X/></button></div>
      <div className="side-label">WORKSPACE</div>
      <nav>{nav.map(([key,Icon])=><button key={key} className={`nav-item ${page===key?"active":""}`} onClick={()=>{setPage(key);setMobileNav(false);setQuery("");}}><Icon size={18}/><span>{t(key)}</span>{page===key&&<ChevronRight size={15}/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="secure"><div className="secure-icon"><Activity size={17}/></div><div><b>Clinic workspace</b><small>Local demo environment</small></div></div><button className="nav-item" onClick={()=>setPage("settings")}><Settings size={18}/>{t("settings")}</button></div>
    </aside>
    {mobileNav&&<div className="mobile-scrim" onClick={()=>setMobileNav(false)}/>}
    <main className="main-area">
      <header className="topbar"><div className="top-left"><button className="icon-btn menu-btn" onClick={()=>setMobileNav(true)}><Menu/></button><div><div className="crumb">ASHIRVAD HOSPITAL <span>/</span> {pageTitle.toUpperCase()}</div><h1>{pageTitle}</h1></div></div>
        <div className="top-actions"><label className="language"><Languages size={16}/><select value={lang} onChange={e=>setLang(e.target.value)}><option value="en">English</option><option value="mr">मराठी</option><option value="hi">हिंदी</option></select></label><button className="icon-btn notification" title="Notifications"><Bell size={18}/></button><div className="avatar">AH</div></div>
      </header>
      <div className="content">
        {page==="dashboard"&&<Dashboard t={t} data={data} todayAppts={todayAppts} collection={collection} pending={pending} patientName={patientName} setModal={setModal} setPage={setPage}/>}
        {page==="patients"&&<section className="panel"><div className="section-head"><div><h2>{t("allPatients")}</h2><p>Patient registration and records</p></div><button className="primary" onClick={()=>setModal("patient")}><Plus size={17}/>{t("addPatient")}</button></div><SearchBox value={query} onChange={setQuery} placeholder={t("search")}/><div className="table-wrap"><table><thead><tr><th>{t("name")}</th><th>{t("phone")}</th><th>{t("age")}</th><th>{t("gender")}</th><th>Patient ID</th></tr></thead><tbody>{filteredPatients.map(p=><tr key={p.id}><td><b>{p.name}</b></td><td>{p.phone}</td><td>{p.age||"—"}</td><td>{p.gender||"—"}</td><td><span className="id-tag">{p.id}</span></td></tr>)}</tbody></table>{filteredPatients.length===0&&<Empty t={t}/>}</div></section>}
        {page==="appointments"&&<section className="panel"><div className="section-head"><div><h2>{t("allAppointments")}</h2><p>Online and reception appointments</p></div><button className="primary" onClick={()=>setModal("appointment")}><Plus size={17}/>{t("bookAppointment")}</button></div><SearchBox value={query} onChange={setQuery} placeholder={t("search")}/><div className="table-wrap"><table><thead><tr><th>{t("token")}</th><th>{t("patient")}</th><th>{t("doctor")}</th><th>{t("date")}</th><th>{t("time")}</th><th>{t("status")}</th></tr></thead><tbody>{filteredAppts.map(a=><tr key={a.id}><td>#{a.token}</td><td><b>{patientName(a.patientId)}</b></td><td>{a.doctorName}</td><td>{a.date}</td><td>{a.time}</td><td><span className={`status ${a.status}`}>{t(a.status)}</span></td></tr>)}</tbody></table>{filteredAppts.length===0&&<Empty t={t}/>}</div></section>}
        {page==="doctors"&&<section className="panel"><div className="section-head"><div><h2>Doctor directory</h2><p>Manage clinic doctors and consultation fees</p></div><button className="primary" onClick={()=>setModal("doctor")}><Plus size={17}/>Add doctor</button></div><div className="doctor-grid">{data.doctors.map(d=><div className="doctor-card" key={d.id}><div className="doctor-avatar"><Stethoscope/></div><h3>{d.name}</h3><p>{d.specialty}</p><div className="doctor-fee">{money(d.fee)} <small>/ consultation</small></div></div>)}</div></section>}
        {page==="prescriptions"&&<section className="panel"><div className="section-head"><div><h2>Digital prescriptions</h2><p>Create and keep a record of doctor-approved prescriptions</p></div><button className="primary" onClick={()=>setModal("prescription")}><Plus size={17}/>{t("newPrescription")}</button></div><div className="table-wrap"><table><thead><tr><th>{t("patient")}</th><th>{t("date")}</th><th>{t("diagnosis")}</th><th>{t("medicine")}</th><th>{t("doctor")}</th></tr></thead><tbody>{data.prescriptions.map(p=><tr key={p.id}><td>{patientName(p.patientId)}</td><td>{p.date}</td><td>{p.diagnosis}</td><td>{p.medicine}</td><td>{data.doctors.find(d=>d.id===p.doctorId)?.name||"—"}</td></tr>)}</tbody></table>{data.prescriptions.length===0&&<Empty t={t}/>}</div></section>}
        {page==="billing"&&<section className="panel"><div className="section-head"><div><h2>Billing & payments</h2><p>Consultation charges and payment tracking</p></div><button className="primary" onClick={()=>setModal("bill")}><Plus size={17}/>Create bill</button></div><div className="table-wrap"><table><thead><tr><th>{t("patient")}</th><th>{t("date")}</th><th>Description</th><th>{t("amount")}</th><th>{t("status")}</th></tr></thead><tbody>{data.bills.map(b=><tr key={b.id}><td>{patientName(b.patientId)}</td><td>{b.date}</td><td>{b.description}</td><td><b>{money(b.amount)}</b></td><td><span className={`status ${b.paid?"completed":"waiting"}`}>{b.paid?t("paid"):t("unpaid")}</span></td></tr>)}</tbody></table>{data.bills.length===0&&<Empty t={t}/>}</div></section>}
        {page==="reports"&&<section className="panel"><div className="section-head"><div><h2>Lab reports</h2><p>Record and manage laboratory report references</p></div><span className="coming">File upload module – next phase</span></div><div className="empty-state"><FlaskConical size={30}/><b>Lab report records</b><p>Secure PDF/image upload and patient-linked reports will be enabled after cloud storage setup.</p></div></section>}
        {page==="settings"&&<section className="panel"><div className="section-head"><div><h2>Hospital settings</h2><p>Configure clinic identity and cloud database</p></div></div><div className="settings-grid"><div className="setting-card"><h3>Hospital profile</h3><p><b>Ashirvad Hospital</b><br/>Multi-speciality clinic<br/>Add address, phone, registration details and opening hours before launch.</p></div><div className="setting-card"><h3>Cloud database</h3><p>{supabase?"Supabase credentials detected.":"Supabase is not connected yet."}</p><button className="secondary" onClick={syncCloud}>Check cloud setup</button></div><div className="setting-card"><h3>Demo data</h3><p>Clear this browser's sample and test records. This cannot be undone.</p><button className="danger" onClick={()=>{if(confirm("Delete all local demo records?")){localStorage.removeItem("ashirvad_data");setData(seed);}}}>Reset local demo data</button></div></div></section>}
        <footer>© {new Date().getFullYear()} Ashirvad Hospital · Confidential patient information</footer>
      </div>
    </main>
    {modal==="patient"&&<Modal title={t("addPatient")} onClose={()=>setModal("")}><form onSubmit={savePatient} className="form-grid"><Field label={t("name")} name="name" required/><Field label={t("phone")} name="phone" required/><Field label={t("age")} name="age" type="number"/><label>{t("gender")}<select name="gender"><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></label><label className="span-2">{t("address")}<input name="address"/></label><div className="form-actions span-2"><button type="button" className="secondary" onClick={()=>setModal("")}>{t("cancel")}</button><button className="primary">{t("save")}</button></div></form></Modal>}
    {modal==="appointment"&&<Modal title={t("bookAppointment")} onClose={()=>setModal("")}><form onSubmit={saveAppointment} className="form-grid"><label className="span-2">{t("selectPatient")}<select name="patientId" required><option value="">Select patient</option>{data.patients.map(p=><option value={p.id} key={p.id}>{p.name} · {p.phone}</option>)}</select></label><label className="span-2">{t("selectDoctor")}<select name="doctorId" required><option value="">Select doctor</option>{data.doctors.map(d=><option value={d.id} key={d.id}>{d.name} · {d.specialty}</option>)}</select></label><Field label={t("date")} name="date" type="date" required defaultValue={today()}/><Field label={t("time")} name="time" type="time" required/><label className="span-2">{t("notes")}<input name="notes"/></label><div className="form-actions span-2"><button type="button" className="secondary" onClick={()=>setModal("")}>{t("cancel")}</button><button className="primary">{t("create")}</button></div></form>{data.patients.length===0&&<p className="hint">Add a patient first before booking an appointment.</p>}</Modal>}
    {modal==="doctor"&&<Modal title="Add doctor" onClose={()=>setModal("")}><form onSubmit={saveDoctor} className="form-grid"><Field label="Doctor name" name="name" required/><Field label="Specialty" name="specialty" required/><Field label="Consultation fee (₹)" name="fee" type="number" required/><div className="form-actions span-2"><button type="button" className="secondary" onClick={()=>setModal("")}>{t("cancel")}</button><button className="primary">{t("save")}</button></div></form></Modal>}
    {modal==="bill"&&<Modal title="Create bill" onClose={()=>setModal("")}><form onSubmit={saveBill} className="form-grid"><label className="span-2">{t("selectPatient")}<select name="patientId" required><option value="">Select patient</option>{data.patients.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label><Field label="Description" name="description" required/><Field label="Amount (₹)" name="amount" type="number" required/><label className="check-row span-2"><input type="checkbox" name="paid"/> Payment received</label><div className="form-actions span-2"><button type="button" className="secondary" onClick={()=>setModal("")}>{t("cancel")}</button><button className="primary">{t("create")}</button></div></form></Modal>}
    {modal==="prescription"&&<Modal title={t("newPrescription")} onClose={()=>setModal("")}><form onSubmit={savePrescription} className="form-grid"><label className="span-2">{t("selectPatient")}<select name="patientId" required><option value="">Select patient</option>{data.patients.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label><label className="span-2">{t("selectDoctor")}<select name="doctorId" required><option value="">Select doctor</option>{data.doctors.map(d=><option value={d.id} key={d.id}>{d.name}</option>)}</select></label><label className="span-2">{t("diagnosis")}<input name="diagnosis" required/></label><Field label={t("medicine")} name="medicine" required/><Field label={t("dosage")} name="dosage" required/><Field label={t("duration")} name="duration"/><label className="span-2">{t("instructions")}<textarea name="instructions" rows="2"/></label><div className="form-actions span-2"><button type="button" className="secondary" onClick={()=>setModal("")}>{t("cancel")}</button><button className="primary">{t("save")}</button></div></form><p className="hint">Clinical content must be entered and approved by the treating doctor.</p></Modal>}
    {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}
function Field({label,name,type="text",required=false,defaultValue}){return <label>{label}<input name={name} type={type} required={required} defaultValue={defaultValue}/></label>}
function SearchBox({value,onChange,placeholder}){return <div className="searchbox"><Search size={17}/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></div>}
function Empty({t}){return <div className="empty-state"><ClipboardList size={28}/><b>{t("noData")}</b></div>}
function Dashboard({t,data,todayAppts,collection,pending,patientName,setModal,setPage}){
  const cards=[
    [t("todayPatients"),data.patients.length,Users,"teal"],
    [t("todayAppointments"),todayAppts.length,CalendarDays,"blue"],
    [t("revenue"),money(collection),Wallet,"purple"],
    [t("pending"),money(pending),Clock3,"orange"]
  ];
  return <div className="dashboard">
    <div className="welcome"><div><span className="eyebrow">WELCOME TO YOUR WORKSPACE</span><h2>{t("overview")}</h2><p>{t("dashboardSub")}</p></div><div className="date-pill"><CalendarDays size={16}/>{new Date().toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</div></div>
    <div className="stats-grid">{cards.map(([label,value,Icon,color])=><div className="stat-card" key={label}><div className={`stat-icon ${color}`}><Icon size={20}/></div><div><span>{label}</span><strong>{value}</strong></div></div>)}</div>
    <section className="quick-panel"><div className="section-head"><div><h2>{t("quickActions")}</h2><p>Common clinic tasks, one click away</p></div></div><div className="quick-grid"><button onClick={()=>setModal("patient")}><span className="quick-icon mint"><UserRound/></span><b>{t("addPatient")}</b><small>Register a new patient</small></button><button onClick={()=>setModal("appointment")}><span className="quick-icon sky"><CalendarDays/></span><b>{t("bookAppointment")}</b><small>Schedule a clinic visit</small></button><button onClick={()=>setModal("prescription")}><span className="quick-icon lilac"><FileText/></span><b>{t("newPrescription")}</b><small>Doctor-approved treatment record</small></button><button onClick={()=>setPage("billing")}><span className="quick-icon peach"><Receipt/></span><b>View billing</b><small>Payments and receipts</small></button></div></section>
    <section className="panel"><div className="section-head"><div><h2>{t("recentAppointments")}</h2><p>Today's scheduled clinic visits</p></div><button className="text-btn" onClick={()=>setPage("appointments")}>View all <ChevronRight size={16}/></button></div><div className="table-wrap"><table><thead><tr><th>{t("token")}</th><th>{t("patient")}</th><th>{t("doctor")}</th><th>{t("time")}</th><th>{t("status")}</th></tr></thead><tbody>{todayAppts.slice(0,6).map(a=><tr key={a.id}><td>#{a.token}</td><td><b>{patientName(a.patientId)}</b></td><td>{a.doctorName}</td><td>{a.time}</td><td><span className={`status ${a.status}`}>{t(a.status)}</span></td></tr>)}</tbody></table>{todayAppts.length===0&&<Empty t={t}/>}</div></section>
    <div className="notice"><Activity size={17}/><span><b>Demo environment:</b> Patient information is currently stored only in this browser. Configure Supabase, user authentication, backups and access policies before real clinical use.</span></div>
  </div>;
}
export default App;
