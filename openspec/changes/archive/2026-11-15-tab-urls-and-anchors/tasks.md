## 1. Routing
- [x] 1.1 `src/lib/route.ts`: tab table, path to tab and back, fragment kinds, old-id rewrite, address builder, title
- [x] 1.2 Unit tests for the parser and router functions
- [x] 1.3 App: tab links with pushState, popstate and hashchange handling, scenario kept in the address, title, skip link

## 2. Anchors
- [x] 2.1 `AnchorHeading`, `AnchorLink`, `NavLink` and the scroll-and-focus helper
- [x] 2.2 Ids and link controls on Proposals, Assumptions, Sources (including bibliography), Streets
- [x] 2.3 Internal pointers as links; styles with no layout shift

## 3. Server
- [x] 3.1 Worker tests pin the asset configuration and the data 404

## 4. Verification
- [x] 4.1 `tsc`, `vitest run src worker`
- [x] 4.2 Playwright at 1280 px and Pixel 7: direct loads, tab clicks with Back and Forward, scenario links, cold anchors, anchor button, old links, QR target
- [ ] 4.3 Live check after deploy
