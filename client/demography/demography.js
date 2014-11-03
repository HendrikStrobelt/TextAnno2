/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 11/2/14.
 */

Template.demography.events({
    "submit form":function(e){
        e.preventDefault();
        var demo={};
        demo.age = $('input[name="optionsAge"]:checked').val();
        demo.gender = $('input[name="optionsGender"]:checked').val();
        demo.device = $('input[name="optionsDevice"]:checked').val();
        demo.rgtest = $('select[id="rgTest"]').val();

        console.log(demo);
        //alert(demo)
        //$("#results").innerHTML(age)

        var sesID = Meteor.default_connection._lastSessionId
        UserLogs.insert({sessionID:sesID, type:"demography" ,demo:demo, date:new Date()})

        //Session.set("currentView","demo_results");
        Session.set("userID",sesID);
        Session.set("currentTemplate", "userTest")

    }


})


Template.demography.helpers({
    //aaa:function(){
    //    var res =JSON.stringify(Session.get("demography"), undefined, 2);
    //    console.log("res:",res);
    //    return res
    //},
    //template:function(){
    //    var template = Session.get("currentView");
    //    if (!template) template="demo_form";
    //    return template;
    //}

    //// {{template}}
    //// {{>Template.dynamic template=template}}

})
