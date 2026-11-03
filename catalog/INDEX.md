# 统一索引 · Code-Video-Infinite

由 `node scripts/build-catalog.mjs` 从各引擎真实目录生成，不要手改。
检索：`node scripts/pick.mjs "<一句话需求>"` 出生产计划；`node scripts/find.mjs "<关键词>"` 找素材。

## 一、交付形态 × 条目数

| 形态 | 说明 | 条目 |
| --- | --- | --- |
| `M1-video` | 视频成片（MP4 + 可渲染源码） | 399 |
| `M2-web-video` | 网页视频演示（点击驱动 16:9，可录屏） | 1 |
| `M3-web-artifact` | 网页/UI 制品（页面·仪表盘·原型·deck·数据可视化） | 7 |
| `M4-article` | 长文文章（单文件 HTML，离线可分享） | 1 |
| `M5-image` | 静态图（海报·信息图·产品图·分镜·UI mockup） | 18 |
| `M6-motion-source` | 动效素材（单动作/转场的真实源码） | 462 |
| `M7-retrieval` | 知识库检索（本地目录答问，带出处） | 1 |
| `M8-shot` | 镜头配方（单镜头编排与实现） | 124 |

## 二、引擎 × 条目数

| 引擎 | 条目 |
| --- | --- |
| claude-motion | 284 |
| garden-skills | 6 |
| gpt-image-2 | 17 |
| mg-motion | 30 |
| motion-showreel | 43 |
| onetake | 41 |
| shotcraft | 124 |
| web-design-engineer | 6 |
| wise-motion | 462 |
| **合计** | **1013** |

## 三、风格族（39）

同一风格在多个库里的实现并列，选 1-2 个用。

| 族 | 名称 | 分类 | 情绪 | 实现 |
| --- | --- | --- | --- | --- |
| `glass-material` | 玻璃 / 弥散渐变 | 3D 与材质 | 高级/精密 | motion-showreel:glass-material · claude-motion:glass-product · mg-motion:style-12 |
| `stained-glass` | 彩绘玻璃 | 3D 与材质 | 通透/静谧 | motion-showreel:stained-glass · claude-motion:stained-glass |
| `tilt-shift` | 移轴微缩 | 3D 与材质 | 精巧/专注 | motion-showreel:tilt-shift-miniature · claude-motion:tilt-shift |
| `toy-3d` | 3D 渲染 / 玩具 / 积木 | 3D 与材质 | 亲和/愉快 | motion-showreel:soft-3d-toy · claude-motion:brick-toy · claude-motion:lowpoly-island · mg-motion:style-04 |
| `painting` | 绘画（厚涂/水彩/速写） | 插画与绘画 | 浓烈/怀旧 | motion-showreel:painterly · motion-showreel:soft-organic · claude-motion:impasto · claude-motion:watercolor |
| `rubber-hose` | 橡皮管动画 | 插画与漫画 | 诙谐/活泼 | motion-showreel:rubber-hose · claude-motion:rubber-hose |
| `toon` | 卡通 / 赛璐璐 | 插画与漫画 | 热血/幽默 | motion-showreel:comic-pop · motion-showreel:cel-anime-80s · claude-motion:cel-anime-80s · claude-motion:anime-cel · claude-motion:scifi-toon · claude-motion:midcentury-toon |
| `illuminated` | 泥金手抄本 | 东方传统 | 珍重/静谧 | motion-showreel:illuminated-manuscript |
| `ink-wash` | 水墨 / 东方 | 东方传统 | 意境/沉静 | motion-showreel:ink-wash · claude-motion:ink-wash · motion-showreel:guochao |
| `shadow-puppet` | 皮影 / 剪影戏 | 东方传统 | 温暖/戏剧感 | motion-showreel:shadow-puppet · claude-motion:shadow-puppet |
| `ukiyo-e` | 浮世绘 | 东方传统 | 平和/有力 | motion-showreel:ukiyo-e · claude-motion:ukiyoe |
| `glitch` | 故障艺术 | 复古与屏幕 | 叛逆/紧张 | motion-showreel:glitch-digital |
| `hd2d` | HD-2D 像素立体 | 复古与屏幕 | 怀旧/沉浸 | claude-motion:hd-2d |
| `pixel` | 像素 / 复古游戏 | 复古与屏幕 | 怀旧/可爱 | motion-showreel:pixel-game · motion-showreel:pixel-diorama · claude-motion:pixel-art · claude-motion:pixel-rpg · claude-motion:microgame · mg-motion:style-20 |
| `retro-screen` | 复古屏幕（CRT/VHS/ASCII） | 复古与屏幕 | 怀旧/诡异 | motion-showreel:crt-vhs · motion-showreel:terminal-ascii · claude-motion:ascii-crt · claude-motion:backrooms |
| `synthwave` | Synthwave / 复古未来 | 复古与屏幕 | 热烈/复古未来 | motion-showreel:synthwave-neon · mg-motion:style-10 |
| `game-show` | 综艺节奏 / 游戏化 | 讲解与科普 | 快节奏 | claude-motion:game-show |
| `variety` | 综艺花字 | 讲解与科普 | 热闹 | mg-motion:style-18 |
| `whiteboard` | 白板讲解 | 讲解与科普 | 亲近/清晰 | motion-showreel:whiteboard-explainer · claude-motion:whiteboard · mg-motion:style-19 |
| `data-motion` | 数据叙事 | 界面与产品 | 可信/利落 | motion-showreel:data-motion · claude-motion:dataviz |
| `iso` | 等轴 2.5D | 界面与产品 | 清晰/俏皮 | motion-showreel:isometric-infographic · claude-motion:iso-infographic · mg-motion:style-03 |
| `keynote` | 暗色发布会 | 界面与产品 | 隆重/高级 | motion-showreel:dark-keynote · claude-motion:dark-keynote |
| `minimal-ui` | 产品 UI / 极简界面 | 界面与产品 | 精致/友好 | motion-showreel:minimal-ui · claude-motion:living-screencast |
| `anchor-hud` | 全息 / 赛博 HUD | 界面与屏幕 | 冷静/未来感 | motion-showreel:hologram-hud · claude-motion:hologram-hud · mg-motion:style-22 |
| `generative` | 生成几何 / 粒子场 | 生成与抽象 | 催眠/宏大 | motion-showreel:generative-geometry · motion-showreel:particle-field |
| `liquid` | 液态流动 | 生成与抽象 | 迷幻/流动 | motion-showreel:liquid-shader · mg-motion:style-07 |
| `morph` | 形变 / 概念变形 | 生成与抽象 | 清楚/专注 | motion-showreel:concept-morph · mg-motion:style-08 |
| `collage` | 拼贴 / 剪贴 | 手作 | 活泼/潮流 | motion-showreel:editorial-collage · motion-showreel:mixed-media-era · mg-motion:style-06 |
| `crayon` | 蜡笔 / 儿童绘本 | 手作 | 童趣/温暖 | motion-showreel:crayon-storybook · claude-motion:crayon-book · claude-motion:urban-sketch |
| `paper` | 纸艺（剪纸/立体书/纸灯） | 手作 | 温暖/精巧 | motion-showreel:paper-cut · claude-motion:paper-cutout · claude-motion:paper-popup · claude-motion:paper-lantern · claude-motion:papercut-red |
| `art-deco` | 装饰艺术 | 图形与排版 | 庄重/精致 | motion-showreel:art-deco · claude-motion:art-deco |
| `blueprint` | 蓝图 / 工程制图 | 图形与排版 | 精确/理性 | motion-showreel:blueprint · claude-motion:blueprint |
| `flat-vector` | 扁平矢量 | 图形与排版 | 清晰/亲和 | motion-showreel:flat-vector · claude-motion:pictogram-motion · mg-motion:style-01 |
| `kinetic-type` | 巨字 / 动态排版 | 图形与排版 | 冲击/躁动 | motion-showreel:kinetic-brutalist · motion-showreel:cinematic-title · claude-motion:spy-titles · claude-motion:silent-film |
| `one-line` | 一笔线描 | 图形与排版 | 简洁/轻巧 | motion-showreel:one-line · claude-motion:one-line · mg-motion:style-02 |
| `swiss-grid` | 瑞士网格 / 包豪斯 | 图形与排版 | 理性/克制 | motion-showreel:swiss-editorial · claude-motion:swiss-motion · mg-motion:style-09 |
| `engraving` | 铜版 / 木刻 | 印刷与版画 | 精细/沉静 | motion-showreel:copperplate-engraving · claude-motion:engraving · claude-motion:woodcut |
| `print-ink` | 孔版 / 丝网 / 半调印刷 | 印刷与版画 | 温暖/手作 | motion-showreel:risograph-print · claude-motion:risograph · claude-motion:silkscreen-poster · claude-motion:halftone-dossier |
| `mg:style-05` | 逐帧手绘 / 线条沸腾 Cel Animation / Frame-by-Frame & Line Boil | MG 签名技法 |  | mg-motion:style-05 |

## 四、按集合列条目

### 源码案例（claude-motion）（47）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `lemo-art-deco` | Midnight at the Starlight Hotel | 装饰艺术 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/art-deco/demo/index.html` |
| `lemo-ascii-crt` | Tranquility.log | ASCII / CRT 终端 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/ascii-crt/demo/index.html` |
| `lemo-backrooms` | Night Shift Orientation | 后室 / 新怪谈 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/backrooms/demo/index.html` |
| `lemo-blueprint` | Patent Pending: The Cloud Catcher | 蓝图 / 工程制图 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/blueprint/demo/index.html` |
| `lemo-brick-toy` | Rocket from Spare Parts | 积木玩具 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/brick-toy/demo/index.html` |
| `lemo-cel-anime-80s` | City Lights, 1987 | 80 年代赛璐璐动画 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/cel-anime-80s/demo/index.html` |
| `lemo-crayon-book` | The Moon Can't Sleep | 蜡笔儿童绘本 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/crayon-book/demo/index.html` |
| `lemo-dark-keynote` | Room to Think | 暗色科技发布 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/dark-keynote/demo/index.html` |
| `lemo-dataviz` | A Hundred Summers | 数据叙事 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/dataviz/demo/index.html` |
| `lemo-engraving` | The Honeybee, Plate VII | 铜版画 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/engraving/demo/index.html` |
| `lemo-game-show` | Rhythm of AI, 1997 → 2026 | 综艺节奏扁平 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/game-show/demo/index.html` |
| `lemo-glass-product` | Aura — Hear the Light | 玻璃质感产品 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/glass-product/demo/index.html` |
| `lemo-halftone-dossier` | Case File: Chubby | 复古半调案卷 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/halftone-dossier/demo/index.html` |
| `lemo-hd-2d` | The Lampbearer | HD-2D | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/hd-2d/demo/index.html` |
| `lemo-hologram-hud` | Volt · Spec Scan | 科幻全息界面 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/hologram-hud/demo/index.html` |
| `lemo-impasto` | The Colour of Rain | 油画厚涂 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/impasto/demo/index.html` |
| `lemo-ink-wash` | The Swordsman and the River | 中国水墨 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/ink-wash/demo/index.html` |
| `lemo-iso-infographic` | From Bean to Cup | 等距信息图 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/iso-infographic/demo/index.html` |
| `lemo-living-screencast` | Clawd Moves In | 活体实机录屏 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/living-screencast/demo/index.html` |
| `lemo-lowpoly-island` | The Island That Grew | 低多边形等距 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/lowpoly-island/demo/index.html` |
| `lemo-microgame` | Five-Second Astronaut | 微游戏快闪（瓦里奥制造式） | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/microgame/demo/index.html` |
| `lemo-midcentury-toon` | Meet Pip | 50s 扁平卡通 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/midcentury-toon/demo/index.html` |
| `lemo-one-line` | The Line That Never Lifted | 一笔画 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/one-line/demo/index.html` |
| `lemo-paper-lantern` | A Mooncake's Longing | 纸雕灯影 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/paper-lantern/demo/index.html` |
| `lemo-paper-popup` | Pip's Paper Adventure | 纸片立体书 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/paper-popup/demo/index.html` |
| `lemo-papercut-red` | Nian Comes to Town | 红色窗花剪纸 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/papercut-red/demo/index.html` |
| `lemo-pictogram-motion` | Aichi-Nagoya 2026 — All 43 Sports | 象形运动图形 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/pictogram-motion/demo/index.html` |
| `lemo-pixel-rpg` | The Last Save Point | 16-bit 像素 RPG | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/pixel-rpg/demo/index.html` |
| `lemo-risograph` | Sunday Ride | Risograph 丝网印刷 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/risograph/demo/index.html` |
| `lemo-rubber-hose` | Coffee Cup Chase | 1930s 橡皮管卡通 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/rubber-hose/demo/index.html` |
| `lemo-scifi-toon` | Coffee Run | 科幻情景喜剧卡通 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/scifi-toon/demo/index.html` |
| `lemo-shadow-puppet` | Hou Yi Shoots the Suns | 皮影戏 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/shadow-puppet/demo/index.html` |
| `lemo-silent-film` | The Runaway Loaf | 1920s 默片 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/silent-film/demo/index.html` |
| `lemo-silkscreen-poster` | Three Trails | 丝印旅行海报 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/silkscreen-poster/demo/index.html` |
| `lemo-spy-titles` | The Velvet Cipher | 60s 间谍片头 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/spy-titles/demo/index.html` |
| `lemo-stained-glass` | The Dragon of the East Window | 彩色玻璃窗 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/stained-glass/demo/index.html` |
| `lemo-swiss-motion` | Five Rules for a Poster | 瑞士动态排版 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/swiss-motion/demo/index.html` |
| `lemo-tilt-shift` | Toy Town Rush Hour | 移轴微缩 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/tilt-shift/demo/index.html` |
| `lemo-ukiyoe` | A Journey Toward the Mountain | 浮世绘 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/ukiyoe/demo/index.html` |
| `lemo-urban-sketch` | Where the Wind Went | 钢笔淡彩 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/urban-sketch/demo/index.html` |
| `lemo-watercolor` | Follow the Rain | 水彩笔刷 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/watercolor/demo/index.html` |
| `lemo-whiteboard` | Einstein in Your Pocket | 白板讲解 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/whiteboard/demo/index.html` |
| `lemo-woodcut` | The Bell Founder | 木刻版画 | M1-video | `engines/claude-motion/assets/cases/lemo-opuscar/styles/woodcut/demo/index.html` |
| `reelmimic-anime-cel` | 赛璐珞角色绘图引擎 | 赛璐珞角色 | M1-video | `engines/claude-motion/assets/cases/reelmimic/.claude/skills/anime-cel/template/studio.html` |
| `reelmimic-paper-cutout` | 剪纸定格绘图引擎 | 剪纸定格 | M1-video | `engines/claude-motion/assets/cases/reelmimic/.claude/skills/paper-cutout/template/studio.html` |
| `reelmimic-pixel-art` | 像素角色绘图引擎 | 像素角色 | M1-video | `engines/claude-motion/assets/cases/reelmimic/.claude/skills/pixel-art/template/studio.html` |
| `reelmimic-whiteboard` | 白板手绘绘图引擎 | 白板手绘 | M1-video | `engines/claude-motion/assets/cases/reelmimic/.claude/skills/whiteboard/template/studio.html` |

### 网页设计学校（6）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `Brutalist / raw` | Brutalist / raw | 网页设计学校 | M3-web-artifact | `engines/garden-skills/skills/web-design-engineer/SKILL.md` |
| `Editorial / minimalist` | Editorial / minimalist | 网页设计学校 | M3-web-artifact | `engines/garden-skills/skills/web-design-engineer/SKILL.md` |
| `Information architecture` | Information architecture | 网页设计学校 | M3-web-artifact | `engines/garden-skills/skills/web-design-engineer/SKILL.md` |
| `Modern tool / Builder SaaS` | Modern tool / Builder SaaS | 网页设计学校 | M3-web-artifact | `engines/garden-skills/skills/web-design-engineer/SKILL.md` |
| `Motion / experimental` | Motion / experimental | 网页设计学校 | M3-web-artifact | `engines/garden-skills/skills/web-design-engineer/SKILL.md` |
| `Warm humanist` | Warm humanist | 网页设计学校 | M3-web-artifact | `engines/garden-skills/skills/web-design-engineer/SKILL.md` |

### 出图模板类（17）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `academic-figures` | academic-figures | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/academic-figures` |
| `assets-and-props` | assets-and-props | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/assets-and-props` |
| `avatars-and-profile` | avatars-and-profile | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/avatars-and-profile` |
| `branding-and-packaging` | branding-and-packaging | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/branding-and-packaging` |
| `editing-workflows` | editing-workflows | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/editing-workflows` |
| `grids-and-collages` | grids-and-collages | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/grids-and-collages` |
| `infographics` | infographics | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/infographics` |
| `maps` | maps | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/maps` |
| `portraits-and-characters` | portraits-and-characters | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/portraits-and-characters` |
| `poster-and-campaigns` | poster-and-campaigns | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/poster-and-campaigns` |
| `product-visuals` | product-visuals | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/product-visuals` |
| `scenes-and-illustrations` | scenes-and-illustrations | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/scenes-and-illustrations` |
| `slides-and-visual-docs` | slides-and-visual-docs | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/slides-and-visual-docs` |
| `storyboards-and-sequences` | storyboards-and-sequences | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/storyboards-and-sequences` |
| `technical-diagrams` | technical-diagrams | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/technical-diagrams` |
| `typography-and-text-layout` | typography-and-text-layout | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/typography-and-text-layout` |
| `ui-mockups` | ui-mockups | 出图模板类 | M5-image | `engines/garden-skills/skills/gpt-image-2/references/ui-mockups` |

### 起始 look（onetake）（6）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `dusk` | dusk | look | M1-video | `engines/onetake/looks/looks.json` |
| `ember` | ember | look | M1-video | `engines/onetake/looks/looks.json` |
| `paper` | paper | look | M1-video | `engines/onetake/looks/looks.json` |
| `riso` | riso | look | M1-video | `engines/onetake/looks/looks.json` |
| `tabletop` | tabletop | look | M1-video | `engines/onetake/looks/looks.json` |
| `ultramarine` | ultramarine | look | M1-video | `engines/onetake/looks/looks.json` |

### MG 风格（mg-motion）（15）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `style-01` | 扁平矢量动画 Flat / Vector 2D Motion Graphics | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-02` | 线条动画 Line Art / Line Animation | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-03` | 等轴 2.5D Isometric / 2.5D | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-04` | 3D 渲染系（C4D/Blender 质感）3D Render / CGI Motion Design | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-05` | 逐帧手绘 / 线条沸腾 Cel Animation / Frame-by-Frame & Line Boil | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-06` | 拼贴剪贴 Collage / Cutout Animation | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-07` | 液态流动 Liquid Motion | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-08` | 形变动画 Morphing / Shape Morph | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-09` | 几何构成 / 包豪斯 Geometric / Bauhaus Motion | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-10` | 复古 80s Synthwave / Y2K 氛围 Retro: 80s Synthwave / VHS / Y2K | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-12` | 弥散渐变 / 玻璃拟态 Gradient Blur (Aurora) & Glassmorphism | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-18` | 综艺花字 Variety Show Kinetic Captions (Hanazi) | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-19` | 粗描边贴纸人科普 MG Bold-outline Sticker Explainer MG (PaperClip / 林超风格) | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-20` | 像素风 Pixel Art / 8-bit | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |
| `style-22` | 赛博朋克 HUD / FUI Cyberpunk HUD / FUI (Fictional UI) | MG 风格 | M1-video | `engines/mg-motion/references/styles.md` |

### 动效条目（wise-motion）（462）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `aboutlove-heart-illustration` | 粒子心形 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/aboutlove-heart-illustration.md` |
| `aboutlove-monologue-sequence` | 内心独白 · 双语叙事组合 | 文字与叙事 | M6-motion-source | `engines/wise-motion/references/effects/aboutlove-monologue-sequence.md` |
| `aboutlove-moon-illustration` | 诗句月亮 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/aboutlove-moon-illustration.md` |
| `aboutlove-motion-sequence` | 动态图形 · 信号到心形组合 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/aboutlove-motion-sequence.md` |
| `aboutlove-mountains-illustration` | 文字山峦 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/aboutlove-mountains-illustration.md` |
| `aboutlove-river-illustration` | 文字河流 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/aboutlove-river-illustration.md` |
| `aboutlove-word-sphere-illustration` | 多语词球 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/aboutlove-word-sphere-illustration.md` |
| `aboutlove-word-world-sequence` | 文字世界 · 雨幕到心字组合 | 文字与叙事 | M6-motion-source | `engines/wise-motion/references/effects/aboutlove-word-world-sequence.md` |
| `advected-trail` | 尾迹飘散消失 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/advected-trail.md` |
| `animal-illustration` | 线描动物与载具 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/animal-illustration.md` |
| `aperture-eye-illustration` | 光圈眼形 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/aperture-eye-illustration.md` |
| `arc-branch-flicker` | 电弧分叉闪动 | 光效与氛围 | M6-motion-source | `engines/wise-motion/references/effects/arc-branch-flicker.md` |
| `archive-box-illustration` | 档案盒开盖浮页 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/archive-box-illustration.md` |
| `archive-folder-illustration` | 牛皮纸档案夹 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/archive-folder-illustration.md` |
| `arrival-star-reveal` | 星点逐个显现 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/arrival-star-reveal.md` |
| `arrival-star-sparkle` | 星点交替闪烁 | 光效与氛围 | M6-motion-source | `engines/wise-motion/references/effects/arrival-star-sparkle.md` |
| `atlas-reveal-clear` | 群像显现退场 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/atlas-reveal-clear.md` |
| `attention-illustration` | 线圈窗口连线 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/attention-illustration.md` |
| `axial-layer-reseat` | 零件拆开复位 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/axial-layer-reseat.md` |
| `balance-reciprocate` | 摆轮游丝联动 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/balance-reciprocate.md` |
| `ball-bounce-trails` | 弹跳逐渐停下 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/ball-bounce-trails.md` |
| `balloon-drive-journey` | 把气球交给风 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/balloon-drive-journey.md` |
| `bar-growth` | 柱条依次长高 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/bar-growth.md` |
| `bar-sweep` | 长条扫过 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/bar-sweep.md` |
| `barrel-stored-energy` | 发条转动 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/barrel-stored-energy.md` |
| `beat-ring-pulse` | 圆环随节奏伸缩 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/beat-ring-pulse.md` |
| `benchmark-columns` | 数据分栏对比 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/benchmark-columns.md` |
| `bezier-editor` | 手柄带动曲线 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/bezier-editor.md` |
| `body-pendant-sway` | 船身轻轻摇晃 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/body-pendant-sway.md` |
| `book-geometric-illustration` | 几何网点插画 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/book-geometric-illustration.md` |
| `book-paper-light` | 纸面光影变化 | 光效与氛围 | M6-motion-source | `engines/wise-motion/references/effects/book-paper-light.md` |
| `book-spine-turn` | 书页翻动 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/book-spine-turn.md` |
| `botanical-grow-bloom` | 发芽开花 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/botanical-grow-bloom.md` |
| `boundary-curve-stop` | 光线撞出火花 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/boundary-curve-stop.md` |
| `bounded-fibre-grow` | 铁花持续绽放 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/bounded-fibre-grow.md` |
| `branch-angle-sway` | 树枝摇摆 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/branch-angle-sway.md` |
| `brush-glyph-build` | 笔画拼成字 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/brush-glyph-build.md` |
| `butterfly-illustration` | 版画蝴蝶 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/butterfly-illustration.md` |
| `button-press-status` | 按钮点击换状态 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/button-press-status.md` |
| `camera-lag-departure` | 镜头减速主体驶离 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/camera-lag-departure.md` |
| `capsule-impact-scatter` | 撞击掀飞胶囊 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/capsule-impact-scatter.md` |
| `capsule-type-sequence` | 字母落定与碰撞炸出 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/capsule-type-sequence.md` |
| `caption-type-caret` | 光标跟随打字 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/caption-type-caret.md` |
| `card-compress-merge` | 卡片压缩合并 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/card-compress-merge.md` |
| `card-conveyor` | 斜向反向滚动 | 滚动与轮播 | M6-motion-source | `engines/wise-motion/references/effects/card-conveyor.md` |
| `card-flip` | 卡片翻面 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/card-flip.md` |
| `cat-factory-journey` | 小猫加工厂完整循环 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/cat-factory-journey.md` |
| `cat-mouth-illustration` | 小猫张嘴 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/cat-mouth-illustration.md` |
| `celebrating-characters-illustration` | 庆祝人物组 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/celebrating-characters-illustration.md` |
| `center-ripple-emit` | 同心涟漪扩散 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/center-ripple-emit.md` |
| `char-color-cycle` | 文字依次换色 | 强调与配色 | M6-motion-source | `engines/wise-motion/references/effects/char-color-cycle.md` |
| `character-expression-response` | 人物表情回应 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/character-expression-response.md` |
| `chart-card-illustration` | 手绘折线图卡 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/chart-card-illustration.md` |
| `chrome-outline-echo` | 文字描边拖影 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/chrome-outline-echo.md` |
| `circle-expand-wordmark` | 圆形铺满展开字标 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/circle-expand-wordmark.md` |
| `civilization-growth-sequence` | 薪火生长与文明聚字 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/civilization-growth-sequence.md` |
| `claude-flow-field-illustration` | 游动流线 | 流场与能量 | M6-motion-source | `engines/wise-motion/references/effects/claude-flow-field-illustration.md` |
| `claude-fractal-tree-illustration` | 分叉树形 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/claude-fractal-tree-illustration.md` |
| `claude-frame-counter-illustration` | 圆环帧数计数 | 界面与读数 | M6-motion-source | `engines/wise-motion/references/effects/claude-frame-counter-illustration.md` |
| `claude-glyph-rain-illustration` | 字符雨幕 | 界面与读数 | M6-motion-source | `engines/wise-motion/references/effects/claude-glyph-rain-illustration.md` |
| `claude-hex-pulse-illustration` | 六角扩散波 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/claude-hex-pulse-illustration.md` |
| `claude-kick-rings-illustration` | 节拍同心光环 | 流场与能量 | M6-motion-source | `engines/wise-motion/references/effects/claude-kick-rings-illustration.md` |
| `claude-lissajous-illustration` | 交织曲线 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/claude-lissajous-illustration.md` |
| `claude-orbits-illustration` | 多轨圆点环绕 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/claude-orbits-illustration.md` |
| `claude-pendulum-wave-illustration` | 摆点波浪 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/claude-pendulum-wave-illustration.md` |
| `claude-phyllotaxis-illustration` | 旋转螺旋点阵 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/claude-phyllotaxis-illustration.md` |
| `claude-plexus-illustration` | 漂移点线网络 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/claude-plexus-illustration.md` |
| `claude-sine-grid-illustration` | 方块波浪 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/claude-sine-grid-illustration.md` |
| `claude-spectrum-illustration` | 起伏频谱柱 | 界面与读数 | M6-motion-source | `engines/wise-motion/references/effects/claude-spectrum-illustration.md` |
| `claude-terrain-illustration` | 起伏地形线 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/claude-terrain-illustration.md` |
| `claude-warp-illustration` | 放射加速光线 | 流场与能量 | M6-motion-source | `engines/wise-motion/references/effects/claude-warp-illustration.md` |
| `claude-wireframe-illustration` | 旋转立方线框 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/claude-wireframe-illustration.md` |
| `collage-film-sequence` | 剪贴联动与海报归位 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/collage-film-sequence.md` |
| `color-evolve` | 平滑换色 | 强调与配色 | M6-motion-source | `engines/wise-motion/references/effects/color-evolve.md` |
| `color-segment-stagger` | 色带依次展开 | 强调与配色 | M6-motion-source | `engines/wise-motion/references/effects/color-segment-stagger.md` |
| `column-to-row` | 纵排变横排 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/column-to-row.md` |
| `concept-diagram` | 图解逐段演变 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/concept-diagram.md` |
| `confused-characters-illustration` | 疑惑人物组 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/confused-characters-illustration.md` |
| `contour-draw-fill` | 描边后填色 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/contour-draw-fill.md` |
| `convex-glass-lens` | 玻璃伸缩折射 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/convex-glass-lens.md` |
| `coordinate-focus-zoom` | 镜头推近中心 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/coordinate-focus-zoom.md` |
| `coordinate-grid-build` | 网格依次画出 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/coordinate-grid-build.md` |
| `core-ring-expand` | 光球扩出光环 | 光效与氛围 | M6-motion-source | `engines/wise-motion/references/effects/core-ring-expand.md` |
| `count-up` | 数字加速至无穷 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/count-up.md` |
| `countdown-dial` | 表盘倒计时 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/countdown-dial.md` |
| `crank-linked-turn` | 连杆带动转轮 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/crank-linked-turn.md` |
| `cross-aperture-turn` | 十字旋转转场 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/cross-aperture-turn.md` |
| `cross-flare-travel` | 十字光斑横移 | 光效与氛围 | M6-motion-source | `engines/wise-motion/references/effects/cross-flare-travel.md` |
| `crt-collapse` | 电视关机 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/crt-collapse.md` |
| `cursive-regular-morph` | 草书变楷书 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/cursive-regular-morph.md` |
| `curve-path` | 沿曲线移动 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/curve-path.md` |
| `curve-phase-shift` | 交织曲线游动 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/curve-phase-shift.md` |
| `curved-image-picker` | 曲面滚轮停住 | 滚动与轮播 | M6-motion-source | `engines/wise-motion/references/effects/curved-image-picker.md` |
| `cutout-stride-leap` | 剪影助跑翻跃 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/cutout-stride-leap.md` |
| `cutout-type-fold` | 纸片文字翻落 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/cutout-type-fold.md` |
| `cyanotype` | 纸面蓝晒显影 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/cyanotype.md` |
| `cyclone-illustration` | 螺旋流线内聚 | 流场与能量 | M6-motion-source | `engines/wise-motion/references/effects/cyclone-illustration.md` |
| `cylinder-drum` | 卡片绕柱旋转 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/cylinder-drum.md` |
| `dandelion-radial-release` | 种子向外散开 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/dandelion-radial-release.md` |
| `dandelion-seed-illustration` | 蒲公英种子 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/dandelion-seed-illustration.md` |
| `dandelion-subject-illustration` | 蒲公英主体 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/dandelion-subject-illustration.md` |
| `dandelion-wind-journey` | 蒲公英·风过之处 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/dandelion-wind-journey.md` |
| `data-pulse` | 频谱波形同步 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/data-pulse.md` |
| `density-field` | 点阵增密 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/density-field.md` |
| `diagonal-edge-transition` | 斜向擦除转场 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/diagonal-edge-transition.md` |
| `diamond-aperture-release` | 菱形开窗转场 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/diamond-aperture-release.md` |
| `diffuse-light-drift` | 柔光缓慢流动 | 光效与氛围 | M6-motion-source | `engines/wise-motion/references/effects/diffuse-light-drift.md` |
| `dim-focus` | 周围淡化聚焦 | 强调与配色 | M6-motion-source | `engines/wise-motion/references/effects/dim-focus.md` |
| `dimension-line` | 尺寸线向两端展开 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/dimension-line.md` |
| `dither-lab-book` | 插画翻页书 | 界面与演示 | M6-motion-source | `engines/wise-motion/references/effects/dither-lab-book.md` |
| `door-halftone-illustration` | 字标点阵 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/door-halftone-illustration.md` |
| `dot-mask-reveal` | 点阵逐行显现 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/dot-mask-reveal.md` |
| `dot-route-illustration` | 点阵连线 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/dot-route-illustration.md` |
| `dots-lines-cylinders` | 点线变圆柱 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/dots-lines-cylinders.md` |
| `drafting-tools-illustration` | 绘图工具 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/drafting-tools-illustration.md` |
| `drive-balloon-illustration` | 七色气球簇与绳尾 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/drive-balloon-illustration.md` |
| `drive-balloon-release` | 气球逐个飘走 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/drive-balloon-release.md` |
| `drive-car-illustration` | 小葵敞篷车 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/drive-car-illustration.md` |
| `drive-road-illustration` | 驾车道路 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/drive-road-illustration.md` |
| `dual-scroll` | 双排反向滚动 | 滚动与轮播 | M6-motion-source | `engines/wise-motion/references/effects/dual-scroll.md` |
| `dual-scroll-settle` | 双排滚动停住 | 滚动与轮播 | M6-motion-source | `engines/wise-motion/references/effects/dual-scroll-settle.md` |
| `dwell-carousel` | 停留轮播 | 滚动与轮播 | M6-motion-source | `engines/wise-motion/references/effects/dwell-carousel.md` |
| `emission-drift` | 烟雾扩散飘走 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/emission-drift.md` |
| `encore-flight` | 腾空翻转落地 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/encore-flight.md` |
| `encore-full-journey` | 雨中曲·返场完整编舞 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/encore-full-journey.md` |
| `encore-hook` | 绕挂点旋转 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/encore-hook.md` |
| `encore-roll` | 沿轮廓滚动 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/encore-roll.md` |
| `encore-shed` | 旋转甩出水滴 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/encore-shed.md` |
| `encore-tap` | 踏步溅水 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/encore-tap.md` |
| `encore-tip` | 固定支点旋转 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/encore-tip.md` |
| `encore-umbrella-illustration` | 细线雨伞 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/encore-umbrella-illustration.md` |
| `energy-density-growth` | 能量流线渐密 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/energy-density-growth.md` |
| `energy-discharge-journey` | 能量球显影与局部电弧 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/energy-discharge-journey.md` |
| `energy-vortex-wrap` | 流线绕成球形 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/energy-vortex-wrap.md` |
| `event-clock` | 定时触发 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/event-clock.md` |
| `evidence-icons` | 图标依次画出 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/evidence-icons.md` |
| `experience-progress` | 卡片逐项聚焦 | 强调与配色 | M6-motion-source | `engines/wise-motion/references/effects/experience-progress.md` |
| `factory-cat-illustration` | 加工厂完整小猫 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/factory-cat-illustration.md` |
| `factory-cat-puck-illustration` | 收藏猫脸 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/factory-cat-puck-illustration.md` |
| `factory-handle-illustration` | 加工厂手柄 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/factory-handle-illustration.md` |
| `factory-handle-transfer` | 手柄翻转卸料 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/factory-handle-transfer.md` |
| `factory-machine-illustration` | 小猫加工机器 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/factory-machine-illustration.md` |
| `fade-drop` | 淡入下落 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/fade-drop.md` |
| `fade-rise` | 淡入上移 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/fade-rise.md` |
| `fall-stack-grid` | 卡片堆叠排齐 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/fall-stack-grid.md` |
| `fan-object-rise` | 三列依次升入 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/fan-object-rise.md` |
| `filament-shed-drift` | 种子脱落飘散 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/filament-shed-drift.md` |
| `filament-unfold-turn` | 冠毛展开转向 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/filament-unfold-turn.md` |
| `film-scratch-flicker` | 胶片纹理闪动 | 光效与氛围 | M6-motion-source | `engines/wise-motion/references/effects/film-scratch-flicker.md` |
| `flat-to-volume` | 平面变立体 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/flat-to-volume.md` |
| `float` | 悬浮起伏 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/float.md` |
| `flock-turn-gather` | 化蝶飞向一处 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/flock-turn-gather.md` |
| `focus-zoom` | 放大聚焦 | 强调与配色 | M6-motion-source | `engines/wise-motion/references/effects/focus-zoom.md` |
| `folded-step-rebound` | 折纸受压回弹 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/folded-step-rebound.md` |
| `folio-cards-illustration` | 散页纸卡 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/folio-cards-illustration.md` |
| `follow` | 延迟跟随 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/follow.md` |
| `formula-evolve` | 公式合成一行 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/formula-evolve.md` |
| `forward-boat-illustration` | 木船轻摇 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/forward-boat-illustration.md` |
| `forward-plane-illustration` | 纸飞机折翼 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/forward-plane-illustration.md` |
| `fragment-replace` | 文字破碎换字 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/fragment-replace.md` |
| `frame-jitter-type` | 文字抖动 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/frame-jitter-type.md` |
| `frame-ring-collapse` | 镜头拉远露出网格 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/frame-ring-collapse.md` |
| `framed-product-slide` | 画框侧滑显现 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/framed-product-slide.md` |
| `frozen-depth-focus` | 前后景切换焦点 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/frozen-depth-focus.md` |
| `galaxy-axis-reveal` | 银河向两侧展开 | 光效与氛围 | M6-motion-source | `engines/wise-motion/references/effects/galaxy-axis-reveal.md` |
| `gauge-rebound` | 指针回摆 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/gauge-rebound.md` |
| `generative-flow-field` | 流线游动 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/generative-flow-field.md` |
| `generative-frame-readout` | 姿态与数值同步 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/generative-frame-readout.md` |
| `generative-point-morph` | 立体点阵变形 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/generative-point-morph.md` |
| `generative-point-sequence` | 点阵变形与读数 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/generative-point-sequence.md` |
| `geometric-poster-sequence` | 几何旋转与海报成形 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/geometric-poster-sequence.md` |
| `geometry-turn-build` | 图层旋转叠加 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/geometry-turn-build.md` |
| `glass-card-stagger` | 玻璃卡片交错穿行 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/glass-card-stagger.md` |
| `glass-control-card-illustration` | 系统设置空间卡 | 界面与读数 | M6-motion-source | `engines/wise-motion/references/effects/glass-control-card-illustration.md` |
| `glass-controls-card-illustration` | 控制中心空间卡 | 界面与读数 | M6-motion-source | `engines/wise-motion/references/effects/glass-controls-card-illustration.md` |
| `glass-dialogue-card-illustration` | 短信空间卡 | 界面与读数 | M6-motion-source | `engines/wise-motion/references/effects/glass-dialogue-card-illustration.md` |
| `glass-interface-sequence` | 玻璃卡片显现折射 | 界面与演示 | M6-motion-source | `engines/wise-motion/references/effects/glass-interface-sequence.md` |
| `glass-music-card-illustration` | 音乐空间卡 | 界面与读数 | M6-motion-source | `engines/wise-motion/references/effects/glass-music-card-illustration.md` |
| `glass-voice-card-illustration` | Siri 空间卡 | 界面与读数 | M6-motion-source | `engines/wise-motion/references/effects/glass-voice-card-illustration.md` |
| `glass-weather-card-illustration` | 天气空间卡 | 界面与读数 | M6-motion-source | `engines/wise-motion/references/effects/glass-weather-card-illustration.md` |
| `glitch-band-transition` | 横条故障闪切 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/glitch-band-transition.md` |
| `glyph-bar-collapse` | 文字压成横线 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/glyph-bar-collapse.md` |
| `glyph-code-fill` | 代码在字内滚动 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/glyph-code-fill.md` |
| `glyph-cut-ending` | 字形快速切换 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/glyph-cut-ending.md` |
| `glyph-multiply-structure` | 字形复制重组 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/glyph-multiply-structure.md` |
| `glyph-rain-fall` | 字符持续下落 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/glyph-rain-fall.md` |
| `glyph-unit-reflow` | 文字重排换字 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/glyph-unit-reflow.md` |
| `grid-flow-unfold` | 网格起伏分裂 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/grid-flow-unfold.md` |
| `grid-wave-scale` | 点阵起伏缩放 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/grid-wave-scale.md` |
| `group-expand` | 卡片逐张放大 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/group-expand.md` |
| `group-stagger` | 按距离依次响应 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/group-stagger.md` |
| `heads-illustration` | 环形光点汇聚 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/heads-illustration.md` |
| `heartbeat-follow` | 心电线失真恢复 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/heartbeat-follow.md` |
| `heat-grid-converge` | 色块显出轮廓 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/heat-grid-converge.md` |
| `helical-screw-seat` | 螺丝旋入锁紧 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/helical-screw-seat.md` |
| `hex-radial-pulse` | 六边形波纹扩散 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/hex-radial-pulse.md` |
| `hill-vortex-illustration` | 球形涡流 | 流场与能量 | M6-motion-source | `engines/wise-motion/references/effects/hill-vortex-illustration.md` |
| `hinged-wing-flap` | 振翅带动触角 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/hinged-wing-flap.md` |
| `horizontal-metal-type` | 金属球散开聚字 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/horizontal-metal-type.md` |
| `hud-acquisition-sequence` | 目标扫描捕获锁定 | 界面与演示 | M6-motion-source | `engines/wise-motion/references/effects/hud-acquisition-sequence.md` |
| `hud-candidate-status` | 热力图聚焦 | 扫描与信号 | M6-motion-source | `engines/wise-motion/references/effects/hud-candidate-status.md` |
| `hud-data-stream` | 数据字符刷新 | 扫描与信号 | M6-motion-source | `engines/wise-motion/references/effects/hud-data-stream.md` |
| `hud-globe-scan` | 扫描后镜头推近 | 扫描与信号 | M6-motion-source | `engines/wise-motion/references/effects/hud-globe-scan.md` |
| `hud-navigation-bars` | 弧形仪表联动 | 扫描与信号 | M6-motion-source | `engines/wise-motion/references/effects/hud-navigation-bars.md` |
| `hud-radar-sweep` | 轨迹逐点定位 | 扫描与信号 | M6-motion-source | `engines/wise-motion/references/effects/hud-radar-sweep.md` |
| `hud-range-readout` | 测距联动放大 | 扫描与信号 | M6-motion-source | `engines/wise-motion/references/effects/hud-range-readout.md` |
| `hud-ring-build` | 圆环逐层展开 | 扫描与信号 | M6-motion-source | `engines/wise-motion/references/effects/hud-ring-build.md` |
| `hud-signal-waves` | 占比分区变化 | 扫描与信号 | M6-motion-source | `engines/wise-motion/references/effects/hud-signal-waves.md` |
| `hud-spectrum-bars` | 频谱柱跳动 | 扫描与信号 | M6-motion-source | `engines/wise-motion/references/effects/hud-spectrum-bars.md` |
| `hud-system-boot` | 面积图展开 | 扫描与信号 | M6-motion-source | `engines/wise-motion/references/effects/hud-system-boot.md` |
| `hud-target-lock` | 准星锁定变色 | 扫描与信号 | M6-motion-source | `engines/wise-motion/references/effects/hud-target-lock.md` |
| `image-particles-wordmark` | 图像散开聚字 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/image-particles-wordmark.md` |
| `interface-feedback` | 按钮操作反馈 | 界面与演示 | M6-motion-source | `engines/wise-motion/references/effects/interface-feedback.md` |
| `inventory-contour-fit` | 零件旋转组装 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/inventory-contour-fit.md` |
| `inward-curve-flow` | 光点沿弧汇聚 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/inward-curve-flow.md` |
| `iris-open-transition` | 圆形开窗转场 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/iris-open-transition.md` |
| `joint-rule-unfold` | 逐节展开 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/joint-rule-unfold.md` |
| `journey-air-animal-illustration` | 蒲公英伴飞动物 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/journey-air-animal-illustration.md` |
| `journey-flower-illustration` | 落种后开花的植株 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/journey-flower-illustration.md` |
| `journey-landscape-illustration` | 蒲公英旅途地景 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/journey-landscape-illustration.md` |
| `journey-lotus-illustration` | 荷花 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/journey-lotus-illustration.md` |
| `journey-pond-animal-illustration` | 蒲公英旅途地面动物 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/journey-pond-animal-illustration.md` |
| `keyframe-workbench` | 曲线回弹演示 | 界面与演示 | M6-motion-source | `engines/wise-motion/references/effects/keyframe-workbench.md` |
| `landscape-boundary-carry` | 沿地形衔接换景 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/landscape-boundary-carry.md` |
| `lap-outline-echo` | 绕圈叠出轮廓 | 滚动与轮播 | M6-motion-source | `engines/wise-motion/references/effects/lap-outline-echo.md` |
| `layer-expand` | 图层分离展开 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/layer-expand.md` |
| `layout-reorder` | 列表变网格 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/layout-reorder.md` |
| `leader-callout` | 引线标注 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/leader-callout.md` |
| `lego-brick-illustration` | 彩色积木块 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/lego-brick-illustration.md` |
| `lego-comparison-timer` | 计时结束盖章 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/lego-comparison-timer.md` |
| `lego-engine-flow` | 矩阵扫描与分流组合 | 界面与演示 | M6-motion-source | `engines/wise-motion/references/effects/lego-engine-flow.md` |
| `letter-galaxy-illustration` | 星月来信银河 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/letter-galaxy-illustration.md` |
| `letter-hole-zoom` | 穿过字孔转场 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/letter-hole-zoom.md` |
| `letter-ripple` | 水波折射文字 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/letter-ripple.md` |
| `letter-settle` | 符号群飞化星点 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/letter-settle.md` |
| `letter-symbol-illustration` | 星月来信符号组 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/letter-symbol-illustration.md` |
| `lid-open-float` | 开盖浮出 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/lid-open-float.md` |
| `lightning-orb-illustration` | 球形分叉电弧 | 流场与能量 | M6-motion-source | `engines/wise-motion/references/effects/lightning-orb-illustration.md` |
| `line-converge` | 连线汇聚 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/line-converge.md` |
| `live-code-readout` | 代码参数联动 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/live-code-readout.md` |
| `load-balance` | 杠杆回到平衡 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/load-balance.md` |
| `local-scan` | 文字扫光 | 光效与氛围 | M6-motion-source | `engines/wise-motion/references/effects/local-scan.md` |
| `map-paint` | 地图分区着色 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/map-paint.md` |
| `mask-stagger-text` | 文字逐字升入 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/mask-stagger-text.md` |
| `masked-image-scroll` | 字内播放画面 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/masked-image-scroll.md` |
| `material-card-stagger` | 依次上弹入场 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/material-card-stagger.md` |
| `material-evolution-sequence` | KIMI K3 开源宣传片复刻 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/material-evolution-sequence.md` |
| `material-fab-panel` | 圆形扩成面板 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/material-fab-panel.md` |
| `material-form-chain` | 形态连续重组 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/material-form-chain.md` |
| `material-like-pop` | 填色放大回弹 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/material-like-pop.md` |
| `material-phone-rise` | 倾斜升入回正 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/material-phone-rise.md` |
| `material-phone-sequence` | 界面展开与反馈 | 界面与演示 | M6-motion-source | `engines/wise-motion/references/effects/material-phone-sequence.md` |
| `material-spinner-arc` | 圆弧旋转伸缩 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/material-spinner-arc.md` |
| `material-switch-spring` | 开关滑动回弹 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/material-switch-spring.md` |
| `math-formula-drift` | 文字交错漂移 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/math-formula-drift.md` |
| `mechanical-window-sequence` | 持续窗口与机械细节展示 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/mechanical-window-sequence.md` |
| `meshed-gears-drive` | 齿轮咬合转动 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/meshed-gears-drive.md` |
| `metal-drop-split` | 落地分裂弹开 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/metal-drop-split.md` |
| `metal-impact-type-sequence` | 金属弹开汇聚成字 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/metal-impact-type-sequence.md` |
| `mindmap-follow` | 光点树状分流 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/mindmap-follow.md` |
| `mindmap-grow` | 坐标轴展开 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/mindmap-grow.md` |
| `moon-card-illustration` | 月相照片卡 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/moon-card-illustration.md` |
| `moon-event-fill` | 月牙变满月 | 光效与氛围 | M6-motion-source | `engines/wise-motion/references/effects/moon-event-fill.md` |
| `motifs-gather-atlas` | 图像缩小归拢 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/motifs-gather-atlas.md` |
| `motion-compare` | 匀速与变速对比 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/motion-compare.md` |
| `motion-oasis-sequence` | 地块铺展与动效绿洲 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/motion-oasis-sequence.md` |
| `mouth-open-react` | 随声张嘴 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/mouth-open-react.md` |
| `multi-orbit-drift` | 多轨道环绕 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/multi-orbit-drift.md` |
| `mushroom-cloud-illustration` | 蘑菇云翻升 | 流场与能量 | M6-motion-source | `engines/wise-motion/references/effects/mushroom-cloud-illustration.md` |
| `mushroom-sphere-journey` | 蘑菇云翻卷与球涡交接 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/mushroom-sphere-journey.md` |
| `narrated-count` | 柱状图分组增长 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/narrated-count.md` |
| `narrowing-flow-accelerate` | 流线过窄口加速 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/narrowing-flow-accelerate.md` |
| `neon-horizon` | 日出与网格前行 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/neon-horizon.md` |
| `neon-title-sequence` | 金属霓虹文字亮相 | 文字与叙事 | M6-motion-source | `engines/wise-motion/references/effects/neon-title-sequence.md` |
| `neon-type-flicker` | 霓虹闪烁点亮 | 光效与氛围 | M6-motion-source | `engines/wise-motion/references/effects/neon-type-flicker.md` |
| `next-shot-preentry` | 圆窗叠入下一幕 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/next-shot-preentry.md` |
| `note-hop-illustration` | 谱面光点跳跃 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/note-hop-illustration.md` |
| `orbit` | 文字球旋转 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/orbit.md` |
| `osmanthus-butterfly-illustration` | 金银蝴蝶 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/osmanthus-butterfly-illustration.md` |
| `osmanthus-butterfly-journey` | 花落成蝶 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/osmanthus-butterfly-journey.md` |
| `osmanthus-flower-illustration` | 四瓣桂花 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/osmanthus-flower-illustration.md` |
| `osmanthus-leaf-illustration` | 桂树原叶片 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/osmanthus-leaf-illustration.md` |
| `osmanthus-moon-illustration` | 金色满月 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/osmanthus-moon-illustration.md` |
| `osmanthus-symbol-illustration` | 金银掉落符号 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/osmanthus-symbol-illustration.md` |
| `osmanthus-tree-illustration` | 桂树与三种树冠 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/osmanthus-tree-illustration.md` |
| `outro-credit-lift` | 多行文字升入 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/outro-credit-lift.md` |
| `outro-recap-sequence` | 散射归位片尾展开 | 文字与叙事 | M6-motion-source | `engines/wise-motion/references/effects/outro-recap-sequence.md` |
| `page-cover` | 新页推入覆盖 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/page-cover.md` |
| `panel-rise-collapse` | 窗口升入压扁消失 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/panel-rise-collapse.md` |
| `paper-disc-pop` | 圆盘定格回弹 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/paper-disc-pop.md` |
| `paper-scroll-illustration` | 纸卷展开 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/paper-scroll-illustration.md` |
| `paper-spiral-sequence` | 纸条铺展螺线旋转 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/paper-spiral-sequence.md` |
| `paper-strip-stagger` | 左右交替滑入 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/paper-strip-stagger.md` |
| `paper-tilt` | 叠层倾斜展开 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/paper-tilt.md` |
| `paper-title-stagger` | 文字定格升入 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/paper-title-stagger.md` |
| `particle-ballistic-fall` | 粒子抛出落下 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/particle-ballistic-fall.md` |
| `particle-hopper` | 粒子落入漏斗 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/particle-hopper.md` |
| `particle-torus-roll` | 粒子圆环翻滚 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/particle-torus-roll.md` |
| `particle-word` | 粒子聚散成字 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/particle-word.md` |
| `passage-animal-response` | 动物相遇伴飞 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/passage-animal-response.md` |
| `pendulum-phase-wave` | 摆动形成波浪 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/pendulum-phase-wave.md` |
| `perspective-grid-flow` | 网格迎面滚动 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/perspective-grid-flow.md` |
| `phrase-weave-glyph` | 文字拼成大字 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/phrase-weave-glyph.md` |
| `pivot-swing` | 绕点摆动 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/pivot-swing.md` |
| `pixel-dissolve-transition` | 像素溶解转场 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/pixel-dissolve-transition.md` |
| `pixel-hop-squash` | 边走边弹跳 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/pixel-hop-squash.md` |
| `pixel-motion-sequence` | 像素聚字与动效巡演 | 文字与叙事 | M6-motion-source | `engines/wise-motion/references/effects/pixel-motion-sequence.md` |
| `pixel-robot-illustration` | 像素机器人 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/pixel-robot-illustration.md` |
| `plume-rise-curl` | 粒子升起翻卷 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/plume-rise-curl.md` |
| `point-domain-flow-sequence` | 黄金矩形递归生长 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/point-domain-flow-sequence.md` |
| `point-link-hit` | 连线点亮目标 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/point-link-hit.md` |
| `point-morph` | 点阵换形 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/point-morph.md` |
| `polished-metal-sweep` | 金属文字扫光 | 光效与氛围 | M6-motion-source | `engines/wise-motion/references/effects/polished-metal-sweep.md` |
| `pop-pulse-ring` | 光圈弹出扩散 | 强调与配色 | M6-motion-source | `engines/wise-motion/references/effects/pop-pulse-ring.md` |
| `progress-fill-exit` | 进度填满淡出 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/progress-fill-exit.md` |
| `progress-readout` | 进度与数字同步 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/progress-readout.md` |
| `prompt-border-trace` | 边框逐段画出 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/prompt-border-trace.md` |
| `prompt-char-gather` | 文字绕弧汇聚 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/prompt-char-gather.md` |
| `prompt-chinese-type` | 文字分行输入 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/prompt-chinese-type.md` |
| `prompt-to-core-sequence` | 文字汇聚光核扩散 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/prompt-to-core-sequence.md` |
| `prompt-ui-push` | 界面入场推近 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/prompt-ui-push.md` |
| `proximity-link-drift` | 光点靠近连线 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/proximity-link-drift.md` |
| `radial-branch-flow` | 涟漪扩散连线分流 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/radial-branch-flow.md` |
| `radial-flash-transition` | 中心闪光转场 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/radial-flash-transition.md` |
| `radial-line-burst` | 短线向外散开 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/radial-line-burst.md` |
| `radial-speed-lines` | 放射光线加速 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/radial-speed-lines.md` |
| `rain-freeze-resume` | 文字雨暂停后继续 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/rain-freeze-resume.md` |
| `rapid-cut` | 节拍闪切 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/rapid-cut.md` |
| `rasengan-illustration` | 蓝色能量球 | 流场与能量 | M6-motion-source | `engines/wise-motion/references/effects/rasengan-illustration.md` |
| `rect-aperture-breathe` | 矩形窗口伸缩 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/rect-aperture-breathe.md` |
| `rect-wave-field` | 色块随机闪亮 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/rect-wave-field.md` |
| `reduction-dimension` | 条形缩短对比 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/reduction-dimension.md` |
| `result-anchors` | KIMI K3 宣传片复刻 | 界面与演示 | M6-motion-source | `engines/wise-motion/references/effects/result-anchors.md` |
| `ridge-text-write` | 跟拍文字书写 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/ridge-text-write.md` |
| `rigid-rebound` | 左右滑入回摆 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/rigid-rebound.md` |
| `ring-construction` | 圆环增厚剖开 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/ring-construction.md` |
| `ring-sphere-journey` | 环线构建到球涡的连续演变 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/ring-sphere-journey.md` |
| `rolling-distance` | 车轮随行转动 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/rolling-distance.md` |
| `row-flash-transform` | 图形闪烁变形 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/row-flash-transform.md` |
| `ruler-ticks` | 刻度依次出现 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/ruler-ticks.md` |
| `sage-butterfly-illustration` | 鼠尾草绿蝴蝶 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/sage-butterfly-illustration.md` |
| `scale-in` | 放大回弹入场 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/scale-in.md` |
| `scene-carry` | 图块下移放大 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/scene-carry.md` |
| `scraps-return-layout` | 碎片散开归位 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/scraps-return-layout.md` |
| `scroll-brake` | 滚动减速停住 | 滚动与轮播 | M6-motion-source | `engines/wise-motion/references/effects/scroll-brake.md` |
| `scroll-unroll-feed` | 卷轴展开滚动 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/scroll-unroll-feed.md` |
| `seamless-scroll` | 无缝滚动 | 滚动与轮播 | M6-motion-source | `engines/wise-motion/references/effects/seamless-scroll.md` |
| `seat-water-lift` | 入水托起回升 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/seat-water-lift.md` |
| `sector-appear` | 环图分区展开 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/sector-appear.md` |
| `seed-bloom-brand-sequence` | 生长化蝶与光形字标 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/seed-bloom-brand-sequence.md` |
| `seed-shedding-illustration` | 蒲公英脱落飘散 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/seed-shedding-illustration.md` |
| `seed-sprout-bloom` | 种子落地生长 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/seed-sprout-bloom.md` |
| `selfie-cat-illustration` | 自拍小葵多视角 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/selfie-cat-illustration.md` |
| `selfie-foot-turn` | 转身前进返回 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/selfie-foot-turn.md` |
| `selfie-phone-illustration` | 斜放手机 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/selfie-phone-illustration.md` |
| `selfie-phone-screen-illustration` | 手机透视画面 | 界面与读数 | M6-motion-source | `engines/wise-motion/references/effects/selfie-phone-screen-illustration.md` |
| `selfie-preview-illustration` | 我和小葵的自拍预览 | 界面与读数 | M6-motion-source | `engines/wise-motion/references/effects/selfie-preview-illustration.md` |
| `send-press-ring` | 按钮按压扩圈 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/send-press-ring.md` |
| `sentence-depth-tunnel` | 穿越文字隧道 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/sentence-depth-tunnel.md` |
| `sequential-spec` | 图文依次显现 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/sequential-spec.md` |
| `settle-grow-spread` | 草木生长蔓延 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/settle-grow-spread.md` |
| `shape-contact-rebound` | 落地回弹 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/shape-contact-rebound.md` |
| `shape-morph` | 轮廓连续变形 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/shape-morph.md` |
| `shared-object` | 主体连接两场 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/shared-object.md` |
| `shenzhen-skyline-illustration` | 深圳湾原楼影 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/shenzhen-skyline-illustration.md` |
| `shenzhen-snow-journey` | 深圳湾雪夜 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/shenzhen-snow-journey.md` |
| `shutter-transition` | 百叶窗转场 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/shutter-transition.md` |
| `slat-alternate-transition` | 横条交替转场 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/slat-alternate-transition.md` |
| `slide-type-reveal` | 滑入后打字 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/slide-type-reveal.md` |
| `slider-response` | 滑块控制形变 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/slider-response.md` |
| `smoke-ring-illustration` | 烟圈翻卷 | 流场与能量 | M6-motion-source | `engines/wise-motion/references/effects/smoke-ring-illustration.md` |
| `snow-arrival-window` | 雪花融入灯光 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/snow-arrival-window.md` |
| `snow-crystal-illustration` | 雪晶与十字光点 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/snow-crystal-illustration.md` |
| `soft-type-land` | 立体字依次落下 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/soft-type-land.md` |
| `spark-follow-text` | 光点追字点亮 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/spark-follow-text.md` |
| `sparse-dial-counterturn` | 刻度圆环反向旋转 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/sparse-dial-counterturn.md` |
| `spatial-mechanical-sequence` | 实景层次与连续开窗展示 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/spatial-mechanical-sequence.md` |
| `spheres-material-merge` | 球体合并换材质 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/spheres-material-merge.md` |
| `spherical-vortex-flow` | 球内旋涡流动 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/spherical-vortex-flow.md` |
| `spiral-draw-spin` | 螺旋线边画边转 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/spiral-draw-spin.md` |
| `spiral-galaxy-illustration` | 旋转星系 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/spiral-galaxy-illustration.md` |
| `spiral-inward-flow` | 流线螺旋汇聚 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/spiral-inward-flow.md` |
| `spiral-point-turn` | 螺旋点阵旋转 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/spiral-point-turn.md` |
| `squash-bounce` | 落地压扁回弹 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/squash-bounce.md` |
| `stack-flick` | 纸片连续叠加 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/stack-flick.md` |
| `stage-merge-illustration` | 卡片压缩合并 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/stage-merge-illustration.md` |
| `staged-build` | 内容逐层叠加 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/staged-build.md` |
| `stagger-crossfade` | 文字逐个淡出 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/stagger-crossfade.md` |
| `stagger-drop` | 依次落下 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/stagger-drop.md` |
| `stagger-in` | 依次入场 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/stagger-in.md` |
| `stamp-land` | 缩小入场 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/stamp-land.md` |
| `star-letter-blue-journey` | 星月来信蓝色背景版 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/star-letter-blue-journey.md` |
| `star-letter-journey` | 星月来信完整旅程 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/star-letter-journey.md` |
| `steel-ruler-illustration` | 金属钢尺 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/steel-ruler-illustration.md` |
| `step-hop` | 逐级跳跃 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/step-hop.md` |
| `striped-rise-pulse` | 条纹升起律动 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/striped-rise-pulse.md` |
| `striped-sun-rise` | 条纹太阳升起 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/striped-sun-rise.md` |
| `stroke-draw` | 线条逐段画出 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/stroke-draw.md` |
| `stroke-hatch` | 排线填充 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/stroke-hatch.md` |
| `subtitle-block-shift` | 文字让位放大 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/subtitle-block-shift.md` |
| `subtitle-cell-focus` | 文字轮流提亮 | 强调与配色 | M6-motion-source | `engines/wise-motion/references/effects/subtitle-cell-focus.md` |
| `subtitle-focus` | 字幕显现聚焦 | 文字与叙事 | M6-motion-source | `engines/wise-motion/references/effects/subtitle-focus.md` |
| `sunbeam-circle-rebound` | 圆形落地回弹 | 跟随与回弹 | M6-motion-source | `engines/wise-motion/references/effects/sunbeam-circle-rebound.md` |
| `sunset-airplane-illustration` | 夕阳飞机 | 物件与角色 | M6-motion-source | `engines/wise-motion/references/effects/sunset-airplane-illustration.md` |
| `sunset-pickup-journey` | 海面上的夕阳 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/sunset-pickup-journey.md` |
| `sunset-sea-illustration` | 夕阳水面反馈 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/sunset-sea-illustration.md` |
| `sunset-sun-illustration` | 暖色太阳 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/sunset-sun-illustration.md` |
| `sunset-water-reflection` | 水面倒影起伏 | 光效与氛围 | M6-motion-source | `engines/wise-motion/references/effects/sunset-water-reflection.md` |
| `swarm-arc-flight` | 群体弧线飞行 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/swarm-arc-flight.md` |
| `symbol-flight-settle` | 成群飞行拖光 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/symbol-flight-settle.md` |
| `terminal-code` | 代码逐行输入 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/terminal-code.md` |
| `terminal-window-illustration` | 命令窗口 | 界面与读数 | M6-motion-source | `engines/wise-motion/references/effects/terminal-window-illustration.md` |
| `terraced-rise` | 阶梯逐层长高 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/terraced-rise.md` |
| `terrain-line-wave` | 层叠地形起伏 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/terrain-line-wave.md` |
| `text-decode` | 乱码逐字还原 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/text-decode.md` |
| `text-edit` | 退格改写 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/text-edit.md` |
| `text-plane-tilt` | 文字雨震动 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/text-plane-tilt.md` |
| `theme-card-layout` | 排版逐行展开 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/theme-card-layout.md` |
| `theme-color-cycle` | 配色同步轮换 | 强调与配色 | M6-motion-source | `engines/wise-motion/references/effects/theme-color-cycle.md` |
| `thread-weave` | 双线交织成形 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/thread-weave.md` |
| `three-column-aperture` | 三列窗口依次开合 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/three-column-aperture.md` |
| `tile-ring-unfold` | 地块逐圈翻开 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/tile-ring-unfold.md` |
| `tile-round-wave` | 方圆旋转变形 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/tile-round-wave.md` |
| `tile-wall-focus` | 图块推近 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/tile-wall-focus.md` |
| `tile-wave-transition` | 方块波浪转场 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/tile-wave-transition.md` |
| `tilt-drop-settle` | 斜落回正 | 入场与展开 | M6-motion-source | `engines/wise-motion/references/effects/tilt-drop-settle.md` |
| `time-in-motion-sequence` | 精密结构与词块产品展示 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/time-in-motion-sequence.md` |
| `timed-point-hop` | 踩点跳跃拖光 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/timed-point-hop.md` |
| `timeline-dock-down` | 时间轴缩小下移 | 布局与层次 | M6-motion-source | `engines/wise-motion/references/effects/timeline-dock-down.md` |
| `timeline-keyframe-playhead` | 游标扫过节点 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/timeline-keyframe-playhead.md` |
| `timeline-progress` | 时间轴依次点亮 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/timeline-progress.md` |
| `title-content` | 标题内容展开 | 文字与叙事 | M6-motion-source | `engines/wise-motion/references/effects/title-content.md` |
| `title-stagger` | 双语标题依次进出 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/title-stagger.md` |
| `tone-grow` | 色阶展开 | 强调与配色 | M6-motion-source | `engines/wise-motion/references/effects/tone-grow.md` |
| `torus-illustration` | 旋转圆环线框 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/torus-illustration.md` |
| `trash-intake-output` | 吸入后吐出成堆 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/trash-intake-output.md` |
| `trend-draw` | 折线依次画出 | 数字与图表 | M6-motion-source | `engines/wise-motion/references/effects/trend-draw.md` |
| `type-burst-settle` | 立体字弹起归位 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/type-burst-settle.md` |
| `type-reveal` | 文字逐字亮起 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/type-reveal.md` |
| `venturi-illustration` | 缩口管道流线 | 几何与网络 | M6-motion-source | `engines/wise-motion/references/effects/venturi-illustration.md` |
| `vertical-feed` | 连续向上滚动 | 滚动与轮播 | M6-motion-source | `engines/wise-motion/references/effects/vertical-feed.md` |
| `vortex-line-roll` | 环形流线翻滚 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/vortex-line-roll.md` |
| `vortex-ring-illustration` | 涡环流线翻卷 | 流场与能量 | M6-motion-source | `engines/wise-motion/references/effects/vortex-ring-illustration.md` |
| `water-wave-handoff` | 水面随波换图 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/water-wave-handoff.md` |
| `wave-grid` | 方格斜向依次长出 | 反馈与联动 | M6-motion-source | `engines/wise-motion/references/effects/wave-grid.md` |
| `weighted-node-signal` | 节点传递光点 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/weighted-node-signal.md` |
| `window-experiment-journey` | 窗外实验树开花 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/window-experiment-journey.md` |
| `window-experiment-tree-illustration` | 窗外实验树 | 自然与天体 | M6-motion-source | `engines/wise-motion/references/effects/window-experiment-tree-illustration.md` |
| `window-flower-bloom` | 沿枝依次开花 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/window-flower-bloom.md` |
| `window-step-connect` | 窗口逐格连线 | 路径与描绘 | M6-motion-source | `engines/wise-motion/references/effects/window-step-connect.md` |
| `wing-fold-sway` | 机翼折动摇摆 | 变形与生长 | M6-motion-source | `engines/wise-motion/references/effects/wing-fold-sway.md` |
| `wing-root-color-reveal` | 翅膀向外染色 | 强调与配色 | M6-motion-source | `engines/wise-motion/references/effects/wing-root-color-reveal.md` |
| `wipe` | 擦除转场 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/wipe.md` |
| `wire-ring-build-turn` | 线框边画边转 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/wire-ring-build-turn.md` |
| `wireframe-axis-turn` | 线框双轴旋转 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/wireframe-axis-turn.md` |
| `word-cloud-lift` | 词句分层上浮 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/word-cloud-lift.md` |
| `word-focus` | 词语划线强调 | 强调与配色 | M6-motion-source | `engines/wise-motion/references/effects/word-focus.md` |
| `word-river-evaporate` | 词句流动蒸发 | 粒子与流动 | M6-motion-source | `engines/wise-motion/references/effects/word-river-evaporate.md` |
| `word-slam` | 文字冲撞叠影 | 文字与字形 | M6-motion-source | `engines/wise-motion/references/effects/word-slam.md` |
| `word-sphere-arrival` | 文字成球再吸回 | 立体与镜头 | M6-motion-source | `engines/wise-motion/references/effects/word-sphere-arrival.md` |
| `xiaokui-selfie-journey` | 小葵和我 | 图形与材质 | M6-motion-source | `engines/wise-motion/references/effects/xiaokui-selfie-journey.md` |
| `zoom-transition` | 放大模糊转场 | 画面转场 | M6-motion-source | `engines/wise-motion/references/effects/zoom-transition.md` |

### 动效函数（onetake）（35）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `camera` | camera | camera | M1-video | `engines/onetake/references/motion-library.md` |
| `carouselLoop` | carouselLoop | fluid — a ground of light, silk, a belt (ebb) | M1-video | `engines/onetake/references/motion-library.md` |
| `cursor` | cursor | contact — one thing causes another | M1-video | `engines/onetake/references/motion-library.md` |
| `dof` | dof | camera | M1-video | `engines/onetake/references/motion-library.md` |
| `drift` | drift | camera | M1-video | `engines/onetake/references/motion-library.md` |
| `flyThrough` | flyThrough | enter — something arrives | M1-video | `engines/onetake/references/motion-library.md` |
| `gather` | gather | carry — the next beat grows out of this one | M1-video | `engines/onetake/references/motion-library.md` |
| `hop` | hop | carry — the next beat grows out of this one | M1-video | `engines/onetake/references/motion-library.md` |
| `impact` | impact | contact — one thing causes another | M1-video | `engines/onetake/references/motion-library.md` |
| `impactSplit` | impactSplit | contact — one thing causes another | M1-video | `engines/onetake/references/motion-library.md` |
| `iris` | iris | carry — the next beat grows out of this one | M1-video | `engines/onetake/references/motion-library.md` |
| `lattice` | lattice | camera | M1-video | `engines/onetake/references/motion-library.md` |
| `letterDrop` | letterDrop | enter — something arrives | M1-video | `engines/onetake/references/motion-library.md` |
| `lightField` | lightField | fluid — a ground of light, silk, a belt (ebb) | M1-video | `engines/onetake/references/motion-library.md` |
| `maskRise` | maskRise | enter — something arrives | M1-video | `engines/onetake/references/motion-library.md` |
| `morphRect` | morphRect | carry — the next beat grows out of this one | M1-video | `engines/onetake/references/motion-library.md` |
| `popIn` | popIn | enter — something arrives | M1-video | `engines/onetake/references/motion-library.md` |
| `press` | press | contact — one thing causes another | M1-video | `engines/onetake/references/motion-library.md` |
| `project` | project | camera | M1-video | `engines/onetake/references/motion-library.md` |
| `ribbon` | ribbon | carry — the next beat grows out of this one | M1-video | `engines/onetake/references/motion-library.md` |
| `ripple` | ripple | fluid — a ground of light, silk, a belt (ebb) | M1-video | `engines/onetake/references/motion-library.md` |
| `screenTravel` | screenTravel | camera | M1-video | `engines/onetake/references/motion-library.md` |
| `seal` | seal | carry — the next beat grows out of this one | M1-video | `engines/onetake/references/motion-library.md` |
| `shake` | shake | camera | M1-video | `engines/onetake/references/motion-library.md` |
| `silk` | silk | fluid — a ground of light, silk, a belt (ebb) | M1-video | `engines/onetake/references/motion-library.md` |
| `sim.magnetfollowjellyverlet` | sim.magnetfollowjellyverlet | contact — one thing causes another | M1-video | `engines/onetake/references/motion-library.md` |
| `squash` | squash | contact — one thing causes another | M1-video | `engines/onetake/references/motion-library.md` |
| `staccato` | staccato | carry — the next beat grows out of this one | M1-video | `engines/onetake/references/motion-library.md` |
| `swiftSpring` | swiftSpring | fluid — a ground of light, silk, a belt (ebb) | M1-video | `engines/onetake/references/motion-library.md` |
| `tick` | tick | enter — something arrives | M1-video | `engines/onetake/references/motion-library.md` |
| `typeOn` | typeOn | enter — something arrives | M1-video | `engines/onetake/references/motion-library.md` |
| `view` | view | camera | M1-video | `engines/onetake/references/motion-library.md` |
| `whip` | whip | camera | M1-video | `engines/onetake/references/motion-library.md` |
| `wordRise` | wordRise | enter — something arrives | M1-video | `engines/onetake/references/motion-library.md` |
| `zoomThrough` | zoomThrough | carry — the next beat grows out of this one | M1-video | `engines/onetake/references/motion-library.md` |

### 物件模型（claude-motion）（30）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `aura-bud` | 完整耳机与充电盒 |  | M1-video | `` |
| `avocado` | 牛油果剖面 |  | M1-video | `` |
| `boombox` | 收音机实体 |  | M1-video | `` |
| `delivery-truck` | 送货卡车 |  | M1-video | `` |
| `expressive-robot` | 表情与全身动作机器人 |  | M1-video | `` |
| `fox` | 带骨骼的狐狸 |  | M1-video | `` |
| `hourglass` | 体积关联的沙漏 |  | M1-video | `` |
| `kenney-bed-single` | 单人床 |  | M1-video | `` |
| `kenney-bookcase-open` | 开放书架 |  | M1-video | `` |
| `kenney-bridge-wood` | 木桥 |  | M1-video | `` |
| `kenney-campfire-logs` | 篝火木堆 |  | M1-video | `` |
| `kenney-canoe` | 独木舟 |  | M1-video | `` |
| `kenney-chair-desk` | 书桌椅 |  | M1-video | `` |
| `kenney-desk` | 写字桌 |  | M1-video | `` |
| `kenney-flower-red-a` | 红花 |  | M1-video | `` |
| `kenney-kitchen-coffee-machine` | 咖啡机 |  | M1-video | `` |
| `kenney-kitchen-stove` | 厨房炉灶 |  | M1-video | `` |
| `kenney-lamp-round-floor` | 落地灯 |  | M1-video | `` |
| `kenney-lounge-sofa` | 双人沙发 |  | M1-video | `` |
| `kenney-rock-large-a` | 大岩石 |  | M1-video | `` |
| `kenney-tent-detailed-open` | 敞开帐篷 |  | M1-video | `` |
| `kenney-tree-oak` | 橡树 |  | M1-video | `` |
| `kenney-tree-pine-tall-a-detailed` | 高松树 |  | M1-video | `` |
| `lantern` | 木制提灯 |  | M1-video | `` |
| `quaternius-alpaca` | 羊驼 |  | M1-video | `` |
| `quaternius-deer` | 鹿 |  | M1-video | `` |
| `quaternius-horse` | 马 |  | M1-video | `` |
| `quaternius-shiba` | 柴犬 |  | M1-video | `` |
| `toy-car` | 玩具汽车 |  | M1-video | `` |
| `turntable` | 带落针机构的唱机 |  | M1-video | `` |

### 制作系统（claude-motion）（5）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `glass` | 玻璃实体 |  | M1-video | `engines/claude-motion/assets/production/glass` |
| `handdrawn` | 手绘角色 |  | M1-video | `engines/claude-motion/assets/production/handdrawn` |
| `hd2d` | 像素三维 |  | M1-video | `engines/claude-motion/assets/production/hd2d` |
| `papercut` | 纸片与镂空 |  | M1-video | `engines/claude-motion/assets/production/papercut` |
| `swiss` | 字体与图形 |  | M1-video | `engines/claude-motion/assets/production/swiss` |

### 研究清单（claude-motion）（122）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `aadil6971/clawd-video` | aadil6971/clawd-video | 手绘卡通 | M1-video | `` |
| `abdullatif06/claude-motion-director` | abdullatif06/claude-motion-director | 产品界面与弹簧动效 | M1-video | `` |
| `achrefelouafi/ProceduralBuildingsThreeJS` | achrefelouafi/ProceduralBuildingsThreeJS | 参数化建筑 | M1-video | `` |
| `AmitSubhash/3brown1blue` | AmitSubhash/3brown1blue | Manim 数学讲解 | M1-video | `` |
| `Aureliengmz/clearwater` | Aureliengmz/clearwater | 实时浅水、FFT 波面与 RGB 焦散 | M1-video | `` |
| `auricxchu/latent` | auricxchu/latent | 氛围短片 | M1-video | `` |
| `avenoxai/opus-5.5-benchmarks` | avenoxai/opus-5.5-benchmarks | 视频与模型对照 | M1-video | `` |
| `az9713/opus-5.5-builds` | az9713/opus-5.5-builds | 多种视觉实验 | M1-video | `` |
| `az9713/opus-5.5-musical-cartoon` | az9713/opus-5.5-musical-cartoon | 水彩卡通 | M1-video | `` |
| `beidou070/let-me-go-code-mv` | beidou070/let-me-go-code-mv | 角色 MV、两次制作版本 | M1-video | `` |
| `Bemly/408` | Bemly/408 | 计算机知识 MV | M1-video | `` |
| `beriki770-ship-it/code-animations` | beriki770-ship-it/code-animations | Canvas 讲解 | M1-video | `` |
| `billpwchan/neon-zenith` | billpwchan/neon-zenith | 雨夜城市、程序幕墙与无状态雨 | M1-video | `` |
| `BintzGavin/helios` | BintzGavin/helios | 浏览器视频引擎 | M1-video | `` |
| `bishpls/animation-pipeline` | bishpls/animation-pipeline | Riso、排版、影偶与角色表演 | M1-video | `` |
| `bizarro/evangelion` | bizarro/evangelion | 霓虹 GPU 线场与 HDR 后期 | M1-video | `` |
| `bradautomates/claude-video` | bradautomates/claude-video | 视频取帧和转录 | M1-video | `` |
| `buildwithhanif/claude-animation-skill` | buildwithhanif/claude-animation-skill | 纸面昆虫与植物 | M1-video | `` |
| `Butanium/plink` | Butanium/plink | 踩水角色片、物理声音 | M1-video | `` |
| `c5inco/motion-showreel` | c5inco/motion-showreel | Compose / AGSL 排版与图形 | M1-video | `` |
| `cclank/lanshu-create-ai-presenter-video` | cclank/lanshu-create-ai-presenter-video | V2系统信号讲解 | M1-video | `` |
| `Changroro/code-video` | Changroro/code-video | 代码讲解 | M1-video | `` |
| `charlie947/motion-graphics-skills` | charlie947/motion-graphics-skills | 品牌、图表和排版规则 | M1-video | `` |
| `chenyuxiaojin/cyxj-hyperframes` | chenyuxiaojin/cyxj-hyperframes | 中文教程视频 | M1-video | `` |
| `ChetasLua/little-neighbourhood` | ChetasLua/little-neighbourhood | 邻里居民投影造型与关节动作 | M1-video | `` |
| `cloveric/claude-drawing-skill` | cloveric/claude-drawing-skill | 多风格程序插画 | M1-video | `` |
| `coolbat/awesome-fable-5.5-usecase` | coolbat/awesome-fable-5.5-usecase | 作品与提示词索引 | M1-video | `` |
| `coolbat/awesome-opus-5.5-usecase` | coolbat/awesome-opus-5.5-usecase | 作品与提示词索引 | M1-video | `` |
| `DarkCenobyte/linked-spirits-demo` | DarkCenobyte/linked-spirits-demo | OpenGL 视听 | M1-video | `` |
| `DDChen666/civilization-film` | DDChen666/civilization-film | 文明长镜头、地图和建筑线描 | M1-video | `` |
| `diggerhq/shipvideo` | diggerhq/shipvideo | 发布视频生成器 | M1-video | `` |
| `DozenTwelve/Papermorph` | DozenTwelve/Papermorph | PDF 动画交互书 | M1-video | `` |
| `drcollect/demolition-derby` | drcollect/demolition-derby | 真实车辆动力与可寻址运动轨迹 | M1-video | `` |
| `DSC-Martin/a25-mid-autumn` | DSC-Martin/a25-mid-autumn | 中秋剪纸短片 | M1-video | `` |
| `Edd-io/Workspace` | Edd-io/Workspace | 程序生成办公室道具与材质 | M1-video | `` |
| `edenfunf/reelmimic` | edenfunf/reelmimic | 剪纸、像素、赛璐珞、白板、蜡笔 | M1-video | `` |
| `eeselapp/claude-paper-animation` | eeselapp/claude-paper-animation | 纸上水彩品牌动画 | M1-video | `` |
| `eszn/claude-absolutely-right` | eszn/claude-absolutely-right | 卡通 MV | M1-video | `` |
| `fish2lab/bjtu-touhou-booth` | fish2lab/bjtu-touhou-booth | 活动循环动画 | M1-video | `` |
| `fornhere/opus55-demolar` | fornhere/opus55-demolar | 模拟与场景 | M1-video | `` |
| `FrancoEscob/permadeath-film` | FrancoEscob/permadeath-film | 长篇动态讲解 | M1-video | `` |
| `francozanardi/papermotion` | francozanardi/papermotion | 剪纸角色 | M1-video | `` |
| `FrostNovaOrg/world-execute-web` | FrostNovaOrg/world-execute-web | 互动音乐动画 | M1-video | `` |
| `GenielabsOpenSource/spine-animation-ai` | GenielabsOpenSource/spine-animation-ai | Spine 骨骼动画 | M1-video | `` |
| `gglucass/headroom-animation` | gglucass/headroom-animation | 手绘与立体纸书 | M1-video | `` |
| `haidrrrry/claude-remotion-skill` | haidrrrry/claude-remotion-skill | Remotion 动效 | M1-video | `` |
| `howseen-ai/claude-motion-design` | howseen-ai/claude-motion-design | 品牌动效 | M1-video | `` |
| `hyperitycorp-jkh/tech-lectures` | hyperitycorp-jkh/tech-lectures | 知识短片 | M1-video | `` |
| `i-afaqrashid/claude-animation-studio` | i-afaqrashid/claude-animation-studio | 手绘、多语言角色短片 | M1-video | `` |
| `iamtechartist/memory-fading-into-watercolor` | iamtechartist/memory-fading-into-watercolor | 记忆水彩颜料运输 | M1-video | `` |
| `iart-ai/javascript-animation-skills` | iart-ai/javascript-animation-skills | 手绘与知识动画 | M1-video | `` |
| `imMamdouhaboammar/motion-graphics-skills` | imMamdouhaboammar/motion-graphics-skills | 多个动效工作流 | M1-video | `` |
| `ishuagrawal/particle-beach` | ishuagrawal/particle-beach | 粒子 3D | M1-video | `` |
| `JakeB-5/motion-graphic-skill` | JakeB-5/motion-graphic-skill | 知识与品牌动效 | M1-video | `` |
| `Jeremy-Sharpe/made-in-code` | Jeremy-Sharpe/made-in-code | 纯代码影片与游戏工作流 | M1-video | `` |
| `jinda-li/Emergence` | jinda-li/Emergence | 程序化空间、粒子、文明演化 | M1-video | `` |
| `JohnHeibel/ClaudeAnimationBase` | JohnHeibel/ClaudeAnimationBase | 手绘角色 | M1-video | `` |
| `JohnHeibel/PDoomVideo` | JohnHeibel/PDoomVideo | 手绘 MV | M1-video | `` |
| `JohnnyWang8802/songbie` | JohnnyWang8802/songbie | 蜡笔空间故事 | M1-video | `` |
| `jtydhr88/fate-pv` | jtydhr88/fate-pv | 像素场景、字幕演出 | M1-video | `` |
| `juyi404/opus55-promo` | juyi404/opus55-promo | 模型宣传片 | M1-video | `` |
| `kirillshsh/claude-vs-codex` | kirillshsh/claude-vs-codex | 2.5D 像素角色短片 | M1-video | `` |
| `klsoen/opus-js-animations` | klsoen/opus-js-animations | 纸雕与叙事 | M1-video | `` |
| `krillinai/awesome-opus-animation` | krillinai/awesome-opus-animation | 作品与提示词索引 | M1-video | `` |
| `L1vsun/BLOCKWORLD` | L1vsun/BLOCKWORLD | 体素地形、AO 网格与橡树生成 | M1-video | `` |
| `latent-variable/deep-learning-birthday` | latent-variable/deep-learning-birthday | Riso 印刷 MV | M1-video | `` |
| `ledbetterljoshua/functional-emotions-video` | ledbetterljoshua/functional-emotions-video | GPU 笔触情绪叙事 | M1-video | `` |
| `legionsound/open-fusion-mcp` | legionsound/open-fusion-mcp | Fusion 动效 | M1-video | `` |
| `lemomo-ai/lemo-opuscar` | lemomo-ai/lemo-opuscar | 多风格 | M1-video | `` |
| `Leonxlnx/claude-launchvideo` | Leonxlnx/claude-launchvideo | 原生应用发布动效 | M1-video | `` |
| `Li-Evan/awesome-opus-5.5-video-prompts` | Li-Evan/awesome-opus-5.5-video-prompts | 作品与提示词索引 | M1-video | `` |
| `liustack/flipbook` | liustack/flipbook | 纸张、印刷、像素与角色 | M1-video | `` |
| `LunaAI519/motion-skill` | LunaAI519/motion-skill | 复古拼贴 | M1-video | `` |
| `luyenchou1/why-one-third` | luyenchou1/why-one-third | 数学可视化 | M1-video | `` |
| `Madheshvivekanandan/perfect-yorker-3d` | Madheshvivekanandan/perfect-yorker-3d | Blender 板球短片 | M1-video | `` |
| `makevoid/motion-graphics-music-video-skill` | makevoid/motion-graphics-music-video-skill | 音乐视频 | M1-video | `` |
| `MeiJynX/Claude-Opus5.5-MakeBrandFilm` | MeiJynX/Claude-Opus5.5-MakeBrandFilm | 品牌预告 | M1-video | `` |
| `mexicat/pdoom-video` | mexicat/pdoom-video | 歌词与程序图形 | M1-video | `` |
| `MiaAI-lab/Claude-Opus-5.5-100-HTML-Files` | MiaAI-lab/Claude-Opus-5.5-100-HTML-Files | HTML 视觉实验 | M1-video | `` |
| `misbahsy/claude-horizon-animation` | misbahsy/claude-horizon-animation | 发布片与工程讲解 | M1-video | `` |
| `naveen-annam/creativly.ai-higgsfield-video-remotion` | naveen-annam/creativly.ai-higgsfield-video-remotion | 品牌片复刻 | M1-video | `` |
| `naveen-annam/creativly.ai-magnific-video-remotion` | naveen-annam/creativly.ai-magnific-video-remotion | 品牌片复刻 | M1-video | `` |
| `neelnanda-io/dont-go-quiet-on-me` | neelnanda-io/dont-go-quiet-on-me | 手绘音乐叙事 | M1-video | `` |
| `negevtvx/grok-vs-opus-catgirl-run` | negevtvx/grok-vs-opus-catgirl-run | 3D 角色循环 | M1-video | `` |
| `nexu-io/motion-anything` | nexu-io/motion-anything | 多代理动效引擎和配方集合 | M1-video | `` |
| `okonio/felt-dot-gpt-vs-opus` | okonio/felt-dot-gpt-vs-opus | 毛毡三维角色 | M1-video | `` |
| `op7418/guizang-product-video-skill` | op7418/guizang-product-video-skill | 产品演示 | M1-video | `` |
| `orangeplaya/ct-frog-note-hop` | orangeplaya/ct-frog-note-hop | 音乐与 3D 图形 | M1-video | `` |
| `petergpt/painted-rickroll` | petergpt/painted-rickroll | 油画动画 | M1-video | `` |
| `QalbAsia/silo-tv-show-animation-made-by-claude` | QalbAsia/silo-tv-show-animation-made-by-claude | 科幻空间 | M1-video | `` |
| `Qwinty/agents-pixel-film` | Qwinty/agents-pixel-film | 像素叙事 | M1-video | `` |
| `reeyarn/animation_test` | reeyarn/animation_test | 剪纸与模型讲解 | M1-video | `` |
| `riba2534/claude-opus-5-5-demo` | riba2534/claude-opus-5-5-demo | 3D 游戏 | M1-video | `` |
| `rmonsurate/medium-films` | rmonsurate/medium-films | 材质动画 | M1-video | `` |
| `runesleo/claude-video-kit` | runesleo/claude-video-kit | 竖屏讲解 | M1-video | `` |
| `ryanhartman4/music_vid_moon` | ryanhartman4/music_vid_moon | 节拍叙事 MV | M1-video | `` |
| `Salmisaari/eudoom-video` | Salmisaari/eudoom-video | 四墨印刷与仪表图解 | M1-video | `` |
| `Sam1983Aing/domino-show` | Sam1983Aing/domino-show | 物理多米诺 | M1-video | `` |
| `sanjuhs/opus-5.5-film-experiment-with-animation` | sanjuhs/opus-5.5-film-experiment-with-animation | 历史讲解 | M1-video | `` |
| `sbobyn/three-avbd` | sbobyn/three-avbd | 物理模拟 | M1-video | `` |
| `scosman/videowright` | scosman/videowright | 产品讲解 | M1-video | `` |
| `sevenevesai/riso-windowseat` | sevenevesai/riso-windowseat | Risograph 印刷 | M1-video | `` |
| `Shinkou777/gento` | Shinkou777/gento | 代码动画与公共领域艺术拼贴 | M1-video | `` |
| `simonw/tools` | simonw/tools | 像素鸟类形态与帧绘制 | M1-video | `` |
| `stefanomainardi/omacrt` | stefanomainardi/omacrt | 人物支撑步态与关节曲线 | M1-video | `` |
| `sujee/visual-stories` | sujee/visual-stories | 技术讲解、卡通图解 | M1-video | `` |
| `sundyme/punctum` | sundyme/punctum | 点阵字体、点光舞台 | M1-video | `` |
| `swan4er/opus-100-projects` | swan4er/opus-100-projects | 交互与卡通 | M1-video | `` |
| `Th1nhNg0/the-plane-needs-six` | Th1nhNg0/the-plane-needs-six | 纸上数学角色 | M1-video | `` |
| `ThorHe-Hub/opus-geometry-of-control` | ThorHe-Hub/opus-geometry-of-control | 知识讲解 | M1-video | `` |
| `titanjagpreet/rule-the-world` | titanjagpreet/rule-the-world | 水彩 MV | M1-video | `` |
| `toankhontech/pelican-test-opus55` | toankhontech/pelican-test-opus55 | SVG 角色循环 | M1-video | `` |
| `tschwarz-bp/code-films` | tschwarz-bp/code-films | 手工印刷动画 | M1-video | `` |
| `tuzhechen2005/opus-video-skills` | tuzhechen2005/opus-video-skills | 手绘、动态排版 | M1-video | `` |
| `uxKero/opuscut` | uxKero/opuscut | 镜头与风格导演工具 | M1-video | `` |
| `Vincentwei1021/mg-styles-15` | Vincentwei1021/mg-styles-15 | 15 支 MG 样片：线条、等轴、形变、液体、HUD 等 | M1-video | `` |
| `vipi-n/drawn-in-javascript` | vipi-n/drawn-in-javascript | 蜡笔手绘、恐龙和人类故事 | M1-video | `` |
| `WinterArc21/Battle-of-Austerlitz-Film` | WinterArc21/Battle-of-Austerlitz-Film | 历史讲解 | M1-video | `` |
| `yasinozmeen/animasyon-stil-katalogu` | yasinozmeen/animasyon-stil-katalogu | 20 种动画风格（作者目录标称） | M1-video | `` |
| `yihui-dev/awesome-fable5-5-videos` | yihui-dev/awesome-fable5-5-videos | 作品与提示词索引 | M1-video | `` |
| `zhuyansen/awesome-opus-5.5-video` | zhuyansen/awesome-opus-5.5-video | 作品与提示词索引 | M1-video | `` |
| `ZJY-HubGit/ClayMirror-Claudeaimade` | ZJY-HubGit/ClayMirror-Claudeaimade | 实时橡皮泥变形 | M1-video | `` |

### 场景起点（claude-motion）（14）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `animate-crosshatch` | 钢笔排线 |  | M1-video | `engines/claude-motion/assets/scenes/animate-crosshatch` |
| `animate-cut-paper` | 彩纸室内 |  | M1-video | `engines/claude-motion/assets/scenes/animate-cut-paper` |
| `animate-isometric` | 等距线描 |  | M1-video | `engines/claude-motion/assets/scenes/animate-isometric` |
| `animate-math` | 数学演示 |  | M1-video | `engines/claude-motion/assets/scenes/animate-math` |
| `animate-pixel` | 像素夜景 |  | M1-video | `engines/claude-motion/assets/scenes/animate-pixel` |
| `animate-riso` | 孔版叠印 |  | M1-video | `engines/claude-motion/assets/scenes/animate-riso` |
| `animate-sketchbook` | 素描笔记 |  | M1-video | `engines/claude-motion/assets/scenes/animate-sketchbook` |
| `botanical-ink` | 蒲公英的远行 |  | M1-video | `engines/claude-motion/assets/scenes/botanical-ink` |
| `contact-workshop` | 装回音乐盒齿轮 |  | M1-video | `engines/claude-motion/assets/scenes/contact-workshop` |
| `lemo-lowpoly-island` | 海岛入夜 |  | M1-video | `engines/claude-motion/assets/scenes/lemo-lowpoly-island` |
| `lemo-midcentury-toon` | 下班后的片刻 |  | M1-video | `engines/claude-motion/assets/scenes/lemo-midcentury-toon` |
| `lemo-paper-popup` | 纸书里的飞行 |  | M1-video | `engines/claude-motion/assets/scenes/lemo-paper-popup` |
| `lemo-scifi-toon` | 最后一杯咖啡 |  | M1-video | `engines/claude-motion/assets/scenes/lemo-scifi-toon` |
| `reading-room` | 风翻过书页 |  | M1-video | `engines/claude-motion/assets/scenes/reading-room` |

### 镜头配方卡（shotcraft）（124）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `assemble-then-type-flyin` | 空的暗底网格上，无文字的组件骨架先从四面八方飞入贴合；随后各处文字逐字从 3D 空间旋转着飞来落位，先大标题后小标注，全部落位后页面成形 | effects | M8-shot | `engines/shotcraft/references/shots/effects/assemble-then-type-flyin.md` |
| `aurora-bloom-bg-flip` | 浅灰底从底部升起紫橙柔焦 blob，随后整个底色在约 0.36s 内压暗到近黑、blob 压成余晖；文案同步 blur-out 换句 blu | effects | M8-shot | `engines/shotcraft/references/shots/effects/aurora-bloom-bg-flip.md` |
| `autolayout-gap-dial` | 间距拨盘驱动布局——一排链接块带框选描边+缝隙间距标注，徽章数字逐格跳动、块被参数实时推开再弹簧回弹归位；"参数驱动布局"的可视化 | interaction | M8-shot | `engines/shotcraft/references/shots/interaction/autolayout-gap-dial.md` |
| `avatar-bracket-carousel` | "Your ___ agent" 填空排版，四角对焦框钉在句中不动，头像队列在框内垂直 spring 轮换三次，入框放大清晰、出框按距离缩小 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/avatar-bracket-carousel.md` |
| `basic-3d-scene` | impress.js 式空间演示：卡片以不同位置/旋转/缩放散布 3D 空间，相机取各步姿态之逆依次飞行对齐，末步拉到 OVERVIEW 总 | camera | M8-shot | `engines/shotcraft/references/shots/camera/basic-3d-scene.md` |
| `beat-cut-moves` | 硬切当节拍乐器——连闪定格：三次白闪各硬切同一画面的一个裁切（全景→卡片→特写），快门余韵沉降后停在特写收束 | rhythm | M8-shot | `engines/shotcraft/references/shots/rhythm/beat-cut-moves.md` |
| `beat-step-list-theme-cycle` | 三通道节拍器——深色场形容词列表逐拍上移一行，视口中央固定胶囊"接住"下一个词并换色，整场底色同拍跟换；行、色、场三通道锁死同一拍点 | rhythm | M8-shot | `engines/shotcraft/references/shots/rhythm/beat-step-list-theme-cycle.md` |
| `before-after-slider-scrub` | 前后对比拉杆——"处理前/后"两版叠放，分割杆先猛甩后慢扫，杆过处新版"显影"揭出 | data | M8-shot | `engines/shotcraft/references/shots/data/before-after-slider-scrub.md` |
| `bezier-source-converge-merge` | 左侧四个来源节点各有一条细贝塞尔曲线连向右侧同一汇聚点，曲线先错峰由左向右 draw-on，节点沿自己的曲线滑向汇聚点并三段式加速缩小到消失 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/bezier-source-converge-merge.md` |
| `blur-slide` | 标题逐词入场，y 0.38em→0 + blur 18→0 + opacity 0→1 三通道走同一条 ease-out 同步收敛，词间隔约 | typography | M8-shot | `engines/shotcraft/references/shots/typography/blur-slide.md` |
| `bottom-push-stack-wipe` | 底边上推换章——新场景连底色整屏从底边向上推入，把旧场景物理顶出画外，连推数章各配一种饱和底色，内容钉死在各自色底坐标系里随底色走 | transition | M8-shot | `engines/shotcraft/references/shots/transition/bottom-push-stack-wipe.md` |
| `brace-expand` | 一对紧贴的小花括号先在正中出现，随即带一次过冲向左右弹开并放大到标题级，文字 clip 宽度严格绑括号内缘、像被拉开幕布般从中间揭示，落定后 | typography | M8-shot | `engines/shotcraft/references/shots/typography/brace-expand.md` |
| `brand-frame-snap` | 品牌色画框语法——一圈粗纯色画框先于内容长出包住全屏，录屏窗口落进框内；模式切换时整圈画框同帧硬翻色+窗内布局同帧换，一个 borderCo | effects | M8-shot | `engines/shotcraft/references/shots/effects/brand-frame-snap.md` |
| `brand-ink-open` | 墨线十字准星描画→字标逐字压印→打字机副标→满一秒静止再上浮消散 | opening | M8-shot | `engines/shotcraft/references/shots/opening/brand-ink-open.md` |
| `canvas-materialize-moves` | 内容"物化上画布"两式——panel-to-canvas 行倒卡（面板表格行沿弧线飞出、跨容器变形成画布卡片）与 diagram-casca | interaction | M8-shot | `engines/shotcraft/references/shots/interaction/canvas-materialize-moves.md` |
| `card-flip-reveal` | 功能卡 3D 翻面揭示——卡片沿 Y 轴翻 180°，正面 UI 翻到侧棱最薄处掠过一道随角度移动的受光，背面揭出大号结论数字，逐张错峰扫过 | transition | M8-shot | `engines/shotcraft/references/shots/transition/card-flip-reveal.md` |
| `card-flock-tumble` | 三张 UI 页卡从侧棱薄边 3D 翻飞成阶梯站定（全程清晰、样条连续丝滑），站定后保持慢转不停，快速收束吸入中心，炸出单个湍流烟雾环扩散，巨 | transition | M8-shot | `engines/shotcraft/references/shots/transition/card-flock-tumble.md` |
| `card-stack` | 一组模板卡（demo 9 张）从屏幕下方逐张 spring 弹入、越落越快叠成一摞，全员落位后整摞一次性展成扇面——每张按序号偏转 6.5° | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/card-stack.md` |
| `carousel-3d` | 8 张卡排成圆环整环自转一圈（匀速底 + 每 45° 一次停靠的分步），每卡只绕 Y 公转、自身 billboard 朝外，正反两层同向贴图 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/carousel-3d.md` |
| `chart-live-moves` | 活体图表三式——oscilloscope-stream 示波流线（曲线右端实时写入+突发尖峰）、unit-dot-swarm-regroup | data | M8-shot | `engines/shotcraft/references/shots/data/chart-live-moves.md` |
| `chip-grid-single-select-blackout` | 五个选项 chip 以 3+2 居中排布逐个淡入；选中帧先插一帧灰色按压块，紧接数帧内底色变墨黑、文字变白并做 1→1.04→1 极轻回弹， | interaction | M8-shot | `engines/shotcraft/references/shots/interaction/chip-grid-single-select-blackout.md` |
| `circle-match-iris` | 圆心匹配光圈切——光圈从页面上圆形元素的圆心炸开，圈内新页的圆形图表接在同一个圆上；匹配剪辑给光圈一个语义锚点 | transition | M8-shot | `engines/shotcraft/references/shots/transition/circle-match-iris.md` |
| `cloner-depth-echo` | 克隆纵队——主卡瞬间"复印"出 7 个半透明分身沿斜向纵深排开成队，停一拍后全体加速吸回本体合一+弹跳 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/cloner-depth-echo.md` |
| `collab-cursor-moves` | 协作光标当演员——cast-ensemble 五光标群演氛围层（错峰飞入+正弦漂移+打字 cameo+聚拢围观） | interaction | M8-shot | `engines/shotcraft/references/shots/interaction/collab-cursor-moves.md` |
| `countdown-arc-scatter` | 纸面表盘 9 个等大数字沿大弧切向排布，整盘扫过 96° 后减速急停，"5" 停在弧顶随即平移落位成标题首字符，其余数字带 blur 原地散 | typography | M8-shot | `engines/shotcraft/references/shots/typography/countdown-arc-scatter.md` |
| `crane-rise-reveal` | 升降臂拉升揭示——开场怼在一行数据特写，相机沿 Y 轴减速升起后拉，行行涌入直到整面 dashboard 铺满全幅 | opening | M8-shot | `engines/shotcraft/references/shots/opening/crane-rise-reveal.md` |
| `crash-zoom-punch` | 全景一拍急推到目标特写（6f），落位二选一——过冲回弹（弹性）或撞停震屏（重量） | camera | M8-shot | `engines/shotcraft/references/shots/camera/crash-zoom-punch.md` |
| `cursor-flyover` | 整页俯瞰后，相机依次飞到四个功能区 zoom-in 特写，SVG 光标先一步到位指点、点击留下涟漪并触发界面响应，最后拉回俯瞰 | camera | M8-shot | `engines/shotcraft/references/shots/camera/cursor-flyover.md` |
| `dataviz-landscape-open` | 暗场支流线束地景开场——多条流线汇入主干、虚构 ID 标签浮在线上、相机重景深低速飞越 | opening | M8-shot | `engines/shotcraft/references/shots/opening/dataviz-landscape-open.md` |
| `deck-deal-flyin` | 暗色石墨桌面上的实体牌堆特写环绕开局，灯从牌堆亮到旁边的页面板，一摞卡像发牌一样硬加速甩进网格，相机追着发牌升起后仰、落在整块满板的跑道式俯 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/deck-deal-flyin.md` |
| `depth-layer-moves` | 分层深度运镜——多层视差滑轨：3 层速度梯度横移出纵深，滑轨落定时主角浮起 | camera | M8-shot | `engines/shotcraft/references/shots/camera/depth-layer-moves.md` |
| `doc-park-left-pill-deal` | 文档不淡出而是向左滑出只露约 35% 宽并微缩到 0.92，右侧按旁白节奏慢速发牌三张白底描边药丸（outBack 弹入），每张落定后其下方 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/doc-park-left-pill-deal.md` |
| `document-typewriter-reveal` | 悬浮在暗场里的整页真排版文档窗口在光标后自己"写"出来、侧栏跟进、历史条目逐个落入轨道，相机从斜侧标题特写一路后撤到全窗 | typography | M8-shot | `engines/shotcraft/references/shots/typography/document-typewriter-reveal.md` |
| `draw-svg-trace` | 描边生长圈注——一条带笔头的墨线沿元素轮廓跑一圈把它"画"出来，闭合瞬间闪黑交棒、内容淡入；同套路可给标题画下划线 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/draw-svg-trace.md` |
| `element-body-moves` | 元素身体感——contact-shadow-lift 接触阴影离面抬升：卡抬起时桌上的阴影同步放大变淡，纸片离桌被阴影证明 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/element-body-moves.md` |
| `flying-words` | 22 个关键词按黄金角铺在扁椭圆截面上，沿 z 轴从远处飞到相机前擦身而过，透明度走 [0,1,0.5,0.2,0] 生命曲线，跑满 2 整 | typography | M8-shot | `engines/shotcraft/references/shots/typography/flying-words.md` |
| `fracture` | 5×5 瓦片从 3D 碎片态按中心波纹逐圈聚合成整面海报，停一拍亮字，随后全部碎片背离中心加速旋转飞出画面 | opening | M8-shot | `engines/shotcraft/references/shots/opening/fracture.md` |
| `fui-hud-moves` | FUI/HUD 准星咬合——reticle-lock-on 四个 L 形角标组成的取景框从画外飞入、超调回弹后咬合锁定目标 | effects | M8-shot | `engines/shotcraft/references/shots/effects/fui-hud-moves.md` |
| `gauge-readout-moves` | 仪表读数两式——needle-sweep-selftest 满弧扫针（点火自检指针甩满全弧再回落真值）与 tape-scroll-fixed | data | M8-shot | `engines/shotcraft/references/shots/data/gauge-readout-moves.md` |
| `glass-pill-dictation-typing` | 一条定宽玻璃胶囊以约 1.25 倍略大弹出后缓落到位，内部自左淡到右浓铺一层强调色暖光；光标先行、随后匀速打出听写句，光（连同胶囊背后的环境 | interaction | M8-shot | `engines/shotcraft/references/shots/interaction/glass-pill-dictation-typing.md` |
| `glitch-cycle` | 同一行等宽槽位循环轮播 4 条状态短语，每条头尾按概率关键帧 [1,0,0,0.1,0,0,1] 全乱码、中段偶发单字抖动，切换瞬间叠 RG | typography | M8-shot | `engines/shotcraft/references/shots/typography/glitch-cycle.md` |
| `glow-flyline-moves` | 暗场光斑与飞线三式——glow-orb-ambient 光斑底噪、flyline-arc 飞线连接、orb-flyline-relay 同帧 | effects | M8-shot | `engines/shotcraft/references/shots/effects/glow-flyline-moves.md` |
| `gradient-transition` | 背景在 linear、radial、conic 三类 CSS 渐变间平滑过渡——角度、色标、中心、半径逐参数插值，段间交叉淡化换类型 | transition | M8-shot | `engines/shotcraft/references/shots/transition/gradient-transition.md` |
| `gradient-word-sweep` | 黑底标语里关键词被渐变彩光从左到右快速扫过"充能"——波前字符辉光最强向后衰减，填满后字符间勾连细紫红闪电、整词稳态泛光呼吸 | typography | M8-shot | `engines/shotcraft/references/shots/typography/gradient-word-sweep.md` |
| `grain-dissolve` | 整行字爆裂成沸腾颗粒噪点并浮现斜纹选区框，噪点云急速凝聚成更大号发光短字标，位移衰减归零定格 | outro | M8-shot | `engines/shotcraft/references/shots/outro/grain-dissolve.md` |
| `graze-face-tour` | 大倾角贴面游走特写——镜头贴着 UI 表面低飞掠过（侧栏树/顶栏/列表当地形），页面文字初始悬浮在界面上空带同形软影，随镜头行进先后加速贴落 | camera | M8-shot | `engines/shotcraft/references/shots/camera/graze-face-tour.md` |
| `hashtag-to-pill-materialize` | 话题词打字实体化——居中打出 "#word"（红实心光标恒亮），1 帧硬切变成宽大胶囊标签，hold 后缩小左移落到页面标签位，再 1 帧硬 | interaction | M8-shot | `engines/shotcraft/references/shots/interaction/hashtag-to-pill-materialize.md` |
| `icon-field-colorize` | 灰阶小图标点阵错峰浮现铺满全屏，停一拍后多道品牌色横带波纹极快向下扫翻全场——"功能全景先摆满，品牌一瞬间点亮"的开场/收束卡 | opening | M8-shot | `engines/shotcraft/references/shots/opening/icon-field-colorize.md` |
| `icon-performance-moves` | 图标表演——attention-bounce 求关注弹跳（图标连跳递增+落地压扁+镜头被吸引） | effects | M8-shot | `engines/shotcraft/references/shots/effects/icon-performance-moves.md` |
| `impact-feedback` | 命中反馈两式——hit-counter 连招计数（顿帧+伤害数字+combo 跳字）、anime-impact 动漫打击帧（负片+集中线+色 | effects | M8-shot | `engines/shotcraft/references/shots/effects/impact-feedback.md` |
| `integration-hub-map` | 旧页面一次性快翻 180°（侧棱瞬间亮闪）落成新中枢页，五个集成 app 图标同帧弹现、随即五条彩虹光管同帧齐连，光管内输送脉冲持续流动—— | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/integration-hub-map.md` |
| `lead-word-zoom-assemble` | 首词以 2.3 倍字号占据画面中央、hold 期间继续推近 6%，随后一条曲线同时完成「缩回终字号」与「整行左滑归位」，后续词各自从槽位右侧 | typography | M8-shot | `engines/shotcraft/references/shots/typography/lead-word-zoom-assemble.md` |
| `letterspace-materialize` | 大字距字标全字符并行连续描画结晶——所有字母同帧起笔、笔画像手写一样连续生长、同帧齐收成词；氛围底景上的品牌字标显影 | opening | M8-shot | `engines/shotcraft/references/shots/opening/letterspace-materialize.md` |
| `light-play-moves` | 光效两式——spotlight-sweep 聚光扫字、sheen 单点扫光 | effects | M8-shot | `engines/shotcraft/references/shots/effects/light-play-moves.md` |
| `line-carry-transition` | 线条接力横移转场——场景 A 的进度条延伸出画，镜头跟线横移，线在移动中拐角围出场景 B 的卡框，全程无剪切 | transition | M8-shot | `engines/shotcraft/references/shots/transition/line-carry-transition.md` |
| `list-reveal` | 垂直菜单 6 项按 10f 的间隔依次 scale 找位、软 back 轻微过冲落定，同时整个列表容器全程匀速上移——逐项入场与整体漂移是两 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/list-reveal.md` |
| `list-stack-press` | 列表卡从画面底部逐张飞上摞起，每张落地压弹整摞、计数器同步跳一格 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/list-stack-press.md` |
| `logo-shrink-wordmark-lockup` | 霓虹切口大环快速收束成中央实心小白 O、过冲刹车时换成 video-shotcraft 标志，图标左移让位，字标字母逐个滑入完成 locku | outro | M8-shot | `engines/shotcraft/references/shots/outro/logo-shrink-wordmark-lockup.md` |
| `magician-card-flourish` | 午夜蓝暗场上蓝色星芒闪现 0.3s（X 形针状光束旋转 90°+中心辉光放射小光芒），卡片从闪光点弹射而出——极速自旋弧线飞向镜头、自旋随靠 | opening | M8-shot | `engines/shotcraft/references/shots/opening/magician-card-flourish.md` |
| `marker-underline-title` | 大标题落定后，关键词下方马克笔下划线从左到右快速描画——变宽笔形、毛糙边缘、微上斜跟随斜体字势，贴着字底 | typography | M8-shot | `engines/shotcraft/references/shots/typography/marker-underline-title.md` |
| `mosaic-reframe` | 12 张瓦片在规则网格、feature mosaic、对角瀑布串三种排版间连续变形，位置宽高各自插值、逐片微错峰，段间留 hold | transition | M8-shot | `engines/shotcraft/references/shots/transition/mosaic-reframe.md` |
| `neon-frame-forerun` | 强透视直角霓虹框自左缘两头奔画先行成型，页面在框内由暗转亮，同时框内组件/文字从 3D 上空带同形软影错峰贴落、随页面点亮同步完成贴合，背景 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/neon-frame-forerun.md` |
| `neon-frame-orbit-drop` | 霓虹框先行描框后，镜头绕页面左→右弧线旋转，页面全部组件/文字**同帧**从空中往下贴合（同形软影同步收敛）——整体登场式的框内安放 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/neon-frame-orbit-drop.md` |
| `neon-triple-marquee` | 三行对向霓虹跑马灯 recap——三连词空心霓虹灯管巨字上中下排满一面斜拍的砖墙，奇偶行反向匀速无限横滚，三行按 1/3 相位轮流点亮，结尾 | outro | M8-shot | `engines/shotcraft/references/shots/outro/neon-triple-marquee.md` |
| `orbit-ring-title-open` | 石墨暗场上八张 16:9 暗色内容卡按 45° 均布在 720×380 椭圆上匀速公转（卡身永不倾斜，纵深只由 sin θ 给出 ±12%  | opening | M8-shot | `engines/shotcraft/references/shots/opening/orbit-ring-title-open.md` |
| `outline-word-fill` | 空心词（细暖灰描边、500 字重）从 3.2 倍急缓收缩落位，虚线大圆随后从 2.8 倍收到字周围并缓慢自转，左右水平虚线从画框边缘内伸；描 | typography | M8-shot | `engines/shotcraft/references/shots/typography/outline-word-fill.md` |
| `outro-group-photo-launch` | 全片元素从四面八方飞来围住字标合影，crane 落机位+舞台光+金尘做成发布会收场 | outro | M8-shot | `engines/shotcraft/references/shots/outro/outro-group-photo-launch.md` |
| `overhead-camera-moves` | 俯拍揭示两式——tilt-reveal 俯仰抬正揭示、overhead-tabletop-drop 桌面卡阵横滑骤降扎入 | camera | M8-shot | `engines/shotcraft/references/shots/camera/overhead-camera-moves.md` |
| `page-turn-transitions` | 整页体块转场——barn-door-split 对开门裂幕（旧页裂两半滑出、新页迎上） | transition | M8-shot | `engines/shotcraft/references/shots/transition/page-turn-transitions.md` |
| `page-waterfall-wall` | 页面瀑布墙——真实页面截图切成 3–4 列在 3D 后仰墙面上差速反向无限滚动，视差 + 镜头缓推做"内容多到流不完"的一览 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/page-waterfall-wall.md` |
| `panel-grid-moves` | 分格节奏——comic-panel-split 漫画斜格劈出同一主体的三个机位，咔咔咔三格定格后末格斜边吃屏成海报 | rhythm | M8-shot | `engines/shotcraft/references/shots/rhythm/panel-grid-moves.md` |
| `paper-title-card` | 一句话逐词压印上纸、一个词标强调色斜体、短划线收束 | typography | M8-shot | `engines/shotcraft/references/shots/typography/paper-title-card.md` |
| `picker-carousel-feature-cycle` | 移动端风竖向选择器——焦点药丸不动、内容穿过它，每项带明显 outQuint 减速吸附后完全静止，按到中心距离分层控制透明度/字号/灰度，落 | interaction | M8-shot | `engines/shotcraft/references/shots/interaction/picker-carousel-feature-cycle.md` |
| `pill-chip-slot-cycle-handled` | 白底句式 "Your `chip` Handled" 里深色胶囊内词竖向滚轮轮换，胶囊宽度按预量文本宽插值平滑伸缩、两侧文字被自然挤开收拢， | typography | M8-shot | `engines/shotcraft/references/shots/typography/pill-chip-slot-cycle-handled.md` |
| `pill-slot-cycle` | 句中词槽轮换——固定句干钉死不动，句尾 pill 徽章每 ~0.7s 老虎机滚一格（旧的上飞加速淡出、新的从下带模糊滑入），连换 N 个功能 | typography | M8-shot | `engines/shotcraft/references/shots/typography/pill-slot-cycle.md` |
| `print-texture-transitions` | 印刷质感转场——ink-bleed-reveal 墨渗揭示（须状渗边洇开吃掉旧景） | transition | M8-shot | `engines/shotcraft/references/shots/transition/print-texture-transitions.md` |
| `product-card-progressive-assemble` | 详情卡像被逐字段抓取般自建——一枚"填充光标"领先跳格，图→标题→分类 pill 依次 pop→原价出现后被划线降级、强调色新价 sprin | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/product-card-progressive-assemble.md` |
| `quad-split-parallel-scenes` | 画面硬切 2×2 四宫格，四个象限并行跑各自的微场景（打字、急推、逐词、交互链），关键节拍错开 3–6 帧制造信息轰炸 | rhythm | M8-shot | `engines/shotcraft/references/shots/rhythm/quad-split-parallel-scenes.md` |
| `radial-ripple-phone-chips` | 暖沙底四层同心圆错相呼吸如水波，中央手机 mockup 屏内 feed 自动缓滚，两侧白色 chip 先后 spring pop 入场并悬浮 | effects | M8-shot | `engines/shotcraft/references/shots/effects/radial-ripple-phone-chips.md` |
| `radial-wave` | 17×9 圆点阵列按到波源的欧氏距离错峰点亮，每点 scale 过冲到 1.5 再落回常亮，第一道波扫完后第二道亮蓝脉冲从外圈反向收拢回中心 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/radial-wave.md` |
| `research-card-stack-scroll` | 深色论文卡每 12 帧一张沿右下轴线飞入中心叠压，落位带 1 帧压缩，只有最上一张全清晰渲染标题+作者+摘要，下方卡按堆积深度递增模糊变暗只 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/research-card-stack-scroll.md` |
| `rhythm-interrupt-moves` | 打断节奏——jump-cut-punch-in 三级跳切推近：同构图三次无补间硬跳放大，逐级逼近目标 | rhythm | M8-shot | `engines/shotcraft/references/shots/rhythm/rhythm-interrupt-moves.md` |
| `riso-print-hits` | 套印错位冲击帧——riso-misregistration-hit 单发：标题撞停瞬间裂成双色 riso 印版，抖两下"啪"地套准 | effects | M8-shot | `engines/shotcraft/references/shots/effects/riso-print-hits.md` |
| `row-embed` | 内容行像卡片一样从空中降下、rotateX 收平、嵌入瞬间底边亮一道强调色的缝 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/row-embed.md` |
| `sakuga-timing-shift` | 一拍三转一拍一——元素先以每 3 帧一步的手翻书顿挫移动，高潮瞬间切成逐帧丝滑冲刺，帧率量化的突变本身就是看点 | rhythm | M8-shot | `engines/shotcraft/references/shots/rhythm/sakuga-timing-shift.md` |
| `scan-bracket-sweep` | 文档弹到中央，四角落下 L 形取景括号，一条扫描光带拖着渐变尾迹在文档上往复扫 5 趟——文档全程静止，只有光在读它 | effects | M8-shot | `engines/shotcraft/references/shots/effects/scan-bracket-sweep.md` |
| `scanline-annotate-focus` | 一条扫描线自上而下匀速掠过已存在的页面，越过哪块区块的下缘，哪块就被四角取景框从外扩处弹簧收拢对准（一次过冲），随后贴出一枚逐字打出的机器标 | effects | M8-shot | `engines/shotcraft/references/shots/effects/scanline-annotate-focus.md` |
| `scanline-assemble-flyin` | 页面开场是一张只有网格与虚线槽位的蓝图画板，一条亮扫描线自上而下掠过；扫到每个槽位，该处组件就从画外飞入过冲贴合，带方向性残影模糊与落位咬合 | effects | M8-shot | `engines/shotcraft/references/shots/effects/scanline-assemble-flyin.md` |
| `scroll-brake-moves` | 长卷急刹两式——changelog-scroll-brake 基本款（高速长卷指数减速精准停位+目标抬升）与 brake-reticle-l | data | M8-shot | `engines/shotcraft/references/shots/data/scroll-brake-moves.md` |
| `segmented-thumb-hero` | 分段控件 thumb 位移当主角特写——超大胶囊 segmented control 弹簧浮入，描边箭头光标画外滑入按下，白 thumb 8 | interaction | M8-shot | `engines/shotcraft/references/shots/interaction/segmented-thumb-hero.md` |
| `shot-transitions` | 镜头交棒三式——推进流白、whip-pan 甩镜（急刹款）、mask-wipe 穿窗（纵深款），按能量落差与接缝语义选型 | transition | M8-shot | `engines/shotcraft/references/shots/transition/shot-transitions.md` |
| `slam-entrance-moves` | 高能砸入三式——kanada-perspective-snap 金田透视急停、score-slam 比分砸落、impact-burst-ki | effects | M8-shot | `engines/shotcraft/references/shots/effects/slam-entrance-moves.md` |
| `space-camera-moves` | 3D 空间化运镜两式——exploded-view 爆炸分解（构件沿 Z 炸开再合体）、drone-dive-landing 无人机俯冲降落 | camera | M8-shot | `engines/shotcraft/references/shots/camera/space-camera-moves.md` |
| `speed-ramp-freeze` | 帧号非线性 remap 的节奏手法——定格标注（流动→定格圈注→解冻） | rhythm | M8-shot | `engines/shotcraft/references/shots/rhythm/speed-ramp-freeze.md` |
| `spotlight-hero-card` | 关灯的剧场里一束钨丝聚光（带体积光柱）扫过页面锁定一张卡，斜侧推进后卡片弹起悬浮、香槟色光束沿轮廓两圈、连同 3D 注记一起贴回原位 | opening | M8-shot | `engines/shotcraft/references/shots/opening/spotlight-hero-card.md` |
| `spotlight-sweep-moves` | 暗场聚光显影三式——A 醒睡扫过（光到即亮光走即暗）、B 贴边泛光横摇（紫光贴 UI 边缘渗入+聚光匀速右移）、C 角落匀速显影（径向聚光从 | effects | M8-shot | `engines/shotcraft/references/shots/effects/spotlight-sweep-moves.md` |
| `steep-tilt-glide` | 固定镜头下直立页面以 60° 强透视侧立（右近左远），页面自身沿其 3D 横面方向滑移掠过镜头（物动镜不动），滑移带速度重影、文字组件悬空贴 | camera | M8-shot | `engines/shotcraft/references/shots/camera/steep-tilt-glide.md` |
| `stroke-segment-build` | 断笔成字——标题拆成十几段互不相连的笔画乱序逐段点亮，前 70% 不可读，末段落位瞬间语义"啪"地成立 | opening | M8-shot | `engines/shotcraft/references/shots/opening/stroke-segment-build.md` |
| `tear-streak-transitions` | 撕裂转场——glitch-displace 噪声撕裂（16 横条错位抖动中硬切），数字故障语义的条带级撕裂 | transition | M8-shot | `engines/shotcraft/references/shots/transition/tear-streak-transitions.md` |
| `tension-camera-moves` | 情绪运镜两式——bullet-time 冻结环绕、pull-back 拉远孤立，相机替观众"感受"而非"看" | camera | M8-shot | `engines/shotcraft/references/shots/camera/tension-camera-moves.md` |
| `terminal-3d` | 三个终端窗散布 3D 空间，相机窗间飞行、途中正弦拉远，每到一窗打字机敲命令、结果逐行滑出——命令执行的空间叙事流 | camera | M8-shot | `engines/shotcraft/references/shots/camera/terminal-3d.md` |
| `text-as-mask` | 文字视频遮罩——瓷白舞台上切出超粗大标题字，字内部透出缓慢平移的暗色实时产品面板，结尾吸一口气后字形指数冲入放大 46 倍溢出、内部画面接管 | opening | M8-shot | `engines/shotcraft/references/shots/opening/text-as-mask.md` |
| `text-column-converge` | 双词对峙合拢——左"NEW"右特性词钉死在等屏边距两侧硬切轮换、全程零收缩，换到最后一词才唯一一次 ease-in-out 滑到居中咬合成短 | typography | M8-shot | `engines/shotcraft/references/shots/typography/text-column-converge.md` |
| `theme-switch-moves` | 主题切换两式——theme-sweep 斜向扫场（边界扫过处就地换肤）与 palette-ripple 组合款（⌘K 面板收缩成点、涟漪从点 | interaction | M8-shot | `engines/shotcraft/references/shots/interaction/theme-switch-moves.md` |
| `timeline-travel` | 时间轴横移——镜头沿水平刻度轴加速掠过版本刻度，每过一格卡片弹立短停，末刻度急停推近 | data | M8-shot | `engines/shotcraft/references/shots/data/timeline-travel.md` |
| `title-demote-to-label` | 大标题降格为节标签两式——A 大标题居中显影站稳一拍后连续缩小 0.3x 平移到左上角落成小节标签、内容区在其下生长；B 同套路但登场时带文 | typography | M8-shot | `engines/shotcraft/references/shots/typography/title-demote-to-label.md` |
| `trailer-grammar-moves` | 预告片语法一式——trailer-bumper 前置速剪钩子：三镜 9f 速剪 + 黑场静默一拍，再开场标题 | rhythm | M8-shot | `engines/shotcraft/references/shots/rhythm/trailer-grammar-moves.md` |
| `transition-hidden-cut` | 藏切点转场三式——前景遮挡隐形切、对撞开屏、暖色漏光，硬切藏进遮挡/撞击/光峰的 1-3 帧里，观众看不见剪刀 | transition | M8-shot | `engines/shotcraft/references/shots/transition/transition-hidden-cut.md` |
| `transition-travel` | 穿越式转场——字腔穿越：巨型章节标题的字形就是一扇窗，镜头钻进字形笔画完成换景 | transition | M8-shot | `engines/shotcraft/references/shots/transition/transition-travel.md` |
| `type-and-filter` | 真实 UI 上打字搜索、网格自己收敛成一张卡、点击穿透进详情页 | interaction | M8-shot | `engines/shotcraft/references/shots/interaction/type-and-filter.md` |
| `type-assembly-moves` | 文字集结三式——split-text-stagger 逐字裂升、letterform-drift-assembly 漂移合拢、text-on | typography | M8-shot | `engines/shotcraft/references/shots/typography/type-assembly-moves.md` |
| `type-entrance-moves` | 标题文字入场一式——letter-drop-physics 字符坠落（重力砸落、弹跳、歪斜站定，最后一拍集体立正归位） | typography | M8-shot | `engines/shotcraft/references/shots/typography/type-entrance-moves.md` |
| `type-rhythm-sync` | 文字随声同步两式——font-weight-pump 字重脉冲（笔画随鼓点变粗弹回）与 karaoke-fill-sync 卡拉OK填色（词 | typography | M8-shot | `engines/shotcraft/references/shots/typography/type-rhythm-sync.md` |
| `typewriter-moves` | 打字机 error-retype——误删重打的"改口"三幕剧：打出平庸词 → 犹豫 → 退格删掉 → 更快打出卖点词 | typography | M8-shot | `engines/shotcraft/references/shots/typography/typewriter-moves.md` |
| `ui-strip-away-outro` | 减法式收尾——点击 Publish 后整个编辑器 UI 从外围到中心层层错峰蒸发，黑场上只剩那颗按钮滑到屏心放大，按钮再淡出交棒字标定版 | outro | M8-shot | `engines/shotcraft/references/shots/outro/ui-strip-away-outro.md` |
| `ui-to-brand-morph` | UI 变品牌两式——icon-flip-bloom 图标 Y 轴翻扁成竖线、从竖线撑开成品牌标志（琥珀斜切随后划入）+ wordmark 逐 | outro | M8-shot | `engines/shotcraft/references/shots/outro/ui-to-brand-morph.md` |
| `value-stagger-gradient` | 16 根柱入场时 delay 是时间错峰，同时高度/色相/位移/模糊四个属性各自铺成从首到末的数值梯度；第二拍把错峰原点换成中心，脉冲幅度以 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/value-stagger-gradient.md` |
| `vertical-word-roll-blur-cycle` | 句尾词换成竖向滚轮，3 次换词各 0.55s（outQuint 七成 + outBack 三成，前快后极慢带微过冲），相邻行按距离上垂直 b | typography | M8-shot | `engines/shotcraft/references/shots/typography/vertical-word-roll-blur-cycle.md` |
| `voice-waveform-live` | 录音胶囊实时声纹——64 根细竖条随"说话"起伏，说话时中部高耸、停顿缩成点线，波形从右往左滚动；说→停→说→提交塌缩的完整表演 | interaction | M8-shot | `engines/shotcraft/references/shots/interaction/voice-waveform-live.md` |
| `wall-reveal-moves` | 整墙批量入场两式——bento 逐格点亮、蓝图描线成形，全部原位显形不位移，与 deck-deal-flyin 的飞入位移型互补成品类矩阵 | ui-entrance | M8-shot | `engines/shotcraft/references/shots/ui-entrance/wall-reveal-moves.md` |
| `white-flash-logo-simplify-cut` | 液态金属质感的彩色词标静置流光，蓄力后从字心炸出一记白闪过曝，曝光回落时同一位置已是扁平版字标——一次闪白完成质感降维 | transition | M8-shot | `engines/shotcraft/references/shots/transition/white-flash-logo-simplify-cut.md` |
| `wipe-transitions` | 几何擦除转场——blinds-slice 百叶窗切条（12 根 3D 叶片错峰翻面成波，波扫过后整页由 A 换成 B） | transition | M8-shot | `engines/shotcraft/references/shots/transition/wipe-transitions.md` |
| `word-relay-filmstrip` | 左列黑白相间等高页面卡步进滚动（焦点卡全亮、邻卡离焦压暗）、右侧衬线大词原位接力（名词恒定+动词轮换）——切词瞬间才滚动一格，词块垂直中心与 | typography | M8-shot | `engines/shotcraft/references/shots/typography/word-relay-filmstrip.md` |
| `word-relay-geometry` | 三个利益词各带一套专属几何接力——虚线大圆减速自转 + 彗星弧飞跑 → 三实线圆 trim 依次生长后收拢咬紧 → 镀铬金属 sheen 扫 | typography | M8-shot | `engines/shotcraft/references/shots/typography/word-relay-geometry.md` |

### 源码组件（claude-motion）（20）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `anatomy-mechanisms` | 精确投影与机械零件 |  | M1-video | `engines/claude-motion/assets/extensions/anatomy-mechanisms/examples` |
| `anidoodle-paper` | Anidoodle 水粉纸艺与折页 |  | M1-video | `engines/claude-motion/assets/extensions/anidoodle-paper/examples` |
| `bee-colony` | 纸面昆虫与植物 |  | M1-video | `` |
| `blockworld` | 体素地形、AO 网格与橡树生成 |  | M1-video | `engines/claude-motion/assets/extensions/blockworld/template` |
| `clearwater` | 实时浅水、FFT 波面与 RGB 焦散 |  | M1-video | `engines/claude-motion/assets/extensions/clearwater/template` |
| `eudoom-motion` | 四墨印刷与仪表图解 |  | M1-video | `engines/claude-motion/assets/extensions/eudoom-motion/template` |
| `functional-emotions` | GPU 笔触情绪叙事 |  | M1-video | `engines/claude-motion/assets/extensions/functional-emotions/template` |
| `lanshu-signal-explainer` | 信号系统讲解 |  | M1-video | `` |
| `launch-graphics` | 原生应用发布动效 |  | M1-video | `engines/claude-motion/assets/extensions/launch-graphics/template` |
| `neighbourhood` | 邻里居民投影造型与关节动作 |  | M1-video | `engines/claude-motion/assets/extensions/neighbourhood/template` |
| `neon-city` | 雨夜城市、程序幕墙与无状态雨 |  | M1-video | `engines/claude-motion/assets/extensions/neon-city/template` |
| `neon-overdrive` | 霓虹 GPU 线场与 HDR 后期 |  | M1-video | `engines/claude-motion/assets/extensions/neon-overdrive/template` |
| `people-gait` | 人物支撑步态与关节曲线 |  | M1-video | `` |
| `pixel-birds` | 像素鸟类形态与帧绘制 |  | M1-video | `` |
| `procedural-animals` | 程序动物雕塑、毛层与四足动作 |  | M1-video | `engines/claude-motion/assets/extensions/procedural-animals/examples` |
| `procedural-buildings` | 参数化建筑与立面材质 |  | M1-video | `` |
| `songbie-crayon` | 蜡笔纸面与空间叙事 |  | M1-video | `engines/claude-motion/assets/extensions/songbie-crayon/examples` |
| `vehicle-motion` | 真实车辆动力与可寻址运动轨迹 |  | M1-video | `engines/claude-motion/assets/extensions/vehicle-motion/template` |
| `watercolor-memory` | 记忆水彩颜料运输 |  | M1-video | `engines/claude-motion/assets/extensions/watercolor-memory/template` |
| `workspace` | 程序生成办公室道具与材质 |  | M1-video | `engines/claude-motion/assets/extensions/workspace/template` |

### 风格条目（跨库）（104）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `art-deco` | art-deco | 图形与排版 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/art-deco.md` |
| `blueprint` | blueprint | 界面与产品 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/blueprint.md` |
| `cel-anime-80s` | cel-anime-80s | 插画与漫画 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/cel-anime-80s.md` |
| `cinematic-title` | cinematic-title | 电影感 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/cinematic-title.md` |
| `claude:anime-cel` | 赛璐珞角色 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:art-deco` | 装饰艺术 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:ascii-crt` | ASCII / CRT 终端 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:backrooms` | 后室 / 新怪谈 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:blueprint` | 蓝图 / 工程制图 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:brick-toy` | 积木玩具 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:cel-anime-80s` | 80 年代赛璐璐动画 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:crayon-book` | 蜡笔儿童绘本 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:dark-keynote` | 暗色科技发布 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:dataviz` | 数据叙事 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:engraving` | 铜版画 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:game-show` | 综艺节奏扁平 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:glass-product` | 玻璃质感产品 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:halftone-dossier` | 复古半调案卷 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:hd-2d` | HD-2D |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:hologram-hud` | 科幻全息界面 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:impasto` | 油画厚涂 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:ink-wash` | 中国水墨 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:iso-infographic` | 等距信息图 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:living-screencast` | 活体实机录屏 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:lowpoly-island` | 低多边形等距 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:microgame` | 微游戏快闪（瓦里奥制造式） |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:midcentury-toon` | 50s 扁平卡通 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:one-line` | 一笔画 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:paper-cutout` | 剪纸定格 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:paper-lantern` | 纸雕灯影 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:paper-popup` | 纸片立体书 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:papercut-red` | 红色窗花剪纸 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:pictogram-motion` | 象形运动图形 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:pixel-art` | 像素角色 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:pixel-rpg` | 16-bit 像素 RPG |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:risograph` | Risograph 丝网印刷 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:rubber-hose` | 1930s 橡皮管卡通 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:scifi-toon` | 科幻情景喜剧卡通 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:shadow-puppet` | 皮影戏 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:silent-film` | 1920s 默片 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:silkscreen-poster` | 丝印旅行海报 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:spy-titles` | 60s 间谍片头 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:stained-glass` | 彩色玻璃窗 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:swiss-motion` | 瑞士动态排版 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:tilt-shift` | 移轴微缩 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:ukiyoe` | 浮世绘 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:urban-sketch` | 钢笔淡彩 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:watercolor` | 水彩笔刷 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:whiteboard` | 白板手绘 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `claude:woodcut` | 木刻版画 |  | M1-video | `engines/claude-motion/references/case-catalog.json` |
| `comic-pop` | comic-pop | 插画与漫画 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/comic-pop.md` |
| `concept-morph` | concept-morph | 图形与排版 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/concept-morph.md` |
| `copperplate-engraving` | copperplate-engraving | 手作 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/copperplate-engraving.md` |
| `crayon-storybook` | crayon-storybook | 手作 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/crayon-storybook.md` |
| `crt-vhs` | crt-vhs | 复古与屏幕 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/crt-vhs.md` |
| `dark-keynote` | dark-keynote | 界面与产品 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/dark-keynote.md` |
| `data-motion` | data-motion | 界面与产品 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/data-motion.md` |
| `editorial-collage` | editorial-collage | 图形与排版 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/editorial-collage.md` |
| `flat-vector` | flat-vector | 插画与漫画 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/flat-vector.md` |
| `generative-geometry` | generative-geometry | 生成与抽象 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/generative-geometry.md` |
| `glass-material` | glass-material | 3D 与材质 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/glass-material.md` |
| `glitch-digital` | glitch-digital | 复古与屏幕 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/glitch-digital.md` |
| `guochao` | guochao | 插画与漫画 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/guochao.md` |
| `hologram-hud` | hologram-hud | 界面与产品 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/hologram-hud.md` |
| `illuminated-manuscript` | illuminated-manuscript | 手作 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/illuminated-manuscript.md` |
| `ink-wash` | ink-wash | 手作 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/ink-wash.md` |
| `isometric-infographic` | isometric-infographic | 界面与产品 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/isometric-infographic.md` |
| `kinetic-brutalist` | kinetic-brutalist | 图形与排版 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/kinetic-brutalist.md` |
| `liquid-shader` | liquid-shader | 3D 与材质 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/liquid-shader.md` |
| `mg:style-01` | 扁平矢量动画 Flat / Vector 2D Motion Graphics | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-02` | 线条动画 Line Art / Line Animation | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-03` | 等轴 2.5D Isometric / 2.5D | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-04` | 3D 渲染系（C4D/Blender 质感）3D Render / CGI Motion Design | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-05` | 逐帧手绘 / 线条沸腾 Cel Animation / Frame-by-Frame & Line Boil | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-06` | 拼贴剪贴 Collage / Cutout Animation | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-07` | 液态流动 Liquid Motion | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-08` | 形变动画 Morphing / Shape Morph | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-09` | 几何构成 / 包豪斯 Geometric / Bauhaus Motion | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-10` | 复古 80s Synthwave / Y2K 氛围 Retro: 80s Synthwave / VHS / Y2K | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-12` | 弥散渐变 / 玻璃拟态 Gradient Blur (Aurora) & Glassmorphism | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-18` | 综艺花字 Variety Show Kinetic Captions (Hanazi) | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-19` | 粗描边贴纸人科普 MG Bold-outline Sticker Explainer MG (PaperClip / 林超风格) | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-20` | 像素风 Pixel Art / 8-bit | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `mg:style-22` | 赛博朋克 HUD / FUI Cyberpunk HUD / FUI (Fictional UI) | MG 签名技法 | M1-video | `engines/mg-motion/references/styles.md` |
| `minimal-ui` | minimal-ui | 界面与产品 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/minimal-ui.md` |
| `mixed-media-era` | mixed-media-era | 电影感 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/mixed-media-era.md` |
| `one-line` | one-line | 图形与排版 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/one-line.md` |
| `painterly` | painterly | 插画与漫画 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/painterly.md` |
| `paper-cut` | paper-cut | 手作 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/paper-cut.md` |
| `particle-field` | particle-field | 生成与抽象 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/particle-field.md` |
| `pixel-diorama` | pixel-diorama | 复古与屏幕 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/pixel-diorama.md` |
| `pixel-game` | pixel-game | 复古与屏幕 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/pixel-game.md` |
| `risograph-print` | risograph-print | 图形与排版 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/risograph-print.md` |
| `rubber-hose` | rubber-hose | 插画与漫画 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/rubber-hose.md` |
| `shadow-puppet` | shadow-puppet | 手作 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/shadow-puppet.md` |
| `soft-3d-toy` | soft-3d-toy | 3D 与材质 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/soft-3d-toy.md` |
| `soft-organic` | soft-organic | 生成与抽象 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/soft-organic.md` |
| `stained-glass` | stained-glass | 3D 与材质 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/stained-glass.md` |
| `swiss-editorial` | swiss-editorial | 图形与排版 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/swiss-editorial.md` |
| `synthwave-neon` | synthwave-neon | 复古与屏幕 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/synthwave-neon.md` |
| `terminal-ascii` | terminal-ascii | 复古与屏幕 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/terminal-ascii.md` |
| `tilt-shift-miniature` | tilt-shift-miniature | 3D 与材质 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/tilt-shift-miniature.md` |
| `ukiyo-e` | ukiyo-e | 手作 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/ukiyo-e.md` |
| `whiteboard-explainer` | whiteboard-explainer | 插画与漫画 | M1-video | `engines/garden-skills/skills/motion-showreel/references/styles/whiteboard-explainer.md` |

### 工具型 skill（garden-skills）（6）

| id | 名称 / 一句话 | 分类 | 形态 | 入口 |
| --- | --- | --- | --- | --- |
| `beautiful-article` | Editorial · Any source → beautiful article | Editorial · Any source → beautiful article | M4-article | `engines/garden-skills/skills/beautiful-article/SKILL.md` |
| `gpt-image-2` | Image Generation / Prompt Engineering | Image Generation / Prompt Engineering | M5-image | `engines/garden-skills/skills/gpt-image-2/SKILL.md` |
| `kb-retriever` | Retrieval / Local Knowledge Base | Retrieval / Local Knowledge Base | M7-retrieval | `engines/garden-skills/skills/kb-retriever/SKILL.md` |
| `motion-showreel` | Motion Graphics / Code Video | Motion Graphics / Code Video | M1-video | `engines/garden-skills/skills/motion-showreel/SKILL.md` |
| `web-design-engineer` | Design / Frontend | Design / Frontend | M3-web-artifact | `engines/garden-skills/skills/web-design-engineer/SKILL.md` |
| `web-video-presentation` | Web Video / Presentation | Web Video / Presentation | M2-web-video | `engines/garden-skills/skills/web-video-presentation/SKILL.md` |
