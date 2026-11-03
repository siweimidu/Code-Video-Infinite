# 许可说明（逐引擎）

**Code-Video-Infinite 是一个聚合分发包，不是单一许可的软件。** 五个引擎各自保留原有许可，
合并**没有**改变任何条款，也**没有**把非商用条款「统一」成宽松许可。

| 目录 | 引擎 | 许可 | 一句话条款 | 许可文件 |
|---|---|---|---|---|
| `engines/onetake/` | onetake | **PolyForm Noncommercial 1.0.0** | 非商业用途免费；**商业用途需向作者取得授权** | `engines/onetake/LICENSE` |
| `engines/shotcraft/` | video-shotcraft | **Apache-2.0** | 可商用，保留版权与声明；渲染引擎 Remotion 另有独立许可 | `engines/shotcraft/LICENSE` + `engines/shotcraft/assets/audio/ATTRIBUTION.md` |
| `engines/claude-motion/` | claude-motion | **MIT**（仅原创代码） | 可商用，保留版权声明；第三方模型/案例各自许可 | `engines/claude-motion/LICENSE` + `engines/claude-motion/THIRD_PARTY_NOTICES.md` |
| `engines/mg-motion/` | mg-motion | 上游 **MIT**（本包未附 LICENSE） | 以上游 mg-styles-15 仓库为准 | `engines/mg-motion/NOTICE-UPSTREAM.md` |
| `engines/wise-motion/` | wise-motion | **Apache-2.0** | 可商用，保留版权与声明；逐素材署名见 NOTICE | `engines/wise-motion/LICENSE` + `engines/wise-motion/NOTICE.md` |

## 统一层（本仓库新写的部分）

`SKILL.md`、`README.md`、`references/`、`catalog/`（生成物）、`scripts/`、`spec.json` 是为这次合并
新写的文字与工具，按 **MIT** 提供。它不改变 `engines/` 下任何文件的许可。

**再分发这个仓库时，必须一起保留**：五个引擎各自的 LICENSE / NOTICE / ATTRIBUTION / THIRD_PARTY_NOTICES，
以及 `references/assets-and-licenses.md` 里列出的素材授权信息。

## 素材（不是代码许可）

引擎主体是 MIT / Apache-2.0，**不代表**它带的字体、GLB 模型、音效、BGM、HDRI 可以随便再分发。
逐条清单与落点见 `references/assets-and-licenses.md`；机器可读的全量清单是 `catalog/assets-index.json`。

## 商用速查

| 你要做什么 | 先确认什么 |
|---|---|
| 给公司做一支产品片，交付客户 | **不要**用 onetake（非商用）；用 shotcraft（再确认 Remotion 的公司规模条款）、claude-motion（MIT）、mg-motion（上游 MIT） |
| 用 shotcraft 出片并商用 | Remotion 自身的许可（个人与小团队免费，公司可能需要付费） |
| 用 Freesound 音效 | 默认 CC0；选 CC BY 必须署名；下载的是 MP3 预览 |
| 用 claude-motion 的 GLB 模型 | 每个模型自己的许可（在 `engines/claude-motion/references/model-catalog.json` 的 `license` 字段） |
| 用 wise-motion 的目录素材 | `NOTICE.md` 的逐素材署名；条目 `source.license` 字段 |
| 用任何字体 | OFL/Apache 随字体带许可；不要把商业字体塞进交付物 |
| 用真实品牌/商标 | 不要。品牌名一律虚构 |

有任何一条不确定，就先查 `references/assets-and-licenses.md` 再开工——素材许可返工比做片贵。


## 第二轮：garden-skills（六件套）

| 目录 | 引擎 | 许可 | 一句话条款 | 许可文件 |
|---|---|---|---|---|
| `engines/garden-skills/` | garden-skills（motion-showreel · web-video-presentation · web-design-engineer · beautiful-article · gpt-image-2 · kb-retriever） | **MIT** | 可商用，保留版权与声明；出图的 prompt 与产物自行记账 | `engines/garden-skills/LICENSE` |

它的 `dist/` 与 `website/` 是上游发布物料（MIT 同样适用），原样保留但不参与产出。