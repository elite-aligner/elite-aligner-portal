// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const STEPS = [
  { id: 1, title: 'Patient Information', titleAr: 'معلومات المريض' },
  { id: 2, title: 'Images & Impressions', titleAr: 'الصور والانطباعات' },
  { id: 3, title: 'Prescription', titleAr: 'الوصفة الطبية' },
  { id: 4, title: 'Terms & Agreement', titleAr: 'الشروط والاتفاقية' },
  { id: 5, title: 'Submission Completed', titleAr: 'تم الإرسال' },
];

const IMAGE_SLOTS = [
  { id: 'full-face-relaxed', label: 'Full Face Relaxed', labelAr: 'وجه كامل - استرخاء' },
  { id: 'full-face-smiling', label: 'Full Face Smiling', labelAr: 'وجه كامل - ابتسامة' },
  { id: 'profile-relaxed', label: 'Profile Relaxed', labelAr: 'جانبي - استرخاء' },
  { id: 'profile-smiling', label: 'Profile Smiling', labelAr: 'جانبي - ابتسامة' },
  { id: 'right-buccal', label: 'Right Buccal', labelAr: 'جيب أيمن' },
  { id: 'occlusion', label: 'Occlusion', labelAr: 'الإطباق' },
  { id: 'left-buccal', label: 'Left Buccal', labelAr: 'جيب أيسر' },
  { id: 'panoramic', label: 'Panoramic X-ray', labelAr: 'أشعة بانوراما' },
  { id: 'upper-occlusal', label: 'Upper Occlusal', labelAr: 'إطباق علوي' },
  { id: 'lower-occlusal', label: 'Lower Occlusal', labelAr: 'إطباق سفلي' },
  { id: 'extras', label: 'Extras', labelAr: 'إضافية' },
  { id: 'cephalometric', label: 'Cephalometric X-ray', labelAr: 'أشعة سيفالومترية' },
];

export default function NewCasePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [patientData, setPatientData] = useState({ firstName: '', lastName: '', fileNumber: '', gender: 'male', dob: '', address: '' });
  const [images, setImages] = useState<any>({});
  const [imageFiles, setImageFiles] = useState<any>({});
  const [impressions, setImpressions] = useState({ type: 'digital', upperStl: null as File | null, lowerStl: null as File | null, upperStlName: '', lowerStlName: '' });
  const [prescription, setPrescription] = useState({ treatArches: 'both', upperMidline: 'improve', lowerMidline: 'improve', overjet: 'improve', overbite: 'improve', canineRelationship: 'improve', molarRelationship: 'maintain', posteriorCrossbite: 'maintain', ipr: 'ifNeeded', attachments: 'ifNeeded', procline: 'ifNeeded', expand: 'ifNeeded', distalize: 'ifNeeded', chiefComplaint: '', additionalNotes: '', doNotMove: [] as number[], avoidAttachments: [] as number[], extract: [] as number[], keepSpaces: [] as number[] });
  const [agreed, setAgreed] = useState(false);

  const handleImageUpload = (slotId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => { setImages((prev: any) => ({ ...prev, [slotId]: reader.result })); setImageFiles((prev: any) => ({ ...prev, [slotId]: file })); };
    reader.readAsDataURL(file);
  };

  const handleStlUpload = (position: 'upper' | 'lower', file: File) => {
    if (position === 'upper') setImpressions(prev => ({ ...prev, upperStl: file, upperStlName: file.name }));
    else setImpressions(prev => ({ ...prev, lowerStl: file, lowerStlName: file.name }));
  };

  // ✅ إرسال عبر Supabase مباشرة (بدلاً من API Route)
  const handleSubmit = async () => {
    setUploading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    try {
      const { data, error } = await supabase
        .from('cases')
        .insert([{
          doctor_id: user.id,
          patient_name: `${patientData.firstName} ${patientData.lastName}`,
          status: 'pending',
          stage: 'submitted',
          case_type: prescription.treatArches || 'both',
          description: prescription.chiefComplaint || '',
          patient_age: 0,
          before_image_url: '',
          after_image_url: '',
          prescription: prescription,
          images: images,
          doctor_name: user.name,
          user_id: user.id,
          gender: patientData.gender,
          dob: patientData.dob,
          file_number: patientData.fileNumber,
          upper_stl_url: impressions.upperStlName || '',
          lower_stl_url: impressions.lowerStlName || '',
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      console.log('Case created:', data);
      setCurrentStep(5);
    } catch (error: any) {
      console.error('Submit error:', error);
      alert('حدث خطأ أثناء الإرسال: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label><input type="text" value={patientData.firstName} onChange={(e) => setPatientData({...patientData, firstName: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="First Name" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label><input type="text" value={patientData.lastName} onChange={(e) => setPatientData({...patientData, lastName: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Last Name" /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">File Number (Optional)</label><input type="text" value={patientData.fileNumber} onChange={(e) => setPatientData({...patientData, fileNumber: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Enter file number" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Gender</label><select value={patientData.gender} onChange={(e) => setPatientData({...patientData, gender: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"><option value="male">Male</option><option value="female">Female</option></select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label><input type="date" value={patientData.dob} onChange={(e) => setPatientData({...patientData, dob: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label><textarea value={patientData.address} onChange={(e) => setPatientData({...patientData, address: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none h-20 resize-none" placeholder="Enter shipping address" /></div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Images</h3>
        <div className="grid grid-cols-4 gap-4">
          {IMAGE_SLOTS.map((slot) => (
            <div key={slot.id} className="relative">
              <div className={`aspect-square rounded-lg border-2 border-dashed ${images[slot.id] ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'} flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors overflow-hidden`}>
                {images[slot.id] ? <img src={images[slot.id]} alt={slot.label} className="w-full h-full object-cover" /> : <><svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg><span className="text-xs text-gray-500 text-center px-2">{slot.labelAr}</span></>}
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(slot.id, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Impressions</h3>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2"><input type="radio" checked={impressions.type === 'digital'} onChange={() => setImpressions({...impressions, type: 'digital'})} className="text-green-500" /><span>Digital</span></label>
          <label className="flex items-center gap-2"><input type="radio" checked={impressions.type === 'physical'} onChange={() => setImpressions({...impressions, type: 'physical'})} className="text-green-500" /><span>Physical</span></label>
        </div>
        {impressions.type === 'digital' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
              <h4 className="font-medium text-gray-700 mb-2">Upper Impression</h4>
              <p className="text-sm text-gray-500 mb-2">{impressions.upperStlName || 'Upload 3D Scan'}</p>
              {impressions.upperStlName && <p className="text-xs text-green-600 mb-2">✓ {impressions.upperStlName}</p>}
              <input type="file" accept=".stl,.obj,.ply" onChange={(e) => e.target.files?.[0] && handleStlUpload('upper', e.target.files[0])} className="hidden" id="upper-stl" />
              <label htmlFor="upper-stl" className="px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600 inline-block">{impressions.upperStlName ? 'Change File' : 'Choose File'}</label>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
              <h4 className="font-medium text-gray-700 mb-2">Lower Impression</h4>
              <p className="text-sm text-gray-500 mb-2">{impressions.lowerStlName || 'Upload 3D Scan'}</p>
              {impressions.lowerStlName && <p className="text-xs text-green-600 mb-2">✓ {impressions.lowerStlName}</p>}
              <input type="file" accept=".stl,.obj,.ply" onChange={(e) => e.target.files?.[0] && handleStlUpload('lower', e.target.files[0])} className="hidden" id="lower-stl" />
              <label htmlFor="lower-stl" className="px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600 inline-block">{impressions.lowerStlName ? 'Change File' : 'Choose File'}</label>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Prescription</h3>
      <div className="grid grid-cols-2 gap-4">
        {[{ key: 'treatArches', label: 'Treat Arches', options: ['both', 'upper', 'lower'] }, { key: 'upperMidline', label: 'Upper Midline', options: ['improve', 'maintain', 'center'] }, { key: 'lowerMidline', label: 'Lower Midline', options: ['improve', 'maintain', 'center'] }, { key: 'overjet', label: 'Overjet', options: ['improve', 'maintain'] }, { key: 'overbite', label: 'Overbite', options: ['improve', 'maintain'] }, { key: 'canineRelationship', label: 'Canine Relationship', options: ['improve', 'maintain'] }, { key: 'molarRelationship', label: 'Molar Relationship', options: ['maintain', 'improve'] }, { key: 'posteriorCrossbite', label: 'Posterior Crossbite', options: ['maintain', 'correct'] }, { key: 'ipr', label: 'IPR', options: ['ifNeeded', 'none', 'all'] }, { key: 'attachments', label: 'Attachments', options: ['ifNeeded', 'none', 'all'] }, { key: 'procline', label: 'Procline', options: ['ifNeeded', 'none'] }, { key: 'expand', label: 'Expand', options: ['ifNeeded', 'none'] }, { key: 'distalize', label: 'Distalize', options: ['ifNeeded', 'none'] }].map((field) => (
          <div key={field.key}><label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label><select value={prescription[field.key as keyof typeof prescription] as string} onChange={(e) => setPrescription({...prescription, [field.key]: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">{field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
        ))}
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint</label><textarea value={prescription.chiefComplaint} onChange={(e) => setPrescription({...prescription, chiefComplaint: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none h-20 resize-none" placeholder="الرجاء عمل خطة علاجية مناسبة" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label><textarea value={prescription.additionalNotes} onChange={(e) => setPrescription({...prescription, additionalNotes: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none h-20 resize-none" placeholder="ملاحظات إضافية" /></div>
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-bold text-gray-900 mb-4">Teeth Selection</h4>
        <div className="grid grid-cols-2 gap-8">
          <div><h5 className="text-sm font-medium text-gray-700 mb-2">Do Not Move These Teeth</h5><div className="flex flex-wrap gap-1">{Array.from({length: 32}, (_, i) => i + 1).map((tooth) => <button key={tooth} onClick={() => { const current = prescription.doNotMove; setPrescription({...prescription, doNotMove: current.includes(tooth) ? current.filter(t => t !== tooth) : [...current, tooth]}); }} className={`w-8 h-8 rounded text-xs font-medium ${prescription.doNotMove.includes(tooth) ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{tooth}</button>)}</div></div>
          <div><h5 className="text-sm font-medium text-gray-700 mb-2">Avoid Attachments Teeth</h5><div className="flex flex-wrap gap-1">{Array.from({length: 32}, (_, i) => i + 1).map((tooth) => <button key={tooth} onClick={() => { const current = prescription.avoidAttachments; setPrescription({...prescription, avoidAttachments: current.includes(tooth) ? current.filter(t => t !== tooth) : [...current, tooth]}); }} className={`w-8 h-8 rounded text-xs font-medium ${prescription.avoidAttachments.includes(tooth) ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{tooth}</button>)}</div></div>
          <div><h5 className="text-sm font-medium text-gray-700 mb-2">Extract Teeth</h5><div className="flex flex-wrap gap-1">{Array.from({length: 32}, (_, i) => i + 1).map((tooth) => <button key={tooth} onClick={() => { const current = prescription.extract; setPrescription({...prescription, extract: current.includes(tooth) ? current.filter(t => t !== tooth) : [...current, tooth]}); }} className={`w-8 h-8 rounded text-xs font-medium ${prescription.extract.includes(tooth) ? 'bg-red-700 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{tooth}</button>)}</div></div>
          <div><h5 className="text-sm font-medium text-gray-700 mb-2">Keep Spaces For These Teeth</h5><div className="flex flex-wrap gap-1">{Array.from({length: 32}, (_, i) => i + 1).map((tooth) => <button key={tooth} onClick={() => { const current = prescription.keepSpaces; setPrescription({...prescription, keepSpaces: current.includes(tooth) ? current.filter(t => t !== tooth) : [...current, tooth]}); }} className={`w-8 h-8 rounded text-xs font-medium ${prescription.keepSpaces.includes(tooth) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{tooth}</button>)}</div></div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Terms & Agreement</h3>
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h4 className="font-medium text-gray-900">Terms and Conditions</h4>
        <p className="text-sm text-gray-600 leading-relaxed">By submitting this case, you agree to the following terms:</p>
        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
          <li>All patient information provided is accurate and complete.</li>
          <li>The digital scans/images provided are of diagnostic quality.</li>
          <li>You have obtained proper patient consent for treatment.</li>
          <li>You understand the treatment plan may be modified based on clinical evaluation.</li>
          <li>Delivery times are estimates and may vary based on case complexity.</li>
        </ul>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-5 h-5 text-green-500 rounded focus:ring-green-500" />
        <span className="text-sm text-gray-700">I agree to the terms and conditions</span>
      </label>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Submission Completed!</h2>
      <p className="text-gray-600 mb-8">Your case has been submitted successfully.</p>
      <div className="flex gap-4 justify-center">
        <button onClick={() => router.push('/doctor')} className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Go to Dashboard</button>
        <button onClick={() => { setCurrentStep(1); setPatientData({ firstName: '', lastName: '', fileNumber: '', gender: 'male', dob: '', address: '' }); setImages({}); setImageFiles({}); setImpressions({ type: 'digital', upperStl: null, lowerStl: null, upperStlName: '', lowerStlName: '' }); setAgreed(false); }} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Submit Another Case</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3"><img src="/logo.png" alt="Elite Aligner" className="w-10 h-10 rounded-full bg-white" /><h1 className="text-lg font-bold">Elite Aligner</h1></div>
          <button onClick={() => router.push('/doctor')} className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm">العودة</button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Case Submission</h1>
        <div className="flex mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex-1 relative">
              <div className={`flex items-center ${index < STEPS.length - 1 ? 'after:content-[""] after:absolute after:top-1/2 after:left-1/2 after:w-full after:h-0.5 after:bg-gray-200' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold relative z-10 ${currentStep > step.id ? 'bg-green-500 text-white' : currentStep === step.id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{currentStep > step.id ? '✓' : step.id}</div>
              </div>
              <p className={`text-xs mt-2 text-center ${currentStep >= step.id ? 'text-green-600 font-medium' : 'text-gray-400'}`}>{step.title}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>
        {currentStep < 5 && (
          <div className="flex justify-between mt-6">
            <button onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50">Previous</button>
            {currentStep === 4 ? (
              <button onClick={handleSubmit} disabled={!agreed || uploading} className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2">
                {uploading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {uploading ? 'جاري الإرسال...' : 'Submit Case'}
              </button>
            ) : (
              <button onClick={() => setCurrentStep(currentStep + 1)} className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Continue</button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}