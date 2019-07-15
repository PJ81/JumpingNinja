
const WIDTH = 480, HEIGHT = 700;
const State = {ENTER: 0, GROUND: 1, PREPARE: 2, JUMP: 3, DEAD: 4, 
               MENU: 5, PLAY: 6, WAIT: 7, FALLING: 8};

class Game {
	constructor() {
		let canvas = document.createElement('canvas');
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		document.body.appendChild(canvas);
		this.ctx = canvas.getContext('2d');
        this.lastTime = 0;
        this.deltaTime = 1 / 60;
        this.accumulator = 0;
        this.state = State.MENU;
        this.menu = new Menu();


        this.counter = 0;
        this.loadedDone = () => {
            if(++this.counter > 1) {
                this.loop(0);
            }
        }

        this.player = new Player(this.loadedDone);
        this.background = new Background(this.loadedDone);
    
		canvas.addEventListener("mousedown", () => {
            if(this.state === State.PLAY) {
                this.player.setState(State.PREPARE);
            }
        });
        
        canvas.addEventListener("mouseup", () => {
            switch(this.state) {
                case State.PLAY:
                    this.player.setState(State.JUMP);
                break;
                case State.MENU:
                    this.menu.reset();
                    this.player.reset();
                    this.background.reset();
                    this.state = State.PLAY;
                break; 
            }
		});

		this.loop = (time) => {
			this.accumulator += (time - this.lastTime) / 1000;
			while(this.accumulator > this.deltaTime) {
                this.accumulator -= this.deltaTime;
                this.moveFrame();
            }
            this.draw();
			this.lastTime = time;
			requestAnimationFrame(this.loop);
        }
    }

    moveFrame() {
        switch(this.state) {
            case State.MENU:
                this.background.update(this.deltaTime, this.player.state === State.JUMP);
            break;
            case State.PLAY:
                this.player.update(this.deltaTime);
                this.background.update(this.deltaTime, this.player.state === State.JUMP);
                if(this.player.state === State.JUMP) {
                    const poles = this.background.poles.filter(p => p.x > 0 && p.x < WIDTH);
                    this.player.checkCollision(poles);
                } else if(this.player.state === State.DEAD) {
                    this.waitTime = .7;
                    this.state = State.WAIT;
                }
            break;
            case State.WAIT:
                this.background.update(this.deltaTime, this.player.state === State.JUMP);
                this.waitTime -= this.deltaTime;
                this.menu.update(this.deltaTime);
                if(this.waitTime < 0) {
                    this.state = State.MENU;
                }
            break;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        switch(this.state) {
            case State.MENU:
                this.background.draw(this.ctx);
                this.background.drwaWaves(this.ctx);
                this.menu.draw(this.ctx);
            break;
            case State.PLAY:
                this.background.draw(this.ctx);
                this.player.draw(this.ctx);
                this.background.drwaWaves(this.ctx);
            break;
            case State.WAIT:
                this.background.draw(this.ctx);
                this.background.drwaWaves(this.ctx);
                this.menu.draw(this.ctx);
            break;
        }
    }
}