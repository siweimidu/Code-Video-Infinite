---
name: code-video-infinite
description: 用代码做视频的唯一入口：一句需求 → 成片 MP4 + 可编辑源码。内置五个引擎（onetake / video-shotcraft / claude-motion / mg-motion / wise-motion）与 880 条可检索素材（124 张 Remotion 镜头配方卡、462 条通用动效条目、47 套动画源码案例、20 个源码组件、30 个物件模型、14 个场景起点、15 种 MG 风格签名技法、35 个纯时间动效函数、6 套起始 look），共用一套节奏语法、声音规范与三道质检闸。Use when 用户要做动效 / MG / motion design / 产品宣传片 / 发布片 / teaser / 功能演示 / 网页或截图变视频 / 转场与文字动效 / 复刻某个动效 / 用 Remotion 或逐帧渲染做片，或抱怨成片「像 PPT、没节奏、一个一个展示」。NOT for 实拍剪辑与长视频、只想要内容摘要、只出图不出片、品牌 logo 设计。
---

# Code-Video-Infinite

**画面不是「生成」出来的，是「写」出来的。** 这里没有生图/生视频模型：一支片是一个网页或一个
Remotion 工程，给它一个时间 t，它画出那一帧；无头浏览器或 Remotion 逐帧渲染，ffmpeg 合音画。
声音同样可以代码合成。所以每支片都能任意 seek、任意重渲、改一版不会把上一版带偏。

本 skill 是五个引擎的合并体：**一个入口、一套流程、三条闸**，五个引擎各自保留全部纵深文档与素材。

## 0 · 开工先跑这两条（30 秒，不要跳）

```bash
node scripts/doctor.mjs          # 环境：Node / ffmpeg / ffprobe / Python / Chrome / 五个引擎是否齐全
node scripts/find.mjs --stats    # 目录：880 条素材按来源、集合清点
```

doctor 有 FAIL 就先修环境，再谈创作。缺 Chrome 的装 Chrome 或 `npx playwright install chromium`；
Windows 上 npm 被执行策略拦掉时用 `npm.cmd`。

## 1 · 先选引擎，再谈风格

用户的需求决定引擎，不由目录丰盛程度决定。一个片子**默认只用一个主引擎**，第二个引擎只用来取素材。

| 需求长什么样 | 引擎 | 它强在哪 | 开箱要付的代价 |
|---|---|---|---|
| 15–30 秒产品/发布/技能动效片，要节奏、要运镜、要「不像 PPT」 | **onetake** | 单 HTML 合成、真实快门运动模糊、合成音效、节奏与承接的 oracle | Python + Chrome；4K60 渲染慢（先报时） |
| 产品宣传片、影视感、真实网页画面、多镜头叙事、要剪映再改、要发布社交平台 | **shotcraft** | 124 张镜头配方卡 + Ink Press 模板 + 真实页面捕获 + Freesound 选音 + 工作台 | Node + Remotion（npm 安装）；Remotion 有独立许可 |
| 要具体造型、材质、3D 物件、角色与动物、手绘纸艺、可直接运行的场景 | **claude-motion** | 47 套源码案例 + 20 个源码组件 + 30 个物件模型 + 14 个场景起点，保真源码而非画风标签 | Node ≥ 22 + Playwright Chromium + ffmpeg；素材体量大 |
| 要 MG 风格（扁平/线描/等轴/3D 渲染/逐帧/拼贴/液态/形变/包豪斯/Synthwave/玻璃/花字/贴纸/像素/赛博 HUD） | **mg-motion** | 15 种可检验的签名技法 + 103 采样配乐工具包 + 10 道机器闸 + 两轮评审 | 需 Chrome（MG_CHROME）+ ffmpeg + 字体自举 |
| 只要一个动作、转场、文字动效的**真实源码**，交给别的工程用 | **wise-motion** | 462 条动效条目、预览、真实源码入口与导出脚本 | 只交素材，不替你设计整片 |

路由细节、被否证的组合、以及每个引擎的明确边界见 `references/engine-selection.md`。

**检索任何素材都用同一条命令**（跨五个引擎）：
```bash
node scripts/find.mjs "HUD 雷达"
node scripts/find.mjs "咖啡 手绘" --limit 5
node scripts/find.mjs fade --source wise-motion
node scripts/find.mjs "标题 入场" --collection shot-card --json
```

## 2 · 六段流水线（顺序固定，可以删段但不能跳闸）

| 段 | 做什么 | 纵深文档 |
|---|---|---|
| 0 需求 | 问清交付规格（时长/画幅/fps/有无配音字幕/语言）、素材来源、受众与投放位；一次问完，不逐条追问 | `references/pipeline.md` §0 |
| 1 参考 | 有参考片就实测它：能量图、切点、静止比例、t80 与拖影（onetake `analyze_ref.py`）；没有参考就写下一组可复核的数字目标 | `references/motion-grammar.md` |
| 2 概念 | **三个互不相同的中心思想**，用户选一个；同时按名选定 look/风格，不静默套默认 | onetake §2 / mg-motion §2 |
| 3 节奏与承接 | 分镜按**节奏**和**承接**两条腿设计：不许等长镜头、不许一个 beat 替换上一个 beat | `references/motion-grammar.md` |
| 4 素材与镜头 | 真实页面捕获 / 截图还原 UI / 物件模型 / 镜头卡 / 动效条目；先取一个最小的可跑片段 | 各引擎 ENGINE.md |
| 5 实现 | 每帧都是时间的纯函数；动作从库里选，曲线按 t80 定；先出静帧再整片 | 各引擎 ENGINE.md |
| 6 渲染与交付 | 1080p30 草稿 → 验收 → 4K60/终版；过三条闸；按交付契约报告 | `references/delivery.md` |

## 3 · 铁律（五家合并去重，每条都是别人踩过的）

1. **每帧只依赖 t。** 禁 `Date.now()`、禁 rAF 累积状态、禁状态触发的 CSS 动画；伪随机用固定种子。
2. **不要把模板的故事当用户的故事。** 概念三选一；新片套模板的 beat 就会读成模板。
3. **不要把上一支片的 look 带进下一支。** look/风格必须被**按名选择**，静默默认不允许。
4. **不要按节拍器等分切。** 等长镜头无论单镜多好都读成幻灯片。
5. **不要替换 beat，要承接它。** 每个段落边界都得有东西活下来并可见地运动/缩放到下一段；
   互斥场景（`display:none` 换页）即使节奏完美也是 PPT。硬切爆点与片尾卡除外。
6. **留白是爆点落地的条件。** 参考片约 1/3 时间是静止的；整片不停 = 没有高潮。
7. **小元素，大地面。** 这类片的画幅常是 70% 白/底色；满屏素材是例外，不是默认。
8. **成因必须看得见。** 手从录制路径画出来、球落地、点分裂——页面自己动起来读成屏保。
9. **快动作必须有快门。** 超过 ~80 px/帧没有运动模糊就会频闪成重影；用渲染器的快门，不用 CSS blur。
10. **运镜要追主角。** 静止机位会被评价成「就缺灵动的跟踪运镜」；声明 `inFrame`，让相机滞后、倾斜、落定。
11. **草稿 1080p30。** 未经接受的剪辑不渲 4K60。
12. **不用粒子/彩纸/碎屑当装饰。** 读起来就是模板；要花活就让字自己落地。
13. **声音一个房间、一套材质。** 每个事件一条合成音 = 音频版的幻灯片。
14. **不伪造：** 没跑过的样片不叫复现，无声片不叫有声片，技术通过不等于审美达标。

## 4 · 三道闸，缺一不可

| 闸 | 谁判 | 判什么 | 不过怎么办 |
|---|---|---|---|
| **机器闸** | `node scripts/qc.mjs gate <video>` | 时长/画幅/fps/有无音轨/LUFS/真峰值/黑帧/静帧比例 | 改片子重渲，不改标准 |
| **静帧闸** | 你自己 `read_image` | 6–10 张关键帧能不能当海报：构图/层次/留白/文字排版 | 重排画面 |
| **评审闸** | **干净上下文的独立 subagent** | 7 维打分 + 带帧号的修改清单；改完**再评一轮** | 按影响排序改 |

机器闸只测机器能测的；审美一律交给独立评审，制作者的自检有确认偏差。
各引擎自带的闸（`mg-qc.mjs`、`verify_promo.py`、`final-review.md`、`jury.md`）用法与判定口径见
`references/quality-gates.md`。

## 5 · 声音

- 目标：**一个房间、一套材质**，事件数少于 beat 数；音乐默认只用允许商用的曲目并记账。
- 常用落点：`−14 LUFS`（社交/网页）、`−16 LUFS`（长片/播客式），真峰值 `≤ −1 dBTP`（AAC 编码后还会抬）；
  要留更多余量按 `−3.5` 走。
- 三家的现成工具：onetake `sfx_palette.py` / `score.py`（合成 + 录制混音），mg-motion `audio.py` + 103 采样，
  shotcraft `sound-design.md` + `sfx-source.py`（Freesound，CC0 默认）。
- 细节与许可红线见 `references/sound.md`。

## 6 · 交付契约

**每支片都要齐这七项**（缺一项就是没做完）：概念两句话 / 带时间码 beat sheet / 签名技法逐条对应 /
用了哪几种风格与怎么交接 / 技术路线 / **实测数字**（时长 画幅 fps LUFS 真峰值 黑帧 静帧比例）/
诚实的 top-3 弱点。

引擎额外交付物：onetake 多语言同源（`?lang=` 不分叉）、claude-motion `ADAPTATION.md`（保留/改写/许可/未解决问题）、
shotcraft 动效工作台与剪映工程、mg-motion 版本目录 `v1/ v2/`。见 `references/delivery.md`。

## 7 · 目录地图

```
Code-Video-Infinite.skill/
├── SKILL.md                  # 本文件：路由 + 铁律 + 闸 + 交付
├── README.md                 # 人看的：五个引擎是什么、怎么装、许可表
├── LICENSES.md               # 逐引擎许可与第三方声明
├── references/               # 合并后的共享知识（本层新写，只放跨引擎判断）
│   ├── engine-selection.md   # 决策矩阵与边界
│   ├── pipeline.md           # 六段流水线的每段纵深
│   ├── motion-grammar.md     # 节奏/曲线/承接/运镜的统一词汇
│   ├── sound.md              # 声音与许可红线
│   ├── quality-gates.md      # 三道闸的判定口径
│   ├── delivery.md           # 交付契约
│   ├── assets-and-licenses.md# 素材在哪、能不能再分发
│   └── provenance.md         # 五个来源、版本、合并做了什么
├── catalog/
│   ├── INDEX.md              # 880 条素材清单（生成物）
│   ├── index.json            # 同一份数据的机器可读版
│   └── assets-index.json     # 537 个重型素材清单
├── scripts/
│   ├── doctor.mjs            # 环境自检
│   ├── find.mjs              # 跨引擎检索
│   ├── qc.mjs                # 统一机器闸（measure / gate / delegate）
│   ├── build-catalog.mjs     # 重建索引
│   └── check-links.mjs       # 文档互链体检
└── engines/                  # 五个引擎原样保留（含各自的文档/素材/许可）
    ├── onetake/       ENGINE.md + lib/motion.js + scripts/ + looks/ + cases/
    ├── shotcraft/     ENGINE.md + references/shots(124) + template/ + demos/ + assets/
    ├── claude-motion/ ENGINE.md + references/*.json + assets/{cases,extensions,models,scenes}
    ├── mg-motion/     ENGINE.md + mg-styles-15/{harness,assets} + references/ + scripts/
    └── wise-motion/   ENGINE.md + catalog/registry.json + references/effects(462) + scripts/
```

## 8 · 什么时候读哪个文件

| 时机 | 读 |
|---|---|
| 不知道该用哪个引擎 | `references/engine-selection.md` |
| 要开工，需要每段的具体动作与命令 | `references/pipeline.md` |
| 节奏不对、像 PPT、动作太软/太硬 | `references/motion-grammar.md` |
| 配音/音效/配乐/响度 | `references/sound.md` |
| 片子做完了，怕不过闸 | `references/quality-gates.md` |
| 要交片、要报告、要再改 | `references/delivery.md` |
| 用某引擎的素材，不确定能不能商用 | `references/assets-and-licenses.md` |
| 要升级某个引擎或追问来源 | `references/provenance.md` |
| 引擎纵深（唯一权威） | `engines/<engine>/ENGINE.md` 及其 `references/` |

## 9 · 许可与素材边界（一句话版）

五个引擎许可各不相同，**合并仓库不改变各自的许可**：onetake 是 PolyForm Noncommercial（非商用免费），
wise-motion 是 Apache-2.0，claude-motion 与上游 mg-styles-15 是 MIT（第三方资产各自保留许可），
shotcraft 自带许可且 Remotion 另有独立许可（公司商用需自行确认）。字体、模型、音效、BGM 的授权
逐条记在 `references/assets-and-licenses.md` 与各引擎的 `LICENSE` / `ATTRIBUTION` / `NOTICE` 里。
品牌名一律虚构，不要用真商标。
