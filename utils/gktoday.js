const cheerio = require("cheerio");
const axios = require('axios');
const total_data = require('./data')

const url_arr = [
    "https://www.gktoday.in/quizbase/ancient-indian-history-multiple-choice-questions",
    "https://www.gktoday.in/quizbase/medieval-indian-history",
    "https://www.gktoday.in/quizbase/modern-indian-history-freedom-struggle",
    "https://www.gktoday.in/quizbase/indian-geography-mcqs",
    "https://www.gktoday.in/quizbase/world-geography",
    "https://www.gktoday.in/quizbase/indian-polity-constitution-mcqs",
    "https://www.gktoday.in/quizbase/environment-ecology-biodiversity-mcqs",
    "https://www.gktoday.in/quizbase/indian-culture-general-studies-mcqs",
    "https://www.gktoday.in/quizbase/sports-gk",
    "https://www.gktoday.in/quizbase/indian-economy-mcqs",
    "https://www.gktoday.in/quizbase/general-science-for-competitive-examinations",
    "https://www.gktoday.in/quizbase/general-science-biology-mcqs",
    "https://www.gktoday.in/quizbase/general-science-physics-mcqs",
    "https://www.gktoday.in/quizbase/general-science-chemistry",

]
const getData = async (URL,pageno) => {
    const url = URL.split('/')
    const topic = url[url.length-1].split('?')[0].split('-').join(' ')
    const axiosResponse = await axios.request({
        method: "GET",
        url: `${URL}${pageno}`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        }   
    })
    const $ = cheerio.load(axiosResponse.data);
    console.log('fetched1');
    const page = Array.from($('.basic_quiz_pagination').find('li'));
   
    const next_page_no =  $(page[page.length-1]).find('a').attr('href') 
    const ques_arr = $(".quiz_print").find('.sques_quiz')
    Array.from(ques_arr).forEach((item)=>{
        const ques = $(item).find('.wp_quiz_question').text().split('.')[1].trim();
        const options = $(item).find('.wp_quiz_question_options').html().replace('<p>','').replace('</p>','').trim().split('<br>');
        const newOpt = []
        options.forEach(item=>{
            if(item.split(']')[1]) newOpt.push(item.split(']')[1].trim());
        })
        const ans = $(item).find('.wp_basic_quiz_answer .ques_answer').text().split(':')[1].slice(2).trim().replace('[','').replace(']','').trim();
        const ans_detail = $(item).find('.wp_basic_quiz_answer .answer_hint').text()
        const ques_obj = {
            topic,
            ques,
            options:newOpt,
            type:"multiple choice",
            ans,
            img:'',
            pageUrl:`${URL}${pageno}`,
            ans_detail
        }
        total_data.push(ques_obj)
    })
    if(next_page_no!=undefined){
        getData(URL,next_page_no)
    }
    else return;
}


const pageUrl = 'https://www.gktoday.in/gk-questions/'

// const getTopic = async (getData) => {
//     const axiosResponse = await axios.request({
//         method: "GET",
//         url: pageUrl,
//         headers: {
//             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
//         }   
//     })
//     const $ = cheerio.load(axiosResponse.data);
//     let url_arr = Array.from($('.main-content').find('.inside_post').find('.fivecol a'))
//     console.log($('.main-content').find('.inside_post').find('.applewrap').text());
//     console.log(url_arr);
//     let new_arr = []
//     url_arr.forEach((item)=>{
//         new_arr.push($(item).attr('href'));
//     })
//     new_arr = [...new Set(new_arr)]
//     new_arr.forEach((url)=>{
//         getData(url,'');
//     })
// }

url_arr.forEach((url)=>{
    getData(url,'');
})

