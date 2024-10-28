const { db } = require("../index");

const count = async () => {
    const consulta = "SELECT COUNT(*) FROM productos";
    const result = await db.query(consulta);
    return parseInt(result.rows[0].count);
};

const list = async (limit = 20, offset = 0) => {
    const consulta = `
        SELECT DISTINCT * FROM productos 
        ORDER BY nombre ASC 
        LIMIT $1 
        OFFSET $2
    `;
    const result = await db.query(consulta, [limit, offset]);
    return result.rows;
};

const listCategories = async () => {
    const consulta = "SELECT DISTINCT categoria FROM productos ORDER BY categoria ASC";
    const result = await db.query(consulta);
    return { categorias: result.rows.map((row) => row.categoria) };
};

const listByCategory = async (categoria, limit, offset) => {
    const consulta = `
        SELECT DISTINCT * FROM productos 
        WHERE categoria = $1 
        ORDER BY nombre ASC 
        LIMIT $2 
        OFFSET $3
    `;
    const result = await db.query(consulta, [categoria, limit, offset]);
    return result.rows;
};

const searchProducts = async (query, limit, offset) => {
    const consulta = `
        SELECT DISTINCT * FROM productos 
        WHERE nombre ILIKE $1 
        ORDER BY nombre ASC 
        LIMIT $2 
        OFFSET $3
    `;
    const result = await db.query(consulta, [`%${query}%`, limit, offset]);
    return result.rows;
};

const getSuggestions = async (query, limit = 5) => {
    return searchProducts(query, limit, 0);
};

const countByCategory = async (categoria) => {
    const consulta = "SELECT COUNT(*) FROM productos WHERE categoria = $1";
    const result = await db.query(consulta, [categoria]);
    return parseInt(result.rows[0].count);
};

const countSearchResults = async (query) => {
    const consulta = "SELECT COUNT(*) FROM productos WHERE nombre ILIKE $1";
    const result = await db.query(consulta, [`%${query}%`]);
    return parseInt(result.rows[0].count);
};

module.exports = {
    list,
    count,
    listByCategory,
    listCategories,
    searchProducts,
    getSuggestions,
    countByCategory,
    countSearchResults
};
