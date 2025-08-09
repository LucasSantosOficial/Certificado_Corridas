// Estado da aplicação
let formData = {
    nomeCorretor: '',
    nomeCorrida: '',
    localCorrida: '',
    dataCorrida: '',
    distancia: '',
    unidadeDistancia: 'km',
    horaInicio: '',
    horaTermino: '',
    foto: null,
    notaPersonalizada: '',
    mensagemMotivacional: ''
};

let previewMode = false;
let tempoCalculado = '';

// Elementos do DOM
const formContainer = document.getElementById('form-container');
const previewContainer = document.getElementById('preview-container');
const certificateRef = document.getElementById('certificate');

// Inputs do formulário
const nomeCorretorInput = document.getElementById('nomeCorretor');
const nomeCorrida = document.getElementById('nomeCorrida');
const localCorrida = document.getElementById('localCorrida');
const dataCorrida = document.getElementById('dataCorrida');
const distancia = document.getElementById('distancia');
const unidadeDistancia = document.getElementById('unidadeDistancia');
const horaInicio = document.getElementById('horaInicio');
const horaTermino = document.getElementById('horaTermino');
const foto = document.getElementById('foto');
const notaPersonalizada = document.getElementById('notaPersonalizada');
const mensagemMotivacional = document.getElementById('mensagemMotivacional');

// Botões
const gerarPreviaBtn = document.getElementById('gerar-previa');
const voltarEdicaoBtn = document.getElementById('voltar-edicao');
const deletarPreviaBtn = document.getElementById('deletar-previa');
const gerarPdfBtn = document.getElementById('gerar-pdf');

// Elementos do certificado
const tempoCalculadoDiv = document.getElementById('tempo-calculado');
const tempoValorSpan = document.getElementById('tempo-valor');

// Função para calcular tempo
function calcularTempo(inicio, termino) {
    if (!inicio || !termino) return '';
    
    const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
    const [horaTermino, minutoTermino] = termino.split(':').map(Number);
    
    let totalMinutosInicio = horaInicio * 60 + minutoInicio;
    let totalMinutosTermino = horaTermino * 60 + minutoTermino;
    
    // Se o término for menor que o início, assumir que passou da meia-noite
    if (totalMinutosTermino < totalMinutosInicio) {
        totalMinutosTermino += 24 * 60;
    }
    
    const diferencaMinutos = totalMinutosTermino - totalMinutosInicio;
    const horas = Math.floor(diferencaMinutos / 60);
    const minutos = diferencaMinutos % 60;
    
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:00`;
}

// Função para atualizar o estado
function handleInputChange(field, value) {
    formData[field] = value;
    
    // Calcular tempo automaticamente quando início e término são preenchidos
    if (field === 'horaInicio' || field === 'horaTermino') {
        const tempo = calcularTempo(
            field === 'horaInicio' ? value : formData.horaInicio,
            field === 'horaTermino' ? value : formData.horaTermino
        );
        tempoCalculado = tempo;
        
        if (tempo) {
            tempoCalculadoDiv.style.display = 'block';
            tempoValorSpan.textContent = tempo;
        } else {
            tempoCalculadoDiv.style.display = 'none';
        }
    }
}

// Função para lidar com upload de arquivo
function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            formData.foto = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Função para formatar data
function formatarData(dataString) {
    if (!dataString) return '';
    
    const data = new Date(dataString + 'T00:00:00');
    return data.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    });
}

// Função para gerar prévia
function gerarPrevia() {
    if (!formData.nomeCorretor || !formData.nomeCorrida || !formData.localCorrida) {
        alert('Por favor, preencha pelo menos o nome do corredor, nome da corrida e local.');
        return;
    }
    
    // Atualizar elementos do certificado
    document.getElementById('cert-local').textContent = formData.localCorrida;
    document.getElementById('cert-data').textContent = formatarData(formData.dataCorrida);
    document.getElementById('cert-nome-corrida').textContent = formData.nomeCorrida;
    document.getElementById('cert-nome-corredor').textContent = formData.nomeCorretor;
    document.getElementById('cert-distancia').textContent = `${formData.distancia} ${formData.unidadeDistancia}`;
    document.getElementById('cert-horario').textContent = `${formData.horaInicio} - ${formData.horaTermino}`;
    
    // Mostrar foto se existir
    const fotoContainer = document.getElementById('foto-container');
    const certFoto = document.getElementById('cert-foto');
    if (formData.foto) {
        certFoto.src = formData.foto;
        fotoContainer.style.display = 'block';
    } else {
        fotoContainer.style.display = 'none';
    }
    
    // Mostrar tempo se calculado
    const tempoCard = document.getElementById('tempo-card');
    const certTempo = document.getElementById('cert-tempo');
    if (tempoCalculado) {
        certTempo.textContent = tempoCalculado;
        tempoCard.style.display = 'block';
    } else {
        tempoCard.style.display = 'none';
    }
    
    // Mostrar nota personalizada se existir
    const notaContainer = document.getElementById('nota-personalizada-container');
    const certNota = document.getElementById('cert-nota-personalizada');
    if (formData.notaPersonalizada) {
        certNota.textContent = formData.notaPersonalizada;
        notaContainer.style.display = 'block';
    } else {
        notaContainer.style.display = 'none';
    }
    
    // Mostrar mensagem motivacional se existir
    const mensagemContainer = document.getElementById('mensagem-container');
    const certMensagem = document.getElementById('cert-mensagem');
    if (formData.mensagemMotivacional) {
        certMensagem.textContent = formData.mensagemMotivacional;
        mensagemContainer.style.display = 'block';
    } else {
        mensagemContainer.style.display = 'none';
    }
    
    // Alternar para modo de prévia
    previewMode = true;
    formContainer.style.display = 'none';
    previewContainer.style.display = 'block';
}

// Função para voltar à edição
function voltarEdicao() {
    previewMode = false;
    formContainer.style.display = 'block';
    previewContainer.style.display = 'none';
}

// Função para deletar prévia
function deletarPrevia() {
    previewMode = false;
    formData = {
        nomeCorretor: '',
        nomeCorrida: '',
        localCorrida: '',
        dataCorrida: '',
        distancia: '',
        unidadeDistancia: 'km',
        horaInicio: '',
        horaTermino: '',
        foto: null,
        notaPersonalizada: '',
        mensagemMotivacional: ''
    };
    tempoCalculado = '';
    
    // Limpar formulário
    nomeCorretorInput.value = '';
    nomeCorrida.value = '';
    localCorrida.value = '';
    dataCorrida.value = '';
    distancia.value = '';
    unidadeDistancia.value = 'km';
    horaInicio.value = '';
    horaTermino.value = '';
    foto.value = '';
    notaPersonalizada.value = '';
    mensagemMotivacional.value = '';
    
    // Esconder tempo calculado
    tempoCalculadoDiv.style.display = 'none';
    
    // Voltar ao formulário
    formContainer.style.display = 'block';
    previewContainer.style.display = 'none';
}

// Gera PDF (corrigido: captura tudo e dimensiona sem cortes)
async function gerarPDF() {
  if (!certificateRef) return;

  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    await new Promise(r => setTimeout(r, 300));

    certificateRef.scrollIntoView({ block: 'center', inline: 'center' });

    const canvas = await html2canvas(certificateRef, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollX: -window.scrollX,
      scrollY: -window.scrollY
    });

    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth  = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgW = imgProps.width;
    const imgH = imgProps.height;

    const imgRatio = imgH / imgW;
    let renderWidth = pageWidth;
    let renderHeight = renderWidth * imgRatio;

    if (renderHeight > pageHeight) {
      renderHeight = pageHeight;
      renderWidth = renderHeight / imgRatio;
    }

    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);

    const fileName = `certificado-corrida-${(formData.nomeCorretor || 'atleta')
      .replace(/\s+/g, '-')
      .toLowerCase()}.pdf`;

    pdf.save(fileName);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert(`Erro ao gerar PDF: ${error.message}`);
  }
}


// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inputs do formulário
    nomeCorretorInput.addEventListener('input', (e) => handleInputChange('nomeCorretor', e.target.value));
    nomeCorrida.addEventListener('input', (e) => handleInputChange('nomeCorrida', e.target.value));
    localCorrida.addEventListener('input', (e) => handleInputChange('localCorrida', e.target.value));
    dataCorrida.addEventListener('input', (e) => handleInputChange('dataCorrida', e.target.value));
    distancia.addEventListener('input', (e) => handleInputChange('distancia', e.target.value));
    unidadeDistancia.addEventListener('change', (e) => handleInputChange('unidadeDistancia', e.target.value));
    horaInicio.addEventListener('input', (e) => handleInputChange('horaInicio', e.target.value));
    horaTermino.addEventListener('input', (e) => handleInputChange('horaTermino', e.target.value));
    foto.addEventListener('change', handleFileChange);
    notaPersonalizada.addEventListener('input', (e) => handleInputChange('notaPersonalizada', e.target.value));
    mensagemMotivacional.addEventListener('change', (e) => handleInputChange('mensagemMotivacional', e.target.value));
    
    // Botões
    gerarPreviaBtn.addEventListener('click', gerarPrevia);
    voltarEdicaoBtn.addEventListener('click', voltarEdicao);
    deletarPreviaBtn.addEventListener('click', deletarPrevia);
    gerarPdfBtn.addEventListener('click', gerarPDF);
});

// Função para detectar dispositivos móveis
function isMobile() {
    return window.innerWidth <= 768;
}

// Ajustar layout para mobile
function adjustForMobile() {
    if (isMobile()) {
        const certificate = document.getElementById('certificate');
        if (certificate) {
            certificate.style.width = '1200px';
            certificate.style.maxWidth = '900px';
            certificate.style.padding = '2rem';
        }
    }
}

// Ajustar layout quando a janela for redimensionada
window.addEventListener('resize', adjustForMobile);

// Ajustar layout inicial
adjustForMobile();

