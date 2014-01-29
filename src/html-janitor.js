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

  // TODO: not exhaustive?
  var blockElementNames = ['P', 'LI', 'DIV'];
  function isBlockElement(node) {
    return blockElementNames.indexOf(node.nodeName) !== -1;
  }

  HTMLJanitor.prototype.clean = function (html) {
    var sandbox = document.createElement('div');
    sandbox.innerHTML = html;

    this._sanitize(sandbox);

    return sandbox.innerHTML.trim();
  };

  HTMLJanitor.prototype._sanitize = function (parentNode) {
    var treeWalker = createTreeWalker(parentNode);
    var node = treeWalker.firstChild();
    if (!node) { return; }

    do {
      var nodeName = node.nodeName.toLowerCase();
      var allowedAttrs = this.config.tags[nodeName];

      // Ignore text nodes and nodes that have already been sanitized
      // FIXME: Not sure we're getting TEXT_NODE as the walker only walks ELEMENT_NODEs?
      if (node.nodeType === Node.TEXT_NODE || node._sanitized) {
        continue;
      }

      // Remove all comments
      if (node.nodeType === Node.COMMENT_NODE) {
        parentNode.removeChild(node);
        continue;
      }

      var isInlineElement = nodeName === 'b';
      var containsBlockElement;
      if (isInlineElement) {
        containsBlockElement = Array.prototype.some.call(node.childNodes, isBlockElement);
      }

      var isInvalid = isInlineElement && containsBlockElement;

      // Block elements should not be nested (e.g. <li><p>...); if
      // they are, we want to unwrap the inner block element.
      var isNotTopContainer = !! parentNode.parentNode;
      var isNestedBlockElement =
            isBlockElement(parentNode) &&
            isBlockElement(node) &&
            isNotTopContainer;

      // Drop tag entirely according to the whitelist *and* if the markup
      // is invalid.
      if (!this.config.tags[nodeName] || isInvalid || isNestedBlockElement) {
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
        var allowedAttrValue = allowedAttrs[attrName];
        var notInAttrList = ! allowedAttrValue;
        var valueNotAllowed = allowedAttrValue !== true && attr.value !== allowedAttrValue;
        if (notInAttrList || valueNotAllowed) {
          node.removeAttribute(attr.name);
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
    return document.createTreeWalker(node,
                                     NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT);
  }

  return HTMLJanitor;

}));
