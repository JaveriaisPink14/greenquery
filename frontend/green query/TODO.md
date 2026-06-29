# TODO

- [ ] Inspect repo navigation + paper list/detail expectations (already inspected ResultsPage, QueryPage, App, mockData, globalStyle)
- [ ] Update `src/pages/ResultsPage.jsx`:
  - [x] Make navbar mode pills clickable buttons with `onClick` + correct highlighting
  - [ ] Apply `mode` to the displayed papers (run-green vs run-now vs balanced)
  - [ ] Add in-page paper detail view (selectedPaperId) so clicking a paper opens the next view
  - [ ] Implement back arrow behavior:
    - [ ] If no paper selected -> back to query
    - [ ] If paper selected -> close detail and return to results list
- [ ] Ensure UI is consistent with requested look (top navbar shows ← on detail page)
- [ ] Run `npm run dev` and manually verify mode buttons + navigation + paper detail/back

