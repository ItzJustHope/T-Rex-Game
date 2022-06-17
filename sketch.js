var PLAY= 1;
var END= 0
var Gamestate= PLAY
var trex, trex_running, edges;
var ground, groundImage;
var invis;
var clouds, cloudImage;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6
var value
var cloudGroup
var obstacleGroup

var checkpoint, die, jump;

var score = 0
var gameOver, restart
var gameOverImg, restartImg
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png")
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  checkpoint = loadSound("checkpoint.mp3")
  die = loadSound("die.mp3")
  jump = loadSound("jump.mp3")
  gameOverImg = loadImage("gameOver.png")
  restartImg = loadImage("restart.png")
}


function setup(){
  createCanvas(windowWidth ,windowHeight);
  
  // creating trex
  trex = createSprite(50,height-240,20,50);
  trex.addAnimation("running", trex_running);

  ground= createSprite(width/2,height-20,width,20)
  ground.addImage("ground", groundImage)

  gameOver= createSprite(width/2 ,height/2, 60,70)
  gameOver.addImage(gameOverImg)

  restart= createSprite(width/2, height/2+60, 60, 70)
  restart.addImage(restartImg)

  restart.scale = 0.6
  gameOver.scale = 0.7

  invis = createSprite(width/2,height-5,width,15)
  invis.visible=false

  //adding scale and position to trex
  trex.scale = 0.5;
  trex.x = 50
  ground.x=ground.width/2

  cloudGroup= createGroup()
  obstacleGroup= createGroup()

  trex.debug=true
  trex.setCollider("Circle", 0, 0, 40)

  score = 0
}


function draw(){
  //set background color 
  background("grey");
  fill("white")
  textSize(20)
  text("score: " + score, 50, 40)

  if (Gamestate===PLAY){
    ground.velocityX = -7

    gameOver.visible = false
    restart.visible = false

    score= score + Math.round(getFrameRate()/60)

    if(score>0 && score%100 === 0){
    checkpoint.play()
    }

    if (ground.x<0){
      ground.x=ground.width/2
    }
    
    //logging the y position of the trex
    console.log(trex.y)
    
    //jump when space key is pressed
    if((touches.length>0 || keyDown("space")) && trex.y>=height-50){
      trex.velocityY = -10;
      touches = []
      jump.play()
    }
    
    trex.velocityY = trex.velocityY + 0.5;
    
    //stop trex from falling down
    
  
    Spawncloud()
    Spawnobstacle()



    if(obstacleGroup.isTouching(trex)){
      Gamestate= END
      die.play()
    
    
    
    }
  }

  else if(Gamestate===END){
    ground.velocityX=0

    restart.visible = true
    gameOver.visible = true

    obstacleGroup.setVelocityXEach(0)
  
    cloudGroup.setVelocityXEach(0)

    obstacleGroup.setLifetimeEach(-1)

    cloudGroup.setLifetimeEach(-1)

    if(mousePressedOver(restart) || touches.length>0){
    reset()
    touches = []
   }
  }
  
  trex.collide(invis)
  drawSprites();
}

function Spawncloud(){
  if (frameCount% 60 === 0){
    cloud= createSprite(width+10, height-380, 20, 30);
    cloud.addImage(cloudImage);
    cloud.velocityX= -4
    cloud.scale= 0.15
    cloud.y= random(40,120)
    cloud.lifetime=350

    cloud.depth = trex.depth
    trex.depth = trex.depth + 1

    cloudGroup.add(cloud)

  }
}


function Spawnobstacle(){
  if(frameCount% 60 === 0){
  obstacle= createSprite(width+10,height-40,20,30)
  obstacle.velocityX= -4
  value = Math.round(random(1,6))
  obstacle.lifetime=350

  switch(value){
    case 1: obstacle.addImage(obstacle1)
    obstacle.scale= 0.09
    break;
    case 2: obstacle.addImage(obstacle2)
    obstacle.scale= 0.09
    break;
    case 3: obstacle.addImage(obstacle3)
    obstacle.scale= 0.1
    break;
    case 4: obstacle.addImage(obstacle4)
    obstacle.scale= 0.05
    break;
    case 5: obstacle.addImage(obstacle5)
    obstacle.scale= 0.05
    break;
    case 6: obstacle.addImage(obstacle6)
    obstacle.scale= 0.1
    break;
    default:
    break;
  
  }

  obstacleGroup.add(obstacle)
  }
}


function reset(){
  Gamestate=PLAY
  gameOver.visible = false
  restart.visible = false
  score = 0

  obstacleGroup.destroyEach()
  cloudGroup.destroyEach()
}