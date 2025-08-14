const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const urlparser = require('url-parse');
const urlArray = [];

require('dotenv').config();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body
  const parsed = urlparser(url)
  const short_url = urlArray.length + 23150;

  if(!['https:', 'http:'].includes(parsed.protocol) || !parsed.hostname){
    return res.json({error: 'invalid url'})
  }
  
  dns.lookup(parsed.hostname, (err) => {
    if(err) return res.json({error: 'invalid url'})
    else{
      urlArray.push({original_url: url, short_url})
      res.json({original_url: url, short_url})
    }
  })

  
})

app.get('/api/shorturl/:short_url', (req, res) => {
  const { short_url } = req.params;
  const entry = urlArray.find(item => item.short_url == short_url)
  
  if(entry) return res.redirect(entry.original_url)
  else return res.json({error: 'invalid url'})
})
