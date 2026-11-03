---
name: code-video-infinite
description: 把一句话需求变成可交付的视觉成品的总控 skill：视频成片、网页视频演示、网页/UI 制品、长文、静态图、动效源码、知识库检索七类交付形态，十一个引擎（onetake / shotcraft / claude-motion / mg-motion / wise-motion / motion-showreel / web-video-presentation / web-design-engineer / beautiful-article / gpt-image-2 / kb-retriever），一套跨库风格体系（82 个风格族，覆盖 43 个动效风格 + 46 个案例风格 + 15 种 MG 技法 + 6 个设计学校 + 17 类出图模板），以及三类交付闸。Use when 用户要做 视频/动效/MG/宣传片/发布片/teaser/片头/讲解视频/作品集、用网页做视频/可录屏演示、网页或仪表盘或原型或 deck 或数据可视化、把链接或 PDF 做成网页长文、海报或信息图或产品图或 UI mockup、要某个动效的真实源码、从本地知识库检索答问，或抱怨成片「像 PPT、没节奏、没设计感」。NOT for 实拍剪辑、纯后端或命令行开发、只想要内容摘要、品牌 logo 设计。
---

# Code-Video-Infinite

**先判形态，再选引擎，最后定风格。** 这个 skill 不生产一种东西：它把「做个视觉成品」分成八种交付形态，
每种形态都有专属引擎、专属硬节点和专属闸；风格则是一套跨库的规则，同一套规则在多个引擎里都有实现。

装了什么：十一个引擎、**1013 条可检索素材**（124 张镜头卡 / 462 条动效条目 / 47 套源码案例 / 20 个组件 /
30 个物件模型 / 14 个场景 / 15 种 MG 技法 / 43 个动效风格文件 / 6 个设计学校 / 17 类出图模板）、
82 个风格族、以及七个能跑的脚本。

## 0 · 开工三件套（每次先跑，30 秒）

```bash
node scripts/doctor.mjs                       # 环境 + 十一个引擎是否齐全
node scripts/pick.mjs "<用户那句话>"           # 判形态 + 选引擎 + 给三个风格方向 + 素材起点 + 闸 + 交付清单
node scripts/find.mjs "<更具体的关键词>"       # 按需检索素材（分面：--medium / --engine / --collection）
```

`pick.mjs` 的输出就是这次的施工蓝图；判读偏弱时它会提示「先向用户确认一句」，那就问，别硬猜。

## 1 · 八种交付形态

| 形态 | 交付物 | 引擎 | 硬节点 |
|---|---|---|---|
| **M1 视频成片** | MP4 + 可渲染源码 | onetake · shotcraft · mg-motion · motion-showreel · claude-motion | 概念三选一 → 关键帧/静帧 → 草稿 1080p → 过闸 → 终版 |
| **M2 网页视频** | 点击驱动的 16:9 网页 | web-video-presentation | 一次产出 script+outline → 对齐 5 件事 → 第 1 章验收 |
| **M3 网页制品** | 单页 HTML / React 工程 | web-design-engineer | Design Read 五档 → 声明设计系统 → v0 早给 |
| **M4 长文** | 单文件 HTML 长文 | beautiful-article | Source→MD → 编辑计划 → 三次 Checkpoint |
| **M5 静态图** | PNG / 系列图 | gpt-image-2 | 先定运行模式（A/B/C）→ 读方法论 → 按模板填槽 |
| **M6 动效素材** | 导出源码 + 接入说明 | wise-motion | match → show → export → 在目标工程真跑一遍 |
| **M7 知识检索** | 答案 + 出处 | kb-retriever | 先读该类文件的 references → 渐进式检索 → 标出处 |
| **M8 镜头配方** | 单镜头实现 | shotcraft | 读卡全文 → 按「参考实现」定位 demo → 改参数不降档 |

同形态内怎么选、每个引擎的硬前提与长度上限，见 `references/taxonomy.md` 第一节和第二节。

## 2 · 风格：一条轴不够，有六条

| 轴 | 内容 | 落地 |
|---|---|---|
| A 风格族 | 82 族（39 族跨库有实现） | `catalog/styles.json` |
| B 动效风格文件 | 43 个（本质/辨识信号/运动/声音/坑） | `engines/garden-skills/skills/motion-showreel/references/styles/` |
| C 案例风格 | 46 个（10 大类，带真实源码） | `engines/claude-motion/references/case-catalog.json` |
| D MG 签名技法 | 15 种可检验技法 | `engines/mg-motion/references/styles.md` |
| E 网页设计学校 | 6 个学校 | `engines/garden-skills/skills/web-design-engineer/SKILL.md` |
| F 出图模板类 | 17 类 + prompt 方法论 | `engines/garden-skills/skills/gpt-image-2/references/` |

三条风格铁律（细节见 `references/style-library.md`）：

1. **用户没指定风格时给三个方向，且必须来自不同分类**：A 贴合 / B 换语言 / C 大胆，每个配一张真代码渲的关键帧。
2. **只读选中的 1–2 个风格文件**；一主一辅；超过 3 种同时在场 = 糊。
3. **风格是起点不是选择题**：可以直接用、可以改造（写明改了什么）、可以按 `styles/_template.md` 自定义；
   换主题不换规则，但也别把上一支片换文案再交一次。

## 3 · 通用五段流程

| 段 | 做什么 | 纵深 |
|---|---|---|
| 0 Brief | 一次问清七件事：时长/画幅/fps、交付物、声音、字幕与语言、素材来源、投放位、品牌约束 | `references/pipeline.md` §0 |
| 1 参考与定调 | 有参考就实测（能量图/切点/静止比/t80 与拖影）；没参考就立可复核的数字目标 | `references/motion-grammar.md` |
| 2 概念与风格 | 三个互不相同的中心思想 + 按名选定风格（或按学校库给三方向） | `references/style-library.md` |
| 3 结构 | 视频＝节奏+承接的 beat sheet；网页＝Design Read 与信息架构；长文＝编辑计划与阅读节奏 | 各引擎 ENGINE.md |
| 4 实现与闸 | 每帧是时间的纯函数（视频）/ 单文件可离线（网页文章图）；先关键帧再整片；过三道闸 | `references/quality-gates.md` |
| 5 交付 | 按形态交付，带实测数字与诚实的弱点 | `references/delivery.md` |

## 4 · 铁律（按形态分组，别跨形态套用）

**所有形态**：1) 需求先问清再动手；2) 不许伪造（没跑过的不叫复现，无声片不叫有声片）；3) 品牌名虚构、不用真商标；
4) 素材记账（来源/许可/作者/URL 进 CREDITS）；5) 交付前必须自检，自检不过不许交。

**M1 视频**：每帧只依赖 t（禁 `Date.now()` / 随机不固定种子）；不按节拍器等分切；不替换 beat 要承接它；
留白是爆点落地的条件；快动作上快门（> ~80px/帧）；运镜要追主角并声明 `inFrame`；不用粒子彩纸当装饰；
草稿只渲 1080p30。

**M2/M3/M4 网页类**：单文件可离线；字体系 ≤ 2 套、层级 ≤ 5 级；占位符清零；先给 v0 再完整构建；
三个方向不许同一分类；关键状态截图留档。

**M5 出图**：先定模式再动手；按模板槽位填，不即兴写散文；prompt 与产物记账；真商标与真人肖像不做。

**M7 检索**：先读该类文件的处理方法再检索；最多 5 轮迭代；每条结论标出处，找不到就说找不到。

## 5 · 三类闸

| 闸 | 用什么 | 判什么 |
|---|---|---|
| **机器闸（视频）** | `node scripts/qc.mjs gate <video> --spec spec.json` + 引擎自带闸（`mg-qc.mjs` / `verify_promo.py`） | 时长/画幅/fps/LUFS/真峰值/黑帧/静帧比例 |
| **机器闸（网页/文章）** | `node scripts/check-web.mjs <file.html>` | 单文件、体积、title/lang/viewport、字体数、emoji 数、时间驱动入口、占位符残留 |
| **静帧/截图闸** | 自己 `read_image` | 6–10 张关键帧能不能当海报；关键状态有没有崩 |
| **评审闸** | **干净上下文的独立 subagent** | 视频按 `jury.md` / `final-review.md` 打分，带帧号证据；改完再评一轮 |

不出闸不交片，也不许改标准来「通过」。判定口径见 `references/quality-gates.md`。

## 6 · 交付契约

**视频（M1/M2）**：MP4/网页 + 可重建源码 + 七项报告（概念 / 带时间码 beat sheet / 技法逐条 / 风格与交接 /
技术路线 / **实测数字** / top-3 弱点）。
**网页文章图（M3/M4/M5）**：产物文件 + 关键状态截图 + Design Read 或编辑计划 + 素材许可清单。
**素材与检索（M6/M7/M8）**：导出目录或答案 + 接入说明或出处清单 + 依赖与许可。

细节与各形态的额外交付物见 `references/delivery.md`。

## 7 · 目录地图

```
Code-Video-Infinite.skill/
├── SKILL.md                  # 本文件：判形态 → 选引擎 → 定风格 → 闸 → 交付
├── README.md / LICENSES.md   # 人看的说明与逐引擎许可
├── spec.json                 # 统一机器闸默认规格
├── references/               # 跨引擎判断（本 skill 自己的东西）
│   ├── taxonomy.md           # 分类学：八形态 × 十一引擎 × 六风格轴
│   ├── style-library.md      # 风格库怎么用：选族/三方向/混搭/反 AI 陈词滥调
│   ├── web-and-image.md      # 网页·文章·出图·网页视频的工艺
│   ├── pipeline.md           # 通用五段流程与每段的动作与命令
│   ├── motion-grammar.md     # 节奏·曲线·承接·运镜
│   ├── sound.md              # 声音与许可红线
│   ├── quality-gates.md      # 三类闸的判定口径
│   ├── delivery.md           # 按形态的交付清单
│   ├── assets-and-licenses.md# 素材在哪、能不能再分发
│   └── provenance.md         # 十一个来源、版本、合并做了什么
├── catalog/                  # 生成物：index.json / styles.json / INDEX.md / assets-index.json
├── scripts/                  # pick / find / doctor / qc / check-web / build-catalog / check-links
└── engines/                  # 十一个引擎原样保留（各自 ENGINE.md 或 skills/*/SKILL.md）
```

## 8 · 什么时候读哪个文件

| 时机 | 读 |
|---|---|
| 不知道用哪种形态 / 哪个引擎 | `references/taxonomy.md` |
| 要选风格、要三个方向、要混搭 | `references/style-library.md` |
| 做网页 / 长文 / 出图 / 网页视频 | `references/web-and-image.md` |
| 要开工，需要每段的具体动作与命令 | `references/pipeline.md` |
| 视频节奏不对、像 PPT、动作太软 | `references/motion-grammar.md` |
| 配音 / 音效 / 配乐 / 响度 | `references/sound.md` |
| 快交付了，怕不过闸 | `references/quality-gates.md` |
| 要交片、要报告、要再改 | `references/delivery.md` |
| 素材能不能商用 | `references/assets-and-licenses.md` |
| 引擎纵深（唯一权威） | `engines/<engine>/ENGINE.md`；garden 的在 `engines/garden-skills/ENGINE.md` |

## 9 · 许可一句话

聚合分发，不改变各自许可：onetake 是 PolyForm Noncommercial（**非商用免费，商用需授权**），
shotcraft / wise-motion 是 Apache-2.0，claude-motion 与 garden-skills 是 MIT（第三方资产各自许可），
mg-motion 以上游 mg-styles-15 的 MIT 为准。统一层文字与脚本按 MIT。商用前读 `LICENSES.md` 的「商用速查」。
