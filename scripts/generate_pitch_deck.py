"""
JammuKhoj - Professional Executive Pitch Deck Generator
Redesigned with human-crafted visual hierarchy, varied architectural rhythms,
prominent brand identity on Slide 1 (logo emblem, no phone mockup), horizontal
milestone roadmap, executive comparison matrix, and high-impact closing.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# -----------------------------------------------------------------------------
# PRESENTATION & EXECUTIVE PALETTE SETUP
# -----------------------------------------------------------------------------
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Executive Brand Palette (Jammu Shivalik & Royal Dogra Heritage)
C_DARK_GREEN = RGBColor(11, 61, 51)     # #0B3D33 Deep Pine Slate
C_FOREST_DEEP = RGBColor(7, 36, 30)     # #07241E Midnight Pine
C_AMBER = RGBColor(168, 77, 14)         # #A84D0E Warm Terracotta
C_GOLD = RGBColor(217, 130, 16)         # #D98210 Warm Temple Gold
C_LIGHT_BG = RGBColor(250, 247, 242)    # #FAF7F2 Executive Warm Cream
C_WHITE = RGBColor(255, 255, 255)
C_CARD_BG = RGBColor(255, 255, 255)
C_CARD_BORDER = RGBColor(228, 220, 210) # Soft neutral border
C_TEXT_INK = RGBColor(24, 34, 30)       # Charcoal Slate ink
C_TEXT_MUTED = RGBColor(95, 110, 103)   # Editorial Muted slate
C_ACCENT_BG = RGBColor(243, 238, 230)   # Sand accent fill
C_DEVICE_FRAME = RGBColor(20, 26, 24)   # Phone bezel
C_EMERALD = RGBColor(16, 122, 60)       # Success Green
C_LIGHT_GREEN_TINT = RGBColor(238, 247, 242)

FONT_HEADING = "Georgia"
FONT_BODY = "Arial"

blank_layout = prs.slide_layouts[6]

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
# REUSABLE COMPONENT HELPERS
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
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.74), Inches(11.7), Inches(0.65))
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
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.36), Inches(11.7), Inches(0.4))
        tf_s = sub_box.text_frame
        tf_s.word_wrap = True
        p_s = tf_s.paragraphs[0]
        p_s.text = subtitle
        p_s.font.size = Pt(11.5)
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
    bezel = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    bezel.fill.solid()
    bezel.fill.fore_color.rgb = C_DEVICE_FRAME
    bezel.line.color.rgb = C_GOLD
    bezel.line.width = Pt(1.5)

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
# SLIDE 1: EXECUTIVE TITLE COVER (LOGO FOCUS, NO PHONE MOCKUP)
# =============================================================================
s1 = prs.slides.add_slide(blank_layout)
set_slide_background(s1, C_DARK_GREEN)

# Decorative architectural frame
frame = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.7), Inches(0.6), Inches(11.933), Inches(6.3))
frame.fill.solid()
frame.fill.fore_color.rgb = C_FOREST_DEEP
frame.line.color.rgb = C_GOLD
frame.line.width = Pt(1.5)

# Centered App Logo Image (The user explicitly requested logo, not phone image on page 1)
logo_size = Inches(1.8)
logo_left = Inches((13.333 - 1.8) / 2)  # Centered
logo_top = Inches(1.05)
if os.path.exists(IMG_LOGO):
    s1.shapes.add_picture(IMG_LOGO, logo_left, logo_top, logo_size, logo_size)

# Category pill above title
cat1 = s1.shapes.add_textbox(Inches(1.5), Inches(2.95), Inches(10.333), Inches(0.35))
tf_c1 = cat1.text_frame
tf_c1.word_wrap = True
p_c1 = tf_c1.paragraphs[0]
p_c1.text = "OFFLINE-FIRST CIVIC TRAVEL INNOVATION • JAMMU DIVISION & VAISHNO DEVI"
p_c1.alignment = PP_ALIGN.CENTER
p_c1.font.size = Pt(10.5)
p_c1.font.bold = True
p_c1.font.color.rgb = C_GOLD
p_c1.font.name = FONT_BODY

# Main Brand Title
tb_title = s1.shapes.add_textbox(Inches(1.5), Inches(3.3), Inches(10.333), Inches(1.15))
tf_title = tb_title.text_frame
tf_title.word_wrap = True
p_t1 = tf_title.paragraphs[0]
p_t1.text = "JammuKhoj"
p_t1.alignment = PP_ALIGN.CENTER
p_t1.font.size = Pt(46)
p_t1.font.bold = True
p_t1.font.color.rgb = C_WHITE
p_t1.font.name = FONT_HEADING

p_t2 = tf_title.add_paragraph()
p_t2.text = "जम्मू खोज • Your Jammu Journey, Made Simple."
p_t2.alignment = PP_ALIGN.CENTER
p_t2.font.size = Pt(16.5)
p_t2.font.color.rgb = C_GOLD
p_t2.font.name = FONT_BODY

# One-sentence Executive Proposition
tb_prop = s1.shapes.add_textbox(Inches(2.0), Inches(4.55), Inches(9.333), Inches(0.75))
tf_prop = tb_prop.text_frame
tf_prop.word_wrap = True
p_pr = tf_prop.paragraphs[0]
p_pr.text = (
    "A production-ready progressive web app & Android platform engineered for transit layovers "
    "and Mata Vaishno Devi pilgrims. 100% offline-ready with conservative train/flight safety buffers, "
    "transparent transport fare matrices, step-free senior guidance, and zero-tracking privacy."
)
p_pr.alignment = PP_ALIGN.CENTER
p_pr.font.size = Pt(12)
p_pr.font.color.rgb = C_WHITE
p_pr.font.name = FONT_BODY

# 4 Executive Highlight Pills (Horizontal Row)
pills = [
    ("⚡ 1-Tap Buffer Planner", "4h, 8h & 24h layover circuits"),
    ("📶 100% Offline IndexedDB", "Vector maps & full routing offline"),
    ("🚌 Transparent Transit", "Matadors (₹10-25), Autos & Taxis"),
    ("🧓 Senior & Pilgrim Ease", "Step-free, battery cars & 112 SOS"),
]

for idx, (p_title, p_sub) in enumerate(pills):
    px = Inches(1.15 + idx * 2.78)
    py = Inches(5.4)
    pill_shape = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, py, Inches(2.65), Inches(0.82))
    pill_shape.fill.solid()
    pill_shape.fill.fore_color.rgb = C_DARK_GREEN
    pill_shape.line.color.rgb = C_GOLD
    pill_shape.line.width = Pt(1)

    ptb = s1.shapes.add_textbox(px + Inches(0.08), py + Inches(0.06), Inches(2.5), Inches(0.7))
    ptf = ptb.text_frame
    ptf.word_wrap = True
    pp1 = ptf.paragraphs[0]
    pp1.text = p_title
    pp1.font.size = Pt(10)
    pp1.font.bold = True
    pp1.font.color.rgb = C_GOLD
    pp1.alignment = PP_ALIGN.CENTER
    
    pp2 = ptf.add_paragraph()
    pp2.text = p_sub
    pp2.font.size = Pt(8.5)
    pp2.font.color.rgb = C_WHITE
    pp2.alignment = PP_ALIGN.CENTER

# Presenter & Verification Metadata Footer
m_box = s1.shapes.add_textbox(Inches(1.5), Inches(6.38), Inches(10.333), Inches(0.35))
tf_m = m_box.text_frame
p_m = tf_m.paragraphs[0]
p_m.text = "Production Release • October 2026 • Live Demo: https://jammukhoj.in • 44/44 Verified High-Level Tests Passing"
p_m.alignment = PP_ALIGN.CENTER
p_m.font.size = Pt(9.5)
p_m.font.color.rgb = RGBColor(180, 200, 192)


# =============================================================================
# SLIDE 2: PROBLEM STATEMENT & TRANSIT ANXIETY (INFOGRAPHIC 3-PILLAR)
# =============================================================================
s2 = prs.slides.add_slide(blank_layout)
set_slide_background(s2)
add_header(s2, 2, "Problem Statement", "The Transit Anxiety & Information Vacuum in Jammu", "Why millions of pilgrims pass through Jammu with friction, fear, and zero local discovery.")

# Top Context Banner Card
b_top = add_card(s2, Inches(0.8), Inches(1.85), Inches(11.733), Inches(0.75), bg_color=C_ACCENT_BG, border_color=C_GOLD)
tb_bt = s2.shapes.add_textbox(Inches(0.95), Inches(1.9), Inches(11.4), Inches(0.65))
tf_bt = tb_bt.text_frame
tf_bt.word_wrap = True
p_bt1 = tf_bt.paragraphs[0]
p_bt1.text = "THE CORE DILEMMA: Jammu is treated as a high-friction railway transfer point rather than a cultural destination."
p_bt1.font.size = Pt(11)
p_bt1.font.bold = True
p_bt1.font.color.rgb = C_DARK_GREEN
p_bt2 = tf_bt.add_paragraph()
p_bt2.text = "Over 10 Million yatris enter annually, yet fear of missing departures keeps them trapped on waiting platforms without guidance."
p_bt2.font.size = Pt(9.5)
p_bt2.font.color.rgb = C_TEXT_MUTED

# 3 Focused Vertical Problem Pillars
p_cards = [
    ("🚨 01. The Transit Panic", "Fear of Missing Onward Trains / Flights", [
        "Pilgrims face 4 to 12 hour layovers at Jammu Tawi or IXJ Airport.",
        "Fear of mountain highway bottlenecks traps families on railway platforms.",
        "Zero existing tools compute guaranteed conservative safety return buffers.",
        "Result: Over 85% of visitors never step outside the station compound.",
    ]),
    ("💸 02. The ₹1,200 Haggling Tax", "Unregulated Fares & Commuter Harassment", [
        "Unsuspecting yatris routinely charged ₹800–₹1,500 for a ₹150 taxi ride.",
        "Matador mini-bus stages and route numbers are completely opaque to outsiders.",
        "Zero visibility into official prepaid auto/taxi union rate cards.",
        "Result: Tourists feel exploited within their first hour in Jammu.",
    ]),
    ("📴 03. The Mountain Blackout", "Cellular Dead Zones & Elder Strain", [
        "Cloud-based travel apps crash in Shivalik foothill tunnels and dead zones.",
        "Senior citizens face unexpected steep stairs without wheelchair/battery-car guidance.",
        "Emergency hotlines and National ERSS 112 are scattered across fragmented websites.",
        "Result: Families with elders experience high physical and mental stress.",
    ]),
]

for idx, (head, subhead, bullets) in enumerate(p_cards):
    c_left = Inches(0.8 + idx * 3.95)
    add_card(s2, c_left, Inches(2.75), Inches(3.833), Inches(4.05))
    
    tb = s2.shapes.add_textbox(c_left + Inches(0.18), Inches(2.9), Inches(3.47), Inches(3.75))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = head
    p1.font.size = Pt(13.5)
    p1.font.bold = True
    p1.font.color.rgb = C_AMBER
    p1.font.name = FONT_HEADING
    
    p2 = tf.add_paragraph()
    p2.text = subhead
    p2.font.size = Pt(10.5)
    p2.font.bold = True
    p2.font.color.rgb = C_TEXT_INK
    p2.space_after = Pt(8)
    
    for b in bullets:
        pb = tf.add_paragraph()
        pb.text = f"•  {b}"
        pb.font.size = Pt(9.5)
        pb.font.color.rgb = C_TEXT_MUTED
        pb.space_after = Pt(5)

add_footer(s2)


# =============================================================================
# SLIDE 3: THE VISITOR-DISCOVERY GAP (METRICS & ECONOMIC LEAKAGE)
# =============================================================================
s3 = prs.slides.add_slide(blank_layout)
set_slide_background(s3)
add_header(s3, 3, "Economic & Cultural Gap", "The 10-Million Pilgrim Paradox: Direct Transit Bypass", "Immense visitor footfall that completely bypasses Jammu's cultural and economic ecosystem.")

# Left Metric Highlight Card (Dark executive style)
add_card(s3, Inches(0.8), Inches(1.85), Inches(4.5), Inches(4.9), bg_color=C_DARK_GREEN)
tb_l = s3.shapes.add_textbox(Inches(1.0), Inches(2.05), Inches(4.1), Inches(4.5))
tf_l = tb_l.text_frame
tf_l.word_wrap = True

p_m1 = tf_l.paragraphs[0]
p_m1.text = "10,000,000+"
p_m1.font.size = Pt(40)
p_m1.font.bold = True
p_m1.font.color.rgb = C_GOLD
p_m1.font.name = FONT_HEADING

p_m2 = tf_l.add_paragraph()
p_m2.text = "Annual pilgrims transit through Jammu Tawi & Katra to reach Shri Mata Vaishno Devi Shrine."
p_m2.font.size = Pt(12)
p_m2.font.color.rgb = C_WHITE
p_m2.space_after = Pt(18)

p_m3 = tf_l.add_paragraph()
p_m3.text = "< 2 Hours"
p_m3.font.size = Pt(32)
p_m3.font.bold = True
p_m3.font.color.rgb = C_GOLD
p_m3.font.name = FONT_HEADING

p_m4 = tf_l.add_paragraph()
p_m4.text = "Average transit dwell in Jammu City. Over 85% of yatris treat Jammu as a mere train-to-bus transit hallway."
p_m4.font.size = Pt(11.5)
p_m4.font.color.rgb = C_WHITE
p_m4.space_after = Pt(16)

p_m5 = tf_l.add_paragraph()
p_m5.text = "₹300+ Crores"
p_m5.font.size = Pt(28)
p_m5.font.bold = True
p_m5.font.color.rgb = C_GOLD
p_m5.font.name = FONT_HEADING

p_m6 = tf_l.add_paragraph()
p_m6.text = "Estimated annual municipal revenue lost in local hospitality, authentic craft, and cultural transit."
p_m6.font.size = Pt(11)
p_m6.font.color.rgb = C_WHITE

# Right: The 4 Specific Consequences Breakdown
add_card(s3, Inches(5.6), Inches(1.85), Inches(6.933), Inches(4.9))
tb_r = s3.shapes.add_textbox(Inches(5.8), Inches(2.05), Inches(6.5), Inches(4.5))
tf_r = tb_r.text_frame
tf_r.word_wrap = True

p_rt = tf_r.paragraphs[0]
p_rt.text = "Where the Visitor Value Is Lost"
p_rt.font.size = Pt(17)
p_rt.font.bold = True
p_rt.font.color.rgb = C_DARK_GREEN
p_rt.font.name = FONT_HEADING
p_rt.space_after = Pt(10)

gap_items = [
    ("🏛️ Heritage Neglect", "Mubarak Mandi Palace (seat of Dogra dynasty), Bahu Fort (3000-yr landmark), and Amar Mahal witness <5% of pilgrim footfall due to missing structured half-day circuits."),
    ("🛍️ GI Craft Exploitation", "Authentic Dogra crafts (Basohli Paintings, Pashmina, Basohli Tweed, Bhaderwah Rajmash) lose sales to roadside counterfeit stalls because visitors lack a verified artisan directory."),
    ("🍲 Forgotten Culinary Economy", "Indigenous nutritious Dogra delicacies (Kaladi Kulcha, Dogra Dham, Sund Panjeeri) lose out to generic highway fast food due to lack of hygienic, verified food trails."),
    ("📉 Transit Inefficiency", "Public Matador mini-buses and E-buses run with irregular passenger loads while private touts crowd station gates, driving congestion and commuter dissatisfaction."),
]

for g_title, g_desc in gap_items:
    p_gt = tf_r.add_paragraph()
    p_gt.text = g_title
    p_gt.font.size = Pt(11.5)
    p_gt.font.bold = True
    p_gt.font.color.rgb = C_AMBER
    
    p_gd = tf_r.add_paragraph()
    p_gd.text = g_desc
    p_gd.font.size = Pt(10)
    p_gd.font.color.rgb = C_TEXT_MUTED
    p_gd.space_after = Pt(6)

add_footer(s3)


# =============================================================================
# SLIDE 4: THE JAMMUKHOJ SOLUTION (SOLUTIONS + PHONE SHOWCASE)
# =============================================================================
s4 = prs.slides.add_slide(blank_layout)
set_slide_background(s4)
add_header(s4, 4, "The Solution Architecture", "JammuKhoj: An Intelligent, Resilient Local Guide", "A human-centered progressive application tailored for zero-data environments and time-critical pilgrims.")

# Left 2 Architecture Cards
sol_cards_left = [
    ("⚡ 1-Tap Buffer-Safe Engine", "Deterministic layover itinerary engine tailored to traveler's exact departure deadline (4h Express, 8h Cultural, 24h Valley trail). Enforces a strict 45-min rail buffer & 150-min air buffer, eliminating missed departures."),
    ("📶 100% Offline Vector Stack", "Entire knowledge graph (36+ attractions, road topologies, timetables, dialer hotlines) bundled in local IndexedDB. Operates with zero SIM or data roaming in mountain valleys."),
]

for idx, (title, desc) in enumerate(sol_cards_left):
    c_y = Inches(1.85 + idx * 2.5)
    add_card(s4, Inches(0.8), c_y, Inches(4.3), Inches(2.35))
    
    tb = s4.shapes.add_textbox(Inches(0.95), c_y + Inches(0.18), Inches(4.0), Inches(2.0))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = C_DARK_GREEN
    p.font.name = FONT_HEADING
    p.space_after = Pt(4)
    
    pd = tf.add_paragraph()
    pd.text = desc
    pd.font.size = Pt(10)
    pd.font.color.rgb = C_TEXT_MUTED

# Center: Real Phone Mockup of 1-Tap Home Screen (Demonstrating the solution)
add_phone_mockup(s4, IMG_HOME_PLANNER, Inches(5.3), Inches(1.85), Inches(2.7), Inches(4.9))

# Right 2 Architecture Cards
sol_cards_right = [
    ("🚌 Transparent Transit Intelligence", "Verified stage-by-stage Matador mini-bus routes, Smart City E-bus stops, and prepaid union matrices for auto-rickshaws and taxis to end passenger overcharging."),
    ("🧓 Elder & Accessibility Care", "Step-free badges, walking load indicators (Low/Med/High), verified Vaishno Devi 5-stage trek manual, battery-car regulations, and 1-tap ERSS 112 WhatsApp location SOS."),
]

for idx, (title, desc) in enumerate(sol_cards_right):
    c_y = Inches(1.85 + idx * 2.5)
    add_card(s4, Inches(8.2), c_y, Inches(4.333), Inches(2.35))
    
    tb = s4.shapes.add_textbox(Inches(8.35), c_y + Inches(0.18), Inches(4.0), Inches(2.0))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = C_DARK_GREEN
    p.font.name = FONT_HEADING
    p.space_after = Pt(4)
    
    pd = tf.add_paragraph()
    pd.text = desc
    pd.font.size = Pt(10)
    pd.font.color.rgb = C_TEXT_MUTED

add_footer(s4)


# =============================================================================
# SLIDE 5: USER JOURNEY (HORIZONTAL 5-STAGE FLOW + SCREENSHOT)
# =============================================================================
s5 = prs.slides.add_slide(blank_layout)
set_slide_background(s5)
add_header(s5, 5, "Seamless User Journey", "From Station Arrival to Holy Darshan in 5 Frictionless Steps", "Designed for immediate value without forced registration, heavy downloads, or steep learning curves.")

# Left: 5 Structured Steps
steps_card = add_card(s5, Inches(0.8), Inches(1.85), Inches(8.5), Inches(4.9))
tb_steps = s5.shapes.add_textbox(Inches(1.0), Inches(1.95), Inches(8.1), Inches(4.7))
tf_st = tb_steps.text_frame
tf_st.word_wrap = True

steps_data = [
    ("1. Arrival at Station / Airport", "Yatri steps off train at Jammu Tawi (JAT) or IXJ Airport. Opens jammukhoj.in directly with 1 tap. Zero mandatory app-store download or login wall."),
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
    p_d.font.size = Pt(9.5)
    p_d.font.color.rgb = C_TEXT_INK
    p_d.space_after = Pt(6)

# Right: Actual App Screenshot of Generated Itinerary
add_phone_mockup(s5, IMG_ITINERARY, Inches(9.6), Inches(1.85), Inches(2.933), Inches(4.9))

add_footer(s5)


# =============================================================================
# SLIDE 6: COMPETITIVE DIFFERENTIATION (POLISHED MATRIX TABLE)
# =============================================================================
s6 = prs.slides.add_slide(blank_layout)
set_slide_background(s6)
add_header(s6, 6, "Competitive Differentiation", "How JammuKhoj Outperforms Generic Travel Platforms", "Direct comparison against Google Maps, MakeMyTrip, and generic travel blogs.")

# Left Comparison Table
t_left = Inches(0.8)
t_top = Inches(1.85)
t_width = Inches(8.5)
t_height = Inches(4.9)

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
        if c_idx == 3:
            cell.fill.fore_color.rgb = C_LIGHT_GREEN_TINT
        else:
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
add_phone_mockup(s6, IMG_EXPLORE, Inches(9.6), Inches(1.85), Inches(2.933), Inches(4.9))

add_footer(s6)


# =============================================================================
# SLIDE 7: EXPECTED IMPACT AND MEASURABLE TARGETS (EXECUTIVE METRICS)
# =============================================================================
s7 = prs.slides.add_slide(blank_layout)
set_slide_background(s7)
add_header(s7, 7, "Impact & Metrics", "Measurable Economic, Civic, and Social Outcomes", "High-leverage socio-economic returns for pilgrims, local businesses, and municipal transit.")

# Top 4 Metrics Tiles (Elevated human design)
metrics = [
    ("3x", "Dwell Multiplier", "Extending transit stay from <2h to 6-8h through safe itineraries."),
    ("₹150 Cr+", "Economic Target", "Direct injection into local Dogra food, crafts & certified transit."),
    ("₹1,200", "Avg Family Savings", "Preventing exploitative cab fares and spurious roadside craft purchases."),
    ("0", "Missed Departures", "100% adherence to conservative rail & flight safety buffers."),
]

for idx, (val, label, sub) in enumerate(metrics):
    c_left = Inches(0.8 + idx * 2.95)
    add_card(s7, c_left, Inches(1.85), Inches(2.8), Inches(1.95), bg_color=C_DARK_GREEN)
    
    tb = s7.shapes.add_textbox(c_left + Inches(0.12), Inches(1.95), Inches(2.56), Inches(1.75))
    tf = tb.text_frame
    tf.word_wrap = True
    
    pv = tf.paragraphs[0]
    pv.text = val
    pv.font.size = Pt(32)
    pv.font.bold = True
    pv.font.color.rgb = C_GOLD
    pv.font.name = FONT_HEADING
    
    pl = tf.add_paragraph()
    pl.text = label
    pl.font.size = Pt(11)
    pl.font.bold = True
    pl.font.color.rgb = C_WHITE
    
    ps = tf.add_paragraph()
    ps.text = sub
    ps.font.size = Pt(8.5)
    ps.font.color.rgb = C_ACCENT_BG

# Bottom Row: 2 Rich Socio-Economic Impact Cards (Full width split)
card_b1 = add_card(s7, Inches(0.8), Inches(3.95), Inches(5.75), Inches(2.8))
tb_b1 = s7.shapes.add_textbox(Inches(1.0), Inches(4.05), Inches(5.35), Inches(2.6))
tf_b1 = tb_b1.text_frame
tf_b1.word_wrap = True
p1 = tf_b1.paragraphs[0]
p1.text = "🏛️ Cultural & GI Heritage Renaissance"
p1.font.size = Pt(13)
p1.font.bold = True
p1.font.color.rgb = C_DARK_GREEN
p1.font.name = FONT_HEADING
p1.space_after = Pt(4)
p2 = tf_b1.add_paragraph()
p2.text = (
    "Empowers Basohli miniature painters, Pashmina weavers, and Bhaderwah Rajmash farmers "
    "with verified outlet discovery and fake-identification guides. Pilgrims purchase authentic "
    "GI certified heritage at fair benchmark prices directly supporting traditional craft families."
)
p2.font.size = Pt(10)
p2.font.color.rgb = C_TEXT_MUTED

card_b2 = add_card(s7, Inches(6.783), Inches(3.95), Inches(5.75), Inches(2.8))
tb_b2 = s7.shapes.add_textbox(Inches(6.983), Inches(4.05), Inches(5.35), Inches(2.6))
tf_b2 = tb_b2.text_frame
tf_b2.word_wrap = True
p3 = tf_b2.paragraphs[0]
p3.text = "🛡️ Public Safety & Yatra Welfare"
p3.font.size = Pt(13)
p3.font.bold = True
p3.font.color.rgb = C_DARK_GREEN
p3.font.name = FONT_HEADING
p3.space_after = Pt(4)
p4 = tf_b2.add_paragraph()
p4.text = (
    "1-Tap WhatsApp GPS SOS dispatcher and offline dialers for ERSS 112, SMVDSB Shrine Helplines, "
    "and women's assistance. Real-time dynamic temple crowd meters and aarti timings prevent "
    "stampedes and reduce elder exhaustion during Navratri surges."
)
p4.font.size = Pt(10)
p4.font.color.rgb = C_TEXT_MUTED

add_footer(s7)


# =============================================================================
# SLIDE 8: IMPLEMENTATION ROADMAP (HORIZONTAL TIMELINE STEPPER)
# =============================================================================
s8 = prs.slides.add_slide(blank_layout)
set_slide_background(s8)
add_header(s8, 8, "Execution Roadmap", "4-Stage Scalable Deployment Plan (2026 – 2027)", "From proven progressive web app & Android build to institutional statewide rollout.")

phases_data = [
    ("Phase 1: Foundation", "LIVE IN PRODUCTION", C_DARK_GREEN, [
        "Live on jammukhoj.in domain",
        "100% offline PWA & Android APK",
        "36+ curated attractions & maps",
        "44 automated unit & E2E tests passing",
        "1-Tap buffer planner & transit matrix",
    ]),
    ("Phase 2: Transit Node Pilot", "Q1-Q2 2027", C_AMBER, [
        "QR kiosks at Jammu Tawi & Katra concourses",
        "J&K Smart City e-bus live GPS sync",
        "Onboard 50+ verified local dhabas & GI shops",
        "Target: 50,000 monthly active yatris",
    ]),
    ("Phase 3: Institutional Sync", "Q3 2027", C_DARK_GREEN, [
        "Official J&K Tourism Directorate endorsement",
        "SMVDSB Katra battery-car & RFID tie-in",
        "Northern Railway Yatri Niwas booking cross-links",
        "Target: 250,000 active pilgrim users",
    ]),
    ("Phase 4: Ecosystem Scale", "Q4 2027+", C_GOLD, [
        "Expansion to Bhaderwah, Kishtwar, Poonch & Rajouri",
        "Audio heritage guides in Dogri, Hindi & English",
        "Open-source blueprint for Varanasi & Tirupati",
        "Self-sustaining civic non-commission model",
    ]),
]

for idx, (title, tag, tag_color, bullets) in enumerate(phases_data):
    cx = Inches(0.8 + idx * 2.95)
    cy = Inches(1.85)
    cw = Inches(2.8)
    ch = Inches(4.9)
    
    add_card(s8, cx, cy, cw, ch)
    
    # Status Tag Pill
    tag_shape = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx + Inches(0.15), cy + Inches(0.2), Inches(2.5), Inches(0.4))
    tag_shape.fill.solid()
    tag_shape.fill.fore_color.rgb = tag_color
    tag_shape.line.fill.background()
    
    tf_tag = tag_shape.text_frame
    p_tag = tf_tag.paragraphs[0]
    p_tag.text = tag
    p_tag.alignment = PP_ALIGN.CENTER
    p_tag.font.size = Pt(9)
    p_tag.font.bold = True
    p_tag.font.color.rgb = C_WHITE
    
    # Content Box
    tb = s8.shapes.add_textbox(cx + Inches(0.15), cy + Inches(0.7), Inches(2.5), Inches(4.0))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(12)
    p1.font.bold = True
    p1.font.color.rgb = C_DARK_GREEN
    p1.font.name = FONT_HEADING
    p1.space_after = Pt(10)
    
    for b in bullets:
        pb = tf.add_paragraph()
        pb.text = f"✔ {b}" if "LIVE" in tag else f"• {b}"
        pb.font.size = Pt(9.2)
        pb.font.color.rgb = C_TEXT_INK if "LIVE" in tag else C_TEXT_MUTED
        pb.space_after = Pt(5)

add_footer(s8)


# =============================================================================
# SLIDE 9: SUSTAINABILITY AND PRIVACY (3 STRUCTURED TRUST PILLARS)
# =============================================================================
s9 = prs.slides.add_slide(blank_layout)
set_slide_background(s9)
add_header(s9, 9, "Trust & Sustainability", "Civic Integrity, Zero-Surveillance Privacy & Low Footprint", "Built to protect user privacy and operate sustainably without predatory data monetization.")

sust_pillars = [
    ("🔒 Zero-Surveillance Privacy", "Google Play & Privacy Act Compliant", [
        "100% of user data, bookmarks, and custom plans remain strictly on-device in IndexedDB.",
        "Zero tracking cookies, zero third-party telemetry, zero location data monetization.",
        "Zero mandatory registration barrier: full functionality available to guests.",
        "1-Tap permanent account & local storage wipe button directly in Settings.",
    ]),
    ("🌱 Ultra-Low Resource Footprint", "Engineered for Mountain Transit", [
        "Lightweight 5.5 MB APK and <2 MB compressed web bundle.",
        "Runs smoothly on budget ₹6,000 Android phones without thermal throttling.",
        "Offline-first vector maps consume zero background cellular data.",
        "OLED-friendly dark mode and high-contrast WCAG 2.1 AA modes conserve traveler battery.",
    ]),
    ("🤝 Sustainable Civic Model", "Public Benefit, Non-Commission", [
        "Non-commission directory preventing price inflation for travelers.",
        "Verified artisan and homestay listings supported by J&K Tourism development authorities.",
        "Open-source data structures contributing back to OpenStreetMap and civic archives.",
        "Scalable cloud architecture hosted efficiently with negligible monthly operational cost.",
    ]),
]

for idx, (title, subhead, bullets) in enumerate(sust_pillars):
    cx = Inches(0.8 + idx * 3.95)
    cy = Inches(1.85)
    cw = Inches(3.833)
    ch = Inches(4.9)
    
    add_card(s9, cx, cy, cw, ch)
    
    tb = s9.shapes.add_textbox(cx + Inches(0.2), cy + Inches(0.2), Inches(3.433), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(13.5)
    p1.font.bold = True
    p1.font.color.rgb = C_DARK_GREEN
    p1.font.name = FONT_HEADING
    
    p2 = tf.add_paragraph()
    p2.text = subhead
    p2.font.size = Pt(10)
    p2.font.bold = True
    p2.font.color.rgb = C_AMBER
    p2.space_after = Pt(10)
    
    for b in bullets:
        pb = tf.add_paragraph()
        pb.text = f"• {b}"
        pb.font.size = Pt(9.5)
        pb.font.color.rgb = C_TEXT_MUTED
        pb.space_after = Pt(6)

add_footer(s9)


# =============================================================================
# SLIDE 10: CLOSING PITCH & PILOT ASKS (EXECUTIVE CALL TO ACTION)
# =============================================================================
s10 = prs.slides.add_slide(blank_layout)
set_slide_background(s10, C_DARK_GREEN)

# Decorative background accent
acc10 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.7), Inches(0.6), Inches(11.933), Inches(6.3))
acc10.fill.solid()
acc10.fill.fore_color.rgb = C_FOREST_DEEP
acc10.line.color.rgb = C_GOLD
acc10.line.width = Pt(1.5)

# Badge
b10 = s10.shapes.add_textbox(Inches(1.2), Inches(0.9), Inches(10.5), Inches(0.35))
p_b10 = b10.text_frame.paragraphs[0]
p_b10.text = "CLOSING PITCH • PILOT CALL TO ACTION"
p_b10.font.size = Pt(10.5)
p_b10.font.bold = True
p_b10.font.color.rgb = C_GOLD

# Header
th10 = s10.shapes.add_textbox(Inches(1.2), Inches(1.25), Inches(10.5), Inches(1.15))
tf10 = th10.text_frame
p10_1 = tf10.paragraphs[0]
p10_1.text = "Partner with Us to Transform Jammu Tourism"
p10_1.font.size = Pt(36)
p10_1.font.bold = True
p10_1.font.color.rgb = C_WHITE
p10_1.font.name = FONT_HEADING

p10_2 = tf10.add_paragraph()
p10_2.text = "Turn a hurried 2-hour transit rush into an enriching, safe cultural gateway for 10 million yatris."
p10_2.font.size = Pt(14)
p10_2.font.color.rgb = C_GOLD

# 3 Pilot Asks
asks = [
    ("1. Transit Signage Pilot", "Permission for QR code info panels at Jammu Tawi (JAT) and SVDK Katra station concourses to give yatris instant offline guide access."),
    ("2. Tourism Dept Data Link", "Official co-branding and verification link with Directorate of Tourism, Jammu (TRC) to keep fare tables and festival schedules authoritative."),
    ("3. Shrine Board Sync", "Collaboration with SMVDSB Katra to integrate battery-car status, aarti timings, and emergency medical aid coordinates."),
]

for idx, (ask_title, ask_desc) in enumerate(asks):
    cx = Inches(1.2 + idx * 3.65)
    card10 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(2.65), Inches(3.45), Inches(2.4))
    card10.fill.solid()
    card10.fill.fore_color.rgb = C_DARK_GREEN
    card10.line.color.rgb = C_GOLD
    card10.line.width = Pt(1)

    tb = s10.shapes.add_textbox(cx + Inches(0.15), Inches(2.8), Inches(3.15), Inches(2.1))
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
    pd.font.size = Pt(9.8)
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
# SAVE PRESENTATIONS
# -----------------------------------------------------------------------------
output_final = os.path.abspath(os.path.join(os.getcwd(), "JammuKhoj_Pitch_Deck_Final.pptx"))
prs.save(output_final)
print(f"SUCCESS: Generated executive pitch deck at {output_final}")

output_standard = os.path.abspath(os.path.join(os.getcwd(), "JammuKhoj_Pitch_Deck.pptx"))
try:
    prs.save(output_standard)
    print(f"SUCCESS: Also saved to {output_standard}")
except PermissionError:
    print(f"NOTE: {output_standard} is open in another process. Maintained {output_final}")
