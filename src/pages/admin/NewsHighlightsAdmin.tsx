import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Trash2, Edit2, Plus, Save, X, ArrowLeft, Loader2, Upload } from 'lucide-react';

interface NewsHighlight {
  id_highlight: string;
  title: string;
  content: string;
  image_url: string;
  is_featured: boolean;
  published_at?: string;
}

export default function NewsHighlightsAdmin() {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    is_featured: false,
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error: err } = await supabase
        .from('news_highlights')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (err) throw err;
      setNews(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError('');

      // Validasi file
      if (!file.type.startsWith('image/')) {
        throw new Error('File harus berupa gambar');
      }

      // Validasi ukuran (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Ukuran gambar maksimal 5MB');
      }

      // Buat nama file unik
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `news/${fileName}`;

      // Upload ke Supabase Storage (bucket 'berita')
      const { error: uploadError } = await supabase.storage
        .from('berita')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Dapatkan URL publik
      const { data: { publicUrl } } = supabase.storage
        .from('berita')
        .getPublicUrl(filePath);

      // Update form data dengan URL gambar
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      setError('Judul dan konten harus diisi');
      return;
    }

    try {
      setLoading(true);
      
      if (editing && editing !== 'new') {
        // Update existing news
        const { error: updateError } = await supabase
          .from('news_highlights')
          .update(formData)
          .eq('id_highlight', editing);
        
        if (updateError) throw updateError;
      } else {
        // Insert new news
        const { error: insertError } = await supabase
          .from('news_highlights')
          .insert([{
            ...formData,
            published_at: new Date().toISOString()
          }]);
        
        if (insertError) throw insertError;
      }
      
      handleCancel();
      fetchNews();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus berita ini?')) return;
    
    try {
      setLoading(true);
      
      // Cari data berita untuk mendapatkan image_url
      const newsItem = news.find(item => item.id_highlight === id);
      
      // Hapus dari database
      const { error: deleteError } = await supabase
        .from('news_highlights')
        .delete()
        .eq('id_highlight', id);
      
      if (deleteError) throw deleteError;
      
      // Hapus gambar dari storage jika ada
      if (newsItem?.image_url) {
        const path = newsItem.image_url.split('/').pop();
        if (path) {
          await supabase.storage
            .from('berita')
            .remove([`news/${path}`]);
        }
      }
      
      fetchNews();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: NewsHighlight) => {
    setEditing(item.id_highlight);
    setFormData({
      title: item.title,
      content: item.content,
      image_url: item.image_url || '',
      is_featured: item.is_featured || false,
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({
      title: '',
      content: '',
      image_url: '',
      is_featured: false,
    });
    setError('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Berita Highlight</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="p-1 hover:bg-red-100 rounded">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Add Button */}
        {!editing && (
          <button
            onClick={() => setEditing('new')}
            className="mb-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            Tambah Berita
          </button>
        )}

        {/* Form */}
        {editing && (
          <div className="mb-6 bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">
                {editing === 'new' ? 'Tambah Berita' : 'Edit Berita'}
              </h2>
              <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  placeholder="Masukkan judul berita"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload Gambar</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                  >
                    <Upload size={16} />
                    Pilih Gambar
                  </label>
                  {uploading && <Loader2 className="animate-spin text-blue-600" size={16} />}
                </div>
                
                {formData.image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                      {formData.image_url}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Konten</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  placeholder="Masukkan konten berita"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-gray-300"
                  id="featured"
                />
                <label htmlFor="featured" className="text-sm">Berita Unggulan</label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* News List */}
        <div className="space-y-2">
          {news.length === 0 ? (
            <div className="text-center py-10 bg-white border rounded-lg text-gray-500">
              Belum ada berita
            </div>
          ) : (
            news.map((item) => (
              <div key={item.id_highlight} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {item.is_featured && (
                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">
                          Unggulan
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.content}
                    </p>
                    
                    {item.image_url && (
                      <div className="flex items-center gap-2">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <a
                          href={item.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Lihat Gambar
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id_highlight)}
                      className="p-2 hover:bg-gray-100 rounded text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}