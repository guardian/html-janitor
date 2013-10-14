var janitor = require(__dirname + '/../janitor');
var expect = require('expect.js');

describe('janitor', function() {
  it('cleans simple html', function() {
    var result = janitor.clean('<b>uh oh!', {tags: {b: []}});
    expect(result).to.eql('<b>uh oh!</b>');
  });

  it('cleans elements with more than one attribute', function () {
    var result = janitor.clean('<p class="uh oh!" style="font-size: 24px;"></p>', {tags: {p: []}});
    expect(result).to.eql('<p></p>');
  });
});
