# dwalker [![Build Status](https://travis-ci.org/valango/duke.svg?branch=master)](https://travis-ci.org/valango/svelte-check-filter) [![Code coverage](https://codecov.io/gh/valango/svelte-check-filter/branch/master/graph/badge.svg)](https://codecov.io/gh/valango/duke)

# svelte-check-filter

A stream filter to make svelte-check output selective.

Example:
```
  $ npx svelte-check | svelte-check-filter -ui/pages "Proj*.?*
```
Will show only files like `Project.ts` or `ProjectEditor.svelte` outside of the `ui/pages` path.
