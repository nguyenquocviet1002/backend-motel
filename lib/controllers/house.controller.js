const House = require('../models/house.model');
const _ = require('lodash');

const create = async (req, res) => {
    const uid = req.profile._id;
    const data = new House({
        name: req.body.name,
        address: req.body.address,
        idAuth: uid
    })

    if (!uid) {
        return res.status(400).json({
            message: "User không tồn tại"
        })
    }
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
    const id = req.profile._id;
    House.find({ idAuth: id }, (err, data) => {
        if (err) {
            res.status(400).json({ massage: "Không tìm thấy dữ liệu" })
        }
        res.json({ data })
    })
}

const houseByID = (req, res, next, id) => {
    House.findById(id).exec((err, house) => {
        if (err || !house) {
            res.status(400).json({
                message: "Không tìm thấy dữ liệu"
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

const houseByIDService = (req, res, next, id) => {
    House.findById(id).exec((err, house) => {
        if (err || !house) {
            res.status(400).json({
                message: "Không tìm thấy dữ liệu"
            })
        }
        req.house = house;
        next();
    })
}
const addService = async (req, res) => {
    let house = req.house;
    house = _.concat(house.service, req.body.service);
    let data = { service: house }
    if (req.params.idHouse) {
        await House.findByIdAndUpdate(req.params.idHouse, data, (err, docs) => {
            if (err) {
                return res.status(400).json({
                    error: 'Nhà không tồn tại',
                });
            } else {
                return res.status(200).json({
                    error: 'Thêm dịch vụ thành công',
                    docs: docs,
                });
            }
        });
    } else {
        return res.status(400).json({
            error: 'Thiếu parameter',
        });
    }
};

module.exports = { create, list, houseByID, read, remove, update, addService, houseByIDService }