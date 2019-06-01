var canvas = document.querySelector("canvas");
gameWidth = 1000
gameHeight = 500
canvas.width = gameWidth
canvas.height = gameHeight + 200
var c = canvas.getContext("2d")

var blockColoursDict = {
	1:"#11ff55",
	2:"#11f3ff",
	3:"#1178ff",
	4:"#ffaf11",
	5:"#ff2011",
	6:"#f44274",
	7:"#11f3ff",
	8:"#1178ff",
	9:"#ffaf11",
	10:"#ff2011",
	15:"#ffffff",
};

//---When adding a new ball---//
//1. Object
//2. Shop


class Game{
	constructor(){
		//Colours
		this.backgroundColour = "#f4eed7";
		this.level = 1;
		this.money = 1000;
		this.clickDamage = 1;
		this.clickDamageCost = 10;
		this.circleArray = [];

		//Speed Ball
		this.speedBallCost = 50;
		this.speedBallDamage = 1;
		this.speedBallVel = 2;
	}
	getMoney(){
		return this.money;
	}

	drawAndUpdateBalls(){
		for (var i=0; i<game.circleArray.length; i++){
			var circle = game.circleArray[i];
			//Draw circle
			c.beginPath();
			try {
				c.arc(circle.circleX, circle.circleY, circle.circleRadius, 0, Math.PI * 2, false);
			}
			catch (err){
				console.log(err)
				console.log(circle.circleX, circle.circleY, circle.circleRadius, 0, Math.PI * 2, false);
			}
			c.lineWidth = 5;
			c.strokeStyle = "black";
			c.stroke();
			c.fillStyle = circle.colour;
			c.fill();
			c.closePath();
			circle.handleBall();
		}
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
					//var randomHealth = Math.floor(Math.random() * Math.floor(game.level)) + 1;
					var randomHealth = game.level;
					var newBlock = new NormalBlock(randomHealth);
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
	//console.log("niiice")
}

function buyClickDamage(){
	if (game.money >= game.clickDamageCost){
		game.clickDamage = game.clickDamage + 1
		game.money -= game.clickDamageCost;
	}
}

function noneText(){
	return ""
}

class Shop{
	constructor(){
		this.normalBallCost = 10
		this.speedBallCost = 50
	}

	getPrice(ballName){
		if(ballName == "NormalBall"){
			var cost = this.normalBallCost;
		}
		else if(ballName == "SpeedBall"){
			var cost = this.speedBallCost;
		}
		else{
			console.log("Error getting ballName", ballName);
			return ["noCost", "noVel"];}
		return cost;
	}
	buyBall(ballName){
		var cost = this.getPrice(ballName);
		if (game.money >= cost){
			console.log("Right cost")
			if (ballName == "NormalBall"){
				console.log("got right ballname")
				this.normalBallCost = Math.floor((this.normalBallCost + 3) * 1.1);
				game.circleArray.push(new NormalBall())
			}
			else if (ballName == "SpeedBall"){
				this.speedBallCost = Math.floor((this.speedBallCost + 3) * 1.1);
				game.circleArray.push(new SpeedBall())
			}
			game.money -= cost;
		}
	}
}
shop = new Shop();

function buttonBuyBall(ballName){
	shop.buyBall(ballName)
}

function buttonGetBallPrice(ballName){
	return "$" + shop.getPrice(ballName);
}


class UIBallElement{
	constructor(circleX, circleY, circleRadius, colour){
		this.circleX = circleX;
		this.circleY = circleY;
		this.circleRadius = circleRadius;
		this.colour = colour;
	}
	draw(){
		//Now the ball
		c.beginPath();
		c.arc(this.circleX, this.circleY, this.circleRadius, 0, Math.PI * 2, false);
		c.lineWidth = 5;
		c.strokeStyle = "black";
		c.stroke();
		c.fillStyle = this.colour;
		c.fill();
		c.closePath();
	}
}

class UIBuyBallElement{
	constructor(name, posX, posY, ballColour, onBuyClickFunction, params, textFunction, textFunctionParams){
		this.name = name;
		this.posX = posX;
		this.posY = posY;
		this.ballColour = ballColour;
		this.onBuyClickFunction = onBuyClickFunction;
		this.params = params
		this.text = textFunction;
		this.textFunctionParams = textFunctionParams;
	}

	setup(){
		//Create background
		var newButton = new ButtonElement("buyNormalBallBg", this.posX, this.posY, 80, 80, true, "#F4EED7", true, "#000", squareClickFunction, "", true, "18px Oswald", "white", "right", noneText);
		ui.elements.push(newButton);
		var newButton = new ButtonElement("buyNormalBallBuyButton", this.posX, this.posY+80, 80, 30, true, "#F4EED7", true, "#000", this.onBuyClickFunction, this.params, true, "18px Oswald", "black", "center", this.text, this.textFunctionParams);
		ui.elements.push(newButton);
		var newBall = new UIBallElement(this.posX+40, this.posY+40, 15, this.ballColour);
		ui.elements.push(newBall);
	}
}

class UserInterface{
	constructor(){
		this.elements = [];
	}
	setup(){
		//Bottom outline
		var newButton = new ButtonElement("uiBackground", 0, gameHeight, gameWidth, 200, true, "#c7dbe2", true, "#000", squareClickFunction, "");
		this.elements.push(newButton);
		var newButton = new ButtonElement("moneyText", 50, 590, 120, 30, true, "#55D400", true, "#000", squareClickFunction, "", true, "18px Oswald", "white", "right", getMoney);
		this.elements.push(newButton);
		var newButton = new ButtonElement("clickDamageText", 50, 550, 120, 30, true, "#55D400", true, "#000", squareClickFunction, "", true, "18px Oswald", "white", "right", getClickDamageText);
		this.elements.push(newButton);
		var newButton = new ButtonElement("buyClickDamageButton", 180, 550, 65, 30, true, "#55D400", true, "#000", buyClickDamage, "", true, "18px Oswald", "white", "right", getBuyClickDamageText);
		this.elements.push(newButton);
		var newButton = new ButtonElement("levelText", 50, 510, 120, 30, true, "#55D400", true, "#000", squareClickFunction, "", true, "18px Oswald", "white", "right", getBuyLevelText);
		this.elements.push(newButton);

		//---Draw first ball buy button---//
		var newUIBallElement = new UIBuyBallElement("NormalBall", 300, 510, "#f442f4", buttonBuyBall, "NormalBall", buttonGetBallPrice, "NormalBall");
		newUIBallElement.setup();
		var newUIBallElement = new UIBuyBallElement("SpeedBall", 400, 510, "#42f4ee", buttonBuyBall, "SpeedBall", buttonGetBallPrice, "SpeedBall");
		newUIBallElement.setup();




	}
	drawTabOne(){
		for (i=0; i<this.elements.length; i++){
			let element = this.elements[i];
			if (element instanceof ButtonElement){
				//Draw the rect
				c.beginPath();
				c.fillStyle = element.fillColour;
				c.rect(element.posX, element.posY, element.width, element.height);
				c.strokeStyle = element.strokeColour;
				if (element.useFill){c.fill()}
				if (element.useStroke){c.lineWidth=2; c.stroke()};

				//Draw the text
				c.font = element.font;
				c.fillStyle = element.textFillStyle;
				c.textAlign = element.textAlign;
				if (element.useText){
					if(element.textAlign == "right"){
						var textPosX = element.posX + element.width - 5;
						var textPosY = element.posY + (element.height / 1.3);
					}
					if(element.textAlign == "left"){
						var textPosX = element.posX + 5;
						var textPosY = element.posY + (element.height / 1.3);
					}
					if(element.textAlign == "center"){
						var textPosX = element.posX + (element.width / 2);
						var textPosY = element.posY + (element.height / 1.3);
					}
					c.fillText(element.fillTextChar(element.textFunctionParams), textPosX, textPosY);
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
					c.fillText(element.fillTextChar(element.textFunctionParams), textPosX, textPosY);
					}
				}	
			}
			if (element instanceof UIBallElement){
				element.draw();
			}
		}
	}
}
ui = new UserInterface();

class ButtonElement{
	constructor(name, posX, posY, width, height, useFill, fillColour, useStroke, strokeColour, runFunction, params, useText, font, textFillStyle, textAlign, textFunction, textFunctionParams){
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
		this.params = params;

		//Text
		this.useText = useText;
		this.font = font;
		this.textFillStyle = textFillStyle;
		this.textAlign = textAlign;
		this.fillTextChar = textFunction;
		this.textFunctionParams = textFunctionParams;
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
	updateColour(){
		var hasPickedColour = false;
		var pickedColour = this.health;
		while (hasPickedColour == false){
			if (pickedColour in blockColoursDict){
				this.colour = blockColoursDict[pickedColour];
		    	hasPickedColour = true;
			}
			else{
		    	pickedColour = pickedColour - 1;
		 	}
		}
	}
}

class Ball{
	constructor(circleX, circleY, circleRadius, velX, velY, colour){
		this.circleRadius = circleRadius;
		this.circleX = circleX;
		this.circleY = circleY;
		this.velX = velX;
		this.velY = velY;
		this.colour = colour;
	}

	handleBall(){
		this.updatePos();
		this.handleBlockHit();
	}

	updatePos(){
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
	}
}

class NormalBall extends Ball{
	constructor(){
		let posX = Math.random() * gameWidth
		let posY = Math.random() * gameHeight
		let radius = 15
		let velX = 1
		let velY = 1
		let colour = "#f442f4"
		super(posX, posY, radius, velX,velY, colour);
		this.damage = 1;
		this.circleRadius = radius
		this.velX = velX
		this.velY = velY
		this.colour = colour
	}

	handleBlockHit(){
		//Damage block
		var result = checkTouchingSideAndBrick(this)
		var isTouchingBlock = result[0];
		var block = result[1];
		//console.log(result)
		if(isTouchingBlock != false){
			damageBlock(block, this.damage);
		}
		if (isTouchingBlock == "leftTouching"){
			this.velX = Math.abs(this.velX);
			this.circleX += 5;
		} 
		if (isTouchingBlock == "rightTouching"){
			this.velX = -Math.abs(this.velX);
			this.circleX -= 5;
		} 
		if (isTouchingBlock == "topTouching"){
			//Positive
			this.velY = Math.abs(this.velY);
			this.circleY += 5;
		} 
		if (isTouchingBlock == "bottomTouching"){
			//Negative
			this.velY = -Math.abs(this.velY);
			this.circleY -= 5;
		}
	}
}

class SpeedBall extends Ball{
	constructor(){
		let posX = Math.random() * gameWidth
		let posY = Math.random() * gameHeight
		let radius = 15
		let velX = 2
		let velY = 2
		let colour = "#42f4ee"
		super(posX, posY, radius, velX,velY, colour);
		this.damage = 1;
		this.circleRadius = radius
		this.velX = velX
		this.velY = velY
		this.colour = colour
	}

	handleBlockHit(){
		//Damage block
		var result = checkTouchingSideAndBrick(this)
		var isTouchingBlock = result[0];
		var block = result[1];
		//console.log(result)
		if(isTouchingBlock != false){
			damageBlock(block, this.damage);
		}
		if (isTouchingBlock == "leftTouching"){
			this.velX = Math.abs(this.velX);
			this.circleX += 5;
		} 
		if (isTouchingBlock == "rightTouching"){
			this.velX = -Math.abs(this.velX);
			this.circleX -= 5;
		} 
		if (isTouchingBlock == "topTouching"){
			//Positive
			this.velY = Math.abs(this.velY);
			this.circleY += 5;
		} 
		if (isTouchingBlock == "bottomTouching"){
			//Negative
			this.velY = -Math.abs(this.velY);
			this.circleY -= 5;
		}
	}
}

function checkTouchingSideAndBrick(ball){
	//----Check bricks----//
	for (i=0; i<gameBoard.blockWidth; i++){
		for (j=0; j<gameBoard.blockHeight; j++){
			arrayLoc = i + j*gameBoard.blockWidth;
			let block = gameBoard.gameArray[arrayLoc];
			if (!(block instanceof EmptyBlock)){
				//Circle
				var rect1Left = ball.circleX - ball.circleRadius;
				var rect1Right = ball.circleX + ball.circleRadius;
				var rect1Top = ball.circleY - ball.circleRadius;
				var rect1Bottom = ball.circleY + ball.circleRadius;

				var rect2Left = gameBoard.blockPixelGap + (i*(gameBoard.blockPixelWidth)) + i*gameBoard.blockPixelGap;
				var rect2Top = (j*gameBoard.blockPixelHeight) + gameBoard.blockPixelGap * (j + 1);
				var rect2Right = rect2Left + gameBoard.blockPixelWidth;
				var rect2Bottom = rect2Top + gameBoard.blockPixelHeight;
				var isTouchingBlock = rectTouchingRect(rect1Left, rect1Right, rect1Top, rect1Bottom, rect2Left, rect2Top, rect2Right, rect2Bottom)
				if (isTouchingBlock == "noneTouching"){
				}
				else{
					return [isTouchingBlock, block];
				}
			}
		}
	}
	return [false, null];
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
				element.runFunction(element.params);
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
	if (block.health - damage <= 0){
		game.money += block.health;
		newBlock = new EmptyBlock
		gameBoard.gameArray[arrayLoc] = newBlock
	}
	else if(block.health != null){
		game.money += damage;
		block.health = block.health - damage;
	}
}

function rectTouchingRect(rect1Left, rect1Right, rect1Top, rect1Bottom, rect2Left, rect2Top, rect2Right, rect2Bottom){
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
	return ("noneTouching")
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
			let block = gameBoard.gameArray[arrayLoc];
			if (!(block instanceof EmptyBlock)){
				block.updateColour();
			}
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
				blockCenterY = rectY + (gameBoard.blockPixelHeight / 1.35)
				c.font = "18px Oswald";
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



frameCount = 0
oldUnixTime = Date.now()
function animateLoop(){
	//Stopwatch

	c.clearRect(0, 0, gameWidth, gameHeight);
	drawBackground();
	drawBlocks();
	ui.drawTabOne();
	game.drawAndUpdateBalls();

	if (blocksAreEmpty()){
		console.log("Finished board!")
		game.level += 1;
		gameBoard.setupBoardArray();
	}
	

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
	//for (i=0; i<2; i++){
	//	randPosX = Math.random() * gameWidth
	//	randPosY = Math.random() * gameHeight
	//	radius = 15
	//	velX = Math.random() * 5
	//	velY = Math.random() * 5
	//	colour = "#f442f4"
	//	game.circleArray.push(new NormalBall(randPosX, randPosY, radius, velX, velY, colour))
	//}
	ui.setup();


	setInterval(printShit, 200);
	animateLoop(ui);

}

Main();