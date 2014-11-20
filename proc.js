function timeProc(){
	//tile to tile
	if(character[0].x % tile_w == 0 && character[0].y % tile_w == 0 &&
		character[0].x >= 0 && character[0].x <= map_max_x*tile_w &&
		character[0].y >= 0 && character[0].y <= map_max_y*tile_w){

		for(var i = 0 ; i < character.length ; i++){
			character[i].predirect = character[i].direct;				
		}
		character[0].direct = preDirect;

		for(var i = 0 ; i < character.length-1 ; i++){
			character[i+1].direct = character[i].predirect;
		}
				
		enemyCount++;
		if(enemyCount == 10){
			createEnemy();
			enemyCount = 0;
		}
		//alert("ddddd");
	}

	//speed pixels to speed pixels
	for(var i = 0 ; i < character.length ; i++){
		if(character[i].direct == 4){
			character[i].x -= speed;
			if(character[i].x < 0){
				character[i].x = (map_max_x)*tile_w - speed;
				if(i==0)minusHP();
			}
		}else if(character[i].direct == 6){
			character[i].x += speed;
			if(character[i].x > (map_max_x-1)*tile_w){
				character[i].x = -tile_w + speed;
				if(i==0)minusHP();
			}
		}else if(character[i].direct == 0){
			character[i].y -= speed;
			if(character[i].y < 0){
				character[i].y = (map_max_y)*tile_w - speed;
				if(i==0)minusHP();
			}
		}else if(character[i].direct == 2){
			character[i].y += speed;
			if(character[i].y > (map_max_y-1)*tile_w){
				character[i].y = -tile_w + speed;
				if(i==0)minusHP();
			}
		}
	}

	//crash
	crashEnemy();

	//ball
	crashBall();
	
	draw();

	//count
	if(crashedCount > 0)crashedCount--;
}
function draw(){
	var canvas = document.getElementById('canvas1');
	var content = canvas.getContext("2d");
	content.save();
	content.scale(rate,rate);
	
	//background
	content.drawImage(background,margin_x - 70,0);
	if(crashedCount == (tile_w / speed)*2 || crashedCount == (tile_w / speed)*2 - 6){
		content.fillStyle="#FF0000";
		content.fillRect(0,0,background.width,height);
	}
	

	count++;
	if(count == 20)count = 0;
	var frameCount = parseInt(count/10);
	//enemy
	for(var i = 0 ; i < 4 ; i++){
		if(enemy[i].life == true)
			//content.drawImage(whatCharac(character[0].characNum, frameCount + character[0].direct),(character[0].x+tile_w) + margin_x,character[0].y+tile_w + margin_y);
		content.drawImage(whatEnemy(enemy[i].enemyNum, frameCount),enemy[i].tile_x*tile_w + margin_x,enemy[i].tile_y*tile_w + margin_y);
	}
	//character
	for(var i = character.length-1 ; i >= 0  ; i--){
		content.drawImage(whatCharac(character[i].characNum, frameCount + character[i].direct),character[i].x + margin_x,character[i].y + margin_y);
	}
	
	//ball
	for(var i = 0 ; i < 3 ; i++)content.drawImage(ballBitmap, ball[i].tile_x*tile_w + margin_x,ball[i].tile_y*tile_w + margin_y);

	content.restore();
}

function handleKeyDrag(event){
	if (event.touches.length < 2)event.preventDefault();
	touch_x = event.touches[0].pageX;
	touch_y = event.touches[0].pageY;
}

function handleKeyDragMove(event){
	if (event.touches.length < 2)event.preventDefault();
	touch_after_x = event.touches[0].pageX;
	touch_after_y = event.touches[0].pageY;
}

function handleKeyDragUp(event){
	if (event.touches.length < 2)event.preventDefault();
	var absX = Math.abs(touch_x - touch_after_x);
	var absY = Math.abs(touch_y - touch_after_y);
	if(absX > absY){
		if(touch_x < touch_after_x)preDirect = 6;
		else if(touch_x > touch_after_x)preDirect = 4;
	}else {
		if(touch_y < touch_after_y)preDirect = 2;
		else if(touch_y > touch_after_y)preDirect = 0;
	}

	touch_x = touch_after_x;
	touch_y = touch_after_y;
}

function handleKeyDown(e){
	switch(e.keyCode){
		case 37: 
			key_left = true;
			preDirect = 4;
		break;
		case 38: 
			key_up = true;
			preDirect = 0;
		break;
		case 39: 
			key_right = true;
			preDirect = 6;
		break;
		case 40: 
			key_down = true;
			preDirect = 2;
		break;
		case 13:
			toggleFullScreen();
		break;
	}
}
function handleKeyUp(e){
	switch(e.keyCode){
		case 37: 
			key_left = false;
		break;
		case 38: 
			key_up = false;
		break;
		case 39: 
			key_right = false;
		break;
		case 40: 
			key_down = false;
		break;
	}
}




function createEnemy(){
	for(var i = 0 ; i < 4 ; i++){		
		if(enemy[i].life == false){	
			enemy[i].life = true;
			enemy[i].tile_x = Math.floor((Math.random() * 6) + 0);
			enemy[i].tile_y = Math.floor((Math.random() * 9) + 0);
			while(checkWhatInCurrentPosition(enemy[i].tile_x, enemy[i].tile_y, 2, i)){
				enemy[i].tile_x = Math.floor((Math.random() * 6) + 0);
				enemy[i].tile_y = Math.floor((Math.random() * 9) + 0);
			}
			enemy[i].enemyNum = Math.floor((Math.random() * 4) + 0);
			//alert("num: " + enemy[i].enemyNum + " x: " + enemy[i].tile_x + " y: " + enemy[i].tile_y);
			break;			
		}
		
	}
}


var crashedCount = 0;
var hp_max = 5;
var hp = hp_max;
function crashEnemy()
{
	for(var i = 0 ; i < 4 ; i++){		
		if(enemy[i].life == true){			
			if(Math.abs(character[0].x - enemy[i].tile_x*tile_w) < tile_w && Math.abs(character[0].y - enemy[i].tile_y*tile_w) < tile_w){	
				minusHP();
				break;	
			}					
		}		
	}
}

function minusHP()
{
	if(crashedCount == 0){
		crashedCount = (tile_w / speed)*2; // 24
		hp--;
		if(hp == 0){
			//game over
		}
	}
}



function createBall(){
	for(var i = 0 ; i < 3 ; i++){	
		//alert("wile 전에 경고창 i: " + i);			
		ball[i].tile_x = Math.floor((Math.random() * 6) + 0);
		ball[i].tile_y = Math.floor((Math.random() * 9) + 0);
		
		//alert("wile 전에 경고창 flag: " + flag);	
		while(checkWhatInCurrentPosition(ball[i].tile_x, ball[i].tile_y, 1, i)){
			//alert("wile 시작 ");
			ball[i].tile_x = Math.floor((Math.random() * 6) + 0);
			ball[i].tile_y = Math.floor((Math.random() * 9) + 0);
		}

		//alert("end-while");
		ball[i].whatCharac = Math.floor((Math.random() * 4) + 0);
		ball[i].whatItem = 1;
	}
	
	
}


function crashBall()
{
	for(var i = 0 ; i < 3 ; i++){				
		if(Math.abs(character[0].x - ball[i].tile_x*tile_w) < tile_w && Math.abs(character[0].y - ball[i].tile_y*tile_w) < tile_w){
			//create ball
			createBall();

			//create character
			var mini_x = character[character.length-1].x;
			var mini_y = character[character.length-1].y;
			if(character[character.length-1].direct == 4){ //left
				mini_x += tile_w;				
			}else if(character[character.length-1].direct == 6){ //right
				mini_x -= tile_w;	
			}else if(character[character.length-1].direct == 0){ //up
				mini_y += tile_w;	
			}else if(character[character.length-1].direct == 2){ //down
				mini_y -= tile_w;	
			}
			character.push({characNum:ball[i].whatCharac, direct:character[character.length-1].direct, x:mini_x, y:mini_y});
			
			//get item

		}							
	}
}



function checkWhatInCurrentPosition(tile_x, tile_y, what_, number)
{
	var what = what_; // 1: ball, 2: enemy
	var flag = false;
	
	
	//if(what_ == 1){ // in case of ball		
		for(var i = 0 ; i < 3 ; i++){	
			if(what == 1){
				if(i != number && ball[i].tile_x == tile_x && ball[i].tile_y == tile_y){
					return true;
				}
			}else {
				if(ball[i].tile_x == tile_x && ball[i].tile_y == tile_y){
					return true;
				}
			}
		}
	//}
	// in case of enemy
		for(var i = 0 ; i < 4 ; i++){
			if(enemy[i].life == true){
				if(what == 2){
					if(i != number && enemy[i].tile_x == tile_x && enemy[i].tile_y == tile_y){
						return true;
					}
				}else {
					if(enemy[i].tile_x == tile_x && enemy[i].tile_y == tile_y){
						return true;
					}
				}
			}
		}

	if(parseInt(character[0].x/tile_w) == tile_x && parseInt(character[0].y/tile_w) == tile_y)return true;
	return false; // nothing
}



//----------------------------------------------------------

function noNeed()
{
	//draw
	//map // ��� �и��ؼ� ����� ���
	/*
	for(i = 0 ; i < map_max_y ; i++){
		for(j = 0; j < map_max_x; j++){
			content.drawImage(tileBitmap[map[i*7 + j]], j * tile_w + margin_x, i*tile_w + margin_y);
		}
	}
	content.drawImage(backBitmap[0], margin_x - 70, 55);
	content.drawImage(backBitmap[1], margin_x + map_max_x*tile_w, 55);
	content.drawImage(backBitmap[2], margin_x - 70, 0);
	content.drawImage(backBitmap[3], margin_x - 70, 55 +  map_max_y*tile_w);
	*/
}