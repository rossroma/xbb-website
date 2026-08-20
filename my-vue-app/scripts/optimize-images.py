#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
静态图片批量优化脚本 —— 依据 docs/IMAGE_OPTIMIZATION_PLAN.md
用法:
  python3 scripts/optimize-images.py --dry-run       # 预演, 不写任何文件
  python3 scripts/optimize-images.py --apply         # 正式执行(备份到 public/images-backup/)
  python3 scripts/optimize-images.py --apply --update-refs   # 执行并同步 src/ 引用(.png/.jpg -> .webp)

依赖: Pillow (隔离环境已安装: /Users/yangkai/.workbuddy/binaries/python/envs/default/bin/python)
"""
from __future__ import annotations

import argparse
import re
import shutil
import sys
import tempfile
from pathlib import Path

from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
IMG_ROOT = PROJECT_ROOT / "public" / "images"
SRC_ROOT = PROJECT_ROOT / "src"
BACKUP_ROOT = PROJECT_ROOT / "public" / "images-backup"
DRY_TMP = Path(tempfile.mkdtemp(prefix="imgopt-dry-"))  # dry-run 输出目录，零污染源目录

# ---------------------------------------------------------------------------
# 删除清单（阶段 A）：均已确认零引用
# ---------------------------------------------------------------------------
DELETE_FILES = [
    "banner2.png",
    "banner3.png",
    "customer/hero-banner.png",   # 与 customer/banner.png MD5 重复
    "customer/banner.png",
    "BI/multi-dimensional-analysis.png",
    "youzhibg1.png",              # 根目录旧副本
    "youzhibg2.png",
    "youzhibg3.png",
]
DELETE_DIRS = ["AI"]              # 与 ai/ 完全重复, 未被引用

# ---------------------------------------------------------------------------
# 定点转换（阶段 B：P0 26 个 + 阶段 C 特殊项）
#   key: 相对 public/images 的路径
#   value: {size: (w, h) 目标画布(居中裁切), fit: 'crop'|'contain',
#           width: 仅按宽度等比缩放(可选), format, quality}
# ---------------------------------------------------------------------------
CONVERT = {
    # ---- P0 大图 ----
    "service/youzhibg3.png": {"width": 680, "format": "webp", "quality": 80},
    "service/youzhibg2.png": {"width": 680, "format": "webp", "quality": 80},
    "service/youzhibg1.png": {"width": 680, "format": "webp", "quality": 80},
    "cust-choise.png": {"width": 600, "format": "webp", "quality": 80},
    "cases/hangye_img-2.jpg": {"width": 400, "format": "jpeg", "quality": 82},
    "liuzi/ability-1.png": {"width": 680, "format": "webp", "quality": 80},
    "cservice.png": {"width": 220, "format": "png", "quality": 80},
    "company/research-strength-07.png": {"width": 320, "format": "png", "quality": 80},
    "cases/hero-banner.png": {"width": 1920, "format": "webp", "quality": 80},
    "cases/hangye_img-3.jpg": {"width": 400, "format": "jpeg", "quality": 82},
    "BI/report.png": {"width": 1360, "format": "png", "quality": None},
    "liuzi/background-image.jpg": {"width": 1920, "format": "jpeg", "quality": 82},
    "company/research-strength-06.png": {"width": 320, "format": "png", "quality": 80},
    "news/hero-banner.png": {"width": 1920, "format": "webp", "quality": 80},
    "qiwei/hero-banner.png": {"width": 1920, "format": "webp", "quality": 80},
    "service-hours.png": {"width": 360, "format": "webp", "quality": 80},
    "consultant.png": {"width": 360, "format": "webp", "quality": 80},
    "sales/pdca-loop.png": {"width": 680, "format": "webp", "quality": 80},
    "banner4.png": {"width": 1920, "format": "webp", "quality": 80},
    "sales/tab-report-4.png": {"width": 680, "format": "webp", "quality": 80},
    "sales/track-trace.png": {"width": 680, "format": "webp", "quality": 80},
    "customer/dedup-report-new.png": {"width": 680, "format": "webp", "quality": 80},
    "paas/opportunity-process.png": {"width": 680, "format": "webp", "quality": 80},
    "2-2.png": {"width": 276, "format": "webp", "quality": 80},
    "sales/tab-report-3.png": {"width": 680, "format": "webp", "quality": 80},
    "customer/dedup-rules-new.png": {"width": 680, "format": "webp", "quality": 80},
    "customer/dedup-collision-new.png": {"width": 680, "format": "webp", "quality": 80},
    # ---- 阶段 C 特殊项 ----
    "liuzi/analysis.png": {"width": 1000, "format": "webp", "quality": 80},
    "new2022/products/banner-large.jpg": {"width": 1400, "format": "jpeg", "quality": 82},
    "youzhikehubg.png": {"width": 1920, "format": "webp", "quality": 80},
    "download/xbbup.png": {"width": 220, "format": "png", "quality": None},
    "liuzi/2-5.png": {"width": 128, "format": "webp", "quality": 90},
    "company/honor.png": {"width": 1920, "format": "webp", "quality": 80},
    "market/market-customer.png": {"width": 1920, "format": "webp", "quality": 80},
    "knowledge/hero-banner.png": {"width": 1920, "format": "webp", "quality": 80},
    "2-1.png": {"width": 276, "format": "webp", "quality": 80},
    "2-3.png": {"width": 276, "format": "webp", "quality": 80},
    "2-4.png": {"width": 276, "format": "webp", "quality": 80},
    # ---- 实测渲染尺寸超配（第二轮：浏览器实测 1440 视口渲染宽 × 2~3）----
    "code-wechatVideo.png": {"width": 320, "format": "png", "quality": None},
    "download/1688.png": {"width": 280, "format": "png", "quality": None},
    "download/dingup.png": {"width": 160, "format": "png", "quality": None},
    "download/flyup.png": {"width": 270, "format": "png", "quality": None},
    "download/wxup.png": {"width": 270, "format": "png", "quality": None},
    "download/dingdown.jpg": {"width": 240, "format": "jpeg", "quality": 82},
    "download/flydown.jpg": {"width": 240, "format": "jpeg", "quality": 82},
    "download/wxdown.jpg": {"width": 240, "format": "jpeg", "quality": 82},
    "download/xbbdown.jpg": {"width": 240, "format": "jpeg", "quality": 82},
    "liuzi/1-1.png": {"width": 1300, "format": "png", "quality": None},
    "liuzi/1-2.png": {"width": 1500, "format": "png", "quality": None},
    "ai/kuayuan.png": {"width": 1200, "format": "png", "quality": None},
    "ai/youxian.png": {"width": 1200, "format": "png", "quality": None},
    "ai/huaxiang.png": {"width": 1200, "format": "png", "quality": None},
    "ai/ai-intro.png": {"width": 1920, "format": "png", "quality": None},
    "feishu/feishu-2@2x.png": {"width": 640, "format": "png", "quality": None},
    "dingtalk/dingtalk04.png": {"width": 1040, "format": "png", "quality": None},
    "qiwei/qiwei-2@2x.png": {"width": 1040, "format": "png", "quality": None},
    "new2022/products/crm@2x.png": {"width": 1040, "format": "png", "quality": None},
    "new2022/products/gongdanguanli@2x.png": {"width": 960, "format": "png", "quality": None},
    "customer/product-intro.png": {"width": 1400, "format": "png", "quality": None},
    "company/research-strength-01.png": {"width": 320, "format": "png", "quality": None},
    "company/research-strength-02.png": {"width": 320, "format": "png", "quality": None},
}

# ---------------------------------------------------------------------------
# 通配规则（阶段 C 同系列治理）
#   glob: 各目录内尺寸为 1360×840 且 >=300KiB 的 PNG 截图 -> 680×420 WebP
#   （300KiB 阈值：仅治理"接近或超过 500KiB"的主要文件，符合审计文档 §3.2
#     "同系列统一治理、含少量低于 500KiB 文件"的范围，避免卷入 70-180KiB 小截图）
# ---------------------------------------------------------------------------
SCREENSHOT_DIRS = ["customer", "sales", "paas", "BI"]
SCREENSHOT_SRC_SIZE = (1360, 840)
SCREENSHOT_DST = (680, 420)
SCREENSHOT_MIN_KB = 300

# 各页 hero-banner.png（1920×500/560）同尺寸重压
HERO_BANNER_PATHS = [
    "dingtalk/hero-banner.png",
    "feishu/hero-banner.png",
    "contact/hero-banner.png",
    "sales/hero-banner.png",
    "market/hero-banner.png",
    "company/hero-banner-soft.png",
    "voices/hero-banner.png",
    "paas/hero-banner.png",
    "liuzi/pc_banner.png",
]

# company/research-strength-*.jpg 重压（实测渲染仅 158x223px，目标 320 宽）
RESEARCH_JPG_GLOB = "company/research-strength-*.jpg"

# logos/ 合作伙伴 logo（495x234 渲染 84-93x40-44px，目标 280 宽）
LOGOS_DIR = "logos"
LOGOS_WIDTH = 280

# company/research-strength-01/02.png 转 JPEG
RESEARCH_PNG_TO_JPG = ["company/research-strength-01.png", "company/research-strength-02.png"]


def has_alpha(img: Image.Image) -> bool:
    """准确判断是否存在真实透明像素（alpha 通道不全为 255）"""
    if img.mode == "RGBA":
        return img.getchannel("A").getextrema() != (255, 255)
    if img.mode == "LA":
        return img.getchannel("A").getextrema() != (255, 255)
    if img.mode == "P" and "transparency" in img.info:
        return True
    return False


def load_image(path: Path) -> Image.Image:
    img = Image.open(path)
    img.load()
    if img.mode in ("P", "LA"):
        img = img.convert("RGBA") if has_alpha(img) else img.convert("RGB")
    elif img.mode != "RGB" and img.mode != "RGBA":
        img = img.convert("RGBA" if has_alpha(img) else "RGB")
    return img


def center_crop_resize(img: Image.Image, dst_w: int, dst_h: int) -> Image.Image:
    """按目标比例居中裁切后缩放（Lanczos）"""
    src_w, src_h = img.size
    target_ratio = dst_w / dst_h
    src_ratio = src_w / src_h
    if src_ratio > target_ratio:
        # 原图更宽 -> 裁左右
        new_w = int(src_h * target_ratio)
        left = (src_w - new_w) // 2
        box = (left, 0, left + new_w, src_h)
    else:
        new_h = int(src_w / target_ratio)
        top = (src_h - new_h) // 2
        box = (0, top, src_w, top + new_h)
    img = img.crop(box)
    if (dst_w, dst_h) != img.size:
        img = img.resize((dst_w, dst_h), Image.LANCZOS)
    return img


def resize_to_width(img: Image.Image, width: int) -> Image.Image:
    ratio = width / img.width
    if ratio >= 1:
        return img
    return img.resize((width, int(img.height * ratio)), Image.LANCZOS)


def exact_size(img: Image.Image, dst_w: int, dst_h: int) -> Image.Image:
    if (img.width, img.height) != (dst_w, dst_h):
        img = img.resize((dst_w, dst_h), Image.LANCZOS)
    return img


def convert_one(src: Path, spec: dict, out_dir: Path | None = None, keep_format: bool = False) -> Path:
    """转换单个文件，返回输出路径。原文件由调用方处理。
    keep_format=True 时保持原文件名/扩展名不变，仅调整尺寸与重压缩；
    否则输出扩展名可能变化（.png/.jpg -> .webp 等）。
    out_dir 提供时（dry-run），输出写入该目录而非源目录，避免污染。"""
    img = load_image(src)
    # 统一等比缩放，绝不做居中裁切（保持原始宽高比，仅降尺寸降体积）
    if "width" in spec:
        img = resize_to_width(img, spec["width"])
    elif "size" in spec:
        img = resize_to_width(img, spec["size"][0])

    fmt = spec["format"]
    quality = spec.get("quality")
    alpha = has_alpha(img)

    if keep_format:
        name = src.name
    else:
        name = src.name
        for old_ext, new_ext in ((".png", ".png"), (".jpg", ".jpg"), (".jpeg", ".jpg")):
            if name.lower().endswith(old_ext):
                name = name[: -len(old_ext)] + {"webp": ".webp", "jpeg": ".jpg", "png": ".png"}[fmt]
                break
        else:
            name = name.rsplit(".", 1)[0] + {"webp": ".webp", "jpeg": ".jpg", "png": ".png"}[fmt]
    out = (out_dir or src.parent) / name

    if fmt == "webp":
        # 有透明通道 -> 无损 WebP；否则有损
        if alpha and quality is not None and quality >= 90:
            img.save(out, "WEBP", lossless=True)
        else:
            img = img.convert("RGB") if alpha and quality and quality < 90 else img
            img.save(out, "WEBP", quality=quality or 80, method=6)
    elif fmt == "jpeg":
        img = img.convert("RGB") if alpha else img
        img.save(out, "JPEG", quality=quality or 82, optimize=True, progressive=True)
    elif fmt == "png":
        # 无透明通道的截图/平色图：自适应量化回调色板(P)模式，体积最优
        # （直接存 RGB 对大图反而比原调色板更大）
        if not alpha and img.mode == "RGB":
            img = img.convert("P", palette=Image.ADAPTIVE, colors=256)
        img.save(out, "PNG", optimize=True)
    return out


def build_plan() -> list[tuple[str, Path, Path | None]]:
    """返回动作列表: (动作类型, 源路径, 输出路径或None)。动作: DELETE / CONVERT"""
    plan: list[tuple[str, Path, Path | None]] = []

    for rel in DELETE_FILES:
        p = IMG_ROOT / rel
        if p.exists():
            plan.append(("DELETE", p, None))
    for d in DELETE_DIRS:
        p = IMG_ROOT / d
        if p.is_dir():
            plan.append(("DELETE_DIR", p, None))

    # 定点转换
    for rel, spec in CONVERT.items():
        src = IMG_ROOT / rel
        if not src.exists():
            print(f"  [WARN] 转换目标不存在: {rel}")
            continue
        if src.suffix[1:].lower() in ("webp",) and "size" not in spec:
            continue
        # 已达标跳过：源宽 <= 目标宽 时不再处理（避免重复覆盖产生无效 diff）
        if "width" in spec:
            try:
                with Image.open(src) as im:
                    if im.width <= spec["width"]:
                        print(f"  [DONE] {rel} 已是 {im.width}px <= 目标 {spec['width']}px, 跳过")
                        continue
            except OSError:
                continue
        plan.append(("CONVERT", src, None))

    # 截图系列通配: 1360×840 且 >=300KiB 的 PNG -> 680×420 WebP
    for d in SCREENSHOT_DIRS:
        for p in sorted((IMG_ROOT / d).glob("*.png")):
            if str(p.relative_to(IMG_ROOT)) in CONVERT:
                continue
            if p.stat().st_size < SCREENSHOT_MIN_KB * 1024:
                continue
            try:
                with Image.open(p) as im:
                    if im.size == SCREENSHOT_SRC_SIZE:
                        plan.append(("CONVERT", p, None))
            except OSError:
                continue

    # hero-banner 重压
    for rel in HERO_BANNER_PATHS:
        p = IMG_ROOT / rel
        if p.exists() and str(p.relative_to(IMG_ROOT)) not in CONVERT:
            plan.append(("CONVERT", p, None))

    # research-strength jpg 重压（已达标——宽度已 <=320——则跳过，避免重复编码变大）
    def _already_narrow(p: Path, max_w: int) -> bool:
        try:
            with Image.open(p) as im:
                return im.width <= max_w
        except OSError:
            return True

    for p in sorted((IMG_ROOT / "company").glob("research-strength-*.jpg")):
        if _already_narrow(p, 320):
            continue
        plan.append(("CONVERT", p, None))
    for rel in RESEARCH_PNG_TO_JPG:
        p = IMG_ROOT / rel
        if p.exists() and not _already_narrow(p, 320):
            plan.append(("CONVERT", p, None))

    # logos 通配: 495x234 合作伙伴 logo -> 280 宽
    for p in sorted((IMG_ROOT / LOGOS_DIR).glob("*.png")):
        if str(p.relative_to(IMG_ROOT)) in CONVERT:
            continue
        plan.append(("CONVERT", p, None))

    # 去重
    seen: set[Path] = set()
    dedup: list[tuple[str, Path, Path | None]] = []
    for item in plan:
        if item[1] in seen:
            continue
        seen.add(item[1])
        dedup.append(item)
    return dedup


def action_spec(p: Path) -> dict:
    """取某路径对应的转换规格（定点优先，其次通配规则）"""
    rel = str(p.relative_to(IMG_ROOT))
    if rel in CONVERT:
        return CONVERT[rel]
    if rel in HERO_BANNER_PATHS:
        return {"width": 1920, "format": "webp", "quality": 80}
    if p.suffix.lower() == ".png" and p.parent.name in SCREENSHOT_DIRS:
        try:
            with Image.open(p) as im:
                if im.size == SCREENSHOT_SRC_SIZE:
                    return {"width": SCREENSHOT_DST[0], "format": "webp", "quality": 80}
        except OSError:
            pass
    if p.name.startswith("research-strength-") and p.suffix.lower() == ".jpg":
        return {"width": 320, "format": "jpeg", "quality": 78}
    if rel in RESEARCH_PNG_TO_JPG:
        return {"width": 320, "format": "jpeg", "quality": 82}
    if p.parent.name == LOGOS_DIR and p.suffix.lower() == ".png":
        return {"width": LOGOS_WIDTH, "format": "png", "quality": None}
    raise RuntimeError(f"无法确定规格: {rel}")


def update_src_refs(converted: dict[str, Path]) -> None:
    """同步 src/ 中的引用: xxx.png/.jpg -> xxx.webp（仅替换本次转换的文件）"""
    mapping = {}
    for old_rel, new_path in converted.items():
        old_name = Path(old_rel).name
        new_name = new_path.name
        if old_name != new_name:
            mapping[old_name] = new_name
    if not mapping:
        return
    pattern = re.compile(r"((?:/images/|images/|'|\"|/)[A-Za-z0-9_./-]*?)(%s)" % "|".join(
        re.escape(k) for k in mapping
    ))

    count = 0
    for f in SRC_ROOT.rglob("*"):
        if f.suffix not in (".vue", ".ts", ".js", ".css", ".scss"):
            continue
        text = f.read_text(encoding="utf-8")
        changed = False
        out_lines = []
        for line in text.splitlines(keepends=True):
            new_line = line
            for old, new in mapping.items():
                # 仅替换完整文件名引用（避免误伤 xxx.png.bak 之类）
                new_line = re.sub(rf"(?<=[\w/\'\"(\[]){re.escape(old)}(?=[\"\')\s,\]]|$)", new, new_line)
            if new_line != line:
                changed = True
                count += 1
            out_lines.append(new_line)
        if changed:
            f.write_text("".join(out_lines), encoding="utf-8")
            print(f"  [REFS] {f.relative_to(PROJECT_ROOT)}")
    print(f"  [REFS] 共更新 {count} 处引用")


def main() -> int:
    parser = argparse.ArgumentParser(description="静态图片批量优化")
    parser.add_argument("--apply", action="store_true", help="真正执行（默认 dry-run）")
    parser.add_argument("--dry-run", action="store_true", help="仅预演（默认行为，可省略）")
    parser.add_argument("--update-refs", action="store_true", help="同步 src/ 中的扩展名引用")
    parser.add_argument("--no-delete", action="store_true", help="跳过阶段A(删除未引用/重复文件)，仅执行 B/C 转换")
    parser.add_argument("--keep-format", action="store_true",
                        help="保持原文件格式与扩展名不变，仅调整尺寸/重压缩（不转 WebP/JPEG，文件名零变化）")
    args = parser.parse_args()

    plan = build_plan()
    if args.no_delete:
        plan = [x for x in plan if x[0] not in ("DELETE", "DELETE_DIR")]
    if not plan:
        print("无可执行动作。")
        return 0

    print(f"=== 动作清单（共 {len(plan)} 项，{'DRY-RUN' if not args.apply else 'APPLY'}）===\n")

    converted: dict[str, Path] = {}
    total_before = 0
    total_after = 0
    deleted = 0

    for kind, src, _ in plan:
        if kind in ("DELETE", "DELETE_DIR"):
            size = sum(p.stat().st_size for p in src.rglob("*")) if src.is_dir() else src.stat().st_size
            total_before += size
            deleted += size
            print(f"  [DEL ] {src.relative_to(IMG_ROOT)}  ({size/1024:.0f} KiB)")
            if args.apply:
                backup_dst = BACKUP_ROOT / src.relative_to(IMG_ROOT)
                backup_dst.parent.mkdir(parents=True, exist_ok=True)
                if src.is_dir():
                    shutil.copytree(src, backup_dst, dirs_exist_ok=True)
                    shutil.rmtree(src)
                else:
                    shutil.copy2(src, backup_dst)
                    src.unlink()
            continue

        # CONVERT
        spec = action_spec(src)
        if args.keep_format:
            # 保持原格式：仅调整尺寸/重压缩，扩展名与文件名不变
            fmt_by_ext = {"png": "png", "jpg": "jpeg", "jpeg": "jpeg", "webp": "webp"}
            fmt = fmt_by_ext.get(src.suffix.lower().lstrip("."), spec["format"])
            spec = {**spec, "format": fmt}
        before = src.stat().st_size
        total_before += before

        # dry-run 输出到临时目录，绝不触碰源目录
        out_dir = None if args.apply else DRY_TMP
        backup_dst = BACKUP_ROOT / src.relative_to(IMG_ROOT)
        if args.apply:
            backup_dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, backup_dst)

        try:
            out = convert_one(src, spec, out_dir, keep_format=args.keep_format)
        except Exception as exc:  # noqa: BLE001
            print(f"  [FAIL] {src.relative_to(IMG_ROOT)}: {exc}")
            continue

        after = out.stat().st_size
        rel = str(src.relative_to(IMG_ROOT))

        # 保小策略: 转换后反而变大（如已高压缩的 JPG）-> 回滚保留原图
        if after > before:
            if out == src:
                # 原地覆盖场景(jpg->jpg, 仅 apply 时): 从备份恢复原文件
                if args.apply:
                    shutil.copy2(backup_dst, src)
            else:
                out.unlink()
            print(f"  [SKIP] {rel}  转换后 {after/1024:.0f} > 原 {before/1024:.0f} KiB, 保留原图")
            continue

        total_after += after
        ratio = f"-{(1 - after / before) * 100:.0f}%"
        print(f"  [CVT ] {rel}  {before/1024:.0f}→{after/1024:.0f} KiB {ratio}  -> {out.name}")
        if args.apply:
            if out != src:
                src.unlink()
            converted[rel] = out

    if args.apply and args.update_refs:
        print("\n=== 同步 src 引用 ===")
        update_src_refs(converted)

    print(f"\n=== 汇总 ===")
    print(f"  转换: {len(converted) if args.apply else len([x for x in plan if x[0]=='CONVERT'])} 个文件, "
          f"备份至: public/images-backup/")
    print(f"  删除: {deleted/1024:.0f} KiB")
    print(f"  体积变化: {total_before/1024:.0f} KiB -> {total_after/1024:.0f} KiB"
          f"（不含删除项节省）" if total_after else f"  体积变化: {total_before/1024:.0f} KiB -> 删除项另行计算")

    if not args.apply:
        print("\n[DRY-RUN] 未写入任何文件。确认后加 --apply 执行；加 --update-refs 同步引用。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
