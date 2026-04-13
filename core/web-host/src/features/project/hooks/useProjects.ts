import { useState, useEffect } from 'react';
import { REProject, REInventory, RELegalDoc } from '../types';

const MOCK_RE_PROJECTS: REProject[] = [
  {
    id: 'proj-1',
    name: 'SGroup Riverside',
    code: 'SGR',
    description: 'Khu đô thị sinh thái ven sông với 500 biệt thự và nhà phố.',
    status: 'SELLING',
    type: 'VILLA',
    location: 'TP Thủ Đức, Hồ Chí Minh',
    developer: 'SGroup Holdings',
    totalUnits: 500,
    startDate: '2026-01-01',
    endDate: '2028-12-31',
    managerId: 'u1',
    managerName: 'Trần Văn A',
    teamSize: 15,
    progress: 35,
    createdAt: '2026-01-01T00:00:00Z',
    tags: ['Sinh thái', 'Nghỉ dưỡng', 'Ven sông']
  },
  {
    id: 'proj-2',
    name: 'SGroup Tower Downtown',
    code: 'SGT',
    description: 'Chung cư cao cấp hạng A tại trung tâm hành chính.',
    status: 'UPCOMING',
    type: 'APARTMENT',
    location: 'Quận 1, Hồ Chí Minh',
    developer: 'SGroup Invest',
    totalUnits: 320,
    startDate: '2026-06-01',
    endDate: '2029-06-01',
    managerId: 'u2',
    managerName: 'Lê Thị B',
    teamSize: 20,
    progress: 10,
    createdAt: '2026-02-15T00:00:00Z',
    tags: ['Trung tâm', 'Hạng A']
  },
  {
    id: 'proj-3',
    name: 'Mega Shophouse Complex',
    code: 'MSC',
    description: 'Tổ hợp shophouse thương mại, dịch vụ giải trí.',
    status: 'HANDOVER',
    type: 'SHOPHOUSE',
    location: 'Bình Dương',
    developer: 'SGroup Real Estate',
    totalUnits: 150,
    startDate: '2024-01-01',
    endDate: '2026-05-30',
    managerId: 'u3',
    managerName: 'Phạm Đức C',
    teamSize: 8,
    progress: 95,
    createdAt: '2024-01-10T00:00:00Z',
    tags: ['Thương mại', 'Giải trí']
  }
];

const MOCK_RE_INVENTORY: REInventory[] = Array.from({ length: 40 }).map((_, i) => {
  const isProj1 = i < 20;
  return {
    id: `inv-${i}`,
    projectId: isProj1 ? 'proj-1' : 'proj-2',
    code: isProj1 ? `V${Math.floor(i/5)+1}-${(i%5)+1}` : `A${Math.floor((i-20)/10)+1}-${((i-20)%10)+1}`,
    status: Math.random() > 0.6 ? 'AVAILABLE' : Math.random() > 0.5 ? 'SOLD' : 'RESERVED',
    type: isProj1 ? 'VILLA' : 'APARTMENT',
    area: isProj1 ? 250 + Math.random()*100 : 60 + Math.random()*40,
    direction: ['Đông', 'Tây', 'Nam', 'Bắc', 'Đông Nam', 'Tây Bắc'][Math.floor(Math.random()*6)],
    price: isProj1 ? 15000000000 + Math.random()*5000000000 : 3000000000 + Math.random()*2000000000,
  }
});

const MOCK_RE_LEGAL: RELegalDoc[] = [
  {
    id: 'leg-1',
    projectId: 'proj-1',
    title: 'Giấy phép xây dựng phân khu 1',
    description: 'GPXD cho 100 căn biệt thự ven sông.',
    status: 'APPROVED',
    approveDate: '2026-03-01',
    assigneeName: 'Nguyễn Văn Pháp'
  },
  {
    id: 'leg-2',
    projectId: 'proj-1',
    title: 'Phê duyệt 1/500 điều chỉnh',
    description: 'Chờ Sở Xây Dựng phản hồi.',
    status: 'SUBMITTED',
    submitDate: '2026-04-01',
    assigneeName: 'Nguyễn Văn Pháp'
  },
  {
    id: 'leg-3',
    projectId: 'proj-2',
    title: 'Thẩm định thiết kế cơ sở',
    description: 'Chuẩn bị hồ sơ nộp Bộ Xây dựng.',
    status: 'PREPARATION',
    assigneeName: 'Trần Thị Lý'
  }
];

export function useProjects() {
  const [data, setData] = useState<REProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(MOCK_RE_PROJECTS);
      setLoading(false);
    }, 400);
  }, []);

  return { data, loading };
}

export function useInventory(projectId?: string) {
  const [data, setData] = useState<REInventory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const db = projectId ? MOCK_RE_INVENTORY.filter(i => i.projectId === projectId) : MOCK_RE_INVENTORY;
      setData(db);
      setLoading(false);
    }, 300);
  }, [projectId]);

  return { data, loading };
}

export function useLegalDocs(projectId?: string) {
  const [data, setData] = useState<RELegalDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const db = projectId ? MOCK_RE_LEGAL.filter(i => i.projectId === projectId) : MOCK_RE_LEGAL;
      setData(db);
      setLoading(false);
    }, 300);
  }, [projectId]);

  return { data, loading };
}
