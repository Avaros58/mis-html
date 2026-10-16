"""Completar metadatos cuando se conozca la URL real. No publica ni accede a la red."""
from pathlib import Path
from urllib.parse import urlsplit,urljoin
import argparse,re

p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--url',required=True,help='URL HTTPS definitiva del directorio, terminada en /')
args=p.parse_args();u=urlsplit(args.url)
if u.scheme!='https' or not u.netloc or u.query or u.fragment or not args.url.endswith('/'):
 p.error('Usa una URL HTTPS absoluta de directorio, sin consulta ni fragmento y terminada en /.')
base=Path(__file__).resolve().parent
for file in [base/'index.html',*sorted((base/'lecturas').glob('*.html'))]:
 text=file.read_text(encoding='utf-8');public=urljoin(args.url,file.relative_to(base).as_posix())
 image=urljoin(args.url,'assets/portada.png')
 text=re.sub(r'<link rel="canonical"[^>]*>|<meta property="og:url"[^>]*>','',text)
 text=text.replace('</head>',f'<link rel="canonical" href="{public}"><meta property="og:url" content="{public}"></head>')
 text=re.sub(r'(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*(")',lambda m:m[1]+image+m[2],text)
 text=text.replace('<!-- URL pública pendiente: completar canonical, og:url y URLs absolutas de imágenes con herramientas/configurar_publicacion.py antes de publicar. -->','<!-- Metadatos configurados para URL definitiva; no acredita publicación. -->')
 file.write_text(text,encoding='utf-8')
print('Metadatos configurados. No se ha publicado ni enviado ningún archivo. Vuelve a generar el ZIP antes de subirlo.')
