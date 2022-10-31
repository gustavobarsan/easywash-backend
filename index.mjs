import express from "express";
import * as admin from "firebase-admin";

const app = express();

app.get("/", (req, res) => res.status(200).send("Bem vindo ao easywash"));

app.listen(3000, () => console.log("Servidor rodando"));
