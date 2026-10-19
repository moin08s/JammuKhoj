"""
JammuKhoj - Official High-Definition 1080p Product Demo Video Generator
Renders a polished, studio-grade 60-second product walkthrough video
featuring the live progressive web app and Android platform.
"""

import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Canvas Configuration (1080p Full HD, 30 FPS)
WIDTH = 1920
HEIGHT = 1080
FPS = 30

# Colors (RGB)
C_DARK_GREEN = (11, 61, 51)       # #0B3D33
C_FOREST_DEEP = (7, 36, 30)       # #07241E
C_AMBER = (168, 77, 14)           # #A84D0E
C_GOLD = (217, 130, 16)           # #D98210
C_WHITE = (255, 255, 255)
C_LIGHT_BG = (250, 247, 242)      # #FAF7F2
C_CARD_BG = (255, 255, 255)
C_CARD_BORDER = (228, 220, 210)
C_TEXT_INK = (24, 34, 30)
C_TEXT_MUTED = (95, 110, 103)
C_EMERALD = (16, 122, 60)
C_DEVICE_FRAME = (20, 26, 24)

# Load Fonts from Windows Fonts Directory
FONTS_DIR = os.path.join(os.environ.get('WINDIR', 'C:\\Windows'), 'Fonts')
font_title_large = ImageFont.truetype(os.path.join(FONTS_DIR, 'georgiab.ttf'), 54)
font_title = ImageFont.truetype(os.path.join(FONTS_DIR, 'georgiab.ttf'), 40)
font_heading = ImageFont.truetype(os.path.join(FONTS_DIR, 'georgiab.ttf'), 28)
font_sub = ImageFont.truetype(os.path.join(FONTS_DIR, 'arialbd.ttf'), 20)
font_body = ImageFont.truetype(os.path.join(FONTS_DIR, 'arial.ttf'), 17)
font_body_bold = ImageFont.truetype(os.path.join(FONTS_DIR, 'arialbd.ttf'), 17)
font_caption = ImageFont.truetype(os.path.join(FONTS_DIR, 'arial.ttf'), 14)
font_caption_bold = ImageFont.truetype(os.path.join(FONTS_DIR, 'arialbd.ttf'), 14)
font_metric = ImageFont.truetype(os.path.join(FONTS_DIR, 'georgiab.ttf'), 48)

# Asset Paths
DECK_DIR = os.path.abspath(os.path.join(os.getcwd(), "assets", "deck"))
IMG_LOGO_PATH = os.path.join(DECK_DIR, "app_logo.png")
IMG_HOME_PLANNER_PATH = os.path.join(DECK_DIR, "app_home_planner.png")
IMG_ITINERARY_PATH = os.path.join(DECK_DIR, "app_itinerary_result.png")
IMG_EXPLORE_PATH = os.path.join(DECK_DIR, "app_explore_screen.png")
IMG_DETAIL_PATH = os.path.join(DECK_DIR, "app_attraction_detail.png")
IMG_FOOD_PATH = os.path.join(DECK_DIR, "app_dogri_food.png")
IMG_SETTINGS_PATH = os.path.join(DECK_DIR, "app_offline_settings.png")

# Preload Images
logo_raw = Image.open(IMG_LOGO_PATH).convert("RGBA")
home_screen_raw = Image.open(IMG_HOME_PLANNER_PATH).convert("RGB")
itinerary_screen_raw = Image.open(IMG_ITINERARY_PATH).convert("RGB")
explore_screen_raw = Image.open(IMG_EXPLORE_PATH).convert("RGB")
detail_screen_raw = Image.open(IMG_DETAIL_PATH).convert("RGB")
food_screen_raw = Image.open(IMG_FOOD_PATH).convert("RGB")
settings_screen_raw = Image.open(IMG_SETTINGS_PATH).convert("RGB")


def create_phone_frame(screen_img, scroll_y_pct=0.0):
    """
    Renders an elegant smartphone frame (400x820) containing a cropped/scrolled screen image.
    scroll_y_pct: 0.0 is top of screen, 1.0 is bottom of screen.
    """
    w, h = 400, 830
    frame = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(frame)

    # Outer Bezel
    draw.rounded_rectangle([0, 0, w - 1, h - 1], radius=38, fill=C_DEVICE_FRAME, outline=C_GOLD, width=3)
    
    # Speaker bar & front camera notch
    draw.rounded_rectangle([w // 2 - 50, 14, w // 2 + 50, 20], radius=3, fill=(50, 60, 56))
    draw.ellipse([w // 2 + 65, 12, w // 2 + 75, 22], fill=(40, 50, 46))

    # Inner Screen Dimensions
    pad_x = 12
    pad_y_top = 34
    pad_y_bottom = 26
    screen_w = w - pad_x * 2
    screen_h = h - pad_y_top - pad_y_bottom

    # Calculate crop from source screen image
    src_w, src_h = screen_img.size
    aspect_target = screen_h / screen_w
    crop_h = int(src_w * aspect_target)
    
    if crop_h > src_h:
        # If image is shorter than target aspect ratio, scale directly
        scaled_screen = screen_img.resize((screen_w, screen_h), Image.Resampling.LANCZOS)
    else:
        max_scroll = src_h - crop_h
        y_offset = int(max_scroll * max(0.0, min(1.0, scroll_y_pct)))
        cropped = screen_img.crop((0, y_offset, src_w, y_offset + crop_h))
        scaled_screen = cropped.resize((screen_w, screen_h), Image.Resampling.LANCZOS)

    # Paste screen inside frame
    # Create mask for rounded screen corners
    screen_mask = Image.new("L", (screen_w, screen_h), 0)
    draw_mask = ImageDraw.Draw(screen_mask)
    draw_mask.rounded_rectangle([0, 0, screen_w, screen_h], radius=24, fill=255)

    frame.paste(scaled_screen, (pad_x, pad_y_top), screen_mask)
    return frame


def render_scene_1(progress):
    """
    Scene 1 (0:00 - 0:08): Brand Introduction & Executive Hero Cover
    Features prominent high-res logo emblem, elegant typography, and animated highlight badges.
    """
    img = Image.new("RGB", (WIDTH, HEIGHT), C_DARK_GREEN)
    draw = ImageDraw.Draw(img)

    # Outer decorative frame
    draw.rounded_rectangle([60, 50, WIDTH - 60, HEIGHT - 50], radius=24, fill=C_FOREST_DEEP, outline=C_GOLD, width=2)

    # Subtle background watermark/lines
    draw.line([100, 220, WIDTH - 100, 220], fill=(20, 60, 50), width=1)
    draw.line([100, 860, WIDTH - 100, 860], fill=(20, 60, 50), width=1)

    # Centered Logo (animated scale in)
    logo_size = int(140 + min(progress * 1.5, 1.0) * 10)
    logo_resized = logo_raw.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    logo_x = (WIDTH - logo_size) // 2
    logo_y = 100
    img.paste(logo_resized, (logo_x, logo_y), logo_resized)
    
    # Gold ring around logo
    draw.ellipse([logo_x - 6, logo_y - 6, logo_x + logo_size + 6, logo_y + logo_size + 6], outline=C_GOLD, width=3)

    # Category Pill
    pill_text = "OFFLINE-FIRST CIVIC TRAVEL INNOVATION • JAMMU DIVISION & VAISHNO DEVI"
    draw.text((WIDTH // 2, 290), pill_text, fill=C_GOLD, font=font_sub, anchor="mm")

    # Main Brand Title
    draw.text((WIDTH // 2, 360), "JammuKhoj", fill=C_WHITE, font=font_title_large, anchor="mm")
    draw.text((WIDTH // 2, 425), "जम्मू खोज • \"Your Jammu Journey, Made Simple.\"", fill=C_GOLD, font=font_heading, anchor="mm")

    # Executive Subtitle
    desc_p1 = "A production-ready progressive web app & Android platform engineered for transit layovers"
    desc_p2 = "and Mata Vaishno Devi pilgrims. Delivering deterministic departure safety buffers, transparent"
    desc_p3 = "transport tariffs, step-free senior guidance, and zero-tracking on-device privacy."
    draw.text((WIDTH // 2, 500), desc_p1, fill=(230, 240, 235), font=font_sub, anchor="mm")
    draw.text((WIDTH // 2, 532), desc_p2, fill=(230, 240, 235), font=font_sub, anchor="mm")
    draw.text((WIDTH // 2, 564), desc_p3, fill=(230, 240, 235), font=font_sub, anchor="mm")

    # 4 Executive Highlight Badges (Horizontal Row)
    badges = [
        ("⚡ 1-Tap Buffer Planner", "4h, 8h & 24h layover circuits"),
        ("📶 100% Offline IndexedDB", "Vector maps & full routing offline"),
        ("🚌 Transparent Transit", "Matadors (₹10–25), Autos & Taxis"),
        ("🧓 Senior & Pilgrim Ease", "Step-free, battery cars & 112 SOS"),
    ]

    badge_w = 360
    badge_h = 105
    start_x = (WIDTH - (badge_w * 4 + 30 * 3)) // 2

    for i, (b_title, b_sub) in enumerate(badges):
        bx = start_x + i * (badge_w + 30)
        by = 640
        # Draw card
        draw.rounded_rectangle([bx, by, bx + badge_w, by + badge_h], radius=14, fill=C_DARK_GREEN, outline=C_GOLD, width=1)
        draw.text((bx + badge_w // 2, by + 32), b_title, fill=C_GOLD, font=font_sub, anchor="mm")
        draw.text((bx + badge_w // 2, by + 68), b_sub, fill=C_WHITE, font=font_caption_bold, anchor="mm")

    # Bottom Metadata Bar
    draw.text(
        (WIDTH // 2, 920),
        "🌐 Live Application: https://jammukhoj.in   •   44/44 High-Level Automated Tests Passing (100% Compliance)",
        fill=(180, 205, 195),
        font=font_sub,
        anchor="mm"
    )
    return img


def render_scene_2(progress):
    """
    Scene 2 (0:08 - 0:17): The Transit Panic & 1-Tap Buffer Engine
    Showcases the live home screen with dynamic 1-Tap trip planner and rail buffer locks.
    """
    img = Image.new("RGB", (WIDTH, HEIGHT), C_LIGHT_BG)
    draw = ImageDraw.Draw(img)

    # Top Header
    draw.text((100, 60), "01 • SMART LAYOVER PLANNING", fill=C_AMBER, font=font_caption_bold)
    draw.text((100, 95), "1-Tap Buffer-Safe Trip Planner", fill=C_DARK_GREEN, font=font_title)
    draw.text((100, 150), "Enforces deterministic departure buffers so pilgrims never miss connecting trains or flights.", fill=C_TEXT_MUTED, font=font_sub)

    # Left Column: Feature Highlights
    cards = [
        ("⚡ Deterministic Transit Safety Lock", [
            "Automatically locks a 45-min railway buffer (platform walk, baggage, security).",
            "Enforces a strict 150-min flight departure buffer for IXJ airport travelers.",
            "If layover window is under 1h 45m, safely cuts off outside touring.",
        ]),
        ("⏱️ Express Layover Circuits", [
            "4-Hour Express: Curated quick darshan at Raghunath Mandir & city bazaar.",
            "8-Hour Heritage: Includes Mubarak Mandi Palace, Bahu Fort & Bagh-e-Bahu.",
            "24-Hour Valley: Complete cultural immersion with traditional Dogra Dham.",
        ]),
        ("🎯 Real-Time Customization", [
            "Add, remove or re-order stops based on live traveler preference.",
            "Adjust time buffers and see immediate walking load impact.",
        ])
    ]

    card_y = 210
    for title, bullets in cards:
        draw.rounded_rectangle([100, card_y, 1150, card_y + 180], radius=16, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
        draw.text((130, card_y + 25), title, fill=C_DARK_GREEN, font=font_heading)
        b_y = card_y + 70
        for b in bullets:
            draw.text((140, b_y), "•", fill=C_AMBER, font=font_body_bold)
            draw.text((160, b_y), b, fill=C_TEXT_INK, font=font_body)
            b_y += 30
        card_y += 205

    # Right Column: Phone Mockup with scroll animation
    phone = create_phone_frame(home_screen_raw, scroll_y_pct=min(progress * 0.8, 0.6))
    img.paste(phone, (1320, 130), phone)

    # Phone caption
    draw.text((1520, 980), "LIVE APP: 1-TAP QUICK PLANNER", fill=C_AMBER, font=font_caption_bold, anchor="mm")
    return img


def render_scene_3(progress):
    """
    Scene 3 (0:17 - 0:26): Generated Itinerary & Transparent Transit Fares
    Highlights generated circuits, Matador mini-bus stages, and fare comparison matrices.
    """
    img = Image.new("RGB", (WIDTH, HEIGHT), C_LIGHT_BG)
    draw = ImageDraw.Draw(img)

    # Top Header
    draw.text((100, 60), "02 • ITINERARY EXECUTION & TRANSIT INTEL", fill=C_AMBER, font=font_caption_bold)
    draw.text((100, 95), "Curated Circuits & Transparent Local Fares", fill=C_DARK_GREEN, font=font_title)
    draw.text((100, 150), "Empowers pilgrims with exact public transport stages, ending overcharging and tout harassment.", fill=C_TEXT_MUTED, font=font_sub)

    # Left Column: Highlight Cards
    cards = [
        ("🗺️ Step-by-Step Route Execution", [
            "Clear timeline with exact dwell times, travel times, and arrival windows.",
            "1-Click navigation with turn-by-turn routing directly inside offline maps.",
            "Live buffer countdown timer tracks remaining safe departure margin.",
        ]),
        ("🚌 Matador Mini-Bus Route Directory", [
            "Official documented routes: Route #1 (Station ➔ Jewel ➔ Raghunath Bazaar).",
            "Fixed stage-by-stage tariffs: ₹10, ₹15, ₹20, ₹25 across 12 major corridors.",
            "Stops, landmarks, and departure frequencies clearly indexed.",
        ]),
        ("🛺 Prepaid Taxi & Auto Union Matrices", [
            "Transparent rate cards for prepaid railway and airport booths.",
            "Eliminates the ₹1,200 haggling penalty; fair benchmarks for every route.",
        ])
    ]

    card_y = 210
    for title, bullets in cards:
        draw.rounded_rectangle([100, card_y, 1150, card_y + 180], radius=16, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
        draw.text((130, card_y + 25), title, fill=C_DARK_GREEN, font=font_heading)
        b_y = card_y + 70
        for b in bullets:
            draw.text((140, b_y), "•", fill=C_AMBER, font=font_body_bold)
            draw.text((160, b_y), b, fill=C_TEXT_INK, font=font_body)
            b_y += 30
        card_y += 205

    # Right Column: Phone Mockup (Itinerary Result)
    phone = create_phone_frame(itinerary_screen_raw, scroll_y_pct=min(progress * 0.9, 0.7))
    img.paste(phone, (1320, 130), phone)

    draw.text((1520, 980), "LIVE APP: GENERATED CIRCUIT RESULT", fill=C_AMBER, font=font_caption_bold, anchor="mm")
    return img


def render_scene_4(progress):
    """
    Scene 4 (0:26 - 0:35): 36+ Curated Places & Senior Accessibility
    Demonstrates rich attraction details, walking load tags, and historical provenance.
    """
    img = Image.new("RGB", (WIDTH, HEIGHT), C_LIGHT_BG)
    draw = ImageDraw.Draw(img)

    # Top Header
    draw.text((100, 60), "03 • CULTURAL HERITAGE & ACCESSIBILITY", fill=C_AMBER, font=font_caption_bold)
    draw.text((100, 95), "36+ Verified Destinations & Elder Care", fill=C_DARK_GREEN, font=font_title)
    draw.text((100, 150), "Deep historical context combined with elder-friendly walking difficulty tags.", fill=C_TEXT_MUTED, font=font_sub)

    cards = [
        ("🏛️ Rich Heritage Profiles (Bahu Fort & Beyond)", [
            "Detailed operational timings, entry fees, photography rules, and history.",
            "3,000-year-old Bahu Fort, Mubarak Mandi Palace, Amar Mahal, Kol Kandoli.",
            "Verified by local historians with curated photo archives.",
        ]),
        ("🧓 Elder-Friendly Walking Load Tags", [
            "Low, Medium, and High Walking Load indicators on every attraction card.",
            "Stair counts, elevator availability, and wheelchair accessibility badges.",
            "Senior Mode toggle activates large text and high-contrast WCAG 2.1 AA UI.",
        ]),
        ("🛕 Daily Aarti Schedules & Crowd Gauges", [
            "Morning & Evening aarti timings across 6 major regional shrines.",
            "Dynamic crowd meters help avoid peak festival congestion.",
        ])
    ]

    card_y = 210
    for title, bullets in cards:
        draw.rounded_rectangle([100, card_y, 1150, card_y + 180], radius=16, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
        draw.text((130, card_y + 25), title, fill=C_DARK_GREEN, font=font_heading)
        b_y = card_y + 70
        for b in bullets:
            draw.text((140, b_y), "•", fill=C_AMBER, font=font_body_bold)
            draw.text((160, b_y), b, fill=C_TEXT_INK, font=font_body)
            b_y += 30
        card_y += 205

    # Right Column: Phone Mockup (Attraction Detail)
    phone = create_phone_frame(detail_screen_raw, scroll_y_pct=min(progress * 0.9, 0.65))
    img.paste(phone, (1320, 130), phone)

    draw.text((1520, 980), "LIVE APP: ATTRACTION DETAILS & TIMINGS", fill=C_AMBER, font=font_caption_bold, anchor="mm")
    return img


def render_scene_5(progress):
    """
    Scene 5 (0:35 - 0:44): Dogri Food Trail & GI Certified Crafts
    Showcases local culinary delights with Pure Veg/Jain filters and authentic artisan protection.
    """
    img = Image.new("RGB", (WIDTH, HEIGHT), C_LIGHT_BG)
    draw = ImageDraw.Draw(img)

    # Top Header
    draw.text((100, 60), "04 • INDIGENOUS CUISINE & GI CRAFTS", fill=C_AMBER, font=font_caption_bold)
    draw.text((100, 95), "Dogri Culinary Trail & Verified GI Heritage", fill=C_DARK_GREEN, font=font_title)
    draw.text((100, 150), "Connecting travelers with authentic local delicacies and certified artisan cooperatives.", fill=C_TEXT_MUTED, font=font_sub)

    cards = [
        ("🍲 Authentic Dogri Gastronomy Trail", [
            "Famous Kaladi Kulcha (fermented indigenous cheese) with verified vendor spots.",
            "Traditional Dogra Dham celebratory feasts, Ambal, and Sund Panjeeri.",
            "Strict Pure Vegetarian and Jain-Friendly filters for pilgrim peace of mind.",
        ]),
        ("🛍️ GI-Tagged Artisan Empowerment", [
            "Direct directory of verified Basohli Paintings & Tweed cooperatives.",
            "Authentic Pashmina weavers and Bhaderwah Rajmash agricultural hubs.",
            "Fair benchmark prices prevent roadside highway fake exploitation.",
        ]),
        ("🔍 'How to Spot Fakes' Educational Guide", [
            "Clear diagnostic checklist helping pilgrims identify genuine handlooms.",
            "Protects traditional craft families and keeps revenue within the state.",
        ])
    ]

    card_y = 210
    for title, bullets in cards:
        draw.rounded_rectangle([100, card_y, 1150, card_y + 180], radius=16, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
        draw.text((130, card_y + 25), title, fill=C_DARK_GREEN, font=font_heading)
        b_y = card_y + 70
        for b in bullets:
            draw.text((140, b_y), "•", fill=C_AMBER, font=font_body_bold)
            draw.text((160, b_y), b, fill=C_TEXT_INK, font=font_body)
            b_y += 30
        card_y += 205

    # Right Column: Phone Mockup (Dogri Food Screen)
    phone = create_phone_frame(food_screen_raw, scroll_y_pct=min(progress * 0.9, 0.7))
    img.paste(phone, (1320, 130), phone)

    draw.text((1520, 980), "LIVE APP: DOGRI FOOD & DIETARY SAFES", fill=C_AMBER, font=font_caption_bold, anchor="mm")
    return img


def render_scene_6(progress):
    """
    Scene 6 (0:44 - 0:52): 100% Offline Autonomy & ERSS 112 Safety
    Emphasizes mountain tunnel resilience, zero data roaming, and 1-tap SOS dispatcher.
    """
    img = Image.new("RGB", (WIDTH, HEIGHT), C_LIGHT_BG)
    draw = ImageDraw.Draw(img)

    # Top Header
    draw.text((100, 60), "05 • OFFLINE RESILIENCE & YATRA SAFETY", fill=C_AMBER, font=font_caption_bold)
    draw.text((100, 95), "100% Offline IndexedDB & 112 Emergency SOS", fill=C_DARK_GREEN, font=font_title)
    draw.text((100, 150), "Engineered to operate flawlessly in mountain valley blackouts with zero cloud reliance.", fill=C_TEXT_MUTED, font=font_sub)

    cards = [
        ("📶 True Offline-First Architecture", [
            "All 36+ attractions, road coordinates, and timetables stored in IndexedDB.",
            "Interactive vector maps render with zero cellular SIM or data connection.",
            "Tested and verified in Shivalik foothill tunnels and remote yatra tracks.",
        ]),
        ("🛡️ National ERSS 112 & Shrine Helplines", [
            "1-Tap offline dialers for Police 112, Women Helpline 181, Ambulance 108.",
            "Direct SMVDSB Katra Shrine Board Central Control Room hotline.",
            "1-Tap WhatsApp GPS SOS transmits exact lat/long coordinates to family.",
        ]),
        ("🔒 Zero-Surveillance Privacy & Data Safety", [
            "Zero tracking cookies, zero location monetization, zero third-party telemetry.",
            "1-Tap permanent data purge button directly in Offline Settings.",
        ])
    ]

    card_y = 210
    for title, bullets in cards:
        draw.rounded_rectangle([100, card_y, 1150, card_y + 180], radius=16, fill=C_CARD_BG, outline=C_CARD_BORDER, width=1)
        draw.text((130, card_y + 25), title, fill=C_DARK_GREEN, font=font_heading)
        b_y = card_y + 70
        for b in bullets:
            draw.text((140, b_y), "•", fill=C_AMBER, font=font_body_bold)
            draw.text((160, b_y), b, fill=C_TEXT_INK, font=font_body)
            b_y += 30
        card_y += 205

    # Right Column: Phone Mockup (Offline Settings Screen)
    phone = create_phone_frame(settings_screen_raw, scroll_y_pct=min(progress * 0.9, 0.6))
    img.paste(phone, (1320, 130), phone)

    draw.text((1520, 980), "LIVE APP: OFFLINE HUB & DATA CONTROLS", fill=C_AMBER, font=font_caption_bold, anchor="mm")
    return img


def render_scene_7(progress):
    """
    Scene 7 (0:52 - 1:00): Measurable Impact & Closing Call to Action
    High-impact executive closing with key numbers, pilot proposals, and live URL.
    """
    img = Image.new("RGB", (WIDTH, HEIGHT), C_DARK_GREEN)
    draw = ImageDraw.Draw(img)

    # Frame
    draw.rounded_rectangle([60, 50, WIDTH - 60, HEIGHT - 50], radius=24, fill=C_FOREST_DEEP, outline=C_GOLD, width=2)

    # Category Pill
    draw.text((WIDTH // 2, 100), "CLOSING PITCH • MEASURABLE OUTCOMES & PILOT ASKS", fill=C_GOLD, font=font_sub, anchor="mm")

    # Title
    draw.text((WIDTH // 2, 160), "Transforming Jammu From a Transit Rush", fill=C_WHITE, font=font_title_large, anchor="mm")
    draw.text((WIDTH // 2, 220), "Into an Enriching, Safe Cultural Gateway", fill=C_GOLD, font=font_heading, anchor="mm")

    # 4 Key Metrics Tiles
    metrics = [
        ("3.5x", "Dwell Multiplier", "From <2h to 6-8h safe circuits"),
        ("₹150 Cr+", "Economic Unlock", "Direct spend into local food & crafts"),
        ("₹1,200", "Avg Family Savings", "Preventing exploitative cab gouging"),
        ("0", "Missed Departures", "100% adherence to safety buffers"),
    ]

    metric_w = 380
    metric_h = 170
    start_x = (WIDTH - (metric_w * 4 + 30 * 3)) // 2

    for i, (val, label, sub) in enumerate(metrics):
        mx = start_x + i * (metric_w + 30)
        my = 290
        draw.rounded_rectangle([mx, my, mx + metric_w, my + metric_h], radius=16, fill=C_DARK_GREEN, outline=C_GOLD, width=1)
        draw.text((mx + metric_w // 2, my + 45), val, fill=C_GOLD, font=font_metric, anchor="mm")
        draw.text((mx + metric_w // 2, my + 105), label, fill=C_WHITE, font=font_sub, anchor="mm")
        draw.text((mx + metric_w // 2, my + 140), sub, fill=(200, 220, 215), font=font_caption, anchor="mm")

    # 3 Pilot Asks Banner
    asks_y = 510
    draw.rounded_rectangle([150, asks_y, WIDTH - 150, asks_y + 240], radius=18, fill=C_DARK_GREEN, outline=C_CARD_BORDER, width=1)
    
    draw.text((WIDTH // 2, asks_y + 35), "THREE PILOT INITIATIVES READY FOR COLLABORATION", fill=C_GOLD, font=font_sub, anchor="mm")

    asks = [
        ("1. Railway QR Kiosks", "QR panels at Jammu Tawi & Katra concourses for 1-tap offline passenger guide access."),
        ("2. J&K Tourism Data Link", "Official co-branding with TRC Jammu to keep fare tables and festival circulars verified."),
        ("3. Shrine Board Sync", "Direct tie-in with SMVDSB Katra for live battery-car queues and emergency aid."),
    ]

    ask_col_w = (WIDTH - 300 - 80) // 3
    for i, (atitle, adesc) in enumerate(asks):
        ax = 190 + i * (ask_col_w + 40)
        draw.text((ax, asks_y + 85), atitle, fill=C_WHITE, font=font_heading)
        # Word wrap description
        words = adesc.split()
        line1 = " ".join(words[:6])
        line2 = " ".join(words[6:12])
        line3 = " ".join(words[12:])
        draw.text((ax, asks_y + 130), line1, fill=(220, 235, 230), font=font_body)
        draw.text((ax, asks_y + 160), line2, fill=(220, 235, 230), font=font_body)
        if line3:
            draw.text((ax, asks_y + 190), line3, fill=(220, 235, 230), font=font_body)

    # Bottom Contact Bar
    draw.text(
        (WIDTH // 2, 830),
        "🌐 Experience Live Application: https://jammukhoj.in   •   ✉️ Contact: support@jammukhoj.in",
        fill=C_GOLD,
        font=font_heading,
        anchor="mm"
    )
    draw.text(
        (WIDTH // 2, 880),
        "Open Source • 100% Offline Progressive Web App & Android Ready • Built with Pride for Jammu Division",
        fill=(190, 215, 205),
        font=font_sub,
        anchor="mm"
    )
    return img


def main():
    output_dir = os.path.abspath(os.path.join(os.getcwd(), "public", "demo_video"))
    os.makedirs(output_dir, exist_ok=True)
    video_path = os.path.join(output_dir, "jammukhoj_demo_walkthrough.mp4")

    print(f"Initializing VideoWriter for 1080p @ 30 FPS at: {video_path}")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(video_path, fourcc, float(FPS), (WIDTH, HEIGHT))

    # Scene Timeline (Total 60 seconds = 1800 frames)
    # Scene 1: 0 - 8s (240 frames)
    # Scene 2: 8 - 17s (270 frames)
    # Scene 3: 17 - 26s (270 frames)
    # Scene 4: 26 - 35s (270 frames)
    # Scene 5: 35 - 44s (270 frames)
    # Scene 6: 44 - 52s (240 frames)
    # Scene 7: 52 - 60s (240 frames)
    scenes = [
        (render_scene_1, 240, "Scene 1: Brand Introduction & Executive Hero Cover"),
        (render_scene_2, 270, "Scene 2: Transit Panic & 1-Tap Buffer Engine"),
        (render_scene_3, 270, "Scene 3: Curated Circuits & Transparent Transit Intel"),
        (render_scene_4, 270, "Scene 4: 36+ Destinations & Senior Accessibility"),
        (render_scene_5, 270, "Scene 5: Dogri Food Trail & GI Certified Crafts"),
        (render_scene_6, 240, "Scene 6: 100% Offline Resilience & ERSS 112 Safety"),
        (render_scene_7, 240, "Scene 7: Measurable Economic Impact & Closing Call"),
    ]

    total_frames = sum(count for _, count, _ in scenes)
    current_frame = 0

    print(f"Rendering {total_frames} frames across 7 scenes...")

    for renderer, frame_count, scene_desc in scenes:
        print(f"Rendering {scene_desc} ({frame_count} frames)...")
        for f in range(frame_count):
            progress = f / float(frame_count)
            pil_img = renderer(progress)
            
            # Convert PIL RGB to OpenCV BGR
            cv_frame = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
            out.write(cv_frame)
            current_frame += 1

    out.release()
    print("SUCCESS: Finished rendering demo video!")
    print(f"Output File: {video_path}")
    
    # Check size
    if os.path.exists(video_path):
        size_mb = os.path.getsize(video_path) / (1024 * 1024)
        print(f"File Size: {size_mb:.2f} MB")


if __name__ == "__main__":
    main()
