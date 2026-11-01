# 六段流水线：每段的动作、命令与止笔线

顺序固定。段可以删（比如用户已经给了剧本），但**闸不能跳**。

## 段 0 · 需求（一次问完）

不问就会在第 5 段返工。一次问完这七项：

1. 时长与画幅（16:9 / 9:16 / 1:1 / 4:5）与 fps（默认 30；要 60 就先说清渲染代价）
2. 交付物：MP4 就行，还是要可编辑源码 / 剪映工程 / 多语言版本
3. 声音：无、配音、配乐、两者都要；有没有指定曲目（**用户指定优先**）
4. 字幕：要不要、什么语言、是否烧录
5. 素材来源：用户给页面/截图/录屏/产品，还是允许自己造
6. 投放位：官网首屏、发布推文、抖音/小红书（影响节奏与安全区）
7. 品牌约束：logo、主色、字体、禁项、真商标替换

规格写进一个 `spec.json`（mg-motion 里就是它的 QC 规格来源）：
```json
{ "duration": 10.0, "width": 1920, "height": 1080, "fps": 30 }
```

## 段 1 · 参考（有就实测，没有就立数字）

用户给了参考片，先量，不要凭印象模仿：

```bash
python engines/onetake/scripts/analyze_ref.py ref.mp4 --out ana/
```

读回四件事并写下来：能量图（什么时候动）、切点分布、**静止时间占比**、`motion:` 行的 t80 与 smear（是 snap 还是 S 曲线，有没有运动模糊）。
历史教训：没量就开工会做出「均匀节奏」的片，两次被毙都是这个原因。

没有参考片时，把这些数字当规格自己定：总时长、几段能量峰、静止占比（约 1/3）、快动作是否上快门、镜头是否跟随。

## 段 2 · 概念（三个，用户选）

**三个互不相同的中心思想**，每个两句话，说清「观众看到什么→明白了什么」。同时：

- 按名选 look（onetake `looks/looks.json` 的六套）或风格（mg-motion 的 15 种里的 1–2 种），**不许静默默认**；
- 说明这次不复用上一支片的哪三样东西（配色/舞台/镜头语法/转场）。

止笔线：概念没被用户选，不要写 beat sheet。

## 段 3 · 节奏与承接（分镜的双腿）

一条时间线至少有：启动 hook（前 0.3 秒不许空）、1–3 个能量峰、一处刻意静止、一个落定的结尾（结尾定格要有微动）。

- **节奏腿**：不许等长切；镜头长度要有短-长-短的变化；参考片切点常常成簇出现（burst）。
- **承接腿**：每个段落边界留一个「活下来并长大」的元素（角色落到标题上、页面从卡片里长出来、舞台从角色处打开）。
- 用 cue sheet 把音效落点写死，别靠手感：`cues.json` 是 mg-motion 的唯一真相源。

## 段 4 · 素材与镜头（先要一个可信的最小片段）

| 需要什么 | 怎么取 |
|---|---|
| 真实页面/UI | shotcraft：`engines/shotcraft/references/shots/` 选镜头卡 + `engines/shotcraft/assets/lib/` 的 PageCam；onetake：`record_footage.py footage.json --out footage/`，或按截图**重建** UI |
| 具体物件/角色/场景 | claude-motion：`node engines/claude-motion/scripts/route.mjs --query "<题目>" --limit 5` → `prepare-case.mjs` / `create-scene.mjs` / `create-model.mjs` |
| 一个动作或转场 | `node scripts/find.mjs "<动作>"` → `node engines/wise-motion/scripts/show.mjs <id>` → `export.mjs <id> --out-dir <工程>` |
| 镜头配方 | `node scripts/find.mjs "<镜头意图>" --collection shot-card`，读选中卡全文，再按卡的「参考实现」定位 `demos/` 源码 |
| 字体 | mg-motion：`python engines/mg-motion/scripts/bootstrap_fonts.py`（缺一个都别渲）；onetake：`looks/fonts/` |

先跑通**一个**最关键机制，看到真实画面，再扩整片。没跑过的样片不能声称已复现。

## 段 5 · 实现（纯时间函数）

三个引擎的实现契约，选一个就照它写：

```js
// onetake：单 HTML，window.__seek(t)
// mg-motion：window.renderAt(t) 纯函数 + window.__ready
window.DEMO = { width: 1920, height: 1080, fps: 30, duration: 10 };
window.renderAt = async (t) => { /* 画出第 t 秒那一帧 */ };
// 所有字体/资源 await 完之后再置 true
window.__ready = true;
// claude-motion：作品目录 scene.js 导出 width/height/duration/render(ctx,t)（可选 ready/audioWav）
```

约束（三家一致）：只依赖 t；不要 `Date.now()` / `Math.random()`（用固定种子）；路径写绝对；资源在工程内。

先出静帧再看整片：

```bash
python engines/onetake/scripts/stills.py comp.html --times 0.7,2.4,3.8,6.2,9.9,12.7 --out stills.png
node engines/mg-motion/mg-styles-15/harness/render.mjs demos/<slug> --stills 0.5,3.0,6.0,9.5 --scale 0.5
node engines/claude-motion/scripts/render.mjs --root <作品目录> --out <作品目录>/film.mp4 --fps 24
```

## 段 6 · 渲染与交付

1. **草稿**用最低档：1080p30（onetake 默认 180° 快门；mg-motion `--scale 0.5`）。
2. 过三道闸（见 `quality-gates.md`）。机器闸不过一律不交。
3. **终版**才上 4K60 / 高码率：`--final`（onetake）、`--mb 8 --shutter 0.5 --crf 14`（mg-motion）。
4. 按 `delivery.md` 的七项报告交片。

## 渲染开销预告（先说再做）

- onetake：带快门的逐帧捕获很贵（历史数据 ~0.2 秒/次捕获、8 worker）。长渲染前给用户估算。
- mg-motion：3D 路线（风格 04）由 Blender 出序列帧，网页只叠字与颗粒，步骤见其 `demos/04-3d-render/README.md`。
- shotcraft：Remotion 渲染依赖 `npm install` 完成；`npx remotion still` 出静帧自检比整片便宜得多。
- claude-motion：`npm ci && npm run setup` 在引擎目录跑一次，导出器优先用自带的 Playwright。
