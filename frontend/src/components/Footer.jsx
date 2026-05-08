export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/deal-drop-logo.png"
            alt="DealDrop Logo"
            className="h-8 w-auto opacity-80"
          />
          <span className="font-bold text-gray-800">DealDrop</span>
        </div>
        
        <div className="text-center md:text-right">
          <p className="text-sm font-medium text-gray-900 mb-1">Get in touch</p>
          <a href="mailto:soundarsundaram2512@gmail.com" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
            soundarsundaram2512@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
