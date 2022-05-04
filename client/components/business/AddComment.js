import React, { useState, useEffect } from "react";
import { Button, Form, Rating, Message } from "semantic-ui-react";
import { useRouter } from "next/router";
import commentService from "../../services/businesses/comments/commentService";
import { useSession } from "next-auth/client";
import useSWR from "swr";

const AddComment = ({ id, onAddComment }) => {
  const router = useRouter();
  const [session] = useSession();
  const [err, setError] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [comment, setComment] = useState({ ucomment: "", rating: 5 });
  const { data, error, isValidating } = useSWR(
    shouldFetch ? "create/comment" : null,
    () => commentService.createComment(shouldFetch, session.user.name.token)
  );

  const handleSubmit = () => {
    const { ucomment, rating } = comment;
    if (!ucomment || !rating) return;
    if (!session) router.push("/auth/login");
    setShouldFetch({ ...comment, businessId: id });
  };

  useEffect(() => {
    if (error || data) {
      setShouldFetch(false);
    }
    if (data) {
      setComment({ ucomment: "", rating: 5 });
      console.log(data);
      onAddComment(data);
    }
    if (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setError(message);
    }
  }, [data, error, isValidating]);

  return (
    <Form reply>
      <Form.TextArea
        style={{ resize: "none", minHeight: 10 }}
        value={comment.ucomment}
        onChange={(e, { value }) => setComment({ ...comment, ucomment: value })}
        placeholder="Tell us your opinion"
      />
      {err && (
        <Message negative>
          <Message.Header>An Error Occured</Message.Header>
          <p>{err}</p>
        </Message>
      )}
      <Rating
        onRate={(e, { rating }) => setComment({ ...comment, rating })}
        icon="star"
        defaultRating={comment.rating}
        maxRating={5}
      />
      <br />
      <Button
        loading={isValidating}
        onClick={handleSubmit}
        content="Add Comment"
        labelPosition="left"
        icon="edit"
        color="teal"
      />
    </Form>
  );
};

export default AddComment;
