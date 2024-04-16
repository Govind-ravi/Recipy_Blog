require('../models/database')
const Category = require('../models/Category')
const Recipe = require('../models/Recipe')





//Get hpmepage
exports.homepage = async (req, res) => {

    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        const thai = await Recipe.find({ "category": "Thai" }).limit(limitNumber);
        const mexican = await Recipe.find({ "category": "Mexican" }).limit(limitNumber);
        const indian = await Recipe.find({ "category": "Indian" }).limit(limitNumber);
        const american = await Recipe.find({ "category": "American" }).limit(limitNumber);
        const chinese = await Recipe.find({ "category": "Chinese" }).limit(limitNumber);
        const spanish = await Recipe.find({ "category": "Spanish" }).limit(limitNumber);

        const food = { latest, thai, mexican, indian, american, chinese, spanish }

        res.render('index', { title: 'Recipe Blog- Homepage', categories, food })
    } catch (error) {
        res.satus(500).send({ message: error.message || "Error Occoured" })
    }
}

exports.about = async (req, res) => {
    try {
        res.render('about')
    } catch (error) {
        
    }
}

exports.exploreCategories = async (req, res) => {

    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Recipe Blog- Categories', categories })
    } catch (error) {
        res.satus(500).send({ message: error.message || "Error Occoured" })
    }
}
exports.exploreRecipes = async (req, res) => {
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId)
        res.render('recipe', { title: 'Recipe Blog- Recipe', recipe })

    } catch (error) {

    }
}
exports.exploreCategoriesById = async (req, res) => {

    try {
        const categoryId = req.params.id;
        const categoriesById = await Recipe.find({ "category": categoryId });
        res.render('categories', { title: 'Recipe Blog- Categories', categoriesById, categoryId })
    } catch (error) {
        res.satus(500).send({ message: error.message || "Error Occoured" })
    }
}
exports.searchRecipe = async (req, res) => {

    try {

        let search = req.body.searchTerm;
        let recipe = await Recipe.find({ $text: { $search: search, $diacriticSensitive: true } })
        res.render('search', { title: 'Recipe Blog- Recipe', recipe })
    } catch (error) {
        res.satus(500).send({ message: error.message || "Error Occoured" })
    }
}
exports.exploreLatest = async (req, res) => {

    try {
        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        res.render('explore-latest', { title: 'Recipe Blog- Explore Latest', recipe })
    } catch (error) {
        res.satus(500).send({ message: error.message || "Error Occoured" })
    }
}
exports.exploreRandom = async (req, res) => {

    try {
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render('explore-random', { title: 'Recipe Blog- Explore Random', recipe })
    } catch (error) {
        res.satus(500).send({ message: error.message || "Error Occoured" })
    }
}

exports.submitRecipe = async (req, res) => {

    try {
        const infoErrorObj = req.flash('infoError');
        const infoSubmitObj = req.flash('infoSubmit');
        res.render('submit-recipe', { title: 'Recipe Blog- Submit Recipe', infoErrorObj, infoSubmitObj })
    } catch (error) {
        res.satus(500).send({ message: error.message || "Error Occoured" })
    }
}
exports.submitRecipeOnPost = async (req, res) => {

    try {
        let imageUploadFile;
        let uploadPath;
        let newImageName;
    
        if(!req.files || Object.keys(req.files).length === 0){
          console.log('No Files where uploaded.');
        } else {
    
          imageUploadFile = req.files.image;
          newImageName = Date.now() + imageUploadFile.name;
    
          uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
    
          imageUploadFile.mv(uploadPath, function(err){
            if(err) return res.satus(500).send(err);
          })
    
        }

        const newRecipe = Recipe({
            "name": req.body.name,
                "ingredients": req.body.ingredients,
                "discription": req.body.description,
                "image": newImageName,
                "category": req.body.category
        })
        await newRecipe.save()

        req.flash('infoSubmit', 'Recipe has been added, kindly check latest recipe')
        res.redirect('/submit-recipe')
    } catch (error) {
        req.flash('infoErrorObj', 'Sorry! Some fields are missing')
        res.redirect('/submit-recipe')
    }

    

}



// async function insertDummyRecipeData() {
//     try {
//         await Recipe.insertMany([
//             {
//                 "name": "BBQ Pulled Pork Sandwiches",
//                 "ingredients": [
//                     "Pork shoulder or pork butt",
//                     "BBQ sauce",
//                     "Hamburger buns",
//                     "Coleslaw (optional)"
//                 ],
//                 "discription": [
//                     "Rub the pork shoulder or pork butt with your favorite dry rub or seasonings.",
//                     "Place the seasoned pork in a slow cooker or smoker and cook on low for 8-10 hours, or until the meat is tender and easily falls apart.",
//                     "Shred the cooked pork using two forks and mix it with your favorite BBQ sauce.",
//                     "Toast the hamburger buns, then fill them with the BBQ pulled pork.",
//                     "Optionally, top the pulled pork with coleslaw for extra flavor and crunch. Serve hot and enjoy!"
//                 ],
//                 "image": "",
//                 "category": "American"
//             },
//             {
//                 "name": "Macaroni and Cheese",
//                 "ingredients": [
//                     "Elbow macaroni",
//                     "Cheddar cheese",
//                     "Milk",
//                     "Butter",
//                     "Flour",
//                     "Salt",
//                     "Pepper"
//                 ],
//                 "discription": [
//                     "Cook the elbow macaroni according to the package instructions until al dente. Drain and set aside.",
//                     "In a saucepan, melt butter over medium heat. Stir in flour to make a roux, then gradually whisk in milk until smooth.",
//                     "Cook the milk mixture, stirring constantly, until it thickens and bubbles.",
//                     "Reduce heat to low and add shredded cheddar cheese, stirring until melted and smooth.",
//                     "Season the cheese sauce with salt and pepper to taste.",
//                     "Combine the cooked macaroni with the cheese sauce and mix well.",
//                     "Transfer the macaroni and cheese to a baking dish, sprinkle extra cheese on top if desired, and bake at 350°F (175°C) for 20-25 minutes, or until bubbly and golden brown on top."
//                 ],
//                 "image": "",
//                 "category": "American"
//             },
//             {
//                 "name": "Classic Cheeseburger",
//                 "ingredients": [
//                     "Ground beef",
//                     "Hamburger buns",
//                     "Cheddar cheese slices",
//                     "Lettuce",
//                     "Tomato slices",
//                     "Onion slices",
//                     "Pickles",
//                     "Ketchup",
//                     "Mustard",
//                     "Salt",
//                     "Pepper"
//                 ],
//                 "discription": [
//                     "Divide the ground beef into equal-sized portions and shape them into patties. Season the patties with salt and pepper.",
//                     "Preheat a grill or skillet over medium-high heat. Cook the burger patties for about 4-5 minutes on each side, or until desired doneness.",
//                     "In the last minute of cooking, top each burger patty with a slice of cheddar cheese and let it melt.",
//                     "Toast the hamburger buns on the grill or skillet until lightly browned.",
//                     "Assemble the burgers by placing lettuce, tomato slices, onion slices, and pickles on the bottom half of each bun.",
//                     "Add the cooked cheeseburger patties on top, then drizzle with ketchup and mustard.",
//                     "Top with the other half of the bun and serve immediately. Enjoy your classic cheeseburger!"
//                 ],
//                 "image": "",
//                 "category": "American"
//             },
//             {
//                 "name": "Kung Pao Chicken",
//                 "ingredients": [
//                     "Chicken breast or thigh, diced",
//                     "Cornstarch",
//                     "Vegetable oil",
//                     "Garlic cloves, minced",
//                     "Ginger, minced",
//                     "Dried red chilies",
//                     "Roasted peanuts",
//                     "Scallions, sliced",
//                     "Soy sauce",
//                     "Rice vinegar",
//                     "Sesame oil",
//                     "Sugar",
//                     "Salt",
//                     "Water",
//                     "Cornstarch slurry (optional)"
//                 ],
//                 "discription": [
//                     "Marinate diced chicken with cornstarch, soy sauce, rice vinegar, sesame oil, sugar, and salt for 15-20 minutes.",
//                     "Heat vegetable oil in a wok or skillet over high heat. Add marinated chicken and stir-fry until cooked through. Remove and set aside.",
//                     "In the same wok or skillet, add more oil if needed. Stir-fry minced garlic, minced ginger, and dried red chilies until fragrant.",
//                     "Add roasted peanuts and sliced scallions, continue to stir-fry for another minute.",
//                     "Return the cooked chicken to the wok or skillet. Mix well with the other ingredients.",
//                     "If desired, add cornstarch slurry to thicken the sauce.",
//                     "Serve hot with steamed rice. Enjoy your Kung Pao Chicken!"
//                 ],
//                 "image": "",
//                 "category": "Chinese"
//             },
//             {
//                 "name": "Beef with Broccoli",
//                 "ingredients": [
//                     "Beef (flank steak or sirloin), thinly sliced",
//                     "Broccoli florets",
//                     "Soy sauce",
//                     "Oyster sauce",
//                     "Cornstarch",
//                     "Garlic cloves, minced",
//                     "Ginger, minced",
//                     "Vegetable oil",
//                     "Salt",
//                     "Sugar",
//                     "Water",
//                     "Sesame oil"
//                 ],
//                 "discription": [
//                     "Marinate thinly sliced beef with soy sauce, oyster sauce, cornstarch, salt, and sugar for 20-30 minutes.",
//                     "Blanch broccoli florets in boiling water for 1-2 minutes, then drain and set aside.",
//                     "Heat vegetable oil in a wok or skillet over high heat. Stir-fry minced garlic and minced ginger until fragrant.",
//                     "Add marinated beef to the wok or skillet. Stir-fry until the beef is cooked to your desired level of doneness.",
//                     "Add blanched broccoli florets and a splash of water. Stir-fry until the broccoli is tender-crisp.",
//                     "Season with sesame oil and additional soy sauce if needed.",
//                     "Serve hot with steamed rice. Enjoy your Beef with Broccoli!"
//                 ],
//                 "image": "",
//                 "category": "Chinese"
//             },
//             {
//                 "name": "Mapo Tofu",
//                 "ingredients": [
//                     "Firm tofu, diced",
//                     "Ground pork",
//                     "Soy sauce",
//                     "Sichuan peppercorns",
//                     "Chili bean paste",
//                     "Doubanjiang (fermented broad bean paste)",
//                     "Garlic cloves, minced",
//                     "Ginger, minced",
//                     "Scallions, sliced",
//                     "Vegetable oil",
//                     "Cornstarch",
//                     "Water",
//                     "Salt",
//                     "Sugar"
//                 ],
//                 "discription": [
//                     "Marinate diced tofu with soy sauce and cornstarch for 15-20 minutes.",
//                     "Heat vegetable oil in a wok or skillet over medium heat. Add ground pork and stir-fry until browned.",
//                     "Add minced garlic, minced ginger, and sliced scallions. Stir-fry until fragrant.",
//                     "Add Sichuan peppercorns, chili bean paste, and Doubanjiang. Stir-fry for another minute.",
//                     "Add marinated tofu to the wok or skillet. Gently stir to combine with the other ingredients.",
//                     "Pour in water and let it simmer until the sauce thickens slightly.",
//                     "Season with salt and sugar to taste.",
//                     "Serve hot with steamed rice. Enjoy your Mapo Tofu!"
//                 ],
//                 "image": "",
//                 "category": "Chinese"
//             },
//             {
//                 "name": "Tacos al Pastor",
//                 "ingredients": [
//                     "Pork shoulder, thinly sliced",
//                     "Corn tortillas",
//                     "Pineapple, sliced",
//                     "White onion, finely chopped",
//                     "Cilantro, chopped",
//                     "Lime wedges",
//                     "Achiote paste",
//                     "Chipotle peppers in adobo sauce",
//                     "Garlic cloves",
//                     "Apple cider vinegar",
//                     "Orange juice",
//                     "Cumin",
//                     "Oregano",
//                     "Salt",
//                     "Vegetable oil"
//                 ],
//                 "discription": [
//                     "Blend achiote paste, chipotle peppers, garlic, apple cider vinegar, orange juice, cumin, oregano, and salt to make the marinade.",
//                     "Marinate thinly sliced pork shoulder in the marinade for at least 2 hours, or preferably overnight.",
//                     "Heat vegetable oil in a skillet over medium-high heat. Cook the marinated pork until browned and cooked through.",
//                     "Warm corn tortillas on a hot griddle or skillet.",
//                     "Assemble tacos by filling each tortilla with cooked pork, sliced pineapple, chopped onion, and cilantro.",
//                     "Serve with lime wedges on the side. Enjoy your Tacos al Pastor!"
//                 ],
//                 "image": "",
//                 "category": "Mexican"
//             },
//             {
//                 "name": "Chicken Enchiladas",
//                 "ingredients": [
//                     "Cooked chicken, shredded",
//                     "Corn tortillas",
//                     "Enchilada sauce",
//                     "Cheddar cheese, shredded",
//                     "White onion, finely chopped",
//                     "Cilantro, chopped",
//                     "Sour cream (optional)",
//                     "Avocado slices (optional)",
//                     "Vegetable oil"
//                 ],
//                 "discription": [
//                     "Preheat oven to 375°F (190°C).",
//                     "In a skillet, heat vegetable oil over medium heat. Dip each corn tortilla in enchilada sauce to soften, then fill with shredded chicken, chopped onion, and a sprinkle of shredded cheddar cheese.",
//                     "Roll up the filled tortillas and place them seam-side down in a baking dish.",
//                     "Pour remaining enchilada sauce over the filled tortillas, then sprinkle with more shredded cheddar cheese.",
//                     "Bake in the preheated oven for about 20 minutes, or until the cheese is melted and bubbly.",
//                     "Garnish with chopped cilantro and serve with sour cream and avocado slices if desired. Enjoy your Chicken Enchiladas!"
//                 ],
//                 "image": "",
//                 "category": "Mexican"
//             },
//             {
//                 "name": "Guacamole",
//                 "ingredients": [
//                     "Ripe avocados",
//                     "Tomatoes, diced",
//                     "Red onion, finely chopped",
//                     "Fresh cilantro, chopped",
//                     "Jalapeño pepper, seeded and minced",
//                     "Lime juice",
//                     "Salt",
//                     "Tortilla chips, for serving"
//                 ],
//                 "discription": [
//                     "Cut avocados in half, remove the pits, and scoop the flesh into a bowl.",
//                     "Mash the avocados with a fork until smooth or leave it slightly chunky if desired.",
//                     "Stir in diced tomatoes, finely chopped red onion, minced jalapeño pepper, chopped cilantro, and lime juice.",
//                     "Season with salt to taste and mix well to combine all ingredients.",
//                     "Serve the guacamole immediately with tortilla chips. Enjoy!"
//                 ],
//                 "image": "",
//                 "category": "Mexican"
//             },
//             {
//                 "name": "Butter Chicken (Murgh Makhani)",
//                 "ingredients": [
//                     "Chicken thighs, boneless and skinless",
//                     "Yogurt",
//                     "Ginger garlic paste",
//                     "Garam masala",
//                     "Turmeric powder",
//                     "Kashmiri red chili powder",
//                     "Tomato puree",
//                     "Butter",
//                     "Heavy cream",
//                     "Kasuri methi (dried fenugreek leaves)",
//                     "Sugar",
//                     "Salt",
//                     "Vegetable oil"
//                 ],
//                 "discription": [
//                     "Marinate chicken thighs with yogurt, ginger garlic paste, garam masala, turmeric powder, Kashmiri red chili powder, and salt for 1-2 hours.",
//                     "Heat vegetable oil in a pan and cook marinated chicken until browned. Remove and set aside.",
//                     "In the same pan, add butter and sauté ginger garlic paste until fragrant.",
//                     "Add tomato puree, garam masala, sugar, and salt. Cook until the oil separates.",
//                     "Add heavy cream and kasuri methi. Simmer until the sauce thickens.",
//                     "Add cooked chicken to the sauce and simmer for a few more minutes.",
//                     "Serve hot with naan or rice. Enjoy your Butter Chicken!"
//                 ],
//                 "image": "",
//                 "category": "Indian"
//             },
//             {
//                 "name": "Palak Paneer",
//                 "ingredients": [
//                     "Paneer (Indian cottage cheese), cubed",
//                     "Spinach leaves, blanched and pureed",
//                     "Tomatoes, pureed",
//                     "Onion, finely chopped",
//                     "Ginger garlic paste",
//                     "Green chilies, chopped",
//                     "Garam masala",
//                     "Turmeric powder",
//                     "Cumin seeds",
//                     "Coriander powder",
//                     "Salt",
//                     "Vegetable oil"
//                 ],
//                 "discription": [
//                     "Heat vegetable oil in a pan. Add cumin seeds and chopped onion. Sauté until onion turns golden brown.",
//                     "Add ginger garlic paste and chopped green chilies. Sauté until the raw smell disappears.",
//                     "Add tomato puree, turmeric powder, coriander powder, garam masala, and salt. Cook until the oil separates.",
//                     "Add spinach puree and cook for a few minutes.",
//                     "Add cubed paneer and simmer until the flavors blend well.",
//                     "Serve hot with naan or rice. Enjoy your Palak Paneer!"
//                 ],
//                 "image": "",
//                 "category": "Indian"
//             },
//             {
//                 "name": "Chana Masala",
//                 "ingredients": [
//                     "Chickpeas (canned or cooked)",
//                     "Onion, finely chopped",
//                     "Tomatoes, finely chopped",
//                     "Ginger garlic paste",
//                     "Green chilies, chopped",
//                     "Cumin seeds",
//                     "Coriander powder",
//                     "Turmeric powder",
//                     "Garam masala",
//                     "Amchur powder (dried mango powder)",
//                     "Salt",
//                     "Vegetable oil",
//                     "Fresh coriander leaves, chopped (for garnish)"
//                 ],
//                 "discription": [
//                     "Heat vegetable oil in a pan. Add cumin seeds and chopped onion. Sauté until onion turns translucent.",
//                     "Add ginger garlic paste and chopped green chilies. Sauté until the raw smell disappears.",
//                     "Add chopped tomatoes, coriander powder, turmeric powder, garam masala, amchur powder, and salt. Cook until the tomatoes are soft.",
//                     "Add cooked chickpeas and some water. Simmer until the gravy thickens.",
//                     "Garnish with chopped coriander leaves before serving.",
//                     "Serve hot with naan or rice. Enjoy your Chana Masala!"
//                 ],
//                 "image": "",
//                 "category": "Indian"
//             },
//             {
//                 "name": "Paella",
//                 "ingredients": [
//                     "Short-grain rice (such as Bomba or Arborio)",
//                     "Chicken thighs, bone-in and skin-on",
//                     "Chorizo sausage, sliced",
//                     "Shrimp, peeled and deveined",
//                     "Mussels",
//                     "Clams",
//                     "Onion, chopped",
//                     "Bell pepper, chopped",
//                     "Tomato, diced",
//                     "Garlic cloves, minced",
//                     "Saffron threads",
//                     "Paprika",
//                     "Chicken broth",
//                     "White wine",
//                     "Olive oil",
//                     "Salt",
//                     "Pepper",
//                     "Lemon wedges, for serving"
//                 ],
//                 "discription": [
//                     "Heat olive oil in a large paella pan over medium-high heat. Sear chicken thighs until golden brown, then remove and set aside.",
//                     "In the same pan, sauté chopped onion, bell pepper, diced tomato, and minced garlic until softened.",
//                     "Add sliced chorizo sausage and cook until browned.",
//                     "Stir in short-grain rice, saffron threads, and paprika, coating the rice with the oil and spices.",
//                     "Pour in chicken broth and white wine, then bring to a simmer.",
//                     "Nestle chicken thighs back into the pan, along with shrimp, mussels, and clams.",
//                     "Cover and simmer for about 20-25 minutes, or until the rice is cooked and the seafood is cooked through.",
//                     "Season with salt and pepper to taste, then serve hot with lemon wedges. Enjoy your Paella!"
//                 ],
//                 "image": "",
//                 "category": "Spanish"
//             },
//             {
//                 "name": "Gazpacho",
//                 "ingredients": [
//                     "Ripe tomatoes, chopped",
//                     "Cucumber, peeled and chopped",
//                     "Red bell pepper, chopped",
//                     "Green bell pepper, chopped",
//                     "Red onion, chopped",
//                     "Garlic cloves, minced",
//                     "Bread, crust removed and torn into pieces",
//                     "Red wine vinegar",
//                     "Extra virgin olive oil",
//                     "Salt",
//                     "Pepper",
//                     "Water",
//                     "Cilantro or parsley, chopped (for garnish)"
//                 ],
//                 "discription": [
//                     "In a blender, combine chopped tomatoes, cucumber, red bell pepper, green bell pepper, red onion, minced garlic, and torn bread pieces.",
//                     "Add red wine vinegar and extra virgin olive oil. Blend until smooth.",
//                     "If the mixture is too thick, add water until you reach the desired consistency.",
//                     "Season with salt and pepper to taste, then chill the gazpacho in the refrigerator for at least 1 hour before serving.",
//                     "Serve cold, garnished with chopped cilantro or parsley. Enjoy your Gazpacho!"
//                 ],
//                 "image": "",
//                 "category": "Spanish"
//             },
//             {
//                 "name": "Tortilla Española (Spanish Omelette)",
//                 "ingredients": [
//                     "Potatoes, peeled and thinly sliced",
//                     "Onion, thinly sliced",
//                     "Eggs",
//                     "Olive oil",
//                     "Salt",
//                     "Pepper"
//                 ],
//                 "discription": [
//                     "Heat olive oil in a non-stick skillet over medium heat. Add thinly sliced potatoes and onions.",
//                     "Cook, stirring occasionally, until the potatoes are tender but not browned, about 10-15 minutes.",
//                     "Remove the potatoes and onions from the skillet and drain excess oil.",
//                     "In a bowl, beat eggs and season with salt and pepper. Add cooked potatoes and onions to the bowl and mix well.",
//                     "Heat a little more olive oil in the skillet over medium heat. Pour the egg mixture into the skillet.",
//                     "Cook the omelette for about 5 minutes, or until the edges are set and the bottom is golden brown.",
//                     "Carefully flip the omelette using a plate or lid, then cook for another 3-4 minutes until set.",
//                     "Slide the omelette onto a plate and let it cool slightly before slicing into wedges. Enjoy your Tortilla Española!"
//                 ],
//                 "image": "",
//                 "category": "Spanish"
//             },
//             {
//                 "name": "Pad Thai",
//                 "ingredients": [
//                     "Rice noodles",
//                     "Shrimp (or chicken, tofu, or vegetables)",
//                     "Bean sprouts",
//                     "Green onions, sliced",
//                     "Eggs",
//                     "Garlic, minced",
//                     "Shallots, minced",
//                     "Tamarind paste",
//                     "Fish sauce",
//                     "Sugar",
//                     "Crushed peanuts",
//                     "Vegetable oil",
//                     "Lime wedges",
//                     "Cilantro, chopped",
//                     "Red chili flakes (optional)"
//                 ],
//                 "discription": [
//                     "Soak rice noodles in warm water until softened, then drain and set aside.",
//                     "Heat vegetable oil in a wok or large skillet over medium-high heat. Add minced garlic and shallots, then stir-fry until fragrant.",
//                     "Add shrimp (or protein of choice) to the wok or skillet, then cook until nearly cooked through.",
//                     "Push the shrimp to one side and crack eggs into the empty space. Scramble the eggs until fully cooked, then mix with the shrimp.",
//                     "Add softened rice noodles to the wok or skillet, along with tamarind paste, fish sauce, and sugar. Stir-fry until everything is well combined.",
//                     "Add bean sprouts and sliced green onions, then toss until heated through.",
//                     "Serve hot, garnished with crushed peanuts, chopped cilantro, lime wedges, and red chili flakes if desired. Enjoy your Pad Thai!"
//                 ],
//                 "image": "",
//                 "category": "Thai"
//             },
//             {
//                 "name": "Tom Yum Goong (Spicy Shrimp Soup)",
//                 "ingredients": [
//                     "Shrimp, peeled and deveined",
//                     "Mushrooms (such as straw mushrooms or button mushrooms)",
//                     "Galangal, sliced",
//                     "Lemongrass stalks, smashed",
//                     "Kaffir lime leaves",
//                     "Thai bird's eye chilies, crushed",
//                     "Garlic, minced",
//                     "Lime juice",
//                     "Fish sauce",
//                     "Sugar",
//                     "Vegetable broth",
//                     "Cilantro, chopped",
//                     "Green onions, sliced"
//                 ],
//                 "discription": [
//                     "In a pot, bring vegetable broth to a boil. Add sliced galangal, smashed lemongrass stalks, and torn kaffir lime leaves.",
//                     "Add minced garlic and crushed Thai bird's eye chilies to the pot, then let it simmer for a few minutes to infuse the flavors.",
//                     "Add mushrooms to the pot and cook until tender.",
//                     "Add shrimp to the pot and cook until they turn pink and opaque.",
//                     "Season the soup with fish sauce, sugar, and lime juice to taste.",
//                     "Garnish with chopped cilantro and sliced green onions before serving. Enjoy your Tom Yum Goong!"
//                 ],
//                 "image": "",
//                 "category": "Thai"
//             },
//             {
//                 "name": "Green Curry Chicken",
//                 "ingredients": [
//                     "Chicken thighs, boneless and skinless, sliced",
//                     "Green curry paste",
//                     "Coconut milk",
//                     "Thai eggplant, quartered",
//                     "Bell peppers, sliced",
//                     "Bamboo shoots",
//                     "Thai basil leaves",
//                     "Fish sauce",
//                     "Sugar",
//                     "Vegetable oil",
//                     "Jasmine rice, cooked, for serving"
//                 ],
//                 "discription": [
//                     "Heat vegetable oil in a wok or large skillet over medium heat. Add green curry paste and stir-fry until fragrant.",
//                     "Add sliced chicken thighs to the wok or skillet, then cook until browned.",
//                     "Pour in coconut milk and bring to a simmer.",
//                     "Add quartered Thai eggplant, sliced bell peppers, and bamboo shoots to the wok or skillet. Simmer until the vegetables are tender.",
//                     "Season the curry with fish sauce and sugar to taste.",
//                     "Add Thai basil leaves and stir until wilted.",
//                     "Serve hot with jasmine rice. Enjoy your Green Curry Chicken!"
//                 ],
//                 "image": "",
//                 "category": "Thai"
//             }
//         ])
//     } catch (error) {
//         console.log(error);
//     }
// }
// // {"name":"Indian", "image": "indian-food.jpg"}
// insertDummyRecipeData()