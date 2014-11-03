/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 11/1/14.
 */


Template.consentForm.events({
    "click #consentYesBtn":function(){
        Session.set("allowed", true);
        Session.set("currentTemplate", "demography")
    }
})