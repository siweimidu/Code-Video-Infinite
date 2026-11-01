# 三道闸：机器、静帧、评审

三条闸互补：机器能测的它测，机器测不了的交给眼睛，眼睛有确认偏差所以最后一关必须换人。
**任何一条不过都不交片**；也不许改测量标准来「通过」。

## 闸一 · 机器闸（客观、可复现）

本仓库的统一闸，任何引擎出的片都能测：

```bash
node scripts/qc.mjs measure film.mp4                     # 只读数字
node scripts/qc.mjs gate film.mp4                        # 按默认规格出 PASS/FAIL
node scripts/qc.mjs gate film.mp4 --spec spec.json       # 用工程自己的规格
node scripts/qc.mjs gate film.mp4 --json                 # 给 CI/脚本用，失败退出码 1
```

当前默认规格（可在 `spec.json` 覆盖）：1920×1080 · 30fps · `−14 ± 2.5 LUFS` · 真峰值 `≤ −1 dBTP` ·
黑帧 `≤ 0.8s` · 静帧比例 `≤ 85%` · 必须有音轨。
静帧比例这一项是**双向**的：太高像 PPT，太低说明没有留白让爆点落地。
统一闸的容差偏宽（响度 ±2.5 LU），**终版请再跑一次引擎自己的闸**（例如 mg-qc 的容差是 ±1 LU）——
统一闸用来兜底，不是用来替代引擎闸的。

各引擎自带的闸（更贴它的实现，优先用它的）：

| 引擎 | 命令 | 判什么 |
|---|---|---|
| mg-motion | `node engines/mg-motion/scripts/mg-qc.mjs out/video.mp4 --spec spec.json --cues cues.json` | 10 道实测闸：时长/画幅/fps/响度/真峰值/黑帧/静止/能量/音画对位等（以脚本实际输出为准） |
| onetake | `python engines/onetake/scripts/verify_promo.py draft.mp4 --comp comp.html --ref ref.mp4 --shots 0,1.6,3.0` | rhythm / burst / continuity / curves / framing 五条腿（见下） |
| claude-motion | `node engines/claude-motion/scripts/check-package.mjs` 与 `verify-*.mjs` | 工程与素材完整性 |
| shotcraft | `npm test` / 冒烟渲染 / `npx remotion still` | 组件单测与逐镜静帧 |
| wise-motion | `node engines/wise-motion/scripts/check.mjs` | 目录与素材一致性 |

统一调用（参数原样透传）：

```bash
node scripts/qc.mjs delegate onetake -- draft.mp4 --comp comp.html --ref ref.mp4 --shots 0,1.6,3.0
node scripts/qc.mjs delegate mg-motion -- demos/<slug>/out/video.mp4 --spec demos/<slug>/spec.json
```

### onetake 五条腿的判据（照抄口径，别自己发明）

- **rhythm**：镜头时长均匀、没有死静段、音频削波或从没安静过 —— 都算失败。
- **burst**：只有参考片里成簇硬切而本片没有时才失败；没有参考时只是警告。
- **continuity**：承接分 < 0.5 判失败（被毙的两版是 0.00 / 0.40，通过的是 0.75）。
- **curves**：单帧移动 > 80 px 而没有快门模糊 —— 失败。
- **framing**：`__meta.inFrame` 里声明的 id 出画（或标 `whole` 的被子镜切掉）—— 失败。

## 闸二 · 静帧闸（自己看，别自欺）

```bash
python engines/onetake/scripts/stills.py comp.html --times 0.1,0.7,2.4,6.2,9.9 --out stills.png
node engines/mg-motion/mg-styles-15/harness/render.mjs demos/<slug> --stills 0.1,0.5,3.0,6.0,9.5 --scale 0.5
```

取 **6–10 张**（必须有 0.1/0.2/0.3 三张验 hook，和结尾一张验定格），逐张用 `read_image` 看：

1. 能不能单独当海报？构图有没有层次与留白。
2. 标题拿掉后还剩下什么？（只剩几何示意 = 主体没画出来）
3. 文字排版：断行、字距、中英混排、标点。
4. 主体在画面里的比例与位置是否一致（跨帧漂移 = 相机没锁住）。
5. 结尾那张有没有微动（对比前后两帧）。

## 闸三 · 评审闸（换人、带证据、两轮）

**制作者对自己的产出有确认偏差，首检永远不能交给用户，也不能自己做。**

- 派一个**干净上下文的 subagent**，只给它：成片、关键帧、规格与需求、镜头/风格选择记录、参考片。
- shotcraft 的口径：按 `engines/shotcraft/references/final-review.md` 同时查
  方案一致性、功能完整性、镜头还原度、视觉/音频技术质量、数据安全，**逐条给带帧号的证据**。
- mg-motion 的口径：按 `engines/mg-motion/references/jury.md` 打 7 个维度，**两轮**：改完必须让
  **没参与制作的**会话再评一次；两轮全维度 ≥ 9 才算过（上游原片终评 7.57–8.21 是标尺）。
- 评审要能落地：改清单按「影响大小」排序，改完存版本 `v1/ v2/`，评审要看改前改后对照。
- 预算分配：**渲染要快，评审要慢。** 真正提分的是评审那几轮，不是第一遍生成。

## 什么时候可以交片

三条闸全绿 + 七项交付报告齐全（见 `delivery.md`）。缺一项就是没做完，别用「基本完成」交付。
