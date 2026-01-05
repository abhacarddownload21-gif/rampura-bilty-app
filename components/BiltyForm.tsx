
import React from 'react';
import { BiltyData, BiltyMarking } from '../types';
import { Trash2, Plus, Users, Clock, Calendar, DollarSign, Save, Download } from 'lucide-react';
import { numberToHindiWords } from '../utils/hindiNumbers';

interface BiltyFormProps {
  data: BiltyData;
  consignees: string[];
  onChange: (data: BiltyData) => void;
  onSave: () => void;
  onDownload: () => void;
}

const BiltyForm: React.FC<BiltyFormProps> = ({ data, consignees, onChange, onSave, onDownload }) => {
  const updateData = (field: keyof BiltyData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleMarkingChange = (index: number, field: keyof BiltyMarking, value: string) => {
    const newMarkings = [...data.markings];
    newMarkings[index] = { ...newMarkings[index], [field]: value };
    updateData('markings', newMarkings);
  };

  const addMarkingRow = () => {
    const newId = Date.now().toString();
    updateData('markings', [...data.markings, { id: newId, katta: '', marka1: '', theli: '', marka2: '' }]);
  };

  const removeMarkingRow = (index: number) => {
    if (data.markings.length <= 1) return;
    const newMarkings = data.markings.filter((_, i) => i !== index);
    updateData('markings', newMarkings);
  };

  const totalKatta = data.markings.reduce((sum, m) => sum + (parseInt(m.katta) || 0), 0);
  const freightValue = (data.weightTons || 0) * (data.ratePerTon || 0);
  const totalFreight = freightValue + (data.inam || 0) + (data.paaniChantai || 0);
  const balance = totalFreight - (data.advance || 0);

  const labelClass = "text-sm font-bold text-slate-600 mb-1.5 block font-devanagari";
  const inputClass = "w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-[#0c243c] focus:bg-white transition-all";
  
  return (
    <div className="flex flex-col h-full bg-white font-devanagari">
      {/* Number & Date Row */}
      <div className="p-6 grid grid-cols-2 gap-6 border-b border-slate-100">
        <div className="space-y-1">
          <label className={labelClass}>नम्बर</label>
          <input type="text" value={data.biltyNumber} onChange={(e) => updateData('biltyNumber', e.target.value)} className={inputClass} placeholder="नम्बर लिखें" />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>दिनांक</label>
          <div className="relative">
            <input type="date" value={data.date} onChange={(e) => updateData('date', e.target.value)} className={`${inputClass} pl-10`} />
            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Consignee Section */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <label className={labelClass}>पाने वाला</label>
          <Users className="w-4 h-4 text-slate-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select 
            value={data.consigneeName} 
            onChange={(e) => updateData('consigneeName', e.target.value)} 
            className={inputClass}
          >
            <option value="">प्राप्तकर्ता चुनें या नया जोड़ें</option>
            {consignees.map((name, i) => <option key={i} value={name}>{name}</option>)}
          </select>
          <input 
            type="text" 
            placeholder="या नाम टाइप करें" 
            value={data.consigneeName} 
            onChange={(e) => updateData('consigneeName', e.target.value)} 
            className={inputClass} 
          />
        </div>
      </div>

      {/* Basic Info Fields */}
      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>माल का नाम</label>
          <input type="text" placeholder="माल का विवरण" value={data.itemName} onChange={(e) => updateData('itemName', e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>कुल कट्टे</label>
          <input type="number" readOnly value={totalKatta} className={`${inputClass} bg-slate-100 cursor-not-allowed`} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>गाड़ी नं.</label>
          <input type="text" placeholder="RJ 00 XX 0000" value={data.vehicleNumber} onChange={(e) => updateData('vehicleNumber', e.target.value)} className={`${inputClass} uppercase`} />
        </div>
      </div>

      {/* Markings Table with Navy Header */}
      <div className="px-6 pb-6">
        <div className="bg-[#0c243c] text-white py-2 px-4 rounded-t-lg text-center text-sm font-black tracking-widest uppercase font-devanagari">
          थोक निम्न प्रकार
        </div>
        <div className="border border-slate-200 border-t-0 rounded-b-lg overflow-hidden shadow-inner">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-2 text-center">कट्टा</th>
                <th className="py-3 px-2 text-center">मार्का</th>
                <th className="py-3 px-2 text-center">थैली</th>
                <th className="py-3 px-2 text-center">मार्का</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.markings.map((m, i) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-all">
                  <td className="p-1"><input value={m.katta} onChange={(e) => handleMarkingChange(i, 'katta', e.target.value)} className="w-full text-center bg-transparent py-2 font-bold text-[#0c243c] outline-none" /></td>
                  <td className="p-1"><input value={m.marka1} onChange={(e) => handleMarkingChange(i, 'marka1', e.target.value)} className="w-full text-center bg-transparent py-2 font-bold outline-none" /></td>
                  <td className="p-1"><input value={m.theli} onChange={(e) => handleMarkingChange(i, 'theli', e.target.value)} className="w-full text-center bg-transparent py-2 font-bold text-[#0c243c] outline-none" /></td>
                  <td className="p-1"><input value={m.marka2} onChange={(e) => handleMarkingChange(i, 'marka2', e.target.value)} className="w-full text-center bg-transparent py-2 font-bold outline-none" /></td>
                  <td className="p-1 text-center"><button onClick={() => removeMarkingRow(i)} className="p-2 text-red-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addMarkingRow} className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold uppercase flex items-center justify-center gap-2 border-t border-slate-200 transition-all">
            <Plus className="w-3.5 h-3.5" /> और जोड़ें
          </button>
        </div>
      </div>

      {/* Calculator with Navy Header */}
      <div className="px-6 pb-6">
        <div className="bg-[#0c243c] text-white py-2 px-4 rounded-t-lg text-center text-sm font-black tracking-widest uppercase font-devanagari">
          भाड़ा प्रति टन कैलकुलेटर
        </div>
        <div className="border border-slate-200 border-t-0 rounded-b-lg p-6 space-y-4 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="col-span-1 md:col-span-2 space-y-1">
              <label className={labelClass}>ड्राईवर मो. नं.</label>
              <input type="text" placeholder="मोबाइल नंबर" value={data.mobileNumber} onChange={(e) => updateData('mobileNumber', e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>वजन (टन)</label>
              <input type="number" value={data.weightTons || ''} onChange={(e) => updateData('weightTons', parseFloat(e.target.value))} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>रेट/टन</label>
              <input type="number" value={data.ratePerTon || ''} onChange={(e) => updateData('ratePerTon', parseFloat(e.target.value))} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>भाड़ा</label>
              <input type="text" readOnly value={freightValue} className={`${inputClass} bg-slate-100`} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>ईनाम</label>
              <input type="number" value={data.inam || ''} onChange={(e) => updateData('inam', parseFloat(e.target.value))} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>पानी छंटाई</label>
              <input type="number" value={data.paaniChantai || ''} onChange={(e) => updateData('paaniChantai', parseFloat(e.target.value))} className={inputClass} />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-1">
              <label className={labelClass}>कुल भाड़ा</label>
              <input type="text" readOnly value={totalFreight} className={`${inputClass} bg-slate-100 font-black`} />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-1">
              <label className={labelClass}>एडवान्स</label>
              <input type="number" value={data.advance || ''} onChange={(e) => updateData('advance', parseFloat(e.target.value))} className={inputClass} />
            </div>
          </div>
          
          <div className="bg-amber-100 border-2 border-amber-300 p-4 rounded-xl flex justify-between items-center shadow-md mt-4 transition-all hover:shadow-lg">
            <span className="text-[#0c243c] text-lg font-black font-devanagari">बाकी भाड़ा</span>
            <span className="text-[#0c243c] text-xl font-black">₹ {balance.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Words and Notes Section */}
      <div className="px-6 pb-8 space-y-6">
        <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100 space-y-6 shadow-sm">
           <div className="space-y-1">
             <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">अक्षरे रुपये :</p>
             <p className="text-lg font-black text-[#0c243c] italic leading-tight font-devanagari">
               {numberToHindiWords(balance)} मात्र
             </p>
           </div>
           
           <div className="h-[1px] bg-slate-200 w-full"></div>
           
           <div className="space-y-4">
             <p className="text-xs font-bold text-[#0c243c] uppercase tracking-widest">नोट :-</p>
             <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-[#0c243c]">
               <span>दिनांक</span>
               <div className="relative">
                 <input type="date" value={data.noteDate} onChange={(e) => updateData('noteDate', e.target.value)} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold" />
                 <Calendar className="absolute right-2 top-1.5 w-3 h-3 text-slate-300 pointer-events-none" />
               </div>
               <span>को</span>
               <select value={data.notePeriod} onChange={(e) => updateData('notePeriod', e.target.value)} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold appearance-none pr-8 relative">
                 <option value="सुबह">सुबह</option>
                 <option value="दोपहर">दोपहर</option>
                 <option value="शाम">शाम</option>
                 <option value="रात">रात</option>
               </select>
               <div className="relative">
                 <input type="time" value={data.noteTime} onChange={(e) => updateData('noteTime', e.target.value)} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold" />
                 <Clock className="absolute right-2 top-1.5 w-3 h-3 text-slate-300 pointer-events-none" />
               </div>
               <span>बजे पहुंचने पर</span>
               <input type="text" placeholder="राशि" value={data.noteInam} onChange={(e) => updateData('noteInam', e.target.value)} className="w-20 px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold placeholder:font-normal" />
               <span>रुपये ईनाम दे देना सा।</span>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
             <div className="space-y-1">
               <label className={labelClass}>लिखने वाला (हस्ताक्षर)</label>
               <input type="text" placeholder="नाम लिखें" value={data.writerName} onChange={(e) => updateData('writerName', e.target.value)} className={inputClass} />
             </div>
             <div className="space-y-1">
               <label className={labelClass}>टिप्पणी / विशेष नोट</label>
               <input type="text" placeholder="कोई अतिरिक्त जानकारी" value={data.extraRemark} onChange={(e) => updateData('extraRemark', e.target.value)} className={inputClass} />
             </div>
           </div>
        </div>
      </div>

      {/* Save and Download Buttons */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border-t border-slate-100">
        <button 
          onClick={onSave} 
          className="bg-[#0c243c] hover:bg-[#163a5d] text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-md active:scale-95"
        >
          <Save className="w-5 h-5" /> सेव करें
        </button>
        <button 
          onClick={onDownload} 
          className="bg-amber-100 hover:bg-amber-200 border border-amber-300 text-[#0c243c] py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-sm active:scale-95"
        >
          <Download className="w-5 h-5" /> PDF डाउनलोड
        </button>
      </div>
    </div>
  );
};

export default BiltyForm;
