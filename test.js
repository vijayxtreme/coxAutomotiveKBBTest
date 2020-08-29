let baseurl = `http://api.coxauto-interview.com/api`
let dataSetId = ''
let apiUrl = ''
let dealers = []
let memo = {}

function listVehicles(){
    fetch(`${apiUrl}/vehicles`)
        .then(response => response.json())
        .then(response => {
            let vehicleIds = response.vehicleIds
            let vehicleFetches = vehicleIds.map(id => {
                return `${apiUrl}/vehicles/${id}`
            })
            listVehicleData(vehicleFetches)

        })
        .catch(error => console.log(error))
}

function listVehicleData(vehicleFetches) {
    //get each vehicle
    let results = vehicleFetches.map(url => fetch(url).then(response => response.json()))

    Promise.all(results)
    .then(results => {
        //console.log(results)
        results.forEach(item => {
            let dealerId = item.dealerId;

            let vehicleId = item.vehicleId
            let year = item.year
            let make = item.make
            let model = item.model

            if(!memo[dealerId]){
                dealers.push({
                    "dealerId":dealerId,
                    "vehicles":[{
                        "vehicleId":vehicleId,
                        "year":year,
                        "make":make,
                        "model":model
                    }]
                })
                memo[dealerId] = true
            }else {
                let found = dealers.find(element => element.dealerId === dealerId)
                found.vehicles.push({
                    "vehicleId": vehicleId,
                    "year": year,
                    "make": make,
                    "model": model
                })
            }
        })

        let urls = results.map(item => `${apiUrl}/dealers/${item.dealerId}`)
        listDealerData(urls)
        // console.log(new Date() - t)
    })
    .catch(function (error) {
        // if there's an error, log it
        console.log(error);
    });
}

function listDealerData(dealerUrls){
    let results = dealerUrls.map(url => fetch(url).then(response => response.json()))

    Promise.all(results)
    .then(results =>{
        // console.log(results)
        results.forEach(item => {
            let dealerId = item.dealerId;
            let name = item.name

            if (!memo[dealerId]) {
                dealers.push({
                    "dealerId": dealerId,
                    "name": name,
                    "vehicles":[]
                })
                memo[dealerId] = true
            } else {
                let found = dealers.find(element => element.dealerId === dealerId)
                found.name = name
            }
        })

        console.log("Dealers", dealers)

        //post
        let res = postAnswer(dealers)
        console.log("Answer", res.then(data => console.log(data)))
        console.log(new Date() - t)

    })
    .catch(function (error) {
        // if there's an error, log it
        console.log(error);
    })
}

async function postAnswer(dealers){
    let postData = {
        "dealers": dealers
    }
    postData = JSON.stringify(postData)
    let url = `${apiUrl}/answer`

    const result = await fetch(url, {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: postData
    })
    return result.json()
}

function init(){
    fetch(`${baseurl}/datasetId`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            dataSetId = data.datasetId
            apiUrl = `${baseurl}/${dataSetId}`
            listVehicles()
        })
        .catch(error => console.log(error))
}

//kick it off! or not.
init()