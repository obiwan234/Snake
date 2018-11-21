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
	canvas=createCanvas(0.98*windowWidth,0.98*windowHeight);
	angleMode(DEGREES);
	again=createButton("Start Game");
	again.position(width/2-15,height/2+30);
	again.mousePressed(initializeVars);
}

function initializeVars() {
	apple=new cell(random(20,width-20),random(20,height-20),round(random(10,15)),color(180,24,2));
	snake=[];
	length=10;
	snake.splice(0,0,new cell(width/2,height-10,blobSize,color(24,180,2)));
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
			length+=apple.r;
			wait-=.05;
			apple=new cell(random(20,width-20),random(20,height-20),round(random(10,15)),color(180,24,2));
		}
		if(snake.length>=4&&isOut()) {//first condition make sure not first coming out
			loseGame();
			lost=true;
			//display game over
		}
		if(lost) {
			fill(255);
			textSize(60);
			text("You Lost!",width/2-100,height/2-100);
		}
		if(quit) {
			fill(255);
			textSize(60);
			text("You Quit!",width/2-100,height/2-100);
		}
		if(pause) {
			fill(255);
			textSize(60);
			text("Game Paused",width/2-180,height/2-100);
		}
		fill(255);
		textSize(20);
		if(lost||quit||pause) {
			textSize(25);
			text("Score: "+length,width/2-20,height/2-50);
		} else {
			text("Score: "+length,10,30);
		}
	} else if(instr) {
		fill(255);
		textSize(70);
		text("Snake!",width/2-85,height/2-170);
		textSize(25);
		text("Use side arrows to steer snake.",width/2-160,height/2-120);
		text("Eat apples to grow and increase score.",width/2-200,height/2-80);
		text("Press 'P' to pause; 'Q' to quit.",width/2-150,height/2-40);
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
