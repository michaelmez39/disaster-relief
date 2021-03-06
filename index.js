// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application({
    width: 1200,
    height: 800
});

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}

function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

      //A collision might be occurring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {

        //There's definitely a collision happening
        hit = true;
      } else {

        //There's no collision on the y axis
        hit = false;
      }
    } else {

      //There's no collision on the x axis
      hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
  };
// The application will create a canvas element for you that you
// can then insert into the DOM
let wrapper = document.getElementById("wrapper");
wrapper.appendChild(app.view);

const txts = [
    { name: 'cat_right', url: 'new_cat_r.png' },
    { name: 'goal', url: 'goal.png' },
    { name: 'cat_left', url: 'new_cat.png'},
    { name: 'background', url: 'grass.jpg' },
    { name: 'blue', url: 'blue.png' },
    { name: 'block', url: 'block.png'}
]

let board_maize = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 2, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

];
// load the texture we need
app.loader.add(txts).load((loader, resources) => {
    // Create Textures
    // const background = new PIXI.Sprite(resources.background.texture);
    const cat = new PIXI.Sprite(resources.cat_right.texture);

    let walls = new Array();
    let objectives = new Array();
    for (let i = 0; i < board_maize.length; i++) {
        for (let j = 0; j < board_maize[i].length; j++) {
            if (board_maize[i][j] == 1) {
                let brick = new PIXI.Sprite(resources.block.texture);
                brick.width = 50;
                brick.height = 50;
                brick.y = i * 50;
                brick.x = j * 50;
                walls.push(brick);
                // console.log("brick x, brick y: " + brick.x + ", " + brick.y);
            } else if (board_maize[i][j] == 2) {
                let goal = new PIXI.Sprite(resources.goal.texture);
                goal.width = 50;
                goal.height = 50;
                goal.y = i * 50;
                goal.x = j * 50;
                goal.visible = true;
                objectives.push(goal);
                // console.log("brick x, brick y: " + brick.x + ", " + brick.y);
            }
        }
    }
    const brickWidth =  50; //app.renderer.width / walls.length;
    const brickHeight = 50; //app.renderer.height / walls[0].length;
    const dv = 3;

    // Positioning and resizing
    
    cat.x = 0;
    cat.y = app.renderer.height / 2;
    cat.vx = 0;
    cat.vy = 0;
    cat.width = brickWidth - 5;
    cat.height = brickHeight - 5;

    // background.width = app.renderer.width;
    // background.height = app.renderer.height;

    // Add sprites to scene

    // app.stage.addChild(background);
    for (brick of walls) {
        app.stage.addChild(brick);
    }
    for (objective of objectives) {
        app.stage.addChild(objective);
    }
    app.stage.addChild(cat);




    let left = keyboard("ArrowLeft"),
        up = keyboard("ArrowUp"),
        right = keyboard("ArrowRight"),
        down = keyboard("ArrowDown");


    left.press = () => {
        //Change the cat's velocity when the key is pressed
        cat.texture = resources.cat_left.texture;
        if (hitWall()) {
            return;
        }
        cat.vx = -dv;
        cat.vy = 0;
    };

    left.release = () => {
        //Change the cat's velocity when the key is pressed
        if (hitWall()) {
            cat.x += dv;
        }
        cat.vx = 0;
        cat.vy = 0;
    };

    right.press = () => {
        //Change the cat's velocity when the key is pressed
        cat.texture = resources.cat_right.texture;
        if (hitWall()) {
            return;
        }
        cat.vx = dv;
        cat.vy = 0;
    };

    right.release = () => {
        //Change the cat's velocity when the key is pressed
        if (hitWall()) {
            cat.x -= dv;
        }
        cat.vx = 0;
        cat.vy = 0;
    };
    up.press = () => {
        //Change the cat's velocity when the key is pressed
        if (hitWall()) {
            return;
        }
        cat.vx = 0;
        cat.vy = -dv;
    };

    up.release = () => {
        if (hitWall()) {
            cat.y += dv;
        }
        //Change the cat's velocity when the key is pressed
        cat.vx = 0;
        cat.vy = 0;
    };
    down.press = () => {
        if (hitWall()) {
            return;
        }
        //Change the cat's velocity when the key is pressed
        cat.vx = 0;
        cat.vy = dv;
    };

    down.release = () => {
        if (hitWall()) {
            cat.y -= dv;
        }
        //Change the cat's velocity when the key is pressed
        cat.vx = 0;
        cat.vy = 0;
    };

        //Capture the keyboard arrow keys
    function hitWall() {
        for (brick of walls) {
            if (hitTestRectangle(cat, brick)) {
                return true;
            }
        }
        return false;
    }

    function hitObjective() {
        for (objective of objectives) {
            if (hitTestRectangle(cat, objective) && objective.visible) {
                console.log("x: " + Math.floor(objective.x / 50) + " y: " + Math.floor(objective.y / 50));
                objective.visible = false;
                return true;
            }
        }
    }
    
    let state;

    function question(delta) {
        console.log("Got a question!")
        state = gamePlay;
    }

    function gamePlay(delta) {
            for (brick of walls) {
                if (hitTestRectangle(cat, brick)) {
                    cat.vy = 0;
                    cat.vx = 0;
                }
            }
            if (hitObjective()) {
                state = question;
            }

            cat.x += cat.vx;
            cat.y += cat.vy;
            if (cat.x < -cat.width) {
                cat.x = app.renderer.width;
            }
            if (cat.x > cat.width + app.renderer.width) {
                cat.x = -cat.width;
            }
            if (cat.y < -cat.height) {
                cat.y = app.renderer.height + cat.height;
            }
            if (cat.y > cat.height + app.renderer.height) {
                cat.y = -cat.height;
            }
    }

    

    state = gamePlay;
    // Listen for frame updates
    function gameLoop(delta) {
        state(delta);
    }

    app.ticker.add((delta) => gameLoop(delta));
});
