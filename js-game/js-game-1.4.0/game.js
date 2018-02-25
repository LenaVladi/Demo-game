'use strict';
class Vector {
  constructor(x = 0, y = 0){
    this.x = x;
    this.y = y;
  }

  plus(objVector){
    try {
      if(typeof objVector !== 'object'){
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
