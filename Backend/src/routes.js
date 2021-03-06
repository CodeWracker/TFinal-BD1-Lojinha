const express = require("express")
const ExtratoClienteController = require("./controllers/User/ExtratoClienteController")
const ProdutoController = require("./controllers/Produto/ProdutoController")
const ComentarioController = require('./controllers/Produto/ComentarioController')
const UserController = require("./controllers/User/UserController")
const VendaController = require("./controllers/User/VendaController")
const LoginController = require("./controllers/Login/LoginController")
const RegisterController = require("./controllers/Registro/RegisterController")
const CompraController = require("./controllers/Compra/CompraController")


const routes = express.Router()


// req.query
// req.params
// req.body

/*
    reqtyoe = 0: Cliente
   reqtype = 1: Fornecedor
    */

/*Rotas de registro */
const registerRouter = express.Router({ mergeParams: true })
routes.use('/registro', registerRouter)
registerRouter.put("/cliente", RegisterController.registroCliente)
registerRouter.put("/fornecedor", RegisterController.registroFornecedor)

/*Rotas de Login */
routes.post("/login", LoginController.login)

/*Rotas de Produto */
const productsRouter = express.Router({ mergeParams: true })
routes.use('/produto', productsRouter)
productsRouter.get('/categoria', ProdutoController.getAllCategorias)
productsRouter.get('/', ProdutoController.getAllProdutos)
productsRouter.put('/comentario/:id', ComentarioController.newComentario)
productsRouter.get('/comentario/:id', ComentarioController.getAllComentariosById)
productsRouter.get('/:id', ProdutoController.details)
productsRouter.delete('/:id', ProdutoController.deleteProduto)
productsRouter.put('/new', ProdutoController.newProduto)
productsRouter.post('/:id', ProdutoController.updateProduto)

/*Rotas de Usuario */
const userRouter = express.Router({ mergeParams: true })
routes.use('/user', userRouter)

routes.get('/fornecedores', UserController.listFornecedores)
userRouter.get('/lista/:id', UserController.getListaDeDesejo)
userRouter.get("/:id", UserController.detailsById)
userRouter.get("/compras/:id", UserController.getComprasByIdCliente)
userRouter.post("/addsaldo/:id", UserController.addSaldo)
userRouter.get('/extrato/:id', ExtratoClienteController.getAllExtByID)
userRouter.get('/produtos/:id', UserController.listProdutosByIdFornecedor)
userRouter.get('/vendas/:id', VendaController.getVendasById)
userRouter.put('/lista', UserController.newLista)
userRouter.put('/lista/:id', UserController.newListaItem)
userRouter.delete('/lista/:id', UserController.removeListaItem)
userRouter.put('/contato/new', UserController.addContato)
userRouter.delete('/contato/:id', UserController.removeContato)
userRouter.post('/cliente/:id', UserController.atualizaCliente)
userRouter.post('/fornecedor/:id', UserController.atualizaFornecedor)

/*Rotas de Compra */
const compraRouter = express.Router({ mergeParams: true })
routes.use('/compra', compraRouter)
compraRouter.put('/new', CompraController.newCompra)

module.exports = routes