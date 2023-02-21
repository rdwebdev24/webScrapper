const express = require('express');
const ObjectsToCsv = require('objects-to-csv');
// require('./temp')
// require('./utils/gktoday')
// require('./utils/ques_ques_net')
// require('./utils/Kwizzbit')
// require('./utils/opinionstage')
// require('./utils/radiotimes')
// require('./utils/indiabix')
const total_data = require('./utils/data')
const app = express();
const PORT = 5000;
// setTimeout(()=>{
//     (async () => {
//         const csv = new ObjectsToCsv(total_data);
//         await csv.toDisk('./text.csv');
//     })()
// },20000)

(async () => {
    await require('./utils/ques_ques_net')
    // await require('./temp');
    const csv = new ObjectsToCsv(total_data);
    await csv.toDisk('./text2.csv');
    console.log('bbbb');
})() 


app.get('/',(req,res)=>{
    const response = {
        status:200,
        msg:"success",
        total_results:total_data.length,
        data:total_data
    }
    res.status(200).send(response)
})


app.listen(PORT,console.log(`server is listening on PORT ${PORT}`))