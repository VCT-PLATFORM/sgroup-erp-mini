# SGROUP ERP Design Tokens V1 — Neo-Corporate Premium

> Mọi cấp độ phát triển UI của toàn đội Agent PHẢI tuân thủ triết lý này. Dứt khoát không sử dụng màu bừa bãi.

## 1. Typography (Neo-Corporate)
- **Headings & Marketing:** `Geist` hoặc `Inter` (Sắc nét, Hiện đại).
- **Body & Data:** `Inter` (Rõ ràng, Data-dense, hỗ trợ đọc số liệu tài chính).
- **Code/ID/QR:** `Geist Mono` (Dành cho Mã hóa đơn, Code, ID nhân viên).

## 2. Dynamic Color Palette (Light & Dark Support)
Sử dụng CSS Variables với NativeWind để switch giao diện.

### Semantic Accents (Linh hồn Nền tảng)
- `--accent-primary`: Neo Blue `indigo-600 (#4F46E5)`. (Thương hiệu, Trust).
- `--accent-success`: Emerald `#10B981` (Tài chính: Thu tiền, Lãi, Hoàn thành).
- `--accent-warning`: Amber `#F59E0B` (HR: Cảnh báo, Nợ tiêu chuẩn).
- `--accent-danger`: Rose `#E11D48` (Xóa, Hủy đơn, Rủi ro).

### Theming System
```css
/* LIGHT THEME (Data Entry, Finance, Admin Day-shift) */
:root {
    --bg-primary: #F8FAFC;
    --bg-card: rgba(255, 255, 255, 0.7); /* Glass white */
    --bg-elevated: #FFFFFF;
    
    --text-primary: #0F172A;
    --text-secondary: #475569;
    --text-muted: #94A3B8;
    
    --border-subtle: rgba(15, 23, 42, 0.1);
}

/* DARK THEME (Optional for specific modules) */
.dark {
    --bg-primary: #020617;
    --bg-card: rgba(255, 255, 255, 0.03); /* Glass black */
    --bg-elevated: rgba(15, 23, 42, 0.8);
    
    --text-primary: #F8FAFC;
    --text-secondary: #94A3B8;
    --text-muted: #64748B;
    
    --border-subtle: rgba(255, 255, 255, 0.05);
}
```

## 3. Data Visualization Palette (Charts & Stats)
5 màu quang phổ dùng chung cho báo cáo tài chính/nhân sự:
- *Sapphire:* `#3B82F6` (Xanh biển)
- *Emerald:* `#10B981` (Xanh lá)
- *Amethyst:* `#8B5CF6` (Tím)
- *Amber:* `#F59E0B` (Vàng)
- *Rose:* `#F43F5E` (Đỏ hồng)

## 4. Effects (Glassmorphism & Soft Shadows)
```css
/* Soft Box Shadows cho Card & Modal ERP */
--shadow-soft: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
--shadow-elevated: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Blur */
--blur-glass: blur(12px);
```

## 5. Component Logic (NativeWind Config)
UI components (@sgroup/ui) export các thành phần đã được gán sẵn các class này. Developer KHÔNG ghi đè style trừ khi cần thiết. 
Ví dụ:
```tsx
<Box className="bg-[--bg-card] border border-[--border-subtle] rounded-xl shadow-sm">
   <Text className="text-[--text-primary] text-lg font-semibold">Tài chính</Text>
</Box>
```
