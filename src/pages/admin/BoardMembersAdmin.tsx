import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Trash2, Edit2, Plus, X, ArrowLeft, Loader2 } from 'lucide-react';

interface BoardMember {
  id_member: string;
  name: string;
  position: string;
  photo_url: string;
  description: string;
  instagram_url: string;
  linkedin_url: string;
  email: string;
  order_position: number;
  is_active: boolean;
}

export default function BoardMembersAdmin() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    photo_url: '',
    description: '',
    instagram_url: '',
    linkedin_url: '',
    email: '',
    order_position: 0,
    is_active: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('board_members')
        .select('*')
        .order('order_position', { ascending: true, nullsFirst: false });
      if (err) throw err;
      setMembers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('board-members').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('board-members').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async () => {
    const name = formData.name.trim();
    const position = formData.position.trim();
    const orderPosition = Number.isFinite(formData.order_position)
      ? Math.max(1, Math.floor(formData.order_position))
      : members.length + 1;

    if (!name || !position) {
      setError('Nama dan jabatan harus diisi');
      return;
    }

    try {
      setLoading(true);
      let photoUrl = formData.photo_url;
      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile);
      }

      const payload = {
        ...formData,
        name,
        position,
        order_position: orderPosition,
        photo_url: photoUrl,
        instagram_url: formData.instagram_url.trim(),
        linkedin_url: formData.linkedin_url.trim(),
        email: formData.email.trim(),
      };

      if (editing && editing !== 'new') {
        await supabase.from('board_members').update(payload).eq('id_member', editing);
        setSuccess('Data pengurus diperbarui');
      } else {
        await supabase.from('board_members').insert([payload]);
        setSuccess('Pengurus baru ditambahkan');
      }

      handleCancel();
      fetchMembers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const moveMember = async (member: BoardMember, direction: 'up' | 'down') => {
    const index = members.findIndex((item) => item.id_member === member.id_member);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const target = members[targetIndex];

    if (!target) return;

    try {
      setLoading(true);
      const updates = [
        supabase.from('board_members').update({ order_position: target.order_position }).eq('id_member', member.id_member),
        supabase.from('board_members').update({ order_position: member.order_position }).eq('id_member', target.id_member),
      ];
      const results = await Promise.all(updates);
      const error = results.find((result) => result.error)?.error;
      if (error) throw error;
      await fetchMembers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id_member: string) => {
    if (!confirm('Yakin ingin menghapus pengurus ini?')) return;
    try {
      await supabase.from('board_members').delete().eq('id_member', id_member);
      setSuccess('Pengurus berhasil dihapus');
      fetchMembers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (member: BoardMember) => {
    setEditing(member.id_member);
    setFormData(member);
    setPhotoPreview(member.photo_url);
    setPhotoFile(null);
    window.scrollTo({ top: 0 });
  };

  const handleCancel = () => {
    setEditing(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormData({
      name: '',
      position: '',
      photo_url: '',
       description: '',
       instagram_url: '',
       linkedin_url: '',
       email: '',
       order_position: members.length,
      is_active: true,
    });
    setError('');
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {/* Header */}
      <div className="admin-header">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-semibold">Struktur Pengurus</h1>
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
            Tambah Pengurus
          </button>
        )}

        {/* Form */}
        {editing && (
          <div className="mb-6 bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">
                {editing === 'new' ? 'Tambah Pengurus' : 'Edit Pengurus'}
              </h2>
              <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Foto</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        No Image
                      </div>
                    )}
                  </div>
                  <label className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 cursor-pointer">
                    Pilih Foto
                    <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Jabatan</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Urutan</label>
<input
                     type="number"
                     min="1"
                     value={formData.order_position}
                     onChange={(e) => setFormData({ ...formData, order_position: Number(e.target.value) || 1 })}
                     className="admin-input"
                   />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Tampilkan</span>
                  </label>
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                   <label className="block text-sm font-medium mb-1">Email</label>
                   <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="admin-input" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-1">Instagram</label>
                   <input type="url" value={formData.instagram_url} onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })} className="admin-input" placeholder="https://instagram.com/..." />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-1">LinkedIn</label>
                   <input type="url" value={formData.linkedin_url} onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })} className="admin-input" placeholder="https://linkedin.com/in/..." />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                />
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
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Member List */}
        <div className="space-y-3">
          {members.length === 0 ? (
            <div className="text-center py-10 bg-white border rounded-lg text-gray-500">
              Belum ada data pengurus
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id_member} className="bg-white border rounded-lg p-4">
                <div className="flex gap-4">
                  {/* Photo */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-gray-900 truncate">{member.name}</h3>
                        <p className="text-sm text-blue-600">{member.position}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => moveMember(member, 'up')}
                          disabled={member === members[0] || loading}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                          aria-label={`Naikkan ${member.name}`}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveMember(member, 'down')}
                          disabled={member === members[members.length - 1] || loading}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                          aria-label={`Turunkan ${member.name}`}
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id_member)}
                          className="p-2 hover:bg-gray-100 rounded text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {member.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{member.description}</p>
                    )}
                    
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>Urutan: {member.order_position}</span>
                      <span className={`px-2 py-0.5 rounded ${member.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {member.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
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