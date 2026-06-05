const multer = require(`multer`);
const path = require (`path`);
const fs = require(`fs`);
const ensureDir = (dir) => {
    if (!fs.existsSync(dir))
    {
        fs.mkdirSync(dir,
            {recursive: true}
        )
    }
};
ensureDir(`uploads/videos`);
ensureDir(`uploads/thumbnails`)