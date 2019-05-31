const fs = require('fs');
const path = require('path');

// List all routes.js files in all modules if present
const getModuleRouteFiles = (source) =>
    fs.readdirSync(source)
        .map((name) => path.join(source, name))
        .map((name) => path.join(name, 'routes.js'))
        .filter(fs.existsSync);

module.exports = (app) => {
    // Import per-module routes
    getModuleRouteFiles(__dirname).forEach((path) => {
        require(path)(app);
    });
};
