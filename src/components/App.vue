<template>
  <div id="docup-root">
    <router-view></router-view>
  </div>
</template>

<style src="prismjs/themes/prism.css"></style>

<style>
* {
  box-sizing: border-box;
}

:root {
  --ease: cubic-bezier(.82, 0, .12, 1);
  --width: 800px;
  --header-height: 400px;

  --tracking: 0.05rem;
  --tracking-medium: 0.5rem;
  --tracking-large: 0.8rem;

  --dark: #000;
  --blue: #33A9FF;
  --light-gray: #fafafa;

  --bg: #fff;
  --fg: #868E96;
  --fg-dark: #212529;

  --selection-bg: var(--blue);
  --selection-fg: white;
}

body {
  margin: 0;
  font: 16px/1.4 -apple-system, BlinkMacSystemFont,
    "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans",
    "Droid Sans", "Helvetica Neue", sans-serif;
  font-weight: 300;
}

.container {
  margin: 0 auto;
  max-width: 800px;
}

h2, h3, h4 {
  margin-top: 75px;
  margin-bottom: 0;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.5rem;
  color: var(--fg-dark);
}

h2 {
  margin-top: 100px;
  padding-top: 50px;
  font-size: 1.5rem;
}

h2:first-child {
  margin-top: 0;
  padding-top: 0;
}

/* h2 + p {
  font-size: 1.5rem;
  line-height: 1.6;
} */

a {
  color: inherit;
  text-decoration: none;
}

p {
  margin: 25px 0;
  line-height: 1.6;
  color: var(--fg-color-light);
}

li strong,
p strong {
  color: var(--fg-dark);
  font-weight: 500;
}

li a,
p a {
  color: var(--fg-dark);
  font-weight: 400;
  padding-bottom: 3px;
  border-bottom: 1px dotted #ddd;
}

li a:hover,
p a:hover {
  color: var(--blue);
  border-bottom: none;
}

p a:hover {
  border-bottom-color: var(--color);
}

ul {
  margin: 30px 0 30px 30px;
  padding: 0;
}

ul ul {
  margin: 10px 0 10px 30px;
}

ul li {
  margin: 5px 0;
  color: var(--fg-color-light);
  line-height: 1.5em;
}

ul li strong {
  color: var(--fg-color);
  font-weight: 500;
}

pre {
  background: transparent;
  border: 1px solid #f0f0f0;
  padding: 30px;
  border-radius: 2px;
  overflow-x: auto;
  font: "Source Code Pro", Menlo, monospace;
  font-size: .8em;
  line-height: 1.5em;
  margin: 40px 0;
}

code {
  font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;
}

li > code,
p > code {
  border: 1px solid #DEE2E6;
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 3px;
  white-space: nowrap;
  font-weight: 600;
  font-family: inherit;
}

details > summary {
  cursor: pointer;
  outline: none;
  user-select: none;
}

details > p {
  border-left: 3px solid var(--dark);
  padding-left: 15px;
}
</style>
