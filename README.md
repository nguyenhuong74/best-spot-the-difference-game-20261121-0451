# best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/nguyenhuong74/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/nguyenhuong74/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Lantern Hunt** — a complete spot-the-difference game: two near-identical hand-drawn pictures side by side, seven hidden differences per scene, three original scenes (a night market, a harbour at dawn, a mountain teahouse). Click a difference on either picture to ring it on both, use limited hints, beat the timer, and chase the time bonus. All art is drawn in code (canvas), all sound is synthesised with WebAudio — no external files, no network requests, keyboard + mouse play.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. Click **Start the hunt**, or press Enter. Click a difference on either picture; **H** spends a hint, **P** pauses, **1–3** picks a scene from the title screen.

To take the screenshots again: `?shot=cover`, `?shot=harbour`, `?shot=victory`, `?shot=start` (see `shots.json`).

To build the hand-in bundle:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=noctis&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
