
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

const TermoAutoDeclaracaoPossePdf = ({ data, logoUrl }) => {
    const { agricultor, sindicato, dataAtual } = data;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* CABEÇALHO REUTILIZADO DO SINDICATO */}
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
                <Text style={styles.title}>TERMO DE AUTO DECLARAÇÃO DE POSSE</Text>

                {/* CONTEÚDO */}
                <View style={styles.content}>
                    <Text style={styles.paragraph}>
                        Nós, <Text style={styles.bold}>{agricultor.nome}</Text>, brasileiro(a), natural de {agricultor.naturalidade || '__________________'}, {agricultor.profissao}, {agricultor.estadoCivil}, capaz, inscrito(a) no CPF sob o nº <Text style={styles.bold}>{agricultor.cpf}</Text> e portador do RG nº {agricultor.rg || '__________________'}, e <Text style={styles.bold}>__________________________________________________</Text>, brasileiro(a), natural de ___________________________, agricultor(a) familiar, capaz, inscrito(a) no CPF sob o nº ___________________ e RG nº __________________, residentes e domiciliados na localidade de {agricultor.endereco}, {agricultor.numero || 'S/N'}, {agricultor.bairro}, deste município de {agricultor.cidade}–{agricultor.uf}, DECLARAMOS:
                    </Text>

                    <Text style={styles.paragraph}>
                        Ser POSSEIROS do imóvel rural denominado ________________________________, localizado no ______________________________________, zona rural, distrito ___________________, CEP: ______________ - {agricultor.cidade} - {agricultor.uf}, tornando-a produtiva e/ou nela estabelecido minha moradia.
                    </Text>

                    <Text style={styles.paragraph}>
                        A posse do referido imóvel vem sendo exercida de forma mansa e pacífica desde ____/____/_______, sendo adquirida através de Declaração de Confinantes, não existindo nenhuma outra forma simples de OCUPAÇÃO, COMPRA, DOAÇÃO, HERANÇA, LITÍGIO que pese em desfavor da referida ocupação.
                    </Text>

                    <Text style={styles.paragraph}>
                        Declaramos por fim e para todos os efeitos legais, estarmos ciente das penalidades previstas nos artigos 171 e 299 do Código Penal, em caso de declaração falsa ou diferente de fato ou situação real ocorrida.
                    </Text>
                </View>

                {/* DATA */}
                <Text style={styles.dateLine}>
                    {sindicato.cidade}-{sindicato.uf}, {dataAtual}.
                </Text>

                {/* ASSINATURAS */}
                <View style={styles.signatures}>
                    <Text style={{ marginBottom: 15 }}>Assinatura:</Text>

                    <View style={styles.signatureBlock}>
                        <Text style={[styles.signatureText, styles.bold]}>{agricultor.nome}</Text>
                        <Text style={styles.signatureText}>Posseiro (Requerente)</Text>
                        <Text style={styles.signatureText}>{agricultor.cpf}</Text>
                    </View>

                    <View style={styles.signatureBlock}>
                        {/* Espaço para cônjuge/segundo posseiro */}
                        <Text style={[styles.signatureText, styles.bold]}>__________________________________________________</Text>
                        <Text style={styles.signatureText}>Posseiro (Cônjuge/Outro)</Text>
                        <Text style={styles.signatureText}>CPF: ___________________</Text>
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

export default TermoAutoDeclaracaoPossePdf;
