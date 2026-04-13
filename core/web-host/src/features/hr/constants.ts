export const FILTER_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'ACTIVE', label: 'Đang làm' },
  { key: 'PROBATION', label: 'Thử việc' },
  { key: 'ON_LEAVE', label: 'Đang nghỉ' },
  { key: 'TERMINATED', label: 'Đã nghỉ' },
];

export const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Đang làm', color: 'text-emerald-500', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20' },
  { value: 'PROBATION', label: 'Thử việc', color: 'text-blue-500', bg: 'bg-blue-500/15', border: 'border-blue-500/20' },
  { value: 'ON_LEAVE', label: 'Đang nghỉ', color: 'text-amber-500', bg: 'bg-amber-500/15', border: 'border-amber-500/20' },
  { value: 'TERMINATED', label: 'Đã nghỉ', color: 'text-red-500', bg: 'bg-red-500/15', border: 'border-red-500/20' },
]; 

export const WORK_STATUS_OPTIONS = [
  { v: 'Đang làm việc', l: 'Đang làm việc' },
  { v: 'Thử việc', l: 'Thử việc' },
  { v: 'Đang nghỉ phép', l: 'Đang nghỉ phép' },
  { v: 'Đã nghỉ việc', l: 'Đã nghỉ việc' },
];

export const CANDIDATE_SOURCE_OPTIONS = [
  { v: 'LinkedIn', l: 'LinkedIn' },
  { v: 'TopCV', l: 'TopCV' },
  { v: 'VietnamWorks', l: 'VietnamWorks' },
  { v: 'Website công ty', l: 'Website công ty' },
  { v: 'Giới thiệu nội bộ', l: 'Giới thiệu nội bộ' },
  { v: 'Facebook', l: 'Facebook' },
  { v: 'Headhunter', l: 'Headhunter' },
  { v: 'Job Fair', l: 'Job Fair' },
  { v: 'Khác', l: 'Khác' },
];

export const EMPLOYMENT_TYPE_OPTIONS = [
  { v: 'Toàn thời gian', l: 'Toàn thời gian' },
  { v: 'Bán thời gian', l: 'Bán thời gian' },
  { v: 'Thực tập', l: 'Thực tập' },
  { v: 'Hợp đồng', l: 'Hợp đồng' },
  { v: 'Freelance', l: 'Freelance' },
];

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || 'U';
}

export function nameToColorClass(name: string) {
  const colors = [
    { text: 'text-pink-500', bg: 'bg-pink-500/15', border: 'border-pink-500/30' },
    { text: 'text-purple-500', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
    { text: 'text-blue-500', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
    { text: 'text-amber-500', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
    { text: 'text-emerald-500', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
    { text: 'text-cyan-500', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
    { text: 'text-indigo-500', bg: 'bg-indigo-500/15', border: 'border-indigo-500/30' },
    { text: 'text-rose-500', bg: 'bg-rose-500/15', border: 'border-rose-500/30' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export const EMPTY_FORM = {
  fullName: '',
  englishName: '',
  email: '',
  phone: '',
  departmentId: '',
  positionId: '',
  teamId: '',
  status: 'ACTIVE' as const,
};
