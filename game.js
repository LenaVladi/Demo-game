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
    if(!(pos instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)){
      throw new Error('Можно использовать только вектор типа Vector.');
    }
      this.pos = pos;
      this.size = size;
      this.speed = speed;
      //this.type = 'actor'
      Object.defineProperty(this, 'type', {
      value: 'actor',
      writable: false,
      configurable: false
    });

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

  isIntersect(travelActor){
    if(!(travelActor instanceof Actor) || !travelActor){
      throw new Error('Объект не пренадлежит типу Actor или не передано аргументов');
    }
      if(travelActor === this){
        return false;
      } else if (travelActor.left === this.right || travelActor.right === this.left) {
        return false;
      } else if(travelActor.top === this.bottom || travelActor.bottom === this.top) {
        return false;
      } else return (travelActor.left <= this.right && travelActor.right >= this.left) || (travelActor.top >= this.bottom && travelActor.bottom <= this.top) ? true : false;
  }
}

class Level {
  constructor(grid = [], actor) {
    this.grid = grid;
    this.actor = actor;
    this.status = null;
    this.finishDelay = 1;
    this.height = this.grid.length;
   }
  get player(){
    this.player = this.actor.find(player => player.type === 'player');
  }
  get width(){
    let max;
    if(this.grid.length === 0) {
      max = 0;
    } else {
      max = this.grid[0].length;
      for(let w in this.grid){
        if(w.length > max){
          max = w.length;
        }
      }
    }
    return max;
  }
  get actors() {
    //this.actor.filter(e => (e instanceof Actor) && (e.prototype.type = 'actor'));
    this.actor.filter(e => e.type === 'player' || e.type === 'coin' || e.type === 'fireball' || e.type === 'actor');
  }
  isFinished(){
    return (this.status !== null && this.finishDelay < 0) ? true : false;
  }
  actorAt(travelActor){
    if(!(travelActor instanceof Actor) || !travelActor){
      throw new Error('Объект не пренадлежит типу Actor или не определён');
    }
    if(this.actor === undefined) return undefined;
    if(this.actor.length = 1) return undefined;
    return this.actor.find(act => act.isIntersect(travelActor));
  }
  obstacleAt(posVector, sizeVector){
    if(!(posVector instanceof Vector && sizeVector instanceof Vector)) {
      throw new Error('Можно использовать только вектор типа Vector');
    }
    let left = Math.floor(posVector.x);
    let right = Math.ceil(posVector.x + sizeVector.x);
    let top =  Math.floor(posVector.y);
    let bottom = Math.ceil(posVector.y + sizeVector.y);

    for(let i = top; i < bottom; i++){
      for(let j = left; j < right; j++){
        if(this.grid[i][j] !== undefined){
         return this.grid[i][j];
        }
      }
    }

    if(left < 0) return 'wall';
    if(right > this.width) return 'wall';
    if(top > this.height) return 'wall';
    if(bottom < 0) return 'lava';
  }
  removeActor(travelActor){
    let who = this.actor.findIndex(who => who === travelActor);
    return  this.actor.splice(who, 1);
  }
  noMoreActors(type){
    return this.actor.findIndex(types => types.type === type) ? true : false;
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

class LevelParser {
  constructor(obj) {
    this.obj = obj || undefined;
    this.key = Object.keys(obj);
  }

  actorFromSymbol(n) {
    if(!this.obj) return undefined;
    n = typeof n === 'string' ? n : undefined;
    let name = this.key.find(name => name === n);
    return this.obj[name] ? this.obj[name] : undefined;
  }

  obstacleFromSymbol(n) {
    n = typeof n === 'string' ? n : '';
    switch(n) {
      case 'x' :
        return 'wall';
      case '!' :
        return 'lava';
      default : undefined;
    }
  }

  createGrid(arr) {
    const line = [];
    for(let i = 0; i < arr; i++) {
      let cell = arr[i];
      const cells = [];
      for(let n = 0; n < cell.length; n++) {
        cells.push(this.obstacleFromSymbol(cell[n]));
      }
      line.push(cells);
    }
    return line;
  }

  createActors(arr) {
    return;
  }

  parse(arr) {
    return new Level();
  }
}

class Fireball extends Actor {
  constructor(pos = new Vector(), speed = new Vector()) {
    this.pos = pos;
    this.speed = speed;
    this.type = 'fireball';
    this.size = new Vector(1, 1);
  }

  getNextPosition(time = 1) {
    time = typeof time === 'number' ? time : 1;
    let newX = this.pos.x + (this.speed.x * time);
    let newY = this.pos.y + (this.speed.y * time);
    return new Vector(newX, newY);
  }

  handleObstacle() {
    this.speed.x = ~this.speed.x + 1;
    this.speed.y = ~this.speed.y + 1;
  }


}
