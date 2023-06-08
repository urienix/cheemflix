Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

// take today and add 1 or more days to it
export let getExpiration = (days) => {
    let date = new Date();
    return date.addDays(days);
}