const axios = require('axios');

let data = JSON.stringify({
    "width": 2048,
    "height": 1024,
    "generative_upscale": true,
    "background": {
        "generate": {
            "description": "small cottage and cows eating grass on the green fields. Sunset."
        }
    }
});

exports.resolutionImage = (req, res) => {
  
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