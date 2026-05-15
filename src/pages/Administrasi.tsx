import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Download, Folder } from 'lucide-react';

interface Document {
  id_document: string;
  title: string;
  description: string;
  file_url: string;
  category: string;
  created_at: string;
}

export default function Administrasi() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'Semua Dokumen' },
    { value: 'surat_keputusan', label: 'Surat Keputusan' },
    { value: 'formulir', label: 'Formulir Kaderisasi' },
    { value: 'template', label: 'Template Surat' },
    { value: 'pedoman', label: 'Pedoman & Aturan' },
  ];

  useEffect(() => {
    async function fetchDocuments() {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setDocuments(data);
      }

      setLoading(false);
    }

    fetchDocuments();
  }, []);

  const filteredDocuments =
    selectedCategory === 'all'
      ? documents
      : documents.filter((doc) => doc.category === selectedCategory);

  const getCategoryLabel = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat?.label || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      surat_keputusan: 'bg-blue-100 text-blue-800',
      formulir: 'bg-green-100 text-green-800',
      template: 'bg-purple-100 text-purple-800',
      pedoman: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-blue-50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id_document}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText size={22} className="text-blue-600" />
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(
                        doc.category
                      )}`}
                    >
                      {getCategoryLabel(doc.category)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {doc.title}
                  </h3>

                  {doc.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {doc.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString('id-ID')}
                    </span>

                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <Download size={16} />
                      Unduh
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm py-16 text-center">
            <Folder size={56} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {selectedCategory === 'all'
                ? 'Belum ada dokumen tersedia'
                : `Belum ada dokumen dalam kategori ${getCategoryLabel(
                    selectedCategory
                  )}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
