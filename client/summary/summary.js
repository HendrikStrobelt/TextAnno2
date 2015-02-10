/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 11/4/14.
 */

var techniqueChange = new ReactiveVar("");
var techniques =[];
Session.setDefault("three_Technologies_selected", false);
//Session.setDefault("userID", "standalone");

Template.summary.helpers({
    points: function () {
        return Session.get("TotalPoints")
    },
    maxPoints: function () {
        return Session.get("maxPoints")
    },
    technique: function () {

        var fake = techniqueChange.get();

        if (techniques.filter(function(d){return d.selected;}).length==3){
            Session.set("three_Technologies_selected", true)
        }else{
            Session.set("three_Technologies_selected", false)
        }

        return techniques;
    },
    isDone:function(){
        return Session.get("three_Technologies_selected")

    }


})

Template.summary.events({
    "click #finishSummary": function () {

        var favoriteTechs = techniques
            .filter(function(d){return d.selected;})
            .map(function (d) {return d.name})

        var userID = Session.get("userID");
        if (userID){
            UserLogs.insert({sessionID: userID, type:"favTechs", date:new Date(), favTechs:favoriteTechs});
        }

        Session.set("currentTemplate", "end")
    }


})


Template.summary.rendered = function () {
    console.log(this);

    techniques = new UserTestGenereator().testTechniques.map(function(d,i){return {name:d, selected:false};});
    techniqueChange.set("init")

}


Template.tech.events({
    "click .tSelection": function (d, e) {
        this.selected = this.selected?false:true;

        techniqueChange.set(this.name+" new V:"+this.selected);

    }
})

