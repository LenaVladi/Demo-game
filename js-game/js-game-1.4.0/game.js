'use strict';
class Vector {
  constructor(x = 0, y = 0){
    this.x = x;
    this.y = y;
  }

  plus(objVector){
    if(!(objVector instanceof Vector)){
        throw new Error('Можно прибавлять к вектору только вектор типа Vector.');
    }
      let x = objVector.x + this.x;
      let y = objVector.y + this.y;
      return new Vector(x, y);
  }
  times(num){
    let x = num * this.x;
    let y = num * this.y;
    return new Vector(x, y);
  }
}

class Actor {
  constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)){
    if(!(pos || size || speed instanceof Vector)){
      throw new Error('Можно использовать только вектор типа Vector.');
    }
      this.pos = pos;
      this.size = size;
      this.speed = speed;
  }
  act(){
    return;
  }
  get left(){
    return this.pos.x;
    }
  get top(){
    return this.pos.y;
    }
  get right(){
    return this.pos.x + this.size.x;
      }
  get bottom(){
    return this.pos.y + this.size.y;
    }
  type(){
    return 'actor';
  }
  isIntersect(travelActor){
    if(!(travelActor instanceof Actor) || !travelActor){
      throw new Error('Объект не пренадлежит типу Actor или не передано аргументов');
    }
      if(travelActor === this){
        return false;
      } else return (travelActor.left <= this.right && travelActor.right >= this.left) && (travelActor.top <= this.bottom && travelActor.bottom >= this.top) ? true : false;
  }
}

class Level {
  constructor(grid = [[undefined, undefined]], actor = [new Actor()]) {
    this.grid = grid;
    this.actor = actor;
    this.status = null;
    this.finishDelay = 1;
  }
  get player(){
    this.player = this.actor.find(player => player.type === 'player');
  }
  get height(){
    this.height = this.grid.length;
  }
  get width(){
    this.width = this.grid.reduce((m, e) => {return Math.max(e.length)});
  }
  isFinished(){
    return (this.status !== null && this.finishDelay < 0) ? true : false;
  }
  actorAt(travelActor){
    if(!(travelActor instanceof Actor) || !travelActor){
      throw new Error('Объект не пренадлежит типу Actor или не определён');
    }
    return this.actor.find(act => act.isIntersect(travelActor));
  }
  obstacleAt(posVector, sizeVector){
    if(!(posVector instanceof Vector && sizeVector instanceof Vector)) {
      throw new Error('Можно использовать только вектор типа Vector');
    }
    let left = posVector.x.toFixed();
    let right = (posVector.x + sizeVector.x).toFixed();
    let top = posVector.y.toFixed();
    let bottom = (posVector.y + sizeVector.y).toFixed();

    for(let i = top; i < bottom; i++){
      for(let j = left; j < right; j++){
        if(this.grid[i][j] !== undefined){
         return this.grid[i][j];
        }
      }
    }
  }
  removeActor(travelActor){
    let who = this.actor.findIndex(who => who === travelActor);
    return  this.actor.splice(who, 1);
  }
  noMoreActors(type){
    return this.actor.findIndex(types => types.type === type) ? false : true;
  }
  playerTouched(type, travelActor){
    if(type === 'lava' || 'fireball'){
      this.status = 'lost';
    }
    if(type === 'coin' && travelActor.type === 'coin'){
      let coin = this.actor.findIndex(coin => coin.type === 'coin');
      this.actor.splice(coin, 1);
      if(!this.actor.find(coin => coin.type === 'coin')){
        this.status = 'won';
      }
    }
  }
}
