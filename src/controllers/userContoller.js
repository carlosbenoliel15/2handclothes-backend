const User = require('../models/UserSchema');
const Product = require('../models/ProductsShema')
const SoldProduct = require('../models/ProdutosVendidos')

const userController = {};

userController.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

userController.updateUser = async (req, res) => {
  try {
    const {
      nome,
      dataNascimento,
      genero,
      morada,
      localidade,
      codigoPostal,
      telefone,
      email,
      password,
      categorias,
      marca,
      tamanho,
    } = req.body;

    const preferencias = {
      categorias,
      marca,
      tamanho,
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        nome,
        dataNascimento,
        genero,
        morada,
        localidade,
        codigoPostal,
        telefone,
        email,
        password,
        preferencias
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

userController.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


userController.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

userController.searchUsers = async (req, res, next) => {
  const { name, email, city, zipCode, gender, ageMin, ageMax } = req.query;
  let filters = {};
  if (name) filters['name'] = { $regex: name, $options: 'i' };
  if (email) filters['email'] = { $regex: email, $options: 'i' };
  if (city) filters['city'] = { $regex: city, $options: 'i' };
  if (zipCode) filters['zipCode'] = { $regex: zipCode, $options: 'i' };
  if (gender) filters['gender'] = gender;
  if (ageMin || ageMax) {
    filters['dateOfBirth'] = {};
    if (ageMin) filters['dateOfBirth']['$lte'] = new Date(new Date() - (ageMin * 365 * 24 * 60 * 60 * 1000));
    if (ageMax) filters['dateOfBirth']['$gte'] = new Date(new Date() - (ageMax * 365 * 24 * 60 * 60 * 1000));
  }
  try {
    const users = await User.find(filters);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

userController.addFavoriteProduct = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (user.favoritos.includes(product._id)) {
      return res.status(400).json({ success: false, message: 'Product already in favorites' });
    }

    user.favoritos.push(product._id);
    await user.save();

    res.status(200).json({ success: true, message: 'Product added to favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



userController.addProductToCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (user.carrinho.includes(product._id)) {
      return res.status(400).json({ success: false, message: 'Product already in cart' });
    }

    if(product.seller===req.params.userId){
      return res.status(400).json({ success: false, message: 'Impossible to add own product to Ca rt' });
    }

    user.carrinho.push(product._id);
    await user.save();

    res.status(200).json({ success: true, message: 'Product added to cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


userController.removeFavoriteProduct = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    user.favoritos.pull(product);
    await user.save();

    res.status(200).json({ success: true, message: 'Product removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

userController.getFavoriteProducts = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('favoritos');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, favorites: user.favoritos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

userController.getAllProductsFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('carrinho');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, carrinho: user.carrinho });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


userController.removeProductFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    user.carrinho.pull(product);
    await user.save();

    res.status(200).json({ success: true, message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


userController.buyProduct = async (req, res) => {
  try {
    const { productId, buyerId, soldPrice } = req.body;

    const product = await Product.findById(productId);
    const buyer = await User.findById(buyerId)
    const soldProductExists = await SoldProduct.findOne({ previousId: productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    } else if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    } else if (soldProductExists) {
      return res.status(400).json({ message: 'Product already sold' });
    } else {
      // Cria um novo documento de venda de produto
      const soldProduct = new SoldProduct({
        previousId: productId,
        title: product.title,
        description: product.description,
        categories: product.categories,
        brand: product.brand,
        type: product.type,
        size: product.size,
        condition: product.condition,
        price: product.price,
        images: product.images,
        seller: product.seller,
        buyer: buyerId,
        soldPrice: soldPrice,
        soldDate: new Date()
      });

      // Salva o documento de venda de produto
      await soldProduct.save();

      //verificar se ao remover dos produtos não lixa a cena dos favoritos;
      //colocar uma condição  que vê se o produto  pertence a lista  de favoritos caso exista deve remover
      if(buyer.favoritos.includes(product._id)){
        buyer.favoritos.pull(product._id)
        console.log("produto removido dos favoritos")
      }

      // Remove o produto da coleção "products"
      await Product.deleteOne({ _id: productId });
      console.log("Product vendido com sucesso");
      res.status(200).json({ message: 'Product Sell Done' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error' });
  }
};





module.exports = userController;
