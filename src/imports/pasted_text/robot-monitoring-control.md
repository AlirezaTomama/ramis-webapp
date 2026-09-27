MASTER PROMPT — RAMIS ROBOT PAGE REDESIGN (FOR FIGMA / LOVABLE)

Design a premium, clean, operational “Robot” page for the Ramis web app.
This page is for real-time robot monitoring and control in the field.
The design must be desktop-first and fully responsive for mobile.

APP CONTEXT
- Product name: Ramis
- Purpose: Pest intelligence and robotic monitoring/control for farms
- Users: Farmers and farm managers (non-technical, decision-oriented)
- Design style: modern SaaS + practical control panel + premium agricultural product
- Feel: clean, focused, trustworthy, operational
- Avoid clutter and too many small panels

PRIMARY GOAL
Redesign the Robot page so it is simpler, clearer, and more functional.

MAIN LAYOUT PRINCIPLE
Use a 2-column layout:

LEFT SIDE = camera viewing + camera switching + trap image gallery
RIGHT SIDE = robot location + lamp control + wavelength control + intensity slider + fan/suction control

IMPORTANT:
- Show ONLY ONE main live camera viewport at a time
- Do NOT use multiple large live tiles at once
- Keep controls grouped and clear
- Make it easy for a farmer to understand and operate

────────────────────────
1) GLOBAL HEADER / STATUS STRIP
────────────────────────

At the top of the page, include a slim status strip with:
- Robot name (example: Ramis-01)
- Robot mode (Monitoring / Active / Standby)
- Current field and zone
- Battery percentage
- Connectivity / signal quality
- Coverage percentage
- Last command / last scan time

Example:
Ramis-01 | Active | Field A – Zone 3 | 78% battery | Excellent signal | 86% coverage | Last cmd: Trap scan 14:32

────────────────────────
2) LEFT COLUMN — LIVE CAMERA AREA
────────────────────────

This is the primary visual area.

A. MAIN CAMERA VIEWER
Show one large live camera panel only.

Default selected camera:
- Front Navigation Camera

The user can switch between exactly these 3 cameras:
1. Front Navigation Camera
   - forward-looking navigation view
   - orchard row / field path visual
2. UV Trap Internal Camera
   - inside the UV trap
3. Pheromone Trap Internal Camera
   - inside the pheromone trap

Each camera should be treated as a selectable source, but only one is shown in the main viewer at a time.

Inside the main camera viewer show:
- LIVE badge
- Camera name
- Timestamp
- Field / zone label
- Optional connectivity badge
- Optional fullscreen icon
- Optional snapshot icon

B. CAMERA SELECTOR
Below the main viewer, add a clean selector for the 3 camera sources.
Use segmented controls, tabs, or compact selectable cards.

Camera selector labels:
- Front Camera
- UV Trap Camera
- Pheromone Trap Camera

Behavior:
- Clicking one updates the main live viewer
- Active camera button should be visually highlighted

C. TRAP IMAGE GALLERY
Below the camera selector, add a “Trap Image Gallery” section.

This gallery shows images captured from inside the traps.

Gallery requirements:
- Grid or card list of thumbnails
- Each item must show:
  - image preview
  - date
  - time
  - GPS coordinates
  - field / zone
  - trap type (UV / Pheromone)
- Optional:
  - pest label
  - click to enlarge
  - view details action

Add filter controls above gallery:
- Date range
- Trap type
- Field / Zone
- Sort by: latest first

This gallery should feel like an image evidence log / historical capture archive.

────────────────────────
3) RIGHT COLUMN — LOCATION + CONTROL PANEL
────────────────────────

A. ROBOT LOCATION CARD (TOP RIGHT)
At the top right, show a compact location panel.

This card should include:
- small field map
- robot marker
- field / zone labels
- simple “Open full map” link or button

This is a compact live location card only, not the full Heatmap page.

B. LAMP CONTROL CARD
Below location, add a “Lamp Control” card.

Include:
- master lamp ON/OFF toggle
- subtitle: Multi-wavelength UV & visible control

C. WAVELENGTH CONTROL
Inside or below the Lamp Control card, show clickable wavelength buttons/chips.

Required wavelength options:
- UV-A 365
- 385
- 395
- Blue 450
- Green 525
- Amber 590

Behavior:
- Clicking a wavelength button turns that wavelength on/off
- Active wavelengths must be clearly highlighted
- Show clear command status:
  - Ready
  - Sending
  - Active
  - Error

Design expectation:
- These wavelength chips/buttons should look interactive and operational
- Can allow one or multiple active wavelengths depending on the design logic, but it must be visually clear

D. LIGHT INTENSITY SLIDER
Add a horizontal slider bar for light intensity.
The user must be able to smoothly increase or decrease brightness.

Requirements:
- Label: Intensity
- Horizontal slider
- Range 0% to 100%
- Show current value clearly (example: 60%)
- Easy to drag / easy to understand

E. FAN & SUCTION CONTROL CARD
Below the lamp control section, add a “Fan & Suction” card.

Include:
- master ON/OFF toggle
- animated or schematic airflow visualization
- visual indication that suction is pulling insects inward
- optional selectable airflow level:
  - Low
  - Medium
  - High

Behavior:
- When ON, visually show active suction / moving airflow
- Use directional airflow lines/arrows toward the trap
- Show status:
  - Ready
  - Running
  - Completed
  - Error

Optional quick action buttons:
- Run 60 sec
- Clean trap

IMPORTANT UX GOAL:
The user must immediately understand that when the fan turns on, suction is created and insects are being pulled into the trap.

────────────────────────
4) UX / INTERACTION RULES
────────────────────────

- Show only one main live camera at a time
- Make switching between the 3 cameras very easy
- Keep all robot controls grouped on the right side
- Avoid clutter and unnecessary secondary panels
- Show clear state feedback for every control
- Use concise, farmer-friendly labels
- Avoid technical overload

System states that can appear in the UI:
- Ready
- Sending command
- Active
- Running
- Error

Optional subtle safety note near UV section:
- Avoid human exposure during UV operation

────────────────────────
5) DESKTOP LAYOUT PRIORITY
────────────────────────

LEFT COLUMN (about 65–70%)
1. Main live camera viewer
2. Camera selector
3. Trap image gallery

RIGHT COLUMN (about 30–35%)
1. Location card
2. Lamp control
3. Wavelength buttons
4. Intensity slider
5. Fan & suction card

────────────────────────
6) MOBILE RESPONSIVE VERSION
────────────────────────

Also design a mobile version of the Robot page.

Mobile layout order:
1. Status strip
2. Main camera viewer
3. Camera selector
4. Location card
5. Lamp control
6. Wavelength controls
7. Intensity slider
8. Fan & suction card
9. Trap image gallery

Mobile requirements:
- stacked cards
- touch-friendly buttons
- large toggles
- clean spacing
- easy to use in the field

────────────────────────
7) VISUAL STYLE
────────────────────────

Design language:
- premium SaaS dashboard
- agricultural operations platform
- clean light theme
- subtle shadows
- rounded cards
- compact but readable
- consistent Ramis branding
- elegant control-panel feel

The page should feel:
- operational
- professional
- trustworthy
- worth paying for

────────────────────────
8) OUTPUT / DELIVERABLES
────────────────────────

Please generate:
1. High-fidelity desktop Robot page
2. High-fidelity mobile Robot page

Must include:
- one large live camera area
- 3-camera switcher
- trap image gallery with date, time, GPS, field/zone, trap type
- compact robot location card
- lamp on/off control
- wavelength buttons (365, 385, 395, Blue 450, Green 525, Amber 590)
- light intensity slider
- fan & suction control with visual performance feedback

FINAL DESIGN INTENT
Redesign the Ramis Robot page so it is more focused than the current version:
- simpler camera experience
- better control panel organization
- clearer location visibility
- better visibility of UV wavelengths and lamp control
- clear fan/suction behavior
- useful gallery of trap images with metadata

This page should feel like a premium robotics control interface for farmers.