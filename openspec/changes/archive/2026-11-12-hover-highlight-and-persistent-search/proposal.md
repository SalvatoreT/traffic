## Why

Search results vanish when the input loses focus, so people cannot move the pointer to a result without losing it. Neither the results nor the Streets table say where a row is on the map.

## What Changes

- Hovering or focusing a street block or intersection in the search results or the Streets table lights it up on the map until the pointer or focus leaves.
- The search result list stays visible after the input loses focus while there is a query. Escape, clearing the query or choosing a result closes it.
- The Streets view shows the map above the table so the highlight can be seen. Clicks on that map do not select.

## Impact

Affects `simulator-ui`. UI only; the simulation and data are unchanged.
