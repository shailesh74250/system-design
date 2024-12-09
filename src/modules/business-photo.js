const axios = require('axios');

let data = JSON.stringify({
    "url": "https://deep-image.ai/api-example3.jpg",
    "width": 1024,
    "height": 1024,
    "background": {
        "generate": {
            "description": " a woman sitting behind a desk in a modern office environment. her smiling face is seen from behind her computer screen, with only the top of her head and a portion of her shoulders visible. The office space around her is bright and airy, illuminated by soft, natural light streaming in from large windows.",
            "adapter_type": "face",
            "face_id": true
        }
    }
});

exports.businessImage = (req, res) => {
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://deep-image.ai/rest_api/process_result',
    headers: { 
      'content-type': 'application/json', 
      'x-api-key': 'f7277c70-ae0e-11ef-bf44-39e16bc38d8c'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    const image = response.data;
    res.send(image);
  })
  .catch((error) => {
    console.log(error);
  });
}