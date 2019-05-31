const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Doc = require('./models/Doc');
const dotenv = require('dotenv');
dotenv.config();
const API_PORT = 5201;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = 'mongodb://digital-signature:Sandy12345678@ds117816.mlab.com:17816/digital-signature';

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

const auth = require('./auth');
const requireAuth = auth.passport.authenticate('jwt', {session: false});

app.use('/api/auth/*', requireAuth);
// Include all the routes of modules
require('./rootRoutes')(app);
app.get('/files/:type/:img_name', function(req,res){
    var filename = req.params.img_name;
    var type = req.params.type;
    var ext  = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    if (!ext) {
      ext = 'jpg';
    }
    if (ext == 'svg') {
      ext = 'svg+xml';
    }
    var fs = require('fs');
    var fileDir = config.directory+'/uploads/'+type+'/';
    fs.readFile(fileDir + filename, function (err, content) {
      if (ext == 'pdf') {
        res.writeHead(200,{'Content-type':'application/pdf'});
        res.end(content);
      }else if (err) {
        res.writeHead(400, {'Content-type':'text/html'})
        res.end("No such image");
      } else {
        //specify the content type in the response will be an image
        res.writeHead(200,{'Content-type':'image/'+ext});
        res.end(content);
      }
    });
});

// app.use(express.static(path.join(__dirname, '../build')));
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, '../build', 'index.html'));
// });
// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
