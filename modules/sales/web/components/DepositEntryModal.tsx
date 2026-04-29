import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, CheckCircle2, User, Building2, Phone, DollarSign, MessageSquare, ChevronDown, Key, CreditCard, BookmarkPlus, Hash, Image as ImageIcon, FileText, Upload, Trash2 } from 'lucide-react';
import { salesOpsApi } from '../api/salesApi';
import { useToastActions } from './shared/Toast';
import { useSalesRole } from './shared/RoleContext';

export interface DepositEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editData?: any;
  isAdmin?: boolean;
}

export function DepositEntryModal({ isOpen, onClose, onSuccess, editData, isAdmin = false }: DepositEntryModalProps) {
  const PROJECTS = ['SGroup Royal City', 'Vinhomes Grand Park', 'Eco Green Saigon', 'Aqua City'];
  const { role } = useSalesRole();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [projectName, setProjectName] = useState(PROJECTS[0]);
  const [unitCode, setUnitCode] = useState('');
  const [depositAmount, setDepositAmount] = useState(100000000); // 100M default
  const [price, setPrice] = useState(0);
  const [note, setNote] = useState('');
  
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [customerConfirm, setCustomerConfirm] = useState<string | null>(null);
  const [ceoConfirm, setCeoConfirm] = useState<string | null>(null);
  
  const [status, setStatus] = useState('Chờ Xác Nhận');
  const [isAgreementSigned, setIsAgreementSigned] = useState(false);
  const [isContractSigned, setIsContractSigned] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const toast = useToastActions();

  useEffect(() => {
    if (isOpen && editData) {
      setCustomerName(editData.customerName || '');
      setCustomerPhone(editData.customerPhone || '');
      setIdNumber(editData.idNumber || '');
      setProjectName(editData.projectName || PROJECTS[0]);
      setUnitCode(editData.unitCode || '');
      setDepositAmount(editData.depositAmount || 100000000);
      setPrice(editData.price || 0);
      setNote(editData.note || '');
      setIdFront(editData.idFront || null);
      setIdBack(editData.idBack || null);
      setPaymentProof(editData.paymentProof || null);
      setCustomerConfirm(editData.customerConfirm || null);
      setCeoConfirm(editData.ceoConfirm || null);
      
      const statusMap: Record<string, string> = { PENDING: 'Chờ Xác Nhận', CONFIRMED: 'Đã Nhận Cọc', COMPLETED: 'Đã Hoàn Tất Hồ Sơ' };
      setStatus(statusMap[editData.status] || 'Chờ Xác Nhận');
      setIsAgreementSigned(editData.isAgreementSigned || false);
      setIsContractSigned(editData.isContractSigned || false);
    } else if (!isOpen) {
      setTimeout(() => {
        setSuccess(false);
        setCustomerName('');
        setCustomerPhone('');
        setIdNumber('');
        setProjectName(PROJECTS[0]);
        setUnitCode('');
        setDepositAmount(100000000);
        setPrice(0);
        setNote('');
        setIdFront(null);
        setIdBack(null);
        setPaymentProof(null);
        setCustomerConfirm(null);
        setCeoConfirm(null);
        setStatus('Chờ Xác Nhận');
        setIsAgreementSigned(false);
        setIsContractSigned(false);
      }, 300);
    }
  }, [isOpen, editData]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    if (!customerName) {
      toast.error('Vui lòng nhập Tên KH'); return;
    }
    if (!unitCode) {
      toast.error('Vui lòng nhập Mã Căn'); return;
    }
    
    setSubmitting(true);
    try {
      const reverseStatusMap: Record<string, string> = { 'Chờ Xác Nhận': 'PENDING', 'Đã Nhận Cọc': 'CONFIRMED', 'Đã Hoàn Tất Hồ Sơ': 'COMPLETED' };
      const payload = {
        customerName,
        customerPhone,
        idNumber,
        unitCode,
        projectName,
        depositAmount,
        price,
        idFront,
        idBack,
        paymentProof,
        customerConfirm,
        ceoConfirm,
        note,
        status: reverseStatusMap[status] || 'PENDING',
        isAgreementSigned,
        isContractSigned
      };
      
      if (editData) {
        await salesOpsApi.updateDeposit(editData.id, payload);
        toast.success('Đã cập nhật thẻ Đặt cọc thành công!');
      } else {
        await salesOpsApi.createDeposit(payload);
        toast.success('Đã tạo thẻ Đặt cọc thành công!');
      }
      
      setSuccess(true);
      if (onSuccess) onSuccess();
      
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error("Deposit API Error:", err);
      toast.error(err?.message || 'Lỗi thao tác Đặt cọc. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0b] rounded-[28px] border border-white/20 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar p-8">
          <button type="button" onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all text-sg-muted">
            <X size={20} />
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-orange-500/30">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h2 className="text-[24px] font-black text-sg-heading tracking-tight flex items-center gap-3">
                {editData ? 'Chỉnh Sửa Đặt Cọc' : 'Tạo Đặt Cọc Mới'}
                {editData?.source === 'BOOKING' ? (
                  <span className="px-2 py-1 rounded-md text-[10px] font-black text-indigo-500 bg-indigo-500/10 border border-indigo-500/20">Giữ chỗ ➝ Đặt cọc</span>
                ) : (
                  <span className="px-2 py-1 rounded-md text-[10px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">Khách hàng cọc mới</span>
                )}
              </h2>
              <p className="text-[13px] font-bold text-sg-muted mt-1">
                {editData ? 'Cập nhật giao dịch vào cọc BĐS' : 'Tạo mới giao dịch vào cọc BĐS • Vui lòng nhập đủ thông tin'}
              </p>
            </div>
          </div>

          {success ? (
            <div className="py-20 flex flex-col items-center justify-center text-emerald-500 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                <CheckCircle2 size={48} className="animate-in zoom-in duration-500" />
              </div>
              <h3 className="text-[20px] font-black tracking-tight">Hoàn tất giao dịch!</h3>
              <p className="mt-2 text-[14px] font-bold text-sg-muted">Dữ liệu đã được lưu vào hệ thống.</p>
            </div>
          ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <span className="text-[12px] font-black uppercase tracking-widest text-sg-muted">Thông tin khách hàng</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Họ và Tên *" icon={<User size={16} />} value={customerName} onChange={setCustomerName} placeholder="Nguyễn Văn A" />
                  <InputGroup label="Số Điện Thoại" icon={<Phone size={16} />} value={customerPhone} onChange={setCustomerPhone} placeholder="0901 234 567" />
                </div>
                <InputGroup label="Số CCCD / Hộ chiếu" icon={<CreditCard size={16} />} value={idNumber} onChange={setIdNumber} placeholder="Nhập 12 số CCCD hoặc mã hộ chiếu" />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-4 bg-amber-500 rounded-full" />
                  <span className="text-[12px] font-black uppercase tracking-widest text-sg-muted">Thông tin đặt cọc</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <SearchableSelect label="Dự Án" icon={<Building2 size={16} />} options={PROJECTS} value={projectName} onChange={setProjectName} />
                  <InputGroup label="Mã căn *" icon={<Key size={16} />} value={unitCode} onChange={setUnitCode} placeholder="VD: SH-01" />
                </div>
                
                <SearchableSelect 
                  label="Trạng thái" 
                  icon={<ShieldCheck size={16} />} 
                  options={['Chờ Xác Nhận', 'Đã Nhận Cọc', 'Đã Hoàn Tất Hồ Sơ']} 
                  value={status} 
                  onChange={setStatus} 
                />

                {status === 'Đã Hoàn Tất Hồ Sơ' && (
                  <div className="space-y-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-sg-border/50 transition-all animate-in fade-in slide-in-from-top-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${isAgreementSigned ? 'bg-blue-500 border-blue-500' : 'bg-white dark:bg-black/20 border-slate-300 dark:border-white/10 group-hover:border-blue-500'}`}>
                        {isAgreementSigned && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={isAgreementSigned} onChange={(e) => setIsAgreementSigned(e.target.checked)} />
                      <span className={`text-[13px] font-bold transition-colors ${isAgreementSigned ? 'text-blue-600 dark:text-blue-400' : 'text-sg-heading'}`}>Đã ký văn bản thỏa thuận</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${isContractSigned ? 'bg-blue-500 border-blue-500' : 'bg-white dark:bg-black/20 border-slate-300 dark:border-white/10 group-hover:border-blue-500'}`}>
                        {isContractSigned && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={isContractSigned} onChange={(e) => setIsContractSigned(e.target.checked)} />
                      <span className={`text-[13px] font-bold transition-colors ${isContractSigned ? 'text-blue-600 dark:text-blue-400' : 'text-sg-heading'}`}>Đã ký hợp đồng mua bán</span>
                    </label>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black tracking-wider text-sg-muted uppercase flex items-center justify-between">
                      <span>Giá Trị Sản Phẩm (VNĐ)</span>
                      <span className={isAdmin ? "text-blue-500 text-[14px] font-black" : "text-slate-400 text-[14px] font-black"}>{price >= 1e9 ? `${(price / 1e9).toFixed(1)} Tỷ` : price > 0 ? `${(price / 1e6).toFixed(0)} Triệu` : '0'}</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2"><DollarSign size={20} className={isAdmin ? "text-blue-500" : "text-slate-400"} /></div>
                      <input 
                        type="text" 
                        disabled={!isAdmin}
                        value={price > 0 ? new Intl.NumberFormat('vi-VN').format(price) : ''} 
                        onChange={(e) => {
                          const numericValue = parseInt(e.target.value.replace(/\D/g, ''), 10);
                          setPrice(isNaN(numericValue) ? 0 : numericValue);
                        }} 
                        className={`w-full h-14 pl-12 pr-4 rounded-2xl border text-[18px] font-black transition-all shadow-inner focus:outline-none ${isAdmin ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-70'}`} 
                        placeholder={isAdmin ? "0" : "Chưa có thông tin"} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black tracking-wider text-sg-muted uppercase flex items-center justify-between">
                      <span>Số Tiền Cọc (VNĐ)</span>
                      <span className="text-orange-500 text-[14px] font-black">{(depositAmount / 1e6).toFixed(0)} Triệu</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2"><DollarSign size={20} className="text-orange-500" /></div>
                      <input type="text" value={depositAmount > 0 ? new Intl.NumberFormat('vi-VN').format(depositAmount) : ''} onChange={(e) => {
                        const numericValue = parseInt(e.target.value.replace(/\D/g, ''), 10);
                        setDepositAmount(isNaN(numericValue) ? 0 : numericValue);
                      }} className="w-full h-14 pl-12 pr-4 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 text-[18px] font-black text-orange-600 dark:text-orange-400 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-inner" placeholder="0" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                  <span className="text-[12px] font-black uppercase tracking-widest text-sg-muted">Hồ sơ đính kèm</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FileUploader label="Mặt trước CCCD" icon={<ImageIcon size={16} />} value={idFront} onChange={setIdFront} />
                  <FileUploader label="Mặt sau CCCD" icon={<ImageIcon size={16} />} value={idBack} onChange={setIdBack} />
                </div>
                <FileUploader label="Ủy nhiệm chi (Bank Transfer)" icon={<FileText size={16} />} value={paymentProof} onChange={setPaymentProof} isFullWidth />
                <div className="grid grid-cols-2 gap-4">
                  <FileUploader label="Tin nhắn xác nhận KH" icon={<MessageSquare size={16} />} value={customerConfirm} onChange={setCustomerConfirm} accentColor="blue" />
                  <FileUploader label="Tin nhắn xác nhận TGĐ" icon={<ShieldCheck size={16} />} value={ceoConfirm} onChange={setCeoConfirm} accentColor="indigo" />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-black tracking-wider text-sg-muted uppercase">Ghi chú giao dịch</label>
                <div className="relative group">
                  <div className="absolute left-4 top-4"><MessageSquare size={16} className="text-sg-muted" /></div>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Thông tin thêm về quy trình đặt cọc..." className="w-full h-24 pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-sg-border/50 text-[13px] font-medium resize-none focus:outline-none focus:border-orange-500/40" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className={`flex-1 h-14 rounded-2xl text-white font-black text-[16px] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                  submitting ? 'bg-slate-400' : 'bg-linear-to-r from-orange-500 to-amber-600 hover:shadow-orange-500/30'
                }`}>
                  {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                    <>
                      <ShieldCheck size={20} />
                      {editData ? 'LƯU THAY ĐỔI' : 'TẠO ĐẶT CỌC'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, icon, value, onChange, placeholder, disabled, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black tracking-wider text-sg-muted uppercase block leading-tight">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sg-muted">{icon}</div>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} className={`w-full h-12 pl-12 pr-4 rounded-xl border text-[13px] font-bold transition-all ${
          disabled ? 'bg-slate-100 border-sg-border/30 text-sg-muted cursor-not-allowed' : 'bg-slate-50 border-sg-border/50 text-sg-heading focus:border-orange-500/50'
        }`} />
      </div>
    </div>
  );
}

function FileUploader({ label, icon, value, onChange, isFullWidth, accentColor }: any) {
  const accent = accentColor || 'orange';
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      onChange(fakeUrl);
    }
  };
  return (
    <div className={`space-y-2 ${isFullWidth ? 'col-span-2' : ''}`}>
      <label className="text-[11px] font-black tracking-wider text-sg-muted uppercase block leading-tight">{label}</label>
      <div className={`relative h-24 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 ${
        value ? `border-${accent}-500/30 bg-${accent}-500/5` : `border-sg-border/40 bg-slate-50 hover:border-${accent}-500/40`
      }`}>
        {value ? (
          <div className="flex flex-col items-center">
            <div className={`flex items-center gap-2 text-${accent}-600 font-bold text-[12px]`}>{icon} <span>Đã chọn tệp</span></div>
            <button type="button" onClick={() => onChange(null)} className="mt-1 text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1"><Trash2 size={10} /> Xóa tệp</button>
          </div>
        ) : (
          <><Upload size={16} className="text-sg-muted" /><span className="text-[11px] font-bold text-sg-muted">Bấm để tải lên</span></>
        )}
        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFile} accept="image/*,.pdf" />
      </div>
    </div>
  );
}

function SearchableSelect({ label, icon, options, value, onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredOptions = options.filter((o: string) => o.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div className="space-y-2 relative">
      <label className="text-[11px] font-black tracking-wider text-sg-muted uppercase block leading-tight">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-sg-muted">{icon}</div>
        <input type="text" onFocus={() => { setIsOpen(true); setSearchTerm(''); }} onBlur={() => setTimeout(() => setIsOpen(false), 200)} value={isOpen ? searchTerm : value} onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); }} placeholder={value || 'Tìm hoặc chọn...'} className="w-full h-12 pl-12 pr-10 rounded-xl border bg-slate-50 border-sg-border/50 text-[13px] font-bold focus:outline-none focus:border-orange-500/50" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-white border border-sg-border rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto">
          {filteredOptions.map((opt: string) => (
            <div key={opt} onMouseDown={() => { onChange(opt); setIsOpen(false); }} className={`px-4 py-2.5 mx-2 rounded-xl cursor-pointer text-[13px] font-bold ${value === opt ? 'bg-orange-500/10 text-orange-600' : 'text-sg-heading hover:bg-slate-100'}`}>{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}
