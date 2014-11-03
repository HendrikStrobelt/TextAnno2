UserLogs = new Mongo.Collection("logs");

Router.configure({
    layoutTemplate: 'mainLayout'
});


Router.route('/', function () {
    //console.log("rrrr");

    this.render('consentForm');
});

Router.route("/consentForm")
Router.route("/userTest")

Router.route("/logs/userTest/:_id", function(){
    this.render("userTestLog",{data:{_id:this.params._id}})
})
Router.route("/checkConfigs")

Router.route("/run", function(){
    console.log(this.params);

    this.render('run');
})
Router.route("/end")
Router.route("/explain")
Router.route("/demography")
Router.route("/showLogs")