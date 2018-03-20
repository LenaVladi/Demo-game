'use strict';
class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  plus(objVector) {
    if(!(objVector instanceof Vector)) {
        throw new Error('Можно прибавлять к вектору только вектор типа Vector.');
    }
    return new Vector(objVector.x + this.x, objVector.y + this.y);
  }

  times(num) {
    return new Vector(num * this.x, num * this.y);
  }
}

class Actor {
  constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    if(!(pos instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)) {
      throw new Error('Можно использовать только вектор типа Vector.');
    }
      this.pos = pos;
      this.size = size;
      this.speed = speed;
  }

  act() {

  }

  get type() {
    return 'actor';
  }

  get left() {
    return this.pos.x;
  }

  get top() {
    return this.pos.y;
  }

  get right() {
    return this.pos.x + this.size.x;
  }

  get bottom() {
    return this.pos.y + this.size.y;
  }

  isIntersect(travelActor) {
    if(!(travelActor instanceof Actor) || !travelActor) {
      throw new Error('Объект не пренадлежит типу Actor или не передано аргументов');
    }
      if(travelActor === this) {
        return false;
      }
    return (travelActor.left >= this.right || travelActor.right <= this.left || travelActor.top >= this.bottom || travelActor.bottom <= this.top) ? false : true;
  }
}

class Level {
  constructor(grid = [], actors = []) {
    this.grid = grid;
    this.actors = actors;
    this.status = null;
    this.finishDelay = 1;
    this.player = this.actors.find(player => player.type === 'player');
  }

  get height() {
    return this.grid.length;
  }

  get width() {
    if(this.grid.length === 0) return 0;
    let max = this.grid.map(el => { return el.length;});
    return Math.max(...max);
  }

  isFinished() {
    return (this.status !== null && this.finishDelay < 0) ? true : false;
  }

  actorAt(travelActor) {
    if(!(travelActor instanceof Actor) || !travelActor) {
      throw new Error('Объект не пренадлежит типу Actor или не определён');
    }
    return this.actors.find(act => act.isIntersect(travelActor));
  }

  obstacleAt(posVector, sizeVector) {
    if(!(posVector instanceof Vector && sizeVector instanceof Vector)) {
      throw new Error('Можно использовать только вектор типа Vector');
    }
    let left = Math.floor(posVector.x);
    let right = Math.ceil(posVector.x + sizeVector.x);
    let top =  Math.round(posVector.y);
    let bottom = Math.ceil(posVector.y + sizeVector.y);

    if(left < 0 || top < 0) return 'wall';
    if(right > this.width) return 'wall';
    if(bottom > this.height) return 'lava';

    for(let i = top; i < bottom; i++) {
      for(let j = left; j < right; j++) {
        if(this.grid[i][j] !== undefined) {
          return this.grid[i][j];
        }
      }
    }
  }

  removeActor(travelActor) {
    let who = this.actors.findIndex(who => who.left === travelActor.left && who.top === travelActor.top);
    let deletes = this.actors.splice(who, 1);
    return this.actors;
  }

  noMoreActors(type) {
    if(this.actors.length === 0) return true;
    return this.actors.find(types => types.type === type) ? false : true;
  }

  playerTouched(type, travelActor) {
    if(type == 'lava' || type == 'fireball') {
      this.status = 'lost';
    }
    if(type === 'coin' && travelActor.type === 'coin') {
      this.removeActor(travelActor);
      if((this.noMoreActors(travelActor))) {
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
    return this.obj[n] ? this.obj[n] : undefined;
  }

  obstacleFromSymbol(n) {
    if(n === 'x') return 'wall';
    if(n === '!') return 'lava';
    else return undefined;
  }

  createGrid(arr) {
    if(arr.length === 0) return [];

    return arr.map(cell => {
      let cells = [];
      for(let sumb of cell.split('')) {
        cells.push(this.obstacleFromSymbol(sumb));
      }
      return cells;
    });
  }

  createActors(plan) {
    if(!plan) return [];
    if(!this.obj) return [];

    let posX, posY, countMouvingObj = 0;
    const movingsObj = [];
    for(let i = 0; i < plan.length; i++) {
       posY = i;
       let str = plan[i];
       for(let n = 0; n < str.length; n++) {
         posX = n;
         let testClass = this.actorFromSymbol(str[n])
         if(typeof testClass === 'function') {
           let newMovingObj = new testClass(new Vector(posX, posY));
           if(newMovingObj instanceof Actor) {
             movingsObj.push(newMovingObj);
           }
           countMouvingObj++;
         }
       }
    }
    return movingsObj;
  }

  parse(plan) {
    const grid = this.createGrid(plan);
    const actors = this.createActors(plan);
    return new Level(grid, actors);
  }
}

class Fireball extends Actor {
  constructor(pos = new Vector(), speed = new Vector()) {
    super();
    this.pos = pos;
    this.speed = speed;
    this.size = new Vector(1, 1);
  }

  get type() {
    return 'fireball';
  }

  getNextPosition(time = 1) {
    let speed = this.speed.times(time);
    let pos = this.pos.plus(speed);
    return new Vector(pos.x, pos.y);
    // let newX = this.pos.x + (this.speed.x * time);
    // let newY = this.pos.y + (this.speed.y * time);
    //return new Vector(newX, newY);
  }

  handleObstacle() {
    this.speed = this.speed.times(-1);
    return this.speed;
    // this.speed.x = -1 * this.speed.x;
    // this.speed.y = -1 * this.speed.y;
  }

  act(time, obj) {
    let newPos = this.getNextPosition(time);
    let test = obj.obstacleAt(newPos, this.size);
    if(test === 'wall' || test === 'lava') return  this.handleObstacle();
    return this.pos = newPos;
  }
}

class HorizontalFireball extends Fireball {
  constructor(pos = new Vector(1, 1)) {
    super();
    this.pos = pos;
    this.speed = new Vector(2, 0);
  }
}

class VerticalFireball extends Fireball {
  constructor(pos = new Vector(1,1)) {
    super();
    this.startPos = pos;
    this.pos = pos;
    this.speed = new Vector(0, 2);
  }
}

class FireRain extends Fireball {
  constructor(pos = new Vector(1, 1)) {
    super();
    this.pos = pos;
    this.startPos = new Vector(this.pos.x, this.pos.y);
    this.speed = new Vector(0, 3);
  }

  handleObstacle() {
    this.pos = this.startPos;
  }
}

class Coin extends Actor {
  constructor(pos = new Vector()) {
    super();
    this.size = new Vector(0.6, 0.6);
    this.pos = new Vector(pos.x + 0.2, pos.y + 0.1);
    this.startPos = new Vector(this.pos.x, this.pos.y);
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random() * (Math.PI * 2 * this.size.x);
  }

  get type() {
    return 'coin';
  }

  updateSpring(time = 1) {
    this.spring = this.spring + (time * this.springSpeed);
  }

  getSpringVector() {
    return new Vector(0, (Math.sin(this.spring) * this.springDist));
  }

  getNextPosition(time = 1) {
    this.updateSpring(time);
    let newY = this.startPos.y + this.getSpringVector().y;
    return new Vector(this.startPos.x, newY);
  }

  act(time) {
    this.pos = this.getNextPosition(time);
  }
}

class Player extends Actor {
  constructor(pos = new Vector()) {
    super();
    this.pos = new Vector(pos.x, pos.y + (-0.5));
    this.size = new Vector(0.8, 1.5);
    this.speed = new Vector(0, 0);
  }

  get type() {
    return 'player';
  }
}

// start game

const actorDict = {
  '@': Player,
  '=': HorizontalFireball,
  'v': FireRain,
  'o': Coin,
  '|': VerticalFireball,
}

loadLevels().then(schemas => {
    const parser = new LevelParser(actorDict);
    runGame(JSON.parse(schemas), parser, DOMDisplay).then(() => alert('Вы выиграли приз!'));
  })
