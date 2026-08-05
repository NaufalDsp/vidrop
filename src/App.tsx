import { ContentSections, Footer } from "./components/ContentSections";
import { Downloader } from "./components/Downloader";
import { Navbar } from "./components/Navbar";

export default function App() {
  return (
    <div id="top" className="app-shell">
      <Navbar />
      <main>
        <div className="container hero-wrap">
          <Downloader />
        </div>
        <div className="container">
          <ContentSections />
        </div>
        <Footer />
      </main>
    </div>
  );
}
