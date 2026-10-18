import os
import pymupdf as fitz
from PIL import Image
import io

# 1. Full Master SVG (Square / Squircle App Icon)
MASTER_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E483D"/>
      <stop offset="50%" stop-color="#0A362C"/>
      <stop offset="100%" stop-color="#05221B"/>
    </linearGradient>

    <!-- Radial Glow Behind Emblem -->
    <radialGradient id="centerGlow" cx="50%" cy="46%" r="48%">
      <stop offset="0%" stop-color="#1B7864" stop-opacity="0.6"/>
      <stop offset="60%" stop-color="#0E483D" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#05221B" stop-opacity="0"/>
    </radialGradient>

    <!-- Gold Shikhara & Sun Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="30%" stop-color="#F59E0B"/>
      <stop offset="80%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>

    <!-- Mountain Ridge Gradient -->
    <linearGradient id="mountainGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1C6656"/>
      <stop offset="100%" stop-color="#0E3D33"/>
    </linearGradient>
    <linearGradient id="mountainGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#26826E"/>
      <stop offset="100%" stop-color="#124A3D"/>
    </linearGradient>

    <!-- Tawi River Glacier Gradient -->
    <linearGradient id="riverAzure" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#7DD3FC"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>

    <!-- Golden Reflection Wave -->
    <linearGradient id="riverGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>

    <!-- Subtle Inner Border Highlight -->
    <linearGradient id="borderHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35"/>
      <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.3"/>
    </linearGradient>
  </defs>

  <!-- Base Squircle -->
  <rect x="0" y="0" width="512" height="512" rx="124" fill="url(#bgGrad)"/>
  <rect x="0" y="0" width="512" height="512" rx="124" fill="url(#centerGlow)"/>
  <rect x="4" y="4" width="504" height="504" rx="120" fill="none" stroke="url(#borderHighlight)" stroke-width="3"/>

  <!-- Compass Dial / Outer Halo Ring -->
  <circle cx="256" cy="245" r="185" fill="none" stroke="#F59E0B" stroke-width="2" stroke-opacity="0.28" stroke-dasharray="3 7"/>
  <circle cx="256" cy="245" r="172" fill="none" stroke="#FBBF24" stroke-width="1.5" stroke-opacity="0.2"/>

  <!-- Compass Cardinal Direction Ticks -->
  <line x1="256" y1="52" x2="256" y2="68" stroke="#FDE047" stroke-width="3" stroke-linecap="round"/>
  <line x1="256" y1="422" x2="256" y2="438" stroke="#FDE047" stroke-width="3" stroke-linecap="round"/>
  <line x1="63" y1="245" x2="79" y2="245" stroke="#FDE047" stroke-width="3" stroke-linecap="round"/>
  <line x1="433" y1="245" x2="449" y2="245" stroke="#FDE047" stroke-width="3" stroke-linecap="round"/>

  <!-- Layer 1: Himalayan Mountain Ridges (Trikuta / Pir Panjal) -->
  <path d="M70 330 L160 215 L245 295 L345 185 L442 330 Z" fill="url(#mountainGrad1)" opacity="0.85"/>
  <path d="M125 330 L210 230 L285 305 L385 205 L442 290 L442 330 Z" fill="url(#mountainGrad2)" opacity="0.6"/>

  <!-- Layer 2: Bahu Fort Regal Ramparts & Battlements -->
  <path d="M110 330 L110 270 
           L132 270 L132 284 L152 284 L152 270 
           L174 270 L174 284 L194 284 L194 270 
           L216 270 L216 284 L236 284 L236 270
           L276 270 L276 284 L296 284 L296 270
           L318 270 L318 284 L338 284 L338 270
           L360 270 L360 284 L380 284 L380 270
           L402 270 L402 330 Z" 
        fill="#F8FAF9" opacity="0.95"/>

  <!-- Layer 3: Central Majestic Temple Shikhara (Raghunath & Vaishno Devi) -->
  <path d="M212 300 C220 220, 240 148, 256 120 C272 148, 292 220, 300 300 Z" fill="url(#goldGrad)"/>

  <!-- Shikhara Horizontal Sacred Tiers / Amalaka -->
  <path d="M228 260 Q256 250 284 260" stroke="#FFFBEB" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>
  <path d="M236 220 Q256 212 276 220" stroke="#FFFBEB" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>
  <path d="M244 175 Q256 168 268 175" stroke="#FFFBEB" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8"/>

  <!-- Temple Gateway Sanctum Arch -->
  <path d="M240 330 L240 285 C240 275, 272 275, 272 285 L272 330 Z" fill="#0A362C"/>
  <circle cx="256" cy="282" r="5" fill="#FDE047"/>

  <!-- Layer 4: Flowing Suryaputri River Tawi (Dynamic Waves) -->
  <!-- Back River Wave (Gold Sunset Reflection) -->
  <path d="M70 380 C130 340, 200 410, 290 370 C360 335, 410 365, 442 375 L442 415 C390 395, 340 375, 280 405 C190 445, 130 380, 70 415 Z" 
        fill="url(#riverGold)" opacity="0.95"/>
  <!-- Front River Wave (Crystalline Glacier Azure) -->
  <path d="M70 350 C140 310, 220 380, 310 340 C370 312, 415 330, 442 342 L442 372 C410 358, 365 342, 305 368 C220 405, 140 338, 70 378 Z" 
        fill="url(#riverAzure)"/>

  <!-- River Crest Highlights -->
  <path d="M95 352 C150 322, 220 375, 305 342 C355 322, 395 332, 420 344" 
        stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/>

  <!-- Layer 5: Apex Golden Kalash & Khoj Navigation Star (✧) -->
  <!-- Golden Kalash Finial Base -->
  <ellipse cx="256" cy="118" rx="8" ry="4" fill="#FDE047"/>
  <circle cx="256" cy="112" r="5" fill="#FDE047"/>

  <!-- The 8-Point Khoj Exploration Star (North Star / Compass) -->
  <!-- Outer Gold Star Glow -->
  <circle cx="256" cy="94" r="14" fill="#F59E0B" opacity="0.35"/>

  <!-- Main 8-Point Compass Star -->
  <polygon points="256,66 261,88 284,94 261,100 256,122 251,100 228,94 251,88" fill="#FFFFFF"/>
  <polygon points="256,76 259,91 274,94 259,97 256,112 253,97 238,94 253,91" fill="#FDE047"/>
  <!-- Diagonal Sub-Points -->
  <polygon points="256,83 264,86 267,94 264,102 256,105 248,102 245,94 248,86" fill="#F59E0B" opacity="0.8"/>
  <circle cx="256" cy="94" r="3" fill="#FFFFFF"/>

  <!-- Brand Typography: JAMMUKHOJ -->
  <text x="256" y="468" 
        font-family="system-ui, -apple-system, 'Mukta', 'Segoe UI', Roboto, sans-serif" 
        font-size="34" 
        font-weight="800" 
        fill="#F8FAF9" 
        text-anchor="middle" 
        letter-spacing="5">JAMMUKHOJ</text>

  <!-- Subtitle Tag: EXPLORE • PILGRIM • HERITAGE -->
  <text x="256" y="490" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="11" 
        font-weight="700" 
        fill="#F59E0B" 
        text-anchor="middle" 
        letter-spacing="3" 
        opacity="0.9">CITY OF TEMPLES</text>
</svg>'''

# 2. Transparent Foreground Emblem for Android Adaptive Icon (108dp safe zone)
FOREGROUND_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="goldGradFg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="40%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <linearGradient id="mountainGradFg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#248773"/>
      <stop offset="100%" stop-color="#0E483D"/>
    </linearGradient>
    <linearGradient id="riverAzureFg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#7DD3FC"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <linearGradient id="riverGoldFg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
  </defs>

  <g transform="translate(25.6, 25.6) scale(0.9)">
    <!-- Mountain Ridges -->
    <path d="M70 330 L160 215 L245 295 L345 185 L442 330 Z" fill="url(#mountainGradFg)" opacity="0.9"/>

    <!-- Bahu Fort Battlements -->
    <path d="M110 330 L110 270 
             L132 270 L132 284 L152 284 L152 270 
             L174 270 L174 284 L194 284 L194 270 
             L216 270 L216 284 L236 284 L236 270
             L276 270 L276 284 L296 284 L296 270
             L318 270 L318 284 L338 284 L338 270
             L360 270 L360 284 L380 284 L380 270
             L402 270 L402 330 Z" 
          fill="#F8FAF9"/>

    <!-- Temple Shikhara -->
    <path d="M212 300 C220 220, 240 148, 256 120 C272 148, 292 220, 300 300 Z" fill="url(#goldGradFg)"/>

    <path d="M228 260 Q256 250 284 260" stroke="#FFFBEB" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9"/>
    <path d="M236 220 Q256 212 276 220" stroke="#FFFBEB" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9"/>
    <path d="M244 175 Q256 168 268 175" stroke="#FFFBEB" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.9"/>

    <!-- Sanctum Gateway -->
    <path d="M240 330 L240 285 C240 275, 272 275, 272 285 L272 330 Z" fill="#0A362C"/>
    <circle cx="256" cy="282" r="5" fill="#FDE047"/>

    <!-- Tawi Waves -->
    <path d="M70 380 C130 340, 200 410, 290 370 C360 335, 410 365, 442 375 L442 415 C390 395, 340 375, 280 405 C190 445, 130 380, 70 415 Z" 
          fill="url(#riverGoldFg)"/>
    <path d="M70 350 C140 310, 220 380, 310 340 C370 312, 415 330, 442 342 L442 372 C410 358, 365 342, 305 368 C220 405, 140 338, 70 378 Z" 
          fill="url(#riverAzureFg)"/>
    <path d="M95 352 C150 322, 220 375, 305 342 C355 322, 395 332, 420 344" 
          stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8"/>

    <!-- Golden Kalash & Star -->
    <ellipse cx="256" cy="118" rx="8" ry="4" fill="#FDE047"/>
    <circle cx="256" cy="112" r="5" fill="#FDE047"/>

    <!-- Khoj Star -->
    <polygon points="256,66 261,88 284,94 261,100 256,122 251,100 228,94 251,88" fill="#FFFFFF"/>
    <polygon points="256,76 259,91 274,94 259,97 256,112 253,97 238,94 253,91" fill="#FDE047"/>
    <circle cx="256" cy="94" r="3" fill="#FFFFFF"/>
  </g>
</svg>'''

# 3. Compact Logo Emblem for in-app header / favicon (square viewBox, centered)
HEADER_EMBLEM_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="hdrBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E483D"/>
      <stop offset="100%" stop-color="#05221B"/>
    </linearGradient>
    <linearGradient id="hdrGold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <linearGradient id="hdrRiver" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="26" fill="url(#hdrBg)"/>
  <rect x="1.5" y="1.5" width="97" height="97" rx="24.5" fill="none" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>

  <!-- Compass Star halo ring -->
  <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" stroke-width="0.8" stroke-opacity="0.4" stroke-dasharray="1.5 2.5"/>

  <!-- Mountains -->
  <path d="M14 66 L32 44 L48 59 L68 38 L86 66 Z" fill="#1C6656" opacity="0.9"/>

  <!-- Fort Wall -->
  <path d="M22 66 L22 55 L26 55 L26 58 L30 58 L30 55 L34 55 L34 58 L38 58 L38 55 L42 55 L42 58 L46 58 L46 55 L54 55 L54 58 L58 58 L58 55 L62 55 L62 58 L66 58 L66 55 L70 55 L70 58 L74 58 L74 55 L78 55 L78 66 Z" fill="#F8FAF9"/>

  <!-- Temple Spire -->
  <path d="M42 61 C43.5 45, 47 30, 50 24 C53 30, 56.5 45, 58 61 Z" fill="url(#hdrGold)"/>

  <!-- River Tawi Waves -->
  <path d="M14 74 C28 66, 44 80, 62 72 C74 67, 81 70, 86 73 L86 79 C76 75, 68 73, 56 79 C38 87, 26 74, 14 81 Z" fill="#F59E0B" opacity="0.9"/>
  <path d="M14 69 C28 61, 44 75, 62 67 C74 62, 81 65, 86 68 L86 74 C76 71, 67 67, 56 74 C38 82, 26 69, 14 76 Z" fill="url(#hdrRiver)"/>

  <!-- Khoj Star at Apex -->
  <polygon points="50,13 51,18 56,19 51,20 50,25 49,20 44,19 49,18" fill="#FFFFFF"/>
  <circle cx="50" cy="19" r="1.2" fill="#FDE047"/>
</svg>'''

def render_svg_to_png(svg_content: str, width: int, height: int) -> bytes:
  doc = fitz.open(stream=svg_content.encode('utf-8'), filetype='svg')
  page = doc[0]
  # default svg is 512x512
  scale = width / page.rect.width
  mat = fitz.Matrix(scale, scale)
  pix = page.get_pixmap(matrix=mat, alpha=True)
  return pix.tobytes('png')

def main():
  print("1. Writing SVG files...")
  # Save primary icons
  os.makedirs('public/icons', exist_ok=True)
  with open('public/icons/icon.svg', 'w', encoding='utf-8') as f:
    f.write(MASTER_SVG)
  with open('public/icons/icon-emblem.svg', 'w', encoding='utf-8') as f:
    f.write(HEADER_EMBLEM_SVG)
  with open('public/icons/icon-foreground.svg', 'w', encoding='utf-8') as f:
    f.write(FOREGROUND_SVG)

  print("2. Generating Web PWA PNG assets...")
  # 512x512 PWA
  pwa_512 = render_svg_to_png(MASTER_SVG, 512, 512)
  with open('public/icons/icon-512.png', 'wb') as f:
    f.write(pwa_512)

  # 192x192 PWA
  pwa_192 = render_svg_to_png(MASTER_SVG, 192, 192)
  with open('public/icons/icon-192.png', 'wb') as f:
    f.write(pwa_192)

  # 64x64 and 32x32 Favicon
  fav_32 = render_svg_to_png(MASTER_SVG, 32, 32)
  with open('public/icons/favicon-32.png', 'wb') as f:
    f.write(fav_32)

  fav_img = Image.open(io.BytesIO(render_svg_to_png(MASTER_SVG, 64, 64)))
  fav_img.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

  print("3. Generating Android Mipmap densities...")
  # Android density mappings: (folder, size)
  densities = [
    ('mipmap-mdpi', 48),
    ('mipmap-hdpi', 72),
    ('mipmap-xhdpi', 96),
    ('mipmap-xxhdpi', 144),
    ('mipmap-xxxhdpi', 192),
  ]

  res_dir = 'android/app/src/main/res'
  for folder, size in densities:
    target_dir = os.path.join(res_dir, folder)
    os.makedirs(target_dir, exist_ok=True)

    # 1. Standard ic_launcher.png (Full squircle)
    png_data = render_svg_to_png(MASTER_SVG, size, size)
    with open(os.path.join(target_dir, 'ic_launcher.png'), 'wb') as f:
      f.write(png_data)

    # 2. ic_launcher_round.png (Circular cropped)
    img = Image.open(io.BytesIO(png_data)).convert('RGBA')
    # create round mask
    mask = Image.new('L', (size, size), 0)
    from PIL import ImageDraw
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    round_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    round_img.paste(img, (0, 0), mask=mask)
    round_img.save(os.path.join(target_dir, 'ic_launcher_round.png'), 'PNG')

    # 3. ic_launcher_foreground.png (Adaptive foreground emblem, size x size)
    fg_data = render_svg_to_png(FOREGROUND_SVG, size, size)
    with open(os.path.join(target_dir, 'ic_launcher_foreground.png'), 'wb') as f:
      f.write(fg_data)

    print(f"  [OK] {folder}: {size}x{size} (launcher, round, foreground)")

  print("4. Updating Android Vector Drawables for Adaptive Icons...")
  # Update ic_launcher_background.xml
  bg_xml = '''<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#0A362C"
        android:pathData="M0,0h108v108h-108z" />
    <path
        android:fillColor="#1B7864"
        android:pathData="M54,54m-42,0a42,42 0 1,0 84,0a42,42 0 1,0 -84,0"
        android:alpha="0.25" />
</vector>'''
  with open(os.path.join(res_dir, 'drawable', 'ic_launcher_background.xml'), 'w', encoding='utf-8') as f:
    f.write(bg_xml)

  # Update ic_launcher_foreground.xml
  # We will provide a clean vector drawable representation
  fg_xml = '''<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <!-- Outer Halo Ring -->
    <path
        android:strokeColor="#F59E0B"
        android:strokeWidth="0.8"
        android:strokeAlpha="0.35"
        android:pathData="M54,54m-38,0a38,38 0 1,0 76,0a38,38 0 1,0 -76,0" />

    <!-- Mountain Ridge -->
    <path
        android:fillColor="#248773"
        android:pathData="M15,70 L34,46 L52,62 L73,40 L93,70 Z" />

    <!-- Bahu Fort Ramparts -->
    <path
        android:fillColor="#F8FAF9"
        android:pathData="M23,70 L23,57 L28,57 L28,60 L33,60 L33,57 L38,57 L38,60 L43,60 L43,57 L48,57 L48,60 L53,60 L53,57 L60,57 L60,60 L65,60 L65,57 L70,57 L70,60 L75,60 L75,57 L80,57 L80,60 L85,60 L85,70 Z" />

    <!-- Temple Shikhara Spire -->
    <path
        android:fillColor="#F59E0B"
        android:pathData="M45,64 C47,47 51,32 54,25 C57,32 61,47 63,64 Z" />

    <!-- Sanctum Gateway -->
    <path
        android:fillColor="#0A362C"
        android:pathData="M51,70 L51,61 C51,59 57,59 57,61 L57,70 Z" />
    <path
        android:fillColor="#FDE047"
        android:pathData="M54,60m-1.2,0a1.2,1.2 0 1,0 2.4,0a1.2,1.2 0 1,0 -2.4,0" />

    <!-- River Tawi Waves (Gold & Cyan) -->
    <path
        android:fillColor="#D97706"
        android:pathData="M15,79 C28,70 44,85 64,77 C77,72 85,75 93,78 L93,85 C83,81 74,78 61,85 C42,93 28,79 15,87 Z" />
    <path
        android:fillColor="#38BDF8"
        android:pathData="M15,73 C28,65 44,79 64,71 C77,66 85,69 93,72 L93,78 C83,75 74,71 61,78 C42,86 28,73 15,81 Z" />

    <!-- Golden Kalash & Compass Star -->
    <path
        android:fillColor="#FDE047"
        android:pathData="M54,24m-1.8,0a1.8,1.8 0 1,0 3.6,0a1.8,1.8 0 1,0 -3.6,0" />

    <!-- 8-Point Compass Star -->
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M54,14 L55.5,19.5 L61,21 L55.5,22.5 L54,28 L52.5,22.5 L47,21 L52.5,19.5 Z" />
    <path
        android:fillColor="#FDE047"
        android:pathData="M54,17 L54.8,20 L58,21 L54.8,22 L54,25 L53.2,22 L50,21 L53.2,20 Z" />
</vector>'''
  with open(os.path.join(res_dir, 'drawable-v24', 'ic_launcher_foreground.xml'), 'w', encoding='utf-8') as f:
    f.write(fg_xml)

  print("[SUCCESS] All logo assets generated successfully!")

if __name__ == '__main__':
  main()
