const app = require("./app");
const db = require("./config/db");

const PORT = 5000;

db.query("SELECT 1", (err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("Database connected successfully.");

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});