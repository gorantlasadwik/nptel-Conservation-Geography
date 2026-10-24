#!/usr/bin/env python3
"""
Integrates the new questions extracted from NPTEL Quiz Application.pdf
into the respective lab/week question datasets (Weeks 1 to 12),
skipping all duplicates.
"""

import os
import sys
import json
import re

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scratch'))
from test_full_parse import parse_full_pdf
from verify_week_mapping import QUESTION_WEEK_MAP

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
QUESTIONS_DIR = os.path.join(WORKSPACE_DIR, 'src', 'data', 'questions')
WEEKS_JSON_PATH = os.path.join(WORKSPACE_DIR, 'src', 'data', 'weeks.json')
PDF_PATH = r"C:\Users\sadwi\Downloads\NPTEL Quiz Application.pdf"

def clean_text(s):
    if not s:
        return ""
    # Normalize whitespace
    s = re.sub(r'[ \t\r\n]+', ' ', s)
    return s.strip()

def run():
    print("Parsing NPTEL Quiz Application.pdf...")
    pdf_questions = parse_full_pdf(PDF_PATH)
    pdf_q_dict = {q['q_num']: q for q in pdf_questions}
    
    print(f"Loaded {len(pdf_q_dict)} questions from PDF.")
    print(f"Processing {len(QUESTION_WEEK_MAP)} non-duplicate questions into their respective weeks...")
    
    # Group by week
    by_week = {}
    for q_num, (week_num, explanation) in QUESTION_WEEK_MAP.items():
        by_week.setdefault(week_num, []).append((q_num, explanation))
    
    total_added = 0
    new_counts_by_week = {}
    
    for w in range(13):
        week_file = os.path.join(QUESTIONS_DIR, f"week-{w:02d}.json")
        with open(week_file, 'r', encoding='utf-8') as f:
            existing_questions = json.load(f)
            
        initial_count = len(existing_questions)
        new_items_for_week = by_week.get(w, [])
        
        # Sort by PDF question number
        new_items_for_week.sort(key=lambda x: x[0])
        
        for q_num, explanation in new_items_for_week:
            pq = pdf_q_dict[q_num]
            current_idx = len(existing_questions) + 1
            new_id = f"week-{w:02d}-q{current_idx:03d}"
            
            # Map options
            opts = []
            for i, opt_txt in enumerate(pq['options']):
                opt_id = chr(65 + i)
                opts.append({
                    "id": opt_id,
                    "text": clean_text(opt_txt)
                })
            
            correct_idx = pq['correct'][0]
            correct_ids = [chr(65 + correct_idx)]
            
            question_obj = {
                "id": new_id,
                "week": w,
                "originalQuestionNumber": current_idx,
                "type": "single",
                "question": clean_text(pq['question']),
                "options": opts,
                "correctOptionIds": correct_ids,
                "explanation": explanation,
                "assets": [],
                "source": "NPTEL Quiz Application.pdf"
            }
            
            existing_questions.append(question_obj)
            total_added += 1
            
        # Write back updated week file
        with open(week_file, 'w', encoding='utf-8') as f:
            json.dump(existing_questions, f, indent=2, ensure_ascii=False)
            f.write('\n')
            
        new_counts_by_week[w] = len(existing_questions)
        print(f"Week {w:02d}: {initial_count} -> {len(existing_questions)} (+{len(new_items_for_week)} added)")
        
    print(f"\nSuccessfully added {total_added} questions across all weeks!")
    
    # Update weeks.json
    with open(WEEKS_JSON_PATH, 'r', encoding='utf-8') as f:
        weeks_data = json.load(f)
        
    for item in weeks_data:
        w = item['week']
        if w in new_counts_by_week:
            item['totalQuestions'] = new_counts_by_week[w]
            
    with open(WEEKS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(weeks_data, f, indent=2, ensure_ascii=False)
        f.write('\n')
        
    print("Updated src/data/weeks.json with new question counts.")

if __name__ == '__main__':
    run()
