const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderType: {
    type: String,
    enum: ["pharmacy", "pathology"],
    required: true,
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  pharmacyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
    required: function () {
      return this.orderType === "pharmacy";
    },
  },

  pathologyCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PathologyCenter",
    required: function () {
      return this.orderType === "pathology";
    },
  },

  deliveryPartnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryPartner",
  },

  items: [
    {
      medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
      testName: String,
      quantity: Number,
      price: Number,
      prescription: String, // URL if uploaded
    },
  ],

  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      long: Number,
    },
  },

  pickupAddress: {
    type: String, 
    coordinates:{
        lat:Number,
        long:Number
    }
  },

  orderStatus: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "assigned",
      "dispatched",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },

  paymentMethod: {
    type: String,
    enum: ["UPI", "card", "cash", "wallet"],
  },

  totalAmount: {
    type: Number,
    required: true,
  },

  orderDate: {
    type: Date,
    default: Date.now,
  },

  deliveryDate: {
    type: Date,
  },

  prescriptionRequired: {
    type: Boolean,
    default: false,
  },

  isTestHomeCollection: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Order", orderSchema);
