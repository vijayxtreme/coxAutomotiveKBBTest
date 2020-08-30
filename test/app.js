//to use fetch in node
const fetch = require('node-fetch')

function coxAutomotiveTest() {
    let baseurl = `http://api.coxauto-interview.com/api`
    let dealers = []
    let memo = {}

    async function getDataSetId() {
        let datasetId = await fetch(`${baseurl}/datasetId`).then(res=> res.json()).catch(err => console.log(error))
        return datasetId
    }

    async function listVehicleIds(datasetId) {
        let vehicles = await fetch(`${baseurl}/${datasetId}/vehicles`)
            .then(response => response.json())
            .catch(error => console.log(error))
        return vehicles 
    }


    async function listVehicleData(vehicleIds, datasetId) {
        let vehicleFetches = vehicleIds.map(id => {
            return `${baseurl}/${datasetId}/vehicles/${id}`
        })
         
        let results = vehicleFetches.map(url => fetch(url).then(response => response.json()))

        let vehicleData = await Promise.all(results)
            .then(results => {
                results.forEach(item => {
                    let dealerId = item.dealerId;

                    let vehicleId = item.vehicleId
                    let year = item.year
                    let make = item.make
                    let model = item.model
                   
                    if (!memo[dealerId]) {
                        dealers.push({
                            "dealerId": dealerId,
                            "name": "",
                            "vehicles": [{
                                "vehicleId": vehicleId,
                                "year": year,
                                "make": make,
                                "model": model
                            }]
                        })
                        memo[dealerId] = true
                    } else {
                        let found = dealers.find(element => element.dealerId === dealerId)
                        found.vehicles.push({
                            "vehicleId": vehicleId,
                            "year": year,
                            "make": make,
                            "model": model
                        })
                    }
                })

                return dealers
            })
            .catch(function (error) {
                // if there's an error, log it
                console.log(error);
            });

            return vehicleData
    }

  
    async function listDealerData(dealers, datasetId) {
        let urls = dealers.map(item => `${baseurl}/${datasetId}/dealers/${item.dealerId}`)
        let results = urls.map(url => fetch(url).then(response => response.json()))

        let dealerData = await Promise.all(results)
            .then(results => {
                results.forEach(item => {
                    let dealerId = item.dealerId;
                    let name = item.name

                    if (!memo[dealerId]) {
                        dealers.push({
                            "dealerId": dealerId,
                            "name": name,
                            "vehicles": []
                        })
                        memo[dealerId] = true
                    } else {
                        let found = dealers.find(element => element.dealerId === dealerId)
                        found.name = name
                    }
                })
                return dealers
            })
            .catch(function (error) {
                // if there's an error, log it
                console.log(error);
            })

        return dealerData
    }

    async function postAnswer(dealers, datasetId) {
        //use our array of dealers we built up so far as data to send to /answer in a POST req
        let postData = {
            "dealers": dealers
        }
        postData = JSON.stringify(postData)
        let url = `${baseurl}/${datasetId}/answer`

        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: postData
        })
        return result.json()
    }

    return {
        getDataSetId,
        listVehicleIds,
        listVehicleData,
        listDealerData,
        postAnswer
    }
}

module.exports = coxAutomotiveTest