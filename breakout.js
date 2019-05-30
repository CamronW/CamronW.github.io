var canvas = document.querySelector("canvas");
gameWidth = 1000
gameHeight = 500
canvas.width = gameWidth
canvas.height = gameHeight + 200
var c = canvas.getContext("2d")

class Game{
	constructor(){
		//Colours
		this.backgroundColour = "#f4eed7";
		this.level = 1;
		this.money = 0;
		this.clickDamage = 1;
		this.clickDamageCost = 10;
	}
	getMoney(){
		return this.money;
	}
}

class GameBoard{
	constructor(blockWidth, blockHeight){
		this.blockWidth = 13;
		this.blockHeight = 13;
		this.blockPixelGap = 1;
		this.blockPixelWidth = ((gameWidth - this.blockPixelGap * (this.blockWidth + 1)) / this.blockWidth);
		this.blockPixelHeight = ((gameHeight - this.blockPixelGap * (this.blockHeight + 1)) / this.blockHeight);
		this.gameArray = [];
	}

	setupBoardArray(){
		//---Full Board---//
		this.gameArray = []
		for (var i=0; i<this.blockWidth; i++){
			for (var j=0; j<this.blockHeight; j++){
				//Do 80% empty
				if (Math.random() < 0.85){
				var newBlock = new EmptyBlock();
				}
				else{
					var randomHealth = Math.floor(Math.random() * Math.floor(5));
					var newBlock = new NormalBlock(randomHealth + 1);
				}
				this.gameArray.push(newBlock);
			}
		}
}


}

game = new Game();
gameBoard = new GameBoard();

function getMoney(){
	return (game.getMoney()) + "$";
}

function getClickDamageText(){
	return "Click Damage: " + game.clickDamage;
}

function getBuyClickDamageText(){
	return "(+1)" + game.clickDamageCost + "$";
}

function getBuyLevelText(){
	return "Level: " + game.level;
}

function squareClickFunction(){
	console.log("niiice")
}

function buyClickDamage(){
	console.log("trying to buy click damage")
	if (game.money >= game.clickDamageCost){
		game.clickDamage = game.clickDamage + 1;
		game.money -= game.clickDamageCost;
	}
}

class UserInterface{
	constructor(){
		this.elements = [];
	}
	setup(){
		//Bottom outline
		var newButton = new ButtonElement("uiBackground", 0, gameHeight, gameWidth, 200, true, "#c7dbe2", true, "#000", squareClickFunction);
		this.elements.push(newButton);
		var newButton = new ButtonElement("moneyText", 50, 590, 120, 30, true, "#55D400", true, "#000", squareClickFunction, true, "18px Oswald", "white", "right", getMoney);
		this.elements.push(newButton);
		var newButton = new ButtonElement("clickDamageText", 50, 550, 120, 30, true, "#55D400", true, "#000", squareClickFunction, true, "18px Oswald", "white", "right", getClickDamageText);
		this.elements.push(newButton);
		var newButton = new ButtonElement("buyClickDamageButton", 180, 550, 65, 30, true, "#55D400", true, "#000", buyClickDamage, true, "18px Oswald", "white", "right", getBuyClickDamageText);
		this.elements.push(newButton);
		var newButton = new ButtonElement("levelText", 50, 510, 120, 30, true, "#55D400", true, "#000", squareClickFunction, true, "18px Oswald", "white", "right", getBuyLevelText);
		this.elements.push(newButton);

	}
	drawElements(){
		for (i=0; i<this.elements.length; i++){
			let element = this.elements[i];
			if (element instanceof ButtonElement){
				//Draw the rect
				c.beginPath();
				c.fillStyle = element.fillColour;
				c.rect(element.posX, element.posY, element.width, element.height);
				c.strokeStyle = element.strokeColour;
				if (element.useFill){c.fill()}
				if (element.useStroke){c.stroke()};

				//Draw the text
				c.font = element.font;
				c.fillStyle = element.textFillStyle;
				c.textAlign = element.textAlign;
				if (element.useText){
					if(element.textAlign == "right"){
						let textPosX = element.posX + element.width - 5;
						let textPosY = element.posY + (element.height / 1.3);
					c.fillText(element.fillTextChar(), textPosX, textPosY);
					}
				}
			}

			if (element instanceof TextElement){
				c.beginPath()
				//Draw the text
				c.font = element.font;
				c.fillStyle = element.textFillStyle;
				c.textAlign = element.textAlign;
				if (element.useText){
					if(element.textAlign == "right"){
						let textPosX = element.posX;
						let textPosY = element.posY;

					c.fillText(element.fillTextChar(), textPosX, textPosY);
					}

				}
			}
		}
	}

}
ui = new UserInterface();

class ButtonElement{
	constructor(name, posX, posY, width, height, useFill, fillColour, useStroke, strokeColour, runFunction, useText, font, textFillStyle, textAlign, fillTextChar){
		this.name = name;
		this.posX = posX;
		this.posY = posY;
		this.width = width;
		this.height = height;
		this.useFill = useFill;
		this.fillColour = fillColour;
		this.useStroke = useStroke;
		this.strokeColour = strokeColour;
		this.runFunction = runFunction;

		//Text
		this.useText = useText;
		this.font = font;
		this.textFillStyle = textFillStyle;
		this.textAlign = textAlign;
		this.fillTextChar = fillTextChar;
	}
}

class TextElement{
	constructor(name, posX, posY, useText, font, textFillStyle, textAlign, fillTextChar){
		this.name = name;
		this.posX = posX;
		this.posY = posY;

		//Text
		this.useText = useText;
		this.font = font;
		this.textFillStyle = textFillStyle;
		this.textAlign = textAlign;
		this.fillTextChar = fillTextChar;
		console.log(this.posX);
	}
}

class EmptyBlock{
	constructor(){
		this.health = null;
		this.colour = "#f4eed7";
		this.useStroke = false;
	}
}

class NormalBlock {
	constructor(health) {
		this.health = health;
		this.colour = "#00a8ff";
		this.useStroke = true;
	}
}

function NormalBall(circleX, circleY, circleRadius, velX, velY, colour){
	this.circleRadius = circleRadius;
	this.circleX = circleX;
	this.circleY = circleY;
	this.velX = velX;
	this.velY = velY;
	this.colour = colour
	this.damage = 1;
	
	this.draw = function(){
		//Draw circle
		c.beginPath();
		try {
			c.arc(this.circleX, this.circleY, this.circleRadius, 0, Math.PI * 2, false);
		}
		catch (err){
			console.log(err)
			console.log(this.circleX, this.circleY, this.circleRadius, 0, Math.PI * 2, false);
		}
		//c.lineWidth = 10;
		//c.strokeStyle = "black";
		//c.stroke();
		c.fillStyle = this.colour;
		c.fill();
	}

	this.update = function(){
		//Movement
		this.circleX = this.circleX + this.velX;
		this.circleY = this.circleY + this.velY;

		//----Check edges of game----//
		if (this.circleX + this.circleRadius >= gameWidth){
			this.velX = -Math.abs(this.velX)
		}
		if (this.circleX - this.circleRadius < 0){
			this.velX = Math.abs(this.velX)
		}
		if (this.circleY + this.circleRadius >= gameHeight){
			this.velY = -Math.abs(this.velY)
		}
		if (this.circleY - this.circleRadius < 0){
			this.velY = Math.abs(this.velY)
		}

		//----Check bricks----//
		for (i=0; i<gameBoard.blockWidth; i++){
			for (j=0; j<gameBoard.blockHeight; j++){
				arrayLoc = i + j*gameBoard.blockWidth;
				block = gameBoard.gameArray[arrayLoc];
				if (!(block instanceof EmptyBlock)){
					//Circle
					rect1Left = this.circleX - this.circleRadius;
					rect1Right = this.circleX + this.circleRadius;
					rect1Top = this.circleY - this.circleRadius;
					rect1Bottom = this.circleY + this.circleRadius;

					rect2Left = gameBoard.blockPixelGap + (i*(gameBoard.blockPixelWidth)) + i*gameBoard.blockPixelGap;
					rect2Top = (j*gameBoard.blockPixelHeight) + gameBoard.blockPixelGap * (j + 1);
					rect2Right = rect2Left + gameBoard.blockPixelWidth;
					rect2Bottom = rect2Top + gameBoard.blockPixelHeight;
					isTouchingBlock = rectTouchingRect(rect1Left, rect1Right, rect1Top, rect1Bottom, rect2Left, rect2Top, rect2Right, rect2Bottom)
					//console.log(isTouchingBlock)
					//Damage block
					if(isTouchingBlock != null){
						damageBlock(block, this.damage);
					}
					if (isTouchingBlock == "leftTouching"){
						this.velX = Math.abs(this.velX);
						//this.circleX += 2;
					} 
					if (isTouchingBlock == "rightTouching"){
						this.velX = -Math.abs(this.velX);
						//this.circleX -= 2;
					} 
					if (isTouchingBlock == "topTouching"){
						//Positive
						this.velY = Math.abs(this.velY);
						//this.circleY -= 2;
					} 
					if (isTouchingBlock == "bottomTouching"){
						//Negative
						this.velY = -Math.abs(this.velY);
						//this.circleY += 2;
					}

				}
			}
		}
	}
}

class PlayerMouse{
	constructor(){
		this.posX = undefined;
		this.posY = undefined;
	}
}
playerMouse = new PlayerMouse();

function moveHandler(event){
	playerMouse.posX = event.clientX;
	playerMouse.posY = event.clientY;
}

function mouseDownHandler(event){
	if (event.buttons == 1)
		mouseX = event.clientX
		mouseY = event.clientY
		handleLeftClick(mouseX, mouseY)
		
}

function handleLeftClick(posX, posY){
	//console.log("Left click at:", posX, posY);
	//Check if any blocks were clicked on 
	for (i=0; i<gameBoard.blockWidth; i++){
		for (j=0; j<gameBoard.blockHeight; j++){
			arrayLoc = i + j*gameBoard.blockWidth
			block = gameBoard.gameArray[arrayLoc];
			rectX = gameBoard.blockPixelGap + (i*(gameBoard.blockPixelWidth)) + i*gameBoard.blockPixelGap;
			rectY = (j*gameBoard.blockPixelHeight) + gameBoard.blockPixelGap * (j + 1);
			isTouchingBlock = mouseTouchingRect(rectX, rectY, gameBoard.blockPixelWidth, gameBoard.blockPixelHeight)
			if (isTouchingBlock){
				//console.log("Block clicked!", rectX, rectY, block.health);
				//console.log("Array loc", arrayLoc)
				damageBlock(block, game.clickDamage)
			}
		}
	}

	//Check if any of the UI elements were clicked on
	for (i=0; i<ui.elements.length; i++){
		element = ui.elements[i];
		if (element instanceof ButtonElement){
			isTouchingElement= mouseTouchingRect(element.posX, element.posY, element.width, element.height)
			if (isTouchingElement){
				console.log("Touching element", element.name)
				element.runFunction();
			}
		}		
	}
}

function mouseTouchingRect(rectX, rectY, rectWidth, rectHeight){
	mouseX = playerMouse.posX;
	mouseY = playerMouse.posY;
	//console.log("Checking:", rectX, rectY, rectWidth, rectHeight)
	if (mouseX < rectX + rectWidth && mouseX > rectX && mouseY < rectY + rectHeight && mouseY > rectY) {
		return true;
	}
	else {
		return false;
	} 
}

function damageBlock(block, damage){
	if (block.health - game.clickDamage <= 0){
		game.money += block.health;
		newBlock = new EmptyBlock
		gameBoard.gameArray[arrayLoc] = newBlock
	}
	else if(block.health != null){
		game.money += game.clickDamage;
		block.health = block.health - game.clickDamage;
	}
}

function rectTouchingRect(rect1Left, rect1Right, rect1Top, rect1Bottom, rect2Left, rect2Y1, rect2X2, rect2Y2){
	leftTouching = false;
	rightTouching = false;
	topTouching = false;
	bottomTouching = false;


	//Draw lines
	//c.beginPath();
	//c.rect(rect1Left, 0, 3,gameHeight);
	//c.rect(rect1Right, 0, 3,gameHeight);
	//c.rect(0, rect1Top, gameWidth, 3);
	//c.rect(0, rect1Bottom, gameWidth, 3);
	//c.fillStyle = "red";
	//c.fill();
//
	//c.beginPath();
	//c.rect(rect2Left, 0, 3,gameHeight);
	//c.rect(rect2Right, 0, 3,gameHeight);
	//c.rect(0, rect2Top, gameWidth, 3);
	//c.rect(0, rect2Bottom, gameWidth, 3);
	//c.fillStyle = "green";
	//c.fill();


	if (rect1Left > rect2Left && rect1Left < rect2Right){
		//console.log("Left dist:", rect1Left - rect2Left)
		leftDist = Math.abs(rect1Left - rect2Left);
		leftTouching = true;
	} 
	if (rect1Right > rect2Left && rect1Left < rect2Right){
		rightDist = Math.abs(rect1Right - rect2Right);
		rightTouching = true;
	} 
	if (rect1Top > rect2Top && rect1Top < rect2Bottom){
		topDist = Math.abs(rect1Top - rect2Top);
		topTouching = true;
	} 
	if (rect1Bottom < rect2Bottom && rect1Bottom > rect2Top){
		bottomDist = Math.abs(rect1Bottom- rect2Bottom);
		bottomTouching = true;
	} 

	randArray = []

	if (topTouching && leftTouching || topTouching && rightTouching){
		return ("topTouching");
		
	}
	if (bottomTouching && leftTouching || bottomTouching && rightTouching){
		return ("bottomTouching");
	}
	if (leftTouching && topTouching || leftTouching && bottomTouching){
		return ("leftTouching");
	}
	if (rightTouching && topTouching || rightTouching && bottomTouching){
		return ("rightTouching");
	}
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}

function drawBlocks(){
	//Draw blocks
	for (i=0; i<gameBoard.blockWidth; i++){
		for (j=0; j<gameBoard.blockHeight; j++){
			arrayLoc = i + j*gameBoard.blockWidth
			//console.log("LOC", arrayLoc)
			block = gameBoard.gameArray[arrayLoc];
			c.fillStyle = block.colour;
			rectX = gameBoard.blockPixelGap + (i*(gameBoard.blockPixelWidth)) + i*gameBoard.blockPixelGap;
			rectY = (j*gameBoard.blockPixelHeight) + gameBoard.blockPixelGap * (j + 1);
			rectWidth = gameBoard.blockPixelWidth;
			rectHeight = gameBoard.blockPixelHeight;

			//Draw block
			c.beginPath();
			c.roundRect(rectX, rectY, rectWidth, rectHeight, 3);
			c.fill();
			c.strokeStyle = "#000";
			c.lineWidth = 2 
			if (block.useStroke){
				c.stroke();
			}

			//Do text
			if (block.health != null){
				blockCenterX = rectX + (gameBoard.blockPixelWidth / 2)
				blockCenterY = rectY + (gameBoard.blockPixelHeight / 1.4)
				c.font = "16px Oswald";
				c.fillStyle = "black";
				c.textAlign = "center";
				c.fillText(block.health, blockCenterX, blockCenterY);
			} 
		}
	}
}

function drawBackground(){
	c.beginPath();
	c.rect(0,0, gameWidth, gameHeight);
	c.fillStyle = game.backgroundColour;
	c.fill();

}

function blocksAreEmpty(){
	blocksEmpty = true;
	for (i=0; i<gameBoard.gameArray.length; i++){
		if (gameBoard.gameArray[i] instanceof EmptyBlock){
		}
		else{blocksEmpty = false}
	}
	return blocksEmpty;
}


var circle = new NormalBall(0, 0, 15, 3.5, 7.8, "#000")
frameCount = 0

oldUnixTime = Date.now()
function animateLoop(){
	//Stopwatch

	c.clearRect(0, 0, gameWidth, gameHeight);
	drawBackground();
	drawBlocks();
	ui.drawElements();

	if (blocksAreEmpty()){
		console.log("Finished board!")
		game.level += 1;
		gameBoard.setupBoardArray();
	}
	
	circle.draw();
	circle.update();
	frameCount = frameCount + 1
	currentUnixTime = Date.now()
	if (oldUnixTime + 1000 < currentUnixTime){
		console.log("FPS:", frameCount)
		oldUnixTime = Date.now()
		frameCount = 0;
	}
	requestAnimationFrame(animateLoop);
}

function printShit(){
	//console.log()
}

function Main(){

	addEventListener("mousemove", moveHandler, false);
	addEventListener("mousedown", mouseDownHandler, false);

	//Add to gameBoard array
	gameBoard.setupBoardArray();

	ui.setup();


	setInterval(printShit, 200);
	animateLoop(ui);

}

Main();