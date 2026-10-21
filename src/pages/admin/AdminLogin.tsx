import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        setError(authError.message);
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen bg-slate-950 px-4 py-12 flex items-center justify-center">
       <div className="w-full max-w-md">
         <div className="admin-card p-8 sm:p-10">
          <div className="flex items-center justify-center mb-8">
<div className="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center shadow-lg shadow-blue-200">
               <img src="/images/gmki_surabaya.png" alt="Logo GMKI" className="h-11 w-11 object-cover" />
             </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Admin GMKI</h1>
          <p className="text-center text-gray-600 mb-8">Masuk ke dashboard admin</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmki.com"
                className="admin-input"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="admin-input"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="admin-button-primary w-full py-3"
            >
              <LogIn size={20} />
              <span>{loading ? 'Sedang masuk...' : 'Masuk'}</span>
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Hubungi administrator untuk mendapatkan akses admin
          </p>
        </div>
      </div>
    </div>
  );
}
