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
