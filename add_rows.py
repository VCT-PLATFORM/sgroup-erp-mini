import re

path = 'd:/sgroup-erp/modules/exec/web/screens/TotalPlanScreen.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Find the start of the table
table_rows = '''                  <div className="grid grid-cols-4 border-b border-slate-200/80 dark:border-[var(--color-sg-border)] hover:bg-slate-50/50 dark:hover:bg-white/50 dark:bg-black/20 transition-colors">
                    <div className="px-6 py-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sg-card flex items-center justify-center text-sg-muted"><Users size={16} /></div>
                      <span className="text-sm font-bold text-sg-heading">KHQT</span>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatVN(result.numLeadsMkt)}</div>
                      <div className="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase mt-1">Khách hàng</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-sg-heading">{formatVN(result.numLeads)}</div>
                      <div className="text-[10px] font-bold text-sg-muted uppercase mt-1">KHQT / Năm</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-orange-500 dark:text-orange-400">{formatVN(result.numLeadsSales)}</div>
                      <div className="text-[10px] font-bold text-orange-400 dark:text-orange-500 uppercase mt-1">Khách hàng</div>
                    </div>
                  </div>'''

# Create the new rows
new_rows = '''                  {/* Row 1: KHQT */}
                  <div className="grid grid-cols-4 border-b border-slate-200/80 dark:border-[var(--color-sg-border)] hover:bg-slate-50/50 dark:hover:bg-white/5 dark:bg-black/20 transition-colors">
                    <div className="px-6 py-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sg-card flex items-center justify-center text-sg-muted"><Users size={16} /></div>
                      <span className="text-sm font-bold text-sg-heading">KHQT</span>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatVN(result.numLeadsMkt)}</div>
                      <div className="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase mt-1">Khách hàng</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-sg-heading">{formatVN(result.numLeads)}</div>
                      <div className="text-[10px] font-bold text-sg-muted uppercase mt-1">KHQT / Năm</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-orange-500 dark:text-orange-400">{formatVN(result.numLeadsSales)}</div>
                      <div className="text-[10px] font-bold text-orange-400 dark:text-orange-500 uppercase mt-1">Khách hàng</div>
                    </div>
                  </div>

                  {/* Row 2: Hẹn Gặp */}
                  <div className="grid grid-cols-4 border-b border-slate-200/80 dark:border-[var(--color-sg-border)] hover:bg-slate-50/50 dark:hover:bg-white/5 dark:bg-black/20 transition-colors">
                    <div className="px-6 py-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500"><User size={16} /></div>
                      <span className="text-sm font-bold text-sg-heading">Hẹn Gặp</span>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatVN(result.numMeetingsMkt)}</div>
                      <div className="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase mt-1">Lượt</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-sg-heading">{formatVN(result.numMeetings)}</div>
                      <div className="text-[10px] font-bold text-sg-muted uppercase mt-1">Hẹn Gặp / Năm</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-orange-500 dark:text-orange-400">{formatVN(result.numMeetingsSales)}</div>
                      <div className="text-[10px] font-bold text-orange-400 dark:text-orange-500 uppercase mt-1">Lượt</div>
                    </div>
                  </div>

                  {/* Row 3: Giữ Chỗ */}
                  <div className="grid grid-cols-4 border-b border-slate-200/80 dark:border-[var(--color-sg-border)] hover:bg-slate-50/50 dark:hover:bg-white/5 dark:bg-black/20 transition-colors">
                    <div className="px-6 py-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-500"><Target size={16} /></div>
                      <span className="text-sm font-bold text-sg-heading">Giữ Chỗ</span>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatVN(result.numBookingsMkt)}</div>
                      <div className="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase mt-1">Giữ chỗ</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-sg-heading">{formatVN(result.numBookings)}</div>
                      <div className="text-[10px] font-bold text-sg-muted uppercase mt-1">Giữ chỗ / Năm</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-orange-500 dark:text-orange-400">{formatVN(result.numBookingsSales)}</div>
                      <div className="text-[10px] font-bold text-orange-400 dark:text-orange-500 uppercase mt-1">Giữ chỗ</div>
                    </div>
                  </div>

                  {/* Row 4: Giao Dịch */}
                  <div className="grid grid-cols-4 hover:bg-slate-50/50 dark:hover:bg-white/5 dark:bg-black/20 transition-colors bg-purple-50/30 dark:bg-purple-900/10">
                    <div className="px-6 py-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-md"><Target size={16} /></div>
                      <span className="text-sm font-black text-purple-700 dark:text-purple-400 uppercase">Giao Dịch</span>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatVN(result.numDealsMkt)}</div>
                      <div className="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase mt-1">Giao dịch</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-3xl font-black text-purple-700 dark:text-purple-400">{formatVN(result.numDeals)}</div>
                      <div className="text-[10px] font-bold text-purple-400 dark:text-purple-500 uppercase mt-1">Giao dịch / Năm</div>
                    </div>
                    <div className="px-6 py-5 text-center">
                      <div className="text-2xl font-black text-orange-500 dark:text-orange-400">{formatVN(result.numDealsSales)}</div>
                      <div className="text-[10px] font-bold text-orange-400 dark:text-orange-500 uppercase mt-1">Giao dịch</div>
                    </div>
                  </div>'''

c = c.replace(table_rows, new_rows)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
