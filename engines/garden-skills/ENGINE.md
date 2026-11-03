# garden-skills（六件套引擎）

这个目录是上游 **garden-skills**（MIT，ConardLi/garden-skills）的完整内容，合并进 Code-Video-Infinite 时
**没有删改任何文件**，也没有把它的六个 SKILL.md 改名——因为它们各自带 manifest.json 与 README 交叉链接。

> **注意**：`skills/<名字>/SKILL.md` 是这个引擎内部的**分工指南**，不是本仓库的独立 skill 入口。
> 本仓库唯一的入口是根目录的 `SKILL.md`。六个 skill 对应八种交付形态里的六种。

## 六个 skill ↔ 交付形态

| 目录 | 形态 | 交付物 | 什么时候用它，而不是别的引擎 |
|---|---|---|---|
| `skills/motion-showreel/` | M1 视频 | MP4 + 可重建源码，最长 20 分钟、可分章节 | 要**长片**（> 1 分钟）、要章节结构、要口播/TTS/配乐一体化；它有 43 个风格文件可当写实约束 |
| `skills/web-video-presentation/` | M2 网页视频 | 点击驱动的 16:9 网页（可录屏） | 要「看起来像视频」但每次点击推进一个节拍；口播稿驱动、逐屏独占 |
| `skills/web-design-engineer/` | M3 网页制品 | 页面 / 仪表盘 / 原型 / deck / 数据可视化 | 要能点、能滚、能交付给人用的网页；设计方向要按「学校库」给三个不同方案 |
| `skills/beautiful-article/` | M4 长文 | 单文件 HTML 长文（可离线分享） | 有源材料（URL/PDF/DOCX/MD）要变成一篇可读的长文；走 reacticle 组件协议 |
| `skills/gpt-image-2/` | M5 静态图 | PNG / 系列图 + prompt 存档 | 要海报、信息图、产品图、UI mockup、分镜、头像等**单张图**；18 类模板 + 3 种运行模式 |
| `skills/kb-retriever/` | M7 检索 | 答案 + 出处 | 要从**本地知识库目录**里找答案（grep / pdfplumber / pandas 渐进式检索） |

## 每个 skill 的硬节点（照抄，不要跳）

- **motion-showreel**：0 环境检查 → 1 需求确认 🛑 → 2 `brief.md`（对标/用途/风格/Reel Read/分镜+声音计划）→ 3 风格帧 🛑（未定风格给 3 个方向各 1 张）→ 4 制作（有口播先备真实音频与时间戳）→ 5 配乐与混音 → 6 工作区预览 🛑 → 7 导出与技术检查 → 8 交付。
- **web-video-presentation**：Phase 1 一次产出 `script.md + outline.md` → **Checkpoint Plan**（一次对齐 5 件事：稿子/outline/主题/素材/开发模式）→ Phase 2 逐章开发（第 1 章强制验收）→ Checkpoint Audio（是否合成音频）→ Phase 3 音频 → Phase 4 录屏与后期。outline 只规划节奏与信息密度，**动画在开发时即时设计**。
- **web-design-engineer**：Step 0 先核实事实 → Step 2 收集设计上下文 → **Step 2b 写 Design Read 并标定五个旋钮**（visual-variance / motion-intensity / information-density / asset-dependence / brand-fidelity）→ Step 3 先声明设计系统再写代码 → Step 4 尽早给 v0 → Step 5 完整构建 → Step 6 验证 → Step 7 评审。
- **beautiful-article**：Phase 0 Intake → 1 Source→Markdown → 2 Editorial Planning（Brief/Outline/Theme/Assets）→ **Checkpoint 1** 逐项确认 5 件事 → 4 First Spread（第一章验收）→ **Checkpoint 2** → 5 全量构建 → 6 三视角终审 → 7 最小切片修复 → **Checkpoint 3** → 8 交付。
- **gpt-image-2**：**第一步永远先定运行模式**（`node skills/gpt-image-2/scripts/check-mode.js`）：A 本地出图 / B 委托宿主图像工具 / C 纯提示词顾问。模式错了后面全错。
- **kb-retriever**：定位 `knowledge` 根目录 → **先读对应 references 再处理**（PDF/Excel 有专门做法）→ 分层索引导航 → grep 渐进式检索（最多 5 轮）→ 回答时标出处。

## 依赖

| 需要什么 | 什么时候 | 怎么装 |
|---|---|---|
| Node.js | motion-showreel 的脚本、gpt-image-2 的 check-mode/generate | 已随 dev 环境 |
| Python + pdfplumber + pandas | kb-retriever 处理 PDF/Excel | `pip install pdfplumber pandas` |
| 图像工具（宿主自带或 OpenAI 兼容接口） | gpt-image-2 的 Mode A/B | Mode C 不需要任何 key |
| TTS（可选） | motion-showreel / web-video-presentation 的口播 | 按各自 references 的 provider 配置（内置 MiniMax mmx-cli / OpenAI TTS，可换 edge-tts 等） |

## 素材与许可

- 上游许可：**MIT**（见同目录 `LICENSE`）。
- `dist/`（7.5MB 封面图）与 `website/`（16.4MB 官网）是上游发布物料，原样保留，做片时不要用；
  交付物里的品牌名一律虚构，不要用真商标。
- 出图的 prompt 与生成图要记账（路径 + 模型 + 尺寸 + 许可），规则见根目录 `references/assets-and-licenses.md`。

## 纵深文档在哪

- 每个 skill 自己的 `references/`（例如 `skills/motion-showreel/references/styles/` 是 43 个风格文件，
  `skills/motion-showreel/references/sound.md` 是声音，`skills/web-design-engineer/SKILL.md` 有学校库与反 AI 陈词滥调清单）。
- 跨引擎的统一判断（选形态、选引擎、选风格、闸、交付）在根目录 `references/`，不要在这里找。
