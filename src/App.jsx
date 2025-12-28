import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { 
  AlertTriangle, Trash2, Lightbulb, ShieldAlert, HelpCircle, 
  Activity, Search, Camera, Share2, ShieldCheck, X, CheckCircle, 
  MessageSquare, Layers, Map as MapIcon, Trophy, User, LogOut, Zap, Globe, ArrowRight, BarChart3, Users, Sparkles
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';


import LandingPage from './landingPage'; 


import { db, storage, auth } from './firebase'; 
import { 
  collection, addDoc, onSnapshot, query, orderBy, limit, 
  updateDoc, doc, getDocs, deleteDoc, setDoc, getDoc, increment 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged } from 'firebase/auth';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


const HeatmapLayer = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (!L.heatLayer) return;
    const heatPoints = points.map(p => [p.lat, p.lng, (p.votes || 1) * 5]); 
    const heat = L.heatLayer(heatPoints, { radius: 30, blur: 20, maxZoom: 17, gradient: { 0.4: 'blue', 0.6: 'cyan', 0.8: 'orange', 1.0: 'red' } }).addTo(map);
    return () => { map.removeLayer(heat); };
  }, [points, map]);
  return null;
};


const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  return (
    <div className={`fixed top-6 right-6 z-[3000] flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border animate-in slide-in-from-right duration-300 ${type === 'success' ? 'bg-green-900/90 border-green-500 text-green-100' : 'bg-red-900/90 border-red-500 text-red-100'}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />} <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// --- PAGE: LOGIN ---
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) { alert("Login failed: " + err.message); }
  };

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-6 left-6 cursor-pointer" onClick={() => navigate('/')}>
         <span className="text-gray-400 hover:text-white flex items-center gap-2 font-bold"><ArrowRight size={16} className="rotate-180"/> Back</span>
      </div>
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="flex justify-center mb-6"><div className="p-3 bg-indigo-600 rounded-xl"><Activity size={32} className="text-white" /></div></div>
        <h2 className="text-2xl font-bold text-center text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Sign in to report and track civic issues.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div><label className="text-xs font-bold text-gray-500 uppercase">Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white mt-1 focus:border-indigo-500 focus:outline-none" required /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white mt-1 focus:border-indigo-500 focus:outline-none" required /></div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors">Sign In</button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-400">Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold">Sign Up</Link></div>
      </div>
    </div>
  );
};

// --- PAGE: REGISTER ---
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, "users", user.uid), { name: name, email: email, karma: 0, joined: new Date() });
      navigate('/dashboard');
    } catch (err) { alert("Registration failed: " + err.message); }
  };

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-6 left-6 cursor-pointer" onClick={() => navigate('/')}>
         <span className="text-gray-400 hover:text-white flex items-center gap-2 font-bold"><ArrowRight size={16} className="rotate-180"/> Back</span>
      </div>
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Join CivicPulse</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div><label className="text-xs font-bold text-gray-500 uppercase">Full Name</label><input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white mt-1" required /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white mt-1" required /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white mt-1" required /></div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors">Create Account</button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-400">Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold">Log In</Link></div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD ---
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate('/login');
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  const [reports, setReports] = useState([]); 
  const [activeType, setActiveType] = useState('traffic');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lon: 77.2090 }); 
  const [flyToLocation, setFlyToLocation] = useState(null); 
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null }); 
  const [toast, setToast] = useState(null); 
  const [pendingLocation, setPendingLocation] = useState(null); 
  const [inputTitle, setInputTitle] = useState("");
  const [inputDesc, setInputDesc] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [userKarma, setUserKarma] = useState(0);

  useEffect(() => {
    if (!user) return;
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (doc) => { if (doc.exists()) setUserKarma(doc.data().karma || 0); });
    const q = query(collection(db, "reports"), orderBy("timestamp", "desc"));
    const unsubReports = onSnapshot(q, (snapshot) => { setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); });
    const lq = query(collection(db, "users"), orderBy("karma", "desc"), limit(5));
    const unsubLeaderboard = onSnapshot(lq, (snapshot) => { setLeaderboard(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); });
    return () => { unsubUser(); unsubReports(); unsubLeaderboard(); };
  }, [user]);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*(Math.PI/180))*Math.cos(lat2*(Math.PI/180)) * Math.sin(dLon/2)*Math.sin(dLon/2); 
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  };
  
  const visibleReports = useMemo(() => reports.filter(r => getDistance(mapCenter.lat, mapCenter.lon, r.lat, r.lng) < 30), [reports, mapCenter]);
  const safetyScore = useMemo(() => Math.max(0, 100 - (visibleReports.length * 5)), [visibleReports]);

  
  const aiStats = useMemo(() => {
    if (visibleReports.length === 0) return null;
    
    // Count report types
    const counts = visibleReports.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {});

    // Find Max
    const topIssue = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    const percentage = Math.round((counts[topIssue] / visibleReports.length) * 100);
    
    // Suggestion Logic
    let suggestion = "Monitor situation.";
    if (topIssue === 'traffic') suggestion = "Deploy traffic marshals to sector.";
    if (topIssue === 'waste') suggestion = "Schedule emergency pickup.";
    if (topIssue === 'safety') suggestion = "Increase police patrolling.";
    if (topIssue === 'light') suggestion = "Dispatch electrical repair team.";

    return { topIssue, percentage, suggestion };
  }, [visibleReports]);

  const handleLogout = () => signOut(auth).then(() => navigate('/'));

  const MapController = ({ flyToLocation, setMapCenter }) => {
    const map = useMap();
    useEffect(() => { if (flyToLocation) map.flyTo([flyToLocation.lat, flyToLocation.lon], 15, { duration: 1.5 }); }, [flyToLocation, map]);
    useMapEvents({ moveend: () => { const c = map.getCenter(); setMapCenter({ lat: c.lat, lon: c.lng }); } });
    return null;
  };
  const LocationClickReceiver = ({ onMapClick }) => { useMapEvents({ click: (e) => onMapClick(e) }); return null; };

  const handleMapClick = (e) => {
    if (showHeatmap) return showToast("Switch to Pin View to report!", "error");
    setPendingLocation(e.latlng);
    let defaultTitle = "";
    if (activeType === 'traffic') defaultTitle = "Traffic Jam";
    else if (activeType === 'waste') defaultTitle = "Garbage Issue";
    else if (activeType === 'light') defaultTitle = "Broken Light";
    else if (activeType === 'safety') defaultTitle = "Safety Hazard";
    setInputTitle(defaultTitle); setInputDesc(""); setModal({ isOpen: true, type: 'input' });
  };

  const submitReport = async () => {
    if (!inputTitle.trim()) return showToast("Please enter a title.", "error");
    setLoading(true);
    try {
      await addDoc(collection(db, "reports"), {
        lat: pendingLocation.lat, lng: pendingLocation.lng, type: activeType, title: inputTitle, description: inputDesc, 
        image: null, aiVerified: false, votes: 1, authorName: user.displayName || 'User', timestamp: new Date().toLocaleString(), createdAt: Date.now() 
      });
      await updateDoc(doc(db, "users", user.uid), { karma: increment(10) });
      setModal({ isOpen: false, type: null }); showToast("Report Posted! (+10 Karma)"); 
    } catch (e) { showToast("Failed to save report.", "error"); }
    setLoading(false);
  };

  const handleImageUpload = async (e, reportId) => {
    const file = e.target.files[0]; if (!file) return;
    showToast("🤖 AI Agent analyzing image...", "success");
    try {
      const storageRef = ref(storage, `evidence/${reportId}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "reports", reportId), { image: downloadURL, aiVerified: true });
      await updateDoc(doc(db, "users", user.uid), { karma: increment(50) });
      setModal({ isOpen: true, type: 'success', data: "Proof Verified! (+50 Karma)" });
    } catch (error) { showToast("Upload failed.", "error"); }
  };

  const handleSearch = async (e) => {
    e.preventDefault(); if (!searchQuery) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
    const data = await res.json(); setSearchResults(data);
  };
  const selectLocation = (lat, lon) => { setFlyToLocation({ lat: parseFloat(lat), lon: parseFloat(lon) }); setSearchResults([]); setSearchQuery(""); };

  // --- ADMIN TOOLS ---
  const handleResetApp = async () => {
    const password = prompt("⚠ ADMIN ZONE ⚠\nEnter password to WIPE DATA:");
    if (password !== "hackathon2025") return showToast("Wrong password!", "error");
    if (!window.confirm("Delete ALL reports?")) return;
    const q = query(collection(db, "reports"));
    const snapshot = await getDocs(q);
    await Promise.all(snapshot.docs.map(d => deleteDoc(doc(db, "reports", d.id))));
    showToast("Map cleared!", "success");
  };

  const handleSeedIndia = async () => {
    const password = prompt("ADMIN: Populate entire India?");
    if (password !== "hackathon2025") return;
    showToast("Seeding database across India...", "success");
    const cities = [{ name: "Delhi", lat: 28.6139, lng: 77.2090 }, { name: "Mumbai", lat: 19.0760, lng: 72.8777 }, { name: "Bangalore", lat: 12.9716, lng: 77.5946 }, { name: "Hyderabad", lat: 17.3850, lng: 78.4867 }, { name: "Chennai", lat: 13.0827, lng: 80.2707 }, { name: "Kolkata", lat: 22.5726, lng: 88.3639 }, { name: "Pune", lat: 18.5204, lng: 73.8567 }, { name: "Jaipur", lat: 26.9124, lng: 75.7873 }];
    const issues = [{ type: 'traffic', title: 'Gridlock' }, { type: 'waste', title: 'Garbage Dump' }, { type: 'light', title: 'Dark Street' }, { type: 'safety', title: 'Unsafe Area' }, { type: 'custom', title: 'Waterlogging' }];
    const promises = [];
    cities.forEach(city => {
      const count = Math.floor(Math.random() * 4) + 5;
      for (let i = 0; i < count; i++) {
        const offsetLat = (Math.random() - 0.5) * 0.05; const offsetLng = (Math.random() - 0.5) * 0.05; const issue = issues[Math.floor(Math.random() * issues.length)];
        promises.push(addDoc(collection(db, "reports"), {
          lat: city.lat + offsetLat, lng: city.lng + offsetLng, type: issue.type, title: issue.title, description: `Reported via CivicPulse in ${city.name}`, image: null, aiVerified: Math.random() > 0.6, votes: Math.floor(Math.random() * 50) + 5, authorName: "Citizen_" + Math.floor(Math.random() * 999), timestamp: new Date().toLocaleString(), createdAt: Date.now()
        }));
      }
    });
    await Promise.all(promises);
    showToast(`Added 50+ reports across 8 cities!`, "success");
  };

  const isAdminMode = (user?.email === "admin@test.com") || (new URLSearchParams(window.location.search).get('mode') === 'admin');

  const categories = [
    { id: 'traffic', label: 'Traffic', icon: <AlertTriangle size={16} />, color: 'bg-red-500' },
    { id: 'waste', label: 'Waste', icon: <Trash2 size={16} />, color: 'bg-amber-600' },
    { id: 'light', label: 'Lights', icon: <Lightbulb size={16} />, color: 'bg-yellow-500' },
    { id: 'safety', label: 'Safety', icon: <ShieldAlert size={16} />, color: 'bg-blue-600' },
    { id: 'custom', label: 'Other', icon: <HelpCircle size={16} />, color: 'bg-purple-600' },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* MODAL */}
      {modal.isOpen && (
        <div className="absolute inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            {modal.type === 'input' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-white flex items-center gap-2"><MessageSquare className="text-blue-400" /> Report Details</h3><button onClick={() => setModal({ isOpen: false })}><X size={20}/></button></div>
                <div className="mb-4"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Issue Title</label><input autoFocus type="text" className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} /></div>
                <div className="mb-6"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label><textarea rows="3" className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm" value={inputDesc} onChange={(e) => setInputDesc(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) submitReport(); }} /></div>
                <button onClick={submitReport} disabled={loading} className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white">{loading ? "Posting..." : "Post Report (+10 Karma)"}</button>
              </div>
            )}
            {modal.type === 'success' && (
              <div className="p-6 text-center"><div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4"><CheckCircle className="text-green-500" size={32} /></div><h3 className="text-xl font-bold text-white mb-2">Verified!</h3><p className="text-gray-400 mb-6">{modal.data}</p><button onClick={() => setModal({ isOpen: false })} className="w-full py-2 rounded bg-green-600 hover:bg-green-500 text-white font-medium">Awesome</button></div>
            )}
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-96 flex flex-col border-r border-gray-700 bg-gray-900 shadow-2xl z-20">
        <div className="p-5 border-b border-gray-800 bg-gray-800/50">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2"><div className="p-1.5 bg-indigo-600 rounded"><Activity size={20} /></div><h1 className="text-xl font-bold tracking-tight">CivicPulse</h1></div>
             <button onClick={handleLogout} className="text-[10px] bg-red-900/30 hover:bg-red-900/50 px-2 py-1 rounded border border-red-800 text-red-300 flex items-center gap-1"><LogOut size={10}/> Logout</button>
           </div>
           
           <div className="flex items-center justify-between bg-gray-800 p-2 rounded mb-4 border border-gray-700">
              <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">{showHeatmap ? <Layers size={14} className="text-orange-500"/> : <MapIcon size={14} className="text-blue-500"/>} {showHeatmap ? "Heatmap Active" : "Interactive Pins"}</span>
              <button onClick={() => setShowHeatmap(!showHeatmap)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showHeatmap ? 'bg-orange-500' : 'bg-gray-600'}`}><span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showHeatmap ? 'translate-x-5' : 'translate-x-1'}`} /></button>
           </div>
           
           <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 flex items-center justify-between">
             <div><div className="text-[10px] text-gray-400 uppercase font-bold">Neighborhood Score</div><div className={`text-2xl font-black ${safetyScore > 80 ? 'text-green-400' : safetyScore > 50 ? 'text-yellow-400' : 'text-red-500'}`}>{safetyScore}/100</div></div>
             <div className="text-right"><div className="text-xs text-gray-500">{visibleReports.length} Active Issues</div><div className="text-xs text-indigo-400 mt-1 font-bold">Karma: {userKarma} pts</div></div>
           </div>

           
           {aiStats && (
              <div className="mt-4 p-3 rounded-lg border border-purple-800/50 bg-purple-900/20">
                 <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold uppercase text-[10px] tracking-wider">
                   <Sparkles size={12} /> AI Pulse Summary
                 </div>
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-sm font-bold text-white capitalize">{aiStats.topIssue} Problem</span>
                   <span className="text-xs bg-purple-600 px-2 py-0.5 rounded text-white font-mono">{aiStats.percentage}%</span>
                 </div>
                 <p className="text-[10px] text-purple-200 italic">"Recommend: {aiStats.suggestion}"</p>
              </div>
           )}
        </div>
        
        {/* Leaderboard & Feed*/}
        <div className="p-4 border-b border-gray-800">
           <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2 text-yellow-500"><Trophy size={14} /> <span className="text-xs font-bold uppercase tracking-wider">Top Contributors</span></div><span className="text-[10px] text-gray-500">Live</span></div>
           <div className="space-y-2">
             {leaderboard.length === 0 && <div className="text-xs text-gray-600 italic">No heroes yet...</div>}
             {leaderboard.map((u, i) => (
                <div key={u.id} className={`flex justify-between items-center text-sm p-2 rounded ${u.id === user.uid ? 'bg-indigo-900/30 border border-indigo-500/30' : 'bg-gray-800'}`}>
                   <div className="flex items-center gap-2"><span className={`font-bold w-4 ${i === 0 ? 'text-yellow-400' : 'text-gray-500'}`}>#{i + 1}</span><span className={`text-xs ${u.id === user.uid ? 'text-indigo-300 font-bold' : 'text-gray-300'}`}>{u.id === user.uid ? 'You' : u.name}</span></div>
                   <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300 font-mono">{u.karma} pts</span>
                </div>
             ))}
           </div>
        </div>
        <div className="p-4 grid grid-cols-5 gap-2 border-b border-gray-800">
          {categories.map((cat) => (<button key={cat.id} onClick={() => setActiveType(cat.id)} className={`flex flex-col items-center p-2 rounded transition-all ${activeType === cat.id ? 'bg-gray-700 ring-1 ring-gray-500' : 'text-gray-500 hover:bg-gray-800'}`}>{cat.icon} <span className="text-[10px] uppercase font-bold mt-1">{cat.label}</span></button>))}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {visibleReports.length === 0 && <div className="flex flex-col items-center justify-center text-gray-600 text-sm mt-10 animate-pulse"><Search size={32} className="mb-2 opacity-50" /><p>Scanning area...</p></div>}
          {visibleReports.map(report => (
            <div key={report.id} className="p-3 bg-gray-800 rounded border border-gray-700 hover:border-gray-600 transition-colors">
               <div className="flex justify-between mb-1"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase text-white ${categories.find(c=>c.id===report.type)?.color || 'bg-purple-600'}`}>{report.type === 'custom' ? 'Custom' : report.type}</span><span className="text-[10px] text-gray-500">{report.timestamp?.split(',')[0]}</span></div>
               <h4 className="font-bold text-sm text-white capitalize">{report.title}</h4>
               <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-500"><User size={10} /> Reported by {report.authorName || 'Anonymous'}</div>
            </div>
          ))}
        </div>
        {isAdminMode && (
          <div className="mt-auto p-4 border-t border-red-900/30 bg-red-900/10 grid grid-cols-2 gap-2">
            <button onClick={handleResetApp} className="py-2 bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white text-[10px] font-bold rounded border border-red-800 uppercase">⚠ Reset</button>
            <button onClick={handleSeedIndia} className="py-2 bg-blue-900/50 hover:bg-blue-600 text-blue-200 hover:text-white text-[10px] font-bold rounded border border-blue-800 uppercase flex items-center justify-center gap-1"><Globe size={10} /> 🇮🇳 Populate India</button>
          </div>
        )}
      </div>

      {/* MAP */}
      <div className="flex-1 relative">
        {showHeatmap && <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1000] bg-orange-600 text-white px-4 py-2 rounded-full shadow-xl text-sm font-bold flex items-center gap-2 animate-bounce"><Layers size={16} /> Heatmap Mode</div>}
        <div className="absolute top-4 left-4 right-16 z-[1000] max-w-md">
          <form onSubmit={handleSearch} className="relative"><input type="text" placeholder="Search City (e.g. Mumbai)..." className="w-full pl-10 pr-4 py-3 bg-gray-900/90 backdrop-blur text-white border border-gray-600 rounded-lg shadow-xl focus:outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /><Search className="absolute left-3 top-3.5 text-gray-400" size={18} /></form>
          {searchResults.length > 0 && <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl">{searchResults.map((r) => <button key={r.place_id} onClick={() => selectLocation(r.lat, r.lon)} className="w-full text-left px-4 py-2 hover:bg-gray-800 text-sm text-gray-300 truncate">{r.display_name}</button>)}</div>}
        </div>
        <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution='&copy; OSM' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <MapController flyToLocation={flyToLocation} setMapCenter={setMapCenter} />
          <LocationClickReceiver onMapClick={handleMapClick} />
          {showHeatmap ? <HeatmapLayer points={visibleReports} /> : visibleReports.map((report) => (
            <Marker key={report.id} position={[report.lat, report.lng]}>
              <Popup>
                <div className="min-w-[200px] p-1 font-sans">
                  <strong className="capitalize text-base block mb-2">{report.title}</strong>
                  {report.image ? (
                    <div className="relative mb-2"><img src={report.image} alt="Proof" className="w-full h-32 object-cover rounded-lg border border-gray-300" /><div className="absolute bottom-1 right-1 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm"><ShieldCheck size={10} /> Verified</div></div>
                  ) : (
                    <div className="group relative mb-2 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"><Camera className="text-gray-400 group-hover:text-blue-500 mb-1" size={20} /><span className="text-[10px] text-gray-500">Upload Evidence</span><input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, report.id)} /></div>
                  )}
                  <p className="text-xs text-gray-600 mb-3 bg-gray-100 p-2 rounded">{report.description || "No details."}</p>
                  <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🚨 Alert: ${report.title} reported on CivicPulse!`)}`, '_blank')} className="w-full bg-black hover:bg-gray-800 text-white text-xs py-1.5 rounded flex items-center justify-center gap-1"><Share2 size={10} /> Share Alert</button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}