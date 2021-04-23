// require express
const express = require("express");
// const axios = require("axios");
const cors = require("cors");

const { getUID } = require("./Services");

//call express to create our server
const server = express();
server.use(cors());

//express to grab the body from a client's request and
//create a body property on the request object
//req.body
server.use(express.json());

//expect to get some payload data directly

server.use(express.urlencoded({ extended: true }));

//server.use(express.urlencoded)

//make our serve listen on a port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

//database
const { db } = require("./Database");
// const { getUID } = require("./Services");
const { getPhoto } = require("./Services");

//routes
//CRUD
//Create Read Update Delete
//POST   GET  PUT    DELETE

//GET / => sb : READ Operation
server.get("/", (req, res) => {
  res.send(db);
});

//GET /?location => destination in that locaton
server.get("/", (req, res) => {
  const { location } = req.query;

  if (!location) return res.status(400).json({ error: "location required" });

  const locations = db.filter(
    (dest) => dest.location.toLowerCase === location.toLowerCase
  );

  return res.send(locations);
});

//POST /
//expects {name, location, description?}
//before we create a destination in our db, we will get a photo of that destination from Unsplash
server.post("/", async (req, res) => {
  const { name, location, description } = req.body;

  if (!name || !location)
    return res.status(400).json({ error: "name and location required" });

  //generate a random UID
  const uid = getUID();

  //get picture from Unsplash

  const photo = await getPhoto(name);
  db.push({
    uid,
    name,
    photo,
    location,
    description: description || "",
  });
  res.send({ uid });
});

//PUT /?uid
//expect {name, location, description}
server.put("/", async (req, res) => {
  const { uid } = req.query;

  if (!uid || uid.length !== 6)
    return res.status(400).json({ error: "uid is a required 6 digit number" });

  const { name, location, description } = req.body;

  console.log(`uid:${uid}`);
  console.log(`description:${description}`);

  if (!name && !location && !description) {
    return res
      .status(400)
      .json({ error: "We need at least one fo the property to update" });
  }
  // go find a destination with the uid from my db
  for (let index = 0; index < db.length; index++) {
    const dest = db[index];

    if (dest.uid === uid) {
      //destination with uid found, update the dest with new information
      dest.desctiption = description ? description : dest.desctiption;
      dest.location = location ? location : dest.location;

      if (name) {
        // first get the photo and then update name and photo
        const photo = await getPhoto(name);

        dest.name = name;
        dest.photo = photo;
      }

      break;
    }
  }
  // if(found){
  //   return res.send({status: "found and updated"})
  //   return res.send({ status: "found and updated" });
  // }
  res.send({ success: "true" });
  // if ("uid" in req.body) {
  //   let uid1 = req.body.uid;
  //   let indexWithUID = db.findIndex((UID) => (db.UID = UID1));
  //   DV[indexWithUID].name = req.body.name;
  //   db[indexWithUID].description = req.body.description;
  // }
});

//DELETE /?uid
// server.delete("/", (req, res) => {
//   const { uid } = req.body;

//   if (!uid || uid.toString().length !== 6)
//     return res.status(400).json({ error: "uid is a required 6 digit number" });

//   const matchingIndex = (element) => element.uid === uid;
//   let matchingElement = db.findIndex(matchingIndex);
//   if (matchingElement !== -1) {
//     delete db[matchingElement];
//     return res.send(`Found and deleted successfully`);
//   } else return res.send("No matching element found");

//Different approach

server.delete("/", (req, res) => {
  const { uid } = req.query;

  for (let i = 0; i < db.length; i++) {
    const dest = db[i];
    if (dest.uid === uid) {
      db.splice(i, 1);
      break;
    }
  }
  res.send(db);
});
