/*jshint indent: 2, evil: false, boss: true, bitwise: true, curly: true, eqeqeq: true, newcap: true, laxbreak: true, undef: true, white: true, browser: true, jquery: true*/
/*globals require module */
/*

The MIT License (MIT)
Copyright (c) 2012 Get Satisfaction

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

(function () {

  // Support non-browser contexts via jsdom
  if (typeof window === 'undefined') {
    var jsdom = require('jsdom').jsdom;
    var doc = jsdom("<html><body></body></html>");
    var win = doc.createWindow();
    var document = win.document;
  }

  var Janitor = {
    clean: function (html, config) {
      config = config || {};
      config.tags = config.tags || {};
      config.protocols = config.protocols || [];
      config.protocolAttrs = config.protocolAttrs || ['src', 'href'];

      var sandbox = document.createElement('div');
      sandbox.innerHTML = html;

      var sanitize = function (parentNode) {
        for (var i = 0; i < parentNode.childNodes.length; i += 1) {
          var node = parentNode.childNodes[i],
              nodeName = node.nodeName.toLowerCase(),
              attrs = config.tags[nodeName];

          // Ignore text nodes and nodes that have already been sanitized
          if (node.nodeType === 3 || node._sanitized) {
            continue;
          }

          // Drop tag entirely
          if (!config.tags[nodeName]) {
            while (node.childNodes.length > 0) {
              parentNode.insertBefore(node.childNodes[0], node);   
            }
            parentNode.removeChild(node);

            sanitize(parentNode);
            break;
          }

          // Sanitize attributes
          for (var a = 0; a < node.attributes.length; a += 1) {
            var attr = node.attributes[a],
                attrName = attr.name.toLowerCase();

            // Allow attribute?
            if (attrs.indexOf(attrName) === -1) {
              node.removeAttribute(node.attributes[a].name);
            }

            // Allow protocol?
            if (config.protocolAttrs.indexOf(attrName) !== -1) {
              var url = document.createElement('a');
              url.href = attr.value;

              if (config.protocols.indexOf(url.protocol.replace(/\:$/, '')) === -1) {
                node.setAttribute(node.attributes[a].name, '');
              }
            }
          }

          // Sanitize children
          sanitize(node);

          // Mark node as sanitized so it's ignored in future runs
          node._sanitized = true;
        }
      };

      sanitize(sandbox);

      return sandbox.innerHTML;
    }
  };

  // Make Janitor available in both browser and non-browser contexts
  if (typeof window !== 'undefined') {
    window.Janitor = Janitor;
  }
  else {
    module.exports = Janitor;
  }
})();
