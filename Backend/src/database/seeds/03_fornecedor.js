
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Fornecedor').del()
    .then(function () {
      // Inserts seed entries
      return knex('Fornecedor').insert([
        {Estado: 'SC',CEP:"09356-333",Cidade:"Ararangua",Endereco:"Av. Get. Vargas, 123",Senha:"for1",Nome:"João"},
        {Estado: 'MG',CEP:"65843-530",Cidade:"Ouro Preto",Endereco:"Rua miranahs,929",Senha:"for2",Nome:"José"},
        {Estado: 'ES',CEP:"08460-090",Cidade:"Vitória",Endereco:"Rua das derrotas, 666",Senha:"for3",Nome:"Pedro"},
      ]);
    });
};