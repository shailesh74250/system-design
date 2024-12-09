const axios = require('axios');

let data = JSON.stringify({
    "url": "https://deep-image.ai/api-example.png",
    "width": 1000,
    "height": 1000,
    "background": {
        "generate": {
            "description": "item positioned on plain white background",
            "item_area_percentage": 0.65,
            "color": [217,179,190]
        }
    }
});

exports.productImage = (req, res) => {
  
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