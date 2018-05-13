function Event(sender) {
    this._sender = sender;
    this._listeners = [];
}

Event.prototype = {
    attach: function (listener) {
        this._listeners.push(listener);
    },
    notify: function (args) {
        var index;

        for (index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender, args);
        }
    }
};

function BModel() {
    this.blocks = [];
    this.onChangeBlocks = new Event(this);
    this.onAddBlock = new Event(this);
    this.onChangeSelected = new Event(this);
    this.onChangeColor = new Event(this);
}
BModel.prototype.getBlocks = function () {
  return this.blocks;
};
BModel.prototype.addBlock = function(blockType){
    var block ={
        id : "block"+this.blocks.length,
        blockType : blockType,
        selected : false,
        red : false,
        green : false
    };
    if(blockType == "complex"){
        block.red = true;
    }
    this.blocks.push(block);
    this.onChangeBlocks.notify();
    this.onAddBlock.notify({index : this.blocks.length-1})
};
BModel.prototype.setSelected = function (idBlock,value) {
    var index = this.getBlockIndex(idBlock);
    this.blocks[index].selected = value;
};
BModel.prototype.setColor =function (idBlock,color) {
    var index = this.getBlockIndex(idBlock);
    if(color == "green"){
        this.blocks[index].red = false;
        this.blocks[index].green = true;
    }else{
        this.blocks[index].red = true;
        this.blocks[index].green = false;
    }
};
BModel.prototype.getCountSelected = function () {
  var count = 0;
  this.blocks.forEach(function (block) {
      if(block.selected==true){
          count++;
      }
  });
  return count;
};
BModel.prototype.getCountSelectedGreen = function(){
    var count = 0;
    this.blocks.forEach(function (block) {
        if(block.selected==true && block.green == true){
            count++;
        }
    });
    return count;
};
BModel.prototype.getCountSelectedRed = function () {
    var count = 0;
    this.blocks.forEach(function (block) {
        if(block.selected==true && block.red == true){
            count++;
        }
    });
    return count;
};
BModel.prototype.getBlockIndex = function (idBlock) {
    var i = 0;
    while(i < this.blocks.length){
        if(this.blocks[i].id == idBlock){
            return i;
        }
        i++;
    }
};
BModel.prototype.removeBlock = function (indexBlock) {
  this.blocks.splice(indexBlock,1);
};




function BView(model){
    this.BModel = model;
    this.blocksList = document.getElementById('blocks');
    this.modal = document.getElementById('modal');
    this.blocks = [];
    this.BModel.onChangeBlocks.attach(function(){
        this.blocks = this.BModel.getBlocks();
        this.setCount(this.blocks.length,'.info__count_total');
        var countSelected = this.BModel.getCountSelected();
        this.setCount(countSelected,'.info__count_selected');
        var countSelectedGreen = this.BModel.getCountSelectedGreen();
        this.setCount(countSelectedGreen,'.info__count_selected_green');
        var countSelectedRed = this.BModel.getCountSelectedRed();
        this.setCount(countSelectedRed,'.info__count_selected_red');
    }.bind(this));

    this.BModel.onAddBlock.attach(function(sender,arg){
        this.renderBlock(arg.index);
    }.bind(this));

    this.BModel.onChangeSelected.attach(function (sender,arg) {
        this.setSelected(arg.index);
    }.bind(this));

    this.BModel.onChangeColor.attach(function (sender,arg) {
        this.setColor(arg.index);
    }.bind(this));

}
BView.prototype.renderBlock = function (index) {
    var el = document.createElement('li');
    el.className = 'blocks__item';
    el.setAttribute('id',this.blocks[index].id);
    if(this.blocks[index].blockType == "simple"){
        el.classList.add('blocks__item_simple');
    }
    if(this.blocks[index].blockType == "complex"){
        el.classList.add('blocks__item_complex');
        el.classList.add('blocks__item_red');
    }
    var content = document.createElement('div');
    content.className = 'blocks__item-content';
    content.innerHTML = this.getRandomText();
    el.appendChild(content);
    var btn = document.createElement('button');
    btn.classList.add('btn');
    btn.classList.add('btn_close');
    el.appendChild(btn);
    this.blocksList.appendChild(el);

};
BView.prototype.getRandomText = function(){
    var min = 10,
        max = 20;
    var wordsCount = min + Math.random() * (max + 1 - min);
    wordsCount = Math.floor(wordsCount);
    var str ="";
    for(var i = 0; i < wordsCount; i++ ){
        var wordsLength = Math.floor(3 + Math.random() * 7);
        var word ='';
        while(word.length < wordsLength){
            word += String.fromCharCode(Math.random() *80 +48).replace(/\W|\d|_/g,'');
        }
        str = str + word +" ";
    }
    return str.trim();
};
BView.prototype.setCount = function (count,className) {
    document.querySelector(className).innerHTML = count;
};
BView.prototype.setSelected = function (indexBlock) {
    if(this.blocks[indexBlock].selected == true){
        document.getElementById(this.blocks[indexBlock].id).classList.add('blocks__item_selected');
    }else{
        document.getElementById(this.blocks[indexBlock].id).classList.remove('blocks__item_selected');
    }
};
BView.prototype.setColor = function (indexBlock) {
    if(this.blocks[indexBlock].red == true){
        document.getElementById(this.blocks[indexBlock].id).classList.remove('blocks__item_green');
        document.getElementById(this.blocks[indexBlock].id).classList.add('blocks__item_red');
    }else{
        document.getElementById(this.blocks[indexBlock].id).classList.remove('blocks__item_red');
        document.getElementById(this.blocks[indexBlock].id).classList.add('blocks__item_green');
    }
};
BView.prototype.removeBlock = function(idBlock){
    var block = document.getElementById(idBlock);
    this.blocksList.removeChild(block);
};
BView.prototype.showModal = function () {
    this.modal.style.zIndex = 10;
    this.modal.classList.add('show');
};
BView.prototype.closeModal = function () {
    this.modal.classList.remove('show');
    setTimeout(function () {
        this.modal.style.zIndex = -10;
    }.bind(this));
};

BView.prototype.isSimple = function (block) {
    if(block.classList.contains('blocks__item_simple')){
        return true;
    }else{
        return false;
    }
};
BView.prototype.isSelected = function (block) {
    if(block.classList.contains('blocks__item_selected')){
        return true;
    }else{
        return false;
    }
};
BView.prototype.isRed = function (block) {
    if(block.classList.contains('blocks__item_red')){
        return true;
    }else{
        return false;
    }
};

function BController (BView,BModel){
    this.BView = BView;
    this.BModel = BModel;
    this.init();
}
BController.prototype.init = function () {
    var formAddBlock = document.getElementById('formAddBlock');
    var blockList = document.getElementById('blocks');
    var delBtn = document.getElementById('del');
    var cancelBtn = document.getElementById('cancelDel');
    var block = null;
    var clicks = 0;
    var timer = 0;

    formAddBlock.addEventListener('submit',function (e) {
        e.preventDefault();
        var fields = formAddBlock.elements.blockType;
        for(var i = 0; i < fields.length; i++){
            if(fields[i].checked){
                var blockType = fields[i].value;
                this.BModel.addBlock(blockType);
            }
        }
    }.bind(this));

    blockList.addEventListener('click',function (e) {
        clicks++;
        if(e.target.tagName !== 'LI'){
            block = e.target.parentElement;
        }else{
            block = e.target;
        }
        if(clicks == 1){
            timer = setTimeout(function () {
                this.onSingleClick(block,e);
                clicks = 0;
            }.bind(this),400);

        }else{
            clearTimeout(timer);
            this.onDoubleClick(block);
            clicks = 0;
        }

    }.bind(this));

    delBtn.addEventListener('click',function () {
        this.BView.closeModal();
        this.delBlock(block);
    }.bind(this));

    cancelBtn.addEventListener('click',function () {
        this.BView.closeModal();
    }.bind(this));

};
BController.prototype.setSelected = function (block) {
    var idBlock = block.getAttribute('id');
    var indexBlock = this.BModel.getBlockIndex(idBlock);
    if(this.BView.isSelected(block)){
        this.BModel.setSelected(idBlock,false);
    }else{
        this.BModel.setSelected(idBlock,true);
    }
    this.BModel.onChangeBlocks.notify();
    this.BModel.onChangeSelected.notify({index: indexBlock});
};
BController.prototype.setColored = function (block) {
    var idBlock = block.getAttribute('id');
    var indexBlock = this.BModel.getBlockIndex(idBlock);
    if(!this.BView.isSimple(block)){
        if(this.BView.isRed(block)){
            this.BModel.setColor(idBlock,'green');
        }else{
            this.BModel.setColor(idBlock,'red');
        }
        this.BModel.onChangeBlocks.notify();
        this.BModel.onChangeColor.notify({index: indexBlock});
    }
};
BController.prototype.delBlock = function (block) {
    var idBlock = block.getAttribute('id');
    var indexBlock = this.BModel.getBlockIndex(idBlock);
    this.BModel.removeBlock(indexBlock);
    this.BView.removeBlock(idBlock);
    this.BModel.onChangeBlocks.notify();
};
BController.prototype.setDeleted = function (block) {
    if(this.BView.isSimple(block)){
        this.delBlock(block);
    }else{
        this.BView.showModal();
    }
};
BController.prototype.onSingleClick = function (block,e) {
    if(e.target.tagName == 'BUTTON'){
        this.setDeleted(block);
    }else{
        this.setSelected(block);
    }
};
BController.prototype.onDoubleClick = function (block) {
    this.setColored(block);
};
document.addEventListener("DOMContentLoaded", function(event){
    var model = new BModel();
    var view = new BView(model);
    var controller = new BController(view,model);

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50LmpzIiwibW9kZWwuanMiLCJ2aWV3LmpzIiwiY29udHJvbGxlci5qcyIsImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIEV2ZW50KHNlbmRlcikge1xyXG4gICAgdGhpcy5fc2VuZGVyID0gc2VuZGVyO1xyXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW107XHJcbn1cclxuXHJcbkV2ZW50LnByb3RvdHlwZSA9IHtcclxuICAgIGF0dGFjaDogZnVuY3Rpb24gKGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xyXG4gICAgfSxcclxuICAgIG5vdGlmeTogZnVuY3Rpb24gKGFyZ3MpIHtcclxuICAgICAgICB2YXIgaW5kZXg7XHJcblxyXG4gICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuX2xpc3RlbmVycy5sZW5ndGg7IGluZGV4ICs9IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzW2luZGV4XSh0aGlzLl9zZW5kZXIsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuIiwiZnVuY3Rpb24gQk1vZGVsKCkge1xyXG4gICAgdGhpcy5ibG9ja3MgPSBbXTtcclxuICAgIHRoaXMub25DaGFuZ2VCbG9ja3MgPSBuZXcgRXZlbnQodGhpcyk7XHJcbiAgICB0aGlzLm9uQWRkQmxvY2sgPSBuZXcgRXZlbnQodGhpcyk7XHJcbiAgICB0aGlzLm9uQ2hhbmdlU2VsZWN0ZWQgPSBuZXcgRXZlbnQodGhpcyk7XHJcbiAgICB0aGlzLm9uQ2hhbmdlQ29sb3IgPSBuZXcgRXZlbnQodGhpcyk7XHJcbn1cclxuQk1vZGVsLnByb3RvdHlwZS5nZXRCbG9ja3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHRoaXMuYmxvY2tzO1xyXG59O1xyXG5CTW9kZWwucHJvdG90eXBlLmFkZEJsb2NrID0gZnVuY3Rpb24oYmxvY2tUeXBlKXtcclxuICAgIHZhciBibG9jayA9e1xyXG4gICAgICAgIGlkIDogXCJibG9ja1wiK3RoaXMuYmxvY2tzLmxlbmd0aCxcclxuICAgICAgICBibG9ja1R5cGUgOiBibG9ja1R5cGUsXHJcbiAgICAgICAgc2VsZWN0ZWQgOiBmYWxzZSxcclxuICAgICAgICByZWQgOiBmYWxzZSxcclxuICAgICAgICBncmVlbiA6IGZhbHNlXHJcbiAgICB9O1xyXG4gICAgaWYoYmxvY2tUeXBlID09IFwiY29tcGxleFwiKXtcclxuICAgICAgICBibG9jay5yZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5ibG9ja3MucHVzaChibG9jayk7XHJcbiAgICB0aGlzLm9uQ2hhbmdlQmxvY2tzLm5vdGlmeSgpO1xyXG4gICAgdGhpcy5vbkFkZEJsb2NrLm5vdGlmeSh7aW5kZXggOiB0aGlzLmJsb2Nrcy5sZW5ndGgtMX0pXHJcbn07XHJcbkJNb2RlbC5wcm90b3R5cGUuc2V0U2VsZWN0ZWQgPSBmdW5jdGlvbiAoaWRCbG9jayx2YWx1ZSkge1xyXG4gICAgdmFyIGluZGV4ID0gdGhpcy5nZXRCbG9ja0luZGV4KGlkQmxvY2spO1xyXG4gICAgdGhpcy5ibG9ja3NbaW5kZXhdLnNlbGVjdGVkID0gdmFsdWU7XHJcbn07XHJcbkJNb2RlbC5wcm90b3R5cGUuc2V0Q29sb3IgPWZ1bmN0aW9uIChpZEJsb2NrLGNvbG9yKSB7XHJcbiAgICB2YXIgaW5kZXggPSB0aGlzLmdldEJsb2NrSW5kZXgoaWRCbG9jayk7XHJcbiAgICBpZihjb2xvciA9PSBcImdyZWVuXCIpe1xyXG4gICAgICAgIHRoaXMuYmxvY2tzW2luZGV4XS5yZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmJsb2Nrc1tpbmRleF0uZ3JlZW4gPSB0cnVlO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5ibG9ja3NbaW5kZXhdLnJlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ibG9ja3NbaW5kZXhdLmdyZWVuID0gZmFsc2U7XHJcbiAgICB9XHJcbn07XHJcbkJNb2RlbC5wcm90b3R5cGUuZ2V0Q291bnRTZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgY291bnQgPSAwO1xyXG4gIHRoaXMuYmxvY2tzLmZvckVhY2goZnVuY3Rpb24gKGJsb2NrKSB7XHJcbiAgICAgIGlmKGJsb2NrLnNlbGVjdGVkPT10cnVlKXtcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gY291bnQ7XHJcbn07XHJcbkJNb2RlbC5wcm90b3R5cGUuZ2V0Q291bnRTZWxlY3RlZEdyZWVuID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGZ1bmN0aW9uIChibG9jaykge1xyXG4gICAgICAgIGlmKGJsb2NrLnNlbGVjdGVkPT10cnVlICYmIGJsb2NrLmdyZWVuID09IHRydWUpe1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGNvdW50O1xyXG59O1xyXG5CTW9kZWwucHJvdG90eXBlLmdldENvdW50U2VsZWN0ZWRSZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaChmdW5jdGlvbiAoYmxvY2spIHtcclxuICAgICAgICBpZihibG9jay5zZWxlY3RlZD09dHJ1ZSAmJiBibG9jay5yZWQgPT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gY291bnQ7XHJcbn07XHJcbkJNb2RlbC5wcm90b3R5cGUuZ2V0QmxvY2tJbmRleCA9IGZ1bmN0aW9uIChpZEJsb2NrKSB7XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB3aGlsZShpIDwgdGhpcy5ibG9ja3MubGVuZ3RoKXtcclxuICAgICAgICBpZih0aGlzLmJsb2Nrc1tpXS5pZCA9PSBpZEJsb2NrKXtcclxuICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGkrKztcclxuICAgIH1cclxufTtcclxuQk1vZGVsLnByb3RvdHlwZS5yZW1vdmVCbG9jayA9IGZ1bmN0aW9uIChpbmRleEJsb2NrKSB7XHJcbiAgdGhpcy5ibG9ja3Muc3BsaWNlKGluZGV4QmxvY2ssMSk7XHJcbn07XHJcblxyXG5cclxuXHJcbiIsImZ1bmN0aW9uIEJWaWV3KG1vZGVsKXtcclxuICAgIHRoaXMuQk1vZGVsID0gbW9kZWw7XHJcbiAgICB0aGlzLmJsb2Nrc0xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmxvY2tzJyk7XHJcbiAgICB0aGlzLm1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsJyk7XHJcbiAgICB0aGlzLmJsb2NrcyA9IFtdO1xyXG4gICAgdGhpcy5CTW9kZWwub25DaGFuZ2VCbG9ja3MuYXR0YWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5ibG9ja3MgPSB0aGlzLkJNb2RlbC5nZXRCbG9ja3MoKTtcclxuICAgICAgICB0aGlzLnNldENvdW50KHRoaXMuYmxvY2tzLmxlbmd0aCwnLmluZm9fX2NvdW50X3RvdGFsJyk7XHJcbiAgICAgICAgdmFyIGNvdW50U2VsZWN0ZWQgPSB0aGlzLkJNb2RlbC5nZXRDb3VudFNlbGVjdGVkKCk7XHJcbiAgICAgICAgdGhpcy5zZXRDb3VudChjb3VudFNlbGVjdGVkLCcuaW5mb19fY291bnRfc2VsZWN0ZWQnKTtcclxuICAgICAgICB2YXIgY291bnRTZWxlY3RlZEdyZWVuID0gdGhpcy5CTW9kZWwuZ2V0Q291bnRTZWxlY3RlZEdyZWVuKCk7XHJcbiAgICAgICAgdGhpcy5zZXRDb3VudChjb3VudFNlbGVjdGVkR3JlZW4sJy5pbmZvX19jb3VudF9zZWxlY3RlZF9ncmVlbicpO1xyXG4gICAgICAgIHZhciBjb3VudFNlbGVjdGVkUmVkID0gdGhpcy5CTW9kZWwuZ2V0Q291bnRTZWxlY3RlZFJlZCgpO1xyXG4gICAgICAgIHRoaXMuc2V0Q291bnQoY291bnRTZWxlY3RlZFJlZCwnLmluZm9fX2NvdW50X3NlbGVjdGVkX3JlZCcpO1xyXG4gICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLkJNb2RlbC5vbkFkZEJsb2NrLmF0dGFjaChmdW5jdGlvbihzZW5kZXIsYXJnKXtcclxuICAgICAgICB0aGlzLnJlbmRlckJsb2NrKGFyZy5pbmRleCk7XHJcbiAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgIHRoaXMuQk1vZGVsLm9uQ2hhbmdlU2VsZWN0ZWQuYXR0YWNoKGZ1bmN0aW9uIChzZW5kZXIsYXJnKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZChhcmcuaW5kZXgpO1xyXG4gICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB0aGlzLkJNb2RlbC5vbkNoYW5nZUNvbG9yLmF0dGFjaChmdW5jdGlvbiAoc2VuZGVyLGFyZykge1xyXG4gICAgICAgIHRoaXMuc2V0Q29sb3IoYXJnLmluZGV4KTtcclxuICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG59XHJcbkJWaWV3LnByb3RvdHlwZS5yZW5kZXJCbG9jayA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgIGVsLmNsYXNzTmFtZSA9ICdibG9ja3NfX2l0ZW0nO1xyXG4gICAgZWwuc2V0QXR0cmlidXRlKCdpZCcsdGhpcy5ibG9ja3NbaW5kZXhdLmlkKTtcclxuICAgIGlmKHRoaXMuYmxvY2tzW2luZGV4XS5ibG9ja1R5cGUgPT0gXCJzaW1wbGVcIil7XHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnYmxvY2tzX19pdGVtX3NpbXBsZScpO1xyXG4gICAgfVxyXG4gICAgaWYodGhpcy5ibG9ja3NbaW5kZXhdLmJsb2NrVHlwZSA9PSBcImNvbXBsZXhcIil7XHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnYmxvY2tzX19pdGVtX2NvbXBsZXgnKTtcclxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdibG9ja3NfX2l0ZW1fcmVkJyk7XHJcbiAgICB9XHJcbiAgICB2YXIgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgY29udGVudC5jbGFzc05hbWUgPSAnYmxvY2tzX19pdGVtLWNvbnRlbnQnO1xyXG4gICAgY29udGVudC5pbm5lckhUTUwgPSB0aGlzLmdldFJhbmRvbVRleHQoKTtcclxuICAgIGVsLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgdmFyIGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgYnRuLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xyXG4gICAgYnRuLmNsYXNzTGlzdC5hZGQoJ2J0bl9jbG9zZScpO1xyXG4gICAgZWwuYXBwZW5kQ2hpbGQoYnRuKTtcclxuICAgIHRoaXMuYmxvY2tzTGlzdC5hcHBlbmRDaGlsZChlbCk7XHJcblxyXG59O1xyXG5CVmlldy5wcm90b3R5cGUuZ2V0UmFuZG9tVGV4dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgbWluID0gMTAsXHJcbiAgICAgICAgbWF4ID0gMjA7XHJcbiAgICB2YXIgd29yZHNDb3VudCA9IG1pbiArIE1hdGgucmFuZG9tKCkgKiAobWF4ICsgMSAtIG1pbik7XHJcbiAgICB3b3Jkc0NvdW50ID0gTWF0aC5mbG9vcih3b3Jkc0NvdW50KTtcclxuICAgIHZhciBzdHIgPVwiXCI7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgd29yZHNDb3VudDsgaSsrICl7XHJcbiAgICAgICAgdmFyIHdvcmRzTGVuZ3RoID0gTWF0aC5mbG9vcigzICsgTWF0aC5yYW5kb20oKSAqIDcpO1xyXG4gICAgICAgIHZhciB3b3JkID0nJztcclxuICAgICAgICB3aGlsZSh3b3JkLmxlbmd0aCA8IHdvcmRzTGVuZ3RoKXtcclxuICAgICAgICAgICAgd29yZCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKE1hdGgucmFuZG9tKCkgKjgwICs0OCkucmVwbGFjZSgvXFxXfFxcZHxfL2csJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdHIgPSBzdHIgKyB3b3JkICtcIiBcIjtcclxuICAgIH1cclxuICAgIHJldHVybiBzdHIudHJpbSgpO1xyXG59O1xyXG5CVmlldy5wcm90b3R5cGUuc2V0Q291bnQgPSBmdW5jdGlvbiAoY291bnQsY2xhc3NOYW1lKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNsYXNzTmFtZSkuaW5uZXJIVE1MID0gY291bnQ7XHJcbn07XHJcbkJWaWV3LnByb3RvdHlwZS5zZXRTZWxlY3RlZCA9IGZ1bmN0aW9uIChpbmRleEJsb2NrKSB7XHJcbiAgICBpZih0aGlzLmJsb2Nrc1tpbmRleEJsb2NrXS5zZWxlY3RlZCA9PSB0cnVlKXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmJsb2Nrc1tpbmRleEJsb2NrXS5pZCkuY2xhc3NMaXN0LmFkZCgnYmxvY2tzX19pdGVtX3NlbGVjdGVkJyk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmJsb2Nrc1tpbmRleEJsb2NrXS5pZCkuY2xhc3NMaXN0LnJlbW92ZSgnYmxvY2tzX19pdGVtX3NlbGVjdGVkJyk7XHJcbiAgICB9XHJcbn07XHJcbkJWaWV3LnByb3RvdHlwZS5zZXRDb2xvciA9IGZ1bmN0aW9uIChpbmRleEJsb2NrKSB7XHJcbiAgICBpZih0aGlzLmJsb2Nrc1tpbmRleEJsb2NrXS5yZWQgPT0gdHJ1ZSl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5ibG9ja3NbaW5kZXhCbG9ja10uaWQpLmNsYXNzTGlzdC5yZW1vdmUoJ2Jsb2Nrc19faXRlbV9ncmVlbicpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYmxvY2tzW2luZGV4QmxvY2tdLmlkKS5jbGFzc0xpc3QuYWRkKCdibG9ja3NfX2l0ZW1fcmVkJyk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmJsb2Nrc1tpbmRleEJsb2NrXS5pZCkuY2xhc3NMaXN0LnJlbW92ZSgnYmxvY2tzX19pdGVtX3JlZCcpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYmxvY2tzW2luZGV4QmxvY2tdLmlkKS5jbGFzc0xpc3QuYWRkKCdibG9ja3NfX2l0ZW1fZ3JlZW4nKTtcclxuICAgIH1cclxufTtcclxuQlZpZXcucHJvdG90eXBlLnJlbW92ZUJsb2NrID0gZnVuY3Rpb24oaWRCbG9jayl7XHJcbiAgICB2YXIgYmxvY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZEJsb2NrKTtcclxuICAgIHRoaXMuYmxvY2tzTGlzdC5yZW1vdmVDaGlsZChibG9jayk7XHJcbn07XHJcbkJWaWV3LnByb3RvdHlwZS5zaG93TW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLm1vZGFsLnN0eWxlLnpJbmRleCA9IDEwO1xyXG4gICAgdGhpcy5tb2RhbC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbn07XHJcbkJWaWV3LnByb3RvdHlwZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5tb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLm1vZGFsLnN0eWxlLnpJbmRleCA9IC0xMDtcclxuICAgIH0uYmluZCh0aGlzKSk7XHJcbn07XHJcblxyXG5CVmlldy5wcm90b3R5cGUuaXNTaW1wbGUgPSBmdW5jdGlvbiAoYmxvY2spIHtcclxuICAgIGlmKGJsb2NrLmNsYXNzTGlzdC5jb250YWlucygnYmxvY2tzX19pdGVtX3NpbXBsZScpKXtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufTtcclxuQlZpZXcucHJvdG90eXBlLmlzU2VsZWN0ZWQgPSBmdW5jdGlvbiAoYmxvY2spIHtcclxuICAgIGlmKGJsb2NrLmNsYXNzTGlzdC5jb250YWlucygnYmxvY2tzX19pdGVtX3NlbGVjdGVkJykpe1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59O1xyXG5CVmlldy5wcm90b3R5cGUuaXNSZWQgPSBmdW5jdGlvbiAoYmxvY2spIHtcclxuICAgIGlmKGJsb2NrLmNsYXNzTGlzdC5jb250YWlucygnYmxvY2tzX19pdGVtX3JlZCcpKXtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufTtcclxuIiwiZnVuY3Rpb24gQkNvbnRyb2xsZXIgKEJWaWV3LEJNb2RlbCl7XHJcbiAgICB0aGlzLkJWaWV3ID0gQlZpZXc7XHJcbiAgICB0aGlzLkJNb2RlbCA9IEJNb2RlbDtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcbkJDb250cm9sbGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGZvcm1BZGRCbG9jayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtQWRkQmxvY2snKTtcclxuICAgIHZhciBibG9ja0xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmxvY2tzJyk7XHJcbiAgICB2YXIgZGVsQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbCcpO1xyXG4gICAgdmFyIGNhbmNlbEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW5jZWxEZWwnKTtcclxuICAgIHZhciBibG9jayA9IG51bGw7XHJcbiAgICB2YXIgY2xpY2tzID0gMDtcclxuICAgIHZhciB0aW1lciA9IDA7XHJcblxyXG4gICAgZm9ybUFkZEJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdmFyIGZpZWxkcyA9IGZvcm1BZGRCbG9jay5lbGVtZW50cy5ibG9ja1R5cGU7XHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmKGZpZWxkc1tpXS5jaGVja2VkKXtcclxuICAgICAgICAgICAgICAgIHZhciBibG9ja1R5cGUgPSBmaWVsZHNbaV0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkJNb2RlbC5hZGRCbG9jayhibG9ja1R5cGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBibG9ja0xpc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgY2xpY2tzKys7XHJcbiAgICAgICAgaWYoZS50YXJnZXQudGFnTmFtZSAhPT0gJ0xJJyl7XHJcbiAgICAgICAgICAgIGJsb2NrID0gZS50YXJnZXQucGFyZW50RWxlbWVudDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgYmxvY2sgPSBlLnRhcmdldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoY2xpY2tzID09IDEpe1xyXG4gICAgICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblNpbmdsZUNsaWNrKGJsb2NrLGUpO1xyXG4gICAgICAgICAgICAgICAgY2xpY2tzID0gMDtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLDQwMCk7XHJcblxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgICAgICAgICB0aGlzLm9uRG91YmxlQ2xpY2soYmxvY2spO1xyXG4gICAgICAgICAgICBjbGlja3MgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgIGRlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuQlZpZXcuY2xvc2VNb2RhbCgpO1xyXG4gICAgICAgIHRoaXMuZGVsQmxvY2soYmxvY2spO1xyXG4gICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBjYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLkJWaWV3LmNsb3NlTW9kYWwoKTtcclxuICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG59O1xyXG5CQ29udHJvbGxlci5wcm90b3R5cGUuc2V0U2VsZWN0ZWQgPSBmdW5jdGlvbiAoYmxvY2spIHtcclxuICAgIHZhciBpZEJsb2NrID0gYmxvY2suZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgdmFyIGluZGV4QmxvY2sgPSB0aGlzLkJNb2RlbC5nZXRCbG9ja0luZGV4KGlkQmxvY2spO1xyXG4gICAgaWYodGhpcy5CVmlldy5pc1NlbGVjdGVkKGJsb2NrKSl7XHJcbiAgICAgICAgdGhpcy5CTW9kZWwuc2V0U2VsZWN0ZWQoaWRCbG9jayxmYWxzZSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICB0aGlzLkJNb2RlbC5zZXRTZWxlY3RlZChpZEJsb2NrLHRydWUpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5CTW9kZWwub25DaGFuZ2VCbG9ja3Mubm90aWZ5KCk7XHJcbiAgICB0aGlzLkJNb2RlbC5vbkNoYW5nZVNlbGVjdGVkLm5vdGlmeSh7aW5kZXg6IGluZGV4QmxvY2t9KTtcclxufTtcclxuQkNvbnRyb2xsZXIucHJvdG90eXBlLnNldENvbG9yZWQgPSBmdW5jdGlvbiAoYmxvY2spIHtcclxuICAgIHZhciBpZEJsb2NrID0gYmxvY2suZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgdmFyIGluZGV4QmxvY2sgPSB0aGlzLkJNb2RlbC5nZXRCbG9ja0luZGV4KGlkQmxvY2spO1xyXG4gICAgaWYoIXRoaXMuQlZpZXcuaXNTaW1wbGUoYmxvY2spKXtcclxuICAgICAgICBpZih0aGlzLkJWaWV3LmlzUmVkKGJsb2NrKSl7XHJcbiAgICAgICAgICAgIHRoaXMuQk1vZGVsLnNldENvbG9yKGlkQmxvY2ssJ2dyZWVuJyk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuQk1vZGVsLnNldENvbG9yKGlkQmxvY2ssJ3JlZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLkJNb2RlbC5vbkNoYW5nZUJsb2Nrcy5ub3RpZnkoKTtcclxuICAgICAgICB0aGlzLkJNb2RlbC5vbkNoYW5nZUNvbG9yLm5vdGlmeSh7aW5kZXg6IGluZGV4QmxvY2t9KTtcclxuICAgIH1cclxufTtcclxuQkNvbnRyb2xsZXIucHJvdG90eXBlLmRlbEJsb2NrID0gZnVuY3Rpb24gKGJsb2NrKSB7XHJcbiAgICB2YXIgaWRCbG9jayA9IGJsb2NrLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgIHZhciBpbmRleEJsb2NrID0gdGhpcy5CTW9kZWwuZ2V0QmxvY2tJbmRleChpZEJsb2NrKTtcclxuICAgIHRoaXMuQk1vZGVsLnJlbW92ZUJsb2NrKGluZGV4QmxvY2spO1xyXG4gICAgdGhpcy5CVmlldy5yZW1vdmVCbG9jayhpZEJsb2NrKTtcclxuICAgIHRoaXMuQk1vZGVsLm9uQ2hhbmdlQmxvY2tzLm5vdGlmeSgpO1xyXG59O1xyXG5CQ29udHJvbGxlci5wcm90b3R5cGUuc2V0RGVsZXRlZCA9IGZ1bmN0aW9uIChibG9jaykge1xyXG4gICAgaWYodGhpcy5CVmlldy5pc1NpbXBsZShibG9jaykpe1xyXG4gICAgICAgIHRoaXMuZGVsQmxvY2soYmxvY2spO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5CVmlldy5zaG93TW9kYWwoKTtcclxuICAgIH1cclxufTtcclxuQkNvbnRyb2xsZXIucHJvdG90eXBlLm9uU2luZ2xlQ2xpY2sgPSBmdW5jdGlvbiAoYmxvY2ssZSkge1xyXG4gICAgaWYoZS50YXJnZXQudGFnTmFtZSA9PSAnQlVUVE9OJyl7XHJcbiAgICAgICAgdGhpcy5zZXREZWxldGVkKGJsb2NrKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWQoYmxvY2spO1xyXG4gICAgfVxyXG59O1xyXG5CQ29udHJvbGxlci5wcm90b3R5cGUub25Eb3VibGVDbGljayA9IGZ1bmN0aW9uIChibG9jaykge1xyXG4gICAgdGhpcy5zZXRDb2xvcmVkKGJsb2NrKTtcclxufTsiLCJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICB2YXIgbW9kZWwgPSBuZXcgQk1vZGVsKCk7XHJcbiAgICB2YXIgdmlldyA9IG5ldyBCVmlldyhtb2RlbCk7XHJcbiAgICB2YXIgY29udHJvbGxlciA9IG5ldyBCQ29udHJvbGxlcih2aWV3LG1vZGVsKTtcclxuXHJcbn0pOyJdfQ==
