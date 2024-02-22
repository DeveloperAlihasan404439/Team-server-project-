const NotesModels = require("../models/Notes");

exports.getNotes = async(req, res)=>{
    const email = req.query.email;
    const fileter = {user_Email: email}
    const result = await NotesModels.find(fileter)
    res.send(result)
}

exports.patchNotes = async(req, res)=>{
    const id = req.params.id;
    const filter = {_id: id}
    const updatedNotes = {
        $set: {
          notes: req.body.notesText,
        },
      };
    const result = await NotesModels.updateOne(filter, updatedNotes)
    res.send(result)
}

exports.deleteNotes = async(req, res)=>{
    const id = req.query.id;
    const filter = {_id: id}
    const result = await NotesModels.deleteOne(filter)
    res.send(result)
}
exports.postNotes = async(req, res)=>{
    const result = await NotesModels.create(req.body)
    res.send(result)
}