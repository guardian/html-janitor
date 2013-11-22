define([ 'html-janitor' ], function (HTMLJanitor) {

  describe('janitor', function () {
    var janitor;
    var config = {
      tags: {
        p: []
      }
    };

    beforeEach(function () {
      janitor = new HTMLJanitor(config);
    });

    it('should clean attributes not in the whitelist', function () {
      var p = document.createElement('p');
      p.setAttribute('style', 'font-size: 16px;');
      p.setAttribute('class', 'example-class');
      expect(janitor.clean(p.outerHTML)).toBe('<p></p>');
    });

    it('should remove elements not in the whitelist', function () {
      var div = document.createElement('div');
      var p = document.createElement('p');
      div.appendChild(p);
      expect(janitor.clean(div.outerHTML)).toBe('<p></p>');
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
  });

});
