HEATMAP VISUAL UPDATE PROMPT (Figma) — Replace block-style field map with real map-overlay heatmap

Apply this instruction across the Ramis product design for:
1) Home
2) Dashboard
3) Heatmap page

IMPORTANT:
Do NOT display the farm heatmap as simple boxy field cards or abstract rectangular blocks like the current mockups.
Instead, redesign the heatmap to look like a real top-down farm map overlay, similar to a satellite / Google Maps style field view with a pest-risk heat layer on top.

CORE GOAL:
The user should feel that pest pressure is mapped onto the actual farm geography.
The heatmap must visually sit on top of a top-view farm map / satellite map, with pest-risk zones shown as a colored overlay.

VISUAL DIRECTION:
Use the attached third reference image as the main inspiration for the heatmap behavior and appearance.
The result should feel like:
- Google Maps / satellite top-down farm view
- Colored pest-risk overlay layer
- Smooth gradient / zone-based heat distribution
- Clear risk ranking from safe to dangerous

RISK COLOR SYSTEM:
Use a clear risk gradient and apply it consistently across Home, Dashboard, and the full Heatmap page.

Suggested meaning:
- Green = safe / under threshold / normal / low pest pressure
- Yellow-green = slightly elevated but still acceptable
- Yellow = watch / approaching threshold
- Orange = elevated / near or slightly above threshold
- Red = high pest pressure / clearly above threshold / contaminated hotspot
- Dark red (optional) = critical hotspot / urgent action needed

You may also label the legend with threshold meaning:
- Low: <40% of threshold
- Watch: 40–70%
- Alert: 70–100%
- High: 100–130%
- Critical: >130%

HEATMAP STYLE REQUIREMENTS:
1) Base map should look like a real farm from above:
- Satellite-like or aerial farm image
- Visible field boundaries
- Access roads / rows / orchard blocks / landmarks if useful
- Field labels (Field A, Field B, etc.)
- Zone labels if needed (A-Z1, A-Z2, etc.)

2) Heatmap overlay:
- Must be laid ON TOP of the map, not separate from it
- Use semi-transparent color overlay so the field image remains visible underneath
- Can be either:
  a) smooth gradient heatmap, or
  b) interpolated pest-risk surface, or
  c) zone-based shaded overlay
- Prefer a more natural “heat surface” style rather than plain colored rectangles

3) Hotspots:
- High-risk insect areas should visually stand out
- Show hotspots in orange/red
- Allow small hotspot markers, contour shapes, or glow rings if useful
- Make the most contaminated zones instantly visible

4) Legend:
- Add a visible legend from green to red
- Explain that red means above threshold / high infestation
- Explain that green means under threshold / all good

5) Data logic represented visually:
The heatmap should imply that the visualization comes from:
- robot GPS positions
- capture events
- pest detections
- threshold comparison
- time period filters
So the map should feel like a data-driven operational view, not decoration

PAGE-SPECIFIC REQUIREMENTS

A) HOME PAGE
Home should not show the full heavy heatmap, but it should show a compact “Farm Risk Map Preview”.
Design a small preview card with:
- top-down farm map
- pest heat overlay
- 2–5 obvious zones / hotspots
- legend mini version
- link/button: “Open Heatmap”
This preview must look like a real map snapshot, not a block diagram.

B) DASHBOARD PAGE
Dashboard should include a “Field Risk Map” or “Pest Risk Map Preview” card similar to the reference dashboard layout.
Requirements:
- show a compact top-down farm map
- show colored pest overlay directly on the map
- show visible hotspot(s)
- include small legend
- allow a highlighted selected zone if clicked from hotspot table
- keep it compact, because Dashboard is dense and Power BI-like
IMPORTANT:
This is only a preview / summary, not the full exploration map

C) FULL HEATMAP PAGE
This page should be the main interactive map experience.
Requirements:
- large top-down farm map / satellite-style base
- pest heat overlay covering the farm
- filters at top:
  - Farm
  - Field
  - Crop
  - Pest Type
  - Time Period
  - Threshold mode / Count mode
  - Include non-target toggle
  - Layer selector
- zoom / pan behavior
- clickable zones / hotspots
- right-side detail panel:
  - selected zone name
  - pest type
  - pest count
  - % of threshold
  - risk level
  - trend
  - recommended action
  - time to impact
- show “Last updated” timestamp

FUTURE-PROOF LAYERING:
Design the Heatmap page so it can later support multiple layers, not just pests.
This is important.

Include a “Layers” control that will later support:
- Pest pressure
- Soil moisture
- Fertilizer / nutrient status
- Mineral deficiency
- Temperature
- Other agronomic layers

The pest layer is the current default layer.
The design should clearly support turning layers on/off or switching between them.

UI/UX NOTES:
- Avoid the current rectangle-card style map
- Avoid overly abstract blocks
- Make it feel spatial, geographic, and real
- Use a clean professional SaaS style, but with realistic geospatial visualization
- Keep it understandable for farmers
- The farmer should instantly know:
  1) where the problem is
  2) how serious it is
  3) whether it is under threshold or above threshold
  4) what area is okay (green)

INTERACTION BEHAVIOR:
- Clicking a zone in the hotspot list should highlight that location on the map
- Clicking a hotspot on the map should open the detail card/panel
- Dashboard preview should connect to the full Heatmap page
- Home preview should connect to the full Heatmap page

DELIVERABLES:
Please redesign the heatmap presentation across:
1) Home map preview
2) Dashboard map preview
3) Full Heatmap page

And ensure all of them use:
- real top-down farm map feel
- pest overlay directly on map
- green-to-red risk scale
- clear threshold meaning
- a more realistic geospatial visualization style similar to the attached reference image