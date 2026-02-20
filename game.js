const canvas=document.getElementById("gameCanvas");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

const ground=canvas.height-120;
const gravity=0.8;

let paused=false;
let score=0;
let coinsCollected=0;

/* ===== LOAD IMAGES ===== */
const bgImg=new Image();
bgImg.src="assets/background.jpg";

const playerImg=new Image();
playerImg.src="assets/player.png";

const botImg=new Image();
botImg.src="assets/bot.png";

/* ===== LOAD AUDIO ===== */
const bgm=new Audio("assets/bgm.mp3");
bgm.loop=true;

const jumpSound=new Audio("assets/jump.mp3");
const coinSound=new Audio("assets/coin.wav");
const deathSound=new Audio("assets/death.mp3");

const botVoice=new Audio("assets/bot.mp3");
const playerVoice=new Audio("assets/player.mp3");

/* ===== CHARACTER ===== */
class Stickman{
constructor(x,img){
this.x=x;
this.y=ground;
this.vel=0;
this.jumping=false;
this.img=img;
}
jump(){
if(!this.jumping){
this.vel=-15;
this.jumping=true;
jumpSound.play();
}
}
update(){
this.vel+=gravity;
this.y+=this.vel;
if(this.y>=ground){
this.y=ground;
this.jumping=false;
}
}
draw(){
ctx.drawImage(this.img,this.x-30,this.y-90,60,60);

ctx.beginPath();
ctx.moveTo(this.x,this.y-30);
ctx.lineTo(this.x,this.y+10);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(this.x,this.y-20);
ctx.lineTo(this.x-20,this.y);
ctx.moveTo(this.x,this.y-20);
ctx.lineTo(this.x+20,this.y);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(this.x,this.y+10);
ctx.lineTo(this.x-20,this.y+40);
ctx.moveTo(this.x,this.y+10);
ctx.lineTo(this.x+20,this.y+40);
ctx.stroke();
}
}

const player=new Stickman(400,playerImg);
const bot=new Stickman(200,botImg);

/* ===== OBSTACLE ===== */
let obstacleX=canvas.width;

/* ===== COINS ===== */
let coins=[];

function spawnCoin(){
coins.push({
x:canvas.width,
y:ground-60
});
}
setInterval(spawnCoin,3000);

/* ===== CONTROLS ===== */
window.addEventListener("keydown",e=>{
if(e.code==="Space") player.jump();
if(e.code==="Escape") togglePause();
});

/* ===== VOICE LOOPS ===== */
function startVoices(){
setTimeout(()=>{
playerVoice.play();
setInterval(()=>playerVoice.play(),21000);
},6000);

botVoice.play();
setInterval(()=>botVoice.play(),15000);
}

/* ===== PAUSE ===== */
function togglePause(){
paused=!paused;
document.getElementById("pauseMenu").style.display=paused?"block":"none";
}

function resumeGame(){
paused=false;
document.getElementById("pauseMenu").style.display="none";
}

/* ===== GAME LOOP ===== */
function gameLoop(){
if(paused) return requestAnimationFrame(gameLoop);

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.drawImage(bgImg,0,0,canvas.width,canvas.height);

ctx.fillStyle="green";
ctx.fillRect(0,ground,canvas.width,120);

score+=0.1;

/* OBSTACLE */
obstacleX-=6;
ctx.fillStyle="gray";
ctx.fillRect(obstacleX,ground-40,40,40);
if(obstacleX<-40){
obstacleX=canvas.width+Math.random()*400;
}

/* COINS */
coins.forEach((coin,index)=>{
coin.x-=6;
ctx.fillStyle="gold";
ctx.beginPath();
ctx.arc(coin.x,coin.y,10,0,Math.PI*2);
ctx.fill();

if(Math.abs(player.x-coin.x)<20 && Math.abs(player.y-coin.y)<20){
coinsCollected++;
coinSound.play();
coins.splice(index,1);
}
});

/* UPDATE */
player.update();
bot.update();

if(bot.x<player.x-80){
bot.x+=1.5;
}

/* COLLISION */
if(player.x+20>obstacleX && player.x-20<obstacleX+40 && player.y>ground-40){
deathSound.play();
bgm.pause();
setTimeout(()=>location.reload(),2000);
return;
}

player.draw();
bot.draw();

/* HUD */
ctx.fillStyle="white";
ctx.fillText("Score: "+Math.floor(score),20,40);
ctx.fillText("Coins: "+coinsCollected,20,70);

requestAnimationFrame(gameLoop);
}

/* START */
window.onload=()=>{
bgm.play();
startVoices();
gameLoop();
};