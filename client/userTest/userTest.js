/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 10/14/14.
 */
// counter starts at 0



var maxTests = 12;
var activeList = [];
var inactiveList = [];

var currentText = new ReactiveVar("This is the test field. Please ensure that you can see the start button and you don't need to scroll down. After pressing 'Start' you have 15 seconds to get the highlights as <b>precise</b> as possible. Every non-highlight you click will account negative to the score. Before you start, please have a look above this box to see an example of the current highlight technique that will be used.")


var currentDistribution =[];

var techniques = {
    "categorical": [
        ["colorBack", ["colorBack_cat1_yellow", "colorBack_cat2_light-blue", "colorBack_cat3_pink", "colorBack_cat4_light-orange", "colorBack_cat5_light-green", "colorBack_cat6_purple", "colorBack_cat7_red", "colorBack_cat8_blue", "colorBack_cat9_burlywood"]],
        ["color", ["color_cat1_red", "color_cat2_blue", "color_cat3_green", "color_cat4_orange", "color_cat5_pink", "color_cat6_purple"]],
        ["underlined", ["underlined", "underlined_double", "underlined_dotted", "underlined_dashed", "underlined_wavy"]],
        ["font-family", ["font-family_Arial", "font-family_Comic", "font-family_Courier"]], //"font-family_Georgia" = VERDANA
        ["border", ["border", "border_double", "border_dashed", "border_dotted"]],
        ["enclosing", ["enclosingCurlyBrackets", "enclosingAngleBrackets", "enclosingAsterisks", "enclosingSquaredBrackets"]]
        //    ["border", ["border", "border_rounded-slight", "border_rounded-medium", "border_rounded-strong"]]
    ],
    "boolean": [
        ["underlined", "underlined"],
        ["line-through", "line-through"],
        ["bold", "bold"],
        ["italic", "italic"],
        ["small-caps", "small-caps"],
        ["text-shadow", "text-shadow-thick-gray"],
        ["text-shadow", "text-shadow-shifted-gray"],
        ["letter-spacing", "letter-spacing-widened"],
        ["letter-spacing", "letter-spacing-squeezed"],
        ["word-spacing", "word-spacing"],
        ["border", "border"],
        ["color", "color_cat1_red"],
        ["colorBack", "colorBack_cat1_yellow"]
    ],
    "quantitative": [
        ["color", "color-Quantitative"],
        ["color", "colorBW-Quantitative"],
        ["colorBack", "colorBack-Quantitative"],
        ["colorBack", "colorBackAlpha-Quantitative"],
        ["colorBack", "colorBackBW-Quantitative"],
        ["border", "border-bottom-width"],
        ["font-size", "font-size_increase"],
        ["font-size", "font-size_decrease"],
        ["border", "border-rounded"]
    ]
};


Template.userTest.created = function(){
    var utg = new UserTestGenereator();
    var userTest = utg.getRandomTestSequence();
    Session.setDefault("userTest", userTest)
    Session.setDefault("userTestIndex", 0)
    Session.setDefault("TotalPoints", 0)
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
        if (!Session.get("userID")) disclaimer= "<br/><b>THIS IS ONLY A TEST - No results are recorded !! You only get payment when using Mechanical Turk.</b>"
        return "Example: This is an example of the <span class='"+Session.get("userTest")[Session.get("userTestIndex")]+"'>current</span> highlight we want you to find. The word 'current' should pop out in the previous sentence." + disclaimer;
    },
    currentMethod:function(){
        return Session.get("userTest")[Session.get("userTestIndex")];
    }

})


Template.vis.helpers({
  counter: function () {
      return currentText.get();
    //return Session.get("counter");
  }
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
        $("#"+d.currentTarget.id).fadeTo(50,.5)
    },
    'click .inactive': function (d) {
        console.log(d.currentTarget.id);
        inactiveList.push(d.currentTarget.id)
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

          x = data.split(" ")
          //console.log(x.length);

          var currentTimeIndex = new Date().getTime() % techniques.boolean.length;
          //var usedEncoding = techniques.boolean[currentTimeIndex][1]

          //var usedEncoding = (new UserTestGenereator()).getRandomTestSequence()[0];
          //var usedEncoding = "fontSize_150"
          var usedEncoding = Session.get("userTest")[Session.get("userTestIndex")]

          console.log(usedEncoding, Session.get("userTest"));

          var utg = new UserTestGenereator()
          var highlightIndices =   utg.getRandomTestIndices(x.length,20);
            currentDistribution = highlightIndices;

          var inc = 0;

          y = x.map(function(d, i ){
              //if (Math.random()>.7 && inc<20){
              if (_.contains(highlightIndices, i)){
                    inc++;
                  return "<span class='active "+usedEncoding+"'  id='word_"+i+"'>" + d+"</span>"
              }else {
                  return "<span class='inactive'  id='word_"+i+"'>" + d+ "</span>";
              }


          })




            currentText.set(y.join(" "));
          //console.log(data);
      })

      function endExperiment(){
          console.log("xxx");
          var sesID = Meteor.default_connection._lastSessionId
          var uniqueValuesActive = _.uniq(activeList)
          var uniqueValuesInactive = _.uniq(inactiveList)

          var usedEncoding = Session.get("userTest")[Session.get("userTestIndex")]

          Session.set("TotalPoints",Session.get("TotalPoints")+(uniqueValuesActive.length-uniqueValuesInactive.length))


          currentText.set(" <h3> Your Result: " + uniqueValuesActive.length +
            " correct words and " +uniqueValuesInactive.length +
            " incorrect Words = "+(uniqueValuesActive.length-uniqueValuesInactive.length) +
            " points</h3><p/> <h3> Sum Points: "+Session.get("TotalPoints")+"</h3><p/> <h3> Hit 'start' for the next round! (see the example of the next highlight above the box)</h3>")




    var userID = Session.get("userID");
          if (userID){
              UserLogs.insert({sessionID: userID, type:"userTest", correct: activeList, incorrect: inactiveList, date:new Date(), technique:usedEncoding, distribution: currentDistribution});
          }

          //UserLogs.insert({test:"01"})
            console.log("done.");
          activeList = [];
          inactiveList = [];




          if (Session.equals("userTestIndex", maxTests-1)){
              Session.set("currentTemplate","end");
          }else{
              Session.set("userTestIndex", Session.get("userTestIndex")+1)
          }



          $(e.currentTarget).show()

      }

    Meteor.setTimeout(endExperiment,15000)
   //console.log("xxx");


    Session.set("counter", Session.get("counter") + 1);
  }
});