const Course = require("../models/course");

const getCourseDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


module.exports = {
  getCourseDetails,
};
