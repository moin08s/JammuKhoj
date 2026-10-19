"""
JammuKhoj - Premium Visual Pitch Deck Generator
Generates a polished 16:9 widescreen presentation (10 slides) with real app screenshots
and human-designed visual hierarchy using python-pptx.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# -----------------------------------------------------------------------------
# PRESENTATION & PALETTE SETUP
# -----------------------------------------------------------------------------
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Premium Brand Palette (Jammu Shivalik & Royal Dogra Heritage)
C_DARK_GREEN = RGBColor(8, 84, 68)     # #085444 Deep Forest Pine
C_FOREST_DEEP = RGBColor(12, 45, 38)   # #0C2D26 Darkest Forest
C_AMBER = RGBColor(158, 74, 12)        # #9E4A0C Terracotta Ochre
C_GOLD = RGBColor(217, 119, 6)         # #D97706 Warm Temple Gold
C_LIGHT_BG = RGBColor(250, 248, 244)   # #FAF8F4 Warm Cream
C_WHITE = RGBColor(255, 255, 255)
C_CARD_BG = RGBColor(255, 255, 255)
C_CARD_BORDER = RGBColor(230, 222, 212)# Soft warm border
C_TEXT_INK = RGBColor(26, 36, 32)      # Deep slate ink
C_TEXT_MUTED = RGBColor(108, 122, 115) # Muted slate
C_ACCENT_BG = RGBColor(244, 239, 233)  # Sand accent
C_DEVICE_FRAME = RGBColor(18, 24, 22)  # Dark phone bezel
C_EMERALD = RGBColor(21, 128, 61)

FONT_HEADING = "Georgia"
FONT_BODY = "Arial"

blank_layout = prs.slide_layouts[6]  # Blank slide

# Asset Paths
DECK_DIR = os.path.abspath(os.path.join(os.getcwd(), "assets", "deck"))
IMG_LOGO = os.path.join(DECK_DIR, "app_logo.png")
IMG_HOME_PLANNER = os.path.join(DECK_DIR, "app_home_planner.png")
IMG_ITINERARY = os.path.join(DECK_DIR, "app_itinerary_result.png")
IMG_EXPLORE = os.path.join(DECK_DIR, "app_explore_screen.png")
IMG_FOOD = os.path.join(DECK_DIR, "app_dogri_food.png")
IMG_DETAIL = os.path.join(DECK_DIR, "app_attraction_detail.png")
IMG_SETTINGS = os.path.join(DECK_DIR, "app_offline_settings.png")

# -----------------------------------------------------------------------------
# HELPER FUNCTIONS
# -----------------------------------------------------------------------------
def set_slide_background(slide, color=C_LIGHT_BG):
    bg_shape = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height
    )
    bg_shape.fill.solid()
    bg_shape.fill.fore_color.rgb = color
    bg_shape.line.fill.background()
    return bg_shape

def add_header(slide, slide_num, category, title, subtitle=None):
    # Top Category Pill
    cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.42), Inches(10), Inches(0.35))
    tf_c = cat_box.text_frame
    tf_c.word_wrap = True
    p_c = tf_c.paragraphs[0]
    p_c.text = f"{slide_num:02d} • {category.upper()}"
    p_c.font.size = Pt(10.5)
    p_c.font.bold = True
    p_c.font.color.rgb = C_AMBER
    p_c.font.name = FONT_BODY

    # Main Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.65))
    tf_t = title_box.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    p_t.text = title
    p_t.font.size = Pt(23)
    p_t.font.bold = True
    p_t.font.color.rgb = C_DARK_GREEN
    p_t.font.name = FONT_HEADING

    # Subtitle
    if subtitle:
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.38), Inches(11.7), Inches(0.4))
        tf_s = sub_box.text_frame
        tf_s.word_wrap = True
        p_s = tf_s.paragraphs[0]
        p_s.text = subtitle
        p_s.font.size = Pt(12)
        p_s.font.color.rgb = C_TEXT_MUTED
        p_s.font.name = FONT_BODY

def add_card(slide, left, top, width, height, bg_color=C_WHITE, border_color=C_CARD_BORDER):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    if border_color:
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
    else:
        card.line.fill.background()
    return card

def add_phone_mockup(slide, img_path, left, top, width, height):
    """Creates a sleek mobile frame with screen preview"""
    # Outer Bezel
    bezel = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    bezel.fill.solid()
    bezel.fill.fore_color.rgb = C_DEVICE_FRAME
    bezel.line.color.rgb = C_GOLD
    bezel.line.width = Pt(1.5)

    # Screen Image inside frame
    pad = Inches(0.08)
    if os.path.exists(img_path):
        slide.shapes.add_picture(
            img_path,
            left + pad,
            top + pad,
            width - (pad * 2),
            height - (pad * 2)
        )

def add_footer(slide, text="JammuKhoj • Smart Tourism & Pilgrim Companion • Live App: https://jammukhoj.in"):
    f_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.7), Inches(0.35))
    tf = f_box.text_frame
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(9)
    p.font.color.rgb = C_TEXT_MUTED
    p.font.name = FONT_BODY

# =============================================================================
# SLIDE 1: PROJECT INTRODUCTION (HERO WITH APP EMBLEM & PHONE MOCKUP)
# =============================================================================
s1 = prs.slides.add_slide(blank_layout)
set_slide_background(s1, C_DARK_GREEN)

# Decorative background accent
acc = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.7), Inches(11.733), Inches(6.05))
acc.fill.solid()
acc.fill.fore_color.rgb = C_FOREST_DEEP
acc.line.color.rgb = C_GOLD
acc.line.width = Pt(1.5)

# Left Column: Branding, Pitch & Features
b_badge = s1.shapes.add_textbox(Inches(1.2), Inches(1.1), Inches(7.5), Inches(0.35))
p_bb = b_badge.text_frame.paragraphs[0]
p_bb.text = "OFFLINE-FIRST CIVIC TRAVEL INNOVATION • JAMMU DIVISION & VAISHNO DEVI"
p_bb.font.size = Pt(10.5)
p_bb.font.bold = True
p_bb.font.color.rgb = C_GOLD
p_bb.font.name = FONT_BODY

t_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.5), Inches(7.5), Inches(1.5))
tf_1 = t_box.text_frame
p1_1 = tf_1.paragraphs[0]
p1_1.text = "JammuKhoj"
p1_1.font.size = Pt(44)
p1_1.font.bold = True
p1_1.font.color.rgb = C_WHITE
p1_1.font.name = FONT_HEADING

p1_2 = tf_1.add_paragraph()
p1_2.text = "जम्मू खोज • Your Jammu Journey, Made Simple."
p1_2.font.size = Pt(18)
p1_2.font.color.rgb = C_GOLD
p1_2.font.name = FONT_BODY

desc_box = s1.shapes.add_textbox(Inches(1.2), Inches(3.1), Inches(7.2), Inches(1.3))
p_desc = desc_box.text_frame.paragraphs[0]
p_desc.text = (
    "A production-ready progressive web app & Android platform engineered for "
    "transit layovers and Mata Vaishno Devi pilgrims across the Jammu Division. "
    "100% offline-ready with conservative train/flight safety buffers, transparent "
    "transport fare matrices, step-free senior guidance, and zero-tracking privacy."
)
p_desc.font.size = Pt(13)
p_desc.font.color.rgb = C_WHITE
p_desc.font.name = FONT_BODY

# 4 Key Feature Badges
cols = [
    ("⚡ 1-Tap Buffer Planner", "4h, 8h & 24h layover circuits"),
    ("📶 100% Offline IndexedDB", "Vector maps & full routing offline"),
    ("🚌 Transparent Transit", "Matadors (₹10-25), Autos & Taxis"),
    ("🧓 Senior & Pilgrim Ease", "Step-free, battery cars & 112 SOS"),
]

for idx, (col_title, col_sub) in enumerate(cols):
    cx = Inches(1.2 + (idx % 2) * 3.6)
    cy = Inches(4.6 + (idx // 2) * 0.95)
    c_shape = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, cy, Inches(3.45), Inches(0.85))
    c_shape.fill.solid()
    c_shape.fill.fore_color.rgb = C_DARK_GREEN
    c_shape.line.color.rgb = C_GOLD
    c_shape.line.width = Pt(1)

    tb = s1.shapes.add_textbox(cx + Inches(0.1), cy + Inches(0.08), Inches(3.25), Inches(0.7))
    tf = tb.text_frame
    p_t = tf.paragraphs[0]
    p_t.text = col_title
    p_t.font.size = Pt(11)
    p_t.font.bold = True
    p_t.font.color.rgb = C_GOLD
    p_s = tf.add_paragraph()
    p_s.text = col_sub
    p_s.font.size = Pt(9.5)
    p_s.font.color.rgb = C_WHITE

# Right Column: Actual App Screenshot in Phone Frame
add_phone_mockup(s1, IMG_HOME_PLANNER, Inches(8.8), Inches(1.15), Inches(2.9), Inches(5.15))

# =============================================================================
# SLIDE 2: PROBLEM AND HACKATHON ALIGNMENT
# =============================================================================
s2 = prs.slides.add_slide(blank_layout)
set_slide_background(s2)
add_header(s2, 2, "Problem Statement", "The Transit Anxiety & Information Vacuum in Jammu", "Why millions of pilgrims pass through Jammu with friction, fear, and zero local discovery.")

p_cards = [
    ("🚨 Transit Anxiety & Time Fear", "Fear of Missing Onward Trains / Flights", [
        "Pilgrims face 4 to 12 hour layovers at Jammu Tawi or IXJ Airport.",
        "Fear of mountain highway bottlenecks traps families on railway platforms.",
        "Zero existing tools compute guaranteed conservative safety return buffers.",
    ]),
    ("💸 Transport Gouging & Haggling", "Unregulated Fares & Commuter Harassment", [
        "Unsuspecting yatris routinely charged ₹800–₹1,500 for a ₹150 taxi ride.",
        "Matador mini-bus stages and route numbers are completely opaque to outsiders.",
        "Zero visibility into official prepaid auto/taxi union rate cards.",
    ]),
    ("📴 Cellular Blackouts & Accessibility", "Mountain Dead Zones & Elder Strain", [
        "Cloud-based travel apps crash in Shivalik foothill tunnels and dead zones.",
        "Senior citizens face unexpected steep stairs without wheelchair/battery-car guidance.",
        "Emergency hotlines and National ERSS 112 are scattered across fragmented websites.",
    ]),
]

for idx, (head, subhead, bullets) in enumerate(p_cards):
    c_left = Inches(0.8 + idx * 3.95)
    add_card(s2, c_left, Inches(1.85), Inches(3.75), Inches(4.8))
    
    tb = s2.shapes.add_textbox(c_left + Inches(0.2), Inches(2.0), Inches(3.35), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = head
    p1.font.size = Pt(14)
    p1.font.bold = True
    p1.font.color.rgb = C_AMBER
    p1.font.name = FONT_HEADING
    
    p2 = tf.add_paragraph()
    p2.text = subhead
    p2.font.size = Pt(11)
    p2.font.bold = True
    p2.font.color.rgb = C_TEXT_INK
    p2.space_after = Pt(10)
    
    for b in bullets:
        pb = tf.add_paragraph()
        pb.text = f"•  {b}"
        pb.font.size = Pt(10.5)
        pb.font.color.rgb = C_TEXT_MUTED
        pb.space_after = Pt(8)

add_footer(s2)

# =============================================================================
# SLIDE 3: THE VISITOR-DISCOVERY GAP
# =============================================================================
s3 = prs.slides.add_slide(blank_layout)
set_slide_background(s3)
add_header(s3, 3, "Economic & Cultural Gap", "The 10-Million Pilgrim Paradox: Direct Transit Bypass", "Immense visitor footfall that completely bypasses Jammu's cultural and economic ecosystem.")

# Left Metric Highlight Card
add_card(s3, Inches(0.8), Inches(1.85), Inches(4.5), Inches(4.8), bg_color=C_DARK_GREEN)
tb_l = s3.shapes.add_textbox(Inches(1.0), Inches(2.05), Inches(4.1), Inches(4.4))
tf_l = tb_l.text_frame
tf_l.word_wrap = True

p_m1 = tf_l.paragraphs[0]
p_m1.text = "10,000,000+"
p_m1.font.size = Pt(38)
p_m1.font.bold = True
p_m1.font.color.rgb = C_GOLD
p_m1.font.name = FONT_HEADING

p_m2 = tf_l.add_paragraph()
p_m2.text = "Annual pilgrims transit through Jammu Tawi & Katra to reach Shri Mata Vaishno Devi Shrine."
p_m2.font.size = Pt(12.5)
p_m2.font.color.rgb = C_WHITE
p_m2.space_after = Pt(18)

p_m3 = tf_l.add_paragraph()
p_m3.text = "< 2 Hours Average Dwell"
p_m3.font.size = Pt(17)
p_m3.font.bold = True
p_m3.font.color.rgb = C_GOLD
p_m3.font.name = FONT_HEADING

p_m4 = tf_l.add_paragraph()
p_m4.text = "Over 85% of yatris treat Jammu as a mere train-to-bus transit hallway, unaware of rich Dogra heritage minutes away."
p_m4.font.size = Pt(12)
p_m4.font.color.rgb = C_WHITE

# Right: The Consequences Breakdown
add_card(s3, Inches(5.6), Inches(1.85), Inches(6.9), Inches(4.8))
tb_r = s3.shapes.add_textbox(Inches(5.8), Inches(2.05), Inches(6.5), Inches(4.4))
tf_r = tb_r.text_frame
tf_r.word_wrap = True

p_rt = tf_r.paragraphs[0]
p_rt.text = "Four Costly Tourism & Economic Gaps"
p_rt.font.size = Pt(17)
p_rt.font.bold = True
p_rt.font.color.rgb = C_DARK_GREEN
p_rt.font.name = FONT_HEADING
p_rt.space_after = Pt(12)

gap_items = [
    ("🏛️ Heritage Neglect", "Mubarak Mandi Palace (Dogra royal seat), Bahu Fort (3000 yrs), and Amar Mahal witness only a tiny fraction of their visitor potential."),
    ("🛍️ GI Craft Exploitation", "Authentic Dogra crafts (Basohli Paintings, Pashmina, Basohli Tweed, Bhaderwah Rajmash) lose sales to roadside highway fakes with no verified directory."),
    ("🍲 Forgotten Culinary Economy", "Indigenous nutritious Dogra delicacies (Kaladi Kulcha, Dogra Dham, Sund Panjeeri) lose out to generic highway fast-food stalls."),
    ("📉 Lost Municipal Revenue", "Estimates show Jammu City loses over ₹300 Crores annually in potential local hospitality, craft, and transportation income."),
]

for g_title, g_desc in gap_items:
    p_gt = tf_r.add_paragraph()
    p_gt.text = g_title
    p_gt.font.size = Pt(12)
    p_gt.font.bold = True
    p_gt.font.color.rgb = C_AMBER
    
    p_gd = tf_r.add_paragraph()
    p_gd.text = g_desc
    p_gd.font.size = Pt(10.5)
    p_gd.font.color.rgb = C_TEXT_MUTED
    p_gd.space_after = Pt(6)

add_footer(s3)

# =============================================================================
# SLIDE 4: THE JAMMUKHOJ SOLUTION (WITH HOME PLANNER SCREENSHOT)
# =============================================================================
s4 = prs.slides.add_slide(blank_layout)
set_slide_background(s4)
add_header(s4, 4, "The Solution Architecture", "JammuKhoj: An Intelligent, Resilient Local Guide", "A human-centered progressive application tailored for zero-data environments and time-critical pilgrims.")

# Left 2 Architecture Cards
sol_cards_left = [
    ("⚡ 1-Tap Buffer-Safe Engine", "Deterministic layout generator tailored to traveler's exact layover window (4h Express, 8h Cultural, 24h Valley trail). Enforces a strict 45-min rail buffer & 150-min air buffer, eliminating missed departures."),
    ("📶 100% Offline Vector Stack", "Entire knowledge graph (36+ attractions, road topologies, timetables, dialer hotlines) bundled in local IndexedDB. Operates with zero SIM or data roaming in mountain valleys."),
]

for idx, (title, desc) in enumerate(sol_cards_left):
    c_y = Inches(1.85 + idx * 2.45)
    add_card(s4, Inches(0.8), c_y, Inches(4.3), Inches(2.3))
    
    tb = s4.shapes.add_textbox(Inches(0.95), c_y + Inches(0.18), Inches(4.0), Inches(1.95))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_DARK_GREEN
    p.font.name = FONT_HEADING
    p.space_after = Pt(4)
    
    pd = tf.add_paragraph()
    pd.text = desc
    pd.font.size = Pt(10.5)
    pd.font.color.rgb = C_TEXT_MUTED

# Center: Real Phone Mockup of 1-Tap Home Screen
add_phone_mockup(s4, IMG_HOME_PLANNER, Inches(5.3), Inches(1.85), Inches(2.7), Inches(4.8))

# Right 2 Architecture Cards
sol_cards_right = [
    ("🚌 Transparent Transit Intelligence", "Verified stage-by-stage Matador mini-bus routes, Smart City E-bus stops, and prepaid union matrices for auto-rickshaws and taxis to end passenger overcharging."),
    ("🧓 Elder & Accessibility Care", "Step-free badges, walking load indicators (Low/Med/High), verified Vaishno Devi 5-stage trek manual, battery-car regulations, and 1-tap ERSS 112 WhatsApp location SOS."),
]

for idx, (title, desc) in enumerate(sol_cards_right):
    c_y = Inches(1.85 + idx * 2.45)
    add_card(s4, Inches(8.2), c_y, Inches(4.3), Inches(2.3))
    
    tb = s4.shapes.add_textbox(Inches(8.35), c_y + Inches(0.18), Inches(4.0), Inches(1.95))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = C_DARK_GREEN
    p.font.name = FONT_HEADING
    p.space_after = Pt(4)
    
    pd = tf.add_paragraph()
    pd.text = desc
    pd.font.size = Pt(10.5)
    pd.font.color.rgb = C_TEXT_MUTED

add_footer(s4)

# =============================================================================
# SLIDE 5: USER JOURNEY (WITH ITINERARY RESULT SCREENSHOT)
# =============================================================================
s5 = prs.slides.add_slide(blank_layout)
set_slide_background(s5)
add_header(s5, 5, "Seamless User Journey", "From Station Arrival to Holy Darshan in 5 Frictionless Steps", "Designed for immediate value without forced registration, heavy downloads, or steep learning curves.")

# Left 5 Steps Cards
steps_box = add_card(s5, Inches(0.8), Inches(1.85), Inches(8.5), Inches(4.8))
tb_steps = s5.shapes.add_textbox(Inches(1.0), Inches(1.95), Inches(8.1), Inches(4.6))
tf_st = tb_steps.text_frame
tf_st.word_wrap = True

steps_data = [
    ("1. Arrival at Station / Airport", "Yatri steps off train at Jammu Tawi (JAT) or IXJ Airport. Opens jammukhoj.in directly with 1 tap. Zero mandatory login barrier."),
    ("2. 1-Tap Itinerary Generation", "Selects layover: '4-Hour Express' from station. App automatically reserves 45-min departure buffer and crafts a 2.5-hr curated temple circuit."),
    ("3. Transparent Local Transit", "Checks Matador Route #1 to Raghunath Bazaar. Boards with exact ₹15 fare; avoids cab touts quoting ₹400 for the same distance."),
    ("4. Cultural Discovery & Pure Veg Food", "Offers prayers at Raghunath Mandir, tastes authentic Kaladi Kulcha with Jain/Pure Veg filter, and visits verified Basohli craft cooperative."),
    ("5. Safe Onward Departure", "Returns to station with 50 minutes to spare. Boards onward Vande Bharat Express to Katra for holy darshan with complete peace of mind."),
]

for idx, (title, desc) in enumerate(steps_data):
    p_t = tf_st.paragraphs[0] if idx == 0 else tf_st.add_paragraph()
    p_t.text = f"STEP {idx+1}: {title.upper()}"
    p_t.font.size = Pt(11)
    p_t.font.bold = True
    p_t.font.color.rgb = C_AMBER
    
    p_d = tf_st.add_paragraph()
    p_d.text = desc
    p_d.font.size = Pt(10)
    p_d.font.color.rgb = C_TEXT_INK
    p_d.space_after = Pt(6)

# Right: Actual App Screenshot of Generated Itinerary
add_phone_mockup(s5, IMG_ITINERARY, Inches(9.6), Inches(1.85), Inches(2.9), Inches(4.8))

add_footer(s5)

# =============================================================================
# SLIDE 6: CORE FEATURES & COMPETITIVE DIFFERENTIATION (WITH EXPLORE SCREENSHOT)
# =============================================================================
s6 = prs.slides.add_slide(blank_layout)
set_slide_background(s6)
add_header(s6, 6, "Competitive Differentiation", "How JammuKhoj Outperforms Generic Travel Platforms", "Direct comparison against Google Maps, MakeMyTrip, and generic travel blogs.")

# Left Comparison Table
t_left = Inches(0.8)
t_top = Inches(1.85)
t_width = Inches(8.5)
t_height = Inches(4.8)

table_shape = s6.shapes.add_table(6, 4, t_left, t_top, t_width, t_height)
table = table_shape.table
table.columns[0].width = Inches(1.9)
table.columns[1].width = Inches(2.1)
table.columns[2].width = Inches(2.1)
table.columns[3].width = Inches(2.4)

headers = ["Dimension", "Google Maps", "MakeMyTrip / OTAs", "JammuKhoj (Our App)"]
for c_idx, h_text in enumerate(headers):
    cell = table.cell(0, c_idx)
    cell.fill.solid()
    cell.fill.fore_color.rgb = C_DARK_GREEN if c_idx == 3 else C_FOREST_DEEP
    p = cell.text_frame.paragraphs[0]
    p.text = h_text
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_GOLD if c_idx == 3 else C_WHITE

rows_data = [
    ("Offline Autonomy", "Fails in mountain tunnels & valleys", "100% online only; unusable offline", "100% On-Device IndexedDB"),
    ("Safe Buffer Planner", "Ignores train layover deadlines", "Rigid commercial packages only", "45m rail & 150m air locks"),
    ("Transit Tariffs", "No Matadors; no fare benchmarks", "Commercial cabs at high markup", "Matadors (₹10-25) + Taxi matrices"),
    ("Senior & Pilgrim Care", "No stair counts or walking load", "Generic packages", "Senior Ease Mode & step-free tags"),
    ("Privacy & Data Safety", "Ad-tracking & location profiling", "Monetizes user contact data", "Zero cookies, zero surveillance"),
]

for r_idx, r_data in enumerate(rows_data):
    for c_idx, val in enumerate(r_data):
        cell = table.cell(r_idx + 1, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_ACCENT_BG if (r_idx % 2 == 1) else C_WHITE
        p = cell.text_frame.paragraphs[0]
        p.text = val
        p.font.size = Pt(9.5)
        p.font.name = FONT_BODY
        if c_idx == 3:
            p.font.bold = True
            p.font.color.rgb = C_DARK_GREEN
        elif c_idx == 0:
            p.font.bold = True
            p.font.color.rgb = C_TEXT_INK
        else:
            p.font.color.rgb = C_TEXT_MUTED

# Right: Explore Screen Real Screenshot
add_phone_mockup(s6, IMG_EXPLORE, Inches(9.6), Inches(1.85), Inches(2.9), Inches(4.8))

add_footer(s6)

# =============================================================================
# SLIDE 7: EXPECTED IMPACT AND MEASURABLE TARGETS (WITH BAHU FORT DETAIL)
# =============================================================================
s7 = prs.slides.add_slide(blank_layout)
set_slide_background(s7)
add_header(s7, 7, "Impact & Metrics", "Measurable Economic, Civic, and Social Outcomes", "High-leverage socio-economic returns for pilgrims, local businesses, and municipal transit.")

# Top 4 Metrics
metrics = [
    ("3x", "Dwell Multiplier", "Extending stay from <2h to 6-8h via safe circuits."),
    ("₹150 Cr+", "Economic Target", "Direct injection into local Dogra food, crafts & transit."),
    ("₹1,200", "Family Savings", "Preventing exploitative cab fares and fake crafts."),
    ("0", "Missed Departures", "100% adherence to safety return buffers."),
]

for idx, (val, label, sub) in enumerate(metrics):
    c_left = Inches(0.8 + idx * 2.1)
    add_card(s7, c_left, Inches(1.85), Inches(2.0), Inches(1.95), bg_color=C_DARK_GREEN)
    
    tb = s7.shapes.add_textbox(c_left + Inches(0.1), Inches(1.95), Inches(1.8), Inches(1.75))
    tf = tb.text_frame
    tf.word_wrap = True
    
    pv = tf.paragraphs[0]
    pv.text = val
    pv.font.size = Pt(28)
    pv.font.bold = True
    pv.font.color.rgb = C_GOLD
    pv.font.name = FONT_HEADING
    
    pl = tf.add_paragraph()
    pl.text = label
    pl.font.size = Pt(10.5)
    pl.font.bold = True
    pl.font.color.rgb = C_WHITE
    
    ps = tf.add_paragraph()
    ps.text = sub
    ps.font.size = Pt(8.5)
    ps.font.color.rgb = C_ACCENT_BG

# Bottom Left: 2 Callout Cards
add_card(s7, Inches(0.8), Inches(3.95), Inches(8.5), Inches(2.7))
tb_b = s7.shapes.add_textbox(Inches(1.0), Inches(4.05), Inches(8.1), Inches(2.5))
tf_b = tb_b.text_frame
tf_b.word_wrap = True

p1 = tf_b.paragraphs[0]
p1.text = "🏛️ Cultural & GI Heritage Renaissance"
p1.font.size = Pt(13)
p1.font.bold = True
p1.font.color.rgb = C_DARK_GREEN
p1.font.name = FONT_HEADING

p2 = tf_b.add_paragraph()
p2.text = (
    "Empowers Basohli painters, Pashmina weavers, and Bhaderwah farmers with verified "
    "outlet discovery and fake-identification guides. Pilgrims purchase authentic GI certified "
    "heritage at fair benchmark prices directly supporting cottage industries."
)
p2.font.size = Pt(10)
p2.font.color.rgb = C_TEXT_MUTED
p2.space_after = Pt(8)

p3 = tf_b.add_paragraph()
p3.text = "🛡️ Public Safety & Yatra Welfare"
p3.font.size = Pt(13)
p3.font.bold = True
p3.font.color.rgb = C_DARK_GREEN
p3.font.name = FONT_HEADING

p4 = tf_b.add_paragraph()
p4.text = (
    "1-Tap WhatsApp GPS SOS dispatcher and offline dialers for ERSS 112, SMVDSB Shrine Helplines, "
    "and women's assistance. Real-time dynamic temple crowd meters and aarti timings prevent "
    "stampedes and reduce elder exhaustion during Navratri surges."
)
p4.font.size = Pt(10)
p4.font.color.rgb = C_TEXT_MUTED

# Right: Actual App Screenshot of Bahu Fort Attraction Detail
add_phone_mockup(s7, IMG_DETAIL, Inches(9.6), Inches(1.85), Inches(2.9), Inches(4.8))

add_footer(s7)

# =============================================================================
# SLIDE 8: IMPLEMENTATION ROADMAP (WITH OFFLINE SETTINGS SCREENSHOT)
# =============================================================================
s8 = prs.slides.add_slide(blank_layout)
set_slide_background(s8)
add_header(s8, 8, "Execution Roadmap", "4-Stage Scalable Deployment Plan (2026 – 2027)", "From proven progressive web app & Android build to institutional statewide rollout.")

# Left: 4 Roadmap Phases
add_card(s8, Inches(0.8), Inches(1.85), Inches(8.5), Inches(4.8))
tb_road = s8.shapes.add_textbox(Inches(1.0), Inches(1.95), Inches(8.1), Inches(4.6))
tf_rd = tb_road.text_frame
tf_rd.word_wrap = True

phases_data = [
    ("Phase 1: Foundation (COMPLETED & LIVE)", "Live on jammukhoj.in • 100% offline PWA & Android APK • 36+ attractions & 44 automated tests passing • 1-Tap buffer planner & transit matrix."),
    ("Phase 2: Transit Node Pilot (Q1-Q2 2027)", "QR code touchpoints at Jammu Tawi & Katra concourses • J&K Smart City e-bus live status integration • Onboard 50+ verified local dhabas & GI artisans • Target: 50,000 monthly users."),
    ("Phase 3: Institutional Sync (Q3 2027)", "Official endorsement by J&K Tourism Directorate • SMVDSB Katra battery-car & RFID status tie-in • Railway Yatri Niwas booking cross-links • Target: 250,000 active yatris."),
    ("Phase 4: Ecosystem Scale (Q4 2027+)", "Expansion to Bhaderwah, Kishtwar, Poonch & Rajouri • Audio heritage guides in Dogri, Hindi & English • Open-source blueprint for other pilgrim hubs (Varanasi, Tirupati)."),
]

for idx, (p_title, p_desc) in enumerate(phases_data):
    p_t = tf_rd.paragraphs[0] if idx == 0 else tf_rd.add_paragraph()
    p_t.text = p_title
    p_t.font.size = Pt(11)
    p_t.font.bold = True
    p_t.font.color.rgb = C_DARK_GREEN if "LIVE" in p_title else C_AMBER
    
    p_d = tf_rd.add_paragraph()
    p_d.text = p_desc
    p_d.font.size = Pt(10)
    p_d.font.color.rgb = C_TEXT_MUTED
    p_d.space_after = Pt(10)

# Right: Actual App Screenshot of Offline Storage & Settings
add_phone_mockup(s8, IMG_SETTINGS, Inches(9.6), Inches(1.85), Inches(2.9), Inches(4.8))

add_footer(s8)

# =============================================================================
# SLIDE 9: SUSTAINABILITY AND PRIVACY (WITH DOGRI FOOD SCREENSHOT)
# =============================================================================
s9 = prs.slides.add_slide(blank_layout)
set_slide_background(s9)
add_header(s9, 9, "Trust & Sustainability", "Civic Integrity, Zero-Surveillance Privacy & Low Footprint", "Built to protect user privacy and operate sustainably without predatory data monetization.")

# Left: 3 Core Pillars
add_card(s9, Inches(0.8), Inches(1.85), Inches(8.5), Inches(4.8))
tb_sust = s9.shapes.add_textbox(Inches(1.0), Inches(1.95), Inches(8.1), Inches(4.6))
tf_su = tb_sust.text_frame
tf_su.word_wrap = True

sust_data = [
    ("🔒 Zero-Knowledge Privacy (Google Play Compliant)", [
        "100% of user data, bookmarks, and custom plans remain strictly on-device in IndexedDB.",
        "Zero tracking cookies, zero third-party telemetry, zero location data monetization.",
        "1-Tap permanent account & local storage wipe button directly in Settings.",
    ]),
    ("🌱 Ultra-Low Resource Footprint", [
        "Lightweight 5.5 MB APK and <2 MB compressed web bundle.",
        "Runs smoothly on budget ₹6,000 Android phones without thermal throttling.",
        "OLED-friendly dark mode and high-contrast WCAG 2.1 AA modes save battery during travel.",
    ]),
    ("🤝 Sustainable Public-Private Civic Model", [
        "Non-commission directory preventing price distortion for travelers.",
        "Verified artisan and homestay listings supported by J&K Tourism development authorities.",
        "Open-source data structures contributing back to OpenStreetMap and civic archives.",
    ]),
]

for idx, (title, bullets) in enumerate(sust_data):
    p_t = tf_su.paragraphs[0] if idx == 0 else tf_su.add_paragraph()
    p_t.text = title
    p_t.font.size = Pt(12)
    p_t.font.bold = True
    p_t.font.color.rgb = C_DARK_GREEN
    
    for b in bullets:
        pb = tf_su.add_paragraph()
        pb.text = f"•  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = C_TEXT_MUTED
        pb.space_after = Pt(2)
    p_t.space_after = Pt(4)

# Right: Actual App Screenshot of Dogri Food & Dietary Safety
add_phone_mockup(s9, IMG_FOOD, Inches(9.6), Inches(1.85), Inches(2.9), Inches(4.8))

add_footer(s9)

# =============================================================================
# SLIDE 10: CLOSING PITCH AND REQUEST FOR PILOT SUPPORT
# =============================================================================
s10 = prs.slides.add_slide(blank_layout)
set_slide_background(s10, C_DARK_GREEN)

# Decorative background accent
acc10 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.7), Inches(11.733), Inches(6.05))
acc10.fill.solid()
acc10.fill.fore_color.rgb = C_FOREST_DEEP
acc10.line.color.rgb = C_GOLD
acc10.line.width = Pt(1.5)

# Badge
b10 = s10.shapes.add_textbox(Inches(1.2), Inches(1.0), Inches(10), Inches(0.35))
p_b10 = b10.text_frame.paragraphs[0]
p_b10.text = "CLOSING PITCH • PILOT CALL TO ACTION"
p_b10.font.size = Pt(10.5)
p_b10.font.bold = True
p_b10.font.color.rgb = C_GOLD

# Header
th10 = s10.shapes.add_textbox(Inches(1.2), Inches(1.35), Inches(10.5), Inches(1.1))
tf10 = th10.text_frame
p10_1 = tf10.paragraphs[0]
p10_1.text = "Partner with Us to Transform Jammu Tourism"
p10_1.font.size = Pt(34)
p10_1.font.bold = True
p10_1.font.color.rgb = C_WHITE
p10_1.font.name = FONT_HEADING

p10_2 = tf10.add_paragraph()
p10_2.text = "Let's turn a hurried 2-hour transit rush into an enriching, safe cultural gateway."
p10_2.font.size = Pt(15)
p10_2.font.color.rgb = C_GOLD

# 3 Pilot Asks
asks = [
    ("1. Transit Signage Pilot", "Permission for QR code info panels at Jammu Tawi (JAT) and SVDK Katra station concourses to give yatris instant offline guide access."),
    ("2. Tourism Dept Data Link", "Official co-branding and verification link with Directorate of Tourism, Jammu (TRC) to keep fare tables and festival schedules authoritative."),
    ("3. Shrine Board Sync", "Collaboration with SMVDSB Katra to integrate battery-car status, aarti timings, and emergency medical aid coordinates."),
]

for idx, (ask_title, ask_desc) in enumerate(asks):
    cx = Inches(1.2 + idx * 3.65)
    card10 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(2.7), Inches(3.45), Inches(2.35))
    card10.fill.solid()
    card10.fill.fore_color.rgb = C_DARK_GREEN
    card10.line.color.rgb = C_GOLD
    card10.line.width = Pt(1)

    tb = s10.shapes.add_textbox(cx + Inches(0.15), Inches(2.85), Inches(3.15), Inches(2.05))
    tf = tb.text_frame
    tf.word_wrap = True
    
    pt = tf.paragraphs[0]
    pt.text = ask_title
    pt.font.size = Pt(13)
    pt.font.bold = True
    pt.font.color.rgb = C_GOLD
    pt.font.name = FONT_HEADING
    pt.space_after = Pt(6)
    
    pd = tf.add_paragraph()
    pd.text = ask_desc
    pd.font.size = Pt(10)
    pd.font.color.rgb = C_WHITE
    pd.font.name = FONT_BODY

# Contact & Live URL Bar
bar = s10.shapes.add_textbox(Inches(1.2), Inches(5.25), Inches(10.5), Inches(1.1))
tf_bar = bar.text_frame
tf_bar.word_wrap = True

p_c1 = tf_bar.paragraphs[0]
p_c1.text = "🌐 Live Application: https://jammukhoj.in   •   ✉️ Contact: support@jammukhoj.in"
p_c1.font.size = Pt(14)
p_c1.font.bold = True
p_c1.font.color.rgb = C_WHITE
p_c1.alignment = PP_ALIGN.CENTER

p_c2 = tf_bar.add_paragraph()
p_c2.text = "Open Source • 100% Offline Progressive Web App & Android Ready • Built with Pride for Jammu"
p_c2.font.size = Pt(10.5)
p_c2.font.color.rgb = C_GOLD
p_c2.alignment = PP_ALIGN.CENTER

# -----------------------------------------------------------------------------
# SAVE PRESENTATION
# -----------------------------------------------------------------------------
output_final = os.path.abspath(os.path.join(os.getcwd(), "JammuKhoj_Pitch_Deck_Final.pptx"))
prs.save(output_final)
print(f"SUCCESS: Generated visual pitch deck with app screenshots at {output_final}")

output_standard = os.path.abspath(os.path.join(os.getcwd(), "JammuKhoj_Pitch_Deck.pptx"))
try:
    prs.save(output_standard)
    print(f"SUCCESS: Also updated {output_standard}")
except PermissionError:
    print(f"NOTE: {output_standard} is currently open in PowerPoint. The updated version is ready at {output_final}")

