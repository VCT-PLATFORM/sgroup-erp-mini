/**
 * DealTracker — Tiến Độ Giao Dịch
 * Connected to useDeals hook with real pipeline management
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, Modal, TextInput } from 'react-native';
import { ShoppingBag, Clock, FileText, CheckCircle2, ChevronRight, Calculator, AlertCircle, Plus, X } from 'lucide-react-native';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { SGButton, SGPlanningSectionTitle } from '../../../../shared/ui/components';
import { useDeals, Deal, DealStage } from '../../hooks/useDeals';

const STAGE_CONFIG: Record<DealStage, { label: string; color: string; bg: string; icon: any }> = {
  LEAD: { label: 'LEAD', color: '#94a3b8', bg: '#f1f5f9', icon: Clock },
  MEETING: { label: 'HẸN GẶP', color: '#6366f1', bg: '#eef2ff', icon: Clock },
  BOOKING: { label: 'GIỮ CHỖ', color: '#8b5cf6', bg: '#f5f3ff', icon: Clock },
  DEPOSIT: { label: 'ĐẶT CỌC', color: '#f59e0b', bg: '#fffbeb', icon: Calculator },
  CONTRACT: { label: 'KÝ HĐMB', color: '#3b82f6', bg: '#eff6ff', icon: FileText },
  COMPLETED: { label: 'HOÀN TẤT', color: '#16a34a', bg: '#dcfce7', icon: CheckCircle2 },
  CANCELLED: { label: 'ĐÃ HỦY', color: '#dc2626', bg: '#fee2e2', icon: AlertCircle },
};

const STAGE_FLOW: DealStage[] = ['LEAD', 'MEETING', 'BOOKING', 'DEPOSIT', 'CONTRACT', 'COMPLETED'];

export function DealTracker() {
  const { theme, isDark } = useAppTheme();
  const cText = theme.colors.textPrimary;
  const cSub = theme.colors.textSecondary;
  const [filterStage, setFilterStage] = useState<DealStage | 'ALL'>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeal, setNewDeal] = useState({ customerName: '', customerPhone: '', projectName: '', productCode: '', dealValue: '', feeRate: '2' });

  const { deals, loading, createDeal, updateDeal } = useDeals();

  const filtered = filterStage === 'ALL' ? deals : deals.filter(d => d.stage === filterStage);
  const pendingCount = deals.filter(d => d.stage === 'DEPOSIT').length;

  const handleAdvanceStage = async (deal: Deal) => {
    const idx = STAGE_FLOW.indexOf(deal.stage);
    if (idx >= 0 && idx < STAGE_FLOW.length - 1) {
      await updateDeal(deal.id, { stage: STAGE_FLOW[idx + 1] });
    }
  };

  const handleCreateDeal = async () => {
    if (!newDeal.customerName || !newDeal.dealValue) return;
    const now = new Date();
    await createDeal({
      customerName: newDeal.customerName,
      customerPhone: newDeal.customerPhone,
      projectName: newDeal.projectName,
      productCode: newDeal.productCode,
      dealValue: parseFloat(newDeal.dealValue),
      feeRate: parseFloat(newDeal.feeRate || '2'),
      commission: parseFloat(newDeal.dealValue) * parseFloat(newDeal.feeRate || '2') / 100,
      stage: 'LEAD',
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      status: 'ACTIVE',
      source: 'MANUAL',
    });
    setNewDeal({ customerName: '', customerPhone: '', projectName: '', productCode: '', dealValue: '', feeRate: '2' });
    setShowCreateModal(false);
  };

  const cardStyle: any = {
    backgroundColor: isDark ? 'rgba(20,24,35,0.45)' : '#fff', borderRadius: 24, padding: 32,
    borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(20px)' } : {}),
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.colors.background : theme.colors.backgroundAlt }}>
      <ScrollView contentContainerStyle={{ padding: 32, gap: 32, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', marginBottom: 4 }}>Quản lý hợp đồng</Text>
            <Text style={{ fontSize: 28, fontWeight: '900', color: cText, letterSpacing: -0.5 }}>Tiến Độ Giao Dịch</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: cSub, marginTop: 4 }}>
              {deals.length} giao dịch • {deals.reduce((s, d) => s + d.dealValue, 0).toFixed(1)} Tỷ GMV
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowCreateModal(true)} style={{
            flexDirection: 'row', alignItems: 'center', gap: 8, height: 48, paddingHorizontal: 24,
            borderRadius: 16, backgroundColor: '#3b82f6',
          }}>
            <Plus size={18} color="#fff" strokeWidth={3} />
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>Tạo Giao Dịch</Text>
          </TouchableOpacity>
        </View>

        {/* Stage Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          <TouchableOpacity onPress={() => setFilterStage('ALL')} style={{
            paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14,
            backgroundColor: filterStage === 'ALL' ? '#1e293b' : (isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'),
            borderWidth: 1, borderColor: filterStage === 'ALL' ? '#1e293b' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
          }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: filterStage === 'ALL' ? '#fff' : cSub }}>Tất Cả ({deals.length})</Text>
          </TouchableOpacity>
          {STAGE_FLOW.map(stage => {
            const cfg = STAGE_CONFIG[stage];
            const count = deals.filter(d => d.stage === stage).length;
            return (
              <TouchableOpacity key={stage} onPress={() => setFilterStage(stage)} style={{
                paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 8,
                backgroundColor: filterStage === stage ? cfg.color : (isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'),
                borderWidth: 1, borderColor: filterStage === stage ? cfg.color : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
              }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: filterStage === stage ? '#fff' : cfg.color }} />
                <Text style={{ fontSize: 13, fontWeight: '700', color: filterStage === stage ? '#fff' : cSub }}>{cfg.label} ({count})</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Deal List */}
        <View style={[cardStyle, { flex: 1 }]}>
          <SGPlanningSectionTitle
            icon={ShoppingBag}
            title="Danh sách Giao dịch"
            accent="#3b82f6"
            badgeText={`${filtered.length} DEALS`}
            style={{ marginBottom: 24 }}
          />

          <View style={{ gap: 16 }}>
            {filtered.map(deal => {
              const cfg = STAGE_CONFIG[deal.stage] || STAGE_CONFIG.LEAD;
              const Icon = cfg.icon;
              const nextIdx = STAGE_FLOW.indexOf(deal.stage);
              const canAdvance = nextIdx >= 0 && nextIdx < STAGE_FLOW.length - 1;
              return (
                <View key={deal.id} style={{
                  flexDirection: 'row',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                  borderRadius: 20, padding: 20, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                  alignItems: 'center'
                }}>
                  <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: isDark ? `${cfg.color}15` : cfg.bg, alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
                    <Icon size={28} color={cfg.color} />
                  </View>

                  <View style={{ flex: 2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <Text style={{ fontSize: 18, fontWeight: '900', color: cText }}>{deal.productCode || deal.dealCode}</Text>
                      <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: isDark ? `${cfg.color}20` : cfg.bg, borderWidth: 1, borderColor: `${cfg.color}30` }}>
                        <Text style={{ fontSize: 11, fontWeight: '800', color: cfg.color, letterSpacing: 0.3 }}>{cfg.label}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748b' }}>
                      {deal.projectName} <Text style={{ color: '#cbd5e1' }}>•</Text> {deal.customerPhone}
                    </Text>
                  </View>

                  <View style={{ flex: 1.5 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Khách Hàng</Text>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: cText }}>{deal.customerName}</Text>
                  </View>

                  <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Giá Trị</Text>
                    <Text style={{ fontSize: 20, fontWeight: '900', color: '#10b981' }}>{deal.dealValue} <Text style={{ fontSize: 14, fontWeight: '700' }}>Tỷ</Text></Text>
                  </View>

                  <View style={{ marginLeft: 24, minWidth: 140, alignItems: 'flex-end' }}>
                    {canAdvance ? (
                      <SGButton
                        title={`→ ${STAGE_CONFIG[STAGE_FLOW[nextIdx + 1]].label}`}
                        onPress={() => handleAdvanceStage(deal)}
                        style={{ backgroundColor: '#10b981', borderRadius: 12, height: 40, paddingHorizontal: 16 }}
                      />
                    ) : deal.stage === 'COMPLETED' ? (
                      <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#dcfce7' }}>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: '#16a34a' }}>✓ HOÀN TẤT</Text>
                      </View>
                    ) : (
                      <ChevronRight size={24} color={isDark ? '#475569' : '#cbd5e1'} />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Create Deal Modal */}
      {showCreateModal && (
        <Modal transparent animationType="fade" visible onRequestClose={() => setShowCreateModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' } as any}>
            <View style={[cardStyle, { width: '90%', maxWidth: 520, padding: 32, borderRadius: 28 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <Text style={{ fontSize: 22, fontWeight: '900', color: cText }}>Tạo Giao Dịch Mới</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)} style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} color={cSub} />
                </TouchableOpacity>
              </View>

              {[
                { key: 'customerName', label: 'Tên Khách Hàng *', placeholder: 'Nguyễn Văn A' },
                { key: 'customerPhone', label: 'SĐT', placeholder: '0901 234 567' },
                { key: 'projectName', label: 'Dự Án', placeholder: 'Vinhomes Ocean Park' },
                { key: 'productCode', label: 'Mã Căn', placeholder: 'S4.01-1205' },
                { key: 'dealValue', label: 'Giá Trị (Tỷ) *', placeholder: '3.5' },
                { key: 'feeRate', label: 'Phí MG (%)', placeholder: '2' },
              ].map(f => (
                <View key={f.key} style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: cSub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{f.label}</Text>
                  <TextInput
                    value={(newDeal as any)[f.key]}
                    onChangeText={v => setNewDeal(prev => ({ ...prev, [f.key]: v }))}
                    placeholder={f.placeholder}
                    placeholderTextColor="#94a3b8"
                    keyboardType={f.key === 'dealValue' || f.key === 'feeRate' ? 'numeric' : 'default'}
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                      borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                      fontSize: 14, fontWeight: '600', color: cText,
                      borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                      outlineStyle: 'none',
                    } as any}
                  />
                </View>
              ))}

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                <TouchableOpacity onPress={() => setShowCreateModal(false)} style={{
                  flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: cSub }}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreateDeal} style={{
                  flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b82f6',
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>Tạo Giao Dịch</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
