import express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
    var u = req.user;
    if (u != null && u.upn != null) {
        res.json({ email: u.upn })
    }
    else {
        res.json(500)
    }
})

export = router;