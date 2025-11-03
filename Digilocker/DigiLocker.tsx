import React, { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";

interface DigiLockerWidgetProps {
  userType: "student" | "teacher";
}

const DigiLockerWidget: React.FC<DigiLockerWidgetProps> = ({ userType }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Fade-in animation on load
    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el, i) => {
      (el as HTMLElement).style.animationDelay = `${i * 0.15}s`;
    });

    // Add fade-in class to elements
    const header = headerRef.current;
    if (header) {
      const children = header.querySelectorAll("h1, p, a, h3");
      children.forEach((el, i) => {
        (el as HTMLElement).classList.add("fade-in");
        (el as HTMLElement).style.animationDelay = `${i * 0.15}s`;
      });
    }
  }, []);

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      button.style.background = `radial-gradient(circle at ${x}px ${y}px, #3b82f6, #8b5cf6)`;
    }
  };

  const handleButtonMouseLeave = () => {
    const button = buttonRef.current;
    if (button) {
      button.style.background = `linear-gradient(135deg, #3b82f6, #8b5cf6)`;
    }
  };

  const handleHeaderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const header = headerRef.current;
    if (header) {
      const x = (window.innerWidth / 2 - e.pageX) / 60;
      const y = (window.innerHeight / 2 - e.pageY) / 60;
      header.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    }
  };

  const handleHeaderMouseLeave = () => {
    const header = headerRef.current;
    if (header) {
      header.style.transform = "rotateY(0deg) rotateX(0deg)";
    }
  };

  return (
    <div className="p-4 shadow-md rounded-xl bg-slate-800 text-slate-100 font-inter">
      <header
        ref={headerRef}
        className="text-center"
        onMouseMove={handleHeaderMouseMove}
        onMouseLeave={handleHeaderMouseLeave}
      >
        <div className="flex justify-center mb-4">
          <img
            src="Digilocker.png"
            alt="DigiLocker Logo"
            className="w-20 h-auto drop-shadow-lg"
            style={{ filter: "drop-shadow(0 0 8px #3b82f6)" }}
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-3">
          {userType === "student" ? "My DigiLocker" : "Teacher DigiLocker"}
        </h1>
        <hr className="border-slate-600 my-5" />
        <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-4">
          Students can click the button below to open DigiLocker in a new tab
          and download their documents. DigiLocker is a government service —
          students should sign in with their DigiLocker account.
        </p>
        <a
          ref={buttonRef}
          href="https://www.digilocker.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          onMouseMove={handleButtonMouseMove}
          onMouseLeave={handleButtonMouseLeave}
        >
          Open DigiLocker
          <ExternalLink className="ml-2 w-4 h-4" />
        </a>

        <h3 className="mt-8 text-xl font-semibold text-green-400 mb-4">
          How it works:
        </h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          1. Click Open DigiLocker — the site opens in a new tab <br />
          2. Sign in (Aadhaar / mobile / DigiLocker account credentials) on
          DigiLocker. <br />
          3. Browse Issued Documents or Uploaded Documents and use DigiLocker's
          download button to save files.
        </p>
      </header>
      <footer className="mt-10 text-slate-500 text-sm text-center">
        {/* Footer content if needed */}
      </footer>
      <style>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1s forwards;
        }
      `}</style>
    </div>
  );
};

export default DigiLockerWidget;
