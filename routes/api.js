const express = require('express');
const router = express.Router();


// mount route handlers onto router object
// '/api' we dont need 


router.get('/testapi', function(req,res) {     
    res.send({type: "GET"})
});   

router.post('/testapi', function(req,res) {     
    res.send({type: "POST"})
});   

router.put('/testapi/:id', function(req,res) {     
    const para1 = req.params.id
    console.log(para1)
    res.send({type: "PUT"})
});   

router.delete('/testapi/:id', function(req,res) {     
    res.send({type: "DELETE"})
});   


module.exports = router; 