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
   **82 个风格族**（其中 39 个跨 2–4 个库有实现），人工整理了族名/分类/情绪/实现路径。
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
