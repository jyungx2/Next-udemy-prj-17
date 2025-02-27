import fs from "fs";
import path from "path";

function handler(req, res) {
  if (req.method === "POST") {
    const email = req.body.email;

    const newUser = {
      id: new Date().toISOString(),
      email,
    };

    const filePath = path.join(process.cwd(), "data", "user.json");
    const fileData = fs.readFileSync(filePath);
    const data = JSON.parse(fileData);

    data.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(data));
    res.status(201).json({ message: "Success!", user: newUser });
  } else {
    const filePath = path.join(process.cwd(), "data", "user.json");
    const fileData = fs.readFileSync(filePath);
    const data = JSON.parse(fileData);

    res.status(200).json({ user: data });
  }
}

export default handler;
