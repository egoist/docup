<div style="font-size:1.3rem;">

**Docup** is a single JavaScript file that fetches Markdown file and renders it as a beautiful one-page documentation.

Docup is built with Preact, the entire bundle (with CSS) is just 30kB minified and gzipped.

</div>

## Quick Start

Create an HTML file: `index.html` which will be be homepage of your documentation website:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
    />
    <title>My Awesome Doc</title>
    <!-- Stylesheet -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/@egoist/docup@1/dist/docup.css"
    />
  </head>
  <body>
    <div id="app"></div>
    <!-- Script -->
    <script src="https://unpkg.com/@egoist/docup@1/dist/docup.js"></script>
    <!-- Start app -->
    <script>
      docup.init({
        // ..options
      })
    </script>
  </body>
</html>
```

Then populate a `README.md` file to the same directory where `index.html` is located.

```md
## Introduction

How about this.

## Advanced

How about that.
```

Finally serve this directory as a static website:

- **node.js**: `npm i -g sirv-cli && sirv .`
- **deno**: `deno install --allow-net --allow-read https://deno.land/std/http/file_server.ts && file_server .`
- **python**: `python -m SimpleHTTPServer`
- ...etc, you can use any static file server, for real.

## Guide

### Site Title

We use the value of `document.title` if it's not `undefined`, you can also set a title via options:

```js
docup.init({
  title: 'My Website',
})
```

### Message Blocks

To highlight some messages in your documentation, use the following format to write a `blockquote`:

```md
> [TYPE]: This is a very dangerous action!
```

Where `[TYPE]` can be:

- `Alert`
- `Warning`
- `Info`
- `Success`
- `Note`

And they look like:

> **Alert**: This is an alert!

> **Warning**: This is a warning!

> **Info**: This is a info!

> **Success**: This is a success!

> **Note**: This is just a note!

### Embeding

Embeding and run code snippets is easy if your provider supports iframe, like [codesandbox.io](https://codesandbox.io):

```html
<iframe
  src="https://codesandbox.io/embed/vue"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
>
</iframe>
```

### Hightlight

Docup uses [Prism.js](http://prismjs.com/) to highlight code blocks, by default only a few languages are supported, namely: `html` `css` `js` `markdown` `bash` `json`, you can manually load Prism language components to support more languages, e.g. for Go programming language:

```js
docup.init({
  highlightLanguages: ['go'],
})
```

Available languages:

```js preact
const { useState } = hooks

export default ({ langs }) => {
  const [showAll, setShowAll] = useState(false)
  return html`<div>
    <ul>
      ${(showAll ? langs : langs.slice(0, 5)).map(
        (lang) => html`<li key="{lang}">${lang}</li>`
      )}
    </ul>
    <button
      style="margin-top:20px;border:1px solid; font-size: 14px; padding:5px;"
      onClick=${() => setShowAll(!showAll)}
    >
      Show ${showAll ? 'less' : 'all'}..
    </button>
  </div>`
}
```

### Inline Component

You can inline Preact components inside Markdown file like this:

````markdown
```js preact
const { useState } = hooks

export default () => {
  const [count, setCount] = useState(0)
  return html`<button 
    style="width:100px;background:#ccc;padding:5px"
    onClick=${() => setCount(count + 1)}>
    ${count}
  </button>`
}
```
````

Write `preact` next to the language name and we will render the code as a Preact component in place:

```js preact
const { useState } = hooks

export default () => {
  const [count, setCount] = useState(0)
  return html`<button style="width:100px;background:#ccc;padding:5px" 
  onClick=${() => setCount(count + 1)}>
    ${count}
  </button>`
}
```

> Warning: Note that you can't use JSX here, because it's not supported by browsers natively. But you can use the `html` function which is powered by [developit/htm](https://github.com/developit/htm).

## Deploy

### GitHub Pages

Simply put all your files in `docs` folder on `master` branch, or root directory on the `gh-pages` branch.

Then enable it on repo's `settings` page:

![gh-pages enable](https://i.loli.net/2017/12/04/5a24edfb02a93.png)

Don't forget to add `.nojekyll` file to tell GitHub to treat it as a normal static website.

### Netlify

Set the public directory to where your `index.html` is located at.

### Vercel

Set the public directory to where your `index.html` is located at.

## API

```js
docup.init(options)
```

### options

#### title

- Type: `string`

The title that is shown in the navbar. It defaults to `document.title`

#### logo

- Type: `string`

Using HTML string to display logo, e.g.:

```html
<img src="logo.svg" width="60" />
```

#### navLinks

- Type: `NavLink[]`

Links in the navbar.

```ts
interface NavLink {
  text: string
  link: string
}
```

#### indexFile

- Type: `string`
- Default: `README.md`

#### root

- Type: `string`
- Default: `./`

The root path we use to resolve files from.

#### highlightLanguages

- Type: `string[]`

Extra languages to highlight.

## Browser support

Last 2 versions of modern browsers.

## Resources

### Discord Chat

Join my [Discord Community](https://chat.egoist.sh).

### GitHub Sponsors

Support this project via [GitHub Sponsors](https://github.com/sponsors/egoist).

## License

MIT &copy; EGOIST
