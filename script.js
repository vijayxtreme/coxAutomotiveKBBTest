function coxAutomotiveTest() {
    let baseurl = `http://api.coxauto-interview.com/api`
    let dataSetId = ''
    let apiUrl = ''
    let dealers = []
    let memo = {}
    let thinking //setInterval

    document.querySelector('#dataIdGet').addEventListener('click', init)

    //One network request
    function init() {
        //get the datasetId
        fetch(`${baseurl}/datasetId`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                document.querySelector('#datasetid').innerHTML = data.datasetId
                dataSetId = data.datasetId
                apiUrl = `${baseurl}/${dataSetId}`
                let count = 0;
                thinking = setInterval(() => {
                    let res = document.querySelector('#result')

                    switch (count) {
                        case 0:
                            res.innerHTML = "Thinking.";
                            count++;
                            break;
                        case 1:
                            res.innerHTML = "Thinking..";
                            count++;
                            break;
                        case 2:
                            res.innerHTML = "Thinking...";
                            count++;
                            break;
                        case 3:
                            res.innerHTML = "Thinking";
                            count = 0;
                            break;
                        default:
                            break;
                    }
                }, 1000)

                //get the vehicles associated w/datasetId
                listVehicles()
            })
            .catch(error => console.log(error))
    }

    //One network request
    function listVehicles() {
        fetch(`${apiUrl}/vehicles`)
            .then(response => response.json())
            .then(response => {
                let vehicleIds = response.vehicleIds
                let vehicleFetches = vehicleIds.map(id => {
                    return `${apiUrl}/vehicles/${id}`
                })

                //for each item N in vehicleFetches array, there's N requests
                //here's where it can get slow
                listVehicleData(vehicleFetches)

            })
            .catch(error => console.log(error))
    }

    //Network requests depend on number of ids to look up
    function listVehicleData(vehicleFetches) {
        //get each vehicle data from id 
        let results = vehicleFetches.map(url => fetch(url).then(response => response.json()))

        //use promise all for optimization, rather than fetch multiple times, load up all fetches
        //and use promise all to run requests in parallel
        Promise.all(results)
            .then(results => {
                //console.log(results)

                //let's start to build up "answer" (aka the dealers object we will post to /answer)
                results.forEach(item => {
                    let dealerId = item.dealerId;

                    let vehicleId = item.vehicleId
                    let year = item.year
                    let make = item.make
                    let model = item.model

                    //memo to help organize data by dealerId
                    //if dealerId doesn't exist, let's add the new dealer to global dealers array of dealer objects
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
                        //if dealerId is already in our memo, then just find the dealer from our global dealer objects
                        //and add additional vehicle data to the "vehicles" array in our dealer object
                        //note the more dealers we have, the longer time it will take to "find" a dealer
                        let found = dealers.find(element => element.dealerId === dealerId)
                        found.vehicles.push({
                            "vehicleId": vehicleId,
                            "year": year,
                            "make": make,
                            "model": model
                        })
                    }
                })

                //because we used memo, we reduce the number of network requests for dealer, since we no longer
                //make redundant requests -- the dealers are all organized by dealer id
                let urls = dealers.map(item => `${apiUrl}/dealers/${item.dealerId}`)

                //time based on # of dealers to request
                listDealerData(urls)
            })
            .catch(function (error) {
                // if there's an error, log it
                console.log(error);
            });
    }

    //for n dealers, this runs in O(n) time - linear
    //goal for this function is to just get name of dealer
    function listDealerData(dealerUrls) {
        let results = dealerUrls.map(url => fetch(url).then(response => response.json()))

        //we can load up fetch requests and use Promise.all to call them in parallel
        Promise.all(results)
            .then(results => {
                // console.log(results)
                results.forEach(item => {
                    let dealerId = item.dealerId;
                    let name = item.name

                    //get name and id of dealer, if we don't have the dealer in our dealers array
                    //then add the dealer along with relevant info; if we didn't have the id before, then
                    //vehicles are going to be empty by default
                    if (!memo[dealerId]) {
                        dealers.push({
                            "dealerId": dealerId,
                            "name": name,
                            "vehicles": []
                        })
                        memo[dealerId] = true
                    } else {
                        //else update the dealer name on the dealer object
                        let found = dealers.find(element => element.dealerId === dealerId)
                        found.name = name
                    }
                })

                //sanity check, how does our built dealers array look?
                console.log("Dealers", dealers)

                //post to /answer, log the result to console
                let res = postAnswer(dealers)
                res.then(data => {
                    console.log(data)
                    clearInterval(thinking)
                    document.querySelector('#result').innerHTML = JSON.stringify(data)
                })
                
            })
            .catch(function (error) {
                // if there's an error, log it
                console.log(error);
            })
    }

    //this function builds up a fetch POST request with our built up dealers array of dealer objects
    //the post request is then sent to /answers to verify
    async function postAnswer(dealers) {
        let postData = {
            "dealers": dealers
        }
        postData = JSON.stringify(postData)
        let url = `${apiUrl}/answer`

        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: postData
        })
        return result.json()
    }

}

window.onload = coxAutomotiveTest


//kick it off! or not.
//init()