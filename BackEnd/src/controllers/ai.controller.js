const aiService = require("../services/ai.service")


module.exports.getReview = async (req, res) => {

    const code = req.body.code;
    const language = req.body.language || 'javascript';

    if (!code) {
        return res.status(400).send("Code is required");
    }

    const response = await aiService(code, language);


    res.send(response);

}