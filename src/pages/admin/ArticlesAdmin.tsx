import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Trash2, Edit2, Plus, X, Loader2, ArrowLeft } from 'lucide-react';

interface Article {
  id_article: string;
  title: string;
  author: string;
  category: string;
  content: string;
  excerpt: string;
  cover_image_url: string;
  is_published: boolean;
}

export default function ArticlesAdmin() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'renungan',
    content: '',
    excerpt: '',
    cover_image_url: '',
    is_published: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    { value: 'renungan', label: 'Renungan' },
    { value: 'sosial-politik', label: 'Sosial-Politik' },
    { value: 'esai', label: 'Esai' },
    { value: 'laporan', label: 'Laporan' },
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('articles')
        .select('*')
        .order('id_article', { ascending: false });
      if (err) throw err;
      setArticles(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('articles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('articles')
        .getPublicUrl(filePath);

      setFormData({ ...formData, cover_image_url: publicUrl });
      setSuccess('Gambar berhasil diupload');
    } catch (err: any) {
      setError('Gagal upload: ' + err.message);
    } finally {
      setUploading(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.author || !formData.content) {
      setError('Judul, penulis, dan konten wajib diisi');
      return;
    }

    setIsSaving(true);
    try {
      if (editing && editing !== 'new') {
        await supabase.from('articles').update(formData).eq('id_article', editing);
        setSuccess('Perubahan disimpan');
      } else {
        await supabase.from('articles').insert([formData]);
        setSuccess('Artikel diterbitkan');
      }
      
      setTimeout(() => {
        resetForm();
        fetchArticles();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return;
    try {
      await supabase.from('articles').delete().eq('id_article', id);
      setSuccess('Artikel dihapus');
      fetchArticles();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (article: Article) => {
    setEditing(article.id_article);
    setFormData({
      title: article.title,
      author: article.author,
      category: article.category,
      content: article.content,
      excerpt: article.excerpt,
      cover_image_url: article.cover_image_url,
      is_published: article.is_published,
    });
    window.scrollTo({ top: 0 });
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      title: '',
      author: '',
      category: 'renungan',
      content: '',
      excerpt: '',
      cover_image_url: '',
      is_published: true,
    });
    setError('');
    setSuccess('');
  };

  if (loading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold">Artikel</h1>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing('new')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Artikel Baru
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="p-1 hover:bg-red-100 rounded">
              <X size={16} />
            </button>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {editing ? (
          /* Form Editor */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border rounded-lg p-4">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul artikel..."
                  className="w-full text-2xl font-semibold p-2 border-b focus:outline-none"
                />
                
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Konten</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white font-serif"
                    placeholder="Tulis konten artikel..."
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-4 sticky top-24">
                <h3 className="font-semibold mb-4 pb-2 border-b">Pengaturan</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Penulis</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Kategori</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Gambar Sampul</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-400"
                    >
                      {formData.cover_image_url ? (
                        <div className="relative">
                          <img src={formData.cover_image_url} className="w-full h-32 object-cover rounded" alt="Cover" />
                          <p className="text-xs text-gray-500 mt-2">Klik untuk ganti</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-500">
                            {uploading ? 'Uploading...' : 'Klik untuk upload gambar'}
                          </p>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Ringkasan</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={3}
                      className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white text-sm"
                      placeholder="Ringkasan singkat artikel..."
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="rounded border-gray-300"
                      id="publish"
                    />
                    <label htmlFor="publish" className="text-sm">Publikasikan</label>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={resetForm}
                      className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving || uploading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSaving && <Loader2 className="animate-spin" size={16} />}
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Article List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.length === 0 ? (
              <div className="col-span-full text-center py-10 bg-white border rounded-lg text-gray-500">
                Belum ada artikel
              </div>
            ) : (
              articles.map((article) => (
                <div key={article.id_article} className="bg-white border rounded-lg overflow-hidden">
                  {/* Cover Image */}
                  <div className="h-48 bg-gray-100">
                    {article.cover_image_url ? (
                      <img src={article.cover_image_url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold line-clamp-2 flex-1">{article.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                        !article.is_published ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                      }`}>
                        {article.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-2">{article.author}</p>
                    
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                      {article.excerpt || 'Tidak ada ringkasan'}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {categories.find(c => c.value === article.category)?.label || article.category}
                      </span>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(article)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id_article)}
                          className="p-2 hover:bg-gray-100 rounded text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}