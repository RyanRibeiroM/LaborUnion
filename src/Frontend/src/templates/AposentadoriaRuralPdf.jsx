
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        paddingTop: 25,
        paddingBottom: 50,
        paddingLeft: 40,
        paddingRight: 40,
        fontSize: 12,
        fontFamily: 'Times-Roman',
        lineHeight: 1.5,
    },
    // ===== CABEÇALHO =====
    header: {
        marginBottom: 15,
        paddingBottom: 12,
        borderBottomWidth: 3,
        borderBottomColor: '#2d5a3d',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    logoContainer: {
        width: 65,
        height: 65,
        marginRight: 15,
    },
    logo: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 13,
        fontFamily: 'Times-Bold',
        textTransform: 'uppercase',
        color: '#1a3d24',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    headerInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    headerInfoItem: {
        fontSize: 9,
        color: '#333',
    },
    headerInfoLabel: {
        fontFamily: 'Times-Bold',
        color: '#2d5a3d',
    },
    headerDivider: {
        height: 2,
        backgroundColor: '#4a8b58',
        marginTop: 8,
    },
    // ===== TÍTULO DO DOCUMENTO =====
    title: {
        fontSize: 14,
        fontFamily: 'Times-Bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginTop: 18,
        marginBottom: 18,
        textDecoration: 'underline',
        color: '#1a3d24',
    },
    // ===== CONTEÚDO =====
    content: {
        textAlign: 'justify',
        marginBottom: 5,
    },
    paragraph: {
        marginBottom: 12,
        textIndent: 40,
        textAlign: 'justify',
        fontSize: 12,
    },
    bold: {
        fontFamily: 'Times-Bold',
    },
    center: {
        textAlign: 'center',
        textIndent: 0,
    },
    dateLine: {
        marginTop: 25,
        textAlign: 'right',
        fontSize: 12,
    },
    // ===== ASSINATURAS =====
    signatures: {
        marginTop: 35,
        flexDirection: 'column',
        alignItems: 'center',
    },
    signatureBlock: {
        width: '70%',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 6,
        alignItems: 'center',
        marginTop: 25,
    },
    signatureText: {
        fontSize: 11,
        textAlign: 'center',
    },
    // ===== RODAPÉ VERDE =====
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 28,
        backgroundColor: '#2d5a3d',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    footerText: {
        color: '#FFFFFF',
        fontSize: 8,
        textAlign: 'center',
    },
});

const AposentadoriaRuralPdf = ({ data, logoUrl }) => {
    const { agricultor, sindicato, dataAtual } = data;

    const formatDate = (dateString) => {
        if (!dateString) return '___/___/_____';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* CABEÇALHO ELEGANTE */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.logoContainer}>
                            {logoUrl && <Image style={styles.logo} src={logoUrl} />}
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>
                                {sindicato.nome || 'SINDICATO DOS TRABALHADORES RURAIS'}
                            </Text>
                            <View style={styles.headerInfo}>
                                <Text style={styles.headerInfoItem}>
                                    <Text style={styles.headerInfoLabel}>CNPJ: </Text>
                                    {sindicato.cnpj}
                                </Text>
                                <Text style={styles.headerInfoItem}>
                                    <Text style={styles.headerInfoLabel}>Tel: </Text>
                                    {sindicato.telefone || '-'}
                                </Text>
                            </View>
                            <View style={styles.headerInfo}>
                                <Text style={styles.headerInfoItem}>
                                    <Text style={styles.headerInfoLabel}>Endereço: </Text>
                                    {sindicato.endereco}, {sindicato.cidade}-{sindicato.uf}
                                </Text>
                            </View>
                            <View style={styles.headerInfo}>
                                <Text style={styles.headerInfoItem}>
                                    <Text style={styles.headerInfoLabel}>E-mail: </Text>
                                    {sindicato.email || '-'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* TÍTULO */}
                <Text style={styles.title}>REQUERIMENTO DE APOSENTADORIA POR IDADE RURAL</Text>

                {/* CONTEÚDO */}
                <View style={styles.content}>
                    <Text style={styles.paragraph}>
                        Ao Ilustríssimo Senhor Gerente Executivo do Instituto Nacional do Seguro Social – INSS.
                    </Text>

                    <Text style={styles.paragraph}>
                        Eu, <Text style={styles.bold}>{agricultor.nome}</Text>, nacionalidade brasileira,
                        estado civil <Text style={styles.bold}>{agricultor.estadoCivil}</Text>,
                        profissão <Text style={styles.bold}>{agricultor.profissao}</Text>,
                        nascido(a) em <Text style={styles.bold}>{formatDate(agricultor.dataNascimento)}</Text>,
                        portador(a) do CPF nº <Text style={styles.bold}>{agricultor.cpf}</Text>,
                        residente e domiciliado(a) na
                        <Text style={styles.bold}> {agricultor.endereco}, {agricultor.numero || 'S/N'}, {agricultor.bairro}, {agricultor.cidade}-{agricultor.uf}, CEP: {agricultor.cep}</Text>,
                        venho, respeitosamente, à presença de Vossa Senhoria, requerer:
                    </Text>

                    <Text style={[styles.paragraph, styles.center, styles.bold, { marginTop: 8, marginBottom: 8 }]}>
                        BENEFÍCIO DE APOSENTADORIA POR IDADE RURAL
                    </Text>

                    <Text style={styles.paragraph}>
                        Declaro, para os devidos fins, que exerci atividade rural em regime de economia familiar durante o período de carência exigido, conforme documentação anexa, atendendo aos requisitos previstos na Lei 8.213/91.
                    </Text>

                    <Text style={styles.paragraph}>
                        Nestes termos, pede deferimento.
                    </Text>
                </View>

                {/* DATA */}
                <Text style={styles.dateLine}>
                    {sindicato.cidade}-{sindicato.uf}, {dataAtual}.
                </Text>

                {/* ASSINATURAS */}
                <View style={styles.signatures}>
                    <View style={styles.signatureBlock}>
                        <Text style={[styles.signatureText, styles.bold]}>{agricultor.nome}</Text>
                        <Text style={styles.signatureText}>Requerente</Text>
                    </View>

                    <View style={styles.signatureBlock}>
                        <Text style={[styles.signatureText, styles.bold]}>{sindicato.presidente || 'Representante do Sindicato'}</Text>
                        <Text style={styles.signatureText}>Presidente do Sindicato</Text>
                    </View>
                </View>

                {/* RODAPÉ VERDE */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        {sindicato.nome} • {sindicato.telefone} • {sindicato.email}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default AposentadoriaRuralPdf;
