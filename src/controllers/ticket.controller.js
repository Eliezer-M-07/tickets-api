import * as ticketService from '../services/ticket.service.js';

async function getTickets(req, res) {
    try {
        const tickets = await ticketService.getTickets();
        return res.json(tickets);

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

async function getTicketByID(req, res) {
    try {
        const { id } = req.params;
        const ticket = await ticketService.getTicketByID(id);
        
        return res.json(ticket);

    } catch (error) {
        return res.status(404).json({
            error: error.message
        });
    }
}

async function createTicket(req, res) {
    try {
        const { title, description, status, priority, responsible } = req.body;
        const ticket = await ticketService.createTicket(title, description, status, priority, responsible);

        return res.status(201).json({
            message: 'Ticket criado com sucesso.',
            ticket
        });

    } catch (error) {
        return res.status(400).json({
            error: error.message
        }); 
    }
}

async function updateTicket(req, res) {
    try {
        const { id } = req.params;
        const { title, description, status, priority, responsible } = req.body;
        const ticket = await ticketService.updateTicket(title, description, status, priority, responsible, id);

        return res.json({
            message: "Ticket Editado com sucesso.",
            ticket
        });

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

async function patchTicket(req, res) {
    try {
        const { id } = req.params;
    
        const ticket = await ticketService.patchTicket(id, req.body);

        res.json({
            message: 'Ticket atualizado com sucesso.',
            ticket
        });

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

async function removeTicket(req, res) {
    try {
        const { id } = req.params;

        const ticket = await ticketService.removeTicket(id);

        return res.json({
            message: 'Ticket excluido com sucesso.',
            ticket
        });

    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}

export {
    getTickets,
    getTicketByID,
    createTicket,
    updateTicket,
    patchTicket,
    removeTicket,
}