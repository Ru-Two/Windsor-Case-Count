const cheerio = require("cheerio");
const fetch = require("node-fetch");

const stripSpecial = (str) => {
    const nums = new RegExp('[0-9 ]');
    let out = "";
    for (let i = 0; i < str.length; i++){
        if (nums.test("" + str.charAt(i))) out += str.charAt(i);
    }
    return out;
}

const getRawData = (URL) => {
    return fetch(URL).then((response) => response.text()).then((data) => { return data; });
};

const getCaseCount = async (URL) => {
    const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const siteData = await getRawData(URL);
    const siteDataParsed = cheerio.load(siteData);

    let caseData = {
        last_update: null,
        new_cases: 0,
        total_active_cases: 0,
        updated_today: false,
        total_confirmed: 0,
        total_deaths: 0,
        total_resolved: 0
    };

    let tempConfirmedAndNew = stripSpecial(siteDataParsed(".well.text-center p strong")[1].children[0].data);
    let tempDeaths = stripSpecial(siteDataParsed(".well.text-center p strong")[3].children[0].data);
    let tempResolved = stripSpecial(siteDataParsed(".well.text-center p strong")[5].children[0].data);

    let splitCases = tempConfirmedAndNew.split(" ");
    let tempConfirmed = splitCases[0];

    caseData.last_update = siteDataParsed("span.date-display-single")[0].children[0].data;
    caseData.new_cases = parseInt(splitCases[2]);
    caseData.total_confirmed = parseInt(tempConfirmed);
    caseData.total_deaths = parseInt(tempDeaths);
    caseData.total_resolved = parseInt(tempResolved);
    caseData.total_active_cases = caseData.total_confirmed - (caseData.total_resolved + caseData.total_deaths);

    const dayUpdated = caseData.last_update.split(",");
    const dateToday = new Date();
    caseData.updated_today = ( (DAYS_OF_WEEK.findIndex(elem => dayUpdated[0].trim() === elem)) === dateToday.getDay() );

    return caseData;
};

module.exports = { getCaseCount };