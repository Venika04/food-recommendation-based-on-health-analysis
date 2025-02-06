document.addEventListener('DOMContentLoaded', () => {
    const recipeList = document.getElementById('recipe-list');
  
    // Fetch recipes from the backend
    fetch('http://localhost:3000/api/recipes')
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          recipeList.innerHTML = '<li>No recipes found.</li>';
          return;
        }
  
        data.forEach((recipe) => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <h2>${recipe.recipe_name}</h2>
            <p><strong>Type:</strong> ${recipe.recipe_type || 'Not specified'}</p>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Steps:</strong> ${recipe.preparation_steps}</p>
          `;
          recipeList.appendChild(listItem);
        });
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
        recipeList.innerHTML = '<li>Error loading recipes.</li>';
      });
  });