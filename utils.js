const fs = require('fs');

function handleError(err, res) {
  if (err.status) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  handleError
};
