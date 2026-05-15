import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  MapPin,
  Mail,
  Phone,
  Building2,
  Instagram,
  Facebook,
} from 'lucide-react';

interface Commissariat {
  id_commissariat: string;
  name: string;
  logo_url: string;
  description: string;
  campus: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  social_media: {
    instagram?: string;
    facebook?: string;
  };
}

export default function Komisariat() {
  const [commissariats, setCommissariats] = useState<Commissariat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCommissariats() {
      const { data, error } = await supabase
        .from('commissariats')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (!error && data) {
        setCommissariats(data);
      }

      setLoading(false);
    }

    fetchCommissariats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {commissariats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commissariats.map((commissariat) => (
              <div
                key={commissariat.id_commissariat}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* HEADER */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {commissariat.logo_url ? (
                        <img
                          src={commissariat.logo_url}
                          alt={commissariat.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Building2 size={32} className="text-blue-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {commissariat.name}
                      </h3>
                      {commissariat.campus && (
                        <p className="text-blue-600 font-medium">
                          {commissariat.campus}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  {commissariat.description && (
                    <p className="text-gray-600 mb-4">
                      {commissariat.description}
                    </p>
                  )}

                  {/* INFO */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {commissariat.address && (
                      <div className="flex items-start gap-3">
                        <MapPin
                          size={18}
                          className="text-gray-400 mt-1 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-600">
                          {commissariat.address}
                        </span>
                      </div>
                    )}

                    {commissariat.contact_email && (
                      <div className="flex items-center gap-3">
                        <Mail size={18} className="text-gray-400" />
                        <a
                          href={`mailto:${commissariat.contact_email}`}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {commissariat.contact_email}
                        </a>
                      </div>
                    )}

                    {commissariat.contact_phone && (
                      <div className="flex items-center gap-3">
                        <Phone size={18} className="text-gray-400" />
                        <a
                          href={`tel:${commissariat.contact_phone}`}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {commissariat.contact_phone}
                        </a>
                      </div>
                    )}

                    {(commissariat.social_media?.instagram ||
                      commissariat.social_media?.facebook) && (
                      <div className="flex items-center gap-3 pt-2">
                        {commissariat.social_media?.instagram && (
                          <a
                            href={commissariat.social_media.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-100 transition"
                          >
                            <Instagram size={16} className="text-gray-600" />
                          </a>
                        )}

                        {commissariat.social_media?.facebook && (
                          <a
                            href={commissariat.social_media.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 transition"
                          >
                            <Facebook size={16} className="text-gray-600" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Building2 size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              Data komisariat belum tersedia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
