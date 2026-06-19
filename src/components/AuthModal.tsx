import { useEffect, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { requestOtp, verifyOtp } from '../lib/api/auth';
import { ApiError } from '../lib/api/client';
import { useAuth } from '../lib/auth/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called after a successful login. */
  onSuccess?: () => void;
}

type Step = 'email' | 'code';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { login } = useAuth();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Reset to a clean slate whenever the modal is opened.
  useEffect(() => {
    if (isOpen) {
      setStep('email');
      setCode('');
      setError(null);
      setNotice(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await requestOtp(email.trim());
      if (res.error) {
        setError(res.error);
        return;
      }
      setNotice(`We sent a 6-digit code to ${email.trim()}.`);
      setStep('code');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send the code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 4) {
      setError('Enter the code from your email.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await verifyOtp(email.trim(), code.trim());
      login(res.accessToken);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Invalid or expired code.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-md bg-[#242424] border border-white/5 rounded-3xl overflow-hidden shadow-2xl text-zinc-100"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-black/40 hover:bg-black/70 text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/5 z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10">
              {/* Brand mark */}
              <div className="w-14 h-14 rounded-full bg-primary-peach/10 border border-primary-peach/20 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-primary-peach" />
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                {step === 'email' ? 'Sign in to Guru' : 'Verify your identity'}
              </h2>
              <p className="text-zinc-400 text-sm font-light mb-7 leading-relaxed">
                {step === 'email'
                  ? 'Enter your email and we’ll send you a one-time code — no password needed.'
                  : notice}
              </p>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
                  {error}
                </div>
              )}

              {step === 'email' ? (
                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-zinc-950 border border-white/5 hover:border-white/10 focus:border-primary-peach rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-zinc-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-primary-peach hover:bg-primary-peach-dark disabled:opacity-60 text-black font-semibold text-xs tracking-wider rounded-full transition-all duration-300 uppercase cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Send Code <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                      6-Digit Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoFocus
                      maxLength={6}
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="••••••"
                      className="w-full bg-zinc-950 border border-white/5 hover:border-white/10 focus:border-primary-peach rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] text-white focus:outline-none transition-colors placeholder:text-zinc-700"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-primary-peach hover:bg-primary-peach-dark disabled:opacity-60 text-black font-semibold text-xs tracking-wider rounded-full transition-all duration-300 uppercase cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Verify & Continue'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setError(null);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 text-zinc-500 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Use a different email
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
