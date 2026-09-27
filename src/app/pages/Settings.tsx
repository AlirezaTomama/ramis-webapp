import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import {
  User,
  Bell,
  Gauge,
  MapPin,
  Lock,
  ChevronRight,
  Shield,
  Leaf,
  CheckCircle,
  Smartphone,
  Mail,
  Bot,
  Camera,
  Battery,
  Clock,
  Zap,
  LogOut,
  KeyRound,
  Download,
  FileText,
  ShieldCheck,
  Eye,
  EyeOff,
  Target,
  AlertTriangle,
  Wifi,
  BarChart2,
  SlidersHorizontal,
  Plus,
  MessageSquare,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
type SectionId = "farm" | "notifications" | "ipm" | "robot" | "account";

interface Section {
  id: SectionId;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

// ─── Sub-nav sections ───────────────────────────────────────────────────────
const sections: Section[] = [
  { id: "farm",          label: "Farm Profile",         icon: MapPin },
  { id: "notifications", label: "Notifications",        icon: Bell,   badge: "3 on" },
  { id: "ipm",           label: "IPM Preferences",      icon: Gauge },
  { id: "robot",         label: "Robot Settings",       icon: Bot },
  { id: "account",       label: "Account & Subscription", icon: User },
];

// ─── Reusable row components ────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-green-600" />
      </div>
      <div>
        <p className="text-sm text-gray-900">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function SettingRow({ label, value, onClick }: { label: string; value?: string; onClick?: () => void }) {
  return (
    <div
      className={`flex items-center justify-between py-3 border-b border-gray-50 ${onClick ? "cursor-pointer hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors" : ""}`}
      onClick={onClick}
    >
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-gray-900">{value}</span>}
        {onClick && <ChevronRight className="w-4 h-4 text-gray-300" />}
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  desc,
  checked,
  onChange,
  locked,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  locked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-gray-50">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-gray-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-900 flex items-center gap-1.5">
            {label}
            {locked && <Lock className="w-3 h-3 text-gray-400" />}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
        </div>
      </div>
      {locked ? (
        <span className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full flex-shrink-0">Pro</span>
      ) : (
        <Switch checked={checked} onCheckedChange={onChange} className="flex-shrink-0" />
      )}
    </div>
  );
}

function SelectRow({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50">
      <span className="text-sm text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Plan Card (kept exactly, positioned at top of Account) ─────────────────
function PlanCard() {
  return (
    <Card className="p-5 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200 mb-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <Shield className="w-5 h-5 text-green-700" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-900">Standard Plan</p>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded-full">Active</span>
              <span className="text-xs text-gray-500">$299/mo</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3">Renews August 1, 2026</p>

          {/* Included */}
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {["Dashboard & Heatmap", "IPM Thresholds", "Robot Control", "Weekly Reports"].map((f) => (
              <div key={f} className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="text-[11px] text-gray-700">{f}</span>
              </div>
            ))}
          </div>

          {/* Locked */}
          <div className="bg-white/60 rounded-xl p-3 mb-4 border border-green-100">
            <p className="text-[11px] text-gray-500 mb-2 flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Unlock with Pro:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {["14-day forecast", "Historical comparison", "PDF export", "Multi-farm view", "Advisor sharing", "Custom thresholds"].map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <Lock className="w-2.5 h-2.5 text-gray-400" />
                  <span className="text-[11px] text-gray-400">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="bg-green-600 hover:bg-green-700 text-sm flex-1">Upgrade to Pro</Button>
            <Button variant="outline" className="text-sm text-gray-600 border-gray-200">Manage Plan</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function Settings() {
  const [activeSection, setActiveSection] = useState<SectionId>("farm");

  // Notifications state
  const [notifs, setNotifs] = useState({
    thresholdAlerts: true,
    weeklyReport: true,
    smsAlerts: false,
    emailDigest: true,
    pushMobile: true,
    advisorShare: false,
  });
  const toggle = (key: keyof typeof notifs) => setNotifs(p => ({ ...p, [key]: !p[key] }));

  // IPM Preferences
  const [monitoringWindow, setMonitoringWindow] = useState("Last 8 weeks");
  const [riskSensitivity, setRiskSensitivity] = useState("Balanced");
  const [defaultRule, setDefaultRule] = useState("Highest confidence");
  const [nonTarget, setNonTarget] = useState(false);

  // Robot settings
  const [scanSchedule, setScanSchedule] = useState("Nightly 10:00 PM");
  const [cameraRes, setCameraRes] = useState("1080p");
  const [batteryAlert, setBatteryAlert] = useState("20%");
  const [uvSafetyAlert, setUvSafetyAlert] = useState(true);
  const [autoCleanSchedule, setAutoCleanSchedule] = useState(true);

  // Account
  const [show2fa, setShow2fa] = useState(false);

  const activeCount = sections.findIndex(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Mobile status strip */}
      <div className="md:hidden bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Monitoring</span>
        <span className="flex items-center gap-1"><Battery className="w-3 h-3 text-green-500" />78%</span>
        <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-green-500" />Online</span>
        <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" />Last scan: 2h ago</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl text-gray-900">Settings</h1>
          <p className="text-xs text-gray-400 mt-0.5">Sunridge Farm · Manage your preferences and configuration</p>
        </div>

        <div className="flex flex-col md:flex-row gap-5">

          {/* ── Left sub-navigation ── */}
          <aside className="md:w-52 flex-shrink-0">
            <Card className="p-2 overflow-hidden">
              {sections.map((s, i) => {
                const Icon = s.icon;
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-green-50 text-green-800"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-green-600" : "text-gray-400"}`} />
                    <span className="flex-1 text-left">{s.label}</span>
                    {s.badge && !isActive && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{s.badge}</span>
                    )}
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                  </button>
                );
              })}
            </Card>

            {/* Version */}
            <div className="mt-4 px-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
                  <Target className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-gray-500">Ramis v2.4.1</span>
              </div>
              <p className="text-[10px] text-gray-400">© 2026 Ramis Technologies Inc.</p>
            </div>
          </aside>

          {/* ── Right content panel ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* ══════════════════ FARM PROFILE ══════════════════ */}
            {activeSection === "farm" && (
              <>
                {/* Farm details card */}
                <Card className="p-5">
                  <SectionHeader icon={MapPin} title="Farm Profile" subtitle="Your farm's basic information" />
                  <div className="space-y-0.5">
                    <SettingRow label="Farm Name" value="Sunridge Farm" />
                    <SettingRow label="Location" value="Kelowna, BC, Canada" />
                    <SettingRow label="Primary Crop" value="Apple (Gala, Honeycrisp)" />
                    <SettingRow label="Total Area" value="42 hectares" />
                    <SettingRow label="Active Fields" value="3 fields" />
                    <SettingRow label="Season Start" value="April 1, 2026" />
                    <SettingRow label="Season End" value="September 30, 2026" />
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs">Edit Farm Profile</Button>
                  </div>
                </Card>

                {/* Field Configuration */}
                <Card className="p-5">
                  <SectionHeader icon={Leaf} title="Field Configuration" subtitle="Manage individual fields and zones" />
                  <div className="space-y-2">
                    {[
                      { name: "Field A", area: "18 ha", zones: 4, crop: "Apple – Gala", robot: true },
                      { name: "Field B", area: "15 ha", zones: 3, crop: "Apple – Honeycrisp", robot: true },
                      { name: "Field C", area: "9 ha",  zones: 2, crop: "Apple – Ambrosia",  robot: false },
                    ].map((field) => (
                      <div key={field.name} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Leaf className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">{field.name}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">{field.crop} · {field.area} · {field.zones} zones</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {field.robot && (
                            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <Bot className="w-2.5 h-2.5" /> Robot
                            </span>
                          )}
                          <Button variant="ghost" size="sm" className="text-xs text-gray-500 h-7">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Add Field
                    </Button>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Pro feature
                    </span>
                  </div>
                </Card>
              </>
            )}

            {/* ══════════════════ NOTIFICATIONS ══════════════════ */}
            {activeSection === "notifications" && (
              <Card className="p-5">
                <SectionHeader icon={Bell} title="Notifications" subtitle="Control how and when Ramis alerts you" />
                <div className="space-y-0">
                  <ToggleRow
                    icon={AlertTriangle}
                    label="Threshold Alerts"
                    desc="Notify when pest counts approach or exceed the IPM threshold"
                    checked={notifs.thresholdAlerts}
                    onChange={() => toggle("thresholdAlerts")}
                  />
                  <ToggleRow
                    icon={FileText}
                    label="Weekly Report Ready"
                    desc="Get notified every Monday when your farm report is generated"
                    checked={notifs.weeklyReport}
                    onChange={() => toggle("weeklyReport")}
                  />
                  <ToggleRow
                    icon={Smartphone}
                    label="Push Notifications"
                    desc="Real-time alerts on your mobile device"
                    checked={notifs.pushMobile}
                    onChange={() => toggle("pushMobile")}
                  />
                  <ToggleRow
                    icon={MessageSquare}
                    label="SMS Alerts"
                    desc="Text messages for critical threshold breaches (optional)"
                    checked={notifs.smsAlerts}
                    onChange={() => toggle("smsAlerts")}
                  />
                  <ToggleRow
                    icon={Mail}
                    label="Email Digest"
                    desc="Weekly email summary delivered to your inbox"
                    checked={notifs.emailDigest}
                    onChange={() => toggle("emailDigest")}
                  />
                  <ToggleRow
                    icon={User}
                    label="Advisor Sharing"
                    desc="Notify your agronomist advisor when reports are ready"
                    checked={notifs.advisorShare}
                    onChange={() => toggle("advisorShare")}
                    locked
                  />
                </div>
              </Card>
            )}

            {/* ══════════════════ IPM PREFERENCES ══════════════════ */}
            {activeSection === "ipm" && (
              <>
                <Card className="p-5">
                  <SectionHeader icon={Gauge} title="IPM Preferences" subtitle="Configure how pest intelligence is calculated and displayed" />

                  <SelectRow
                    label="Default Monitoring Window"
                    value={monitoringWindow}
                    options={["This week", "Last 8 weeks", "Season-to-date"]}
                    onChange={setMonitoringWindow}
                  />
                  <SelectRow
                    label="Risk Sensitivity"
                    value={riskSensitivity}
                    options={["Conservative", "Balanced", "Aggressive"]}
                    onChange={setRiskSensitivity}
                  />
                  <SelectRow
                    label="Default Threshold Rule"
                    value={defaultRule}
                    options={["Highest confidence", "Most conservative", "Site-specific (Pro)"]}
                    onChange={setDefaultRule}
                  />

                  <div className="mt-2 space-y-0">
                    <ToggleRow
                      icon={Eye}
                      label="Show Non-target Insects"
                      desc="Include non-target species in heatmap and trend charts"
                      checked={nonTarget}
                      onChange={setNonTarget}
                    />
                    <ToggleRow
                      icon={User}
                      label="Advisor Sharing Mode"
                      desc="Allow your agronomist to view your pest data and reports"
                      checked={false}
                      onChange={() => {}}
                      locked
                    />
                  </div>
                </Card>

                {/* Threshold reference table */}
                <Card className="p-5">
                  <SectionHeader icon={BarChart2} title="IPM Threshold Reference" subtitle="Based on BC IPM guidelines · Read-only on Standard" />
                  <div className="space-y-2">
                    {[
                      { pest: "Codling Moth",             threshold: "15 adults/trap/week",    method: "Delta trap",          source: "BCMA 2024" },
                      { pest: "Leafroller",               threshold: "12 adults/trap/week",    method: "Pheromone trap",      source: "BCMA 2024" },
                      { pest: "Spotted Wing Drosophila",  threshold: "1 adult detection",      method: "Yeast bait trap",     source: "BCMA 2024" },
                      { pest: "Apple Aphid",              threshold: "25 colonies/100 leaves", method: "Visual inspection",   source: "BCMA 2024" },
                    ].map((item) => (
                      <div key={item.pest} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <p className="text-sm text-gray-900">{item.pest}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{item.threshold} · {item.method}</p>
                        </div>
                        <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">{item.source}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">Custom thresholds are available on the Pro plan. Contact your agronomist to configure site-specific values.</p>
                  </div>
                </Card>
              </>
            )}

            {/* ══════════════════ ROBOT SETTINGS ══════════════════ */}
            {activeSection === "robot" && (
              <>
                <Card className="p-5">
                  <SectionHeader icon={Bot} title="Robot Settings" subtitle="Configure scan schedule, safety, and hardware preferences" />

                  <SelectRow
                    label="Scan Schedule"
                    value={scanSchedule}
                    options={["Nightly 10:00 PM", "Twice daily (6AM / 6PM)", "Every 6 hours", "Manual only"]}
                    onChange={setScanSchedule}
                  />
                  <SelectRow
                    label="Camera Resolution"
                    value={cameraRes}
                    options={["720p", "1080p", "2K", "4K"]}
                    onChange={setCameraRes}
                  />
                  <SelectRow
                    label="Battery Alert Threshold"
                    value={batteryAlert}
                    options={["10%", "15%", "20%", "25%", "30%"]}
                    onChange={setBatteryAlert}
                  />

                  <div className="mt-2 space-y-0">
                    <ToggleRow
                      icon={Zap}
                      label="UV Lamp Safety Alert"
                      desc="Show safety reminder before activating UV lamp near humans"
                      checked={uvSafetyAlert}
                      onChange={setUvSafetyAlert}
                    />
                    <ToggleRow
                      icon={Clock}
                      label="Auto-Clean Schedule"
                      desc="Run 60-sec trap cleaning cycle after each monitoring pass"
                      checked={autoCleanSchedule}
                      onChange={setAutoCleanSchedule}
                    />
                  </div>
                </Card>

                <Card className="p-5">
                  <SectionHeader icon={MapPin} title="Home Base" subtitle="Docking station and charging location" />
                  <div className="space-y-0.5">
                    <SettingRow label="Home Base Location" value="Field A – Charging Dock" />
                    <SettingRow label="Return-to-home" value="After each scan cycle" />
                    <SettingRow label="GPS Accuracy" value="Sub-metre (RTK)" />
                  </div>
                  <Button variant="outline" size="sm" className="mt-5 text-xs">Edit Home Base</Button>
                </Card>

                {/* Safety notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <Zap className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-900">UV Lamp Safety Reminder</p>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">UV-A lamps emit radiation that may be harmful to eyes and skin. Ensure no humans or animals are in the immediate area when the lamp is active. Ramis automatically disables the lamp if motion is detected nearby.</p>
                  </div>
                </div>
              </>
            )}

            {/* ══════════════════ ACCOUNT & SUBSCRIPTION ══════════════════ */}
            {activeSection === "account" && (
              <>
                {/* Plan card at top — kept exactly */}
                <PlanCard />

                {/* Account details */}
                <Card className="p-5">
                  <SectionHeader icon={User} title="Account Details" subtitle="Your profile and login information" />

                  {/* Avatar row */}
                  <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-lg select-none">
                      J
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">John Sunridge</p>
                      <p className="text-xs text-gray-400">john@sunridgefarm.ca</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto text-xs">Edit</Button>
                  </div>

                  <div className="space-y-0.5">
                    <SettingRow label="Name" value="John Sunridge" />
                    <SettingRow label="Email" value="john@sunridgefarm.ca" />
                    <SettingRow label="Phone" value="+1 (250) 555-0192" />
                    <SettingRow label="Member since" value="January 15, 2026" />
                  </div>
                </Card>

                {/* Security card */}
                <Card className="p-5">
                  <SectionHeader icon={ShieldCheck} title="Security" subtitle="Password and two-factor authentication" />
                  <div className="space-y-0.5">
                    <SettingRow label="Change Password" onClick={() => {}} />
                    <div className="flex items-center justify-between py-3.5 border-b border-gray-50">
                      <div>
                        <p className="text-sm text-gray-700">Two-Factor Authentication</p>
                        <p className="text-xs text-gray-400 mt-0.5">Add extra security to your account</p>
                      </div>
                      <Switch checked={show2fa} onCheckedChange={setShow2fa} />
                    </div>
                    <SettingRow label="Active Sessions" value="2 devices" onClick={() => {}} />
                  </div>
                </Card>

                {/* Data & Privacy card */}
                <Card className="p-5">
                  <SectionHeader icon={Download} title="Data & Privacy" subtitle="Export your data or manage privacy settings" />
                  <div className="space-y-0.5">
                    <SettingRow label="Export Farm Data (CSV)" onClick={() => {}} />
                    <SettingRow label="Export Reports (PDF)" onClick={() => {}} />
                    <SettingRow label="Privacy Policy" onClick={() => {}} />
                    <SettingRow label="Terms of Service" onClick={() => {}} />
                  </div>
                </Card>

                {/* Danger zone */}
                <Card className="p-5">
                  <SectionHeader icon={LogOut} title="Sign Out" subtitle="End your current session" />
                  <Button variant="outline" className="text-sm text-red-600 border-red-200 hover:bg-red-50 gap-2 w-full md:w-auto">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </Button>
                </Card>
              </>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
              <Target className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-gray-400">Ramis v2.4.1 · Pest Intelligence Platform</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 Ramis Technologies Inc. · Kelowna, BC, Canada</p>
        </div>

      </div>
    </div>
  );
}
