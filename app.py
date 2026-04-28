from flask import Flask, render_template, request, jsonify, send_file
from dotenv import load_dotenv
import os
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'default-secret-key')

# Dados do portfólio com múltiplas imagens por projeto
projetos_data = [
    {
        'id': 1,
        'titulo': 'Reestruturação de Infraestrutura de Rede',
        'contexto': 'Organização com falhas de conectividade, segurança frágil e equipa desalinhada.',
        'acao': 'Diagnóstico técnico, redesenhado da topologia, formação da equipa interna e implementação de protocolos de segurança.',
        'tecnologias': ['Cisco', 'VLANs', 'Firewall', 'Documentação Técnica'],
        'categorias': ['Redes', 'Gestão de Mudança', 'Formação'],
        'resultado': '+95% de estabilidade, equipa capacitada, redução de custos operacionais.',
        'imagens': [
            'eng_ar21.jpeg',
            'red_ar21.jpeg',
            'red2_ar21.jpeg'
        ]
    },
    {
        'id': 2,
        'titulo': 'Programa de Mentoria Técnica',
        'contexto': 'Jovens profissionais com base técnica, mas sem orientação estratégica.',
        'acao': 'Criação de programa estruturado com módulos de pensamento sistémico, comunicação técnica e planeamento de carreira.',
        'tecnologias': ['Metodologias Ágeis', 'Coaching', 'Plano de Carreira'],
        'categorias': ['Mentoria', 'Formação', 'Desenvolvimento'],
        'resultado': '+70% de retenção de talentos, profissionais promovidos em 6 meses.',
        'imagens': [
            'ens_ar21.jpeg',
            'form_ar21.jpeg',
            'estud_ar21.jpeg'
        ]
    },
    {
        'id': 3,
        'titulo': 'Diagnóstico de Perfis para Equipa de TI',
        'contexto': 'Equipa com conflitos, baixa produtividade e rotatividade elevada.',
        'acao': 'Aplicação de matriz de análise comportamental, mapeamento de competências e proposta de redistribuição de funções.',
        'tecnologias': ['Análise Comportamental', 'Feedback 360°', 'Indicadores de Desempenho'],
        'categorias': ['Análise de Perfil', 'Gestão de Pessoal', 'Estratégia'],
        'resultado': 'Redução de 40% na rotatividade, melhoria mensurável no clima organizacional.',
        'imagens': [
            'trab_ar21.jpeg',
            'trab2_ar21.jpeg',
            'entr_ar21.jpeg'
        ]
    }
]

# Galeria da página Sobre
sobre_imagens = [
    {'url': 'disc_ar21.jpeg', 'titulo': 'Palestra sobre Liderança', 'categoria': 'Eventos'},
    {'url': 'entr_ar21.jpeg', 'titulo': 'Workshop de Formação', 'categoria': 'Formação'},
    {'url': 'ens_ar21.jpeg', 'titulo': 'Mentoria em Ação', 'categoria': 'Mentoria'},
    {'url': 'exp_ar21.jpeg', 'titulo': 'Networking Profissional', 'categoria': 'Networking'},
    {'url': 'dipl_ar21.jpeg', 'titulo': 'Certificação Reconhecida', 'categoria': 'Certificações'},
    {'url': 'eng_ar21.jpeg', 'titulo': 'Equipa de Alta Performance', 'categoria': 'Equipas'}
]

# Imagens da página Conhecimento
conhecimento_imagens = [
    {'url': 'serv_ar21.jpeg', 'titulo': 'Tecnologia com Visão Económica', 'descricao': 'Soluções sustentáveis'},
    {'url': 'estud_ar21.jpeg', 'titulo': 'Liderança Técnica', 'descricao': '3 Princípios fundamentais'},
    {'url': 'trab_ar21.jpeg', 'titulo': 'Análise de Perfil', 'descricao': 'Para além do óbvio'},
    {'url': 'ens_ar21.jpeg', 'titulo': 'Formação Estratégica', 'descricao': 'Capacitar para ação real'},
    {'url': 'amiz_ar21.jpeg', 'titulo': 'Cooperação Social', 'descricao': 'Adaptar-se so Meio Humano'},
    {'url': 'vis_ar21.jpeg', 'titulo': 'Visitas', 'descricao': 'Conhecendo o Meio Social'},
    {'url': 'vist_ar21.jpeg', 'titulo': 'Visitas', 'descricao': 'Conhecendo o Meio Social'},
    {'url': 'prof2_ar21.jpeg', 'titulo': 'Profissionalismo', 'descricao': 'Capacidade de saber Liderar e Organizar'}
]

insights_data = [
    {
        'titulo': 'Tecnologia com Visão Económica',
        'descricao': 'Uma solução técnica só é válida se for economicamente sustentável. Avalia sempre: custo de implementação, escalabilidade e impacto operacional.',
        'icone': '💰'
    },
    {
        'titulo': 'Liderança Técnica: 3 Princípios',
        'descricao': '1. Clareza > Complexidade\n2. Responsabilidade partilhada, não delegação cega\n3. Feedback contínuo, não avaliação pontual',
        'icone': '🎯'
    },
    {
        'titulo': 'Análise de Perfil: Para Além do Óbvio',
        'descricao': 'Não classifico pessoas — identifico padrões de decisão, comunicação e resposta a pressão. O objetivo não é rotular, é potenciar.',
        'icone': '🧠'
    }
]

@app.route('/')
def index():
    return render_template('index.html', insights=insights_data[:2], projetos=projetos_data[:3])

@app.route('/sobre')
def sobre():
    return render_template('sobre.html', imagens=sobre_imagens)

@app.route('/projetos')
def projetos():
    return render_template('projetos.html', projetos=projetos_data)

@app.route('/conhecimento')
def conhecimento():
    return render_template('conhecimento.html', insights=insights_data, imagens=conhecimento_imagens)

@app.route('/contacto')
def contacto():
    return render_template('contacto.html')

@app.route('/api/enviar-mensagem', methods=['POST'])
def enviar_mensagem():
    try:
        data = request.json
        nome = data.get('nome')
        email = data.get('email')
        mensagem = data.get('mensagem')
        
        # Monta o conteúdo do email
        assunto = f"Mensagem do Portfólio - {nome}"
        corpo = f"""
        Nova mensagem do portfólio!
        
        Nome: {nome}
        Email: {email}
        
        Mensagem:
        {mensagem}
        
        ---
        Enviado através do site de Aristides Budimbo
        """
        
        # Configuração do email
        import smtplib
        from email.message import EmailMessage
        
        msg = EmailMessage()
        msg['Subject'] = assunto
        msg['From'] = 'diano.budimboja@gmail.com'  # ← MUDE AQUI
        msg['To'] = 'aristide.thidewalla@gmail.com'
        msg.set_content(corpo)
        
        # Envia o email
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login('diano.budimboja@gmail.com', 'nnxftydkqyhympom')  # ← MUDE AQUI
            smtp.send_message(msg)
        
        return jsonify({'success': True, 'message': 'Mensagem Enviada com Sucesso!'})
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro: {str(e)}'}), 500

@app.route('/api/download-cv')
def download_cv():
    """Gera e retorna o CV em PDF"""
    try:
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, 
                               rightMargin=2*cm, leftMargin=2*cm,
                               topMargin=2*cm, bottomMargin=2*cm)
        
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], 
                                     fontSize=24, textColor=colors.HexColor('#1a3c34'), 
                                     alignment=TA_CENTER, spaceAfter=30)
        heading_style = ParagraphStyle('CustomHeading', parent=styles['Heading2'],
                                       fontSize=16, textColor=colors.HexColor('#d4a373'),
                                       spaceBefore=20, spaceAfter=10)
        normal_style = ParagraphStyle('CustomNormal', parent=styles['Normal'],
                                      fontSize=10, leading=14)
        
        story = []
        
        story.append(Paragraph("Aristides Budimbo", title_style))
        story.append(Paragraph("Economista • Eng.º Informático • Mentor Estratégico", 
                              ParagraphStyle('Subtitle', parent=styles['Normal'],
                                           alignment=TA_CENTER, fontSize=12, 
                                           textColor=colors.grey, spaceAfter=30)))
        
        story.append(Paragraph("Perfil Profissional", heading_style))
        story.append(Paragraph("Profissional híbrido formado em Engenharia Informática e Economia, com experiência em análise de perfis, liderança de equipas, formação técnica e gestão de infraestruturas de rede.", normal_style))
        story.append(Spacer(1, 0.5*cm))
        
        story.append(Paragraph("Formação Académica", heading_style))
        story.append(Paragraph("• <b>Formação em Economia</b> - Visão Macro, Análise de Custos, Tomada de Decisão Estratégica", normal_style))
        story.append(Paragraph("• <b>Formação em Engenharia Informática</b> - Arquitetura de Redes, Sistemas Tecnológicos, Desenvolvimento Robusto", normal_style))
        story.append(Spacer(1, 0.5*cm))
        
        story.append(Paragraph("Competências-Chave", heading_style))
        competencias = ["Análise de Perfil", "Liderança de Equipas", "Gestão de Projetos", 
                       "Redes e Comunicação", "Formação Técnica", "Estratégia"]
        for comp in competencias:
            story.append(Paragraph(f"• {comp}", normal_style))
        story.append(Spacer(1, 0.5*cm))
        
        story.append(Paragraph("Projetos Relevantes", heading_style))
        for projeto in projetos_data:
            story.append(Paragraph(f"<b>{projeto['titulo']}</b>", normal_style))
            story.append(Paragraph(projeto['resultado'], normal_style))
            story.append(Spacer(1, 0.3*cm))
        
        doc.build(story)
        buffer.seek(0)
        
        return send_file(buffer, as_attachment=True, 
                        download_name='CV_Aristides_Budimbo.pdf',
                        mimetype='application/pdf')
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/linkedin-profile')
def linkedin_profile():
    """Simula dados do LinkedIn (para integração)"""
    return jsonify({
        'name': 'Aristides Budimbo',
        'headline': 'Economista • Eng.º Informático • Mentor Estratégico',
        'connections': 500,
        'followers': 1200,
        'profile_url': 'https://www.linkedin.com/in/aristides-budimbo'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

