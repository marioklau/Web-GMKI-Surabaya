import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Trash2, Edit2, Plus, X, ArrowLeft, Loader2 } from 'lucide-react';

interface Event {
  id_event: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  status: string;
  images: string[];
  report: string;
}

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    event_date: '',
    location: '',
    status: 'upcoming',
    images: [],
    report: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const statuses = [
    { value: 'upcoming', label: 'Akan Datang' },
    { value: 'ongoing', label: 'Berlangsung' },
    { value: 'completed', label: 'Selesai' },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });
      
      if (err) throw err;
      setEvents(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      setError(`Gagal upload: ${error.message}`);
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      
      const url = await uploadImage(file);
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls],
      }));
      setSuccess(`${uploadedUrls.length} foto ditambahkan`);
    }
    
    setUploading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.event_date) {
      setError('Judul dan tanggal wajib diisi');
      return;
    }

    try {
      const cleanedData = {
        ...formData,
        title: formData.title.trim(),
        images: formData.images || [],
      };

      if (editing === 'new') {
        await supabase.from('events').insert([cleanedData]);
      } else {
        await supabase.from('events').update(cleanedData).eq('id_event', editing);
      }

      setSuccess('Data kegiatan berhasil disimpan');
      resetForm();
      fetchEvents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (event: Event) => {
    setEditing(event.id_event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location,
      status: event.status,
      images: event.images || [],
      report: event.report,
    });
  };

  const handleDelete = async (id: string, imageUrls: string[]) => {
    if (!confirm('Hapus kegiatan ini?')) return;
    try {
      await supabase.from('events').delete().eq('id_event', id);

      // Clean storage
      for (const url of imageUrls) {
        const path = url.split('/').pop();
        if (path) await supabase.storage.from('events').remove([`events/${path}`]);
      }

      setSuccess('Kegiatan dihapus');
      fetchEvents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({ 
      title: '', 
      description: '', 
      event_date: '', 
      location: '', 
      status: 'upcoming', 
      images: [], 
      report: '' 
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  if (loading && events.length === 0) {
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
            <h1 className="text-xl font-semibold">Kegiatan</h1>
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
            Tambah Kegiatan
          </button>
        )}

        {/* Form */}
        {editing && (
          <div className="mb-6 bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">
                {editing === 'new' ? 'Tambah Kegiatan' : 'Edit Kegiatan'}
              </h2>
              <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium mb-1">Judul</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={e => setFormData({...formData, event_date: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  >
                    {statuses.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lokasi</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium mb-1">Foto</label>
                
                {/* Image Preview */}
                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {formData.images.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                        <img src={url} className="w-full h-full object-cover" alt="" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-75 hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                <label className="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 cursor-pointer">
                  {uploading ? 'Uploading...' : 'Upload Foto'}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Report (only for completed events) */}
              {formData.status === 'completed' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Laporan</label>
                  <textarea
                    rows={3}
                    value={formData.report}
                    onChange={e => setFormData({...formData, report: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button onClick={resetForm} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {uploading && <Loader2 className="animate-spin" size={16} />}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Event List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-white border rounded-lg text-gray-500">
              Belum ada data kegiatan
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id_event} className="bg-white border rounded-lg overflow-hidden">
                {/* Image */}
                <div className="aspect-video bg-gray-100">
                  {event.images?.[0] ? (
                    <img src={event.images[0]} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-1">{event.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                      event.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' :
                      event.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {statuses.find(s => s.value === event.status)?.label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>

                  <div className="text-xs text-gray-400 mb-3">
                    <div>{new Date(event.event_date).toLocaleDateString('id-ID')}</div>
                    <div className="truncate">{event.location}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-1 pt-3 border-t">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id_event, event.images)}
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