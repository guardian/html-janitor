# html-janitor

Cleans up your markup and allows you to take control of your HTML.

HTMLJanitor uses a defined whitelist to limit HTML it is given to a defined subset.

![](https://circleci.com/gh/guardian/html-janitor.png?circle-token=bd24300ee650966837a73bfe03386828f0192c06)

## Usage

```
var janitor = new HTMLJanitor(options);

var sanitisedHtml = janitor.clean(html);

```

### Options

A configuration object.

`tags` defines a whitelist of elements that are allowed in the sanitised output. Each entry in the map should be the name of the element and the attributes that a valid for the element.

E.g. `{tags: { p:{}, a: { href: true} }}` would limit the valid HTML subset to just paragraphs and anchor tags. Paragraph tags would have all attributes stripped, and the anchor tags would only have the `href` attribute preserved.

## Distribution

Uses UMD for support in AMD and Common JS environments.

### Not suitable for Node

This library is designed for use in a browser and requires access to [document](https://developer.mozilla.org/en/docs/Web/API/Document) and [createTreeWalker](https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker) to work.

## Installation

```
bower install html-janitor
# or
npm install html-janitor
```

## Development

To run unit tests:

```
npm install
npm run test
```
