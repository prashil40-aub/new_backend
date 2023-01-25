// import _User from './user';

function setupModelsRelation() {
  // setup relation like below
  //   Model1.belongsToMany(Model2, { through: CustomerLeads });
  //   Model1.hasOne(Model2);
  //   Model1.hasMany(Model2);
}

export default {
  setupModelsRelation,
};

export * from './user';
export * from './admin';
export * from './zone';
// eslint-disable-next-line import/no-cycle
export * from './powerPlant';
