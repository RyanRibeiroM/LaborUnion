
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

const DeclaracaoPossePdf = ({ data, logoUrl }) => {
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
                <Text style={styles.title}>DECLARAÇÃO DE POSSE</Text>

                {/* CONTEÚDO */}
                <View style={styles.content}>
                    <Text style={styles.paragraph}>
                        O <Text style={styles.bold}>{sindicato.nome}</Text>, inscrito no CNPJ sob o nº <Text style={styles.bold}>{sindicato.cnpj}</Text>, com sede na {sindicato.endereco}, município de {sindicato.cidade} - {sindicato.uf}, neste ato representado pelo seu presidente, o Senhor(a) <Text style={styles.bold}>{sindicato.presidente}</Text>, brasileiro, casado, agricultor familiar, capaz, inscrito no Cadastro de Pessoa Física - CPF sob o nº _______________________, DECLARA que:
                    </Text>

                    <Text style={styles.paragraph}>
                        O(a) Sr.(a) <Text style={styles.bold}>{agricultor.nome}</Text>, brasileiro(a), natural de {agricultor.naturalidade || '__________________'}, {agricultor.profissao}, {agricultor.estadoCivil}, capaz, inscrito(a) no CPF sob o nº <Text style={styles.bold}>{agricultor.cpf}</Text> e portador do RG nº {agricultor.rg || '__________________'}, e seu cônjuge, o(a) Sr.(a) __________________________________________________, brasileiro(a), natural de ___________________________, agricultor(a) familiar, capaz, inscrito(a) no CPF sob o nº ___________________ e RG nº __________________, residentes e domiciliados na localidade de {agricultor.endereco}, {agricultor.numero || 'S/N'}, {agricultor.bairro}, deste município de {agricultor.cidade}–{agricultor.uf}, são POSSEIROS do imóvel rural denominado ________________________________, localizado na ______________________________________, zona rural, CEP: ______________, {agricultor.cidade}-{agricultor.uf}, com área de ___________________ (___________________________________________), tornando-a produtiva e/ou nela estabelecido minha moradia.
                    </Text>

                    <Text style={styles.paragraph}>
                        O referido imóvel confronta-se, de forma mansa e pacifica, ao Norte com terras do Sr. (a) ____________________________________________________; ao Sul com terras do Sr. (a) ____________________________________________________; ao Leste (Nascente) com terras do Sr. (a) ____________________________________________________; ao Oeste (Poente) com terras do Sr. (a) ____________________________________________________, conforme planta e memorial descritivo em anexo.
                    </Text>

                    <Text style={styles.paragraph}>
                        A posse do referido imóvel vem sendo exercida de forma mansa e pacífica desde ____/____/_______, tendo a mesma sido adquirida através de Declaração de Confinantes, não sendo de nosso conhecimento a existência de nenhuma outra forma simples de OCUPAÇÃO, COMPRA, DOAÇÃO, HERANÇA, LITÍGIO que pese em desfavor da referida ocupação.
                    </Text>

                    <Text style={styles.paragraph}>
                        Declaro por fim e para todos os efeitos legais, estar ciente das penalidades previstas nos artigos 171 e 299 do Código Penal, em caso de declaração falsa ou diferente de fato ou situação real ocorrida.
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
                        <Text style={styles.signatureText}>CPF: {agricultor.cpf}</Text>
                        <Text style={styles.signatureText}>Requerente</Text>
                    </View>

                    <View style={styles.signatureBlock}>
                        {/* Espaço para cônjuge */}
                        <Text style={[styles.signatureText, styles.bold]}>__________________________________________________</Text>
                        <Text style={styles.signatureText}>Cônjuge</Text>
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

export default DeclaracaoPossePdf;
