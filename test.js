require('./config/config');
// const contractInt = require('./helpers/MainContract');
const UserModel = require('./models/user');
const { mongoose } = require('./db/mongoose');

// contractInt.methods
//   .mappedPro(1)
//   .call()
//   .then(res => {
//     console.log(res);
//   });

const main = async () => {
  const projectCreatorDetails = await UserModel.findOne({
    email: 'tapas1986last@gmail.com',
  });
  console.log(projectCreatorDetails);
};
console.log('ejj');
main();
