var express = require("express");
var app = express();

app.get("/", function(req, res){
    console.log("Home Route");
    res.send("Hi There!");
});

app.get("/bye", function(req, res){
    console.log("Bye Route");
    res.send("Good Bye");
});

app.get("/dog", function(req, res){
    console.log("Dog Route");
    res.send("Bhow! Bhoww!");
});

app.get("/reddit/:subRedditName", function(req, res){
    console.log("Reddit Route", req.params);
    res.send(`You Are In Reddit Page Of ${req.params.subRedditName.toUpperCase()}`);
});

app.get("/reddit/:subRedditName/comments/:user/:title", function(req, res){
    console.log("Reddit Comments Route", req.params);
    res.send(`You Are In ${req.params.subRedditName.toUpperCase()} Reddit Comments Page of User ${req.params.user}, title ${req.params.title}`);
});

app.get("/speak/:animal", function(req, res){
    console.log("Animal Speak Route");
    let sounds = {
        pig: 'Oink', cow: 'Moo', dog: 'Woof Woof!', cat: 'Meow', goldfish: '...'
    }
    let animal = req.params.animal.toLowerCase();
    //let voice = animal == 'pig' ? 'Oink' : (animal == 'cow' ? 'Moo' : (animal == 'dog') ? 'Woof Woof!' : '');
    let voice = (!sounds[animal]) ? 'Cannot speak': sounds[animal];
    res.send(`The ${animal} says '${voice}'`);
});

app.get("/repeat/:word/:num", function(req, res){
    console.log("Repeat Word Route");
    let word = req.params.word;
    let num = req.params.num;
    let wordToPrint = "";
    for(let i=0;i<num;i++){
        wordToPrint += word + " ";
    }
    res.send(`${wordToPrint.trim()}`);
});

app.get("*", function(req, res){
    console.log("Catch All Route");
    res.send("Please Enter A Correct URL");
});

app.listen(3000, function(){
    console.log("Server Started")
})