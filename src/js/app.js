import STRINGS from '../data/strings';

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

$(document).ready(function() {
    if (getMobileOperatingSystem() == "iOS") {
        document.getElementsByClassName('overlay')[0].addEventListener('touchstart', function(event){
            this.allowUp = (this.scrollTop > 0);
            this.allowDown = (this.scrollTop < this.scrollHeight - this.clientHeight);
            this.prevTop = null; this.prevBot = null;
            this.lastY = event.pageY;
        });

        document.getElementsByClassName('overlay')[0].addEventListener('touchmove', function(event){
            var up = (event.pageY > this.lastY), down = !up;
            this.lastY = event.pageY;

            if ((up && this.allowUp) || (down && this.allowDown)) event.stopPropagation();
            else event.preventDefault();
        });
    }

    $(".contactCTA").click(function() {
        $(".overlay").addClass("overlay--visible");
        $("body").addClass("noscroll");
        $(".cover").addClass("cover--hidden");
    });

    $(".overlay__close").click(function() {
        $(".overlay").removeClass("overlay--visible");
        $("body").removeClass("noscroll");
        $(".cover").removeClass("cover--hidden");
    });
    initializeClock('countdown', STRINGS.countdown.deadline);
});

function getTimeRemaining(endtime){
    var offset = Date.parse(endtime) - Date.parse(new Date());
    var parsedOffset = {};
    parsedOffset.total = offset;
    parsedOffset.seconds = Math.floor( (offset/1000) % 60 );
    parsedOffset.minutes = Math.floor( (offset/1000/60) % 60 );
    parsedOffset.hours = Math.floor( (offset/(1000*60*60)) % 24 );
    parsedOffset.days = Math.floor( offset/(1000*60*60*24) );
    return parsedOffset;
}

function initializeClock(id, endtime){
    var clock = document.getElementById(id);
    var days = clock.querySelector('#countdown_days')
    var hours = clock.querySelector('#countdown_hours')
    var minutes = clock.querySelector('#countdown_minutes')
    var seconds = clock.querySelector('#countdown_seconds')
    var timeinterval = setInterval(function(){
        var offset = getTimeRemaining(endtime);
        days ? days.innerHTML = offset.days : null;
        hours ? hours.innerHTML = offset.hours : null;
        minutes ? minutes.innerHTML = offset.minutes : null;
        seconds ? seconds.innerHTML = offset.seconds : null;
        if(offset.total<=0){
            clearInterval(timeinterval);
        }
    },1000);
}
