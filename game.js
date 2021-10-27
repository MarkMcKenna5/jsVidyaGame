kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0, 0, 0, 1],
})

// loadRoot("assets/images/")
loadSprite("coin", 'assets/images/coin.png')
loadSprite("goomba", "assets/images/goomba.png")
loadSprite("brick", "assets/images/brick.png")
loadSprite("mario", "assets/images/mario.png")
loadSprite("shroom", "assets/images/shroom.png")
loadSprite("boxClosed", "assets/images/boxClosed.png")
loadSprite("boxOpened", "assets/images/boxOpened.png")
loadSprite("pipeTopLeft", "assets/images/pipeTopLeft.png")
loadSprite("pipeTopRight", "assets/images/pipeTopRight.png")
loadSprite("pipeBotLeft", "assets/images/pipeBotLeft.png")
loadSprite("pipeBotRight", "pipeBotRight.png")

scene("game", () => {
  layer(["bg", "obj", "ui"], "obj")
  const map = [
    "                                                        ",
    "                                                        ",
    "                                                        ",
    "                                                        ",
    "                                                        ",
    "                                                        ",
    "                                                        ",
    "                                                        ",
    "                                                        ",
    "                                                        ",
    "                                                        ",
    "====================================   ================="
  ]

  const levelConfig = {
    width: 20,
    height: 20,
    "=": [sprite("brick", solid())]
  }

  const gameLevel = addLevel(map, levelConfig)
})

start("game")