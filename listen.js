const app = require('./app')

const cuurentPort = 8080;
exports.listening = app.listen(cuurentPort, ()=>{
    console.log(`Server is listening on Port:${cuurentPort}`);
});