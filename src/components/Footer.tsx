import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {/* Logo GMKI */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="images/gmki_surabaya.png" 
                  alt="Logo GMKI" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">GMKI Surabaya</h3>
                <p className="text-sm text-gray-400">Gerakan Mahasiswa Kristen Indonesia</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Organisasi mahasiswa Kristen yang berkomitmen untuk mengembangkan kepemimpinan
              dan melayani masyarakat.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-sm">Surabaya, Jawa Timur, Indonesia</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="flex-shrink-0" />
                <span className="text-sm">gmkisurabaya@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="flex-shrink-0" />
                <span className="text-sm">+62 xxx xxxx xxxx</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Media Sosial</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/gmkisurabaya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/gmki_surabaya/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} GMKI Surabaya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
