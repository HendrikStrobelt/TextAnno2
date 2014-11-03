/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 11/2/14.
 */


Template.end.helpers({
    points:function(){
        return  Session.get("TotalPoints")
    },
    code: function () {
        return Session.get("userID");
    },
    showField: function () {
        return Session.equals("submitComment", undefined)
    }


})

Template.end.rendered = function(){
    var userID = Session.get("userID");
    UserLogs.insert({sessionID:userID, type:"finished" , date:new Date()})

}

Template.end.events({
    "click .btn":function(){
        var userID = Session.get("userID");
        var c = $("#finalComment").val();
        if (userID){
            UserLogs.insert({sessionID:userID, type:"comment", comment:c , date:new Date()})
        }
        console.log(userID, c);
        Session.set("submitComment", true);

    }

})