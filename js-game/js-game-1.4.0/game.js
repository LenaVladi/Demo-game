'use strict';
class Vector {
  constructor(x = 0, y = 0){
    this.x = x;
    this.y = y;
  }

  plus(objVector){
    try {
      if(!(objVector instanceof Vector)){
        throw 'Можно прибавлять к вектору только вектор типа Vector.';
      }
      let x = objVector.x + this.x;
      let y = objVector.y + this.y;
      return new Vector(x, y);
    } catch(e) {
      alert(e);
    }
  }
  times(num){
    let x = num * this.x;
    let y = num * this.y;
    return new Vector(x, y);
  }
}

class Actor {
  constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)){
    try {
      if(!(pos || size || speed instanceof Vector)){
        throw 'Можно использовать только вектор типа Vector.';
      }
      this.pos = pos;
      this.size = size;
      this.speed = speed;
    } catch(e){
      alert(e);
    }
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
    try {
      if(!(travelActor instanceof Actor) || !travelActor){
        throw 'Error';
      }
      if(travelActor === this){
        return false;
      } else
      return (travelActor.left <= this.right && travelActor.right >= this.left) && (travelActor.top <= this.bottom && travelActor.bottom >= this.top) ? true : false;

    } catch(e) {
      alert(e);
    }
  }
}

class Level {
  constructor(grid = [[undefined, undefined]], actor = [new Actor()]) {
    this.grid = grid;
    this.actor = actor;
    this.status = null;
    this.finishDelay = 1;
  }
  // get grid(rows, collumn){
  //   let this.grid = [];
  //   for (let i = 0; i < rows; i++){
  //     grid[i] = [];
  //     for (let j = 0; j < collumn; j++){
  //       grid[i][j] = 0;
  //     }
  //   }
  // }
  get actors(){
    let actors = [];
    actors.push(this.actor);
    return actors;
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
  // get status(){
  //   this.status = null;
  // }
  // get finishDelay(){
  //   this.finishDelay = 1;
  // }
  isFinished(){
    return (this.status !== null && this.finishDelay < 0) ? true : false;
  }
  actorAt(travelActor){
    try {
      if(!(travelActor instanceof Actor) || !travelActor){
        throw 'Error';
      }
      if(){
        return;
      }
    } catch(e){
      alert(e);
    }
  }
  obstacleAt(posVector, sizeVector){

  }
  removeActor(travelActor){
    if(let who = this.actor.findIndex(who => who === travelActor){
      return  this.actor.splice(who, 1);
    };
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
        this.status = won;
      }
    }
  }
}
