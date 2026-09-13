import { Router } from 'express';
import * as ticketController from '../controllers/ticket.controller.js';

const router = Router();

router.get('/', ticketController.getTickets);

router.get('/:id', ticketController.getTicketByID);

router.post('/', ticketController.createTicket);

router.put('/:id', ticketController.updateTicket);

router.patch('/:id', ticketController.patchTicket);

router.delete('/:id', ticketController.removeTicket);

export default router;