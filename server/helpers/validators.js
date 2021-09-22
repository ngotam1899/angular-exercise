isValidFile = (file) => {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg') {
      return false;
  }
  return true;
}

module.exports = {
  isValidFile
}
