var update_interval;
var gravity_interval;
var posX = 200;
var posY = 200;
var BASE_SPEED = 3;
var current_speed = 3;
var jump_height = 12;
var gravity_const = 1;
var GRAVITY_CAP = 8;
var WORLD_SIZE = 3500;
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


GRAPHICS.moving_block = "images/moving_block.png";

GRAPHICS.coin = "images/coin.gif";

GRAPHICS.small_brick = "images/small_brick.png";
GRAPHICS.ground_brick = "images/ground_brick.png";
GRAPHICS.ground_pipe = "images/SuperMarioBackgroundSprite.gif";
GRAPHICS.ground_castle = "images/SuperMarioBackgroundSprite.gif";
GRAPHICS.ground_flag = "images/SuperMarioBackgroundSprite.gif";
GRAPHICS.question_block = "images/BrickElementsSprite.png";
GRAPHICS.block_brick = "images/BrickElementsSprite.png";
GRAPHICS.mushroom_big = "images/BrickElementsSprite.png";
GRAPHICS.take_coin = "images/BrickElementsSprite.png";

var bOnSurface = false;
var bCanJump = true;
var GROUNDED_TIMER = 500;
var BOUNCE_FACTOR = 2;
var elevators = [];
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
var isGameOver = false;
var marioLives = 3;

function IsMarioAtHole() {
    var ret = false;

    if ((sprite.offsetTop + sprite.width) >= stage.offsetHeight) {
        ret = true;
    }

    return ret;
}
function ResetMarioPosition() {
    sprite.offsetTop = 200;
    sprite.offsetLeft = 200;
    sprite.style.left = "200px";
    sprite.style.top = "200px";
    stage.scrollLeft = 0;
    posX = 200;
    posY = 200;
}

function update() {

    if (isGameOver)
        return;

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

    //correct character position if hes colliding with objects
    collisionAdjust();

    //render results
    render();

    //checking if Mario has fallen
    if (IsMarioAtHole()) {
        marioLives--;
        console.log(marioLives);
        if (marioLives === 0) {
            console.log("game over");
            gameIsOver();
        }
        else {
            console.log("pokaji jivotite ekran");
            AddMarioLivesUI(-1);
        }

    }
}

function AddMarioLivesUI(value) {
    ResetMarioPosition();
    var lifes_left = document.getElementById("lifes_holder");
    lifes_left.style.visibility = "visible";
    var live_counter = document.getElementById("live_counter");
    var status_bar = document.getElementById("status_bars");
    status_bar.style.backgroundColor = "#000";
    console.log(parseInt(live_counter.innerHTML), value);
    live_counter.innerHTML = marioLives;
    if (marioLives === 0) {
        // ResetMarioPosition();
    }
    startLeverFromTheBeginning();
}
function startLeverFromTheBeginning() {
    console.log("ehoooo");

    setInterval(function() {
        var lifes_left = document.getElementById("lifes_holder");
        lifes_left.style.visibility = "hidden";
        var status_bar = document.getElementById("status_bars");
        status_bar.style.backgroundColor = "#3399FF";
        sprite.clssName ="mario_small";
    }, 3000);
}

function gameIsOver() {
    var game_over = document.getElementById("game_over_play_again");
    var status_bar = document.getElementById("status_bars");
    status_bar.style.backgroundColor = "black";
    game_over.style.visibility = "visible";
    isGameOver = true;
}
function initLevel() {
    posX = 200;
    posY = 200;
    BASE_SPEED = 3;
    current_speed = 3;
    jump_height = 12;
    gravity_const = 1;
    GRAVITY_CAP = 8;
    WORLD_SIZE = 3500;
    keysDown = [];
    collidables = [];
    OBJ_ABOVE = 1;
    OBJ_BELOW = 2;
    OBJ_LEFT = 3;
    OBJ_RIGHT = 4;
    bOnSurface = false;
    bCanJump = true;
    GROUNDED_TIMER = 500;
    BOUNCE_FACTOR = 2;
    elevators = [];
    coins = [];
    hitables = [];
    coinboxes = [];
    mushroomboxes = [];
    warppipes = [];
    mushrooms = [];
    bAttemptingToWarp = false;
    theta = 0;
    MOTION_LEFT = 0;
    MOTION_RIGHT = 1;
    hoizontal_motion_direction = MOTION_RIGHT;
    isGameOver = false;
    marioLives = 3;

    var game_over = document.getElementById("game_over_play_again");
    var status_bar = document.getElementById("status_bars");
    status_bar.style.backgroundColor = "#3399FF";
    game_over.style.visibility = "hidden";
    
    document.getElementById('points').innerHTML = 0;
    document.getElementById('coin_counter').innerHTML = 0;
    document.getElementById('timer_seconds').innerHTML = 150;
}

function resetGame() {
    stage.innerHTML = '';
    var mario_img = document.createElement('img');
    stage.appendChild(mario_img);
    mario_img.id = "sprite";
    mario_img.className = "mario_small";
    mario_img.src = "images/running_right.gif";

    initLevel();
    renderWorld();
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
        getPoints(200);
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
        removeFromCollection(coinboxes, obj);
        removeFromCollection(hitables, obj);



        var c = document.createElement("div");
        stage.appendChild(c);
        var top_str = obj.style.top;
        var top = parseInt(top_str);
        c.style.position = "absolute";
        c.style.top = top + "px";
        c.style.left = (obj.offsetLeft + (obj.offsetWidth / 2)) - (c.offsetWidth / 2) - 7 + "px";
        c.style.width = "15px";
        c.style.height = "15px";
        c.style.backgroundImage = "url(" + GRAPHICS.take_coin + ")";
        c.style.backgroundPosition = "-88px 0px";
        c.style.backgroundRepeat = 'no-repeat';
        obj.style.zIndex = 1000;
        obj.style.backgroundPosition = "-54px 0px";

        animatePoints(c, 200);
        takeCoin();
        getPoints(200);

        animateUp(c, 8, 1, function() {
            stage.removeChild(c);
        });
    }
    if (mushroomboxes.indexOf(obj) > -1) {
        removeFromCollection(mushroomboxes, obj);
        removeFromCollection(hitables, obj);
        var c = document.createElement("div");
        stage.appendChild(c);
        var top_str = obj.style.top;
        var top = parseInt(top_str);
        c.style.position = "absolute";
        c.style.top = top + "px";
        c.style.left = (obj.offsetLeft + (obj.offsetWidth / 2)) - (c.offsetWidth / 2) - 8 + "px";
        c.style.width = "16px";
        c.style.height = "16px";
        c.style.backgroundImage = "url(" + GRAPHICS.mushroom_big + ")";
        c.style.backgroundPosition = "-104px 0px";
        c.style.backgroundRepeat = 'no-repeat';
        obj.style.zIndex = 1000;
        obj.style.backgroundPosition = "-54px 0px";
        mushrooms.push(c);

        collidables.push(c);
        coins.push(c);

        animateUp(c, 5, 1, function() {
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
    p.style.fontSize = "11px";
    p.style.left = obj.offsetLeft + "px";
    animateUp(p, 10, 3, function() {
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


    //AddMarioLivesUI(3);
    marioLives = 3;

    var ground_bricks = [];

    //setting the ground bricks of the level
    for (var i = 0; i < 78; i++) {
        var hole_offset = 0;
        if (i === 24) {
            hole_offset = 35;
        } else if (i === 30 || i === 53) {
            hole_offset = 45;
        }
        ground_bricks.push(dropGroundUnit(null, GRAPHICS.ground_brick, (i * 45) + hole_offset, stage.offsetHeight - 45, 45, 48, 0, 0, "repeat"));
        collidables.push(ground_bricks[i]);
    }

    setTimeout(function() {
        //setting pipes
        var pipe1 = dropGroundUnit(ground_bricks[10], GRAPHICS.ground_pipe, null, null, 33, 31, -308, -417, "no-repeat");
        collidables.push(pipe1);
        var pipe2 = dropGroundUnit(ground_bricks[14], GRAPHICS.ground_pipe, null, null, 33, 48, -270, -401, "no-repeat");
        collidables.push(pipe2);
        var pipe3 = dropGroundUnit(ground_bricks[17], GRAPHICS.ground_pipe, null, null, 33, 63, -230, -385, "no-repeat");
        collidables.push(pipe3);
        var pipe4 = dropGroundUnit(ground_bricks[20], GRAPHICS.ground_pipe, null, null, 33, 63, -230, -385, "no-repeat");
        collidables.push(pipe4);
        var pipe5 = dropGroundUnit(ground_bricks[57], GRAPHICS.ground_pipe, null, null, 33, 31, -308, -417, "no-repeat");
        collidables.push(pipe5);
        var pipe6 = dropGroundUnit(ground_bricks[62], GRAPHICS.ground_pipe, null, null, 33, 31, -308, -417, "no-repeat");
        collidables.push(pipe6);

        //adding small stone bricks/stairs
        for (var j = 0; j < 8; j++) {
            for (var i = 0; i < 10; i++) {
                if (i <= j)
                    continue;
                var stone = dropGroundUnit(ground_bricks[62], GRAPHICS.small_brick, (i * 20) + 11, -j * 20, 20, 20, 0, 0, "no-repeat");
                collidables.push(stone);
            }
        }

        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < 6; i++) {
                if (i <= j)
                    continue;
                var stone = dropGroundUnit(ground_bricks[50], GRAPHICS.small_brick, (i * 20) + 15, -j * 20, 20, 20, 0, 0, "no-repeat");
                collidables.push(stone);
            }
        }
        for (var j = 5; j > 0; j--) {
            for (var i = 5; i > 0; i--) {
                if (i <= j)
                    continue;
                var stone = dropGroundUnit(ground_bricks[53], GRAPHICS.small_brick, (j * 20) - 20, (i * 20) - 100, 20, 20, 0, 0, "no-repeat");
                collidables.push(stone);
            }
        }

        for (var j = 0; j < 5; j++) {
            for (var i = 0; i < 5; i++) {
                if (i <= j)
                    continue;
                var stone = dropGroundUnit(ground_bricks[43], GRAPHICS.small_brick, (i * 20), -j * 20, 20, 20, 0, 0, "no-repeat");
                collidables.push(stone);
            }
        }
        for (var j = 5; j > 0; j--) {
            for (var i = 5; i > 0; i--) {
                if (i <= j)
                    continue;
                var stone = dropGroundUnit(ground_bricks[46], GRAPHICS.small_brick, (j * 20) - 10, (i * 20) - 100, 20, 20, 0, 0, "no-repeat");
                collidables.push(stone);
            }
        }

        //adding castle/end of level
        var castle = dropGroundUnit(ground_bricks[71], GRAPHICS.ground_castle, null, null, 80, 80, -247, -860, "no-repeat");
        //collidables.push(castle);

        //adding flag/end of level
        var flag = dropGroundUnit(ground_bricks[69], GRAPHICS.ground_flag, null, null, 20, 140, -247, -600, "no-repeat");
        collidables.push(flag);
        //stone place to be repaired
        var stone = dropGroundUnit(ground_bricks[69], GRAPHICS.small_brick, null, null, 20, 20, 0, 0, "no-repeat");
        collidables.push(stone);

        //adding question_blocks and brick_blocks on the map
        var q_block = dropGroundUnit(ground_bricks[6], GRAPHICS.question_block, (i * 32) - 29, -45, 16, 16, -18, 0, "no-repeat");
        hitables.push(q_block);
        collidables.push(q_block);
        coinboxes.push(q_block);

        for (var i = 0; i < 3; i++) {
            var b_brick = dropGroundUnit(ground_bricks[7], GRAPHICS.block_brick, i * 32, -45, 16, 16, 0, 0, "no-repeat");
            hitables.push(b_brick);
            collidables.push(b_brick);

        }
        for (var i = 0; i < 2; i++) {
            var q_block = dropGroundUnit(ground_bricks[8], GRAPHICS.question_block, (i * 32) - 29, -45, 16, 16, -18, 0, "no-repeat");
            hitables.push(q_block);
            collidables.push(q_block);
            if (i === 0) {
                mushroomboxes.push(q_block);
            } else {
                coinboxes.push(q_block);
            }
        }

        var q_block = dropGroundUnit(ground_bricks[6], GRAPHICS.question_block, (i * 32) + 12, -110, 16, 16, -18, 0, "no-repeat");
        hitables.push(q_block);
        collidables.push(q_block);
        coinboxes.push(q_block);


        for (var i = 0; i < 2; i++) {
            var b_brick = dropGroundUnit(ground_bricks[27], GRAPHICS.block_brick, i * 32, -45, 16, 16, 0, 0, "no-repeat");
            hitables.push(b_brick);
            collidables.push(b_brick);
        }
        var q_block = dropGroundUnit(ground_bricks[26], GRAPHICS.question_block, (i * 32) - 3, -45, 16, 16, -18, 0, "no-repeat");
        hitables.push(q_block);
        collidables.push(q_block);
        coinboxes.push(q_block);

        for (var i = 0; i < 8; i++) {
            var b_brick = dropGroundUnit(ground_bricks[28], GRAPHICS.block_brick, i * 16, -110, 16, 16, 0, 0, "no-repeat");
            hitables.push(b_brick);
            collidables.push(b_brick);
        }

        for (var i = 0; i < 3; i++) {
            var b_brick = dropGroundUnit(ground_bricks[32], GRAPHICS.block_brick, i * 16, -110, 16, 16, 0, 0, "no-repeat");
            hitables.push(b_brick);
            collidables.push(b_brick);
        }
        var q_block = dropGroundUnit(ground_bricks[31], GRAPHICS.question_block, (i * 32) - 3, -45, 16, 16, -18, 0, "no-repeat");
        hitables.push(q_block);
        collidables.push(q_block);
        coinboxes.push(q_block);

        var q_block = dropGroundUnit(ground_bricks[31], GRAPHICS.question_block, (i * 32) - 3, -110, 16, 16, -18, 0, "no-repeat");
        hitables.push(q_block);
        collidables.push(q_block);
        coinboxes.push(q_block);


        for (var i = 0; i < 2; i++) {
            var b_brick = dropGroundUnit(ground_bricks[35], GRAPHICS.block_brick, i * 16, -45, 16, 16, 0, 0, "no-repeat");
            hitables.push(b_brick);
            collidables.push(b_brick);
        }

        var b_brick = dropGroundUnit(ground_bricks[37], GRAPHICS.block_brick, i * 16, -45, 16, 16, 0, 0, "no-repeat");
        hitables.push(b_brick);
        collidables.push(b_brick);

        var q_block = dropGroundUnit(ground_bricks[38], GRAPHICS.question_block, (i * 16), -45, 16, 16, -18, 0, "no-repeat");
        hitables.push(q_block);
        collidables.push(q_block);
        coinboxes.push(q_block);
        var b_brick = dropGroundUnit(ground_bricks[38], GRAPHICS.block_brick, i * 16, -110, 16, 16, 0, 0, "no-repeat");
        hitables.push(b_brick);
        collidables.push(b_brick);

        var b_brick = dropGroundUnit(ground_bricks[39], GRAPHICS.block_brick, i * 16, -45, 16, 16, 0, 0, "no-repeat");
        hitables.push(b_brick);
        collidables.push(b_brick);


        for (var i = 0; i < 2; i++) {
            var b_brick = dropGroundUnit(ground_bricks[42], GRAPHICS.block_brick, (i * 48) - 20, -110, 16, 16, 0, 0, "no-repeat");
            hitables.push(b_brick);
            collidables.push(b_brick);
        }
        for (var i = 0; i < 2; i++) {
            var q_block = dropGroundUnit(ground_bricks[42], GRAPHICS.question_block, (i * 16) - 4, -110, 16, 16, -18, 0, "no-repeat");
            hitables.push(q_block);
            collidables.push(q_block);
            coinboxes.push(q_block);
        }

        for (var i = 0; i < 2; i++) {
            var b_brick = dropGroundUnit(ground_bricks[42], GRAPHICS.block_brick, (i * 16) - 4, -45, 16, 16, 0, 0, "no-repeat");
            hitables.push(b_brick);
            collidables.push(b_brick);
        }


        for (var i = 0; i < 2; i++) {
            var b_brick = dropGroundUnit(ground_bricks[59], GRAPHICS.block_brick, i * 32, -45, 16, 16, 0, 0, "no-repeat");
            hitables.push(b_brick);
            collidables.push(b_brick);
        }
        var q_block = dropGroundUnit(ground_bricks[58], GRAPHICS.question_block, (i * 32) - 3, -45, 16, 16, -18, 0, "no-repeat");
        hitables.push(q_block);
        collidables.push(q_block);
        coinboxes.push(q_block);


        //non stop coin box!
        /*      var q_block = dropGroundUnit(ground_bricks[4], GRAPHICS.question_block, 0, -40, 15, 15, -15, 0, "no-repeat");
         hitables.push(q_block);
         coinboxes.push(q_block);
         collidables.push(q_block);  */



        //Pipe allowing to get to lowest part of level
        var b9 = dropGroundUnit(ground_bricks[23], GRAPHICS.ground_pipe);
        warppipes.push(b9);
        collidables.push(b9);
    }, 1000);
}

function dropGroundUnit(onGroundUnit, graphic_src, left, bottom, width, height, bck_left, bck_top, repeat) {
    var ground_unit = document.createElement("div");
    ground_unit.src = graphic_src;
    stage.appendChild(ground_unit);
    ground_unit.style.width = width + "px";
    ground_unit.style.height = height + "px";
    ground_unit.style.position = "absolute";

    ground_unit.style.top = ((onGroundUnit != null) ? (onGroundUnit.offsetTop - ground_unit.offsetHeight + (bottom || 0)) : bottom) + "px";
    ground_unit.style.left = ((onGroundUnit != null) ? onGroundUnit.offsetLeft + (left || 0) : left) + "px";
    ground_unit.style.backgroundImage = "url(" + graphic_src + ")";
    ground_unit.style.backgroundPosition = bck_left + "px " + bck_top + "px";
    ground_unit.style.backgroundRepeat = repeat;

    ground_unit.style.zIndex = 2;
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

//Starting images onload and timers

setInterval(function() {
    if (document.getElementById('timer_seconds').innerHTML > 0) {
        document.getElementById('timer_seconds').innerHTML -= 1;
    }
    else {
        gameIsOver();
        //alert('Game Over. You ran out of time!');
        //location.reload();
    }
}, 1000);

function getPoints(points) {
    document.getElementById('points').innerHTML = parseInt(document.getElementById('points').innerHTML) + parseInt(points);
}
function changeVisibility() {
    document.getElementById('mario_game_image').style.display = "none";
    document.getElementById('mario_game_image_second').style.display = "block";
    setInterval(function() {
        document.getElementById('mario_game_image_second').style.display = "none";
        document.getElementById('stage').style.display = "block"
    }, 3000);
}

//Starting images onload and timers

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
        


        $(this).keydown(onkeyDown);
        $(this).keyup(onKeyUp);
    }, 500);
});


