async function saveRecipe(request, response) {
  try {
    var recipe = new Recipe(request.body);
    var result = await recipe.save();
    console.log(result);
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
}
