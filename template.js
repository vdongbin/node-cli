const html = `<!DOCTYPE html>
<html>
<head>
  <meta chart="utf-8" />
  <title>Template</title>
</head>
<body>
  <h1>Hello</h1>
  <p>CLI</p>
</body>
</html>`;

const router = `const express = require('express');
const router = express.Router();
 
router.get('/', (req, res, next) => {
   try {
     res.send('ok');
   } catch (error) {
     console.error(error);
     next(error);
   }
});
 
module.exports = router;`;

const express = `const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const port = process.env.SERVER_PORT || 3000;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// 404 Not Found
app.use((req, res, next) => {
  res.status(404).send('NOT FOUND');
});

app.listen(port, function() {
  console.log('Server is listening on ' + port);
});`;

const reactFunctional = `import React from 'react';

const Template = props => {
  return <div>{props.children}</div>;
};

export default Template;`;

const reactClass = `import React, { Component } from 'react';

class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <div>{this.props.children}</div>;
  }
}

export default Template;`;

module.exports = {
  html,
  router,
  express,
  reactFunctional,
  reactClass
};
