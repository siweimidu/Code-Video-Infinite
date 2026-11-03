# 分类学：八种交付形态 × 十一个引擎 × 六条风格轴

这份文件回答一个问题的全部：**用户这句话，该产出什么、用谁产出、按什么风格产出。**
先判形态（唯一入口），再判引擎（同形态内比能力），最后选风格（跨库同一套视觉规则）。

## 一、八种交付形态（先分类，再动手）

| 形态 | 交付物 | 判据（听到这些词就往这走） | 引擎 |
|---|---|---|---|
| **M1 视频成片** | MP4 + 可渲染源码 | 视频/片子/动效/宣传片/发布片/片头/teaser/promo/演示视频/作品集 | onetake · shotcraft · mg-motion · motion-showreel · claude-motion |
| **M2 网页视频** | 点击驱动的 16:9 网页（可录屏） | 用网页做视频/点击翻页/录屏/动态 PPT/不像 PPT/口播稿变视频 | web-video-presentation |
| **M3 网页制品** | 单页 HTML 或 React 工程 | 网页/落地页/官网/仪表盘/原型/UI/deck/数据可视化/设计系统 | web-design-engineer |
| **M4 长文** | 单文件 HTML 长文 | 文章/长文/把链接或 PDF/DOCX 做成网页文章/简报/复盘 | beautiful-article |
| **M5 静态图** | PNG / 系列图 | 海报/封面/信息图/产品图/主视觉/分镜图/头像/缩略图 | gpt-image-2（+ 宿主图像工具） |
| **M6 动效素材** | 导出源码 + 接入说明 | 只要这个动作的源码/放进我的工程/复用一个转场 | wise-motion |
| **M7 知识检索** | 答案 + 出处 | 从知识库/资料/文档里找/回答我 | kb-retriever |
| **M8 镜头配方** | 单镜头实现（TSX/JS） | 只要一个镜头/这个转场怎么做/镜头卡 | shotcraft（镜头卡 124 张） |

M8 不是独立交付形态，是「做 M1 时的镜头零件」；单独调用时只交付一个镜头。
判形态的工具：`node scripts/pick.mjs "<需求>"`（内置决定性分流词表，命中即定，不会被「网页」这种泛词带偏）。

## 二、十一个引擎的能力边界

| 引擎 | 形态 | 强项 | 硬前提 | 长度 |
|---|---|---|---|---|
| onetake | M1 | 节奏与承接的 oracle、真实快门运动模糊、合成音效、多语言同源 | Python + Chrome | 10–30s（配音演示 ~60s） |
| shotcraft | M1 / M8 | 124 张镜头配方卡、真实页面捕获、Ink Press 模板、剪映导出、社交发布 | Node + Remotion | 30s–3min 多镜头 |
| mg-motion | M1 | 15 种可检验签名技法、机器闸 10 道、两轮评审 | Chrome（MG_CHROME）+ ffmpeg | 5–30s |
| motion-showreel | M1 | 43 个风格文件、章节式长片、口播/TTS/配乐一体 | Node + 浏览器逐帧 | 10s–20min |
| claude-motion | M1 | 47 套源码案例、20 个组件、30 个模型、14 个场景 | Node ≥22 + Playwright + ffmpeg | 10–30s |
| web-video-presentation | M2 | 口播稿 → 逐屏网页，录屏即成视频 | 浏览器 | 逐点击 |
| web-design-engineer | M3 | 设计系统 + 学校库 + 反 AI 陈词滥调 | 浏览器 | 单页 |
| beautiful-article | M4 | reacticle 组件协议、三视角终审 | 浏览器 | 长文 |
| gpt-image-2 | M5 | 18 类模板、三运行模式 | 图像工具或纯提示词 | 单图/系列 |
| kb-retriever | M7 | 渐进式检索、按文件类型换工具 | Python + pdfplumber/pandas | 按需 |
| wise-motion | M6 | 462 条动作的真实源码与预览 | 只要 Node.js | 单动作 |

同形态内怎么选（M1 的五家）：

- **要「不像 PPT」的节奏** → onetake（它把节奏和承接做成可测的 oracle）。
- **要影视感多镜头、真实网页当画面** → shotcraft。
- **要某种 MG 风格的签名技法、且要两轮评审** → mg-motion。
- **要超过 1 分钟、要章节、要口播配乐一体** → motion-showreel。
- **要具体造型/材质/3D 物件/角色动物** → claude-motion。

## 三、六条风格轴（同一套视觉规则，多处实现）

| 轴 | 内容 | 在哪 | 用途 |
|---|---|---|---|
| A 风格族 | 39 个族（其中 39 个跨 2–4 个库有实现） | `catalog/styles.json` | 选风格、混搭、跨库换实现 |
| B motion-showreel 风格库 | 43 个风格文件（本质/辨识信号/运动/声音/坑） | `engines/garden-skills/skills/motion-showreel/references/styles/` | 当写实约束用，不当选择题 |
| C claude-motion 案例风格 | 46 个风格（10 大类，带真实源码案例） | `engines/claude-motion/references/case-catalog.json` | 要源码级复现时 |
| D mg-motion 签名技法 | 15 种可检验技法 | `engines/mg-motion/references/styles.md` | 要可被评审核对的技法 |
| E 网页设计学校 | 6 个学校（信息架构/编辑极简/现代工具/动效实验/粗野/温暖人文） | `engines/garden-skills/skills/web-design-engineer/SKILL.md` | M3 的方向选择，**三个方向不许同一行** |
| F 出图模板类 | 17 个模板目录 + prompt 方法论文档 | `engines/garden-skills/skills/gpt-image-2/references/` | M5 的模板与提示词 |

动作语汇（不是风格）：wise-motion 的 23 类 462 条，负责「怎么动」；风格负责「长什么样」。两者正交。

## 四、组合矩阵（什么时候跨引擎）

| 目标的缺口 | 从哪补 | 怎么接 |
|---|---|---|
| 有节奏但缺一个具体动作 | wise-motion | `find.mjs "<动作>" --medium M6-motion-source` → `export.mjs --out-dir` |
| 有风格但缺镜头语言 | shotcraft 镜头卡 | `find.mjs "<意图>" --collection shot-card` → 读卡全文 → 照卡实现 |
| 有片子但缺具体造型 | claude-motion | `create-model.mjs / create-scene.mjs` → 导出素材 |
| 有网页但要变成视频 | M3 → M1 或 M2 | 先 web-design-engineer 出页面，再 shotcraft 捕获 / 或直接改做成 onetake 合成 |
| 有长文但要有配套图 | beautiful-article + gpt-image-2 | 文章里每张图配一套 prompt 存档 |
| 要投稿/发布 | 各引擎自带的发布路径 | 默认不自动发布；用户要求才走 |

## 五、反模式（合并五家踩过的坑）

- 用「网页」两个字就判 M3：长文、海报、网页视频都会被误判。用 `pick.mjs` 的决定性分流。
- 给三个同一学校的风格方向：用户看不出差别，选择失去意义。
- 把 wise-motion 的 462 条当 462 支片：那是动作条目，不是作品数。
- 拿 claude-motion 的 122 条研究清单当可调用案例：那是只读清单。
- 一次混 3 种以上风格：糊，不是丰富。
- 用 M1 的思路做 M3/M4：视频追求节奏与承接，网页追求可用与可读，长文追求信息保留与阅读节奏，权重完全不同。
