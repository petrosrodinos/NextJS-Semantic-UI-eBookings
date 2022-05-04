import axios from "axios";

const createComment = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}business/comments`,
    userData,
    config
  );

  return data.comment;
};

const fetchBusinessComments = async (id) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}business/comments/${id}`
  );
  return data.comments;
};

const fetchUserComments = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}user/comments`,
    config
  );
  return data.comments;
};

const deleteComment = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}user/comments/${id}`,
    config
  );

  return data.id;
};

const replyComment = async (reply, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}business/comments/${reply.id}`,
    { reply: reply.reply },
    config
  );
  return data.message;
};

const commentService = {
  createComment,
  fetchBusinessComments,
  fetchUserComments,
  deleteComment,
  replyComment,
};

export default commentService;
