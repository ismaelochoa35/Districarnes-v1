from pathlib import Path
import re
import manual_visual as manual

manual.NATURAL=True
manual.DESTINATION='Manual_explicado_Districarnes.pdf'
root=Path(__file__).resolve().parents[1]
narrative=(root/'MANUAL_EXPLICADO_DISTRICARNES.md').read_text(encoding='utf-8')
reference=(root/'ARQUITECTURA_ARCHIVO_POR_ARCHIVO.md').read_text(encoding='utf-8')
reference=reference[reference.index('## 4. Archivos de raíz'):]
reference=re.sub(r'^## (\d+)\. ',lambda m:f'## Referencia {int(m[1])-3}. ',reference,flags=re.M)
manual.source=narrative+'\n\n'+reference
manual.build_pdf()
