import json

log_path = r"C:\Users\Asif\.gemini\antigravity-ide\brain\3bd53ed1-30b4-49b0-aca9-8005b7a436c1\.system_generated\logs\transcript.jsonl"
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'export default function PerfumeImage' in line:
            # Print first 200 chars to identify
            print(line[:300])
