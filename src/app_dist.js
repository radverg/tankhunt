/* Tank hunt node.js server, basic start file */
var server = require("http").createServer();

server.listen(process.env.PORT);

console.log("Node js server is now successfully listening at port " + port);
 
// Create game
var th = require("./server/scripts/TankHunt_SE");
var tankhunt = new th.TankHunt_SE(server);
