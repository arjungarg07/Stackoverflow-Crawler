// define native libraries first
const fs = require('fs');
// define npm libraries next
const { parse } = require("json2csv");

const writeStream = fs.createWriteStream("data.csv");
const Scraper = require('./scraper');

const stackOverFlowScrapper = new Scraper({pageLimitForSeedUrls: 20, concurrenyLimit: 5, delay: 200 });
stackOverFlowScrapper.start();

// setInterval(()=>{
//     console.log(stackOverFlowScrapper.scrapedData);
// },2500);

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) {
        const data = stackOverFlowScrapper.getAllData();
        if(data){
            const csv = parse(data);
            writeStream.write(csv);
        }
    }
    if (options.exit) process.exit();
}

// process.stdin.resume();
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
