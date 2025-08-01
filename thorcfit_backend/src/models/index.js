const { sequelize } = require("../config/database");

// Importar as definições dos modelos
const defineUsuario = require("./Usuario");
const defineProfissionais = require("./Profissionais");
const defineNutricao = require("./Nutricao");
const defineTreino = require("./Treino");
const defineVinculoNutricional = require("./VinculoNutricional");
const defineVinculoTreino = require("./VinculoTreino");

// Definir os modelos
const Usuario = defineUsuario(sequelize);
const { Nutricionista, PersonalTrainer } = defineProfissionais(sequelize);
const {
  Alimento,
  PlanoNutricional,
  DiarioAlimentar,
  Refeicao,
  AlimentoRefeicao,
} = defineNutricao(sequelize);
const {
  Exercicio,
  PlanoTreino,
  ExerciciosDoTreino,
  HistoricoTreino,
} = defineTreino(sequelize);
const VinculoNutricional = defineVinculoNutricional(sequelize);
const VinculoTreino = defineVinculoTreino(sequelize);

// Associações de Usuario
Usuario.hasOne(Nutricionista, { foreignKey: "id_usuario", as: "nutricionista" });
Nutricionista.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

Usuario.hasOne(PersonalTrainer, { foreignKey: "id_usuario", as: "personalTrainer" });
PersonalTrainer.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

Usuario.hasMany(DiarioAlimentar, { foreignKey: "id_usuario", as: "diariosAlimentares" });
DiarioAlimentar.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

Usuario.hasMany(PlanoNutricional, { foreignKey: "id_usuario", as: "planosNutricionais" });
PlanoNutricional.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

Usuario.hasMany(PlanoTreino, { foreignKey: "id_criador_usuario", as: "planosTreinoCriados" });
PlanoTreino.belongsTo(Usuario, { foreignKey: "id_criador_usuario", as: "criadorUsuario" });

// Associações com vínculos
Usuario.hasMany(VinculoNutricional, { foreignKey: "id_usuario", as: "vinculosNutricionais" });
VinculoNutricional.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

Usuario.hasMany(VinculoTreino, { foreignKey: "id_usuario", as: "vinculosTreino" });
VinculoTreino.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

// Nutricionista
Nutricionista.hasMany(PlanoNutricional, { foreignKey: "id_nutricionista", as: "planosNutricionaisCriados" });
PlanoNutricional.belongsTo(Nutricionista, { foreignKey: "id_nutricionista", as: "nutricionista" });

Nutricionista.hasMany(VinculoNutricional, { foreignKey: "id_nutricionista", as: "vinculosNutricionaisRecebidos" });
VinculoNutricional.belongsTo(Nutricionista, { foreignKey: "id_nutricionista", as: "nutricionista" });

// PersonalTrainer
PersonalTrainer.hasMany(PlanoTreino, { foreignKey: "id_criador_personal", as: "planosTreinoCriados" });
PlanoTreino.belongsTo(PersonalTrainer, { foreignKey: "id_criador_personal", as: "criadorPersonal" });

PersonalTrainer.hasMany(VinculoTreino, { foreignKey: "id_personal", as: "vinculosTreinoRecebidos" });
VinculoTreino.belongsTo(PersonalTrainer, { foreignKey: "id_personal", as: "personalTrainer" });

// Diario Alimentar → Refeições
DiarioAlimentar.hasMany(Refeicao, { foreignKey: "id_registro", as: "refeicoes" });
Refeicao.belongsTo(DiarioAlimentar, { foreignKey: "id_registro", as: "diarioAlimentar" });

// Refeição → Alimentos
Refeicao.hasMany(AlimentoRefeicao, { foreignKey: "id_refeicao", as: "alimentosRefeicao" });
AlimentoRefeicao.belongsTo(Refeicao, { foreignKey: "id_refeicao", as: "refeicao" });

Alimento.hasMany(AlimentoRefeicao, { foreignKey: "id_alimento", as: "refeicoesComAlimento" });
AlimentoRefeicao.belongsTo(Alimento, { foreignKey: "id_alimento", as: "alimento" });

// Associação de PlanoTreino <-> ExerciciosDoTreino (pivot)
PlanoTreino.hasMany(ExerciciosDoTreino, {
  foreignKey: 'id_treino',
  as: 'exercicios_do_treino'
});
ExerciciosDoTreino.belongsTo(PlanoTreino, {
  foreignKey: 'id_treino',
  as: 'plano_treino'
});

ExerciciosDoTreino.belongsTo(Exercicio, {
  foreignKey: 'id_exercicio',
  as: 'exercicio'
});
Exercicio.hasMany(ExerciciosDoTreino, {
  foreignKey: 'id_exercicio',
  as: 'treinos_com_exercicio'
});

// Se desejar manter também as relações N:N diretas
PlanoTreino.belongsToMany(Exercicio, {
  through: ExerciciosDoTreino,
  foreignKey: 'id_treino',
  otherKey: 'id_exercicio',
  as: 'exercicios'
});

Exercicio.belongsToMany(PlanoTreino, {
  through: ExerciciosDoTreino,
  foreignKey: 'id_exercicio',
  otherKey: 'id_treino',
  as: 'planos_treino'
});

// Exportar
module.exports = {
  sequelize,
  Usuario,
  Nutricionista,
  PersonalTrainer,
  Alimento,
  PlanoNutricional,
  DiarioAlimentar,
  Refeicao,
  AlimentoRefeicao,
  Exercicio,
  PlanoTreino,
  ExerciciosDoTreino,
  HistoricoTreino,
  VinculoNutricional,
  VinculoTreino,
};
