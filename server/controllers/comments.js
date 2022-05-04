const Comment = require("../models/comment");
const Appointment = require("../models/appointment");

const createComment = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { ucomment, rating, businessId } = req.body;
    let userMadeAppointment, userComments;

    userMadeAppointment = await Appointment.find({
      clientId: userId,
      businessId: businessId,
    }).populate("clientId", "name -_id");

    if (userMadeAppointment.length <= 0) {
      return res.status(400).send({
        message: "You have to book an appointment to leave a comment",
      });
    }

    userComments = await Comment.find({
      clientId: userId,
      businessId: businessId,
    });
    if (userMadeAppointment.length <= userComments.length) {
      return res.status(400).send({
        message: "You can only leave one comment per appointment",
      });
    }

    const comment = new Comment({
      comment: ucomment,
      rating,
      clientId: userId,
      businessId,
    });

    await comment.save();
    return res.status(200).json({
      comment: {
        ...comment._doc,
        clientId: { name: userMadeAppointment[0].clientId.name },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Could not create your comment" });
  }
};

const fetchBusinessComments = async (req, res, next) => {
  try {
    const businessId = req.params.id;
    const comments = await Comment.find(
      { businessId: businessId },
      "-businessId"
    )
      .sort({ created: "desc" })
      .populate("clientId", "name -_id");
    return res.status(200).json({ comments: comments });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Could not find any comments" });
  }
};

const fetchUserComments = async (req, res, next) => {
  try {
    const userId = req.userId;

    const comments = await Comment.find({ clientId: userId }).populate(
      "businessId",
      "name"
    );
    return res.status(200).json({ comments: comments });
  } catch (error) {
    console.log(error);
    return res.status(404).send({ message: "Could not find any comments" });
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;

    const comment = await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({ id: comment._id });
  } catch (error) {
    console.log(error);
    return res.status(404).send({ message: "Could not find any comments" });
  }
};

const replyComment = async (req, res, next) => {
  try {
    const businessId = req.businessId;
    const commentId = req.params.id;
    const { reply } = req.body;

    const comment = await Comment.findById(commentId).populate(
      "clientId",
      "name"
    );

    if (comment.businessId.toString() !== businessId.toString()) {
      return res
        .status(400)
        .send({ message: "You can only reply to your own comments" });
    }
    comment.reply = reply;
    await comment.save();

    return res.status(200).json({ message: comment });
  } catch (error) {
    console.log(error);
    return res.status(404).send({ message: "Could not find any comments" });
  }
};

exports.fetchUserComments = fetchUserComments;
exports.createComment = createComment;
exports.fetchBusinessComments = fetchBusinessComments;
exports.deleteComment = deleteComment;
exports.replyComment = replyComment;
