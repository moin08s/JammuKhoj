import os
import re

SRC_DIR = "src"

findings = []

for root, _, files in os.walk(SRC_DIR):
    for f in files:
        if f.endswith(".tsx"):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8", errors="ignore") as file:
                lines = file.readlines()
                for idx, line in enumerate(lines):
                    line_num = idx + 1
                    s = line.strip()

                    # 1. Hardcoded bg-white on interactive/cards without dark:
                    if "bg-white" in s and "dark:" not in s and "text-white" not in s and "bg-white/" not in s and "print:bg-white" not in s:
                        findings.append((filepath, line_num, "Hardcoded bg-white without dark:", s[:110]))

                    # 2. Hardcoded light hex background without dark:
                    if re.search(r"bg-\[#(F[A-F0-9]{5}|FFF[A-F0-9]{3})\]", s, re.IGNORECASE) and "dark:" not in s:
                        findings.append((filepath, line_num, "Light hex bg without dark:", s[:110]))

                    # 3. Hardcoded gradients from light colors without dark:
                    if re.search(r"from-\[#(F[A-F0-9]{5}|FFF[A-F0-9]{3})\]", s, re.IGNORECASE) and "dark:" not in s:
                        findings.append((filepath, line_num, "Light hex gradient without dark:", s[:110]))

                    # 4. bg-stone-50 or bg-slate-50 without dark:
                    if ("bg-stone-50" in s or "bg-slate-50" in s or "bg-[#FAF6F0]" in s or "bg-[#FFF9F3]" in s) and "dark:" not in s:
                        findings.append((filepath, line_num, "Light subtle bg without dark:", s[:110]))

print(f"Total Dark Mode Inconsistencies Found: {len(findings)}\n")
for fpath, lnum, issue_type, snippet in findings:
    print(f"{fpath}:{lnum} [{issue_type}]\n  -> {snippet}\n")
