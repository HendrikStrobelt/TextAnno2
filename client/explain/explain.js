/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 11/2/14.
 */

Template.explain.events({
    "click .btn":function(){
        Session.set("currentTemplate", "consentForm")
    }
})