import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { User as UserIcon} from 'lucide-react';

// ================= TYPES =================
interface BoardMember {
  id_member: string;
  name: string;
  position: string;
  photo_url: string;
  description: string;
  order_position: number;
}

// ================= CONSTANTS =================
const POSITION_CATEGORIES = [
  { key: 'pimpinan', title: 'Ketua Organisasi', positions: ['Ketua', 'Ketua Umum', 'Wakil Ketua'] },
  { key: 'sekretariat', title: 'Sekretariat', positions: ['Sekretaris', 'Sekretaris Umum', 'Sekfung'] },
  { key: 'keuangan', title: 'Bendahara', positions: ['Bendahara', 'Bendahara Umum'] },
  { key: 'bidang', title: 'Ketua Bidang & Fungsional', positions: ['Kabid', 'Kepala Bidang', 'Departemen'] },
];

// ================= COMPONENTS =================
const MemberCard = ({ member }: { member: BoardMember }) => (
  <div className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300">
    <div className="p-6">
      {/* Photo Section */}
      <div className="relative mx-auto mb-5 w-24 h-24">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.name}
            className="relative w-full h-full object-cover rounded-full ring-2 ring-gray-50 ring-offset-2"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
            <UserIcon size={32} className="text-slate-400" />
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="text-center">
        <h3 className="text-md font-bold text-slate-800 uppercase tracking-tight leading-snug">
          {member.name}
        </h3>
        <div className="mt-1 mb-4 inline-block px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider rounded-md">
          {member.position}
        </div>
        
        {member.description && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 italic">
            "{member.description}"
          </p>
        )}
      </div>
    </div>
    
    {/* Minimal Footer Decor */}
    <div className="h-1 w-full bg-gray-50 group-hover:bg-blue-600 transition-colors duration-300" />
  </div>
);

// ================= MAIN =================
export default function ProfilPengurus() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('board_members')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true });

      if (!error && data) setMembers(data);
      setLoading(false);
    };
    fetchMembers();
  }, []);

  const categorizedData = useMemo(() => {
    return POSITION_CATEGORIES.map(cat => ({
      ...cat,
      data: members.filter(m =>
        cat.positions.some(p => m.position.toLowerCase().includes(p.toLowerCase()))
      )
    })).filter(cat => cat.data.length > 0);
  }, [members]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium text-slate-400 tracking-widest uppercase">Memuat Data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 mb-8 pt-8">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Struktur Organisasi
          </h1>
          <p className="text-slate-500 max-w-2xl">
            Sinergi dan kolaborasi dalam menjalankan amanah untuk pencetakan hasil yang maksimal dan akselerasi program kerja.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {categorizedData.length > 0 ? (
          categorizedData.map((category, idx) => (
            <div key={category.key} className="mb-20">
              {/* Category Title with Line */}
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 whitespace-nowrap">
                  {category.title}
                </h2>
                <div className="h-px w-full bg-slate-200" />
              </div>

              {/* Responsive Grid - First category gets larger items */}
              <div className={`grid gap-8 ${
                idx === 0 
                  ? "grid-cols-1 md:grid-cols-2 lg:max-w-4xl mx-auto" 
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              }`}>
                {category.data.map(member => (
                  <MemberCard key={member.id_member} member={member} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <UserIcon size={40} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 font-medium tracking-tight">Data pengurus belum tersedia saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}