import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, Calendar, Tag } from 'lucide-react';

interface Article {
  id_article: string;
  title: string;
  author: string;
  category: string;
  content: string;
  cover_image_url: string;
  published_at: string;
}

export default function DetailKaryaKader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id_article', id)
        .eq('is_published', true)
        .single();

      if (error || !data) {
        navigate('/karya-kader');
        return;
      }

      setArticle(data);
      setLoading(false);
    }

    fetchArticle();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {article.cover_image_url && (
        <img
          src={article.cover_image_url}
          alt={article.title}
          className="w-full h-96 object-cover"
        />
      )}

      <div className="max-w-4xl mx-auto bg-white -mt-24 relative z-10 rounded-lg shadow p-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 mb-6"
        >
          ← Kembali
        </button>

        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-8">
          <span className="flex items-center gap-1">
            <User size={16} /> {article.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            {new Date(article.published_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1 capitalize">
            <Tag size={16} /> {article.category.replace('-', ' ')}
          </span>
        </div>

        <article className="prose max-w-none whitespace-pre-line">
          {article.content}
        </article>
      </div>
    </div>
  );
}
