const express = require('express');
const app = express();
const serveIndex = require('serve-index');
const path = require('path');
const appDir = path.dirname(require.main.filename);

const ROOT_SRC = appDir + '/../src/demo';
const ROOT_DIST = appDir + '/../dist';
const LISTEN_ROOT = ROOT_DIST;

// works!! but only when run from serv folder
// app.use(express.static('../src/demo'));
// app.use(serveIndex('../src/demo'));

app.use(express.static(LISTEN_ROOT));
app.use(serveIndex(LISTEN_ROOT));

// app.get('/', (req, res) => {
//     res.send('An alligator approaches!');
//     next();
// });


app.listen(3000, () => console.log('Server listening on port 3000! root folder is ' + LISTEN_ROOT));