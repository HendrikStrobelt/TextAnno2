/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 11/1/14.
 */
Template.checkConfigs.helpers({
    possibleConfigs:function(){

        var udh = new UserTestGenereator();

    //console.log(udh.getRandomTestSequence());
        //return udh.getRandomTestSequence().map(function(d){return {name:d};});

        return udh.getRandomTestSequence(1,true, udh.includeAllMixesFilter());


    }


})

Template.currentTest.helpers({

        helpText:function(d){

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



    }
)