import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def render_master_logo(size=1024, is_foreground_only=False):
    scale = size / 512.0
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    if not is_foreground_only:
        # 1. Background Emerald Teal Gradient
        y, x = np.mgrid[0:size, 0:size]
        diag = (x * 0.7 + y * 1.0) / (1.7 * size)
        # Deep royal emerald: top-left #0F4C3F (15, 76, 63) to bottom-right #06231C (6, 35, 28)
        r = (18.0 * (1.0 - diag) + 5.0 * diag)
        g = (78.0 * (1.0 - diag) + 32.0 * diag)
        b = (65.0 * (1.0 - diag) + 26.0 * diag)

        # Subtle radial golden/teal glow centered behind temple spire (256, 210)
        cx, cy = 256.0 * scale, 210.0 * scale
        dist = np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / (250.0 * scale)
        glow = np.clip(1.0 - dist, 0.0, 1.0) ** 2.0
        r += glow * 25.0
        g += glow * 45.0
        b += glow * 35.0

        r = np.clip(r, 0, 255).astype(np.uint8)
        g = np.clip(g, 0, 255).astype(np.uint8)
        b = np.clip(b, 0, 255).astype(np.uint8)
        a = np.full((size, size), 255, dtype=np.uint8)

        bg_arr = np.dstack((r, g, b, a))
        bg_img = Image.fromarray(bg_arr, "RGBA")

        # Squircle Mask
        mask = Image.new("L", (size, size), 0)
        draw_mask = ImageDraw.Draw(mask)
        rad = int(120 * scale)
        draw_mask.rounded_rectangle([0, 0, size, size], radius=rad, fill=255)
        img.paste(bg_img, (0, 0), mask=mask)

        # Inner border luxury bevel
        draw_b = ImageDraw.Draw(img)
        draw_b.rounded_rectangle(
            [int(4*scale), int(4*scale), size - int(4*scale), size - int(4*scale)],
            radius=rad - int(4*scale),
            outline=(245, 158, 11, 45),
            width=max(1, int(2.5*scale))
        )

    draw = ImageDraw.Draw(img)
    ccx, ccy = 256.0 * scale, 235.0 * scale

    # 2. Golden Celestial Compass Halo (Clipped to stay within upper region above river)
    r_outer = 175.0 * scale
    r_inner = 164.0 * scale

    # Draw compass arcs only from -140 deg to -40 deg and 220 to 320 deg (upper ring)
    for deg in range(0, 360, 5):
        # Skip ticks that would fall in the river / text area below y = 330
        rad_angle = math.radians(deg)
        ty = ccy + r_outer * math.sin(rad_angle)
        if ty > 330 * scale:
            continue
        x1 = ccx + (r_inner) * math.cos(rad_angle)
        y1 = ccy + (r_inner) * math.sin(rad_angle)
        x2 = ccx + (r_outer) * math.cos(rad_angle)
        y2 = ccy + (r_outer) * math.sin(rad_angle)
        alpha = 150 if deg % 30 == 0 else 60
        draw.line([(x1, y1), (x2, y2)], fill=(245, 158, 11, alpha), width=max(1, int(1.5*scale)))

    # Concentric fine halo arc in upper half
    draw.arc(
        [ccx - r_inner, ccy - r_inner, ccx + r_inner, ccy + r_inner],
        start=180, end=360,
        fill=(251, 191, 36, 75),
        width=max(1, int(1.2*scale))
    )

    # Upper Cardinal Tick (North)
    draw.line([(ccx, ccy - r_outer - 15*scale), (ccx, ccy - r_outer + 3*scale)], fill=(253, 224, 71, 230), width=max(1, int(3*scale)))
    # East / West Ticks
    draw.line([(ccx - r_outer - 12*scale, ccy), (ccx - r_outer + 2*scale, ccy)], fill=(253, 224, 71, 200), width=max(1, int(2.5*scale)))
    draw.line([(ccx + r_outer - 2*scale, ccy), (ccx + r_outer + 12*scale, ccy)], fill=(253, 224, 71, 200), width=max(1, int(2.5*scale)))

    # 3. Himalayan Mountain Ridges (Trikuta / Pir Panjal in majestic teal tiers)
    # Tier 1 (Distant snow-dusted peak)
    peak_1 = [
        (60 * scale, 340 * scale),
        (165 * scale, 210 * scale),
        (256 * scale, 290 * scale),
        (350 * scale, 180 * scale),
        (452 * scale, 340 * scale)
    ]
    draw.polygon(peak_1, fill=(22, 90, 76, 240))

    # Tier 2 (Closer forested foothills)
    peak_2 = [
        (90 * scale, 340 * scale),
        (190 * scale, 240 * scale),
        (256 * scale, 305 * scale),
        (380 * scale, 215 * scale),
        (452 * scale, 295 * scale),
        (452 * scale, 340 * scale)
    ]
    draw.polygon(peak_2, fill=(32, 115, 96, 210))

    # 4. Dogra Bahu Fort Ramparts (Porcelain Ivory with subtle warm stone tone)
    # Fort spans across width behind the temple
    fort_points = [
        (85 * scale, 340 * scale),
        (85 * scale, 275 * scale),
        (108 * scale, 275 * scale), (108 * scale, 290 * scale), (128 * scale, 290 * scale), (128 * scale, 275 * scale),
        (148 * scale, 275 * scale), (148 * scale, 290 * scale), (168 * scale, 290 * scale), (168 * scale, 275 * scale),
        (188 * scale, 275 * scale), (188 * scale, 290 * scale), (208 * scale, 290 * scale), (208 * scale, 275 * scale),
        (228 * scale, 275 * scale), (228 * scale, 290 * scale), (242 * scale, 290 * scale), (242 * scale, 275 * scale),
        # Gap for temple sanctum
        (270 * scale, 275 * scale), (270 * scale, 290 * scale), (284 * scale, 290 * scale), (284 * scale, 275 * scale),
        (304 * scale, 275 * scale), (304 * scale, 290 * scale), (324 * scale, 290 * scale), (324 * scale, 275 * scale),
        (344 * scale, 275 * scale), (344 * scale, 290 * scale), (364 * scale, 290 * scale), (364 * scale, 275 * scale),
        (384 * scale, 275 * scale), (384 * scale, 290 * scale), (404 * scale, 290 * scale), (404 * scale, 275 * scale),
        (427 * scale, 275 * scale),
        (427 * scale, 340 * scale)
    ]
    draw.polygon(fort_points, fill=(248, 250, 249, 250))
    # Fort horizontal coping line
    draw.line([(85 * scale, 290 * scale), (427 * scale, 290 * scale)], fill=(226, 232, 240, 180), width=max(1, int(1.5*scale)))

    # Wall battlements embrasures / arrow slits
    for embrasure_x in [98, 138, 178, 218, 294, 334, 374, 414]:
        draw.rounded_rectangle(
            [(embrasure_x - 1.5) * scale, 298 * scale, (embrasure_x + 1.5) * scale, 318 * scale],
            radius=int(1.5*scale),
            fill=(10, 54, 44, 210)
        )

    # 5. Sacred Golden Temple Shikhara Spire (Raghunath Temple & Vaishno Devi)
    # Elegant curved shikhara profile
    shikhara_pts = []
    # Left flank
    for step in range(35):
        t = step / 34.0
        sx = 210 * (1 - t)**2 + 236 * 2 * (1 - t) * t + 256 * t**2
        sy = 340 * (1 - t)**2 + 220 * 2 * (1 - t) * t + 122 * t**2
        shikhara_pts.append((sx * scale, sy * scale))
    # Right flank
    for step in range(35):
        t = step / 34.0
        sx = 256 * (1 - t)**2 + 276 * 2 * (1 - t) * t + 302 * t**2
        sy = 122 * (1 - t)**2 + 220 * 2 * (1 - t) * t + 340 * t**2
        shikhara_pts.append((sx * scale, sy * scale))

    # Render spire with rich warm gold gradient
    spire_min_y = int(120 * scale)
    spire_max_y = int(342 * scale)
    spire_h = spire_max_y - spire_min_y
    if spire_h > 0:
        sp_mask = Image.new("L", (size, size), 0)
        sp_draw = ImageDraw.Draw(sp_mask)
        sp_draw.polygon(shikhara_pts, fill=255)

        sy_grid, sx_grid = np.mgrid[0:size, 0:size]
        t_spire = np.clip((sy_grid - spire_min_y) / float(spire_h), 0.0, 1.0)
        # Gold gradient: Top #FDE047 (253, 224, 71) -> Mid #F59E0B (245, 158, 11) -> Base #D97706 (217, 119, 6)
        sr = 253.0 * (1.0 - t_spire) + 217.0 * t_spire
        sg = 224.0 * (1.0 - t_spire) + 119.0 * t_spire
        sb = 71.0 * (1.0 - t_spire) + 6.0 * t_spire

        sp_arr = np.dstack((sr.astype(np.uint8), sg.astype(np.uint8), sb.astype(np.uint8), np.array(sp_mask)))
        img.paste(Image.fromarray(sp_arr, "RGBA"), (0, 0), mask=sp_mask)

    # Shikhara tiers (Amalaka golden ridges)
    for tier_y, half_w, curv in [(285, 36, 7), (245, 27, 6), (205, 19, 5), (170, 12, 4), (142, 6, 2.5)]:
        pts = []
        for step in range(21):
            s = (step / 20.0) * 2 - 1
            tx = (256 + s * half_w) * scale
            ty = (tier_y - (1 - s**2) * curv) * scale
            pts.append((tx, ty))
        draw.line(pts, fill=(255, 251, 235, 220), width=max(1, int(2.5 * scale)))

    # Dogra Temple Sanctum Arch & Inner Garbhagriha
    sanctum_arch = [
        (240 * scale, 340 * scale),
        (240 * scale, 288 * scale),
        (245 * scale, 278 * scale),
        (256 * scale, 274 * scale),
        (267 * scale, 278 * scale),
        (272 * scale, 288 * scale),
        (272 * scale, 340 * scale)
    ]
    draw.polygon(sanctum_arch, fill=(8, 42, 34, 255))
    draw.line(sanctum_arch, fill=(253, 224, 71, 230), width=max(1, int(1.8 * scale)))

    # Eternal Flame / Golden Jyoti
    draw.ellipse([(256 - 4.5)*scale, (285 - 4.5)*scale, (256 + 4.5)*scale, (285 + 4.5)*scale], fill=(245, 158, 11, 255))
    draw.ellipse([(256 - 2.5)*scale, (285 - 2.5)*scale, (256 + 2.5)*scale, (285 + 2.5)*scale], fill=(255, 255, 255, 255))

    # 6. Flowing Suryaputri River Tawi (Deep Ribbon Waves)
    # We create smooth layered waves that curve naturally from left to right
    # Back Wave: Golden Sunset Reflection (Glinting Tawi waters)
    gold_wave_pts = []
    for x_val in range(60, 455, 3):
        t_w = (x_val - 60) / 395.0
        # Gentle natural meandering wave
        y_w = 370 - math.sin(t_w * math.pi * 2.0) * 24 + math.cos(t_w * math.pi * 1.5) * 8
        gold_wave_pts.append((x_val * scale, y_w * scale))
    for x_val in range(452, 58, -3):
        t_w = (x_val - 60) / 395.0
        y_w = 412 - math.sin(t_w * math.pi * 2.0) * 24 + math.cos(t_w * math.pi * 1.5) * 8
        gold_wave_pts.append((x_val * scale, y_w * scale))
    draw.polygon(gold_wave_pts, fill=(245, 158, 11, 245))

    # Front Wave: Glacier Azure Cyan (Crystalline mountain water)
    cyan_wave_pts = []
    cyan_crest_pts = []
    for x_val in range(60, 455, 3):
        t_w = (x_val - 60) / 395.0
        y_w = 345 - math.sin(t_w * math.pi * 2.0) * 26 + math.cos(t_w * math.pi * 1.5) * 10
        cyan_wave_pts.append((x_val * scale, y_w * scale))
        cyan_crest_pts.append((x_val * scale, y_w * scale))
    for x_val in range(452, 58, -3):
        t_w = (x_val - 60) / 395.0
        y_w = 382 - math.sin(t_w * math.pi * 2.0) * 26 + math.cos(t_w * math.pi * 1.5) * 10
        cyan_wave_pts.append((x_val * scale, y_w * scale))
    draw.polygon(cyan_wave_pts, fill=(56, 189, 248, 255))

    # Cyan Wave Glint / Foam Crest
    draw.line(cyan_crest_pts, fill=(255, 255, 255, 230), width=max(1, int(2.5 * scale)))

    # Secondary Ripple Highlight in river
    ripple_pts = []
    for x_val in range(120, 390, 4):
        t_w = (x_val - 60) / 395.0
        y_w = 360 - math.sin(t_w * math.pi * 2.0) * 26 + math.cos(t_w * math.pi * 1.5) * 10
        ripple_pts.append((x_val * scale, y_w * scale))
    draw.line(ripple_pts, fill=(186, 230, 253, 190), width=max(1, int(1.5 * scale)))

    # 7. Apex Sacred Kalash & 8-Pointed Khoj Star (✧)
    # Golden Kalash (Amrit Kumbh)
    draw.ellipse([(256 - 9)*scale, (119 - 4.5)*scale, (256 + 9)*scale, (119 + 4.5)*scale], fill=(253, 224, 71, 255))
    draw.ellipse([(256 - 6.5)*scale, (112 - 6.5)*scale, (256 + 6.5)*scale, (112 + 6.5)*scale], fill=(253, 224, 71, 255))
    draw.ellipse([(256 - 3.5)*scale, (104 - 3.5)*scale, (256 + 3.5)*scale, (104 + 3.5)*scale], fill=(255, 255, 255, 255))

    # The 8-Point Khoj Star
    star_cx, star_cy = 256.0 * scale, 88.0 * scale
    # Star Aura Glow
    draw.ellipse([star_cx - 20*scale, star_cy - 20*scale, star_cx + 20*scale, star_cy + 20*scale], fill=(245, 158, 11, 70))

    # Main Cardinal Points (N, S, E, W)
    cardinal_pts = [
        (star_cx, star_cy - 30 * scale),
        (star_cx + 6 * scale, star_cy - 7 * scale),
        (star_cx + 30 * scale, star_cy),
        (star_cx + 6 * scale, star_cy + 7 * scale),
        (star_cx, star_cy + 30 * scale),
        (star_cx - 6 * scale, star_cy + 7 * scale),
        (star_cx - 30 * scale, star_cy),
        (star_cx - 6 * scale, star_cy - 7 * scale)
    ]
    draw.polygon(cardinal_pts, fill=(255, 255, 255, 255))

    # Inner Gold Core
    inner_gold = [
        (star_cx, star_cy - 19 * scale),
        (star_cx + 4 * scale, star_cy - 4.5 * scale),
        (star_cx + 19 * scale, star_cy),
        (star_cx + 4 * scale, star_cy + 4.5 * scale),
        (star_cx, star_cy + 19 * scale),
        (star_cx - 4 * scale, star_cy + 4.5 * scale),
        (star_cx - 19 * scale, star_cy),
        (star_cx - 4 * scale, star_cy - 4.5 * scale)
    ]
    draw.polygon(inner_gold, fill=(253, 224, 71, 255))

    # Diagonal Sub-Spikes (NE, NW, SE, SW)
    diag_len = 15.0 * scale
    for deg in [45, 135, 225, 315]:
        rad_a = math.radians(deg)
        d_pt = (star_cx + diag_len * math.cos(rad_a), star_cy + diag_len * math.sin(rad_a))
        p1 = (star_cx + 4 * scale * math.cos(rad_a + 0.5), star_cy + 4 * scale * math.sin(rad_a + 0.5))
        p2 = (star_cx + 4 * scale * math.cos(rad_a - 0.5), star_cy + 4 * scale * math.sin(rad_a - 0.5))
        draw.polygon([d_pt, p1, (star_cx, star_cy), p2], fill=(245, 158, 11, 235))

    # Central Sparkle Diamond
    draw.ellipse([star_cx - 3.5*scale, star_cy - 3.5*scale, star_cx + 3.5*scale, star_cy + 3.5*scale], fill=(255, 255, 255, 255))

    # 8. Brand Typography: "JAMMUKHOJ" & "CITY OF TEMPLES"
    if not is_foreground_only and size >= 192:
        try:
            font_title = ImageFont.truetype("arialbd.ttf", int(34 * scale))
            font_sub = ImageFont.truetype("arialbd.ttf", int(11 * scale))
        except Exception:
            font_title = font_sub = ImageFont.load_default()

        # "JAMMUKHOJ"
        title_text = "JAMMUKHOJ"
        char_bboxes = [draw.textbbox((0, 0), ch, font=font_title) for ch in title_text]
        char_widths = [bb[2] - bb[0] for bb in char_bboxes]
        spacing = 5.5 * scale
        total_w = sum(char_widths) + spacing * (len(title_text) - 1)
        curr_x = (size - total_w) / 2.0
        y_pos = 448.0 * scale

        for i, ch in enumerate(title_text):
            draw.text((curr_x, y_pos), ch, font=font_title, fill=(248, 250, 249, 255))
            curr_x += char_widths[i] + spacing

        # "CITY OF TEMPLES"
        sub_text = "CITY OF TEMPLES"
        sub_bboxes = [draw.textbbox((0, 0), ch, font=font_sub) for ch in sub_text]
        sub_widths = [bb[2] - bb[0] for bb in sub_bboxes]
        sub_spacing = 3.5 * scale
        sub_total_w = sum(sub_widths) + sub_spacing * (len(sub_text) - 1)
        sub_curr_x = (size - sub_total_w) / 2.0
        sub_y_pos = 482.0 * scale

        for i, ch in enumerate(sub_text):
            draw.text((sub_curr_x, sub_y_pos), ch, font=font_sub, fill=(245, 158, 11, 235))
            sub_curr_x += sub_widths[i] + sub_spacing

    return img

def main():
    print("1. Rendering master 1024x1024 logo...")
    master = render_master_logo(1024, is_foreground_only=False)

    print("2. Saving PWA icon sets...")
    os.makedirs('public/icons', exist_ok=True)
    master.resize((512, 512), Image.Resampling.LANCZOS).save('public/icons/icon-512.png', 'PNG')
    master.resize((192, 192), Image.Resampling.LANCZOS).save('public/icons/icon-192.png', 'PNG')
    master.resize((32, 32), Image.Resampling.LANCZOS).save('public/icons/favicon-32.png', 'PNG')
    fav_img = master.resize((64, 64), Image.Resampling.LANCZOS)
    fav_img.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

    print("3. Generating Android launcher mipmaps...")
    fg_master = render_master_logo(1024, is_foreground_only=True)
    densities = [
        ('mipmap-mdpi', 48),
        ('mipmap-hdpi', 72),
        ('mipmap-xhdpi', 96),
        ('mipmap-xxhdpi', 144),
        ('mipmap-xxxhdpi', 192),
    ]

    res_dir = 'android/app/src/main/res'
    for folder, size in densities:
        folder_path = os.path.join(res_dir, folder)
        os.makedirs(folder_path, exist_ok=True)

        # Standard squircle launcher
        launcher = master.resize((size, size), Image.Resampling.LANCZOS)
        launcher.save(os.path.join(folder_path, 'ic_launcher.png'), 'PNG')

        # Circular mask
        mask = Image.new('L', (size, size), 0)
        md = ImageDraw.Draw(mask)
        md.ellipse([0, 0, size - 1, size - 1], fill=255)
        round_launcher = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        round_launcher.paste(launcher, (0, 0), mask=mask)
        round_launcher.save(os.path.join(folder_path, 'ic_launcher_round.png'), 'PNG')

        # Adaptive icon foreground (centered within safe zone)
        fg_scaled_size = int(size * 0.72)
        fg_scaled = fg_master.resize((fg_scaled_size, fg_scaled_size), Image.Resampling.LANCZOS)
        fg_canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        offset = (size - fg_scaled_size) // 2
        fg_canvas.paste(fg_scaled, (offset, offset), mask=fg_scaled)
        fg_canvas.save(os.path.join(folder_path, 'ic_launcher_foreground.png'), 'PNG')

        print(f"  [OK] {folder}: {size}x{size}")

    # Copy preview for user artifact inspection
    preview_path = 'C:/Users/Moin/.gemini/antigravity/brain/fd177c49-237a-4536-990c-582ff79a3d26/jammukhoj_logo_preview.png'
    master.resize((512, 512), Image.Resampling.LANCZOS).save(preview_path, 'PNG')
    print("[SUCCESS] Master logo generated!")

if __name__ == '__main__':
    main()
