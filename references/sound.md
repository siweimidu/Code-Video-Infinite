# 声音：一个房间、一套材质、一条账

## 三条铁律

1. **一个房间、一套材质。** 每个事件一条合成音 = 音频版的幻灯片。同一条片里混响与音色要统一。
2. **事件数少于 beat 数。** 每一拍都配音效，一分钟内就会被判「低劣」。
3. **音乐默认只用允许商用的曲目，并记账。** 用户明确提供的曲目优先；绝不擅自拉商业曲。

## 目标数值

| 场景 | 综合响度 | 真峰值 | 说明 |
|---|---|---|---|
| 社交/网页/发布片 | `−14 LUFS` | `≤ −1 dBTP` | mg-motion 默认规格 |
| 长片/播客式/要留余量 | `−16 LUFS` | `−3.5 ~ −4 dBTP` | onetake 的口径：AAC 编码后还会抬，留给 verify 的 −3 dBFS 余量 |
| 混音中让音乐坐上去 | 音效峰值约 `−8 dBFS` | — | 低于音乐会糊，高于音乐抢戏 |

实测命令（本仓库统一闸，任何引擎出的片都能量）：

```bash
node scripts/qc.mjs measure draft.mp4          # LUFS / LRA / dBTP / 黑帧 / 静帧
node scripts/qc.mjs gate draft.mp4 --spec spec.json
```

## 三条现成的路

### A. 合成材质（最快，草稿够用）

```bash
python engines/onetake/scripts/sfx_palette.py --demo demo.wav
```

五种合成材质（air / wood / glass / sub / bubble）共用一条混响，峰值压到 −8 dBFS 好让音乐坐上去。

### B. 录制 + 合成的配乐脚本（成片用）

```bash
python dump_events.py && python score.py    # 合成 → 录制源叠加 → 卷积混响 → 音乐侧链 → 母带
```

时间与声像都从合成里的 `window.__events()` 来，不是凭手感对。录制源（Kenney CC0、UIowa MIS、Voxengo IR）**不随本仓库分发**，自己下并保存许可。

### C. MG 配乐工具包（有 103 个采样）

```bash
python engines/mg-motion/demos/<slug>/audio.py     # → out/audio.wav
```

对位靠 `cues.json`（唯一真相源），`mg-qc.mjs --cues` 会把漏掉的落点列出来。

### D. 产品片的音效与 BGM（shotcraft）

- 选材与下载：读 `engines/shotcraft/references/sfx-sourcing.md`，用 `assets/scripts/sfx-source.py` 搜 Freesound，**默认 CC0**，允许署名时可用 CC BY；下载时复核详情页许可，自动生成来源清单、署名、哈希与音频测量。
- 下载到的是 MP3 预览，**不能标成原始无损**。渲染只读工程内的固定文件。
- BGM 备选 5 首在 `engines/shotcraft/assets/audio/bgm/`，授权见同目录 `ATTRIBUTION.md`。用户明确指定的音乐/音效永远优先。
- 卡点片全程贴 `engines/shotcraft/references/music-beat-sync.md`（先分析曲再分镜）。

## 许可红线（容易踩）

- **不随仓库分发的**：onetake 的录制素材包、Voxengo IR、Kenney 包等都要用户自己下；拿到源文件前先看许可。
- **不能再分发文件的**：例：Mixkit 的素材不允许把文件再分发出去。产品里要出声就换源。
- **署名**：CC BY 必须在交付物里带上；CC0 也建议记账。
- **音乐**：默认只用 NCS / Pixabay Music / YouTube Audio Library / CC 允许再用的曲目，并把来源与许可写在 score 旁边。
- **多人协作时**：把 `CREDITS.md` 放进工程，逐条记来源、许可、作者、URL。

## 静音与字幕

- 没有 `audioWav()` / 没有音轨就是无声片，**不要把无声片称为有声片**。
- 不要因为聊天用中文就擅自加中文字幕；字幕语言是需求项，不是默认项。
