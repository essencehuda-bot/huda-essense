import json

log_path = r"C:\Users\Asif\.gemini\antigravity-ide\brain\3bd53ed1-30b4-49b0-aca9-8005b7a436c1\.system_generated\logs\transcript_full.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        # Check if line contains a write_to_file call targeting PerfumeImage.tsx
        if 'write_to_file' in line and 'PerfumeImage.tsx' in line:
            data = json.loads(line)
            # Find the tool calls
            for tc in data.get('tool_calls', []):
                if tc.get('name') == 'write_to_file' and 'PerfumeImage.tsx' in tc.get('args', {}).get('TargetFile', ''):
                    content = tc['args']['CodeContent']
                    print(f"FOUND write_to_file in step {data['step_index']}: len={len(content)}")
                    # Let's save the last found content to a backup file
                    with open(f"scratch/backup_PerfumeImage_{data['step_index']}.tsx", "w", encoding="utf-8") as bf:
                        bf.write(content)
