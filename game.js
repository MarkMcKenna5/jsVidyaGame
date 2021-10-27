kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0, 0, 0, 1],
})

loadRoot("https://i.imgur.com/")
loadSprite("coin", 'wbKxHcd.png')
loadSprite("goomba", "KPO3fR9.png")
loadSprite("brick", "pogC9x5.png")
loadSprite("block", "M6rwarW.png")
loadSprite("mario", "Wb1qfhK.png")
loadSprite("shroom", "0WMd92p.png")
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
    "*": [sprite("boxClosed"), solid(), "mushroom-box"],
    "}": [sprite("boxOpened"), solid()],
    "(": [sprite("pipeBotLeft"), solid(), scale(0.5)],
    ")": [sprite("pipeBotRight"), solid(), scale(0.5)],
    "-": [sprite("pipeTopLeft"), solid(), scale(0.5)],
    "+": [sprite("pipeTopRight"), solid(), scale(0.5)],
    "^": [sprite("goomba"), solid()],
    "#": [sprite("shroom"), solid()],
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

  const player = add([
    sprite("mario"), solid(),
    //player position
    pos(30, 0),
    //adding gravity
    body(),
    origin("bot")
  ])
  //key bindings
const MOVE_SPEED = 120;
const JUMP_FORCE = 10;

  keyDown("left", () => {
    player.move(MOVE_SPEED, 0)
  })

  keyPress("space", () => {
    if (player.grounded()) {
      player.jump(JUMP_FORCE)
    }
  })

})

start("game")