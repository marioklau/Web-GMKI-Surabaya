import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FileText, Users, Building2, Calendar, 
  BookOpen, Newspaper, Info, LogOut, ArrowRight,
  LucideIcon
} from 'lucide-react';

// --- 1. Definisi Tipe Data ---
type ColorKey = 'blue' | 'purple' | 'emerald' | 'orange' | 'red' | 'indigo' | 'pink';

interface MenuItem {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: ColorKey;
}

// --- 2. Konfigurasi Warna (Mapping) ---
const colorMap: Record<ColorKey, { bg: string; icon: string; hover: string; accent: string }> = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    hover: 'group-hover:bg-blue-600',
    accent: 'from-blue-500 to-blue-600'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    hover: 'group-hover:bg-purple-600',
    accent: 'from-purple-500 to-purple-600'
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    hover: 'group-hover:bg-emerald-600',
    accent: 'from-emerald-500 to-emerald-600'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    hover: 'group-hover:bg-orange-600',
    accent: 'from-orange-500 to-orange-600'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    hover: 'group-hover:bg-red-600',
    accent: 'from-red-500 to-red-600'
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'text-indigo-600',
    hover: 'group-hover:bg-indigo-600',
    accent: 'from-indigo-500 to-indigo-600'
  },
  pink: {
    bg: 'bg-pink-50',
    icon: 'text-pink-600',
    hover: 'group-hover:bg-pink-600',
    accent: 'from-pink-500 to-pink-600'
  },
};

export default function AdminDashboard() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // --- 3. Data Menu dengan Tipe Data ---
  const menuItems: MenuItem[] = [
    {
      title: 'Informasi Organisasi',
      description: 'Kelola Sejarah, Visi, dan Misi GMKI',
      icon: Info,
      path: '/admin/organization-info',
      color: 'blue',
    },
    {
      title: 'Pengurus',
      description: 'Kelola Struktur Kepengurusan',
      icon: Users,
      path: '/admin/board-members',
      color: 'purple',
    },
    {
      title: 'Dokumen',
      description: 'Kelola Dokumen Administrasi',
      icon: FileText,
      path: '/admin/documents',
      color: 'emerald',
    },
    {
      title: 'Komisariat',
      description: 'Kelola Data Komisariat',
      icon: Building2,
      path: '/admin/commissariats',
      color: 'orange',
    },
    {
      title: 'Agenda Kegiatan',
      description: 'Kelola Kegiatan dan Event',
      icon: Calendar,
      path: '/admin/events',
      color: 'red',
    },
    {
      title: 'Karya Kader',
      description: 'Kelola Artikel dan Tulisan',
      icon: BookOpen,
      path: '/admin/articles',
      color: 'indigo',
    },
    {
      title: 'Berita Highlight',
      description: 'Kelola Berita di Homepage',
      icon: Newspaper,
      path: '/admin/news-highlights',
      color: 'pink',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Navbar - More Modern */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/public/images/gmki_surabaya.png" 
                  alt="Logo GMKI" 
                  className="w-full h-full object-cover"
                />
              </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <span className="font-bold text-gray-900 text-xl tracking-tight">
                  Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-indigo-900">GMKI</span>
                </span>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="group flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Enhanced */}
        <div className="relative mb-10 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-900  to-blue-900 overflow-hidden shadow-2xl">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10">
            <div className="mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                Selamat Datang Kembali Bung! 
              </h1>
              <p className="text-blue-50 text-base sm:text-lg max-w-2xl">
                Halo, <span className="font-bold text-white">{user?.email?.split('@')[0] || 'Admin'}</span>. 
                Kelola seluruh sistem GMKI dengan mudah dari satu tempat.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="text-white text-sm font-medium">System Active</span>
              </div>
              
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-sm font-medium">
                  {new Date().toLocaleDateString('id-ID', { 
                    day: 'numeric',
                    month: 'short', 
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-white text-sm font-medium">Secure</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Menu Grid - Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const colors = colorMap[item.color];
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group relative bg-white p-6 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-2xl hover:border-transparent hover:-translate-y-2 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${colors.accent} p-[2px]`}>
                  <div className="w-full h-full bg-white rounded-2xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    {/* Icon dengan efek hover yang lebih smooth */}
                    <div className={`relative p-3.5 rounded-xl transition-all duration-300 ${colors.bg} ${colors.icon} ${colors.hover} group-hover:text-white group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                      <Icon size={26} strokeWidth={2} />
                      {/* Glow effect */}
                      <div className={`absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-gradient-to-br ${colors.accent}`}></div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                        Akses
                      </span>
                      <ArrowRight 
                        size={20} 
                        className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Progress bar animasi */}
                  <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${colors.accent}`}></div>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${colors.accent} opacity-10 rounded-full`}></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 GMKI Admin Dashboard.
          </p>
        </div>
      </main>
    </div>
  );
}
