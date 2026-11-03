# 素材在哪、能不能再分发

## 原则

1. **合并不改变许可。** 每个 `engines/<name>/` 保留它自己的 `LICENSE` / `NOTICE` / `THIRD_PARTY_NOTICES` / `ATTRIBUTION`。整个仓库**不能**按单一许可再分发。
2. **代码许可 ≠ 素材许可。** 引擎主体是 MIT / Apache-2.0，不代表它带的字体、GLB 模型、音效可以随便再分发——第三方资产各自保留许可。
3. **全量清单是生成物。** 所有 ≥32KB 的字体/模型/音频/视频/图片/HDR 都记在 `catalog/assets-index.json`（含字节数与路径），重建用 `node scripts/build-catalog.mjs`。

## 逐引擎：素材位置与许可落点

| 引擎 | 重型素材在哪 | 许可落点 | 注意 |
|---|---|---|---|
| onetake | `looks/fonts/`（OFL 字体 + 许可）、`cases/*.mp4`（成片示例）、`gallery/` | `LICENSE`（PolyForm Noncommercial 1.0.0）+ `looks/fonts/` 内的字体许可 | **非商用免费**；字体是 OFL，可随工程分发但要带许可 |
| shotcraft | `assets/audio/bgm/`（5 首 BGM）、`assets/{lib,scripts}/`、`demos/`、`gallery/`、`template/` | `LICENSE`（Apache-2.0）、`assets/audio/ATTRIBUTION.md` | SFX 走 Freesound（默认 CC0 / 允许时 CC BY）并自动记账；**共 5 首 BGM 的授权见 ATTRIBUTION** |
| claude-motion | `assets/cases/`、`assets/extensions/`、`assets/models/`（27 个外部 GLB）、`assets/scenes/`、`assets/production/` | `LICENSE`（MIT，仅原创代码）+ `THIRD_PARTY_NOTICES.md`（13.7KB，逐资产） | 模型有自己的许可（例如 CC0 的通用样例模型）；每条案例的 `source.license` 写在 `engines/claude-motion/references/case-catalog.json` |
| mg-motion | `mg-styles-15/assets/{fonts,hdri,textures}/` | 上游 mg-styles-15 为 **MIT**（github.com/siweimidu/mg-styles-15）；本包未附独立 LICENSE，见 `NOTICE-UPSTREAM.md` | 字体用 `bootstrap_fonts.py` 下 OFL/Apache 字体；HDRI 等按上游说明 |
| wise-motion | `catalog/{assets,effects,fonts}/`、`vendor/`、`dist/` | `LICENSE`（Apache-2.0）+ `NOTICE.md`（19.7KB，逐素材署名/来源/许可） | 目录里 462 条动效的 `source.license` 多为 Apache-2.0 / MIT，逐条可查 |

## 用素材时的硬规矩

- **只用允许商用的授权**：CC0 / OFL / Apache-2.0 / MIT / public domain。写进 `CREDITS.md`：来源、许可、作者、URL，一条不落。
- **品牌名虚构**，不用真商标。shotcraft 模板里的 logo 与文案是它自己的，给用户做片时换掉。
- **没能再分发文件的素材不放进交付物**（例：Mixkit 的素材不允许再分发文件本身）。
- **下载到的是预览就不叫无损**（Freesound 拿到的是 MP3 预览）。
- **用户指定的音乐/音效优先**，但许可仍由用户确认；默认只挑允许再用的曲目。
- **Remotion 有独立许可**：个人与小团队免费，公司可能需要付费 —— 商用交付前自己确认。

## 字体（最常见的静默失败）

- mg-motion：不做字体自举 → 渲染**静默卡住**。
  ```bash
  python engines/mg-motion/scripts/bootstrap_fonts.py          # 下载 OFL/Apache 字体到 mg-styles-15/assets/fonts/
  python engines/mg-motion/scripts/bootstrap_fonts.py --check  # 只体检，缺哪个报哪个
  ```
- onetake：`looks/fonts/` 已带 OFL 字体与许可，`look.py apply` 会把用到的字面内联进 `look.js`。
- wise-motion：`engines/wise-motion/catalog/fonts/` 与 `engines/wise-motion/vendor/calligraphy/` 是目录自带（体积大，注意许可说明）。
- claude-motion：案例默认多用字体回退，**字体回退不等于原片效果**（11 套案例预览不可用就是这个原因）。

## 体积与安装

全量仓库体积大（字体/预览/案例 mp4/GLB 都在里面）。想窄带工作可以直接只留需要的引擎目录，
但那样 `scripts/doctor.mjs` 会报缺引擎 —— 这是预期行为，不是坏包。

## garden-skills（六件套）

| 项 | 情况 |
|---|---|
| 许可 | **MIT**（`engines/garden-skills/LICENSE`） |
| 技能内容 | 六个 skill，各自的 `assets/ references/ scripts/ themes/ templates/` 都在 `engines/garden-skills/skills/` 下 |
| `dist/`（7.5MB） | 上游封面图，原样保留；**做片时不要用**（发布物料，不是素材库） |
| `website/`（16.4MB） | 上游官网静态站，原样保留；不参与任何产出 |
| 出图产物 | prompt 与图片必须记账（模式 A/B/C + 模型 + 尺寸 + 许可） |
| 字体 | 各 skill 自己 references 里说明来源；M3/M4 用系统字体或内联 OFL 字体 |
