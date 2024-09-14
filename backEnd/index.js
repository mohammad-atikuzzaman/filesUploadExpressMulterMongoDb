const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const path = require("path");

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

// const uri = `mongodb://localhost:27017`;
const uri =
  "mongodb+srv://photoserver:akash123@cluster0.tyigyp7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// connect mongodb on server
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// setup multer storage on server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Upload folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename file with timestamp
  },
});
const upload = multer({ storage });

async function run() {
  try {
    const db = client.db("fileServer");
    const dataCollection = db.collection("fileServersDataCollection");

    // Route to handle file upload
    app.post("/upload", upload.single("file"), async (req, res) => {
      try {
        // Construct file data to be saved in MongoDB
        const fileData = {
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
          createdAt: new Date(),
        };

        // Insert file data into MongoDB
        const result = await dataCollection.insertOne(fileData);

        // Construct file URL to be returned to the client
        const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;

        // Send response back to the frontend with file URL
        res.status(200).json({
          message: "File uploaded successfully",
          fileUrl: fileUrl, // Return the file URL
        });
      } catch (error) {
        console.error("File upload failed:", error);
        res.status(500).json({ error: "File upload failed" });
      }
    });

    const fs = require("fs"); // File System module

    // Add this route to delete a file by its filename
    app.delete("/delete/:filename", async (req, res) => {
      const filename = req.params.filename;
      console.log(filename)

      try {
        // Find the file in MongoDB
        const fileRecord = await dataCollection.findOne({ filename });

        if (!fileRecord) {
          return res.status(404).json({ error: "File not found" });
        }

        // Remove the file from the file system
        const filePath = path.join(__dirname, "uploads", filename);
        fs.unlink(filePath, async (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return res.status(500).json({ error: "Error deleting file" });
          }

          // Remove the file's metadata from MongoDB
          await dataCollection.deleteOne({ filename });

          // Send success response
          res.status(200).json({ message: "File deleted successfully" });
        });
      } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ error: "Error deleting file" });
      }
    });


    // Serve uploaded files statically
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    app.get("/files", async(req, res)=>{
      const result =await dataCollection.find().toArray()
      res.send(result)
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to the file server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
