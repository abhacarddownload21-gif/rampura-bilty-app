
import React, { useState } from 'react';
import { Firm } from '../types';
import { X, Plus, Trash2, Save } from 'lucide-react';

interface SettingsModalProps {
  firms: Firm[];
  activeFirmId: string;
  onClose: () => void;
  onUpdateFirms: (firms: Firm[], activeId: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ firms, activeFirmId, onClose, onUpdateFirms }) => {
  const [editingFirmId, setEditingFirmId] = useState(activeFirmId);
  const currentFirm = firms.find(f => f.id === editingFirmId) || firms[0];
  const [localFirm, setLocalFirm] = useState<Firm>(currentFirm);

  const handleFirmChange = (field: keyof Firm, value: string) => {
    setLocalFirm({ ...localFirm, [field]: value });
  };

  const handleAddNew = () => {
    const newId = `firm-${Date.now()}`;
    // Fix: Added missing leftName and rightName properties to conform to the Firm interface (line 24)
    const newFirm: Firm = {
      id: newId,
      name: 'नयी फर्म',
      address: '',
      leftPhones: '',
      rightPhones: '',
      leftName: '',
      rightName: '',
      blessing: '|| श्री गणेशाय नम: ||'
    };
    onUpdateFirms([...firms, newFirm], newId);
    setEditingFirmId(newId);
    setLocalFirm(newFirm);
  };

  const handleDelete = () => {
    if (firms.length <= 1) return;
    const newFirms = firms.filter(f => f.id !== localFirm.id);
    onUpdateFirms(newFirms, newFirms[0].id);
    setEditingFirmId(newFirms[0].id);
    setLocalFirm(newFirms[0]);
  };

  const handleSave = () => {
    const newFirms = firms.map(f => f.id === localFirm.id ? localFirm : f);
    onUpdateFirms(newFirms, localFirm.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 rounded text-slate-600"><Save className="w-5 h-5" /></span>
            <div>
              <h2 className="font-bold text-slate-800">फर्म प्रबंधन</h2>
              <p className="text-[10px] text-slate-400">फर्म बदलें या नई फर्म जोड़ें</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">एक्टिव फर्म चुनें</label>
            <div className="flex gap-2">
              <select 
                value={editingFirmId}
                onChange={(e) => {
                  const f = firms.find(firm => firm.id === e.target.value);
                  if (f) {
                    setEditingFirmId(f.id);
                    setLocalFirm(f);
                  }
                }}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm outline-none bg-slate-50"
              >
                {firms.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <button onClick={handleAddNew} className="p-2 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">फर्म का नाम</label>
              <input 
                value={localFirm.name}
                onChange={(e) => handleFirmChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">पता</label>
              <input 
                placeholder="पता"
                value={localFirm.address}
                onChange={(e) => handleFirmChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">बाएं फोन नंबर</label>
                <input 
                  value={localFirm.leftPhones}
                  onChange={(e) => handleFirmChange('leftPhones', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">बाएं नाम (उदा. अमृत भाई)</label>
                <input 
                  value={localFirm.leftName}
                  onChange={(e) => handleFirmChange('leftName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">दाएं फोन नंबर</label>
                <input 
                  value={localFirm.rightPhones}
                  onChange={(e) => handleFirmChange('rightPhones', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">दाएं नाम (उदा. केवल भाई)</label>
                <input 
                  value={localFirm.rightName}
                  onChange={(e) => handleFirmChange('rightName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">आशीर्वाद</label>
              <textarea 
                value={localFirm.blessing}
                onChange={(e) => handleFirmChange('blessing', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm h-20"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
          <button 
            onClick={handleDelete}
            className="w-full py-2 bg-red-500 text-white rounded-md text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> यह फर्म डिलीट करें
          </button>
          <button 
            onClick={handleSave}
            className="w-full py-2 bg-[#0c243c] text-white rounded-md text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#163a5d] transition-colors"
          >
            <Save className="w-4 h-4" /> सेव करें और एक्टिव बनाएं
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
