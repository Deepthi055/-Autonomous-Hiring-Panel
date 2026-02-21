const express = require("express");
const evaluationRoutes = require("./routes/evaluationRoutes");

const app = express(); 

app.use(express.json()); 

app.use("/api", evaluationRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});