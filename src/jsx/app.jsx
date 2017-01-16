$(document).ready(function() {
    $(".contactCTA").click(function() {
        $(".overlay").addClass("overlay--visible");
        $("body").addClass("noscroll");
    });

    $(".overlay__close").click(function() {
        $(".overlay").removeClass("overlay--visible");
        $("body").removeClass("noscroll");
    })
})
