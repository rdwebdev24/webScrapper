const cheerio = require("cheerio");
const axios = require('axios');
const total_data = require('./data')

const url_arr = [];
const pageurl = "https://www.quiz-questions.net"



const getData = async (topic) => {
    const URL = `${pageurl}/${topic}`
    const axiosResponse = await axios.request({
        method: "GET",
        url: URL,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        }   
    })
    const $ = cheerio.load(axiosResponse.data);
    console.log('fetched2');
    const table = $(Array.from($('table'))[2]).find('tr');
    Array.from(table).forEach(item=>{
        const ques = $(item).find('td').text().split('?')[0].slice(1);
        const ans = $(item).find('td').text().split('?')[1];
        if(ques && ans){
            total_data.push({
                topic:topic.split('.')[0],
                ques,
                options:[],
                type:"answer in one word",
                ans,
                img:'',
                URL,
            })
        }
    })
}

const getTopic = async () => {
    const axiosResponse = await axios.request({
        method: "GET",
        url: pageurl,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        }  
    })
    const $ = cheerio.load(axiosResponse.data);
    const topic_arr = $(Array.from($('table'))[1]).find('tbody').find('tr td a');
    Array.from(topic_arr).forEach((item)=>{
        const url = $(item).attr('href');
        if(!!url) url_arr.push(url);
    })
    for(const url of url_arr) {
        await getData(url);
    }
}

const promise = new Promise(async (resolve, reject) => {
    await getTopic()
    resolve()
});

module.exports = promise