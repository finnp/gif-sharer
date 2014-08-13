var blobs = require('fs-blob-store')
var Busboy = require('busboy')
var http = require('http')
var fs = require('fs')

var store = blobs({path: './data'})

var server = http.createServer(function (req, res) {
  if(req.method === 'POST') {
    // upload picture
    var form = new Busboy({headers: req.headers})
    var save = store.createWriteStream()
    save.on('finish', function () {
      res.end('Your file is available at /' + save.hash)
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
      res.setHeader('Content-Type', 'text/html')
      fs.createReadStream('./index.html').pipe(res)
    } else {
      var blob = {hash: req.url.replace(/\//g, '')}
      store.exists(blob, function (err, exists) {
        if(err || !exists) {
          res.writeHead(404)
          res.end('file not found')
        } else {
          res.setHeader('Content-Type', 'image/gif')
          store.createReadStream(blob).pipe(res)  
        }
      })
    }
  }
})

var port = process.env.PORT || 5000
server.listen(port)
console.log('Listening on port ' + port)