const Docket = require('../Models/docket');

module.exports = {
  createDocket: async (req, res) => {
    try {
      const {
        name,
        startTime,
        endTime,
        hoursWorked,
        ratePerHour,
        supplierName,
        purchaseOrder,
        description
      } = req.body;
      const docket = await Docket.create({
        name,
        startTime,
        endTime,
        hoursWorked,
        ratePerHour,
        supplierName,
        purchaseOrder,
        description
      });
      return res.send({
        message: 'Successfully Added the Docket',
        docket
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: 'Internal server error'
      });
    }
  },

  getDockets: async (req, res) => {
    try {
      const dockets = await Docket.find({});
      return res.send({
        message: 'Successfully fetched the Dockets',
        dockets
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: 'Internal server error'
      });
    }
  }
}