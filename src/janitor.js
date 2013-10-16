// UMD
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.amdWeb = factory();
  }
}(this, function () {
  function Janitor(config) {
    this.config = config;
  }

  Janitor.prototype.clean = function (html) {
    var sandbox = document.createElement('div');
    sandbox.innerHTML = html;

    this._sanitize(sandbox);

    return sandbox.innerHTML;
  };

  Janitor.prototype._sanitize = function (parentNode) {
    for (var i = 0; i < parentNode.childNodes.length; i += 1) {
      var node = parentNode.childNodes[i];
      var nodeName = node.nodeName.toLowerCase();
      var allowedAttrs = this.config.tags[nodeName];

      // Ignore text nodes and nodes that have already been sanitized
      if (node.nodeType === 3 || node._sanitized) {
        continue;
      }

      // Drop tag entirely
      if (!this.config.tags[nodeName]) {
        while (node.childNodes.length > 0) {
          parentNode.insertBefore(node.childNodes[0], node);
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
    }
  };

  return Janitor;
}));
