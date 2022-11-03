const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./easywash-db-firebase-adminsdk-mi8xv-2a2ac3160e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(express.json());

app.get("/", (req, res) => res.status(200).send("Bem vindo ao easywash"));

//LOGIN AUTENTICAÇÃO
// app.post();

// CRUD USUARIOS
const usuariosRef = db.collection("usuarios");
app.post("/usuarios", async (req, res) => {
  try {
    const form = req.body;
    await usuariosRef.add(form);
    return res.status(200).send("Usuário adicionado");
  } catch (error) {
    throw new Error(error);
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const resp = await usuariosRef.get();
    let listaUsuarios = [];
    resp.forEach((doc) => {
      const user = doc.data();
      user.id = doc.id;
      listaUsuarios.push(user);
      console.log(doc.id, "=>", doc.data());
    });

    return res.status(200).json(listaUsuarios);
  } catch (error) {
    throw new Error(error);
  }
});

app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resp = await usuariosRef.doc(id).get();
    if (!resp.data()) {
      return res.status(400).send("Usuário não encontrado");
    }
    return res.status(200).json(resp.data());
  } catch (error) {}
});

app.patch("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    await db.runTransaction(async (t) => {
      t.update(usuariosRef.doc(id), updateData);
    });
    return res.status(200).send("Usuário atualizado");
  } catch (error) {
    throw new Error(error);
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await usuariosRef.doc(id).delete();
    return res.status(200).send("Usuário deletado");
  } catch (error) {
    throw new Error(error);
  }
});

// CRUD LAVANDERIAS
const lavaderiasRef = db.collection("lavanderias");
app.post("/lavanderias", async (req, res) => {
  try {
    const form = req.body;
    await lavaderiasRef.add(form);
    return res.status(200).send("Lavanderia adicionada");
  } catch (error) {
    throw new Error(error);
  }
});

app.get("/lavanderias", async (req, res) => {
  try {
    const resp = await lavaderiasRef.get();
    const listaLavanderias = resp.map((doc) => doc.data);
    return res.status(200).json(listaLavanderias);
  } catch (error) {
    throw new Error(error);
  }
});

// app.patch();
// app.delete();

// CRUD SERVIÇOS
const servicosRef = db.collection("serviços");
app.post("/servicos", async (req, res) => {
  try {
    const form = req.body;
    await servicosRef.add(form);
    return res.status(200).send("Serviço adicionado");
  } catch (error) {
    throw new Error(error);
  }
});

// app.get();
// app.patch();
// app.delete();

app.listen(3000, () => console.log("Servidor rodando"));
