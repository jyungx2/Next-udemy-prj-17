// /api/comments/eventId
import { MongoClient } from "mongodb";

async function handler(req, res) {
  const eventId = req.query.eventId;

  // MongoDB 클라이언트에 연결 (events 데이터베이스 사용)
  // comments가 아닌, events로 설정하여 newsletter.js파일과 함께 events 컬렉션(db)으로 들어가게끔!
  const client = await MongoClient.connect(
    "mongodb+srv://jiyoungnim:V5eDDVlEeqEyfbL3@cluster0.okykg.mongodb.net/events?retryWrites=true&w=majority&appName=Cluster0"
  );

  if (req.method === "POST") {
    // 🌟 add server-side validation
    const { email, name, text } = req.body;

    if (
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid input." });
      return;
    }

    // 새로운 댓글 객체 생성
    const newComment = {
      // id: new Date().toISOString(), // MongoDB wil create a unique id for me!
      email,
      name,
      text,
      eventId,
    };

    // MongoDB 데이터베이스 가져오기
    const db = client.db();

    // 'comments' 컬렉션에 새로운 댓글 추가
    const result = await db.collection("comments").insertOne(newComment);

    console.log(result); // post요청 보낼 떄마다 터미널 로그 출력 (MongoDB의 insert 결과)
    newComment.id = result.insertedId; // MongoDB가 자동으로 생성한 _id 값을 newComment 객체의 id로 설정

    // 클라이언트에 응답 반환
    res.status(201).json({ message: "Added comment", comment: newComment });
  }

  if (req.method === "GET") {
    // MongoDB 데이터베이스 가져오기
    const db = client.db();

    // 'comments' 컬렉션에서 모든 댓글 가져오고 최신순 정렬
    const documents = await db
      .collection("comments") // 'comments' 컬렉션을 선택
      .find() // 컬렉션의 모든 문서를 찾음
      .sort({ _id: -1 }) // _id(즉, 생성 시간 기준) 📉내림차순📉으로 정렬하여 "최신 댓글"이 먼저 오도록 함
      .toArray(); // 검색된 문서를 배열로 변환

    res.status(200).json({ comments: documents });
  }

  // MongoDB 클라이언트 연결 해제 (⭐️필수⭐️)
  client.close();
}
export default handler;
