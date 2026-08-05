import { useState } from "react";
import {
  ChevronDown,
  Download,
  Code2,
  Layers3,
  Link2,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  UserRoundX,
} from "lucide-react";

const steps = [
  { icon: Link2, number: "01", title: "Paste the link", copy: "Copy a public TikTok or Instagram link and drop it into Vidrop." },
  { icon: SlidersHorizontal, number: "02", title: "Choose media", copy: "Pick an available video quality, photo, or carousel item." },
  { icon: Download, number: "03", title: "Download", copy: "Save video, audio, photos, or a complete carousel to your device." },
];

const features = [
  { icon: ShieldCheck, title: "Clean sources", copy: "We prioritize original media sources without added branding." },
  { icon: Layers3, title: "Real quality choices", copy: "Only resolutions returned by the source are shown." },
  { icon: Smartphone, title: "Made for every screen", copy: "A comfortable experience from 320px to desktop." },
  { icon: UserRoundX, title: "No account needed", copy: "No sign-up, no history, and no unnecessary steps." },
];

const faqs = [
  ["Which platforms does Vidrop support?", "Vidrop supports public TikTok posts and public Instagram posts, Reels, photos, and carousels."],
  ["Can I download without a watermark?", "Vidrop prioritizes clean or original sources whenever one is available."],
  ["Can I download audio separately?", "Yes, when the platform returns a separate audio source. Select Audio MP3 in the result panel."],
  ["Why isn't a certain resolution available?", "Vidrop only displays qualities returned by the source, so it never promises a resolution that does not exist."],
  ["Do I need to create an account?", "No. Vidrop is designed to work without registration or login."],
  ["Are my download links stored?", "No. Vidrop does not permanently store the links you submit."],
];

export function ContentSections() {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <>
      <section id="how-it-works" className="content-section steps-section">
        <div className="section-heading"><span>Three simple steps</span><h2>From link to download<br />in a few clicks.</h2></div>
        <div className="steps-grid">
          {steps.map(({ icon: Icon, number, title, copy }, index) => (
            <article className="step" key={number}>
              <div className="step-top"><span className="step-icon"><Icon size={19} /></span><span className="step-number">{number}</span></div>
              <h3>{title}</h3><p>{copy}</p>{index < steps.length - 1 && <span className="connector" aria-hidden="true" />}
            </article>
          ))}
        </div>
      </section>

      <section id="features" className="content-section features-section">
        <div className="section-heading centered"><span>Built around the essentials</span><h2>Everything you need.<br />Nothing you don't.</h2></div>
        <div className="features-grid">
          {features.map(({ icon: Icon, title, copy }) => <article className="feature" key={title}><span><Icon size={21} /></span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section id="faq" className="content-section faq-section">
        <div className="faq-heading"><span>Good to know</span><h2>Frequently asked<br />questions.</h2><p>Quick answers about downloading with Vidrop.</p></div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => {
            const isOpen = openFaq === index;
            return <article className={`faq-item ${isOpen ? "open" : ""}`} key={question}>
              <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen}><span>{question}</span><ChevronDown size={19} /></button>
              <div className="faq-answer" inert={!isOpen ? true : undefined}><p>{answer}</p></div>
            </article>;
          })}
        </div>
      </section>

    </>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="container footer-top">
        <div className="footer-intro">
          <a className="footer-wordmark" href="#top">Vidrop</a>
          <p>Save the media worth keeping.</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#faq">FAQ</a>
          <a href="https://github.com/NaufalDsp/vidrop" target="_blank" rel="noreferrer"><Code2 size={15} /> GitHub</a>
        </nav>
      </div>
      <div className="container footer-bottom">
        <p>Only download content you own or have permission to use.</p>
        <p>naufaldsp · © 2026 Vidrop</p>
      </div>
    </footer>
  );
}
