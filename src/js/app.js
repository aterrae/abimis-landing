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
    })
});
