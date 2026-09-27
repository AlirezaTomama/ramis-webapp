Please revise this farm-map / heatmap section to match the real operational logic of the Ramis robot and make the spatial visualization more realistic and decision-useful.

1) Robot path must follow orchard rows realistically

The current robot path looks curved and random, which is not correct for how the robot actually moves.

In reality:

the robot moves between tree rows

the path should be straight, row-based, and operationally realistic

the robot should not cross roads arbitrarily

turns should only happen at logical transition points between lanes

the movement should feel like a real orchard coverage route, not a freehand abstract line

Design requirement:
Show the robot path as clean, structured, and aligned with orchard lanes.

2) Remove separate trap icons from the map

The current map shows robot markers and also separate trap/X icons. This is misleading.

In the Ramis system:

the trap is mounted on the robot

detections come from the robot-mounted system

there are not multiple separate standalone traps placed across the map

Design requirement:

remove extra trap markers / X icons

keep only the robot position and its associated sensing/detection logic

make the map consistent with the actual product concept

3) Risk coloring should be localized, not flat across an entire zone

Right now, each zone looks uniformly colored. That is not the intended meaning.

What we want to communicate is:

within one zone, some areas may have higher pest pressure

nearby sections may still be healthier or lower risk

coloring should be based on trap detections / capture points

pest activity is spatially uneven, not equally distributed across the whole zone

Design requirement:

use a localized heat overlay

show stronger orange/red intensity near detection hotspots

let the intensity fade gradually into yellow/green around the hotspot

keep lower-pressure neighboring parts lighter

avoid giving the entire zone one flat risk color unless the whole zone is truly affected

Goal:
The user should understand that certain parts of a zone or certain rows of trees are more affected than nearby sections.

4) Make the heatmap feel row-aware and orchard-aware

The visualization should help the grower understand not only which zone is affected, but also which parts inside that zone are more exposed.

We want the map to imply:

“these rows / this cluster of trees are more affected”

“adjacent rows are currently healthier”

“risk spreads spatially from detection points”

Design requirement:

make the heatmap more granular

make it feel connected to orchard structure

if possible, visually hint at tree-row logic instead of only block-level zones

Even in MVP, this should feel more like a real farm intelligence map and less like a colored rectangular layout.

5) Apply the same visual logic consistently across the product

This change should not only apply to the Heatmap page.

Please apply the same corrected logic to:

Heatmap page

Home dashboard map section

Robot map / navigation section

All spatial views should be consistent in:

realistic robot movement

no separate trap icons

localized hotspot-based risk visualization

more realistic orchard interpretation

6) Final design goal

After the redesign, the user should immediately feel that:

the robot is moving realistically inside orchard lanes

detections are coming from the robot-mounted trap system

pest pressure is uneven and localized

some rows or areas are at higher risk while nearby areas remain healthier

the map is practical, believable, and useful for action

Design tone:

realistic

operational

spatially accurate

orchard-aware

less abstract

less blocky

more decision-oriented