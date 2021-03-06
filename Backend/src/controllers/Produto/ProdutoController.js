
const connection = require("../../database/connection");

module.exports = {
    async getAllProdutos(req, res) {
        var { busca, categorias, quantidade } = req.headers;
        if (busca == undefined) {
            busca = '%%'
        } else {
            busca = '%' + busca + '%'
        }
        if (quantidade == undefined || quantidade == '') {
            quantidade = 10
        } else {
            quantidade = parseInt(quantidade);
        }
        if (categorias == undefined || categorias == '') {

            categorias = []
            const cats = await connection("Categoria").select("*");
            for (i in cats) {
                categorias.push(cats[i].id_Categoria)
            }
        } else {
            categorias = categorias.split('+');
        }
        const qtdprod = await connection("Produto").select("*");
        const prods = await connection("Produto")
            .distinct('Produto.*')
            .leftJoin("ProdutoCategoria", "ProdutoCategoria.id_Produto", "Produto.id_Produto")
            .where('Nome', 'like', busca)
            .whereIn("id_Categoria", categorias).orWhereNull("id_Categoria")
            .limit(quantidade);

        return res.json({ "response": { "Produtos": prods, "Total": qtdprod.length } })
    },
    async getAllCategorias(req, res) {

        const cats = await connection("Categoria").select("*");
        return res.json({ "response": { "Categorias": cats } })
    },
    async details(req, res) {
        const { id } = req.params;
        const dets = await connection("Produto")
            .select("Produto.*")
            .select("Fornecedor.Nome as Nome_Fornecedor")
            .avg("Comentario.Nota as media")
            .leftJoin("Comentario", "Comentario.id_Produto", "Produto.id_Produto")
            .join("Fornecedor", function () {
                this.on("Fornecedor.id_Fornecedor", "Produto.id_Fornecedor")
            })
            .where("Produto.id_Produto", id)
            .groupBy("Produto.id_Produto");

        if (dets.length) {
            const cats = await connection("ProdutoCategoria")
                .select("Categoria.*")
                .leftJoin("Categoria", "ProdutoCategoria.id_Categoria", "Categoria.id_Categoria")
                .where("ProdutoCategoria.id_Produto", id)
            return res.json({ "Detalhes": dets, "Categorias": cats });
        }
        else {
            return res.json({ "Details": "Erro, Produto n??o encontrado" }); //?
        }
    },
    async newProduto(req, res) {
        const { reqid, reqtype } = req.headers;
        const { nome, preco, descricao, quantidade, imagem, categorias } = req.body;

        if (reqtype != "1") {
            return res.status(400).json({ "Erro": "Voc?? n??o tem permiss??o para fazer isso" })
        }
        const forn = await connection("Fornecedor").select("*").where("id_Fornecedor", reqid);
        if (!forn.length) {
            return res.status(400).json({ "Erro": "Codigo de fornecedor invalido" })
        }
        const prd = await connection("Produto").insert({
            "id_Fornecedor": reqid,
            "Imagem": imagem,
            "Valor": preco,
            "Quantidade": quantidade,
            "Descricao": descricao,
            "Nome": nome
        })
        console.log(prd);
        if (!prd.length) {
            return res.status(500).json({ "Erro": "Erro ao adicionar produto" })
        }
        let msg = "";
        if (categorias) {
            for (let i in categorias) {
                const ct = await connection("Categoria").select("id_Categoria").where("id_Categoria", categorias[i])
                if (!ct.length) {
                    msg = "Uma ou mais das categorias n??o foi adicionada, pois era invalida"
                } else {
                    const cat = await connection("ProdutoCategoria").insert({
                        "id_Categoria": categorias[i],
                        "id_Produto": prd[0]
                    })
                }
            }
        }
        return res.json({ "id": prd[0], "mensagem": msg })
    },
    async deleteProduto(req, res) {
        // ele n??o deleta as referencias a ele quando exclui, ent??o fica as fk apontando pro nada.... tem que ver isso ai
        const { id } = req.params;
        const { fornecedor } = req.headers;
        const prd = await connection("Produto")
            .select("id_Fornecedor").where("id_Produto", id);
        if (prd.length) {
            let idF = prd[0]["id_Fornecedor"];
            if (parseInt(idF) == parseInt(fornecedor)) {
                const op = await connection("Produto").where("id_produto", id).del();
                return res.json({ "Response": "Dele????o concluida" })
            } else {
                return res.status(400).json({
                    "Erro": "Voce n??o pode fazer isso"
                });
            }
        }
        return res.status(404).json({ "Erro": "Produto n??o encontrado" })
    },
    async updateProduto(req, res) {
        const { id } = req.params;
        const id_Produto = id;
        const { reqid, reqtype } = req.headers;
        const { nome, preco, descricao, quantidade, imagem } = req.body;

        if (reqtype != "1") {
            return res.status(400).json({ "Erro": "Voc?? n??o tem permiss??o para fazer isso" })
        }
        const forn = await connection("Fornecedor").select("*").where("id_Fornecedor", reqid);
        if (!forn.length) {
            return res.status(400).json({ "Erro": "Codigo de fornecedor invalido" })
        }
        const prd = await connection("Produto").select("*").where("id_Produto", id_Produto);
        if (!prd.length) {
            return res.status(400).json({ "Erro": "Codigo de fornecedor invalido" })
        }
        if (parseInt(prd[0]["id_Fornecedor"]) != parseInt(reqid)) {
            return res.status(400).json({ "Erro": "Voc?? n??o tem permiss??o para fazer isso" })
        }
        const nprd = await connection("Produto")
            .update("id_Fornecedor", reqid)
            .update("Imagem", imagem)
            .update("Valor", preco)
            .update("Quantidade", quantidade)
            .update("Descricao", descricao)
            .update("Nome", nome)
            .where("id_Produto", id_Produto)

        if (!prd.length) {
            return res.status(500).json({ "Erro": "Erro ao adicionar produto" })
        }
        return res.json({ "response": "Produto alterado com sucesso" })
    }
};