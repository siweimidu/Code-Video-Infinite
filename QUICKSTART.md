# 五分钟上手（三次走查）

每个走查都是：**你打一句话 → 脚本判读 → 建骨架 → 按 NEXT.md 做 → 过闸 → 交付**。
全程你只需要会一句：`node scripts/do.mjs "<你要什么>"`。

---

## 走查 1 · 做一支视频（20 秒发布动效）

```bash
node scripts/do.mjs "做一支 20 秒产品发布动效，赛博风，要运镜和音效"
```

输出长这样（真实输出）：

```
已建好：out/做一支-20-秒产品发布动效-20261104
  brief.md · NEXT.md · plan.json · plan.md · spec.json

判读：M1-video · mg-motion
风格：A 贴合 Synthwave / 复古未来  |  B 换语言 全息 / 赛博 HUD  |  C 大胆 巨字 / 动态排版
```

然后：

1. 打开 `brief.md`，把七件事补齐（时长/画幅/声音/素材来源/投放位/品牌约束 + **风格那一行**）。
2. 打开 `NEXT.md`，上面写着「只读这三处」和「开工命令」。照做。
3. 出片后：`node scripts/qc.mjs gate out/.../film.mp4 --spec out/.../spec.json`。
4. 过闸 + 七项报告 → 交付。

想换引擎（比如要真实网页画面就用 shotcraft）：

```bash
node scripts/do.mjs "用真实网页画面做一支多镜头产品宣传片" --engine shotcraft
```

---

## 走查 2 · 做一个网页制品（能点的落地页）

```bash
node scripts/do.mjs "给投资人看的能点击的产品网页演示，极简专业"
```

判读会是 `M3-web-artifact · web-design-engineer`。接着：

1. `brief.md` 里选一个风格方向（三个不同分类，选一个写进「风格：」那行）。
2. 按 `engines/garden-skills/skills/web-design-engineer/SKILL.md` 的 Step 2b：写 Design Read + 标定五个旋钮。
3. 先给 v0（一个 section 就够），确认后再完整构建。
4. 交付前：`node scripts/check-web.mjs out/.../index.html`（10 项，含单文件/字体数/占位符）。

---

## 走查 3 · 做一张图（发布会海报）

```bash
node scripts/do.mjs "要一张竖版 AI 产品发布会海报，赛博朋克风"
```

判读会是 `M5-image · gpt-image-2`。接着：

1. 先定模式：`node engines/garden-skills/skills/gpt-image-2/scripts/check-mode.js`
   - A 本地出图（要 key）/ B 交给宿主图像工具 / C 纯提示词顾问。
2. 读 `engines/garden-skills/skills/gpt-image-2/references/prompt-writing.md`，再挑模板类（海报 → `poster-and-campaigns/`）。
3. 按模板槽位填 prompt；出图后逐张看：主体可辨认 / 文字无错字 / 构图有留白。
4. prompt 与产物记账（命名 + 尺寸 + 模型）。

---

## 我完全不知道要做什么形态，怎么办

说人话就行：

- 「我想让老板一眼看懂我们的产品」→ 会判成视频或网页制品
- 「我要能发到群里给人看」→ 会长文
- 「我要贴在办公室墙上」→ 会判成图
- 「我要在台上一边讲一边点」→ 会是网页视频

如果判读还是不对，加 `--medium` 强制指定，或者直接说「不对，我要的是 X」。

## 想改判读规则 / 加自己的说法

- 加词：改 `scripts/lib/router.mjs` 的 `DECISIVE` / `SLOPPY` / `MEDIUM_HINTS`。
- 改完必须跑 `node scripts/selftest.mjs`（20 条回归），全绿才算没改坏。
