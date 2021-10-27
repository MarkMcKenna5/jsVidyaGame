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
loadSprite("blueBlock", "fVscIbn.png")
loadSprite("blueBrick", "3e5YRQd.png")
loadSprite("blueSteel", "gqVoI2b.png")
loadSprite("blueGoomba", "SvV4ueD.png")
loadSprite("blueBoxClosed", "RMqCc1G.png")

scene("game", ({ level, score }) => {
  layer(["bg", "obj", "ui"], "obj")
  const maps = [
    [
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
  ],
  [
    "e                                                        e",
    "e                                                        e",
    "e                                                        e",
    "e                                              -+        e",
    "e                                              ()        e",
    "e                                              xx        e",
    "e        @@@@@@@@                             xxx        e",
    "e                                            xxxx        e",
    "e                                  x     x  xxxxx        e",
    "e                       z    z     x     x xxxxxx        e",
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!    !!!!!!!!!!!!!!!!!"
  ],
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
    "-": [sprite("pipeTopLeft"), solid(), scale(0.5), "pipe"],
    "+": [sprite("pipeTopRight"), solid(), scale(0.5), "pipe"],
    "^": [sprite("goomba"), solid(), "danger"],
    "!": [sprite("blueBlock"), solid(), scale(0.5)],
    "e": [sprite("blueBrick"), solid(), scale(0.5)],
    "z": [sprite("blueGoomba"), solid(), scale(0.5), "danger"],
    "@": [sprite("blueBoxClosed"), solid(), scale(0.5), "coin-box"],
    "x": [sprite("blueSteel"), solid(), scale(0.5)],
  }

  const gameLevel = addLevel(maps[level], levelConfig)

  const MOVE_SPEED = 120;
  const SMALL_JUMP_FORCE = 360;
  const BIG_JUMP_FORCE = 550
  let CURRENT_JUMP_FORCE = SMALL_JUMP_FORCE;
  const ENEMY_SPEED = 50;
  let isJumping = true;
  const FALL_DEATH = 400;

const scoreLabel = add([
    text(score),
    pos(30, 6),
    layer("ui"),
    {
      value: score,
    }
  ])

  add([text("level " + parseInt(level + 1)), pos(100,6)])

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
          CURRENT_JUMP_FORCE = SMALL_JUMP_FORCE
          timer = 0
          isBig = false
        },
        biggify(time) {
          this.scale = vec2(2)
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
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
    big()
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

  action("danger", (danger) => {
    danger.move(-ENEMY_SPEED, 0)
  })

  player.collides("danger", (danger) => {
    if(isJumping) {
      destroy(danger)
    } else {
      go("lose", {score: scoreLabel.value})
    }
  })
  player.collides("pipe", () => {
    keyPress("down", () => {
      go("game", {
        level: (level + 1),
        score: scoreLabel.value
      })
    })
  })
  
  player.action(() => {
    camPos(player.pos)
    if (player.pos.y >= FALL_DEATH) {
      go("lose", {score: scoreLabel.value })
    }
  })

  //key bindings

  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0)
  })
  keyDown("right", () => {
    player.move(MOVE_SPEED, 0)
  })

  player.action(() => {
    if (player.grounded()) {
      isJumping = false;
    }
  })

  keyPress("space", () => {
    if (player.grounded()) {
      isJumping = true
      player.jump(CURRENT_JUMP_FORCE)
    }
  })

})

scene("lose", ({ score }) => {
  add(text(score, 32), origin("center", pos(width()/2), height()/2))
})

start("game", { level: 0, score: 0 })