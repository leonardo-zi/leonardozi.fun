import Hero from "./components/Hero";
import Projects from "./components/Projects";
import About from "./components/About";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 bg-[#fafafa]/80 backdrop-blur-sm border-b border-stone-200/60">
        <nav className="px-6 sm:px-10 md:px-16 lg:px-24 py-4 flex justify-between items-center font-serif text-sm">
          <a href="#root" className="text-stone-600 hover:text-stone-900 transition-colors">
            *
          </a>
          <div className="flex gap-8">
            <a href="#work" className="text-stone-500 hover:text-stone-800 transition-colors">
              Work
            </a>
            <a href="#about" className="text-stone-500 hover:text-stone-800 transition-colors">
              About
            </a>
            <a href="#contact" className="text-stone-500 hover:text-stone-800 transition-colors">
              Contact
            </a>
          </div>
        </nav>
      </header>
      <main>
        <Hero />
        <Projects />
        <About />
        <Footer />
      </main>
    </>
  );
}
