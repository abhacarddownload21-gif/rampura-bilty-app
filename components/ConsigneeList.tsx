
import React, { useState } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';

interface ConsigneeListProps {
  consignees: string[];
  onUpdate: (consignees: string[]) => void;
}

const ConsigneeList: React.FC<ConsigneeListProps> = ({ consignees, onUpdate }) => {
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    if (consignees.includes(newName.trim())) return;
    onUpdate([newName.trim(), ...consignees]);
    setNewName('');
  };

  const handleDelete = (name: string) => {
    onUpdate(consignees.filter(c => c !== name));
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="p-2 bg-slate-100 rounded-full text-slate-600"><Users className="w-6 h-6" /></span>
          <h2 className="text-xl font-bold text-slate-800">प्राप्तकर्ता सूची (पाने वाला)</h2>
        </div>

        <div className="flex gap-2 mb-6">
          <input 
            placeholder="नया नाम जोड़ें"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-slate-300"
          />
          <button 
            onClick={handleAdd}
            className="px-4 py-2 bg-[#0c243c] text-white rounded-md flex items-center gap-2 font-bold hover:bg-[#163a5d]"
          >
            <Plus className="w-5 h-5" /> जोड़ें
          </button>
        </div>

        <div className="space-y-2">
          {consignees.map((name, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-md border border-slate-100 group">
              <span className="font-bold text-slate-700">{name}</span>
              <button 
                onClick={() => handleDelete(name)}
                className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {consignees.length === 0 && (
            <div className="text-center py-10 text-slate-400">कोई प्राप्तकर्ता नहीं मिला</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsigneeList;
