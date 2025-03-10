// /api/comments/eventId

import {
  connectDatabase,
  insertDocument,
  getAllDocuments,
} from "../../../helpers/db-util";

async function handler(req, res) {
  const eventId = req.query.eventId;
  let client;

  // MongoDB 클라이언트에 연결 (events 데이터베이스 사용)
  // comments가 아닌, events로 설정하여 newsletter.js파일과 함께 events 컬렉션(db)으로 들어가게끔!
  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return; // 🖍️client와의 connection(ex. client.close())을 닫지 않아도 되는 시점 (<= 이미 db 와의 커넥션에 실패해 에러가 발생한 것이기 떄문, 연결을 끊을 client 자체가 존재 x)
  }

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
      client.close(); // 🖍️client가 이미 생성된 상태이기 때문에 반드시 client.close() 호출해 불필요한 연결이 유지, 리소스를 낭비하지 않도록 연결 해제!
      return; // 🖍️데이터가 유효하지 않으므로 더이상 함수 실행할 필요 X
    }

    // 새로운 댓글 객체 생성
    const newComment = {
      // id: new Date().toISOString(), // MongoDB wil create a unique id for me!
      email,
      name,
      text,
      eventId,
    };

    // ⭐️ 다음 코드를 try{}-catch{} 안에 작성하기 (그 과정에서 함수 분리하여 임포트 필수)
    // // MongoDB 데이터베이스 가져오기
    // const db = client.db();
    // // 'comments' 컬렉션에 새로운 댓글 추가
    // const result = await db.collection("comments").insertOne(newComment);
    // console.log(result); // post요청 보낼 떄마다 터미널 로그 출력 (MongoDB의 insert 결과)
    let result;
    try {
      result = await insertDocument(client, "comments", newComment); // 위의 코드(⭐️)를 한 줄로 단축!
      newComment._id = result.insertedId; // MongoDB가 자동으로 생성한 _id 값을 newComment 객체의 id로 설정
      res.status(201).json({ message: "Added comment", comment: newComment }); // 클라이언트에 응답 반환
    } catch (err) {
      res.status(500).json({ message: "Inserting comment failed!" });
      // return; 🖍️아래에 client.close()까지 실행시키기 위해서. (🚨client.close()는 코드의 마지막에서 호출되므로 따로 return을 사용하지 않아도 된다🚨)
    }
    // ⭐️
  }

  if (req.method === "GET") {
    // ⭐️ 다음 코드를 try{}-catch{} 안에 작성하기 (그 과정에서 함수 분리하여 임포트 필수)
    // // MongoDB 데이터베이스 가져오기
    // const db = client.db();

    // // 'comments' 컬렉션에서 모든 댓글 가져오고 최신순 정렬
    // const documents = await db
    //   .collection("comments") // 'comments' 컬렉션을 선택
    //   .find() // 컬렉션의 모든 문서를 찾음
    //   .sort({ _id: -1 }) // _id(즉, 생성 시간 기준) 📉내림차순📉으로 정렬하여 "최신 댓글"이 먼저 오도록 함
    //   .toArray(); // 검색된 문서를 배열로 변환

    try {
      const documents = await getAllDocuments(
        client,
        "comments",
        { _id: -1 },
        { eventId: eventId } // ✨filter parameter: you ensure that you only fetch the comments that really belong to a specific event.
      );
      res.status(200).json({ comments: documents });
    } catch (err) {
      res.status(500).json({ message: "Getting comments failed!" });
      // return; 🖍️아래에 client.close()까지 실행시키기 위해서. (🚨client.close()는 코드의 마지막에서 호출되므로 따로 return을 사용하지 않아도 된다🚨)
    }
    // ⭐️
  }

  // MongoDB 클라이언트 연결 해제 (⭐️필수⭐️)
  client.close(); // 🖍️try 블록 내에서 정상적으로 데이터 삽입/조회가 완료된 경우에도 연결해제 (데이터베이스 연결이 남아있지 않도록 하기 위함.) /
  // => 즉, 모든 경우에 client.close()가 실행됨 → 정상 처리되든, 에러가 발생하든 연결을 해제함
  // => 코드가 단순해짐 → 모든 경우에 client.close()가 실행되므로 catch 블록 안에서 따로 client.close()를 호출할 필요가 없음.
}
export default handler;
