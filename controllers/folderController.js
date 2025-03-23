import Folder from "../models/Folder";
import asyncHandler from "express-async-handler";

const createFolder = asyncHandler(async (req, res) => {
    const { name, parentFolderId } = req.body;
    const folder = await Folder.create({
        name,
        parentFolder: parentFolderId,
        owner: req.user._id,
    });
    res.status(201).json(folder);
});

const getFolder = asyncHandler(async (req, res) => {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user._id,
    }).populate({
      path: "items",
      populate: {
        path: "content", 
      },
    });

    if (!folder) {
        res.status(404);
        throw new Error("Folder not found");
    }

    res.status(200).json(folder);
});

const updateFolder = asyncHandler(async (req, res) => {
    const folder = await Folder.findOne({
        _id: req.params.id,
        owner: req.user._id
    });
    
    if (!folder) {
        res.status(404);
        throw new Error("Folder not found");
    }

    const updatedFolder = await Folder.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );
    res.status(200).json(updatedFolder);
});

const deleteFolder = asyncHandler(async (req, res) => {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
  
    if (!folder) {
      res.status(404);
      throw new Error("Folder not found");
    }
  
    const deleteItems = async (itemIds) => {
      for (const itemId of itemIds) {
        const item = await Item.findById(itemId);
        if (item.type === "folder") {
          const childFolder = await Folder.findById(item.content);
          await deleteItems(childFolder.items);
          await Folder.findByIdAndDelete(childFolder._id);
        }
        await Item.findByIdAndDelete(itemId);
      }
    };
  
    await deleteItems(folder.items);
    await Folder.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
  });

export { createFolder, getFolder, updateFolder, deleteFolder };
