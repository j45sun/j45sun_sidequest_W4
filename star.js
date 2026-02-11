class Star {
  constructor({ x, y, r }) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.angle = 0;
  }

  update() {
    this.angle += 0.05;
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(255, 183, 3);
    beginShape();
    for (let i = 0; i < 5; i++) {
      let a = (i * TWO_PI) / 5;
      vertex(cos(a) * this.r, sin(a) * this.r);
      vertex(
        cos(a + PI / 5) * (this.r * 0.5),
        sin(a + PI / 5) * (this.r * 0.5),
      );
    }
    endShape(CLOSE);
    pop();
  }

  isCollectedBy(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < this.r + player.r;
  }
}
