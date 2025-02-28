import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method === "POST") {
    const userEmail = req.body.email;
    console.log(req.body);

    // 클라이언트 사이드(컴포넌트 파일)뿐만 아니라, 서버사이드에서도 유효성검사 필수!!(bc 클라이언트 사이드 유효성 검사는 직접 브라우저에서 조작할 수 있기 때문)
    if (!userEmail || !userEmail.includes("@")) {
      res.status(422).json({ message: "Invalid email address" });
      return;
    }

    const client = await MongoClient.connect(
      "mongodb+srv://jiyoungnim:V5eDDVlEeqEyfbL3@cluster0.okykg.mongodb.net/newsletter?retryWrites=true&w=majority&appName=Cluster0"
    );

    const db = client.db();
    await db.collection("emails").insertOne({ email: userEmail });

    client.close();

    res.status(201).json({ message: "Signed up!" });
  }
}

export default handler;
