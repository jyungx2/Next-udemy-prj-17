import fs from "fs";
import path from "path";

function handler(req, res) {
  if (req.method === "GET") {
    const filePath = path.join(process.cwd(), "data", "comments.json");
    const fileData = fs.readFileSync(filePath);
    const data = JSON.parse(fileData);

    res.status(200).json({ comments: data });
  }

  if (req.method === "POST") {
    const email = req.body.email;
    const name = req.body.name;

    const text = req.body.text;

    const newComment = {
      id: new Date().toISOString(),
      email,
      name,
      text,
    };

    const filePath = path.join(process.cwd(), "data", "comments.json");
    const fileData = fs.readFileSync(filePath);
    const data = JSON.parse(fileData);

    data.push(newComment);
    fs.writeFileSync(filePath, JSON.stringify(data));
    res.status(201).json({ message: "Success!", comments: newComment });
  }
}

export default handler;
