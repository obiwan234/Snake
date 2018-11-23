//when shrink, instead of change canvas, mark good areas of canvas and use white rects; if snake in good area take raincheck
const blobSize=8;
let snake;
let length;
let angle;
let incrAngle;
let again;
let spacing=8;
let pause;
let direction;
let apple;
let lost;
let quit;
let wait;
let instr=true;
let canvas;
let numApples;

function cell(x,y,r,color) {
	this.x=x;
	this.y=y;
	this.r=r;
	this.color=color;
	this.display=function() {
		fill(this.color);
		ellipse(this.x,this.y,this.r*2,this.r*2);
	}
	this.intersect=function(other) {
		return Math.sqrt(Math.pow(other.x-this.x,2)+Math.pow(other.y-this.y,2))<other.r+this.r;
	}
}

function setup() {
	canvas=createCanvas(windowWidth,windowHeight);
	canvas.position((windowWidth-width)/2,(windowHeight-height)/2);
	angleMode(DEGREES);
	again=createButton("Start Game");
	again.position(0.5*windowWidth-66,0.6*windowHeight);
	again.size(136,30);
	again.mousePressed(initializeVars);
}

function initializeVars() {
	canvas.size(windowWidth,windowHeight);
	canvas.position((windowWidth-width)/2,(windowHeight-height)/2);
	apple=new cell(random(0.0106*width,0.9894*width),random(0.0216*height,0.9784*height),round(random(10,15)),color(180,24,2));
	snake=[];
	length=10;
	snake.splice(0,0,new cell(0.5*width,height-10,blobSize,color(24,180,2)));
	angle=270;
	incrAngle=0;
	wait=4;
	pause=false;
	quit=false;
	lost=false;
	instr=false;
	direction=0;
	noCursor();
	again.html("Play Again?");
	again.hide();
	numApples=0;
}

function draw() {
	background(0);
	if(snake&&snake[0]&&!instr) {//game started
		let head=snake[0];
		if(frameCount%round(wait)==0&&!pause&&!lost&&!quit) {
			if(snake.length>=length) {
				snake.pop();
			}
			snake.splice(0,0,new cell(head.x+spacing*cos(angle),head.y+spacing*sin(angle),blobSize,color(24,180,2)));
		}
		for(let blob of snake) {
			blob.display();
		}
			apple.display();
		if(direction&&!pause&&!lost&&!quit) {
			incrAngle+=direction*.01;
			incrAngle=direction*max(abs(incrAngle),5);
			angle+=incrAngle;
		}
		//check for game mechanics ie lose and apple
		if(snake[0].intersect(apple)) {
			numApples++;
			if(numApples%6==0) {
				canvas.size(0.85*width,0.85*height);
				canvas.position((windowWidth-width)/2,(windowHeight-height)/2);
			}
			let x=random(0.0106*width,0.9894*width);
			let y=random(0.0216*height,0.9784*height);
			if(numApples%6==4) {
				let x=random(0.0106*width,0.89*width);
				let y=random(0.0216*height,0.89*height);
			}
			length+=apple.r;
			wait-=.05;
			apple=new cell(x,y,round(random(10,15)),color(180,24,2));
		}
		if(snake.length>=4&&isOut()) {//first condition make sure not first coming out
			loseGame();
			lost=true;
			pause=false;
			//display game over
		}
		if(lost) {
			fill(255);
			textSize(0.0319*width);
			text("You Lost!",0.44*width,0.392*height);
		}
		if(quit) {
			fill(255);
			textSize(0.0319*width);
			text("You Quit!",0.44*width,0.392*height);
		}
		if(pause) {
			fill(255);
			textSize(0.0319*width);
			text("Game Paused",0.395*width,0.392*height);
		}
		fill(255);
		if(lost||quit||pause) {
			textSize(0.0133*width);
			text("Score: "+length,0.475*width,0.446*height);
		} else {
			textSize(0.0106*width);
			text("Score: "+length,0.005*width,0.032*height);
		}
	} else if(instr) {
		fill(255);
		textSize(0.0372*width);
		text("Snake!",0.447*width,0.316*height);
		textSize(0.0123*width);
		text("Use side arrows to steer snake.",0.415*width,0.39*height);
		text("Eat apples to grow and increase score.",0.394*width,0.433*height);
		text("Press 'P' to pause; 'Q' to quit.",0.42*width,0.477*height);
	}
}

function keyPressed() {
	if(keyCode==RIGHT_ARROW||key=='D') {
		direction=1;
	}
	if(keyCode==LEFT_ARROW||key=='A') {
		direction=-1;
	}
	if(key=="Q") {
		loseGame();
		quit=true;
		pause=false;
	}
	if(key=="P"&&!quit) {
		pause=!pause;
	}
}

function keyReleased() {
	if(keyCode==RIGHT_ARROW||key=='D'||keyCode==LEFT_ARROW||key=='A') {
		direction=0;
		incrAngle=0;
	}
}

function isOut() {
	let head=snake[0];
	if(head.x-head.r<=0||head.x+head.r>=width||head.y-head.r<=0||head.y+head.r>=height) {//hit side
		return true;
	}
	for(let i=3; i<snake.length; i++) {
		if(head.intersect(snake[i])) {
			return true;
		}
	}
	return false;
}

function loseGame() {
	cursor();
	again.show();
}
