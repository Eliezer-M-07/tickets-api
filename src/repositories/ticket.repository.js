import pool from '../config/database.js';

async function findAll() {
    const result = await pool.query(
        'SELECT * FROM TB_TICKETS ORDER BY ID_TICKET'
    );
    
    return result.rows;
};

async function findById(id) {
    const result = await pool.query(
        'SELECT * FROM TB_TICKETS WHERE ID_TICKET = $1', 
        [id]
    );
    
    return result.rows[0];
};

async function create(title, description, status, priority, responsible) {
    const result = await pool.query(
        `INSERT INTO TB_TICKETS(NM_TITLE, DS_TICKET, ST_TICKET, ST_PRIORITY, NM_RESPONSIBLE)
        VALUES($1, $2, $3, $4, $5) 
        RETURNING *`,
        [title, description, status, priority, responsible]
    );

    return result.rows[0];
};

async function update(title, description, status, priority, responsible, id) {
    const result = await pool.query(
        `UPDATE TB_TICKETS 
        SET NM_TITLE = $1,
            DS_TICKET = $2, 
            ST_TICKET = $3, 
            ST_PRIORITY = $4,
            NM_RESPONSIBLE = $5 
        WHERE ID_TICKET = $6
        RETURNING *`,
        [title, description, status, priority, responsible, id]
    );
    
    return result.rows[0];
};  

async function patch(data, id) {
    const fieldMap = {
        title: 'NM_TITLE',
        description: 'DS_TICKET',
        status: 'ST_TICKET',
        priority: 'ST_PRIORITY',
        responsible: 'NM_RESPONSIBLE'
    }

    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(data)) {
        fields.push(`${fieldMap[key]} = $${values.length + 1}`);
        values.push(value);
    }

    values.push(id);
    
    const result = await pool.query(
        `UPDATE TB_TICKETS
        SET ${fields.join(', ')}
        WHERE ID_TICKET = $${values.length}
        RETURNING *`,
        values
    );

    return result.rows[0];
}

async function remove(id) {
    const result = await pool.query(
        `DELETE FROM TB_TICKETS 
        WHERE ID_TICKET = $1
        RETURNING *`,
        [id]
    )

    return result.rows[0];
}

export {
    findAll,
    findById,
    create,
    update,
    patch,
    remove,
}