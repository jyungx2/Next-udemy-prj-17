import { useEffect, useState } from "react";

import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";

function Comments(props) {
  const { eventId } = props;
  const [comments, setComments] = useState([]);

  const [showComments, setShowComments] = useState(false);

  // showComments값에 의해 comments 표시여부를 바꾸고 싶은데, showComment = true일 때만 보이게 하고 싶으니까 다음과 같은 useEffect()코드를 짜준다.
  useEffect(() => {
    if (showComments) {
      async function fetchComments() {
        const res = await fetch("/api/comments/" + eventId);
        const data = await res.json();
        setComments(data.comments);
      }
      fetchComments();
    }
  }, [showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  async function addCommentHandler(commentData) {
    // send data to API
    const res = await fetch("/api/comments/" + eventId, {
      method: "POST",
      body: JSON.stringify(commentData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && <CommentList items={comments} />}
    </section>
  );
}

export default Comments;
