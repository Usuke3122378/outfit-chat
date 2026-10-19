"""提出記事.md → 提出記事_貼り付け用.html（画像を埋め込んだ1ファイル、貼り付け向けにスタイルは直書き）"""
import base64, pathlib, re, sys
import markdown

docs = pathlib.Path(sys.argv[1])
md = (docs / "提出記事.md").read_text()
md = re.sub(r"^> .*\n(> .*\n)*\n?", "", md, flags=re.M)  # 冒頭の「控えです」注記は貼り付けに不要
html = markdown.markdown(md, extensions=["tables", "fenced_code"])

def embed(m):
    alt, src = m.group(1), m.group(2)
    b64 = base64.b64encode((docs / src).read_bytes()).decode()
    return f'<p><img alt="{alt}" src="data:image/png;base64,{b64}" style="max-width:640px;width:100%;border:1px solid #ddd;border-radius:8px"></p>'
html = re.sub(r'<p><img alt="([^"]*)" src="([^"]+)" ?/?></p>', embed, html)
html = html.replace("<table>", '<table style="border-collapse:collapse">')
html = re.sub(r"<(t[hd])>", r'<\1 style="border:1px solid #ccc;padding:4px 8px">', html)
html = html.replace("<pre>", '<pre style="background:#f5f5f5;padding:12px;border-radius:6px;font-size:12px">')
(docs / "提出記事_貼り付け用.html").write_text(f'<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>提出記事</title></head><body style="font-family:sans-serif;line-height:1.7;max-width:760px">{html}</body></html>')
print("作成:", docs / "提出記事_貼り付け用.html")
