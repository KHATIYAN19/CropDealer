const Request = require('../models/requestModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

// Updated calculateTotalForProduct function to include request statistics
const calculateTotalForProduct = async (productId, dateRange = null) => {
    let totalAmount = 0;
    let totalQuantity = 0;
    let totalRequests = 0;
    let totalAccepts = 0;
    let totalRejects = 0;
    
    const product = await Product.findById(productId).populate('request');
    if (!product) {
        console.log("enter",product)
        return { totalAmount, totalQuantity, totalRequests, totalAccepts, totalRejects };
    }

    console.log("product",product)

    for (let request of product.request) {
        totalRequests++;  // Increment total request count

        if (request.status === 'accept') {
            totalAccepts++;  // Increment accepted request count
            if (dateRange) {
                const requestDate = new Date(request.statusChangeDate);
                if (requestDate < dateRange.start || requestDate > dateRange.end) {
                    continue;
                }
            }
            totalAmount += request.price * request.quantity;
            totalQuantity += request.quantity;
        } else if (request.status === 'reject') {
            totalRejects++;  // Increment rejected request count
        }
    }

    return { totalAmount, totalQuantity, totalRequests, totalAccepts, totalRejects };
};

// Main API endpoint to get data for all periods
exports.getAllData = async (req, res) => {
    const userId = req.user.id;
    console.log(userId)
    try {
        const products = await Product.find({ owner: userId });
        console.log(products);
        let lifetimeTotalAmount = 0;
        let lifetimeTotalQuantity = 0;
        let lifetimeTotalRequests = 0;
        let lifetimeTotalAccepts = 0;
        let lifetimeTotalRejects = 0;

        let last7DaysTotalAmount = 0;
        let last7DaysTotalQuantity = 0;
        let last7DaysTotalRequests = 0;
        let last7DaysTotalAccepts = 0;
        let last7DaysTotalRejects = 0;

        let last30DaysTotalAmount = 0;
        let last30DaysTotalQuantity = 0;
        let last30DaysTotalRequests = 0;
        let last30DaysTotalAccepts = 0;
        let last30DaysTotalRejects = 0;

        // Date range for last 7 days (Including today)
        const last7DaysDateRange = {
            start: new Date(),
            end: new Date()
        };
        last7DaysDateRange.start.setDate(last7DaysDateRange.start.getDate() - 6);  // Start from 6 days ago to include today

        // Date range for last 30 days (Including today)
        const last30DaysDateRange = {
            start: new Date(),
            end: new Date()
        };
        last30DaysDateRange.start.setDate(last30DaysDateRange.start.getDate() - 29);  // Start from 29 days ago to include today

        for (let product of products) {
            const { totalAmount: productLifetimeAmount, totalQuantity: productLifetimeQuantity, 
                    totalRequests: productLifetimeRequests, totalAccepts: productLifetimeAccepts, totalRejects: productLifetimeRejects } = 
                    await calculateTotalForProduct(product._id);
            
            lifetimeTotalAmount += productLifetimeAmount;
            lifetimeTotalQuantity += productLifetimeQuantity;
            lifetimeTotalRequests += productLifetimeRequests;
            lifetimeTotalAccepts += productLifetimeAccepts;
            lifetimeTotalRejects += productLifetimeRejects;

            const { totalAmount: product7DaysAmount, totalQuantity: product7DaysQuantity, 
                    totalRequests: product7DaysRequests, totalAccepts: product7DaysAccepts, totalRejects: product7DaysRejects } = 
                    await calculateTotalForProduct(product._id, last7DaysDateRange);
            
            last7DaysTotalAmount += product7DaysAmount;
            last7DaysTotalQuantity += product7DaysQuantity;
            last7DaysTotalRequests += product7DaysRequests;
            last7DaysTotalAccepts += product7DaysAccepts;
            last7DaysTotalRejects += product7DaysRejects;

            const { totalAmount: product30DaysAmount, totalQuantity: product30DaysQuantity, 
                    totalRequests: product30DaysRequests, totalAccepts: product30DaysAccepts, totalRejects: product30DaysRejects } = 
                    await calculateTotalForProduct(product._id, last30DaysDateRange);
            
            last30DaysTotalAmount += product30DaysAmount;
            last30DaysTotalQuantity += product30DaysQuantity;
            last30DaysTotalRequests += product30DaysRequests;
            last30DaysTotalAccepts += product30DaysAccepts;
            last30DaysTotalRejects += product30DaysRejects;
        }

        res.json({
            lifetime: {
                totalAmount: lifetimeTotalAmount,
                totalQuantity: lifetimeTotalQuantity,
                totalRequests: lifetimeTotalRequests,
                totalAccepts: lifetimeTotalAccepts,
                totalRejects: lifetimeTotalRejects
            },
            last7Days: {
                totalAmount: last7DaysTotalAmount,
                totalQuantity: last7DaysTotalQuantity,
                totalRequests: last7DaysTotalRequests,
                totalAccepts: last7DaysTotalAccepts,
                totalRejects: last7DaysTotalRejects
            },
            last30Days: {
                totalAmount: last30DaysTotalAmount,
                totalQuantity: last30DaysTotalQuantity,
                totalRequests: last30DaysTotalRequests,
                totalAccepts: last30DaysTotalAccepts,
                totalRejects: last30DaysTotalRejects
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// API endpoint for day-by-day data for the last 30 days
exports.getDayByDayDataForLast30Days = async (req, res) => {
    const userId = req.user.id;
    try {
        const products = await Product.find({ owner: userId });
        const dailyData = [];

        const last30DaysDateRange = {
            start: new Date(),
            end: new Date()
        };
        last30DaysDateRange.start.setDate(last30DaysDateRange.start.getDate() - 29);  // Start 29 days ago to include today

        for (let i = 0; i < 30; i++) {
            const dayStart = new Date(last30DaysDateRange.start);
            dayStart.setDate(dayStart.getDate() + i);
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            let dailyAmount = 0;
            let dailyQuantity = 0;
            let dailyRequests = 0;
            let dailyAccepts = 0;
            let dailyRejects = 0;

            const dateRange = { start: dayStart, end: dayEnd };

            for (let product of products) {
                const { totalAmount, totalQuantity, totalRequests, totalAccepts, totalRejects } = await calculateTotalForProduct(product._id, dateRange);
                dailyAmount += totalAmount;
                dailyQuantity += totalQuantity;
                dailyRequests += totalRequests;
                dailyAccepts += totalAccepts;
                dailyRejects += totalRejects;
            }

            dailyData.push({
                date: dayStart.toISOString().split('T')[0],
                totalAmount: dailyAmount,
                totalQuantity: dailyQuantity,
                totalRequests: dailyRequests,
                totalAccepts: dailyAccepts,
                totalRejects: dailyRejects
            });
        }

        res.json({
            dailyData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
