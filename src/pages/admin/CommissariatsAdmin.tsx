import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Trash2, Edit2, Plus, Save, X, ArrowLeft, Loader2 } from 'lucide-react';

interface Commissariat {
  id_commissariat: string;
  name: string;
  campus: string;
  logo_url: string;
  description: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  social_media: { instagram?: string; facebook?: string };
  is_active: boolean;
}

interface FormData {
  name: string;
  campus: string;
  logo_url: string;
  description: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  social_media: { instagram: string; facebook: string };
  is_active: boolean;
}

const initialForm: FormData = {
  name: '',
  campus: '',
  logo_url: '',
  description: '',
  address: '',
  contact_email: '',
  contact_phone: '',
  social_media: { instagram: '', facebook: '' },
  is_active: true,
};

export default function CommissariatsAdmin() {
  const [commissariats, setCommissariats] = useState<Commissariat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCommissariats();
  }, []);

  const fetchCommissariats = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('commissariats')
        .select('*')
        .order('name');
      if (err) throw err;
      setCommissariats(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `commissariat-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('komisariat')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('komisariat')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err: any) {
      setError("Gagal upload logo: " + err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const logoUrl = await uploadLogo(file);
    if (logoUrl) setFormData({ ...formData, logo_url: logoUrl });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.campus) {
      setError('Nama dan kampus wajib diisi');
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        social_media: {
          instagram: formData.social_media.instagram || null,
          facebook: formData.social_media.facebook || null,
        }
      };

      if (editing && editing !== 'new') {
        await supabase
          .from('commissariats')
          .update(dataToSave)
          .eq('id_commissariat', editing);
        setSuccess('Data komisariat berhasil diperbarui');
      } else {
        await supabase
          .from('commissariats')
          .insert([dataToSave]);
        setSuccess('Komisariat baru berhasil didaftarkan');
      }
      
      handleCancel();
      fetchCommissariats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string, logoUrl: string) => {
    if (!confirm('Hapus komisariat ini?')) return;
    
    try {
      await supabase
        .from('commissariats')
        .delete()
        .eq('id_commissariat', id);

      if (logoUrl) {
        const path = logoUrl.split('/').pop();
        if (path) {
          await supabase.storage.from('komisariat').remove([`commissariat-logos/${path}`]);
        }
      }

      setSuccess('Komisariat dihapus');
      fetchCommissariats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (comm: Commissariat) => {
    setEditing(comm.id_commissariat);
    setFormData({
      name: comm.name,
      campus: comm.campus,
      logo_url: comm.logo_url || '',
      description: comm.description || '',
      address: comm.address || '',
      contact_email: comm.contact_email || '',
      contact_phone: comm.contact_phone || '',
      social_media: {
        instagram: comm.social_media?.instagram || '',
        facebook: comm.social_media?.facebook || '',
      },
      is_active: comm.is_active,
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData(initialForm);
    setError('');
  };

  if (loading && commissariats.length === 0) {
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
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-semibold">Komisariat</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
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
            Tambah Komisariat
          </button>
        )}

        {/* Form */}
        {editing && (
          <div className="mb-6 bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">
                {editing === 'new' ? 'Tambah Komisariat' : 'Edit Komisariat'}
              </h2>
              <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border">
                    {formData.logo_url ? (
                      <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        No Image
                      </div>
                    )}
                  </div>
                  <label className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 cursor-pointer">
                    {uploading ? 'Uploading...' : 'Pilih Logo'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                  </label>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Komisariat</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kampus</label>
                  <input
                    type="text"
                    value={formData.campus}
                    onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Telepon</label>
                  <input
                    type="text"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Social Media */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Instagram</label>
                  <input
                    type="text"
                    value={formData.social_media.instagram}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      social_media: {...formData.social_media, instagram: e.target.value}
                    })}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Facebook</label>
                  <input
                    type="text"
                    value={formData.social_media.facebook}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      social_media: {...formData.social_media, facebook: e.target.value}
                    })}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-1">Alamat</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300"
                  id="active"
                />
                <label htmlFor="active" className="text-sm">Tampilkan di halaman publik</label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button onClick={handleCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  Batal
                </button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Save size={16} />
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-2">
          {commissariats.length === 0 ? (
            <div className="text-center py-10 bg-white border rounded-lg text-gray-500">
              Belum ada data komisariat
            </div>
          ) : (
            commissariats.map((comm) => (
              <div key={comm.id_commissariat} className="bg-white border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {/* Logo */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {comm.logo_url ? (
                      <img src={comm.logo_url} alt={comm.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        No Logo
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{comm.name}</h3>
                        <p className="text-sm text-gray-500">{comm.campus}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleEdit(comm)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(comm.id_commissariat, comm.logo_url)}
                          className="p-2 hover:bg-gray-100 rounded text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {comm.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{comm.description}</p>
                    )}
                    
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className={`px-2 py-0.5 rounded ${comm.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {comm.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                      {comm.contact_email && <span>{comm.contact_email}</span>}
                    </div>
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