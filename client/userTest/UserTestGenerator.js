/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 11/1/14.
 */


UserTestGenereator =  function(){

    this.testTechniques = [
        {css:"underlined",name:"underlined"},
        //"underlined_dotted",
        //"underlined_double",
        {css:"color_cat1_red",name:"red text"},
        {css:"colorBack_cat1_yellow",name:"yellow background"},
        {css:"bold", name:"bold typeface"},
        {css:"italic",name:"italic typeface"},
        {css:"fontSize_150",name:"increases font size"},
        {css:"border_rounded-slight",name:"border"},
        {css:"text-shadow-thick-gray",name:"text shadow"},
        {css:"letter-spacing-widened",name:"letter spacing"},
        //{css:}//"letter-spacing-widened",
        //{css:"word-spacing"


    ]



}

UserTestGenereator.helpText = function(){
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

UserTestGenereator.textToHTMLMapping = function(usedEncoding, highlightIndices){



    var res = function(d,i){
        return d;
    }

    //There are three kinds of test scenarios: SINGLE, MERGED, DOMINANT

    if (usedEncoding.type==='single'){

        var positiveEncoding = usedEncoding.techs[0].css;

        res = function(d,i){
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

        res = function(d,i) {
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

        res = function(d,i) {
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

    return res;

}


UserTestGenereator.yesNoList = function(usedEncoding){
    var res = [];

    if (usedEncoding.type==='single'){

        var positiveEncoding = usedEncoding.techs[0].css;

        var htmlString ='<div style="border: 2px solid;padding: 2px; background-color:white;"><span class="glyphicon glyphicon-ok" style="color:green;padding:1px;"></span> This is a <span class="'+positiveEncoding+'">correct highlight</span></div>'

        res.push(htmlString)

    }
    else if (usedEncoding.type==='dominant'){
        var positiveEncoding = usedEncoding.techs[0].css;
        var positive2Encoding = usedEncoding.techs[0].css + ' '+usedEncoding.techs[1].css;
        var negative1Encoding = usedEncoding.techs[1].css;


        // the right example no 1
        res.push('<div style="padding: 2px; margin-top:1px;background-color:white;"><span class="glyphicon glyphicon-ok" style="color:green;padding:1px;"></span> This is a <span class="'+positiveEncoding+'">correct highlight</span>&nbsp;&nbsp;('+usedEncoding.techs[0].name+')</div>')

        // the right example no 2
        res.push('<div style="padding: 2px; margin-top:1px;background-color:white;"><span class="glyphicon glyphicon-ok" style="color:green;padding:1px;"></span> This is a <span class="'+positive2Encoding+'">correct highlight</span>&nbsp;&nbsp;('+usedEncoding.techs[0].name+' and '+usedEncoding.techs[1].name+')</div>')

        // the wrong example
        res.push('<div style="padding: 2px; margin-top:10px; background-color:white;"><span class="glyphicon glyphicon-remove" style="color:red;padding:1px;"></span> This is a <span class="'+negative1Encoding+'">wrong highlight</span>&nbsp;&nbsp;(ONLY '+usedEncoding.techs[1].name+' NOT '+usedEncoding.techs[0].name+')</div>')

    }
    else if (usedEncoding.type==='merge'){
        var positiveEncoding = usedEncoding.techs[0].css + ' '+usedEncoding.techs[1].css;
        var negative1Encoding = usedEncoding.techs[0].css;
        var negative2Encoding= usedEncoding.techs[1].css;

        // the right example no 1
        res.push('<div style="padding: 2px; margin-top:1px;background-color:white;"><span class="glyphicon glyphicon-ok" style="color:green;padding:1px;"></span> This is a <span class="'+positiveEncoding+'">correct highlight</span>&nbsp;&nbsp;('+usedEncoding.techs[0].name+' AND '+usedEncoding.techs[1].name+ ')</div>')


        // the wrong example 1
        res.push('<div style="padding: 2px; margin-top:10px; background-color:white;"><span class="glyphicon glyphicon-remove" style="color:red;padding:1px;"></span> This is a <span class="'+negative1Encoding+'">wrong highlight</span>&nbsp;&nbsp;(ONLY '+usedEncoding.techs[0].name+' NOT '+usedEncoding.techs[1].name+')</div>')


        // the wrong example 2
        res.push('<div style="padding: 2px; margin-top:1px; background-color:white;"><span class="glyphicon glyphicon-remove" style="color:red;padding:1px;"></span> This is a <span class="'+negative2Encoding+'">wrong highlight</span>&nbsp;&nbsp;(ONLY '+usedEncoding.techs[1].name+' NOT '+usedEncoding.techs[0].name+')</div>')

    }

    return res.join("\n");



}



//<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>



UserTestGenereator.prototype.getRandomTestSequence=function(){

    var i= 0, j= 0, techLength = this.testTechniques.length;
    var allCombination = [];
    for (i = 0;i<techLength;i++){
        allCombination.push(
            {techs:[this.testTechniques[i]], type:"single"}
        );

        for (j=i+1;j<techLength;j++){
            allCombination.push(
                {techs:[this.testTechniques[i],this.testTechniques[j]], type:"dominant"}
            );
            allCombination.push(
                {techs:[this.testTechniques[j],this.testTechniques[i]], type:"dominant"}
            );
            allCombination.push(
                {techs:[this.testTechniques[j],this.testTechniques[i]], type:"merge"}
            );

        }


    }

    console.log(allCombination);





    //return allCombination
    return _.shuffle(allCombination);

}


UserTestGenereator.prototype.getRandomTestIndices =function(numberWords, numberPositiveSamples, numberNegativeSamples1, numberNegativeSamples2){ //, numberExperiments


    var distance = Math.floor(numberWords/(numberPositiveSamples+numberNegativeSamples1 + numberNegativeSamples2));


    var allSamples = _.range(numberNegativeSamples1+numberPositiveSamples + numberNegativeSamples2);
    //console.log(res);
    allSamples = allSamples.map(function(d){return Math.floor((d+ Math.random())*distance);})

    var negativeSamples1 = _.shuffle(allSamples);
    var positiveSamples = negativeSamples1.splice(0,numberPositiveSamples);
    var negativeSamples2 = negativeSamples1.splice(0,numberNegativeSamples2);




    return {positiveSamples: positiveSamples, negativeSamples1: negativeSamples1, negativeSamples2: negativeSamples2}

}




///**
// * Fisher-Yales shuffle
// */
//Array.prototype.shuffle = function(){
//    var m = array.length, t, i;
//    while (m) {
//        i = Math.floor(Math.random() * m--);
//        t = array[m];
//        array[m] = array[i];
//        array[i] = t;
//    }
//}