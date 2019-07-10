export default function getTimeLeftString(ms) {
    if (ms < 0) {
        return null;
    }
    else {
        let days = Math.floor(ms / (1000 * 60 * 60 * 24));
        let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((ms % (1000 * 60)) / 1000);
        let res = '';
        if (days > 0) {
            res += days + "d ";
        }
        res += hours + "h " + minutes + "m " + seconds + "s ";
        return res;
    }
}
