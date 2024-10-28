const { app } = require("../index");
const { products } = require("../repositories");
const verifyToken = require("../middlewares/verifyToken");

// Función helper para estandarizar la respuesta
const standardResponse = (productos, currentPage, total, limit) => ({
    productos,
    currentPage: parseInt(currentPage),
    totalPages: Math.max(1, Math.ceil(total / limit)),
    total,
    limit: parseInt(limit)
});

app.get("/categorias", async (req, res) => {
    const categorias = await products.listCategories();
    res.json(categorias);
});

app.get("/productos/categoria/:categoria", async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;
    const { categoria } = req.params;
    
    try {
        const [productos, total] = await Promise.all([
            products.listByCategory(categoria, limit, offset),
            products.countByCategory(categoria)
        ]);
        
        res.json(standardResponse(productos, page, total, limit));
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error al obtener productos por categoria" 
        });
    }
});

app.get("/productos", verifyToken, async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;
    
    try {
        const [productos, total] = await Promise.all([
            products.list(limit, offset),
            products.count()
        ]);
        
        res.status(200).json(standardResponse(productos, page, total, limit));
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener productos"
        });
    }
});

app.get("/productos/buscar", async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;
    const { q } = req.query;
    
    try {
        const [productos, total] = await Promise.all([
            products.searchProducts(q, limit, offset),
            products.countSearchResults(q)
        ]);
        
        res.json({
            productos,
            currentPage: page,
            totalPages: Math.max(1, Math.ceil(total / limit)),
            total,
            limit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al buscar productos"
        });
    }
});

app.get("/productos/sugerencias", async (req, res) => {
    const { q } = req.query;
    try {
        const productos = await products.getSuggestions(q);
        res.json({
            productos,
            total: productos.length
        });
    } catch (error) {
        console.error("Error al obtener sugerencias:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener sugerencias"
        });
    }
});
