import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Key, 
  Check, 
  X, 
  UserCheck, 
  Users, 
  Save, 
  Smartphone,
  Plus,
  Phone,
  Mail,
  User,
  CheckCircle2
} from 'lucide-react';
import { RolePermissionConfig, StaffMember, UserRole } from '../../types';
import { DEFAULT_REGISTERED_STAFF } from '../auth/LoginScreen';

interface CorePermissionsViewProps {
  onBack: () => void;
  permissions: RolePermissionConfig[];
  onUpdatePermissions: (updated: RolePermissionConfig[]) => void;
  onNavigateToDevices?: () => void;
  staffList?: StaffMember[];
  onUpdateStaffList?: (updated: StaffMember[]) => void;
}

export const CorePermissionsView: React.FC<CorePermissionsViewProps> = ({
  onBack,
  permissions,
  onUpdatePermissions,
  onNavigateToDevices,
  staffList: initialStaffList,
  onUpdateStaffList
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'permissions' | 'staff'>('permissions');
  const [items, setItems] = useState<RolePermissionConfig[]>(permissions);
  const [savedNotice, setSavedNotice] = useState(false);

  // Staff List State
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('uq_staff_members');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialStaffList || DEFAULT_REGISTERED_STAFF;
  });

  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('Kasir');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');

  const handleToggle = (id: string, role: 'spv' | 'kasir') => {
    const updated = items.map((p) => {
      if (p.id === id) {
        return { ...p, [role]: !p[role] };
      }
      return p;
    });
    setItems(updated);
  };

  const handleSave = () => {
    onUpdatePermissions(items);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleAddNewStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaffName.trim(),
      role: newStaffRole,
      phone: newStaffPhone.trim() || '-',
      email: newStaffEmail.trim() || `${newStaffName.toLowerCase().replace(/\s+/g, '')}@usahaqu.id`,
      status: 'Aktif'
    };

    const updated = [...staffMembers, newStaff];
    setStaffMembers(updated);
    localStorage.setItem('uq_staff_members', JSON.stringify(updated));
    if (onUpdateStaffList) onUpdateStaffList(updated);

    setNewStaffName('');
    setNewStaffPhone('');
    setNewStaffEmail('');
    setIsAddStaffOpen(false);
  };

  const spvCount = items.filter((p) => p.spv).length;
  const kasirCount = items.filter((p) => p.kasir).length;

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* Top Header */}
      <div className="bg-[#008952] text-white px-4 py-2.5 shadow-xs sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-8 h-8 rounded-full bg-white/15 active:bg-white/30 flex items-center justify-center transition-colors shadow-xs cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4.5 h-4.5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
                Staff & Hak Akses
              </h1>
            </div>
          </div>
          {activeSubTab === 'permissions' ? (
            <button
              onClick={handleSave}
              className="bg-white text-[#008952] font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.3]" />
              <span>Simpan</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="bg-white text-[#008952] font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ Staff</span>
            </button>
          )}
        </div>

        {/* Sub-Tab Selector */}
        <div className="flex items-center gap-1.5 mt-3 bg-emerald-800/50 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('permissions')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSubTab === 'permissions' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Hak Akses & Otoritas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('staff')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSubTab === 'staff' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Daftar Karyawan ({staffMembers.length})</span>
          </button>
        </div>

        {onNavigateToDevices && (
          <button
            type="button"
            onClick={onNavigateToDevices}
            className="w-full mt-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Kelola Slot HP Karyawan (Pairing QR Multi-HP)</span>
            </span>
            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px]">Tautkan HP →</span>
          </button>
        )}
      </div>

      {savedNotice && (
        <div className="m-4 p-3 bg-emerald-100 border border-emerald-300 text-[#008952] rounded-2xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Matriks hak akses SPV & Kasir berhasil disimpan!</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {activeSubTab === 'permissions' ? (
          <>
            {/* Quick Role Stats */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 uppercase tracking-wider font-semibold block">
                    Supervisor (SPV)
                  </span>
                  <span className="text-sm font-extrabold text-emerald-950">{spvCount} Otoritas Aktif</span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-emerald-200/60 flex items-center justify-center text-[#008952]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-800 uppercase tracking-wider font-semibold block">
                    Staf Kasir
                  </span>
                  <span className="text-sm font-extrabold text-blue-950">{kasirCount} Otoritas Aktif</span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-blue-200/60 flex items-center justify-center text-blue-600">
                  <Key className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Permission List */}
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span className="font-bold text-slate-700">Daftar Otoritas Modul:</span>
              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-600 pr-2">
                <span className="w-12 text-center text-[#008952]">SPV</span>
                <span className="w-12 text-center text-blue-600">Kasir</span>
              </div>
            </div>

            {items.map((perm) => (
              <div
                key={perm.id}
                className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100 hover:border-emerald-200 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex-1 pr-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                      {perm.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mt-1 leading-snug">
                    {perm.permissionName}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                    {perm.description}
                  </p>
                </div>

                {/* Role Switches */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* SPV Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggle(perm.id, 'spv')}
                    className={`w-12 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                      perm.spv
                        ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/30'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                    title="Toggle Izin SPV"
                  >
                    {perm.spv ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <X className="w-3.5 h-3.5" />}
                  </button>

                  {/* Kasir Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggle(perm.id, 'kasir')}
                    className={`w-12 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                      perm.kasir
                        ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/30'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                    title="Toggle Izin Kasir"
                  >
                    {perm.kasir ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <X className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          /* Staff Member List */
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 text-xs text-slate-500">
              <span className="font-bold text-slate-700">Daftar Tim Karyawan Terdaftar</span>
              <span className="text-[11px] font-bold text-[#008952] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {staffMembers.length} Orang
              </span>
            </div>

            {staffMembers.map((staff) => (
              <div
                key={staff.id}
                className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    staff.role === 'Owner'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : staff.role === 'Supervisor'
                      ? 'bg-emerald-100 text-[#008952] border border-emerald-300'
                      : staff.role === 'Kasir'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {staff.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{staff.name}</h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                        staff.role === 'Owner'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : staff.role === 'Supervisor'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : staff.role === 'Kasir'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {staff.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10.5px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1 truncate">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {staff.phone}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {staff.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {staff.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah Staff */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#008952]" />
                Tambah Karyawan Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddStaffOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewStaff} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rian Prasetya"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#008952] outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Posisi / Peran:</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#008952] outline-hidden"
                >
                  <option value="Supervisor">Supervisor (SPV)</option>
                  <option value="Kasir">Kasir</option>
                  <option value="Mekanik">Mekanik</option>
                  <option value="Pelayan">Pelayan</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp / HP:</label>
                <input
                  type="text"
                  placeholder="0812-xxxx-xxxx"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#008952] outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Karyawan:</label>
                <input
                  type="email"
                  placeholder="rian@gmail.com"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#008952] outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#008952] hover:bg-emerald-700 active:scale-95 text-white shadow-xs cursor-pointer"
                >
                  Simpan Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
