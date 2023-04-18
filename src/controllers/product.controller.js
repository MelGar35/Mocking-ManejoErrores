import productValidator from "../validators/product.validator.js"

class productController {

  async getProducts(req, res) {

    let limit = parseInt(req.query.limit)
    let query = req.query.query || null
    let sort = parseInt(req.query.sort)
    let page = parseInt(req.query.page)

    try {
      const products = await productValidator.getProducts(limit, JSON.parse(query), sort, page)
      req.logger.debug(products.docs)
      res.render("products", {products})
      //res.json(products)postman
    } catch (error) {
      req.logger.error(`Ha ocurrido un error ${error.message}`)
      res.json(error)
    }
  }

  async getMockingProducts(req, res) {
    const products = await productValidator.getMockingProducts()
    try {
      res.render('mockingProducts', { products })
    } catch (error) {
      req.logger.error("Could not get mocked products")
      res.json(error)
    }
  }
  
  async getProductById(req, res) {
    console.log(req.params.pid)
    const products = await productValidator.getProductById(req.params.pid)
    try {
      res.json(products)
    } catch (error) {
      res.json(error)
    }
  }

  async createProduct(req, res) {
    const { title, description, category, price, thumbnail, code, stock } = req.body;
    try {
      const addedProduct = await productValidator.createProduct(title, description, category, price, thumbnail, code, stock)
      res.status(201).json({ info: 'Producto Agregado', addedProduct })
    } catch (error) {
      req.logger.error(error)
      res.status(400).json({ info: `Ha ocurrido un error: ${error}` })
    }


  }

  async editProduct(req, res) {
    const pid = (req.params.pid)
    let updatedProduct = req.body
    try {
      await productValidator.editProduct(pid, updatedProduct)
      res.send({ status: 200, payload: updatedProduct })
    } catch (error) {
      req.logger.error("Error editando producto: ", error.message)
      res.json({ error: error.message})
    } 
  }

  async deleteProduct(req, res) {
    let pid = (req.params.pid)
    try {
      await productValidator.deleteProduct(pid)
      res.json({ status: 200, message: 'Producto eliminado' })
    } catch (error) {
      req.logger.error("Error eliminando producto: ", error.message)
      res.json({ error })
    }

  }

}

export default new productController()