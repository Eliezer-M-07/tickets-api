import * as ticketRepository from '../repositories/ticket.repository.js';

async function getTickets() {
    return ticketRepository.findAll();
};

async function getTicketByID(id) {
    const idNumber = Number(id);

    if(!Number.isInteger(idNumber) || idNumber <= 0){
        throw new Error('ID inválido.');
    }

    const ticket = await ticketRepository.findById(idNumber);

    if(!ticket){
        throw new Error('Ticket não encontrado.');
    }

    return ticket;
};

async function createTicket(title, description, status, priority, responsible) {

    if (title === undefined || description === undefined || status === undefined || priority === undefined || responsible === undefined) {
        throw new Error("Todos os campos são obrigatórios");
    }

    if(typeof(title) !== "string" || typeof(description) !== "string" || typeof(status) !== "string" || typeof(priority) !== "string" || typeof(responsible) !== "string"){
        throw new Error('Todos os campos devem ser um texto.');
    }
    
    title = title.trim();
    description = description.trim();
    status = status.trim();
    priority = priority.trim();
    responsible = responsible.trim();
    
    if(!title || !description || !status || !priority || !responsible){
        throw new Error('Todos os campos são obrigatórios.');
    }
    
    if(status !== "ABERTO" && status !== "EM_ANDAMENTO" && status !== "FINALIZADO"){
        throw new Error("Status informado é inválido.");
    }

    if(priority !== "BAIXA" && priority !== "MEDIA" && priority !== "ALTA"){
        throw new Error("Prioridade informada é inválida.");
    }

    return ticketRepository.create(title, description, status, priority, responsible);
}

async function updateTicket(title, description, status, priority, responsible, id) {
    const idNumber = Number(id);

    if(!Number.isInteger(idNumber) || idNumber <= 0){
        throw new Error("ID inválido.");
    }

    const ticket = await ticketRepository.findById(idNumber);

    if(!ticket){
        throw new Error("Ticket não encontrado.");
    }

    if (title === undefined || description === undefined || status === undefined || priority === undefined || responsible === undefined) {
        throw new Error("Todos os campos são obrigatórios");
    }

    if(typeof(title) !== "string" || typeof(description) !== "string" || typeof(status) !== "string" || typeof(priority) !== "string" || typeof(responsible) !== "string"){
        throw new Error('Todos os campos devem ser um texto.');
    }

    title = title.trim();
    description = description.trim();
    status = status.trim();
    priority = priority.trim();
    responsible = responsible.trim();

    if(!title || !description || !status || !priority || !responsible){
        throw new Error('Todos os campos são obrigatórios.');
    }

    if(status !== "ABERTO" && status !== "EM_ANDAMENTO" && status !== "FINALIZADO"){
        throw new Error("Status informado é inválido.");
    }

    if(priority !== "BAIXA" && priority !== "MEDIA" && priority !== "ALTA"){
        throw new Error("Prioridade informada é inválida.");
    }
    
    return ticketRepository.update(title, description, status, priority, responsible, idNumber);
}

async function patchTicket(id, data) {
    const idNumber = Number(id);

    if(!Number.isInteger(idNumber) || idNumber <= 0){
        throw new Error("ID inválido.");
    }

    const ticket = await ticketRepository.findById(idNumber);

    if(!ticket){
        throw new Error("Ticket não encontrado.");
    }

    const allowedFields = [
        'title',
        'description',
        'status',
        'priority',
        'responsible'   
    ];

    if (Object.keys(data).length === 0) {
        throw new Error("Nenhum campo informado.")
    }

    for(const field of Object.keys(data)){
        if(!allowedFields.includes(field)){
            throw new Error(`Campo ${field} não pode ser alterado.`);
        }
    }

    for (const [field, value] of Object.entries(data)) {
        if(value === undefined){
            throw new Error(`Campo ${field} não pode ser vazio.`);
        }

        if(typeof value !== "string"){
            throw new Error(`Campo ${field} deve ser um texto.`);
        }

        data[field] = value.trim();

        if(!data[field]){
            throw new Error(`Campo ${field} não pode estar vazio.`)
        }
    }

    if(data.status){
        if(data.status !== "ABERTO" && data.status !== "EM_ANDAMENTO" && data.status !== "FINALIZADO"){
            throw new Error("Status informado é inválido.");
        }
    }

    if(data.priority){
        if(data.priority !== "BAIXA" && data.priority !== "MEDIA" && data.priority !== "ALTA"){
            throw new Error("Prioridade informada é inválida.");
        }
    }

    return ticketRepository.patch(data, idNumber)
}

async function removeTicket(id) {
    const idNumber = Number(id);

    if(!Number.isInteger(idNumber) || idNumber <= 0){
        throw new Error("ID inválido.");
    }

    const ticket = await ticketRepository.remove(idNumber);

    if(!ticket){
        throw new Error("Ticket não encontrado.");
    }

    return ticket;
}

export {
    getTickets,
    getTicketByID,
    createTicket,
    updateTicket,
    patchTicket,
    removeTicket,
}