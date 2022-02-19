const express = require('express');
const router = express.Router();
const fetchUser = require("../MiddleWare/fetchuser");
const Note = require("../models/Notes");
const { route } = require('./auth');

router.get("/fetchAllNotes",fetchUser,async (req,res)=>{
    const userID = req.user.id;
    try {
        const note = await Note.find({user:userID});
        res.status(200).json(note);   
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})


router.post("/createnote",fetchUser,async (req,res)=>{
    const userID = req.user.id;
    const {title,description,tag} = req.body;
    try{
        const note = new Note({title,description,tag,user:userID});
        const x = await note.save();
        res.status(200).json(x);

    }catch(error){
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})



router.put("/updatenote/:id",fetchUser,async (req,res)=>{
    const userId = req.user.id;
    let note = await Note.findById(req.params.id);    
    const newnote = {};
    let{title,description,tag} = req.body;
    
    if(title){newnote.title = title};
    if(description){ newnote.description = description};
    if(tag){newnote.tag = tag};

    if(!note){
        return res.status(400).json("Not Exist");
    }

    if(note.user.toString()===userId){
        note = await Note.findByIdAndUpdate((req.params.id),{$set:newnote},{new:true});
        res.status(200).json(note);
    }
    else{
        res.status(401).json("Access Denied");
    }
    
})


router.delete("/deletenote/:id",fetchUser,async (req,res)=>{
    const userId = req.user.id;
    const note = await Note.findById(req.params.id);
    if(!note){
        return(res.status(400).json("not-exist"));
    }
    if(note.user.toString()!==userId){
        return(res.status(401).json("Access Denied"));
    }
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted Successfully");
})

module.exports = router;