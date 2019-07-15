
class Background {
    constructor(callback) {
        this.cloud = new Array(5);
        this.tree = new Array(3);
        this.waves = new Array(3);
        this.tops = new Array(4);

        Promise.all([
            (loadImage("./img/cloud0.png")).then((i) => {this.cloud[0] = i;}),
            (loadImage("./img/cloud1.png")).then((i) => {this.cloud[1] = i;}),
            (loadImage("./img/cloud2.png")).then((i) => {this.cloud[2] = i;}),
            (loadImage("./img/cloud3.png")).then((i) => {this.cloud[3] = i;}),
            (loadImage("./img/cloud4.png")).then((i) => {this.cloud[4] = i;}),
            (loadImage("./img/tree0.png")).then((i) => {this.tree[0] = i;}),
            (loadImage("./img/tree1.png")).then((i) => {this.tree[1] = i;}),
            (loadImage("./img/tree2.png")).then((i) => {this.tree[2] = i;}),
            (loadImage("./img/wave0.png")).then((i) => {this.waves[0] = i;}),
            (loadImage("./img/wave1.png")).then((i) => {this.waves[1] = i;}),
            (loadImage("./img/wave2.png")).then((i) => {this.waves[2] = i;}),
            (loadImage("./img/top0.png")).then((i) => {this.tops[0] = i;}),
            (loadImage("./img/top1.png")).then((i) => {this.tops[1] = i;}),
            (loadImage("./img/top2.png")).then((i) => {this.tops[2] = i;}),
            (loadImage("./img/top3.png")).then((i) => {this.tops[3] = i;}),
            (loadImage("./img/pole.png")).then((i) => {this.pole = i;}),
            (loadImage("./img/grass.png")).then((i) => {this.grass = i;}),
            (loadImage("./img/mountains.png")).then((i) => {this.mountains = i;})
        ]).then(() => {
            this.build();
            this.reset();

            callback();
        });
    }

    reset() {
        this.poles = [];
        this.clouds = [];
        this.trees = [];

        this.clouds.push({x:Math.random() * (WIDTH >> 1), y:Math.random() * 100 + 20, s:Math.floor(Math.random() * 5), v:Math.random() * 5 + 1});
        for(let t = 0; t < 5; t++) {
            this.createOneCloud();
        }

        this.poles.push({x:WIDTH >> 3, y:HEIGHT - (HEIGHT >> 1), t:Math.floor(Math.random() * 4)});
        for(let p = 0; p < 6; p++) {
            this.createOnePole();
        }

        this.trees.push({x:Math.random() * (WIDTH >> 1), s:Math.floor(Math.random() * 3)});
        for(let t = 0; t < 16; t++) {
            this.createOneTree();
        }
    }

    createOneCloud() {
        const st = this.clouds[this.clouds.length - 1].x + 150 * (Math.floor(Math.random() * 2) + 1);
        this.clouds.push({x:st, y:Math.random() * 81 + 20, 
                          s:Math.floor(Math.random() * 5)});
    }

    createOnePole() {
        const p = this.poles[this.poles.length - 1],
              st = p.x + 150 * (Math.floor(Math.random() * 2) + 1);
        let h = p.y;

        if(Math.random() > .5) h = p.y;
        else h = Math.random() < .5 ? h - 50 : h + 50;

        if(h < 250 || h > 520) h = HEIGHT - (HEIGHT >> 1);

        this.poles.push({x:st, y:h, t:Math.floor(Math.random() * 4)});
    }

    createOneTree() {
        let st = this.trees[this.trees.length - 1].x;
        switch(Math.floor(Math.random() * 6)) {
            case 0: st += 200; break;
            case 1: st += 250; break;
            case 2: st += 120; break;
            case 3: st +=  70; break;
            case 4: st +=  30; break;
            case 5: st += 220; break;
        }
        this.trees.push({x:st, s:Math.floor(Math.random() * 3)});
    }

    build() {
        this.mountains._x = -60;

        const w0 = document.createElement("canvas"),
              w1 = document.createElement("canvas"),
              w2 = document.createElement("canvas"),
              gr = document.createElement("canvas");
    
        gr.width = Math.ceil(WIDTH / this.grass.width) * this.grass.width;
        gr.height = this.grass.height;
        w0.width = w1.width = w2.width = (Math.ceil(WIDTH / this.waves[0].width) + 2) * this.waves[0].width;
        w0.height = w1.height = w2.height = this.waves[0].height;

        const wave0 = w0.getContext("2d"),
              wave1 = w1.getContext("2d"),
              wave2 = w2.getContext("2d"),
              gra   = gr.getContext("2d");

        for(let x = 0; x < gr.width; x += this.grass.width) {
            gra.drawImage(this.grass, x, 0);
        }

        this.grass = new Image();
        this.grass.src = gr.toDataURL();

        for (let x = 0; x < w0.width; x += this.waves[0].width) {
            wave0.drawImage(this.waves[0], x, 0);
            wave1.drawImage(this.waves[1], x, 0);
            wave2.drawImage(this.waves[2], x, 0);
        }
        this.waves = null;
        this.waves = [
            {
                img: new Image(),
                a: 0.1,
                pos: {
                    x:-70, y:610
                }
            },
            {
                img: new Image(),
                a: 1.6,
                pos: {
                    x:-40, y:630
                }
            },
            {
                img: new Image(),
                a: 2.7,
                pos: {
                    x:-10, y:660
                }
            }
        ];
        this.waves[0].img.src = w0.toDataURL(); 
        this.waves[1].img.src = w1.toDataURL(); 
        this.waves[2].img.src = w2.toDataURL();
    }

    update(dt, pj) {
        for(let c = 0; c < 3; c++) {
            let w = this.waves[c];
            w.pos.x += Math.cos(w.a) / 15;
            w.pos.y += Math.sin(w.a) / 10;
            w.a += dt;
            this.waves[c] = w;
        }

        dt *= pj ? 20 : 1;

        for(let c = this.clouds.length - 1; c > -1; c--) {
            let cl = this.clouds[c];
            cl.x -= ((10 - cl.s) * .5) * dt * 3;
            if(cl.x < -this.cloud[cl.s].width) {
                this.clouds.splice(c, 1);
                this.createOneCloud();
            } else {
                this.clouds[c] = cl;
            }
        }

        if(!pj) return;

        for(let p = this.poles.length - 1; p > -1; p--) {
            this.poles[p].x -= 30 * dt;
            if(this.poles[p].x < -this.pole.width) {
                this.poles.splice(p, 1);
                this.createOnePole();
            }
        }

        for(let t = this.trees.length - 1; t > -1; t--) {
            let tr = this.trees[t];
            tr.x -= 20 * dt;
            if(tr.x < -this.tree[tr.s].width) {
                this.trees.splice(t, 1);
                this.createOneTree();
            } else {
                this.trees[t] = tr;
            }
        }

        this.mountains._x -= 10 * dt;
    }

    draw(ctx) {
        // layer 0 --- grass not moving
        ctx.drawImage(this.grass, 0, 530);

        // layer 1 --- mountains
        ctx.drawImage(this.mountains, this.mountains._x, 310);
        if(this.mountains._x < -(this.mountains.width - WIDTH - 60)) {
            let nx = this.mountains._x + this.mountains.width - 60;
            ctx.drawImage(this.mountains, nx, 310);
            if(nx < 0) this.mountains._x = nx;
        }

        for(let c = this.clouds.length - 1; c > -1; c--) {
            let cl = this.clouds[c];
            if(cl.x > WIDTH + 10) continue;
            ctx.drawImage(this.cloud[cl.s], cl.x, cl.y);
        }

        // layer 2 --- trees
        for(let t = this.trees.length - 1; t > -1; t--) {
            let tr = this.trees[t];
            if(tr.x > WIDTH + 10) continue;
            ctx.drawImage(this.tree[tr.s], tr.x, 530 - this.tree[tr.s].height);
        }
        
        // layer 3 --- waves back
        ctx.drawImage(this.waves[0].img, this.waves[0].pos.x, this.waves[0].pos.y);


        
    }

    drwaWaves(ctx) {
        // layer 4 --- poles
        for(let p = this.poles.length - 1; p > -1; p--) {
            let pl = this.poles[p];
            if(pl.x > WIDTH + 10) continue;
            for(let y = pl.y; y < HEIGHT; y += this.pole.height) {
                ctx.drawImage(this.pole, pl.x, y);
            }
            ctx.drawImage(this.tops[pl.t], pl.x - 3, pl.y - 3);
        }

        // layer 5 & 6 --- waves mid and front 
        ctx.drawImage(this.waves[1].img, this.waves[1].pos.x, this.waves[1].pos.y);
        ctx.drawImage(this.waves[2].img, this.waves[2].pos.x, this.waves[2].pos.y);
    }
}