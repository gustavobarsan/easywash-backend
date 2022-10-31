import express from "express";
import * as admin from "firebase-admin";

const admin = require("firebase-admin");

const serviceAccount = require("./easywash-db-firebase-adminsdk-mi8xv-2a2ac3160e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const app = express();

app.get("/", (req, res) => res.status(200).send("Bem vindo ao easywash"));

//LOGIN AUTENTICAÇÃO
app.post();

// CRUD USUARIOS
app.post();
app.get();
app.patch();
app.delete();

// CRUD LAVANDERIAS
app.post();
app.get();
app.patch();
app.delete();

// CRUD SERVIÇOS
app.post();
app.get();
app.patch();
app.delete();

app.listen(3000, () => console.log("Servidor rodando"));
