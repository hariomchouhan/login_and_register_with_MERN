export default function Auth(req, res, next) {
    try {

        // access authorize header to validate request
        const token = req.header.authorization;
        res.json(token);
        // retrive the user details fo the logged in user

    } catch (error) {
        res.status(401).json({ error: "Authentication Failed!" });
    }
}