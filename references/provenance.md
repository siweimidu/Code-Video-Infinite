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
- **mg-motion 包内缺独立 LICENSE 文件**：上游 mg-styles-15 是 MIT，但这份 skill 包没附带 LICENSE，已在 `engines/mg-motion/NOTICE-UPSTREAM.md` 里写明。
