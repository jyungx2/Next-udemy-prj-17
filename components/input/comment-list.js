import { useEffect, useState } from "react";
import classes from "./comment-list.module.css";

function CommentList() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchComments() {
      const res = await fetch("/api/comments");
      const data = await res.json();
      setComments(data.comments);
      console.log(data);
    }
    fetchComments();
  }, []);

  return (
    <ul className={classes.comments}>
      {/* Render list of comments - fetched from API */}
      {comments.map((item) => (
        <li key={item.id}>
          <p>{item.text}</p>
          <div>
            By <address>{item.name}</address>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default CommentList;
