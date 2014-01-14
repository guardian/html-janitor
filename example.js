require({
  baseUrl: '/src'
}, [ 'html-janitor' ], function (HTMLJanitor) {
  var janitor = new HTMLJanitor({
    tags: {
      p: { foo: undefined, bar: 'baz' }
    }
  });

  var p = document.createElement('p');
  p.setAttribute('style', 'font-size: 16px;');
  p.setAttribute('bar', 'baz');
  console.log(janitor.clean(p.outerHTML));
});
