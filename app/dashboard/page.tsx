"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Users, FolderOpen, Clock, CheckCircle, Eye, Download, 
  Scan, Image, CheckSquare, Plus, Search, LogOut, Shield,
  X, Upload, Camera, FileCheck, Edit3, Link, ExternalLink
} from "lucide-react";

interface CaseItem {
  id: string;
  patient: string;
  status: string;
  stage: string;
  viewerUrl: string;
  upperStlUrl: string;
  lowerStlUrl: string;
  hasUpperSTL: boolean;
  hasLowerSTL: boolean;
  hasCTScan: boolean;
  hasPhoto: boolean;
  approved: boolean;
  notes?: string;
}

const mockCases: CaseItem[] = [
  {
    id: "EL-2026-001",
    patient: "أحمد محمد",
    status: "نشطة",
    stage: "5/20",
    viewerUrl: "https://viewer.creativealigner.com/access/demo1",
    upperStlUrl: "/files/demo-upper.stl",
    lowerStlUrl: "/files/demo-lower.stl",
    hasUpperSTL: true,
    hasLowerSTL: true,
    hasCTScan: true,
    hasPhoto: true,
    approved: false,
    notes: "حالة بسيطة",
  },
  {
    id: "EL-2026-002",
    patient: "سارة علي",
    status: "مكتملة",
    stage: "20/20",
    viewerUrl: "https://viewer.creativealigner.com/access/demo2",
    upperStlUrl: "/files/demo-upper.stl",
    lowerStlUrl: "/files/demo-lower.stl",
    hasUpperSTL: true,
    hasLowerSTL: true,
    hasCTScan: false,
    hasPhoto: true,
    approved: true,
    notes: "تمت بنجاح",
  },
  {
    id: "EL-2026-003",
    patient: "خالد عبدالله",
    status: "قيد الانتظار",
    stage: "0/20",
    viewerUrl: "https://viewer.creativealigner.com/access/demo3",
    upperStlUrl: "/files/demo-upper.stl",
    lowerStlUrl: "/files/demo-lower.stl",
    hasUpperSTL: false,
    hasLowerSTL: false,
    hasCTScan: true,
    hasPhoto: false,
    approved: false,
    notes: "ينتظر الموافقة",
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<CaseItem[]>(mockCases);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCase, setEditingCase] = useState<CaseItem | null>(null);
  
  const [upperSTL, setUpperSTL] = useState<File | null>(null);
  const [lowerSTL, setLowerSTL] = useState<File | null>(null);
  const [ctScan, setCtScan] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);

  const upperRef = useRef<HTMLInputElement>(null);
  const lowerRef = useRef<HTMLInputElement>(null);
  const ctRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("elite-aligner-user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("elite-aligner-user");
    window.location.href = "/login";
  };

  const handleApprove = (id: string) => {
    setCases(cases.map(c => c.id === id ? { ...c, approved: !c.approved } : c));
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الحالة؟")) {
      setCases(cases.filter(c => c.id !== id));
    }
  };

  const handleEdit = (caseItem: CaseItem) => {
    setEditingCase(caseItem);
    setShowEditModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const resetForm = () => {
    setUpperSTL(null);
    setLowerSTL(null);
    setCtScan(null);
    setPhotos([]);
    setEditingCase(null);
  };

  const exportToCSV = () => {
    const headers = ["رقم الحالة", "المريض", "الحالة", "المرحلة", "الموافقة", "ملاحظات"];
    const rows = cases.map(c => [c.id, c.patient, c.status, c.stage, c.approved ? "نعم" : "لا", c.notes || ""]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "elite-aligner-cases.csv";
    link.click();
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView3D = (viewerUrl: string) => {
    const url = `/viewer?url=${encodeURIComponent(viewerUrl)}`;
    window.open(url, '_blank', 'width=1400,height=900,top=50,left=50');
  };

  const filteredCases = cases.filter(c => 
    c.patient.includes(searchTerm) || c.id.includes(searchTerm)
  );

  const stats = {
    patients: cases.length,
    active: cases.filter(c => c.status === "نشطة").length,
    pending: cases.filter(c => c.status === "قيد الانتظار").length,
    completed: cases.filter(c => c.status === "مكتملة").length,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  const CaseFormModal = ({ isEdit }: { isEdit: boolean }) => {
    const patientRef = useRef<HTMLInputElement>(null);
    const idRef = useRef<HTMLInputElement>(null);
    const stageRef = useRef<HTMLInputElement>(null);
    const viewerUrlRef = useRef<HTMLInputElement>(null);
    const notesRef = useRef<HTMLTextAreaElement>(null);

    const handleSave = () => {
      const patient = patientRef.current?.value || "";
      const id = idRef.current?.value || "";
      const stage = stageRef.current?.value || "0/20";
      const viewerUrl = viewerUrlRef.current?.value || "";
      const notes = notesRef.current?.value || "";

      if (!patient) {
        alert("يرجى إدخال اسم المريض");
        return;
      }

      const caseId = id || `EL-2026-${String(cases.length + 1).padStart(3, '0')}`;
      
      const newCaseItem: CaseItem = {
        id: caseId,
        patient: patient,
        status: editingCase ? editingCase.status : "قيد الانتظار",
        stage: stage,
        viewerUrl: viewerUrl || `/files/demo-upper.stl`,
        upperStlUrl: `/files/cases/${caseId}/upper.stl`,
        lowerStlUrl: `/files/cases/${caseId}/lower.stl`,
        hasUpperSTL: !!upperSTL || (editingCase?.hasUpperSTL || false),
        hasLowerSTL: !!lowerSTL || (editingCase?.hasLowerSTL || false),
        hasCTScan: !!ctScan || (editingCase?.hasCTScan || false),
        hasPhoto: photos.length > 0 || (editingCase?.hasPhoto || false),
        approved: editingCase ? editingCase.approved : false,
        notes: notes,
      };

      if (editingCase) {
        setCases(cases.map(c => c.id === editingCase.id ? newCaseItem : c));
        setShowEditModal(false);
      } else {
        setCases([...cases, newCaseItem]);
        setShowAddModal(false);
      }
      
      resetForm();
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEdit ? "تعديل الحالة" : "إضافة حالة جديدة"}
            </h2>
            <button onClick={() => { isEdit ? setShowEditModal(false) : setShowAddModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المريض *</label>
                <input 
                  ref={patientRef}
                  type="text" 
                  defaultValue={isEdit ? editingCase?.patient : ""}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-right"
                  placeholder="اسم المريض الكامل"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الحالة</label>
                <input 
                  ref={idRef}
                  type="text" 
                  defaultValue={isEdit ? editingCase?.id : ""}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-right"
                  placeholder="EL-2026-00X"
                  disabled={isEdit}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المرحلة</label>
                <input 
                  ref={stageRef}
                  type="text" 
                  defaultValue={isEdit ? editingCase?.stage : "0/20"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-right"
                  placeholder="0/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط المشاهدة 3D</label>
                <input 
                  ref={viewerUrlRef}
                  type="text" 
                  defaultValue={isEdit ? editingCase?.viewerUrl : ""}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-right"
                  placeholder="https://viewer.creativealigner.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
              <textarea 
                ref={notesRef}
                defaultValue={isEdit ? editingCase?.notes : ""}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-right h-24 resize-none"
                placeholder="ملاحظات عن الحالة..."
              />
            </div>

            {!isEdit && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">الملفات المرفقة</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">فك علوي STL</label>
                  <div className="flex items-center gap-4">
                    <input type="file" ref={upperRef} accept=".stl,.obj" onChange={(e) => handleFileChange(e, setUpperSTL)} className="hidden" />
                    <button onClick={() => upperRef.current?.click()} className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Upload className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">{upperSTL ? upperSTL.name : "اختر ملف STL"}</span>
                    </button>
                    {upperSTL && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" />تم الرفع</span>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">فك سفلي STL</label>
                  <div className="flex items-center gap-4">
                    <input type="file" ref={lowerRef} accept=".stl,.obj" onChange={(e) => handleFileChange(e, setLowerSTL)} className="hidden" />
                    <button onClick={() => lowerRef.current?.click()} className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Upload className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">{lowerSTL ? lowerSTL.name : "اختر ملف STL"}</span>
                    </button>
                    {lowerSTL && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" />تم الرفع</span>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">CT Scan (DICOM)</label>
                  <div className="flex items-center gap-4">
                    <input type="file" ref={ctRef} accept=".dcm,.dicom,.zip" onChange={(e) => handleFileChange(e, setCtScan)} className="hidden" />
                    <button onClick={() => ctRef.current?.click()} className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Scan className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">{ctScan ? ctScan.name : "اختر ملف CT Scan"}</span>
                    </button>
                    {ctScan && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" />تم الرفع</span>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">صور المريض</label>
                  <div className="flex items-center gap-4">
                    <input type="file" ref={photoRef} accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
                    <button onClick={() => photoRef.current?.click()} className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Camera className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">{photos.length > 0 ? `${photos.length} صورة` : "اختر صور"}</span>
                    </button>
                    {photos.length > 0 && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" />تم الرفع</span>}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button 
                onClick={() => { isEdit ? setShowEditModal(false) : setShowAddModal(false); resetForm(); }}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                {isEdit ? "حفظ التعديلات" : "حفظ الحالة"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Elite <span className="text-blue-600">Aligner</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="h-4 w-4" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المرضى</p>
                <p className="text-3xl font-bold text-gray-900">{stats.patients}</p>
              </div>
              <Users className="h-10 w-10 text-blue-600 bg-blue-50 p-2 rounded-lg" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">حالات نشطة</p>
                <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <FolderOpen className="h-10 w-10 text-green-600 bg-green-50 p-2 rounded-lg" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">قيد الانتظار</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <Clock className="h-10 w-10 text-amber-600 bg-amber-50 p-2 rounded-lg" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مكتملة</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-purple-600 bg-purple-50 p-2 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن مريض أو رقم حالة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-right"
            />
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Plus className="h-5 w-5" />
            إضافة حالة جديدة
          </button>
          <button onClick={exportToCSV} className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
            <FileCheck className="h-5 w-5" />
            تصدير Excel
          </button>
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">رقم الحالة</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">المريض</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">الحالة</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">المرحلة</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">المشاهدة 3D</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">الملفات</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">الموافقة</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-900">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{caseItem.id}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <div>{caseItem.patient}</div>
                      {caseItem.notes && <div className="text-xs text-gray-400 mt-1">{caseItem.notes}</div>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        caseItem.status === "نشطة" ? "bg-green-100 text-green-700" :
                        caseItem.status === "مكتملة" ? "bg-purple-100 text-purple-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>{caseItem.status}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{caseItem.stage}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleView3D(caseItem.viewerUrl)} 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Eye className="h-4 w-4" />
                            عرض 3D
                          </button>
                          <button 
                            onClick={() => {
                              const newUrl = prompt('أدخل رابط المشاهدة 3D:', caseItem.viewerUrl);
                              if (newUrl !== null) {
                                setCases(cases.map(c => c.id === caseItem.id ? { ...c, viewerUrl: newUrl } : c));
                              }
                            }}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            title="تعديل رابط المشاهدة"
                          >
                            <Link className="h-4 w-4" />
                            رابط
                          </button>
                        </div>
                        {caseItem.viewerUrl && (
                          <span className="text-xs text-gray-500 truncate max-w-[200px]">
                            {caseItem.viewerUrl}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {caseItem.hasUpperSTL && (
                          <button
                            onClick={() => handleDownload(caseItem.upperStlUrl, `${caseItem.id}-upper.stl`)}
                            className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs"
                          >
                            <Download className="h-3 w-3" />
                            فك علوي STL
                          </button>
                        )}
                        {caseItem.hasLowerSTL && (
                          <button
                            onClick={() => handleDownload(caseItem.lowerStlUrl, `${caseItem.id}-lower.stl`)}
                            className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs"
                          >
                            <Download className="h-3 w-3" />
                            فك سفلي STL
                          </button>
                        )}
                        {caseItem.hasCTScan && (
                          <button
                            onClick={() => handleDownload(`/files/cases/${caseItem.id}/ct-scan.zip`, `${caseItem.id}-ct.zip`)}
                            className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs"
                          >
                            <Scan className="h-3 w-3" />
                            CT Scan
                          </button>
                        )}
                        {caseItem.hasPhoto && (
                          <button
                            onClick={() => handleDownload(`/files/cases/${caseItem.id}/photos.zip`, `${caseItem.id}-photos.zip`)}
                            className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs"
                          >
                            <Image className="h-3 w-3" />
                            صور
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => handleApprove(caseItem.id)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${caseItem.approved ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                        <CheckSquare className="h-4 w-4" />
                        {caseItem.approved ? "تمت الموافقة" : "موافقة"}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(caseItem)} className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-xs flex items-center gap-1">
                          <Edit3 className="h-3 w-3" />
                          تعديل
                        </button>
                        <button onClick={() => handleDelete(caseItem.id)} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-xs">
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && <CaseFormModal isEdit={false} />}
      {showEditModal && <CaseFormModal isEdit={true} />}
    </div>
  );
}