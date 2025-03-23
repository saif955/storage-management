import Item from "../models/Item.js";
import asyncHandler from "express-async-handler";

const createItem = asyncHandler(async (req, res) => {
    const { name, type, folderId } = req.body;
    let content;
  
    switch (type) {
      case "note":
        content = await Note.create({ content: "", owner: req.user._id });
        break;
      case "pdf":
      case "image":
        content = await File.create({ 
          name, 
          fileType: type, 
          owner: req.user._id 
        });
        break;
      case "folder":
        content = await Folder.create({ 
          name, 
          owner: req.user._id 
        });
        break;
      default:
        res.status(400);
        throw new Error("Invalid item type");
    }
  
    const item = await Item.create({
      name,
      type,
      content: content._id,
      owner: req.user._id,
      folder: folderId,
    });
  
    if (folderId) {
      await Folder.findByIdAndUpdate(
        folderId,
        { $push: { items: item._id } }
      );
    }
  
    res.status(201).json(item);
  });