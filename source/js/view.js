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
