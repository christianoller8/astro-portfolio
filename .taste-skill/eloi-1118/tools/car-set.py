# Cambia los trazados de la caricatura por nombre de pieza. Uso: python3 car-set.py pieza=d pieza=d ...
import re, sys
p = 'src/components/site/Caricature.astro'
s = open(p, encoding='utf8').read()
for arg in sys.argv[1:]:
    part, d = arg.split('=', 1)
    pat = re.compile(r'(data-part="%s"\s+pathLength="1"\s+d=")[^"]*(")' % re.escape(part))
    assert len(pat.findall(s)) == 1, part
    s = pat.sub(lambda m: m.group(1) + d + m.group(2), s)
open(p, 'w', encoding='utf8').write(s)
