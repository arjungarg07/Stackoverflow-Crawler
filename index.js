// define native libraries first
const fs = require('fs');
// define npm libraries next
const { parse } = require("json2csv");

const writeStream = fs.createWriteStream("data.csv");
const Scraper = require('./scraper');
const { commonQuery } = require('./db');

async function saveData(data) {
    try{
        const query1 = 'CREATE DATABASE IF NOT EXISTS db_stackoverflow';
        const query2 = 'CREATE TABLE IF NOT EXISTS db_stackoverflow.stackoverflow_data (title VARCHAR(255), upvote VARCHAR(10), answers INT, url VARCHAR(255), freq INT)';
        const query1result = await commonQuery(query1);
        const query2result = await commonQuery(query2);
        console.log(query1result);
        console.log(query2result);
        for (let i = 0; i < data.length; i++) {
            const insertQuery = 'INSERT INTO db_stackoverflow.stackoverflow_data (title, upvote, answers, url, freq) VALUES (?, ?, ?, ?, ?)';
            const result = await commonQuery(insertQuery, [data[i].title, data[i].upvote, data[i].totalAnswers, data[i].url, data[i].freq]);
            console.log(result);
        }
    }catch(err){
        console.log(err);
    }
}

const stackOverFlowScrapper = new Scraper({pageLimitForSeedUrls: 20, concurrenyLimit: 5, delay: 200 });
stackOverFlowScrapper.start();

// setInterval(()=>{
//     console.log(stackOverFlowScrapper.scrapedData);
// },2500);

async function exitHandler(options, exitCode) {
    try{
        if (options.cleanup) console.log('clean');
        if (exitCode || exitCode === 0) {
            const data = stackOverFlowScrapper.getAllData();
            console.log(data);
            if(data && data.length){
                const csv = parse(data);
                writeStream.write(csv);
                await saveData(data); // comment this line if you don't want to save data to database or having trouble connecting to database
            }
        }
        if (options.exit) process.exit();
    }catch(err){
        console.log(err);
    }
}

// process.stdin.resume();
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

