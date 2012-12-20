janitor-js
==========

### Sanitize HTML tags, attributes, and protocols using the native DOM parser.

Parsing, cleaning, and sanitizing HTML is a pain in the ass.  There are lots of libraries that do it, 
but they require well-formed or psuedo well-formed HTML.  If you're cleaning or parsing user-generated
HTML, chances are it's going to be messed up now and then, and this causes many HTML parsers to barf or
drop content entirely.

Janitor-js uses the best DOM parser for janky HTML -- the browser.  It can be run client-side or
server-side with headless WebKit.

## Examples

Only allow A and B tags, with "href" being the only allowed attribute:

    var config = {
      tags: {
        b: [],
        a: [ 'href' ]
      }
    }
    
    Janitor.clean('<div><b>bold text</b></div>', config)
      -> '<b>bold text</b>'
      
Fix unclosed tags:

    Janitor.clean('<b>uh oh!', config)
      -> '<b>uh oh!</b>'
      
Filter out XSS in href attributes:

    var config = {
      tags: {
        b: [],
        a: [ 'href' ]
      },
      protocols: [ 'http', 'https' ]
    }
    
    Janitor.clean('<a href="javascript:alert(document.cookie)">click me please</a>', config)
      -> '<a href="">click me please</a>'
    
Fix *really* messed up HTML:

    config = {
      tags: {
        b: [],
        div: [],
        ul: [],
        li: [],
        a: [ 'href' ]
      },
      protocols: [ 'http', 'https' ]
    }
      
    Janitor.clean('<div>adfasdf<ul><li>asdfasdf<a href="http://google.com">Google</div>', config)
      '<div>adfasdf<ul><li>asdfasdf<a href="http://google.com">Google</a></li></ul></div>'
      
Magic!
