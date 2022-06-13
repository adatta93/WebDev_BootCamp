$("ul").on("click", "li", function(){
    $(this).toggleClass("completed");
});

$("ul").on("click", "span", function(event){
    $(this).parent().fadeOut(300, function(){
        $(this).remove();
    });
    event.stopPropagation();
});

$("input[type='text']").on("keypress", function(event){
    if(event.which === 13){
        var newTodo = $(this).val();
        $(this).val("");
        $("ul").append(`<li><span><i class="fa fa-trash"></i></span> ${newTodo}</li>`);
    }
});

$(".fa-plus").click(function(){
    $("input[type='text']").fadeToggle(500);
});