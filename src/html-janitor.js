// UMD
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.amdWeb = factory();
  }
}(this, function () {

  function HTMLJanitor(config) {
    this.config = config;
  }

  HTMLJanitor.prototype.clean = function (html) {
    var sandbox = document.createElement('div');
    sandbox.innerHTML = html;

    this._sanitize(sandbox);

    return sandbox.innerHTML;
  };

  HTMLJanitor.prototype._sanitize = function (parentNode) {
    var treeWalker = createTreeWalker(parentNode);
    var node = treeWalker.firstChild();
    if (!node) { return; }

    do {
      var nodeName = node.nodeName.toLowerCase();
      var allowedAttrs = this.config.tags[nodeName];

      // Ignore text nodes and nodes that have already been sanitized
      if (node.nodeType === 3 || node._sanitized) {
        continue;
      }

      // Drop tag entirely
      if (!this.config.tags[nodeName]) {
        // Do not keep the inner text of SCRIPT/STYLE elements.
        if (! (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE')) {
          while (node.childNodes.length > 0) {
            parentNode.insertBefore(node.childNodes[0], node);
          }
        }
        parentNode.removeChild(node);

        this._sanitize(parentNode);
        break;
      }

      // Sanitize attributes
      for (var a = 0; a < node.attributes.length; a += 1) {
        var attr = node.attributes[a];
        var attrName = attr.name.toLowerCase();

        // Allow attribute?
        if (allowedAttrs.indexOf(attrName) === -1) {
          node.removeAttribute(node.attributes[a].name);
          // Shift the array to continue looping.
          a = a - 1;
        }
      }

      // Sanitize children
      this._sanitize(node);

      // Mark node as sanitized so it's ignored in future runs
      node._sanitized = true;
    } while (node = treeWalker.nextSibling());
  };

  function createTreeWalker(node) {
    return document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
  }

  return HTMLJanitor;

}));
