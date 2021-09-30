const router = require("express").Router();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

const Restaurant = require("../model/restaurants");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(_, _, cb) {
    cb(null, "./uploads/");
  },
  filename: function(_, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/",
  upload.single("resturanturl"),
  body("restaurantName").isLength({ min: 4 }),
  body("restaurantPhone").isNumeric(),
  body("restaurantEmail")
    .not()
    .isEmpty()
    .isEmail()
    .normalizeEmail(),
  // body("menuPrice").isNumeric(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const id = mongoose.Types.ObjectId();

    const rName = req.body.restaurantName;
    const status = false;
    const imgurl = req.body.path;
    const rPhone = req.body.restaurantPhone;
    const rEmail = req.body.restaurantEmail;
    const rCity = req.body.rCity;
    const rating = req.body.rating || 0;
    const cuisine = req.body.cuisine;
    const newRestaurant = new Restaurant({
      _id: id,
      restaurantName: rName,
      restaurantRegistrationStatus: status,
      resturanturl: imgurl,
      restaurantPhone: rPhone,
      restaurantEmail: rEmail,
      rCity: rCity,
      rating: rating,
      cuisine: cuisine,
    });
    newRestaurant
      .save()
      .then((savedResturant) => {
        res.json(savedResturant);
      })
      .catch((err) =>
        res.json({ "Error while creating restaurant": err.message })
      );
  }
);

router.get("/", (_, res) => {
  Restaurant.find({})
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
});

router.get("/reviews/:rID", (req, res) => {
  console.log(req.params.rID);
  Restaurant.findById(req.params.rID)
    .select("reviews")
    .then((reviews) => res.json(reviews))
    .catch((err) =>
      res.json({ "Error while fetching reviews for restaurant": err.message })
    );
});

router.post(
  "/reviews/:rID",
  body("rating").isNumeric(),
  body("reviewText")
    .isLength({ min: 6 })
    .not()
    .isEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const id = req.params.rID;

    let reviewObj = {
      _id: mongoose.Types.ObjectId(),
      rating: req.body.rating,
      reviewText: req.body.reviewText,
      user: req.body.user,
    };

    Restaurant.findById({ _id: id })
      .then((restaurant) => {
        let avgRating = restaurant.rating;
        avgRating =
          (avgRating + req.body.rating) / (restaurant.reviews.length + 1);

        Restaurant.findOneAndUpdate(
          { _id: id },
          { $push: { reviews: reviewObj }, $set: { rating: avgRating } },
          { new: true, upsert: false }
        )
          .then((doc) => res.json(doc))
          .catch((err) =>
            res.json({ "Some error occured while appending to reviews": err })
          );
      })
      .catch((err) => res.json(err));
  }
);

router.patch("/:rID", (req, res) => {
  const id = req.params.rID;
  Restaurant.findByIdAndUpdate(
    { _id: id },
    {
      restaurantName: req.body.restaurantName,
      restaurantPhone: req.body.restaurantPhone,
      restaurantEmail: req.body.restaurantEmail,
    },
    { new: true, upsert: false }
  )
    .then((data) => res.json(data))
    .catch((err) => res.json("Caught:", err.message));
});

router.patch("/status/:rID", (req, res) => {
  const id = req.params.rID;
  Restaurant.findByIdAndUpdate(
    { _id: id },
    {
      restaurantRegistrationStatus: true,
    },
    { new: true, upsert: false }
  )
    .then((data) => res.json(data))
    .catch((err) => res.json("Caught:", err.message));
});

router.get("/:rID", (req, res) => {
  Restaurant.findById(req.params.rID)
    .then((restaurant) => res.json(restaurant))
    .catch((err) => res.json("Caught:", err.message));
});

router.delete("/:rID", (req, res) => {
  Restaurant.findByIdAndRemove(req.params.rID)
    .then(res.json({ msg: "delete success!" }))
    .catch((err) => res.json({ "delete err!": err.message }));
});

// Get all items from menus
router.get("/menu/:rid/", (req, res) => {
  Restaurant.findById(req.params.rid)
    .then((restaurant) => res.json({ menus: restaurant.menus }))
    .catch((err) => res.json({ "error while fetching menu": err.message }));
});

//to update menu
router.patch("/menu/:menuID", (req, res) => {
  Restaurant.findOneAndUpdate(
    { "menus._id": req.params.menuID },
    {
      $set: {
        "menus.$.menuName": req.body.menuName,
        "menus.$.menuPrice": req.body.menuPrice,
      },
    },
    { new: true, upsert: false }
  )
    .then((data) => res.json(data))
    .catch((err) => res.json({ "Error in updating menu": err.message }));
});

// Add items to menus
router.post("/menu/:rID", body("menuPrice").isNumeric(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  const id = req.params.rID;
  const menuObj = {
    menuID: mongoose.Types.ObjectId(),
    menuName: req.body.menuName,
    menuPrice: req.body.menuPrice,
  };

  Restaurant.findOneAndUpdate(
    { _id: id },
    { $push: { menus: menuObj } },
    { new: true, upsert: false }
  )
    .then((doc) => res.json(doc))
    .catch((err) => res.json({ err: err }));
});

router.delete("/menu/:rid/:menuId", (req, res) => {
  const id = req.params.menuId;
  const rid = req.params.rid;
  Restaurant.findByIdAndUpdate(
    rid,
    {
      $pull: {
        menus: {
          _id: id,
        },
      },
    },
    { new: true, upsert: false }
  )
    .then((result) => res.json(result))
    .catch((err) => res.json({ "delete err!": err.message }));
});

module.exports = router;
