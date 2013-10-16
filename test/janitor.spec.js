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
      expect(janitor.clean(p.outerHTML)).toBe('<p></p>');
    });
  });

});
