document.addEventListener("DOMContentLoaded", function(event){
    var model = new BModel();
    var view = new BView(model);
    var controller = new BController(view,model);

});