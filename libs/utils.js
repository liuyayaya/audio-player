
export function formatTime (data) {
    let hour = Math.floor(data / 60 / 60);
    let minute = Math.floor((data - (hour * 60 * 60)) / 60);
    let second = data - (hour * 60 * 60) - (minute * 60);
    let str = `${(hour > 0 ? (hour + ':') : '')}${minute > 0 ? (minute >= 10 ? minute : '0' + minute) : '00'}:${second > 0 ? (second >= 10 ? second : '0' + second):'00'}` ;
    return str;
}