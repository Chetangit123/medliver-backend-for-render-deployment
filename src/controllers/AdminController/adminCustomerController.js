const CustomError = require('../../utils/customError');
const { successRes } = require('../../services/response');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const Customer = require('../../modals/customer.model');
require('dotenv').config();

module.exports.getAllCustomers = asyncErrorHandler(async (req, res, next) => {
    let { page, limit, sortOrder } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const sortDir = sortOrder?.toLowerCase() === 'asc' ? 1 : -1; //default desc

    const [total, customers] = await Promise.all([
        Customer.countDocuments(),
        Customer.find()
            .select("-password -otp")
            .sort({ createdAt: sortDir })
            .skip(skip)
            .limit(limit)
    ]);

    if (customers.length === 0) {
        return successRes(res, 200, false, "No Customers Found", []);
    }

    return successRes(res, 200, true, "Customers fetched successfully", {
        customers,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
    });
});

module.exports.getCustomerById = asyncErrorHandler(async (req, res, next) => {
    const { customerId } = req.query;

    if (!customerId) {
        return next(new CustomError("Customer ID is required", 400));
    }

    const customer = await Customer.findById(customerId).select("-password -otp");

    if (!customer) {
        return next(new CustomError("Customer not found", 404));
    }

    return successRes(res, 200, true, "Customer fetched successfully", customer);
});

module.exports.BlockUnblockCustomer = asyncErrorHandler(async (req, res, next) => {
    const { customerId } = req.body;

    if (!customerId) {
        return next(new CustomError("Customer ID is required", 400));
    }


    const customer = await Customer.findById(customerId);


    if (!customer) {
        return next(new CustomError("Customer not found", 404));
    }


    if (customer.isBlocked === true) {
        customer.isBlocked = false;
        await customer.save();
        return successRes(
            res,
            200,
            true,
            "Customer unblocked successfully",
            customer
        );
    }

    if (customer.isBlocked === false) {
        customer.isBlocked = true;
        await customer.save();
        return successRes(
            res,
            200,
            true,
            "Customer blocked successfully",
            customer
        );
    }
});