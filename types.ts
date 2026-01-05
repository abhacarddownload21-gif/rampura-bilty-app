
export interface BiltyMarking {
  id: string;
  katta: string;
  marka1: string;
  theli: string;
  marka2: string;
}

export interface Firm {
  id: string;
  name: string;
  address: string;
  leftPhones: string;
  rightPhones: string;
  leftName: string; // e.g., अमृत भाई
  rightName: string; // e.g., केवल भाई
  blessing: string;
}

export interface BiltyData {
  id: string;
  biltyNumber: string;
  date: string;
  consigneeName: string;
  itemName: string;
  vehicleNumber: string;
  mobileNumber: string;
  markings: BiltyMarking[];
  weightTons: number;
  ratePerTon: number;
  inam: number;
  paaniChantai: number;
  advance: number;
  noteDate: string;
  noteTime: string;
  notePeriod: string; // सुबह, दोपहर, शाम, रात
  noteInam: string;
  writerName: string;
  extraRemark: string;
  firmId: string;
}

export const defaultFirm: Firm = {
  id: 'firm-1',
  name: 'गहलोत एन्टरप्राईजेज',
  address: 'रामपुरा भाटियान, वाया-मथानिया जिला-जोधपुर (राज.)',
  leftPhones: '99286-46086, 70239-50491',
  rightPhones: '9166176829, 9929138244',
  leftName: 'अमृत भाई',
  rightName: 'केवल भाई',
  blessing: '॥ श्री गणेशाय नमः ॥\n॥ श्री भोमियाजी कृपा ॥'
};

export const initialBiltyData = (firmId: string): BiltyData => ({
  id: Date.now().toString(),
  biltyNumber: '1',
  date: new Date().toISOString().split('T')[0],
  consigneeName: '',
  itemName: '',
  vehicleNumber: '',
  mobileNumber: '',
  markings: [
    { id: '1', katta: '', marka1: '', theli: '', marka2: '' },
    { id: '2', katta: '', marka1: '', theli: '', marka2: '' },
    { id: '3', katta: '', marka1: '', theli: '', marka2: '' },
    { id: '4', katta: '', marka1: '', theli: '', marka2: '' }
  ],
  weightTons: 0,
  ratePerTon: 0,
  inam: 0,
  paaniChantai: 0,
  advance: 0,
  noteDate: new Date().toISOString().split('T')[0],
  noteTime: '14:05',
  notePeriod: 'दोपहर',
  noteInam: '',
  writerName: '',
  extraRemark: '',
  firmId
});
