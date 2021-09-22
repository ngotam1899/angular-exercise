const cloudinary = require('cloudinary');

module.exports.upload = async (file) => {
	try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      upload_preset: 'dev_setups',
    });
    return uploadResponse.url
	} catch (error) {}
};
