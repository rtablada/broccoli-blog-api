/* eslint-env node */

'use strict';

const BlogPlugin = require('./index');

module.exports = new BlogPlugin('blog', {
  serializerOptions: {
    links: {
      self(data) {
        return `/blogs/${data.id}.json`;
      }
    },
  }
});
