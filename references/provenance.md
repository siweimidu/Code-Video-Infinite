# 来源、版本与合并记录

## 五个来源

| 本仓库位置 | 上游 | 版本 | 许可 | 入口 |
|---|---|---|---|---|
| `engines/onetake/` | onetake（作者 Patrick，github.com/feitangyuan） | 1.1.0-lite | PolyForm Noncommercial 1.0.0 | `ENGINE.md` |
| `engines/shotcraft/` | video-shotcraft（Vincentwei1021/video-shotcraft） | 以 `package.json` 为准 | Apache-2.0 | `ENGINE.md` |
| `engines/claude-motion/` | claude-motion（Hype-yolo/claude-motion-skill） | v0.4.0-beta.1 | MIT（原创代码）+ 第三方资产各自许可 | `ENGINE.md` |
| `engines/mg-motion/` | mg-motion skill 包（基于 siweimidu/mg-styles-15） | — | 上游 MIT；本包未附独立 LICENSE（见 `engines/mg-motion/NOTICE-UPSTREAM.md`） | `ENGINE.md` |
| `engines/wise-motion/` | wise-motion（Wise Wong） | 以 `engines/wise-motion/catalog/registry.json` 为准 | Apache-2.0 + NOTICE | `ENGINE.md` |

## 合并做了什么

**一句话：五个引擎一个字节没删，外面加了一层统一入口。**

1. **五个 `SKILL.md` → `ENGINE.md`。** 保证全仓库只有一个 skill 入口（本目录的 `SKILL.md`），
   同时保留每个引擎的完整原始说明。唯一例外是 claude-motion 案例里**第三方 vendored** 的
   `assets/cases/animate/plugins/animate/skills/animate/SKILL.md` —— 那是上游源文件的一部分，原样保留。
2. **引擎目录整体搬迁，内部相对路径不变。** 引擎的 `references/`、`scripts/`、`assets/`、许可文件、
   `package.json` 全部原样在同级，所以引擎内部文档里的相对链接仍然有效。
3. **新增统一层**（本仓库自己的东西，可随时重建/删除而不影响引擎）：
   - `SKILL.md`：路由 + 14 条铁律 + 三道闸 + 交付契约
   - `references/*.md`：8 份跨引擎判断（选型、流水线、动效语法、声音、闸、交付、素材许可、本文件）
   - `catalog/`：从五个引擎**真实目录生成的** 880 条统一索引（`index.json` / `INDEX.md`）+ 537 个重型素材清单
   - `scripts/`：`doctor.mjs`（环境自检）、`find.mjs`（跨引擎检索）、`qc.mjs`（统一机器闸）、
     `build-catalog.mjs`（重建索引）、`check-links.mjs`（文档互链体检）
   - `README.md` / `LICENSES.md` / `spec.json`
4. **没有做的事（别误会）**：没有重写任何引擎代码；没有把五个渲染链合并成一个（它们依赖不同运行时，
   硬合并等于全部弄坏）；没有改动任何素材；没有把 onetake 的非商用条款「统一」成 MIT。

## 索引是怎么生成的

```bash
node scripts/build-catalog.mjs      # 读五个引擎自己的目录 → catalog/index.json + INDEX.md + assets-index.json
node scripts/doctor.mjs             # 确认五个引擎与它们的入口文件都在
node scripts/check-links.mjs        # 文档互链体检
```

条目来源（都可追溯）：shotcraft `engines/shotcraft/references/shots/**/*.md` 的 frontmatter、wise-motion `engines/wise-motion/catalog/registry.json`、
claude-motion `engines/claude-motion/references/{case,engine,scene,model,extension}-catalog.json` 与 `engines/claude-motion/references/source-index.json`、
mg-motion `engines/mg-motion/references/styles.md` 的 15 个 H2、onetake `engines/onetake/references/motion-library.md` 的表格与 `engines/onetake/looks/looks.json`。

## 怎么升级单个引擎

1. 备份并删除 `engines/<name>/`；
2. 拷入新版本，把它的 `SKILL.md` 改名 `ENGINE.md`；
3. 更新本文件的版本行与 `LICENSES.md`；
4. 跑 `node scripts/build-catalog.mjs && node scripts/doctor.mjs && node scripts/check-links.mjs`；
5. 若新版的目录结构变了，改 `scripts/build-catalog.mjs` 里对应的解析段（每个引擎一段，互不影响）。

## 已知边界（诚实清单）

- **五个渲染链没有统一**：onetake/mg-motion 用 Python+Chrome 或 Node+Chrome 逐帧；shotcraft 用 Remotion；claude-motion 用 Node+Playwright；wise-motion 只导出源码。命令各不相同，别混用。
- **统一闸只测机器能测的**（时长/画幅/fps/响度/真峰值/黑帧/静帧）。承接分、镜头还原度这类要么用引擎自带闸，要么靠评审闸。
- **索引条数 ≠ 可交付案例数**：claude-motion 的 122 条研究清单是只读目录，47 套案例里有 11 套预览不可用；wise-motion 462 条是动效条目，不是 462 支片。
- **shotcraft 的 `workbench/` 没随包分发**：它的 ENGINE.md 会让人跑 `node workbench/scripts/open.mjs`，但本包里没有这个目录（上游仓库才有）。交付时按 `references/delivery.md` 的说明降级处理，不要假装工作台可用。
- **mg-motion 包内缺独立 LICENSE 文件**：上游 mg-styles-15 是 MIT，但这份 skill 包没附带 LICENSE，已在 `engines/mg-motion/NOTICE-UPSTREAM.md` 里写明。


## 第二轮合并：garden-skills（六件套）

| 项 | 内容 |
|---|---|
| 来源 | **garden-skills**（ConardLi/garden-skills，上游 MIT） |
| 版本 | 以 `engines/garden-skills/package.json` 与各 skill 的 `manifest.json` 为准 |
| 位置 | `engines/garden-skills/`，743 个文件 / 27.1MB，**原样保留**（含 `dist/` 与 `website/`） |
| 与第一轮的区别 | 六个 skill 的 `SKILL.md` **没有改名**：它们带 manifest.json 与 README 交叉链接，改名会破坏上游结构。它们不是本仓库的独立入口，只是这个引擎内部的分工指南（见 `engines/garden-skills/ENGINE.md`） |
| 新增统一层 | `engines/garden-skills/ENGINE.md`（六件套 ↔ 八形态映射、硬节点、依赖、素材边界） |

这一轮还做了真正的**重构**（不只是加目录）：

1. **新建分类学** `references/taxonomy.md`：八种交付形态 × 十一个引擎 × 六条风格轴 + 组合矩阵 + 反模式。
   `references/engine-selection.md` 收薄为入口指针（判断已并入 taxonomy）。
2. **新建统一风格库** `catalog/styles.json`：把 43 个动效风格文件、46 个案例风格、15 种 MG 技法交叉对齐成
   **39 个风格族**（其中 39 个跨 2–4 个库有实现），人工整理了族名/分类/情绪/实现路径。
   同一风格族在三处实现的对照是一手数据，不是猜测。
3. **新建路由脚本** `scripts/pick.mjs`：自然语言需求 → 交付形态 + 引擎 + 三个风格方向（不同分类）+ 镜头/动作起点 + 闸 + 交付清单。
   内置决定性分流词表（避免「网页」把长文/海报的活抢走）。
4. **新建网页闸** `scripts/check-web.mjs`：单文件/体积/title/lang/viewport/字体数/emoji/时间入口/占位符 10 项。
5. **检索升级**：`scripts/find.mjs` 支持 `--medium / --engine / --collection` 分面，风格族也进检索。
6. **文档扩充**：新增 `references/style-library.md`（风格库用法/三方向/混搭/反 AI 陈词滥调）与
   `references/web-and-image.md`（网页·长文·出图·网页视频的工艺）。
7. 索引从 880 条增至 **1013 条**，集合从 11 个增至 15 个（新增 style / tool / design-school / image-template）。
## 第三轮：易用性层（为什么又改了一次）

目标只有一个：**用户不该记住形态/引擎/风格**。

| 新增 | 解决了什么 |
|---|---|
| `scripts/lib/router.mjs` | 判读逻辑从 CLI 里抽出来，pick / do / selftest 共用一套，改一处三处生效 |
| `scripts/do.mjs` | 从「给建议」变成「直接建好 brief.md / NEXT.md / plan.json / spec.json」；`--ask` 让不想敲命令的人回答 7 个问题 |
| `scripts/help.mjs` + `CHEATSHEET.md` | 一屏速查 / 可打印一页，替代「翻 11 份文档」 |
| `QUICKSTART.md` | 视频 / 网页 / 图 三次真实走查，含脚本真实输出 |
| `scripts/selftest.mjs` | 20 条路由回归。**它上线第一天就抓到一个真 bug**：「用真实网页画面做产品宣传片」被 M3 的「网页」带到网页制品去，已用「视频优先」规则修掉 |
| `SLOPPY` 口语词表 | 「炫 / 酷 / 能发朋友圈 / 贴墙上 / 台上边讲边点」这类说法也能判对形态 |

SKILL.md 也加了第 0 节「说人话就行」：默认先 `do.mjs`，再读文档，判读置信低就先问一句。

## 第四轮：选片台（gallery/）

- 新增 gallery/index.html：39 个风格族 + 13 段真实样片 + 11 个动图 + 124 张镜头卡 + 462 条动作，可搜索可筛选，file:// 直接打开。
- 视觉语言按用户提供的 **Pinguo / Apple-inspired design system** 落地：主色 Pinguo Blue #0066cc、圆角 1.2rem、药丸按钮、whisper-light 阴影、间距 4–128 标尺、动效曲线 cubic-bezier(.32,.72,0,1) 与 150/250/350ms 计时。token 以静态 CSS 内联，**不引入该设计系统的运行时依赖**。
- 数据与封面帧都是生成物：node scripts/build-posters.mjs（取片长 35% 处一帧）+ node scripts/build-gallery.mjs。源文件在 gallery/_src/{shell.html,style.css,app.js}。
- 没有真实案例帧的风格用「示意」瓦片（白底 + 分类 tint + 家族首字水印），**页面上明确标注，不冒充原片**。

## 第五轮：字体与静帧（让选片台"看得准"）

- **字体自托管**：gallery/fonts/ 里放了 DM Sans（400/500/600）与 JetBrains Mono（400/500）的 **latin 子集 woff2**，共 5 个 face / 170KB，附 OFL 许可原文（OFL-DMSans.txt、OFL-JetBrainsMono.txt）。构建时由 scripts/build-fonts.mjs 生成 gallery/_src/fonts.css 并内联进 index.html，所以离线打开也是设计系统原本的字形；中文仍回落系统字体（未内嵌 CJK，避免几百 MB）。
- **镜头卡静帧**：shotcraft 随包的 gallery/media/poster/ 有 54 张镜头卡静帧，其中 **50 张与卡片 id 对上**，已挂到选片台；其余卡片用「配方卡」（分类色 + 时长 + 能量条 1–4 格）呈现，**页面上标为配方卡，不冒充样片**。
- 两个构建器都可重跑：node scripts/build-fonts.mjs 与 node scripts/build-gallery.mjs。

## 第六轮：选片台三处可用性修复 + 回归自检

用户实测反馈「按钮显示不全、点了没反应」。用 CDP 连真浏览器量出来是三件事，不是猜：

| 现象 | 实测证据 | 修法 |
| --- | --- | --- |
| chip 被裁 | 14 个 chip 内容宽 1378px、容器 1116px，MG 签名技法 完全在视口外 | chips 改 flex-wrap，不再横向滚动 |
| 点击落空 | elementFromPoint 在 印刷与版画 圆心返回 DIV.filters（被粘性栏接走） | 换行后所有 chip 都在栏内；筛选栏偏移改用 nav 高度变量 |
| 点了像没反应 | 点 3D 与材质 确实 39/39 → 4/39，但结果区在 3700px 以下 | 点击后自动滚到结果区 + 已筛选提示 + 清除按钮 + chip 上显示族数 |

- 新增 scripts/check-gallery.mjs：CDP 起真浏览器，查 chips 可见性/遮挡/横向滚动、过滤生效、清除生效、自动滚动、字体加载、媒体加载，共 13 项，失败退出码 1。
- 现在 13/13 通过（chips 14 个全可见、过滤 39→4、scrollY 约 4143、DM Sans 与 JetBrains Mono 均已加载）。

## 第七轮：控制区吸顶 + 素材库总表（覆盖率 1013/1013）

- 用户反馈「滑动时上面的按钮不跟着动」「要足够全」。CDP 实测证明 chips 与 nav 的 sticky 本身正常，但搜索框会滚走、且页面只覆盖 696/1013 条素材。
- 改法：把 nav + 搜索 + 分类 chips 合成一条吸顶控制区（滚动后自动收成紧凑模式，导航链接收起）；新增「素材库总表」展区，按 11 个集合分栏，把剩下的 317 条全部纳入（源码动画案例 47 / 制作系统 5 / 场景起点 14 / 源码组件 20 / 物件模型 30 / MG 技法 15 / 动效函数 35 / 起始 look 6 / 网页设计学校 6 / 出图模板类 17 / 研究清单 122），每条点开都有「怎么用」命令；页脚显示覆盖率 1013 / 1013。
- 修掉一个隐藏很深的 bug：PowerShell 的 Set-Content -Encoding UTF8 给 style.css 写了 BOM，浏览器把第一条规则解析成 U+FEFF 加 " :root"（选择器无效），导致全部设计 token 失效、字体根本没被引用。现在 build-gallery 读取 _src 时统一去 BOM，check-gallery 增加「设计 token 生效」「样式表无 BOM 污染」两条断言。
- check-gallery 断言数 13 → 22，全部通过：控件吸顶跟随、滚动后紧凑模式、素材库分栏与筛选、覆盖率 1013/1013、字体加载、token 解析。

## 第八轮：预览从「静帧」升级成「能真播」

- 用户要求「有视频的直接能看视频」。盘点了每个引擎到底能播什么，而不是拿静帧充数：

| 来源 | 数量 | 播放方式 | file:// 可用 |
| --- | --- | --- | --- |
| 真实视频（onetake 案例 / wise 影片） | 13 | 卡片内 video，悬停自动播，点开全屏 | 是 |
| 动图 | 11 | img 直接动 | 是 |
| wise 动效条目 | 462 | 详情内嵌 wise 播放器 iframe（catalog/index.html#id） | 是（经典脚本） |
| onetake 动效函数 | 35 | 详情内嵌 onetake 播放器（gallery.html?demo=x&play） | 是 |
| claude 源码案例 | 47 | 给安装命令 + 直达链接（demo 用 ES module 且缺字体，装依赖前跑不起来） | 否，需本地服务 |
| shotcraft 镜头卡 | 124 | 只有 50 张官方静帧，**上游没有视频**，不假装能播 | — |

- 新增 scripts/serve.mjs：零依赖静态服务器（node scripts/serve.mjs --open → http://localhost:8088/gallery/index.html），让模块化 demo 也能播；卡片角标据此区分「可试播」与「需装依赖」。
- check-gallery 断言 22 → 27 项：动作条目全部挂播放器、点动作卡内嵌播放器、claude demo 不塞黑屏 iframe、serve.mjs 存在。

## 第九轮：修「角标压封面 / 空封面块」，并批量抓真实封面

- 三个实拍问题：镜头卡的时长角标很长（「约 7.5s（225f@30fps；四站…」）压住画面；没有封面的卡片仍在画一个空的媒体块；点开看不到封面。
- 改法：角标只留短时长（正则取 7.5s 这种），CSS 再加 ellipsis 兜底；**没有封面就不画媒体块**，改为紧凑文字卡（body.tight），播放能力改用 tags 里的「▶ 可试播 / ▶ 需装依赖」表达；详情里没有封面就不显示图片位。
- 新增 scripts/build-covers.mjs：起 headless Chrome 逐个打开 wise 播放器 catalog/index.html#id，抓 #preview 区域两帧取信息量大的那张，存成 gallery/covers/wise-<id>.jpg（支持 --shard/--of 并行、--force 重抓）。
- check-gallery 断言 27 → 30 项：没有空媒体块、角标不超长、动作条目有真实封面。

- 封面补抓两轮（--retry-blank，等待时间 4.2s → 6s）：**319 → 428 / 462** 条动作条目有真实预览帧；剩 33 条是深色/纯黑画面（抓帧无信息量），保持紧凑文字卡，不画黑缩略图。

## 第十轮：把「没有封面」彻底补掉（本地渲染静帧 + 字体补齐）

| 做了什么 | 结果 |
| --- | --- |
| 新增 scripts/build-shot-stills.mjs | 用 Remotion 渲染镜头卡静帧：临时工程里复制 _fixtures/_textures、改写相对路径、自动注册 124 个 Composition，bundle 一次后逐张 renderStill（约 3.3s/张）→ gallery/shots/<slug>.jpg，124/124 张本地静帧 |
| 新增 scripts/fetch-demo-fonts.mjs | claude demo 缺本地字体导致字体加载 await 卡死；按 demo 的 fonts.css 解析家族名/字重，用 Android UA 从 Google Fonts 取 .ttf（简写家族名如 Poiret/Josefin 有别名回退） |
| 新增 scripts/build-demo-videos.mjs | 用 CDP 循环截图把 demo 录成本地 mp4 的尝试（claude demo 仍受上游运行时限制，见下） |

诚实结论：claude-motion 的 47 个源码 demo 在本地跑不起来——除了字体，主脚本还依赖上游站点的其它资源，页面上 bodyLen 始终是 98（DOM 没被渲染），画布全黑。所以这 14 个没有案例帧的 demo 保持文字卡 + 「▶ 需装依赖」，不伪造视频。
shotcraft 的 template/src 也不在包里，但 demo 是自包含 TSX，所以静帧可以自己渲。

## 第十一轮：播放器重做（去第三方界面 + 声音）

| 问题 | 实测 | 修法 |
| --- | --- | --- |
| wise 播放器是原站整页（带它的导航/侧栏），看着不像播放器 | iframe 直接加载 catalog/index.html | 用 772x434 的裁剪窗 + 按容器宽度自动缩放（scale + 负偏移），只留预览区；比例锁 16:9 |
| 成片没声音 | 13 个视频里 10 个有 aac 立体声音轨、3 个 wise 影片本身无音轨 | 详情改原生 video：controls + 不静音 + 自动播放；被拦截时给大号播放按钮；卡片标 有声/无音轨；提示点喇叭或点画面，并给下载链接 |
| 时长显示 3865ms | 详情里拼的是原始 ms | 统一走 durLabel（>=1000ms 显示 1 位小数秒） |

诚实的音频事实：wise 的 462 条动效里只有 22 条带音效字段，其余本来无声；镜头卡是静帧；gif 无音轨。
check-gallery 34 -> 36 项（视频用原生播放器且不静音、wise 裁剪比例 16:9）。
