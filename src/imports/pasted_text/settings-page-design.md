SETTINGS PAGE PROMPT (Figma) — Make it similar to the attached Settings examples

Design a “Settings” section for the Ramis web app (desktop + mobile). 
Use the attached Settings screenshots as reference for structure, spacing, and visual style.
IMPORTANT: Keep the Subscription / Plan card style as-is (it is good). Do not redesign that part—only integrate it cleanly into the Settings layout.

GOALS:
- Simple, modern, high-trust UI
- Easy for non-technical farmers
- Clear grouping: Farm, Notifications, Robot, Account
- Same global Ramis look & feel (sidebar + status strip + Pro upsell)

DESKTOP SETTINGS (layout)
Left sidebar: keep existing Ramis navigation (Home, Dashboard, Heatmap, Robot, Thresholds, Reports, Settings).
Add compact Global Status Bar at top (or inside sidebar) showing:
- Monitoring status (Monitoring / Standby)
- Battery %
- Online status + signal
- Last scan time
- Coverage % this week (small text)

Main Settings page structure:
A) Left sub-navigation (vertical tabs) like the screenshot:
- Farm Profile
- Notifications
- IPM Preferences
- Robot Settings
- Account & Subscription

B) Right content panel (card-based), with sections:

1) Subscription / Plan (TOP — keep current good design)
- Plan name (Standard / Pro)
- Status (Active) + renewal date
- “Manage Plan” button
- Show Pro features list (locked features) below
(Keep the current subscription card styling; only position it at top.)

2) Farm Profile (card)
Fields:
- Farm name
- Location
- Primary crop
- Total area (ha)
- Active fields count
- Season start / season end
Button: “Edit Farm Profile”

3) Field Configuration (card)
List each field (Field A, Field B, Field C)
- Crop + variety
- Area (ha)
- Zone count
Action: “Edit” per field row
Optional: “Add Field” button (Pro optional)

4) Notifications (card)
Toggle list like mobile screenshot:
- Threshold Alerts (IPM threshold approaching/above)
- Weekly Report Ready
- SMS Alerts (optional off by default)
- Email Digest (daily/weekly)
Each with a short helper text and right-side toggle.

5) IPM Preferences (card)
- Preferred monitoring window: This week / Last 8 weeks / Season-to-date
- Risk sensitivity: Conservative / Balanced / Aggressive
- Default threshold rule selection if multiple rules exist (highest confidence default)
- Include non-target insects toggle (default off)
- Advisor sharing toggle (Pro locked)

6) Robot Settings (card)
- Scan schedule (e.g., Nightly 10PM)
- Home base / charging station location
- Battery alert threshold (e.g., 20%)
- Camera resolution (1080p / 2K / 4K)
- Safety reminder toggles for UV lamp

7) Account (card)
- User name + email
- Change password
- Two-factor authentication
- Data export
- Privacy policy
- Logout

FOOTER:
- Ramis logo + version
- Copyright

MOBILE SETTINGS (layout)
Use a mobile-friendly list style like the screenshot:
- Top sticky status strip: Monitoring, Battery, Last scan
- Plan card at top (same as current)
- Sections stacked:
  Farm Details → Notifications → Robot Settings → Account
- Use toggles and chevrons for navigation
- Bottom tab bar remains visible

VISUAL DESIGN RULES:
- Keep consistent spacing, rounded cards, soft borders
- No heavy charts here
- Make it feel “Tesla clean + SaaS dashboard”
- Use the same icons and badge styles across the app
- Keep Pro upsell subtle: locked icons + “Upgrade to Pro” button

DELIVERABLES:
- High-fidelity Desktop Settings page with sub-navigation
- High-fidelity Mobile Settings page
- Components: setting row, toggle row, plan card, section header, field list row