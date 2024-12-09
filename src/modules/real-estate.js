const axios = require('axios');

let data = JSON.stringify({
    "url": "https://s3.eu-central-1.amazonaws.com/deep-image.ai/api-examples/lost-places-597166_1280.jpg",
    "background": {
       "generate": {
           "description": "A loft style furnishings",
           "adapter_type": "control",
           "controlnet_conditioning_scale": 0.75
       }
    }
});

exports.realEstateImage = (req, res) => {
  
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