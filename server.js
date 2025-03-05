const express = require('express');
const path = require('path');
const app = express();

app.use((req, res, next) => {
  // redirect HTTP to HTTPS
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }

  next();
});

app.use(express.static(__dirname + '/dist/project-gutenberg-fe/browser'));
app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/project-gutenberg-fe/browser/index.html'));
});

app.listen(process.env.PORT || 8080);
