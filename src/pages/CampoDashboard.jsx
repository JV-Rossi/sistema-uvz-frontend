import { useState } from 'react';

export default function CampoDashboard({ setTelaAtual }) {

    // 1. COLE AQUI: A Tabela e os Estados da Regional/Bairro
    const tabelaBairros = [
        // ================= REGIONAL LESTE =================
        { nome: "ALPHAVILLE I", regional: "Leste", estrato: "13" },
        { nome: "ALPHAVILLE II", regional: "Leste", estrato: "13" },
        { nome: "AREÃO", regional: "Leste", estrato: "11" },
        { nome: "BANDEIRANTES", regional: "Leste", estrato: "10" },
        { nome: "BARBADO", regional: "Leste", estrato: "09" },
        { nome: "BARRO DURO", regional: "Leste", estrato: "13" },
        { nome: "BEIRA RIO", regional: "Leste", estrato: "09" },
        { nome: "BELA MARINA", regional: "Leste", estrato: "09" },
        { nome: "BELA VISTA", regional: "Leste", estrato: "14" },
        { nome: "BELVEDERE I", regional: "Leste", estrato: "12" },
        { nome: "BELVEDERE II", regional: "Leste", estrato: "12" },
        { nome: "BOA ESPERANÇA", regional: "Leste", estrato: "11" },
        { nome: "BOSQUE DA SAÚDE", regional: "Leste", estrato: "13" },
        { nome: "CACHOEIRA DAS GARÇAS", regional: "Leste", estrato: "11" },
        { nome: "CAMPO VELHO", regional: "Leste", estrato: "09" },
        { nome: "CAMPUS ELÍSEOS", regional: "Leste", estrato: "09" },
        { nome: "CANJICA", regional: "Leste", estrato: "13" },
        { nome: "CARUMBÉ", regional: "Leste", estrato: "14" },
        { nome: "COND. RESERVA RIO CUIABÁ", regional: "Leste", estrato: "12" },
        { nome: "COND. RIO CACHOEIRINHA", regional: "Leste", estrato: "12" },
        { nome: "COND. RIO CLARO", regional: "Leste", estrato: "12" },
        { nome: "COND. RIO COXIPÓ", regional: "Leste", estrato: "12" },
        { nome: "COND. RIO JANGADA", regional: "Leste", estrato: "12" },
        { nome: "COND. RIO MANSO", regional: "Leste", estrato: "12" },
        { nome: "COND. RIO SÃO LOURENÇO", regional: "Leste", estrato: "12" },
        { nome: "DOM AQUINO", regional: "Leste", estrato: "10" },
        { nome: "FLORAIS DO PARQUE", regional: "Leste", estrato: "13" },
        { nome: "FLORAIS ITÁLIA", regional: "Leste", estrato: "13" },
        { nome: "GRANDE TERCEIRO", regional: "Leste", estrato: "09" },
        { nome: "ITAMARATY", regional: "Leste", estrato: "14" },
        { nome: "JARDIM CALIFORNIA", regional: "Leste", estrato: "09" },
        { nome: "JARDIM DAS AMÉRICAS", regional: "Leste", estrato: "11" },
        { nome: "JARDIM DAS AMÉRICAS II", regional: "Leste", estrato: "11" },
        { nome: "JARDIM EUROPA", regional: "Leste", estrato: "09" },
        { nome: "JARDIM GUANABARA", regional: "Leste", estrato: "11" },
        { nome: "JARDIM IMPERIAL I", regional: "Leste", estrato: "12" },
        { nome: "JARDIM IMPERIAL II", regional: "Leste", estrato: "11" },
        { nome: "JARDIM ITÁLIA", regional: "Leste", estrato: "13" },
        { nome: "JARDIM KENNEDY", regional: "Leste", estrato: "09" },
        { nome: "JARDIM LEBLON", regional: "Leste", estrato: "11" },
        { nome: "JARDIM PAULISTA", regional: "Leste", estrato: "10" },
        { nome: "JARDIM PETRÓPOLIS", regional: "Leste", estrato: "09" },
        { nome: "JARDIM RENASCER", regional: "Leste", estrato: "13" },
        { nome: "JARDIM SHANGRILÁ", regional: "Leste", estrato: "09" },
        { nome: "JARDIM TROPICAL", regional: "Leste", estrato: "09" },
        { nome: "JARDIM UNIVERSITÁRIO", regional: "Leste", estrato: "11" },
        { nome: "JARDIM VENEZA", regional: "Leste", estrato: "14" },
        { nome: "LIXEIRA", regional: "Leste", estrato: "10" },
        { nome: "MORADA DOS NOBRES", regional: "Leste", estrato: "13" },
        { nome: "OITO DE ABRIL", regional: "Leste", estrato: "14" },
        { nome: "PEDREGAL", regional: "Leste", estrato: "13" },
        { nome: "PICO DO AMOR", regional: "Leste", estrato: "09" },
        { nome: "PLANALTO", regional: "Leste", estrato: "14" },
        { nome: "POÇÃO", regional: "Leste", estrato: "10" },
        { nome: "PRAEIRINHO", regional: "Leste", estrato: "09" },
        { nome: "PRAEIRO", regional: "Leste", estrato: "09" },
        { nome: "RECANTO DOS PASSÁROS", regional: "Leste", estrato: "12" },
        { nome: "RES. CLAUDIO MARCHETTI", regional: "Leste", estrato: "11" },
        { nome: "RES. MARIA DE LOURDES", regional: "Leste", estrato: "12" },
        { nome: "RES. RECANTO DO SALVADOR", regional: "Leste", estrato: "12" },
        { nome: "RES. SÃO CARLOS", regional: "Leste", estrato: "14" },
        { nome: "RES. J.K", regional: "Leste", estrato: "11" },
        { nome: "SANTA CRUZ I", regional: "Leste", estrato: "12" },
        { nome: "SANTA CRUZ II", regional: "Leste", estrato: "12" },
        { nome: "SANTA INÊS", regional: "Leste", estrato: "14" },
        { nome: "SOL NASCENTE", regional: "Leste", estrato: "14" },
        { nome: "SUPREMO ITÁLIA", regional: "Leste", estrato: "13" },
        { nome: "SÃO MATHEUS", regional: "Leste", estrato: "09" },
        { nome: "SÃO ROQUE", regional: "Leste", estrato: "14" },
        { nome: "TERRA NOVA", regional: "Leste", estrato: "13" },
        { nome: "UFMT", regional: "Leste", estrato: "11" },

        // ================= REGIONAL NORTE =================
        { nome: "1° DE MARÇO", regional: "Norte", estrato: "26" },
        { nome: "ALTOS DA CHAPADA", regional: "Norte", estrato: "21" },
        { nome: "ALTOS DA GLÓRIA", regional: "Norte", estrato: "26" },
        { nome: "ALTOS DA SERRA", regional: "Norte", estrato: "25" },
        { nome: "ALTOS DE CUIABÁ", regional: "Norte", estrato: "21" },
        { nome: "CENTRO AMÉRICA", regional: "Norte", estrato: "22" },
        { nome: "CENTRO POL. ADMINISTRATIVO", regional: "Norte", estrato: "21" },
        { nome: "CHICO MENDES", regional: "Norte", estrato: "21" },
        { nome: "COLINA VERDE", regional: "Norte", estrato: "26" },
        { nome: "COND. BRISAS DA CHAPADA", regional: "Norte", estrato: "21" },
        { nome: "COND. VITÓRIA A", regional: "Norte", estrato: "21" },
        { nome: "COND. VITÓRIA B", regional: "Norte", estrato: "21" },
        { nome: "CPA 1", regional: "Norte", estrato: "22" },
        { nome: "CPA 2", regional: "Norte", estrato: "23" },
        { nome: "CPA 3 SETOR 1", regional: "Norte", estrato: "23" },
        { nome: "CPA 3 SETOR 2", regional: "Norte", estrato: "23" },
        { nome: "CPA 3 SETOR 3", regional: "Norte", estrato: "23" },
        { nome: "CPA 3 SETOR 4", regional: "Norte", estrato: "23" },
        { nome: "CPA 3 SETOR 5", regional: "Norte", estrato: "24" },
        { nome: "CPA 4 - 1° ETAPA", regional: "Norte", estrato: "24" },
        { nome: "CPA 4 - 2° ETAPA", regional: "Norte", estrato: "24" },
        { nome: "CPA 4 - 3° ETAPA", regional: "Norte", estrato: "24" },
        { nome: "CPA 4 - 4° ETAPA", regional: "Norte", estrato: "24" },
        { nome: "CPA 4 - 5° ETAPA", regional: "Norte", estrato: "24" },
        { nome: "DANTE DE OLIVEIRA", regional: "Norte", estrato: "25" },
        { nome: "DR. FABIO 1", regional: "Norte", estrato: "25" },
        { nome: "DR. FABIO 2", regional: "Norte", estrato: "25" },
        { nome: "FLORIANÓPOLIS", regional: "Norte", estrato: "21" },
        { nome: "ITAPUÃ", regional: "Norte", estrato: "21" },
        { nome: "JARDIM BRASIL", regional: "Norte", estrato: "24" },
        { nome: "JARDIM UMUARAMA", regional: "Norte", estrato: "26" },
        { nome: "JARDIM UNIÃO", regional: "Norte", estrato: "21" },
        { nome: "JARDIM VITÓRIA", regional: "Norte", estrato: "21" },
        { nome: "MORADA DO OURO", regional: "Norte", estrato: "22" },
        { nome: "MORADA DO OURO 1° ETAPA", regional: "Norte", estrato: "22" },
        { nome: "MORADA DO OURO 2° ETAPA", regional: "Norte", estrato: "22" },
        { nome: "NOVA CANAÃ 1° ETAPA", regional: "Norte", estrato: "26" },
        { nome: "NOVA CANAÃ 2° ETAPA", regional: "Norte", estrato: "26" },
        { nome: "NOVA CANAÃ 3° ETAPA", regional: "Norte", estrato: "26" },
        { nome: "NOVO HORIZONTE", regional: "Norte", estrato: "24" },
        { nome: "NOVO MATO GROSSO", regional: "Norte", estrato: "23" },
        { nome: "NOVO PARAÍSO 1", regional: "Norte", estrato: "22" },
        { nome: "NOVO PARAÍSO 2", regional: "Norte", estrato: "22" },
        { nome: "PARAISÓPOLIS", regional: "Norte", estrato: "21" },
        { nome: "RES. BOSQUE DOS IPES", regional: "Norte", estrato: "21" },
        { nome: "RES. PAIAGUÁS", regional: "Norte", estrato: "21" },
        { nome: "RES. PARANÁ", regional: "Norte", estrato: "26" },
        { nome: "SILVANOPOLIS", regional: "Norte", estrato: "21" },
        { nome: "TANCREDO NEVES", regional: "Norte", estrato: "22" },
        { nome: "TRÊS BARRAS", regional: "Norte", estrato: "26" },
        { nome: "TRÊS LAGOAS", regional: "Norte", estrato: "24" },
        { nome: "TRÊS PODERES", regional: "Norte", estrato: "21" },
        { nome: "VILA ROSA", regional: "Norte", estrato: "23" },

        // ================= REGIONAL OESTE =================
        { nome: "ALTOS DA BOA VISTA", regional: "Oeste", estrato: "18" },
        { nome: "ALVORADA", regional: "Oeste", estrato: "18" },
        { nome: "ARAÉS", regional: "Oeste", estrato: "17" },
        { nome: "BARRA DO PARI", regional: "Oeste", estrato: "15" },
        { nome: "BORDAS DA CHAPADA I", regional: "Oeste", estrato: "18" },
        { nome: "BORDAS DA CHAPADA II", regional: "Oeste", estrato: "18" },
        { nome: "CANACHUÊ", regional: "Oeste", estrato: "16" },
        { nome: "CAPÃO DO GAMA", regional: "Oeste", estrato: "16" },
        { nome: "CENTRO", regional: "Oeste", estrato: "17" },
        { nome: "CIDADE ALTA", regional: "Oeste", estrato: "16" },
        { nome: "CIDADE VERDE", regional: "Oeste", estrato: "15" },
        { nome: "COESA", regional: "Oeste", estrato: "16" },
        { nome: "COHAB NOVA", regional: "Oeste", estrato: "16" },
        { nome: "COND. COUNTRY", regional: "Oeste", estrato: "19" },
        { nome: "COND. GRAN VILLE", regional: "Oeste", estrato: "19" },
        { nome: "COND. VILA JARDIM", regional: "Oeste", estrato: "19" },
        { nome: "COND. VILAGE DO BOSQUE", regional: "Oeste", estrato: "19" },
        { nome: "CONSIL", regional: "Oeste", estrato: "18" },
        { nome: "COOPHAMIL", regional: "Oeste", estrato: "15" },
        { nome: "DESPRAIADO", regional: "Oeste", estrato: "18" },
        { nome: "DUQUE DE CAXIAS I", regional: "Oeste", estrato: "17" },
        { nome: "DUQUE DE CAXIAS II", regional: "Oeste", estrato: "17" },
        { nome: "FLAMBOYANT", regional: "Oeste", estrato: "16" },
        { nome: "FLORAIS CUIABÁ", regional: "Oeste", estrato: "19" },
        { nome: "FLORAIS DO VALLE", regional: "Oeste", estrato: "19" },
        { nome: "FLORAIS DOS LAGOS", regional: "Oeste", estrato: "19" },
        { nome: "GOIABEIRAS", regional: "Oeste", estrato: "16" },
        { nome: "GUIA", regional: "Oeste", estrato: "20" },
        { nome: "JARDIM AMPERCO", regional: "Oeste", estrato: "18" },
        { nome: "JARDIM ANTARTICA", regional: "Oeste", estrato: "19" },
        { nome: "JARDIM ARAÇÁ", regional: "Oeste", estrato: "15" },
        { nome: "JARDIM BEIRA RIO", regional: "Oeste", estrato: "15" },
        { nome: "JARDIM CUIABÁ", regional: "Oeste", estrato: "16" },
        { nome: "JARDIM ELDORADO", regional: "Oeste", estrato: "18" },
        { nome: "JARDIM INDEPENDÊNCIA", regional: "Oeste", estrato: "16" },
        { nome: "JARDIM MARIANA", regional: "Oeste", estrato: "18" },
        { nome: "JARDIM MONTE LÍBANO I", regional: "Oeste", estrato: "18" },
        { nome: "JARDIM MONTE LÍBANO II", regional: "Oeste", estrato: "18" },
        { nome: "JARDIM NOVO COLORADO", regional: "Oeste", estrato: "19" },
        { nome: "JARDIM PRIMAVERA", regional: "Oeste", estrato: "16" },
        { nome: "JARDIM UBATÃ", regional: "Oeste", estrato: "15" },
        { nome: "JARDIM UBIRAJARA", regional: "Oeste", estrato: "19" },
        { nome: "JARDIM VISTA ALEGRE", regional: "Oeste", estrato: "18" },
        { nome: "JOSÉ PINTO", regional: "Oeste", estrato: "16" },
        { nome: "LIMOEIRO", regional: "Oeste", estrato: "16" },
        { nome: "MIGUEL SUTIL", regional: "Oeste", estrato: "18" },
        { nome: "NOVO TEMPO", regional: "Oeste", estrato: "19" },
        { nome: "NOVO TERCEIRO", regional: "Oeste", estrato: "15" },
        { nome: "PARQUE DAS NAÇÕES INDÍGENAS", regional: "Oeste", estrato: "19" },
        { nome: "PARQUE RODOVIÁRIO", regional: "Oeste", estrato: "18" },
        { nome: "POPULAR", regional: "Oeste", estrato: "17" },
        { nome: "PORTO", regional: "Oeste", estrato: "17" },
        { nome: "QUILOMBO", regional: "Oeste", estrato: "17" },
        { nome: "RANCHO WESTRN", regional: "Oeste", estrato: "19" },
        { nome: "RES. MONTE NEGRO", regional: "Oeste", estrato: "19" },
        { nome: "RES. MÔNACO", regional: "Oeste", estrato: "19" },
        { nome: "RES. SAN MARINO", regional: "Oeste", estrato: "19" },
        { nome: "RES. DESPRAIADO", regional: "Oeste", estrato: "18" },
        { nome: "RES. SUCURI", regional: "Oeste", estrato: "19" },
        { nome: "RIBEIRÃO DA PONTE", regional: "Oeste", estrato: "18" },
        { nome: "RIBEIRÃO DO LIPA", regional: "Oeste", estrato: "19" },
        { nome: "SANTA AMÁLIA", regional: "Oeste", estrato: "15" },
        { nome: "SANTA HELENA", regional: "Oeste", estrato: "17" },
        { nome: "SANTA ISABEL", regional: "Oeste", estrato: "15" },
        { nome: "SANTA MARTA", regional: "Oeste", estrato: "18" },
        { nome: "SANTA ROSA", regional: "Oeste", estrato: "16" },
        { nome: "SENHOR DOS PASSOS", regional: "Oeste", estrato: "18" },
        { nome: "SOLAR DAS FLORES", regional: "Oeste", estrato: "18" },
        { nome: "SUCURI", regional: "Oeste", estrato: "20" },
        { nome: "SÃO BENEDITO", regional: "Oeste", estrato: "15" },
        { nome: "TROPICAL VILLE", regional: "Oeste", estrato: "19" },
        { nome: "VALE DOS LIRIOS", regional: "Oeste", estrato: "19" },
        { nome: "VILA MILITAR", regional: "Oeste", estrato: "16" },
        { nome: "VILA REAL", regional: "Oeste", estrato: "18" },

        // ================= REGIONAL SUL =================
        { nome: "ALTOS DO COXIPÓ", regional: "Sul", estrato: "01" },
        { nome: "ALTOS DO SÃO GONÇALO", regional: "Sul", estrato: "08" },
        { nome: "BRASIL 21 1º ETAPA", regional: "Sul", estrato: "02" },
        { nome: "BRASIL 21 2° ETAPA", regional: "Sul", estrato: "02" },
        { nome: "CHACARA DOS PINHEIROS", regional: "Sul", estrato: "01" },
        { nome: "COHAB SÃO GONÇALO", regional: "Sul", estrato: "07" },
        { nome: "COND. ATHENAS", regional: "Sul", estrato: "02" },
        { nome: "COND. COXIPONÊS", regional: "Sul", estrato: "06" },
        { nome: "COND. FLOR DO CERRADO", regional: "Sul", estrato: "01" },
        { nome: "COND. ILHAS CANÁRIAS", regional: "Sul", estrato: "03" },
        { nome: "COND. ILHEUS", regional: "Sul", estrato: "03" },
        { nome: "COND. JARDIM BOTANICO", regional: "Sul", estrato: "08" },
        { nome: "COND. MORRO DE SANTO ANTONIO", regional: "Sul", estrato: "08" },
        { nome: "COND. NOVO TEMPO - RES. PARK LESTE", regional: "Sul", estrato: "02" },
        { nome: "COND. RES. BELLA PIETRA", regional: "Sul", estrato: "05" },
        { nome: "COND. RES. ESPLANADA", regional: "Sul", estrato: "01" },
        { nome: "COND. SANTA CLARA", regional: "Sul", estrato: "05" },
        { nome: "COND. SANTO ANTONIO", regional: "Sul", estrato: "08" },
        { nome: "COND. SÁVIO BRANDÃO", regional: "Sul", estrato: "07" },
        { nome: "COND. SEVILLA 90-1", regional: "Sul", estrato: "05" },
        { nome: "COND. SEVILLA 90-2", regional: "Sul", estrato: "05" },
        { nome: "COND. VILA BOM JESUS", regional: "Sul", estrato: "02" },
        { nome: "COND. COMPLEXO 300 ANOS (GARÇA BRANCA) A", regional: "Sul", estrato: "07" },
        { nome: "COND. COMPLEXO 300 ANOS (TUIUIU)", regional: "Sul", estrato: "07" },
        { nome: "COND. HAWAI", regional: "Sul", estrato: "04" },
        { nome: "COND. JULIETA 1", regional: "Sul", estrato: "04" },
        { nome: "COND. JULIETA 2", regional: "Sul", estrato: "04" },
        { nome: "COND. VILLAGIO DE PIETRA", regional: "Sul", estrato: "04" },
        { nome: "COOPHEMA", regional: "Sul", estrato: "08" },
        { nome: "COXIPÓ DA PONTE", regional: "Sul", estrato: "01" },
        { nome: "DISTRITO INDUSTRIAL", regional: "Sul", estrato: "06" },
        { nome: "FLOR DE PEQUI", regional: "Sul", estrato: "06" },
        { nome: "GETÚLIO VARGAS", regional: "Sul", estrato: "06" },
        { nome: "IMPÉRIO DO SOL", regional: "Sul", estrato: "04" },
        { nome: "ITAPAJÉ", regional: "Sul", estrato: "06" },
        { nome: "JARDIM ALENCASTRO", regional: "Sul", estrato: "08" },
        { nome: "JARDIM APOEMA", regional: "Sul", estrato: "01" },
        { nome: "JARDIM BURITI", regional: "Sul", estrato: "08" },
        { nome: "JARDIM COMODORO", regional: "Sul", estrato: "08" },
        { nome: "JARDIM DAS FLORES", regional: "Sul", estrato: "04" },
        { nome: "JARDIM DAS OLIVEIRAS", regional: "Sul", estrato: "08" },
        { nome: "JARDIM DAS PALMEIRAS", regional: "Sul", estrato: "01" },
        { nome: "JARDIM DOS IPÊS", regional: "Sul", estrato: "01" },
        { nome: "JARDIM FORTALEZA", regional: "Sul", estrato: "03" },
        { nome: "JARDIM GRAMADO", regional: "Sul", estrato: "08" },
        { nome: "JARDIM HUMAITÁ", regional: "Sul", estrato: "08" },
        { nome: "JARDIM INDUSTRIÁRIO 1", regional: "Sul", estrato: "04" },
        { nome: "JARDIM INDUSTRIÁRIO 2", regional: "Sul", estrato: "04" },
        { nome: "JARDIM LIBERDADE", regional: "Sul", estrato: "03" },
        { nome: "JARDIM MOSSORÓ", regional: "Sul", estrato: "07" },
        { nome: "JARDIM PARAÍSO", regional: "Sul", estrato: "08" },
        { nome: "JARDIM PASSAREDO I", regional: "Sul", estrato: "02" },
        { nome: "JARDIM PASSAREDO II", regional: "Sul", estrato: "02" },
        { nome: "JARDIM PAULICÉIA", regional: "Sul", estrato: "07" },
        { nome: "JARDIM PINHEIROS", regional: "Sul", estrato: "08" },
        { nome: "JARDIM PRESIDENTE 1", regional: "Sul", estrato: "06" },
        { nome: "JARDIM PRESIDENTE 2", regional: "Sul", estrato: "06" },
        { nome: "LAGOA AZUL", regional: "Sul", estrato: "02" },
        { nome: "LOT. DANTE MARTINS DE OLIVEIRA", regional: "Sul", estrato: "05" },
        { nome: "LOT. JD. NOVA VITÓRIA", regional: "Sul", estrato: "05" },
        { nome: "LOT. JARDIM SÃO PAULO", regional: "Sul", estrato: "04" },
        { nome: "LOT. MIRANTE DO PARQUE", regional: "Sul", estrato: "03" },
        { nome: "LOT. SAMPAIO", regional: "Sul", estrato: "05" },
        { nome: "LOT. SANTO EXPEDITO", regional: "Sul", estrato: "05" },
        { nome: "MANDURI", regional: "Sul", estrato: "03" },
        { nome: "NILCE PAES BARRETO", regional: "Sul", estrato: "03" },
        { nome: "NOSSA SENHORA APARECIDA", regional: "Sul", estrato: "08" },
        { nome: "NOSSA SENHORA APARECIDA 2", regional: "Sul", estrato: "08" },
        { nome: "NOVO MILENIUM", regional: "Sul", estrato: "02" },
        { nome: "NOVO PARQUE", regional: "Sul", estrato: "07" },
        { nome: "OSMAR CABRAL", regional: "Sul", estrato: "02" },
        { nome: "PARQUE ATALAIA", regional: "Sul", estrato: "08" },
        { nome: "PARQUE CUIABÁ", regional: "Sul", estrato: "07" },
        { nome: "PARQUE GEORGIA", regional: "Sul", estrato: "08" },
        { nome: "PARQUE MARIANA", regional: "Sul", estrato: "02" },
        { nome: "PARQUE NOVA ESPERANÇA 1", regional: "Sul", estrato: "04" },
        { nome: "PARQUE NOVA ESPERANÇA 2", regional: "Sul", estrato: "04" },
        { nome: "PARQUE NOVA ESPERANÇA 3", regional: "Sul", estrato: "04" },
        { nome: "PARQUE OHARA", regional: "Sul", estrato: "01" },
        { nome: "PARQUE RESIDENCIAL COXIPÓ", regional: "Sul", estrato: "06" },
        { nome: "PASCOAL RAMOS", regional: "Sul", estrato: "03" },
        { nome: "PEDRA 90 1° ETAPA", regional: "Sul", estrato: "05" },
        { nome: "PEDRA 90 2° ETAPA", regional: "Sul", estrato: "05" },
        { nome: "PRIMOR DAS TORRES", regional: "Sul", estrato: "02" },
        { nome: "REAL PARQUE", regional: "Sul", estrato: "07" },
        { nome: "RES. ÁGUAS CLARAS", regional: "Sul", estrato: "04" },
        { nome: "RES. ALICE NOVAK", regional: "Sul", estrato: "04" },
        { nome: "RES. ALTOS DO CERRADO", regional: "Sul", estrato: "03" },
        { nome: "RES. ALTOS DO PARQUE 1", regional: "Sul", estrato: "07" },
        { nome: "RES. ALTOS DO PARQUE 2", regional: "Sul", estrato: "07" },
        { nome: "RES. ARICÁ", regional: "Sul", estrato: "03" },
        { nome: "RES. AVELINO L. BARROS", regional: "Sul", estrato: "03" },
        { nome: "RES. BELITA COSTA MARQUES", regional: "Sul", estrato: "03" },
        { nome: "RES. ESPERANÇA", regional: "Sul", estrato: "08" },
        { nome: "RES. FLOR DE LIZ", regional: "Sul", estrato: "04" },
        { nome: "RES. FRANCISCA L. BORBA", regional: "Sul", estrato: "03" },
        { nome: "RES. JOCKEY CLUB", regional: "Sul", estrato: "07" },
        { nome: "RES. MARECHAL RONDON", regional: "Sul", estrato: "04" },
        { nome: "RES. NICO BARACATE 1", regional: "Sul", estrato: "03" },
        { nome: "RES. NICO BARACATE 2", regional: "Sul", estrato: "03" },
        { nome: "RES. NICO BARACATE 3", regional: "Sul", estrato: "03" },
        { nome: "RES. PASCOAL MOREIRA CABRAL", regional: "Sul", estrato: "04" },
        { nome: "RES. RECANTO DO SOL", regional: "Sul", estrato: "03" },
        { nome: "RES. SALVADOR COSTA MARQUES", regional: "Sul", estrato: "03" },
        { nome: "RES. SONHO MEU", regional: "Sul", estrato: "05" },
        { nome: "RES. SÃO JOSÉ", regional: "Sul", estrato: "06" },
        { nome: "RES. COXIPÓ", regional: "Sul", estrato: "06" },
        { nome: "SANTA LAURA 1", regional: "Sul", estrato: "03" },
        { nome: "SANTA LAURA 2", regional: "Sul", estrato: "03" },
        { nome: "SANTA TEREZINHA 1 SETOR A", regional: "Sul", estrato: "07" },
        { nome: "SANTA TEREZINHA 1 SETOR B", regional: "Sul", estrato: "06" },
        { nome: "SANTA TEREZINHA 1 SETOR C", regional: "Sul", estrato: "06" },
        { nome: "SANTA TEREZINHA 1 SETOR D", regional: "Sul", estrato: "06" },
        { nome: "SANTA TEREZINHA 2 SETOR A", regional: "Sul", estrato: "06" },
        { nome: "SANTA TEREZINHA 2 SETOR B", regional: "Sul", estrato: "06" },
        { nome: "SANTA TEREZINHA 2 SETOR C", regional: "Sul", estrato: "06" },
        { nome: "SANTA TEREZINHA 2 SETOR D", regional: "Sul", estrato: "06" },
        { nome: "SANTA TEREZINHA 2 SETOR E", regional: "Sul", estrato: "06" },
        { nome: "SANTA TEREZINHA 2 SETOR E (1, A 4)", regional: "Sul", estrato: "06" },
        { nome: "SÃO FRANCISCO I", regional: "Sul", estrato: "02" },
        { nome: "SÃO FRANCISCO III", regional: "Sul", estrato: "02" },
        { nome: "SÃO GONÇALO BEIRA RIO", regional: "Sul", estrato: "08" },
        { nome: "SÃO JOÃO DEL REY", regional: "Sul", estrato: "02" },
        { nome: "SÃO JOSÉ", regional: "Sul", estrato: "01" },
        { nome: "SÃO JOSÉ 2", regional: "Sul", estrato: "08" },
        { nome: "SÃO SEBASTIÃO", regional: "Sul", estrato: "03" },
        { nome: "TIJUCAL SETOR I", regional: "Sul", estrato: "01" },
        { nome: "TIJUCAL SETOR II", regional: "Sul", estrato: "01" },
        { nome: "TIJUCAL SETOR III", regional: "Sul", estrato: "01" },
        { nome: "TIJUCAL SETOR IV", regional: "Sul", estrato: "01" },
        { nome: "VILA NOVA", regional: "Sul", estrato: "02" },
        { nome: "VILA VERDE", regional: "Sul", estrato: "06" },
        { nome: "VISTA DA CHAPADA", regional: "Sul", estrato: "04" },
        { nome: "VOLUNTÁRIOS DA PÁTRIA", regional: "Sul", estrato: "05" }
    ];


    const [regional, setRegional] = useState('');
    const [bairroInput, setBairroInput] = useState('');
    const [dadosOcultos, setDadosOcultos] = useState(null);
    const [erroBairro, setErroBairro] = useState('');

    // 2. Estados do Cabeçalho da Ficha 
    const [headerMinimizado, setHeaderMinimizado] = useState(false);
    const [cabecalho, setCabecalho] = useState({
        bairro: '',
        zona: '',
        codigo: '',
        desmembramento: '',
        ciclo: '',
        semana: '',
        data: ''
    });

    // 3. Estados do formulário do imóvel atual que está sendo digitado
    const [imovelAtual, setImovelAtual] = useState({
        quarteirao: '',
        endereco: '',
        numero: '',
        complemento: '',
        tipo: 'CASA',
        pendencia: 'NAO',
        // Inspecionados:
        a2: 0, b: 0, c: 0, d1: 0, d2: 0, e: 0,
        //Controle de Eliminados e Observação
        teveDepositoEliminado: false,
        a2_elim: 0, b_elim: 0, c_elim: 0, d1_elim: 0, d2_elim: 0, e_elim: 0,
        observacao: '',
        // Tratamento:
        larvicidaGrama: 0
    });

    // 4. Lista de imóveis já adicionados na folha atual
    const [listaImoveis, setListaImoveis] = useState([]);
    const [mensagemEnvio, setMensagemEnvio] = useState('');

    // Funções auxiliares para aumentar/diminuir números com um toque
    const alterarContador = (campo, operacao) => {
        setImovelAtual(prev => {
            const valorAtual = prev[campo];
            const novoValor = operacao === '+' ? valorAtual + 1 : Math.max(0, valorAtual - 1);
            return { ...prev, [campo]: novoValor };
        });
    };

    // 2. Função de Adicionar Imóvel Ajustada (Sem o imovelTratado)
    const handleAdicionarImovel = (e) => {
        e.preventDefault();

        if (!imovelAtual.endereco || !imovelAtual.numero) {
            alert('⚠️ Digite o endereço e o número do imóvel!');
            return;
        }

        //Miniminiza o cabeçalho ao enviar a primeira casa
        if (listaImoveis.length === 0) {
            setHeaderMinimizado(true);
        }

        // 1. Joga o imóvel atual para dentro da lista de imóveis visitados
        setListaImoveis([...listaImoveis, imovelAtual]);

        // 2. 🔄 O RESET: Limpa os campos da tela para o próximo vizinho
        setImovelAtual(prev => ({
            ...prev,
            numero: '',
            complemento: '',
            a2: 0, b: 0, c: 0, d1: 0, d2: 0, e: 0,
            teveDepositoEliminado: false,
            a2_elim: 0, b_elim: 0, c_elim: 0, d1_elim: 0, d2_elim: 0, e_elim: 0,
            observacao: '',
            larvicidaGrama: 0
        }));
    };

    const handleEnviarBoletimCompleto = async () => {
        if (listaImoveis.length === 0) {
            alert('⚠️ Adicione pelo menos um imóvel antes de fechar o boletim!');
            return;
        }

        const payload = {
            ...cabecalho,
            imoveis: listaImoveis
        };

        try {
            // 🚀 Dispara os dados direto para o endpoint em lote do Java
            const resposta = await fetch('https://sistema-uvz-backend.onrender.com/api/visitas/lote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (resposta.ok) {
                alert('✅ Boletim enviado com sucesso para o banco de dados!');
                setListaImoveis([]);
                setTelaAtual('campo_menu'); // Volta para o menu do app
            } else {
                alert('❌ O servidor Java recebeu, mas deu erro ao salvar.');
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert('❌ Não foi possível conectar ao Java. O servidor na porta 8080 está rodando?');
        }
    };

    // 1. O Filtro agora olha para dentro do cabecalho
    const bairrosFiltrados = tabelaBairros.filter(b => b.regional === cabecalho.regional);

    // 2. Atualiza a Regional dentro do cabecalho com segurança
    const handleRegionalChange = (e) => {
        const novaRegional = e.target.value;

        setCabecalho(prev => ({
            ...prev,
            regional: novaRegional,
            bairro: '',    // Limpa o bairro antigo
            estrato: ''    // Limpa o estrato antigo
        }));

        setErroBairro('');
    };

    // 3. Atualiza o Bairro dentro do cabecalho e já vincula o estrato
    const handleBairroChange = (e) => {
        const valorDigitado = e.target.value;

        // Procura se o que o agente digitou bate exatamente com a lista
        const bairroEncontrado = bairrosFiltrados.find(b => b.nome === valorDigitado);

        if (bairroEncontrado) {
            // Achou o bairro! Salva o nome e puxa o estrato escondido
            setCabecalho(prev => ({
                ...prev,
                bairro: valorDigitado,
                estrato: bairroEncontrado.estrato
            }));
            setErroBairro('');
        } else {
            // Bairro não encontrado ou digitado incompleto
            setCabecalho(prev => ({
                ...prev,
                bairro: valorDigitado,
                estrato: '' // Deixa vazio até ele acertar
            }));

            // Só mostra o erro se ele tiver digitado alguma coisa
            if (valorDigitado !== '') {
                setErroBairro('⚠️ Escolha um bairro válido para esta Regional.');
            } else {
                setErroBairro('');
            }
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '15px', color: '#fff', fontFamily: 'sans-serif', background: '#111', borderRadius: '10px' }}>

            <h2>📋 Novo Boletim de Campo</h2>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Substituindo a Ficha Entomológica de Papel</p>


            {/* ================= BLOCÃO 1: CABEÇALHO (DINÂMICO) ================= */}
            {!headerMinimizado ? (
                // --- MODO EXPANDIDO ---
                <div style={{ background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #333' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#42a5f5', fontSize: '16px' }}>📍 Dados da Folha / Ciclo</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        {/* 1. CAMPO DA REGIONAL (O Filtro Novo) */}
                        <div>
                            <label style={{ fontSize: '12px' }}>Regional:</label>
                            <select
                                value={cabecalho.regional || ''}
                                onChange={handleRegionalChange}
                                style={styleInput}
                            >
                                <option value="">Selecione...</option>
                                <option value="Norte">Norte</option>
                                <option value="Sul">Sul</option>
                                <option value="Leste">Leste</option>
                                <option value="Oeste">Oeste</option>
                            </select>
                        </div>
                        {/* 2. CAMPO DO BAIRRO (A Lupa Inteligente) */}
                        <div>
                            <label style={{ fontSize: '12px' }}>Localidade / Bairro:</label>
                            <input
                                type="text"
                                list="lista-bairros"
                                value={cabecalho.bairro}
                                onChange={handleBairroChange}
                                placeholder={cabecalho.regional ? "🔍 Pesquisar bairro..." : "Bloqueado"}
                                disabled={!cabecalho.regional}
                                style={{
                                    ...styleInput,
                                    borderColor: erroBairro ? '#e74c3c' : (styleInput.borderColor || '#444'),
                                    cursor: cabecalho.regional ? 'text' : 'not-allowed',
                                    opacity: cabecalho.regional ? 1 : 0.6
                                }}
                            />
                            <datalist id="lista-bairros">
                                {bairrosFiltrados.map((b) => (
                                    <option key={b.nome} value={b.nome} />
                                ))}
                            </datalist>
                            {erroBairro && <span style={{ color: '#e74c3c', fontSize: '11px', display: 'block', marginTop: '4px' }}>{erroBairro}</span>}
                        </div>
                        {/* 3. CAMPO DA ZONA (Exatamente como o seu original) */}
                        <div>
                            <label style={{ fontSize: '12px' }}>Zona:</label>
                            <input
                                type="text"
                                value={cabecalho.zona}
                                onChange={e => setCabecalho({ ...cabecalho, zona: e.target.value })}
                                style={styleInput}
                            />
                        </div>
                    </div>


                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <div>
                            <label style={{ fontSize: '12px' }}>Código:</label>
                            <input type="text" placeholder="Ex: 282" value={cabecalho.codigo} onChange={e => setCabecalho({ ...cabecalho, codigo: e.target.value })} style={styleInput} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px' }}>Desmembramento:</label>
                            <input type="text" placeholder="Ex: *" value={cabecalho.desmembramento} onChange={e => setCabecalho({ ...cabecalho, desmembramento: e.target.value })} style={styleInput} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ fontSize: '12px' }}>Ciclo:</label>
                            <input type="text" value={cabecalho.ciclo} onChange={e => setCabecalho({ ...cabecalho, ciclo: e.target.value })} style={styleInput} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px' }}>Semana:</label>
                            <input type="text" value={cabecalho.semana} onChange={e => setCabecalho({ ...cabecalho, semana: e.target.value })} style={styleInput} />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setHeaderMinimizado(true)}
                        style={{ width: '100%', padding: '10px', background: '#42a5f5', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Confirmar Dados e Ocultar ⏫
                    </button>
                </div>
            ) : (
                // --- MODO MINIMIZADO ---
                <div
                    onClick={() => setHeaderMinimizado(false)}
                    style={{ background: '#1a237e', padding: '10px 15px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #3949ab', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        📍 {cabecalho.bairro || 'Sem Bairro'} | Ciclo: {cabecalho.ciclo} | Sem: {cabecalho.semana}
                    </span>
                    <span style={{ fontSize: '12px', color: '#90caf9' }}>Editar ✏️</span>
                </div>
            )}

            {/* ================= BLOCÃO 2: ADICIONAR IMÓVEL ================= */}
            <div style={{ background: '#1e1e1e', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #444' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#ffb74d', fontSize: '16px' }}>🏠 Registrar Visita no Imóvel</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                        <label style={{ fontSize: '12px' }}>Quarteirão:</label>
                        <input type="text" placeholder="Ex: 1" value={imovelAtual.quarteirao} onChange={e => setImovelAtual({ ...imovelAtual, quarteirao: e.target.value })} style={styleInput} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px' }}>Logradouro / Endereço:</label>
                        <input type="text" placeholder="Ex: Rua Santana" value={imovelAtual.endereco} onChange={e => setImovelAtual({ ...imovelAtual, endereco: e.target.value })} style={styleInput} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '12px' }}>Número:</label>
                        <input type="text" placeholder="Ex: 132" value={imovelAtual.numero} onChange={e => setImovelAtual({ ...imovelAtual, numero: e.target.value })} style={styleInput} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px' }}>Complemento:</label>
                        <input type="text" placeholder="Ex: .1 ou Ap 2" value={imovelAtual.complemento} onChange={e => setImovelAtual({ ...imovelAtual, complemento: e.target.value })} style={styleInput} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '12px' }}>Tipo de Categoria:</label>
                        <select value={imovelAtual.tipo} onChange={e => setImovelAtual({ ...imovelAtual, tipo: e.target.value })} style={styleInput}>
                            <option value="CASA">Casa (C)</option>
                            <option value="KITNET">Kitnet(KIT)</option>
                            <option value="APARTAMENTO">Apartamento (AP)</option>
                            <option value="COMERCIO">Comércio (CG)</option>
                            <option value="IGREJA">Igreja (I)</option>
                            <option value="TERRENO">Terreno Baldio (TB)</option>
                            <option value="PE">Ponto Estratégico (PE)</option>
                            <option value="ORGAO_PUBLICO">Órgão Público (OP)</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px' }}>Situação/Pendência:</label>
                        <select value={imovelAtual.pendencia} onChange={e => setImovelAtual({ ...imovelAtual, pendencia: e.target.value })} style={styleInput}>
                            <option value="NAO">Normal (Visitado)</option>
                            <option value="RECUSADO">Recusado (REC)</option>
                            <option value="FECHADO">Fechado (FEC)</option>
                        </select>
                    </div>
                </div>

                {/* CONTADORES DOS DEPÓSITOS INSPECCIONADOS (Estilo papel) */}
                <h4 style={{ margin: '15px 0 5px 0', fontSize: '14px', color: '#26a69a' }}>🔍 Depósitos Inspecionados por Tipo:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#252525', padding: '10px', borderRadius: '6px' }}>
                    {['a2', 'b', 'c', 'd1', 'd2', 'e'].map(dep => (
                        <div key={dep} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px' }}>
                            <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{dep}:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button type="button" onClick={() => alterarContador(dep, '-')} style={btnContador}>-</button>
                                <span style={{ fontSize: '16px', minWidth: '20px', textAlign: 'center' }}>{imovelAtual[dep]}</span>
                                <button type="button" onClick={() => alterarContador(dep, '+')} style={btnContador}>+</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 🧪 TRATAMENTO AUTOMÁTICO VINCULADO AO DEPÓSITO A2 */}
                {imovelAtual.a2 > 0 && (
                    <div style={{ background: '#252525', padding: '15px', borderRadius: '6px', marginTop: '15px', borderLeft: '4px solid #ffb74d' }}>
                        <h5 style={{ margin: '0 0 5px 0', color: '#ffb74d', fontSize: '14px' }}>
                            ⚡ Tratamento de Depósito A2 Detectado
                        </h5>
                        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#aaa' }}>
                            Informe a dosagem de larvicida utilizada para os tambores/tanques inspecionados:
                        </p>

                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Quantidade de Larvicida (g):</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="Ex: 2.5"
                                value={imovelAtual.larvicidaGrama || ''}
                                onChange={e => setImovelAtual({ ...imovelAtual, larvicidaGrama: parseFloat(e.target.value) || 0 })}
                                style={{ ...styleInput, marginTop: '5px' }}
                            />
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* CAIXA DE MARCAÇÃO PARA DEPÓSITO ELIMINADO E SEUS CONTADORES */}
                <div style={{ marginTop: '15px', background: '#252525', padding: '10px', borderRadius: '6px', borderLeft: '4px solid #ef5350' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: '#ef5350' }}>
                        <input
                            type="checkbox"
                            checked={imovelAtual.teveDepositoEliminado}
                            onChange={(e) => setImovelAtual({ ...imovelAtual, teveDepositoEliminado: e.target.checked })}
                            style={{ width: '18px', height: '18px' }}
                        />
                        Houve Depósito Eliminado?
                    </label>

                    {/* SE A CAIXA FOR MARCADA, ESSA TELA APARECE MAGICA E AUTOMATICAMENTE */}
                    {imovelAtual.teveDepositoEliminado && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                            {['a2', 'b', 'c', 'd1', 'd2', 'e'].map(dep => {
                                const depElim = `${dep}_elim`; // Junta o nome (ex: vira 'a2_elim')
                                return (
                                    <div key={depElim} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px', background: '#333', borderRadius: '4px' }}>
                                        <span style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#ef5350' }}>{dep}:</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {/* A sua função alterarContador já é inteligente o suficiente para entender o nome novo! */}
                                            <button type="button" onClick={() => alterarContador(depElim, '-')} style={{ ...btnContador, background: '#555' }}>-</button>
                                            <span style={{ fontSize: '16px', minWidth: '20px', textAlign: 'center' }}>{imovelAtual[depElim]}</span>
                                            <button type="button" onClick={() => alterarContador(depElim, '+')} style={{ ...btnContador, background: '#555' }}>+</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ========================================================================= */}
                {/*  CAIXA DE TEXTO PARA OBSERVAÇÕES */}
                <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px' }}>Observações do Imóvel (Opcional):</label>
                    <textarea
                        rows="2"
                        placeholder="Ex: ocorrência de escorpião, casa abandonada..."
                        value={imovelAtual.observacao}
                        onChange={e => setImovelAtual({ ...imovelAtual, observacao: e.target.value })}
                        style={{ ...styleInput, resize: 'vertical', fontFamily: 'inherit' }}
                    />
                </div>
                {/* ========================================================================= */}

                <button type="button" onClick={handleAdicionarImovel} style={{ marginTop: '15px', width: '100%', padding: '12px', background: '#e67e22', border: 'none', color: '#fff', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>
                    ➕ Salvar Imóvel na Ficha
                </button>
            </div>

            {/* ================= LISTAGEM PARCIAL DA FOLHA ================= */}
            {listaImoveis.length > 0 && (
                <div style={{ background: '#222', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#a5d6a7' }}>📑 Imóveis na Ficha Atual ({listaImoveis.length})</h3>
                    <div style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '13px' }}>
                        {listaImoveis.map((imv, idx) => (
                            <div key={idx} style={{ padding: '6px 0', borderBottom: '1px solid #333' }}>
                                📍 Qrt {imv.quarteirao} - {imv.endereco}, Nº {imv.numero} ({imv.tipo}) - Depósitos: {imv.a2 + imv.b + imv.c + imv.d1 + imv.d2 + imv.e} inspecionados.
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={handleEnviarBoletimCompleto} style={{ marginTop: '15px', width: '100%', padding: '12px', background: '#28a745', border: 'none', color: '#fff', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', fontSize: '15px' }}>
                        💾 FINALIZAR E ENVIAR BOLETIM DO DIA
                    </button>
                </div>
            )}

            {mensagemEnvio && <p style={{ textAlign: 'center', color: '#ffeb3b', fontWeight: 'bold' }}>{mensagemEnvio}</p>}

            <button onClick={() => setTelaAtual('campo_menu')} style={{ width: '100%', padding: '10px', background: '#555', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                ⬅️ Voltar para o Menu Principal
            </button>

        </div>
    );
}

// Estilos Inline Rápidos e Limpos para o Layout Escuro Celular
const styleInput = {
    width: '100%',
    padding: '10px',
    marginTop: '4px',
    background: '#333',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '4px',
    boxSizing: 'border-box'
};

const btnContador = {
    width: '32px',
    height: '32px',
    background: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
};