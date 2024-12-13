const express = require('express');
const enhanceImageController = require('./modules/auto-enhance');
const businessImageController = require('./modules/business-photo');
const resolutionImageController = require('./modules/generate-hight-resolution-image');
const productImageController = require('./modules/product-photo');
const realEstateImageController = require('./modules/real-estate');
const removeBackgroundImageController = require('./modules/remove-background');
const documentImageController = require('./modules/enhance-document');

const router = express.Router();

router.post('/enhance', enhanceImageController.enhanceImage);
router.post('/business', businessImageController.businessImage);
router.post('/document', documentImageController.documentImage);
router.post('/resolution', resolutionImageController.resolutionImage);
router.post('/product', productImageController.productImage);
router.post('/real-estate', realEstateImageController.realEstateImage);
router.post('/remove-background', removeBackgroundImageController.removeBackGroundImage);

module.exports = router;