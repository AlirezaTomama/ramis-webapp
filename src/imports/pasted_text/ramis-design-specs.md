You are a senior product designer building a premium SaaS + mobile experience for farmers (Canada/BC) called “Ramis”.
Design TWO surfaces:
1) Home (Landing inside the logged-in app)
2) User Dashboard (main operational workspace)

Primary goal: Farmers pay subscription because Ramis tells them WHEN and WHERE pests will hurt yield—not just showing insects.

Core tagline (must appear in UI, not as marketing fluff):
“We don’t show you insects. We tell you when and where they will hurt your yield.”

Design style:
- Clean, modern, high-trust (similar polish to Tesla app + Stripe dashboards)
- Large readable typography, minimal clutter, farmer-friendly language
- Light theme with soft neutrals; strong risk colors (green/yellow/orange/red)
- Cards with subtle shadows and rounded corners
- Mobile-first + responsive web (desktop version must also be designed)

User persona:
- Farmer / farm manager
- Not technical
- Needs decisions, not raw data

Information architecture requirements:
A) “Decision-first” box on every page:
- “What should I do now? (Next 5–7 days)”
- Shows: Monitor only / Prepare intervention / Intervention recommended
- Must include short reasoning: e.g., “Activity above threshold for 2 weeks” or “Below seasonal baseline”

B) Risk to yield indicator:
- “Estimated Yield Risk (%)” meter (0–12% scale in MVP)
- Context text: “Based on pest pressure, season, and maturity stage”

C) Seasonal baseline:
- A card that states: “Is this normal for this time of year?”
- Example copy: “Codling moth activity is +32% above seasonal average for Week 27”
- Must allow switching between: “This week” vs “Season-to-date”

D) Time-to-impact countdown:
- “Time to impact: 4–6 days”
- Based on maturity_score + trend
- For MVP, show it as an estimate with confidence label

E) Trust & confidence layer:
- “Last scan: 2 hours ago”
- “Coverage: 86% of field scanned this week”
- “Detection confidence: High/Medium” (do NOT show raw ML numbers)
- “Service proof” area: actions performed, coverage path

F) Data shown to the farmer (ONLY):
- Pest count
- Pest type
- Life stage (Adult only)
- Location (heatmap + hotspots)
- Time (week/season)
- Trend (up/down)
Do NOT show: bounding boxes, raw ML outputs, technical fields.

Dashboard features required:
1) Dynamic Heatmap (hero):
- Zoom + pan
- Filter by: farm, field, crop, pest type, week range, target vs non-target
- Hotspot list: Top zones ranked by risk + last-seen date + dominant pest
- Toggle: “Show controlled period only (May–Sep)”

2) Threshold & Action Planner panel:
- Shows IPM threshold rule from a threshold table
- Displays status: Under / Approaching / Above threshold
- Explains “why” in one sentence
- Has “Recommended action” button (non-invasive copy; no pesticide instructions—just “intervention”/“monitoring”)

3) ROI / Savings panel (subscription-worthy):
- “Estimated spray events avoided”
- “Estimated $ saved (field and per-ha)”
- “Risk events prevented”
- Must be shown as a summary card with drill-down

Robot status panel (must be visible on Dashboard home):
- Robot location (mini-map + field boundary)
- Battery %
- Connectivity status
- Current mode: Monitoring / Control / Standby
- Last control action executed
- Start/Stop monitoring button (with confirmation)

Tesla Sentry-like Camera section (key requirement):
- A dedicated “Live Cameras” area inspired by Tesla app Sentry mode
- Layout: one large main feed + smaller thumbnails around it (front/left/right/trap/internal)
- Camera feeds:
  - Trap internal camera (inside trap)
  - Robot front camera
  - Robot side cameras (left/right)
  - Optional rear camera
- Controls:
  - Toggle cameras on/off
  - Full-screen view
  - Snapshot button
  - “View last events” (timeline of recent captures)
- MUST feel like Tesla: dark camera panel, clean icons, minimal chrome

Navigation:
- Bottom tab bar for mobile:
  - Overview
  - Heatmap
  - Thresholds
  - Robot
  - Reports
- Desktop: left sidebar with same items

Reports (Weekly Farm Report):
- Auto-generated “Weekly Summary Report”
- Includes:
  - High-risk zones count
  - Top pests trend
  - Threshold breaches (if any)
  - Recommended monitoring window
  - “What changed since last week”
- Export to PDF (Pro tier)
- “Share with advisor” (Pro tier)

Upsell / tiers (must be designed):
- Standard: Overview + Heatmap + basic thresholds
- Pro:
  - 14-day forecast
  - Historical comparison
  - Export PDF reports
  - Multi-farm view
  - Advisor sharing

Deliverables:
- High-fidelity UI mockups for:
  1) Mobile Home
  2) Mobile Dashboard (Overview)
  3) Mobile Heatmap (zoom/filter)
  4) Mobile Robot + Live Cameras (Tesla-like)
  5) Desktop Dashboard (same content, responsive)
- Provide a component library:
  - KPI cards
  - Risk badge
  - Action box
  - Heatmap legend
  - Camera panel components
  - Table styles
  - Buttons + icons

Copywriting tone:
- Clear, calm, action-oriented
- No jargon
- Examples:
  - “Under control”
  - “Approaching threshold”
  - “High risk zone detected”
  - “Recommended: Monitor for next 5 days”

Constraints:
- Assume data sources include: capture events with GPS/time, detection events linked to captures, control actions, pest threshold table.
- Adults only (no eggs/larvae).
- Non-target insects exist but low and clearly labeled.