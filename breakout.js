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
		this.ballUpgrades = 
		{
		  "MainBall": {
		    "Speed": {
		      "Amount": 1,
		      "Cost": 20
		    },
		    "Damage": {
		      "Amount": 1,
		      "Cost": 20
		    },
		    "Size": {
		      "Amount": 15,
		      "Cost": 20
		    }
		  },
		  "NormalBall": {
		  	"ballPrice": 20,
		    "Speed": {
		      "Amount": 1,
		      "Cost": 20
		    },
		    "Damage": {
		      "Amount": 1,
		      "Cost": 20
		    }
		  },
		  "SpeedBall": {
		  	"ballPrice": 50,
		    "Speed": {
		      "Amount": 3,
		      "Cost": 50
		    },
		    "Damage": {
		      "Amount": 1,
		      "Cost": 50
		    }
		  },
		  "BombBall": {
		  	"ballPrice": 100,
		    "Damage": {
		      "Amount": 1,
		      "Cost": 500
		    },
		    "Range": {
		      "Amount": 1,
		      "Cost": 50
		    }
		  },
		  "SniperBall": {
		  	"ballPrice": 100,
		    "Damage": {
		      "Amount": 1,
		      "Cost": 500
		    },
		    "Speed": {
		      "Amount": 2,
		      "Cost": 50
		    }
		  }
		}
	}


	getStatAmount(ballName, stat){
		return shop.ballUpgrades[ballName][stat]["Amount"];
	}
	getPrice(ballName){
		var cost = this.ballUpgrades[ballName]["ballPrice"]
		return cost;
	}
	buyBall(ballName){
		var cost = this.getPrice(ballName);
		console.log("Cost:", cost)
		if (game.money >= cost){
			game.money -= cost;
			this.ballUpgrades[ballName]["ballPrice"] = Math.floor((this.ballUpgrades[ballName]["ballPrice"] + 3) * 1.1);
			console.log("Right cost")
			if (ballName == "NormalBall"){
				game.circleArray.push(new NormalBall())
			}
			else if (ballName == "SpeedBall"){
				game.circleArray.push(new SpeedBall())
			}
			else if (ballName == "BombBall"){
				game.circleArray.push(new BombBall())
			}
			else if (ballName == "SniperBall"){
				game.circleArray.push(new SniperBall())
			}
		}
	}
	upgrade(nameStatArray){
		var name = nameStatArray[0];
		var stat = nameStatArray[1];
		var amount = nameStatArray[2];
		console.log(name, stat, amount)
		if(game.money > this.ballUpgrades[name][stat]["Cost"]){
			game.money -= this.ballUpgrades[name][stat]["Cost"];
			this.ballUpgrades[name][stat]["Amount"] = Math.round((this.ballUpgrades[name][stat]["Amount"] + amount) * 10) / 10;
			this.ballUpgrades[name][stat]["Cost"] = Math.round(this.ballUpgrades[name][stat]["Cost"] * 1.25);
			updateBalls(name, stat)
		}
	}
}
shop = new Shop();

function shopupgrade(nameStatArray){
	shop.upgrade(nameStatArray);
}

function updateBalls(ballName, stat){
	for (var i=0; i<game.circleArray.length; i++){
		ball = game.circleArray[i];
		if(ball.constructor.name == ballName){
			ball.updateStat(ballName, stat)
			//shop.ballUpgrades[ballName][stat][amount] = shop.ballUpgrades[ballName][stat][amount] + amount;
		}
	}
}

function buttonBuyBall(ballName){
	shop.buyBall(ballName)
}

function buttonGetBallPrice(ballName){
	return "$" + shop.getPrice(ballName);
}

function getUpgradeText(ballNameStatArray){
	let ballName = ballNameStatArray[0];
	let stat = ballNameStatArray[1]; 
	return stat + ": " +shop.ballUpgrades[ballName][stat]["Amount"] + " ($" + shop.ballUpgrades[ballName][stat]["Cost"] + ")";
}

function getTabOneText(){
	return "Main";
}
function getTabTwoText(){
	return "Upgrades";
}

function getTabThreeText(){
	return "Main Ball";
}

function getBlockedText(level){
	return "Locked lv. " + level
}

class UIBallElement{
	constructor(tab, circleX, circleY, circleRadius, colour){
		this.tab = tab;
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
	constructor(tab, name, posX, posY, ballColour, onBuyClickFunction, params, textFunction, textFunctionParams){
		this.tab = tab;
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
		var newButton = new ButtonElement(this.tab, "buyNormalBallBg", this.posX, this.posY, 80, 80, true, "#F4EED7", true, "#000", squareClickFunction, "", true, "18px Oswald", "white", "right", noneText);
		ui.elements.push(newButton);
		var newButton = new ButtonElement(this.tab,"buyNormalBallBuyButton", this.posX, this.posY+80, 80, 30, true, "#F4EED7", true, "#000", this.onBuyClickFunction, this.params, true, "18px Oswald", "black", "center", this.text, this.textFunctionParams);
		ui.elements.push(newButton);
		var newBall = new UIBallElement(this.tab, this.posX+40, this.posY+40, 15, this.ballColour);
		ui.elements.push(newBall);
		var newText = new TextElement(this.tab, this.name, this.posX+40, this.posY+135, true, "20px Oswald", "black", "center", this.name.replace("Ball",""))
		ui.elements.push(newText);
	}
}

class UserInterface{
	constructor(){
		this.elements = [];
		this.currentTab = 1;
	}
	setup(){
		//Bottom outline
		var newButton = new ButtonElement(0, "uiBackground", 0, gameHeight, gameWidth, 200, true, "#c7dbe2", true, "#000", squareClickFunction, "");
		this.elements.push(newButton);
		var newButton = new ButtonElement(0, "moneyText", 50, 590, 120, 30, true, "#55D400", true, "#000", squareClickFunction, "", true, "18px Oswald", "white", "right", getMoney);
		this.elements.push(newButton);
		var newButton = new ButtonElement(0, "clickDamageText", 50, 550, 120, 30, true, "#55D400", true, "#000", squareClickFunction, "", true, "18px Oswald", "white", "right", getClickDamageText);
		this.elements.push(newButton);
		var newButton = new ButtonElement(0, "buyClickDamageButton", 180, 550, 65, 30, true, "#55D400", true, "#000", buyClickDamage, "", true, "18px Oswald", "white", "right", getBuyClickDamageText);
		this.elements.push(newButton);
		var newButton = new ButtonElement(0, "levelText", 50, 510, 120, 30, true, "#55D400", true, "#000", squareClickFunction, "", true, "18px Oswald", "white", "right", getBuyLevelText);
		this.elements.push(newButton);

		//Tab buttons
		var newButton = new ButtonElement(0, "tabOne", 50, gameHeight + 170, 120, 30, true, "#4256f4", true, "#000", setTab, 1, true, "18px Oswald", "white", "center", getTabOneText);
		this.elements.push(newButton);
		var newButton = new ButtonElement(0, "tabTwo", 170, gameHeight + 170, 120, 30, true, "#4256f4", true, "#000", setTab, 2, true, "18px Oswald", "white", "center", getTabTwoText);
		this.elements.push(newButton);
		var newButton = new ButtonElement(0, "tabThree", 290, gameHeight + 170, 120, 30, true, "#4256f4", true, "#000", setTab, 3, true, "18px Oswald", "white", "center", getTabThreeText);
		this.elements.push(newButton);

		//Blocked tab buttons
		var newButton = new ButtonElement(0, "blockedTabThree", 290, gameHeight + 170, 120, 30, true, "#4256f4", true, "#000", setTab, 3, true, "18px Oswald", "gray", "center", getBlockedText, 5);
		this.elements.push(newButton);

		//--------------Main Tab One--------------//
		//---Draw first ball buy button---//
		var newUIBallElement = new UIBuyBallElement(1, "NormalBall", 300, 510, "#f442f4", buttonBuyBall, "NormalBall", buttonGetBallPrice, "NormalBall");
		newUIBallElement.setup();
		var newUIBallElement = new UIBuyBallElement(1, "SpeedBall", 400, 510, "#42f4ee", buttonBuyBall, "SpeedBall", buttonGetBallPrice, "SpeedBall");
		newUIBallElement.setup();
		var newUIBallElement = new UIBuyBallElement(1, "BombBall", 500, 510, "#000000", buttonBuyBall, "BombBall", buttonGetBallPrice, "BombBall");
		newUIBallElement.setup();
		var newUIBallElement = new UIBuyBallElement(1, "SniperBall", 600, 510, "#dddddd", buttonBuyBall, "SniperBall", buttonGetBallPrice, "SniperBall");
		newUIBallElement.setup();

		//--------------Ugrades Tab Two--------------//
		//Normal Ball
		var columnX = 260
		var columnY = 520
		var newBall = new UIBallElement(2, columnX + 80, columnY + 20, 15, "#f442f4");
		this.elements.push(newBall);
		var newButton = new ButtonElement(2, "upgradeNormalBallSpeed", columnX + 10, columnY + 50, 140, 30, true, "#4256f4", true, "#000", shopupgrade, ["NormalBall", "Speed", 0.1], true, "18px Oswald", "white", "center", getUpgradeText, ["NormalBall", "Speed"]);
		this.elements.push(newButton);
		var newButton = new ButtonElement(2, "upgradeNormalBallDamage", columnX + 10, columnY + 90, 140, 30, true, "#4256f4", true, "#000", shopupgrade, ["NormalBall", "Damage", 1], true, "18px Oswald", "white", "center", getUpgradeText, ["NormalBall", "Damage"]);
		this.elements.push(newButton);

		//Speed Ball
		var columnX = 420
		var columnY = 520
		var newBall = new UIBallElement(2, columnX + 80, columnY + 20, 15, "#42f4ee");
		this.elements.push(newBall);
		var newButton = new ButtonElement(2, "upgradeSpeedBallSpeed", columnX + 10, columnY + 50, 140, 30, true, "#4256f4", true, "#000", shopupgrade, ["SpeedBall", "Speed", 0.3], true, "18px Oswald", "white", "center", getUpgradeText, ["SpeedBall", "Speed"]);
		this.elements.push(newButton);
		var newButton = new ButtonElement(2, "upgradeSpeedBallDamage", columnX + 10, columnY + 90, 140, 30, true, "#4256f4", true, "#000", shopupgrade, ["SpeedBall", "Damage", 1], true, "18px Oswald", "white", "center", getUpgradeText, ["SpeedBall", "Damage"]);
		this.elements.push(newButton);

		//Bomb Ball
		var columnX = 580
		var columnY = 520
		var newBall = new UIBallElement(2, columnX + 80, columnY + 20, 15, "#000");
		this.elements.push(newBall);
		var newButton = new ButtonElement(2, "upgradeBombBallDamage", columnX + 10, columnY + 50, 140, 30, true, "#4256f4", true, "#000", shopupgrade, ["BombBall", "Damage", 3], true, "18px Oswald", "white", "center", getUpgradeText, ["BombBall", "Damage"]);
		this.elements.push(newButton);
		var newButton = new ButtonElement(2, "upgradeBombBallRange", columnX + 10, columnY + 90, 140, 30, true, "#4256f4", true, "#000", shopupgrade, ["BombBall", "Range", 0.1], true, "18px Oswald", "white", "center", getUpgradeText, ["BombBall", "Range"]);
		this.elements.push(newButton);


		//Sniper Ball
		var columnX = 740
		var columnY = 520
		var newBall = new UIBallElement(2, columnX + 80, columnY + 20, 15, "#dddddd");
		this.elements.push(newBall);
		var newButton = new ButtonElement(2, "upgradeSniperBallSpeed", columnX + 10, columnY + 50, 140, 30, true, "#4256f4", true, "#000", shopupgrade, ["SniperBall", "Speed", 1], true, "18px Oswald", "white", "center", getUpgradeText, ["SniperBall", "Speed"]);
		this.elements.push(newButton);
		var newButton = new ButtonElement(2, "upgradeSniperBallDamage", columnX + 10, columnY + 90, 140, 30, true, "#4256f4", true, "#000", shopupgrade, ["SniperBall", "Damage", 1], true, "18px Oswald", "white", "center", getUpgradeText, ["SniperBall", "Damage"]);
		this.elements.push(newButton);


		//--------------Main Ball Tab Three--------------//
		var newButton = new ButtonElement(3, "mainBallBackground", 280, gameHeight+30, 100, 100, true, "#F4EED7", true, "#000", squareClickFunction, "");
		this.elements.push(newButton)
		var newBall = new UIBallElement(3, 330, gameHeight + 80, 40, "#4ef442");
		this.elements.push(newBall);

		//Main Ball
		var columnX = 400
		var columnY = 475
		var newButton = new ButtonElement(3, "upgradeMainBallSpeed", columnX + 10, columnY + 50, 140, 30, true, "#4256f4", true, "#000", shopupgrade, ["MainBall", "Speed", 1], true, "18px Oswald", "white", "center", getUpgradeText, ["MainBall", "Speed"]);
		this.elements.push(newButton);
		var newButton = new ButtonElement(3, "upgradeMainBallSpeed", columnX + 10, columnY + 90, 140, 30, true, "#4256f4", true, "#000", shopupgrade, ["MainBall", "Speed", 1], true, "18px Oswald", "white", "center", getUpgradeText, ["MainBall", "Speed"]);
		this.elements.push(newButton);
		var newButton = new ButtonElement(3, "upgradeMainBallSize", columnX + 10, columnY + 130, 140, 30, true, "#4256f4", true, "#000", shopupgrade, ["MainBall", "Size", 1], true, "18px Oswald", "white", "center", getUpgradeText, ["MainBall", "Size"]);
		this.elements.push(newButton);


	}
	drawTabOne(){
		for (i=0; i<this.elements.length; i++){
			let element = this.elements[i];
			if (element.tab == this.currentTab || element.tab == 0){
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
						//console.log(textPosX, textPosY)
						c.fillText(element.fillTextChar, textPosX, element.posY);
					}	
				}
				if (element instanceof UIBallElement){
					element.draw();
				}
			}
		}
	}
}
ui = new UserInterface();

function setTab(tab){
	ui.currentTab = tab;
}

class ButtonElement{
	constructor(tab, name, posX, posY, width, height, useFill, fillColour, useStroke, strokeColour, runFunction, params, useText, font, textFillStyle, textAlign, textFunction, textFunctionParams){
		this.tab = tab;
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
	constructor(tab, name, posX, posY, useText, font, textFillStyle, textAlign, fillTextChar){
		this.tab = tab;
		this.name = name;
		this.posX = posX;
		this.posY = posY;
		this.width = fillTextChar.length;
		this.height = 10

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




var randomVelList = [-1,1]
class Ball{
	constructor(circleX, circleY, circleRadius, colour, stats){
		this.circleRadius = circleRadius;
		this.circleX = circleX;
		this.circleY = circleY;
		this.velX = randomVelList[Math.floor(Math.random()*randomVelList.length)];
		this.velY = randomVelList[Math.floor(Math.random()*randomVelList.length)];
		this.stats = stats;
		this.colour = colour;
	}

	handleBall(){
		this.updatePos();
		this.handleBlockHit();
	}

	updateStat(ballName, stat){
		console.log("updating", stat);
		this.stats[stat] = shop.ballUpgrades[ballName][stat]["Amount"];
		if(stat == "Size"){
			this.circleRadius = shop.ballUpgrades[ballName][stat]["Amount"]
		}
	}
}

class NormalBall extends Ball{
	constructor(){
		let posX = Math.random() * gameWidth
		let posY = Math.random() * gameHeight
		let radius = 15
		let colour = "#f442f4"
		let stats = {"Speed":shop.ballUpgrades["NormalBall"]["Speed"]["Amount"],
					 "Damage":shop.ballUpgrades["NormalBall"]["Damage"]["Amount"]};
		super(posX, posY, radius, colour, stats);
		this.circleRadius = radius
		this.colour = colour
	}


	updatePos(){
		let speed = this.stats["Speed"];

		//Movement
		this.circleX = this.circleX + (this.velX * speed);
		this.circleY = this.circleY + (this.velY * speed);
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

	handleBlockHit(){
		//Damage block
		var result = checkTouchingSideAndBrick(this)
		var isTouchingBlock = result[0];
		var block = result[1];
		var randArray = [1]
		var randPercent = randArray[Math.floor(Math.random()*randArray.length)];
		if(isTouchingBlock != false){

			damageBlock(block, this.stats["Damage"]);
		}
		if (isTouchingBlock == "leftTouching"){
			this.velX = Math.abs(this.velX) * randPercent;
			this.circleX += 5;
		} 
		if (isTouchingBlock == "rightTouching"){
			this.velX = -Math.abs(this.velX) * randPercent;
			this.circleX -= 5;
		} 
		if (isTouchingBlock == "topTouching"){
			//Positive
			this.velY = Math.abs(this.velY) * randPercent;
			this.circleY += 5;
		} 
		if (isTouchingBlock == "bottomTouching"){
			//Negative
			this.velY = -Math.abs(this.velY) * randPercent;
			this.circleY -= 5;
		}
	}
}

class SpeedBall extends Ball{
	constructor(){
		let posX = Math.random() * gameWidth
		let posY = Math.random() * gameHeight
		let radius = 15
		let colour = "#42f4ee"
		let stats = {"Speed":shop.ballUpgrades["SpeedBall"]["Speed"]["Amount"],
					 "Damage":shop.ballUpgrades["SpeedBall"]["Damage"]["Amount"]};
		super(posX, posY, radius, colour, stats);
		this.circleRadius = radius
		this.colour = colour
		
	}


	updatePos(){
		let speed = this.stats["Speed"];
		//Movement
		this.circleX = this.circleX + (this.velX * speed);
		this.circleY = this.circleY + (this.velY * speed);
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

	handleBlockHit(){
		//Damage block
		var result = checkTouchingSideAndBrick(this)
		var isTouchingBlock = result[0];
		var block = result[1];
		var randArray = [0.7, 0.8, 0.9, 0.95, 1, 1.05, 1.1, 1.2, 1.3]
		var randPercent = randArray[Math.floor(Math.random()*randArray.length)];
		if(isTouchingBlock != false){

			damageBlock(block, this.stats["Damage"]);
		}
		if (isTouchingBlock == "leftTouching"){
			this.velX = Math.abs(this.velX) * randPercent;
			this.circleX += 5;
		} 
		if (isTouchingBlock == "rightTouching"){
			this.velX = -Math.abs(this.velX) * randPercent;
			this.circleX -= 5;
		} 
		if (isTouchingBlock == "topTouching"){
			//Positive
			this.velY = Math.abs(this.velY) * randPercent;
			this.circleY += 5;
		} 
		if (isTouchingBlock == "bottomTouching"){
			//Negative
			this.velY = -Math.abs(this.velY) * randPercent;
			this.circleY -= 5;
		}
	}
}

class BombBall extends Ball{
	constructor(){
		let posX = Math.random() * gameWidth
		let posY = Math.random() * gameHeight
		let radius = 15
		let colour = "#000"
		let stats = {"Speed":1,
					 "Range":shop.ballUpgrades["BombBall"]["Range"]["Amount"],
					 "Damage":shop.ballUpgrades["BombBall"]["Damage"]["Amount"]};
		super(posX, posY, radius, colour, stats);
		this.circleRadius = radius
		this.colour = colour
		
	}


	updatePos(){
		let speed = this.stats["Speed"];

		//Movement
		this.circleX = this.circleX + (this.velX * speed);
		this.circleY = this.circleY + (this.velY * speed);
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

		//Draw circle radius
		//c.beginPath()
		//c.arc(this.circleX, this.circleY, this.stats["Range"] * gameBoard.blockPixelWidth, 0, Math.PI * 2, false);
		//c.lineWidth = 5;
		//c.strokeStyle = "black";
		//c.stroke();
		//c.closePath();
	}

	handleBlockHit(){
		//Damage block
		var result = checkTouchingSideAndBrick(this)
		var isTouchingBlock = result[0];
		var block = result[1];
		var randArray = [0.7, 0.8, 0.9, 0.95, 1, 1.05, 1.1, 1.2, 1.3]
		var randPercent = randArray[Math.floor(Math.random()*randArray.length)];
		if(isTouchingBlock != false){
			damageBlock(block, this.stats["Damage"]);
			//console.log(this.stats["Range"])
			damageNearbyBlocks(this.circleX, this.circleY, this.stats["Range"] * gameBoard.blockPixelWidth, this.stats["Damage"])
		}
		if (isTouchingBlock == "leftTouching"){
			this.velX = Math.abs(this.velX) * randPercent;
			this.circleX += 5;
		} 
		if (isTouchingBlock == "rightTouching"){
			this.velX = -Math.abs(this.velX) * randPercent;
			this.circleX -= 5;
		} 
		if (isTouchingBlock == "topTouching"){
			//Positive
			this.velY = Math.abs(this.velY) * randPercent;
			this.circleY += 5;
		} 
		if (isTouchingBlock == "bottomTouching"){
			//Negative
			this.velY = -Math.abs(this.velY) * randPercent;
			this.circleY -= 5;
		}
	}
}

class MainBall extends Ball{
	constructor(){
		let posX = Math.random() * gameWidth;
		let posY = Math.random() * gameHeight;
		let colour = "#4ef442";
		let stats = {"Speed":shop.ballUpgrades["MainBall"]["Speed"]["Amount"],
					 "Damage":shop.ballUpgrades["MainBall"]["Damage"]["Amount"],
					 "Size":shop.ballUpgrades["MainBall"]["Size"]["Amount"]};
		let radius = stats["Size"];
		super(posX, posY, radius, colour, stats);
		this.circleRadius = stats["Size"];
		this.colour = colour;
	}
	updatePos(){
		let speed = this.stats["Speed"];


		///////////////////
		if (playerMouse.posX == undefined){
			var diffY = this.circleY - 0
			var diffX = this.circleX - 0
		}
		else{
			var diffY = this.circleY - playerMouse.posY
			var diffX = this.circleX - playerMouse.posX
		}
		//console.log(diffX, diffY)
		this.velX = Math.cos(Math.atan2(diffY, diffX))
		this.velY = Math.sin(Math.atan2(diffY, diffX))
		//console.log(move_x, move_y)

		//Movement
		if(Math.abs(diffX) > 3 || Math.abs(diffY) > 3){
			//console.log(Math.floor(this.circleX), Math.floor(playerMouse.posX))
			this.circleX = this.circleX - (this.velX * speed);
			this.circleY = this.circleY - (this.velY * speed);
		}
		//----Check edges of game----//
		if (this.circleX + this.circleRadius >= gameWidth){
			this.circleX -= speed;
		}
		if (this.circleX - this.circleRadius < 0){
			this.circleX += speed;
		}
		if (this.circleY + this.circleRadius >= gameHeight){
			this.circleY -= speed;
		}
		if (this.circleY - this.circleRadius < 0){
			this.circleY += speed;
		}
	}

	handleBlockHit(){
		//Damage block
		var result = checkTouchingSideAndBrick(this)
		var isTouchingBlock = result[0];
		var block = result[1];
		var randArray = [0.7, 0.8, 0.9, 0.95, 1, 1.05, 1.1, 1.2, 1.3]
		var randPercent = randArray[Math.floor(Math.random()*randArray.length)];
		if(isTouchingBlock != false){

			damageBlock(block, this.stats["Damage"]);
		}
		if (isTouchingBlock == "leftTouching"){
			this.velX = Math.abs(this.velX) * randPercent;
			this.circleX += 5;
		} 
		if (isTouchingBlock == "rightTouching"){
			this.velX = -Math.abs(this.velX) * randPercent;
			this.circleX -= 5;
		} 
		if (isTouchingBlock == "topTouching"){
			//Positive
			this.velY = Math.abs(this.velY) * randPercent;
			this.circleY += 5;
		} 
		if (isTouchingBlock == "bottomTouching"){
			//Negative
			this.velY = -Math.abs(this.velY) * randPercent;
			this.circleY -= 5;
		}
	}
}
game.circleArray.push(new MainBall())


class SniperBall extends Ball{
	constructor(){
		let posX = Math.random() * gameWidth
		let posY = Math.random() * gameHeight
		let radius = 15
		let colour = "#dddddd"
		let stats = {"Speed":shop.ballUpgrades["SniperBall"]["Speed"]["Amount"],
					 "Damage":shop.ballUpgrades["SniperBall"]["Damage"]["Amount"]};
		super(posX, posY, radius, colour, stats);
		this.circleRadius = radius
		this.colour = colour
		this.destX = 0;
		this.destY = 0;
		this.velX = -1;
		this.velY = -1;

	}
	updatePos(){
		let speed = this.stats["Speed"];


		//Movement
		this.circleX = this.circleX + (this.velX * speed);
		this.circleY = this.circleY + (this.velY * speed);
		//----Check edges of game----//
		if (this.circleX + this.circleRadius >= gameWidth){
			this.velX = -Math.abs(this.velX)
			this.doSnipeDest()
		}
		if (this.circleX - this.circleRadius < 0){
			this.velX = Math.abs(this.velX)
			this.doSnipeDest()
		}
		if (this.circleY + this.circleRadius >= gameHeight){
			this.velY = -Math.abs(this.velY)
			this.doSnipeDest()
		}
		if (this.circleY - this.circleRadius < 0){
			this.velY = Math.abs(this.velY)
			this.doSnipeDest()
		}

		//Draw circle radius
		//c.beginPath()
		//c.arc(this.circleX, this.circleY, this.stats["Range"] * gameBoard.blockPixelWidth, 0, Math.PI * 2, false);
		//c.lineWidth = 5;
		//c.strokeStyle = "black";
		//c.stroke();
		//c.closePath();
	}

	doSnipeDest(){

		var returned = getClosestBlockPos(this.circleX, this.circleY)
		this.destX = returned[0];
		this.destY = returned[1];

		var diffX = this.circleX - this.destX;
		var diffY = this.circleY - this.destY;

		this.velX = -Math.cos(Math.atan2(diffY, diffX))
		this.velY = -Math.sin(Math.atan2(diffY, diffX))
	}

	handleBlockHit(){
		//Damage block
		var result = checkTouchingSideAndBrick(this)
		var isTouchingBlock = result[0];
		var block = result[1];
		var randArray = [0.7, 0.8, 0.9, 0.95, 1, 1.05, 1.1, 1.2, 1.3]
		var randPercent = randArray[Math.floor(Math.random()*randArray.length)];
		if(isTouchingBlock != false){

			damageBlock(block, this.stats["Damage"]);
		}
		if (isTouchingBlock == "leftTouching"){
			this.velX = Math.abs(this.velX) * randPercent;
			this.circleX += 5;
		} 
		if (isTouchingBlock == "rightTouching"){
			this.velX = -Math.abs(this.velX) * randPercent;
			this.circleX -= 5;
		} 
		if (isTouchingBlock == "topTouching"){
			//Positive
			this.velY = Math.abs(this.velY) * randPercent;
			this.circleY += 5;
		} 
		if (isTouchingBlock == "bottomTouching"){
			//Negative
			this.velY = -Math.abs(this.velY) * randPercent;
			this.circleY -= 5;
		}
	}
}


function getClosestBlockPos(posX, posY){
	var closestX = 9999;
	var closestY = 9999;
	var closestBlockPosX = undefined;
	var closestBlockPosY = undefined;
	for (i=0; i<gameBoard.blockWidth; i++){
		for (j=0; j<gameBoard.blockHeight; j++){
			arrayLoc = i + j*gameBoard.blockWidth
			checkBlock = gameBoard.gameArray[arrayLoc];
			rectX = gameBoard.blockPixelGap + (i*(gameBoard.blockPixelWidth)) + i*gameBoard.blockPixelGap;
			rectY = (j*gameBoard.blockPixelHeight) + gameBoard.blockPixelGap * (j + 1);
			rectWidth = gameBoard.blockPixelWidth;
			rectHeight = gameBoard.blockPixelHeight;
			if (!(checkBlock instanceof EmptyBlock)){
				xDist = Math.abs(rectX - posX)
				yDist = Math.abs(rectY - posY)
				if (xDist < closestY && yDist < closestY){
					//console.log(xDist, yDist)
					closestX = xDist;
					closestY = yDist;
					closestBlockPosX = rectX;
					closestBlockPosY = rectY;
				}
			}
		}
	}
	return [closestBlockPosX, closestBlockPosY]
}

function damageNearbyBlocks(posX, posY, range, damage){
	//Checks the center of each block from the X,Y coords


	for (i=0; i<gameBoard.blockWidth; i++){
		for (j=0; j<gameBoard.blockHeight; j++){
			arrayLoc = i + j*gameBoard.blockWidth
			checkBlock = gameBoard.gameArray[arrayLoc];
			rectX = gameBoard.blockPixelGap + (i*(gameBoard.blockPixelWidth)) + i*gameBoard.blockPixelGap;
			rectY = (j*gameBoard.blockPixelHeight) + gameBoard.blockPixelGap * (j + 1);
			rectWidth = gameBoard.blockPixelWidth;
			rectHeight = gameBoard.blockPixelHeight;
			if (!(checkBlock instanceof EmptyBlock)){
				//console.log(rectX + (rectWidth / 2), rectY + (rectHeight / 2))
				xDist = Math.abs(rectX - posX)
				yDist = Math.abs(rectY - posY)
				if (xDist < range && yDist < range){
					damageBlock(checkBlock, damage)
				}
			}
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
				if (ui.currentTab == element.tab || element.tab == 0){ 
					element.runFunction(element.params);
				}

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
	game.drawAndUpdateBalls();
	ui.drawTabOne();

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
	animateLoop();

}

Main();