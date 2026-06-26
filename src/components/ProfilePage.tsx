import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { User, Mail, MapPin, Check, Loader2, Lock, Plus, Pencil } from 'lucide-react';
import { useAuth } from '../lib/auth/AuthContext';
import { useAddresses } from '../hooks/useAddresses';
import { updateProfile } from '../lib/api/users';
import { ApiError } from '../lib/api/client';
import AddressFormModal from './AddressFormModal';
import type { ApiUserAddress } from '../lib/api/types';

interface ProfilePageProps {
  onRequireAuth: () => void;
}

export default function ProfilePage({ onRequireAuth }: ProfilePageProps) {
  const { isAuthenticated, user, refreshProfile } = useAuth();
  const { addresses, reload: reloadAddresses } = useAddresses(isAuthenticated);

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ApiUserAddress | null>(null);

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressModalOpen(true);
  };

  const openEditAddress = (addr: ApiUserAddress) => {
    setEditingAddress(addr);
    setAddressModalOpen(true);
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate the form from the loaded profile.
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
      setPhone(user.phone ?? '');
    }
  }, [user]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setError('First name, last name and phone are all required.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
      });
      await refreshProfile();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  const inputBase =
    'w-full bg-zinc-950 border border-white/5 hover:border-white/10 focus:border-primary-peach rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-zinc-600';

  return (
    <section className="pt-28 pb-24 bg-[#1c1c1c] min-h-screen relative border-t border-white/5">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-peach/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">My Profile</h2>
        <p className="text-zinc-400 text-sm font-light mb-10">
          Manage your details and saved addresses.
        </p>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-peach/10 border border-primary-peach/20 flex items-center justify-center text-primary-peach">
              <Lock className="w-6 h-6" />
            </div>
            <p className="text-zinc-300 text-sm font-semibold">Please sign in to view your profile</p>
            <button
              onClick={onRequireAuth}
              className="mt-1 px-6 py-3 bg-primary-peach hover:bg-primary-peach-dark text-black font-semibold text-xs tracking-wider rounded-full uppercase cursor-pointer"
            >
              Sign In
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Details card */}
            <div className="bg-[#242424] border border-white/5 rounded-3xl p-7">
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-peach" /> Personal Details
              </h3>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-5">
                {/* Email (read-only) */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                    Email
                  </label>
                  <div className="flex items-center gap-2 bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-400">
                    <Mail className="w-4 h-4 text-zinc-600 shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Moeez"
                      className={inputBase}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ahmad"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className={inputBase}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-3 bg-primary-peach hover:bg-primary-peach-dark disabled:opacity-60 text-black font-semibold text-xs tracking-wider rounded-full uppercase cursor-pointer flex items-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saved ? (
                    <>
                      <Check className="w-4 h-4" /> Saved
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </form>
            </div>

            {/* Saved addresses */}
            <div className="bg-[#242424] border border-white/5 rounded-3xl p-7">
              <div className="flex items-center justify-between gap-3 mb-5">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-peach" /> Saved Addresses
                </h3>
                <button
                  onClick={openAddAddress}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-peach/10 border border-primary-peach/30 hover:bg-primary-peach/15 text-primary-peach text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {addresses.length === 0 ? (
                <p className="text-zinc-500 text-sm font-light">
                  No saved addresses yet — add one above or it’ll be saved after your first delivery order.
                </p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-zinc-950 border border-white/5"
                    >
                      <MapPin className="w-4 h-4 text-primary-peach shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-zinc-200 text-sm leading-snug">
                          {[a.addressLine1, a.landmark, a.city, a.postalCode].filter(Boolean).join(', ')}
                        </p>
                        {a.isDefault && (
                          <span className="text-[9px] text-primary-peach/80 uppercase tracking-wider font-semibold">
                            Default
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => openEditAddress(a)}
                        className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                        title="Edit address"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <AddressFormModal
        isOpen={addressModalOpen}
        address={editingAddress}
        onClose={() => setAddressModalOpen(false)}
        onSaved={reloadAddresses}
      />
    </section>
  );
}
