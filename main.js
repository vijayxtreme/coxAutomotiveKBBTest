//My solution herrrrr...

var DealersAndVehicles = require('dealers_and_vehicles');

var api = new DealersAndVehicles.DataSetApi()

var datasetId = "pw88L7pL2Ag"; // {String} 


var callback = function (error, data, response) {
    if (error) {
        console.error(error);
    } else {
        console.log(data)
    }
};

//NEXT STEPS
//Get datasetId from Url
//Get vehicles from dataSetId via endpoint
//Get dealers from dataSetId via endpoint
//Build up POST response
//post to endpoint answer with both the dataSetId and res object
//Optimize

api.dataSetGetCheat(datasetId, callback);
