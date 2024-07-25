const path = require('path');
const fs = require('fs')
const multer = require('multer');

/**
 * Return Middleware To Save Multiple Albums
 * Album Location Path -> /service_albums/userId/serviceId/albumName/date_fileOriginalName
*/
function updateAlbum(){
    const storage = multer.diskStorage({
        destination: async function(req,file,cb){
            const filePath = __dirname+'/../service_albums/'+req.user._id+'/'+req.body.serviceId+'/'+req.body.albumName
            await fs.promises.mkdir(filePath,{recursive:true})
            return cb(null, filePath); 
        },
    
        filename: function(req,file,cb){ 
            return cb(null,Date.now()+'_'+file.originalname) 
        }
    })
    
    const upload = multer({storage});

    return upload.array('files')
}


module.exports = { updateAlbum }


