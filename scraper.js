const { default: axios } = require("axios");
const cheerio = require("cheerio");

class Scraper {
    populateSeedUrls(){
        for(let i = 0;i<this.pageLimitForSeedUrls;i++){
            this.seedUrls.push(`https://stackoverflow.com/questions?tab=newest&page=${i}`);
        }
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
      

    sleep(delay) {
        return new Promise(resolve=>setTimeout(()=>resolve(1), delay));
    }

    constructor(settings) {
        const { 
            pageLimitForSeedUrls = 5,
            concurrenyLimit = 1,
            delay = 1000
        } = settings || {};

        this.pageLimitForSeedUrls = pageLimitForSeedUrls;
        this.seedUrls = [];
        this.delay = delay;
        this.concurrenyLimit = concurrenyLimit;
        this.seedPointer = 0;
        this.frequencyCount = new Map();
        this.scrapedData = [];
        // this.requestCount = 0;
        // Uncomment the underlying code to see the number of concurrent requests at an interval of 500 ms
        // setInterval(() => {
        //   console.log(this.requestCount);
        // }, 500);
    }

    getAllData(){
        const combinedData = [];
        this.scrapedData.forEach(item => {
            const { title } = item;;
            // console.log("rtt", title, this.frequencyCount.get(title));
            combinedData.push({ ...item, freq: this.frequencyCount.get(title)});
        });

        return combinedData;
    }

    checkAndSaveSeedUrl(newSeedUrls){
        newSeedUrls.forEach(({ title, url }) => {
            const freq = this.frequencyCount.get(title);
            // console.log(title, url, freq);
            if(freq){
                this.frequencyCount.set(title, freq + 1);
            } else{
                this.frequencyCount.set(title, 1);
                this.seedUrls.push(url);
            }
        });
    }

    fetchAndSaveDataFromQuestionsPage(response,url){
        try {
            if (response) {
              const $ = cheerio.load(response.data);
              const title = $("#question-header > .fs-headline1").eq(0).text();
              const upvote = $(".js-vote-count").eq(0).text().replace(/\s/g, "");
              const totalAnswers = Number($(".answers-subheader h2").text().trim().match(/^\d+/)[0]);

              const relation = $(".sidebar-related > .related").children();
              const relatedArray = [];
              relation.each((i, el) => {
                const related = {};
                let url = $(el).find("a").eq(1).attr("href");
                related.url = `https://stackoverflow.com${url}`;
                related.title = $(el).find("a").eq(1).text();
                relatedArray.push(related);
              });

              this.checkAndSaveSeedUrl(relatedArray);
              const linked = $(".sidebar-linked > .linked").children();
              const linkedArray = [];
              linked.each((i, el) => {
                const linked = {};
                let url = $(el).find("a").eq(1).attr("href");
                linked.url = `https://stackoverflow.com${url}`;
                linked.title = $(el).find("a").eq(1).text();
                linkedArray.push(linked);
              });
              this.checkAndSaveSeedUrl(linkedArray);

              this.scrapedData.push({ title, upvote, totalAnswers, url});
              return;
            }
          } catch (err) {
            return;
          }
    }

    fetchAndSaveDataFromHomePage(response){
        try {
            if (response) {
              const $ = cheerio.load(response.data);
            //   console.log(response.data);
              const questions = $(".question-summary");
              const questionsArray = [];
              questions.each((i, el) => {
                let a = $(el).find(".unanswered", "strong").text();
                const question = {};
                question.title = $(el).find(".question-hyperlink").text();
                let url = $(el).find(".question-hyperlink").attr("href");
                question.url = `https://stackoverflow.com${url}`;
                questionsArray.push(question);
              });
            //   console.log(questionsArray);
              this.checkAndSaveSeedUrl(questionsArray);
              return;
            }
          } catch (err) {
            console.log(err);
            return;
          }
    }

    async recursiveFetch() {
        try {
            if (this.seedPointer === this.seedUrls.length) {
              return;
            }

            const currentUrl = this.seedUrls[this.seedPointer++];
            console.log(currentUrl);
            if(/questions\/\d*/.test(currentUrl)){ 
                this.requestCount++;
                const response = await axios.get(currentUrl);
                this.requestCount--;
                // console.log(response, "*************");
                this.fetchAndSaveDataFromQuestionsPage(response,currentUrl);
            } else {
                this.requestCount++;
                const response = await axios.get(currentUrl);
                this.requestCount--;
                this.fetchAndSaveDataFromHomePage(response);
            }
            // await this.sleep(this.delay + this.getRandomArbitrary(100, 500)); // uncomment it to simulate human behaviour
            this.recursiveFetch();

            return;
        } catch(err){
            console.log(err);

            return;
        }
    }

    async start(){
        this.populateSeedUrls();

        for (let i=0; i<this.concurrenyLimit;i++) {
            this.recursiveFetch();
        }
    }
}

module.exports = Scraper;