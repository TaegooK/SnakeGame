function timeProc(){
	//tile to tile
	if(character[0].x % tile_w == 0 && character[0].y % tile_w == 0 &&
		character[0].x >= 0 && character[0].x <= map_max_x*tile_w &&
		character[0].y >= 0 && character[0].y <= map_max_y*tile_w){

		//change direction
		if(character[0].direct == 4){ // left
			if(preDirect == 6 && character.length > 1)preDirect = 4;
		}else if(character[0].direct == 6){ //right
			if(preDirect == 4 && character.length > 1)preDirect = 6;
		}else if(character[0].direct == 0){ //up
			if(preDirect == 2 && character.length > 1)preDirect = 0;
		}else if(character[0].direct == 2){ //down
			if(preDirect == 0 && character.length > 1)preDirect = 2;
		}

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

		//existed somthing in front of character
		var check_x = character[0].x;
		var check_y = character[0].y;
		
		if(character[0].direct == 4){ // left
			check_x -= tile_w;
			if(check_x < 0){
				check_x = (map_max_x-1)*tile_w;
			}
		}else if(character[0].direct == 6){ //right
			check_x += tile_w;
			if(check_x > (map_max_x-1)*tile_w){
				check_x = 0;
			}
		}else if(character[0].direct == 0){ //up
			check_y -= tile_w;
			if(check_y < 0){
				check_y = (map_max_y-1)*tile_w;
			}
		}else if(character[0].direct == 2){ //down
			check_y += tile_w;
			if(check_y > (map_max_y-1)*tile_w){
				check_y = 0;
			}
		}
		//crash enemy
		crashEnemy(check_x, check_y);
		//crash ball
		crashBall(check_x, check_y);
		//crash charac
		crashCharacter(check_x, check_y);


		//crash
		if(check_crash < 2)check_crash++;
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


	
	
	draw();

	//count
	if(crashedCount > 0)crashedCount--;
	if(attackCount > 0)attackCount--;
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

	//item
	//sword
	for(var i = character.length-1 ; i >= 0  ; i--){
		if(character[i].item == 1)content.drawImage(swordBitmap, character[i].x + tile_w/4 + margin_x,character[i].y - tile_w/2 + margin_y);
	}

	//effect
	//sword
	if(attackCount > 0){
		var num = parseInt(attackCount/frame_speed);
		content.drawImage(attackBitmap[4 - num], effect_tile_x*tile_w + margin_x,effect_tile_y*tile_w + margin_y);
	}

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
		case 32: // space bar // change
			changeCharac();
		break;
		case 16: // shift
		break;
		case 17: // ctrl
		break;
		case 27: // esc
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
			enemy[i].tile_x = Math.floor((Math.random() * 7) + 0);
			enemy[i].tile_y = Math.floor((Math.random() * 10) + 0);
			while(checkWhatInCurrentPosition(enemy[i].tile_x, enemy[i].tile_y, 2, i)){
				enemy[i].tile_x = Math.floor((Math.random() * 7) + 0);
				enemy[i].tile_y = Math.floor((Math.random() * 10) + 0);
			}
			enemy[i].enemyNum = Math.floor((Math.random() * 5) + 0);
			enemy[i].hp = enemy[i].enemyNum+1;
			//alert("num: " + enemy[i].enemyNum + " x: " + enemy[i].tile_x + " y: " + enemy[i].tile_y);
			break;			
		}
		
	}
}


var crashedCount = 0;
var hp_max = 5;
var hp = hp_max;
var check_crash = 2;
var attackCount = 0;
var effect_tile_x = -10;
var effect_tile_y = -10;
var frame_speed = 3;
function crashEnemy(pos_x, pos_y)
{
	for(var i = 0 ; i < 4 ; i++){		
		if(enemy[i].life == true){			
			if(pos_x == enemy[i].tile_x*tile_w && pos_y == enemy[i].tile_y*tile_w){	
				if(character[0].item == 1){
					attackEnemy(i);
				}else {
					minusHP();
				}				
				break;	
			}					
		}		
	}
}

function attackEnemy(enemyNum)
{
	attackCount = 5 * frame_speed - 1;
	enemy[enemyNum].hp -= 2;
	character[0].item = 0;
	effect_tile_x = enemy[enemyNum].tile_x;
	effect_tile_y = enemy[enemyNum].tile_y;
	if(enemy[enemyNum].hp <= 0){
		//die
		enemy[enemyNum].life = false;
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
		ball[i].tile_x = Math.floor((Math.random() * 7) + 0);
		ball[i].tile_y = Math.floor((Math.random() * 10) + 0);
		
		//alert("wile 전에 경고창 flag: " + flag);	
		while(checkWhatInCurrentPosition(ball[i].tile_x, ball[i].tile_y, 1, i)){
			//alert("wile 시작 ");
			ball[i].tile_x = Math.floor((Math.random() * 7) + 0);
			ball[i].tile_y = Math.floor((Math.random() * 10) + 0);
		}

		//alert("end-while");
		ball[i].whatCharac = Math.floor((Math.random() * 5) + 0);
		ball[i].whatItem = 1;
	}
	
	
}


function crashBall(pos_x, pos_y)
{
	for(var i = 0 ; i < 3 ; i++){				
		if(pos_x == ball[i].tile_x*tile_w && pos_y == ball[i].tile_y*tile_w){
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
			var defultItem = 0;
			if(ball[i].whatCharac == 0 || ball[i].whatCharac == 2 || ball[i].whatCharac == 3)defultItem = 1;
			character.push({characNum:ball[i].whatCharac, direct:character[character.length-1].direct, x:mini_x, y:mini_y, item:defultItem});
			
			//get item
			var item = Math.floor((Math.random() * 6) + 0);
			if(item == 0){ // nothing
			}else if(item == 1){ // half
				character.splice(parseInt(character.length/2), character.length - parseInt(character.length/2));
			}else { // sword
				character[0].item = 1;
			}
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



function crashCharacter(pos_x, pos_y)
{
	for(var i = 1; i < character.length ; i++){
		if(pos_x == character[i].x && pos_y == character[i].y){
			minusHP();
		}
	}
}





function changeCharac()
{
	var temp_characNum = character[0].characNum;
	var temp_item = character[0].item;
	for(var i = 1; i < character.length ; i++){
		character[i-1].characNum = character[i].characNum;
		character[i-1].item = character[i].item;
	}
	character[character.length - 1].characNum = temp_characNum;
	character[character.length - 1].item = temp_item;
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