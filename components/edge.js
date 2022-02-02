class Edge {
    constructor({id, from, to, length=1} = {}) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.length = length;
    }
  }