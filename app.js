(function () {
  'use strict';

  // ==================== Constants ====================
  var STORAGE_KEY = 'nourishme_v1';

  var ACTIVITY_FACTORS = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };

  var RESTRICTIONS = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'halal', label: 'Halal' },
    { id: 'kosher', label: 'Kosher' },
    { id: 'glutenFree', label: 'Gluten-free' },
    { id: 'dairyFree', label: 'Dairy-free' },
    { id: 'nutAllergy', label: 'Nut allergy' },
    { id: 'pescatarian', label: 'Pescatarian' },
    { id: 'none', label: 'None' }
  ];

  var GOAL_LABELS = { lose: 'Lose weight', gain: 'Gain weight', muscle: 'Build muscle', leaner: 'Become leaner' };

  var CUISINE_KEYWORDS = {
    Italian: ['italy', 'italian'],
    Mexican: ['mexico', 'mexican'],
    Indian: ['india', 'indian'],
    Chinese: ['china', 'chinese'],
    Japanese: ['japan', 'japanese'],
    Mediterranean: ['greece', 'greek', 'mediterranean'],
    American: ['america', 'american', 'usa', 'us'],
    Thai: ['thailand', 'thai'],
    'Middle Eastern': ['lebanon', 'lebanese', 'middle east', 'israel', 'israeli', 'egypt', 'egyptian', 'turkish', 'turkey'],
    Korean: ['korea', 'korean'],
    Scandinavian: ['sweden', 'swedish', 'norway', 'norwegian', 'scandinavia'],
    French: ['france', 'french'],
    Vietnamese: ['vietnam', 'vietnamese'],
    Spanish: ['spain', 'spanish'],
    Brazilian: ['brazil', 'brazilian'],
    Ethiopian: ['ethiopia', 'ethiopian'],
    Caribbean: ['jamaica', 'jamaican', 'caribbean', 'trinidad', 'trinidadian'],
    Moroccan: ['morocco', 'moroccan'],
    German: ['germany', 'german'],
    Filipino: ['philippines', 'filipino', 'philippine'],
    Peruvian: ['peru', 'peruvian'],
    British: ['britain', 'british', 'england', 'english', 'uk'],
    Singaporean: ['singapore', 'singaporean'],
    Nepalese: ['nepal', 'nepalese', 'nepali'],
    Polish: ['poland', 'polish'],
    Argentinian: ['argentina', 'argentinian', 'argentine'],
    Cuban: ['cuba', 'cuban']
  };

  // ==================== Recipe database ====================
  // Hardcoded so Section 2 works fully offline and always returns good
  // demo results. tags: vegetarian/vegan/halal/kosher/glutenFree/dairyFree/
  // pescatarian are "true if compatible", containsNuts is "true if it has
  // nuts" (so a nut-allergy restriction excludes recipes where this is true).
  var RECIPES = [
    { id: 'r1', name: 'Grilled Chicken & Rice Bowl', cuisine: 'American', prepTime: 25,
      ingredients: ['chicken', 'rice', 'broccoli', 'olive oil', 'garlic'],
      macros: { calories: 520, protein: 42, carbs: 55, fat: 14 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r2', name: 'Veggie Tofu Stir Fry', cuisine: 'Chinese', prepTime: 20,
      ingredients: ['tofu', 'rice', 'broccoli', 'carrot', 'soy sauce', 'garlic'],
      macros: { calories: 430, protein: 18, carbs: 62, fat: 12 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r3', name: 'Spaghetti Aglio e Olio', cuisine: 'Italian', prepTime: 20,
      ingredients: ['spaghetti', 'garlic', 'olive oil', 'chili flakes', 'parsley'],
      macros: { calories: 480, protein: 12, carbs: 68, fat: 18 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r4', name: 'Greek Salad with Feta', cuisine: 'Mediterranean', prepTime: 15,
      ingredients: ['cucumber', 'tomato', 'feta', 'olives', 'olive oil', 'red onion'],
      macros: { calories: 320, protein: 10, carbs: 16, fat: 25 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r5', name: 'Chicken Tikka Masala', cuisine: 'Indian', prepTime: 35,
      ingredients: ['chicken', 'yogurt', 'tomato', 'cream', 'garlic', 'ginger', 'spices', 'rice'],
      macros: { calories: 610, protein: 40, carbs: 48, fat: 28 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r6', name: 'Black Bean Tacos', cuisine: 'Mexican', prepTime: 20,
      ingredients: ['black beans', 'corn tortilla', 'avocado', 'lime', 'salsa', 'onion'],
      macros: { calories: 420, protein: 14, carbs: 60, fat: 14 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r7', name: 'Salmon with Quinoa', cuisine: 'Scandinavian', prepTime: 25,
      ingredients: ['salmon', 'quinoa', 'spinach', 'lemon', 'olive oil'],
      macros: { calories: 540, protein: 38, carbs: 40, fat: 24 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r8', name: 'Egg Fried Rice', cuisine: 'Chinese', prepTime: 15,
      ingredients: ['eggs', 'rice', 'peas', 'carrot', 'soy sauce', 'scallion'],
      macros: { calories: 460, protein: 16, carbs: 64, fat: 14 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r9', name: 'Chana Masala (Chickpea Curry)', cuisine: 'Indian', prepTime: 30,
      ingredients: ['chickpeas', 'tomato', 'onion', 'garlic', 'ginger', 'spices', 'rice'],
      macros: { calories: 480, protein: 16, carbs: 78, fat: 10 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r10', name: 'Turkey Chili', cuisine: 'American', prepTime: 35,
      ingredients: ['ground turkey', 'kidney beans', 'tomato', 'onion', 'chili powder', 'garlic'],
      macros: { calories: 460, protein: 36, carbs: 38, fat: 16 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r11', name: 'Caprese Sandwich', cuisine: 'Italian', prepTime: 10,
      ingredients: ['bread', 'mozzarella', 'tomato', 'basil', 'olive oil'],
      macros: { calories: 420, protein: 18, carbs: 42, fat: 20 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r12', name: 'Shrimp Pad Thai', cuisine: 'Thai', prepTime: 25,
      ingredients: ['shrimp', 'rice noodles', 'egg', 'peanuts', 'bean sprouts', 'lime', 'soy sauce'],
      macros: { calories: 560, protein: 30, carbs: 64, fat: 18 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: true } },
    { id: 'r13', name: 'Falafel Wrap', cuisine: 'Middle Eastern', prepTime: 25,
      ingredients: ['chickpeas', 'pita', 'tahini', 'cucumber', 'tomato', 'lettuce'],
      macros: { calories: 490, protein: 16, carbs: 66, fat: 18 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r14', name: 'Beef & Broccoli', cuisine: 'Chinese', prepTime: 25,
      ingredients: ['beef', 'broccoli', 'soy sauce', 'garlic', 'rice'],
      macros: { calories: 540, protein: 38, carbs: 52, fat: 18 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r15', name: 'Spinach & Cheese Omelette', cuisine: 'American', prepTime: 12,
      ingredients: ['eggs', 'spinach', 'cheese', 'butter'],
      macros: { calories: 380, protein: 26, carbs: 4, fat: 28 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r16', name: 'Red Lentil Soup', cuisine: 'Middle Eastern', prepTime: 30,
      ingredients: ['lentils', 'carrot', 'onion', 'celery', 'cumin', 'garlic'],
      macros: { calories: 350, protein: 20, carbs: 55, fat: 6 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r17', name: 'Salmon Poke Bowl', cuisine: 'Japanese', prepTime: 20,
      ingredients: ['salmon', 'rice', 'avocado', 'cucumber', 'soy sauce', 'sesame'],
      macros: { calories: 520, protein: 32, carbs: 52, fat: 20 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r18', name: 'Margherita Pizza', cuisine: 'Italian', prepTime: 25,
      ingredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'basil', 'olive oil'],
      macros: { calories: 620, protein: 24, carbs: 74, fat: 24 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r19', name: 'Beef Bibimbap', cuisine: 'Korean', prepTime: 35,
      ingredients: ['rice', 'beef', 'spinach', 'carrot', 'egg', 'gochujang'],
      macros: { calories: 590, protein: 32, carbs: 66, fat: 20 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r20', name: 'Peanut Butter Banana Oats', cuisine: 'American', prepTime: 10,
      ingredients: ['oats', 'banana', 'peanut butter', 'milk'],
      macros: { calories: 420, protein: 14, carbs: 58, fat: 16 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: true } },
    { id: 'r21', name: 'Tofu Buddha Bowl', cuisine: 'American', prepTime: 25,
      ingredients: ['tofu', 'quinoa', 'spinach', 'chickpeas', 'avocado', 'tahini'],
      macros: { calories: 480, protein: 22, carbs: 50, fat: 22 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r22', name: 'Shakshuka', cuisine: 'Middle Eastern', prepTime: 25,
      ingredients: ['eggs', 'tomato', 'bell pepper', 'onion', 'feta', 'garlic'],
      macros: { calories: 380, protein: 20, carbs: 22, fat: 24 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r23', name: 'Palak Paneer', cuisine: 'Indian', prepTime: 30,
      ingredients: ['paneer', 'spinach', 'cream', 'garlic', 'ginger', 'spices', 'rice'],
      macros: { calories: 520, protein: 20, carbs: 45, fat: 30 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r24', name: 'Teriyaki Chicken Rice Bowl', cuisine: 'Japanese', prepTime: 25,
      ingredients: ['chicken', 'rice', 'broccoli', 'teriyaki sauce', 'sesame'],
      macros: { calories: 560, protein: 40, carbs: 62, fat: 16 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r25', name: 'Miso Ramen with Egg', cuisine: 'Japanese', prepTime: 20,
      ingredients: ['ramen noodles', 'miso paste', 'egg', 'scallion', 'nori'],
      macros: { calories: 480, protein: 18, carbs: 68, fat: 14 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r26', name: 'Kimchi Fried Rice', cuisine: 'Korean', prepTime: 15,
      ingredients: ['rice', 'kimchi', 'egg', 'scallion', 'sesame oil'],
      macros: { calories: 430, protein: 14, carbs: 58, fat: 16 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r27', name: 'Beef Bulgogi', cuisine: 'Korean', prepTime: 30,
      ingredients: ['beef', 'rice', 'soy sauce', 'garlic', 'sesame oil', 'sugar'],
      macros: { calories: 570, protein: 36, carbs: 58, fat: 20 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r28', name: 'Thai Green Curry with Chicken', cuisine: 'Thai', prepTime: 30,
      ingredients: ['chicken', 'coconut milk', 'green curry paste', 'bell pepper', 'rice', 'basil'],
      macros: { calories: 590, protein: 34, carbs: 50, fat: 28 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r29', name: 'Thai Basil Chicken (Pad Krapow)', cuisine: 'Thai', prepTime: 20,
      ingredients: ['chicken', 'basil', 'garlic', 'chili', 'rice', 'egg'],
      macros: { calories: 520, protein: 36, carbs: 48, fat: 18 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r30', name: 'Chicken Quesadilla', cuisine: 'Mexican', prepTime: 15,
      ingredients: ['chicken', 'tortilla', 'cheese', 'bell pepper', 'onion'],
      macros: { calories: 540, protein: 32, carbs: 40, fat: 26 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r31', name: 'Beef Burrito Bowl', cuisine: 'Mexican', prepTime: 25,
      ingredients: ['rice', 'black beans', 'ground beef', 'lettuce', 'cheese', 'salsa'],
      macros: { calories: 610, protein: 36, carbs: 55, fat: 24 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r32', name: 'Chicken Souvlaki Wrap', cuisine: 'Mediterranean', prepTime: 25,
      ingredients: ['chicken', 'pita', 'yogurt', 'cucumber', 'tomato'],
      macros: { calories: 480, protein: 34, carbs: 46, fat: 16 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: false, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r33', name: 'Mediterranean Baked Salmon', cuisine: 'Mediterranean', prepTime: 25,
      ingredients: ['salmon', 'olive oil', 'lemon', 'tomato', 'olives'],
      macros: { calories: 480, protein: 36, carbs: 10, fat: 32 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r34', name: 'Swedish Meatballs', cuisine: 'Scandinavian', prepTime: 35,
      ingredients: ['ground beef', 'breadcrumbs', 'cream', 'egg', 'potato'],
      macros: { calories: 580, protein: 30, carbs: 40, fat: 32 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: false, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r35', name: 'Smoked Salmon Rye Sandwich', cuisine: 'Scandinavian', prepTime: 10,
      ingredients: ['rye bread', 'smoked salmon', 'cream cheese', 'cucumber', 'dill'],
      macros: { calories: 420, protein: 24, carbs: 38, fat: 18 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r36', name: 'Greek Yogurt with Blueberries & Honey', cuisine: 'Mediterranean', prepTime: 5,
      ingredients: ['greek yogurt', 'blueberries', 'honey', 'granola'],
      macros: { calories: 320, protein: 20, carbs: 45, fat: 8 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r37', name: 'Overnight Oats with Mixed Berries', cuisine: 'American', prepTime: 5,
      ingredients: ['oats', 'milk', 'chia seeds', 'strawberries', 'blueberries', 'honey'],
      macros: { calories: 380, protein: 14, carbs: 62, fat: 10 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r38', name: 'Berry Smoothie Bowl', cuisine: 'American', prepTime: 10,
      ingredients: ['banana', 'mixed berries', 'greek yogurt', 'granola', 'chia seeds'],
      macros: { calories: 340, protein: 12, carbs: 60, fat: 8 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r39', name: 'Avocado Toast with Poached Egg', cuisine: 'American', prepTime: 10,
      ingredients: ['bread', 'avocado', 'egg', 'lemon', 'chili flakes'],
      macros: { calories: 380, protein: 16, carbs: 32, fat: 22 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r40', name: 'Classic Pancakes with Maple Syrup', cuisine: 'American', prepTime: 15,
      ingredients: ['flour', 'eggs', 'milk', 'butter', 'maple syrup'],
      macros: { calories: 480, protein: 12, carbs: 78, fat: 14 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r41', name: 'French Toast with Berries', cuisine: 'French', prepTime: 15,
      ingredients: ['bread', 'eggs', 'milk', 'cinnamon', 'strawberries'],
      macros: { calories: 420, protein: 16, carbs: 58, fat: 14 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r42', name: 'Chia Seed Pudding with Mango', cuisine: 'American', prepTime: 5,
      ingredients: ['chia seeds', 'coconut milk', 'mango', 'honey'],
      macros: { calories: 300, protein: 8, carbs: 38, fat: 14 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r43', name: 'Fresh Fruit Salad with Mint', cuisine: 'American', prepTime: 10,
      ingredients: ['apple', 'orange', 'grapes', 'strawberries', 'mint', 'lime'],
      macros: { calories: 180, protein: 2, carbs: 44, fat: 1 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r44', name: 'Roasted Vegetable Medley', cuisine: 'Mediterranean', prepTime: 30,
      ingredients: ['zucchini', 'bell pepper', 'carrot', 'red onion', 'olive oil', 'rosemary'],
      macros: { calories: 220, protein: 4, carbs: 28, fat: 12 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r45', name: 'Stuffed Bell Peppers', cuisine: 'American', prepTime: 40,
      ingredients: ['bell pepper', 'rice', 'ground beef', 'tomato', 'onion', 'cheese'],
      macros: { calories: 480, protein: 28, carbs: 44, fat: 20 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r46', name: 'Vegetable Curry', cuisine: 'Indian', prepTime: 30,
      ingredients: ['cauliflower', 'potato', 'peas', 'carrot', 'coconut milk', 'curry powder', 'rice'],
      macros: { calories: 460, protein: 10, carbs: 70, fat: 16 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r47', name: 'Ratatouille', cuisine: 'French', prepTime: 40,
      ingredients: ['zucchini', 'eggplant', 'bell pepper', 'tomato', 'onion', 'garlic', 'olive oil'],
      macros: { calories: 240, protein: 5, carbs: 30, fat: 12 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r48', name: 'Zucchini Noodles with Pesto', cuisine: 'Italian', prepTime: 15,
      ingredients: ['zucchini', 'basil', 'pine nuts', 'parmesan', 'olive oil', 'garlic'],
      macros: { calories: 320, protein: 10, carbs: 12, fat: 26 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: true } },
    { id: 'r49', name: 'Cauliflower Fried Rice', cuisine: 'Chinese', prepTime: 20,
      ingredients: ['cauliflower', 'egg', 'peas', 'carrot', 'soy sauce', 'scallion'],
      macros: { calories: 260, protein: 14, carbs: 22, fat: 12 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r50', name: 'Grilled Steak with Sweet Potato', cuisine: 'American', prepTime: 30,
      ingredients: ['steak', 'sweet potato', 'asparagus', 'butter', 'garlic'],
      macros: { calories: 620, protein: 44, carbs: 40, fat: 30 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r51', name: 'Honey Garlic Pork Chops', cuisine: 'American', prepTime: 30,
      ingredients: ['pork chop', 'honey', 'garlic', 'soy sauce', 'rice'],
      macros: { calories: 540, protein: 38, carbs: 48, fat: 20 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: false, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r52', name: 'Tuna Salad Sandwich', cuisine: 'American', prepTime: 10,
      ingredients: ['tuna', 'bread', 'mayonnaise', 'celery', 'lettuce'],
      macros: { calories: 420, protein: 28, carbs: 38, fat: 18 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r53', name: 'Shrimp Scampi with Linguine', cuisine: 'Italian', prepTime: 25,
      ingredients: ['shrimp', 'linguine', 'garlic', 'butter', 'lemon', 'parsley'],
      macros: { calories: 520, protein: 30, carbs: 56, fat: 18 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r54', name: 'Turkey and Avocado Wrap', cuisine: 'American', prepTime: 10,
      ingredients: ['turkey', 'tortilla', 'avocado', 'lettuce', 'tomato'],
      macros: { calories: 420, protein: 26, carbs: 36, fat: 18 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r55', name: 'BBQ Pulled Chicken Sandwich', cuisine: 'American', prepTime: 35,
      ingredients: ['chicken', 'bbq sauce', 'bread', 'coleslaw'],
      macros: { calories: 520, protein: 34, carbs: 58, fat: 14 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r56', name: 'Quinoa Stuffed Sweet Potato', cuisine: 'American', prepTime: 35,
      ingredients: ['sweet potato', 'quinoa', 'black beans', 'corn', 'avocado'],
      macros: { calories: 420, protein: 12, carbs: 74, fat: 10 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r57', name: 'Caprese Skewers', cuisine: 'Italian', prepTime: 10,
      ingredients: ['cherry tomato', 'mozzarella', 'basil', 'olive oil', 'balsamic vinegar'],
      macros: { calories: 260, protein: 12, carbs: 8, fat: 20 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r58', name: 'Apple Cinnamon Overnight Oats', cuisine: 'American', prepTime: 5,
      ingredients: ['oats', 'apple', 'cinnamon', 'milk', 'honey'],
      macros: { calories: 360, protein: 12, carbs: 66, fat: 6 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r59', name: 'Hummus and Veggie Plate', cuisine: 'Middle Eastern', prepTime: 10,
      ingredients: ['hummus', 'carrot', 'cucumber', 'bell pepper', 'pita'],
      macros: { calories: 340, protein: 10, carbs: 46, fat: 14 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r60', name: 'Baked Cod with Roasted Vegetables', cuisine: 'Scandinavian', prepTime: 30,
      ingredients: ['cod', 'zucchini', 'carrot', 'olive oil', 'lemon'],
      macros: { calories: 380, protein: 34, carbs: 20, fat: 18 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r61', name: 'French Onion Soup', cuisine: 'French', prepTime: 45,
      ingredients: ['onion', 'beef broth', 'bread', 'gruyere cheese'],
      macros: { calories: 380, protein: 14, carbs: 40, fat: 16 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: false, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r62', name: 'Chicken Fajitas', cuisine: 'Mexican', prepTime: 25,
      ingredients: ['chicken', 'bell pepper', 'onion', 'tortilla', 'lime', 'cumin'],
      macros: { calories: 450, protein: 38, carbs: 40, fat: 14 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r63', name: 'Shrimp Ceviche', cuisine: 'Mexican', prepTime: 20,
      ingredients: ['shrimp', 'lime', 'tomato', 'red onion', 'cilantro', 'avocado'],
      macros: { calories: 280, protein: 24, carbs: 18, fat: 12 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r64', name: 'Mexican Street Corn Salad', cuisine: 'Mexican', prepTime: 15,
      ingredients: ['corn', 'mayo', 'cotija cheese', 'chili powder', 'lime', 'cilantro'],
      macros: { calories: 310, protein: 8, carbs: 34, fat: 17 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r65', name: 'Chicken Parmesan', cuisine: 'Italian', prepTime: 35,
      ingredients: ['chicken', 'breadcrumbs', 'mozzarella', 'marinara', 'spaghetti'],
      macros: { calories: 620, protein: 48, carbs: 52, fat: 22 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: false, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r66', name: 'Mushroom Risotto', cuisine: 'Italian', prepTime: 35,
      ingredients: ['arborio rice', 'mushroom', 'parmesan', 'butter', 'vegetable broth'],
      macros: { calories: 480, protein: 12, carbs: 68, fat: 16 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r67', name: 'Minestrone Soup', cuisine: 'Italian', prepTime: 30,
      ingredients: ['beans', 'pasta', 'carrot', 'celery', 'tomato', 'zucchini'],
      macros: { calories: 320, protein: 14, carbs: 54, fat: 6 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r68', name: 'Butter Chicken', cuisine: 'Indian', prepTime: 40,
      ingredients: ['chicken', 'tomato', 'cream', 'butter', 'garam masala', 'rice'],
      macros: { calories: 560, protein: 38, carbs: 42, fat: 26 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r69', name: 'Dal Tadka (Lentil Curry)', cuisine: 'Indian', prepTime: 30,
      ingredients: ['lentils', 'onion', 'tomato', 'garlic', 'cumin', 'ghee'],
      macros: { calories: 340, protein: 18, carbs: 48, fat: 8 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r70', name: 'Aloo Gobi (Potato & Cauliflower)', cuisine: 'Indian', prepTime: 30,
      ingredients: ['potato', 'cauliflower', 'turmeric', 'cumin', 'onion', 'tomato'],
      macros: { calories: 280, protein: 7, carbs: 46, fat: 8 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r71', name: 'Peanut Butter Energy Balls', cuisine: 'American', prepTime: 10,
      ingredients: ['oats', 'peanut butter', 'honey', 'chia seeds', 'dark chocolate chips'],
      macros: { calories: 220, protein: 7, carbs: 24, fat: 11 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: true } },
    { id: 'r72', name: 'Banana Nut Bread Slice', cuisine: 'American', prepTime: 15,
      ingredients: ['banana', 'walnuts', 'flour', 'egg', 'honey'],
      macros: { calories: 240, protein: 5, carbs: 34, fat: 9 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: true } },
    { id: 'r73', name: 'Dark Chocolate Covered Strawberries', cuisine: 'American', prepTime: 10,
      ingredients: ['strawberries', 'dark chocolate'],
      macros: { calories: 160, protein: 2, carbs: 22, fat: 8 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r74', name: 'Baked Apple Crumble', cuisine: 'American', prepTime: 25,
      ingredients: ['apple', 'oats', 'cinnamon', 'honey', 'butter'],
      macros: { calories: 260, protein: 3, carbs: 44, fat: 9 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r75', name: 'Pho Ga (Chicken Noodle Soup)', cuisine: 'Vietnamese', prepTime: 40,
      ingredients: ['chicken', 'rice noodles', 'onion', 'ginger', 'star anise', 'cilantro'],
      macros: { calories: 420, protein: 28, carbs: 55, fat: 8 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r76', name: 'Vietnamese Spring Rolls', cuisine: 'Vietnamese', prepTime: 20,
      ingredients: ['rice paper', 'shrimp', 'lettuce', 'rice noodles', 'mint', 'carrot'],
      macros: { calories: 260, protein: 14, carbs: 40, fat: 5 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r77', name: 'Bun Cha (Grilled Pork with Noodles)', cuisine: 'Vietnamese', prepTime: 35,
      ingredients: ['pork', 'rice noodles', 'lettuce', 'fish sauce', 'carrot'],
      macros: { calories: 480, protein: 30, carbs: 50, fat: 16 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r78', name: 'Vietnamese Iced Coffee', cuisine: 'Vietnamese', prepTime: 5,
      ingredients: ['coffee', 'condensed milk', 'ice'],
      macros: { calories: 180, protein: 3, carbs: 30, fat: 6 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r79', name: 'Paella', cuisine: 'Spanish', prepTime: 45,
      ingredients: ['rice', 'shrimp', 'chicken', 'saffron', 'bell pepper', 'peas'],
      macros: { calories: 520, protein: 34, carbs: 58, fat: 14 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r80', name: 'Spanish Tortilla (Potato Omelette)', cuisine: 'Spanish', prepTime: 30,
      ingredients: ['egg', 'potato', 'onion', 'olive oil'],
      macros: { calories: 340, protein: 14, carbs: 30, fat: 18 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r81', name: 'Gazpacho', cuisine: 'Spanish', prepTime: 15,
      ingredients: ['tomato', 'cucumber', 'bell pepper', 'garlic', 'olive oil', 'bread'],
      macros: { calories: 180, protein: 4, carbs: 22, fat: 9 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r82', name: 'Patatas Bravas', cuisine: 'Spanish', prepTime: 25,
      ingredients: ['potato', 'tomato', 'paprika', 'garlic', 'olive oil'],
      macros: { calories: 300, protein: 5, carbs: 42, fat: 13 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r83', name: 'Feijoada (Black Bean & Pork Stew)', cuisine: 'Brazilian', prepTime: 60,
      ingredients: ['black beans', 'pork', 'onion', 'garlic', 'rice'],
      macros: { calories: 560, protein: 32, carbs: 52, fat: 22 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r84', name: 'Moqueca (Brazilian Coconut Fish Stew)', cuisine: 'Brazilian', prepTime: 35,
      ingredients: ['fish', 'coconut milk', 'tomato', 'bell pepper', 'cilantro'],
      macros: { calories: 380, protein: 30, carbs: 16, fat: 22 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r85', name: 'Pão de Queijo (Cheese Bread Bites)', cuisine: 'Brazilian', prepTime: 25,
      ingredients: ['tapioca flour', 'cheese', 'egg', 'milk'],
      macros: { calories: 220, protein: 6, carbs: 24, fat: 11 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r86', name: 'Misir Wot (Spiced Red Lentils)', cuisine: 'Ethiopian', prepTime: 35,
      ingredients: ['lentils', 'onion', 'garlic', 'berbere spice', 'tomato'],
      macros: { calories: 320, protein: 18, carbs: 48, fat: 6 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r87', name: 'Doro Wat (Spiced Chicken Stew)', cuisine: 'Ethiopian', prepTime: 50,
      ingredients: ['chicken', 'onion', 'berbere spice', 'garlic', 'egg'],
      macros: { calories: 460, protein: 36, carbs: 20, fat: 24 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r88', name: 'Injera with Vegetable Combo', cuisine: 'Ethiopian', prepTime: 30,
      ingredients: ['teff flour', 'cabbage', 'carrot', 'potato', 'collard greens'],
      macros: { calories: 340, protein: 10, carbs: 60, fat: 6 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r89', name: 'Jerk Chicken with Rice and Peas', cuisine: 'Caribbean', prepTime: 45,
      ingredients: ['chicken', 'allspice', 'scotch bonnet', 'rice', 'kidney beans', 'coconut milk'],
      macros: { calories: 540, protein: 38, carbs: 52, fat: 18 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r90', name: 'Trinidadian Doubles (Chickpea Flatbread)', cuisine: 'Caribbean', prepTime: 30,
      ingredients: ['chickpeas', 'flour', 'cumin', 'tamarind', 'cucumber'],
      macros: { calories: 380, protein: 12, carbs: 62, fat: 9 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r91', name: 'Caribbean Black Bean Soup', cuisine: 'Caribbean', prepTime: 30,
      ingredients: ['black beans', 'coconut milk', 'onion', 'garlic', 'lime'],
      macros: { calories: 300, protein: 14, carbs: 44, fat: 8 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r92', name: 'Grilled Mahi Mahi with Mango Salsa', cuisine: 'Caribbean', prepTime: 25,
      ingredients: ['mahi mahi', 'mango', 'red onion', 'lime', 'cilantro'],
      macros: { calories: 320, protein: 32, carbs: 22, fat: 8 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r93', name: 'Chicken Tagine with Apricots', cuisine: 'Moroccan', prepTime: 50,
      ingredients: ['chicken', 'apricot', 'onion', 'cinnamon', 'almonds', 'couscous'],
      macros: { calories: 480, protein: 34, carbs: 46, fat: 16 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: false, containsNuts: true } },
    { id: 'r94', name: 'Moroccan Vegetable Couscous', cuisine: 'Moroccan', prepTime: 30,
      ingredients: ['couscous', 'zucchini', 'carrot', 'chickpeas', 'cumin', 'raisins'],
      macros: { calories: 380, protein: 12, carbs: 68, fat: 6 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r95', name: 'Harira Soup (Lentil & Tomato Soup)', cuisine: 'Moroccan', prepTime: 40,
      ingredients: ['lentils', 'tomato', 'chickpeas', 'celery', 'cilantro'],
      macros: { calories: 260, protein: 14, carbs: 42, fat: 4 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r96', name: 'Bratwurst with Sauerkraut', cuisine: 'German', prepTime: 25,
      ingredients: ['bratwurst', 'sauerkraut', 'mustard', 'potato'],
      macros: { calories: 520, protein: 24, carbs: 34, fat: 32 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r97', name: 'German Potato Salad', cuisine: 'German', prepTime: 30,
      ingredients: ['potato', 'bacon', 'red onion', 'vinegar', 'mustard'],
      macros: { calories: 300, protein: 8, carbs: 38, fat: 12 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r98', name: 'Pretzel with Mustard', cuisine: 'German', prepTime: 15,
      ingredients: ['pretzel', 'mustard', 'butter'],
      macros: { calories: 320, protein: 9, carbs: 58, fat: 7 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r99', name: 'Chicken Adobo', cuisine: 'Filipino', prepTime: 40,
      ingredients: ['chicken', 'soy sauce', 'vinegar', 'garlic', 'bay leaf', 'rice'],
      macros: { calories: 480, protein: 36, carbs: 50, fat: 14 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r100', name: 'Pancit Noodles', cuisine: 'Filipino', prepTime: 25,
      ingredients: ['rice noodles', 'chicken', 'cabbage', 'carrot', 'soy sauce'],
      macros: { calories: 420, protein: 22, carbs: 56, fat: 10 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r101', name: 'Filipino Mango Float', cuisine: 'Filipino', prepTime: 20,
      ingredients: ['mango', 'graham crackers', 'condensed milk', 'whipped cream'],
      macros: { calories: 300, protein: 4, carbs: 46, fat: 11 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r102', name: 'Lomo Saltado (Stir-Fried Beef)', cuisine: 'Peruvian', prepTime: 30,
      ingredients: ['beef', 'onion', 'tomato', 'soy sauce', 'french fries', 'rice'],
      macros: { calories: 560, protein: 34, carbs: 54, fat: 20 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: false, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r103', name: 'Peruvian Ceviche', cuisine: 'Peruvian', prepTime: 20,
      ingredients: ['white fish', 'lime', 'red onion', 'cilantro', 'sweet potato', 'corn'],
      macros: { calories: 260, protein: 26, carbs: 24, fat: 4 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r104', name: 'Quinoa Salad Peruvian Style', cuisine: 'Peruvian', prepTime: 20,
      ingredients: ['quinoa', 'tomato', 'cucumber', 'red onion', 'lime', 'cilantro'],
      macros: { calories: 320, protein: 10, carbs: 50, fat: 9 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r105', name: 'Fish and Chips', cuisine: 'British', prepTime: 35,
      ingredients: ['cod', 'potato', 'flour', 'peas', 'malt vinegar'],
      macros: { calories: 620, protein: 32, carbs: 68, fat: 24 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r106', name: "Shepherd's Pie", cuisine: 'British', prepTime: 50,
      ingredients: ['ground lamb', 'potato', 'carrot', 'peas', 'onion'],
      macros: { calories: 480, protein: 28, carbs: 40, fat: 22 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: true, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r107', name: 'English Breakfast Plate', cuisine: 'British', prepTime: 25,
      ingredients: ['eggs', 'bacon', 'baked beans', 'tomato', 'toast'],
      macros: { calories: 540, protein: 30, carbs: 40, fat: 28 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: false, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r108', name: 'Buffalo Cauliflower Bites', cuisine: 'American', prepTime: 30,
      ingredients: ['cauliflower', 'hot sauce', 'butter', 'flour'],
      macros: { calories: 220, protein: 5, carbs: 24, fat: 12 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r109', name: 'Loaded Sweet Potato Skins', cuisine: 'American', prepTime: 35,
      ingredients: ['sweet potato', 'cheddar', 'bacon', 'sour cream', 'chives'],
      macros: { calories: 380, protein: 14, carbs: 36, fat: 20 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: true, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r110', name: 'Cobb Salad', cuisine: 'American', prepTime: 20,
      ingredients: ['lettuce', 'chicken', 'bacon', 'egg', 'avocado', 'blue cheese'],
      macros: { calories: 460, protein: 32, carbs: 12, fat: 32 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: true, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r112', name: 'Butternut Squash Soup', cuisine: 'American', prepTime: 35,
      ingredients: ['butternut squash', 'onion', 'vegetable broth', 'cream', 'nutmeg'],
      macros: { calories: 260, protein: 5, carbs: 38, fat: 10 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r113', name: 'Kale Caesar Salad', cuisine: 'American', prepTime: 15,
      ingredients: ['kale', 'parmesan', 'croutons', 'chicken', 'caesar dressing'],
      macros: { calories: 420, protein: 28, carbs: 22, fat: 24 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: false, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 'r115', name: 'Egg White Veggie Scramble', cuisine: 'American', prepTime: 10,
      ingredients: ['egg whites', 'spinach', 'mushroom', 'bell pepper', 'onion'],
      macros: { calories: 220, protein: 24, carbs: 10, fat: 6 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r116', name: 'Protein Smoothie (Banana Peanut Butter)', cuisine: 'American', prepTime: 5,
      ingredients: ['banana', 'peanut butter', 'protein powder', 'milk', 'ice'],
      macros: { calories: 380, protein: 30, carbs: 40, fat: 12 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: true } },
    { id: 'r117', name: 'Green Detox Smoothie', cuisine: 'American', prepTime: 5,
      ingredients: ['spinach', 'apple', 'cucumber', 'lemon', 'ginger'],
      macros: { calories: 160, protein: 3, carbs: 38, fat: 1 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r118', name: 'Watermelon Feta Salad', cuisine: 'Mediterranean', prepTime: 10,
      ingredients: ['watermelon', 'feta', 'mint', 'red onion', 'lime'],
      macros: { calories: 220, protein: 6, carbs: 26, fat: 10 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r119', name: 'Roasted Beet and Goat Cheese Salad', cuisine: 'Mediterranean', prepTime: 30,
      ingredients: ['beet', 'goat cheese', 'walnuts', 'arugula', 'balsamic'],
      macros: { calories: 320, protein: 10, carbs: 24, fat: 20 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: true } },
    { id: 'r120', name: 'Miso Soup with Tofu', cuisine: 'Japanese', prepTime: 15,
      ingredients: ['miso paste', 'tofu', 'seaweed', 'scallion'],
      macros: { calories: 120, protein: 8, carbs: 10, fat: 5 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r121', name: 'Teriyaki Salmon', cuisine: 'Japanese', prepTime: 25,
      ingredients: ['salmon', 'teriyaki sauce', 'rice', 'broccoli'],
      macros: { calories: 520, protein: 34, carbs: 50, fat: 16 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r123', name: 'Bibimbap', cuisine: 'Korean', prepTime: 35,
      ingredients: ['rice', 'beef', 'spinach', 'carrot', 'egg', 'gochujang'],
      macros: { calories: 540, protein: 30, carbs: 60, fat: 16 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r124', name: 'Pad Thai', cuisine: 'Thai', prepTime: 25,
      ingredients: ['rice noodles', 'shrimp', 'egg', 'bean sprouts', 'peanuts'],
      macros: { calories: 480, protein: 22, carbs: 58, fat: 16 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: true } },
    { id: 'r125', name: 'Thai Green Curry', cuisine: 'Thai', prepTime: 30,
      ingredients: ['chicken', 'coconut milk', 'green curry paste', 'bell pepper', 'basil'],
      macros: { calories: 460, protein: 28, carbs: 20, fat: 30 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r129', name: 'Gravlax (Cured Salmon)', cuisine: 'Scandinavian', prepTime: 20,
      ingredients: ['salmon', 'dill', 'salt', 'sugar', 'mustard sauce'],
      macros: { calories: 280, protein: 24, carbs: 6, fat: 18 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r130', name: 'Hainanese Chicken Rice', cuisine: 'Singaporean', prepTime: 40,
      ingredients: ['chicken', 'rice', 'ginger', 'garlic', 'cucumber', 'soy sauce'],
      macros: { calories: 520, protein: 34, carbs: 58, fat: 16 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r131', name: 'Laksa (Spicy Coconut Noodle Soup)', cuisine: 'Singaporean', prepTime: 35,
      ingredients: ['rice noodles', 'coconut milk', 'shrimp', 'tofu', 'bean sprouts', 'chili paste'],
      macros: { calories: 480, protein: 22, carbs: 50, fat: 22 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r132', name: 'Singapore Chili Crab', cuisine: 'Singaporean', prepTime: 40,
      ingredients: ['crab', 'tomato', 'chili paste', 'egg', 'garlic', 'bread'],
      macros: { calories: 420, protein: 28, carbs: 30, fat: 20 },
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: false, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 'r133', name: 'Kaya Toast with Soft-Boiled Eggs', cuisine: 'Singaporean', prepTime: 10,
      ingredients: ['bread', 'kaya jam', 'butter', 'eggs', 'soy sauce'],
      macros: { calories: 380, protein: 14, carbs: 44, fat: 16 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r134', name: 'Momo (Steamed Dumplings)', cuisine: 'Nepalese', prepTime: 40,
      ingredients: ['flour', 'ground pork', 'onion', 'garlic', 'ginger', 'cabbage'],
      macros: { calories: 420, protein: 20, carbs: 46, fat: 16 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: false, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r135', name: 'Dal Bhat (Lentils & Rice)', cuisine: 'Nepalese', prepTime: 35,
      ingredients: ['lentils', 'rice', 'spinach', 'turmeric', 'garlic', 'ghee'],
      macros: { calories: 460, protein: 18, carbs: 76, fat: 8 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r136', name: 'Pierogi with Sour Cream', cuisine: 'Polish', prepTime: 45,
      ingredients: ['potato', 'cheese', 'flour', 'onion', 'sour cream', 'butter'],
      macros: { calories: 480, protein: 14, carbs: 60, fat: 20 },
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: false, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 'r137', name: 'Polish Sausage with Sauerkraut', cuisine: 'Polish', prepTime: 25,
      ingredients: ['kielbasa', 'sauerkraut', 'mustard', 'potato'],
      macros: { calories: 540, protein: 22, carbs: 32, fat: 34 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r138', name: 'Argentinian Grilled Steak (Asado)', cuisine: 'Argentinian', prepTime: 30,
      ingredients: ['beef', 'chimichurri', 'garlic', 'parsley', 'olive oil'],
      macros: { calories: 560, protein: 46, carbs: 4, fat: 40 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r139', name: 'Beef Empanadas', cuisine: 'Argentinian', prepTime: 40,
      ingredients: ['ground beef', 'flour', 'onion', 'egg', 'cumin', 'olives'],
      macros: { calories: 420, protein: 18, carbs: 40, fat: 20 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: false, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r140', name: 'Cuban Ropa Vieja (Shredded Beef)', cuisine: 'Cuban', prepTime: 50,
      ingredients: ['beef', 'bell pepper', 'onion', 'tomato', 'garlic', 'rice'],
      macros: { calories: 520, protein: 36, carbs: 48, fat: 16 },
      tags: { vegetarian: false, vegan: false, halal: false, kosher: false, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 'r141', name: 'Cuban Black Beans and Rice', cuisine: 'Cuban', prepTime: 30,
      ingredients: ['black beans', 'rice', 'onion', 'garlic', 'cumin', 'lime'],
      macros: { calories: 420, protein: 14, carbs: 76, fat: 6 },
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } }
  ];

  // ==================== Snack database ====================
  // Same tag shape as RECIPES so recipePassesRestrictions() works on both.
  var SNACKS = [
    { id: 's1', name: 'Greek Yogurt with Berries', calories: 150, protein: 15, carbs: 18, fat: 2,
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 's2', name: 'Apple with Peanut Butter', calories: 190, protein: 5, carbs: 25, fat: 8,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: true } },
    { id: 's3', name: 'Hummus and Carrots', calories: 150, protein: 5, carbs: 18, fat: 7,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 's4', name: 'Two Boiled Eggs', calories: 140, protein: 12, carbs: 1, fat: 10,
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 's5', name: 'Protein Shake', calories: 160, protein: 25, carbs: 8, fat: 3,
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 's6', name: 'Edamame (Steamed & Salted)', calories: 120, protein: 11, carbs: 9, fat: 5,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 's7', name: 'Rice Cakes with Almond Butter', calories: 180, protein: 5, carbs: 20, fat: 9,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: true } },
    { id: 's8', name: 'Mixed Nuts (Small Handful)', calories: 170, protein: 6, carbs: 6, fat: 15,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: true } },
    { id: 's9', name: 'Cottage Cheese with Pineapple', calories: 150, protein: 16, carbs: 14, fat: 3,
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 's10', name: 'Dark Chocolate Square', calories: 90, protein: 1, carbs: 9, fat: 6,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 's11', name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 's12', name: 'Roasted Chickpeas', calories: 140, protein: 6, carbs: 20, fat: 4,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 's13', name: 'String Cheese', calories: 80, protein: 7, carbs: 1, fat: 6,
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 's14', name: 'Celery with Peanut Butter', calories: 190, protein: 7, carbs: 12, fat: 14,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: true } },
    { id: 's15', name: 'Air-Popped Popcorn', calories: 110, protein: 3, carbs: 22, fat: 2,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 's16', name: 'Turkey & Cheese Roll-Ups', calories: 180, protein: 18, carbs: 2, fat: 11,
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: false, pescatarian: false, containsNuts: false } },
    { id: 's17', name: 'Trail Mix', calories: 210, protein: 5, carbs: 24, fat: 11,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: true } },
    { id: 's18', name: 'Smoked Salmon on Cucumber Rounds', calories: 120, protein: 12, carbs: 3, fat: 6,
      tags: { vegetarian: false, vegan: false, halal: true, kosher: false, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 's19', name: 'Cherry Tomatoes with Mozzarella Pearls', calories: 90, protein: 6, carbs: 4, fat: 6,
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 's20', name: 'Plain Rice Cake', calories: 35, protein: 1, carbs: 7, fat: 0,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 's21', name: 'Baby Carrots', calories: 35, protein: 1, carbs: 8, fat: 0,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 's22', name: 'Hard-Boiled Egg', calories: 70, protein: 6, carbs: 1, fat: 5,
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 's23', name: 'Cucumber Slices with Tzatziki', calories: 80, protein: 3, carbs: 8, fat: 4,
      tags: { vegetarian: true, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: false, pescatarian: true, containsNuts: false } },
    { id: 's24', name: 'Clementine', calories: 50, protein: 1, carbs: 12, fat: 0,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } },
    { id: 's25', name: 'Turkey Jerky', calories: 80, protein: 11, carbs: 3, fat: 1,
      tags: { vegetarian: false, vegan: false, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: false, containsNuts: false } },
    { id: 's26', name: 'Baked Kale Chips', calories: 90, protein: 3, carbs: 10, fat: 5,
      tags: { vegetarian: true, vegan: true, halal: true, kosher: true, glutenFree: true, dairyFree: true, pescatarian: true, containsNuts: false } }
  ];

  // ==================== Utilities ====================
  function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function capitalizeWords(s) {
    return String(s || '').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function clampNumber(n, min, max, fallback) {
    var v = Number(n);
    if (!isFinite(v)) return fallback;
    return Math.min(max, Math.max(min, v));
  }

  function on(el, type, handler) {
    if (!el) return;
    el.addEventListener(type, function (ev) {
      try {
        handler(ev);
      } catch (e) {
        console.warn('NourishMe: caught an error handling "' + type + '", the app keeps running.', e);
      }
    });
  }

  // ---- Unit conversions ----
  function lbToKg(lb) { return lb * 0.45359237; }
  function kgToLb(kg) { return kg / 0.45359237; }
  function ftInToCm(ft, inch) { return ((ft || 0) * 12 + (inch || 0)) * 2.54; }
  function cmToFtIn(cm) {
    var totalIn = cm / 2.54;
    var ft = Math.floor(totalIn / 12);
    var inch = Math.round(totalIn - ft * 12);
    if (inch === 12) { ft += 1; inch = 0; }
    return { ft: ft, inch: inch };
  }

  // ==================== Sample data ====================
  function buildSampleData() {
    return {
      profile: {
        age: 28,
        gender: 'male',
        nationality: 'Italian',
        weightKg: 75,
        weightUnit: 'kg',
        heightCm: 178,
        heightUnit: 'cm',
        activityLevel: 'moderate',
        restrictions: [],
        goal: 'muscle'
      },
      // Chosen to match well against Italian recipes specifically, since
      // nationality now hard-filters the recipe list to one cuisine - a
      // demo profile whose ingredients don't suit its own nationality would
      // load to an empty "What Can I Cook?" page.
      ingredients: ['spaghetti', 'garlic', 'olive oil', 'tomato', 'mozzarella', 'basil', 'bread', 'chili flakes', 'eggs', 'spinach'],
      log: {
        date: todayKey(),
        items: [
          { id: 'seed-log-1', name: 'Greek Yogurt with Berries', calories: 150, protein: 15, carbs: 18, fat: 2, addedAt: Date.now() },
          { id: 'seed-log-2', name: 'Grilled Chicken & Rice Bowl', calories: 520, protein: 42, carbs: 55, fat: 14, addedAt: Date.now() }
        ]
      },
      meta: { seeded: true, createdAt: Date.now() }
    };
  }

  // ==================== Date helpers ====================
  function todayKey() {
    var d = new Date();
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }

  function ensureLogFresh() {
    if (!state.log || state.log.date !== todayKey()) {
      state.log = { date: todayKey(), items: [] };
    }
  }

  // ==================== Storage ====================
  // Wrapped so ANY storage failure (blocked storage, private browsing,
  // sandboxed iframe, quota errors) degrades to an in-memory store instead
  // of ever throwing out to the app - persistence is a nice-to-have, the
  // page must always render.
  var memoryStore = {};
  var storageUsable = true;
  var safeStorage = {
    get: function (key) {
      if (storageUsable) {
        try { return window.localStorage.getItem(key); }
        catch (e) { storageUsable = false; console.warn('NourishMe: localStorage unavailable, using in-memory storage for this session.', e); }
      }
      return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
    },
    set: function (key, value) {
      if (storageUsable) {
        try { window.localStorage.setItem(key, value); return; }
        catch (e) { storageUsable = false; console.warn('NourishMe: localStorage unavailable, using in-memory storage for this session.', e); }
      }
      memoryStore[key] = value;
    }
  };

  var state = null;

  function loadState() {
    try {
      var raw = safeStorage.get(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.profile || !Array.isArray(parsed.ingredients)) return null;
      var p = parsed.profile;
      p.age = clampNumber(p.age, 10, 100, 28);
      p.gender = (p.gender === 'male' || p.gender === 'female') ? p.gender : 'unspecified';
      p.nationality = typeof p.nationality === 'string' ? p.nationality : '';
      p.weightKg = clampNumber(p.weightKg, 1, 400, 75);
      p.weightUnit = p.weightUnit === 'lb' ? 'lb' : 'kg';
      p.heightCm = clampNumber(p.heightCm, 1, 260, 178);
      p.heightUnit = p.heightUnit === 'ftin' ? 'ftin' : 'cm';
      p.activityLevel = ACTIVITY_FACTORS[p.activityLevel] ? p.activityLevel : 'moderate';
      p.restrictions = Array.isArray(p.restrictions) ? p.restrictions : [];
      p.goal = GOAL_LABELS[p.goal] ? p.goal : 'muscle';
      if (!parsed.log || typeof parsed.log !== 'object' || !Array.isArray(parsed.log.items)) {
        parsed.log = { date: todayKey(), items: [] };
      }
      return parsed;
    } catch (e) {
      console.warn('NourishMe: failed to load saved data, falling back to sample data.', e);
      return null;
    }
  }

  function saveState() {
    try { safeStorage.set(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { console.warn('NourishMe: failed to persist data.', e); }
  }

  function initState() {
    state = loadState();
    if (!state) state = buildSampleData();
    ensureLogFresh();
    saveState();
  }

  function hasProfile() {
    return !!(state.profile.age && state.profile.weightKg && state.profile.heightCm && state.profile.activityLevel);
  }

  // ==================== Calorie & macro engine ====================
  function computePlan(profile) {
    var kg = profile.weightKg, cm = profile.heightCm, age = profile.age;
    var bmrMale = 10 * kg + 6.25 * cm - 5 * age + 5;
    var bmrFemale = 10 * kg + 6.25 * cm - 5 * age - 161;
    var bmr;
    if (profile.gender === 'male') bmr = bmrMale;
    else if (profile.gender === 'female') bmr = bmrFemale;
    else bmr = (bmrMale + bmrFemale) / 2;

    var tdee = bmr * (ACTIVITY_FACTORS[profile.activityLevel] || ACTIVITY_FACTORS.sedentary);

    var goalAdjusted = tdee;
    if (profile.goal === 'lose' || profile.goal === 'leaner') goalAdjusted = tdee * 0.82;
    else if (profile.goal === 'gain' || profile.goal === 'muscle') goalAdjusted = tdee * 1.12;

    var floor = profile.gender === 'male' ? 1500 : profile.gender === 'female' ? 1200 : 1350;
    var clamped = goalAdjusted < floor;
    var target = clamped ? floor : goalAdjusted;

    // Shown target runs 200 kcal under the computed value - re-clamp to the
    // same safety floor afterward so this adjustment can never push someone
    // below it.
    target -= 200;
    if (target < floor) { target = floor; clamped = true; }

    var proteinPerKg = (profile.goal === 'muscle' || profile.goal === 'leaner') ? 1.8 : 1.4;
    var proteinG = proteinPerKg * kg;
    var fatCal = target * 0.27;
    var fatG = fatCal / 9;
    var carbCal = Math.max(0, target - proteinG * 4 - fatCal);
    var carbG = carbCal / 4;

    // Shown protein/carbs run a flat amount off the computed values (+20g
    // protein, -85g carbs) - same "adjust before showing" treatment as the
    // calorie target above. Fat is left as computed. Percentages are
    // recalculated from these final displayed grams so the ring always
    // matches the numbers next to it.
    proteinG += 20;
    carbG = Math.max(0, carbG - 85);

    var totalMacroCal = proteinG * 4 + fatCal + carbG * 4;
    var proteinPct = totalMacroCal > 0 ? Math.round((proteinG * 4 / totalMacroCal) * 100) : 0;
    var fatPct = totalMacroCal > 0 ? Math.round((fatCal / totalMacroCal) * 100) : 0;
    var carbPct = Math.max(0, 100 - proteinPct - fatPct);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      // Displayed calorie number runs 100 kcal above the computed target -
      // same "adjust only what's shown" treatment as the protein/carbs
      // offsets below; macros stay based on the pre-offset target.
      calories: Math.round(target + 100),
      clamped: clamped,
      protein: { g: Math.round(proteinG), pct: proteinPct },
      carbs: { g: Math.round(carbG), pct: carbPct },
      fat: { g: Math.round(fatG), pct: fatPct }
    };
  }

  function goalSummary(plan, goal) {
    var cal = plan.calories.toLocaleString();
    if (goal === 'muscle') return 'To build muscle, aim for ~' + cal + ' kcal with high protein to support your training.';
    if (goal === 'leaner') return 'To get leaner, aim for ~' + cal + ' kcal with high protein to protect muscle while you trim down.';
    if (goal === 'lose') return 'To lose weight steadily, aim for ~' + cal + ' kcal with balanced protein to help you stay satisfied.';
    return 'To gain weight, aim for ~' + cal + ' kcal — a steady surplus with plenty of protein.';
  }

  // ==================== Recipe matching ====================
  function normalizeIngredient(s) { return String(s || '').toLowerCase().trim().replace(/[.,!]/g, ''); }

  function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  // Strips a trailing plural "s"/"es"/"ies" so "egg" lines up with "eggs"
  // and "berry" with "berries" without needing exact string equality.
  function singularize(s) {
    if (s.length > 3 && s.slice(-3) === 'ies') return s.slice(0, -3) + 'y';
    if (s.length > 2 && s.slice(-2) === 'es') return s.slice(0, -2);
    if (s.length > 1 && s.slice(-1) === 's') return s.slice(0, -1);
    return s;
  }

  function ingredientMatches(userIng, recipeIng) {
    var a = normalizeIngredient(userIng), b = normalizeIngredient(recipeIng);
    if (!a || !b) return false;
    if (a === b) return true;

    var as = singularize(a), bs = singularize(b);
    if (as === bs) return true;

    // Word-boundary containment only (e.g. "olive" matches "olive oil"),
    // never raw substring - otherwise short ingredients falsely match inside
    // unrelated words ("rice" inside "iced", "pea" inside "peanut").
    return new RegExp('(^|\\s)' + escapeRegExp(as) + '(\\s|$)').test(bs) ||
      new RegExp('(^|\\s)' + escapeRegExp(bs) + '(\\s|$)').test(as);
  }

  function recipePassesRestrictions(recipe, restrictions) {
    if (!restrictions || !restrictions.length || restrictions.indexOf('none') !== -1) return true;
    return restrictions.every(function (r) {
      if (r === 'vegetarian') return recipe.tags.vegetarian;
      if (r === 'vegan') return recipe.tags.vegan;
      if (r === 'halal') return recipe.tags.halal;
      if (r === 'kosher') return recipe.tags.kosher;
      if (r === 'glutenFree') return recipe.tags.glutenFree;
      if (r === 'dairyFree') return recipe.tags.dairyFree;
      if (r === 'pescatarian') return recipe.tags.pescatarian;
      if (r === 'nutAllergy') return !recipe.tags.containsNuts;
      return true;
    });
  }

  function cuisineFromNationality(nationality) {
    var n = String(nationality || '').toLowerCase();
    if (!n) return null;
    for (var cuisine in CUISINE_KEYWORDS) {
      if (CUISINE_KEYWORDS[cuisine].some(function (kw) { return n.indexOf(kw) !== -1; })) return cuisine;
    }
    return null;
  }

  function goalFitScore(recipe, plan, goal) {
    var proteinRatio = (recipe.macros.protein * 4) / recipe.macros.calories;
    if (goal === 'muscle' || goal === 'leaner') return proteinRatio;
    if (!plan) return proteinRatio * 0.3;
    var idealPerMeal = plan.calories / 3;
    var normalizedDiff = Math.abs(recipe.macros.calories - idealPerMeal) / idealPerMeal;
    return proteinRatio * 0.3 - normalizedDiff * 0.5;
  }

  function getMatchedRecipes(state) {
    var profile = state.profile;
    var userIngredients = state.ingredients;
    var plan = hasProfile() ? computePlan(profile) : null;
    var favoredCuisine = cuisineFromNationality(profile.nationality);

    // Nationality maps to a cuisine (e.g. Indian -> only Indian recipes,
    // Japanese -> only Japanese recipes). An unrecognized or blank
    // nationality doesn't filter at all, so browsing still works.
    var byCuisine = favoredCuisine ? RECIPES.filter(function (r) { return r.cuisine === favoredCuisine; }) : RECIPES;
    var filtered = byCuisine.filter(function (r) { return recipePassesRestrictions(r, profile.restrictions); });

    var scored = filtered.map(function (recipe) {
      var have = recipe.ingredients.filter(function (ing) {
        return userIngredients.some(function (u) { return ingredientMatches(u, ing); });
      });
      var missing = recipe.ingredients.filter(function (ing) { return have.indexOf(ing) === -1; });
      var score = goalFitScore(recipe, plan, profile.goal);
      return { recipe: recipe, have: have, missing: missing, canMake: missing.length === 0, score: score };
    });

    var haveAnyIngredients = userIngredients.length > 0;
    // Any recipe that uses at least one searched ingredient shows up -
    // sorting (below) still puts full matches first, then closest matches
    // (fewest missing), so the more relevant results surface at the top
    // without hiding recipes just because several ingredients are missing.
    var candidates = haveAnyIngredients
      ? scored.filter(function (s) { return s.canMake || s.have.length > 0; })
      : scored;

    candidates.sort(function (a, b) {
      if (haveAnyIngredients) {
        if (a.canMake !== b.canMake) return a.canMake ? -1 : 1;
        if (a.missing.length !== b.missing.length) return a.missing.length - b.missing.length;
      }
      return b.score - a.score;
    });

    var topScore = candidates.length ? Math.max.apply(null, candidates.map(function (c) { return c.score; })) : 0;
    var badgeCount = 0;
    candidates.forEach(function (c) {
      c.badge = plan && c.score > 0.15 && badgeCount < 3 && c.score >= topScore - 0.12;
      if (c.badge) badgeCount++;
    });

    return { candidates: candidates, haveAnyIngredients: haveAnyIngredients, plan: plan, favoredCuisine: favoredCuisine };
  }

  // ==================== UI state ====================
  var uiState = { view: 'plan', heightUnit: null, weightUnit: null, snackCeiling: 200, surpriseId: null };

  // ==================== Plan render ====================
  function renderRestrictionGrid() {
    var el = document.getElementById('restriction-grid');
    el.innerHTML = RESTRICTIONS.map(function (r) {
      var checked = state.profile.restrictions.indexOf(r.id) !== -1;
      return '<label class="restriction-chip' + (checked ? ' checked' : '') + '" data-restriction="' + r.id + '">' +
        '<input type="checkbox" value="' + r.id + '" ' + (checked ? 'checked' : '') + ' />' +
        '<span>' + escapeHtml(r.label) + '</span>' +
      '</label>';
    }).join('');

    el.querySelectorAll('.restriction-chip').forEach(function (chip) {
      var checkbox = chip.querySelector('input');
      on(checkbox, 'change', function () {
        var id = checkbox.value;
        if (id === 'none' && checkbox.checked) {
          state.profile.restrictions = ['none'];
        } else {
          state.profile.restrictions = state.profile.restrictions.filter(function (r) { return r !== 'none'; });
          if (checkbox.checked) state.profile.restrictions.push(id);
          else state.profile.restrictions = state.profile.restrictions.filter(function (r) { return r !== id; });
        }
        saveState();
        renderRestrictionGrid();
        renderCookView();
        renderSnackView();
      });
    });
  }

  function populateFormFromState() {
    var p = state.profile;
    document.getElementById('f-age').value = p.age;
    document.getElementById('f-gender').value = p.gender;
    document.getElementById('f-nationality').value = p.nationality;
    document.getElementById('f-activity').value = p.activityLevel;
    document.getElementById('f-goal').value = p.goal;

    uiState.weightUnit = p.weightUnit;
    uiState.heightUnit = p.heightUnit;
    setWeightUnitUI(p.weightUnit, false);
    setHeightUnitUI(p.heightUnit, false);
    syncWeightInput();
    syncHeightInput();
    renderRestrictionGrid();
  }

  function syncWeightInput() {
    var input = document.getElementById('f-weight');
    var kg = state.profile.weightKg;
    input.value = uiState.weightUnit === 'lb' ? round1(kgToLb(kg)) : round1(kg);
  }

  function syncHeightInput() {
    var cm = state.profile.heightCm;
    if (uiState.heightUnit === 'cm') {
      document.getElementById('f-height-cm').value = round1(cm);
    } else {
      var ftin = cmToFtIn(cm);
      document.getElementById('f-height-ft').value = ftin.ft;
      document.getElementById('f-height-in').value = ftin.inch;
    }
  }

  function round1(n) { return Math.round(n * 10) / 10; }

  function setWeightUnitUI(unit, convertDisplay) {
    uiState.weightUnit = unit;
    document.querySelectorAll('#weight-unit-toggle .unit-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.unit === unit);
    });
    document.getElementById('f-weight').placeholder = unit === 'lb' ? 'lb' : 'kg';
    if (convertDisplay) syncWeightInput();
  }

  function setHeightUnitUI(unit, convertDisplay) {
    uiState.heightUnit = unit;
    document.querySelectorAll('#height-unit-toggle .unit-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.unit === unit);
    });
    document.getElementById('f-height-cm').hidden = unit !== 'cm';
    document.getElementById('height-ftin-inputs').hidden = unit !== 'ftin';
    if (convertDisplay) syncHeightInput();
  }

  function readFormIntoState() {
    var p = state.profile;
    p.age = clampNumber(document.getElementById('f-age').value, 10, 100, p.age);
    p.gender = document.getElementById('f-gender').value;
    p.nationality = document.getElementById('f-nationality').value.trim();
    p.activityLevel = document.getElementById('f-activity').value;
    p.goal = document.getElementById('f-goal').value;

    p.weightUnit = uiState.weightUnit;
    var weightRaw = Number(document.getElementById('f-weight').value);
    if (isFinite(weightRaw) && weightRaw > 0) {
      p.weightKg = uiState.weightUnit === 'lb' ? lbToKg(weightRaw) : weightRaw;
    }

    p.heightUnit = uiState.heightUnit;
    if (uiState.heightUnit === 'cm') {
      var heightRaw = Number(document.getElementById('f-height-cm').value);
      if (isFinite(heightRaw) && heightRaw > 0) p.heightCm = heightRaw;
    } else {
      var ft = Number(document.getElementById('f-height-ft').value) || 0;
      var inch = Number(document.getElementById('f-height-in').value) || 0;
      var cm = ftInToCm(ft, inch);
      if (cm > 0) p.heightCm = cm;
    }
  }

  function renderResult() {
    var card = document.getElementById('result-card');
    var plan = computePlan(state.profile);
    var colors = { protein: 'var(--protein)', carbs: 'var(--carbs)', fat: 'var(--fat)' };
    var p1 = plan.protein.pct, p2 = p1 + plan.carbs.pct;
    var ring = 'conic-gradient(' +
      colors.protein + ' 0% ' + p1 + '%, ' +
      colors.carbs + ' ' + p1 + '% ' + p2 + '%, ' +
      colors.fat + ' ' + p2 + '% 100%)';

    card.innerHTML =
      '<h2 class="card-title">🎯 Your daily target</h2>' +
      '<div class="result-top">' +
        '<div class="calorie-block">' +
          '<div class="calorie-number">' + plan.calories.toLocaleString() + '</div>' +
          '<div class="calorie-unit">kcal / day</div>' +
          (plan.clamped ? '<p class="calorie-clamped-note">We\'ve kept this at a safe minimum rather than going lower.</p>' : '') +
        '</div>' +
        '<div class="macro-ring-wrap">' +
          '<div class="macro-ring" style="background:' + ring + '"></div>' +
          '<div class="macro-ring-hole"><span class="ring-cal">' + plan.calories.toLocaleString() + '</span><span class="ring-label">kcal</span></div>' +
        '</div>' +
        '<div class="macro-legend">' +
          macroLegendRow('Protein', plan.protein, 'var(--protein)') +
          macroLegendRow('Carbs', plan.carbs, 'var(--carbs)') +
          macroLegendRow('Fat', plan.fat, 'var(--fat)') +
        '</div>' +
      '</div>' +
      '<p class="result-summary">' + escapeHtml(goalSummary(plan, state.profile.goal)) + '</p>' +
      '<p class="result-disclaimer">This is general guidance, not medical or dietary advice. For a plan tailored to you, talk to a doctor or registered dietitian.</p>';
  }

  function macroLegendRow(name, macro, color) {
    return '<div class="macro-legend-item">' +
      '<span class="macro-dot" style="background:' + color + '"></span>' +
      '<span class="macro-legend-name">' + name + '</span>' +
      '<span class="macro-legend-grams">' + macro.g + 'g</span>' +
      '<span class="macro-legend-pct">' + macro.pct + '%</span>' +
    '</div>';
  }

  function renderPlanView() {
    populateFormFromState();
    renderResult();
  }

  // ==================== Cook render ====================
  function renderIngredientChips() {
    var el = document.getElementById('ingredient-chips');
    if (!state.ingredients.length) {
      el.innerHTML = '<div class="ingredient-empty">No ingredients yet — add what\'s in your kitchen above.</div>';
      return;
    }
    el.innerHTML = state.ingredients.map(function (ing, i) {
      return '<span class="ingredient-chip">' + escapeHtml(capitalizeWords(ing)) + '<button type="button" data-index="' + i + '" aria-label="Remove">✕</button></span>';
    }).join('');
    el.querySelectorAll('button').forEach(function (btn) {
      on(btn, 'click', function () {
        state.ingredients.splice(Number(btn.dataset.index), 1);
        saveState();
        renderIngredientChips();
        renderRecipeGrid();
      });
    });
  }

  function renderPlanNudge() {
    var el = document.getElementById('plan-nudge');
    el.hidden = hasProfile();
  }

  function renderRecipeGrid() {
    var match = getMatchedRecipes(state);
    var grid = document.getElementById('recipe-grid');
    var meta = document.getElementById('cook-meta-row');

    var metaBits = [];
    if (match.favoredCuisine) metaBits.push('Showing ' + match.favoredCuisine + ' recipes for your nationality');
    if (!match.haveAnyIngredients) metaBits.push('Add ingredients above to narrow this down — showing all matches for now.');
    if (state.profile.restrictions.length && state.profile.restrictions.indexOf('none') === -1) {
      var labels = state.profile.restrictions.map(function (id) {
        var r = RESTRICTIONS.filter(function (x) { return x.id === id; })[0];
        return r ? r.label : id;
      });
      metaBits.push('Filtered by: ' + labels.join(', '));
    }
    meta.textContent = metaBits.join(' · ');

    if (!match.candidates.length) {
      var hint = match.favoredCuisine
        ? 'No ' + match.favoredCuisine + ' recipes fit your dietary restrictions and ingredients right now. Try adding a few more ingredients, loosening a restriction, or changing your nationality in Your Plan.'
        : 'No recipes match your current filters. Try loosening a dietary restriction or adding a few more ingredients.';
      grid.innerHTML = '<div class="empty-state">' + escapeHtml(hint) + ' 🍽️</div>';
      return;
    }

    grid.innerHTML = groupCandidatesByCuisine(match.candidates, match.favoredCuisine).map(function (group) {
      var cards = group.items.map(function (c) {
        var r = c.recipe;
        var ingredientTags = r.ingredients.map(function (ing) {
          var got = c.have.indexOf(ing) !== -1;
          return '<span class="ing-tag ' + (got ? 'have' : 'missing') + '">' + escapeHtml(capitalizeWords(ing)) + '</span>';
        }).join('');

        var missingNote = '';
        if (match.haveAnyIngredients) {
          missingNote = c.canMake
            ? '<p class="missing-note ready">✓ You have everything for this</p>'
            : '<p class="missing-note">Missing: ' + escapeHtml(c.missing.map(capitalizeWords).join(', ')) + '</p>';
        }

        var dietTags = dietTagList(r.tags).map(function (t) { return '<span class="diet-tag">' + t + '</span>'; }).join('');

        return '<div class="recipe-card">' +
          '<div class="recipe-header">' +
            '<div>' +
              '<h3 class="recipe-name">' + escapeHtml(r.name) + '</h3>' +
              '<p class="recipe-meta">' + escapeHtml(r.cuisine) + ' · ' + r.prepTime + ' min</p>' +
            '</div>' +
            (c.badge ? '<span class="goal-badge">Great for your goal</span>' : '') +
          '</div>' +
          missingNote +
          '<div class="recipe-ingredients">' + ingredientTags + '</div>' +
          '<div class="recipe-macros">' +
            macroStat('Cal', r.macros.calories, '', 'cal') +
            macroStat('Protein', r.macros.protein, 'g', 'protein') +
            macroStat('Carbs', r.macros.carbs, 'g', 'carbs') +
            macroStat('Fat', r.macros.fat, 'g', 'fat') +
          '</div>' +
          (dietTags ? '<div class="diet-tags">' + dietTags + '</div>' : '') +
          '<button type="button" class="btn btn-ghost btn-block add-log-btn" data-kind="recipe" data-id="' + r.id + '">+ Add to today\'s log</button>' +
        '</div>';
      }).join('');

      return '<div class="cuisine-section">' +
        '<div class="cuisine-section-heading">' +
          '<span class="cuisine-name">' + escapeHtml(group.cuisine) + '</span>' +
          '<span class="cuisine-count">' + group.items.length + (group.items.length === 1 ? ' recipe' : ' recipes') + '</span>' +
        '</div>' +
        '<div class="recipe-subgrid">' + cards + '</div>' +
      '</div>';
    }).join('');

    wireAddToLogButtons(grid);
  }

  function groupCandidatesByCuisine(candidates, favoredCuisine) {
    var order = [];
    var byCuisine = {};
    candidates.forEach(function (c) {
      var cuisine = c.recipe.cuisine;
      if (!byCuisine[cuisine]) {
        byCuisine[cuisine] = [];
        order.push(cuisine);
      }
      byCuisine[cuisine].push(c);
    });

    order.sort(function (a, b) {
      if (a === favoredCuisine) return -1;
      if (b === favoredCuisine) return 1;
      if (byCuisine[b].length !== byCuisine[a].length) return byCuisine[b].length - byCuisine[a].length;
      return a.localeCompare(b);
    });

    return order.map(function (cuisine) {
      return { cuisine: cuisine, items: byCuisine[cuisine] };
    });
  }

  function macroStat(label, value, unit, cls) {
    return '<div class="macro-stat"><span class="macro-stat-label ' + cls + '">' + label + '</span><span class="macro-stat-value">' + value + unit + '</span></div>';
  }

  function dietTagList(tags) {
    var out = [];
    if (tags.vegan) out.push('Vegan');
    else if (tags.vegetarian) out.push('Vegetarian');
    if (tags.pescatarian && !tags.vegetarian) out.push('Pescatarian');
    if (tags.glutenFree) out.push('Gluten-free');
    if (tags.dairyFree) out.push('Dairy-free');
    if (tags.halal) out.push('Halal');
    if (tags.containsNuts) out.push('Contains nuts');
    return out;
  }

  function renderCookView() {
    renderIngredientChips();
    renderPlanNudge();
    renderRecipeGrid();
  }

  // ==================== Add-to-log wiring (shared by recipes & snacks) ====================
  function wireAddToLogButtons(container) {
    container.querySelectorAll('.add-log-btn').forEach(function (btn) {
      on(btn, 'click', function () {
        var kind = btn.dataset.kind;
        var id = btn.dataset.id;
        var source = kind === 'snack' ? SNACKS : RECIPES;
        var item = source.filter(function (x) { return x.id === id; })[0];
        if (!item) return;
        var macros = kind === 'snack' ? item : item.macros;
        addToLog({ name: item.name, calories: macros.calories, protein: macros.protein, carbs: macros.carbs, fat: macros.fat });

        var original = btn.textContent;
        btn.textContent = 'Added ✓';
        btn.disabled = true;
        setTimeout(function () {
          try {
            btn.textContent = original;
            btn.disabled = false;
          } catch (e) { /* button may no longer be in the DOM after a re-render */ }
        }, 1400);
      });
    });
  }

  function addToLog(entry) {
    ensureLogFresh();
    state.log.items.push({
      id: uid(),
      name: entry.name,
      calories: Math.max(0, Math.round(entry.calories) || 0),
      protein: Math.max(0, Math.round(entry.protein) || 0),
      carbs: Math.max(0, Math.round(entry.carbs) || 0),
      fat: Math.max(0, Math.round(entry.fat) || 0),
      addedAt: Date.now()
    });
    saveState();
  }

  // ==================== Snack finder ====================
  function getMatchedSnacks(state, ceiling) {
    var profile = state.profile;
    var filtered = SNACKS.filter(function (s) {
      return s.calories <= ceiling && recipePassesRestrictions(s, profile.restrictions);
    });

    var highlightProtein = profile.goal === 'muscle' || profile.goal === 'leaner';
    var scored = filtered.map(function (s) {
      return { snack: s, ratio: (s.protein * 4) / s.calories };
    });

    scored.sort(function (a, b) {
      if (highlightProtein) return b.ratio - a.ratio;
      return a.snack.calories - b.snack.calories;
    });

    var badgeCount = 0;
    scored.forEach(function (c) {
      c.badge = highlightProtein && badgeCount < 3 && c.ratio > 0.32;
      if (c.badge) badgeCount++;
    });

    return scored;
  }

  function renderSnackView() {
    var grid = document.getElementById('snack-grid');
    var meta = document.getElementById('snack-meta-row');
    var scored = getMatchedSnacks(state, uiState.snackCeiling);

    var metaBits = ['Showing snacks under ' + uiState.snackCeiling + ' kcal'];
    if (state.profile.restrictions.length && state.profile.restrictions.indexOf('none') === -1) {
      var labels = state.profile.restrictions.map(function (id) {
        var r = RESTRICTIONS.filter(function (x) { return x.id === id; })[0];
        return r ? r.label : id;
      });
      metaBits.push('Filtered by: ' + labels.join(', '));
    }
    meta.textContent = metaBits.join(' · ');

    if (!scored.length) {
      grid.innerHTML = '<div class="empty-state">No snacks fit that limit and your dietary restrictions right now. Try a higher calorie limit. 🍽️</div>';
      return;
    }

    grid.innerHTML = scored.map(function (c) {
      var s = c.snack;
      var dietTags = dietTagList(s.tags).map(function (t) { return '<span class="diet-tag">' + t + '</span>'; }).join('');
      var highlightClass = (uiState.surpriseId === s.id) ? ' snack-highlight' : '';

      return '<div class="recipe-card' + highlightClass + '" data-snack-card="' + s.id + '">' +
        '<div class="recipe-header">' +
          '<div>' +
            '<h3 class="recipe-name">' + escapeHtml(s.name) + '</h3>' +
            '<p class="recipe-meta">' + s.calories + ' kcal</p>' +
          '</div>' +
          (c.badge ? '<span class="goal-badge">Great for your goal</span>' : '') +
        '</div>' +
        '<div class="recipe-macros">' +
          macroStat('Cal', s.calories, '', 'cal') +
          macroStat('Protein', s.protein, 'g', 'protein') +
          macroStat('Carbs', s.carbs, 'g', 'carbs') +
          macroStat('Fat', s.fat, 'g', 'fat') +
        '</div>' +
        (dietTags ? '<div class="diet-tags">' + dietTags + '</div>' : '') +
        '<button type="button" class="btn btn-ghost btn-block add-log-btn" data-kind="snack" data-id="' + s.id + '">+ Add to today\'s log</button>' +
      '</div>';
    }).join('');

    wireAddToLogButtons(grid);

    if (uiState.surpriseId) {
      var el = grid.querySelector('[data-snack-card="' + uiState.surpriseId + '"]');
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      var idToClear = uiState.surpriseId;
      setTimeout(function () {
        if (uiState.surpriseId === idToClear) {
          uiState.surpriseId = null;
          renderSnackView();
        }
      }, 2200);
    }
  }

  // ==================== Today's log ====================
  function computeLogTotals() {
    var totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    state.log.items.forEach(function (it) {
      totals.calories += it.calories || 0;
      totals.protein += it.protein || 0;
      totals.carbs += it.carbs || 0;
      totals.fat += it.fat || 0;
    });
    return totals;
  }

  function progressRow(label, current, target, unit, color) {
    var pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    var over = current > target;
    var fillColor = over ? 'var(--red)' : color;
    return '<div class="progress-row">' +
      '<div class="progress-row-top">' +
        '<span class="progress-label" style="color:' + color + '">' + label + '</span>' +
        '<span class="progress-value">' + Math.round(current) + unit + ' / ' + Math.round(target) + unit + '</span>' +
      '</div>' +
      '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%; background:' + fillColor + '"></div></div>' +
    '</div>';
  }

  function totalsOnlyRow(label, current, unit, color) {
    return '<div class="progress-row">' +
      '<div class="progress-row-top">' +
        '<span class="progress-label" style="color:' + color + '">' + label + '</span>' +
        '<span class="progress-value">' + Math.round(current) + unit + '</span>' +
      '</div>' +
    '</div>';
  }

  function renderLogView() {
    ensureLogFresh();
    var card = document.getElementById('log-summary-card');
    var plan = hasProfile() ? computePlan(state.profile) : null;
    var totals = computeLogTotals();

    if (plan) {
      var rows =
        progressRow('Calories', totals.calories, plan.calories, '', 'var(--green)') +
        progressRow('Protein', totals.protein, plan.protein.g, 'g', 'var(--protein)') +
        progressRow('Carbs', totals.carbs, plan.carbs.g, 'g', 'var(--carbs)') +
        progressRow('Fat', totals.fat, plan.fat.g, 'g', 'var(--fat)');

      var remaining = plan.calories - totals.calories;
      var status = remaining >= 0
        ? remaining.toLocaleString() + ' kcal left today — you\'re on track.'
        : Math.abs(remaining).toLocaleString() + ' kcal over today\'s target — that\'s alright, tomorrow is a fresh start.';

      card.innerHTML =
        '<h2 class="card-title">🎯 Today vs your target</h2>' +
        '<div class="log-progress-rows">' + rows + '</div>' +
        '<p class="result-summary">' + escapeHtml(status) + '</p>';
    } else {
      card.innerHTML =
        '<h2 class="card-title">🎯 Today\'s totals</h2>' +
        '<p class="ingredient-empty">Fill in <button type="button" class="link-btn" id="log-plan-link">Your Plan</button> to see today\'s target alongside what you\'ve logged.</p>' +
        '<div class="log-progress-rows">' +
          totalsOnlyRow('Calories', totals.calories, '', 'var(--green)') +
          totalsOnlyRow('Protein', totals.protein, 'g', 'var(--protein)') +
          totalsOnlyRow('Carbs', totals.carbs, 'g', 'var(--carbs)') +
          totalsOnlyRow('Fat', totals.fat, 'g', 'var(--fat)') +
        '</div>';
      on(document.getElementById('log-plan-link'), 'click', function () { switchView('plan'); });
    }

    renderLogItemsList();
  }

  function renderLogItemsList() {
    var el = document.getElementById('log-items-list');
    if (!state.log.items.length) {
      el.innerHTML = '<div class="ingredient-empty">Nothing logged yet today — add a meal, a snack, or use Quick add below.</div>';
      return;
    }
    el.innerHTML = state.log.items.map(function (it) {
      return '<div class="log-item">' +
        '<div class="log-item-main">' +
          '<span class="log-item-name">' + escapeHtml(it.name) + '</span>' +
          '<span class="log-item-macros">' + it.calories + ' cal · P ' + it.protein + 'g · C ' + it.carbs + 'g · F ' + it.fat + 'g</span>' +
        '</div>' +
        '<button type="button" class="log-item-remove" data-id="' + it.id + '" aria-label="Remove">✕</button>' +
      '</div>';
    }).join('');
    el.querySelectorAll('.log-item-remove').forEach(function (btn) {
      on(btn, 'click', function () {
        state.log.items = state.log.items.filter(function (it) { return it.id !== btn.dataset.id; });
        saveState();
        renderLogView();
      });
    });
  }

  // ==================== Static event wiring ====================
  function wireStaticEvents() {
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      on(btn, 'click', function () { switchView(btn.dataset.view); });
    });
    on(document.getElementById('plan-nudge-link'), 'click', function () { switchView('plan'); });

    document.querySelectorAll('#weight-unit-toggle .unit-btn').forEach(function (btn) {
      on(btn, 'click', function () {
        readFormIntoState();
        setWeightUnitUI(btn.dataset.unit, true);
      });
    });
    document.querySelectorAll('#height-unit-toggle .unit-btn').forEach(function (btn) {
      on(btn, 'click', function () {
        readFormIntoState();
        setHeightUnitUI(btn.dataset.unit, true);
      });
    });

    on(document.getElementById('plan-form'), 'submit', function (ev) {
      ev.preventDefault();
      readFormIntoState();
      saveState();
      renderResult();
      renderCookView();
      renderSnackView();
      renderLogView();
    });

    on(document.getElementById('ingredient-form'), 'submit', function (ev) {
      ev.preventDefault();
      var input = document.getElementById('f-ingredient');
      var val = input.value.trim();
      if (!val) return;
      if (!state.ingredients.some(function (i) { return normalizeIngredient(i) === normalizeIngredient(val); })) {
        state.ingredients.push(val);
        saveState();
      }
      input.value = '';
      renderIngredientChips();
      renderRecipeGrid();
    });

    on(document.getElementById('reset-btn'), 'click', function () {
      if (!confirm('Reset all data to sample data? This will erase your current plan and ingredients.')) return;
      state = buildSampleData();
      saveState();
      renderPlanView();
      renderCookView();
      renderSnackView();
      renderLogView();
    });

    document.querySelectorAll('#snack-ceiling-toggle .unit-btn').forEach(function (btn) {
      on(btn, 'click', function () {
        uiState.snackCeiling = Number(btn.dataset.ceiling);
        document.querySelectorAll('#snack-ceiling-toggle .unit-btn').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        renderSnackView();
      });
    });

    on(document.getElementById('surprise-btn'), 'click', function () {
      var pool = getMatchedSnacks(state, uiState.snackCeiling);
      if (!pool.length) return;
      var pick = pool[Math.floor(Math.random() * pool.length)];
      uiState.surpriseId = pick.snack.id;
      renderSnackView();
    });

    on(document.getElementById('quick-add-form'), 'submit', function (ev) {
      ev.preventDefault();
      var name = document.getElementById('qa-name').value.trim();
      var calories = Number(document.getElementById('qa-calories').value);
      if (!name || !isFinite(calories) || calories < 0) return;
      var protein = Number(document.getElementById('qa-protein').value) || 0;
      var carbs = Number(document.getElementById('qa-carbs').value) || 0;
      var fat = Number(document.getElementById('qa-fat').value) || 0;
      addToLog({ name: name, calories: calories, protein: protein, carbs: carbs, fat: fat });
      ev.target.reset();
      renderLogView();
    });

    on(document.getElementById('clear-log-btn'), 'click', function () {
      if (!confirm('Clear everything logged today?')) return;
      state.log = { date: todayKey(), items: [] };
      saveState();
      renderLogView();
    });
  }

  function switchView(view) {
    uiState.view = view;
    document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.view === view); });
    document.getElementById('plan-view').classList.toggle('hidden', view !== 'plan');
    document.getElementById('cook-view').classList.toggle('hidden', view !== 'cook');
    document.getElementById('snack-view').classList.toggle('hidden', view !== 'snack');
    document.getElementById('log-view').classList.toggle('hidden', view !== 'log');
    document.getElementById('about-view').classList.toggle('hidden', view !== 'about');
    if (view === 'cook') renderCookView();
    if (view === 'snack') renderSnackView();
    if (view === 'log') renderLogView();
  }

  // ==================== Init ====================
  window.addEventListener('error', function (event) {
    console.warn('NourishMe: caught an unexpected error.', event.error || event.message);
  });
  window.addEventListener('unhandledrejection', function (event) {
    console.warn('NourishMe: caught an unhandled promise rejection.', event.reason);
    if (event.preventDefault) event.preventDefault();
  });

  function init() {
    try {
      initState();
      wireStaticEvents();
      renderPlanView();
      renderCookView();
      renderSnackView();
      renderLogView();
    } catch (e) {
      console.error('NourishMe: startup error, resetting to sample data.', e);
      try {
        state = buildSampleData();
        saveState();
        renderPlanView();
        renderCookView();
        renderSnackView();
        renderLogView();
      } catch (e2) {
        console.error('NourishMe: failed to recover after startup error.', e2);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
