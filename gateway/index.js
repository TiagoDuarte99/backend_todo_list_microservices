const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

app.use(cors());
app.use(express.json());


/* 
Para colcoar no docker tenho de colocar assim
app.use("/users", proxy("http://users:3002"));  
*/

app.use("/auths", proxy("http://localhost:3001")); 
app.use("/users", proxy("http://localhost:3002")); 
app.use("/todo", proxy("http://localhost:3003")); 


app.listen(3000, () => {
  console.log("Gateway is Listening to Port 3000");
});

app.get('/', (req, res) => {
  res.send('gateway');
});