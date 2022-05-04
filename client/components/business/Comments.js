import React, { useState, useEffect } from "react";
import { Comment, Header, Rating, Message, Segment } from "semantic-ui-react";
import commentService from "../../services/businesses/comments/commentService";
import { formatDate } from "../../utils/dateFormatter";
import AddComment from "./AddComment";

const Comments = ({ id, name }) => {
  const [err, setError] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    try {
      commentService.fetchBusinessComments(id).then(setComments);
    } catch (error) {
      setError("Could not fetch comments");
    }
  }, []);

  const onAddComment = (comment) => {
    let exist = comments.findIndex((c) => c.comment === comment.comment);
    if (exist >= 0) return;
    setComments([comment, ...comments]);
  };

  return (
    <Segment style={{ width: "95%" }}>
      <Comment.Group>
        <Header as="h3" dividing>
          Client Feedback
        </Header>
        {!comments ||
          (comments.length <= 0 && (
            <Message positive>
              <Message.Header>There are no comments yet</Message.Header>
              <p>Maybe create one</p>
            </Message>
          ))}
        {err && (
          <Message negative>
            <Message.Header>An error occured</Message.Header>
            <p>{err}</p>
          </Message>
        )}
        {comments &&
          comments.length > 0 &&
          comments.map((c, index) => (
            <Comment key={index}>
              <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
              <Comment.Content>
                <Comment.Author as="a">{c.clientId.name}</Comment.Author>
                <Rating
                  disabled
                  icon="star"
                  defaultRating={c.rating}
                  maxRating={5}
                />
                <Comment.Metadata>
                  <div>{formatDate(c.created)}</div>
                </Comment.Metadata>
                <Comment.Text>{c.comment}</Comment.Text>
              </Comment.Content>
              {c.reply && (
                <Comment.Group>
                  <Comment>
                    <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg" />
                    <Comment.Content>
                      <Comment.Author as="a">{name}</Comment.Author>
                      <Comment.Text>{c.reply}</Comment.Text>
                    </Comment.Content>
                  </Comment>
                </Comment.Group>
              )}
            </Comment>
          ))}

        <AddComment id={id} onAddComment={onAddComment} />
      </Comment.Group>
    </Segment>
  );
};

export default Comments;
