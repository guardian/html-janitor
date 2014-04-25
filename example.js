require({
  baseUrl: './build'
}, [ 'html-janitor' ], function (module) {
  var janitor = new module.HTMLJanitor({
    tags: {
      p: { foo: true, bar: 'baz' }
    }
  });

  var p = document.createElement('p');
  p.setAttribute('style', 'font-size: 16px;');
  p.setAttribute('bar', 'baz');
  console.log(janitor.clean(p.outerHTML));
});
