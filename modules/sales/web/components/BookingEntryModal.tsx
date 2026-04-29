import React, { useState, useEffect } from 'react';
import { BookmarkPlus, X, CheckCircle2, User, Building2, Phone, DollarSign, MessageSquare, ChevronDown, CreditCard, Image as ImageIcon, FileText, Upload, Trash2, Hash, Home, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { salesOpsApi } from '../api/salesApi';
import { useToastActions } from './shared/Toast';
import { useSalesRole } from './shared/RoleContext';

export interface BookingEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editData?: any;
}

export function BookingEntryModal({ isOpen, onClose, onSuccess, editData }: BookingEntryModalProps) {
  const PROJECTS = ['SGroup Royal City', 'Vinhomes Grand Park', 'Eco Green Saigon', 'Aqua City'];
  const { role } = useSalesRole();
  const isAdmin = role === 'admin';

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [projectName, setProjectName] = useState(PROJECTS[0]);
  const [unitCode, setUnitCode] = useState('');
  const [bookingCount, setBookingCount] = useState(1);
  const [bookingSTT, setBookingSTT] = useState('');
  const [bookingAmount, setBookingAmount] = useState(50000000);
  const [note, setNote] = useState('');

  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);

  const [isConverting, setIsConverting] = useState(false);
  const [customerConfirmImg, setCustomerConfirmImg] = useState<string | null>(null);
  const [ceoConfirmImg, setCeoConfirmImg] = useState<string | null>(null);

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
      setBookingCount(editData.bookingCount || 1);
      setBookingSTT(editData.bookingSTT || '');
      setBookingAmount(editData.bookingAmount || 50000000);
      setNote(editData.note || '');
      setIdFront(editData.idFront || null);
      setIdBack(editData.idBack || null);
      setPaymentProof(editData.paymentProof || null);
      setIsConverting(false);
      setCustomerConfirmImg(null);
      setCeoConfirmImg(null);
    } else if (!isOpen) {
      setTimeout(() => {
        setSuccess(false);
        setCustomerName('');
        setCustomerPhone('');
        setIdNumber('');
        setProjectName(PROJECTS[0]);
        setUnitCode('');
        setBookingCount(1);
        setBookingSTT('');
        setBookingAmount(50000000);
        setNote('');
        setIdFront(null);
        setIdBack(null);
        setPaymentProof(null);
        setIsConverting(false);
        setCustomerConfirmImg(null);
        setCeoConfirmImg(null);
      }, 300);
    }
  }, [isOpen, editData]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!customerName) {
      toast.error('Vui lòng nhập Tên KH'); return;
    }

    if (isConverting && (!customerConfirmImg || !ceoConfirmImg)) {
      toast.error('Vui lòng bổ sung minh chứng xác nhận từ Khách hàng và TGĐ.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName,
        customerPhone,
        idNumber,
        unitCode,
        projectName,
        bookingCount,
        bookingSTT,
        bookingAmount,
        idFront,
        idBack,
        paymentProof,
        note,
        status: isConverting ? 'DEPOSIT' : (editData?.status || 'PENDING'),
        customerConfirmImg,
        ceoConfirmImg,
        convertedAt: isConverting ? new Date().toISOString() : undefined
      };

      if (editData) {
        await salesOpsApi.updateBooking(editData.id, payload);
        toast.success(isConverting ? 'Đã chuyển sang Đặt cọc thành công!' : 'Đã cập nhật phiếu thành công!');
      } else {
        await salesOpsApi.createBooking(payload);
        toast.success('Đã tạo phiếu thành công!');
      }

      setSuccess(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err: any) {
      toast.error(err?.message || 'Lỗi hệ thống.');
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
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <BookmarkPlus size={28} />
            </div>
            <div>
              <h2 className="text-[24px] font-black text-sg-heading tracking-tight">
                {editData ? 'Chỉnh Sửa Giữ Chỗ' : 'Tạo Giữ Chỗ (Booking)'}
              </h2>
              <p className="text-[13px] font-bold text-sg-muted mt-1">
                {editData ? 'Cập nhật lại giao dịch giữ chỗ' : 'Tạo mới giao dịch giữ chỗ BĐS • Vui lòng nhập đủ thông tin'}
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
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
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
                  <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                  <span className="text-[12px] font-black uppercase tracking-widest text-sg-muted">Thông tin giữ chỗ</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <SearchableSelect label="Dự Án" icon={<Building2 size={16} />} options={PROJECTS} value={projectName} onChange={setProjectName} />
                  <InputGroup label="Mã căn" icon={<Home size={16} />} value={unitCode} onChange={setUnitCode} placeholder="VD: A1.02.05" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <InputGroup label="Số lượng giữ chỗ" icon={<BookmarkPlus size={16} />} value={bookingCount} onChange={(val: string) => setBookingCount(parseInt(val) || 1)} type="number" />
                  <InputGroup label="Số thứ tự (STT)" icon={<Hash size={16} />} value={bookingSTT} onChange={setBookingSTT} placeholder={isAdmin ? "Nhập STT" : "Chờ Admin nhập..."} disabled={!isAdmin} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black tracking-wider text-sg-muted uppercase flex items-center justify-between">
                    <span>Số Tiền Giữ Chỗ (VNĐ)</span>
                    <span className="text-blue-500 text-[14px] font-black">{(bookingAmount / 1e6).toFixed(0)} Triệu</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2"><DollarSign size={20} className="text-blue-500" /></div>
                    <input type="text" value={bookingAmount > 0 ? new Intl.NumberFormat('vi-VN').format(bookingAmount) : ''} onChange={(e) => {
                      const numericValue = parseInt(e.target.value.replace(/\D/g, ''), 10);
                      setBookingAmount(isNaN(numericValue) ? 0 : numericValue);
                    }} className="w-full h-14 pl-12 pr-4 rounded-2xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 text-[18px] font-black text-blue-600 dark:text-blue-400 focus:outline-none" />
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
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-black tracking-wider text-sg-muted uppercase">Ghi chú giao dịch</label>
                <div className="relative group">
                  <div className="absolute left-4 top-4"><MessageSquare size={16} className="text-sg-muted" /></div>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Lưu ý về tiến độ thanh toán..." className="w-full h-24 pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-sg-border/50 text-[13px] font-medium resize-none focus:outline-none focus:border-blue-500/40" />
                </div>
              </div>

              {editData && editData.status !== 'DEPOSIT' && (
                <div className="pt-4 border-t border-sg-border/50">
                  {!isConverting ? (
                    <button type="button" onClick={() => setIsConverting(true)} className="w-full h-12 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 font-black text-[14px] flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-white transition-all active:scale-[0.98]">
                      <ArrowRightLeft size={16} /> Chuyển Sang Đặt Cọc
                    </button>
                  ) : (
                    <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600"><ShieldCheck size={20} /></div>
                          <div>
                            <p className="text-[14px] font-black text-sg-heading tracking-tight">Xác nhận chuyển cọc</p>
                            <p className="text-[11px] font-bold text-amber-600/70">Bổ sung minh chứng bắt buộc</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FileUploader label="Tin nhắn xác nhận của Khách" icon={<MessageSquare size={16} />} value={customerConfirmImg} onChange={setCustomerConfirmImg} />
                          <FileUploader label="Tin nhắn xác nhận của Tổng Giám Đốc" icon={<ShieldCheck size={16} />} value={ceoConfirmImg} onChange={setCeoConfirmImg} />
                        </div>
                        <button type="button" onClick={() => setIsConverting(false)} className="mt-3 text-[11px] font-black text-sg-muted hover:text-rose-500 transition-colors uppercase tracking-widest mx-auto block">Hủy chuyển cọc</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className={`flex-1 h-14 rounded-2xl text-white font-black text-[16px] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${submitting ? 'bg-slate-400' : isConverting ? 'bg-linear-to-r from-amber-500 to-orange-600' : 'bg-linear-to-r from-blue-600 to-indigo-700'
                  }`}>
                  {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                    <>
                      {isConverting ? <CheckCircle2 size={20} /> : <BookmarkPlus size={20} />}
                      {isConverting ? 'XÁC NHẬN CHUYỂN CỌC' : editData ? 'LƯU THAY ĐỔI' : 'XÁC NHẬN TẠO GIỮ CHỖ'}
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
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} className={`w-full h-12 pl-12 pr-4 rounded-xl border text-[13px] font-bold transition-all ${disabled ? 'bg-slate-100 border-sg-border/30 text-sg-muted cursor-not-allowed' : 'bg-slate-50 border-sg-border/50 text-sg-heading focus:border-blue-500/50'
          }`} />
      </div>
    </div>
  );
}

function FileUploader({ label, icon, value, onChange, isFullWidth }: any) {
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
      <div className={`relative h-24 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 ${value ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-sg-border/40 bg-slate-50 hover:border-blue-500/40'
        }`}>
        {value ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-[12px]">{icon} <span>Đã chọn tệp</span></div>
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
        <input type="text" onFocus={() => { setIsOpen(true); setSearchTerm(''); }} onBlur={() => setTimeout(() => setIsOpen(false), 200)} value={isOpen ? searchTerm : value} onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); }} placeholder={value || 'Tìm hoặc chọn...'} className="w-full h-12 pl-12 pr-10 rounded-xl border bg-slate-50 border-sg-border/50 text-[13px] font-bold focus:outline-none focus:border-blue-500/50" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-white border border-sg-border rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto">
          {filteredOptions.map((opt: string) => (
            <div key={opt} onMouseDown={() => { onChange(opt); setIsOpen(false); }} className={`px-4 py-2.5 mx-2 rounded-xl cursor-pointer text-[13px] font-bold ${value === opt ? 'bg-blue-500/10 text-blue-600' : 'text-sg-heading hover:bg-slate-100'}`}>{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}
