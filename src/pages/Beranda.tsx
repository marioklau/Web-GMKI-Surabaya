import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Users, BookOpen, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrgInfo {
  section: string;
  content: string;
}

interface NewsHighlight {
  id_highlight: string;
  title: string;
  content: string;
  image_url: string;
  published_at: string;
}

export default function Beranda() {
  const [orgInfo, setOrgInfo] = useState<OrgInfo[]>([]);
  const [news, setNews] = useState<NewsHighlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [orgInfoData, newsData] = await Promise.all([
        supabase.from('organization_info').select('*'),
        supabase
          .from('news_highlights')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(3),
      ]);

      if (orgInfoData.data) setOrgInfo(orgInfoData.data);
      if (newsData.data) {
        console.log('Data berita:', newsData.data);
        setNews(newsData.data);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  const getContent = (section: string) => {
    const info = orgInfo.find((item) => item.section === section);
    return info?.content || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-100"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-blue-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-[#0a192f] py-24 lg:py-32">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-800 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium tracking-wide uppercase">
            Ut Omnes Unum Sint
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">GMKI Surabaya</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Mengabdi untuk Gereja, Perguruan Tinggi, dan Masyarakat. Bersama membangun generasi mahasiswa yang beriman, berintegritas, dan berdampak.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/profil-pengurus"
              className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transform hover:-translate-y-1 transition-all shadow-lg shadow-blue-900/20"
            >
              <span>Kenali Kami Lebih Dekat</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- QUICK LINKS / FEATURES --- */}
      <section className="relative -mt-16 pb-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { to: "/profil-pengurus", icon: Users, title: "Profil Pengurus", desc: "Kenali struktur kepengurusan yang melayani GMKI Surabaya." },
              { to: "/agenda-kegiatan", icon: Calendar, title: "Agenda Kegiatan", desc: "Jadwal program kerja dan aksi nyata yang akan datang." },
              { to: "/karya-kader", icon: BookOpen, title: "Karya Kader", desc: "Kumpulan pemikiran, artikel, dan karya kreatif para kader." }
            ].map((card, i) => (
              <Link
                key={i}
                to={card.to}
                className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <card.icon size={28} className="text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-4">{card.desc}</p>
                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Selengkapnya <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION (Hanya Sejarah/About, Tanpa Visi Misi) --- */}
      {orgInfo.length > 0 && (
        <section className="py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-50 rounded-full z-0"></div>
                <h2 className="relative z-10 text-3xl md:text-4xl font-bold mb-8 text-gray-900 leading-tight">
                  Mengenal Lebih Dekat <br />
                  <span className="text-blue-600">GMKI Surabaya</span>
                </h2>
                <div className="prose prose-blue text-gray-600 leading-relaxed italic">
                  <p className="whitespace-pre-line text-lg">
                    "{getContent('history') || getContent('about')}"
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50/30 to-white p-8 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-700">Perjalanan Kami</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  GMKI Surabaya hadir sebagai wadah pengembangan kader mahasiswa Kristen 
                  yang berkomitmen untuk menghadirkan transformasi sosial di kota Surabaya 
                  dan sekitarnya.
                </p>
                <Link
                  to="/profil-organisasi"
                  className="inline-flex items-center gap-2 mt-6 text-blue-600 font-semibold hover:gap-3 transition-all"
                >
                  Pelajari Lebih Lanjut <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- NEWS SECTION --- */}
      {news.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Berita Terbaru</h2>
                <p className="text-gray-500 text-lg">Ikuti perkembangan terbaru aktivitas kami</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map((item) => (
                <div
                  key={item.id_highlight}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-56 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        Tidak Ada Gambar
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        Berita
                      </span>
                    </div>
                  </div>
                  <div className="p-7">
                    <p className="text-xs font-medium text-gray-400 mb-3">
                      {new Date(item.published_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                    <Link
                      to={`/berita/${item.id_highlight}`}  
                      className="text-sm font-bold text-gray-900 flex items-center gap-2 group-hover:gap-3 transition-all"
                    >
                      Baca Selengkapnya <ArrowRight size={16} className="text-blue-600" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- CALL TO ACTION --- */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-blue-600 rounded-[2.5rem] p-10 md:p-16 overflow-hidden text-center">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500 rounded-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-700 rounded-full opacity-50"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Siap Menjadi Bagian dari Perubahan?
              </h2>
              <p className="text-blue-100 text-lg mb-10 opacity-90">
                Mari berproses bersama di GMKI Surabaya. Temukan komisariat di kampusmu dan mulailah berdampak hari ini.
              </p>
              <Link
                to="/komisariat"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-10 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl"
              >
                <span>Cari Komisariat Kami</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}