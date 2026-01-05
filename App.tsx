
import React, { useState, useEffect } from 'react';
import { BiltyData, initialBiltyData, Firm, defaultFirm } from './types';
import BiltyForm from './components/BiltyForm';
import BiltyPreview from './components/BiltyPreview';
import SettingsModal from './components/SettingsModal';
import ConsigneeList from './components/ConsigneeList';
import { History, Users, Settings, Plus, Truck, Download, FileText, Save } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'history' | 'consignees'>('new');
  const [firms, setFirms] = useState<Firm[]>([defaultFirm]);
  const [activeFirmId, setActiveFirmId] = useState<string>(defaultFirm.id);
  const [consignees, setConsignees] = useState<string[]>([]);
  const [biltyHistory, setBiltyHistory] = useState<BiltyData[]>([]);
  const [currentBilty, setCurrentBilty] = useState<BiltyData>(initialBiltyData(defaultFirm.id));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    const storedFirms = localStorage.getItem('rb_firms');
    const storedActiveFirm = localStorage.getItem('rb_activeFirm');
    const storedConsignees = localStorage.getItem('rb_consignees');
    const storedHistory = localStorage.getItem('rb_history');

    if (storedFirms) setFirms(JSON.parse(storedFirms));
    if (storedActiveFirm) setActiveFirmId(storedActiveFirm);
    if (storedConsignees) setConsignees(JSON.parse(storedConsignees));
    if (storedHistory) {
      try {
        setBiltyHistory(JSON.parse(storedHistory));
      } catch (e) {
        setBiltyHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rb_firms', JSON.stringify(firms));
    localStorage.setItem('rb_activeFirm', activeFirmId);
    localStorage.setItem('rb_consignees', JSON.stringify(consignees));
    localStorage.setItem('rb_history', JSON.stringify(biltyHistory));
  }, [firms, activeFirmId, consignees, biltyHistory]);

  const activeFirm = firms.find(f => f.id === activeFirmId) || firms[0];

  const handleUpdateFirms = (updatedFirms: Firm[], activeId: string) => {
    setFirms(updatedFirms);
    setActiveFirmId(activeId);
  };

  const handleSaveBilty = () => {
    const existingIndex = biltyHistory.findIndex(b => b.id === currentBilty.id);
    let newHistory = [...biltyHistory];
    if (existingIndex > -1) {
      newHistory[existingIndex] = { ...currentBilty };
    } else {
      newHistory = [{ ...currentBilty }, ...biltyHistory];
    }
    setBiltyHistory(newHistory);
    alert("बिल्टी सुरक्षित कर ली गई है!");
  };

  const handleDownloadPDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    
    // Smooth transition to top for capturing
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const element = document.getElementById('pdf-target-inner');
      if (!element) throw new Error("Preview element missing");

      // Professional Capture Settings for A6 high-res
      const canvas = await html2canvas(element, {
        scale: 4, // 4x scale for crisp text (improves screenshot quality significantly)
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 397,
        height: 559,
        windowWidth: 397,
        windowHeight: 559,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a6', // Strictly A6 for transport billing
        compress: true,
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, 105, 148);
      pdf.save(`Rampura_Bilty_${currentBilty.biltyNumber}.pdf`);
    } catch (error) {
      console.error(error);
      alert("PDF बनाने में त्रुटि हुई।");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditFromHistory = (bilty: BiltyData) => {
    setCurrentBilty({ ...bilty });
    setActiveTab('new');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#0c243c] text-white py-5 px-6 sticky top-0 z-[100] no-print shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('new')}>
            <div className="bg-white/10 p-2 rounded-lg">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black font-devanagari leading-none">रामपुरा बिल्टी</h1>
              <p className="text-[10px] text-blue-200 mt-1 uppercase tracking-widest font-bold">आधुनिक प्रबंधन प्रणाली</p>
            </div>
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg transition-all font-bold text-sm">
            <Settings className="w-5 h-5" /> सेटिंग्स
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto w-full flex-1 p-4 md:p-6 mt-2">
        <nav className="flex gap-1 bg-white border border-slate-200 p-1 rounded-xl mb-6 no-print shadow-sm">
          {[
            { id: 'new', label: 'नई बिल्टी', icon: FileText },
            { id: 'history', label: 'इतिहास', icon: History },
            { id: 'consignees', label: 'प्राप्तकर्ता', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-slate-100 text-[#0c243c] shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </nav>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px]">
          {activeTab === 'new' && (
            <div className="p-0">
              <BiltyForm 
                data={currentBilty} 
                consignees={consignees} 
                onChange={setCurrentBilty} 
                onSave={handleSaveBilty} 
                onDownload={handleDownloadPDF} 
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0c243c] text-[11px] font-black uppercase text-blue-100">
                  <tr><th className="px-6 py-4">नम्बर</th><th className="px-6 py-4">दिनांक</th><th className="px-6 py-4">प्राप्तकर्ता</th><th className="px-6 py-4 text-right">कार्रवाई</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {biltyHistory.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#0c243c]">#{b.biltyNumber}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(b.date).toLocaleDateString('hi-IN')}</td>
                      <td className="px-6 py-4 font-bold">{b.consigneeName}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEditFromHistory(b)} className="bg-slate-100 text-[#0c243c] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0c243c] hover:text-white transition-all">एडिट</button>
                      </td>
                    </tr>
                  ))}
                  {biltyHistory.length === 0 && <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest">इतिहास खाली है</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'consignees' && <ConsigneeList consignees={consignees} onUpdate={setConsignees} />}
        </div>
      </div>

      <footer className="bg-slate-100 py-10 mt-10 text-center border-t border-slate-200 no-print">
         <p className="text-[#0c243c] font-black tracking-widest font-devanagari text-sm">॥ श्री गणेशाय नम: ॥</p>
         <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase">Rampura Bilty - {activeFirm.name}</p>
      </footer>

      {/* HIDDEN TARGET FOR PDF CAPTURE */}
      <div style={{ position: 'fixed', left: '-5000px', top: '0', pointerEvents: 'none', zIndex: -1 }}>
        <div id="pdf-target-inner" style={{ width: '397px', height: '559px', backgroundColor: 'white', overflow: 'hidden' }}>
          <BiltyPreview data={currentBilty} firm={activeFirm} />
        </div>
      </div>

      {isSettingsOpen && <SettingsModal firms={firms} activeFirmId={activeFirmId} onClose={() => setIsSettingsOpen(false)} onUpdateFirms={handleUpdateFirms} />}
      
      {isGenerating && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[1000] flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0c243c]/20 border-t-[#0c243c] rounded-full animate-spin"></div>
          <h3 className="text-[#0c243c] text-xl font-black uppercase tracking-widest font-devanagari">PDF तैयार की जा रही है...</h3>
        </div>
      )}
    </div>
  );
};

export default App;
