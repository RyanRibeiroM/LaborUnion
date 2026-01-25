
export const generateAposentadoriaRuralTemplate = (data) => {
    const {
        agricultor,
        sindicato,
        dataAtual
    } = data;

    // Função auxiliar para formatar data
    const formatDate = (dateString) => {
        if (!dateString) return '___/___/_____';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Requerimento Aposentadoria Rural</title>
        <style>
            @page {
                size: A4;
                margin: 20mm 20mm 20mm 20mm;
            }
            body {
                font-family: 'Times New Roman', Times, serif;
                font-size: 12pt;
                line-height: 1.5;
                color: #000;
                background: #fff;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
            }
            .header img {
                width: 100px;
                height: auto;
                margin-bottom: 10px;
            }
            .header h1 {
                font-size: 14pt;
                font-weight: bold;
                margin: 0;
                text-transform: uppercase;
            }
            .header h2 {
                font-size: 12pt;
                font-weight: normal;
                margin: 0;
            }
            .title {
                text-align: center;
                font-weight: bold;
                margin-bottom: 30px;
                text-transform: uppercase;
                text-decoration: underline;
                font-size: 14pt;
            }
            .content {
                text-align: justify;
                margin-bottom: 30px;
            }
            .content p {
                margin-bottom: 15px;
                text-indent: 20mm;
            }
            .data-field {
                font-weight: bold;
            }
            .signatures {
                margin-top: 50px;
                display: flex;
                flex-direction: column;
                gap: 40px;
                align-items: center;
            }
            .signature-block {
                text-align: center;
                width: 80%;
                border-top: 1px solid #000;
                padding-top: 5px;
            }
            .footer {
                margin-top: 50px;
                font-size: 10pt;
                text-align: center;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <!-- Espaço para Logo se houver -->
            <!-- <img src="${sindicato.logoUrl}" alt="Logo Sindicato" /> -->
            <h1>${sindicato.nome || 'SINDICATO DOS TRABALHADORES RURAIS'}</h1>
            <h2>CNPJ: ${sindicato.cnpj || '06.586.523/0001-48'}</h2>
            <h2>${sindicato.endereco || 'Crateús - CE'}</h2>
        </div>

        <div class="title">
            REQUERIMENTO DE APOSENTADORIA POR IDADE RURAL
        </div>

        <div class="content">
            <p>
                Ao Ilustríssimo Senhor Gerente Executivo do Instituto Nacional do Seguro Social – INSS.
            </p>

            <p>
                Eu, <span class="data-field">${agricultor.nome}</span>, nacionalidade brasileira, estado civil <span class="data-field">${agricultor.estadoCivil}</span>, 
                profissão <span class="data-field">${agricultor.profissao}</span>, nascido(a) em <span class="data-field">${formatDate(agricultor.dataNascimento)}</span>,
                portador(a) do CPF nº <span class="data-field">${agricultor.cpf}</span>, residente e domiciliado(a) na 
                <span class="data-field">${agricultor.endereco}, ${agricultor.numero || 'S/N'}, ${agricultor.bairro}, ${agricultor.cidade}-${agricultor.uf}, CEP: ${agricultor.cep}</span>,
                venho, respeitosamente, à presença de Vossa Senhoria, requerer: 
            </p>
            
            <p style="text-align: center; font-weight: bold; margin: 20px 0;">
                BENEFÍCIO DE APOSENTADORIA POR IDADE RURAL
            </p>

            <p>
                Declaro, para os devidos fins, que exerci atividade rural em regime de economia familiar durante o período de carência exigido, conforme documentação anexa, atendendo aos requisitos previstos na Lei 8.213/91.
            </p>

            <p>
                Nestes termos, <br>
                Pede Deferimento.
            </p>
        </div>

        <div class="content" style="text-align: right; margin-top: 40px;">
            ${sindicato.cidade}-${sindicato.uf}, ${dataAtual}.
        </div>

        <div class="signatures">
            <div class="signature-block">
                <strong>${agricultor.nome}</strong><br>
                Requerente
            </div>

            <div class="signature-block">
                <strong>Presidente do Sindicato</strong><br>
                ${sindicato.presidente}
            </div>
        </div>

        <div class="footer">
            Documento gerado eletronicamente pelo sistema do Sindicato em ${dataAtual}.
        </div>
    </body>
    </html>
    `;
};
