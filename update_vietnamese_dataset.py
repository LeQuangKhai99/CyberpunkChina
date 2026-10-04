import urllib.request
import json
import re
import unicodedata
import os
import time

def remove_accents(input_str):
    if not input_str:
        return ""
    nfkd = unicodedata.normalize('NFKD', input_str)
    res = ''.join([c for c in nfkd if not unicodedata.combining(c)])
    res = res.replace('\u00fc', 'v').replace('\u01d8', 'v').replace('\u01da', 'v').replace('\u01dc', 'v').replace('\u01de', 'v')
    res = res.replace('Ü', 'V').replace('ü', 'v')
    return res

def clean_vi_text(vi_str):
    if not vi_str:
        return ''
    # Remove measure word tags
    vi_str = re.sub(r'(\s*[/;,]\s*)?(Lượng từ|LT|CL)\s*[:：][^/;)]+', '', vi_str, flags=re.I)
    # Remove references like [ba1] or [tie1 ba1]
    vi_str = re.sub(r'\[[^\]]*\]', '', vi_str)
    # Remove standalone punctuation leftovers like (; or ( ; or )
    vi_str = vi_str.replace('(;', ';').replace('( ;', ';').replace('; )', ';').replace(';)', ';')
    vi_str = re.sub(r'\s*\(\s*\)', '', vi_str)
    # Split by /
    parts = [p.strip() for p in vi_str.split('/') if p.strip()]
    parts = [p for p in parts if len(p) > 0 and not p.lower().startswith('lượng từ') and not p.lower().startswith('lt:')]
    if not parts:
        return ''
    
    first = parts[0]
    # If first has commas or semicolons
    sub = [s.strip() for s in first.split(';') if s.strip()]
    if len(sub) > 1:
        res = '; '.join(sub[:2])
    else:
        res = first
        if len(parts) > 1 and len(res) + len(parts[1]) < 26:
            res += '; ' + parts[1]
    
    # Remove excessive brackets if present
    res = re.sub(r'\s*\([^)]*\)', '', res).strip()
    res = re.sub(r'[,;]\s*$', '', res)
    res = re.sub(r'^[,;\s]+', '', res)
    res = re.sub(r'\s+', ' ', res).strip()
    # Remove any broken unclosed parentheses
    res = res.replace('(', '').replace(')', '').strip()
    if len(res) > 28:
        if ';' in res:
            res = res.split(';')[0].strip()
        elif ',' in res:
            res = res.split(',')[0].strip()
    return res

print("1. Loading words.js...")
with open('words.js', 'r', encoding='utf-8') as f:
    raw_js = f.read()
idx = raw_js.find('[')
words = json.loads(raw_js[idx:-2])
print(f"Loaded {len(words)} words from words.js")

print("2. Loading dictionary.json...")
dict_cache = 'dictionary_cache.json'
if os.path.exists(dict_cache):
    with open(dict_cache, 'r', encoding='utf-8') as f:
        dict_data = json.load(f)
else:
    url = 'https://raw.githubusercontent.com/phucbm/xue-hanzi/main/public/data/dictionary.json'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        dict_data = json.loads(resp.read().decode('utf-8'))
    with open(dict_cache, 'w', encoding='utf-8') as f:
        json.dump(dict_data, f, ensure_ascii=False)

print(f"Dictionary loaded: {len(dict_data)} entries")

# Map dictionary entries by simplified hanzi
dict_map = {}
for item in dict_data:
    s = item.get('s')
    if s:
        if s not in dict_map:
            dict_map[s] = []
        dict_map[s].append(item)

# Specific curated meanings for polyphones, unmatched words or surname collisions
SPECIAL_OVERRIDE = {
    '打篮球': {'pinyin': 'dǎ lán qiú', 'meaning': 'to play basketball', 'meaning_vn': 'chơi bóng rổ'},
    '放暑假': {'pinyin': 'fàng shǔ jià', 'meaning': 'to have summer vacation', 'meaning_vn': 'nghỉ hè'},
    '系领带': {'pinyin': 'jì lǐng dài', 'meaning': 'to tie a necktie', 'meaning_vn': 'thắt cà vạt'},
    '纽扣儿': {'pinyin': 'niǔ kòu er', 'meaning': 'button (on clothes)', 'meaning_vn': 'khuy áo, cúc áo'},
    '致力于': {'pinyin': 'zhì lì yú', 'meaning': 'to devote oneself to; dedicate', 'meaning_vn': 'dốc sức, cống hiến cho'},
    '都': {'pinyin': 'dōu', 'meaning': 'all; both; entirely', 'meaning_vn': 'đều; tất cả'},
    '读': {'pinyin': 'dú', 'meaning': 'to read; to study', 'meaning_vn': 'đọc; học tập'},
    '东西': {'pinyin': 'dōng xi', 'meaning': 'thing; stuff', 'meaning_vn': 'đồ vật; thứ; đồ đạc'},
    '冷': {'pinyin': 'lěng', 'meaning': 'cold', 'meaning_vn': 'lạnh; giá rét'},
    '那': {'pinyin': 'nà', 'meaning': 'that; those; then', 'meaning_vn': 'kia; đó; ấy'},
    '能': {'pinyin': 'néng', 'meaning': 'can; to be able to', 'meaning_vn': 'có thể; khả năng'},
    '年': {'pinyin': 'nián', 'meaning': 'year', 'meaning_vn': 'năm; tuổi'},
    '钱': {'pinyin': 'qián', 'meaning': 'money; coin', 'meaning_vn': 'tiền; đồng xu'},
    '三': {'pinyin': 'sān', 'meaning': 'three; 3', 'meaning_vn': 'ba; số 3'},
    '水': {'pinyin': 'shuǐ', 'meaning': 'water; liquid', 'meaning_vn': 'nước; chất lỏng'},
    '坐': {'pinyin': 'zuò', 'meaning': 'to sit; to ride', 'meaning_vn': 'ngồi; đi xe'},
    '白': {'pinyin': 'bái', 'meaning': 'white; pure; in vain', 'meaning_vn': 'trắng; màu trắng'},
    '百': {'pinyin': 'bǎi', 'meaning': 'hundred; 100', 'meaning_vn': 'trăm; một trăm'},
    '别': {'pinyin': 'bié', 'meaning': 'do not; other; separate', 'meaning_vn': 'đừng; khác; biệt'},
    '错': {'pinyin': 'cuò', 'meaning': 'wrong; mistaken; error', 'meaning_vn': 'sai; lỗi; sai lầm'},
    '高': {'pinyin': 'gāo', 'meaning': 'high; tall', 'meaning_vn': 'cao; cao lớn'},
    '还': {'pinyin': 'hái', 'meaning': 'still; yet; also', 'meaning_vn': 'còn; vẫn; vả lại'},
    '红': {'pinyin': 'hóng', 'meaning': 'red; popular', 'meaning_vn': 'đỏ; màu đỏ'},
    '路': {'pinyin': 'lù', 'meaning': 'road; path; way', 'meaning_vn': 'đường; con đường'},
    '门': {'pinyin': 'mén', 'meaning': 'gate; door; entrance', 'meaning_vn': 'cửa; cổng'},
    '题': {'pinyin': 'tí', 'meaning': 'topic; question; problem', 'meaning_vn': 'đề mục; câu hỏi; bài'},
    '向': {'pinyin': 'xiàng', 'meaning': 'towards; to face', 'meaning_vn': 'hướng về; phía'},
    '新': {'pinyin': 'xīn', 'meaning': 'new; fresh', 'meaning_vn': 'mới; mới mẻ'},
    '姓': {'pinyin': 'xìng', 'meaning': 'family name; surname', 'meaning_vn': 'họ; mang họ'},
    '雪': {'pinyin': 'xuě', 'meaning': 'snow', 'meaning_vn': 'tuyết; mưa tuyết'},
    '也': {'pinyin': 'yě', 'meaning': 'also; too', 'meaning_vn': 'cũng; cũng vậy'},
    '阴': {'pinyin': 'yīn', 'meaning': 'cloudy; shade; yin', 'meaning_vn': 'âm; u ám; nhiều mây'},
    '鱼': {'pinyin': 'yú', 'meaning': 'fish', 'meaning_vn': 'cá'},
    '元': {'pinyin': 'yuán', 'meaning': 'Yuan; currency unit', 'meaning_vn': 'đồng tệ; nguyên'},
    '张': {'pinyin': 'zhāng', 'meaning': 'sheet; piece (classifier)', 'meaning_vn': 'tờ; tấm; giương'},
    '长': {'pinyin': 'cháng', 'meaning': 'long; length', 'meaning_vn': 'dài; chiều dài'},
    '成': {'pinyin': 'chéng', 'meaning': 'to become; succeed', 'meaning_vn': 'thành; trở thành'},
    '方': {'pinyin': 'fāng', 'meaning': 'square; direction; side', 'meaning_vn': 'vuông; phương hướng'},
    '风': {'pinyin': 'fēng', 'meaning': 'wind', 'meaning_vn': 'gió; phong'},
    '关': {'pinyin': 'guān', 'meaning': 'to close; shut; turn off', 'meaning_vn': 'đóng; tắt; quan hệ'},
    '黄': {'pinyin': 'huáng', 'meaning': 'yellow; brown', 'meaning_vn': 'vàng; màu vàng'},
    '花': {'pinyin': 'huā', 'meaning': 'flower; to spend', 'meaning_vn': 'hoa; tiêu tốn'},
    '解': {'pinyin': 'jiě', 'meaning': 'to divide; solve; explain', 'meaning_vn': 'giải quyết; hiểu; cởi'},
    '蓝': {'pinyin': 'lán', 'meaning': 'blue', 'meaning_vn': 'xanh lam; xanh da trời'},
    '老': {'pinyin': 'lǎo', 'meaning': 'old; aged; always', 'meaning_vn': 'già; cũ; luôn luôn'},
    '马': {'pinyin': 'mǎ', 'meaning': 'horse', 'meaning_vn': 'ngựa; con ngựa'},
    '南': {'pinyin': 'nán', 'meaning': 'south', 'meaning_vn': 'hướng nam; phía nam'},
    '皮': {'pinyin': 'pí', 'meaning': 'skin; leather; peel', 'meaning_vn': 'da; vỏ ngoài'},
    '平': {'pinyin': 'píng', 'meaning': 'flat; level; equal; calm', 'meaning_vn': 'bằng phẳng; bình yên'},
    '秋': {'pinyin': 'qiū', 'meaning': 'autumn; fall', 'meaning_vn': 'mùa thu; thu'},
    '山': {'pinyin': 'shān', 'meaning': 'mountain; hill', 'meaning_vn': 'núi; ngọn núi'},
    '双': {'pinyin': 'shuāng', 'meaning': 'pair; double; two', 'meaning_vn': 'đôi; cặp; hai'},
    '万': {'pinyin': 'wàn', 'meaning': 'ten thousand; 10,000', 'meaning_vn': 'vạn; mười nghìn'},
    '夏': {'pinyin': 'xià', 'meaning': 'summer', 'meaning_vn': 'mùa hè; hạ'},
    '云': {'pinyin': 'yún', 'meaning': 'cloud', 'meaning_vn': 'mây; đám mây'},
    '吧': {'pinyin': 'ba', 'meaning': 'modal particle (suggestion)', 'meaning_vn': 'đi; nhé; nha (trợ từ)'},
    '得': {'pinyin': 'de', 'meaning': 'structural particle', 'meaning_vn': 'được; (trợ từ kết quả)'},
    '地': {'pinyin': 'de', 'meaning': 'structural particle (-ly)', 'meaning_vn': 'mà; một cách (trợ từ)'},
    '着': {'pinyin': 'zhe', 'meaning': 'aspect particle (ongoing)', 'meaning_vn': 'đang (trợ từ tiếp diễn)'},
    '过': {'pinyin': 'guo', 'meaning': 'experienced action marker', 'meaning_vn': 'qua; từng (trợ từ)'},
    '了': {'pinyin': 'le', 'meaning': 'completed action marker', 'meaning_vn': 'rồi (trợ từ hoàn thành)'},
    '吗': {'pinyin': 'ma', 'meaning': 'question particle', 'meaning_vn': 'không; hả (trợ từ nghi vấn)'},
    '呢': {'pinyin': 'ne', 'meaning': 'modal question particle', 'meaning_vn': 'thế; còn... thì sao'},
    '北京': {'pinyin': 'Běi jīng', 'meaning': 'Beijing, capital of China', 'meaning_vn': 'Bắc Kinh'},
    '菜': {'pinyin': 'cài', 'meaning': 'vegetable; dish; food', 'meaning_vn': 'rau; món ăn'},
    '黑': {'pinyin': 'hēi', 'meaning': 'black; dark', 'meaning_vn': 'đen; màu đen; tối'},
    '成功': {'pinyin': 'chéng gōng', 'meaning': 'success; to succeed', 'meaning_vn': 'thành công'},
    '友好': {'pinyin': 'yǒu hǎo', 'meaning': 'friendly; amicable', 'meaning_vn': 'thân thiện; hữu nghị'},
    '和平': {'pinyin': 'hé píng', 'meaning': 'peace; peaceful', 'meaning_vn': 'hòa bình'},
    '郊区': {'pinyin': 'jiāo qū', 'meaning': 'suburbs; outskirts', 'meaning_vn': 'ngoại ô; ngoại thành'},
    '青': {'pinyin': 'qīng', 'meaning': 'green; blue; youth', 'meaning_vn': 'xanh; thanh; tuổi trẻ'},
    '延长': {'pinyin': 'yán cháng', 'meaning': 'to prolong; to extend', 'meaning_vn': 'kéo dài; gia hạn'},
    '资源': {'pinyin': 'zī yuán', 'meaning': 'natural resource; resource', 'meaning_vn': 'tài nguyên'},
    '安宁': {'pinyin': 'ān níng', 'meaning': 'peaceful; tranquil', 'meaning_vn': 'yên bình; an ninh'},
    '淡水': {'pinyin': 'dàn shuǐ', 'meaning': 'freshwater', 'meaning_vn': 'nước ngọt'},
    '丰满': {'pinyin': 'fēng mǎn', 'meaning': 'plump; full-figured; well-rounded', 'meaning_vn': 'đầy đặn; đẫy đà'},
    '孙子': {'pinyin': 'sūn zi', 'meaning': 'grandson', 'meaning_vn': 'cháu nội'},
    '管子': {'pinyin': 'guǎn zi', 'meaning': 'tube; pipe', 'meaning_vn': 'ống dẫn; ống tuýp'},
    '成语': {'pinyin': 'chéng yǔ', 'meaning': 'idiom; Chinese set expression', 'meaning_vn': 'thành ngữ'},
    '打工': {'pinyin': 'dǎ gōng', 'meaning': 'to work part-time or temporary job', 'meaning_vn': 'làm thuê; làm thêm'},
    '修': {'pinyin': 'xiū', 'meaning': 'to repair; to study; build', 'meaning_vn': 'sửa chữa; tu sửa; học'},
    '越': {'pinyin': 'yuè', 'meaning': 'to surpass; the more...', 'meaning_vn': 'vượt qua; càng... càng'},
    '些': {'pinyin': 'xiē', 'meaning': 'some; few; several', 'meaning_vn': 'một vài; một số; ít'},
    '棵': {'pinyin': 'kē', 'meaning': 'classifier for trees, plants', 'meaning_vn': 'cây (lượng từ)'},
    '数量': {'pinyin': 'shù liàng', 'meaning': 'quantity; amount', 'meaning_vn': 'số lượng'},
    '壶': {'pinyin': 'hú', 'meaning': 'pot; kettle; jug', 'meaning_vn': 'ấm; bình nước'},
    '甲': {'pinyin': 'jiǎ', 'meaning': 'first (in rank); shell; armor', 'meaning_vn': 'giáp; thứ nhất; vỏ'},
    '只好': {'pinyin': 'zhǐ hǎo', 'meaning': 'without any better option; to have to', 'meaning_vn': 'đành phải; đành chịu'},
    '之': {'pinyin': 'zhī', 'meaning': 'possessive particle; him, her, it', 'meaning_vn': 'của; nó (trợ từ)'},
    '呀': {'pinyin': 'ya', 'meaning': 'modal particle', 'meaning_vn': 'nha; nhé (trợ từ)'},
    '本': {'pinyin': 'běn', 'meaning': 'root; book classifier; origin', 'meaning_vn': 'gốc; quyển (sách); vốn'},
    '本事': {'pinyin': 'běn shi', 'meaning': 'ability; skill', 'meaning_vn': 'bản lĩnh; tài năng'},
    '笑话': {'pinyin': 'xiào hua', 'meaning': 'joke; funny story', 'meaning_vn': 'trò cười; chuyện cười'},
    '醒': {'pinyin': 'xǐng', 'meaning': 'to wake up; to awaken', 'meaning_vn': 'tỉnh dậy; thức giấc'},
    '朝代': {'pinyin': 'cháo dài', 'meaning': 'dynasty; reign', 'meaning_vn': 'triều đại'},
    '都市': {'pinyin': 'dū shì', 'meaning': 'city; metropolis', 'meaning_vn': 'đô thị; thành phố'},
    '县': {'pinyin': 'xiàn', 'meaning': 'county', 'meaning_vn': 'huyện; quận huyện'},
    '对话': {'pinyin': 'duì huà', 'meaning': 'dialogue; conversation', 'meaning_vn': 'đối thoại; hội thoại'},
    '聊天': {'pinyin': 'liáo tiān', 'meaning': 'to chat', 'meaning_vn': 'trò chuyện; tán gẫu'},
    '说话': {'pinyin': 'shuō huà', 'meaning': 'to speak; to say', 'meaning_vn': 'nói; nói chuyện'},
    '台': {'pinyin': 'tái', 'meaning': 'platform; stage; machine classifier', 'meaning_vn': 'đài; bệ; cái (máy)'},
    '支': {'pinyin': 'zhī', 'meaning': 'branch; stick classifier; support', 'meaning_vn': 'chi; nhánh; cây (bút)'},
    '根': {'pinyin': 'gēn', 'meaning': 'root; base; thin long classifier', 'meaning_vn': 'rễ; gốc; sợi; que'},
    '封': {'pinyin': 'fēng', 'meaning': 'to seal; envelope classifier', 'meaning_vn': 'phong; bức (thư); đóng'},
    '把': {'pinyin': 'bǎ', 'meaning': 'to hold; handle classifier', 'meaning_vn': 'cầm; nắm; chiếc; cái'},
    '条': {'pinyin': 'tiáo', 'meaning': 'strip; long item classifier', 'meaning_vn': 'sợi; con (đường, cá)'},
    '张': {'pinyin': 'zhāng', 'meaning': 'sheet, flat object classifier', 'meaning_vn': 'tờ; tấm; chiếc (vé)'},
    '位': {'pinyin': 'wèi', 'meaning': 'position; polite person classifier', 'meaning_vn': 'vị; ngài; chỗ ngồi'},
    '件': {'pinyin': 'jiàn', 'meaning': 'item; component; clothes classifier', 'meaning_vn': 'kiện; cái (áo, việc)'},
    '面': {'pinyin': 'miàn', 'meaning': 'face; side; surface; noodle', 'meaning_vn': 'mặt; phía; diện; mì'},
    '头': {'pinyin': 'tóu', 'meaning': 'head; chief; big animal classifier', 'meaning_vn': 'đầu; con (bò, lợn)'},
    '个': {'pinyin': 'gè', 'meaning': 'general classifier', 'meaning_vn': 'cái; chiếc; người'},
    '复兴': {'pinyin': 'fù xīng', 'meaning': 'to revive; rejuvenate', 'meaning_vn': 'phục hưng; khôi phục'},
    '富裕': {'pinyin': 'fù yù', 'meaning': 'prosperous; well-to-do', 'meaning_vn': 'giàu có; dồi dào'},
    '威信': {'pinyin': 'wēi xìn', 'meaning': 'prestige; authority; trust', 'meaning_vn': 'uy tín; uy danh'},
    '兴隆': {'pinyin': 'xīng lóng', 'meaning': 'prosperous; thriving', 'meaning_vn': 'thịnh vượng; phát đạt'},
    '振兴': {'pinyin': 'zhèn xīng', 'meaning': 'to revitalize; develop', 'meaning_vn': 'chấn hưng; phục hưng'},
}

# Translate missing or check each word
print("3. Processing all 5,000 words...")
updated_count = 0
override_count = 0

for w in words:
    h = w['hanzi']
    
    # 1. Check special override first
    if h in SPECIAL_OVERRIDE:
        spec = SPECIAL_OVERRIDE[h]
        if 'pinyin' in spec:
            w['pinyin'] = spec['pinyin']
            w['clean'] = re.sub(r'[^a-zA-Z]', '', remove_accents(spec['pinyin'])).lower()
            w['spaced'] = ' '.join(re.sub(r'[^a-zA-Z\s]', '', remove_accents(spec['pinyin'])).lower().split())
        if 'meaning' in spec:
            w['meaning'] = spec['meaning']
        w['meaning_vn'] = spec['meaning_vn']
        override_count += 1
        continue
    
    # 2. Check dictionary items
    items = dict_map.get(h, [])
    best_item = None
    best_vi = ''
    
    for it in items:
        vi = it.get('vi', '')
        # Ignore surname definitions like "họ [Name]"
        if vi and not vi.strip().startswith('họ ['):
            best_item = it
            best_vi = vi
            break
            
    if not best_vi and items:
        # Fallback to first item's vi
        best_item = items[0]
        best_vi = items[0].get('vi', '')

    cleaned_vi = clean_vi_text(best_vi)
    
    # If still empty or contains "họ [", fall back to translation or English meaning
    if not cleaned_vi or cleaned_vi.startswith('họ ['):
        cleaned_vi = clean_vi_text(w.get('meaning', ''))
        
    w['meaning_vn'] = cleaned_vi
    updated_count += 1

print(f"Processed: {override_count} overrides, {updated_count} dictionary matches")

# Save updated words.js
js_content = "/**\n * 5,000 Common Chinese Words Library (HSK 1-6)\n * Standard vocabulary dataset with Pinyin, Clean Pinyin, English & Vietnamese Meanings\n */\n"
js_content += "window.CHINESE_WORDS_5000 = " + json.dumps(words, ensure_ascii=False) + ";\n"

with open('words.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Successfully written updated words.js with Vietnamese annotations!")
