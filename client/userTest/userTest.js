/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 10/14/14.
 */


var maxTests = 12;
var activeList = [];
var inactiveList = [];

var currentText = new ReactiveVar("This is the test field. Please ensure that you can see the start button and you don't need to scroll down. After pressing 'Start' you have 15 seconds to get the highlights as <b>precise</b> as possible. Every non-highlight you click will account negative to the score. Before you start, please have a look above this box to see an example of the current highlight technique that will be used.")

var showSample = new ReactiveVar(true);

var currentDistribution ={};

var helpText =function(){

    var styleString = this.techs.map(function(d){return d.css;}).join(" ");

    var explain = ""
    if (this.type == "merge"){
        explain = "Please find only occurrences using <b>BOTH</b> highlights ("+
        this.techs.map(function(d){return d.name;}).join(" and ")
        +")."
    }else if (this.type == "dominant"){
        explain = "Please find occurrences with the highlight ("+
        this.techs[0].name
        +")."
    }else{
        explain = "Please find occurrences with the highlight ("+
        this.techs[0].name+")."
    }



    var validExamples = "";
    if (this.type == "dominant"){
        validExamples = "These two are <span class='"+this.techs[0].css+"'> valid </span> and"+
        "<span class='"+styleString+"'> valid </span>";
    }else if (this.type=="merge"){
        validExamples = "Only this highlight is  <span class='"+styleString+"'> valid </span>"
    }else{
        validExamples = "This highlight is <span class='"+styleString+"'> valid </span>."
    }

    var invalidExamples = "";
    if (this.type == "dominant"){
        invalidExamples = "(This highlight is <span class='"+this.techs[1].css+"'> wrong</span>)";
    }else if (this.type=="merge"){
        invalidExamples = "(These highlights are <span class='"+this.techs[1].css+"'> wrong</span> and"+
        "<span class='"+this.techs[0].css+"'> wrong</span>)";
    }else{
        invalidExamples = ""
    }

    return explain +validExamples + " "+invalidExamples;
}


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



        var text = helpText.call(Session.get("userTest")[Session.get("userTestIndex")]);



        return "Example: "+text + disclaimer;
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




        var text = helpText.call(Session.get("userTest")[Session.get("userTestIndex")]);


        return disclaimer + "<div style='border: 2px solid;padding: 2px; background-color:white;'>"+
            text
            +"</div>" ;

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

          var x = data.split(" ") // split the text.


          var usedEncoding = Session.get("userTest")[Session.get("userTestIndex")]
          var utg = new UserTestGenereator()
          var highlightIndices =   utg.getRandomTestIndices(x.length,20,20,20);
            currentDistribution = highlightIndices;



          //console.log(highlightIndices);
          console.log(usedEncoding, Session.get("userTest"));

          //There are three kinds of test scenarios: SINGLE, MERGED, DOMINANT
          //var positiveEncoding='', negative1Encoding='', negative2Encoding='';

          var textToHTMLMapping = function(d,i){
              return d;
          }

          if (usedEncoding.type==='single'){

              var positiveEncoding = usedEncoding.techs[0].css;

              textToHTMLMapping = function(d,i){
                  if (_.contains(highlightIndices.positiveSamples, i)){
                      return "<span class='active "+positiveEncoding+"'  id='word_"+i+"'>" + d+"</span>"
                  }else {
                      return "<span class='inactive'  id='word_"+i+"'>" + d+ "</span>";
                  }


              }

          }else if (usedEncoding.type==='dominant'){
              var positiveEncoding = usedEncoding.techs[0].css;
              var positive2Encoding = usedEncoding.techs[0].css + ' '+usedEncoding.techs[1].css;
              var negative1Encoding = usedEncoding.techs[1].css;

              textToHTMLMapping = function(d,i) {
                  if (_.contains(highlightIndices.positiveSamples, i)) {
                      return "<span class='active " + positiveEncoding + "'  id='word_" + i + "'>" + d + "</span>"
                  }else if (_.contains(highlightIndices.negativeSamples1, i)) {
                      return "<span class='active " + positive2Encoding + "'  id='word_" + i + "'>" + d + "</span>"
                  }else {
                      var css = '';
                      if (_.contains(highlightIndices.negativeSamples2, i)) css = negative1Encoding;
                      return "<span class='inactive " + css + "'  id='word_" + i + "'>" + d + "</span>";
                  }
              }

          }else if (usedEncoding.type==='merge'){
              var positiveEncoding = usedEncoding.techs[0].css + ' '+usedEncoding.techs[1].css;
              var negative1Encoding = usedEncoding.techs[0].css;
              var negative2Encoding= usedEncoding.techs[1].css;

              textToHTMLMapping = function(d,i) {
                  if (_.contains(highlightIndices.positiveSamples, i)) {
                      return "<span class='active " + positiveEncoding + "'  id='word_" + i + "'>" + d + "</span>"
                  } else {
                      var css = '';

                      if (_.contains(highlightIndices.negativeSamples1, i)) css = negative1Encoding;
                      else if (_.contains(highlightIndices.negativeSamples2, i)) css = negative2Encoding;


                      return "<span class='inactive " + css + "'  id='word_" + i + "'>" + d + "</span>";
                  }
              }

          }






          //var inc = 0;

          var y = x.map(textToHTMLMapping);



            showSample.set(false);
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



          showSample.set(true);

          if (Session.equals("userTestIndex", maxTests-1)){
              Session.set("currentTemplate","end");
          }else{
              Session.set("userTestIndex", Session.get("userTestIndex")+1)
          }



          $(e.currentTarget).show()

      }

      Meteor.setTimeout(endExperiment,3000)
    //Meteor.setTimeout(endExperiment,15000)
   //console.log("xxx");
    //Session.set("counter", Session.get("counter") + 1);
  }
});