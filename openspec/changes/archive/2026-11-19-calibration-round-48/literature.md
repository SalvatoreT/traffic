# Literature for the count-fit loop (rounds 48 and 49)

Written 2026-11-19. Keys are in `docs/references.md`, section 4.3, "Simulation-based and bi-level OD estimation". No full text was read. Each source was confirmed to exist in Crossref; content notes come from abstracts at best. This note changes no design decision.

## Mapping

- (a) Estimating an OD table from counts with assignment shares from a simulator: [Yang1992] (bi-level for congested networks, abstract unconfirmed), [Balakrishna2007] and [Toledo2013] (abstracts read: simulator in the loop, iterated, with historical demand as an input), [Antoniou2015] (abstract of the conference version read), [Cascetta1993]. [Spall1992], [Lu2015], [Cipriani2011], [CascettaNguyen1988] and [Antoniou2016] are verified to exist, but only their titles, or an unconfirmed summary, are relied on.
- (b) Convergence of the fixed-point iteration: [PowellSheffi1982] covers step sizes for equilibrium assignment only. Nothing verified covers convergence of alternating demand fit and simulation.
- (c) Regularizing toward a prior: [Cascetta1993] (abstract: counts combine with outdated matrices and surveys), [Cascetta1984], [Bell1991] and [VanZuylen1980] (titles only).
- (d) Over-fitting and hold-out: [Marzano2008] (abstract read), [Marzano2009] (title only), [Antoniou2016] (summary only).

## Findings that bear on the design

- Congested assignment matrices. [Frederix2013] reports that linearizing flows as separable can bias estimates on congested networks, and that congestion creates local minima. Our shares come from a congested simulation, so this is the main published caution. The paper's remedy is for dynamic estimation and was not checked against our static fit.
- Under-determination. [Marzano2008] reports that count-based correction fails when independent counts are fewer than OD unknowns. Our pairs far outnumber stations, so a close fit at counted stations says little about the table. That is a reason to keep the held-out stations in the keep rule (D6).
- A prior is standard. [Cascetta1993] and [Toledo2013] use historical or outdated demand as an input. The ceiling on gate totals (round 49) is one such prior, but no source seen gives a weight or a hard total constraint. Both remain ASSUMPTION.

## Still unsupported

- Convergence or stopping rules for alternating fit and simulation, and 1/n pooling of shares over seeds and passes.
- A recommended prior weight, or how to weight an observed share with few trips.
- Total-demand constraints and entropy maximization: [Bell1991] and [VanZuylen1980] were not read beyond titles. Spiess 1987 was found in Crossref but not added.
- A published report of over-fitting by iterated simulation-based fits, with held-out counts.
- Full text for every entry. Anyone who needs a quoted claim has to open the paper first.
