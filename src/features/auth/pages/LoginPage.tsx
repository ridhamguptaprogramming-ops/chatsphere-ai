import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { AuthContainer } from '../components/AuthContainer';
import { LoginForm } from '../components/LoginForm';
import { SocialLogin } from '../components/SocialLogin';

export default function LoginPage() {
  return (
    <AuthContainer>
      {/* Mobile logo (visible only on small screens) */}
      <motion.div
        className="mb-6 flex flex-col items-center text-center md:hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sphere-400 to-sphere-600 blur-md opacity-50" />
          <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-sphere-400 to-sphere-600 p-3 shadow-lg shadow-sphere-500/20">
            <MessageCircle size={24} className="text-white" strokeWidth={1.5} />
          </div>
        </div>
        <span className="font-display text-xl font-bold tracking-tight text-white">
          Chat<span className="text-sphere-400">Sphere</span>
        </span>
      </motion.div>

      {/* Heading */}
      <motion.div
        className="mb-8 text-center md:text-left"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="font-display text-2xl font-semibold text-white md:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Continue the conversations that matter.
        </p>
      </motion.div>

      {/* Login form */}
      <LoginForm />

      {/* Social login, signup, security message */}
      <SocialLogin />
    </AuthContainer>
  );
}

