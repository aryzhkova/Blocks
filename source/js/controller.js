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