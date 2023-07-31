const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: "dlbgyzjna",
  api_key: "337351247888355",
  api_secret: "uOmOcdZxuqKoNKgPQ6zLrjwo3ac"
});

module.exports = cloudinary