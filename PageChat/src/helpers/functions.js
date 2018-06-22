function parseUnixTime(unix) {

    let seconds = Math.floor((new Date() - unix*1000) / 1000);
    let intervalType;

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        intervalType = 'năm';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = 'tháng';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = 'ngày';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = "giờ";
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = "phút";
                    } else {
                        interval = '';
                        intervalType = "vừa xong";
                    }
                }
            }
        }
    }

    return interval + ' ' + intervalType + ' trước';
}

export {parseUnixTime}