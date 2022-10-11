const House = require('../models/house');
const formidable = require('formidable')
const _ = require('lodash');

const create = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
        const uid = req.profile._id;
        if (err) {
            return res.status(400).json({
                message: "Thêm thất bại"
            })
        }
        const { name, address } = fields;
        fields.userId = uid;
        if (!name || !address) {
            return res.status(400).json({
                message: "Nhập đầy đủ thông tin"
            })
        }
        let house = new House(fields);
        house.save((err, data) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    message: "Không thể thêm"
                })
            }
            res.json(data)
        })
    })
}

const list = (req, res) => {
    const id = req.profile._id;
    House.find({ userId: id }, (err, data) => {
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

const update = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
        if (err) {
            return res.status(400).json({
                message: "Sửa thất bại"
            })
        }
        const { name, address } = fields;
        if (!name || !address) {
            return res.status(400).json({
                message: "Nhập đầy đủ thông tin"
            })
        }
        let house = req.house;
        house = _.assignIn(house, fields);

        house.save((err, data) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    message: "Không thể sửa"
                })
            }
            res.json(data)
        })
    })
}

module.exports = { create, list, houseByID, remove, update }