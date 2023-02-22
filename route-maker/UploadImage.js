const md5 = require('md5');
const fs = require('fs');

module.exports = async function uploadImage(image, params=null){

    
    const buff = Buffer.from(image.split(';base64,').pop(), 'base64');
    
    
    const imageId = md5(`${Date.now()}`)
    fs.writeFile(`./uploads/${imageId}.jpg`, buff, function(err) {

        console.log(err)
})

    return imageId+'.jpg';
    
}


