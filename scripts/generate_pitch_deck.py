"""
JammuKhoj - Professional Pitch Deck Generator
Generates a 16:9 widescreen presentation (10 slides) using python-pptx.
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

# Color constants
C_DARK_GREEN = RGBColor(8, 84, 68)     # #085444 Deep Forest
C_FOREST = RGBColor(18, 62, 56)        # #123E38 Forest Ink
C_AMBER = RGBColor(158, 74, 12)        # #9E4A0C Royal Amber
C_GOLD = RGBColor(217, 119, 6)         # #D97706 Warm Gold
C_LIGHT_BG = RGBColor(251, 249, 245)   # #FBF9F5 Sand
C_WHITE = RGBColor(255, 255, 255)
C_CARD_BG = RGBColor(255, 255, 255)
C_CARD_BORDER = RGBColor(235, 228, 220)# #EBE4DC
C_TEXT_INK = RGBColor(28, 41, 35)      # #1C2923
C_TEXT_MUTED = RGBColor(100, 116, 108) # Muted green-stone
C_ACCENT_BG = RGBColor(243, 239, 234)
C_EMERALD = RGBColor(21, 128, 61)
C_ROSE = RGBColor(190, 18, 60)

FONT_HEADING = "Georgia"
FONT_BODY = "Arial"

blank_layout = prs.slide_layouts[6]  # Blank slide

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
    cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(10), Inches(0.4))
    tf_c = cat_box.text_frame
    tf_c.word_wrap = True
    p_c = tf_c.paragraphs[0]
    p_c.text = f"{slide_num:02d} | {category.upper()}"
    p_c.font.size = Pt(11)
    p_c.font.bold = True
    p_c.font.color.rgb = C_AMBER
    p_c.font.name = FONT_BODY

    # Main Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.5), Inches(0.65))
    tf_t = title_box.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    p_t.text = title
    p_t.font.size = Pt(24)
    p_t.font.bold = True
    p_t.font.color.rgb = C_DARK_GREEN
    p_t.font.name = FONT_HEADING

    # Subtitle
    if subtitle:
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.42), Inches(11.5), Inches(0.4))
        tf_s = sub_box.text_frame
        tf_s.word_wrap = True
        p_s = tf_s.paragraphs[0]
        p_s.text = subtitle
        p_s.font.size = Pt(13)
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

def add_footer(slide, text="JammuKhoj • Smart Tourism & Pilgrim Companion • https://jammukhoj.in"):
    f_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.7), Inches(0.35))
    tf = f_box.text_frame
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(9.5)
    p.font.color.rgb = C_TEXT_MUTED
    p.font.name = FONT_BODY

# =============================================================================
# SLIDE 1: PROJECT INTRODUCTION
# =============================================================================
s1 = prs.slides.add_slide(blank_layout)
set_slide_background(s1, C_DARK_GREEN)

# Decorative background accent
acc = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9))
acc.fill.solid()
acc.fill.fore_color.rgb = C_FOREST
acc.line.color.rgb = C_GOLD
acc.line.width = Pt(1.5)

# Badge
badge = s1.shapes.add_textbox(Inches(1.2), Inches(1.2), Inches(10), Inches(0.4))
p_b = badge.text_frame.paragraphs[0]
p_b.text = "OFFLINE-FIRST CIVIC TRAVEL INNOVATION • JAMMU DIVISION & VAISHNO DEVI"
p_b.font.size = Pt(11)
p_b.font.bold = True
p_b.font.color.rgb = C_GOLD
p_b.font.name = FONT_BODY

# Title
t_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.7), Inches(10.5), Inches(1.4))
tf_1 = t_box.text_frame
p1_1 = tf_1.paragraphs[0]
p1_1.text = "JammuKhoj"
p1_1.font.size = Pt(46)
p1_1.font.bold = True
p1_1.font.color.rgb = C_WHITE
p1_1.font.name = FONT_HEADING

p1_2 = tf_1.add_paragraph()
p1_2.text = "जम्मू खोज • Your Jammu Journey, Made Simple."
p1_2.font.size = Pt(20)
p1_2.font.color.rgb = C_GOLD
p1_2.font.name = FONT_BODY

# Subtitle / Summary
desc_box = s1.shapes.add_textbox(Inches(1.2), Inches(3.3), Inches(10.5), Inches(1.2))
p_desc = desc_box.text_frame.paragraphs[0]
p_desc.text = (
    "A smart, privacy-centric tourism and pilgrimage companion engineered for visitors, "
    "transit layovers, and Mata Vaishno Devi pilgrims across the Jammu Division. "
    "100% offline-ready with conservative train/flight safety buffers, transparent transport benchmarks, "
    "and verified civic assistance."
)
p_desc.font.size = Pt(14)
p_desc.font.color.rgb = C_WHITE
p_desc.font.name = FONT_BODY

# 4 Key Value Pillar Cards
cols = [
    ("⚡ 1-Tap Buffer-Safe Planner", "Express 4h, 8h & 24h circuits preserving departure safety buffers"),
    ("📶 100% Offline IndexedDB", "Complete on-device vector maps, guides & emergency dialer"),
    ("🚌 Transparent Transit Matrix", "Surveyed fares for Matadors (₹10-25), Autos & Prepaid Taxis"),
    ("🧓 Senior & Pilgrim Ease Mode", "Step-free routing, battery cars, wheelchairs & ERSS 112 SOS"),
]

for idx, (col_title, col_sub) in enumerate(cols):
    c_left = Inches(1.2 + idx * 2.7)
    card_s1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, Inches(4.7), Inches(2.5), Inches(1.5))
    card_s1.fill.solid()
    card_s1.fill.fore_color.rgb = C_DARK_GREEN
    card_s1.line.color.rgb = C_GOLD
    card_s1.line.width = Pt(1)

    tb = s1.shapes.add_textbox(c_left + Inches(0.1), Inches(4.8), Inches(2.3), Inches(1.3))
    tf_c = tb.text_frame
    tf_c.word_wrap = True
    p_t = tf_c.paragraphs[0]
    p_t.text = col_title
    p_t.font.size = Pt(11.5)
    p_t.font.bold = True
    p_t.font.color.rgb = C_GOLD
    p_t.font.name = FONT_HEADING

    p_s = tf_c.add_paragraph()
    p_s.text = col_sub
    p_s.font.size = Pt(9.5)
    p_s.font.color.rgb = C_WHITE
    p_s.font.name = FONT_BODY

# =============================================================================
# SLIDE 2: PROBLEM AND HACKATHON ALIGNMENT
# =============================================================================
s2 = prs.slides.add_slide(blank_layout)
set_slide_background(s2)
add_header(s2, 2, "Problem Statement", "The Transit Anxiety & Information Vacuum in Jammu", "Why millions of pilgrims pass through Jammu with friction, fear, and zero local discovery.")

# 3 Problem Cards
p_cards = [
    ("🚨 Transit Anxiety & Time Fear", "Fear of Missing Onward Trains / Flights", [
        "Pilgrims face 4 to 12 hour layovers at Jammu Tawi or Airport.",
        "Fear of getting stuck in traffic traps pilgrims at station platforms.",
        "No existing map tool calculates conservative safety return buffers.",
    ]),
    ("💸 Transport Gouging & Haggling", "Unregulated Fares & Commuter Harassment", [
        "Unsuspecting travelers charged ₹800–₹1,500 for a ₹150 taxi ride.",
        "Matador mini-bus routes and stage tariffs are opaque to outsiders.",
        "Zero transparency on official prepaid union rates.",
    ]),
    ("📴 Cellular Blackouts & Accessibility", "Mountain Dead Zones & Elder Strain", [
        "Cloud-based apps crash in mountain valleys and tunnel corridors.",
        "Elderly pilgrims lack verified walking load, stair counts, and battery car tips.",
        "Safety hotlines and ERSS 112 are hard to locate during distress.",
    ]),
]

for idx, (head, subhead, bullets) in enumerate(p_cards):
    c_left = Inches(0.8 + idx * 3.95)
    add_card(s2, c_left, Inches(1.9), Inches(3.75), Inches(4.7))
    
    tb = s2.shapes.add_textbox(c_left + Inches(0.2), Inches(2.05), Inches(3.35), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = head
    p1.font.size = Pt(15)
    p1.font.bold = True
    p1.font.color.rgb = C_AMBER
    p1.font.name = FONT_HEADING
    
    p2 = tf.add_paragraph()
    p2.text = subhead
    p2.font.size = Pt(11)
    p2.font.bold = True
    p2.font.color.rgb = C_TEXT_INK
    p2.font.name = FONT_BODY
    p2.space_after = Pt(12)
    
    for b in bullets:
        pb = tf.add_paragraph()
        pb.text = f"•  {b}"
        pb.font.size = Pt(11)
        pb.font.color.rgb = C_TEXT_MUTED
        pb.font.name = FONT_BODY
        pb.space_after = Pt(8)

add_footer(s2)

# =============================================================================
# SLIDE 3: THE VISITOR-DISCOVERY GAP
# =============================================================================
s3 = prs.slides.add_slide(blank_layout)
set_slide_background(s3)
add_header(s3, 3, "Economic & Cultural Gap", "The 10-Million Pilgrim Paradox: Direct Transit Bypass", "Immense visitor footfall that completely bypasses Jammu's cultural and economic ecosystem.")

# Left Metric Highlight Card
add_card(s3, Inches(0.8), Inches(1.9), Inches(4.5), Inches(4.7), bg_color=C_DARK_GREEN)
tb_l = s3.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(4.1), Inches(4.3))
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
p_m2.font.size = Pt(13)
p_m2.font.color.rgb = C_WHITE
p_m2.space_after = Pt(20)

p_m3 = tf_l.add_paragraph()
p_m3.text = "< 2 Hours Average Dwell Time"
p_m3.font.size = Pt(18)
p_m3.font.bold = True
p_m3.font.color.rgb = C_GOLD
p_m3.font.name = FONT_HEADING

p_m4 = tf_l.add_paragraph()
p_m4.text = "Over 85% of yatris treat Jammu as a mere train-to-bus transit hallway, unaware of rich Dogra heritage minutes away."
p_m4.font.size = Pt(12.5)
p_m4.font.color.rgb = C_WHITE

# Right: The Consequences Breakdown
add_card(s3, Inches(5.6), Inches(1.9), Inches(6.9), Inches(4.7))
tb_r = s3.shapes.add_textbox(Inches(5.8), Inches(2.1), Inches(6.5), Inches(4.3))
tf_r = tb_r.text_frame
tf_r.word_wrap = True

p_rt = tf_r.paragraphs[0]
p_rt.text = "Three Costly Gaps in Jammu Tourism"
p_rt.font.size = Pt(18)
p_rt.font.bold = True
p_rt.font.color.rgb = C_DARK_GREEN
p_rt.font.name = FONT_HEADING
p_rt.space_after = Pt(14)

gap_items = [
    ("🏛️ Heritage Neglect", "World-class monuments like Mubarak Mandi Palace, Bahu Fort (3000 yrs old), and Amar Mahal witness only a fraction of their potential footfall."),
    ("🛍️ GI Craft Exploitation", "Authentic Dogra crafts (Basohli Paintings, Pashmina, Basohli Tweed, Bhaderwah Rajmash) lose sales to roadside counterfeits with no verified seller guidance."),
    ("🍲 Forgotten Culinary Economy", "Indigenous nutritious Dogra delicacies (Kaladi Kulcha, Dogra Dham, Sund Panjeeri) lose out to generic fast-food stalls."),
    ("📉 Lost Municipal Revenue", "Estimates show Jammu City loses over ₹300 Crores annually in potential local hospitality, craft, and transportation income."),
]

for g_title, g_desc in gap_items:
    p_gt = tf_r.add_paragraph()
    p_gt.text = g_title
    p_gt.font.size = Pt(12.5)
    p_gt.font.bold = True
    p_gt.font.color.rgb = C_AMBER
    
    p_gd = tf_r.add_paragraph()
    p_gd.text = g_desc
    p_gd.font.size = Pt(11)
    p_gd.font.color.rgb = C_TEXT_MUTED
    p_gd.space_after = Pt(8)

add_footer(s3)

# =============================================================================
# SLIDE 4: THE JAMMUKHOJ SOLUTION
# =============================================================================
s4 = prs.slides.add_slide(blank_layout)
set_slide_background(s4)
add_header(s4, 4, "The Solution Architecture", "JammuKhoj: An Intelligent, Resilient Local Guide", "A human-centered progressive application tailored for zero-data environments and time-critical pilgrims.")

sol_cards = [
    ("⚡ 1-Tap Circuit Engine", "Deterministic, buffer-safe itinerary generator that plans realistic circuits tailored to user's exact available layover (4h, 8h, 24h) with guaranteed station return buffers (45m rail / 150m air)."),
    ("📶 100% Offline Vector Stack", "Entire knowledge graph (36+ attractions, road topologies, timetables, dialer hotlines) bundled in local IndexedDB. Zero cloud telemetry dependency."),
    ("🚌 Transparent Transit Intelligence", "Verified stage-by-stage Matador mini-bus routes, Smart City E-bus stops, and prepaid union matrices for auto-rickshaws and taxis to end passenger overcharging."),
    ("🧓 Senior & Accessibility First", "Dedicated walking-load ratings (Low/Med/High), wheelchair step-free indicators, SMVDSB battery car guidance, and WCAG 2.1 AA senior contrast modes."),
]

for idx, (title, desc) in enumerate(sol_cards):
    c_x = Inches(0.8 + (idx % 2) * 5.95)
    c_y = Inches(1.9 + (idx // 2) * 2.45)
    add_card(s4, c_x, c_y, Inches(5.75), Inches(2.25))
    
    tb = s4.shapes.add_textbox(c_x + Inches(0.25), c_y + Inches(0.2), Inches(5.25), Inches(1.85))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_DARK_GREEN
    p.font.name = FONT_HEADING
    p.space_after = Pt(6)
    
    pd = tf.add_paragraph()
    pd.text = desc
    pd.font.size = Pt(11.5)
    pd.font.color.rgb = C_TEXT_MUTED
    pd.font.name = FONT_BODY

add_footer(s4)

# =============================================================================
# SLIDE 5: USER JOURNEY
# =============================================================================
s5 = prs.slides.add_slide(blank_layout)
set_slide_background(s5)
add_header(s5, 5, "Seamless User Journey", "From Station Arrival to Holy Darshan in 5 Frictionless Steps", "Designed for immediate value without forced registration, heavy downloads, or steep learning curves.")

steps = [
    ("1. Arrival", "Arrives at Jammu Tawi (JAT) or Airport. Scans QR code or opens jammukhoj.in directly in browser or PWA. Zero mandatory login barrier."),
    ("2. 1-Tap Plan", "Selects available window: '4-Hour Express' from station. App automatically reserves 45-min return buffer and computes a 2.5 hr curated circuit."),
    ("3. Fair Transit", "Checks Matador Route #1 to Raghunath Bazaar. Pays exact ₹15 fare; avoids cab touts quoting ₹400 for the same distance."),
    ("4. Cultural Dip", "Visits Raghunath Mandir, discovers verified Dogra Kaladi Kulcha with Jain/Pure Veg tag, and explores authentic Basohli handicraft shop."),
    ("5. Safe Transit", "Arrives back at Jammu Tawi with 50 minutes to spare. Smoothly boards onward Vande Bharat Express to Katra with complete peace of mind."),
]

for idx, (step_title, step_desc) in enumerate(steps):
    c_left = Inches(0.8 + idx * 2.37)
    add_card(s5, c_left, Inches(1.9), Inches(2.25), Inches(4.7))
    
    # Step indicator pill
    pill = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left + Inches(0.2), Inches(2.1), Inches(1.85), Inches(0.45))
    pill.fill.solid()
    pill.fill.fore_color.rgb = C_AMBER
    pill.line.fill.background()
    p_pill = pill.text_frame.paragraphs[0]
    p_pill.text = f"STEP {idx+1}"
    p_pill.font.size = Pt(11)
    p_pill.font.bold = True
    p_pill.font.color.rgb = C_WHITE
    p_pill.alignment = PP_ALIGN.CENTER
    
    tb = s5.shapes.add_textbox(c_left + Inches(0.15), Inches(2.7), Inches(1.95), Inches(3.7))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p_st = tf.paragraphs[0]
    p_st.text = step_title
    p_st.font.size = Pt(14)
    p_st.font.bold = True
    p_st.font.color.rgb = C_DARK_GREEN
    p_st.font.name = FONT_HEADING
    p_st.space_after = Pt(8)
    
    p_sd = tf.add_paragraph()
    p_sd.text = step_desc
    p_sd.font.size = Pt(10.5)
    p_sd.font.color.rgb = C_TEXT_MUTED
    p_sd.font.name = FONT_BODY

add_footer(s5)

# =============================================================================
# SLIDE 6: CORE FEATURES & COMPETITIVE DIFFERENTIATION
# =============================================================================
s6 = prs.slides.add_slide(blank_layout)
set_slide_background(s6)
add_header(s6, 6, "Competitive Differentiation", "How JammuKhoj Solves What Generic Travel Apps Miss", "Direct comparison against Google Maps, MakeMyTrip, and generic travel blogs.")

# Comparison Table
t_left = Inches(0.8)
t_top = Inches(1.9)
t_width = Inches(11.733)
t_height = Inches(4.7)

table_shape = s6.shapes.add_table(6, 4, t_left, t_top, t_width, t_height)
table = table_shape.table
table.columns[0].width = Inches(2.8)
table.columns[1].width = Inches(2.8)
table.columns[2].width = Inches(2.8)
table.columns[3].width = Inches(3.333)

headers = ["Feature Dimension", "Google Maps", "MakeMyTrip / OTA", "JammuKhoj (Our Solution)"]
for c_idx, h_text in enumerate(headers):
    cell = table.cell(0, c_idx)
    cell.fill.solid()
    cell.fill.fore_color.rgb = C_DARK_GREEN if c_idx == 3 else C_FOREST
    p = cell.text_frame.paragraphs[0]
    p.text = h_text
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_GOLD if c_idx == 3 else C_WHITE

rows_data = [
    ("Offline Autonomy", "Requires data for routes & searches; fails in remote mountain spots", "100% online; fails without mobile connectivity", "100% On-Device IndexedDB; full routing, cards & search offline"),
    ("Time-Budget Safe Planning", "Point-to-point only; ignores train/flight layover deadlines", "Rigid tour packages; no layover customization", "Dynamic 4h/8h/24h buffer engine; never misses your train"),
    ("Local Transit Transparency", "No Matador routes; no fare benchmarks", "Only commercial prepaid cabs at high markup", "Complete Matador route guide (₹10-25) + Auto & Taxi Union benchmarks"),
    ("Senior & Pilgrim Care", "No walking load or step-free data for temples", "Standard generic hotel packages", "Step-free badges, walking load (low/med/high), battery car rules"),
    ("Privacy & Data Safety", "Pervasive ad-tracking, profiling & location logs", "Monetizes user data with aggressive ads", "Zero cookies, zero surveillance, 100% client-side privacy"),
]

for r_idx, r_data in enumerate(rows_data):
    for c_idx, val in enumerate(r_data):
        cell = table.cell(r_idx + 1, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_ACCENT_BG if (r_idx % 2 == 1) else C_WHITE
        p = cell.text_frame.paragraphs[0]
        p.text = val
        p.font.size = Pt(10)
        p.font.name = FONT_BODY
        if c_idx == 3:
            p.font.bold = True
            p.font.color.rgb = C_DARK_GREEN
        elif c_idx == 0:
            p.font.bold = True
            p.font.color.rgb = C_TEXT_INK
        else:
            p.font.color.rgb = C_TEXT_MUTED

add_footer(s6)

# =============================================================================
# SLIDE 7: EXPECTED IMPACT AND MEASURABLE TARGETS
# =============================================================================
s7 = prs.slides.add_slide(blank_layout)
set_slide_background(s7)
add_header(s7, 7, "Impact & Metrics", "Measurable Economic, Civic, and Social Outcomes", "High-leverage impact for local artisans, transit riders, and pilgrim safety.")

metrics = [
    ("3x", "Increase in Dwell Time", "Extending visitor stay from <2 hours to 6-8 hours through safe, reliable layover circuits."),
    ("₹150 Cr+", "Economic Unlock Target", "Direct injection of traveler expenditure into local Dogra food, crafts, and municipal transport."),
    ("₹1,200", "Avg Savings per Family", "Preventing exploitative overcharging on local transit and authentic certified souvenirs."),
    ("0", "Missed Boarding Events", "100% adherence to safety return buffers (45-min rail / 150-min flight) across 1-tap itineraries."),
]

for idx, (val, label, sub) in enumerate(metrics):
    c_left = Inches(0.8 + idx * 2.95)
    add_card(s7, c_left, Inches(1.9), Inches(2.8), Inches(2.2), bg_color=C_DARK_GREEN)
    
    tb = s7.shapes.add_textbox(c_left + Inches(0.15), Inches(2.05), Inches(2.5), Inches(1.9))
    tf = tb.text_frame
    tf.word_wrap = True
    
    pv = tf.paragraphs[0]
    pv.text = val
    pv.font.size = Pt(36)
    pv.font.bold = True
    pv.font.color.rgb = C_GOLD
    pv.font.name = FONT_HEADING
    
    pl = tf.add_paragraph()
    pl.text = label
    pl.font.size = Pt(12)
    pl.font.bold = True
    pl.font.color.rgb = C_WHITE
    pl.space_after = Pt(4)
    
    ps = tf.add_paragraph()
    ps.text = sub
    ps.font.size = Pt(9.5)
    ps.font.color.rgb = C_ACCENT_BG

# Bottom Impact Callout Cards
add_card(s7, Inches(0.8), Inches(4.35), Inches(5.75), Inches(2.3))
tb_b1 = s7.shapes.add_textbox(Inches(1.0), Inches(4.45), Inches(5.35), Inches(2.1))
tf_b1 = tb_b1.text_frame
tf_b1.word_wrap = True
p = tf_b1.paragraphs[0]
p.text = "🏛️ Cultural & GI Heritage Renaissance"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = C_DARK_GREEN
p.font.name = FONT_HEADING
p.space_after = Pt(4)

p2 = tf_b1.add_paragraph()
p2.text = (
    "Empowering Basohli painters, Pashmina weavers, and Bhaderwah farmers with verified "
    "outlet discovery and fake-identification guides. Pilgrims purchase authentic GI certified "
    "heritage at fair benchmark prices directly supporting cottage industries."
)
p2.font.size = Pt(10.5)
p2.font.color.rgb = C_TEXT_MUTED

add_card(s7, Inches(6.75), Inches(4.35), Inches(5.75), Inches(2.3))
tb_b2 = s7.shapes.add_textbox(Inches(6.95), Inches(4.45), Inches(5.35), Inches(2.1))
tf_b2 = tb_b2.text_frame
tf_b2.word_wrap = True
p = tf_b2.paragraphs[0]
p.text = "🛡️ Public Safety & Yatra Welfare"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = C_DARK_GREEN
p.font.name = FONT_HEADING
p.space_after = Pt(4)

p2 = tf_b2.add_paragraph()
p2.text = (
    "1-Tap WhatsApp GPS SOS dispatcher and offline dialers for ERSS 112, SMVDSB Shrine Helplines, "
    "and women's assistance. Real-time dynamic temple crowd meters and aarti timings prevent "
    "stampedes and reduce elder exhaustion during Navratri surges."
)
p2.font.size = Pt(10.5)
p2.font.color.rgb = C_TEXT_MUTED

add_footer(s7)

# =============================================================================
# SLIDE 8: IMPLEMENTATION ROADMAP
# =============================================================================
s8 = prs.slides.add_slide(blank_layout)
set_slide_background(s8)
add_header(s8, 8, "Execution Roadmap", "4-Stage Scalable Deployment Plan (2026 - 2027)", "From hackathon proof-of-concept to institutional state-wide deployment.")

phases = [
    ("Phase 1: Foundation", "CURRENT • COMPLETED", [
        "100% offline-ready PWA & Android app live.",
        "Custom domain jammukhoj.in & Schema.org SEO.",
        "36+ curated attractions & 44/44 test suite passed.",
        "1-Tap buffer-safe planner & transit matrix.",
    ], C_EMERALD),
    ("Phase 2: Station Pilot", "Q1 - Q2 2027", [
        "Physical QR kiosks at Jammu Tawi & SVDK Katra.",
        "Collaboration with J&K RTC for live e-bus tracking.",
        "Pilot onboardings with 50+ verified local merchants.",
        "Target: 50,000 active pilgrim sessions.",
    ], C_DARK_GREEN),
    ("Phase 3: Institutional Tie-up", "Q3 2027", [
        "Integration with SMVDSB Shrine Board RFID counters.",
        "Official endorsement by J&K Directorate of Tourism.",
        "Battery car live queue advisory in Katra.",
        "Target: 250,000 active monthly yatris.",
    ], C_AMBER),
    ("Phase 4: Ecosystem Scale", "Q4 2027+", [
        "Expansion to Bhaderwah, Kishtwar, Poonch & Rajouri.",
        "Audio heritage trails in Dogri, Hindi & English.",
        "Crowdsourced community fare update mechanisms.",
        "Standard blueprint for other Indian pilgrim corridors.",
    ], C_FOREST),
]

for idx, (p_title, p_time, p_items, color) in enumerate(phases):
    c_left = Inches(0.8 + idx * 2.95)
    add_card(s8, c_left, Inches(1.9), Inches(2.8), Inches(4.7))
    
    # Phase badge
    badge = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left + Inches(0.15), Inches(2.1), Inches(2.5), Inches(0.6))
    badge.fill.solid()
    badge.fill.fore_color.rgb = color
    badge.line.fill.background()
    p_b1 = badge.text_frame.paragraphs[0]
    p_b1.text = p_title
    p_b1.font.size = Pt(11)
    p_b1.font.bold = True
    p_b1.font.color.rgb = C_WHITE
    p_b1.alignment = PP_ALIGN.CENTER
    
    p_b2 = badge.text_frame.add_paragraph()
    p_b2.text = p_time
    p_b2.font.size = Pt(9)
    p_b2.font.color.rgb = C_GOLD if color != C_AMBER else C_WHITE
    p_b2.alignment = PP_ALIGN.CENTER
    
    tb = s8.shapes.add_textbox(c_left + Inches(0.15), Inches(2.85), Inches(2.5), Inches(3.6))
    tf = tb.text_frame
    tf.word_wrap = True
    
    for item in p_items:
        pi = tf.add_paragraph()
        pi.text = f"✓  {item}"
        pi.font.size = Pt(10.5)
        pi.font.color.rgb = C_TEXT_INK
        pi.font.name = FONT_BODY
        pi.space_after = Pt(8)

add_footer(s8)

# =============================================================================
# SLIDE 9: SUSTAINABILITY AND PRIVACY
# =============================================================================
s9 = prs.slides.add_slide(blank_layout)
set_slide_background(s9)
add_header(s9, 9, "Trust & Sustainability", "Civic Integrity, Zero-Surveillance Privacy & Low Footprint", "Built to protect user autonomy and operate sustainably without predatory monetization.")

pillars = [
    ("🔒 Zero-Knowledge Privacy", "No Tracking • No Ad Telemetry", [
        "100% of personal plans, bookmarks, and logs remain in local device IndexedDB.",
        "No third-party advertising SDKs or tracking cookies.",
        "One-tap permanent account and device cache deletion conforming to Google Play Data Safety policies.",
    ]),
    ("🌱 Ultra-Low Resource Footprint", "Battery & Network Conscious", [
        "Compressed offline package (~5 MB APK / <2 MB web assets).",
        "Optimized for budget Android devices prevalent across Indian pilgrim cohorts.",
        "OLED-friendly dark mode and high-contrast accessibility modes reducing battery draw during long travel.",
    ]),
    ("🤝 Sustainable Civic Model", "Public-Private Community Co-ops", [
        "Non-commission based directory preventing price distortion for travelers.",
        "Verified artisan and homestay listings supported by J&K Tourism development authorities.",
        "Open-source data structures contributing back to OpenStreetMap and civic datasets.",
    ]),
]

for idx, (head, subhead, bullets) in enumerate(pillars):
    c_left = Inches(0.8 + idx * 3.95)
    add_card(s9, c_left, Inches(1.9), Inches(3.75), Inches(4.7))
    
    tb = s9.shapes.add_textbox(c_left + Inches(0.2), Inches(2.05), Inches(3.35), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = head
    p1.font.size = Pt(15)
    p1.font.bold = True
    p1.font.color.rgb = C_DARK_GREEN
    p1.font.name = FONT_HEADING
    
    p2 = tf.add_paragraph()
    p2.text = subhead
    p2.font.size = Pt(11)
    p2.font.bold = True
    p2.font.color.rgb = C_AMBER
    p2.font.name = FONT_BODY
    p2.space_after = Pt(12)
    
    for b in bullets:
        pb = tf.add_paragraph()
        pb.text = f"•  {b}"
        pb.font.size = Pt(11)
        pb.font.color.rgb = C_TEXT_MUTED
        pb.font.name = FONT_BODY
        pb.space_after = Pt(8)

add_footer(s9)

# =============================================================================
# SLIDE 10: CLOSING PITCH AND REQUEST FOR PILOT SUPPORT
# =============================================================================
s10 = prs.slides.add_slide(blank_layout)
set_slide_background(s10, C_DARK_GREEN)

# Decorative background accent
acc10 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9))
acc10.fill.solid()
acc10.fill.fore_color.rgb = C_FOREST
acc10.line.color.rgb = C_GOLD
acc10.line.width = Pt(1.5)

# Badge
b10 = s10.shapes.add_textbox(Inches(1.2), Inches(1.1), Inches(10), Inches(0.4))
p_b10 = b10.text_frame.paragraphs[0]
p_b10.text = "CLOSING PITCH • PILOT CALL TO ACTION"
p_b10.font.size = Pt(11)
p_b10.font.bold = True
p_b10.font.color.rgb = C_GOLD

# Header
th10 = s10.shapes.add_textbox(Inches(1.2), Inches(1.5), Inches(10.5), Inches(1.2))
tf10 = th10.text_frame
p10_1 = tf10.paragraphs[0]
p10_1.text = "Partner with Us to Transform Jammu Tourism"
p10_1.font.size = Pt(36)
p10_1.font.bold = True
p10_1.font.color.rgb = C_WHITE
p10_1.font.name = FONT_HEADING

p10_2 = tf10.add_paragraph()
p10_2.text = "Let's turn a hurried 2-hour transit rush into an enriching, safe cultural gateway."
p10_2.font.size = Pt(16)
p10_2.font.color.rgb = C_GOLD

# 3 Pilot Asks
asks = [
    ("1. Transit Signage Pilot", "Permission for QR code info panels at Jammu Tawi (JAT) and SVDK Katra station concourses to give yatris instant offline guide access."),
    ("2. Tourism Dept Data Link", "Official co-branding and verification link with Directorate of Tourism, Jammu (TRC) to keep fare tables and festival schedules authoritative."),
    ("3. Shrine Board Sync", "Collaboration with SMVDSB Katra to integrate battery-car status, aarti timings, and emergency medical aid coordinates."),
]

for idx, (ask_title, ask_desc) in enumerate(asks):
    c_left = Inches(1.2 + idx * 3.65)
    card10 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, Inches(2.9), Inches(3.45), Inches(2.3))
    card10.fill.solid()
    card10.fill.fore_color.rgb = C_DARK_GREEN
    card10.line.color.rgb = C_GOLD
    card10.line.width = Pt(1)

    tb = s10.shapes.add_textbox(c_left + Inches(0.15), Inches(3.05), Inches(3.15), Inches(2.0))
    tf = tb.text_frame
    tf.word_wrap = True
    
    pt = tf.paragraphs[0]
    pt.text = ask_title
    pt.font.size = Pt(14)
    pt.font.bold = True
    pt.font.color.rgb = C_GOLD
    pt.font.name = FONT_HEADING
    pt.space_after = Pt(6)
    
    pd = tf.add_paragraph()
    pd.text = ask_desc
    pd.font.size = Pt(10.5)
    pd.font.color.rgb = C_WHITE
    pd.font.name = FONT_BODY

# Contact & Links Bar
bar = s10.shapes.add_textbox(Inches(1.2), Inches(5.4), Inches(10.5), Inches(1.0))
tf_bar = bar.text_frame
tf_bar.word_wrap = True

p_c1 = tf_bar.paragraphs[0]
p_c1.text = "Live Web App: https://jammukhoj.in  •  Contact: support@jammukhoj.in"
p_c1.font.size = Pt(14)
p_c1.font.bold = True
p_c1.font.color.rgb = C_WHITE
p_c1.alignment = PP_ALIGN.CENTER

p_c2 = tf_bar.add_paragraph()
p_c2.text = "Open Source • 100% Offline Progressive Web App & Android Ready • Thank You!"
p_c2.font.size = Pt(11)
p_c2.font.color.rgb = C_GOLD
p_c2.alignment = PP_ALIGN.CENTER

# -----------------------------------------------------------------------------
# SAVE PRESENTATION
# -----------------------------------------------------------------------------
output_pptx = os.path.abspath(os.path.join(os.getcwd(), "JammuKhoj_Pitch_Deck.pptx"))
prs.save(output_pptx)
print(f"SUCCESS: Generated pitch deck at {output_pptx}")
