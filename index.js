// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application({
    width: 800,
    height: 600
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
    { name: 'bunny', url: 'bunny.png' },
    { name: 'cat', url: 'cat.jpg' },
    { name: 'background', url: 'background.jpeg' },
    { name: 'block', url: 'block.png'}
]

const board_maize = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],

];
// load the texture we need
app.loader.add(txts).load((loader, resources) => {
    // Create Textures
    const background = new PIXI.Sprite(resources.background.texture);
    const bunny = new PIXI.Sprite(resources.bunny.texture);
    const cat = new PIXI.Sprite(resources.cat.texture);

    let walls = new Array();
    for (let i = 0; i < board_maize.length; i++) {
        for (let j = 0; j < board_maize[i].length; j++) {
            if (board_maize[i][j] == 1) {
                let brick = new PIXI.Sprite(resources.block.texture);
                brick.y = i * 100;
                brick.x = j * 100;
                walls.push(brick);
                console.log("brick x, brick y: " + brick.x + ", " + brick.y);
            }
        }
    }
    const brickWidth =  100; //app.renderer.width / walls.length;
    const brickHeight = 100; //app.renderer.height / walls[0].length;

    // Positioning and resizing
    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;

    bunny.width /= 5;
    bunny.height /= 5;
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    cat.x = 0;
    cat.y = app.renderer.height / 2;
    cat.vx = 0;
    cat.vy = 0;
    cat.width = cat.width / 5;
    cat.height = cat.height / 5;

    background.width = app.renderer.width;
    background.height = app.renderer.height;

    // Add sprites to scene
    
    app.stage.addChild(background);
    for (brick of walls) {
        app.stage.addChild(brick);
    }
    app.stage.addChild(bunny);
    app.stage.addChild(cat);


    //Capture the keyboard arrow keys
    let left = keyboard("ArrowLeft"),
        up = keyboard("ArrowUp"),
        right = keyboard("ArrowRight"),
        down = keyboard("ArrowDown");

    
    left.press = () => {
        //Change the cat's velocity when the key is pressed
        cat.vx = -5;
        cat.vy = 0;
    };

    left.release = () => {
        //Change the cat's velocity when the key is pressed
        cat.vx = 0;
        cat.vy = 0;
    };

    right.press = () => {
        //Change the cat's velocity when the key is pressed
        cat.vx = 5;
        cat.vy = 0;
    };

    right.release = () => {
        //Change the cat's velocity when the key is pressed
        cat.vx = 0;
        cat.vy = 0;
    };
    up.press = () => {
        //Change the cat's velocity when the key is pressed
        cat.vx = 0;
        cat.vy = -5;
    };

    up.release = () => {
        //Change the cat's velocity when the key is pressed
        cat.vx = 0;
        cat.vy = 0;
    };
    down.press = () => {
        //Change the cat's velocity when the key is pressed
        cat.vx = 0;
        cat.vy = 5;
    };

    down.release = () => {
        //Change the cat's velocity when the key is pressed
        cat.vx = 0;
        cat.vy = 0;
    };

    // Listen for frame updates
    function gameLoop(delta) {
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

        for (brick of walls) {
            if (hitTestRectangle(cat, brick)) {
                cat.vy = 0;
                cat.vx = 0;
            }
        }
    }

    app.ticker.add((delta) => gameLoop(delta));
});


