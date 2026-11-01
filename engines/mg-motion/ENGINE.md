---
name: mg-motion
description: >
  用代码做 AI 视频动效（MG / motion design）：15 种风格任选、可任意混搭或 15 种全用，做成成片而不是分镜。
  用户说「做个动效」「AI 做视频」「做支 MG」「MG 风格」「动效片」「motion design」「用某某风格做视频」
  「两种风格混搭」「把几种风格揉在一起」「做成 15 种风格的合辑」，
  或点名 15 种风格中任意一种（扁平矢量 / 线条动画 / 等轴 2.5D / 3D 渲染 / 逐帧手绘 /
  拼贴剪贴 / 液态流动 / 形变动画 / 包豪斯 / Synthwave / 玻璃拟态 / 综艺花字 / 贴纸科普 /
  像素风 / 赛博 HUD）时加载。
  画面全部是代码（SVG/Canvas/WebGL/Three.js/Blender），不是生图模型；声音也是代码合成。
  产出 video.mp4，并附实测 QC 报告与两轮独立评审。
  NOT for: 只想要视频内容摘要；只要生图/生视频模型出图；剪辑已有素材（用剪辑工具）；品牌 logo 设计。
---

# mg-motion —— 代码驱动的 MG 动效片

## 核心思想

**画面不是「生成」出来的，是「写」出来的。** 没有生图模型、没有生视频模型：
一支片是一个网页，它给你一个时间 `t`，就能画出那一帧。无头浏览器逐帧截图，
ffmpeg 合成音画。声音同样是代码合成的波形，不是找来的音乐。

这决定了三件事，本 skill 的所有规矩都是这三条推出来的：

1. **每帧都是时间的纯函数。** `renderAt(t)` 不许读实时时钟、不许靠状态触发的 CSS 动画。
   所以画面可以任意跳转、任意重渲，改一版不会把上一版的结果带偏。
2. **风格 = 一组可检验的签名技法。** 不是「要有科技感」，是「overshoot 用
   `cubic-bezier(0.34,1.56,0.64,1)`，错峰 2–4 帧，同一时刻只让一个主角动」。
   能被写下来的签名技法，才可能被评审核对。
3. **质量必须能量出来。** 时长、响度、真峰值、黑帧、静帧、音画对位全部用 ffmpeg 实测，
   不靠自述。`scripts/mg-qc.mjs` 是闸门，不过闸不出片。

## 与原仓库的关系（重要）

本 skill 基于开源项目 **mg-styles-15**（MIT，https://github.com/siweimidu/mg-styles-15 ），
它提供 15 种风格的签名技法、完整提示词、103 个乐器采样的配乐工具包，以及逐帧渲染器。
**但原片是由 Claude Opus 5.5 做的，本 skill 的目标不是复刻它，是超过它。**
超过的办法在下面第 6 节，是可执行的机械步骤，不是「再努力一点」。

不要改坏上游：`harness/` `lib/audio/` 是上游代码，要用就 `git clone` 一份自己改。

---

## 1. 环境自检（每次开工先跑，30 秒）

Windows 上有三个已知坑，先排掉再动手：

```bash
node -v && ffmpeg -version | head -1 && python --version
ls "/c/Program Files/Google/Chrome/Application/chrome.exe"   # Chrome 必须有
```

- **Node ≥ 20**、**ffmpeg**、**Python ≥ 3.11**、**Chrome**。缺一个都做不了片。
- **PowerShell 里 `npm` 会被执行策略拦掉**，用 `npm.cmd install`。
- **Windows 上 `MG_CHROME` 必须显式设置**，上游 render.mjs 默认路径是 macOS 的：
  ```powershell
  $env:MG_CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
  ```
- **字体必须先装齐**（见第 3 节）。字体没装齐不会报错，而是**静默卡满 300 秒然后失败**——
  这是上游最容易浪费半小时的地方。

拉取工具链：

```bash
git clone --depth 1 https://github.com/siweimidu/mg-styles-15.git mg && cd mg
npm.cmd install            # 或 npm install；Linux/macOS 用 npm
pip install -r requirements.txt
python scripts/bootstrap_fonts.py   # 见第 3 节
```

工作目录必须是**仓库根**：片子里的路径（`/assets/...`、`/node_modules/...`）都相对根目录。

## 2. 选风格：15 种，任意组合

15 种风格的完整签名技法、配色、技术路线在 **`references/styles.md`**。
每种给的是：视觉特征、关键技法（带具体参数）、典型技术路线、默认画幅与帧率、适合什么内容。

一句话速查（详见 `references/styles.md`）：

| # | 风格 | 一眼特征 | 默认 |
|---|---|---|---|
| 01 | 扁平矢量 | 纯色大色块几何 + 弹性 overshoot + stagger | 1920×1080 30fps |
| 02 | 线条动画 | 笔画自绘 stroke-dashoffset，线条连续生长 | 1920×1080 30fps |
| 03 | 等轴 2.5D | 30° 斜投影、无灭点、缩放场景、生长动画 | 1920×1080 30fps |
| 04 | 3D 渲染系 | PBR 真实材质、SSS 透光、景深、柔阴影 | 1920×1080 24fps |
| 05 | 逐帧手绘 | line boil 线条沸腾 + 一拍二 + smear 拖影 | 1920×1080 24fps |
| 06 | 拼贴剪贴 | 剪报半调网点 + 撕纸边 + 12fps 抽帧 | 1920×1080 30fps |
| 07 | 液态流动 | 表面张力 + metaball 融合 + 次级波纹 | 1920×1080 30fps |
| 08 | 形变动画 | 轮廓连续互溶无跳变 + 顶点旋转 | 1920×1080 30fps |
| 09 | 几何构成/包豪斯 | 严格网格 + 限定色 + 节奏驱动 | 1920×1080 30fps |
| 10 | Synthwave/VHS | 霓虹 + 透视网格 + RGB 偏移 | 1920×1080 30fps |
| 12 | 弥散渐变/玻璃拟态 | mesh gradient + 半透明玻璃卡片 + 呼吸 | 1920×1080 30fps |
| 18 | 综艺花字 | 多层描边圆体手写体 + 弹簧 pop | **1080×1920 竖屏** |
| 19 | 粗描边贴纸科普 | 照片贴纸化白描边 + 超大画布镜头平移 | 1920×1080 30fps |
| 20 | 像素风 | 硬像素 + 有限色板 + 8–12fps 跑跑动 | 1920×1080 30fps |
| 22 | 赛博 HUD/FUI | 暗色 HUD 描边框 + 数据流 + 锁定框 | 1920×1080 30fps |

**组合 2–15 种**不是把 15 种效果叠上去（那是糊），语法在 `references/blending.md`：
它规定谁能当主导层、风格怎么交接、交接点用什么接、配色和音乐怎么统一、
以及一条硬规矩——**同一时刻画面上只允许一种风格说第一句话**。
速判：

- 2–3 种：**顺序接力**（每种占一段，段间做风格化转场）。
- 4–6 种：**分层叠加**（一种主导 + 若干修饰层，层与层用同一 cue sheet 锁死）。
- 7–15 种：**结构化巡游**（主风格 1 种，其余当段落之间的「过场皮肤」，
  按 cue sheet 逐段换皮，主风格负责首尾，首尾必须回到主风格）。

## 3. 字体：不做这步，后面全白干

15 支片引用了 **51 个字体文件，仓库里一个都没有**（各自授权不同，官方故意不放）。
后果不是「字不好看」，而是：

```js
await document.fonts.load('900 172px "Poppins"', 'BAUHAUS')  // 文件缺失 → Promise reject
window.__ready = true                                          // 永远执行不到
```

→ 渲染器在 `waitForFunction('window.__ready === true')` 上**静默卡满 300 秒**，
然后抛 `TimeoutError: Waiting failed: 300000ms exceeded`，看起来像 Chrome 坏了。

```bash
python scripts/bootstrap_fonts.py            # 下载可商用的 OFL/Apache 字体到 assets/fonts/
python scripts/bootstrap_fonts.py --check    # 只体检，缺哪个报哪个
```

脚本把每个字体放到 `assets/fonts/fonts.css` 里写明的那个精确路径
（`fonts.css` 的 `url()` 不能改，片子就是这么写的）。
个别片子还要自己的静态字重（03/07/08/10），脚本一并处理。

**字形回退是最阴的失败模式**：片子里写着「不含糊的中文」，实际渲染成系统字体，
而 QC 全绿。`--check` 必须跑，返回非 0 就是还没装好。

## 4. 开工顺序（不要跳步）

```
概念 → cue sheet → 关键帧静帧 → 编排 → 声音 → 低分辨率预览 → 改 → 全分辨率 → QC → 评审 ×2
```

**Step 1 概念。** 一句话说清：**0–0.5 s 的钩子**（不许用超过 0.3 s 的空白或黑场开场）、
一次升级、**60–75 % 处一个 unmistakable 的高潮**、0.8–1.2 s 的定格结尾帧（结尾帧要有活着的微动）。
把每个签名技法映射到具体时刻。中文文案必须是地道中文，标点用中文标点。

**Step 2 cue sheet（唯一真相源）。** 一个 `cues.json`，画面和声音都从它读。
这是本 skill 最关键的一步——上游 15 支片全部靠它做到音画对位。
最少要有 `bpm / beat / events[] / drop / freeze`，每条 event 至少 `{id, t, sfx}`。

```json
{ "bpm": 120, "beat": 0.5, "drop": 6.0, "freeze": 8.0,
  "events": [ { "id": "marks", "t": 0.25, "sfx": "tick", "x": 960 } ] }
```

**Step 3 关键帧静帧（先看图，再动）。** 在 6–10 个关键时刻出静帧，**真的用 `read_image` 看**。
每张静帧都要能当海报：构图、层次、留白、字距行高字重对比、中文标点、5 % 安全边距。
看不清就是没看，不是「应该没问题」。

```bash
node harness/render.mjs demos/<slug> --stills 0.5,3.0,6.0,9.5 --scale 0.5
```

**Step 4 编排。** 低分辨率逐帧走最快的动作：间距、缓动、弧线、重叠、
预备动作与跟随（anticipation / follow-through）、该有的运动模糊。
不许有非预期死帧，能量跟着音乐走。

**Step 5 声音。** 用 `lib/audio`（`mgaudio`）写配乐和音效，读 `cues.json` 同一个时间轴。
每个画面动作落地帧 = 一个音效落点。输出 48 kHz 立体声，−14 LUFS，真峰值 ≤ −1 dBTP。

```bash
python demos/<slug>/audio.py      # → demos/<slug>/out/audio.wav
```

**Step 6 渲染。** 低分辨率先看节奏，满意再全分辨率：

```bash
node harness/render.mjs demos/<slug> --scale 0.5 --mb 2 --audio demos/<slug>/out/audio.wav
node harness/render.mjs demos/<slug> --mb 8 --shutter 0.5 --crf 14
```

**Step 7 QC 闸门（不过不出片）。**

```bash
node scripts/mg-qc.mjs demos/<slug>/out/video.mp4 --spec demos/<slug>/spec.json --cues demos/<slug>/cues.json
```

十道闸，全部从编码后的文件实测：时长 / 宽 / 高 / fps / 有音轨 /
整体响度 −14±1 LUFS / 真峰值 ≤ −1 dBTP / 黑帧 ≤ 0.35 s / 片中静止段 ≤ 0.6 s（结尾定格除外）/
平均运动能量 / 能量对比度（要有重音，不是平铺）/ cue→音频起始点对位。
输出 `qc-report.json`，任一 FAIL 就回去改，**不许用「看起来还行」放行**。

**Step 8 评审 ×2。** 见 `references/jury.md`。第一轮出分与修改清单，改完**必须再评一轮**，
第二轮全维度 ≥ 9 才算过。上游 15 支原片的终评是 **7.57–8.21**，这是你要越过的线，不是要追平的线。

## 5. 渲染契约（片子必须满足）

```js
// demos/<slug>/index.html 加载的脚本里，必须在 window.__ready = true 之前定义好：
window.DEMO = { width: 1920, height: 1080, fps: 30, duration: 10 };  // 可选，覆盖 CLI 默认
window.renderAt = async (t) => { /* 画出第 t 秒那一帧 */ };          // 必需，纯函数
// 所有 fonts/资源都 await 完之后，再 window.__ready = true
```

- `renderAt(t)` **必须只依赖 `t`**：不许 `Date.now()`、不许 `requestAnimationFrame` 累积状态、
  不许状态触发的 CSS transition。
- 不由 `renderAt` 驱动的动画（CSS/WAAPI）渲染器会帮你 seek 到 `t`，但仍尽量交给 `renderAt`。
- 页面要从**仓库根目录**起服务，路径写绝对（`/assets/...`、`/demos/<slug>/...`）。
- 3D 那种路线（04）由 Blender 出序列帧，网页只负责叠字和颗粒，步骤见 `demos/04-3d-render/README.md`。

## 6. 怎么「超过」Opus 5.5 的原片（这一节是重点）

上游 15 支片的终评 **7.57–8.21 / 10**。它自己也承认「同一份提示词每次做出来的片子都不一样」，
一次运行通常达不到原片完成度。所以**别去比谁提示词写得好**——原片的提示词已经公开了，
抄它最多得到 7–8 分。超过它靠的是下面这套**机械流程**，不是措辞。

### 6.1 三道闸，缺一不可

| 闸 | 谁来判 | 判什么 | 不过怎么办 |
|---|---|---|---|
| **机器闸** | `mg-qc.mjs` | 时长/响度/真峰值/黑帧/静止/能量/对位 | 改代码重渲，**没有商量余地** |
| **静帧闸** | 你自己 `read_image` | 6–10 张关键帧能不能当海报 | 构图/层次/留白重排 |
| **评审闸** | 独立会话按 `references/jury.md` | 7 个维度打分 + 修改清单 | 按影响排序改，改完**再评一轮** |

原片的两轮迭代里，**真正提分的是评审那几轮，不是第一遍生成**。
所以预算要这样花：**渲染要快，评审要慢**。

### 6.2 具体怎么超过（按收益排序）

1. **QC 数字全绿就赢了一半。** 原片里 02-line-art 的真峰值 −1.25 dBTP、
   08-morph 能量比 34.6 都是擦线过的。机器闸能挡住原片都挡不住的东西。
2. **hook 前 0.3 s 绝不许空。** 上游反复强调这条；AI 默认爱留一个空场。
   在 `--stills 0.1,0.2,0.3` 上逐帧确认。
3. **结尾定格要有微动。** 光冻住 = 省事；呼吸、噪点微动、缓慢推镜才是完成度。
4. **音画对位用 cue sheet 强制，不靠手感。** `mg-qc.mjs --cues` 会把漏掉的落点列出来。
5. **中文文案逐字校对。** rubric 把「不自然的中文」列为 critical，AI 写中文最容易露馅。
6. **两轮评审，不是两轮改。** 改完必须让**没参与制作的**会话再评一次。
7. **每次改完存版本。** `v1/` `v2/`，别覆盖——评审要给「改前改后」的对照。

### 6.3 别做的事

- 别一次上 15 种风格。`references/blending.md` 讲怎么混，但 15 种同时说话 = 糊，不是超越。
- 别用 `--force` 绕过 QC。
- 别把 `minMotion` 调低来「通过」能量闸——那是改测量标准，不是改片子。

## 7. 目录约定

```
mg/                                   # 上游克隆，不要改
  harness/render.mjs                  # 逐帧渲染器（不要改）
  lib/audio/                          # mgaudio 配乐工具包 + 103 采样（不要改）
  prompts/*.md                        # 15 种风格的原始完整提示词
  demos/<slug>/                       # 片子源码
    index.html  renderAt(t)  →  out/
    cues.json                         # 唯一真相源
    audio.py        →  out/audio.wav
    spec.json                         # QC 规格（可选，默认 1920×1080 30fps 10s −14 LUFS）
scripts/
  mg-qc.mjs                           # 机器闸：10 道实测闸
  bootstrap_fonts.py                  # 字体自举（否则渲染静默卡 300 s）
references/
  styles.md                           # 15 种风格完整签名技法
  blending.md                         # 2–15 种风格的混搭语法
  jury.md                             # 评审提示词 + 两轮协议
```

## 8. 交付

出片时报告这七项，缺一项就是没做完：

1. 概念（两句话）
2. 带时间码的 beat sheet
3. 每个签名技法怎么实现的（逐条对 `references/styles.md`）
4. 用了哪几种风格、怎么交接的（用了 `references/blending.md` 的哪条）
5. 技术路线
6. **QC 实测数字**：时长 / 宽高 / fps / LUFS / 真峰值 / 能量比 / 对位漏检数
7. 诚实的 top-3 弱点

素材只用允许商用的授权（CC0 / OFL / Apache / public domain），
每条记来源到 `CREDITS.md`。品牌名虚构，不要真商标。
