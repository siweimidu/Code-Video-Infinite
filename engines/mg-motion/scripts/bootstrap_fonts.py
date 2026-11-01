#!/usr/bin/env python3
"""bootstrap_fonts.py — fetch the 51 font files the 15 films reference.

The mg-styles-15 repo ships ZERO font files (each has its own licence, so upstream
deliberately omits them). The failure is not cosmetic: a missing file makes

    await document.fonts.load(...)   ->  Promise rejects

so the demo never reaches `window.__ready = true`, and harness/render.mjs burns its
full 300 s timeout before failing. This script installs OFL / Apache-2.0 licensed
look-alikes at the exact paths assets/fonts/fonts.css points at, then --check tells
you whether anything is still missing.

    python scripts/bootstrap_fonts.py            # download what is missing
    python scripts/bootstrap_fonts.py --check    # verify only, non-zero exit if gaps
"""
from __future__ import annotations

import argparse
import os
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

def resolve_root() -> str:
    """Find the mg-styles-15 clone.

    This script lives inside the skill directory, not inside the clone, so look for a
    marker (assets/fonts/fonts.css) starting at --root, then the CWD, then a few
    directories above the script. MG_ROOT env var wins if set.
    """
    env = os.environ.get("MG_ROOT")
    if env and os.path.exists(os.path.join(env, "assets", "fonts", "fonts.css")):
        return os.path.abspath(env)
    cands = []
    if os.environ.get("MG_ROOT"):
        cands.append(os.path.abspath(os.environ["MG_ROOT"]))
    cands.append(os.getcwd())
    here = os.path.dirname(os.path.abspath(__file__))
    cands += [here, os.path.dirname(here), os.path.dirname(os.path.dirname(here))]
    cands += [os.path.join(here, "mg"), os.path.join(os.getcwd(), "mg")]
    for c in cands:
        if os.path.exists(os.path.join(c, "assets", "fonts", "fonts.css")):
            return os.path.abspath(c)
    return cands[1] if cands else os.getcwd()


ROOT = resolve_root()
FONTS_CSS = os.path.join(ROOT, "assets", "fonts", "fonts.css")

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"}

# family-lower -> list of (subpath under assets/fonts, filename, source spec).
# "gf" = Google Fonts raw TTF via the google/fonts GitHub mirror (OFL / Apache-2.0).
# "npm" = fontsource CDN (OFL / Apache-2.0).
SOURCES: dict[str, list[tuple[str, str, str]]] = {
    "poppins": [("latin/poppins", "Poppins-Black.ttf", "gf:ofl/poppins/Poppins-Black.ttf"),
                ("latin/poppins", "Poppins-SemiBold.ttf", "gf:ofl/poppins/Poppins-SemiBold.ttf")],
    "anton": [("latin/anton", "Anton-Regular.ttf", "gf:ofl/anton/Anton-Regular.ttf")],
    "archivo": [("latin/archivo", "Archivo-Italic-VF.ttf", "gf:ofl/archivo/Archivo-Italic%5Bwdth,wght%5D.ttf")],
    "bebasneue": [("latin/bebasneue", "BebasNeue-Regular.ttf", "gf:ofl/bebasneue/BebasNeue-Regular.ttf")],
    "caveat": [("latin/caveat", "Caveat-VF.ttf", "gf:ofl/caveat/Caveat%5Bwght%5D.ttf")],
    "chakrapetch": [("latin/chakrapetch", "ChakraPetch-SemiBold.ttf", "gf:ofl/chakrapetch/ChakraPetch-SemiBold.ttf")],
    "cormorantgaramond": [("latin/cormorantgaramond", "CormorantGaramond-VF.ttf",
                            "gf:ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf")],
    "dmsans": [("latin/dmsans", "DMSans-VF.ttf", "gf:ofl/dmsans/DMSans%5Bopsz,wght%5D.ttf")],
    "fredoka": [("latin/fredoka", "Fredoka-VF.ttf", "gf:ofl/fredoka/Fredoka%5Bwdth,wght%5D.ttf")],
    "ibmplexmono": [("latin/ibmplexmono", "IBMPlexMono-Medium.ttf", "gf:ofl/ibmplexmono/IBMPlexMono-Medium.ttf"),
                    ("latin/ibmplexmono", "IBMPlexMono-SemiBold.ttf", "gf:ofl/ibmplexmono/IBMPlexMono-SemiBold.ttf")],
    "instrumentserif": [("latin/instrumentserif", "InstrumentSerif-Regular.ttf", "gf:ofl/instrumentserif/InstrumentSerif-Regular.ttf"),
                        ("latin/instrumentserif", "InstrumentSerif-Italic.ttf", "gf:ofl/instrumentserif/InstrumentSerif-Italic.ttf")],
    "inter": [("latin/inter", "Inter-VF.ttf", "gf:ofl/inter/Inter%5Bopsz,wght%5D.ttf")],
    "jetbrainsmono": [("latin/jetbrainsmono", "JetBrainsMono-VF.ttf", "gf:ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf")],
    "luckiestguy": [("latin/luckiestguy", "LuckiestGuy-Regular.ttf", "ap:apache/luckiestguy/LuckiestGuy-Regular.ttf")],
    "michroma": [("latin/michroma", "Michroma-Regular.ttf", "gf:ofl/michroma/Michroma-Regular.ttf")],
    "pressstart2p": [("latin/pressstart2p", "PressStart2P-Regular.ttf", "gf:ofl/pressstart2p/PressStart2P-Regular.ttf")],
    "rajdhani": [("latin/rajdhani", "Rajdhani-Bold.ttf", "gf:ofl/rajdhani/Rajdhani-Bold.ttf"),
                 ("latin/rajdhani", "Rajdhani-SemiBold.ttf", "gf:ofl/rajdhani/Rajdhani-SemiBold.ttf")],
    "sora": [("latin/sora", "Sora-VF.ttf", "gf:ofl/sora/Sora%5Bwght%5D.ttf")],
    "unbounded": [("latin/unbounded", "Unbounded-VF.ttf", "gf:ofl/unbounded/Unbounded%5Bwght%5D.ttf")],
    "vt323": [("latin/vt323", "VT323-Regular.ttf", "gf:ofl/vt323/VT323-Regular.ttf")],
    # CJK: the big ones. Alibaba PuHuiTi / Alimama / Douyin Sans are NOT OFL, so we
    # install OFL stand-ins at the same paths. CJK fonts are 8-25 MB each.
    "notosanssc": [("cjk/notosanssc", "NotoSansSC-VF.ttf", "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf")],
    "notoserifsc": [("cjk/notoserifsc", "NotoSerifSC-VF.ttf", "gf:ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf")],
    "zcoolkuaile": [("cjk/zcoolkuaile", "ZCOOLKuaiLe-Regular.ttf", "gf:ofl/zcoolkuaile/ZCOOLKuaiLe-Regular.ttf")],
    "lxgwmarkergothic": [("cjk/lxgwmarkergothic", "LXGWMarkerGothic-Regular.ttf",
                          "gf:ofl/lxgwmarkergothic/LXGWMarkerGothic-Regular.ttf")],
    "longcang": [("cjk/longcang", "LongCang-Regular.ttf", "gf:ofl/longcang/LongCang-Regular.ttf")],
    # HarmonyOS Sans SC, Resource Han Rounded and Fusion Pixel are not mirrored in
    # google/fonts. HarmonyOS/RH Rounded get Noto Sans SC as a CJK stand-in; Fusion
    # Pixel gets ZCOOL KuaiLe. Both stand in at the exact paths fonts.css declares,
    # so the page's fonts.load() resolves and __ready flips. Glyph shapes differ from
    # the real faces -- tell the human this in the output.
    "harmonyossanssc": [("cjk/harmonyossanssc", "HarmonyOS_Sans_SC_Regular.ttf",
                         "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"),
                        ("cjk/harmonyossanssc", "HarmonyOS_Sans_SC_Light.ttf",
                         "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"),
                        ("cjk/harmonyossanssc", "HarmonyOS_Sans_SC_Medium.ttf",
                         "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"),
                        ("cjk/harmonyossanssc", "HarmonyOS_Sans_SC_Bold.ttf",
                         "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"),
                        ("cjk/harmonyossanssc", "HarmonyOS_Sans_SC_Black.ttf",
                         "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf")],
    "resourcehanrounded": [("cjk/resourcehanrounded", "ResourceHanRoundedCN-Bold.ttf",
                            "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"),
                           ("cjk/resourcehanrounded", "ResourceHanRoundedCN-Heavy.ttf",
                            "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf")],
    "fusionpixel": [("cjk/fusionpixel", "fusion-pixel-12px-proportional-zh_hans.ttf",
                     "gf:ofl/zcoolkuaile/ZCOOLKuaiLe-Regular.ttf")],
    "alibabapuhuiti3": [("cjk/alibabapuhuiti3", "AlibabaPuHuiTi-3-105-Heavy.ttf",
                         "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"),
                        ("cjk/alibabapuhuiti3", "AlibabaPuHuiTi-3-115-Black.ttf",
                         "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"),
                        ("cjk/alibabapuhuiti3", "AlibabaPuHuiTi-3-55-Regular.ttf",
                         "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"),
                        ("cjk/alibabapuhuiti3", "AlibabaPuHuiTi-3-65-Medium.ttf",
                         "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"),
                        ("cjk/alibabapuhuiti3", "AlibabaPuHuiTi-3-85-Bold.ttf",
                         "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf")],
    "alimamashuheiti": [("cjk/alimamashuheiti", "AlimamaShuHeiTi-Bold.ttf",
                         "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf")],
    "douyinsans": [("cjk/douyinsans", "DouyinSansBold.ttf", "gf:ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf")],
}

GF_BASE = "https://raw.githubusercontent.com/google/fonts/main/"
NPM_BASE = "https://cdn.jsdelivr.net/npm/"

# Files we knowingly serve a stand-in for (non-OFL face, no OFL mirror in google/fonts).
# The page loads and renders, but the glyph shapes are not the real face.
STANDINS = {
    "AlibabaPuHuiTi": "Noto Sans SC",
    "Alimama ShuHeiTi": "Noto Sans SC",
    "Douyin Sans": "Noto Sans SC",
    "HarmonyOS Sans SC": "Noto Sans SC",
    "Resource Han Rounded": "Noto Sans SC",
    "Fusion Pixel 12": "ZCOOL KuaiLe",
}

# Per-demo static weights the films reference from their own directory.
DEMO_FONTS = [
    ("demos/03-isometric/assets/fonts", "Unbounded-800-static.ttf", "gf:ofl/unbounded/Unbounded%5Bwght%5D.ttf"),
    ("demos/07-liquid/assets", "Fraunces-Liquid-72-900-Soft.ttf", "gf:ofl/fraunces/Fraunces%5BSOFT,WONK,opsz,wght%5D.ttf"),
    ("demos/08-morph/assets/fonts", "Outfit-SemiBold.ttf", "gf:ofl/outfit/Outfit%5Bwght%5D.ttf"),
    ("demos/10-synthwave/assets/fonts", "MrDafoe-Regular.ttf", "gf:ofl/mrdafoe/MrDafoe-Regular.ttf"),
]


def fetch(url: str, timeout: int = 90) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def wanted_from_css() -> list[tuple[str, str]]:
    """Every url() in fonts.css as (relpath under assets/fonts, family)."""
    if not os.path.exists(FONTS_CSS):
        sys.exit(f"  ! {FONTS_CSS} not found — run this from inside the mg-styles-15 clone")
    css = open(FONTS_CSS, encoding="utf-8").read()
    out = []
    for m in re.finditer(r"font-family:\s*'([^']+)'[\s\S]*?url\('([^']+)'\)", css):
        out.append((m.group(2).lstrip("/").replace("assets/fonts/", "", 1), m.group(1)))
    return out


def resolve(rel: str, spec: str) -> str:
    if spec.startswith("gf:"):
        return GF_BASE + spec[3:]
    if spec.startswith("ap:"):
        return GF_BASE + spec[3:]
    return NPM_BASE + spec[4:]


def install(paths: list[tuple[str, str]], workers: int = 6) -> int:
    """paths: (abs destination, source spec). Returns count of files written.

    Several fonts.css entries deliberately share one source (the non-OFL CJK faces
    all stand in as Noto Sans SC), so fetch each unique URL once and fan it out.
    """
    todo = [(p, s) for p, s in paths if not os.path.exists(p)]
    if not todo:
        return 0

    by_url: dict[str, str] = {}
    for _dest, spec in todo:
        by_url.setdefault(resolve("", spec), spec)
    print(f"  downloading {len(by_url)} unique font file(s) -> {len(todo)} destination(s)...")

    cache: dict[str, bytes | None] = {}

    def fetch_cached(url: str):
        if url not in cache:
            try:
                data = fetch(url)
                if len(data) < 2000:
                    raise ValueError(f"suspiciously small ({len(data)} B)")
                cache[url] = data
            except Exception as e:  # noqa: BLE001
                print(f"    FAIL {url.rsplit('/', 1)[-1]:<58} {type(e).__name__}: {e}")
                cache[url] = None
        return cache[url]

    def job(item):
        dest, spec = item
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        data = fetch_cached(resolve("", spec))
        if data is None:
            return dest, False, "download failed"
        with open(dest, "wb") as f:
            f.write(data)
        return dest, True, ""

    ok = 0
    with ThreadPoolExecutor(max_workers=workers) as ex:
        for dest, good, err in ex.map(job, todo):
            if good:
                size = os.path.getsize(dest) / 1e6
                print(f"    ok   {os.path.relpath(dest, ROOT):<62} {size:6.1f} MB")
                ok += 1
    return ok


def check() -> tuple[int, int]:
    """Returns (present, missing)."""
    present = missing = 0
    seen_standins: set[str] = set()
    for rel, family in wanted_from_css():
        p = os.path.join(ROOT, "assets", "fonts", rel)
        if os.path.exists(p) and os.path.getsize(p) > 2000:
            present += 1
            if family in STANDINS:
                seen_standins.add(family)
        else:
            missing += 1
            print(f"    MISSING {rel}  ({family})")
    if seen_standins:
        print("\n  NOTE: these render with a stand-in face, not the original one:")
        for fam in sorted(seen_standins):
            print(f"    {fam}  ->  {STANDINS[fam]}")
        print("    Fine for layout, motion and QC. For a pixel-exact match to the")
        print("    upstream films, buy/download the real faces into the same paths.")
    return present, missing


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true", help="verify only; non-zero exit on gaps")
    ap.add_argument("--root", default=None, help="path to the mg-styles-15 clone")
    ap.add_argument("--workers", type=int, default=6)
    args = ap.parse_args()

    root = os.path.abspath(args.root) if args.root else resolve_root()
    global ROOT, FONTS_CSS
    ROOT = root
    FONTS_CSS = os.path.join(ROOT, "assets", "fonts", "fonts.css")
    if not os.path.exists(FONTS_CSS):
        sys.exit(f"  ! {FONTS_CSS} not found.\n"
                 f"    Point --root (or $env:MG_ROOT) at your mg-styles-15 clone.")
    print(f"\n  mg-styles-15 font bootstrap   root={ROOT}\n")
    if args.check:
        present, missing = check()
        print(f"\n  {present} present, {missing} missing")
        if missing:
            print("  -> without these, renderAt pages never set __ready and the harness\n"
                  "     waits out its full 300 s timeout before failing.")
        return 1 if missing else 0

    # Build the download list straight from what fonts.css actually asks for.
    plan: list[tuple[str, str]] = []
    for rel, _family in wanted_from_css():
        folder = rel.split("/")[1] if rel.count("/") > 1 else rel.split("/")[0]
        for sub, fname, spec in SOURCES.get(folder, []):
            if fname.lower() == os.path.basename(rel).lower():
                plan.append((os.path.join(ROOT, "assets", "fonts", rel), spec))
                break

    plan += [(os.path.join(ROOT, d, f), s) for d, f, s in DEMO_FONTS]

    unresolvable = [os.path.relpath(p, ROOT) for p, s in plan if not any(
        os.path.basename(p).lower() == fname.lower() for _s, fname, _sp in
        sum([[(a, b, c)] for _k, v in SOURCES.items() for (a, b, c) in v], []) +
        [(a, b, c) for a, b, c in DEMO_FONTS])]
    if unresolvable:
        print(f"  no source mapped for {len(unresolvable)} file(s): {unresolvable[:3]}...")
        print("  falling back to Noto Sans SC for them.\n")

    install(plan, args.workers)
    print()
    present, missing = check()
    print(f"\n  {present} present, {missing} missing")
    if missing:
        print("  -> run again for stragglers, or add the paths in assets/fonts/README.md")
        return 1
    print("  -> fonts ready; the harness will now reach __ready instead of timing out")
    return 0


if __name__ == "__main__":
    sys.exit(main())
