import urllib.request
import json
import re
import unicodedata

def remove_accents(input_str):
    if not input_str:
        return ""
    # Normalize and strip diacritics
    nfkd = unicodedata.normalize('NFKD', input_str)
    res = ''.join([c for c in nfkd if not unicodedata.combining(c)])
    # Chinese pinyin umlauts ü -> v or u
    res = res.replace('\u00fc', 'v').replace('\u01d8', 'v').replace('\u01da', 'v').replace('\u01dc', 'v').replace('\u01de', 'v')
    res = res.replace('Ü', 'V').replace('ü', 'v')
    return res

print("Fetching complete HSK dataset...")
url = 'https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/complete.json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=20) as resp:
    raw_data = json.loads(resp.read().decode('utf-8'))

selected = []
seen = set()

# Process classic HSK levels 1 to 6
for lvl_num in range(1, 7):
    target_lvl = f'old-{lvl_num}'
    for item in raw_data:
        if target_lvl in item.get('level', []):
            hanzi = item.get('simplified', '').strip()
            if hanzi and hanzi not in seen:
                seen.add(hanzi)
                forms = item.get('forms', [{}])[0]
                trans = forms.get('transcriptions', {})
                pinyin = trans.get('pinyin', '')
                numeric = trans.get('numeric', '')
                meanings = forms.get('meanings', [])
                meaning = '; '.join(meanings[:2]) if meanings else ''
                
                clean = re.sub(r'[^a-zA-Z]', '', remove_accents(pinyin)).lower()
                clean_spaced = re.sub(r'[^a-zA-Z\s]', '', remove_accents(pinyin)).lower()
                clean_spaced = ' '.join(clean_spaced.split())
                num_clean = re.sub(r'[^a-zA-Z0-9]', '', numeric).lower()

                selected.append({
                    'id': len(selected) + 1,
                    'hanzi': hanzi,
                    'pinyin': pinyin,
                    'clean': clean,
                    'spaced': clean_spaced,
                    'num': num_clean,
                    'level': lvl_num,
                    'meaning': meaning
                })

# Top up remaining items to reach exactly 5,000 words sorted by frequency
if len(selected) < 5000:
    for item in sorted(raw_data, key=lambda x: x.get('frequency', 999999)):
        hanzi = item.get('simplified', '').strip()
        if hanzi and hanzi not in seen:
            seen.add(hanzi)
            forms = item.get('forms', [{}])[0]
            trans = forms.get('transcriptions', {})
            pinyin = trans.get('pinyin', '')
            numeric = trans.get('numeric', '')
            meanings = forms.get('meanings', [])
            meaning = '; '.join(meanings[:2]) if meanings else ''
            
            clean = re.sub(r'[^a-zA-Z]', '', remove_accents(pinyin)).lower()
            clean_spaced = re.sub(r'[^a-zA-Z\s]', '', remove_accents(pinyin)).lower()
            clean_spaced = ' '.join(clean_spaced.split())
            num_clean = re.sub(r'[^a-zA-Z0-9]', '', numeric).lower()

            selected.append({
                'id': len(selected) + 1,
                'hanzi': hanzi,
                'pinyin': pinyin,
                'clean': clean,
                'spaced': clean_spaced,
                'num': num_clean,
                'level': 6,
                'meaning': meaning
            })
            if len(selected) >= 5000:
                break

print(f"Total words compiled: {len(selected)}")

# Output to words.js
js_content = "/**\n * 5,000 Common Chinese Words Library (HSK 1-6)\n * Auto-compiled standard vocabulary dataset with Pinyin, Clean Pinyin & Meanings\n */\n"
js_content += "window.CHINESE_WORDS_5000 = " + json.dumps(selected, ensure_ascii=False) + ";\n"

with open('words.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Successfully generated words.js (5000 items)!")
