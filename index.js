/* eslint-env node */
const Plugin = require('broccoli-plugin');
const path = require('path');
const fs = require('fs');
const walkSync = require('walk-sync');
const fileExtension = require('file-extension');
const yamlFront = require('yaml-front-matter');

const JSONAPISerializer = require('json-api-serializer');

class BlogPlugin extends Plugin {
  constructor(inputNodes, options) {
    if (!Array.isArray(inputNodes)) {
      inputNodes = [inputNodes];
    }

    super(inputNodes, options);
    const customSerializer = options.serializerOptions || {};
    const serializerOptions = Object.assign({}, {
      blacklist: []
    }, customSerializer);

    this.serializer = new JSONAPISerializer();
    this.serializer.register('blog-post', serializerOptions);
  }

  build() {
    const mdFiles = this.inputPaths.map(p => [p, walkSync(p)])
      .reduce((flat, [p, names]) => [...flat, ...names.map(f => [p, f])], [])
      .filter(([p, f]) => fileExtension(f) === 'md')
      .map(([p, f]) => [f, fs.readFileSync(path.join(p, f))])
      .map(([p, md]) => [p, yamlFront.loadFront(md)])
      .map(([p, data]) => {
        const blog = Object.assign({}, data);
        delete blog.__content;
        blog.content = data.__content.trim();
        blog.id = path.basename(p, '.md');

        return [p, blog];
      });

    const indexJson = this.serializer.serialize('blog-post', mdFiles.map(([p, d]) => d), {
      topLevelLinks: {
        self: '/blog-posts.json'
      }
    });

    fs.writeFileSync(path.join(this.outputPath, 'blog-posts.json'), JSON.stringify(indexJson, null, 2));
    const apiPath = path.join(this.outputPath, 'blog-posts');

    if (!fs.existsSync(apiPath)) {
      fs.mkdirSync(apiPath);
    }

    mdFiles.forEach(([mdName, data]) => {
      const id = path.basename(mdName, '.md');
      const jsonName = `${id}.json`;
      const jsonData = this.serializer.serialize('blog-post', data, {
        topLevelLinks: {
          self: `/blogs${jsonName}`
        }
      });


      fs.writeFileSync(path.join(apiPath, jsonName), JSON.stringify(jsonData, null, 2));
    });
  }
}

module.exports = BlogPlugin;
