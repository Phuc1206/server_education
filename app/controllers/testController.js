class testController{
    index(req, res, next){
        res.json({success: 'true'})
    }
}
module.exports = new testController();