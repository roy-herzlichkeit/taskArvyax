import express, { Router } from "express";

const router = Router();

router.post('/register', (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    res.send(`${username} Registered`);
});

router.post('/login', (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    res.send(`${username} Logged in`);
});

export default router;