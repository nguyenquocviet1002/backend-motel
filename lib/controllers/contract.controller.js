const Contract = require('../models/contract.model');

const create = async (req, res) => {
  const data = new Contract({
    title: req.body.title,
    content: req.body.content,
  });
  if (!data.title || !data.content) {
    return res.status(400).json({
      message: 'Nhập đầy đủ thông tin',
    });
  }
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ massage: 'Thêm hợp đồng không thành công' });
  }
};

const list = (req, res) => {
  Contract.find((err, data) => {
    if (err) {
      res.status(400).json({ massage: 'Không tìm dữ liệu' });
    }
    res.json({ data });
  });
};

const findContractByID = (req, res, next, id) => {
  Contract.findById(id, (err, contract) => {
    if (err || !contract) {
      res.status(400).json({
        message: 'Không tìm thấy dữ liệu',
      });
    }
    req.contract = contract;
    next();
  });
};

const read = (req, res) => {
  return res.json(req.contract);
};

module.exports = { create, list, findContractByID, read };
