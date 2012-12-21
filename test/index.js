var janitor = require(__dirname + '/../janitor');
var expect = require('expect.js');

describe('janitor', function() {
  it('cleans simple html', function() {
    var result = janitor.clean('<b>uh oh!', {tags: {b: []}});
    expect(result).to.eql('<b>uh oh!</b>');
  });
});
