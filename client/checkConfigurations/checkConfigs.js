/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 11/1/14.
 */
Template.checkConfigs.helpers({
    possibleConfigs:function(){

        var udh = new UserTestGenereator();

    console.log(udh.getRandomTestSequence());
        return udh.getRandomTestSequence().map(function(d){return {name:d};});
    }


})