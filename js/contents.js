function book(date) {
    if (top.location.pathname.indexOf('index1') != -1) {
        top.location.href = "http://115.24.255.82:8001/index.php/Book/Book/index2.html?cg=01&cp=02";
    } else if (top.location.pathname.indexOf('index2') != -1) {
        top.location.href = "http://115.24.255.82:8001/index.php/Book/Book/index3.html?day=" + date + "&time=11&cg=01&cp=02";
    } else if (top.location.pathname.indexOf('index3') != -1) {
        const spaceArr = Array.prototype.slice.call(top.document.querySelectorAll('#spaceList>div'));
        const randomIndex = Math.floor(Math.random() * spaceArr.length);
        const cdinfoid = spaceArr[randomIndex].getAttribute('name');
        top.document.myForm.action = "http://115.24.255.82:8001/index.php/Book/Book/index4?day=2017-03-18&time=00006&cg=01&cp=02&cdinfoid=" + cdinfoid;
        top.document.myForm.submit();
    } else if (top.location.pathname.indexOf('index4') != -1) {
        top.document.myForm.action = "http://115.24.255.82:8001/index.php/Book/Book/order.html";
        top.document.myForm.submit();
    } else {
        top.location.href = "http://115.24.255.82:8001/index.php/Book/Book/index2.html?cg=01&cp=02";
    }
}

function infinityLoop(date) {
    const threshold = moment().hour(10).minute(0).second(0).toDate().getTime();
    // const threshold = 1489675238984;
    let interval = setInterval(function () {
        console.log('interval');
        if ((new Date()).getTime() > threshold + 100) {
            book(date);
        }
    }, 100);
    if (top.location.href.indexOf('order') != -1) {
        clearInterval(interval);
    }
}

function init() {
    console.log('init');
    const weekday = moment().weekday();
    if (weekday == 0 || weekday == 2) {
        infinityLoop(moment().add(2, 'days').format('YYYY-MM-DD'));
    }
}
init();
