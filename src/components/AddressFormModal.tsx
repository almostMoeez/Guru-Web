import { useEffect, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Loader2, LocateFixed, Check } from 'lucide-react';
import { createAddress, updateAddress } from '../lib/api/users';
import { getCurrentCoords, type GeoAddress } from '../lib/geocode';
import { ApiError } from '../lib/api/client';
import LocationPicker from './LocationPicker';
import AreaSelect from './AreaSelect';
import { nearestArea, type LahoreArea } from '../lib/lahoreAreas';
import type { ApiUserAddress } from '../lib/api/types';

interface AddressFormModalProps {
  isOpen: boolean;
  /** null = add mode; an address = edit mode. */
  address: ApiUserAddress | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function AddressFormModal({
  isOpen,
  address,
  onClose,
  onSaved,
}: AddressFormModalProps) {
  const editing = Boolean(address);
  const [addressLine1, setAddressLine1] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAddressLine1(address?.addressLine1 ?? '');
      setLandmark(address?.landmark ?? '');
      setArea('');
      setPostalCode(address?.postalCode ?? '');
      setIsDefault(address?.isDefault ?? false);
      setError(null);
      setMapCenter(null);
    }
  }, [isOpen, address]);

  // Fill the form from a resolved map/geolocation address.
  const applyGeo = (geo: GeoAddress, coords: [number, number]) => {
    if (geo.addressLine1) setAddressLine1(geo.addressLine1);
    if (geo.landmark) setLandmark(geo.landmark);
    if (geo.postalCode) setPostalCode(geo.postalCode);
    setArea(nearestArea(coords[0], coords[1]).name);
  };

  // Recenter the map on the chosen area; the picker resolves + fills the fields.
  const handleAreaSelect = (a: LahoreArea) => {
    setArea(a.name);
    setMapCenter([a.lat, a.lng]);
  };

  const useMyLocation = async () => {
    setLocating(true);
    setError(null);
    try {
      // Recenter the map on the device location; the picker fills the fields.
      setMapCenter(await getCurrentCoords());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not detect your location.');
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!addressLine1.trim()) {
      setError('Address is required.');
      return;
    }
    setSaving(true);
    const payload = {
      addressLine1: addressLine1.trim(),
      city: 'Lahore',
      postalCode: postalCode.trim(),
      landmark: landmark.trim() || undefined,
      isDefault,
    };
    try {
      if (editing && address) await updateAddress(address.id, payload);
      else await createAddress(payload);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save the address.');
    } finally {
      setSaving(false);
    }
  };

  const inputBase =
    'w-full bg-zinc-950 border border-white/5 hover:border-white/10 focus:border-primary-peach rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-zinc-600';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-md bg-[#242424] border border-white/5 rounded-3xl overflow-hidden shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-black/40 hover:bg-black/70 text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/5 z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-5 sm:p-7 md:p-8">
              <div className="w-12 h-12 rounded-full bg-primary-peach/10 border border-primary-peach/20 flex items-center justify-center mb-5">
                <MapPin className="w-5 h-5 text-primary-peach" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mb-1">
                {editing ? 'Edit Address' : 'Add Address'}
              </h2>
              <p className="text-zinc-400 text-sm font-light mb-5">
                Drag the pin on the map, use your location, or type it in below.
              </p>

              {/* Map picker */}
              <LocationPicker center={mapCenter} onPick={applyGeo} />
              <p className="text-zinc-600 text-[10px] font-light mt-1.5 mb-3">
                Select your area or drop the pin — the address fills in automatically.
              </p>

              {/* Use my location */}
              <button
                type="button"
                onClick={useMyLocation}
                disabled={locating}
                className="w-full mb-5 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-peach/10 border border-primary-peach/30 hover:bg-primary-peach/15 text-primary-peach text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-60"
              >
                {locating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LocateFixed className="w-4 h-4" />
                )}
                {locating ? 'Detecting…' : 'Use my current location'}
              </button>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                    Area
                  </label>
                  <AreaSelect value={area} onSelect={handleAreaSelect} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                    Address <span className="text-primary-peach">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House / Street, e.g. House 23-A, Block H"
                    className={inputBase}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                      Landmark
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Optional"
                      className={inputBase}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[10px] font-semibold tracking-wider uppercase block">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Optional"
                      className={inputBase}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDefault((v) => !v)}
                  className="flex items-center gap-2 text-left cursor-pointer"
                >
                  <span
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      isDefault ? 'bg-primary-peach border-primary-peach' : 'border-zinc-600'
                    }`}
                  >
                    {isDefault && <Check className="w-3.5 h-3.5 text-black" />}
                  </span>
                  <span className="text-zinc-300 text-xs">Set as default address</span>
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full mt-2 py-3.5 bg-primary-peach hover:bg-primary-peach-dark disabled:opacity-60 text-black font-semibold text-xs tracking-wider rounded-full uppercase cursor-pointer flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editing ? (
                    'Save Changes'
                  ) : (
                    'Add Address'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
