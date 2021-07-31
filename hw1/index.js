const path = require('path');
const fs = require('fs');

const express = require('express');
const { runInNewContext } = require('vm');
const app = express();
const apiController = require('./controller.js');


app.use(express.json());
app.use((req , res, next) =>{
  console.log(req.method);
  console.log(req.url);
  next();
})
app.listen(8080)

app.route('/api/files')
  .post(function(req, res, next) {
    apiController.postFileController (req, res, next)
  })
  .get(function(req, res, next) {
    apiController.getFilesController (req, res, next)
  });

app.get('/api/files/:filename', function (req, res, next) {
  apiController.getFileByFilename(req, res, next)
});



//ERROR HANDLER
app.use(errorHandler)

function errorHandler (err, req, res, next) {
  console.log(err)
  res.status(500).send({'message': 'Server error'});
}

