## MODIFIED Requirements

### Requirement: Sources visible
The UI SHALL provide a page listing the research references and data sources behind the model, and a pointer to the Assumptions tab for the judgment calls. Each source SHALL link as specifically as a verified link allows to the passage, page, file or record the project uses, and a source with several uses SHALL give each its own labeled link. Links SHALL open normally, SHALL be named by their labels and not by their URLs, and SHALL NOT make the page scroll sideways on a phone. A source with no verifiable deeper link SHALL keep its general link or none.

#### Scenario: Viewing sources
- **WHEN** a user opens "Sources"
- **THEN** they see the bibliography and data provenance with links, and a line pointing to the Assumptions tab

#### Scenario: Following a cited table
- **WHEN** a user follows the link of an entry whose use is a table in a PDF or a passage on an HTML page
- **THEN** the link opens that PDF page or highlights that passage, and further uses of the same source appear as labeled links in parentheses after the citation line

#### Scenario: Entry with no deeper link
- **WHEN** no link to the cited content could be verified
- **THEN** the entry shows no new link and the bibliography's notes say why
