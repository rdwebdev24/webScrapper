const cheerio = require("cheerio");
const axios = require('axios');
const total_data = require('./data')

const pageUrl = "https://www.indiabix.com/aptitude/questions-and-answers/";
const arr1 = [];
let arr2 = [];

const requestaxios = (URL) => {
    return axios.request({
        method: "GET",
        url: URL,
        headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            }   
    })
}

const getData = async (URL) => {
    const axiosResponse = await requestaxios(URL);
    const $ = cheerio.load(axiosResponse.data);
    const cards = Array.from($('.bix-div-container'))
    cards.forEach( async (item)=>{
        const ques = $(item).find('.bix-td-qtxt').text();
        const option = $(item).find('.bix-tbl-options').find('.bix-td-option-val')
        const ans = $(Array.from($(item).find('.bix-td-miscell').find('.bix-div-toolbar').find('a'))[1]).attr('href');
        const op = []
        Array.from(option).forEach((opt)=>{
            op.push($(opt).find('div').text())
        })
        const ansResponse = await requestaxios(ans);
        const $2 = cheerio.load(ansResponse.data);
        console.log('load ans');
        total_data.push({
            option:op,
            ques,
            URL,
        })
    })
}
// const purl = "https://www.indiabix.com/aptitude/time-and-distance/";
// getData(purl)


const fetch2 = async (URL) => {
    const axiosResponse = await requestaxios(URL)
    console.log('fetched 2...');
    const $ = cheerio.load(axiosResponse.data);
    const list = Array.from($('.topics-wrapper').find('ul li').find('a'));
    list.forEach(item=>{
        const url = $(item).attr('href');
        arr2.push(url);
        getData(url);
    })
    arr2 = [...new Set(arr2)];
}
// fetch2(pageUrl)

const fetch1 = async (URL,fetch2) => {
    const axiosResponse = await requestaxios(URL)
    console.log('fetched ...');
    const $ = cheerio.load(axiosResponse.data);
    const cards = Array.from($('.card-style-list').find('.card-content'))
    for(let i=1; i<cards.length; i++){
        if(i==3 || i==6 || i==7 || i==8) continue;
        const url_arr = Array.from($(cards[i]).find('ul li').find('a'))
        url_arr.forEach(item=>{
            const url = `${URL}${$(item).attr('href')}`
            arr1.push(url);
        })
    }
    arr1.forEach(url=>{
        fetch2(url);
    })
   
}

// fetch1(pageUrl,fetch2);