import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white flex flex-col font-sans overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-15 z-0 pointer-events-none mix-blend-multiply"
      >
        <source src="/vid/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Navigation Bar */}
      <nav className="relative z-10 w-full flex items-center justify-between px-8 py-5 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex items-center">
          <Image src="/logo.png" alt="FORESIGHT Logo" width={180} height={60} className="object-contain" />
        </div>
        <div className="flex items-center">
          <Link href="/live-map" className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold uppercase tracking-wider rounded-md shadow transition-colors">
            Live Map
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
          Global Food Security. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">Powered by Intelligence.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl font-medium mb-12 leading-relaxed">
          FORESIGHT is an enterprise-grade operating system designed to build structural resilience against El Niño disruptions through predictive AI and autonomous supply chain routing.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/live-map" className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-md shadow-lg transition-transform hover:-translate-y-1 text-lg">
            Access Command Center
          </Link>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-slate-200 bg-white/80 backdrop-blur-md text-center">
        <p className="text-sm text-slate-500 font-semibold tracking-wide">&copy; {new Date().getFullYear()} FORESIGHT. All rights reserved.</p>
      </footer>
    </div>
  );
}
