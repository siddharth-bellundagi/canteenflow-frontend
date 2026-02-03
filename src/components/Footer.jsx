import React from "react";

function Footer() {
  return (
    <footer className="mt-10 bg-slate-900 text-slate-300 text-sm">
      <div className="max-w-6xl mx-auto px-6 py-6 text-center space-y-2">
        
        <p>
          © {new Date().getFullYear()} All rights reserved to{" "}
          <span className="font-semibold text-white">
            Siddharth Bellundagi – DYPCOEI-26
          </span>
        </p>

        <p className="text-slate-400">Connect with me</p>

        <div className="flex justify-center space-x-6">
          <a
            href="https://www.linkedin.com/in/siddharth-bellundagi/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            LinkedIn
          </a>

          <a
            href="https://github.com/siddharth-bellundagi"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
