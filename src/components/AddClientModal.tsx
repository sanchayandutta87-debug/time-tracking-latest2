import React, { useState } from 'react';
import { X, User, Building, Mail, Phone, Globe, Briefcase, MapPin, Hash, DollarSign, FileText, Clock, CalendarDays, Map } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export interface Client {
  id: string;
  name: string;
  country: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
  currency: string;
  company: string;
  email: string;
  phone: string;
  projects: number;
  note: string;
  hourlyRate: number;
  weeklyRate: number;
  createdDate: string;
  status: 'Active' | 'Inactive' | 'Archived';
  avatar: string;
}

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  clientToEdit?: Client | null;
}

const COUNTRIES = [
  'UK', 'USA', 'Germany', 'France', 'Canada', 'Finland', 'India', 'Australia', 'Japan', 'Brazil'
];

const CURRENCIES = [
  'USD ($)', 'EUR (€)', 'GBP (£)', 'INR (₹)', 'CAD ($)', 'AUD ($)', 'JPY (¥)'
];

export default function AddClientModal({ isOpen, onClose, onSave, clientToEdit }: AddClientModalProps) {
  const { darkMode } = useAppContext();
  const [formData, setFormData] = useState({
    name: clientToEdit?.name || '',
    country: clientToEdit?.country || COUNTRIES[0],
    state: clientToEdit?.state || '',
    city: clientToEdit?.city || '',
    address: clientToEdit?.address || '',
    zipCode: clientToEdit?.zipCode || '',
    currency: clientToEdit?.currency || CURRENCIES[0],
    company: clientToEdit?.company || '',
    email: clientToEdit?.email || '',
    phone: clientToEdit?.phone || '',
    projects: clientToEdit?.projects || 0,
    note: clientToEdit?.note || '',
    hourlyRate: clientToEdit?.hourlyRate || 0,
    weeklyRate: clientToEdit?.weeklyRate || 0,
    status: clientToEdit?.status || 'Active'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClient: Client = {
      id: clientToEdit?.id || `CL-${Date.now()}`,
      name: formData.name,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      address: formData.address,
      zipCode: formData.zipCode,
      currency: formData.currency,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      projects: Number(formData.projects),
      note: formData.note,
      hourlyRate: Number(formData.hourlyRate),
      weeklyRate: Number(formData.weeklyRate),
      status: formData.status as any,
      avatar: clientToEdit?.avatar || `https://picsum.photos/seed/${formData.name.replace(/\s/g, '') || 'client'}/100/100`,
      createdDate: clientToEdit?.createdDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    onSave(newClient);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 ${darkMode ? 'bg-black border border-gray-800' : 'bg-white dark:bg-black'}`}>
        
        {/* Header */}
        <div className={`px-8 py-6 flex items-center justify-between border-b ${darkMode ? 'border-gray-800 bg-black' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-black'}`}>
          <div>
            <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {clientToEdit ? 'Edit Client details' : 'Add New Client'}
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Client Relationship Management</p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${darkMode ? 'text-gray-400 hover:bg-black hover:text-white' : 'text-gray-400 hover:bg-gray-100 dark:bg-gray-900 hover:text-gray-900 dark:text-white'}`}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form id="client-form" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info Column */}
              <div className="space-y-4">
                <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  <User size={16} /> Basic Information
                </h3>
                
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Client Name *</label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                    <User size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                    <input 
                      type="text" 
                      required 
                      className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Company Name *</label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                    <Building size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                    <input 
                      type="text" 
                      required 
                      className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                      placeholder="e.g. Acme Corp"
                      value={formData.company}
                      onChange={e => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                    <Mail size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                    <input 
                      type="email" 
                      required 
                      className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                      placeholder="e.g. john@acme.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                    <Phone size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                    <input 
                      type="text" 
                      className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                      placeholder="e.g. +1 234 567 890"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Location Column */}
              <div className="space-y-4">
                <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  <MapPin size={16} /> Location Details
                </h3>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Address</label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                    <MapPin size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                    <input 
                      type="text" 
                      className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                      placeholder="e.g. 123 Main St, Suite 400"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">City</label>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                      <input 
                        type="text" 
                        className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                        placeholder="City"
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">State / Province</label>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                      <Map size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                      <input 
                        type="text" 
                        className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                        placeholder="State"
                        value={formData.state}
                        onChange={e => setFormData({...formData, state: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Zip Code</label>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                      <Hash size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                      <input 
                        type="text" 
                        className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                        placeholder="Zip"
                        value={formData.zipCode}
                        onChange={e => setFormData({...formData, zipCode: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Country</label>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                      <Globe size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                      <select 
                        className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`}
                        value={formData.country}
                        onChange={e => setFormData({...formData, country: e.target.value})}
                      >
                        {COUNTRIES.map(c => <option key={c} value={c} className={darkMode ? 'bg-black' : 'bg-white dark:bg-black'}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details Section - Full Width */}
            <div className={`pt-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100 dark:border-gray-800'}`}>
              <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                <Briefcase size={16} /> Project & Billing Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Currency</label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                    <DollarSign size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                    <select 
                      className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`}
                      value={formData.currency}
                      onChange={e => setFormData({...formData, currency: e.target.value})}
                    >
                      {CURRENCIES.map(c => <option key={c} value={c} className={darkMode ? 'bg-black' : 'bg-white dark:bg-black'}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Number of Projects</label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                    <Briefcase size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                    <input 
                      type="number" 
                      className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                      placeholder="0"
                      value={formData.projects}
                      onChange={e => setFormData({...formData, projects: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Hourly Rate</label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                    <Clock size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                    <input 
                      type="number" 
                      className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                      placeholder="0.00"
                      value={formData.hourlyRate}
                      onChange={e => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Weekly Rate</label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                    <CalendarDays size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                    <input 
                      type="number" 
                      className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                      placeholder="0.00"
                      value={formData.weeklyRate}
                      onChange={e => setFormData({...formData, weeklyRate: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Client Notes & Requirements</label>
                <div className={`flex gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                  <FileText size={16} className={`shrink-0 mt-1 ${darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'}`} />
                  <textarea 
                    rows={3}
                    className={`bg-transparent outline-none w-full text-sm font-bold resize-none custom-scrollbar ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                    placeholder="Describe the kind of project the client wants, specific needs, or any important notes..."
                    value={formData.note}
                    onChange={e => setFormData({...formData, note: e.target.value})}
                  />
                </div>
              </div>
            </div>


          </form>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t flex justify-end gap-3 ${darkMode ? 'bg-black border-gray-800' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800'}`}>
          <button 
            type="button" 
            onClick={onClose} 
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${darkMode ? 'text-gray-400 hover:bg-black hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:text-white'}`}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="client-form"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {clientToEdit ? 'Save Changes' : 'Add Client'}
          </button>
        </div>
      </div>
    </div>
  );
}
