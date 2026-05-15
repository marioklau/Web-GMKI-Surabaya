import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Trash2, Edit2, Plus, X, ArrowLeft, Loader2, File } from 'lucide-react';

interface Document {
  id_document: string;
  title: string;
  description: string;
  file_url: string;
  file_path?: string;
  category: string;
}

export default function DocumentsAdmin() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_url: '',
    file_path: '',
    category: 'surat_keputusan',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    { value: 'surat_keputusan', label: 'Surat Keputusan' },
    { value: 'formulir', label: 'Formulir' },
    { value: 'template', label: 'Template' },
    { value: 'pedoman', label: 'Pedoman' },
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (err) throw err;
      setDocuments(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${formData.category}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return { url: urlData.publicUrl, path: filePath };
    } catch (error: any) {
      setError(`Gagal upload: ${error.message}`);
      return null;
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.category) {
      setError('Judul dan kategori wajib diisi');
      return;
    }

    try {
      let fileUrl = formData.file_url;
      let filePath = formData.file_path;

      if (selectedFile) {
        const result = await uploadFile(selectedFile);
        if (result) {
          fileUrl = result.url;
          filePath = result.path;
        } else return;
      }

      const documentData = {
        title: formData.title,
        description: formData.description,
        file_url: fileUrl,
        file_path: filePath,
        category: formData.category,
      };

      if (editing && editing !== 'new') {
        await supabase.from('documents').update(documentData).eq('id_document', editing);
        setSuccess('Dokumen berhasil diperbarui');
      } else {
        await supabase.from('documents').insert([documentData]);
        setSuccess('Dokumen berhasil ditambahkan');
      }

      handleCancel();
      fetchDocuments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, filePath?: string) => {
    if (!confirm('Hapus dokumen ini?')) return;
    try {
      if (filePath) {
        await supabase.storage.from('documents').remove([filePath]);
      }
      await supabase.from('documents').delete().eq('id_document', id);
      setSuccess('Dokumen dihapus');
      fetchDocuments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({ title: '', description: '', file_url: '', file_path: '', category: 'surat_keputusan' });
    setSelectedFile(null);
    setError('');
  };

  if (loading && documents.length === 0) {
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
            <h1 className="text-xl font-semibold">Dokumen</h1>
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
            Upload Dokumen
          </button>
        )}

        {/* Form */}
        {editing && (
          <div className="mb-6 bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">
                {editing === 'new' ? 'Tambah Dokumen' : 'Edit Dokumen'}
              </h2>
              <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Judul</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                    placeholder="Judul dokumen"
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
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">{selectedFile.name}</p>
                  )}
                </div>
              </div>

              {/* OR URL */}
              <div>
                <label className="block text-sm font-medium mb-1">Atau URL Eksternal</label>
                <input
                  type="url"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"
                  placeholder="Deskripsi dokumen (opsional)"
                />
              </div>

              {/* Actions */}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {uploading && <Loader2 className="animate-spin" size={16} />}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document List */}
        <div className="space-y-2">
          {documents.length === 0 ? (
            <div className="text-center py-10 bg-white border rounded-lg text-gray-500">
              Belum ada dokumen
            </div>
          ) : (
            documents.map((doc) => {
              const category = categories.find(c => c.value === doc.category);
              return (
                <div key={doc.id_document} className="bg-white border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <File size={20} className="text-gray-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.title}</h3>
                          <p className="text-sm text-gray-500">
                            {doc.description || 'Tidak ada deskripsi'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                              {category?.label || doc.category}
                            </span>
                            {doc.file_url && (
                              <a 
                                href={doc.file_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Lihat Dokumen
                              </a>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditing(doc.id_document);
                              setFormData({
                                title: doc.title,
                                description: doc.description || '',
                                file_url: doc.file_url,
                                file_path: doc.file_path || '',
                                category: doc.category
                              });
                            }}
                            className="p-2 hover:bg-gray-100 rounded"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id_document, doc.file_path)}
                            className="p-2 hover:bg-gray-100 rounded text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}