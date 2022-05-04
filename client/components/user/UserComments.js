import { useState, useEffect } from "react";
import {
  Button,
  Icon,
  Table,
  Rating,
  Message,
  Loader,
  Popup,
} from "semantic-ui-react";
import useSWR from "swr";
import { useSession } from "next-auth/client";
import commentService from "../../services/businesses/comments/commentService";
import { formatDate } from "../../utils/dateFormatter";

const UserComments = () => {
  const [comments, setComments] = useState([]);
  const [session] = useSession();
  const token = session.user.name.token;
  const [err, setError] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const { data, error, isValidating } = useSWR(
    shouldFetch ? token : null,
    commentService.fetchUserComments
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

  const deleteHandler = (id) => {
    commentService
      .deleteComment(id, token)
      .then((res) => {
        setComments((prev) => prev.filter((c) => c._id !== id));
      })
      .catch((er) => {
        console.log(er);
        setError("Something went wrong");
      });
  };

  return (
    <>
      {!comments ||
        (comments.length === 0 && !err && (
          <Message negative>
            <Message.Header>Hmmm</Message.Header>
            <p>You have not made any comments yet</p>
          </Message>
        ))}
      {err && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{err}</p>
        </Message>
      )}
      <Loader size="big" active={isValidating} />
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
              comments.map((c) => (
                <Table.Row key={c._id}>
                  <Table.Cell>{c.businessId.name}</Table.Cell>
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
                        content="Delete"
                        trigger={
                          <Icon
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteHandler(c._id)}
                            color="red"
                            size="big"
                            name="cancel"
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

export default UserComments;
