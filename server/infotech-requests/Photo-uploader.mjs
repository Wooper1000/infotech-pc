import instance from "../midddleware/auth-request.mjs";
import fs from 'fs'

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

console.log(__dirname)
class PhotoUploader {
    async postPhotoOnInfotechServer (photo, uid) {
        // setTimeout(() => {
            let data = fs.createReadStream(__dirname +'/../'+photo.path)
        // },2000)

        //let data = fs.createReadStream(__dirname + '/photo1.jpg')
        return new Promise((resolve, reject) => {
            console.log('Загружаем фото')
            instance.post('/files/uploadbin', data, {
                headers: {
                    'Content-Disposition': `filename=${new Buffer(photo.originalname).toString('base64')}`,                                //имя файла в base64
                    'CRM-uidOwner': uid,                  //uid заявки
                    'CRM-FileName': new Buffer(photo.originalname).toString('base64'),                                  //не понятно образованное имя в Base64
                    'CRM-typeOwner': '0L7QsdC40YLQl9Cw0Y/QstC60LDQndCw0KDQsNCx0L7RgtGLDQo=', //не меняется
                    'CRM-filetype': 'NDc1MzAzYTgtODc3MS0xMWU0LTgzMWYtMDAzMDQ4YzZiNGFiDQo=',  //не меняется
                }
            })
                .then(result => {
                    console.log(result.data.ReturnText)
                    if (!result.data.ReturnCode) resolve(result.data.ReturnText)
                    else reject('error while loading photo')
                }).catch(err=>console.log(err) )
        })
    }
    uploadPhotos(photos,uid){
        let promises = []
        photos.forEach(photo=>{
            promises.push(this.postPhotoOnInfotechServer(photo,uid))
        })
        return Promise.all(promises)
    }
}
export default new PhotoUploader()