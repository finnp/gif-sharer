var blobs = require('fs-blob-store')
var Busboy = require('busboy')
var http = require('http')
var fs = require('fs')

var store = blobs({path: './data'})

var server = http.createServer(function (req, res) {
  if(req.method === 'POST') {
    // upload picture
    res.setHeader('Content-Type', 'text/html')
    var form = new Busboy({headers: req.headers})
    var save = store.createWriteStream()
    save.on('finish', function () {
      res.end('Right click and copy this image url to share it <br> <img src="/' + save.hash +'" alt="gif"/>')
    })
    
    form.on('file', function (fieldname, file, filename, encoding, mimetype) {
      if(mimetype === 'image/gif') {
        file.pipe(save)
      } else {
        res.writeHead(406)
        res.end('Not a GIF File')
      }
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