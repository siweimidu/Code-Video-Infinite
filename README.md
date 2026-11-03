# Code-Video-Infinite

**把一句话需求变成可交付的视觉成品。** 一个入口，八种交付形态，十一个引擎，一套跨库风格体系，三类交付闸。

不是把几个 skill 塞进一个文件夹：这里有一层**判断系统** —— 先判形态，再选引擎，最后按风格族落地，
每一步都有可执行的脚本、可核对的素材 ID 和可复现的闸。

## 八种交付形态

| 形态 | 交付物 | 引擎 |
|---|---|---|
| **M1 视频成片** | MP4 + 可渲染源码（10 秒到 20 分钟） | onetake · shotcraft · mg-motion · motion-showreel · claude-motion |
| **M2 网页视频** | 点击驱动的 16:9 网页，录屏即成片 | web-video-presentation |
| **M3 网页制品** | 页面 / 仪表盘 / 原型 / deck / 数据可视化 | web-design-engineer |
| **M4 长文** | 单文件 HTML 长文（离线可分享） | beautiful-article |
| **M5 静态图** | 海报 / 信息图 / 产品图 / UI mockup / 分镜 | gpt-image-2 |
| **M6 动效素材** | 单动作/转场的真实源码 | wise-motion |
| **M7 知识检索** | 答案 + 出处 | kb-retriever |
| **M8 镜头配方** | 单镜头实现（做 M1 时的零件） | shotcraft |

## 三条命令决定这一单怎么做

```bash
node scripts/pick.mjs "做一支 20 秒赛博风的产品发布动效，要运镜和音效"
# → 判形态 · 选引擎 · 三个不同分类的风格方向 · 镜头/动作起点 · 闸 · 交付清单

node scripts/find.mjs "HUD 雷达" --medium M1-video       # 分面检索：--medium / --engine / --collection
node scripts/doctor.mjs                                  # 环境 + 十一个引擎自检
```

## 家底（全部可检索，共 1013 条）

| 内容 | 数量 | 出处 |
|---|---|---|
| 镜头配方卡 | 124 张 | shotcraft |
| 动效条目（23 类动作语汇） | 462 条 | wise-motion |
| 源码动画案例 | 47 套 | claude-motion |
| 源码组件 / 物件模型 / 场景起点 | 20 / 30 / 14 | claude-motion |
| MG 签名技法 | 15 种 | mg-motion |
| 动效风格文件 | 43 个 | garden-skills · motion-showreel |
| 网页设计学校 | 6 个 | garden-skills · web-design-engineer |
| 出图模板类 | 17 类 | garden-skills · gpt-image-2 |
| 纯时间动效函数 / 起始 look | 35 / 6 | onetake |
| **统一风格族** | **82 个**（39 个跨库有实现） | 交叉对齐上面三个风格库 |

## 三类闸

| 闸 | 命令 | 判什么 |
|---|---|---|
| 视频 | `node scripts/qc.mjs gate film.mp4 --spec spec.json` | 时长/画幅/fps/LUFS/真峰值/黑帧/静帧比例 |
| 网页·文章 | `node scripts/check-web.mjs out/page.html` | 单文件/体积/title/lang/viewport/字体数/emoji/时间入口/占位符 |
| 人工 | 自己 `read_image` + 干净上下文的 subagent | 关键帧能不能当海报；评审带帧号证据，改完再评一轮 |

不出闸不交片；也不许改标准来「通过」。

## 目录

```
Code-Video-Infinite.skill/
├── SKILL.md            唯一入口：判形态 → 选引擎 → 定风格 → 闸 → 交付
├── references/         10 份跨引擎文档（taxonomy 是总纲）
│   ├── taxonomy.md          八形态 × 十一引擎 × 六风格轴
│   ├── style-library.md     选族/三方向/混搭/反 AI 陈词滥调
│   ├── web-and-image.md     网页·长文·出图·网页视频的工艺
│   └── pipeline / motion-grammar / sound / quality-gates / delivery / assets-and-licenses / provenance
├── catalog/            index.json（1013 条）· styles.json（82 族）· INDEX.md · assets-index.json
├── scripts/            pick · find · doctor · qc · check-web · build-catalog · check-links
└── engines/            onetake · shotcraft · claude-motion · mg-motion · wise-motion · garden-skills
```

## 安装

```bash
git clone https://github.com/siweimidu/Code-Video-Infinite.git "%USERPROFILE%\.claude\skills\Code-Video-Infinite.skill"
node "%USERPROFILE%\.claude\skills\Code-Video-Infinite.skill\scripts\doctor.mjs"
```

全量包：字体、预览图、案例视频、3D 模型、音效、上游官网物料都在仓库里，离线可用，所以克隆体积偏大。
只保留需要的 `engines/<name>/` 也能用；此时 doctor 会如实报缺引擎（预期行为）。

## 许可

聚合分发，不改变各自许可：**onetake 是 PolyForm Noncommercial（非商用免费，商用需授权）**，
shotcraft / wise-motion 是 Apache-2.0，claude-motion / garden-skills 是 MIT（第三方资产各自许可），
mg-motion 以上游 mg-styles-15 的 MIT 为准。统一层文字与脚本按 MIT。
商用前先读 `LICENSES.md` 的「商用速查」，素材逐条授权见 `references/assets-and-licenses.md`。

## 来源

十一个引擎的原始项目、版本、许可以及**两轮合并到底做了什么、没做什么**，写在 `references/provenance.md`。
索引与风格库都是生成物：`node scripts/build-catalog.mjs` 可随时从真实目录重建。
