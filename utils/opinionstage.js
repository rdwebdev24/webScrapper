const cheerio = require("cheerio");
const axios = require('axios');
const total_data = require('./data')
const pageUrl = 'https://www.opinionstage.com/blog/trivia-questions/'

const opinionStage = async () => {
    const axiosResponse = await axios.request({
        method: "GET",
        url: pageUrl,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        }   
    })
    console.log('fetched4...');
    const $ = cheerio.load(axiosResponse.data);
    const topic_arr = Array.from($(Array.from($('ol'))[0]).find('li'));
    const ques_arr = Array.from($('ol'));
    for(let i=1; i<ques_arr.length; i++){
        const question = Array.from($(ques_arr[i]).find('li'))
        const topic = $(topic_arr[i-1]).text()
        question.forEach(item=>{
            const ques =$(item).html().split('<br>')[0];
            const ans = $(item).html().split('<br>')[1];
            if(ques && ans) {
                total_data.push({
                    topic,
                    ques,
                    Option:[],
                    type:"answer in one word",
                    ans:ans.split(':')[1],
                    img:'',
                    pageUrl
                })
            }
        })
    }
}

opinionStage();
