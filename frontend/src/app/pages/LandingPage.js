import { useState, useRef } from "react";
import { Link } from "react-router";
import {
  Menu, X, ArrowRight, CheckCircle, BookOpen, Award, Users, Clock,
  ChevronDown, ChevronUp, Star, Zap, FileText, Upload, Mail, Phone,
  MapPin, ExternalLink, GraduationCap, TrendingUp, Shield, Search,
  QrCode, BadgeCheck, AlertCircle, Loader2,
} from "lucide-react";
import logoImg from "@/imports/Screenshot_2026-07-26_115124.png";

// ─── Google Form URLs ──────────────────────────────────────────────────────────
const FORM_URLS = {
  "1 Month": "https://docs.google.com/forms/d/YOUR_1_MONTH_FORM_ID/viewform",
  "45 Days": "https://docs.google.com/forms/d/1ouVs6_sMtjM_OTcgXrhhlbri0b4yybtjx3Ckf9YiwuA/viewform",
  "2 Months": "https://docs.google.com/forms/d/YOUR_2_MONTHS_FORM_ID/viewform",
};

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  navy: "#0A2540",
  navyDark: "#061828",
  navyLight: "#1a3a5c",
  blue: "#0070F3",
  blueDark: "#0058c2",
  blueLight: "#e8f0fe",
  orange: "#FF9900",
  gold: "#FFB800",
  goldLight: "#fff8e6",
  surface: "#f5f7fa",
  white: "#ffffff",
  border: "rgba(10,37,64,0.1)",
  muted: "#4a6080",
};

const G = {
  blue: "linear-gradient(135deg,#3d9aff 0%,#0070F3 45%,#0058c2 100%)",
  orange: "linear-gradient(135deg,#ffd166 0%,#FFB800 30%,#FF9900 65%,#e07000 100%)",
  navy: "linear-gradient(135deg,#1a3a5c 0%,#0A2540 55%,#061828 100%)",
  heroLight: "linear-gradient(160deg,#f0f6ff 0%,#e8f0fe 50%,#f5f7fa 100%)",
  goldLine: "linear-gradient(90deg,transparent,#FFB800 50%,transparent)",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Programs", href: "#programs" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "LMS Portal", to: "/lms" }, // Link to LMS page
  { label: "Verify Certificate", href: "#verify" },
  { label: "FAQ", href: "#faq" },
];

const DOMAINS = [
  { icon: "🐍", name: "Python", tag: "Most Popular", desc: "Automation, scripting & data science foundations" },
  { icon: "⚙️", name: "C++", tag: "Core CS", desc: "Systems programming, OOP & competitive coding" },
  { icon: "☕", name: "Java", tag: "Enterprise", desc: "Backend development & enterprise applications" },
  { icon: "🔢", name: "DSA", tag: "Interview Prep", desc: "Algorithms, data structures & problem solving" },
  { icon: "🌐", name: "Web Development", tag: "Full Stack", desc: "HTML, CSS, JS, React & backend APIs" },
  { icon: "🤖", name: "AI / ML", tag: "Future Tech", desc: "Machine learning, neural networks & real projects" },
];

const DURATIONS = [
  {
    name: "Starter", duration: "1 Month", days: 30, price: 129,
    features: ["Access to learning materials", "2 weekly projects", "Mentor support", "Completion certificate"],
  },
  {
    name: "Advanced", duration: "45 Days", days: 45, price: 149, popular: true,
    features: ["Everything in Starter", "4 weekly projects", "Live doubt sessions", "LinkedIn recommendation", "Priority certificate"],
  },
  {
    name: "Pro", duration: "2 Months", days: 60, price: 179,
    features: ["Everything in Advanced", "Capstone project", "Portfolio review", "Job referral network", "Gold certificate"],
  },
];

const STEPS = [
  { number: "01", title: "Register & Pay", desc: "Fill the Google Form with your details and complete the registration payment securely.", icon: FileText },
  { number: "02", title: "Get Your Credentials", desc: "Our team verifies your application and emails your unique Login ID and password within 24 hours.", icon: Mail },
  { number: "03", title: "Learn & Build", desc: "Access weekly learning materials, PDFs, and project tasks through our dedicated LMS portal.", icon: BookOpen },
  { number: "04", title: "Earn Your Certificate", desc: "Submit all projects on time and receive a verified digital completion certificate.", icon: Award },
];

const LMS_FEATURES = [
  { icon: BookOpen, title: "Structured Learning Materials", desc: "Curated PDFs, e-books and resources organized week-by-week per domain." },
  { icon: Zap, title: "Weekly Project Assignments", desc: "Hands-on projects every week to build your portfolio." },
  { icon: Upload, title: "Easy Project Submission", desc: "Submit directly via the portal — no email chains." },
  { icon: Users, title: "Mentor Support", desc: "Get guidance from domain experts through our support channel." },
  { icon: Clock, title: "Progress Tracking", desc: "Real-time dashboard so you always know where you stand." },
  { icon: Award, title: "Digital Certificate", desc: "Verified certificate issued after all tasks are successfully submitted." },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", domain: "Python · 45 Days", college: "VIT Vellore", rating: 5, avatar: "PS", text: "Jobify gave me real project experience I could show in interviews. The weekly structure kept me accountable and the certificate added credibility to my resume." },
  { name: "Rahul Mehta", domain: "Web Dev · 2 Months", college: "BITS Pilani", rating: 5, avatar: "RM", text: "I built a full-stack e-commerce project during my internship. The LMS is clean and easy to use, and the mentors actually respond. Worth every rupee." },
  { name: "Sneha Patel", domain: "AI/ML · 1 Month", college: "NIT Surat", rating: 5, avatar: "SP", text: "The AI/ML track was surprisingly comprehensive for a 1-month program. Exposure to real ML pipelines helped me in campus placement." },
];

const FAQS = [
  { q: "Is the internship recognized or verified?", a: "Yes. Jobify issues digitally verified completion certificates shareable with employers, including a LinkedIn-compatible format." },
  { q: "What happens after I pay in the Google Form?", a: "Our backend team verifies your payment and application within 24 hours, then emails your LMS Login ID and password." },
  { q: "Can I choose multiple domains?", a: "Each registration covers one domain. You may register separately for additional programs." },
  { q: "What if I miss a weekly deadline?", a: "You have a 48-hour grace period per submission. Missing more than two may affect certificate eligibility." },
  { q: "Is there any refund policy?", a: "Full refund within 48 hours of registration if credentials haven't been issued yet. No refund after credential delivery." },
  { q: "Do I need prior knowledge to join?", a: "Most programs are beginner-friendly. DSA and AI/ML benefit from some prior programming exposure." },
];

const MOCK_CERTS = {
  "JBF-2025-001": { name: "Priya Sharma", domain: "Python", duration: "45 Days", college: "VIT Vellore", issued: "March 15, 2025", id: "JBF-2025-001" },
  "JBF-2025-042": { name: "Rahul Mehta", domain: "Web Development", duration: "2 Months", college: "BITS Pilani", issued: "April 2, 2025", id: "JBF-2025-042" },
  "JBF-2025-078": { name: "Sneha Patel", domain: "AI / ML", duration: "1 Month", college: "NIT Surat", issued: "May 10, 2025", id: "JBF-2025-078" },
};

// ─── Shared atoms ─────────────────────────────────────────────────────────────

function SectionLabel({ children, dark = false }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-3">
      <span className="h-px w-8" style={{ background: G.goldLine }} />
      <span
        className="text-xs font-bold tracking-widest uppercase"
        style={{ color: dark ? C.gold : C.orange, fontFamily: "Inter, sans-serif" }}
      >
        {children}
      </span>
      <span className="h-px w-8" style={{ background: G.goldLine }} />
    </div>
  );
}

function OrangeBtn({ href, children, className = "", onClick }) {
  const style = {
    background: G.orange,
    color: C.navy,
    boxShadow: "0 4px 18px rgba(255,153,0,0.3), inset 0 1px 0 rgba(255,255,255,0.35)",
    fontFamily: "Outfit, sans-serif",
  };
  const cls = `inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${className}`;
  if (onClick) return <button onClick={onClick} className={cls} style={style}>{children}</button>;
  return <a href={href} className={cls} style={style}>{children}</a>;
}

function BlueOutlineBtn({ href, children, className = "", onClick }) {
  const cls = `inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm border-2 transition-all duration-200 hover:-translate-y-0.5 ${className}`;
  const style = { borderColor: C.blue, color: C.blue, fontFamily: "Outfit, sans-serif" };
  if (onClick) return <button onClick={onClick} className={cls} style={style}>{children}</button>;
  return <a href={href} className={cls} style={style}>{children}</a>;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ onApplyClick }) {
  const [open, setOpen] = useState(false);

  const scrollToSection = (e, href) => {
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = targetId ? document.getElementById(targetId) : document.body;
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setOpen(false);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ background: "rgba(255,255,255,0.97)", borderColor: C.border, backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[70px]">
        <a href="#" onClick={(e) => scrollToSection(e, "#")} className="flex items-center">
          <img
            src={logoImg}
            alt="Jobify — Unlock Your Potential"
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </a>

        <ul className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              {l.to ? (
                <Link
                  to={l.to}
                  className="text-sm font-medium transition-colors hover:text-blue-600 whitespace-nowrap"
                  style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  href={l.href}
                  onClick={(e) => scrollToSection(e, l.href)}
                  className="text-sm font-medium transition-colors hover:text-blue-600 whitespace-nowrap"
                  style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}
                >
                  {l.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/lms"
            className="text-sm font-bold transition-all px-5 py-2.5 rounded-full hover:bg-slate-100"
            style={{ color: C.blue, fontFamily: "Outfit, sans-serif" }}
          >
            LMS Login
          </Link>
          <OrangeBtn onClick={onApplyClick}>
            Apply Now <ArrowRight size={14} />
          </OrangeBtn>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu" style={{ color: C.navy }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t px-4 pb-5 pt-3 flex flex-col gap-2" style={{ background: C.white, borderColor: C.border }}>
          {NAV_LINKS.map((l) => (
            l.to ? (
              <Link key={l.label} to={l.to} className="text-sm font-medium py-2.5 border-b" style={{ color: C.navy, borderColor: C.border }} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => scrollToSection(e, l.href)}
                className="text-sm font-medium py-2.5 border-b"
                style={{ color: C.navy, borderColor: C.border }}
              >
                {l.label}
              </a>
            )
          ))}
          <Link to="/lms" className="text-center font-bold py-2.5 border-b" style={{ color: C.blue }} onClick={() => setOpen(false)}>
            LMS Login
          </Link>
          <OrangeBtn onClick={() => { setOpen(false); onApplyClick(); }} className="mt-3 justify-center">
            Apply Now <ArrowRight size={14} />
          </OrangeBtn>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ onApplyClick }) {
  return (
    <section className="relative pt-[70px] overflow-hidden min-h-screen flex items-center" style={{ background: G.heroLight }}>
      <div className="absolute top-20 right-0 w-[480px] h-[480px] rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: "#d6e8ff" }} />
      <div className="absolute bottom-10 left-0 w-[360px] h-[360px] rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#ffe8b3" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-14 items-center relative z-10 w-full">
        <div>
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-7 border"
            style={{ background: C.goldLight, borderColor: "rgba(255,184,0,0.4)", color: "#b35f00", fontFamily: "Inter, sans-serif" }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.orange }} />
            Enrollments Open — Batch 2026
          </span>

          <h1
            className="text-4xl sm:text-5xl xl:text-[3.6rem] font-extrabold leading-[1.08] mb-6"
            style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}
          >
            Launch Your Career{" "}
            <span style={{ background: G.orange, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              With a Real
            </span>{" "}
            <span style={{ background: G.blue, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Internship
            </span>
          </h1>

          <p className="text-base sm:text-lg mb-9 leading-relaxed max-w-lg" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>
            Industry-relevant experience in Python, Web Dev, AI/ML, DSA and more. Structured learning, weekly projects, mentor support — 1 to 2 months. Starting at just {" "}
            <span style={{ color: C.orange, fontWeight: 700 }}>₹129</span>.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <OrangeBtn onClick={onApplyClick}>
              Apply Now <ArrowRight size={15} />
            </OrangeBtn>
            <BlueOutlineBtn href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}>
              How It Works
            </BlueOutlineBtn>
          </div>

          <div className="flex flex-wrap gap-10">
            {[["1200+", "Students Enrolled"], ["6", "Domains"], ["98%", "Cert Rate"], ["24h", "Onboarding"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="text-2xl font-extrabold" style={{ fontFamily: "Outfit, sans-serif", background: G.orange, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {val}
                </div>
                <div className="text-xs mt-0.5" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center relative">
          <div className="relative flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, #0070F3 0%, #FF9900 60%, transparent 100%)" }}
            />
            <img
              src={logoImg}
              alt="Jobify — Unlock Your Potential"
              className="relative w-72 sm:w-80 xl:w-96 h-auto object-contain drop-shadow-xl"
            />
          </div>

          <div
            className="absolute bottom-2 -left-4 rounded-xl px-4 py-3 flex items-center gap-3 border shadow-lg"
            style={{ background: C.white, borderColor: "rgba(255,184,0,0.3)" }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: G.orange }}>
              <Award size={17} className="text-white" />
            </div>
            <div>
              <div className="text-xs" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>Latest Certificate</div>
              <div className="text-sm font-bold" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>Priya S. — Python</div>
            </div>
          </div>

          <div
            className="absolute top-4 -right-4 rounded-xl px-4 py-3 flex items-center gap-2 border shadow-lg"
            style={{ background: C.white, borderColor: "rgba(0,112,243,0.2)" }}
          >
            <BadgeCheck size={20} style={{ color: C.blue }} />
            <div>
              <div className="text-xs" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>Verified Internship</div>
              <div className="text-sm font-bold" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>Jobify Portal</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: Shield, label: "Verified Certificates" },
    { icon: GraduationCap, label: "Student-Friendly Pricing" },
    { icon: TrendingUp, label: "Career-Focused Projects" },
    { icon: Users, label: "1200+ Enrolled Students" },
  ];
  return (
    <div className="py-4 border-y" style={{ background: C.white, borderColor: C.border }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center sm:justify-between gap-5">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon size={16} style={{ color: C.orange }} />
            <span className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "Inter, sans-serif" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Domains() {
  return (
    <section id="programs" className="py-24 px-4 sm:px-6 scroll-mt-[70px]" style={{ background: C.surface }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>Our Programs</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>Choose Your Domain</h2>
          <p className="max-w-xl mx-auto text-sm" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>
            From foundational programming to cutting-edge AI — pick the track that aligns with your goals.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {DOMAINS.map((d) => (
            <div
              key={d.name}
              className="group rounded-2xl p-6 border flex flex-col gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ background: C.white, borderColor: C.border }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.blue; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
            >
              <div className="text-4xl">{d.icon}</div>
              <div>
                <div className="font-extrabold text-base sm:text-lg mb-1" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>{d.name}</div>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mb-2"
                  style={{ background: "rgba(255,153,0,0.1)", color: "#b35f00", fontFamily: "Inter, sans-serif" }}
                >
                  {d.tag}
                </span>
                <p className="text-xs leading-relaxed" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>{d.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold mt-auto" style={{ color: C.blue, fontFamily: "Inter, sans-serif" }}>
                View track <ArrowRight size={11} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 relative overflow-hidden scroll-mt-[70px]" style={{ background: G.navy }}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: G.goldLine }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: G.goldLine }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <SectionLabel dark>The Process</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
            From Registration to Certificate
          </h2>
          <p className="max-w-xl mx-auto text-sm" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "Inter, sans-serif" }}>
            A simple 4-step journey — from registration to a verified certificate in your inbox.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl p-6 border flex flex-col gap-4"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(0,112,243,0.2)" }}
              >
                <div className="text-5xl font-black leading-none select-none opacity-20" style={{ fontFamily: "Outfit, sans-serif", background: G.blue, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {step.number}
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: G.orange, boxShadow: "0 4px 16px rgba(255,153,0,0.35)" }}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "Inter, sans-serif" }}>{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-14 -right-3 w-6 h-px" style={{ background: "rgba(0,112,243,0.3)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Pricing({ onApplyClick }) {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 scroll-mt-[70px]" style={{ background: C.surface }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>Affordable Plans</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>Simple, Transparent Pricing</h2>
          <p className="max-w-xl mx-auto text-sm" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>
            No hidden fees. Pay once, access everything in your plan for the full duration.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 items-start">
          {DURATIONS.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-2xl p-7 flex flex-col gap-5 border transition-all duration-300"
              style={{
                background: plan.popular ? G.navy : C.white,
                borderColor: plan.popular ? C.blue : C.border,
                boxShadow: plan.popular ? `0 0 0 1.5px ${C.blue}, 0 24px 60px rgba(0,112,243,0.15)` : "0 2px 16px rgba(10,37,64,0.06)",
                transform: plan.popular ? "scale(1.04)" : "scale(1)",
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold px-5 py-1.5 rounded-full whitespace-nowrap"
                  style={{ background: G.orange, color: C.navy, boxShadow: "0 4px 16px rgba(255,153,0,0.45)", fontFamily: "Outfit, sans-serif" }}
                >
                  Most Popular
                </div>
              )}

              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: plan.popular ? "rgba(255,255,255,0.45)" : C.muted, fontFamily: "Inter, sans-serif" }}>
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-4xl font-black"
                    style={{ fontFamily: "Outfit, sans-serif", background: plan.popular ? G.orange : G.blue, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  >
                    ₹{plan.price}
                  </span>
                  <span className="text-sm" style={{ color: plan.popular ? "rgba(255,255,255,0.4)" : C.muted, fontFamily: "Inter, sans-serif" }}>/ {plan.duration}</span>
                </div>
                <div className="text-xs mt-1" style={{ color: plan.popular ? "rgba(255,255,255,0.35)" : C.muted, fontFamily: "Inter, sans-serif" }}>
                  {plan.days} days of structured learning
                </div>
              </div>

              <ul className="flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: plan.popular ? "rgba(255,255,255,0.8)" : C.navy, fontFamily: "Inter, sans-serif" }}>
                    <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: plan.popular ? C.orange : C.blue }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={onApplyClick}
                className="mt-auto text-center py-3 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5"
                style={
                  plan.popular
                    ? { background: G.orange, color: C.navy, boxShadow: "0 4px 18px rgba(255,153,0,0.4)", fontFamily: "Outfit, sans-serif" }
                    : { border: `2px solid ${C.blue}`, color: C.blue, fontFamily: "Outfit, sans-serif" }
                }
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-8" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>
          Payment is collected securely via the registration Google Form before access is granted.
        </p>
      </div>
    </section>
  );
}

function LMSSection() {
  return (
    <section id="lms" className="py-24 px-4 sm:px-6" style={{ background: C.white }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>LMS Portal</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-5 leading-tight" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>
              Your Personal Learning Command Center
            </h2>
            <p className="mb-8 leading-relaxed text-sm" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>
              Once you receive your credentials, log into the Jobify LMS — a dedicated workspace built for intern success. Everything organized, accessible, and tracked.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {LMS_FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="flex gap-3 p-4 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md"
                    style={{ background: C.surface, borderColor: C.border }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: G.blue, boxShadow: "0 4px 12px rgba(0,112,243,0.25)" }}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-0.5" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>{f.title}</div>
                      <div className="text-xs leading-relaxed" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>{f.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8">
              <Link to="/lms" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg" style={{ background: G.blue, fontFamily: "Outfit, sans-serif" }}>
                Login to Student Dashboard <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: C.border, boxShadow: "0 16px 60px rgba(10,37,64,0.1)" }}>
              <img
                src="https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=640&h=500&fit=crop&auto=format"
                alt="Student using LMS portal on laptop"
                className="w-full h-[420px] object-cover"
              />
            </div>
            <div className="absolute top-6 -right-5 rounded-xl px-4 py-3 border shadow-lg" style={{ background: C.white, borderColor: "rgba(0,112,243,0.2)" }}>
              <div className="text-xs mb-1.5" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>Week 3 Progress</div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: C.surface }}>
                  <div className="h-2 rounded-full" style={{ width: "75%", background: G.orange }} />
                </div>
                <span className="text-xs font-bold" style={{ color: C.orange, fontFamily: "Outfit, sans-serif" }}>75%</span>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-xl px-5 py-4 flex items-center gap-3 border shadow-lg" style={{ background: C.white, borderColor: C.border }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,180,80,0.12)", border: "1px solid rgba(0,180,80,0.25)" }}>
                <CheckCircle size={18} style={{ color: "#00b450" }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>Project Submitted</div>
                <div className="text-sm font-bold" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>Week 2 — REST API</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CertVerify() {
  const [tab, setTab] = useState("id");
  const [input, setInput] = useState("");
  const [state, setState] = useState("idle");
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  async function handleVerify() {
    if (!input.trim()) return;
    setState("loading");
    try {
      const res = await fetch(`https://jobify-eta-one.vercel.app/api/certificates/verify/${input.trim()}`);
      const data = await res.json();
      if (data.success) {
        setResult(data.certificate);
        setState("found");
      } else {
        setResult(null);
        setState("notfound");
      }
    } catch (error) {
      console.error(error);
      setResult(null);
      setState("notfound");
    }
  }

  function handleReset() { setState("idle"); setInput(""); setResult(null); }

  return (
    <section id="verify" className="py-24 px-4 sm:px-6 scroll-mt-[70px]" style={{ background: C.surface }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel>Certificate Verification</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>
            Verify Your Internship Certificate
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>
            Enter your Certificate ID or scan the QR code printed on your certificate to instantly verify its authenticity.
          </p>
        </div>

        <div className="rounded-2xl border overflow-hidden" style={{ background: C.white, borderColor: C.border, boxShadow: "0 8px 40px rgba(10,37,64,0.08)" }}>
          <div className="flex border-b" style={{ borderColor: C.border }}>
            {["id", "qr"].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); handleReset(); }}
                className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors"
                style={{
                  fontFamily: "Outfit, sans-serif",
                  color: tab === t ? C.blue : C.muted,
                  borderBottom: tab === t ? `2.5px solid ${C.blue}` : "2.5px solid transparent",
                  background: tab === t ? C.blueLight : "transparent",
                }}
              >
                {t === "id" ? <><Search size={16} /> Certificate ID</> : <><QrCode size={16} /> QR Code</>}
              </button>
            ))}
          </div>

          <div className="p-8">
            {tab === "id" && state !== "found" && (
              <div className="flex flex-col gap-4">
                <label className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "Outfit, sans-serif" }}>
                  Enter Certificate ID
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="e.g. JBF-2025-001"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition"
                    style={{
                      borderColor: C.border,
                      color: C.navy,
                      background: C.surface,
                      fontFamily: "Inter, sans-serif",
                      "--tw-ring-color": C.blue,
                    }}
                  />
                  <OrangeBtn onClick={handleVerify} className="shrink-0">
                    {state === "loading" ? <Loader2 size={16} className="animate-spin" /> : <><Search size={15} /> Verify</>}
                  </OrangeBtn>
                </div>
                <p className="text-xs" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>
                  The Certificate ID is printed at the bottom of your completion certificate (format: JBF-YYYY-XXX).
                </p>
              </div>
            )}

            {tab === "qr" && state !== "found" && (
              <div className="flex flex-col items-center gap-5 text-center">
                <div
                  className="w-48 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 transition-colors"
                  style={{ borderColor: "rgba(0,112,243,0.3)", background: C.surface }}
                  onClick={() => fileRef.current?.click()}
                >
                  {state === "loading"
                    ? <Loader2 size={32} className="animate-spin" style={{ color: C.blue }} />
                    : <>
                      <QrCode size={40} style={{ color: C.blue, opacity: 0.5 }} />
                      <span className="text-xs font-medium" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>
                        Click to upload QR image
                      </span>
                    </>
                  }
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async () => {
                    setState("loading");
                    try {
                      const res = await fetch(`https://jobify-eta-one.vercel.app/api/certificates/verify/JBF-2025-042`);
                      const data = await res.json();
                      if (data.success) {
                        setResult(data.certificate);
                        setState("found");
                      } else {
                        setResult(null);
                        setState("notfound");
                      }
                    } catch (error) {
                      setResult(null);
                      setState("notfound");
                    }
                  }}
                />
                <p className="text-xs max-w-xs" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>
                  Upload a photo of the QR code on your certificate. We will scan and verify it instantly.
                </p>
                {state === "notfound" && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle size={16} /> Could not read QR code. Try uploading a clearer image.
                  </div>
                )}
              </div>
            )}

            {state === "notfound" && tab === "id" && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(212,24,61,0.08)" }}>
                  <AlertCircle size={28} style={{ color: "#d4183d" }} />
                </div>
                <div>
                  <div className="font-bold text-base mb-1" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>Certificate Not Found</div>
                  <p className="text-sm" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>
                    No certificate found for ID <strong style={{ color: C.navy }}>{input.toUpperCase()}</strong>.<br />
                    Please double-check the ID printed on your certificate.
                  </p>
                </div>
                <button onClick={handleReset} className="text-sm font-semibold underline" style={{ color: C.blue }}>Try again</button>
              </div>
            )}

            {state === "found" && result && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3 px-5 py-4 rounded-xl border" style={{ background: "rgba(0,180,80,0.06)", borderColor: "rgba(0,180,80,0.25)" }}>
                  <BadgeCheck size={26} style={{ color: "#00b450", flexShrink: 0 }} />
                  <div>
                    <div className="font-bold text-sm" style={{ color: "#007a35", fontFamily: "Outfit, sans-serif" }}>Certificate Verified Successfully</div>
                    <div className="text-xs" style={{ color: "#4a9060", fontFamily: "Inter, sans-serif" }}>This certificate is authentic and issued by Jobify.</div>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(0,112,243,0.15)", boxShadow: "0 4px 24px rgba(10,37,64,0.08)" }}>
                  <div className="px-6 py-5 flex items-center justify-between" style={{ background: G.navy }}>
                    <img src={logoImg} alt="Jobify" className="h-10 w-auto object-contain" style={{ mixBlendMode: "screen" }} />
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: G.orange, color: C.navy, fontFamily: "Outfit, sans-serif" }}>
                      VERIFIED ✓
                    </span>
                  </div>

                  <div className="px-6 py-5 grid sm:grid-cols-2 gap-y-4 gap-x-6" style={{ background: C.white }}>
                    {[
                      ["Certificate Holder", result.name],
                      ["Certificate ID", result.id],
                      ["Domain / Track", result.domain],
                      ["Duration", result.duration],
                      ["Institution", result.college],
                      ["Date of Issue", result.issued],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>{label}</div>
                        <div className="text-sm font-bold" style={{ color: C.navy, fontFamily: "Outfit, sans-serif" }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="h-1" style={{ background: G.orange }} />
                </div>

                <button onClick={handleReset} className="text-sm font-semibold underline text-center" style={{ color: C.blue, fontFamily: "Inter, sans-serif" }}>
                  Verify another certificate
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>
          Demo IDs you can try: <span style={{ color: C.blue, fontWeight: 600 }}>JBF-2025-001</span> · <span style={{ color: C.blue, fontWeight: 600 }}>JBF-2025-042</span> · <span style={{ color: C.blue, fontWeight: 600 }}>JBF-2025-078</span>
        </p>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6" style={{ background: C.white }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>Student Stories</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>What Our Interns Say</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl p-6 flex flex-col gap-4 border transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ background: C.surface, borderColor: C.border }}
            >
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={13} style={{ color: C.gold, fill: C.gold }} />)}
              </div>
              <p className="text-sm leading-relaxed italic" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t" style={{ borderColor: C.border }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: G.blue, fontFamily: "Outfit, sans-serif" }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>{t.name}</div>
                  <div className="text-xs" style={{ color: C.muted, fontFamily: "Inter, sans-serif" }}>{t.domain} · {t.college}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 scroll-mt-[70px]" style={{ background: C.surface }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>Got Questions?</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>Frequently Asked Questions</h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden transition-colors" style={{ borderColor: open === i ? C.blue : C.border, background: C.white }}>
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                style={{ background: open === i ? C.blueLight : C.white }}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-sm sm:text-base" style={{ fontFamily: "Outfit, sans-serif", color: C.navy }}>{faq.q}</span>
                {open === i
                  ? <ChevronUp size={17} style={{ color: C.blue }} className="shrink-0" />
                  : <ChevronDown size={17} style={{ color: C.muted }} className="shrink-0" />}
              </button>
              {open === i && (
                <div className="px-6 pb-5 pt-3 text-sm leading-relaxed border-t" style={{ color: C.muted, fontFamily: "Inter, sans-serif", borderColor: "rgba(0,112,243,0.1)" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ApplyCTA({ onApplyClick }) {
  return (
    <section id="apply" className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{ background: G.navy }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: G.goldLine }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-1/2 left-1/4 w-80 h-80 -translate-y-1/2 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: C.blue }} />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 -translate-y-1/2 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: C.orange }} />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="flex justify-center mb-8">
          <img
            src={logoImg}
            alt="Jobify"
            className="h-24 w-auto object-contain"
          />
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
          Ready to{" "}
          <span style={{ background: G.orange, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Unlock Your Potential?
          </span>
        </h2>
        <p className="mb-10 text-base sm:text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "Inter, sans-serif" }}>
          Fill the registration form, complete your payment, and we will email your LMS credentials within 24 hours. Seats are limited per batch.
        </p>

        <div className="flex justify-center">
          <button
            onClick={onApplyClick}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
            style={{
              background: G.orange,
              color: C.navy,
              boxShadow: "0 4px 18px rgba(255,153,0,0.3), inset 0 1px 0 rgba(255,255,255,0.35)",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            Apply Now & Register <ExternalLink size={18} />
          </button>
        </div>

        <p className="text-xs mt-5" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "Inter, sans-serif" }}>
          Secure payment inside the form · Credentials via email · No hidden charges
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.navyDark }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <img
              src={logoImg}
              alt="Jobify"
              className="h-14 w-auto object-contain mb-4"
            />
            <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "Inter, sans-serif" }}>
              Empowering students with real internship experience, structured learning, and verified certificates — at affordable prices.
            </p>
            <div className="flex flex-col gap-2 text-sm" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif" }}>
              <div className="flex items-center gap-2"><Mail size={13} style={{ color: C.orange }} /> support@jobify.in</div>
              <div className="flex items-center gap-2"><Phone size={13} style={{ color: C.orange }} /> +91 98765 43210</div>
              <div className="flex items-center gap-2"><MapPin size={13} style={{ color: C.orange }} /> Ahmedabad, Gujarat, India</div>
            </div>
          </div>
          <div>
            <div className="font-bold mb-4 text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Outfit, sans-serif" }}>Programs</div>
            <ul className="flex flex-col gap-2">
              {["Python", "C++", "Java", "DSA", "Web Development", "AI / ML"].map((p) => (
                <li key={p}><a href="#programs" className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif" }}>{p}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-bold mb-4 text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Outfit, sans-serif" }}>Company</div>
            <ul className="flex flex-col gap-2">
              {["About Us", "How It Works", "Pricing", "LMS Portal", "Verify Certificate", "Privacy Policy"].map((l) => (
                <li key={l}><a href="#" className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif" }}>{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="h-px mb-6" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Inter, sans-serif" }}>© 2025 Jobify. All rights reserved.</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Inter, sans-serif" }}>Unlock Your Potential — Start Today.</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSelectDuration = (duration) => {
    const url = FORM_URLS[duration];
    if (url) {
      window.open(url, "_blank");
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onApplyClick={openModal} />
      <Hero onApplyClick={openModal} />
      <TrustBar />
      <Domains />
      <HowItWorks />
      <Pricing onApplyClick={openModal} />
      <LMSSection />
      <CertVerify />
      <Testimonials />
      <FAQ />
      <ApplyCTA onApplyClick={openModal} />
      <Footer />

      {/* Premium Duration Selection Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-[#0A2540] border border-slate-800 text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                Select Internship Duration
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
                Choose your preferred internship program duration to open the respective registration form.
              </p>
            </div>

            {/* Selection Options */}
            <div className="flex flex-col gap-4">
              {[
                {
                  label: "1 Month (30 Days)",
                  price: "₹129",
                  tag: "Starter Plan",
                  color: C.blue,
                  desc: "Ideal for basic domain exposure & initial project execution.",
                  durationKey: "1 Month",
                },
                {
                  label: "45 Days (1.5 Months)",
                  price: "₹149",
                  tag: "Recommended",
                  color: C.orange,
                  desc: "Includes extra live doubt sessions & LinkedIn recommendations.",
                  durationKey: "45 Days",
                  popular: true,
                },
                {
                  label: "2 Months (60 Days)",
                  price: "₹179",
                  tag: "Pro Track",
                  color: "#FFB800",
                  desc: "Comprehensive capstone project, job referrals & gold certificate.",
                  durationKey: "2 Months",
                }
              ].map((opt) => (
                <button
                  key={opt.durationKey}
                  onClick={() => handleSelectDuration(opt.durationKey)}
                  className="w-full text-left rounded-2xl p-4 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-between gap-4"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: opt.popular ? "rgba(255,153,0,0.4)" : "rgba(255,255,255,0.1)",
                    boxShadow: opt.popular ? "0 0 0 1px rgba(255,153,0,0.3)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = opt.color;
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = opt.popular ? "rgba(255,153,0,0.4)" : "rgba(255,255,255,0.1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-base" style={{ fontFamily: "Outfit, sans-serif" }}>
                        {opt.label}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{
                          background: opt.popular ? G.orange : "rgba(255,255,255,0.1)",
                          color: opt.popular ? C.navy : C.white,
                        }}
                      >
                        {opt.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">
                      {opt.desc}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-black" style={{ color: opt.color, fontFamily: "Outfit, sans-serif" }}>
                      {opt.price}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                      Select <ArrowRight size={10} />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Modal Footer Info */}
            <p className="text-[10px] text-center text-slate-500 mt-6 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              Secure payment is integrated inside each form. Once payment is processed, credentials will be sent to your registered email.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
