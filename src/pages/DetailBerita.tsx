import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

interface BeritaDetail {
  id_highlight: string;
  title: string;
  content: string;
  image_url: string;
  published_at: string;
  author?: string;
}

export default function DetailBerita() {
  const { id } = useParams<{ id: string }>();

  const [berita, setBerita] = useState<BeritaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =========================
   * Fetch Detail Berita
   * ========================= */
  useEffect(() => {
    if (!id) return;

    const fetchBerita = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('news_highlights')
          .select('*')
          .eq('id_highlight', id)
          .single();

        if (error) throw error;
        setBerita(data);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat berita');
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [id]);

  /* =========================
   * Share Handler
   * ========================= */
  const handleShare = async () => {
    if (!berita) return;

    const shareData = {
      title: berita.title,
      text: berita.content.slice(0, 100) + '...',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link berhasil disalin!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  /* =========================
   * Loading State
   * ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-100" />
          <div className="absolute inset-0 h-16 w-16 rounded-full border-t-4 border-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  /* =========================
   * Error / Empty State
   * ========================= */
  if (error || !berita) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4 text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Berita Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-8">
            Maaf, berita yang Anda cari tidak ada atau telah dihapus.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  /* =========================
   * Main Content
   * ========================= */
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] bg-gray-900">
        {berita.image_url ? (
          <img
            src={berita.image_url}
            alt={berita.title}
            className="h-full w-full object-cover opacity-60"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-blue-900 to-blue-700" />
        )}
        <div className="absolute inset-0 bg-black/40" />

        {/* Title */}
        <div className="absolute bottom-0 inset-x-0 p-8 md:p-16 bg-gradient-to-t from-black via-black/60 to-transparent">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block mb-4 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              BERITA
            </span>

            <h1 className="mb-4 text-3xl md:text-5xl font-bold text-white leading-tight">
              {berita.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-200">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>
                  {new Date(berita.published_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {berita.author && (
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>{berita.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <article className="prose prose-lg prose-blue max-w-none">
          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
            {berita.content}
          </div>
        </article>

        {/* Share */}
        <div className="mt-12 border-t pt-8 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Bagikan Berita
          </h3>
          <button
            onClick={handleShare}
            className="rounded-xl bg-gray-100 p-3 hover:bg-gray-200 transition"
            aria-label="Bagikan"
          >
            <Share2 size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:gap-3 transition-all"
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
