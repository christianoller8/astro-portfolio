# Texto legible de una página descargada: encabezados, párrafos, listas, botones y enlaces, en orden.
# Uso: python3 -I outline.py <archivo.html> [max_caracteres]
import re, sys, html as H
from html.parser import HTMLParser

path = sys.argv[1]
limit = int(sys.argv[2]) if len(sys.argv) > 2 else 20000
src = open(path, encoding='utf8').read()
main = re.search(r'<body.*</body>', src, re.S).group(0)

BLOCK = {'h1', 'h2', 'h3', 'h4', 'p', 'li', 'button', 'figcaption', 'dt', 'dd', 'blockquote', 'summary', 'label', 'th', 'td', 'caption', 'legend'}
SKIP = {'script', 'style', 'svg', 'template', 'noscript'}

class P(HTMLParser):
    def __init__(self):
        super().__init__()
        self.out = []; self.stack = []; self.buf = []; self.skip = 0; self.cur = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in SKIP: self.skip += 1; return
        if self.skip: return
        if tag in ('section', 'header', 'footer', 'article', 'aside', 'dialog', 'form', 'nav') and (a.get('id') or a.get('class')):
            self.flush(); self.out.append(f"\n[{tag} #{a.get('id','')} .{(a.get('class') or '').split(' ')[0]}]")
        if tag in BLOCK:
            self.flush(); self.cur = tag
        if tag == 'a' and a.get('href'):
            self.buf.append('〔')
            self.href = a.get('href')
        if tag == 'img' and a.get('alt') is not None:
            self.buf.append(f" [img alt=\"{a.get('alt')}\"] ")
        if tag == 'br': self.buf.append(' / ')
    def handle_endtag(self, tag):
        if tag in SKIP: self.skip = max(0, self.skip - 1); return
        if self.skip: return
        if tag == 'a' and getattr(self, 'href', None):
            self.buf.append(f'→{self.href}〕'); self.href = None
        if tag in BLOCK: self.flush()
    def handle_data(self, d):
        if self.skip: return
        self.buf.append(d)
    def flush(self):
        t = re.sub(r'\s+', ' ', ''.join(self.buf)).strip()
        if t and t not in ('〔', ):
            self.out.append(f"{(self.cur or '·'):>10}: {t}")
        self.buf = []; self.cur = None

p = P(); p.feed(main); p.flush()
text = '\n'.join(p.out)
print(text[:limit])
