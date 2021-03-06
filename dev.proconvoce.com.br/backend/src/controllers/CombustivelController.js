const axios = require('axios')

class Item {
    constructor(nome, preco, fornecedor, dataPesquisa) {
        this.nome = nome;
        this.preco = preco;
        this.fornecedor = fornecedor;
        this.data = dataPesquisa;
    }
}

async function AddCords(item){
    let cords = await axios.get('http://itajuba.myscriptcase.com/scriptcase/devel/conf/grp/Procon/libraries/php/fornecedor_detalhe.php?id='+item.fornecedorId);
    cords = [cords.data.fornecedor_detalhe.latitude, cords.data.fornecedor_detalhe.longitude];
    return cords
}

module.exports = {
    async index(req, res) {
        const response = await axios.get('http://itajuba.myscriptcase.com/scriptcase/devel/conf/grp/Procon/libraries/php/pesquisa_total.php?id=3&qtde=10');

        const vetorDeItems = [];
        const pesquisa_total = response.data.pesquisa_total[0];
        let count = 0;
        
        pesquisa_total.pesquisas.forEach(pesquisa => {
            let dataPesquisa = pesquisa.data_publicacao;
            pesquisa.items.forEach(item => {
                let itemLocal = new Item();
                if (item.produto_id == 13 || item.produto_id == 16 || item.produto_id == 17 || item.produto_id == 7 || item.produto_id == 129 || item.produto_id == 15 || item.produto_id == 8 || item.produto_id == 130 || item.produto_id == 14) {
                    itemLocal.id = count;
                    itemLocal.fornecedorId = item.indices['fornecedor_menor_id'];
                    itemLocal.nome = item.nome_produto;
                    itemLocal.fornecedor = item.indices['fornecedor_menor'];
                    itemLocal.preco = item.indices['menor_preco'];
                    itemLocal.data = dataPesquisa;
                    itemLocal.diferenca_menor_maior = item.indices['diferenca_menor_maior'];
                    itemLocal.idp = item.produto_id;
                    vetorDeItems.push(itemLocal);
                    count++;
                }
            });
        });
        let count2 = 0;
        vetorDeItems.forEach((item) => {
            AddCords(item).then((cords) => {
                count2++;
                item.latitude = cords[0];
                item.longitude = cords[1];
                if(count2==vetorDeItems.length){
                    return (res.json(vetorDeItems));
                }
            }).catch(err => {
                console.log(err)
            });
        })
    }

}