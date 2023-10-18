const productsService = require('../service/productsService')
const ProductsDto =require('../dao/dto/productsDto')


class productsController {
	constructor(){
		this.service = new productsService()
	}

	async getProducts(req,res){
		const filters = {}
		const { page = 1, limit = 10, sort, category, availability } = req.query
		const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
		const availabilityOption = availability === 'available' ? true : availability === 'notavailable' ? false : undefined;
		const query = {
			page: parseInt(page),
			limit: parseInt(limit),
			sort: sortOption
		}
	
		try {
	
			if (category) {
				filters.category = category
			}
	
			if (availability) {
				filters.status = availabilityOption;
			}
	
			const products = await this.service.getProducts(filters, query)
	
			const generatePageLink = (page) => {
				const newQuery = { ...req.query, ...filters, page: page };
				return '/api/products?' + new URLSearchParams(newQuery).toString();
			};

			const result = new ProductsDto(products)
	
			return res.status(200).json({ status: 'success', result,generatePageLink})
	
		} catch (error) {
			req.logger.error('Error al obtener los productos')
			return res.status(500).json({ status: 'error', error: 'Error al obtener los productos'})
		}
	}


	async getProductById(req,res){
		const {pid} = req.params
		try {
			const product = await this.service.getProductById(pid)
			return res.status(200).json({ status: 'success', payload: product })
		} catch (error) {
			req.logger.error('Error al obtener el producto')
			if (error.message === 'Producto no encontrado') {
				return res.status(404).json({ status: 'error',  message: error.message })
			}
			return res.status(500).json({ status: 'error', message: 'Error al obtener el producto' });
		}
	}

	
	async addProduct(req,res){
		const newProduct = req.body;
		 try {
			(req.files && Array.isArray(req.files))
			? (newProduct.thumbnails = req.files.map((file) => file.path))
			: (newProduct.thumbnails = []);

			await this.service.addProduct(newProduct);
       		 return res.status(201).json({ status: 'success', message: 'Producto agregado exitosamente' });
		} catch (error) {
			req.logger.error('Error al agregar el producto')
			return res.status(500).json({ status: 'error', error: 'Error al agregar el producto' });
		}
	}


	async updateProduct(req,res){
		const {pid} = req.params
		const updatedProduct = req.body

		try {
			await this.service.updateProduct(pid, updatedProduct)
			return res.status(200).json({ status: 'success', message: 'Producto actualizado exitosamente' });
		} catch (error) {
			req.logger.error('Error al actualizar el producto')
			if (error.message === 'Producto no encontrado') {
				return res.status(404).json({ status: 'error',  message: error.message })
			}
			return res.status(500).json({ status: 'error',  message:'Error al actualizar el producto' });
		}
	}


	async deleteProduct(req,res){
		const {pid} = req.params
		try {
			await this.service.deleteProduct(pid)
			req.logger.info('Producto borrado exitosamente')
			return res.status(200).json({ status: 'success', message: 'Producto borrado exitosamente' });
		} catch (error) {
			req.logger.error('Error al borrar el producto')
			if (error.message === 'Producto no encontrado') {
				return res.status(404).json({ status: 'error', message: error.message })
			}
			return res.status(500).json({ status: 'error',  message: 'Error al borrar el producto' });
		}
	}
}

module.exports = productsController