const Report = require('../models/report.model')

const createReport = async (req, res) => {
    const { idRoom, idHouse, roomName, content } = req.body;
    const data = new Report({
        idRoom: idRoom,
        idHouse: idHouse,
        roomName: roomName,
        content: content
    });
    await data.save((err, data) => {
        try {
            if (err) {
                return res.status(400).json({ message: "Có lỗi sảy ra" })
            }
            else {
                return res.status(200).json({ message: "Thành công", data: data })
            }
        } catch (err) {
            return res.status(500).json({ message: "Có lỗi xảy ra" })
        }
    })
}

const readReportHouse = async (req, res) => {
    await Report.find({ idHouse: req.params.id }, (err, data) => {
        try {
            if (err || data.length == 0) {
                return res.status(400).json({ message: "Có lỗi xảy ra" })
            }
            else {
                return res.status(200).json({ data: data })
            }
        } catch (err) {
            return res.status(500).json({ message: "Có lỗi xảy ra" })
        }
    })
}

const updateReport = async (req, res) => {
    await Report.findOneAndUpdate({ _id: req.params.id }, req.body, (err, data) => {
        try {
            if (err || !data) {
                return res.status(400).json({ message: "Có lỗi xảy ra" })
            }
            else {
                return res.status(200).json({ message: "Thành công" })
            }
        } catch (err) {
            return res.status(500).json({ message: "Có lỗi xảy ra" })
        }
    })
}



module.exports = { createReport, readReportHouse, updateReport }