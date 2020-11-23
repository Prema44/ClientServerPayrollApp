const stringifyDate = (date) => {
    const options = {year: "numeric", month: "short", day: "numeric"};
    const newDate = !date ? "undefined" : new Date(Date.parse(date)).toLocaleDateString("en-GB", options);
    return newDate;
}

const checkName = (name) => {
    let nameRegex = RegExp('^[A-Z]{1}[a-zA-z\\s]{2,}$');
    if(! nameRegex.test(name)) throw "Name is incorrect ";
}

const checkStartDate = (startDate) => {
    let now = new Date();
    if( startDate > now ) throw " StartDate is future date";
    var diff = Math.abs(startDate.getTime() - now.getTime());
    if(diff / (1000 * 60 * 60 * 24) > 30) throw " StartDate is beyond 30 days";
}