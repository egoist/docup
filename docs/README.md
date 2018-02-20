# Docup

## Introduction

Docup is a single JavaScript file that fetches Markdown file and renders it as a beautiful one-page documentation.

The idea is inspired by my another project ([Docute](https://docute.js.org)) which in turn is inspired by [Flatdoc](http://ricostacruz.com/flatdoc/). And the design is inspired by [tj (TJ Holowaychuk)](https://github.com/tj)'s wonderful docs for [Apex Up](https://up.docs.apex.sh).

## Quick Start

Create an HTML file: `index.html` which will be be homepage of your documentation website:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
  <title>My Awesome Doc</title>
  <!-- Stylesheet -->
  <link rel="stylesheet" href="https://unpkg.com/@egojump/docup/dist/docup.css">
</head>
<body>
  <div id="app"></div>
  <!-- Script -->
  <script src="https://unpkg.com/@egojump/docup/dist/docup.js"></script>
  <!-- Start app -->
  <script>
    var doc = new Docup()
    doc.start('#app')
  </script>
</body>
</html>
```

Then populate a `README.md` file to the same directory where `index.html` is located.

```md
# My Project

## Introduction

How about this.

## Advanced

How about that.
```

Finally serve this directory as a static website:

- node.js: `npm i -g serve` && `serve ./docs`
- python: `cd ./docs` && `python -m SimpleHTTPServer`
- golang: `cd ./docs` && `caddy`
- ...etc, you can use any static file server, for real.

## Guide

### Site Title

We use the value of `h1` title as the site title.

### Message Blocks

To highlight some messages in your documentation, use the following format to write a `blockquote`:

```md
> __Alert__: This is a very dangerous action!
```

On GitHub it will be rendered as follows:

![2017-12-01 1 22 20](https://user-images.githubusercontent.com/8784712/33468930-b835cb64-d69a-11e7-8ab2-25585d61915d.png)

And with Docup it renders:

> __Alert__: This is a very dangerous action!

We also support other message types which are:

```md
> __Info__: This is a info!

<!-- -->

> __Warning__: This is a warning!

<!-- -->

> __Success__: This is ok!

<!-- -->

> __Note__: This is just a note!
```

> __Warning__: Notice the `<!-- -->` here, we use it to write multiple blockquotes in sequence without them being merged into one blockquote. It's unnecessary if you only have one blockquote.

And they look like:

> __Info__: This is a info!

<!-- -->

> __Warning__: This is a warning!

<!-- -->

> __Success__: This is ok!

<!-- -->

> __Note__: This is just a note!

### Hide specific content

If you want to display some part on GitHub while keeping it invisible in Docup, you can use following html comment marks:

```html

<!-- hide-on-docup-start -->

This part is not visible while viewing as a Docup website.

<!-- hide-on-docup-stop -->

```

> __Warning__: There should be newlines wrapping the starting and ending mark, like what you see above.

For example, you can see an image down below while [viewing on GitHub](https://github.com/egojump/docup#hide-specific-content). 😜

<!-- hide-on-docup-start -->

<!-- hi -->
![hide-image](https://media.giphy.com/media/e3GqXDAZhNsxG/giphy.gif)

<!-- hide-on-docup-stop -->

### Show specific content

If you want to hide some part on GitHub while keeping it visible in Docup, you can use following html comment marks:

```html
<!-- show-on-docup
This part is not visible on github, as it's html comment :)
But it's visible on your Docup website.
All markdown features except html comments are supported here.
-->
```

If you're on the Docup website, you can see an image down below.

<!-- show-on-docup
![hide-image](https://media.giphy.com/media/e3GqXDAZhNsxG/giphy.gif)
-->

### Embeding

Embeding and run code snippets is easy if your provider supports iframe, like [codesandbox.io](https://codesandbox.io):

```html
<iframe 
  src="https://codesandbox.io/embed/vue" 
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" 
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin">
</iframe>
```

## Deploy

### GitHub Pages

Simply put all your files in `docs` folder on `master` branch, or root directory on the `gh-pages` branch.

Then enable it on repo's `settings` page:

![gh-pages enable](https://i.loli.net/2017/12/04/5a24edfb02a93.png)

Don't forget to add `.nojekyll` file to tell GitHub to treat it as a normal static website.

## API

### Constructor

```js
const doc = new Docup(options)
```

#### options

##### title

Type: `string`

The title that is shown in the header. It defaults to the value of `h1` title in your markdown file.

##### description

Type: `string`

The description that is shown below the title.

##### indexFile

Type: `string`<br>
Default: `README.md`

##### root

Type: `string`<br>
Default: `./`

##### highlight

Type: `boolean` `function`<br>
Default: `true`

Whether to highlight code blocks, you can supply a function to customize this:

```js
function highlight(code, lang) {}
```

##### highlightFirstParagraph

Type: `boolean`<br>
Default: `false`

Highlight the first paragraph after `h2` titles. Basically this option enables following CSS:

```css
h2 + p {
  font-size: 1.6rem;
  line-height: 1.6;
}
```

#### doc.start(target)

##### target

Type: `string` `HTMLElement`

The place to mount app to.

## Roadmap

### Browser support

I will add support for IE10+ very soon.

### Prerender

Prerender `index.html`

### Multi-route support

Maybe, maybe not.

## License

MIT &copy; EGOIST
