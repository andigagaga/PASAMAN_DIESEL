import { AlertCircle, Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";

export const LoginView = ({ onLogin, error }: { onLogin: (u: string, p: string) => void, error: string }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/assets/BG_pasamandiesel.jpeg')] bg-cover bg-center bg-no-repeat p-4 relative before:absolute before:inset-0 before:bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">PASAMAN DIESEL</h1>
          <p className="text-sm text-gray-500 mt-1">Sistem Manajemen Inventori & POS</p>
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mb-6 border-b pb-2">Silakan Login</h2>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-2 text-sm rounded">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); onLogin(username, password); }} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={16} />
              </div>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-sm outline-none" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={16} />
              </div>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-sm outline-none" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mt-4 shadow-lg shadow-blue-600/30">
            Login ke Sistem
          </button>
        </form>
      </div>
    </div>
  );
};