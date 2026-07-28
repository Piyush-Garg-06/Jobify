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
// Course curriculum data based on domain
const CURRICULA = {
  "Python": {
    tasks: [
      { week: 1, title: "Smart Command-Line Calculator", desc: "Create an interactive CLI calculator that handles operations, remembers history of past computations, and processes multi-argument operations cleanly.", materials: ["Python_Basics_and_Syntax.pdf"] },
      { week: 2, title: "Guess the Number & Tic-Tac-Toe Game", desc: "Build a two-player Tic-Tac-Toe game playable inside the console. Design clean functions, 2D array representation for the board, and handle win/draw validation.", materials: ["Python_Functions_and_Lists.pdf"] },
      { week: 3, title: "Classic Snake Game (Pygame)", desc: "Build a running snake game using the Pygame library. Implement snake movement keyboard controls, food spawning, boundary collisions, and score tracking.", materials: ["Intro_to_Pygame_and_Graphics.pdf"] },
      { week: 4, title: "Advanced Desktop GUI Calculator (Tkinter)", desc: "Design and implement a graphical user interface (GUI) desktop calculator app using Python's native Tkinter library.", materials: ["Tkinter_GUI_Development.pdf"] },
      { week: 5, title: "Web Price Scraper & CSV Exporter", desc: "Create a BeautifulSoup/Requests web scraper to fetch product names and prices from an e-commerce page and export the results to a CSV file.", materials: ["Web_Scraping_with_BeautifulSoup.pdf"] },
      { week: 6, title: "Automated Email Bot (SMTP)", desc: "Write a script that reads dynamic customer names and emails from a CSV file and dispatches personalized emails automatically with attachment reports.", materials: ["Python_Email_Automation_and_SMTP.pdf"] },
      { week: 7, title: "Database SQL connected Library System", desc: "Build a terminal-based Library Management System connected to SQLite database for managing books, authors, and student issue logs.", materials: ["Databases_in_Python_with_sqlite3.pdf"] },
      { week: 8, title: "Live Weather GUI Application (APIs)", desc: "Build a custom GUI application using CustomTkinter/Tkinter that fetches weather updates from open APIs for searched locations.", materials: ["API_Request_Handling_and_JSON_Parsing.pdf"] }
    ]
  },
  "Web Development": {
    tasks: [
      { week: 1, title: "Personal Portfolio Website (HTML & CSS)", desc: "Build a fully responsive and clean personal portfolio page using semantic HTML and custom CSS. Show your skills, projects, and an interactive contact form.", materials: ["HTML5_CSS3_Responsive_Design.pdf"] },
      { week: 2, title: "Interactive JavaScript Calculator & To-Do App", desc: "Create a modern, fully functional dynamic calculator and a persistent To-Do list application that stores tasks in LocalStorage and handles user input events.", materials: ["Modern_JavaScript_ES6_and_DOM.pdf"] },
      { week: 3, title: "Interactive Quiz App (React.js Basics)", desc: "Build an interactive multiple-choice quiz app in React. Implement timer countdown, custom scorecards, state management using useState, and conditional rendering.", materials: ["React_Basics_States_and_Hooks.pdf"] },
      { week: 4, title: "Weather Web App with Live API Integration", desc: "Create a web application that fetches live weather forecasts from a public API (like OpenWeatherMap) and displays temperature, humidity, and atmospheric conditions dynamically based on search inputs.", materials: ["React_APIs_and_Axios.pdf"] },
      { week: 5, title: "Express.js Rest API (Task Manager Backend)", desc: "Build a Node.js and Express backend server. Expose CRUD REST API endpoints for user authentication, task creations, updates, and secure password hashing using bcrypt/JWT.", materials: ["ExpressJS_and_REST_APIs.pdf"] },
      { week: 6, title: "MongoDB Integration (CRUD App)", desc: "Connect your Express server to a MongoDB Atlas database. Create models and schemas for Users and Tasks to persist data securely, replacing transient memory objects.", materials: ["MongoDB_and_Mongoose_Models.pdf"] },
      { week: 7, title: "Full-Stack Project Integration", desc: "Connect your React frontend with the Express/MongoDB backend. Implement registration/login forms, save state across page reloads, and verify data flows between client and server.", materials: ["Connecting_React_to_NodeJS_Backend.pdf"] },
      { week: 8, title: "Full Stack Live Deployment", desc: "Deploy the frontend to Netlify/Vercel and host your Express API backend live (e.g. Render/Railway). Verify data persistence and submit live production URLs.", materials: ["Full_Stack_Deployment_Guide.pdf"] }
    ]
  },
  "Java": {
    tasks: [
      { week: 1, title: "CLI ATM Simulator", desc: "Build an ATM simulator handling PIN authentication, deposit, withdraw, and transaction history.", materials: ["Java_Basics_and_Syntax.pdf"] },
      { week: 2, title: "Hospital Management CLI (OOP)", desc: "Create a console medical portal with Patient, Doctor, and Appointment objects showcasing core OOP features.", materials: ["Java_OOP_Principles.pdf"] },
      { week: 3, title: "Student Gradebook Tracker (Collections)", desc: "Use lists, hashsets, and maps to manage a student database, calculate average grades, and search entries.", materials: ["Java_Collections_Framework.pdf"] },
      { week: 4, title: "Multi-Threaded Task Server Simulator", desc: "Build a simulation of client requests queue being processed by worker threads using Java multithreading.", materials: ["Java_Threads_and_Exceptions.pdf"] },
      { week: 5, title: "Database Book Registry with JDBC", desc: "Connect a Java CLI application to SQLite/MySQL using JDBC to query, add, and update a book inventory.", materials: ["Java_Database_Connectivity_JDBC.pdf"] },
      { week: 6, title: "Spring Boot REST CRUD API", desc: "Build a Spring Boot backend exposing employee endpoint management with JSON formats.", materials: ["Spring_Boot_Essentials.pdf"] },
      { week: 7, title: "Mock Unit Tests (JUnit & Mockito)", desc: "Write JUnit test cases for service layers, mocking repository classes with Mockito.", materials: ["Java_Testing_Frameworks.pdf"] },
      { week: 8, title: "Tic-Tac-Toe Desktop App (Swing/JavaFX)", desc: "Create a fully functional interactive GUI Tic-Tac-Toe game using Java Swing components.", materials: ["Java_GUI_Swing_Tutorial.pdf"] }
    ]
  },
  "C++": {
    tasks: [
      { week: 1, title: "Interactive Operations & Calculator CLI", desc: "Create an interactive CLI calculator in C++ handling standard operators, input validation, and history lists.", materials: ["CPP_Core_Syntax_Guide.pdf"] },
      { week: 2, title: "Bank Account Management System (Pointers & OOP)", desc: "Implement pointers and reference variables to manage user bank statements and modify balance variables dynamically.", materials: ["CPP_Pointers_and_References.pdf"] },
      { week: 3, title: "Tic-Tac-Toe Console Game (OOP Classes)", desc: "Build a C++ console game with Board and Player classes, checking row/column/diagonal wins.", materials: ["CPP_Classes_and_OOP.pdf"] },
      { week: 4, title: "Student Database with File Persistence", desc: "Implement C++ file streams (fstream) to save and load student data records from a physical text file.", materials: ["CPP_File_Streams_and_Persistence.pdf"] },
      { week: 5, title: "Smart Pointer Memory Management Model", desc: "Implement custom resource managers tracking instance lifetimes using C++ unique_ptr and shared_ptr.", materials: ["CPP_Smart_Pointers_Manual.pdf"] },
      { week: 6, title: "Contacts Manager using STL Vectors & Maps", desc: "Organize contacts in vectors and hash maps, implementing custom search and sorting utilities.", materials: ["CPP_STL_Containers_Handbook.pdf"] },
      { week: 7, title: "Custom Exception Safe Database Handler", desc: "Validate user input exceptions and prevent crashes using try-catch blocks during program execution.", materials: ["CPP_Exception_Handling_Safety.pdf"] },
      { week: 8, title: "File Encryption & Decryption Utility", desc: "Build a command-line file tool that encrypts the contents of a text file using basic cryptographic shift algorithms and decrypts it back.", materials: ["CPP_Cryptography_Principles.pdf"] }
    ]
  },
  "DSA": {
    tasks: [
      { week: 1, title: "Two-Pointer & Sliding Window Problems", desc: "Solve 5 top array and string questions focusing on sliding windows and index pointers.", materials: ["Arrays_and_Sliding_Window.pdf"] },
      { week: 2, title: "Recursion & Backtracking Algorithms", desc: "Implement recursive solutions for Permutations, Combinations, and solve N-Queens board placement.", materials: ["Recursion_and_Backtracking.pdf"] },
      { week: 3, title: "Linked Lists, Stacks & Queues", desc: "Solve questions like Reverse Linked List, Valid Parentheses, and LRU Cache structures.", materials: ["Linear_Data_Structures_DSA.pdf"] },
      { week: 4, title: "Binary Tree & Binary Search Tree Traversals", desc: "Build tree data structures, implement DFS/BFS, and solve validation questions.", materials: ["Binary_Trees_and_BST.pdf"] },
      { week: 5, title: "Graph DFS & BFS Traversals", desc: "Implement graphs using adjacency lists and perform depth-first/breadth-first traversal routines.", materials: ["Graph_Theory_Algorithms.pdf"] },
      { week: 6, title: "Dynamic Programming (Knapsack & LCS)", desc: "Build memoized and tabulated solutions for 0/1 Knapsack and Longest Common Subsequence.", materials: ["Dynamic_Programming_Foundations.pdf"] },
      { week: 7, title: "Advanced Sorting & Heap Algorithms", desc: "Implement QuickSort/MergeSort and utilize priority queues for Kth Largest Element queries.", materials: ["Heaps_and_Sorting_Algorithms.pdf"] },
      { week: 8, title: "Mock Interview Challenge Portfolio", desc: "Compile a final portfolio of 10 complex solved DSA questions, detailing time and space complexity in a README on GitHub.", materials: ["DSA_Interview_Preparation.pdf"] }
    ]
  },
  "AI / ML": {
    tasks: [
      { week: 1, title: "Vectorized Operations with NumPy", desc: "Implement dot products, matrix multiplication, and vector normalization metrics using NumPy.", materials: ["NumPy_and_Linear_Algebra.pdf"] },
      { week: 2, title: "Linear Regression from Scratch", desc: "Implement simple linear regression training loops using gradient descent and calculate MSE.", materials: ["Linear_Regression_Gradient_Descent.pdf"] },
      { week: 3, title: "E-Commerce Customer Segmentation (K-Means)", desc: "Preprocess dataset, find optimal cluster counts using elbow method, and plot K-Means groups.", materials: ["K_Means_Clustering_and_Data_Prep.pdf"] },
      { week: 4, title: "Email Spam Classifier (Naive Bayes)", desc: "Vectorize text emails and build a text classifier to predict spam vs ham categories.", materials: ["Text_Classification_Naive_Bayes.pdf"] },
      { week: 5, title: "Handwritten Digit Classifier (PyTorch)", desc: "Build a PyTorch Multi-Layer Perceptron neural network and train it on MNIST digit datasets.", materials: ["PyTorch_Deep_Learning_Basics.pdf"] },
      { week: 6, title: "Object Classifier (Convolutional Neural Network)", desc: "Design CNN layers with PyTorch to perform object classification on CIFAR-10 datasets.", materials: ["Convolutional_Neural_Networks_CNN.pdf"] },
      { week: 7, title: "Sentiment Analysis (LSTM/Transformers)", desc: "Fine-tune a HuggingFace BERT Transformer model or LSTM to classify text sentiment reviews.", materials: ["NLP_BERT_and_LSTMs.pdf"] },
      { week: 8, title: "Model Server Deploy API (FastAPI)", desc: "Wrap your PyTorch/Scikit-Learn model in a FastAPI endpoint and return predictions dynamically.", materials: ["FastAPI_Model_Deployment.pdf"] }
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
                              onClick={() => window.open(`/resources/${mat}`, "_blank")}
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
                {(CURRICULA[domain]?.tasks || []).map((task) => {
                  const bookFile = task.materials?.[0] || "";
                  const bookTitle = task.title;
                  const bookDesc = `Weekly learning manual: ${task.desc.split(".")[0]}.`;
                  return (
                    <div key={bookTitle} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition flex items-start gap-4 shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.orangeLight }}>
                        <FileText size={20} style={{ color: C.orange }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-xs truncate" style={{ fontFamily: "Outfit, sans-serif" }}>{bookTitle}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{bookDesc}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[10px] text-slate-400 font-semibold">Week {task.week} · PDF</span>
                          <button
                            onClick={() => window.open(`/resources/${bookFile}`, "_blank")}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold border border-slate-200 hover:bg-slate-50 transition text-slate-700"
                          >
                            <Download size={11} /> Open PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
