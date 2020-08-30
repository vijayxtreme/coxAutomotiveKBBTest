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
api.dataSetGetCheat(datasetId, callback);
