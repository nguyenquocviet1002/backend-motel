const Bill = require('../models/bill.model');
const Room = require('../models/room.model');
const House = require('../models/house.model');
const Service = require('../models/service.model');
const BillService = require('../models/billService.model');
const _ = require('lodash');


const getInfo = async (req, res, next, id) => {
    let dataList = {};
    await Room.findById(id).exec((err, data) => {
        if (err || !data) {
            res.status(400).json({
                message: 'Không tìm thấy dữ liệu',
            });
        }
        else {
            const { name, idHouse, _id, price, listMember } = data;
            const customerIndex = _.findKey(listMember, ['status', true]);
            const customerName = customerIndex ? listMember[customerIndex].memberName : "";
            const invoiceService = { serviceName: "Tiền nhà", amount: price };
            _.assignIn(dataList, { idRoom: _id, roomName: name, month: req.body.month, year: req.body.year, memberName: customerName, invoiceService });
            House.findById(idHouse).exec((err, data) => {
                if (err || !data) {
                    res.status(400).json({
                        message: 'Không tìm thấy dữ liệu',
                    });
                }
                else {
                    const { name, address, _id, idAuth } = data;
                    _.assignIn(dataList, { idHouse: _id, houseName: name, address: address, idAuth: idAuth });
                    req.data = dataList;
                    next();
                }
            })
        }
    });
};

const setAmount = async (req, res, next) => {
    let data = req.data;
    let service = {};
    let invoiceServices = {};
    await Service.find({ idHouse: data.idHouse }).exec((err, docs) => {
        try {
            const item = docs.map(value => {
                return { name: value.name, price: value.price }
            })
            _.assignIn(service, { item });
            BillService.find({ idRoom: data.idRoom, idHouse: data.idHouse, month: req.body.month, year: req.body.year }).exec((err, data) => {
                if (data.length == 0) {
                    res.status(400).json({
                        message: 'Chưa có hóa đơn',
                    });
                }
                else {
                    const detail = data.map(detail => {
                        return { name: detail.name, amount: detail.amount, inputValue: detail.inputValue, outputValue: detail.outputValue }
                    })
                    _.assignIn(service, { detail });
                    const result = _.merge(service.item, service.detail);
                    const invoiceService = result.map(value => {
                        let amountUse;
                        if (value.inputValue || value.outputValue) {
                            amountUse = value.outputValue - value.inputValue;
                        }
                        return { serviceName: `Tiền ${value.name} ${value.inputValue ? `(Số ${value.name} cũ ${value.inputValue}` : ""} ${value.outputValue ? `, Số ${value.name} mới ${value.outputValue})` : ""} `, amount: (value.price * (amountUse !== undefined ? amountUse : 1)) };
                    });
                    _.assignIn(invoiceServices, { invoiceService });
                    req.data2 = invoiceServices;
                    next();
                }
            });
        }
        catch (err) {
            error: err;
        }
    });
}

const setAmount2 = async (req, res) => {
    let data = req.data;
    let data2 = req.data2;
    const { invoiceService } = data;
    const no = { invoiceService: [invoiceService] }
    const other = _.concat(no.invoiceService, data2.invoiceService);
    const data2d = _.assignIn(data, { invoiceService: other });
    const dataSave = new Bill(data2d);
    dataSave.save();
    return res.status(200).json({ data: dataSave })
}

const getBillAll = async (req, res) => {
    await Bill.find({ idAuth: req.params.idAuth, year: req.body.year, month: req.body.month }).exec((err, data) => {
        if (data.length == 0) {
            res.status(400).json({
                message: 'Không có dữ liệu',
            });
        }
        else {
            res.status(200).json({
                data: data
            });
        }
    })
}


const getBillId = (req, res, next, id) => {
    Bill.findById(id).exec((err, data) => {
        if (err || !data) {
            return res.status(400).json({
                message: 'Không tìm thấy dữ liệu',
            });
        }
        req.dataBill = data;
        next();
    });
};

const read = (req, res) => {
    return res.json(req.dataBill);
};

const removeBill = (req, res) => {
    let bill = req.dataBill;
    bill.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                message: 'Xóa không thành công',
            });
        }
        res.json({
            data,
            message: 'Xóa thành công',
        });
    });
};


module.exports = { getInfo, setAmount, setAmount2, getBillAll, getBillId, read, removeBill };