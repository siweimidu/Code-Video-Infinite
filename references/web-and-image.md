# 网页 / 文章 / 图片：非视频形态的工艺

这三类形态最容易做「看起来会做视频但不会做设计」。它们的标准不是节奏与承接，而是**可用、可读、可辨认**。

## M3 网页制品（web-design-engineer）

**流程**：Step 0 先核实事实（别猜产品细节）→ Step 2 收集设计上下文 → **Step 2b 写 Design Read 并标定五个旋钮**
→ Step 3 **先声明设计系统再写代码** → Step 4 尽早给 v0 草稿 → Step 5 完整构建 → Step 6 验证 → Step 7 评审。

Design Read 模板（照填，不要写「现代简洁」这种空话）：

```
artifact: [landing / dashboard / prototype / slides / visualization]
audience: [主要读者]
visual-language: [具体流派，不是「现代 / 干净」]
mode: [greenfield / extension / preserve / overhaul]
visual-variance: 1-10
motion-intensity: 1-10
information-density: 1-10
asset-dependence: 1-10
brand-fidelity: 1-10
```

方向选择用「学校库」六行（信息架构 / 编辑极简 / 现代工具 SaaS / 动效实验 / 粗野主义 / 温暖人文），
**三个方向不许同一行**。选定后把方向写进项目笔记，后续所有决策引用它。

交付前跑：`node scripts/check-web.mjs <file.html>` + 截图回看 + Pre-delivery Checklist（原文在该 skill 的 SKILL.md）。

## M4 长文（beautiful-article）

- **协议**：不手写裸 HTML/CSS，用 reacticle 的语义组件 + 受主题约束的 Raw 自由层。
- **默认 100% 信息保留**（长文），要删内容必须先问。
- **三个硬节点**：Checkpoint 1（文章类型/主题/版式/配图模式/封面）、Checkpoint 2（第一跨页验收）、Checkpoint 3（终审交付）。
- **终审三视角**：结构（信息是否完整、顺序是否合理）、可读（排版、节奏、跳读体验）、事实（引用是否可核）。
- 交付：单文件 HTML（离线可开）+ 源 Markdown + 配图许可清单。

## M5 静态图（gpt-image-2）

**第一步永远是定模式**：

```bash
node engines/garden-skills/skills/gpt-image-2/scripts/check-mode.js          # A 本地出图 / B 委托宿主 / C 纯提示词顾问
node engines/garden-skills/skills/gpt-image-2/scripts/check-mode.js --json
```

- **A 本地**：走 OpenAI 兼容接口直接出图并落盘（要 key）。
- **B 宿主委托**：把渲染好的 prompt 交给宿主的图像工具（本环境就是 `generate_image` / `edit_image` 这类工具）。
- **C 顾问**：没有任何图像工具时退化为高质量 prompt 顾问 —— 这依然是有价值的交付，不要假装出图了。

**模板工作方式**：18 类模板（UI mockup / 产品图 / 地图 / 幻灯片视觉文档 / 海报与战役 / 人像角色 / 场景插画 /
编辑工作流 / 头像 / 分镜 / 网格拼贴 / 品牌包装 / 字体排版 / 资产道具 / 学术图 / 信息图 / 技术图）+ 一份
`prompt-writing.md` 方法论。先读方法论，再挑该类模板，**按模板的槽位填，不要即兴写一段散文**。

**约束**：真商标不做、真人肖像不做、prompt 与产物要记账（存 prompt 文件 + 命名规则 + 尺寸 + 模型）。

## M2 网页视频（web-video-presentation）

- **一次产出** `script.md + outline.md`（口播稿 + 开发计划），然后 **Checkpoint Plan 一次对齐 5 件事**：
  稿子 / outline / 主题 / 素材 / 开发模式。这是硬节点，必须停。
- **outline 只规划节奏与信息密度，不规划动画**；动画在章节开发时按 PRINCIPLES + ANTI-AI 法则即时设计。
- 每次点击推进口播稿的**一个节拍**，每一步独占整屏；进度条平时隐藏，只在悬浮时出现。
- 第 1 章必须走完「开发 → 强制验收」再继续第 2 章；大改后 bump STORAGE_KEY。

## 四类形态的共同底线

| 底线 | 为什么 |
|---|---|
| 单文件、可离线打开（M2/M3/M4） | 用户要能发出去、能在没网的地方打开 |
| 字体 ≤ 2 套、层级 ≤ 5 级 | 多了就散 |
| 占位符清零 | "lorem ipsum" 出现在交付物里等于没交付 |
| 关键状态截图留档 | 评审要看「改前改后」，只有 HTML 没法回看 |
| 品牌名虚构 | 不用真商标；模板自带的 logo/文案换成用户的 |
| 出图/素材记账 | 许可与复用都要靠这份账 |
