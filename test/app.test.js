const app = require('./app')()

describe('program posts correct answer', ()=>{
    let datasetId;
    let vehicleIds;
    let dealers;

    it('gets a data set id', async()=>{
        const data = await app.getDataSetId()
        //console.log(data)
        expect(data.datasetId).toBeString()
        datasetId = data.datasetId
    })
    it('gets a list of vehicle ids', async () => {
        const data = await app.listVehicleIds(datasetId)
        //console.log(data)
        expect(data.vehicleIds).toBeArray()
        vehicleIds = data.vehicleIds
    })
    it('gets vehicle data from each vehicle id and returns a list of dealers and their vehicles', async() =>{
        const data = await app.listVehicleData(vehicleIds, datasetId)
        //console.log(data)
        expect(data).toBeArray()
        dealers = data
    })
    it('finds and adds dealer name property, returns complete list of dealers with names and their vehicles', async () => {
        const data = await app.listDealerData(dealers, datasetId)
       // console.log(data)
        expect(data).toBeArray()
        dealers = data
    })
    it('posts our built up dealers object to /answer and returns success and time, is less than 30s, less than 15s', async ()=>{
        const result = await app.postAnswer(dealers, datasetId)
        // console.log(result)
        expect(result.success).toBe(true)
        //less than 30 seconds?
        expect(result.totalMilliseconds/1000).toBeLessThan(30)
        //less than 15 seconds?
        expect(result.totalMilliseconds / 1000).toBeLessThan(15)
    })
})
