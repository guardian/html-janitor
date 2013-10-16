define([ 'janitor' ], function (Janitor) {

  describe('janitor', function () {
    var janitor;
    var config = {
      tags: {
        p: []
      }
    };

    beforeEach(function () {
      janitor = new Janitor(config);
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
  });

});
