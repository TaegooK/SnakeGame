function aud_play_pause(){ 
	var myAudio = document.getElementById("bgm"); 
	if (myAudio.paused)
	{ 
		myAudio.play();
	} else 
	{ 
		myAudio.pause(); 
	} 
}



function effect_sound(id, name){ 
	var myAudio = document.getElementById(id); 
	myAudio.src = name;
	myAudio.pause();
	myAudio.play();
}