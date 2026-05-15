import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Article {
  id_article: string;
  title: string;
  author: string;
  category: string;
  content: string;
  excerpt: string;
  cover_image_url: string;
  published_at: string;
}

export default function KaryaKader() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'renungan', label: 'Renungan' },
    { value: 'sosial-politik', label: 'Sosial-Politik' },
    { value: 'esai', label: 'Esai Pemikiran' },
    { value: 'laporan', label: 'Laporan Kegiatan' },
  ];

  useEffect(() => {
    async function fetchArticles() {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (!error && data) {
        setArticles(data);
      }

      setLoading(false);
    }

    fetchArticles();
  }, []);

  const filteredArticles =
    filter === 'all'
      ? articles
      : articles.filter((article) => article.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {/* FILTER */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-blue-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* LIST */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm">
            <BookOpen className="mx-auto mb-4 text-gray-300" size={56} />
            <p className="text-gray-500">Belum ada karya tersedia</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link
                key={article.id_article}
                to={`/karya-kader/${article.id_article}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition overflow-hidden group"
              >
                {article.cover_image_url ? (
                  <img
                    src={article.cover_image_url}
                    alt={article.title}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-48 bg-blue-100 flex items-center justify-center">
                    <BookOpen size={40} className="text-blue-400" />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600">
                    {article.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {article.excerpt ||
                      article.content.substring(0, 120) + '...'}
                  </p>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(article.published_at).toLocaleDateString(
                        'id-ID'
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
