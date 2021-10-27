kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0, 0, 0, 1],
})

loadRoot("https://i.imgur.com/")
loadSprite("tile", "deQWSwM.gif")
loadSprite("rock", "asp7asB.gif")
loadSprite("wall", "yt9J5aB.gif")
loadSprite("block", "Dtkl5lq.gif")
loadSprite("snake", "XfjidQ6.gif")
loadSprite("head", "0BcmJms.gif")
loadSprite("boss1", "fZbyndX.gif")
loadSprite("chestClosed", "nLWfuCu.png")
loadSprite("chestOpened", "xySGRLI.png")
loadSprite("sword", "KSdpQlu.gif")
loadSprite("hook", "NkYuIQY.png")
loadSprite("rope", "WuRDx20.png")
loadSprite("player", "DEjwv7z.gif")
loadSprite("exit", "7APcRJX.gif")

scene("game", ({ level, score }) => {
  layer(["bg", "obj", "ui"], "obj")
  const maps = [
    [
    "%========================================================%",
    "%                                                        %",
    "%                                                        %",
    "%                                                        %",
    "%                                                    x   %",
    "%                                                        %",
    "%                                                gggggg  %",
    "%                                      ggggggg           %",
    "%                                                        %",
    "%                                                        %",
    "%                                 gggggg                 %",
    "%                                                        %",
    "%                         ggggggg                        %",
    "%                                                        %",
    "%                  ggggggg                               %",
    "%                                                        %",
    "%            ggggggg                                     %",
    "%                                                        %",
    "%                                                        %",
    "%                                                        %",
    "%                 ggggggg                                %",
    "%                                                        %",
    "%                                                        %",
    "%                                                        %",
    "%            gggggg                                      %",
    "%                                              *         %",
    "%                                             **         %",
    "%                                            ***         %",
    "%                      }                     ****      - %",
    "=========================================================="
  ],
  [
    "%                    ggggggggggggg              %",
    "%                                               %",
    "%          ggggggg                              %",
    "%                                               %",
    "%                                               %",
    "% gggggg                                        %",
    "%                                               %",
    "%                                               %",
    "%       ggggggg                                 %",
    "%                                               %",
    "%        ggggggg                                %",
    "%                                               %",
    "%                                              x%",
    "% ggggggg                             gggggggggg%",
    "%                                               %",
    "%                                               %",
    "%                                               %",
    "%       gggggg                                  %",
    "%                                               %",
    "%                            )                   %",
    "%                                               %",
    "%            -                                  %",
    "================================================="
  ],
]

  const levelConfig = {
    width: 20,
    height: 20,
    "=": [sprite("tile"), solid(), scale(.65)],
    "$": [sprite("rock"), solid()],
    "g": [sprite("rock"), solid(), scale(.8), "grapple"],
    "%": [sprite("wall"), solid()],
    "*": [sprite("block"), solid(), "grapple"],
    "}": [sprite("snake"), solid(), scale(.85),"danger"],
    "(": [sprite("head"), solid(), "danger"],
    ")": [sprite("boss1"), solid(), "danger"],
    "-": [sprite("chestClosed"), solid(), scale(.1), "hookChest"],
    "&": [sprite("chestClosed"), solid(), scale(.1), "swordChest"],
    "+": [sprite("chestOpened"), solid(), scale(.1)],
    "^": [sprite("sword"), solid()],
    "!": [sprite("hook"), solid(), "hook", scale(.05)],
    "e": [sprite("rope"), solid(), scale(.1), pos(0, 2)],
    "x": [sprite("exit"), solid(), scale(1.5), "exit"],
  }

  const gameLevel = addLevel(maps[level], levelConfig)

  const MOVE_SPEED = 120;
  const JUMP_FORCE = 300;
  const ENEMY_SPEED = 50;
  let isJumping = true;
  const FALL_DEATH = 600;
  let hasHook = false;
  let hasSword = false;
  let direction = "right";

const scoreLabel = add([
    text(score),
    pos(30, 6),
    layer("ui"),
    {
      value: score,
    }
  ])

  add([text("level " + parseInt(level + 1)), pos(100,6)])

  function sword() {
      return {
        getSword() {
        }
      }
  }

  function sword() {
      return {

      }
  }

  const player = add([
    sprite("player"), solid(),
    //player position
    pos(50, 350),
    //adding gravity
    body(),
    origin("bot"),
    sword()
  ])


  player.collides("hookChest", (obj) => {
      gameLevel.spawn("!", obj.gridPos.sub(0, 2))
      destroy(obj)
      gameLevel.spawn("+", obj.gridPos.sub(0, 0))
    })
  player.collides("hook", (obj) => {
      destroy(obj)
      hasHook = true
    })
    

  action("danger", (danger) => {
    danger.move(-ENEMY_SPEED, 0)
  })

  player.collides("danger", (danger) => {
    go("lose", {score: scoreLabel.value})
  })
  player.collides("exit", () => {
      go("game", {
        level: (level + 1),
        score: scoreLabel.value
      })
  })
  
  player.action(() => {
    camPos(player.pos)
    if (player.pos.y >= FALL_DEATH) {
      go("lose", {score: scoreLabel.value })
    }
  })
  const successRight = () => {
    player.move(20, -1500)
  }
  const successLeft = () => {
    player.move(20, -1500)
  }

  //key bindings

  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0)
    direction = 'left'
  })
  keyDown("right", () => {
    player.move(MOVE_SPEED, 0)
    direction = 'right'
  })

  player.action(() => {
    if (player.grounded()) {
      isJumping = false;
    }
  })

  keyPress("space", () => {
    if (player.grounded()) {
      isJumping = true
      player.jump(JUMP_FORCE)
    }
  })
  keyPress("0", () => {
    if (hasHook) {
      if (direction === "right") {
        const useRope = add([
          sprite("rope"),
          rotate(4),
          pos(player.pos.add(0, -20)),
          scale(.25),
          origin("right"),
          {
              speed: 100
          },
      ]);
      useRope.collides("grapple", () => {
        successRight()
      })
      setTimeout(() => {destroy(useRope)}, 100);
      }
      if (direction === "left") {
        const useRope = add([
          sprite("rope"),
          rotate(150),
          pos(player.pos.add(0, -20)),
          scale(.25),
          origin("right"),
          {
              speed: 100
          },
      ]);
      useRope.collides("grapple", () => {
        successLeft()
      })
      setTimeout(() => {destroy(useRope)}, 100);
      }
    }else{
      return
    }
  })

})

scene("lose", ({ score }) => {
  add(text(score, 32), origin("center", pos(width()/2), height()/2))
})

start("game", { level: 0, score: 0 })