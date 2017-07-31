# Broccoli Blog API

[![npm version](https://badge.fury.io/js/broccoli-blog-api.svg)](https://badge.fury.io/js/broccoli-blog-api)

> Warning this plugin is in very experimental early development and will probably change alot.
> If you have ideas or questions add an Issue to the Github Repository.

This Plugin will translate a directory (or set of directories) of Markdown documents into a static JSONAPI.
The plugin parses front matter and turns it into other properties on the blog post resource.

## Installation

To install this plugin run:

```bash
yarn add broccoli-blog-api
```

## Use

To use this plugin, in your broccoli tree:

```js
const BlogApi = require('broccoli-blog-api');

return new BlogApi('blogs');
```

## Example

To better understand the inputs and outputs of this plugin, look at the [Brocfile.js](Brocfile.js) file, [Blog Directory](blog), and the [Dist Output](dist).

