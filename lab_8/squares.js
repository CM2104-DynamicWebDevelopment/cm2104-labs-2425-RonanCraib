$(function() {
    $("div").click(function() {
        // CSS Class Cycling Logic (as previously)
        const classes = ["red", "blue", "green"];
        const currentClass = classes.find(cls => $(this).hasClass(cls));
        const nextClass = classes[(classes.indexOf(currentClass) + 1) % classes.length];
        $(this).removeClass(currentClass).addClass(nextClass);

        // Example Effect 1: Move the square horizontally when clicked
        $(this).css("position", "relative");
        $(this).animate({left: "+=100px"}, 500);  // Move right by 100px

        // Example Effect 2: Toggle fade effect on click
        $(this).fadeToggle(300).fadeToggle(300);  // Quick fade in and out
    });
});
