import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  ExternalLink,
  Loader2,
  Lock,
  Search,
  BookOpen,
} from "lucide-react";
import logoImg from "@/imports/Screenshot_2026-07-26_115124.png";

// Premium Design System Colors
const C = {
  bgDark: "#0b1528",
  cardDark: "#152238",
  borderDark: "rgba(255, 255, 255, 0.08)",
  blue: "#0070f3",
  orange: "#f5a623",
  emerald: "#10b981",
  rose: "#f43f5e",
  slateMuted: "#94a3b8",
};

export default function AdminPortal() {
  const navigate = useNavigate();

  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Applications State
  const [applications, setApplications] = useState([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // "All", "Pending", "Approved", "Declined"

  // Submissions State
  const [activeAdminTab, setActiveAdminTab] = useState("applications"); // "applications" or "submissions"
  const [submissions, setSubmissions] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState({});

  // Action status mapping (for individual row loading states)
  const [processingId, setProcessingId] = useState(null);

  // Check login session on mount
  useEffect(() => {
    const adminToken = localStorage.getItem("jobify_admin_token");
    const role = localStorage.getItem("jobify_user_role");
    if (adminToken && role === "admin") {
      setIsAdminLoggedIn(true);
      fetchApplications(adminToken);
      fetchSubmissions(adminToken);
    }
  }, []);

  // Fetch applications list
  const fetchApplications = async (token) => {
    setIsLoadingApps(true);
    try {
      const res = await fetch("http://localhost:5000/api/applications/admin/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoadingApps(false);
    }
  };

  // Fetch submissions list
  const fetchSubmissions = async (token) => {
    setIsLoadingSubmissions(true);
    try {
      const res = await fetch("http://localhost:5000/api/submissions/admin/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  // Grade student task submission
  const handleGradeSubmission = async (subId, statusVal, gradeVal) => {
    const token = localStorage.getItem("jobify_admin_token");
    if (!token) return;

    setProcessingId(subId);
    try {
      const res = await fetch(`http://localhost:5000/api/submissions/admin/${subId}/grade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: statusVal, grade: gradeVal }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchSubmissions(token);
      } else {
        alert(data.message || "Failed to grade submission.");
      }
    } catch (error) {
      console.error("Grading error:", error);
      alert("Server error occurred while grading.");
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.user.role === "admin") {
          localStorage.setItem("jobify_admin_token", data.token);
          localStorage.setItem("jobify_user_role", "admin");
          setIsAdminLoggedIn(true);
          fetchApplications(data.token);
        } else {
          setLoginError("Unauthorized. Only administrator accounts can access this panel.");
        }
      } else {
        setLoginError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Server connection error.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleAdminLogout = () => {
    localStorage.removeItem("jobify_admin_token");
    localStorage.removeItem("jobify_user_role");
    setIsAdminLoggedIn(false);
    setAdminUsername("");
    setAdminPassword("");
    navigate("/");
  };

  // Handle Accept or Decline Application
  const handleVerifyApplication = async (appId, actionName) => {
    const token = localStorage.getItem("jobify_admin_token");
    if (!token) return;

    setProcessingId(appId);
    try {
      const res = await fetch(`http://localhost:5000/api/applications/admin/${appId}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: actionName }),
      });
      const data = await res.json();

      if (data.success) {
        alert(data.message);
        // Refresh list
        fetchApplications(token);
      } else {
        alert(data.message || "Failed to process application.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Server error occurred while verifying.");
    } finally {
      setProcessingId(null);
    }
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.paymentRef && app.paymentRef.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.utr && app.utr.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "All" ? true : app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const studentName = sub.studentId?.name || "";
    const studentUsername = sub.studentId?.username || "";
    const studentCollege = sub.studentId?.college || "";
    
    const matchesSearch =
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studentUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studentCollege.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" ? true : sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === "Pending").length;
  const approvedCount = applications.filter((a) => a.status === "Approved").length;
  const declinedCount = applications.filter((a) => a.status === "Declined").length;

  // ─── LOGIN SCREEN ───
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4" style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        
        <div className="max-w-md w-full relative z-10 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <Link to="/">
              <img src={logoImg} alt="Jobify Admin" className="h-16 w-auto object-contain mb-4" />
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 font-extrabold text-[10px] uppercase tracking-wider">
              <Shield size={12} /> Administrator Portal
            </div>
            <h2 className="text-xl font-extrabold text-white mt-3" style={{ fontFamily: "Outfit, sans-serif" }}>
              Secure Admin Login
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Verify registrations, confirm payment references, approve users, and trigger automatic onboarding offer letters.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl border text-xs text-rose-300 flex items-center gap-2" style={{ background: "rgba(244, 63, 94, 0.15)", borderColor: "rgba(244, 63, 94, 0.3)" }}>
              <Shield size={15} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Admin Username</label>
              <input
                type="text"
                placeholder="Enter 'admin'"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
                className="px-4 py-3 rounded-xl border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:border-blue-500 transition bg-white/5"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
              <input
                type="password"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                className="px-4 py-3 rounded-xl border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:border-blue-500 transition bg-white/5"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="mt-2 w-full py-3.5 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <Lock size={14} /> Enter Admin Panel
                </>
              )}
            </button>
          </form>

          <div className="border-t border-white/5 pt-4 text-center">
            <Link to="/" className="text-xs font-semibold text-blue-400 hover:underline">
              ← Back to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── ADMIN DASHBOARD MAIN VIEW ───
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col" style={{ fontFamily: "Inter, sans-serif" }}>
      
      {/* Navbar */}
      <header className="h-20 border-b border-white/10 px-6 sm:px-12 flex items-center justify-between bg-slate-900/40 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link to="/">
            <img src={logoImg} alt="Jobify" className="h-12 w-auto object-contain" />
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 font-extrabold text-[10px] uppercase tracking-wider">
            <Shield size={12} /> Admin Dashboard
          </div>
        </div>

        <button
          onClick={handleAdminLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all"
        >
          <LogOut size={14} /> Logout Admin
        </button>
      </header>

      <main className="flex-1 p-6 sm:p-12 max-w-7xl mx-auto w-full flex flex-col gap-8">
        
        {/* Dashboard Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
            Internship Registration Verification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manual transaction checking for new registrations. Approving creates LMS profiles and dispatches PDF Offer Letters automatically.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Applications", value: totalCount, icon: Users, color: C.blue },
            { label: "Pending Check", value: pendingCount, icon: Clock, color: C.orange },
            { label: "Approved Interns", value: approvedCount, icon: CheckCircle, color: C.emerald },
            { label: "Declined Applications", value: declinedCount, icon: XCircle, color: C.rose },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-slate-900 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{stat.label}</span>
                  <span className="text-2xl font-black text-white mt-1 block" style={{ fontFamily: "Outfit, sans-serif" }}>{stat.value}</span>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15`, color: stat.color }}>
                  <Icon size={20} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-4 border-b border-white/10 pb-2">
          <button
            onClick={() => {
              setActiveAdminTab("applications");
              setStatusFilter("All");
              setSearchQuery("");
            }}
            className={`text-sm font-bold pb-2 transition-all border-b-2 ${
              activeAdminTab === "applications"
                ? "text-blue-500 border-blue-500"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Incoming Registrations ({pendingCount} Pending)
          </button>
          <button
            onClick={() => {
              setActiveAdminTab("submissions");
              setStatusFilter("All");
              setSearchQuery("");
              const token = localStorage.getItem("jobify_admin_token");
              if (token) fetchSubmissions(token);
            }}
            className={`text-sm font-bold pb-2 transition-all border-b-2 ${
              activeAdminTab === "submissions"
                ? "text-blue-500 border-blue-500"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Weekly Task Submissions ({submissions.filter(s => s.status === "Pending Review").length} Pending)
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Status Tabs */}
          <div className="flex gap-1.5 p-1 bg-slate-950 rounded-xl border border-white/5 w-full md:w-auto">
            {activeAdminTab === "applications"
              ? ["All", "Pending", "Approved", "Declined"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      statusFilter === filter ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))
              : ["All", "Pending Review", "Approved", "Rejected"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      statusFilter === filter ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 text-slate-500" size={15} />
            <input
              type="text"
              placeholder={activeAdminTab === "applications" ? "Search by student, college..." : "Search by student name, user..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/5 bg-slate-950 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        {activeAdminTab === "submissions" ? (
          /* Weekly Task Submissions Table */
          <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            {isLoadingSubmissions ? (
              <div className="p-16 flex flex-col items-center justify-center gap-3">
                <Loader2 size={32} className="text-blue-500 animate-spin" />
                <span className="text-xs text-slate-400">Loading student task submissions...</span>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="p-16 text-center text-xs text-slate-500">
                No task submissions found matching your criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase font-extrabold tracking-wider text-slate-400 bg-slate-900/60">
                      <th className="p-5">Student Info</th>
                      <th className="p-5">Track / Domain</th>
                      <th className="p-5">Week</th>
                      <th className="p-5">Task Links</th>
                      <th className="p-5">Status</th>
                      <th className="p-5">Grade</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub._id} className="hover:bg-white/[0.01] transition-all">
                        {/* Student Info */}
                        <td className="p-5">
                          <div className="font-extrabold text-white">{sub.studentId?.name || "Deleted Student"}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Username: {sub.studentId?.username || "N/A"}</div>
                          {sub.studentId?.college && <div className="text-[10px] text-slate-500 mt-0.5">🎓 {sub.studentId.college}</div>}
                        </td>

                        {/* Track / Domain */}
                        <td className="p-5">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-bold text-[10px] tracking-wide uppercase border border-blue-500/10 block w-fit truncate max-w-[200px]">
                            {sub.studentId?.domain || "Web Development"}
                          </span>
                        </td>

                        {/* Week */}
                        <td className="p-5 text-slate-300 font-semibold">
                          Week {sub.week}
                        </td>

                        {/* Task Links */}
                        <td className="p-5">
                          <div className="flex flex-col gap-1.5">
                            <a
                              href={sub.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline text-[11px] flex items-center gap-1 w-fit"
                            >
                              GitHub Repo <ExternalLink size={10} />
                            </a>
                            <a
                              href={sub.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline text-[11px] flex items-center gap-1 w-fit"
                            >
                              LinkedIn Post <ExternalLink size={10} />
                            </a>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-5">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                              sub.status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : sub.status === "Rejected"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>

                        {/* Grade */}
                        <td className="p-5">
                          <span className="font-mono font-extrabold text-sm text-white bg-white/5 px-2.5 py-1 rounded border border-white/5">
                            {sub.grade}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-5 text-right">
                          {sub.status === "Pending Review" ? (
                            <div className="flex gap-2 justify-end items-center">
                              <select
                                value={selectedGrades[sub._id] || "A+"}
                                onChange={(e) => setSelectedGrades({ ...selectedGrades, [sub._id]: e.target.value })}
                                className="bg-slate-800 border border-white/10 rounded-lg text-[11px] px-2 py-1 text-white outline-none focus:border-blue-500"
                              >
                                {["A+", "A", "B+", "B", "C", "Pass"].map(g => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                              <button
                                disabled={processingId === sub._id}
                                onClick={() => handleGradeSubmission(sub._id, "Approved", selectedGrades[sub._id] || "A+")}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all duration-150 flex items-center gap-1 disabled:opacity-50"
                                style={{ fontFamily: "Outfit, sans-serif" }}
                              >
                                Approve
                              </button>
                              <button
                                disabled={processingId === sub._id}
                                onClick={() => handleGradeSubmission(sub._id, "Rejected", "F")}
                                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition-all duration-150 disabled:opacity-50"
                                style={{ fontFamily: "Outfit, sans-serif" }}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Applications List Table */
          <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            {isLoadingApps ? (
              <div className="p-16 flex flex-col items-center justify-center gap-3">
                <Loader2 size={32} className="text-blue-500 animate-spin" />
                <span className="text-xs text-slate-400">Loading incoming registration applications...</span>
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="p-16 text-center text-xs text-slate-500">
                No applications found matching your criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase font-extrabold tracking-wider text-slate-400 bg-slate-900/60">
                      <th className="p-5">Student Info</th>
                      <th className="p-5">College / Institution</th>
                      <th className="p-5">Track Details</th>
                      <th className="p-5">Payment Reference</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {filteredApps.map((app) => (
                      <tr key={app._id} className="hover:bg-white/[0.01] transition-all">
                        {/* Student Info */}
                        <td className="p-5">
                          <div className="font-extrabold text-white">{app.name}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{app.email}</div>
                          {app.phone && <div className="text-[10px] text-slate-400 mt-0.5">📞 {app.phone}</div>}
                          {app.qualification && <div className="text-[10px] text-slate-500 mt-0.5">🎓 {app.qualification}</div>}
                        </td>

                        {/* College */}
                        <td className="p-5 text-slate-300 font-medium">
                          {app.college}
                        </td>

                        {/* Track Details */}
                        <td className="p-5">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-bold text-[10px] tracking-wide uppercase border border-blue-500/10 block w-fit truncate max-w-[200px]" title={app.domain}>
                            {app.domain}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1.5 font-semibold">Duration: 6 Weeks</div>
                        </td>

                        {/* Payment Ref */}
                        <td className="p-5 text-[11px] text-slate-300">
                          <div className="font-mono text-xs text-white">UTR: {app.utr || "N/A"}</div>
                          {app.accountHolder && <div className="text-[10px] text-slate-400 mt-1">Holder: {app.accountHolder}</div>}
                          {app.paymentScreenshot ? (
                            <a
                              href={app.paymentScreenshot}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 underline hover:text-blue-300 text-[10px] mt-1.5 flex items-center gap-1 w-fit"
                            >
                              View Receipt <ExternalLink size={10} />
                            </a>
                          ) : null}
                        </td>

                        {/* Status */}
                        <td className="p-5">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                              app.status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : app.status === "Declined"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-5 text-right">
                          {app.status === "Pending" ? (
                            <div className="flex gap-2 justify-end">
                              <button
                                disabled={processingId === app._id}
                                onClick={() => handleVerifyApplication(app._id, "accept")}
                                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all duration-150 flex items-center gap-1 disabled:opacity-50"
                                style={{ fontFamily: "Outfit, sans-serif" }}
                              >
                                {processingId === app._id ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  "Approve"
                                )}
                              </button>
                              <button
                                disabled={processingId === app._id}
                                onClick={() => handleVerifyApplication(app._id, "decline")}
                                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition-all duration-150 disabled:opacity-50"
                                style={{ fontFamily: "Outfit, sans-serif" }}
                              >
                                Decline
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
