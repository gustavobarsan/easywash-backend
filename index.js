const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./easywash-db-firebase-adminsdk-mi8xv-2a2ac3160e.json");
var cors = require("cors");
const PORT = process.env.PORT || 8000;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.status(200).send("Bem vindo ao easywash"));

//LOGIN AUTENTICAÇÃO
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const resp = await usuariosRef
      .where("email", "=", email)
      .where("senha", "=", senha)
      .get();

    const resp2 = await lavanderiasRef
      .where("email", "=", email)
      .where("senha", "=", senha)
      .get();

    if (resp.empty && resp2.empty)
      res.status(400).send("Usuário não existe ou credenciais inválidas");

    if (!resp.empty) {
      let idU;
      resp.forEach((doc) => (idU = doc.id));
      return res.status(200).json({ idUsuario: idU });
    }

    let idL;
    resp2.forEach((doc) => (idL = doc.id));
    return res.status(200).json({ idLavanderia: idL });
  } catch (error) {
    throw new Error(error);
  }
});

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
const lavanderiasRef = db.collection("lavanderias");
app.post("/lavanderias", async (req, res) => {
  try {
    const form = req.body;
    await lavanderiasRef.add(form);
    return res.status(200).send("Lavanderia adicionada");
  } catch (error) {
    throw new Error(error);
  }
});

app.get("/lavanderias", async (req, res) => {
  try {
    const resp = await lavanderiasRef.get();
    let listaLavanderias = [];
    resp.forEach((doc) => {
      const lavanderia = doc.data();
      lavanderia.id = doc.id;
      listaLavanderias.push(lavanderia);
      console.log(doc.id, "=>", doc.data());
    });

    return res.status(200).json(listaLavanderias);
  } catch (error) {
    throw new Error(error);
  }
});

app.get("/lavanderias/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resp = await lavanderiasRef.doc(id).get();
    if (!resp.data()) {
      return res.status(400).send("Lavanderia não encontrada");
    }
    return res.status(200).json(resp.data());
  } catch (error) {}
});

app.patch("/lavanderias/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    await db.runTransaction(async (t) => {
      t.update(lavanderiasRef.doc(id), updateData);
    });
    return res.status(200).send("Lavanderia atualizada");
  } catch (error) {
    throw new Error(error);
  }
});

app.delete("/lavanderias/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await lavanderiasRef.doc(id).delete();
    return res.status(200).send("Lavanderia deletada");
  } catch (error) {
    throw new Error(error);
  }
});

// CRUD SERVIÇOS
const servicosRef = db.collection("servicos");
app.post("/servicos", async (req, res) => {
  try {
    const form = req.body;
    await servicosRef.add(form);
    return res.status(200).send("Serviço adicionado");
  } catch (error) {
    throw new Error(error);
  }
});

app.get("/servicos/lavanderia/:idLavanderia", async (req, res) => {
  const { idLavanderia } = req.params;
  try {
    const resp = await servicosRef
      .where("idLavanderia", "=", idLavanderia)
      .get();
    let listaServicos = [];
    resp.forEach((doc) => {
      const servico = doc.data();
      servico.id = doc.id;
      listaServicos.push(servico);
      console.log(doc.id, "=>", doc.data());
    });

    return res.status(200).json(listaServicos);
  } catch (error) {
    throw new Error(error);
  }
});

app.get("/servicos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resp = await servicosRef.doc(id).get();
    if (!resp.data()) {
      return res.status(400).send("Serviço não encontrado");
    }
    return res.status(200).json(resp.data());
  } catch (error) {}
});

app.patch("/servicos/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    await db.runTransaction(async (t) => {
      t.update(servicosRef.doc(id), updateData);
    });
    return res.status(200).send("Serviço atualizado");
  } catch (error) {
    throw new Error(error);
  }
});

app.delete("/servicos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await servicosRef.doc(id).delete();
    return res.status(200).send("Serviço deletado");
  } catch (error) {
    throw new Error(error);
  }
});

// CRUD PEDIDOS
const pedidosRef = db.collection("pedidos");
app.post("/pedidos", async (req, res) => {
  try {
    const form = req.body;
    await pedidosRef.add(form);
    return res.status(200).send("Pedido adicionado");
  } catch (error) {
    throw new Error(error);
  }
});

app.get("/pedidos/", async (req, res) => {
  try {
    const resp = await pedidosRef.get();
    let listapedidos = [];
    resp.forEach((doc) => {
      const pedido = doc.data();
      pedido.id = doc.id;
      listapedidos.push(pedido);
      console.log(doc.id, "=>", doc.data());
    });

    return res.status(200).json(listapedidos);
  } catch (error) {
    throw new Error(error);
  }
});

app.get("/pedidos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resp = await pedidosRef.doc(id).get();
    if (!resp.data()) {
      return res.status(400).send("Pedido não encontrado");
    }
    return res.status(200).json(resp.data());
  } catch (error) {}
});

app.get("/pedidos/usuario/:idUsuario", async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const resp = await pedidosRef.where("idUsuario", "=", idUsuario).get();
    if (!resp.data()) {
      return res.status(400).send("Pedido não encontrado");
    }
    let listaPedidos;
    resp.forEach((doc) => {
      const pedido = doc.data();
      pedido.id = doc.id;
      listaPedidos.push(pedido);
    });
    return res.status(200).json(listaPedidos);
  } catch (error) {}
});

app.get("/pedidos/lavanderia/:idLavanderia", async (req, res) => {
  try {
    const { idLavanderia } = req.params;
    const resp = await pedidosRef
      .where("idLavanderia", "=", idLavanderia)
      .get();
    if (!resp.data()) {
      return res.status(400).send("Pedido não encontrado");
    }
    let listaPedidos;
    resp.forEach((doc) => {
      const pedido = doc.data();
      pedido.id = doc.id;
      listaPedidos.push(pedido);
    });
    return res.status(200).json(listaPedidos);
  } catch (error) {}
});

app.patch("/pedidos/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    await db.runTransaction(async (t) => {
      t.update(pedidosRef.doc(id), updateData);
    });
    return res.status(200).send("Pedido atualizado");
  } catch (error) {
    throw new Error(error);
  }
});

app.delete("/pedidos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pedidosRef.doc(id).delete();
    return res.status(200).send("Pedido deletado");
  } catch (error) {
    throw new Error(error);
  }
});

app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
