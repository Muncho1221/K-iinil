import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) setAlert({ message: error.message, type: 'error' });
      } else {
        const { data, error } = await signUp(email, password, username);
        if (error) setAlert({ message: error.message, type: 'error' });
        else if (data) setAlert({ message: 'Registro exitoso.', type: 'success' });
      }
    } catch (err) {
      console.error(err);
      setAlert({ message: 'Ocurrió un error inesperado', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf0ff] p-4">
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-lavender-100"
      >
        <h2 className="text-2xl font-bold text-plum-900 mb-6 text-center">
          {isLogin ? 'Bienvenido a K\'iinil' : 'Únete a K\'iinil'}
        </h2>
        
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-3 mb-4 border border-lavender-200 rounded-xl focus:ring-2 focus:ring-plum-400 outline-none transition-all" 
          onChange={(e) => setEmail(e.target.value)} 
        />
        {!isLogin && (
          <input 
            type="text" 
            placeholder="Nombre de usuario" 
            className="w-full p-3 mb-4 border border-lavender-200 rounded-xl focus:ring-2 focus:ring-plum-400 outline-none transition-all" 
            onChange={(e) => setUsername(e.target.value)} 
          />
        )}
        <input 
          type="password" 
          placeholder="Contraseña" 
          className="w-full p-3 mb-6 border border-lavender-200 rounded-xl focus:ring-2 focus:ring-plum-400 outline-none transition-all" 
          onChange={(e) => setPassword(e.target.value)} 
        />
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-plum-700 text-white py-3 rounded-full mb-4 font-semibold hover:bg-plum-800 transition-colors shadow-lg"
        >
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </motion.button>
        
        <button 
          type="button" 
          className="w-full text-sm text-plum-600 hover:text-plum-800 transition-colors" 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>

        <AnimatePresence>
          {alert && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-4 p-3 rounded-lg text-sm text-center ${alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
            >
              {alert.message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}
