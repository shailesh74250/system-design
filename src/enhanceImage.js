const { v2 } = require('cloudinary');

(async function() {

    // Configuration
    v2.cloudinary.config({ 
        cloud_name: 'dcrkuqiqg', 
        api_key: '532828865417746', 
        api_secret: 'D9dyjtd1WErLKS8pqNTfNeR2OvY' // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await v2.cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = v2.cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = v2.cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
})();