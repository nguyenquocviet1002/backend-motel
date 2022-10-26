const Bill = require('../models/bill.model');
const Room = require('../models/room.model');
const House = require('../models/house.model');
const Service = require('../models/service.model');
const BillService = require('../models/billService.model');
const _ = require('lodash');


const getRoom = async (req, res, next, id) => {
    let dataList = {};
    await Room.findById(id, (err, data) => {
        if (err || !data) {
            res.status(400).json({
                message: 'Không tìm thấy dữ liệu',
            });
        }
        const { name, idHouse, _id, price } = data;
        const invoiceService = { serviceName: "Tiền nhà", amount: price };
        _.assignIn(dataList, { idRoom: _id, roomName: name, month: req.body.month, year: req.body.year, invoiceService });
        House.findById(idHouse, (err, data) => {
            if (err || !data) {
                res.status(400).json({
                    message: 'Không tìm thấy dữ liệu',
                });
            }
            const { name, address, _id } = data;
            _.assignIn(dataList, { idHouse: _id, houseName: name, address: address });
            req.data = dataList;
            next();
        })
    });
};

const setAmount = async (req, res, next) => {
    let data = req.data;
    let service = {};
    let invoiceServices = {};
    await Service.find({ idHouse: data.idHouse }, (err, data) => {
        try {
            const item = data.map(value => {
                return { name: value.name, price: value.price }
            })
            _.assignIn(service, { item });
        }
        catch (err) {
            error: err;
        }
    });
    await BillService.find({ idRoom: data.idRoom, idHouse: data.idHouse, month: req.body.month, year: req.body.year }, (err, data) => {
        try {
            const detail = data.map(detail => {
                return { name: detail.name, amount: detail.amount, inputValue: detail.inputValue, outputValue: detail.outputValue }
            })
            _.assignIn(service, { detail });
            const result = _.merge(service.item, service.detail);
            const invoiceService = result.map(value => {
                return { serviceName: `Tiền ${value.name}`, amount: (value.price * (value.amount ? value.amount : 1)) };
            });
            _.assignIn(invoiceServices, { invoiceService });
            req.data2 = invoiceServices;
            next();
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
    return res.status(200).json({ data: data2d })
}


module.exports = { getRoom, setAmount, setAmount2 };