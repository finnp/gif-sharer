var blobs = require('fs-blob-store')
var Busboy = require('busboy')
var http = require('http')

var store = blobs({path: './data'})

var server = http.createServer(function (req, res) {
  if(req.method === 'POST') {
    // upload picture
    var form = new Busboy({headers: req.headers})
    var save = store.createWriteStream()
    save.on('finish', function () {
      res.end('Your file is available at /' + save.hash)
      console.log('done')
    })
    
    form.on('file', function (fieldname, file, filename) {
      file.pipe(save)
    })
    form.on('finish', function () {
      res.write('Received your file...')
    })
    req.pipe(form)
  } else {
    if(req.url === '/') {
      var form = '<form action="/" enctype="multipart/form-data" method="post"><input type="file" name="datafile"><input type="submit" value="upload"/></form>'
      res.setHeader('Content-Type', 'text/html')
      res.end(form + '<br>upload your picture')
    } else {
      store.createReadStream({hash: req.url.replace(/\//g, '')}).pipe(res)
    }
  }
})

var port = process.env.PORT || 5000
server.listen(port)
console.log('Listening on port ' + port)