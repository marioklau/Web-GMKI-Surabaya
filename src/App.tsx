import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import Beranda from './pages/Beranda';
import ProfilOrganisasi from './pages/ProfilOrganisasi';
import ProfilPengurus from './pages/ProfilPengurus';
import Administrasi from './pages/Administrasi';
import Komisariat from './pages/Komisariat';
import AgendaKegiatan from './pages/AgendaKegiatan';

import KaryaKader from './pages/KaryaKader';
import DetailKaryaKader from './pages/DetailKaryaKader';

import DetailBerita from './pages/DetailBerita';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import OrganizationInfoAdmin from './pages/admin/OrganizationInfoAdmin';
import BoardMembersAdmin from './pages/admin/BoardMembersAdmin';
import DocumentsAdmin from './pages/admin/DocumentsAdmin';
import CommissariatsAdmin from './pages/admin/CommissariatsAdmin';
import EventsAdmin from './pages/admin/EventsAdmin';
import ArticlesAdmin from './pages/admin/ArticlesAdmin';
import NewsHighlightsAdmin from './pages/admin/NewsHighlightsAdmin';

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/profil-organisasi" element={<ProfilOrganisasi/>}/>
          <Route path="/profil-pengurus" element={<ProfilPengurus />} />
          <Route path="/administrasi" element={<Administrasi />} />
          <Route path="/komisariat" element={<Komisariat />} />
          <Route path="/agenda-kegiatan" element={<AgendaKegiatan />} />

          {/* KARYA KADER */}
          <Route path="/karya-kader" element={<KaryaKader />} />
          <Route path="/karya-kader/:id" element={<DetailKaryaKader />} />

          <Route path="/berita/:id" element={<DetailBerita />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />

      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/organization-info"
          element={
            <ProtectedRoute>
              <OrganizationInfoAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/board-members"
          element={
            <ProtectedRoute>
              <BoardMembersAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/documents"
          element={
            <ProtectedRoute>
              <DocumentsAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/commissariats"
          element={
            <ProtectedRoute>
              <CommissariatsAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <EventsAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/articles"
          element={
            <ProtectedRoute>
              <ArticlesAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/news-highlights"
          element={
            <ProtectedRoute>
              <NewsHighlightsAdmin />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<PublicLayout />} />
      </Routes>
    </AuthProvider>
  );
}
