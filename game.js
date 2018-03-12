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
    this.actors = actor;
    this.status = null;
    this.finishDelay = 1;
    this.height = this.grid.length;
   }
  get player(){
    this.player = this.actors.find(player => player.type === 'player');
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
  isFinished(){
    return (this.status !== null && this.finishDelay < 0) ? true : false;
  }
  actorAt(travelActor){
    if(!(travelActor instanceof Actor) || !travelActor){
      throw new Error('Объект не пренадлежит типу Actor или не определён');
    }
    if(this.actors === undefined) return undefined;
    if(this.actors.length = 1) return undefined;
    return this.actors.find(act => act.isIntersect(travelActor));
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
        return this.grid[i][j];
      }
    }

    if(left < 0 || top < 0) return 'wall';
    if(right > this.width) return 'wall';
    if(bottom < 0) return 'lava';
  }
  removeActor(travelActor){
    let who = this.actors.findIndex(who => who.pos.x === travelActor.pos.x && who.pos.y === travelActor.pos.y);
    let deletes = this.actors.splice(who, 1);
    return this.actors;
  }
  noMoreActors(type){
    if(!this.actors) return true;
    return this.actors.findIndex(types => types.type === type) ? false : true;
  }
  playerTouched(type, travelActor){
    if(type === 'lava' || 'fireball'){
      this.status = 'lost';
    }
    if(type === 'coin' && travelActor.type === 'coin'){
      let coin = this.actors.findIndex(coin => coin.pos.x === travelActor.pos.x);
      this.actors.splice(coin, 1);
      if(!(this.actors.find(coin => coin.type === 'coin'))){
        this.status = 'won';
      }
    }
  }
}

class LevelParser {
  constructor(obj) {
    this.obj = obj;
  }

  actorFromSymbol(n) {
    if(!n) return undefined;
    const key = Object.keys(this.obj);
    //n = typeof n === 'string' ? n : undefined;
    let name = key.find(name => name === n);
    return this.obj[name] ? this.obj[name] : undefined;
  }

  obstacleFromSymbol(n) {
    //n = typeof n === 'string' ? n : undefined;
    if(n === 'x') return 'wall';
    if(n === '!') return 'lava';
    else return undefined;
  }

  createGrid(arr) {
    if(arr.length === 0) return [];
    const line = [];
    for(let i = 0; i < arr.length; i++) {
      let cell = arr[i];
      const cells = [];
      for(let n = 0; n < cell.length; n++) {
        cells.push(this.obstacleFromSymbol(cell[n]));
      }
      line.push(cells);
    }
    return line;
  }

  createActors(plan) {
    if(plan.length === 0) return [];
    let posX, posY;
    const movingObj = [];
    for(let i = 0; i < plan.length; i++) {
       posY = i;
       let str = plan[i];
       for(let n = 0; n < str.length; n++) {
         posX = n;
         let cnstrct = this.obj[str[n]];
         const essens = cnstrct(posX, posY);
         movingObj.push(essens);
       }
    }
    return movingObj;
  }

  parse(plan) {
    return new Level();
  }
}

class Fireball extends Actor {
  constructor(pos = new Vector(), speed = new Vector()) {
    this.pos = pos;
    this.speed = speed;
    this.size = new Vector(1, 1);
    Object.defineProperty(this, 'type', {
    value: 'fireball',
    writable: false,
  });
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

  act(time, obj) {
    // Получить следующую позицию, используя время.
    // Выяснить, не пересечется ли в следующей позиции объект с каким-либо препятствием. Пересечения с другими движущимися объектами учитывать не нужно.
    // Если нет, обновить текущую позицию объекта.
    // Если объект пересекается с препятствием, то необходимо обработать это событие. При этом текущее положение остается прежним.
  }

}

class HorizontalFireball {
  constructor(pos = new Vector(1,1)) {
    this.pos = pos;
  }
}

class FireRain {
  constructor(pos = new Vector(1,1)) {
    this.pos = pos;
  }
}

class Coin extends Actor {
  constructor(pos = new Vector(0.6, 0.6)) {
    this.x = pos.x - 0.2;
    this.y = pos.y - 0.1;
    this.type = 'coin';
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Mach.random();
  }
}
