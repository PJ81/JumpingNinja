

class Menu {
    constructor() {
        this.alpha = .7;
        this.img = new Image();
        const can = document.createElement("canvas");
        can.width = WIDTH;
        can.height = HEIGHT;
        const ctx = can.getContext("2d");
        
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        this.img.src = can.toDataURL();

        this.reset = () => this.alpha = 0;
    }

    update(dt) {
        this.alpha += dt;
        if(this.alpha > .7) this.alpha = .7;
    }

    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.img, 0, 0);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ddd";
		ctx.textAlign = "center";
		ctx.font = "40px Revalia"; 
		ctx.fillText("CLICK TO", WIDTH >> 1, HEIGHT * .35);
		ctx.fillText("PLAY", WIDTH >> 1, HEIGHT * .45);
    }
}