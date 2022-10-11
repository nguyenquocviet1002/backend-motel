const House = require('../models/house');
const _ = require('lodash');

const create = async (req, res) => {
    const data = new House({
        name: req.body.name,
        address: req.body.address,
        contract: req.body.contract,
        userId: req.body.userId
    })
    if (!data.name || !data.address) {
        return res.status(400).json({
            massage: "Nhập đầy đủ thông tin"
        })
    }
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ massage: "Hãy nhập đầy đủ thông tin" })
    }
}

const list = (req, res) => {
    House.find((err, data) => {
        if (err) {
            res.status(400).json({ massage: "Không tìm dữ liệu" })
        }
        res.json({ data })
    })
}

const houseByID = (req, res, next, id) => {
    House.findById(id).exec((err, house) => {
        if (err || !house) {
            res.status(400).json({
                message: "Không tìm thấy nhà"
            })
        }
        req.house = house;
        next();
    })
}

const houseByIDUser = (req, res, next, id) => {
    House.find({ userId: id }).exec((err, house) => {
        if (err || !house) {
            res.status(400).json({
                message: "Không tìm thấy nhà"
            })
        }
        req.house = house;
        next();
    })
}

const read = (req, res) => {
    return res.json(req.house)
}

const remove = (req, res) => {
    let house = req.house;
    house.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                message: "Xóa không thành công"
            })
        }
        res.json({
            data,
            message: "Xóa thành công"
        })
    })
}

const update = async (req, res) => {
    const data = {
        name: req.body.name,
        address: req.body.address
    }
    if (!data.name || !data.address) {
        return res.status(400).json({
            massage: "Nhập đầy đủ thông tin"
        })
    }
    try {
        let house = req.house;
        house = _.assignIn(house, data);

        const dataToSave = await house.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ massage: "Hãy nhập đầy đủ thông tin" })
    }
}

module.exports = { create, list, houseByID, houseByIDUser, read, remove, update }