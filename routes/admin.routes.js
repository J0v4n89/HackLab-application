const express = require('express');
const router = express.Router();

const { exec } = require('child_process');
const { isLoggedIn } = require('../middleware/auth.middleware');

router.get('/dashboard', isLoggedIn, (req, res) => {
    const isAdminParam = req.query.is_admin;

    const isRealAdmin = req.session.user && req.session.user.role === 'admin';

	if (!isRealAdmin && isAdminParam !== 'true') {
    		return res.status(403).send('Forbidden');
	}



    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Admin Panel</title>
        </head>

        <body style="
            margin:0;
            background:#0f172a;
            color:white;
            font-family:Arial;
            display:flex;
            justify-content:center;
            align-items:center;
            min-height:100vh;
        ">

            <div style="
                background:#111827;
                padding:40px;
                border-radius:14px;
                width:800px;
                text-align:center;
            ">

                <h1>Admin Panel</h1>

                <p>
                    Welcome to the SecureDocs admin dashboard.
                </p>

                <hr style="
                    border:none;
                    border-top:1px solid #374151;
                    margin:25px 0;
                ">

                <p>
                    <b>Current user:</b>
                    ${req.session.user.username}
                </p>

                <p>
                    <b>Role:</b>
                    ${req.session.user.role}
                </p>

                <p>
                    <b>is_admin:</b>
                    ${isAdminParam || 'not provided'}
                </p>

                <hr style="
                    border:none;
                    border-top:1px solid #374151;
                    margin:25px 0;
                ">

                <h2>Server Command Execution</h2>

                <p>
                    Execute operating system commands directly on the server.
                </p>

                <form method="POST" action="/admin/exec">

                    <input
                        type="text"
                        name="cmd"
                        placeholder="Enter system command"
                        style="
                            width:80%;
                            padding:14px;
                            border:none;
                            border-radius:8px;
                            background:#1f2937;
                            color:white;
                            font-size:15px;
                        "
                    >

                    <br><br>

                    <button
                        type="submit"
                        style="
                            background:#dc2626;
                            color:white;
                            border:none;
                            padding:12px 18px;
                            border-radius:8px;
                            cursor:pointer;
                        "
                    >
                        Execute Command
                    </button>

                </form>

                <br><br>

                <button
                    onclick="location.href='/dashboard'"
                    style="
                        background:#2563eb;
                        color:white;
                        border:none;
                        padding:12px 18px;
                        border-radius:8px;
                        cursor:pointer;
                    "
                >
                    Back to dashboard
                </button>

            </div>

        </body>
        </html>
    `);
});

router.post('/exec', isLoggedIn, (req, res) => {

    const cmd = req.body.cmd;

    exec(cmd, (err, stdout, stderr) => {

        if (err) {

            return res.send(`
                <!DOCTYPE html>
                <html>
                <body style="
                    background:#0f172a;
                    color:white;
                    font-family:Arial;
                    padding:40px;
                ">

                    <h1>Command Error</h1>

                    <pre style="
                        background:#111827;
                        padding:20px;
                        border-radius:12px;
                        overflow:auto;
                    ">${stderr}</pre>

                    <br>

                    <button onclick="location.href='/admin/dashboard?is_admin=true'">
                        Back
                    </button>

                </body>
                </html>
            `);
        }

        res.send(`
            <!DOCTYPE html>
            <html>

            <body style="
                background:#0f172a;
                color:white;
                font-family:Arial;
                padding:40px;
            ">

                <h1>Command Output</h1>

                <pre style="
                    background:#111827;
                    padding:20px;
                    border-radius:12px;
                    overflow:auto;
                ">${stdout}</pre>

                <br>

                <button
                    onclick="location.href='/admin/dashboard?is_admin=true'"
                    style="
                        background:#2563eb;
                        color:white;
                        border:none;
                        padding:12px 18px;
                        border-radius:8px;
                        cursor:pointer;
                    "
                >
                    Back
                </button>

            </body>

            </html>
        `);

    });

});

module.exports = router;
