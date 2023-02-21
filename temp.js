const total_data = require('./utils/data')
const promise = new Promise((resolve, reject) => {
    setTimeout(()=>{
        resolve(total_data.push({name:"rohit",age:40}));
    },2000)
});

module.exports = promise


















