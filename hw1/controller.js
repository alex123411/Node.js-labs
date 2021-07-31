const { exception } = require('console');
const fs = require('fs');
const path = require('path');

const folderPath = './files/';

function postFileController (req, res, next){
    if(!req.body.content){
      res.status(400).send({'message': "Please specify 'content' parameter"});
    }
    else{
      fs.writeFile(path.join(__dirname, folderPath, `${req.body.filename}`), `${req.body.content}`, (err) => {
        if (err) {
          next(err)
        } else{
          res.status(200).send({ 'message': 'File created successfully' });
        }
      })
    }
  }
  
function getFilesController (req, res, next){
    fs.readdir(folderPath, (err, files) => {
        if (!err){
        let list = [];
        files.forEach(file => {
            list.push(file);
        });
        res.status(200).send({
            "message": "Success",
            "files": [
            `${list}`
            ]
        })
        } else{
        next(err)
        }
    });
}


function getFileByFilename(req, res, next){
    const fileName = req.params.filename
    let content = ''
    
    fs.readFile(folderPath + fileName, 'utf8', function(err, contents) {
        if (err) {
        next(err)
        } else{
            try{
            let {date} = fs.statSync(`${folderPath + fileName}`)
            let extension = fileName.split('.').pop();
            res.send({"message":"Success",
            "filename": `${fileName}`,
            "content": `${contents}`,
            "extension": `${extension}`,
            "uploadedDate": `${date}`
            })} catch (error) {
                console.log(error)
                next(err)
            }   
        }
    })

    
}

module.exports = {
    postFileController: postFileController,
    getFilesController: getFilesController,
    getFileByFilename: getFileByFilename
}