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



