from pathlib import Path
import re, json, html
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, KeepTogether, Preformatted
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Polygon

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output'/'manual_visual'
OUT.mkdir(parents=True,exist_ok=True)
CAP=OUT/'capturas'; CAP.mkdir(exist_ok=True)
MD=ROOT/'ARQUITECTURA_ARCHIVO_POR_ARCHIVO.md'
source=MD.read_text(encoding='utf-8')

specs=[]
def cap(path,start=1,count=18,label=None,note=None):
    lines=(ROOT/path).read_text(encoding='utf-8-sig').splitlines()
    part=lines[start-1:start-1+count]
    key=f'figura_{len(specs)+1:02d}'
    specs.append(dict(key=key,path=path,start=start,lines=part,label=label or path,note=note or 'Lee las líneas de arriba junto con la explicación del archivo. Los números corresponden al código original.'))
    return key

for path in ['.gitignore','INICIAR.bat','BACKEND/package.json','BACKEND/package-lock.json','BACKEND/src/server.js','BACKEND/src/app.js','BACKEND/src/config/database.js']:
    cap(path,count=20)
for directory in ['routes','middleware','services','controllers','models']:
    for p in sorted((ROOT/'BACKEND/src'/directory).glob('*.js')):
        path=p.relative_to(ROOT).as_posix()
        start=79 if p.name=='saleModel.js' else 1
        cap(path,start,20)
for name in ['index.html','app.html']:
    cap('FRONTEND/'+name,10 if name=='index.html' else 14,18)
for name in ['api.js','ui.js','login.js','app.js','dashboard.js','inventory.js','administrators.js','sales.js']:
    cap('FRONTEND/js/'+name,1,19)
cap('FRONTEND/css/styles.css',1,20)
cap('BACKEND/database/schema.sql',32,17,note='Modelo de datos: precio y stock se interpretan usando unidad_medida; categoria_id relaciona el producto con categorías.')
cap('build_integracion_tests.mjs',32,18,note='Este código construye un libro de pruebas. No ejecuta una venta: los resultados del plan deben verificarse por separado.')
cap('FRONTEND/js/inventory.js',122,19,label='Guardar producto: el evento conecta la vista con la API',note='product-id decide POST o PUT. productPayload recoge los campos. apiRequest transmite el objeto al controlador por HTTP.')
cap('FRONTEND/js/sales.js',347,22,label='Registrar venta: JSON enviado por la vista',note='El navegador envía producto, cantidad y unidad. El servidor consulta el precio real; no acepta el precio del carrito como autoridad.')
cap('BACKEND/src/models/saleModel.js',120,26,label='Venta: escritura y confirmación de la transacción',note='Los INSERT de detalle activan los triggers. commit confirma; rollback revierte ante error; release libera la conexión.')
cap('BACKEND/database/schema.sql',333,29,label='MySQL: validar detalle y descontar inventario',note='BEFORE INSERT valida; AFTER INSERT descuenta. El UPDATE de productos también genera auditoría. Este código se ejecuta dentro de MySQL.')
cap('FRONTEND/css/styles.css',1002,30,label='Impresión: se muestran los diálogos abiertos',note='window.print abre la impresión del navegador. Las reglas @media print determinan qué partes del documento quedan visibles.')

(OUT/'capturas.json').write_text(json.dumps(specs,ensure_ascii=False,indent=2),encoding='utf-8')

def inline(text):
    text=html.escape(text).replace('→',' &rarr; ').replace('←',' &larr; ')
    text=re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)',r'<link href="\2" color="#862C3B">\1</link>',text)
    text=re.sub(r'\*\*(.*?)\*\*',r'<b>\1</b>',text)
    text=re.sub(r'`([^`]+)`',r'<font name="Code" size="9">\1</font>',text)
    return text

def build_pdf():
    fonts=Path('C:/Windows/Fonts')
    for name,file in [('Body','arial.ttf'),('Body-Bold','arialbd.ttf'),('Body-Italic','ariali.ttf'),('Code','consola.ttf')]:
        pdfmetrics.registerFont(TTFont(name,str(fonts/file)))
    pdfmetrics.registerFontFamily('Body',normal='Body',bold='Body-Bold',italic='Body-Italic',boldItalic='Body-Bold')
    styles={
      'body':ParagraphStyle('body',fontName='Body',fontSize=10.2,leading=15,spaceAfter=8,allowWidows=0,allowOrphans=0,textColor=colors.HexColor('#28313C')),
      'h1':ParagraphStyle('h1',fontName='Body-Bold',fontSize=19,leading=23,spaceBefore=17,spaceAfter=12,keepWithNext=True,textColor=colors.HexColor('#862C3B')),
      'h2':ParagraphStyle('h2',fontName='Body-Bold',fontSize=13,leading=17,spaceBefore=13,spaceAfter=8,keepWithNext=True,textColor=colors.HexColor('#28313C')),
      'caption':ParagraphStyle('caption',fontName='Body',fontSize=9,leading=12,spaceAfter=10,textColor=colors.HexColor('#526170')),
      'code':ParagraphStyle('code',fontName='Code',fontSize=8,leading=11,spaceAfter=1),
      'item':ParagraphStyle('item',fontName='Body',fontSize=10,leading=14,spaceAfter=6,leftIndent=12,borderPadding=5),
    }
    W=483
    story=[]
    def p(text,style='body'): return Paragraph(inline(text),styles[style])
    def figure(s):
        from PIL import Image as PILImage
        path=CAP/(s['key']+'.png')
        with PILImage.open(path) as im: iw,ih=im.size
        height=W*ih/iw
        return KeepTogether([p('CAPTURA '+str(specs.index(s)+1)+' · '+s['label'],'caption'),Image(str(path),width=W,height=height),Spacer(1,7),p(s['note'],'caption')])
    natural=globals().get('NATURAL',False)
    title='Entender tu proyecto<br/>paso a paso' if natural else 'Manual visual<br/>de tu código'
    story += [Spacer(1,50),p('DISTRICARNES','h1'),Spacer(1,10),Paragraph(title,ParagraphStyle('cover',fontName='Body-Bold',fontSize=36,leading=41,textColor=colors.HexColor('#862C3B'))),Spacer(1,20),p('Modelo · Vista · Controlador','h2'),p('Qué hace el sistema, dónde están sus botones y cómo se conectan sus archivos.' if natural else 'Archivo por archivo, función por función y conexión por conexión.'),Spacer(1,20),p(f'{len(specs)} capturas de código'+(' + 10 pantallas del proyecto con datos ilustrativos.' if natural else ' · Explicación de los 30 módulos JavaScript · SQL, HTML, CSS y configuración.')),Spacer(1,20),p('Empieza por la explicación en lenguaje natural. Después consulta la referencia de funciones y sigue el código en tu editor.' if natural else 'Las capturas son vistas renderizadas de fragmentos originales, con números de línea. No son pantallas de una venta ejecutada ni fotografías del editor.'),p('Material de estudio · 6 de septiembre de 2026'),PageBreak()]
    story += [p('Cómo estudiar con este manual','h1'),p('1. Lee qué responsabilidad tiene el archivo dentro de MVC.'),p('2. Compara la captura con el archivo en tu editor: sus números de línea son reales.'),p('3. Sigue quién lo llama, qué recibe y qué devuelve. Después prueba explicarlo sin mirar.'),p('4. Distingue el funcionamiento actual de las mejoras propuestas. No cambies varios archivos a la vez durante una práctica.'),p('Mapa de lectura','h2')]
    for line in source.splitlines():
        if line.startswith('## '): story.append(p(line[3:],'caption'))
    story.append(PageBreak())
    used=set()
    lines=source.splitlines(); i=0; paragraph=[]
    def flush():
        if paragraph: story.append(p(' '.join(paragraph))); paragraph.clear()
    def match_heading(title):
        for s in specs[:-5]:
            if s['key'] in used: continue
            if s['path'] in title or title==s['path']:
                heading=story.pop()
                lead=[]
                if story and isinstance(story[-1],Paragraph) and story[-1].style.name=='h1':lead.append(story.pop())
                story.append(KeepTogether(lead+[heading]+figure(s)._content));used.add(s['key'])
    while i<len(lines):
        line=lines[i].strip()
        if i==0: i+=1;continue
        if line.startswith('[[pantalla:'):
            flush();name=line[len('[[pantalla:'):-2]
            from PIL import Image as PILImage
            screen=OUT/'recorrido'/(name+'.png')
            with PILImage.open(screen) as im:iw,ih=im.size
            group=[p('PANTALLA '+name[:2]+' · Interfaz real con datos ilustrativos','caption'),Image(str(screen),width=W,height=W*ih/iw),Spacer(1,7)]
            if story and isinstance(story[-1],Paragraph) and story[-1].style.name=='h1':group.insert(0,story.pop())
            story.append(KeepTogether(group))
        elif line.startswith('```'):
            flush();lang=line[3:]; code=[];i+=1
            while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
            if lang=='mermaid':
                drawing=Drawing(W,95)
                for x,title,sub in [(0,'VISTA','HTML y JavaScript'),(170,'CONTROLADOR','API y validación'),(340,'MODELO','Datos y negocio')]:
                    drawing.add(Rect(x,30,140,57,rx=7,fillColor=colors.HexColor('#F5EBED'),strokeColor=colors.HexColor('#862C3B')))
                    drawing.add(String(x+70,65,title,textAnchor='middle',fontName='Body-Bold',fontSize=10,fillColor=colors.HexColor('#862C3B')))
                    drawing.add(String(x+70,46,sub,textAnchor='middle',fontName='Body',fontSize=8.5))
                for x in [142,312]:
                    drawing.add(Line(x,59,x+24,59,strokeColor=colors.HexColor('#862C3B')))
                    drawing.add(Polygon([x+24,59,x+18,63,x+18,55],fillColor=colors.HexColor('#862C3B'),strokeColor=None))
                story.append(drawing)
                story.append(p('VISTA: HTML y módulos del navegador → API → CONTROLADOR → MODELO → MySQL. La respuesta vuelve a la vista. Sesiones y conversiones apoyan ese recorrido.','item'))
            else:
                block=[]
                for cl in code:
                    # Wrap text as paragraphs to avoid clipped long source/tree lines.
                    block.append(Paragraph(html.escape(cl).replace(' ','&nbsp;').replace('→','-&gt;').replace('←','&lt;-'),styles['code']))
                story.append(KeepTogether(block+[Spacer(1,9)]))
        elif line.startswith('## '):
            flush();title=line[3:];story.append(p(title,'h1'));match_heading(title)
        elif line.startswith('### '):
            flush();title=line[4:];story.append(p(title,'h2'));match_heading(title)
        elif line.startswith('|'):
            flush();rows=[]
            while i<len(lines) and lines[i].strip().startswith('|'):
                rows.append([c.strip().replace('\\|','|') for c in re.split(r'(?<!\\)\|',lines[i].strip().strip('|'))]);i+=1
            i-=1
            headers=rows[0]
            for row in rows[2:]:
                if not row:continue
                label=row[0];rest=' '.join(f'<b>{html.escape(headers[j])}:</b> {inline(c)}' for j,c in enumerate(row[1:],1) if j<len(headers))
                story.append(Paragraph(f'<b>{inline(label)}</b><br/>{rest}',styles['item']))
        elif not line:flush()
        elif re.match(r'^(\d+\. |\- )',line):
            flush();story.append(p(line,'item'))
        else:paragraph.append(line)
        i+=1
    flush()
    story.append(PageBreak());story.append(p('Galería práctica: sigue la operación','h1'))
    for s in specs:
        if s['key'] not in used:story.append(figure(s))
    def furniture(c,doc):
        c.setStrokeColor(colors.HexColor('#DDDFE3'));c.line(56,40,539,40)
        c.setFont('Body',8);c.setFillColor(colors.HexColor('#687280'));c.drawString(56,27,'DISTRICARNES · MANUAL VISUAL MVC');c.drawRightString(539,27,str(doc.page))
        if doc.page>1:c.drawString(56,810,'Código real + explicación · Material de estudio')
    dest=OUT/globals().get('DESTINATION','Manual_visual_Districarnes.pdf')
    class ManualDoc(SimpleDocTemplate):
        def afterFlowable(self,flowable):
            if isinstance(flowable,Paragraph) and flowable.style.name=='h1':
                key='seccion_'+str(getattr(self,'section_number',0))
                self.section_number=getattr(self,'section_number',0)+1
                self.canv.bookmarkPage(key)
                self.canv.addOutlineEntry(flowable.getPlainText(),key,level=0,closed=False)
    doc=ManualDoc(str(dest),pagesize=(595,842),leftMargin=56,rightMargin=56,topMargin=48,bottomMargin=55,title='Districarnes - Manual explicado MVC' if natural else 'Districarnes - Manual visual MVC',author='Districarnes')
    doc.build(story,onFirstPage=furniture,onLaterPages=furniture)
    print(dest)

if __name__=='__main__':
    import sys
    if '--pdf' in sys.argv:build_pdf()
    else:print(f'{len(specs)} capturas preparadas')
