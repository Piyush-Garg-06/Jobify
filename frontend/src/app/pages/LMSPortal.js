import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  BookOpen, Award, Upload, Clock, CheckCircle, ArrowRight,
  LogOut, User, ShieldAlert, FileText, X, ExternalLink, Download,
  Lock, Check, Loader2, Sparkles, FolderUp, RefreshCw, Menu
} from "lucide-react";
import confetti from "canvas-confetti";
import logoImg from "@/imports/Screenshot_2026-07-26_115124.png";

// Design Palette
const C = {
  navy: "#0A2540",
  navyDark: "#061828",
  blue: "#0070F3",
  blueDark: "#0058c2",
  blueLight: "#e8f0fe",
  orange: "#FF9900",
  orangeLight: "#fff4e5",
  gold: "#FFB800",
  goldLight: "#fff8e6",
  surface: "#f8fafc",
  white: "#ffffff",
  border: "rgba(10,37,64,0.08)",
  borderDark: "rgba(10,37,64,0.15)",
  muted: "#64748b",
};

const G = {
  blue: "linear-gradient(135deg, #3d9aff 0%, #0070F3 45%, #0058c2 100%)",
  orange: "linear-gradient(135deg, #ffd166 0%, #FFB800 30%, #FF9900 65%, #e07000 100%)",
  navy: "linear-gradient(135deg, #1a3a5c 0%, #0A2540 55%, #061828 100%)",
  heroLight: "linear-gradient(160deg, #f0f6ff 0%, #e8f0fe 50%, #f5f7fa 100%)",
  banner: "linear-gradient(135deg, #0A2540 0%, #0058c2 100%)",
};

// Course curriculum data based on domain
const CURRICULA = {
  "Web Development": {
    tasks: [
      { week: 1, title: "HTML & CSS Landing Page", desc: "Build a fully responsive and clean product landing page using semantic HTML and custom CSS. Integrate typography, layouts, and forms.", materials: ["HTML5 Semantic Guide.pdf", "CSS Flexbox & Grid.pdf"] },
      { week: 2, title: "JavaScript Dynamic Web App", desc: "Create a modern dynamic web application (e.g., a budgeting tool or dashboard) that manipulates the DOM, handles events, and stores state in LocalStorage.", materials: ["Eloquent JavaScript.pdf", "DOM Manipulation Tricks.pdf"] },
      { week: 3, title: "React Component Library", desc: "Build a reusable UI library in React. Use props, state, hooks (useState, useEffect), and custom styling systems to design components.", materials: ["React Hooks Guide.pdf", "Component Thinking in React.pdf"] },
      { week: 4, title: "Express REST API Backend", desc: "Set up a Node.js & Express server. Expose CRUD REST API endpoints for user authentication and resource management with input validation.", materials: ["Node & Express Basics.pdf", "REST API Best Practices.pdf"] },
      { week: 5, title: "Database Integration (MongoDB/SQL)", desc: "Connect your backend server to a database. Implement schema models, relationships, and queries to persist student profile tasks securely.", materials: ["MongoDB Crash Course.pdf", "SQL vs NoSQL Handbook.pdf"] },
      { week: 6, title: "Full-Stack Deployment & Hosting", desc: "Integrate your React frontend with the Express backend. Deploy the frontend to Vercel/Netlify, backend to Render/Fly.io, and verify live URLs.", materials: ["Fullstack Deployment Checklist.pdf"] },
      { week: 7, title: "Performance Optimization & Testing", desc: "Implement API caching, compress frontend assets, and write unit/integration tests for your authentication and submission routes.", materials: ["Testing React & Node Apps.pdf"] },
      { week: 8, title: "Final Capstone Project Showcase", desc: "Deliver a production-ready application solving a real-world problem. Incorporate user reviews, file uploads, and dashboard widgets.", materials: ["Capstone Presentation Guidelines.pdf"] }
    ]
  },
  "Python": {
    tasks: [
      { week: 1, title: "Python Core Foundations", desc: "Solve challenges covering collections, lists, dictionary operations, functions, control loops, and basic file operations in Python.", materials: ["Python Basics Guide.pdf", "Pythonic Code Handbook.pdf"] },
      { week: 2, title: "Object-Oriented Programming (OOP)", desc: "Build a terminal-based program using classes, inheritance, polymorphism, and encapsulation. Write clean Python classes.", materials: ["Python OOP Concepts.pdf"] },
      { week: 3, title: "Data Scraping & APIs", desc: "Write scripts using Requests and BeautifulSoup/Scrapy to scrape data from websites and consume third-party API endpoints.", materials: ["Web Scraping with Python.pdf"] },
      { week: 4, title: "Data Analysis with Pandas", desc: "Load real-world CSV/Excel datasets. Clean missing entries and perform exploratory data analysis using Pandas and NumPy.", materials: ["Pandas Data Analysis Handbook.pdf"] },
      { week: 5, title: "Data Visualization & Dashboards", desc: "Generate meaningful plots and charts using Matplotlib and Seaborn. Set up a simple dashboard app using Streamlit.", materials: ["Python Data Visualization.pdf"] },
      { week: 6, title: "Database Operations & ORM", desc: "Connect Python scripts to SQLite or MySQL databases. Build query scripts or map schemas using SQLAlchemy ORM.", materials: ["SQLAlchemy Guide.pdf"] },
      { week: 7, title: "Introduction to Flask/Django", desc: "Build a lightweight web server or backend API endpoint using the Flask/Django framework.", materials: ["Flask Web Development.pdf"] },
      { week: 8, title: "Automated Scripts & Scripting Project", desc: "Create a final automation tool that runs scheduled cron tasks, processes files, and sends email summaries.", materials: ["Automation with Python.pdf"] }
    ]
  },
  "AI / ML": {
    tasks: [
      { week: 1, title: "Linear Algebra & Probability Review", desc: "Implement foundational mathematical concepts in NumPy: matrix math, derivatives, and statistical distributions.", materials: ["Math for Machine Learning.pdf"] },
      { week: 2, title: "Supervised Learning Models", desc: "Build and train Linear Regression and Logistic Regression models from scratch using NumPy and verify results using Scikit-Learn.", materials: ["Supervised Learning Basics.pdf"] },
      { week: 3, title: "Classification & Tree Models", desc: "Implement Decision Trees, Random Forests, and Support Vector Machines. Clean datasets and handle categorical variables.", materials: ["Classification Algorithms.pdf"] },
      { week: 4, title: "Unsupervised Clustering", desc: "Build K-Means clustering and PCA dimensionality reduction algorithms to segment custom dataset categories.", materials: ["Unsupervised Learning Guide.pdf"] },
      { week: 5, title: "Deep Learning Foundations (MLP)", desc: "Build a Multi-Layer Perceptron (neural network) using raw Python/NumPy, implementing forward and backward propagation.", materials: ["Neural Networks Explained.pdf"] },
      { week: 6, title: "PyTorch & Computer Vision", desc: "Build a Convolutional Neural Network (CNN) in PyTorch to classify handwritten digits (MNIST) or object images (CIFAR-10).", materials: ["PyTorch Essentials.pdf"] },
      { week: 7, title: "NLP & Sequence Modeling", desc: "Implement text tokenization, TF-IDF representations, and design a recurrent model (LSTM/GRU) or use Transformers for sentiment analysis.", materials: ["Natural Language Processing.pdf"] },
      { week: 8, title: "Model Deployment & ML APIs", desc: "Export your trained PyTorch/Scikit-Learn model and wrap it in a FastAPI endpoint. Deploy the API to a server.", materials: ["Deploying ML Models.pdf"] }
    ]
  },
  "C++": {
    tasks: [
      { week: 1, title: "C++ Core Foundations", desc: "Basic input/output, standard variables, conditional branches, loops, and custom logic control flows in C++.", materials: ["CPP Core Syntax Guide.pdf"] },
      { week: 2, title: "Functions, Pointers & References", desc: "Understand pass-by-value, pass-by-reference, dynamic memory allocation, and pointer arithmetic in C++.", materials: ["CPP Pointers & References.pdf"] },
      { week: 3, title: "Object-Oriented Programming (OOP)", desc: "Build programs using C++ classes, inheritance, polymorphism, encapsulation, virtual functions, and abstract classes.", materials: ["CPP OOP Handbook.pdf"] },
      { week: 4, title: "File Operations & IO Streams", desc: "Read and write data dynamically using ifstream, ofstream, and fstream libraries. Parse formatted data reports.", materials: ["CPP File Handling Guide.pdf"] },
      { week: 5, title: "Memory Management & Smart Pointers", desc: "Implement custom constructors/destructors. Avoid memory leaks using unique_ptr, shared_ptr, and weak_ptr.", materials: ["CPP Smart Pointers Manual.pdf"] },
      { week: 6, title: "Standard Template Library (STL)", desc: "Leverage standard containers like vector, list, map, set, and standard sorting/searching algorithms.", materials: ["CPP STL Cheatsheet.pdf"] },
      { week: 7, title: "Exception Handling & Debugging", desc: "Handle runtime execution errors using try-catch blocks and debug using GDB or custom logging tools.", materials: ["CPP Debugging Guide.pdf"] },
      { week: 8, title: "Final Capstone CLI System Project", desc: "Deliver a clean C++ command-line application (e.g. Bank Account or Library Management System) using OOP principles.", materials: ["CPP Capstone Guidelines.pdf"] }
    ]
  },
  "Java": {
    tasks: [
      { week: 1, title: "Java Foundations & Core Syntax", desc: "Explore variables, primitive data types, branching conditions, loops, and simple console applications in Java.", materials: ["Java Basics Syntax Guide.pdf"] },
      { week: 2, title: "Object-Oriented Java Programming", desc: "Master classes, inheritance, abstract classes, interfaces, method overloading/overriding, and packages in Java.", materials: ["Java OOP Principles.pdf"] },
      { week: 3, title: "Java Collections Framework", desc: "Organize data arrays using standard lists (ArrayList), sets (HashSet), and key-value maps (HashMap).", materials: ["Java Collections Manual.pdf"] },
      { week: 4, title: "Exception Handling & Multithreading", desc: "Handle runtime faults using try-catch-finally. Write multi-threaded scripts using Runnable and Thread.", materials: ["Java Exceptions & Threads.pdf"] },
      { week: 5, title: "File I/O & JDBC Database Connection", desc: "Read/write files and connect your Java application to databases using standard JDBC drivers.", materials: ["Java Database Connectivity.pdf"] },
      { week: 6, title: "Spring Boot Web Framework Basics", desc: "Build a simple REST API backend using Spring Boot controllers, routing annotations, and JSON responses.", materials: ["Spring Boot Essentials.pdf"] },
      { week: 7, title: "Unit Testing & Framework Tools", desc: "Write robust tests using JUnit and Mockito to assert the behavior of controllers and service classes.", materials: ["Java Unit Testing.pdf"] },
      { week: 8, title: "Capstone JavaFX / Web API Project", desc: "Design and implement a complete Java application showcase with standard database state persistence.", materials: ["Java Capstone Project Guidelines.pdf"] }
    ]
  },
  "DSA": {
    tasks: [
      { week: 1, title: "Time Complexity & Array Operations", desc: "Compute Big-O bounds. Implement array traversals, prefix sums, two-pointer techniques, and binary search.", materials: ["Time Complexity Handbook.pdf", "Array Problems.pdf"] },
      { week: 2, title: "Recursion & Backtracking", desc: "Master recursive functions, call stacks, and backtrack puzzles like N-Queens or subset generation.", materials: ["Recursion & Backtracking Guide.pdf"] },
      { week: 3, title: "Linked Lists, Stacks & Queues", desc: "Build singly/doubly linked lists. Implement stack/queue data structures and solve parentheses/sliding window problems.", materials: ["Linear Data Structures.pdf"] },
      { week: 4, title: "Hashing & Tree Algorithms", desc: "Utilize hash tables. Build and traverse binary trees, BSTs, and solve lowest common ancestor problems.", materials: ["Hashing & Binary Trees.pdf"] },
      { week: 5, title: "Graph Representations & Traversals", desc: "Represent graphs using adjacency lists. Implement Depth First Search (DFS) and Breadth First Search (BFS).", materials: ["Graph Algorithms Guide.pdf"] },
      { week: 6, title: "Sorting & Searching Optimizations", desc: "Compare Merge Sort, Quick Sort, and Heap Sort. Solve interval problems and selection challenges.", materials: ["Sorting & Searching.pdf"] },
      { week: 7, title: "Dynamic Programming Foundations", desc: "Understand memoization vs tabulation. Solve classic DP problems (Fibonacci, Knapsack, Longest Common Subsequence).", materials: ["Dynamic Programming Basics.pdf"] },
      { week: 8, title: "Final Advanced Problem Solver Portfolio", desc: "Solve a selected set of top interview coding problems and document your optimized solutions on GitHub.", materials: ["DSA Portfolio Showcase.pdf"] }
    ]
  }
};

export default function LMSPortal() {
  const navigate = useNavigate();
  // Sidebar State for Mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Student Settings (Loaded dynamically from DB profile)
  const [studentName, setStudentName] = useState("Test User");
  const [studentCollege, setStudentCollege] = useState("XYZ Institute of Technology");
  const [domain, setDomain] = useState("Web Development");
  const [duration, setDuration] = useState("45 Days"); // "1 Month", "45 Days", "2 Months"
  const [userJoinedDate, setUserJoinedDate] = useState("");

  // Navigation tabs inside LMS
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dynamic Weekly Task States
  const [submissions, setSubmissions] = useState({});

  // UI state for active selected week tab
  const [selectedWeekTab, setSelectedWeekTab] = useState(1);

  // Submit inputs per week (Mandatory GitHub and LinkedIn URL tracking)
  const [submitRepo, setSubmitRepo] = useState("");
  const [submitLinkedin, setSubmitLinkedin] = useState("");

  // Certificate State (Generated from DB)
  const [showCert, setShowCert] = useState(false);
  const [certDetails, setCertDetails] = useState(null);

  // Determine number of weeks based on duration
  const getWeeksCount = () => {
    if (duration === "1 Month") return 4;
    if (duration === "45 Days") return 6;
    return 8; // 2 Months
  };

  const getWeekUnlockTimeDetails = (weekNum) => {
    if (weekNum === 1) return { isTimeUnlocked: true, daysRemaining: 0, unlockDate: null };
    if (!userJoinedDate) return { isTimeUnlocked: true, daysRemaining: 0, unlockDate: null };

    const joined = new Date(userJoinedDate);
    const requiredDays = (weekNum - 1) * 7;
    
    // Target unlock date
    const unlockDate = new Date(joined.getTime());
    unlockDate.setDate(joined.getDate() + requiredDays);

    const now = new Date();
    const diffTime = unlockDate - now;
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isTimeUnlocked = diffTime <= 0;

    return {
      isTimeUnlocked,
      daysRemaining: Math.max(0, daysRemaining),
      unlockDate
    };
  };

  const isWeekUnlocked = (weekNum) => {
    if (weekNum === 1) return true;
    
    // Check if the previous week was approved
    const isPrevApproved = submissions[weekNum - 1] && submissions[weekNum - 1].status === "Approved";
    if (!isPrevApproved) return false;

    // Check if the time gate has passed
    const { isTimeUnlocked } = getWeekUnlockTimeDetails(weekNum);
    return isTimeUnlocked;
  };

  const getWeekStatus = (weekNum) => {
    if (submissions[weekNum] && submissions[weekNum].status !== "Pending Submission") {
      return submissions[weekNum].status;
    }
    if (!isWeekUnlocked(weekNum)) {
      return "Locked";
    }
    return submissions[weekNum]?.status || "Pending Submission";
  };

  const fetchProfileAndSubmissions = async () => {
    const token = localStorage.getItem("jobify_token");
    if (!token) return;

    try {
      // 1. Fetch Profile
      const profileRes = await fetch("https://jobify-eta-one.vercel.app/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const profileData = await profileRes.json();
      let currentDuration = duration;
      if (profileData.success) {
        setStudentName(profileData.user.name);
        setDomain(profileData.user.domain);
        setDuration(profileData.user.duration);
        setStudentCollege(profileData.user.college);
        setUserJoinedDate(profileData.user.createdAt);
        currentDuration = profileData.user.duration;
      }

      // 2. Fetch Submissions
      const subRes = await fetch("https://jobify-eta-one.vercel.app/api/submissions", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const subData = await subRes.json();
      if (subData.success) {
        const subMap = {};
        // Initialize all weeks
        const maxW = currentDuration === "1 Month" ? 4 : currentDuration === "45 Days" ? 6 : 8;
        for (let w = 1; w <= maxW; w++) {
          subMap[w] = { status: "Pending Submission", repoUrl: "", linkedinUrl: "" };
        }
        // Populate actual submissions
        subData.submissions.forEach(sub => {
          subMap[sub.week] = {
            status: sub.status,
            repoUrl: sub.repoUrl,
            linkedinUrl: sub.linkedinUrl,
            grade: sub.grade
          };
        });
        setSubmissions(subMap);

        // Auto-select the active unlocked week
        let unlocked = 1;
        for (let w = 1; w <= maxW; w++) {
          if (subMap[w] && subMap[w].status === "Approved") {
            unlocked = w + 1;
          } else {
            break;
          }
        }
        setSelectedWeekTab(Math.min(unlocked, maxW));
      }
    } catch (err) {
      console.error("Error fetching data from API:", err);
    }
  };

  // Auto-login if session exists
  useEffect(() => {
    const session = localStorage.getItem("jobify_session");
    if (session === "logged_in") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfileAndSubmissions();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const res = await fetch("https://jobify-eta-one.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("jobify_token", data.token);
        localStorage.setItem("jobify_session", "logged_in");

        setStudentName(data.user.name);
        setDomain(data.user.domain);
        setDuration(data.user.duration);
        setStudentCollege(data.user.college);
        setUserJoinedDate(data.user.createdAt);
        setIsLoggedIn(true);
      } else {
        setLoginError(data.message || "Invalid username or password.");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Could not connect to the backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("jobify_session");
    localStorage.removeItem("jobify_token");
    setUsername("");
    setPassword("");
    setLoginError("");
    navigate("/");
  };

  const handleProjectSubmit = async (weekNum) => {
    if (!submitRepo.trim()) {
      alert("GitHub Repository URL is mandatory. Please upload your task to GitHub and enter the URL.");
      return;
    }
    if (!submitLinkedin.trim()) {
      alert("LinkedIn Post URL is mandatory. Please post about your project, tag Jobify, and paste the URL.");
      return;
    }

    const token = localStorage.getItem("jobify_token");
    try {
      const res = await fetch("https://jobify-eta-one.vercel.app/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          week: weekNum,
          repoUrl: submitRepo.trim(),
          linkedinUrl: submitLinkedin.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitRepo("");
        setSubmitLinkedin("");
        alert(`Week ${weekNum} project submitted successfully for review!`);
        fetchProfileAndSubmissions();
      } else {
        alert(data.message || "Failed to submit assignment.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend server.");
    }
  };

  const handleResetSubmission = async (weekNum) => {
    const token = localStorage.getItem("jobify_token");
    try {
      const res = await fetch("https://jobify-eta-one.vercel.app/api/submissions/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ week: weekNum })
      });
      const data = await res.json();
      if (data.success) {
        fetchProfileAndSubmissions();
      } else {
        alert(data.message || "Failed to reset submission.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend server.");
    }
  };

  const triggerCertificateGen = async () => {
    const token = localStorage.getItem("jobify_token");
    try {
      const res = await fetch("https://jobify-eta-one.vercel.app/api/certificates/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setCertDetails(data.certificate);
        setShowCert(true);

        const durationConf = 3 * 1000;
        const end = Date.now() + durationConf;
        (function frame() {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      } else {
        alert(data.message || "Failed to generate certificate.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend server.");
    }
  };

  const curriculum = CURRICULA[domain] || CURRICULA["Web Development"];
  const maxWeeks = getWeeksCount();
  const visibleTasks = curriculum.tasks.slice(0, maxWeeks);

  const isEligibleForCert = () => {
    for (let w = 1; w <= maxWeeks; w++) {
      if (!submissions[w] || submissions[w].status !== "Approved") {
        return false;
      }
    }
    return true;
  };

  const getApprovedTasksCount = () => {
    let approvedCount = 0;
    for (let w = 1; w <= maxWeeks; w++) {
      if (submissions[w] && submissions[w].status === "Approved") {
        approvedCount++;
      }
    }
    return approvedCount;
  };

  const getProgressPercentage = () => {
    const approvedCount = getApprovedTasksCount();
    return Math.round((approvedCount / maxWeeks) * 100);
  };

  // ─── LOGIN VIEW ───
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center relative px-4 py-12" style={{ background: G.heroLight, overflow: "hidden" }}>
        {/* Decorative Grid and Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: C.blue }} />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: C.orange }} />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,#000 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="w-full max-w-md relative z-10 flex flex-col gap-6">
          {/* Logo container */}
          <div className="flex justify-center">
            <div className="bg-white px-5 py-2.5 rounded-2xl shadow-md border border-slate-100 flex items-center justify-center">
              <img src={logoImg} alt="Jobify" className="h-16 sm:h-20 w-auto object-contain" />
            </div>
          </div>

          {/* Elevated Light Login Card */}
          <div className="p-8 rounded-3xl border shadow-xl bg-white" style={{ borderColor: C.border }}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>LMS Student Portal</h2>
              <p className="text-sm mt-1.5" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>
                Login to access your weekly projects & certificates.
              </p>
            </div>

            {loginError && (
              <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-xl border text-sm text-red-700 bg-red-50" style={{ borderColor: "rgba(239, 68, 68, 0.2)" }}>
                <ShieldAlert size={16} className="shrink-0" />
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: C.navy, opacity: 0.8 }}>Username / Login ID</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="px-4 py-3 rounded-xl border text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  style={{ background: C.white, borderColor: C.borderDark }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: C.navy, opacity: 0.8 }}>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="px-4 py-3 rounded-xl border text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  style={{ background: C.white, borderColor: C.borderDark }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 rounded-xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2"
                style={{ background: G.orange, color: C.navy, fontFamily: "Outfit, sans-serif" }}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Login <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>

          <div className="text-center mt-2">
            <Link to="/" className="text-xs font-semibold hover:underline" style={{ color: C.blue, fontFamily: "Inter, sans-serif" }}>
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD VIEW (LOGGED IN) ───
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-700" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── SIDEBAR (PREMIUM LIGHT THEME WITH LOGO ON WHITE BACKGROUND) ─── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Brand Logo Header — Large, clear and naturally integrated on the white sidebar */}
        <div className="px-4 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <Link to="/" className="flex items-center w-full justify-center">
            <img src={logoImg} alt="Jobify" className="h-16 w-auto max-w-full object-contain" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 md:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-5 border-b border-slate-100/80 bg-slate-50/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ background: G.blue }}>
            {studentName ? studentName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "US"}
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{studentName}</h4>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Student Intern</span>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="p-4 flex-1 flex flex-col gap-1 text-sm font-semibold overflow-y-auto">
          {[
            { id: "dashboard", label: "Overview Dashboard", icon: Clock },
            { id: "tasks", label: "Weekly Tasks & Upload", icon: Upload },
            { id: "materials", label: "Study Materials", icon: BookOpen },
            { id: "cert", label: "Get Certificate", icon: Award }
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left ${active ? "text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                style={active ? { background: G.blue, boxShadow: "0 4px 12px rgba(0,112,243,0.15)" } : {}}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.id === "cert" && isEligibleForCert() && (
                  <Sparkles size={13} className="text-yellow-500 ml-auto animate-bounce" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Logout - Anchored at the bottom-left of the viewport */}
        <div className="p-4 border-t border-slate-100 bg-white mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs border border-slate-200 hover:border-red-400 hover:text-red-500 transition text-slate-500 w-full"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            <LogOut size={13} /> Log Out
          </button>
        </div>
      </aside>

      {/* ─── MOBILE TOP BAR (SHOWN ONLY ON MOBILE SCREEN) ─── */}
      <header className="h-16 px-4 bg-white border-b border-slate-200 flex md:hidden items-center justify-between sticky top-0 z-30 shrink-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-slate-600 hover:text-slate-900"
          aria-label="Open Sidebar"
        >
          <Menu size={24} />
        </button>

        <Link to="/" className="flex items-center h-10">
          <img src={logoImg} alt="Jobify" className="h-10 w-auto object-contain" />
        </Link>

        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0" style={{ background: G.blue }}>
          {studentName ? studentName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "US"}
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-black text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>
              {activeTab === "dashboard" && "Overview Dashboard"}
              {activeTab === "tasks" && "Weekly Tasks & Submissions"}
              {activeTab === "materials" && "Study Guides & PDFs"}
              {activeTab === "cert" && "Internship Certificate"}
            </h2>
          </div>

          {/* Read-Only Program Info Badges */}
          <div className="flex items-center gap-4">
            {/* Track Info Badge */}
            <div className="hidden lg:flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Track:</span>
              <span className="font-extrabold text-blue-700">{domain}</span>
            </div>

            {/* Duration Info Badge */}
            <div className="hidden lg:flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-full px-3 py-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Duration:</span>
              <span className="font-extrabold text-amber-700">{duration === "1 Month" ? "1 Month (4 Weeks)" : duration === "45 Days" ? "45 Days (6 Weeks)" : "2 Months (8 Weeks)"}</span>
            </div>

            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-500">
              <User size={15} />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 w-full flex-1 flex flex-col gap-6">

          {/* Mobile responsive read-only program info badges */}
          <div className="lg:hidden flex flex-col sm:flex-row gap-2.5 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-[9px] uppercase font-bold text-slate-400">Internship Domain</span>
              <div className="font-extrabold text-slate-800 text-sm">{domain}</div>
            </div>
            <div className="flex-grow border-t sm:border-t-0 sm:border-l border-slate-100 my-1 sm:my-0 sm:mx-2" />
            <div className="flex-grow flex-1 flex flex-col gap-0.5">
              <span className="text-[9px] uppercase font-bold text-slate-400">Duration Track</span>
              <div className="font-extrabold text-slate-800 text-sm">
                {duration === "1 Month" ? "1 Month (4 Weeks)" : duration === "45 Days" ? "45 Days (6 Weeks)" : "2 Months (8 Weeks)"}
              </div>
            </div>
          </div>

          {/* ────────────────── 1. DASHBOARD OVERVIEW TAB ────────────────── */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-6">

              {/* Premium Welcome Banner Card */}
              <div className="rounded-3xl p-8 border text-white relative overflow-hidden shadow-lg" style={{ background: G.banner, borderColor: C.navyLight }}>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-2xl pointer-events-none" style={{ background: C.blue }} />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: C.orange }} />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: "Outfit, sans-serif" }}>
                      Welcome back, {studentName}! 👋
                    </h3>
                    <p className="text-slate-300 text-sm mt-1 max-w-md font-medium leading-relaxed">
                      You are enrolled in the <strong className="text-white">{domain}</strong> internship. Complete your weekly projects to unlock your final digital certificate.
                    </p>
                  </div>

                  {/* Circular/Text Progress block */}
                  <div className="flex items-center gap-4 shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Completion</span>
                      <div className="text-2xl font-black mt-0.5 text-yellow-400" style={{ fontFamily: "Outfit, sans-serif" }}>
                        {getProgressPercentage()}%
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-white/20 flex items-center justify-center relative" style={{ borderTopColor: C.orange }}>
                      <Check className="text-yellow-400" size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Setup Stats Cards */}
              <div className="grid sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center gap-4 hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.orangeLight }}>
                    <Clock size={22} style={{ color: C.orange }} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Internship Days</span>
                    <div className="font-extrabold text-lg text-slate-800 mt-0.5">{getWeeksCount() * 7} Days Total</div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center gap-4 hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.blueLight }}>
                    <FileText size={22} style={{ color: C.blue }} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Weekly Projects</span>
                    <div className="font-extrabold text-lg text-slate-800 mt-0.5">{maxWeeks} Tasks Assigned</div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center gap-4 hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50">
                    <CheckCircle size={22} className="text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Approved Tasks</span>
                    <div className="font-extrabold text-lg text-slate-800 mt-0.5">{getApprovedTasksCount()} Completed</div>
                  </div>
                </div>
              </div>

              {/* Weekly Task Checklist overview */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-extrabold text-slate-800 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Internship Progress Timeline</h4>
                  <button onClick={() => setActiveTab("tasks")} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                    Submit Tasks <ArrowRight size={12} />
                  </button>
                </div>

                <div className="flex flex-col gap-2.5">
                  {visibleTasks.map((task) => {
                    const status = getWeekStatus(task.week);
                    return (
                      <div key={task.week} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition text-xs bg-slate-50/30">
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                            status === "Pending Review" ? "bg-amber-100 text-amber-700" :
                              status === "Locked" ? "bg-slate-100 text-slate-400" :
                                "bg-blue-50 text-blue-700"
                            }`}>
                            {status === "Approved" ? <Check size={14} /> : task.week}
                          </div>
                          <div>
                            <div className="font-bold text-slate-700">Week {task.week}: {task.title}</div>
                          </div>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                            status === "Pending Review" ? "bg-amber-100 text-amber-700" :
                              status === "Locked" ? "bg-slate-100 text-slate-400" :
                                "bg-blue-100 text-blue-700"
                            }`}>
                            {status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── 2. WEEKLY TASKS & UPLOAD TAB ────────────────── */}
          {activeTab === "tasks" && (
            <div className="flex flex-col gap-5">
              
              {/* Task Rules Banner */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3 shadow-sm">
                <Clock size={18} style={{ color: C.blue }} className="shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-slate-500">
                  <strong>Task Rules:</strong> Please submit your projects weekly. Sharing your <strong>GitHub Repository URL</strong> is mandatory. You must also write a LinkedIn post about your weekly project tagging <strong>Jobify</strong>, and share your <strong>LinkedIn Post URL</strong>. Both fields are required to submit the assignment.
                </p>
              </div>

              {/* Week Navigation Tab Bar */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
                {visibleTasks.map((task) => {
                  const status = getWeekStatus(task.week);
                  const isActive = selectedWeekTab === task.week;
                  
                  return (
                    <button
                      key={task.week}
                      onClick={() => setSelectedWeekTab(task.week)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 transition flex items-center gap-1.5 border ${
                        isActive 
                          ? "bg-[#0A2540] text-white border-slate-800 shadow-sm" 
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span>Week {task.week}</span>
                      {status === "Approved" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Approved" />
                      )}
                      {status === "Pending Review" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" title="Pending Review" />
                      )}
                      {status === "Locked" && (
                        <Lock size={10} className="text-slate-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Week Detail Panel */}
              {(() => {
                const task = visibleTasks.find((t) => t.week === selectedWeekTab);
                if (!task) return null;

                const status = getWeekStatus(task.week);
                const submission = submissions[task.week];

                if (status === "Locked") {
                  const isPrevApproved = task.week === 1 || (submissions[task.week - 1] && submissions[task.week - 1].status === "Approved");
                  const timeDetails = getWeekUnlockTimeDetails(task.week);

                  return (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center flex flex-col items-center justify-center min-h-[250px] shadow-sm animate-fade-in">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <Lock size={20} />
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
                        Week {task.week} is Locked
                      </h4>
                      {!isPrevApproved ? (
                        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                          Please complete and get approval for the previous week's task (Week {task.week - 1}) to unlock this curriculum milestone.
                        </p>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 mt-1">
                          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                            This week's task is locked under the 7-day interval gate since your enrollment.
                          </p>
                          <span className="mt-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-4 py-1.5 flex items-center gap-1.5">
                            <Clock size={12} /> Unlocks in {timeDetails.daysRemaining} {timeDetails.daysRemaining === 1 ? "day" : "days"} (on {timeDetails.unlockDate ? timeDetails.unlockDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""})
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all p-6 flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 uppercase tracking-wider">
                            Week {task.week}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            status === "Approved" ? "bg-emerald-50 text-emerald-700" :
                            status === "Pending Review" ? "bg-amber-50 text-amber-700" :
                            "bg-blue-50 text-blue-700"
                          }`}>
                            {status}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-slate-800 text-lg mt-1" style={{ fontFamily: "Outfit, sans-serif" }}>
                          {task.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weekly Project details</span>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1.5">{task.desc}</p>
                    </div>

                    {/* Reference Materials */}
                    {task.materials && task.materials.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Learning Reference Materials</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {task.materials.map((mat) => (
                            <button
                              key={mat}
                              onClick={() => alert(`Downloading reference book: ${mat}`)}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-xs font-semibold text-slate-700"
                            >
                              <FileText size={13} className="text-orange-500" />
                              <span>{mat}</span>
                              <Download size={11} className="text-slate-400 ml-1" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <hr className="border-slate-100" />

                    {/* Submission Status Display */}
                    {status === "Approved" && (
                      <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 flex items-start gap-3">
                        <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-xs text-emerald-800">Assignment Approved (Grade: {submission.grade})</div>
                          <p className="text-[11px] text-emerald-600/90 mt-0.5">Your project was verified. Excellent code structure and formatting!</p>
                          <div className="flex flex-col sm:flex-row gap-4 mt-3 font-mono text-[10px]">
                            <a href={submission.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-blue-600">
                              <ExternalLink size={10} /> GitHub Repo
                            </a>
                            <a href={submission.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-blue-600">
                              <ExternalLink size={10} /> LinkedIn Post
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {status === "Pending Review" && (
                      <div className="p-5 rounded-2xl border border-amber-100 bg-amber-50/50 flex items-start gap-3">
                        <Clock size={18} className="text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-xs text-amber-800">Review Pending</div>
                          <p className="text-[11px] text-amber-600/90 mt-0.5">Your project is submitted. The admin verification panel will verify your submission files.</p>
                          <div className="flex flex-col gap-1.5 mt-3 font-mono text-[10px] text-slate-500">
                            <span className="flex items-center gap-1 text-slate-600 font-bold"><Check size={10} /> GitHub: {submission.repoUrl}</span>
                            <span className="flex items-center gap-1 text-slate-600 font-bold"><Check size={10} /> LinkedIn: {submission.linkedinUrl}</span>
                          </div>
                          <button
                            onClick={() => handleResetSubmission(task.week)}
                            className="mt-3 text-[10px] font-bold text-slate-500 hover:text-red-500 transition flex items-center gap-1 hover:underline"
                          >
                            <RefreshCw size={10} /> Resubmit/Edit Submission
                          </button>
                        </div>
                      </div>
                    )}

                    {/* HIGHLY VISIBLE DEDICATED UPLOAD TASK INTERFACE */}
                    {status === "Pending Submission" && (
                      <div className="flex flex-col gap-5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Submit Assignment</span>

                        {/* Links input form */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                              <span>GitHub Repository URL</span>
                              <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                              type="url"
                              placeholder="https://github.com/username/project-repo"
                              value={submitRepo}
                              onChange={(e) => setSubmitRepo(e.target.value)}
                              className="px-3 py-2.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-400 text-slate-800 bg-white"
                              required
                            />
                            <span className="text-[9px] text-slate-400">Ensure the repository is public and contains your project files.</span>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                              <span>LinkedIn Post URL</span>
                              <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                              type="url"
                              placeholder="https://www.linkedin.com/posts/your-activity-id"
                              value={submitLinkedin}
                              onChange={(e) => setSubmitLinkedin(e.target.value)}
                              className="px-3 py-2.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-400 text-slate-800 bg-white"
                              required
                            />
                            <span className="text-[9px] text-slate-400">Share your learning/project on LinkedIn, tag @Jobify, and paste link.</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleProjectSubmit(task.week)}
                          className="self-start px-6 py-3 rounded-xl text-white font-bold text-xs transition hover:opacity-90 shadow-md flex items-center gap-1.5"
                          style={{ background: G.blue, fontFamily: "Outfit, sans-serif" }}
                        >
                          <Upload size={13} /> Submit Assignment
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ────────────────── 3. STUDY MATERIALS TAB ────────────────── */}
          {activeTab === "materials" && (
            <div className="flex flex-col gap-6">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <h3 className="font-extrabold text-slate-800 text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Intern Study Library</h3>
                <p className="text-xs text-slate-400">Access all recommended textbooks, manuals, and cheat-sheets curated for the {domain} track.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "HTML5 & CSS3 Standard Reference", desc: "A comprehensive guide on styling layouts, grids, animations, and forms.", size: "4.8 MB" },
                  { title: "Eloquent JavaScript (3rd Edition)", desc: "Deep dive into language mechanics, objects, classes, closures, and async actions.", size: "12.4 MB" },
                  { title: "React Hooks & State Management", desc: "Structured book covering custom Hooks, Context API, and state optimization.", size: "6.2 MB" },
                  { title: "Node.js REST API Best Practices", desc: "Express security, token cookies, input sanitization, and structured routing.", size: "3.5 MB" },
                  { title: "Python Automation & Scripting Guide", desc: "Automating excel, database queries, mail triggers, and tasks scheduling.", size: "8.1 MB" },
                  { title: "Deep Learning Foundations Textbook", desc: "Mathematical review, backpropagation, CNNs, LSTMs, and PyTorch concepts.", size: "15.6 MB" }
                ].map((book) => (
                  <div key={book.title} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition flex items-start gap-4 shadow-sm hover:shadow-md">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.orangeLight }}>
                      <FileText size={20} style={{ color: C.orange }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-xs truncate" style={{ fontFamily: "Outfit, sans-serif" }}>{book.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{book.desc}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-slate-400 font-semibold">{book.size} · PDF</span>
                        <button
                          onClick={() => alert(`Downloading ${book.title}`)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold border border-slate-200 hover:bg-slate-50 transition text-slate-700"
                        >
                          <Download size={11} /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ────────────────── 4. CERTIFICATE TAB ────────────────── */}
          {activeTab === "cert" && (
            <div className="flex flex-col items-center justify-center p-8 border border-slate-200 rounded-2xl bg-white text-center min-h-[400px] shadow-sm">
              {!isEligibleForCert() ? (
                <div className="flex flex-col items-center max-w-sm gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: C.orangeLight }}>
                    <Lock size={26} style={{ color: C.orange }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base" style={{ fontFamily: "Outfit, sans-serif" }}>Certificate Locked</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                      To unlock your Internship Completion Certificate, you must successfully submit and receive 'Approved' status on all week tasks ({maxWeeks} weeks) for your plan.
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${getProgressPercentage()}%`, background: G.blue }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">Current progress: {getProgressPercentage()}%</span>

                  <button
                    onClick={() => setActiveTab("tasks")}
                    className="mt-2 text-xs font-bold underline flex items-center gap-1"
                    style={{ color: C.blue }}
                  >
                    Go to Weekly Tasks <ArrowRight size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center max-w-md gap-5 p-8 rounded-3xl bg-emerald-50/40 border border-emerald-100/60 shadow-sm animate-fade-in">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600 animate-bounce">
                    <Award size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>Congratulations, Intern! 🎓</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2">
                      You have successfully submitted and received 'Approved' status on all {maxWeeks} weekly tasks in the <strong>{domain}</strong> track.
                    </p>
                  </div>
                  <div className="w-full py-4 px-6 rounded-2xl bg-white border border-emerald-100 text-center shadow-md">
                    <p className="text-xs font-black text-emerald-800" style={{ fontFamily: "Outfit, sans-serif" }}>
                      ✉️ You will receive your certificate in a few days through email.
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Our verification team is reviewing your weekly project submissions and will dispatch your digital certificate shortly.
                    </p>
                  </div>
                </div>
              )}

              {/* Certificate Viewer Modal */}
              {showCert && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full border relative flex flex-col">

                    {/* Modal close */}
                    <button onClick={() => setShowCert(false)} className="absolute top-4 right-4 bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 p-2 rounded-full z-10 transition">
                      <X size={16} />
                    </button>

                    {/* Digital Certificate layout */}
                    <div className="p-8 sm:p-12 border-b border-slate-100 flex flex-col items-center text-center relative overflow-hidden" style={{ minHeight: "450px" }}>
                      {/* Decorative borders */}
                      <div className="absolute inset-4 border-2 border-double border-slate-200 pointer-events-none" />
                      <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-orange-400 pointer-events-none" />
                      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-orange-400 pointer-events-none" />

                      {/* Header */}
                      <div className="mb-6 flex flex-col items-center">
                        <img src={logoImg} alt="Jobify logo" className="h-14 w-auto object-contain mb-2" />
                        <span className="text-[10px] tracking-widest uppercase font-bold text-blue-600">Certificate of Completion</span>
                      </div>

                      {/* Body */}
                      <p className="text-xs text-slate-400 italic font-serif">This is proudly presented to</p>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-800 my-3 font-serif" style={{ fontFamily: "Outfit, sans-serif" }}>{studentName}</h2>

                      <p className="text-xs leading-relaxed text-slate-500 max-w-md font-serif">
                        for successfully completing their <strong>{duration}</strong> practical internship in the domain of <strong className="text-slate-800">{domain}</strong> from <span className="font-semibold text-slate-700">Jobify Portal</span>.
                        They have demonstrated excellence and consistency in delivering weekly projects and task objectives.
                      </p>

                      {/* Footer Details */}
                      <div className="grid grid-cols-2 gap-10 mt-10 w-full max-w-sm border-t border-slate-100 pt-6 text-[10px]">
                        <div>
                          <span className="text-slate-400 block uppercase font-semibold">Date of Issue</span>
                          <span className="font-bold text-slate-700 block mt-0.5">
                            {certDetails ? new Date(certDetails.issued).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase font-semibold">Verification ID</span>
                          <span className="font-bold text-slate-700 block mt-0.5 font-mono">
                            {certDetails ? certDetails.certId : "JBF-2026-TEST"}
                          </span>
                        </div>
                      </div>

                      {/* Signature seal */}
                      <div className="mt-8 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[9px] text-white border-2 border-orange-500 bg-orange-400 shadow-md transform rotate-12">
                          JOBIFY
                        </div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-1.5">Verified Internship Seal</span>
                      </div>
                    </div>

                    {/* Download/Share Actions */}
                    <div className="p-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 px-8">
                      <span className="text-[10px] text-slate-400 font-medium">Verify online using ID: <strong>{certDetails ? certDetails.certId : "JBF-2026-TEST"}</strong></span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => alert("Downloading PDF Certificate...")}
                          className="px-5 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:opacity-90 transition flex items-center gap-1.5"
                        >
                          <Download size={13} /> Download PDF
                        </button>
                        <button
                          onClick={() => alert("Sharing link to LinkedIn...")}
                          className="px-5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition flex items-center gap-1.5"
                        >
                          Share on LinkedIn
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
