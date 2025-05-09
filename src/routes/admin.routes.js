const express = require("express");
const indexController = require("../controllers/indexController");
const { verifyAdminToken } = require("../utils/jsonWebToken");
const { validate, validateQuery, createPharmacy, getAndDeletePharmacyById, getAllPharmacy, updatePharmacy } = require('../middleware/validation');
const router = express.Router();
const { uploadAdminProfile, uploadLicenceImagePharmacy } = require('../services/multer')

/** Super Admin Auth Routes */

router.post("/admin-login", indexController.adminAuthController.login);
router.get("/get-admin-details", verifyAdminToken(), indexController.adminAuthController.getAdminDetails);
router.post("/forget-password", indexController.adminAuthController.forgetPassword);
router.post("/reset-password", indexController.adminAuthController.resetPassword);
router.post("/changed-password", verifyAdminToken(), indexController.adminAuthController.changedPassword);
router.patch("/update-admin-profile", verifyAdminToken(), indexController.adminAuthController.updateAdminProfile);

/** Upload files */
router.post('/upload-image', uploadAdminProfile, verifyAdminToken(), indexController.adminAuthController.uploadAdminAvatar);

/** Super Admin Pathology Routes */

router.post("/create-pathology", verifyAdminToken("superadmin"), indexController.adminPathologyController.createPathologyCenter)
router.get("/get-pathology-by-id", verifyAdminToken("superadmin"), indexController.adminPathologyController.getPathologyCenterById)
router.get("/get-all-pathology", verifyAdminToken("superadmin"), indexController.adminPathologyController.getAllPathologyCenters)
router.put("/update-pathology", verifyAdminToken("superadmin"), indexController.adminPathologyController.updatePathologyCenter)
router.delete("/delete-pathology", verifyAdminToken("superadmin"), indexController.adminPathologyController.deletePathologyCenter)
router.get("/search-pathology", verifyAdminToken("superadmin"), indexController.adminPathologyController.searchPathology)
/** Super Admin Pharmacy Routes */

router.post("/create-pharmacy", verifyAdminToken("superadmin"), validate(createPharmacy), indexController.adminPharmacyController.createPharmacy)
router.get("/get-pharmacy-by-id", validateQuery(getAndDeletePharmacyById), verifyAdminToken("superadmin"), indexController.adminPharmacyController.getPharmacyById)
router.put("/update-pharmacy", validate(updatePharmacy), verifyAdminToken("pharmacy"), indexController.adminPharmacyController.updatePharmacy)
router.delete("/delete-pharmacy", validateQuery(getAndDeletePharmacyById), verifyAdminToken("superadmin"), indexController.adminPharmacyController.deletePharmacy)
router.get("/get-all-pharmacy", validateQuery(getAllPharmacy), verifyAdminToken("superadmin"), indexController.adminPharmacyController.getAllPharmacy);
router.get("/search-pharmacy", verifyAdminToken("superadmin"), indexController.adminPharmacyController.searchPharmacy);
router.post('/upload-pharmacy-licence', uploadLicenceImagePharmacy, verifyAdminToken("superadmin"), indexController.adminPharmacyController.uploadPharmacyDocument);

/** Super Admin Delivery Partner Routes */

router.put('/approve-delivery-partner', verifyAdminToken('superadmin'), indexController.adminDeliveryPartnerController.approveDeliveryPartner)
router.get('/get-all-delivery-partner', verifyAdminToken('superadmin'), indexController.adminDeliveryPartnerController.getAllDeliveryPartners);
router.get('/get-delivery-partner-by-id', verifyAdminToken('superadmin'), indexController.adminDeliveryPartnerController.getDeliveryPartnerById);
router.put('/update-delivery-partner', verifyAdminToken('superadmin'), indexController.adminDeliveryPartnerController.updateDeliveryPartner)
router.put('/update-availability-status', verifyAdminToken('superadmin'), indexController.adminDeliveryPartnerController.updateAvailabilityStatus);
router.delete('/delete-delivery-patner', verifyAdminToken('superadmin'), indexController.adminDeliveryPartnerController.deleteDeliveryPartner)
router.put('/block-delivery-partner', verifyAdminToken('superadmin'), indexController.adminDeliveryPartnerController.blockDeliveryPartner)
router.put('/unblock-delivery-partner', verifyAdminToken('superadmin'), indexController.adminDeliveryPartnerController.unblockDeliveryPartner)
router.put('/change-delivery-partner-status', verifyAdminToken('superadmin'), indexController.adminDeliveryPartnerController.changeStatusOfDeliveryPartner)


/** Medicines Routes Superadmin */
router.post('/create-medicine', verifyAdminToken('superadmin'), indexController.medicineController.createMedicine)
router.put('/update-medicine', verifyAdminToken('superadmin'), indexController.medicineController.updateMedicine)
router.get('/get-all-medicines', verifyAdminToken('superadmin'), indexController.medicineController.getAllMedicines)
router.get('/get-medicine-by-id', verifyAdminToken('superadmin'), indexController.medicineController.getMedicineById)
router.get('/search-medicine', verifyAdminToken('superadmin'), indexController.medicineController.searchMedicine)

//customer routes
router.get('/get-all-customer', verifyAdminToken('superadmin'), indexController.adminCustomerController.getAllCustomers);
router.get('/get-customer-by-id', verifyAdminToken('superadmin'), indexController.adminCustomerController.getCustomerById);
router.put('/block-unblock-customer', verifyAdminToken('superadmin'), indexController.adminCustomerController.BlockUnblockCustomer);

module.exports = router;
