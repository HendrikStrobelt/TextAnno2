Template.run.helpers({
    template:function(){
        var cTemp = Session.get("currentTemplate");
        if (!cTemp){
            Session.set("currentTemplate", "explain")
        }


        return cTemp;
    }


})