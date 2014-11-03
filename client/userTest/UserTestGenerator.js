/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 11/1/14.
 */


UserTestGenereator =  function(){

    this.testTechniques = [
        "underlined",
        "underlined_dotted",
        "underlined_double",
        "color_cat5_pink",
        "colorBack_cat1_yellow",
        "bold",
        "italic",
        "fontSize_150",
        "border_rounded-slight",
        "text-shadow-thick-gray",
        "letter-spacing-widened",
        "word-spacing"


    ]



}

UserTestGenereator.prototype.getRandomTestSequence=function(){

    return _.shuffle(this.testTechniques);

}


UserTestGenereator.prototype.getRandomTestIndices =function(numberWords, numberSamples){ //, numberExperiments


    var distance = Math.floor(numberWords/numberSamples);

    var res = _.range(numberSamples)
    console.log(res);
    return res.map(function(d){return Math.floor((d+ Math.random())*distance);})

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