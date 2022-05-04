import { useState, useEffect } from "react";
import {
  Button,
  Icon,
  Table,
  Rating,
  Message,
  Loader,
  TextArea,
  Form,
  Confirm,
  Popup,
} from "semantic-ui-react";
import useSWR from "swr";
import { useSession } from "next-auth/client";
import commentService from "../../services/businesses/comments/commentService";
import { formatDate } from "../../utils/dateFormatter";

const BusinessComments = () => {
  const [session] = useSession();
  const id = session.user.name.businessId;
  const token = session.user.name.token;
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState({ id: "", reply: "" });
  const [err, setError] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const { data, error, isValidating } = useSWR(
    shouldFetch ? id : null,
    commentService.fetchBusinessComments
  );

  useEffect(() => {
    if (error || data) {
      setShouldFetch(false);
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
    if (data) {
      if (Array.isArray(data)) {
        setComments(data);
      }
    }
  }, [data, error, isValidating]);

  const handleReply = (comment) => {
    setReply({ id: comment._id, reply: comment.reply });
    setOpen(true);
  };

  const handleReplyClick = async () => {
    setLoading(true);
    try {
      const res = await commentService.replyComment(reply, token);
      let temp = comments;
      let index = temp.findIndex((c) => c._id === res._id);
      let filtered = temp.filter((c) => c._id !== reply.id);
      filtered.splice(index, 0, res);
      setComments(filtered);
      setOpen(false);
      setLoading(false);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setError(message);
    }
  };

  const ReplyModal = () => {
    return (
      <Confirm
        open={open}
        content={() => {
          return (
            <Form style={{ padding: 10 }}>
              <TextArea
                onChange={(e) => {
                  setReply({ ...reply, reply: e.target.value });
                }}
                style={{ resize: "none", padding: 10 }}
                value={reply.reply}
                placeholder="Reply..."
              />
            </Form>
          );
        }}
        header="Reply"
        onCancel={() => setOpen(false)}
        confirmButton={() => (
          <Button onClick={handleReplyClick} loading={loading} color="teal">
            Reply
          </Button>
        )}
      />
    );
  };

  return (
    <>
      {!comments ||
        (comments.length === 0 && !err && (
          <Message negative>
            <Message.Header>Hmmm</Message.Header>
            <p>You dont have any comments yet</p>
          </Message>
        ))}
      {err && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{err}</p>
        </Message>
      )}
      <Loader size="big" active={isValidating} />
      {ReplyModal()}
      {!isValidating && !err && comments.length > 0 && (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Comment</Table.HeaderCell>
              <Table.HeaderCell>Rating</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Reply</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {comments &&
              comments.length > 0 &&
              comments.map((c, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{c.clientId.name}</Table.Cell>
                  <Table.Cell>{c.comment}</Table.Cell>
                  <Table.Cell>
                    <Rating
                      disabled
                      icon="star"
                      defaultRating={c.rating}
                      maxRating={5}
                    />
                  </Table.Cell>
                  <Table.Cell>{formatDate(c.created)}</Table.Cell>
                  <Table.Cell>{c.reply}</Table.Cell>
                  <Table.Cell>
                    <div style={{ textAlign: "center" }}>
                      <Popup
                        content="Reply"
                        trigger={
                          <Icon
                            style={{ cursor: "pointer" }}
                            onClick={() => handleReply(c)}
                            color="green"
                            size="big"
                            name="reply"
                          />
                        }
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      )}
    </>
  );
};

export default BusinessComments;
