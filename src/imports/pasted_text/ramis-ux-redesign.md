```text
You are a senior product designer improving the UI/UX of the Ramis web app (logged-in product). 
IMPORTANT: Do NOT change the Robot page layout (Robot & Cameras, Lamp Control, Fan & Suction) — keep it exactly as-is. 
Only improve: Home, Dashboard, Heatmap, Thresholds, Reports, and global navigation patterns.

GOAL:
Make the product decision-first for farmers: simple, trustworthy, action-oriented. 
Reduce repetition across pages and ensure each page answers ONE clear question.

GLOBAL UX RULES (apply to all pages):
1) Create a persistent Global Status Bar visible on all pages (top-right or top header):
   - Robot mode: Monitoring / Control / Standby
   - Battery %
   - Connectivity: Online/Offline + signal quality
   - Last scan time (e.g., “Last scan: 2h ago”)
   - Optional: Coverage this week (%)
   This bar must NOT crowd the interface; keep it compact like a Tesla-style status strip.

2) Standardize language across the app (use same vocabulary everywhere):
   - Monitor
   - Prepare
   - Intervention
   - Under control
   - Approaching threshold
   - Above threshold
   Avoid technical ML terms. Do NOT show bbox or raw ML confidence.

3) Make cards and lists clickable with “smart routing”:
   - High-risk zones card → opens Heatmap filtered to that zone
   - Yield risk card → opens Thresholds focused on driving pest(s)
   - Time-to-impact card → opens Thresholds to countdown details
   - Savings card → opens Dashboard ROI section
   Every click should jump to the right page and apply the correct filters automatically.

4) Keep the “Decision-first box” on every page:
   “What should I do now? (Next 5–7 days)” with:
   - Recommendation: Monitor only / Prepare / Intervention recommended
   - One-line reason referencing threshold or seasonal baseline
   Keep this box visible but not huge.

INFORMATION ARCHITECTURE (stop repetition):
Each page must have ONE primary question:
- Home: “What should I do now + overall status?”
- Dashboard: “How is the season performing (ROI, trends, top pests)?”
- Heatmap: “Where should I act (hotspots)?”
- Thresholds: “Is it time to intervene (IPM rules)?”
- Reports: “Weekly summary I can export/share”

PAGE 1 — HOME (must be a decision gateway, not a full analytics page)
Keep it compact and fast:
A) Top headline + tagline (short):
   “We don’t show you insects. We tell you when and where they will hurt your yield.”
B) Primary “What should I do now?” box near top.
C) 4–5 KPI cards only (no heavy charts on Home):
   - High-risk zones (click → Heatmap)
   - Estimated cost saved this season (click → Dashboard ROI)
   - Estimated yield risk % (click → Thresholds)
   - Time to impact (click → Thresholds)
   - Coverage / Last scan (trust)
D) Quick navigation tiles:
   - Full Dashboard
   - Heatmap
   - Robot & Cameras (UNCHANGED destination)
E) Robot mini status card (summary only; do NOT redesign robot controls):
   - Location (Zone)
   - Battery
   - Connectivity
   - Last command

PAGE 2 — DASHBOARD (manager view, ROI + trends)
Make this page “business dashboard style” and reduce confusion:
A) Add a time-window toggle in the Dashboard header for key widgets:
   - This week / Last 8 weeks / Season-to-date
This toggle must control “Active Pest Types (%)” and trend charts.
B) Infestation Trend chart:
   - Show a small status badge on the chart area:
     Under control / Approaching / Above threshold
C) KPI strip should include a TRUST KPI:
   - Coverage % (this week) OR Last scan
D) Active Pest Types:
   - Keep top 5 with percentages
   - Must show “window label” (e.g., “Top 5 — Last 8 weeks”)
E) Include “Action Impact Summary” section clearly:
   - Yield saved
   - Cost saved
   - Chemical reduced
F) Create clear drill-down behavior:
   - Clicking a pest in Active Pest Types → filters trend + hotspot summary automatically

PAGE 3 — HEATMAP (operations view: where to act)
Heatmap is strong; improve interactivity and trust:
A) Make “Top Risk Zones” list interactive:
   - Clicking a zone must zoom the map to that zone
   - Highlight the selected zone on the map
   - Auto-filter pest type to dominant pest in that zone
B) Align legend with thresholds (not raw counts):
   Provide two modes:
   - Standard mode (default): risk based on % of threshold
     Low: <40% threshold
     Medium: 40–70%
     High: 70–100%
     Critical: >100%
   - Optional toggle: “Show by count” (secondary)
C) Add “Hotspot details” mini panel when a zone is selected:
   - Dominant pest
   - Count this week
   - Trend direction
   - Time-to-impact
D) Keep filters: Field, Pest type, Time period, Zone overlay, Include non-target

PAGE 4 — THRESHOLDS (IPM planner: is it time to intervene?)
Current layout is clean but too repetitive with stacked cards.
Refactor to “planner” structure:
A) Add a Pest selector at top:
   - Pick pest (e.g., Codling moth)
B) Show ONE master pest card with IPM rule (trust):
   - Rule statement in one line:
     “Rule: 2 moths/trap/week for 2 consecutive weeks”
C) Show a Field comparison table instead of repeated cards:
   Columns:
   - Field
   - Current count
   - Threshold
   - Status badge (Under/Approaching/Above)
   - Recommended action
   - View details
D) In details drawer/page:
   - Weekly chart vs threshold
   - Time-to-impact countdown
   - “Is this normal for this time of year?” baseline statement
E) Keep language non-technical and consistent.

PAGE 5 — REPORTS (subscription renewal driver)
Create a “Weekly Farm Report (Auto-generated)” page:
A) Weekly Summary (top):
   - 2–5 bullet highlights:
     - High-risk zones detected
     - Top pests trending
     - Threshold breaches (if any)
     - Recommended monitoring window (next 7 days)
     - What changed since last week
B) Service proof section:
   - Coverage %
   - Last scan time
   - Control actions executed
C) Export and sharing (Pro features):
   - Export PDF (locked for Pro)
   - Share with advisor (locked for Pro)
D) Keep it printable and simple.

UPSELL / PRO TIERS (do not be aggressive; use subtle locks):
Standard:
- Basic dashboard + heatmap + thresholds
Pro:
- 14-day forecast
- Historical comparison
- PDF export
- Multi-farm view
- Advisor share
Show locked icons and a calm “Upgrade to Pro” panel, consistent across pages.

DESIGN CONSISTENCY:
- Use the same card styles, badges, and table styles on all pages.
- Maintain clean spacing, aligned grids, and clear hierarchy.
- Keep the Robot page unchanged.

DELIVERABLES:
- Updated high-fidelity Desktop + Mobile for Home, Dashboard, Heatmap, Thresholds, Reports
- Global Status Bar component
- Click behaviors (prototype links) for smart routing:
  - High-risk zones → Heatmap filtered
  - Savings → Dashboard ROI
  - Yield risk/time-to-impact → Thresholds planner
  - Zone list click → map zoom + highlight
```
