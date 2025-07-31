const _health = (req, res) => {
    res.status(200).json({ message: "Server is live" });
    res.end();
};

const _msg = () => {
    console.log("...App is Live...");
};

export default { _health, _msg };