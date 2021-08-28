
exports.up = function(knex) {
    return knex.schema.createTable('Extrato', function(table){
        table.increments("id_Extrato").primary();
        table.timestamp('Data').defaultTo(knex.fn.now())
        table.integer('id_Cliente')
            .references('id_Cliente')
            .inTable('Cliente')   
            .notNullable()
        table.decimal("Movimentacao").notNullable(); 
  
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Extrato');
  };
  