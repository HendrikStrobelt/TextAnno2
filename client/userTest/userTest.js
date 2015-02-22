/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 10/14/14.
 */


var maxTests = 1;
var activeList = [];
var inactiveList = [];

var currentText = new ReactiveVar("This is the test field. Please ensure that you can see the start button and you don't need to scroll down. After pressing 'Start' you have 15 seconds to get the highlights as <b>precise</b> as possible. Every non-highlight you click will account negative to the score. Before you start, please have a look above this box to see an example of the current highlight technique that will be used.")

var showSample = new ReactiveVar(true);

var currentDistribution ={};


Template.userTest.created = function(){
    var utg = new UserTestGenereator();
    var userTest = utg.getRandomTestSequence(2,false,function(techs){

        var res = [false,false,false];
        techs.forEach(function (d) {
            //console.log(d);
            if (d.name.indexOf("increase")>-1 || d.name.indexOf("italic")>-1){
                //console.log(d);
                  res = [true,true,false]; // no merged
            }
        })


        return res;
    });

    console.log(userTest.map(function(t){
        return t.type + "- "+ t.techs.map(function(tt){return tt.css}).join(",")

    }).join("\n"));
    Session.setDefault("userTest", userTest);
    Session.setDefault("userTestIndex", 0);
    Session.setDefault("TotalPoints", 0);
    maxTests = userTest.length;

}

Template.userTest.helpers({

    validSession:function(){
        //console.log(Router.current().params.query);
        //return !Session.equals("userID", undefined)
        return true;
    },
    currentTest:function(){
        return Session.get("userTestIndex")+1;
    },
    maxTests:function(){
        return maxTests;
    },
    currentTestString:function(){
        var disclaimer = "";
        if (!Session.get("userID")) disclaimer= "<br/><b>THIS IS ONLY A TRAINING SYSTEM- No results are recorded !! You will NOT get payment here.</b>"



        var text = UserTestGenereator.helpText.call(Session.get("userTest")[Session.get("userTestIndex")]);



        return "<b>Instruction: </b>"+text + disclaimer;
    },
    currentMethod:function(){
        return Session.get("userTest")[Session.get("userTestIndex")];
    }

})


Template.vis.helpers({
  counter: function () {
      return currentText.get();
    //return Session.get("counter");
  },
    showSample:function(){

        return showSample.get();
    },
    currentTestString:function(){
        var disclaimer = "";
        if (!Session.get("userID")) disclaimer= "<b>THIS IS ONLY A TRAINING SYSTEM- No results are recorded !! You will NOT get payment here.</b><br/>"


        return disclaimer + UserTestGenereator.yesNoList(Session.get("userTest")[Session.get("userTestIndex")])
        //



    } // TODO: simple copy of userTest.helper-- maybe better solution possible




});

Template.logs.helpers({
   logs: function () {
        return UserLogs.find({});
    }
});

Template.vis.events({
    'click .active': function (d) {
        //console.log(d.currentTarget.id);
        activeList.push(d.currentTarget.id)
        $("#"+d.currentTarget.id).css("background-color","green");
        $("#"+d.currentTarget.id).fadeTo(50,.5)
    },
    'click .inactive': function (d) {
        //console.log(d.currentTarget.id);
        inactiveList.push(d.currentTarget.id)
        $("#"+d.currentTarget.id).css("background-color","red");
        $("#"+d.currentTarget.id).fadeTo(50,.5)

    }
})


Template.control.events({
  'click button': function (e) {
      $(e.currentTarget).hide()
    // increment the counter when button is clicked
      var myjson = {};

      // lorem_short = 673 words
      $.get("lorem_short.txt" ,function(data){

          var x = data.split(" ") // split the text.


          var usedEncoding = Session.get("userTest")[Session.get("userTestIndex")]
          var utg = new UserTestGenereator()
          var highlightIndices =   utg.getRandomTestIndices(x.length,20,20,20);
            currentDistribution = highlightIndices;



          //console.log(highlightIndices);
          console.log(usedEncoding, Session.get("userTest"));

          // generate the text spans w.r.t. given highlighting setting
          var textToHTMLMapping = UserTestGenereator.textToHTMLMapping(usedEncoding, highlightIndices)

          var y = x.map(textToHTMLMapping);

          showSample.set(false);
          currentText.set(y.join(" "));
      })

      function endExperiment(){
          console.log("xxx");
          var sesID = Meteor.default_connection._lastSessionId
          var uniqueValuesActive = _.uniq(activeList)
          var uniqueValuesInactive = _.uniq(inactiveList)

          var usedEncoding = Session.get("userTest")[Session.get("userTestIndex")]

          Session.set("TotalPoints",Session.get("TotalPoints")+(uniqueValuesActive.length-uniqueValuesInactive.length))


          currentText.set(" <p class='results'> Your Result: " + uniqueValuesActive.length +
            " correct words and " +uniqueValuesInactive.length +
            " incorrect Words = "+(uniqueValuesActive.length-uniqueValuesInactive.length) +
            " points <br/> Sum Points: "+Session.get("TotalPoints")+"</p>" +
          "This is the test field. Please ensure that you can see the start button and you don't need to scroll down. After pressing 'Start' you have 15 seconds to get the highlights as <b>precise</b> as possible. Every non-highlight you click will account negative to the score. Before you start, please have a look above this box to see an example of the current highlight technique that will be used.<h3> Hit 'start' for the next round! </h3>")




          var userID = Session.get("userID");
          if (userID){
              UserLogs.insert({sessionID: userID, type:"userTest", correct: activeList, incorrect: inactiveList, date:new Date(), technique:usedEncoding, distribution: currentDistribution});
          }

          //UserLogs.insert({test:"01"})
            console.log("done.");
          activeList = [];
          inactiveList = [];



          showSample.set(true);

          if (Session.equals("userTestIndex", maxTests-1)){
              Session.set("currentTemplate","end");
          }else{
              Session.set("userTestIndex", Session.get("userTestIndex")+1)
          }



          $(e.currentTarget).show()

      }

      //Meteor.setTimeout(endExperiment,7000)
    Meteor.setTimeout(endExperiment,13000)
   //console.log("xxx");
    //Session.set("counter", Session.get("counter") + 1);
  }
});