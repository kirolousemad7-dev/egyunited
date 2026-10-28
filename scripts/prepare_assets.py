"""Crop the supplied logo and download illustrative architecture photographs."""

from __future__ import annotations

import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
LOGO_SRC = Path(
    r"C:\Users\kiro7\.cursor\projects\d\assets\c__Users_kiro7_AppData_Roaming_Cursor_User_workspaceStorage_3cadcab1624ac323b5129aa397d634bc_images_image-52412c16-05fe-4b64-930a-2bd6f17370a2.png"
)
BRAND = ROOT / "public" / "brand"
IMAGES = ROOT / "public" / "images"
APP = ROOT / "src" / "app"

PHOTOS = {
    "hero.jpg": "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&w=2000&q=75",
    "about.jpg": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=75",
    "service-supply.jpg": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=75",
    "service-modern.jpg": "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1400&q=75",
    "service-repair.jpg": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1400&q=75",
    "service-maintain.jpg": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=75",
    "app-residential.jpg": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=75",
    "app-villa.jpg": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=75",
    "app-office.jpg": "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=75",
    "app-mall.jpg": "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1400&q=75",
    "app-hospital.jpg": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1400&q=75",
    "app-industrial.jpg": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1400&q=75",
    "candidate-elevator.jpg": "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=2000&q=75",
    "candidate-lobby.jpg": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=75",
}


def crop_logo() -> Image.Image:
    import numpy as np

    image = Image.open(LOGO_SRC).convert("RGBA")
    arr = np.array(image)
    strength = arr[:, :, :3].max(axis=2)
    alpha = np.where(strength <= 22, 0, np.clip((strength.astype(np.int16) - 22) * (255 / 36), 0, 255)).astype(np.uint8)
    arr[:, :, 3] = np.minimum(arr[:, :, 3], alpha)
    ys, xs = np.where(arr[:, :, 3] > 18)
    pad = 28
    top = max(int(ys.min()) - pad, 0)
    left = max(int(xs.min()) - pad, 0)
    bottom = min(int(ys.max()) + pad + 1, arr.shape[0])
    right = min(int(xs.max()) + pad + 1, arr.shape[1])
    cropped = Image.fromarray(arr[top:bottom, left:right])
    BRAND.mkdir(parents=True, exist_ok=True)
    cropped.save(BRAND / "logo.png", "PNG", optimize=True)
    print(f"logo {cropped.size}")
    return cropped


def make_icon(logo: Image.Image, size: int, path: Path) -> None:
    canvas = Image.new("RGBA", (size, size), (8, 9, 11, 255))
    scale = (size * 0.78) / max(logo.size)
    resized = logo.resize((int(logo.width * scale), int(logo.height * scale)), Image.Resampling.LANCZOS)
    x = (size - resized.width) // 2
    y = (size - resized.height) // 2
    canvas.alpha_composite(resized, (x, y))
    path.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(path, "PNG", optimize=True)


def make_og(logo: Image.Image) -> None:
    canvas = Image.new("RGBA", (1200, 630), (8, 9, 11, 255))
    scale = 760 / logo.width
    resized = logo.resize((760, int(logo.height * scale)), Image.Resampling.LANCZOS)
    x = (1200 - resized.width) // 2
    y = (630 - resized.height) // 2
    canvas.alpha_composite(resized, (x, y))
    canvas.convert("RGB").save(ROOT / "public" / "og.png", "PNG", optimize=True)


def download_photos() -> None:
    IMAGES.mkdir(parents=True, exist_ok=True)
    opener = urllib.request.build_opener()
    opener.addheaders = [("User-Agent", "Mozilla/5.0")]
    urllib.request.install_opener(opener)
    for name, url in PHOTOS.items():
        target = IMAGES / name
        try:
            urllib.request.urlretrieve(url, target)
            with Image.open(target) as photo:
                photo = photo.convert("RGB")
                photo.thumbnail((2000, 2000))
                photo.save(target, "JPEG", quality=74, optimize=True)
            print(f"ok {name} {target.stat().st_size // 1024}KB")
        except Exception as error:  # noqa: BLE001
            print(f"FAIL {name} {error}")


if __name__ == "__main__":
    mark = crop_logo()
    make_icon(mark, 512, APP / "icon.png")
    make_icon(mark, 180, APP / "apple-icon.png")
    make_og(mark)
    download_photos()
