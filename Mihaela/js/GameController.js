var update_interval;
var gravity_interval;
var posX = 200;
var posY = 200;
var BASE_SPEED = 3;
var current_speed = 3;
var jump_height = 12;
var gravity_const = 1;
var GRAVITY_CAP = 8;
var WORLD_SIZE = 2400;
var JUMP = 38;
var LEFT = 37;
var RIGHT = 39;
var DOWN = 40;
var keysDown = [];
var stage;
var sprite;
var coin_counter;
var collidables = [];
var OBJ_ABOVE = 1;
var OBJ_BELOW = 2;
var OBJ_LEFT = 3;
var OBJ_RIGHT = 4;
var GRAPHICS = {};
GRAPHICS.running_left = "images/running_left.gif";
GRAPHICS.running_right = "images/running_right.gif";
GRAPHICS.jumping_left = "images/jumping_left.gif";
GRAPHICS.jumping_right = "images/jumping_right.gif";
GRAPHICS.standing_left = "images/standing_left.gif";
GRAPHICS.standing_right = "images/standing_right.gif";
GRAPHICS.ground_brick = "images/ground_brick.png";
GRAPHICS.ground_pipe = "images/ground_pipe.gif";
GRAPHICS.question_block = "images/question_block.gif";
GRAPHICS.block_brick = "images/block_brick.gif";
GRAPHICS.moving_block = "images/moving_block.png";
GRAPHICS.mushroom_head = "images/mushroom_head.gif";
GRAPHICS.coin = "images/coin.gif";
GRAPHICS.small_brick = "images/small_brick.png";
GRAPHICS.enemiis="images/enemies.png";
GRAPHICS.koopa_troopa_right="images/enemies/frame7.png";
GRAPHICS.koopa_troopa_left="images/enemies/frame6.png";
var bOnSurface = false;
var bCanJump = true;
var goLeft=false;
var GROUNDED_TIMER = 500;
var BOUNCE_FACTOR = 2;
var elevators = [];
var enemies=[];
var coins = [];
var hitables = [];
var coinboxes = [];
var mushroomboxes = [];
var warppipes = [];
var mushrooms = [];
var bAttemptingToWarp = false;
var theta = 0;
var MOTION_LEFT = 0;
var MOTION_RIGHT = 1;
var hoizontal_motion_direction = MOTION_RIGHT;
var debug;
var collideCount;
var fpsCount;

function update() {
    fpsCount++;
    //update chacter motion appearance, running, jumping, standing..
    if (bOnSurface)
        sprite.src = (hoizontal_motion_direction == MOTION_RIGHT) ? GRAPHICS.standing_right : GRAPHICS.standing_left;
    if (keysDown.indexOf(DOWN) < 0)
        bAttemptingToWarp = false;

    //move character based on what keys are pressed
    for (key in keysDown) {
        switch (keysDown[key]) {
            case RIGHT:
                posX += current_speed;
                if (stage.scrollLeft < WORLD_SIZE)
                    stage.scrollLeft = sprite.offsetLeft - (stage.offsetWidth / 2) + (sprite.offsetWidth / 2);
                if (bOnSurface)
                    sprite.src = GRAPHICS.running_right;
                hoizontal_motion_direction = MOTION_RIGHT;
                break;
            case JUMP:
                if (bOnSurface && bCanJump) {
                    bCanJump = false;
                    setTimeout(function() {
                        bCanJump = true;
                    }, GROUNDED_TIMER);
                    gravity_const = -jump_height;
                    posY -= jump_height;
                    bOnSurface = false;
                    sprite.src = (hoizontal_motion_direction == MOTION_RIGHT) ? GRAPHICS.jumping_right : GRAPHICS.jumping_left;
                }
                break;
            case LEFT:
                if (bOnSurface)
                    sprite.src = GRAPHICS.running_left;
                posX -= current_speed;
                stage.scrollLeft = sprite.offsetLeft - (stage.offsetWidth / 2) + (sprite.offsetWidth / 2);
                hoizontal_motion_direction = MOTION_LEFT;
                break;
            case DOWN:
                if (bOnSurface)
                    bAttemptingToWarp = true;
                break;
            default:

        }
    }

    //update movable objects. elevators, bullets.
    theta++;
    //if (theta > 0) theta--;
    for (e in elevators) {
        elevators[e].style.top = 175 + 45 * Math.sin(theta / 80) + "px";
    }
   
  
	   var enemiLeftPos=parseInt( enemies[0].style.left)
	   var leftPosHolder=enemiLeftPos;
	  	  
      if(leftPosHolder<1190 && !goLeft){
      leftPosHolder++;	 
      enemies[0].style.left= leftPosHolder +"px";
	  enemies[0].src=GRAPHICS.koopa_troopa_right;
	   }
	   else {
	   goLeft=true;
	   leftPosHolder--;
	   enemies[0].style.left= leftPosHolder +"px";
	   enemies[0].src=GRAPHICS.koopa_troopa_left;
	   if(leftPosHolder<955)
	      {
	  	   goLeft=false;
	      }
	   }
	  
     
	
    //correct character position if hes colliding with objects
    collisionAdjust();

    //render results
    render();
}

function isObtainable(obj) {
    if (mushrooms.indexOf(obj) > -1) {
        removeFromCollection(mushrooms, obj);
        animateFormChange(sprite, sprite.className, "mario_big", 8);
        return true;
    }

    if (coins.indexOf(obj) > -1) {
        removeFromCollection(coins, obj);
        removeFromCollection(collidables, obj);
        animatePoints(obj, 200);
        stage.removeChild(obj);

        takeCoin();
        return true;
    }
    return false;
}

function playHitAnimation(obj) {
    if (hitables.indexOf(obj) > -1) {
        var currY = obj.offsetTop;
        obj.style.top = currY - 5 + "px";
        setTimeout(function() {
            obj.style.top = currY + "px"
        }, 200);
    }
    if (coinboxes.indexOf(obj) > -1) {
        var c = document.createElement("img");
        stage.appendChild(c);
        c.src = GRAPHICS.coin;
        c.style.position = "absolute";
        c.style.top = obj.offsetTop + "px";
        c.style.left = (obj.offsetLeft + (obj.offsetWidth / 2)) - (c.offsetWidth / 2) + "px";
        obj.style.zIndex = 1000;

        animatePoints(c, 200);
        takeCoin();

        animateUp(c, 8, 1, function() {
            stage.removeChild(c);
        });
    }
    if (mushroomboxes.indexOf(obj) > -1) {
        removeFromCollection(mushroomboxes, obj);
        var c = document.createElement("img");
        stage.appendChild(c);
        c.src = GRAPHICS.mushroom_head;
        c.style.position = "absolute";
        c.style.top = obj.offsetTop + "px";
        c.style.left = (obj.offsetLeft + (obj.offsetWidth / 2)) - (c.offsetWidth / 2) + "px";
        obj.style.zIndex = 1000;
        mushrooms.push(c);

        collidables.push(c);
        coins.push(c); //fix later

        animateUp(c, 8, 1, function() {
            //make moable back and forth
            //animateHorizontal(c,2);
        });
    }
}

function animatePoints(obj, pointsValue) {
    var p = document.createElement("div");
    p.className = "points";
    stage.appendChild(p);
    p.innerHTML = pointsValue;
    p.style.top = obj.offsetTop + "px";
    p.style.left = obj.offsetLeft + "px";
    animateUp(p, 8, 1, function() {
        stage.removeChild(p);
    });
}

function animateFormChange(obj, originalClassName, newClassName, times) {
    if (times == 0)
        return;
    obj.className = (times % 2 == 0) ? originalClassName : newClassName;
    setTimeout(function() {
        animateFormChange(obj, originalClassName, newClassName, --times);
    }, 100);
}

function animateUp(obj, amount, incY, endCallBack) {
    if (incY >= amount) {
        endCallBack();
        return;
    }
    obj.style.top = obj.offsetTop - incY + "px";
    setTimeout(function() {
        animateUp(obj, amount, incY + 1, endCallBack);
    }, 70);
}

function animateDown(obj, amount, incY, endCallBack) {
    if (incY >= amount) {
        endCallBack();
        return;
    }
    obj.style.top = obj.offsetTop + incY + "px";
    setTimeout(function() {
        animateDown(obj, amount, incY + 1, endCallBack);
    }, 70);
}

function animateHorizontal(obj, incX) {
    obj.style.left = obj.offsetLeft + incX + "px";
    setTimeout(function() {
        animateHorizontal(obj, incX);
    }, 30);
}

function isWarpPipe(obj) {
    if (warppipes.indexOf(obj) > -1 && bAttemptingToWarp) {
        clearTimeout(update_interval);
        animateDown(sprite, 15, 1, function() {
            window.location.reload();
        });
    }
}

function takeCoin() {
    coin_counter.innerHTML = parseInt(coin_counter.innerHTML) + 1;
}

function collisionAdjust() {
    if (posX < stage.offsetLeft)
        posX = 5;
    if (posX + sprite.offsetWidth > WORLD_SIZE)
        posX = WORLD_SIZE - sprite.offsetWidth;

    bOnSurface = false;
    collideCount = 0;

    for (c in collidables) {

        if (!isCloseToCharacter(collidables[c]))
            continue;
        collideCount++;

        switch (getSideColliding(collidables[c])) {
            case OBJ_ABOVE:
                if (isObtainable(collidables[c]))
                    break;
                posY = collidables[c].offsetTop - sprite.offsetHeight;
                bOnSurface = true;
                if (isWarpPipe(collidables[c]))
                    break;
                current_speed = BASE_SPEED;
                break;
            case OBJ_LEFT:
                if (isObtainable(collidables[c]))
                    break;
                posX = collidables[c].offsetLeft - sprite.offsetWidth;
                if (!bCanJump)
                    current_speed = 1;
                break;
            case OBJ_RIGHT:
                if (isObtainable(collidables[c]))
                    break;
                posX = collidables[c].offsetLeft + collidables[c].offsetWidth;
                if (!bCanJump)
                    current_speed = 1;
                break;
            case OBJ_BELOW:
                playHitAnimation(collidables[c]);
                if (isObtainable(collidables[c]))
                    break;
                posY = collidables[c].offsetTop + collidables[c].offsetHeight;
                gravity_const = BOUNCE_FACTOR;
                break;
            default:
                sprite.style.backgroundColor = "transparent";
        }
    }
}
//optimization for now change later
function isCloseToCharacter(obj) {
    return Math.abs(obj.offsetLeft - sprite.offsetLeft) < 100 && Math.abs(obj.offsetTop - sprite.offsetTop) < 100;
}

function getSideColliding(obj) {

    if (posY + sprite.offsetHeight > obj.offsetTop &&
            (posX + (sprite.offsetWidth / 2)) > obj.offsetLeft &&
            (posX + (sprite.offsetWidth / 2)) < (obj.offsetLeft + obj.offsetWidth) &&
            posY < obj.offsetTop &&
            posY + sprite.offsetHeight < (obj.offsetTop + obj.offsetHeight))
        return OBJ_ABOVE;
    if (posX + sprite.offsetWidth > obj.offsetLeft &&
            (posY + (sprite.offsetHeight / 2)) < (obj.offsetTop + obj.offsetHeight) &&
            posX < obj.offsetLeft &&
            (posY + (sprite.offsetHeight / 2)) > obj.offsetTop)
        return OBJ_LEFT;
    if (posX < (obj.offsetLeft + obj.offsetWidth) &&
            posX + sprite.offsetWidth > (obj.offsetLeft + obj.offsetWidth) &&
            posY + (sprite.offsetHeight / 2) > obj.offsetTop &&
            posY + (sprite.offsetHeight / 2) < (obj.offsetTop + obj.offsetHeight))
        return OBJ_RIGHT;
    if (posY > obj.offsetTop &&
            posY < (obj.offsetTop + obj.offsetHeight) &&
            posX + (sprite.offsetWidth / 2) > obj.offsetLeft &&
            posX + (sprite.offsetWidth / 2) < (obj.offsetLeft + obj.offsetWidth))
        return OBJ_BELOW;
    return 0;
}

function render() {
    sprite.style.left = posX + "px";
    sprite.style.top = posY + "px";
}

function renderWorld() {
    stage = document.getElementById('stage');
    sprite = document.getElementById('sprite');
    coin_counter = document.getElementById('coin_counter');

    var ground_bricks = [];
    for (var i = 0; i < 24; i++) {
        ground_bricks.push(dropGroundUnit(null, GRAPHICS.ground_brick, i * 100, stage.offsetHeight - 32));
        collidables.push(ground_bricks[i]);
    }

	
	
    setTimeout(function() {
        var b4 = dropGroundUnit(ground_bricks[9], GRAPHICS.ground_pipe);
        var b5 = dropGroundUnit(ground_bricks[8], GRAPHICS.question_block, -15, -140);
        hitables.push(b5);
        coinboxes.push(b5);

        for (var i = 0; i < 3; i++) {
            var bb1 = dropGroundUnit(ground_bricks[5], GRAPHICS.block_brick, i * 32, -45);
            hitables.push(bb1);
            collidables.push(bb1);
            if (i == 1) {
                mushroomboxes.push(bb1);
            }
        }
        for (var i = 0; i < 3; i++) {
            var bb1 = dropGroundUnit(ground_bricks[7], GRAPHICS.block_brick, i * 32, -45);
            hitables.push(bb1);
            collidables.push(bb1);
        }
        var b6 = dropGroundUnit(ground_bricks[10], GRAPHICS.moving_block);
        var b7 = dropGroundUnit(ground_bricks[17], GRAPHICS.moving_block);
        elevators.push(b6);
        elevators.push(b7);



        for (var i = 0; i < 3; i++) {
            var c1 = dropGroundUnit(ground_bricks[7], GRAPHICS.coin, i * 32, -10);
            collidables.push(c1);
            coins.push(c1);
        }
        for (var i = 0; i < 4; i++) {
            var c1 = dropGroundUnit(ground_bricks[6], GRAPHICS.coin, i * 32 + 5, -100 - i * 32);
            collidables.push(c1);
            coins.push(c1);
        }
        for (var i = 0; i < 3; i++) {
            var c1 = dropGroundUnit(ground_bricks[10], GRAPHICS.coin, i * 32, -232);
            collidables.push(c1);
            coins.push(c1);
        }

        for (var i = 1; i < 4; i++) {
            var bb1
            if (i == 3) {
                bb1 = dropGroundUnit(ground_bricks[15], GRAPHICS.question_block, i * 32, -i * 32);
                mushroomboxes.push(bb1);
            }
            else
                bb1 = dropGroundUnit(ground_bricks[15], GRAPHICS.block_brick, i * 32, -2 * 32);
            hitables.push(bb1);
            collidables.push(bb1);

            var c1 = dropGroundUnit(b7, GRAPHICS.coin, 12, -i * 32 - 140);
            collidables.push(c1);
            coins.push(c1);
        }

        for (var j = 0; j < 9; j++) {
            for (var i = 0; i < 11; i++) {
                if (i <= j)
                    continue;
                var c1 = dropGroundUnit(ground_bricks[20], GRAPHICS.small_brick, i * 20, -j * 20);
                collidables.push(c1);
            }
        }
		
        var b8 = dropGroundUnit(ground_bricks[12], GRAPHICS.ground_pipe);
        collidables.push(b8);
       

        var b9 = dropGroundUnit(ground_bricks[23], GRAPHICS.ground_pipe);
		
	
	  
       var koopa= dropGroundUnit(ground_bricks[10],GRAPHICS.koopa_troopa_right,i*30,0);
	   enemies[0]=koopa;
		

	
		
        warppipes.push(b9);
        collidables.push(b9);

        collidables.push(b4);
        collidables.push(b5);
        collidables.push(b6);
        collidables.push(b7);
    }, 1000);
}

function dropGroundUnit(onGroundUnit, graphic_src, left, bottom) {
    var ground_unit = document.createElement("img");
    ground_unit.src = graphic_src;
    stage.appendChild(ground_unit);
    ground_unit.style.position = "absolute";
    ground_unit.style.top = ((onGroundUnit != null) ? (onGroundUnit.offsetTop - ground_unit.offsetHeight + (bottom || 0)) : bottom) + "px";
    ground_unit.style.left = ((onGroundUnit != null) ? onGroundUnit.offsetLeft + (left || 0) : left) + "px";
    return ground_unit;
}


function gravity() {
    if (!bOnSurface)
        posY += gravity_const;
    gravity_const++;
    if (gravity_const > GRAVITY_CAP)
        gravity_const = GRAVITY_CAP; //put cap on falling speed;
}

function removeFromCollection(arr, obj) {
    if (arr.indexOf(obj) > -1)
        arr.splice(arr.indexOf(obj), 1);
}

function onkeyDown(e) {
    var evt = window.event || e;
    var keyunicode = e.charCode || e.keyCode;
    if (evt.preventDefault)
        evt.preventDefault();
    else {
        evt.returnValue = false;
    }
    if (keysDown.indexOf(keyunicode) > -1)
        return;
    keysDown.push(keyunicode);

    return false;
}

function onKeyUp(e) {
    var evt = window.event || e;
    var keyunicode = e.charCode || e.keyCode;
    removeFromCollection(keysDown, keyunicode);
}

function loadGraphics(onloaded) {
    for (g in GRAPHICS) {
        var img = new Image();
        img.src = GRAPHICS[g];
        img.onload = (function(h, g) {
            return function() {
                g = h;
            }
        })(img.src, GRAPHICS[g]);

    }
    onloaded();
}

function debugUpdate() {
    var str = "FPS: " + fpsCount + "\n" + "Collision space: " + collideCount + "\n";
    str += "Collidable: " + collidables.length;
    debug.value = str;

    fpsCount = 0;
}

$(document).ready(function() {

    debug = document.getElementById('debug');

    loadGraphics(function() {
        renderWorld();
        stage.scrollLeft = 0;


    });
    setTimeout(function() {
        update_interval = setInterval(function() {
            update();
        }, 15);
        gravity_interval = setInterval(function() {
            gravity();
        }, 30);

        //performance profile, heartbeat once a second
        setInterval(function() {
            debugUpdate();
        }, 1000);

        $(this).keydown(onkeyDown);
        $(this).keyup(onKeyUp);
    }, 500);
});


