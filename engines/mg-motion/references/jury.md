# 评审协议：两轮，跨会话，独立评委

上游 15 支原片就是这么迭代出来的：**制作 → 独立评审 → 按评审修改 → 再评审**。
终评 7.57–8.21 / 10。本 skill 要求两轮都评，**第二轮全维度 ≥ 9 才算过**。

---

## 为什么必须换会话

同一个会话评自己的片子，会不自觉地替它辩护。
**评委必须是没参与制作的会话**——用 `subagent`（不带 fork），
或另开一个会话，把片子路径 + rubric 喂给它。

评委只需要三样东西：片子路径、风格签名技法、出片规格。
不要给它制作过程，它不需要知道你想干什么，只需要看片。

---

## 第一轮：评审

交给独立会话（原文可直接用）：

```text
You are a senior motion-design jury member (think: Motionographer editor,
Buck/ManvsMachine creative director, a 抖音/B站 top design-account lead for the
Chinese styles). You did NOT make this film. Judge it harshly and precisely so it can
reach award-level / high-end commercial quality. Kindness is useless here; specificity
is everything.

The film: <video.mp4 的绝对路径>
Its style signatures (the film is judged against these): <粘 styles.md 里对应风格那节>
Output spec: <1920x1080, 30fps, exactly 10.000s, -14 LUFS, TP <= -1 dBTP>

1. Look at the film properly — do not skip this:
   - contact sheet: one frame every 0.5 s
   - filmstrips around the fastest move and the hero moment
   - full-resolution frames at 5-8 key times
   Look at small details at full resolution: edges, type setting, aliasing, banding,
   texture, clipping.
2. Check the spec: exactly 10.00 s, resolution and fps as specified, audio present,
   loudness ~= -14 LUFS (+/-1), true peak <= -1 dBTP, no black frames except intended,
   no unintended static spans, visual hits aligned with audio onsets.
3. Score 1-10 on each dimension
   (5 = competent student work; 6 = decent template level; 7 = solid professional;
    8 = high-end agency work; 9 = award shortlist; 10 = best in the world).
   Most first renders deserve 5-7. Do not inflate.
   - style_fidelity: instantly recognisable canonical form; every signature feature and
     technique present and correct
   - concept_wow: a clear idea, a hook in the first 0.5 s, an unmistakable hero moment,
     a satisfying end frame
   - motion_craft: easing, spacing, overlap, anticipation and follow-through, arcs,
     transitions, motion blur; no dead or jittery motion
   - design_typography: composition, hierarchy, grid, type setting (CJK too), palette,
     negative space
   - finish_texture: lighting, texture, grain, glow and detail appropriate to the style;
     no banding, aliasing or artifacts
   - sound_sync: musicality, genre-correctness, sound design, sync to picture, mix and master
   - technical: spec compliance, fonts loaded, no glitches, clipping or popping
4. Give 5-10 fixes ordered by impact on the final impression. Each: timecode(s), what is
   wrong (observable), why it matters, and a concrete how-to (technique and numbers:
   easing curve, frame counts, px, colours, font, layout change). Prefer a few big
   upgrades over many nitpicks. At least one fix must raise the wow factor, not just polish.
5. Flag as critical: anything that reads as generic or AI-template, unnatural Chinese
   copy, fallback fonts or tofu, and any spec failure.

Return: the score table, the critical issues, and the fix list.
```

### 评审前先跑机器闸

**不要让 AI 评委去数字数。** 先自己跑：

```bash
node scripts/mg-qc.mjs <video.mp4> --spec spec.json --cues cues.json
```

把 `qc-report.json` 的实测数字**一起喂给评委**。这样它可以把精力放在
「构图和运动到底行不行」这种机器判不了的地方，而不是去猜响度。

---

## 第二轮：修改

回到制作会话，贴入评审结果：

```text
An independent jury reviewed your film. Here is the full review:
<粘贴评审>

Raise the film to award level (target >= 9 in every dimension):
- First keep a copy of the current video and source as version N.
- Implement every critical issue and every high-impact fix. You may substitute a better
  solution for a listed fix if you are confident; say why. Go beyond the list where you see
  a bigger upgrade, especially for the wow factor. Do not regress anything the jury listed
  as a strength.
- Re-render at full resolution, re-check the spec and look at the frames until the fixes
  have truly landed.
- Report which fixes you applied or skipped, and why.
```

---

## 第三步：复评（这一步不能省）

改完之后，**再用一个新的、未参与修改的会话评一次**。这是唯一能证明修改真的落地的办法。

```text
This film was revised after your colleague's review. Re-judge it as if seeing it fresh.
You did not see the previous version.

Film: <video.mp4 的绝对路径>
Measured spec (machine-verified, do not re-derive): <粘 qc-report.json 的数字>

1. Confirm the previously listed critical issues are actually gone. Name any that remain.
2. Re-score all seven dimensions. Be honest — a revision can easily regress something that
   was already good.
3. Report anything NEW that broke.
4. Is this now award level? If not, give the top 3 remaining fixes with numbers.

Return: the confirm/remaining table, the new score table, and any regressions.
```

**收敛标准**：

| 条件 | 判定 |
|---|---|
| 机器闸全 PASS + 静帧闸过 + 复评全维度 ≥ 9 | 出片 |
| 复评有维度 < 9 | 再来一轮评审-修改，**最多三轮** |
| 三轮后仍 < 9 | 交片，但在报告里诚实写明哪几项没达标、为什么 |

---

## 分数怎么读（避免自欺）

| 分数 | 含义 | 该做什么 |
|---|---|---|
| 5 | 学生作业 | 重做概念 |
| 6 | 模板级 | 回 `styles.md` 补齐签名技法 |
| 7 | 专业水准 | 调运动细节 + 换转场 |
| 8 | 高端代理 | 加 wow 因子：换概念/加高潮 |
| 9 | 获奖短名单 | 只补漏 |
| 10 | 世界最好 | 基本不存在 |

**最常见的自欺**：七个维度都 8 分，就以为「还不错了」。
但 `concept_wow` 8 分和 6 分的片子给人的记忆点是两个量级。
**优先修 concept_wow 和 motion_craft**，这两个分数低 = 片子没有灵魂。

## 交付时要附的评审记录

```
第一轮：style 8.1 / concept 7.2 / motion 7.8 / design 8.0 / finish 7.5 / sound 8.3 / tech 8.0
  critical：无
  top fixes：① 2.0s 高潮太弱 ② 中文文案第三句生硬 ③ 结尾定格无微动
第二轮：style 9.0 / concept 8.8 / motion 9.1 / design 9.0 / finish 8.7 / sound 9.2 / tech 9.0
  确认修复：① ③  遗留：无  回归：无
```

这份记录比片子本身更能说明流程是否真的执行了。
