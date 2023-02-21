const cheerio = require("cheerio");
const axios = require('axios');
const total_data = require('./data')

const pageUrl = 'https://www.radiotimes.com/quizzes/pub-quiz-general-knowledge/'
const url_arr = [];

const radiotimes = async (url_arr) => {
    url_arr.forEach(async(URL)=>{
    const topic = URL.split('/')[URL.split('/').length-2].split('-').join(' ')
    const axiosResponse = await axios.request({
        method: "GET",
        url: URL,
        headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            }   
        })
        console.log('fetched5...');
        const $ = cheerio.load(axiosResponse.data);
        const ques_arr = $(Array.from($('ol'))[0]).find('li');
        const ans_arr = $(Array.from($('ol'))[1]).find('li');
        Array.from(ques_arr).forEach((item,index)=>{
            const ques = $(item).text();
            const ans = $(ans_arr[index]).text();
            total_data.push({
                topic,
                ques,
                Option:[],
                type:'answer in one word',
                ans,
                img:'',
                pageUrl
            })
        })
    })
}

const getUrl = async (radiotimes) => {
    const axiosResponse = await axios.request({
        method: "GET",
        url: pageUrl,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        }   
    })
    const $ = cheerio.load(axiosResponse.data);
    const urls = $('ul').find('li').find('strong').find('a');
    Array.from(urls).forEach((item,index)=>{
        const url = $(item).attr('href').split('/')
        if(url.includes('quizzes')) url_arr.push($(item).attr('href'))
    })
    radiotimes(url_arr);
}
getUrl(radiotimes);



