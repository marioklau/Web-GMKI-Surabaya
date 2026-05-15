import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  interface NavItem {
    path: string;
    label: string;
  }

  const navItems: NavItem[] = [
    { path: '/', label: 'Beranda' },
    {path: '/profil-organisasi', label: 'Profil Organisasi'},
    { path: '/profil-pengurus', label: 'Profil Pengurus' },
    { path: '/administrasi', label: 'Administrasi' },
    { path: '/komisariat', label: 'Komisariat' },
    { path: '/agenda-kegiatan', label: 'Agenda Kegiatan' },
    { path: '/karya-kader', label: 'Karya Kader' },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-white shadow-md py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo dengan efek hover */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="relative">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/public/images/gmki_surabaya.png" 
                  alt="Logo GMKI" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-0.5 bg-blue-400 rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-xl leading-tight group-hover:text-blue-600 transition-colors">
                GMKI
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wider">
                Surabaya
              </span>
            </div>
          </Link>

          {/* Desktop Navigation dengan efek hover yang lebih baik */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button dengan animasi */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Navigation dengan animasi slide */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 py-2">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                style={{
                  animation: isMenuOpen ? `slideIn 0.3s ease-out ${index * 0.05}s both` : 'none'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tambahkan keyframes untuk animasi menggunakan style tag biasa */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
}