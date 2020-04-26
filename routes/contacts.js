const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const Contact = require("../models/Contact");
const User = require("../models/User");

// @route       GET api/contacts
// @desc        get all user contacts
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
  res.send("Get All contacts");
});

// @route       POST api/contacts
// @desc        Add new contacts
// @access      Private
router.post(
  "/",
  [auth, [check("name", "Name is Required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, type } = req.body;
    try {
      const newConatct = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });
      const contact = await newConatct.save();
      res.send(contact);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       PUT api/contacts/:id
// @desc        Update Contact
// @access      Private
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // Build Conatct Object
  const contactfileds = {};
  if (name) contactfileds.name = name;
  if (email) contactfileds.email = email;
  if (phone) contactfileds.phone = phone;
  if (type) contactfileds.type = type;

  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Contact not Found" });

    //Make Sure user owns the contact
    if (contact.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not Authorized" });

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactfileds },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route       Delete api/contacts/:id
// @desc        Delete Contact
// @access      Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Contact not Found" });

    //Make Sure user owns the contact
    if (contact.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not Authorized" });

    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: "Contact Removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
