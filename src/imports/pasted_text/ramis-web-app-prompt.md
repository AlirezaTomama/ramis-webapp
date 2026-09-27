MASTER PROMPT — RAMIS WEB APP (FULL PRODUCT REBUILD, DESIGN + UX)

You are a principal product designer (SaaS dashboards + mobile control apps) designing “Ramis” — a premium pest intelligence platform for farmers in Canada/BC.
Design the entire LOGGED-IN web app from scratch (desktop-first, fully responsive to mobile).

CORE PRODUCT PROMISE (must guide every screen):
“We don’t show you insects. We tell you when and where they will hurt your yield.”

PRIMARY USER:
Farm owner / farm manager (non-technical). They pay subscription for decisions, ROI, and trust.

DO NOT DESIGN A GENERIC “WELCOME PAGE”.
The app must be information-dense, decision-first, and operationally useful.

────────────────────────────────────────────────────────
1) DATA & MODEL ASSUMPTIONS (MUST REFLECT OUR ARCHITECTURE)
────────────────────────────────────────────────────────
Use these conceptual tables (do not show them in UI; they drive UX logic):
- dim_farm, dim_field, dim_crop
- dim_pest (adult flying pests only)
- dim_pest_threshold (IPM thresholds from articles; varies by crop + pest + method)
- dim_calendar
- fact_capture: 1 row per camera capture event; includes GPS + date/time + field/farm
- fact_detection: 0..n detections per capture; includes pest_id/class, maturity_score, life_stage=adult only, is_non_target flag
- fact_control_action: lamp/fan/uvc actions executed at/around captures (for proof + impact)

CRITICAL BEHAVIOR RULES:
- 1 capture has exactly 1 GPS+timestamp
- 1 capture can have 0, 1, 2, or more detections (multiple insects in one frame)
- Only adults are detected (no eggs/larvae)
- Non-target insects exist but are low; shown optionally and clearly labeled
- April is the first monitoring month; September is the last monitoring month
- From May onward, robot can perform control actions; dashboards should show pests staying under threshold after interventions

────────────────────────────────────────────────────────
2) GLOBAL UX PRINCIPLES (MUST APPLY EVERYWHERE)
────────────────────────────────────────────────────────
A) Decision-first: Every page must answer one clear question and include:
- “What should I do now? (Next 5–7 days)” box
  - Recommendation: Monitor / Prepare / Intervention recommended
  - One-line reason referencing threshold or baseline
B) Farmer-friendly: Show ONLY:
- Pest count, pest type, life stage (adult), location, time (week/season), trend direction
Do NOT show: bounding boxes, raw ML confidence, technical fields.
C) Trust layer: Farmer must trust the system:
- Last scan time (e.g., “Last scan: 2h ago”)
- Coverage % (this week)
- Detection confidence as a badge (High/Medium/Low) — no raw numbers
- Service proof: actions executed + coverage path
D) Baseline & context:
- “Is this normal for this time of year?” baseline statement (weekly + season-to-date toggle)
E) Time-to-impact:
- Countdown: “Estimated impact in 4–6 days” (with confidence badge)
F) Click-to-drill:
- Cards and tables must be interactive and route users to the correct filtered view.

────────────────────────────────────────────────────────
3) NAVIGATION & APP STRUCTURE (DESKTOP + MOBILE)
────────────────────────────────────────────────────────
Desktop:
- Left sidebar navigation with icons + labels
Mobile:
- Bottom tab bar navigation

App sections (must be designed):
1) Home (Decision Gateway)
2) Dashboard (Overview & ROI)
3) Heatmap (Hotspots & Where to act)
4) Thresholds (IPM Planner)
5) Robot (Live Cameras + Lamp + Fan Control) — KEEP THIS PAGE STRONG AND PREMIUM
6) Reports (Weekly Farm Report + Export/Share)
7) Settings (optional minimal)

Add a persistent GLOBAL STATUS BAR on all pages (top-right in header):
- Robot mode: Monitoring / Control / Standby
- Battery %
- Connectivity + signal
- Last scan time
- Optional: Coverage % this week

────────────────────────────────────────────────────────
4) VISUAL STYLE (PREMIUM + TRUST)
────────────────────────────────────────────────────────
- Clean, modern, high-trust (Tesla app polish + Stripe dashboard clarity)
- Light theme with soft neutrals; risk colors: green/yellow/orange/red
- Rounded cards, subtle shadows, consistent typography
- Dense but readable layout (Power BI-like analytics)
- Consistent badges: Under control / Approaching / Above threshold

────────────────────────────────────────────────────────
5) SCREEN-BY-SCREEN REQUIREMENTS (MUST INCLUDE ALL MODULES)
────────────────────────────────────────────────────────

SCREEN 1 — HOME (Decision Gateway, not analytics-heavy)
Goal: “What should I do now + overall status?”
Must include:
- Decision box: “What should I do now? (Next 5–7 days)”
- 4–5 KPI cards:
  - High-risk zones (count + change vs last week)
  - Total cost saved this season ($ + % chemical reduction)
  - Estimated yield risk (%) meter (0–12% MVP)
  - Time-to-impact countdown (4–6 days)
  - Trust card: coverage % + last scan
- Quick navigation tiles:
  - Open Dashboard
  - Open Heatmap
  - Open Robot (Live cameras)
  - Open Reports
- Robot mini status card (summary only): location/zone, battery, connectivity, last command

SCREEN 2 — DASHBOARD (Overview & ROI — Business dashboard style)
Goal: “How is the season performing and what’s the ROI?”
Must visually include (Power BI reference layout style):
A) KPI cards row:
- High-Risk Zones
- Infestation Level (Rising/Stable/Falling + % vs threshold)
- Preventive Actions Suggested (count + view list)
- Potential Yield Saved ($ + %)
- Total Cost Saved ($ + % chemical reduction)
B) Infestation trend (Last 8 weeks) chart with threshold overlay + current badge
C) Active Pest Types (Top 5) with percentages + time window toggle:
- This week / Last 8 weeks / Season-to-date
D) Action Impact Summary (3 mini-cards with sparklines):
- Yield saved
- Cost saved
- Chemical reduced
E) Savings vs Last Season (bar chart): Chemical / Labor / Yield loss
F) “Is this normal for this time of year?” baseline card with toggle:
- This week vs season-to-date
G) Trust strip: last scan + coverage + confidence
H) All items must support click-to-filter drilldowns

SCREEN 3 — HEATMAP (Hotspots & Where to act)
Goal: “Where should I act right now?”
Must include:
- Interactive heatmap with zoom/pan
- Filters: farm, field, crop, pest type, time period, include non-target toggle, zone overlay toggle
- Right panel: Top Risk Zones list (interactive):
  - Clicking a zone zooms + highlights on map and applies pest filter
- Hotspot details panel when zone selected:
  - dominant pest, count, trend, time-to-impact, threshold status
- Legend should support threshold-based risk:
  - Low <40% threshold, Medium 40–70, High 70–100, Critical >100
- Show “Last updated” timestamp

SCREEN 4 — THRESHOLDS (IPM Planner)
Goal: “Is it time to intervene? Why (scientifically)?”
Must include:
- Pest selector at top
- IPM rule card (from dim_pest_threshold):
  - Threshold value, unit, window, monitoring method, confidence
- Field comparison table instead of repetitive cards:
  - Field | current count | threshold | status | recommended action | view details
- Detail drawer/page:
  - weekly count vs threshold chart
  - time-to-impact countdown
  - baseline statement
- Use consistent statuses:
  - Under control / Approaching / Above threshold
- No pesticide instructions; use “intervention/monitoring” language

SCREEN 5 — ROBOT (KEEP PREMIUM — Tesla Sentry-like Cameras + Real-time Control)
Goal: “Control robot, view cameras, run lamp + fan, see status.”
MUST include:
A) Tesla Sentry-like Live Cameras panel:
- One large main feed + smaller thumbnails for:
  - trap internal, front, left, right, (optional rear)
- Controls: on/off, full screen, snapshot, recent events timeline
B) Robot location panel:
- field boundary + zone map + live tracking marker
C) Lamp Control (multi-wavelength) with real-time command states:
- Toggle on/off
- Wavelength chips: UV-A 365 / 385 / 395 / Blue 450 / Green 525 / Amber 590
- Intensity slider
- Quick schedule: Run 10 min / 30 min / Auto (smart)
- Status: command sent / executing / completed / error
- Safety note: avoid human exposure
D) Fan & Suction control:
- Fan toggle
- Animated airflow schematic when on
- Flow level: Low/Med/High
- Quick action: “Clean trap now (60 sec)”
- Real-time states: sending/running/error
E) Robot status strip: battery, connectivity, mode, last command timestamp
IMPORTANT: This page must remain visually strong, premium, and “worth paying for”.

SCREEN 6 — REPORTS (Weekly Farm Report — Subscription renewal driver)
Goal: “Auto-generated weekly report farmers can export/share.”
Must include:
- Weekly summary bullets:
  - high risk zones count
  - top pests trend
  - threshold breaches
  - recommended monitoring window next 7 days
  - what changed since last week
- Service proof block:
  - coverage %, last scan, control actions executed
- Export PDF (Pro) + Share with advisor (Pro)
- Clean print-friendly layout

────────────────────────────────────────────────────────
6) UPSELL / PRICING TIERS (SUBTLE, PRODUCT-LED)
────────────────────────────────────────────────────────
Standard includes: dashboard + heatmap + basic thresholds
Pro/Premium locked features (show lock icons and upgrade CTA):
- 14-day forecast
- historical comparison
- PDF export
- multi-farm view
- advisor sharing
Upsell must be calm and trust-based, not aggressive.

────────────────────────────────────────────────────────
7) COMPONENT LIBRARY (MUST DELIVER)
────────────────────────────────────────────────────────
Design a reusable component set:
- KPI cards
- Risk badges (Low/Med/High/Critical)
- “What should I do now?” action box
- Yield risk meter
- Time-to-impact countdown chip
- Baseline statement card
- Heatmap legend + zone chips
- Hotspot table rows
- IPM threshold rule card
- Camera panel components (Tesla-like)
- Lamp control chips + sliders
- Fan schematic + flow buttons
- Report template blocks

────────────────────────────────────────────────────────
8) DELIVERABLES (WHAT YOU MUST OUTPUT)
────────────────────────────────────────────────────────
- High-fidelity Desktop screens for: Home, Dashboard, Heatmap, Thresholds, Robot, Reports
- High-fidelity Mobile screens for: Home, Dashboard, Heatmap, Robot, Reports
- Responsive behavior notes (how layouts stack on mobile)
- Prototype links: click behaviors for drilldowns
- Consistent copywriting: calm, action-oriented, non-technical

FINAL CHECK:
- Home is NOT a welcome page; it is a decision gateway.
- Dashboard includes business modules: Action Impact Summary, Active Pest Types %, Hotspot Detection, Risk Forecast, Total Cost Saved, High-Risk Zones.
- Heatmap is zoomable + clickable zone list.
- Thresholds is planner style (not repetitive cards).
- Robot page includes Tesla-style cameras + multi-wavelength lamp + fan suction schematic.
- Reports page exists and is export/share oriented.