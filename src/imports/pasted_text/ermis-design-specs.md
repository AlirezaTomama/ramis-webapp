You are a senior product designer creating a premium farmer-facing SaaS + mobile app for “Ramis” (Canada/BC).
Design BOTH Mobile and Desktop versions (responsive).

REFERENCE STYLE:
Use the attached dashboard image as reference for layout density and business-style analytics (cards + charts + tables).
Keep it modern, clean, high-trust (Tesla app polish + professional BI dashboard).

CORE TAGLINE (must appear):
“We don’t show you insects. We tell you when and where they will hurt your yield.”

SCOPE:
Design TWO main screens:
1) Dashboard Home (Overview & ROI)
2) Robot Control & Live Cameras (Tesla Sentry-like)

DATA ASSUMPTIONS:
- fact_capture: GPS + datetime per capture (one record)
- fact_detection: 0..n detections per capture (adult flying only)
- fact_control_action: actions like UVC/fan/light program
- dim_pest_threshold: IPM thresholds per pest + crop (from articles)
- Non-target insects exist but low; shown as “Non-target” optionally.

REQUIRED SECTIONS ON DASHBOARD HOME (must be present like the reference image):
A) High-Risk Zones (card)
- value + change vs last week
B) Total Cost Saved (card)
- $ saved + % chemical reduction
C) Active Pest Types (horizontal bar list)
- Pest name + percentage share (Top 5)
D) Hotspot Detection (zone-wise table)
- Zone name, Pest Index, Change %, Status badge (Watch / Alert / Critical)
E) Infestation Trend (last 8 weeks)
- Line chart with Threshold overlay
F) Action Impact Summary (3 mini-cards with sparklines)
- Yield saved (kg or %), Cost saved ($), Chemical reduced (L or %)
G) Risk Forecast (next 4 weeks)
- Current vs Projected risk bands (Low/Med/High) like the reference
H) Savings Dashboard / Total Saved (gauge or donut)
- Total saved number
I) Savings vs Last Season (bar chart)
- Chemical / Labor / Yield Loss

CRITICAL ADD-ONS (must be embedded, decision-first):
1) “What should I do now? (Next 5–7 days)” box (very visible)
- Options: Monitor only / Prepare intervention / Intervention recommended
- Include 1-line reason: “Above threshold for 2 weeks”, “Above seasonal baseline”, etc.
2) Estimated Yield Risk (%) meter (0–12% MVP)
3) Seasonal Baseline card:
- “Is this normal for this time of year?”
- Example: “SWD activity is +32% above seasonal average (Week 27)”
4) Time-to-Impact countdown:
- “Estimated impact in 4–6 days”
- With confidence badge (High/Med)
5) Trust layer:
- Last scan time
- Coverage % (this week)
- Detection confidence badge (no raw ML)
- Service proof link

FILTERS / CONTROLS (top bar like reference image):
- Farm dropdown
- Field dropdown
- Crop dropdown
- Season/year dropdown
- Date range picker
- Pest type filter

HEATMAP REQUIREMENTS:
- Interactive heatmap with zoom/pan
- Filter by pest type + week range
- Toggle: Targets only vs Include non-target
- Show “zones” overlay (Zone A/B/C...) + legend (Low/Med/High)

ROBOT CONTROL & LIVE CAMERAS SCREEN (must feel like Tesla Sentry mode):
Layout (mobile + desktop):
- One main large live camera feed
- Surrounding thumbnails for:
  1) Trap internal camera
  2) Front camera
  3) Left camera
  4) Right camera
  5) (optional) rear/top camera
Controls:
- Camera ON/OFF
- Fullscreen
- Snapshot
- “Recent Events” timeline (recent captures with timestamps)

NEW REQUIREMENTS: LAMP + FAN LIVE CONTROL (must be inside Robot Control screen)
1) Multi-wavelength Lamp Control panel:
- Toggle ON/OFF
- Preset modes (tabs or chips):
  - UV-A 365
  - 385
  - 395
  - Blue 450
  - Green 525
  - Amber 590 (optional)
- Intensity slider (0–100%)
- Schedule quick buttons:
  - “Run 10 min”
  - “Run 30 min”
  - “Auto (smart)”
- Real-time status indicator:
  - “Command sent”
  - “Executing”
  - “Completed”
- Safety note UI: “Use responsibly. Avoid human exposure.”

2) Fan Control button + suction schematic (must be visually obvious):
- Big Fan toggle button (ON/OFF)
- When ON:
  - show animated airflow arrows moving into trap (simple schematic)
  - show “Suction Active” badge
  - show live RPM or “Flow level” indicator (Low/Med/High)
- Include “Auto clean” quick action:
  - “Clean trap now (60 sec)”
- Must reflect real-time robot response states:
  - sending / running / error

ROBOT STATUS STRIP (visible on both Dashboard Home and Robot Control):
- Robot location mini-map
- Battery %
- Connectivity (online/offline)
- Current mode: Monitoring / Control / Standby
- Last command timestamp

UPSELL / TIERS (design paywall affordances):
Standard:
- Overview + Heatmap (basic)
Pro/Premium (locked icons):
- 14-day forecast
- Historical comparison
- PDF export weekly report
- Multi-farm view
- Advisor share mode

DELIVERABLES:
- High-fidelity mobile: Dashboard Home, Heatmap, Robot+Cameras+Lamp+Fan
- High-fidelity desktop: Dashboard Home + Robot Control page (responsive)
- Component set: KPI cards, status badges, heatmap legend, camera panel, lamp controls, fan schematic, tables.

COPY TONE:
Simple, calm, action-oriented, non-technical.
Avoid pesticide instructions; say “intervention”, “monitoring”, “control”.