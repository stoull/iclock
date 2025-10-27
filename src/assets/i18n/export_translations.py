# export_translations.py
import json
import csv
import os
from pathlib import Path

def export_translations_to_csv():
    """导出多语言翻译文件到CSV"""
    
    # 配置路径
    locales_path = Path('./')
    output_file = 'translations_export.csv'
    
    # 支持的语种
    languages = {
        'en': 'English',
        'zh-Hans': '简体中文',
        'zh-Hant': '繁體中文'
    }
    
    try:
        # 读取所有语言文件
        translations = {}
        for lang_code, lang_name in languages.items():
            file_path = locales_path / f'{lang_code}.json'
            if file_path.exists():
                with open(file_path, 'r', encoding='utf-8') as f:
                    translations[lang_code] = json.load(f)
        
        if not translations:
            print("未找到任何翻译文件")
            return
        
        # 收集所有翻译键
        all_keys = set()
        for lang_data in translations.values():
            all_keys.update(flatten_dict(lang_data).keys())
        
        # 写入CSV
        with open(output_file, 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.writer(f)
            
            # 写入表头
            headers = ['Key'] + [languages[code] for code in translations.keys()]
            writer.writerow(headers)
            
            # 写入数据
            for key in sorted(all_keys):
                row = [key]
                for lang_code in translations.keys():
                    lang_data = flatten_dict(translations[lang_code])
                    row.append(lang_data.get(key, ''))
                writer.writerow(row)
        
        print(f"翻译文件已导出到: {output_file}")
        
    except Exception as e:
        print(f"导出失败: {e}")

def flatten_dict(d, parent_key='', sep='.'):
    """展平嵌套字典"""
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

if __name__ == "__main__":
    export_translations_to_csv()