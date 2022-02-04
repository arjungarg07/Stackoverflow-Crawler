# Stackoverflow Crawler

Hey there, This is a Node.js based recursive question crawler, which harvests all questions on Stack Overflow with their encountered frequencies and stores them in the MySQL database and in the CSV file as well.

## Demo 
Youtube Link: https://www.youtube.com/watch?v=H6zzndSSEQM 


## Features
- Implemented **concurrency limit** of API requests.
- Flexibility to change the **concurrency limit** of the API requests.
- Flexibility to **choose the page limit for seed Urls** of the stackoverflow homepage by the user.
- Scraping **total # of upvotes** and **total # of answers** for every question.
- Feature to **delay API requests** in order to **prevent the IP address** from getting blocked by simulating human behavior.
- Total **reference count** for every encountered URL.
- Implemented a **trigger** to dump the data in a **CSV file** when the **user kills the script**.
- Implemented a trigger to save the data in the **MySQL database** when the **user kills the script**.
- Kept the code **modular** and as understandable following best naming conventions.
- Clean, Readable, Easy to follow code.
- Used cheerio for HTML parsing.
- Solution is **asynchronous** in nature.

## TechStack
- Javascript
- Node.Js
- MySQL

## Note
Please comment line if you are not able to connect to your local MySQL database, the script will save the data in the CSV file only.
https://github.com/arjungarg07/Stackoverflow-Crawler/blob/bda4c530f1b8d819634eecd89e5a5f1ddd12b765/index.js#L44

## WorkFlow
![WorkFlow](https://github.com/arjungarg07/growthSchoolAssignment/blob/main/Flow.png?raw=true)
<!-- [WorkFlow](https://github.com/arjungarg07/growthSchoolAssignment/blob/main/Flow.png) -->

## Installation

```bash
npm install
```

## Execution

```bash
node index.js
```
