const path = require('path');
const fs = require('fs')
const multer = require('multer');
const { fips } = require('crypto');

/**
 * Return Middleware To Save Multiple Albums
 * Album Location Path -> /service_albums/userId/serviceId/albumName/date_fileOriginalName
*/
function updateAlbum() {
    const storage = multer.diskStorage({
        destination: async function (req, file, cb) {
            const filePath = __dirname + '/../public/service_albums/' + req.user._id + '/' + req.body.serviceId +'/'+req.body.albumName
            await fs.promises.mkdir(filePath, { recursive: true })
            return cb(null, filePath);
        },

        filename: function (req, file, cb) {
            return cb(null, Date.now() + '_' + file.originalname)
        }
    })

    const upload = multer({ storage });
    return upload.array('files')
}


function uploadServiceProfilePicture() {
    const storage = multer.diskStorage({
        destination: async function (req, file, cb) {
            const filePath =  __dirname + '/../public/service_albums/' + req.user._id + '/' + req.params.serviceId;
            await fs.promises.mkdir(filePath, { recursive: true });
            cb(null, filePath);
        },
        filename: function (req, file, cb) {
            cb(null, 'serviceProfilePicture');
        }
    });

    const upload = multer({ storage });
    return upload.single('serviceProfilePicture');
}


module.exports = { updateAlbum, uploadServiceProfilePicture }


