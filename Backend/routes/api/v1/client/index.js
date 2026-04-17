import { Router } from 'express';
import ClientController from '../../../../controllers/client/clientController.js';
import isUser from '../../../../middlewares/isUser.js';
import checkRole from '../../../../middlewares/checkRole.js';

const router = Router();

// 1. Security check: Only logged-in people can use these links
router.use(isUser);

// 2. CREATE: Register a new client
// Only Admin or Booking Officer can add a new customer
router.post('/', checkRole('system_admin', 'booking_officer'), ClientController.create);

// 3. GET ALL: Show the list of all customers
router.get('/', ClientController.getAll);

// 4. GET BY ID: See full details of one specific customer
router.get('/:id', ClientController.getById);

// 5. UPDATE: Edit customer info (like changing their phone or address)
router.patch('/:id', checkRole('system_admin', 'booking_officer'), ClientController.update);

// 6. DELETE: Remove a customer (Soft Delete)
router.delete('/:id', checkRole('system_admin'), ClientController.delete);

// 7. RESTORE: Bring back a deleted customer record
router.post('/:id/restore', checkRole('system_admin'), ClientController.restore);

// 8. LEDGER: See the full money record (payments/dues) of this customer
router.get('/:id/ledger', ClientController.getLedger);

export default router;