#!/usr/bin/env python3
"""Regenerate the self-hosted Manrope subsets and src/styles/fonts.css.

Run this after the site's copy gains characters the current subsets do not
cover — a new language, a new symbol in the price list — otherwise those
characters silently render in the fallback stack.

    pip3 install --user fonttools brotli
    python3 frontend/scripts/subset-fonts.py

It re-downloads the upstream files, cuts them to CHARS, and rewrites the
@font-face block with unicode-ranges derived from each result's real cmap.
"""

from __future__ import annotations

import re
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = ROOT / 'public' / 'fonts'
CSS = ROOT / 'src' / 'styles' / 'fonts.css'

GOOGLE_CSS = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&display=swap'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'

# Which upstream subsets to keep, in match priority order. latin-ext is dropped
# on purpose: the only character the site has in that range is ₸, and Manrope
# does not contain it.
SUBSETS = ['latin', 'cyrillic', 'cyrillic-ext']

# A generous superset of what the site can render: printable ASCII, the
# punctuation and symbols the content uses, the full Russian alphabet and the
# Kazakh extensions. Widen this rather than shipping general-purpose subsets.
CHARS = (
    ''.join(chr(c) for c in range(0x20, 0x7F))
    + ' ©«·»–—’‘“”…€№→←↑↓−×÷°±§¶†‡•₸₽'
    + ''.join(chr(c) for c in range(0x410, 0x450))
    + 'ЁёЙй'
    + 'ӘәҒғҚқҢңӨөҰұҮүҺһІіЎў'
)


def fetch_sources() -> dict[str, bytes]:
    """Download the upstream woff2 for each subset we keep."""
    request = urllib.request.Request(GOOGLE_CSS, headers={'User-Agent': UA})
    css = urllib.request.urlopen(request).read().decode()

    urls: dict[str, str] = {}
    current: str | None = None
    for line in css.splitlines():
        comment = re.match(r'/\* (\S+) \*/', line.strip())
        if comment:
            current = comment.group(1)
        url = re.search(r'src: url\((\S+?)\)', line)
        if url and current in SUBSETS:
            urls[current] = url.group(1)

    missing = [name for name in SUBSETS if name not in urls]
    if missing:
        sys.exit(f'upstream stylesheet no longer offers: {", ".join(missing)}')

    return {
        name: urllib.request.urlopen(
            urllib.request.Request(url, headers={'User-Agent': UA})
        ).read()
        for name, url in urls.items()
    }


def subset(name: str, raw: bytes) -> Path:
    source = FONT_DIR / f'.{name}.src.woff2'
    target = FONT_DIR / f'manrope-{name}.woff2'
    source.write_bytes(raw)
    subprocess.run(
        [
            sys.executable, '-m', 'fontTools.subset', str(source),
            f'--text={CHARS}',
            '--flavor=woff2',
            f'--output-file={target}',
            '--layout-features=kern,liga,calt',
            '--no-hinting',
            '--drop-tables+=DSIG',
        ],
        check=True,
        capture_output=True,
    )
    source.unlink()
    print(f'  {name:14} {len(raw):6} -> {target.stat().st_size:6} bytes')
    return target


def ranges(paths: dict[str, Path]) -> dict[str, list[tuple[int, int]]]:
    """Real coverage per file, made disjoint in SUBSETS order."""
    from fontTools.ttLib import TTFont

    seen: set[int] = set()
    out: dict[str, list[tuple[int, int]]] = {}
    for name in SUBSETS:
        own = sorted(set(TTFont(paths[name]).getBestCmap()) - seen)
        seen |= set(TTFont(paths[name]).getBestCmap())
        blocks, start, prev = [], own[0], own[0]
        for cp in own[1:]:
            if cp == prev + 1:
                prev = cp
                continue
            blocks.append((start, prev))
            start = prev = cp
        blocks.append((start, prev))
        out[name] = blocks
    return out


def format_range(blocks: list[tuple[int, int]]) -> str:
    parts = [f'U+{a:04X}' if a == b else f'U+{a:04X}-{b:04X}' for a, b in blocks]
    lines, cur = [], '  unicode-range:'
    for index, part in enumerate(parts):
        piece = f' {part}' + (',' if index < len(parts) - 1 else ';')
        if len(cur) + len(piece) > 96:
            lines.append(cur)
            cur = '   '
        cur += piece
    lines.append(cur)
    return '\n'.join(lines)


def main() -> None:
    print('downloading upstream subsets…')
    sources = fetch_sources()
    print('subsetting…')
    paths = {name: subset(name, raw) for name, raw in sources.items()}

    header = CSS.read_text().split('*/', 1)[0] + '*/\n\n'
    faces = '\n\n'.join(
        f"""@font-face {{
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 200 800;
  font-display: swap;
  src: url('/fonts/manrope-{name}.woff2') format('woff2');
{format_range(blocks)}
}}"""
        for name, blocks in ranges(paths).items()
    )
    CSS.write_text(header + faces + '\n')
    print(f'wrote {CSS.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
