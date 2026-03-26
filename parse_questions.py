import re
import json

def parse_questions():
    with open('raw_questions.txt', 'r', encoding='utf-8') as f:
        content = f.read()

    with open('raw_answers.txt', 'r', encoding='utf-8') as f:
        answers_content = f.read()

    # Parse questions
    # Split by blocks (empty lines)
    blocks = re.split(r'\n\s*\n', content)
    
    questions = []
    current_part = "A"
    current_topic = "General"
    q_id = 1
    
    for block in blocks:
        block = block.strip()
        if not block:
            continue
        if block.startswith("Part B"):
            current_part = "B"
            current_topic = "Technical"
            continue
        if block.startswith("Part A"):
            continue
            
        lines = block.split('\n')
        if len(lines) >= 5:
            q_text = lines[0].strip()
            options = []
            for i in range(1, 5):
                # remove "a) " or "b) " etc
                opt_match = re.search(r'^[a-d]\)\s*(.*)', lines[i])
                if opt_match:
                    options.append(opt_match.group(1).strip())
                else:
                    options.append(lines[i].strip())
                    
            if len(options) == 4:
                questions.append({
                    "id": q_id,
                    "part": current_part,
                    "topic": current_topic,
                    "question": q_text,
                    "options": options,
                    "answer": 0, # Placeholder
                    "explanation": ""
                })
                q_id += 1

    # Parse answers
    ans_lines = [l.strip() for l in answers_content.split('\n') if l.strip()]
    part_a_ans = []
    part_b_ans = []
    
    current_ans_part = "A"
    for line in ans_lines:
        if line.startswith("Part A"):
            current_ans_part = "A"
            continue
        if line.startswith("Part B"):
            current_ans_part = "B"
            continue
        
        if current_ans_part == "A":
            ans_char = line.lower()[0]
            if ans_char in ['a', 'b', 'c', 'd']:
                part_a_ans.append(ord(ans_char) - ord('a'))
        else:
            match = re.match(r'^([a-d])\s*[–-]\s*(.*)$', line)
            if match:
                ans_idx = ord(match.group(1).lower()) - ord('a')
                part_b_ans.append({
                    "ans": ans_idx,
                    "exp": match.group(2).strip()
                })
                
    ans_idx_a = 0
    ans_idx_b = 0
    for q in questions:
        if q['part'] == 'A':
            if ans_idx_a < len(part_a_ans):
                q['answer'] = part_a_ans[ans_idx_a]
                ans_idx_a += 1
        elif q['part'] == 'B':
            if ans_idx_b < len(part_b_ans):
                q['answer'] = part_b_ans[ans_idx_b]['ans']
                q['explanation'] = part_b_ans[ans_idx_b]['exp']
                ans_idx_b += 1

    js_code = "export type Question = {\n  id: number;\n  part: 'A' | 'B';\n  topic: string;\n  question: string;\n  options: string[];\n  answer: number;\n  explanation?: string;\n};\n\n"
    js_code += "export const questions: Question[] = " + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n"

    import os
    os.makedirs('src/data', exist_ok=True)
    with open('src/data/questions.ts', 'w', encoding='utf-8') as f:
        f.write(js_code)

parse_questions()
