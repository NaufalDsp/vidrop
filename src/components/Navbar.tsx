import { Code2 } from "lucide-react";
import { Brand } from "./Brand";

export function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Brand />
        <nav aria-label="Primary navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <a className="github-link" href="https://github.com/NaufalDsp/vidrop" target="_blank" rel="noreferrer">
            <Code2 size={17} /> <span>GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
