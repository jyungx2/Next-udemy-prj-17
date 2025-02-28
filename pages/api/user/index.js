import { MongoClient } from "mongodb";

// 💡 (Server-side) Error handling
async function connectDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://jiyoungnim:V5eDDVlEeqEyfbL3@cluster0.okykg.mongodb.net/events?retryWrites=true&w=majority&appName=Cluster0"
  );
  return client;
}

async function insertDocument(client, document) {
  const db = client.db();
  await db.collection("newsletter").insertOne(document);
}

async function handler(req, res) {
  if (req.method === "POST") {
    const userEmail = req.body.email;
    console.log(req.body);

    // 클라이언트 사이드(컴포넌트 파일)뿐만 아니라, 서버사이드에서도 유효성검사 필수!!(bc 클라이언트 사이드 유효성 검사는 직접 브라우저에서 조작할 수 있기 때문)
    if (!userEmail || !userEmail.includes("@")) {
      res.status(422).json({ message: "Invalid email address" });
      return;
    }

    // 💡 (Server-side) Error handling
    let client;
    try {
      // newsletter.js파일 또한 events 데이터베이스로 접근
      client = await connectDatabase();
    } catch (err) {
      res.status(500).json({ message: "Connecting to the database failed!" }); // 서버 측의 문제가 발생했을 때 500번 에러코드 발생 (데이터베이스 연결 실패)
      return; // written to prevent the further function execution.
    }

    try {
      await insertDocument(client, { email: userEmail });
      // const db = client.db();
      // await db.collection("newsletter").insertOne({ email: userEmail });
      client.close();
    } catch (err) {
      res.status(500).json({ message: "Inserting data failed!" }); // 500: 서버 내부 에러 (데이터 삽입 실패)
      return; // written to prevent the further function execution.
    }

    res.status(201).json({ message: "Signed up!" });
  }
}

export default handler;
