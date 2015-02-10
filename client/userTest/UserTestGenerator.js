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