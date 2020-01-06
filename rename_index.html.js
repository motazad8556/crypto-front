let fs = require("fs");

let file = fs.readFileSync("../angular_dist/index.html").toString();

file = file.replace(`<base href="/">`,`<base href="./">`)

fs.writeFileSync("../angular_dist/index.html", file)

