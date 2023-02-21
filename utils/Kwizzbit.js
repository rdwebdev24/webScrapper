const cheerio = require("cheerio");
const axios = require('axios');
const total_data = require('./data')

const getData = async (topic) => {
    const axiosResponse = await axios.request({
        method: "GET",
        url: topic,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        }   
    })
    const $ = cheerio.load(axiosResponse.data);
    console.log('fetched3');
    const ques_arr = Array.from($(Array.from($('ol'))[0]).find('li'));
    const ans_arr = Array.from($(Array.from($('ol'))[1]).find('li'));
    const topic_ = topic.split('/');
    ques_arr.forEach((item,index)=>{
        const ans = $(ans_arr[index]).text();
        const ques = $(item).text();
        total_data.push({
            topic:topic_[topic_.length-2].split('-').join(' '),
            ques,
            Option:[],
            type:"answer in one word",
            ans,
            img:'',
            pageUrl:topic
        })
    })
    total_data.forEach((item)=>{
        if(item==undefined) console.log(item);
    })
}


const url_arr = ["https://kwizzbit.com/50-general-knowledge-quiz-questions-and-answers/"];
const pageUrl = "https://kwizzbit.com/50-general-knowledge-quiz-questions-and-answers/"

const getTopic = async (getData) => {
    const axiosResponse = await axios.request({
        method: "GET",
        url: pageUrl,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        }   
    })
    const $ = cheerio.load(axiosResponse.data);
    const topic_arr = Array.from($('p').find('a'))
    topic_arr.forEach((item)=>{
        const url = $(item).attr('href');
        if(url.split('/').includes('kwizzbit.com')) url_arr.push(url);
    })
    url_arr.forEach(topic=>{
        getData(topic);
    })
}

getTopic(getData);