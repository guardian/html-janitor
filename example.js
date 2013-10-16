require({
  baseUrl: '/src'
}, [ 'janitor' ], function (Janitor) {
  var janitor = new Janitor({
    tags: {
      p: []
    }
  });
  
  var p = document.createElement('p');
  p.setAttribute('style', 'font-size: 16px;');
  p.setAttribute('class', 'example-class');
  console.log(janitor.clean(p.outerHTML));
});