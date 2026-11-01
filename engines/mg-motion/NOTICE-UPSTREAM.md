# 上游说明与许可缺口（合并时补记）

本目录是 **mg-motion** skill 包（原包名 opus5.5-styles-15 skills）的完整内容，合并进
Code-Video-Infinite 时**未删改任何文件**，只把入口 `SKILL.md` 改名为 `ENGINE.md`。

## 许可状态（重要）

- 上游项目 **mg-styles-15** 为 MIT，仓库地址：https://github.com/siweimidu/mg-styles-15
- 但**本 skill 包原始分发里没有附 LICENSE 文件**（只有 `SKILL.md` 内的一段说明提到上游是 MIT）。
- 因此这里不代上游补造许可证文本。使用/再分发前请以上游仓库的 LICENSE 为准。
- 包内 `mg-styles-15/assets/` 的字体、HDRI、贴图各有自己的许可：

- 字体：用 `scripts/bootstrap_fonts.py` 拉取 OFL/Apache 字体，许可随字体一起落盘。
- HDRI/贴图：见上游仓库对应目录说明。

## 内容边界

- `mg-styles-15/`：上游克隆内容（渲染器 `harness/render.mjs`、`assets/`）。**不要改**，要改就自己 clone 一份。
- `references/`：15 种风格的签名技法、混搭语法、评审协议。
- `scripts/`：`mg-qc.mjs`（10 道机器闸）、`bootstrap_fonts.py`（字体自举）。
- 上游 15 支原片终评 7.57–8.21 / 10，本 skill 的目标是越过这条线，方法见 `ENGINE.md` 第 6 节。
