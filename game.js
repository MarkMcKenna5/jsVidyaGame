kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0, 0, 0, 1],
})

loadRoot("https://i.imgur.com/")
loadSprite("coin", 'wbKxhcd.png')
loadSprite("goomba", "KPO3fR9.png")
loadSprite("brick", "pogC9x5.png")
loadSprite("block", "M6rwarW.png")
loadSprite("mario", "Wb1qfhK.png")
loadSprite("shroom", "0wMd92p.png")
loadSprite("boxClosed", "gesQ1KP.png")
loadSprite("boxOpened", "bdrLpi6.png")
loadSprite("pipeTopLeft", "ReTPiWY.png")
loadSprite("pipeTopRight", "hj2GK4n.png")
loadSprite("pipeBotLeft", "c1cYSbt.png")
loadSprite("pipeBotRight", "nqQ79eI.png")

scene("game", () => {
  layer(["bg", "obj", "ui"], "obj")
  const map = [
    "                                                        ",
    "                                                        ",
    "                                                        ",
    "                                                        ",
    "                                                        ",
    "         %   =*=%=                                      ",
    "                                                        ",
    "                                                        ",
    "                                  -+                    ",
    "                           ^  ^   ()                    ",
    "====================================   ================="
  ]

  const levelConfig = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid()],
    "$": [sprite("coin")],
    "%": [sprite("boxClosed"), solid(), "coin-box"],
    "*": [sprite("boxClosed"), solid(), "shroom-box"],
    "}": [sprite("boxOpened"), solid()],
    "(": [sprite("pipeBotLeft"), solid(), scale(0.5)],
    ")": [sprite("pipeBotRight"), solid(), scale(0.5)],
    "-": [sprite("pipeTopLeft"), solid(), scale(0.5)],
    "+": [sprite("pipeTopRight"), solid(), scale(0.5)],
    "^": [sprite("goomba"), solid()],
    "#": [sprite("shroom"), solid(), "shroom", body()],
  }

  const gameLevel = addLevel(map, levelConfig)
const scoreLabel = add([
    text("score"),
    pos(30, 6),
    layer("ui"),
    {
      value: "score",
    }
  ])

  add([text("level " + "test", pos(4,6))])

  function big() {
    let timer = 0;
    let isBig = false
      return {
        update() {
          if (isBig) {
            timer -= dt()
            if (timer <= 0) {
              this.smallify()
            }
          }
        },
        isBig() {
          return isBig
        },
        smallify() {
          this.scale = vec2(1)
          timer = 0
          isBig = false
        },
        biggify(time) {
          this.scale = vec2(2)
          timer = time
          isBig = true
        }
      }
  }

  const player = add([
    sprite("mario"), solid(),
    //player position
    pos(30, 0),
    //adding gravity
    body(),
    origin("bot"),
    // big()
  ])

  action("shroom", (shroom) => {
    shroom.move(50, 0)
  })

  player.on("headbump", (obj) => {
    if (obj.is("coin-box")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn("}", obj.gridPos.sub(0, 0))
    }
    if (obj.is("shroom-box")) {
      gameLevel.spawn("#", obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn("}", obj.gridPos.sub(0, 0))
    }
  })

  player.collides("shroom", (shroom) => {
    destroy(shroom)
    player.biggify(6)
  })

  player.collides("coin", (coin) => {
    destroy(coin)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  //key bindings
const MOVE_SPEED = 120;
const JUMP_FORCE = 360;

  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0)
  })
  keyDown("right", () => {
    player.move(MOVE_SPEED, 0)
  })

  keyPress("space", () => {
    if (player.grounded()) {
      player.jump(JUMP_FORCE)
    }
  })

})

start("game")