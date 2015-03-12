define([ 'html-janitor' ], function (HTMLJanitor) {

  describe('janitor', function () {
    var janitor;
    var config = {
      tags: {
        a: {
          href: true
        },
        b: {},
        i: {},
        strong: {},
        em: {},
        sub: {},
        sup: {},
        u: {},
        strike: {},

        p: { foo: true, bar: 'baz' },
        ul: {},
        li: {},
        div: {}
      }


    };

    beforeEach(function () {
      janitor = new HTMLJanitor(config);
    });

    it('should clean attributes not in the whitelist', function () {
      var p = document.createElement('p');
      p.setAttribute('style', 'font-size: 16px;');
      p.setAttribute('bar', 'not baz');
      expect(janitor.clean(p.outerHTML)).toBe('<p></p>');
    });

    it('should not clean attributes in the whitelist', function () {
      var p = document.createElement('p');
      p.setAttribute('foo', 'true');
      p.setAttribute('bar', 'baz');
      var cleanP = janitor.clean(p.outerHTML);
      expect(cleanP).toMatch(/foo="true"/);
      expect(cleanP).toMatch(/bar="baz"/);
    });

    it('should remove elements not in the whitelist', function () {
      var aside = document.createElement('aside');
      var p = document.createElement('p');
      aside.appendChild(p);
      expect(janitor.clean(aside.outerHTML)).toBe('<p></p>');
    });

    it('should not keep the inner text of a script element', function () {
      var script = document.createElement('script');
      script.innerText = 'window.alert(\'foo\');';
      expect(janitor.clean(script.outerHTML)).toBe('');
    });

    it('should not keep the inner text of a style element', function () {
      var style = document.createElement('style');
      style.innerText = '.foo {}';
      expect(janitor.clean(style.outerHTML)).toBe('');
    });

    it('should clean invalid markup', function () {
      var b = document.createElement('b');
      var p = document.createElement('p');
      b.appendChild(p);
      expect(janitor.clean(b.outerHTML)).toBe('<p></p>');
    });

    it('should clean paragraphs in lists', function () {
      var ul = document.createElement('ul');
      ul.innerHTML = '<li><p>Some text</p></li>';
      expect(janitor.clean(ul.outerHTML)).toBe('<ul><li>Some text</li></ul>');
    });

    it('should remove comments', function () {
      var p = document.createElement('p');
      p.innerHTML = 'Hello <b>world</b> <!-- a salutation -->!';
      expect(janitor.clean(p.outerHTML)).toBe('<p>Hello <b>world</b> !</p>');
    });

    it('should remove text nodes in-between block elements', function () {
      var html = '<p></p>\n<p></p>';
      expect(janitor.clean(html)).toBe('<p></p><p></p>');
    });

    it('should remove text nodes before block elements', function () {
      var html = '\n<p></p>';
      expect(janitor.clean(html)).toBe('<p></p>');
    });

    it('should remove text nodes after block elements', function () {
      var html = '<p></p>\n';
      expect(janitor.clean(html)).toBe('<p></p>');
    });
    it('should remove nested span elements', function() {
      var html ='<p><span>Hello <span>world</span></span></p>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');
    });

    it('should not allow nested block elements by default', function() {
      var html = '<div>Hello <div>world</div></div>';
      expect(janitor.clean(html)).toBe('<div>Hello world</div>');
    });

    it('should not allow nested block elements inside inline elements', function() {
      var html = '<strong><p>Hello world</p></strong>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<b><p>Hello world</p></b>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<em><p>Hello world</p></em>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<i><p>Hello world</p></i>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<sub><p>Hello world</p></sub>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<sup><p>Hello world</p></sup>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<u><p>Hello world</p></u>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<strike><p>Hello world</p></strike>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<a href="test"><p>Hello world</p></a>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');
    });

    it('should allow inline elements inside block elements', function() {
      var html = '<p>Hello <strong>world</strong></p>';
      expect(janitor.clean(html)).toBe('<p>Hello <strong>world</strong></p>');
    });

  });

  describe('janitor that allows nested block elements', function () {
    var janitor;
    var config = {
      tags: {
        div: {}
      },
      keepNestedBlockElements: true
    };

    beforeEach(function () {
      janitor = new HTMLJanitor(config);
    });


    it('should allow nested block elements', function() {
      var html = '<div>Hello <div>world</div></div>';
      expect(janitor.clean(html)).toBe('<div>Hello <div>world</div></div>');
    });

  });

});
