/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 11/2/14.
 */
Template.showLogs.helpers({
    logs:function(){
        var params= Router.current().getParams().query
        console.log("params",params);
        if (params.detail){
            return UserLogs.find({sessionID:params.detail})
        }else{
            return UserLogs.find({});
        }



    }
})


Template.oneLog.helpers({
    isTest:function(){
        return  this.type == "userTest"
    },
    isDemo:function(){
        return  this.type == "demography"
    },
    isComment:function(){
        return  this.type == "comment"
    },
    isFavoriteTechniques:function(){
        return  this.type == "favTechs"
    },
    techniques:function(){
      console.log(this, typeof this.technique);
        var t = this.technique

        if ((typeof t) === 'string'){
            return t;
        }else{
            var maxI = (t.type==="merge")?2:1;
            var allNames = t.techs.map(function(ddd,i){
                if (i<maxI) return "<b>"+ddd.name+"</b>"
                return ddd.name
            }).join(" -- ")
            return t.type+": "+allNames;
        }
        return "aa";
    },
    correctLength:function(){return this.correct.length *10;},
    incorrectLength:function(){return this.incorrect.length *10;}
})


Template.userTestLog.helpers({
    x:function(){
        var id = Router.current().getParams()._id;
        var item = UserLogs.findOne(id)
        var splitFileData =  Session.get("splitFileData")

        //console.log(splitFileData);

        if (item && splitFileData){
            var good = item.correct.map(function (d) {
                return +d.split("_")[1];
            });
            var bad = item.incorrect.map(function (d) {
                return +d.split("_")[1];
            });

            y = splitFileData.map(function (d, i) {
                if (_.contains(good, i)) {

                    return "<span class='active '  id='word_" + i + "' style='font-weight:bold;background-color:#aaeeaa;'>" + d + "</span>"
                } else if (_.contains(bad, i)) {
                    return "<span class='active '  id='word_" + i + "' style='font-weight:bold;background-color:#eeaaaa;'>" + d + "</span>"
                }else{
                    return "<span class='inactive'  id='word_" + i + "'>" + d + "</span>";
                }
            })


            return y.join(" ")
        }else{
            return "loading"
        }

    }

})


Template.userTestLog.rendered = function(){

    $.get("/lorem_short.txt", function (fileData) {

        var splitFileData = fileData.split(" ")
        //console.log(fileData);

        Session.set("splitFileData", splitFileData);

        //console.log(res);


    })


}

