import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { Reservation } from '../types';
import { BRANCHES } from '../lib/config';

export default function FindUs() {
  const [formData, setFormData] = useState<Reservation>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });

  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [userBookings, setUserBookings] = useState<Reservation[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      return;
    }
    
    // Save to simulated bookings store
    const updatedBookings = [...userBookings, formData];
    setUserBookings(updatedBookings);
    setBookingSuccess(true);
    
    // Clear form except name for personalized response
    setTimeout(() => {
      setBookingSuccess(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
        specialRequests: ''
      });
    }, 4500);
  };

  return (
    <section id="find-us-section" className="py-14 md:py-24 bg-[#1c1c1c] relative border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-peach/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div id="section-header" className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-peach mb-3">
            Visit Us
          </h2>
          <h2 className="text-white text-base md:text-lg font-semibold tracking-wide">
            Reserve a Table
          </h2>
          <div className="h-[2px] w-12 bg-primary-peach mx-auto my-6" />
          <p className="text-zinc-400 text-sm leading-relaxed font-light">
            Book a table and join us in person — a warm, modern space made for great food and good company in Lahore.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Card left: Info & map placeholder */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-2">Our Branches</h3>

              {BRANCHES.map((branch) => (
                <div key={branch.id} className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-primary-peach shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold mb-1">{branch.name} Branch</h4>
                    <p className="text-zinc-400 text-xs font-light leading-relaxed">
                      {branch.name}, {branch.area}, Pakistan
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-primary-peach shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold mb-1">Opening Hours</h4>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed">
                    Monday — Sunday: 08:00 AM — 01:00 AM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-primary-peach shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold mb-1">Phone</h4>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed">
                    +92 300 1234567
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Premium Virtual Map */}
            <div className="h-64 rounded-3xl overflow-hidden relative border border-white/5 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
              {/* Grid abstract background */}
              <div className="absolute inset-0 bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
              <div className="absolute top-1/4 right-1/3 w-24 h-24 bg-primary-peach/15 rounded-full blur-xl animate-pulse" />
              
              <div className="relative z-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary-peach/10 flex items-center justify-center text-primary-peach mx-auto mb-2 border border-primary-peach/20">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="text-white text-sm font-bold tracking-wider">Find Us in Lahore</h4>
                <p className="text-[11px] text-zinc-500 font-mono">Wapda Town &amp; Model Town</p>
                <span className="inline-block py-1 px-3 bg-zinc-900 rounded-full text-[10px] text-primary-peach border border-primary-peach/30 font-semibold uppercase tracking-widest mt-2">
                  Parking Available
                </span>
              </div>
            </div>
          </div>

          {/* Card right: Form */}
          <div className="lg:col-span-7 bg-[#242424] border border-white/5 rounded-3xl p-5 sm:p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {bookingSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center h-full text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Reservation Confirmed</h3>
                  <p className="text-zinc-400 text-xs font-light max-w-sm mb-6 leading-relaxed">
                    Thanks, <span className="text-primary-peach font-semibold">{formData.name}</span>. Your table for <span className="text-white font-semibold">{formData.guests} guests</span> on <span className="text-white font-semibold">{formData.date}</span> at <span className="text-white font-semibold">{formData.time}</span> is booked. We look forward to seeing you!
                  </p>
                  <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.2em]">
                    A confirmation was sent to {formData.email}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-peach shrink-0" />
                    Book a Table
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-medium tracking-wider uppercase">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-primary-peach rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-peach transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-medium tracking-wider uppercase">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="johndoe@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-primary-peach rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-peach transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-medium tracking-wider uppercase">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+92 300 1234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-primary-peach rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-peach transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-medium tracking-wider uppercase">Date</label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-primary-peach rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-peach transition-all [color-scheme:dark]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-medium tracking-wider uppercase">Time</label>
                      <input
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full bg-zinc-950 border border-[#2a2a2a] hover:border-white/20 focus:border-primary-peach rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-peach transition-all [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-medium tracking-wider uppercase">Guests</label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                        className="w-full bg-zinc-950 border border-[#2a2a2a] hover:border-white/20 focus:border-primary-peach rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-peach transition-all cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-medium tracking-wider uppercase">Special Requests</label>
                      <input
                        type="text"
                        placeholder="e.g. Birthday anniversary, wheelchair access"
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                        className="w-full bg-zinc-950 border border-[#2a2a2a] hover:border-white/20 focus:border-primary-peach rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-peach transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <motion.button
                      type="submit"
                      animate={{ boxShadow: ['0 0 0px 0px rgba(230,126,34,0)', '0 0 30px 3px rgba(230,126,34,0.55)'] }}
                      transition={{ duration: 1.6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4.5 bg-primary-peach hover:bg-primary-peach-dark text-black font-extrabold text-sm tracking-widest rounded-2xl cursor-pointer uppercase"
                    >
                      RESERVE TABLE
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
