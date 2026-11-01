# Code-Video-Infinite

**用代码做视频的单一入口。** 一句话需求 → 成片 MP4 + 可编辑源码。

把五个原本各自独立的动效/视频 skill 合成一个：**一个入口（`SKILL.md`）、一套流程（六段流水线）、三条闸（机器 / 静帧 / 评审）**，
五个引擎各自保留全部纵深文档、源码、素材与许可，一个字节没删。

## 五个引擎

| 引擎 | 它是什么 | 家底 |
|---|---|---|
| **onetake** | 单 HTML 合成 + 逐帧渲染的节奏型短片（10–30s，配音演示可到 ~60s） | 真实快门运动模糊、合成音效、6 套起始 look、35 个纯时间动效函数、节奏/承接 oracle |
| **video-shotcraft** | Remotion 电影感产品宣传片（真实页面捕获 + 镜头配方卡） | **124 张镜头卡**、Ink Press 完整模板、可复用组件库、Freesound 选音、动效工作台、剪映导出、社交发布 |
| **claude-motion** | 案例辅助的代码动画（造型、材质、3D、角色动物、纸艺、可运行场景） | **47 套源码案例**、5 套制作系统、14 个场景起点、20 个源码组件、30 个物件模型、122 条研究清单 |
| **mg-motion** | 15 种 MG 风格的签名技法 + 逐帧渲染 + 机器闸 | 15 种风格技法、混搭语法、103 采样配乐工具包、10 道实测闸、两轮评审协议 |
| **wise-motion** | 动效素材供应商（要一个动作的真实源码就用它） | **462 条动效条目**（23 分类）+ 预览 + 源码导出脚本 + 逐素材署名 |

## 统一层（合并时新增）

| 文件 | 作用 |
|---|---|
| `SKILL.md` | 唯一入口：引擎路由 + 14 条铁律 + 三道闸 + 交付契约 |
| `references/` | 8 份跨引擎判断：选型、流水线、动效语法、声音、质检、交付、素材许可、来源 |
| `catalog/` | **880 条统一索引**（镜头卡 124 / 动效条目 462 / 案例 47 / 组件 20 / 模型 30 / 场景 14 / 风格 15 / 动效函数 35 / look 6 / 研究清单 122）+ 537 个重型素材清单 |
| `scripts/` | `doctor.mjs`（环境自检）· `find.mjs`（跨引擎检索）· `qc.mjs`（统一机器闸）· `build-catalog.mjs`（重建索引）· `check-links.mjs`（文档互链体检） |
| `engines/` | 五个引擎原样保留（各自的 ENGINE.md / references / scripts / assets / LICENSE） |

## 快速开始

```bash
# 0) 放到你的 skills 目录里（Claude Code / Codex / 兼容 skill 的 agent 都能读）
#    ~/.claude/skills/Code-Video-Infinite.skill   （或 ~/.agents/skills/...）

# 1) 环境自检（30 秒，缺什么会告诉你装什么）
node scripts/doctor.mjs

# 2) 检索素材（跨全部五个引擎，中英文都行）
node scripts/find.mjs "HUD 雷达"
node scripts/find.mjs "产品 发布" --limit 5
node scripts/find.mjs fade --source wise-motion --json

# 3) 出片后过闸
node scripts/qc.mjs measure film.mp4
node scripts/qc.mjs gate film.mp4 --spec spec.json
```

开工时让 agent 读 `SKILL.md`：它会先问清交付规格，再按需求选引擎，不会拿目录丰盛程度当理由。

## 三条闸（这个仓库和别的「素材包」最大的区别）

1. **机器闸** —— `scripts/qc.mjs` 实测时长/画幅/fps/LUFS/真峰值/黑帧/静帧比例，或调引擎自带的闸。
2. **静帧闸** —— 6–10 张关键帧逐张看，能不能当海报。
3. **评审闸** —— 干净上下文的独立 subagent，带帧号证据打分，改完再评一轮。

不出闸不交片；也不许改标准来「通过」。

## 目录

```
Code-Video-Infinite.skill/
├── SKILL.md            唯一入口
├── README.md           本文件
├── LICENSES.md         逐引擎许可
├── spec.json           统一机器闸默认规格
├── references/         8 份跨引擎文档
├── catalog/            880 条索引 + 素材清单（生成物）
├── scripts/            5 个工具
└── engines/            onetake · shotcraft · claude-motion · mg-motion · wise-motion
```

## 安装与体积

这是一个**全量包**：所有字体、预览图、案例 mp4、GLB 模型、音效与配乐都在仓库里，离线可用，
所以克隆和下载体积明显偏大（千兆以内，首次 clone 慢是正常的）。
只想要窄带工作也可以只保留需要的 `engines/<name>/` 目录；此时 `scripts/doctor.mjs` 会如实报缺引擎。

## 许可

**聚合分发，不改变各自许可**：onetake 是 PolyForm Noncommercial（**非商用免费，商用需授权**），
shotcraft 与 wise-motion 是 Apache-2.0，claude-motion 是 MIT（第三方资产各自许可），
mg-motion 以上游 mg-styles-15 的 MIT 为准（本包未附 LICENSE，已在其目录写明）。
统一层文字与脚本按 MIT。素材、字体、模型、音效、BGM 的逐条授权见 `references/assets-and-licenses.md` 与各引擎的
LICENSE / NOTICE / ATTRIBUTION。**商用前请先读 `LICENSES.md` 的「商用速查」。**

## 来源

五个引擎的原始项目、版本、许可以及「合并到底做了什么、没做什么」，逐条写在 `references/provenance.md`。
重跑 `node scripts/build-catalog.mjs` 可以随时从五个引擎的真实目录重建索引。
