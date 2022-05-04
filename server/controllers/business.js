const Business = require("../models/business");
const cloudinary = require("../utils/cloudinary");
const User = require("../models/user");

const uploader = async (path) => await cloudinary.uploads(path);

const createBusiness = async (req, res, next) => {
  //const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return next(
  //     new HttpError("Invalid inputs passed, please check your data.", 422)
  //   );
  // }

  //const userId = req.params.uid;

  const {
    name,
    email,
    ownername,
    phone,
    city,
    area,
    address,
    type,
    userId,
    images,
    description,
    hours,
  } = req.body;

  let existingUser;
  let existingBusiness;

  try {
    existingUser = await User.findById(userId);
    existingBusiness = await Business.find({ userId: userId });
  } catch (err) {
    return res.status(400).send({ message: "Could not find user" });
  }

  if (!existingUser) {
    return res.status(400).send({ message: "Could not find user" });
  }

  if (!existingUser.business.hasBusiness) {
    return res.status(400).send({ message: "You dont have a business" });
  }

  // if (existingBusiness) {
  //   const error = new HttpError("You have already created your business", 500);
  //   console.log(existingBusiness);
  //   return next(error);
  // }

  const imagesArray = [];
  for (const image of images) {
    const imageUrl = await uploader(image);
    imagesArray.push(imageUrl);
  }

  const createdBusiness = new Business({
    userId,
    name,
    email,
    ownername,
    phone,
    city,
    area,
    address,
    type,
    description,
    hours,
    images: imagesArray,
  });

  try {
    await createdBusiness.save();
    existingUser.business.businessId = createdBusiness._id;
    await existingUser.save();
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ message: "Could not create your business please try later" });
  }

  res.status(200).json({ message: "OK" });
};

const fetchBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.find({}, "-hours");
    return res.status(200).json({ businesses: businesses });
  } catch (error) {
    return res.status(400).send({ message: "Could not find any business" });
  }
};

const fetchBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    return res.status(200).json({ business: business });
  } catch (error) {
    return res.status(400).send({ message: "Could not find any business" });
  }
};

exports.createBusiness = createBusiness;
exports.fetchBusinesses = fetchBusinesses;
exports.fetchBusiness = fetchBusiness;
