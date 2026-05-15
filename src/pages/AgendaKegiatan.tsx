import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, MapPin, Clock, Image as ImageIcon } from 'lucide-react';

interface Event {
  id_commissariat: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  images: string[];
  report: string;
  created_at: string;
}

export default function AgendaKegiatan() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (!error && data) {
        setEvents(data);
      }

      setLoading(false);
    }

    fetchEvents();
  }, []);

  const filteredEvents =
    filter === 'all' ? events : events.filter((event) => event.status === filter);

  const getStatusBadge = (status: Event['status']) => {
    const badges = {
      upcoming: { color: 'bg-blue-100 text-blue-800', label: 'Akan Datang' },
      ongoing: { color: 'bg-green-100 text-green-800', label: 'Sedang Berlangsung' },
      completed: { color: 'bg-gray-100 text-gray-800', label: 'Selesai' },
    };
    return badges[status];
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
          {[
            { key: 'all', label: 'Semua Kegiatan' },
            { key: 'upcoming', label: 'Akan Datang' },
            { key: 'ongoing', label: 'Sedang Berlangsung' },
            { key: 'completed', label: 'Selesai' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === item.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border text-gray-700 hover:bg-blue-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredEvents.length > 0 ? (
          <div className="space-y-8">
            {filteredEvents.map((event) => {
              const badge = getStatusBadge(event.status);

              return (
                <div
                  key={event.id_commissariat}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
                >
                  <div className="md:flex">
                    {/* Image */}
                    {event.images?.length > 0 ? (
                      <div className="md:w-1/3 h-64 md:h-auto relative">
                        <img
                          src={event.images[0]}
                          alt={event.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://via.placeholder.com/800x600?text=No+Image';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="md:w-1/3 flex items-center justify-center bg-blue-50 h-64">
                        <ImageIcon size={56} className="text-blue-300" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {event.title}
                        </h3>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          {new Date(event.event_date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            {event.location}
                          </div>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-gray-600 mb-4">{event.description}</p>
                      )}

                      {event.status === 'completed' && event.report && (
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-2">
                            Laporan Kegiatan
                          </h4>
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {event.report}
                          </p>
                        </div>
                      )}

                      {/* Gallery */}
                      {event.images?.length > 1 && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-semibold mb-3">Galeri Foto</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {event.images.slice(1, 4).map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt={`${event.title}-${i}`}
                                className="aspect-square object-cover rounded"
                                loading="lazy"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm py-16 text-center">
            <Clock size={56} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              Belum ada kegiatan tersedia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
