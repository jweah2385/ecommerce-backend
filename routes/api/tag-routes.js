const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const allTags = await Tag.findAll({
      include: [{model: Product}]
    });
    res.status(200).json(allTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const oneTag = await Tag.findByPk(req.params.id, {
      include: [{model: Product}]
    });
    if (!oneTag) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    } 
    res.status(200).json(oneTag);
    }
catch (err) {
  res.status(500).json(err);
}});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create({
        tag_name: req.body.tag_name,
      });
      res.status(200).json(newTag);
    } catch (err) {
      res.status(400).json(err);
    }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updateTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!updateTag[0]) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(updateTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  deleteTagAndAssociations(req.params.id);
  try {
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deletedTag) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(deletedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Function to delete a tag and its associations
const deleteTagAndAssociations = async (tagId) => {
  try {
    
    await ProductTag.destroy({ where: { tag_id: tagId } });

   
    const tag = await Tag.findByPk(tagId);

    if (tag) {

      const associatedProducts = await tag.getProducts();

      if (associatedProducts.length === 0) {
        await tag.destroy();
      }
    }

    console.log('Tag and associated associations deleted successfully.');
  } catch (error) {
    console.error('Error deleting tag and associations:', error);
  }
};




module.exports = router;
