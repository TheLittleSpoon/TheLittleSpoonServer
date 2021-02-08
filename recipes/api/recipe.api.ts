async function saveRecipe(request, response) {
  try {
    var recipe = new Recipe(request.body);
    var result = await recipe.save();
    response.send(result);
    console.log(result);
  } catch (error) {
    response.status(500).send(error);
  }
}
