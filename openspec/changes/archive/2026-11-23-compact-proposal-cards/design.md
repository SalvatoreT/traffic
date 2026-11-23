## Decisions

- Requested by the project lead (2026-11-22): better use of desktop width, figures side by side, disclosures beside the map; show cars an hour first and the percent small, comparing like with like; keep the hover that shows where traffic is diverted, remove the Where traffic goes button and dialog, and keep the useful part in a collapsible section.
- The card passes its buttons and disclosures into the map component, which places them in its second column. Under 44rem the order is map, readout, legend, buttons, disclosures.
- The disclosure reuses the stored redirect data the hover already loads (`redistributionLine`): cars an hour that used the closure and the routes most of them take. Nothing runs live on the Proposals tab.
- The Map tab's dialog stays. A scenario built by hand has no stored trace, so removing it there would remove the feature, which was not asked for.
- The all-traffic note no longer points to the removed button. It still says the figures alone rule out no diversion.
