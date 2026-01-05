
import React from 'react';
import { BiltyData, Firm } from '../types';
import { numberToHindiWords } from '../utils/hindiNumbers';

interface BiltyPreviewProps {
  data: BiltyData;
  firm: Firm;
}

const BiltyPreview: React.FC<BiltyPreviewProps> = ({ data, firm }) => {
  // Calculations
  const totalKatta = data.markings.reduce((sum, m) => sum + (parseInt(m.katta) || 0), 0);
  const totalTheli = data.markings.reduce((sum, m) => sum + (parseInt(m.theli) || 0), 0);
  const grandTotalItems = totalKatta + totalTheli;
  
  const freightValue = (data.weightTons || 0) * (data.ratePerTon || 0);
  const totalFreight = freightValue + (data.inam || 0) + (data.paaniChantai || 0);
  const balance = totalFreight - (data.advance || 0);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '.......................';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '.......................';
      return d.toLocaleDateString('hi-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return '.......................';
    }
  };

  return (
    <div className="bg-white p-4 flex flex-col font-devanagari text-slate-900 overflow-hidden select-none" style={{ width: '397px', height: '559px', boxSizing: 'border-box', border: '2px solid #0c243c' }}>
      <style>
        {`
          .receipt-table {
            width: 100%;
            border-collapse: collapse;
            margin: 4px 0;
            font-size: 8.5px;
          }
          .receipt-table th, .receipt-table td {
            border: 1px solid #0c243c;
            padding: 2px;
            text-align: center !important; /* Force centering as per user request */
            vertical-align: middle !important;
            line-height: 1;
            height: 24px; /* Increased height to prevent text touching borders */
            overflow: hidden;
          }
          .header h1 {
            margin: 0;
            color: #d32f2f;
            font-size: 24px;
            font-weight: 900;
            line-height: 1.1;
          }
          .header .blessing {
            font-size: 8px;
            font-weight: bold;
            line-height: 1.1;
            margin-bottom: 2px;
          }
          .header .address {
            font-size: 9px;
            color: #0c243c;
            font-weight: 800;
            margin-top: 2px;
            line-height: 1.2;
          }
          .header .contact {
            font-size: 8.5px;
            color: #475569;
            font-weight: 700;
            margin-top: 1px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 3px;
          }
          .meta-row {
            display: flex;
            justify-content: space-between;
            margin-top: 4px;
            font-size: 9.5px;
            font-weight: bold;
          }
          .consignee-section {
            margin: 4px 0;
            border-bottom: 1px dotted #cbd5e1;
            padding-bottom: 2px;
            font-size: 10px;
          }
          .note-container {
            background-color: #fefce8;
            border: 1px solid #fef08a;
            border-radius: 4px;
            padding: 5px;
            margin: 4px 0;
            font-size: 8.5px;
            line-height: 1.4;
          }
          .signature-area {
            margin-top: auto;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-bottom: 8px;
          }
          .title-tag {
            font-size: 10px;
            font-weight: 900;
            color: #0c243c;
            margin-bottom: 1px;
            text-align: left;
          }
        `}
      </style>
      
      {/* HEADER */}
      <div className="header text-center">
        <div className="blessing">
          ॥ श्री गणेशाय नमः ॥<br/>
          ॥ श्री भोमियाजी कृपा ॥
        </div>
        <h1>{firm.name}</h1>
        <div className="address">{firm.address}</div>
        <div className="contact">
          संपर्क: {firm.rightPhones} {firm.leftPhones ? `, ${firm.leftPhones}` : ''}
        </div>
      </div>

      {/* TOP META */}
      <div className="meta-row">
        <div>नम्बर: <span className="text-red-600 font-black">{data.biltyNumber || '1'}</span></div>
        <div>दिनांक: {formatDate(data.date)}</div>
      </div>

      <div className="consignee-section flex items-baseline gap-2">
        <span className="font-bold whitespace-nowrap">पाने वाला:</span>
        <span className="font-black text-[11px] flex-grow border-b border-slate-200 pb-0.5 min-h-[16px]">
          {data.consigneeName}
        </span>
      </div>

      <div className="meta-row mt-0 mb-1">
        <div className="flex-grow">माल: <span className="font-black">{data.itemName || '................'}</span></div>
        <div className="text-right">गाड़ी नं.: <span className="font-black uppercase">{data.vehicleNumber || '................'}</span></div>
      </div>

      {/* TABLES */}
      <div className="flex gap-3">
        {/* LEFT: QUANTITY */}
        <div className="w-[50%] flex flex-col">
          <div className="title-tag">मात्रा विवरण</div>
          <table className="receipt-table">
            <thead>
              <tr className="bg-slate-100 font-black">
                <th>कट्टा</th>
                <th>मार्का</th>
                <th>थैली</th>
                <th>मार्का</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td className="font-black">{data.markings[i]?.katta || ''}</td>
                  <td className="text-[7px] italic">{data.markings[i]?.marka1 || ''}</td>
                  <td className="font-black">{data.markings[i]?.theli || ''}</td>
                  <td className="text-[7px] italic">{data.markings[i]?.marka2 || ''}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-black">
                <td colSpan={4}>कुल नग: {grandTotalItems || 0}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-1 text-[8px] font-bold text-slate-500">
            ड्राइवर मो.: <span className="text-slate-900 font-black">{data.mobileNumber || '................'}</span>
          </div>
        </div>

        {/* RIGHT: CALCULATION */}
        <div className="w-[50%] flex flex-col">
          <div className="title-tag">गणना विवरण</div>
          <table className="receipt-table">
            <tbody>
              <tr>
                <td>वजन (टन)</td>
                <td>{data.weightTons || '0'}</td>
              </tr>
              <tr>
                <td>रेट/टन</td>
                <td>{data.ratePerTon || '0'}</td>
              </tr>
              <tr>
                <td>भाड़ा</td>
                <td>{Math.floor(freightValue).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>ईनाम</td>
                <td>{data.inam || '0'}</td>
              </tr>
              <tr className="bg-slate-50 font-black">
                <td>कुल भाड़ा</td>
                <td>{Math.floor(totalFreight).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>एडवान्स</td>
                <td>{data.advance || '0'}</td>
              </tr>
              <tr className="bg-red-50 text-red-600 font-black text-[10px]">
                <td className="text-red-700">बाकी</td>
                <td className="text-red-700 font-black">₹ {Math.floor(balance).toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER TEXT */}
      <div className="mt-1">
        <div className="text-[8px] font-bold text-amber-600 uppercase">अक्षरे रुपये :</div>
        <div className="text-[10.5px] font-black text-[#0c243c] italic border-b border-slate-100 pb-0.5 min-h-[14px]">
          {numberToHindiWords(Math.floor(balance))} रुपये मात्र
        </div>
        
        <div className="note-container">
          <div className="flex flex-wrap gap-x-1 items-center">
            <span className="font-black">नोट :-</span>
            <span>दिनांक</span>
            <span className="font-black border-b border-slate-400 px-1">{formatDate(data.noteDate)}</span>
            <span>को</span>
            <span className="font-black border-b border-slate-400 px-1">{data.notePeriod} {data.noteTime}</span>
            <span>बजे पहुंचने पर</span>
            <span className="text-red-600 font-black border-b border-slate-400 px-1">{data.noteInam || '0'}</span>
            <span>रुपये ईनाम दे देना सा।</span>
          </div>
          {data.extraRemark && (
            <div className="mt-1 text-[8px] text-slate-500 border-t border-amber-200 pt-0.5 italic">
              विशेष: {data.extraRemark}
            </div>
          )}
        </div>
      </div>

      {/* SIGNATURE SECTION */}
      <div className="signature-area">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-slate-400">लिखने वाला (हस्ताक्षर):</span>
          <span className="font-black text-[10.5px] border-b border-dotted border-slate-300 min-w-[110px] pb-0.5 mt-1">
            {data.writerName}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-bold text-slate-400">वास्ते:</span>
          <span className="font-black text-[11px] text-right mt-1">
            {firm.name}
          </span>
        </div>
      </div>
      
      {/* WATERMARK */}
      <div className="text-center opacity-30 text-[5px] tracking-[0.3em] font-black uppercase mt-1">
        RAMPURA BILTY LOGISTICS SYSTEM • JODHPUR
      </div>
    </div>
  );
};

export default BiltyPreview;
