import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  HeartHandshake,
  Landmark,
  Star,
  Calendar,
  Church,
  GraduationCap,
  Globe,
  Lightbulb,
  User,
} from "lucide-react";

interface OrgInfo {
  section: string;
  content: string;
}

export default function ProfilOrganisasi() {
  const [orgInfo, setOrgInfo] = useState<OrgInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrgInfo() {
      const { data} = await supabase
        .from('organization_info')
        .select('*');
      
      if (data) {
        setOrgInfo(data);
      }
      setLoading(false);
    }

    fetchOrgInfo();
  }, []);

  const getContent = (section: string) => {
    const info = orgInfo.find((item) => item.section === section);
    return info?.content || '';
  };

  const triPanji = [
    {
      title: "Tinggi Iman",
      desc: "Membangun kehidupan rohani dan spiritualitas kader.",
      icon: Star,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Tinggi Ilmu",
      desc: "Mengembangkan intelektualitas dan budaya akademik.",
      icon: Lightbulb,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Tinggi Pengabdian",
      desc: "Hadir melayani dan berdampak bagi sesama.",
      icon: HeartHandshake,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const medanLayan = [
    {
      title: "Gereja",
      desc: "Melayani dan bertumbuh dalam kehidupan iman",
      icon: Church,
      color: "bg-purple-600",
    },
    {
      title: "Perguruan Tinggi",
      desc: "Mengembangkan intelektualitas dan daya kritis mahasiswa",
      icon: GraduationCap,
      color: "bg-blue-600",
    },
    {
      title: "Masyarakat",
      desc: "Menghadirkan aksi nyata bagi kehidupan sosial",
      icon: Globe,
      color: "bg-green-600",
    },
  ];

  const tokohPendiri = [
    {
      name: "Dr. J. Leimena",
      role: "Ketua Umum GMKI Pertama (1950)",
      description: "Tokoh penting yang memimpin peleburan PMKI dan CSV baru menjadi GMKI. Beliau juga menjabat sebagai Menteri Kesehatan dan Wakil Perdana Menteri Indonesia.",
      image: "/images/johannes.jpg",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-100"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-blue-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <section className="relative py-16 lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ================= SEJARAH & TOKOH PENDIRI ================= */}
          <div className="mb-16">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Kolom Kiri: Sejarah */}
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-0.5 bg-blue-500"></div>
                  <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
                    Sejarah GMKI
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-blue-500 w-5 h-5 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-bold">9 Februari 1950</span> — Di kediaman Dr. J. Leimena di Jl. Teuku Umar No. 36 Jakarta, 
                      wakil-wakil PMKI dan CSV baru hadir dalam pertemuan bersejarah. Maka lahirlah kesepakatan yang menyatakan 
                      bahwa PMKI dan CSV baru meleburkan diri dalam suatu organisasi yang bernama <span className="font-bold">Gerakan Mahasiswa Kristen Indonesia (GMKI)</span>.
                    </p>
                  </div>

                  <div className="border-l-2 border-blue-300 pl-4 ml-2">
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                      <span className="font-semibold">Pesan Penting Dr. J. Leimena:</span>
                    </p>
                    <p className="text-gray-600 italic text-sm">
                      {getContent('message') || "Mari kita bangun organisasi yang berlandaskan kasih dan pengabdian kepada bangsa."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-blue-100/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Awal Mula</p>
                      <p className="text-sm font-semibold">CSV op Java (1932)</p>
                    </div>
                    <div className="bg-blue-100/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Pendahulu</p>
                      <p className="text-sm font-semibold">PMKI (1945)</p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap pt-2">
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      9 Februari 1950
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                      Gerakan Nasional
                    </span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Foto Pendiri */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-0.5 bg-blue-500"></div>
                  <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
                    Tokoh Pendiri
                  </span>
                </div>

                {tokohPendiri.map((tokoh, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                        <img 
                          src={tokoh.image}
                          alt={tokoh.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Foto+Pendiri';
                          }}
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 shadow-md">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800">{tokoh.name}</h3>
                    <p className="text-blue-600 font-medium text-sm mt-1">{tokoh.role}</p>
                    <div className="w-16 h-0.5 bg-blue-200 my-3"></div>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                      {tokoh.description}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        Menteri Kesehatan
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        Wakil PM
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= VISI & MISI (DARI DATABASE) ================= */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50/50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-700">Visi</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-base italic">
                  {getContent('vision') || "Terwujudnya kedamaian, kesejahteraan, keadilan, kebenaran, keutuhan ciptaan dan demokrasi di Indonesia berdasarkan kasih."}
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <HeartHandshake className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Misi</h3>
                </div>
                <div className="text-gray-600 text-sm leading-relaxed space-y-3">
                  {getContent('mission') ? (
                    <div className="whitespace-pre-line">{getContent('mission')}</div>
                  ) : (
                    <ul className="space-y-3">
                      {[
                        "Mengajak mahasiswa kepada pengenalan akan Yesus Kristus selaku Tuhan dan Penebus, memperdalam iman dalam kehidupan sehari-hari",
                        "Membina kesadaran sebagai warga gereja yang esa di tengah mahasiswa dalam kesaksian memperbaharui masyarakat, manusia dan gereja",
                        "Mempersiapkan pemimpin dan penggerak yang ahli dan bertanggung jawab dalam menjalankan panggilan di tengah masyarakat, negara, gereja, perguruan tinggi dan mahasiswa",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ================= TRI PANJI ================= */}
          <div className="mb-16">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-blue-600 w-4 h-4" />
                <span className="text-blue-600 font-semibold uppercase tracking-wider text-xs">
                  Nilai Dasar
                </span>
              </div>
              <h2 className="text-2xl md:text-2xl font-semibold text-gray-900">
                Tri Panji GMKI
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Tiga pilar utama yang menjadi fondasi gerakan dan pengembangan kader
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {triPanji.map((item, i) => (
                <div
                  key={i}
                  className="group bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <item.icon className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= TIGA MEDAN LAYAN ================= */}
          <div className="mb-16">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Landmark className="text-blue-600 w-4 h-4" />
                <span className="text-blue-600 font-semibold uppercase tracking-wider text-xs">
                  Medan Layanan
                </span>
              </div>
              <h2 className="text-2xl md:text-2xl font-semibold text-gray-900">
                Tiga Medan Layan GMKI
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Ruang lingkup pelayanan dan pengabdian organisasi
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {medanLayan.map((item, i) => (
                <div
                  key={i}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <item.icon className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                      Medan strategis pengabdian
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}