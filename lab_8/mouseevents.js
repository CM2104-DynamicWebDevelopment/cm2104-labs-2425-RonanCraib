// jQuery Document Ready function
$(document).ready(function() {
    // Hover events for the first box
    $(".hover-box").hover(
        function() {
            $(this).text("Thank You");
        },
        function() {
            $(this).text("Mouse Over Me");
        }
    );

    // Mouse down and mouse up events for the second box
    $(".click-box").mousedown(function() {
        $(this).css("background-color", "lightblue");
        $(this).text("Release Me");
    });

    $(".click-box").mouseup(function() {
        $(this).css("background-color", "lightgreen");
        $(this).text("Thank You");
    });
});
