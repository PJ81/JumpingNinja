
class Player {
    constructor(callback) {
        this.state = State.GROUND;
        this.gravity = 30;
        this.jumpPower = 0;
        this.increaseJump = false;

        this.setState = (s) => {
            if(s === State.STOP) {
                this.state = s;
                return;
            }
            this.state = this.state === State.JUMP ? this.state : s;
        }

        Promise.all([
            (loadImage("./img/hero.png")).then((i) => {this.img = i;})
        ]).then(() => {
            this.reset();
            callback();
        });
    }

    reset() {
        this.x = (WIDTH >> 3);
        this.wid = this.img.width;
        this.hei = this.img.height;
        this.y = -this.hei;
        this.jumpPower = 1000;
        this.state = State.ENTER;
    }

    update(dt) {
        switch(this.state) {
            case State.JUMP:
                this.y -= 60 * this.jumpPower * dt;
                this.jumpPower -= this.gravity * dt;
                if(this.y > HEIGHT) {
                    this.state = State.DEAD;
                }
            break;
            case State.ENTER:
                this.y += dt * this.jumpPower;
                this.jumpPower += dt * 350;
                if(this.y >= HEIGHT - (HEIGHT >> 1) - this.hei) {
                    this.y = HEIGHT - (HEIGHT >> 1) - this.hei;
                    this.jumpPower = 0;
                    this.state = State.GROUND;
                }
            break;
            case State.FALLING:
                this.y -= 60 * this.jumpPower * dt;
                this.jumpPower -= this.gravity * dt;
                if(this.y > HEIGHT) {
                    this.state = State.DEAD;
                }
            break;
            case State.PREPARE:
                this.jumpPower += .2;
                if(this.jumpPower > 20) this.jumpPower = 20;
            break;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y);
        if(this.state === State.PREPARE) {
            ctx.fillStyle = "red";
            const jh = this.jumpPower * 3;
            ctx.fillRect(this.x - 10, this.y + this.img.height - jh, 6, jh);
        }
    }

    checkCollision(poles) {
        function collided(a, b) {
            return !(((a.b < b.t) || (a.t > b.b) || (a.r < b.l) || (a.l > b.r)));
        }

        const btm = this.y + this.hei;
        const pl = {
            l:this.x, t:this.y, 
            r:this.x + this.wid - 3,
            b:btm
        }, po = {l:0, t:0, r:0, b:0};

        for(let r = 0; r < poles.length; r++) {
            po.l = poles[r].x - 3; po.t = poles[r].y - 3;
            po.r = this.wid + poles[r].x; po.b = HEIGHT;

            if(collided(pl, po)) {
                const foot = pl.t + this.hei;
                if(foot - po.t < 10) {
                    this.jumpPower = 0;
                    this.y = po.t - this.hei + 3;
                    this.state = State.GROUND;
                } else {
                    this.x = po.l - this.wid;
                    this.state = State.FALLING;
                }
            }
        }
    }
}