import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2, Edit2, Plus, X, ArrowLeft, Loader2 } from 'lucide-react';

interface OrgInfo {
  id_info: string;
  section: string;
  content: string;
}

export default function OrganizationInfoAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<OrgInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ section: '', content: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('organization_info')
        .select('*')
        .order('section');
      if (err) throw err;
      setItems(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.section || !formData.content.trim()) {
      setError('Semua field harus diisi');
      return;
    }

    setIsSaving(true);
    try {
      if (editing && editing !== 'new') {
        await supabase
          .from('organization_info')
          .update({ content: formData.content.trim() })
          .eq('id_info', editing);
        setSuccess('Berhasil diperbarui');
      } else {
        await supabase
          .from('organization_info')
          .insert([{ section: formData.section, content: formData.content.trim() }]);
        setSuccess('Berhasil ditambahkan');
      }
      
      setEditing(null);
      setFormData({ section: '', content: '' });
      await fetchItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus informasi ini?')) return;
    try {
      await supabase.from('organization_info').delete().eq('id_info', id);
      setSuccess('Berhasil dihapus');
      fetchItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getSectionLabel = (section: string) => {
    const labels: Record<string, string> = {
      history: 'Sejarah',
      vision: 'Visi',
      mission: 'Misi',
      about: 'Tentang'
    };
    return labels[section] || section;
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
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Informasi Organisasi</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
            <span className="text-sm">{error}</span>
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

        {/* Add Button */}
        {!editing && (
          <button
            onClick={() => setEditing('new')}
            className="mb-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            Tambah Baru
          </button>
        )}

        {/* Form */}
        {editing && (
          <div className="mb-6 bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">
                {editing === 'new' ? 'Tambah Informasi' : 'Edit Informasi'}
              </h2>
              <button 
                onClick={() => setEditing(null)} 
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bagian</label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  disabled={editing !== 'new'}
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                >
                  <option value="">Pilih Bagian...</option>
                  <option value="history">Sejarah</option>
                  <option value="vision">Visi</option>
                  <option value="mission">Misi</option>
                  <option value="about">Tentang</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Konten</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  placeholder="Tulis konten di sini..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setEditing(null)} 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="animate-spin" size={16} />}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-10 bg-white border rounded-lg text-gray-500">
              Belum ada data
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id_info} className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-600">
                    {getSectionLabel(item.section)}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => { 
                        setEditing(item.id_info); 
                        setFormData({ section: item.section, content: item.content }); 
                      }}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id_info)}
                      className="p-2 hover:bg-gray-100 rounded text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}