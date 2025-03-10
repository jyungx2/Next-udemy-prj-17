import { MongoClient } from "mongodb";

// 💡 (Server-side) Error handling
export async function connectDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://jiyoungnim:V5eDDVlEeqEyfbL3@cluster0.okykg.mongodb.net/events?retryWrites=true&w=majority&appName=Cluster0"
  );
  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db();
  const result = await db.collection(collection).insertOne(document);

  return result;
}

export async function getAllDocuments(client, collection, sort, filter = {}) {
  // MongoDB 데이터베이스 가져오기
  const db = client.db();

  // 'comments' 컬렉션에서 모든 댓글 가져오고 최신순 정렬
  const documents = await db
    .collection(collection) // 'comments' 컬렉션을 선택
    .find(filter) // 컬렉션의 모든 문서를 찾음
    .sort(sort) // _id(즉, 생성 시간 기준) 📉내림차순📉으로 정렬하여 "최신 댓글"이 먼저 오도록 함
    .toArray(); // 검색된 문서를 배열로 변환

  return documents;
}
