// ================= FOOD DATABASE =================
// [id, name, portion, kcal, protein, carbs, fat, type] type: v veg, e egg, n non-veg, t treat(veg), tn treat non-veg, te treat egg
const CATS = {
  all:'All foods', custom:'Custom / what we ate', mine:'My foods', bf:'Breakfast', carb:'Rice, roti, millets', prot:'Protein', veg:'Vegetables', side:'Dal, rasam, sides', treat:'Treat meals', snack:'Snacks', fruit:'Fruit', drink:'Drinks & tablets', gym:'Gym'
};
const RAW = {
bf:[
['b_idli2','Idli with sambar','2 idli + 150 g sambar',220,8,40,2,'v'],
['b_idli3','Idli with chutney','3 idli',260,7,48,4,'v'],
['b_dosa1','Plain dosa with chutney (1 tsp oil)','1 dosa',200,5,30,7,'v'],
['b_dosa2','Plain dosa with chutney','2 dosa',400,10,60,14,'v'],
['b_mdosa','Masala dosa','1',320,7,50,10,'v'],
['b_pesarattu','Pesarattu with ginger chutney','2 small',260,12,36,7,'v'],
['b_upma','Rava upma with veg','40 g rava dry',180,4,32,4,'v'],
['b_mupma','Millet upma (foxtail rava)','40 g dry',150,4,30,2,'v'],
['b_poha','Poha with peanuts','40 g dry',200,5,32,6,'v'],
['b_chilla','Moong dal chilla with curd','2 + 100 g curd',300,17,36,8,'v'],
['b_ragi','Ragi java (ragi malt) with 3% milk','30 g + 200 ml',240,10,36,8,'v'],
['b_oats','Oats cooked in water','40 g dry',150,5,27,3,'v'],
['b_oatsmilk','Oats with 3% milk','40 g + 200 ml',260,12,38,9,'v'],
['b_oatsnuts','Oats with nuts and 3% milk','40 g + 20 g nuts + 200 ml',380,16,42,19,'v'],
['b_oatswhey','Oats with whey and berries','40 g + 30 g whey + 100 g berries',320,30,45,5,'v'],
['b_ovn','Overnight oats with Greek yogurt and berries','40 g + 100 g + 50 g',330,20,48,5,'v'],
['b_granola','Granola with 3% milk','50 g + 200 ml',350,12,50,13,'v'],
['b_granolasmall','Granola with 3% milk, small','30 g + 150 ml',215,7,30,8,'v'],
['b_granolanuts','Granola 30 g + nuts 15 g + 3% milk 200 ml','',320,13,35,16,'v'],
['b_granolaberries','Granola 40 g + frozen berries 100 g + 3% milk 200 ml','',350,12,50,11,'v'],
['b_nutsberriesyog','Greek yogurt 170 g + nuts 20 g + berries 50 g','',255,21,13,10,'v'],
['b_granolagy','Granola with Greek yogurt and berries','40 g + 170 g + 50 g',330,24,42,8,'v'],
['b_eggs32','Free-range eggs, boiled: 3 whole + 2 whites','3 whole eggs + 2 whites (about 200 g)',250,26,2,15,'e'],
['b_eggs22','Free-range eggs, boiled: 2 whole + 2 whites','2 whole eggs + 2 whites (about 150 g)',210,19,1,10,'e'],
['b_eggs2','Free-range eggs, boiled: 2 whole','2 whole eggs (about 100 g)',140,12,1,10,'e'],
['b_omelette','Free-range veg omelette: 2 whole + 3 whites','2 whole eggs + 3 whites, 100 g veg',220,24,4,11,'e'],
['b_whites','Egg whites 5 + 1 whole, scrambled','5 whites + 1 whole egg',160,24,1,5,'e'],
['b_bhurji','Egg bhurji: 2 whole + 2 whites','2 whole eggs + 2 whites',200,19,3,11,'e'],
['b_pbhurji','Paneer bhurji (low-fat paneer)','100 g',260,18,6,18,'v'],
['b_toastpb','Whole wheat toast with peanut butter','2 slices + 1 tbsp',250,11,30,10,'v'],
['b_toasteggs','Whole wheat toast with 2 boiled eggs','2 slices',300,20,30,12,'e'],
['b_toastavo','Avocado toast','2 slices + half avocado',280,9,32,14,'v'],
['b_toast','Whole wheat toast, plain','2 slices',160,8,28,2,'v'],
['b_toastcheese','Whole wheat toast with cheese slice','2 slices + 20 g',240,13,28,9,'v'],
['b_ppancake','Protein pancakes (oats, 1 egg, 3 whites, half banana)','3 small',350,28,42,7,'e'],
['b_pancake','Regular pancakes with maple syrup','2 medium + 1 tbsp',380,8,60,10,'t'],
['b_puri','Puri with aloo kurma','2 puri + 100 g',420,7,50,20,'t'],
['b_rotibhurji','Roti with egg bhurji (2 whole + 2 whites)','2 roti',400,27,44,12,'e'],
['b_rotipaneer','Roti with paneer bhurji','2 roti + 80 g',390,22,44,14,'v'],
['b_gyberries','Greek yogurt with berries','200 g + 100 g',180,21,15,1,'v'],
['b_wheymilk','Whey with 3% milk and banana','30 g + 200 ml + 1',340,32,40,8,'v'],
['b_smoothie','Green smoothie: whey, spinach, half banana, 3% milk','30 g whey, 50 g spinach, half banana, 200 ml milk',280,30,22,8,'v'],
['b_sprouts','Sprouts chaat','150 g',150,10,24,2,'v'],
['b_berries','Berries (blueberry, strawberry)','100 g',50,1,12,0,'v'],
['b_nuts','Almonds and walnuts','20 g',120,4,4,10,'v'],
['b_idlieggs','2 idli + 2 free-range eggs (boiled)','2 idli + 2 eggs',260,16,25,10,'e'],
['b_dosaeggs','1 dosa + 2 free-range eggs','1 dosa + 2 eggs',340,17,31,17,'e'],
['b_pohaeggs','Poha + 2 free-range eggs','40 g dry + 2 eggs',340,17,33,16,'e'],
['b_upmaeggs','Upma + 2 free-range eggs','40 g rava + 2 eggs',320,16,33,14,'e'],
['b_idliwhey','2 idli + sambar + whey shake','2 idli + 150 g sambar + 30 g whey',340,32,43,3,'v'],
['b_dosawhey','1 dosa + whey shake','1 dosa + 30 g whey',320,29,33,8,'v'],
['b_pesarattuwhey','Pesarattu 2 + whey shake','2 small + 30 g whey',380,36,39,8,'v'],
['b_pohawhey','Poha + whey shake','40 g dry + 30 g whey',320,29,35,7,'v'],
['b_upmacurd','Upma + curd','40 g rava + 150 g curd',270,10,39,7,'v'],
['b_breadmaple','Whole wheat bread with maple syrup','2 slices + 1 tbsp',215,8,44,2,'t'],
['b_breadmapleeggs','Bread with maple syrup + 2 free-range eggs','2 slices + 1 tbsp + 2 eggs',355,20,45,12,'te'],
['b_bananagy','Banana + Greek yogurt 170 g + nuts 15 g','',300,20,37,10,'v'],
['b_fruitbowl','Fruit bowl: banana, apple, papaya + nuts 15 g','300 g fruit + 15 g nuts',330,5,65,8,'v'],
['b_fruitwhey','Fruit bowl 200 g + whey shake','200 g fruit + 30 g whey',240,26,35,2,'v'],
['b_oatsmilkchia','Oats in 3% milk with chia and frozen berries','40 g + 200 ml + 10 g chia + 50 g berries',345,15,46,12,'v'],
['b_oatsmilksmall','Oats in 3% milk, small','30 g + 150 ml',200,9,29,7,'v'],
['b_oatswheychia','Oats + whey + chia + frozen berries','40 g + 30 g + 10 g + 100 g',370,32,50,9,'v'],
['b_eggs2bread','2 free-range eggs + 1 slice whole wheat bread','2 eggs + 1 slice (35 g)',220,16,15,11,'e'],
['b_eggs2bread2','2 free-range eggs + 2 slices whole wheat bread','2 eggs + 2 slices (70 g)',300,20,29,12,'e'],
['b_eggs2oats','2 free-range eggs + oats in 3% milk','2 eggs + 40 g oats + 200 ml milk',400,24,39,17,'e'],
['b_chiapudding','Chia pudding: chia, 3% milk, frozen berries (overnight)','20 g + 150 ml + 100 g',230,8,24,13,'v'],
['b_pboats','Oats with 1 tbsp peanut butter and half banana (3 min, microwave)','40 g oats',320,12,45,12,'v'],
['b_dahioats','Dahi oats: oats soaked in curd, cucumber, jeera (overnight)','40 g + 150 g curd',250,13,34,6,'v'],
['b_besan','Besan chilla with curd (5 min)','2 + 100 g curd',280,15,32,9,'v'],
['b_curdrice','Curd rice, small, with pomegranate','150 g',230,8,36,5,'v'],
['b_wheyoatsbanana','Oats + whey + half banana shake (2 min, blender)','40 g + 30 g',330,30,48,4,'v'],
],
carb:[
['c_rice150','Rice, cooked (sona masoori / basmati)','150 g',195,4,43,0,'v'],
['c_rice100','Rice, cooked, small','100 g',130,3,29,0,'v'],
['c_brown','Brown rice, cooked','150 g',165,4,35,1,'v'],
['c_roti2','Roti / phulka, no ghee','2',140,5,28,1,'v'],
['c_roti1','Roti / phulka, no ghee','1',70,3,14,0,'v'],
['c_rotighee','Roti with 1 tsp ghee each','2',220,5,28,9,'v'],
['c_mroti2','Millet roti (jowar / ragi)','2',170,5,34,1,'v'],
['c_mroti1','Millet roti (jowar / ragi)','1',85,3,17,0,'v'],
['c_millet150','Foxtail or little millet (korralu / samalu), cooked','150 g',170,5,34,1,'v'],
['c_millet100','Foxtail or little millet, cooked, small','100 g',115,3,23,1,'v'],
['c_quinoa150','Quinoa, cooked','150 g',180,6,32,3,'v'],
['c_quinoa100','Quinoa, cooked, small','100 g',120,4,21,2,'v'],
['c_wwpasta','Whole wheat pasta, cooked, plain','150 g',190,8,37,1,'v'],
['c_pasta','Regular pasta, cooked, plain','150 g',200,7,40,1,'v'],
['c_potato','Potato, boiled','150 g',130,3,30,0,'v'],
['c_sweetpot','Sweet potato, boiled','150 g',130,2,30,0,'v'],
['c_bread','Whole wheat bread','2 slices',160,8,28,2,'v'],
['c_puri2','Puri','2',300,5,32,17,'t'],
['c_pulihora','Pulihora (tamarind rice)','150 g',280,5,45,9,'v'],
['c_noodles','Noodles with veg, 1 tsp oil','150 g cooked',280,8,45,8,'v'],
['c_orgpasta','Organic pasta, cooked, plain','150 g',200,7,40,1,'v'],
['c_upma','Upma, dry rava weight','40 g',180,4,32,4,'v'],
['c_poha','Poha, dry weight','40 g',200,5,32,6,'v'],
['c_idli2','Idli','2',120,4,24,0,'v'],
['c_dosa1','Plain dosa','1',200,5,30,7,'v'],
['c_none','No carb this meal (extra veg instead)','0 g, add 100 g more veg',0,0,0,0,'v'],
],
prot:[
['p_chk150','Chicken breast curry','150 g',250,40,4,8,'n'],
['p_chk120','Chicken breast curry, small','120 g',200,32,3,6,'n'],
['p_chkthigh','Chicken thigh curry','150 g',300,33,4,17,'n'],
['p_tandoori','Tandoori / grilled chicken','150 g',240,42,2,7,'n'],
['p_fish150','Fish curry (tilapia, basa, rohu, salmon)','150 g',220,35,4,7,'n'],
['p_fish120','Fish curry, small','120 g',175,28,3,6,'n'],
['p_fishgrill','Grilled or pan fish, 1 tsp oil','150 g',200,36,0,6,'n'],
['p_prawn150','Prawns (royyalu) curry or fry','150 g',180,32,3,5,'n'],
['p_prawn120','Prawns, small','120 g',145,26,2,4,'n'],
['p_mutton','Mutton (goat) curry, lean','120 g',260,30,3,15,'n'],
['p_eggc3','Egg curry','3 eggs',260,20,5,18,'e'],
['p_eggc2','Egg curry','2 eggs',180,13,4,12,'e'],
['p_eggbhurji','Egg bhurji: 2 whole + 3 whites','2 whole eggs + 3 whites',220,24,3,11,'e'],
['p_paneer100','Paneer curry (low-fat paneer)','100 g',260,18,6,18,'v'],
['p_paneer80','Paneer curry, small','80 g',210,14,5,14,'v'],
['p_ptikka','Paneer tikka, grilled','100 g',240,20,5,16,'v'],
['p_tofu','Tofu curry or stir-fry','150 g',180,24,5,9,'v'],
['p_soya','Soya chunks curry','50 g dry',170,26,16,0,'v'],
['p_chana200','Chana / rajma curry','200 g',250,12,40,4,'v'],
['p_chana100','Chana / rajma curry, small','100 g',125,6,20,2,'v'],
['p_pappu','Pappu (thick dal: toor / moong / masoor)','200 g',230,14,32,5,'v'],
['p_gy170','Greek yogurt, plain','170 g',110,17,6,0,'v'],
['p_curd200','Curd, low-fat','200 g',120,8,10,4,'v'],
['p_cottage','Cottage cheese, low-fat','150 g',130,17,5,4,'v'],
['p_cheese','Cheddar / mozzarella cheese','30 g',120,7,1,10,'v'],
['p_freshmozz','Fresh mozzarella (bocconcini)','100 g',250,18,3,19,'v'],
['p_mozzsalad','Caprese bowl: 80 g fresh mozzarella, tomato, basil, 1 tsp olive oil','80 g mozzarella + 150 g tomato',245,14,5,19,'v'],
['p_mozzveg','Mozzarella melted over roasted veg','50 g + 150 g veg',230,14,12,14,'v'],
['p_whey','Whey protein in water','30 g',120,24,3,1,'v'],
['p_mushpan','Mushroom and paneer curry','150 g + 50 g',230,13,8,16,'v'],
['p_basa','Basa fillet, baked or pan, 1 tsp oil (frozen, cheap)','150 g',180,30,0,6,'n'],
['p_chklegs','Chicken drumsticks or legs, skinless, curry','150 g',260,36,0,12,'n'],
['p_sardines','Canned sardines','1 can (106 g)',190,22,0,11,'n'],
['p_whites','Egg whites from carton, scrambled','200 ml (6 whites)',100,22,2,0,'e'],
['p_skyr','Skyr, plain','170 g',110,19,7,0,'v'],
['p_milk300','3% organic milk','300 ml',170,10,15,9,'v'],
['p_chanasalad','Chickpea salad: chana, onion, tomato, lemon','200 g',260,12,38,6,'v'],
['p_tofusalad','Tofu salad: pan tofu, veg, soy-lemon dressing','150 g tofu',220,24,10,12,'v'],
['p_paneersalad','Paneer salad: grilled paneer, cucumber, capsicum','80 g paneer',240,14,8,16,'v'],
['p_sproutsalad','Sprouted moong salad','200 g',200,14,34,1,'v'],
['p_peanutchaat','Boiled peanut chaat','100 g',230,12,12,15,'v'],
['p_dalchana','Chana dal or moong dal, thick, extra portion','150 g',170,10,24,4,'v'],
['p_edamame','Edamame, steamed (frozen bag, 5 min)','150 g',190,17,14,8,'v'],
['p_tofuscramble','Tofu scramble with onion, tomato, turmeric (5 min)','150 g',200,20,6,12,'v'],
['p_chanachaat','Chana chaat from canned chickpeas, onion, lemon (5 min)','150 g',200,10,30,4,'v'],
['p_kalechana','Sweet Kale mix + 150 g chickpeas + lemon (bowl)','100 g kale mix + 150 g chickpeas',250,12,40,5,'v'],
['p_kalepaneer','Sweet Kale mix + 80 g grilled paneer (bowl)','100 g kale mix + 80 g paneer',310,17,14,20,'v'],
['p_kaleegg','Sweet Kale mix + 2 free-range eggs (bowl)','100 g kale mix + 2 eggs',200,15,10,11,'e'],
['p_kaletofu','Sweet Kale mix + 150 g pan tofu (bowl)','100 g kale mix + 150 g tofu',280,27,14,15,'v'],
['p_gybowl','Greek yogurt bowl: 200 g + berries + 10 g seeds','200 g yogurt + 100 g berries + 10 g seeds',230,22,18,7,'v'],
['p_skyrnuts','Skyr 170 g + 15 g walnuts','170 g skyr + 15 g walnuts',210,21,8,10,'v'],
['p_khichdi','Millet moong khichdi, complete meal (Instant Pot, 15 min)','300 g',320,13,50,6,'v'],
['p_soyakeema','Soya keema with peas (20 min)','50 g dry + 50 g peas',220,28,20,3,'v'],
['p_palakpaneer','Palak paneer from frozen spinach (15 min)','150 g + 80 g paneer',290,17,10,20,'v'],
['p_cabbagepappu','Cabbage pesarapappu (cabbage + moong dal)','200 g',180,10,22,5,'v'],
['p_dalfrozenveg','Dal with a cup of frozen mixed veg stirred in','250 g',260,15,36,5,'v'],
['p_shrimpstirfry','Frozen shrimp stir-fry with capsicum, 1 tsp oil (10 min)','150 g + veg',220,33,8,6,'n'],
['p_eggfrozenveg','Egg bhurji with frozen veg: 2 whole + 2 whites (8 min)','2 whole + 2 whites + 100 g veg',240,21,8,12,'e'],
['p_chkairfry','Chicken drumsticks, air fryer, skinless (25 min, hands-off)','150 g',260,36,0,12,'n'],
['p_rajmacan','Rajma from a can, quick masala (10 min)','200 g',250,13,40,3,'v'],
['p_chkfry','Chicken fry (kodi vepudu)','150 g',290,36,4,14,'n'],
['p_chk65','Chicken 65 / chilli chicken (fried)','150 g',380,30,14,22,'n'],
['p_chkkurma','Chicken kurma','150 g',300,32,6,16,'n'],
['p_chkpepper','Pepper chicken','150 g',260,38,4,10,'n'],
['p_muttonfry','Mutton fry','120 g',300,28,3,19,'n'],
['p_eggpulusu','Egg pulusu','2 eggs',220,13,10,14,'e'],
['p_paneerbm','Paneer butter masala','150 g',380,16,12,30,'v'],
['p_palakpaneer2','Palak paneer','150 g',260,14,9,19,'v'],
['p_paneerfry','Paneer fry (tawa)','100 g',280,18,5,21,'v'],
['p_tofupepper','Tofu pepper fry','150 g',200,22,6,11,'v'],
['p_soyafry','Soya chunks fry (meal maker vepudu)','50 g dry',200,26,17,5,'v'],
['p_mushroom_masala','Mushroom masala','150 g',130,5,9,8,'v'],
['p_senagalu','Guggillu / boiled chana (senagalu) with onion','150 g',200,10,32,3,'v'],
['p_pesaralu','Boiled green moong (pesalu) sundal','150 g',180,12,30,1,'v'],
['p_chkveg','Chicken and veg curry, one pot (150 g chicken + 150 g veg)','300 g',350,43,14,15,'n'],
['p_chkveg120','Chicken and veg curry, one pot, small (120 g + 150 g veg)','270 g',300,35,12,12,'n'],
['p_fishveg','Fish and veg curry, one pot (150 g fish + 150 g veg)','300 g',300,38,12,12,'n'],
['p_fishveg120','Fish and veg curry, one pot, small (120 g + 150 g veg)','270 g',260,31,11,10,'n'],
['p_prawnveg','Prawns and veg stir-fry, one pan (150 g + 150 g veg)','300 g',270,35,12,10,'n'],
['p_eggveg','Egg curry with veg, one pot (3 eggs + 150 g veg)','3 eggs + 150 g veg (about 300 g)',360,23,15,23,'e'],
['p_soyaveg','Soya chunks and veg curry, one pot (50 g dry + 150 g veg)','300 g',260,29,26,7,'v'],
['p_tofuveg','Tofu and veg stir-fry, one pan (150 g + 150 g veg)','300 g',270,27,15,14,'v'],
['p_paneerveg','Paneer and veg curry, one pot (100 g + 150 g veg)','300 g',350,21,16,22,'v'],
['p_dalveg','Dal with veg, one pot (200 g dal + 150 g veg)','350 g',320,17,40,8,'v'],
['p_mushpaneer','Mushroom and paneer curry, one pot (150 g + 100 g)','250 g',350,23,10,24,'v'],
['p_chkmush','Chicken and mushroom curry, one pot (150 g + 100 g)','250 g',310,42,6,13,'n'],
['p_falafel','Costco falafel, ready to eat (low protein, treat it as a carb)','4 pcs (100 g)',280,8,30,14,'v'],
['p_falafelkale','Falafel 3 pcs + Sweet Kale mix + 100 g Greek yogurt dip','3 falafel + 100 g kale mix + 100 g yogurt',350,19,30,13,'v'],
['p_chkkale','Grilled chicken 120 g on Sweet Kale mix, lemon','120 g chicken + 100 g kale mix',260,36,10,8,'n'],
['p_paneerkale','Grilled paneer 80 g on Sweet Kale mix, 1 tsp olive oil','80 g paneer + 100 g kale mix',290,15,10,22,'v'],
['p_tofukale','Pan tofu 150 g on Sweet Kale mix','150 g tofu + 100 g kale mix',240,25,10,13,'v'],
['p_cheesemix','Triple mix shredded cheese','30 g',110,7,1,9,'v'],
],
veg:[
['v_bhendi','Bhendi (okra) fry, 1 tsp oil','150 g',110,3,10,7,'v'],
['v_dondakaya','Dondakaya (ivy gourd) fry','150 g',110,3,10,7,'v'],
['v_chikkudu','Chikkudukaya (broad beans) curry','150 g',120,5,14,5,'v'],
['v_sorakaya','Sorakaya (bottle gourd) curry','150 g',70,2,8,4,'v'],
['v_beerakaya','Beerakaya (ridge gourd) curry','150 g',70,2,8,4,'v'],
['v_palak','Palak (spinach) curry','150 g',80,4,6,5,'v'],
['v_palakdal','Palak pappu (spinach dal)','200 g',200,12,26,5,'v'],
['v_carrot','Carrot poriyal / curry','150 g',90,2,14,4,'v'],
['v_tomato','Tomato curry / pachadi','100 g',80,2,8,5,'v'],
['v_aloo','Aloo (potato) curry','150 g',180,3,30,6,'v'],
['v_aloofry','Aloo fry','150 g',230,3,30,11,'v'],
['v_mushroom','Mushroom stir-fry / curry','150 g',90,5,6,5,'v'],
['v_capsicum','Bell pepper (capsicum) stir-fry','150 g',90,2,10,5,'v'],
['v_cabbage','Cabbage poriyal (cooked)','150 g',90,3,12,4,'v'],
['v_beans','Beans poriyal','150 g',90,3,12,4,'v'],
['v_gobi','Cauliflower (gobi) curry','150 g',100,3,10,6,'v'],
['v_broccoli','Broccoli, steamed','150 g',50,4,8,0,'v'],
['v_baingan','Baingan (vankaya) curry','150 g',110,2,10,7,'v'],
['v_mixed','Mixed veg curry','150 g',90,3,12,4,'v'],
['v_frozen','Frozen mixed veg, steamed','150 g',80,4,12,0,'v'],
['v_salad','Veggie salad (cucumber, onion, tomato, carrot)','150 g',35,1,7,0,'v'],
['v_bigsalad','Big veggie salad (lettuce, cucumber, capsicum, carrot, tomato)','250 g',60,2,12,0,'v'],
['v_gsalad','Green salad with 1 tsp olive oil','150 g',80,2,7,5,'v'],
['v_sweetkale','Sweet Kale salad kit with its dressing and toppings','150 g',180,4,14,12,'v'],
['v_sweetkaleplain','Sweet Kale mix, no dressing, lemon + 1 tsp olive oil','150 g',100,3,10,6,'v'],
['v_koshimbir','Cucumber peanut salad (koshimbir)','150 g',110,4,8,7,'v'],
['v_beetcarrot','Beet and carrot salad, lemon','150 g',70,2,14,1,'v'],
['v_spinachsalad','Baby spinach, tomato, 1 tsp olive oil','150 g',80,3,6,5,'v'],
['v_kachumber','Kachumber with lemon and chaat masala','200 g',50,2,10,0,'v'],
['v_dosakaya','Dosakaya (yellow cucumber) curry or pachadi','150 g',70,2,9,3,'v'],
['v_beetroot','Beetroot curry (poriyal)','150 g',90,2,14,3,'v'],
['v_methi','Methi (fenugreek leaves) curry','150 g',80,4,7,5,'v'],
['v_peas','Green peas, frozen, steamed','100 g',80,5,14,0,'v'],
['v_mushcap','Mushroom and capsicum stir-fry','150 g',90,4,8,5,'v'],
['v_beanscarrot','Beans and carrot poriyal','150 g',90,3,13,4,'v'],
['v_avocado','Avocado','half',120,1,6,11,'v'],
['v_kalemix','Salad pack mix (Sweet Kale or similar), no dressing','100 g',40,2,7,1,'v'],
['v_carrotfry','Carrot fry (carrot vepudu)','150 g',120,2,15,6,'v'],
['v_potatofry','Potato fry (bangaladumpa vepudu)','150 g',230,3,30,11,'v'],
['v_bhendifry','Bhendi fry (bendakaya vepudu)','150 g',130,3,10,9,'v'],
['v_dondafry','Dondakaya fry (ivy gourd vepudu)','150 g',130,3,10,9,'v'],
['v_cabbagefry','Cabbage fry with moong dal','150 g',120,5,13,5,'v'],
['v_beansfry','Beans fry (french beans vepudu)','150 g',110,3,12,6,'v'],
['v_beetrootfry','Beetroot fry','150 g',110,2,15,5,'v'],
['v_gobifry','Cauliflower fry (gobi vepudu)','150 g',140,4,10,9,'v'],
['v_vankayafry','Brinjal fry (vankaya vepudu)','150 g',140,2,10,10,'v'],
['v_capsicumfry','Capsicum fry','150 g',110,2,10,7,'v'],
['v_mushroomfry','Mushroom fry (pepper mushroom)','150 g',110,5,6,8,'v'],
['v_mixedfry','Mixed vegetable fry','150 g',120,3,13,6,'v'],
['v_sorakayacurry','Sorakaya curry with milk (anapakaya paalu kura)','150 g',110,4,10,6,'v'],
['v_beerakayacurry','Beerakaya curry (ridge gourd kura)','150 g',80,2,9,4,'v'],
['v_tomatopappu','Tomato pappu','200 g',210,12,28,5,'v'],
['v_sorakayapappu','Sorakaya pappu','200 g',200,12,27,5,'v'],
['v_dosakayapappu','Dosakaya pappu','200 g',200,12,27,5,'v'],
['v_gongura','Gongura pappu / pachadi','150 g',160,9,18,6,'v'],
['v_aloogobi','Aloo gobi','150 g',170,4,20,8,'v'],
['v_aloopalak','Aloo palak','150 g',150,4,18,7,'v'],
['v_alootomato','Aloo tomato curry','150 g',160,3,24,6,'v'],
['v_chanamasala','Chana masala','150 g',190,9,27,5,'v'],
['v_rajmamasala','Rajma masala','150 g',180,9,26,4,'v'],
['v_egg_fry','Egg fry / egg pepper fry','2 eggs',190,13,2,14,'e'],
['v_eggomelette_curry','Omelette curry','2 eggs',230,13,6,17,'e'],
],
side:[
['s_rasam','Rasam / charu','200 ml',40,1,7,1,'v'],
['s_sambar','Sambar','200 g',120,6,18,3,'v'],
['s_pappu','Pappu (dal)','150 g',170,10,24,4,'v'],
['s_curd100','Curd, low-fat','100 g',60,4,5,2,'v'],
['s_raita','Raita','100 g',70,4,6,3,'v'],
['s_buttermilk','Buttermilk (majjiga)','300 ml',60,3,6,2,'v'],
['s_pickle','Pickle (avakaya etc.)','1 tsp',15,0,1,1,'v'],
['s_papad','Papad, roasted','1',40,2,6,0,'v'],
['s_ghee','Ghee','1 tsp',45,0,0,5,'v'],
['s_peanutoil','Cold-pressed peanut oil (extra, beyond the 1 tsp in curries)','1 tsp',45,0,0,5,'v'],
['s_oliveoil','Olive oil, on salad','1 tsp',45,0,0,5,'v'],
['s_coconutoil','Coconut oil','1 tsp',45,0,0,5,'v'],
['s_chutney','Coconut / peanut chutney','2 tbsp',70,2,4,6,'v'],
['s_tomatochutney','Tomato chutney / pachadi','2 tbsp',40,1,5,2,'v'],
['s_avakaya','Avakaya (mango pickle)','1 tsp',20,0,1,2,'v'],
['s_podi','Kandi podi / karam podi with 1 tsp ghee','1 tbsp',90,3,6,6,'v'],
['s_majjigapulusu','Majjiga pulusu','200 ml',110,5,10,6,'v'],
['s_pulusu','Pulusu (tamarind gravy)','200 ml',90,2,16,2,'v'],
['s_dalrasam','Pappu charu','200 ml',80,4,12,2,'v'],
['s_curd150','Curd, low-fat','150 g',90,6,7,3,'v'],
],
treat:[
['t_chkbir','Chicken biryani','1 plate (350 g)',600,30,70,20,'tn'],
['t_mutbir','Mutton biryani','1 plate (350 g)',700,30,70,30,'tn'],
['t_eggbir','Egg biryani','1 plate',580,22,70,22,'te'],
['t_vegbir','Veg biryani','1 plate (350 g)',500,10,80,15,'t'],
['t_vegbir200','Veg biryani, small','200 g',290,6,46,9,'t'],
['t_chkbir200','Chicken biryani, small','200 g',340,17,40,11,'tn'],
['t_eggfriedrice','Egg fried rice','300 g',480,16,70,14,'te'],
['t_vegfriedrice','Veg fried rice','300 g',420,9,72,11,'t'],
['t_vegnoodles','Veg noodles (hakka)','300 g',450,10,75,12,'t'],
['t_chkfriedrice','Chicken fried rice','300 g',520,25,70,15,'tn'],
['t_curdrice','Curd rice','300 g',380,12,60,9,'t'],
['t_lemonrice','Lemon rice','250 g',380,6,65,10,'t'],
['t_tomatorice','Tomato rice / tomato bath','250 g',380,6,65,10,'t'],
['t_sambarrice','Sambar rice','300 g',360,11,62,6,'t'],
['t_dosa2chutney','Dosa 2 with chutney and sambar','',480,12,72,16,'t'],
['t_idli4','Idli 4 with sambar and chutney','',380,12,70,5,'t'],
['t_upmafull','Upma, big plate','80 g rava',360,8,64,8,'t'],
['t_pongal','Ven pongal','250 g',420,12,60,14,'t'],
['t_chapati2curry','Chapati 2 with mixed veg curry','',360,10,52,12,'t'],
['t_parotta','Parotta with kurma','2',620,12,70,32,'t'],
['t_pulao','Veg pulao with raita','300 g',450,10,70,14,'t'],
['t_pastachk','Pasta with chicken, white sauce','300 g',600,30,60,25,'tn'],
['t_pastaarr','Pasta arrabbiata with veg','300 g',450,12,70,12,'t'],
['t_pastapan','Pasta with paneer or tofu, tomato sauce','300 g',520,22,65,18,'t'],
['t_pastaww','Whole wheat pasta with chicken and veg, olive oil','300 g',520,35,55,15,'tn'],
['t_pizza','Pizza, thin crust','2 slices',500,20,55,22,'t'],
['t_dosaghee','Ghee roast dosa','1',350,6,45,16,'t'],
['t_bajji','Mirchi bajji / punugulu','4 pcs',320,6,36,18,'t'],
['t_panbir','Paneer biryani','1 plate (350 g)',550,18,75,18,'t'],
['t_murukku','Murukku / mixture / chakli','30 g',150,3,18,8,'t'],
['t_samosa','Samosa','1',260,5,30,13,'t'],
['t_vada','Medu vada with chutney','2',300,8,32,16,'t'],
['t_puripotato','Puri 2 + potato curry 100 g','2 puri + 100 g curry',420,7,50,20,'t'],
],
snack:[
['k_curdchana','Low-fat curd 200 g + roasted chana 30 g','200 g curd + 30 g chana',230,15,28,5,'v'],
['k_gy','Greek yogurt, plain','170 g',110,17,6,0,'v'],
['k_gyberries','Greek yogurt with berries','170 g + 50 g',135,17,12,0,'v'],
['k_whey','Whey protein in water','30 g',120,24,3,1,'v'],
['k_wheymilk','Whey with 3% milk','30 g + 200 ml',240,31,15,7,'v'],
['k_eggs2','Free-range eggs, boiled','2 whole',140,12,1,10,'e'],
['k_whites','Boiled egg whites','4',70,14,1,0,'e'],
['k_chana','Roasted chana','50 g',180,10,30,3,'v'],
['k_peanuts','Peanuts, roasted, unsalted','30 g',170,8,5,14,'v'],
['k_almonds','Almonds','20 g (15)',120,4,4,10,'v'],
['k_nuts','Mixed nuts','25 g',150,5,5,13,'v'],
['k_bmchana','Buttermilk 300 ml + roasted chana 30 g','300 ml + 30 g chana',180,10,25,3,'v'],
['k_bar','Protein bar (20 g protein)','1',200,20,22,7,'v'],
['k_paneer','Paneer cubes, low-fat','80 g',200,14,3,15,'v'],
['k_cottage','Cottage cheese','100 g',90,11,3,3,'v'],
['k_cheeseapple','Cheese 30 g + apple','30 g cheese + 1 apple',200,7,22,10,'v'],
['k_hummus','Hummus with carrot and cucumber sticks','50 g + 150 g',150,5,15,8,'v'],
['k_sprouts','Sprouts','100 g',100,7,16,1,'v'],
['k_makhana','Makhana, dry roasted (low protein)','30 g',100,3,20,0,'v'],
['k_chai','Masala chai, 3% milk, 1/2 tsp sugar','1 cup',75,3,8,4,'v'],
['k_choc','Dark chocolate 70%','2 squares (20 g)',110,2,9,8,'v'],
['k_fruitnuts','Fruit + 10 almonds','1 fruit + 10 almonds (12 g)',160,3,24,7,'v'],
['k_pbapple','Apple with 1 tbsp peanut butter','1 apple + 1 tbsp (16 g)',175,4,24,8,'v'],
['k_chanachaat','Roasted chana chaat with onion, tomato, lemon','50 g chana',200,10,34,3,'v'],
['k_bananamilk','Banana + 200 ml 3% milk','1 banana + 200 ml milk',215,8,37,6,'v'],
['k_curdcuc','Curd 150 g with cucumber and jeera','150 g curd + 100 g cucumber',100,6,9,3,'v'],
['k_cornchaat','Sweet corn chaat (frozen corn, 3 min)','150 g',150,5,30,2,'v'],
['k_nutsberries','Mixed nuts 20 g + frozen berries 100 g','20 g nuts + 100 g berries',170,5,16,10,'v'],
['k_gychia','Greek yogurt 170 g + chia 10 g + berries 50 g','170 g yogurt + 10 g chia + 50 g berries',200,20,18,6,'v'],
['k_cheesestick','Mozzarella cheese stick','1 (21 g)',70,6,1,5,'v'],
['k_cheesestick2','Mozzarella cheese sticks','2',140,12,2,10,'v'],
['k_cheesefruit','Cheese stick + apple','1 stick (21 g) + 1 apple',150,6,22,5,'v'],
['k_freshmozz','Fresh mozzarella with tomato and basil (caprese)','60 g',150,11,2,11,'v'],
['k_none','Skip this snack','nothing',0,0,0,0,'v'],
],
fruit:[
['f_apple','Apple','1 medium',80,0,21,0,'v'],
['f_banana','Banana','1 medium',100,1,27,0,'v'],
['f_hbanana','Banana','half',50,0,13,0,'v'],
['f_orange','Orange','1 medium',60,1,15,0,'v'],
['f_guava','Guava','1 medium',70,3,14,1,'v'],
['f_papaya','Papaya','150 g',60,1,15,0,'v'],
['f_berries','Berries','100 g',50,1,12,0,'v'],
['f_pomeg','Pomegranate','100 g',80,2,19,1,'v'],
['f_grapes','Grapes','100 g',70,1,18,0,'v'],
['f_pear','Pear','1 medium',100,1,27,0,'v'],
['f_mango','Mango','100 g',60,1,15,0,'v'],
['f_melon','Watermelon / muskmelon','200 g',60,1,15,0,'v'],
['f_kiwi','Kiwi','2',90,2,22,1,'v'],
['f_clementine','Clementine','1',35,1,9,0,'v'],
['f_clementine2','Clementines','2',70,1,18,0,'v'],
['f_honeydew','Honeydew melon','200 g',70,1,18,0,'v'],
['f_mixedberries','Mixed berries, frozen','100 g',50,1,12,0,'v'],
['f_none','Skip fruit','nothing',0,0,0,0,'v'],
],
drink:[
['d_water','Warm water','250 ml',0,0,0,0,'v'],
['d_limewater','Warm water 500 ml with a squeeze of lime','500 ml + half a lime',5,0,1,0,'v'],
['d_coffee','Black coffee or green tea, no sugar','1 cup, 250 ml',5,0,0,0,'v'],
['d_jeera','Jeera / ajwain water','200 ml',5,0,1,0,'v'],
['d_creatine','Creatine in water','5 g',5,0,0,0,'v'],
['d_tablet','Morning tablet with plain water first, lime water only after 45 to 60 min','1 tablet + 250 ml water',0,0,0,0,'v'],
['d_milk','3% organic milk','200 ml',115,7,10,6,'v'],
['d_milk6','6% milk','200 ml',170,7,10,12,'v'],
['d_curdbed','Curd, low-fat','100 g',60,4,5,2,'v'],
['d_gybed','Greek yogurt','100 g',65,10,4,0,'v'],
['d_casein','Casein or whey in water','30 g',120,24,3,1,'v'],
['d_skip','Skip','nothing',0,0,0,0,'v'],
],
gym:[
['g_gym','1 hr workout. 500 ml water, nothing else needed','60 min, 500 ml water',0,0,0,0,'v'],
['g_gymcreat','Workout + 5 g creatine in water','60 min, 5 g creatine',5,0,0,0,'v'],
['g_walk','Rest day: 30 min brisk walk','30 min',0,0,0,0,'v'],
['g_skip','Skipped today','rest',0,0,0,0,'v'],
],
};
// Cost per 30 g protein in Canada, rough: 1 = cheap, 2 = mid, 3 = pricey
const COST = {p_whey:1,k_whey:1,k_wheymilk:1,d_casein:1,p_soya:1,p_pappu:1,s_pappu:1,p_dalchana:1,p_chana200:1,p_chana100:1,p_chanasalad:1,p_sproutsalad:1,p_milk300:1,d_milk:1,p_sardines:1,p_curd200:1,s_curd100:1,k_curdchana:1,k_chana:1,k_peanuts:1,p_peanutchaat:1,k_sprouts:1,k_bmchana:1,b_oatswhey:1,b_wheymilk:1,b_smoothie:1,b_chilla:1,b_sprouts:1,
p_whites:2,b_whites:2,p_chkfry:3,p_chk65:3,p_chkkurma:3,p_chkpepper:3,p_muttonfry:3,p_eggpulusu:2,p_paneerbm:3,p_palakpaneer2:3,p_paneerfry:3,p_tofupepper:2,p_soyafry:1,p_mushroom_masala:2,p_senagalu:1,p_pesaralu:1,b_idlieggs:2,b_dosaeggs:2,b_pohaeggs:2,b_upmaeggs:2,b_idliwhey:1,b_dosawhey:1,b_pesarattuwhey:1,b_pohawhey:1,b_upmacurd:1,b_bananagy:2,b_fruitwhey:1,p_mushpaneer:3,p_chkmush:3,p_falafel:2,p_falafelkale:2,p_chkkale:3,p_paneerkale:3,p_tofukale:2,p_cheesemix:2,p_chkveg:3,p_chkveg120:3,p_fishveg:3,p_fishveg120:3,p_prawnveg:3,p_eggveg:2,p_soyaveg:1,p_tofuveg:2,p_paneerveg:3,p_dalveg:1,k_cheesestick:2,k_cheesestick2:2,k_cheesefruit:2,k_freshmozz:2,p_freshmozz:2,p_mozzsalad:2,p_mozzveg:2,p_khichdi:1,p_soyakeema:1,p_cabbagepappu:1,p_dalfrozenveg:1,p_rajmacan:1,p_eggfrozenveg:2,p_shrimpstirfry:3,p_chkairfry:2,p_palakpaneer:3,b_dahioats:1,b_besan:1,b_pboats:1,b_wheyoatsbanana:1,p_edamame:2,p_tofuscramble:2,p_kaletofu:2,p_kaleegg:2,p_gybowl:2,p_skyrnuts:2,p_chanachaat:1,p_kalechana:1,p_kalepaneer:3,k_whites:2,p_eggc3:2,p_eggc2:2,p_eggbhurji:2,b_eggs32:2,b_eggs22:2,b_eggs2:2,b_omelette:2,b_bhurji:2,k_eggs2:2,b_toasteggs:2,b_ppancake:2,b_rotibhurji:2,p_gy170:2,k_gy:2,k_gyberries:2,b_gyberries:2,b_granolagy:2,d_gybed:2,p_skyr:2,p_cottage:2,k_cottage:2,p_tofu:2,p_tofusalad:2,p_basa:2,p_chklegs:2,p_chkthigh:2,k_bar:2,
p_chk150:3,p_chk120:3,p_tandoori:3,p_fish150:3,p_fish120:3,p_fishgrill:3,p_prawn150:3,p_prawn120:3,p_mutton:3,p_paneer100:3,p_paneer80:3,p_ptikka:3,p_paneersalad:3,p_mushpan:3,b_pbhurji:3,b_rotipaneer:3,k_paneer:3,p_cheese:3,k_cheeseapple:3};
const costTxt=(id)=>COST[id]?['','$','$$','$$$'][COST[id]]:'';
const REC = new Set(['b_eggs2','b_eggs2oats','b_eggs2bread','b_idlieggs','b_dosaeggs','b_pohaeggs','b_upmaeggs','b_idliwhey','b_dosawhey','b_pesarattuwhey','b_pohawhey','b_ovn','b_bananagy','b_fruitwhey','b_granolasmall','b_granolanuts','b_nuts','b_oatsmilkchia','b_oatsmilksmall','b_oatswheychia','k_gychia','k_nutsberries','b_eggs32','b_eggs22','b_oatsmilk','b_oats','b_oatswhey','b_pesarattu','b_idli2','b_dosa1','b_poha','b_upma','b_chilla','b_gyberries','b_toasteggs',
 'c_rice150','c_rice100','c_mroti2','c_mroti1','c_quinoa150','c_quinoa100','c_millet100','c_potato','c_bread','c_none',
 'p_chkveg','p_chkveg120','p_chkmush','p_chkkale','p_tandoori','p_soyaveg','p_tofuveg','p_tofukale','p_paneerveg','p_mushpaneer','p_dalveg','p_eggveg','p_eggbhurji','p_gy170','p_whey',
 'v_bhendi','v_dondakaya','v_sorakaya','v_beerakaya','v_dosakaya','v_beans','v_palak','v_methi','v_gobi','v_cabbage','v_mushcap','v_salad','v_kalemix',
 's_rasam','s_pappu','s_curd100','k_gy','k_whey','k_eggs2','k_cheesestick','k_bar','k_curdcuc','k_fruitnuts','k_pumpkin','d_limewater','f_apple','f_banana','f_clementine','f_papaya','f_pear','t_chkbir','t_panbir','t_eggbir','t_pizza']);
// Ingredients for custom entries: [name, kcal, protein, carbs, fat] per 100 g (or 100 ml); pc = grams per piece when counted in pieces
const ING = [
 ['Milk 6%',85,3.5,5,6,0,'milk'],['Milk 3% organic',60,3.3,5,3,0,'milk'],['Milk 1%',42,3.4,5,1],['Curd / dahi',60,4,5,2,0,'yogurt perugu'],['Greek yogurt 0%',60,10,4,0],['Skyr',63,11,4,0.2],['Cottage cheese',98,11,3,4],['Paneer',290,18,4,22,0,'cottage cheese indian'],['Cheese (mozzarella / cheddar / mix)',330,24,2,25],['Cheese stick',330,24,2,25,21],
 ['Whey protein (scoop)',400,80,10,3,30,'protein powder shake'],['Egg, whole',145,12.5,1,10,50,'eggs'],['Egg white',52,11,0.7,0,33,'whites'],
 ['Chicken breast, cooked',165,31,0,3.6],['Chicken thigh / legs, cooked, skinless',180,25,0,9],['Mutton, cooked, lean',215,27,0,11],['Tofu, firm',120,14,3,7],['Soya chunks, dry',340,52,33,0.5],['Dal, cooked thick',115,7,16,2.5,0,'pappu lentils toor moong'],['Chana / rajma, cooked',160,8,27,2.5,0,'chickpeas kidney beans senagalu'],['Peas',80,5,14,0.4],['Mushrooms',22,3,3,0],['Falafel (piece)',280,8,30,14,25],
 ['Oats, dry',380,13,67,7],['Granola',460,10,65,18],['Chia seeds',490,17,42,31],['Almonds',580,21,22,50,1.2,'badam'],['Walnuts',650,15,14,65,4,'akhrot'],['Mixed nuts',600,18,20,52],['Peanuts',570,26,16,49,0,'groundnut palli'],['Cashews',555,18,30,44,1.5,'kaju jeedipappu'],['Pistachios, shelled',560,20,28,45,0.7,'pista'],['Pistachios in shell (weight with shell)',280,10,14,22,1.2,'pista unshelled'],['Pumpkin seeds',560,30,11,49,0,'pepitas'],['Sunflower seeds',580,21,20,51],['Flax seeds, ground',535,18,29,42,0,'avise'],['Raisins',300,3,79,0.5,0.5,'kismis'],['Dried figs',250,3,64,1,8,'anjeer'],['Dates',280,2,75,0.4,7,'kharjura'],['Sweet potato bites (Costco, roasted)',110,2,24,1,12,'sweet potato'],['Peanut butter',590,25,20,50],
 ['Rice, cooked',130,2.7,28,0.3,0,'annam sona masoori basmati'],['Quinoa, cooked',120,4.4,21,1.9],['Millet, cooked',115,3.5,23,1],['Potato, boiled',87,2,20,0.1],['Bread, whole wheat (slice)',230,11,40,3,35],['Roti / phulka (piece)',230,8,45,2,30],['Idli (piece)',150,4,30,0.5,40],['Dosa (piece)',200,5,30,7,100],['Poha, dry',350,7,77,1,0,'atukulu flattened rice'],['Upma rava, dry',360,10,76,1,0,'sooji semolina suji'],['Idli rava, dry',350,7,78,0.5,0,'rice rava'],['Pasta, cooked',130,5,26,1],['Noodles, cooked',140,4.5,25,2],['Puri (piece)',150,2.5,16,8.5,30],
 ['Veg curry, cooked with 1 tsp oil per 150 g',60,2,7,3],['Spinach, cooked',35,3,4,1],['Salad veg, raw',20,1,4,0],['Sweet Kale salad kit with dressing',120,3,9,8],['Avocado',160,2,9,15],
 ['Banana',89,1.1,23,0.3,120],['Apple',52,0.3,14,0.2,180],['Pear',57,0.4,15,0.1,180],['Clementine',47,0.8,12,0.1,75,'orange mandarin'],['Papaya',43,0.5,11,0.3],['Honeydew',36,0.5,9,0.1],['Blueberries',57,0.7,14,0.3,1.5,'berries'],['Strawberries',32,0.7,8,0.3,12],['Mixed frozen berries',50,0.8,12,0.3,0,'berries mix'],['Grapes',69,0.7,18,0.2,5],['Mango',60,0.8,15,0.4],
 ['Ghee / oil (tsp)',900,0,0,100,5],['Maple syrup / honey (tbsp)',300,0,75,0,20],['Sugar (tsp)',400,0,100,0,4],['Protein bar (piece)',330,33,37,12,60],['Dark chocolate 70%',580,8,45,42,10],
];
const ICON = {
  // SF-style glyphs: 1.6 stroke, round caps, drawn to the 24-grid
  prot:'<svg viewBox="0 0 24 24"><path d="M12 3.5c3.6 0 6.5 4.3 6.5 9S15.6 20.5 12 20.5 5.5 17.2 5.5 12.5 8.4 3.5 12 3.5z"/><path d="M9.2 13.2c0-1.5 1.1-2.7 2.6-2.9"/></svg>',
  carb:'<svg viewBox="0 0 24 24"><path d="M3.5 11.5h17v1.2a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7v-1.2z"/><path d="M8 11.5c0-2.2 1.3-3.5 2.8-3.5s2.4 1 2.4 2.2M12.8 10.2c.4-1.4 1.5-2.2 2.8-2.2 1.4 0 2.6 1.3 2.6 3.5"/></svg>',
  bf:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5"/></svg>',
  veg:'<svg viewBox="0 0 24 24"><path d="M5 19.5c0-8 5.5-13.5 14.5-14.5-.5 9-6 14.5-14.5 14.5z"/><path d="M5 19.5c2.8-4 6-7.2 9.5-9.5"/></svg>',
  side:'<svg viewBox="0 0 24 24"><path d="M3.5 12.5h17a8.5 8.5 0 0 1-17 0z"/><path d="M9 9.5c0-1.5.8-2 .8-3.5M12.5 9.5c0-1.5.8-2 .8-3.5"/></svg>',
  fruit:'<svg viewBox="0 0 24 24"><path d="M12 8.5c-1.2-.9-2.6-1.2-4-.8C5 8.6 4 12 5.2 15.3 6.3 18.6 8.5 21 10.3 21c.6 0 1.1-.2 1.7-.5.6.3 1.1.5 1.7.5 1.8 0 4-2.4 5.1-5.7C20 12 19 8.6 16 7.7c-1.4-.4-2.8-.1-4 .8z"/><path d="M12 8.5c0-2 1-3.8 2.8-4.5"/></svg>',
  snack:'<svg viewBox="0 0 24 24"><rect x="3.5" y="7" width="17" height="10" rx="4"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>',
  drink:'<svg viewBox="0 0 24 24"><path d="M12 3s6 6.8 6 11.2A6 6 0 0 1 6 14.2C6 9.8 12 3 12 3z"/><path d="M9 14.5a3 3 0 0 0 2 2.8"/></svg>',
  fat:'<svg viewBox="0 0 24 24"><path d="M12 3s6 6.8 6 11.2A6 6 0 0 1 6 14.2C6 9.8 12 3 12 3z"/></svg>',
  treat:'<svg viewBox="0 0 24 24"><path d="M4 13.5c1.5 0 1.5 1.5 3 1.5s1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5"/><path d="M4.5 13V11a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v2M5 15v4.5h14V15M12 9V6.5M12 4.5v.3"/></svg>',
  gym:'<svg viewBox="0 0 24 24"><path d="M7 8.5v7M17 8.5v7M3.5 10.5v3M20.5 10.5v3M4.5 9.5v5M19.5 9.5v5M7 12h10"/></svg>',
  steps:'<svg viewBox="0 0 24 24"><circle cx="13.5" cy="4.5" r="1.6"/><path d="M10.5 21l2-5.5-2.5-2.2 1-4.8 2.5 1.5 2.5 2.5M9 12.5l1.5-4 3-1.2 2.5 1.2 1.5 2.5M14 15.5l2 1.5v4"/></svg>',
  sleep:'<svg viewBox="0 0 24 24"><path d="M19.5 14.8A8 8 0 0 1 9.2 4.5a8 8 0 1 0 10.3 10.3z"/><path d="M15 3h3.5L15 7h3.5"/></svg>',
  mine:'<svg viewBox="0 0 24 24"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.2 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.2 5.9-.9z"/></svg>',
  water:'<svg viewBox="0 0 24 24"><path d="M12 3s6 6.8 6 11.2A6 6 0 0 1 6 14.2C6 9.8 12 3 12 3z"/></svg>',
};
const ic=(cat)=>`<span class="ico ${cat}">${ICON[cat]||ICON.mine}</span>`;
const ALIAS = {
 s_tadka:'tadka curry base onion tomato ginger garlic popu talimpu oil masala base',s_tadka2:'tadka rich curry base 2 tsp oil',s_curd6:'curd perugu dahi yogurt 6% thick',s_curd3:'curd perugu dahi yogurt 3%',p_mushtom:'mushroom tomato curry puttagodugu kura',p_vegbirleft:'veg biryani leftover biriyani pulao',v_bhendi40:'bhendi fry okra bendakaya vepudu bhindi',v_sweetkalehalf:'sweet kale salad kit costco half bag shared',v_tomcurry:'tomato curry tomato kura',k_mixnuts:'mixed nuts pista walnut cashew trail',k_pista10:'pista pistachio',k_walnut10:'walnut akhrot',k_cashew10:'cashew kaju jeedipappu',k_choc80:'dark chocolate 80 lindt',k_peanut30:'peanuts palli groundnut verusenaga',
 v_carrotfry:'carrot fry carrot curry carrot poriyal gajar',v_carrot:'carrot fry carrot curry gajar',v_potatofry:'potato fry aloo fry bangaladumpa alu urulagadda',v_aloofry:'potato fry aloo fry',v_aloo:'potato curry aloo curry bangaladumpa',
 v_bhendifry:'bhendi fry okra fry bendakaya ladyfinger bhindi',v_bhendi:'bhendi fry okra bendakaya bhindi ladyfinger',v_dondafry:'dondakaya fry ivy gourd tindora tendli',v_dondakaya:'dondakaya ivy gourd tindora',
 v_cabbagefry:'cabbage fry cabbage curry kosu',v_cabbage:'cabbage kosu patta gobi',v_beansfry:'beans fry french beans',v_beans:'beans fry',v_beetrootfry:'beetroot fry beet',v_beetroot:'beetroot curry beet',
 v_gobifry:'cauliflower fry gobi fry phool gobi',v_gobi:'cauliflower gobi',v_vankayafry:'brinjal fry eggplant vankaya baingan gutti',v_baingan:'brinjal eggplant vankaya baingan',v_capsicumfry:'capsicum fry bell pepper shimla mirch',v_capsicum:'capsicum bell pepper',
 v_mushroomfry:'mushroom fry pepper mushroom puttagodugulu',v_mushroom:'mushroom curry puttagodugulu',v_mixedfry:'mixed veg fry mixed vegetable',v_mixed:'mixed veg curry',
 v_sorakayacurry:'sorakaya bottle gourd anapakaya lauki',v_sorakaya:'sorakaya bottle gourd lauki anapakaya',v_beerakayacurry:'beerakaya ridge gourd turai',v_beerakaya:'beerakaya ridge gourd turai',v_dosakaya:'dosakaya yellow cucumber',
 v_tomatopappu:'tomato pappu tomato dal',v_sorakayapappu:'sorakaya pappu bottle gourd dal',v_dosakayapappu:'dosakaya pappu',v_palakdal:'palak pappu spinach dal palakura',v_palak:'palak spinach palakura',v_gongura:'gongura sorrel',v_methi:'methi menthikura fenugreek',
 v_aloogobi:'aloo gobi potato cauliflower',v_aloopalak:'aloo palak',v_alootomato:'aloo tomato potato tomato',v_chanamasala:'chana masala chole chickpea curry senagalu',v_rajmamasala:'rajma kidney beans',v_peas:'peas matar batani',
 v_egg_fry:'egg fry egg pepper fry boiled egg fry',v_eggomelette_curry:'omelette curry',
 p_pappu:'pappu dal toor dal kandi pappu',s_pappu:'pappu dal',p_dalveg:'dal veg pappu',p_dalfrozenveg:'dal veg',s_sambar:'sambar sambhar',s_rasam:'rasam charu chaaru',s_dalrasam:'pappu charu dal rasam',
 p_chk150:'chicken curry kodi kura chicken gravy',p_chk120:'chicken curry small',p_chkfry:'chicken fry kodi vepudu chicken roast',p_chk65:'chicken 65 chilli chicken fried chicken',p_chkkurma:'chicken kurma korma',p_chkpepper:'pepper chicken',p_chkveg:'chicken veg curry one pot',p_chkmush:'chicken mushroom',p_tandoori:'tandoori grilled chicken',p_chklegs:'drumstick chicken legs',p_chkairfry:'air fryer chicken drumsticks',
 p_mutton:'mutton curry goat curry mamsam',p_muttonfry:'mutton fry goat fry',p_eggc3:'egg curry guddu kura anda curry',p_eggc2:'egg curry small',p_eggpulusu:'egg pulusu guddu pulusu',p_eggbhurji:'egg bhurji scrambled eggs',
 p_paneer100:'paneer curry',p_paneerbm:'paneer butter masala',p_palakpaneer2:'palak paneer',p_palakpaneer:'palak paneer frozen',p_paneerfry:'paneer fry tawa paneer',p_ptikka:'paneer tikka',p_paneerveg:'paneer veg curry',
 p_tofu:'tofu curry',p_tofupepper:'tofu pepper fry',p_tofuveg:'tofu veg stir fry',p_soya:'soya chunks meal maker',p_soyafry:'soya fry meal maker vepudu',p_soyaveg:'soya veg curry meal maker',p_soyakeema:'soya keema',p_mushroom_masala:'mushroom masala',
 p_senagalu:'senagalu guggillu boiled chana chickpeas sundal',p_pesaralu:'pesalu green moong sundal sprouts boiled',p_chana200:'chana rajma chickpeas',p_chanachaat:'chana chaat chickpea chaat',
 c_rice150:'rice white rice annam steamed rice sona masoori basmati',c_rice100:'rice white rice small annam',c_brown:'brown rice',c_roti2:'roti chapati phulka',c_roti1:'roti chapati one',c_mroti2:'millet roti jowar ragi jonna',c_quinoa150:'quinoa',c_millet150:'millet korralu foxtail',c_potato:'boiled potato',
 c_idli2:'idli idly',c_dosa1:'dosa dosai',c_upma:'upma',c_poha:'poha atukulu',c_pulihora:'pulihora tamarind rice chitrannam',c_noodles:'noodles',c_orgpasta:'pasta',c_bread:'bread toast slices',
 t_vegbir:'veg biryani vegetable biryani',t_vegbir200:'veg biryani small',t_chkbir:'chicken biryani',t_chkbir200:'chicken biryani small',t_eggbir:'egg biryani',t_panbir:'paneer biryani',t_mutbir:'mutton biryani',t_pulao:'pulao pulav',
 t_eggfriedrice:'egg fried rice',t_vegfriedrice:'veg fried rice',t_chkfriedrice:'chicken fried rice',t_vegnoodles:'veg noodles hakka chowmein',t_curdrice:'curd rice daddojanam perugannam',t_lemonrice:'lemon rice nimmakaya pulihora chitrannam',t_tomatorice:'tomato rice tomato bath',t_sambarrice:'sambar rice',
 t_dosa2chutney:'dosa plate 2 dosa',t_idli4:'idli plate 4 idli',t_upmafull:'upma plate',t_pongal:'pongal ven pongal',t_chapati2curry:'chapati curry roti curry',t_parotta:'parotta kurma',t_pizza:'pizza',t_pastachk:'pasta chicken',t_pastaarr:'pasta arrabbiata red sauce',t_pastapan:'pasta paneer',t_puripotato:'puri aloo poori',t_bajji:'bajji punugulu mirchi',t_vada:'vada medu vada garelu',t_samosa:'samosa',t_murukku:'murukku mixture chakli chegodilu',
 s_chutney:'chutney coconut peanut pachadi',s_tomatochutney:'tomato chutney pachadi',s_avakaya:'avakaya pickle mango pickle achar',s_pickle:'pickle achar',s_podi:'podi kandi podi karam podi gunpowder',s_majjigapulusu:'majjiga pulusu kadhi',s_pulusu:'pulusu tamarind',s_curd100:'curd perugu dahi yogurt',s_curd150:'curd perugu dahi',s_buttermilk:'buttermilk majjiga chaas',s_raita:'raita',s_papad:'papad appadam',s_ghee:'ghee neyyi',
 k_gy:'greek yogurt',k_whey:'whey protein shake',k_curdchana:'curd chana',k_chana:'roasted chana putnalu',k_peanuts:'peanuts palli groundnut',k_eggs2:'boiled eggs',k_cheesestick:'cheese stick string cheese',k_pbapple:'apple peanut butter',
 f_apple:'apple',f_banana:'banana arati pandu',f_hbanana:'half banana',f_orange:'orange',f_clementine:'clementine mandarin',f_papaya:'papaya boppayi',f_guava:'guava jama',f_mango:'mango mamidi',f_grapes:'grapes draksha',f_pomeg:'pomegranate danimma anar',f_melon:'watermelon muskmelon',f_berries:'berries blueberries strawberries',f_mixedberries:'mixed berries frozen',
 b_eggs2:'2 eggs boiled eggs',b_eggs32:'3 eggs boiled',b_oatsmilkchia:'oats milk chia berries',b_oats:'oats water',b_granola:'granola milk',b_idli2:'idli sambar',b_dosa1:'dosa chutney',b_pesarattu:'pesarattu moong dosa',b_poha:'poha atukulu',b_upma:'upma rava',b_toasteggs:'toast eggs bread eggs',b_breadmaple:'bread maple syrup',b_pancake:'pancakes',b_ppancake:'protein pancakes',b_ovn:'overnight oats',
 d_limewater:'lime water lemon water nimmakaya',d_coffee:'coffee tea green tea',d_milk:'milk 3%',d_milk6:'milk 6%',k_chai:'chai tea masala chai',
};
const F = {}; const CAT_OF = {};
for(const c in RAW) RAW[c].forEach(r=>{ F[r[0]]={id:r[0],n:r[1],g:r[2],k:r[3],p:r[4],c:r[5],f:r[6],t:r[7],cat:c}; CAT_OF[r[0]]=c; });
// Telugu kitchen extras: logged as you actually cook and eat them
const EXTRA = {
  side:[
    ['s_tadka','Curry base (tadka): onion, tomato, ginger-garlic, 1 tsp cold-pressed peanut oil','1 serving (60 g)',80,1,6,5,'v'],
    ['s_tadka2','Curry base, 2 tsp oil (richer tadka)','1 serving (70 g)',125,1,6,10,'v'],
    ['s_curd6','Curd / perugu from 6% milk','100 g',85,4,5,6,'v'],
    ['s_curd3','Curd / perugu from 3% milk','100 g',62,4,5,3,'v'],
  ],
  prot:[
    ['p_mushtom','Mushroom tomato curry, home (with tadka)','100 g',75,3,6,5,'v'],
    ['p_vegbirleft','Veg biryani, home, leftover (with the oil it was cooked in)','100 g',155,3,24,5,'v'],
  ],
  veg:[
    ['v_bhendi40','Bhendi fry (bendakaya vepudu), home, with tadka','100 g',95,2,8,6,'v'],
    ['v_sweetkalehalf','Sweet Kale salad kit, half bag shared, with dressing and toppings','1/2 bag (about 175 g)',230,5,18,15,'v'],
    ['v_tomcurry','Tomato pappu-less curry (tomato kura) with tadka','100 g',70,1,7,4,'v'],
  ],
  snack:[
    ['k_mixnuts','Pista + walnut + cashew, roasted','30 g (10 g each)',180,5,7,15,'v'],
    ['k_pista10','Pistachios, roasted, shelled','10 g',56,2,3,4,'v'],
    ['k_walnut10','Walnuts','10 g',65,2,1,7,'v'],
    ['k_cashew10','Cashews, roasted','10 g',56,2,3,4,'v'],
    ['k_choc80','Dark chocolate 80%','10 g',58,1,4,4,'v'],
    ['k_peanut30','Peanuts, roasted (palli)','30 g',170,8,5,14,'v'],
  ],
};
for(const c in EXTRA) EXTRA[c].forEach(r=>{ F[r[0]]={id:r[0],n:r[1],g:r[2],k:r[3],p:r[4],c:r[5],f:r[6],t:r[7],cat:c}; CAT_OF[r[0]]=c; if(RAW[c]) RAW[c].push(r); });


// ================= PEOPLE & TEMPLATES =================
// template meal: {name,time,nv:[ids],v:[ids]}
const PEOPLE = {
  p1:{ name:'Person 1', target:{k:1900,p:165}, floor:1700, fatMax:75, carbMax:230, maint:2550, pMin:150, restCut:100, eggsVegDefault:false, kg:88,
    meals:[
      {name:'On waking', time:'7:00 am', nv:['d_limewater'], v:['d_limewater']},
      {name:'Breakfast', time:'8:00 am', nv:['b_eggs2','b_oatsmilkchia'], v:['b_eggs2','b_oatswheychia'], vNoEgg:['b_oatswheychia']},
      {name:'Mid-morning', time:'11:00 am', nv:['k_gychia'], v:['k_gychia']},
      {name:'Lunch', time:'1:00 pm', nv:['c_rice150','p_chkveg'], v:['c_rice100',['p_soyaveg',1.5]]},
      {name:'Pre-gym', time:'4:00 pm', nv:['k_whey','f_banana'], v:['k_whey','f_banana']},
      {name:'Gym', time:'5:00 to 6:00 pm', nv:['g_gym'], v:['g_gym']},
      {name:'Dinner (post-gym)', time:'7:00 pm', nv:['c_rice100','p_chkmush'], v:['c_rice100',['p_tofuveg',1.5]]},
    ],
    notes:null },
  p2:{ name:'Person 2', target:{k:1550,p:130}, floor:1350, fatMax:60, carbMax:170, maint:2200, pMin:115, restCut:80, eggsVegDefault:false, kg:85,
    meals:[
      {name:'On waking', time:'7:00 am', nv:['d_tablet'], v:['d_tablet']},
      {name:'Breakfast', time:'8:00 am', nv:['b_eggs2',['b_oatsmilkchia',0.5]], v:['b_oatswheychia'], vNoEgg:['b_oatswheychia']},
      {name:'Mid-morning', time:'11:00 am', nv:['k_gychia'], v:['k_gychia']},
      {name:'Lunch', time:'1:00 pm', nv:['c_rice100','p_chkveg120'], v:['c_rice100','p_soyaveg']},
      {name:'Pre-gym', time:'4:00 pm', nv:['k_whey','f_hbanana'], v:['k_whey','f_hbanana']},
      {name:'Gym', time:'5:00 to 6:00 pm', nv:['g_gym'], v:['g_gym']},
      {name:'Dinner (post-gym)', time:'7:00 pm', nv:['c_rice100','p_chkmush'], v:['p_tofuveg','v_bigsalad']},
    ],
    notes:'' }
};
const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], FULL=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const VEG_DAYS=new Set([1,4,5]); // Tue, Fri, Sat

// ================= MUSCLE MAP =================
// Simplified front + back figure. Each region is a path with an id; highlighted via class.
const BODY = `<svg viewBox="0 0 120 150" class="bodymap" aria-hidden="true">
<g class="fig front" transform="translate(4,2)">
 <circle cx="26" cy="12" r="8" class="skin"/>
 <path d="M14 24h24v30H14z" class="m" data-m="chest"/>
 <path d="M6 24h8v18H6zM38 24h8v18h-8z" class="m" data-m="shoulders"/>
 <path d="M6 42h6v18H6zM40 42h6v18h-6z" class="m" data-m="biceps"/>
 <path d="M14 54h24v22H14z" class="m" data-m="abs"/>
 <path d="M11 54h3v22h-3zM38 54h3v22h-3z" class="m" data-m="obliques"/>
 <path d="M5 60h7v16H5zM40 60h7v16h-7z" class="m" data-m="forearms"/>
 <path d="M14 78h11v34H14zM27 78h11v34H27z" class="m" data-m="quads"/>
 <path d="M14 114h11v24H14zM27 114h11v24H27z" class="m" data-m="shins"/>
</g>
<g class="fig back" transform="translate(66,2)">
 <circle cx="26" cy="12" r="8" class="skin"/>
 <path d="M14 22h24v8H14z" class="m" data-m="traps"/>
 <path d="M6 24h8v18H6zM38 24h8v18h-8z" class="m" data-m="shoulders"/>
 <path d="M14 30h24v26H14z" class="m" data-m="back"/>
 <path d="M6 42h6v18H6zM40 42h6v18h-6z" class="m" data-m="triceps"/>
 <path d="M14 56h24v10H14z" class="m" data-m="lowerback"/>
 <path d="M14 66h24v14H14z" class="m" data-m="glutes"/>
 <path d="M14 80h11v30H14zM27 80h11v30H27z" class="m" data-m="hamstrings"/>
 <path d="M14 112h11v26H14zM27 112h11v26H27z" class="m" data-m="calves"/>
</g></svg>`;
function muscleMap(list){ const set=new Set(list); return BODY.replace(/data-m="([a-z]+)"/g,(m,k)=>set.has(k)?`data-m="${k}" class="m on"`:m).replace(/class="m" data-m="([a-z]+)" class="m on"/g,'class="m on" data-m="$1"'); }
const MUSCLES = {
 'Barbell or dumbbell bench press':['chest','triceps','shoulders'],'Incline dumbbell press':['chest','shoulders','triceps'],'Chest-supported machine fly or cable fly':['chest'],'Push-ups (Person 2: incline on a bench)':['chest','triceps','abs'],'Rope triceps pushdown':['triceps'],
 'Lat pulldown (wide grip)':['back','biceps'],'Seated cable row':['back','traps','biceps'],'One-arm dumbbell row':['back','biceps','obliques'],'Face pulls':['shoulders','traps','back'],'Dumbbell bicep curl':['biceps'],'Hammer curl':['biceps','forearms'],
 'Barbell back squat or leg press':['quads','glutes','hamstrings','abs'],'Walking lunges':['quads','glutes','hamstrings'],'Leg extension':['quads'],'Standing calf raise':['calves'],
 'Seated dumbbell shoulder press':['shoulders','triceps'],'Dumbbell lateral raise':['shoulders'],'Rear delt fly (machine or bent over)':['shoulders','back'],'EZ bar or dumbbell curl':['biceps'],'Overhead triceps extension':['triceps'],'Cable or dumbbell shrug':['traps'],
 'Romanian deadlift (barbell or dumbbell)':['hamstrings','glutes','lowerback'],'Hip thrust or glute bridge':['glutes','hamstrings'],'Lying or seated leg curl':['hamstrings'],'Bulgarian split squat':['quads','glutes'],
 'Plank':['abs','obliques','lowerback'],'Side plank (obliques, love handles)':['obliques','abs'],'Cable woodchop or band chop':['obliques','abs'],'Dead bug':['abs'],'Hanging knee raise or lying leg raise':['abs'],'Russian twist (obliques)':['obliques','abs'],'Bicycle crunch':['abs','obliques'],'Suitcase carry (obliques, anti-lean)':['obliques','forearms','traps'],
 'Brisk walk or hike':['quads','calves','glutes'],'Walk + stretching':['quads','calves','hamstrings'],
};
// Form guides: every exercise maps to a verified Fitbod page (video + step-by-step + common mistakes)
const DEMO = {
  'Barbell or dumbbell bench press':['barbell-bench-press','Barbell bench press'],
  'Incline dumbbell press':['dumbbell-incline-bench-press','Dumbbell incline bench press'],
  'Chest-supported machine fly or cable fly':['machine-fly','Machine fly'],
  'Push-ups (Person 2: incline on a bench)':['push-up','Push up'],
  'Rope triceps pushdown':['cable-rope-tricep-extension','Cable rope tricep extension'],
  'Lat pulldown (wide grip)':['lat-pulldown','Lat pulldown'],
  'Seated cable row':['cable-row','Cable row'],
  'One-arm dumbbell row':['dumbbell-row','Dumbbell row'],
  'Face pulls':['cable-face-pull','Cable face pull'],
  'Dumbbell bicep curl':['dumbbell-bicep-curl','Dumbbell bicep curl'],
  'Hammer curl':['hammer-curls','Hammer curls'],
  'Barbell back squat or leg press':['back-squat','Back squat'],
  'Walking lunges':['walking-lunge','Walking lunge'],
  'Leg extension':['leg-extension','Leg extension'],
  'Standing calf raise':['calf-raise','Calf raise'],
  'Seated dumbbell shoulder press':['dumbbell-shoulder-press','Dumbbell shoulder press'],
  'Dumbbell lateral raise':['dumbbell-lateral-raise','Dumbbell lateral raise'],
  'Rear delt fly (machine or bent over)':['machine-reverse-fly','Machine reverse fly'],
  'EZ bar or dumbbell curl':['ez-bar-curl','EZ-bar curl'],
  'Overhead triceps extension':['seated-tricep-press','Seated tricep press (dumbbell)'],
  'Cable or dumbbell shrug':['dumbbell-shrug','Dumbbell shrug'],
  'Romanian deadlift (barbell or dumbbell)':['romanian-deadlift','Romanian deadlift'],
  'Hip thrust or glute bridge':['barbell-hip-thrust','Barbell hip thrust'],
  'Lying or seated leg curl':['seated-leg-curl','Seated leg curl'],
  'Bulgarian split squat':['bulgarian-split-squat','Bulgarian split squat'],
  'Plank':['plank','Plank'],
  'Side plank (obliques, love handles)':['side-bridge','Side bridge (side plank)'],
  'Cable woodchop or band chop':['cable-wood-chop','Cable wood chop'],
  'Dead bug':['dead-bug','Dead bug'],
  'Hanging knee raise or lying leg raise':['hanging-knee-raise','Hanging knee raise'],
  'Russian twist (obliques)':['russian-twist','Russian twist'],
  'Bicycle crunch':['bicycle-crunch','Bicycle crunch'],
  'Suitcase carry (obliques, anti-lean)':['single-arm-farmer-walk','Single arm farmer walk'],
};
// Alternates shown as a second link where the main lift has an "or"
const DEMO2 = {
  'Barbell or dumbbell bench press':['dumbbell-bench-press','Dumbbell version'],
  'Chest-supported machine fly or cable fly':['cable-crossover','Cable fly'],
  'Barbell back squat or leg press':['leg-press','Leg press'],
  'Rear delt fly (machine or bent over)':['dumbbell-rear-delt-raise','Bent-over dumbbell'],
  'Overhead triceps extension':['ez-bar-overhead-tricep-extension','EZ-bar version'],
  'Hanging knee raise or lying leg raise':['leg-raise','Lying leg raise'],
};
const FITBOD='https://fitbod.me/exercises/';
const demoHtml=(name)=>{ const d=DEMO[name]; if(!d) return ''; const a=DEMO2[name];
  return `<div class="demos"><a class="demo" href="${FITBOD}${d[0]}" target="_blank" rel="noopener">▶ Form guide</a>${a?`<a class="demo alt" href="${FITBOD}${a[0]}" target="_blank" rel="noopener">${a[1]}</a>`:''}<small class="dsrc">Fitbod · ${d[1]}</small></div>`; };

// ================= WORKOUTS =================
// [exercise, cue, Person 1 sets x reps, Person 2 sets x reps]
const WORKOUTS = [
 {day:0, name:'Chest', sub:'+ 10 min incline walk', ex:[
   ['Barbell or dumbbell bench press','Shoulder blades pinched, bar to lower chest, 2 sec down','4 x 6-8','3 x 10-12'],
   ['Incline dumbbell press','30 degree bench, upper chest, stop 1 inch above chest','3 x 8-10','3 x 10-12'],
   ['Chest-supported machine fly or cable fly','Squeeze 1 sec at the middle, do not bang the handles','3 x 12-15','3 x 12-15'],
   ['Push-ups (Person 2: incline on a bench)','Body straight, to failure on last set','2 x max','2 x max'],
   ['Rope triceps pushdown','Elbows pinned, full lockout','3 x 12','3 x 12'],
 ], foot:'Rest 90 sec between sets on press, 60 sec on the rest. Add 2.5 kg when you hit the top of the rep range on every set.'},
 {day:1, name:'Back', sub:'+ biceps', ex:[
   ['Lat pulldown (wide grip)','Pull to upper chest, elbows down and back, no leaning','4 x 8-10','3 x 10-12'],
   ['Seated cable row','Chest up, squeeze shoulder blades, 2 sec back','3 x 8-10','3 x 10-12'],
   ['One-arm dumbbell row','Knee on bench, pull to hip not shoulder','3 x 10 each','3 x 10 each'],
   ['Face pulls','Rope to forehead, thumbs back. Fixes posture from desk sitting','3 x 15','3 x 15'],
   ['Dumbbell bicep curl','No swinging, 2 sec down','3 x 10-12','3 x 12'],
   ['Hammer curl','Neutral grip, forearms and biceps','2 x 12','2 x 12'],
 ], foot:'Back is the muscle group that makes you look V-shaped and fixes the love-handle look. Do not skip rows for curls.'},
 {day:2, name:'Legs (quads)', sub:'', ex:[
   ['Barbell back squat or leg press','Below parallel if knees allow, drive through heels','4 x 6-8','3 x 10-12'],
   ['Walking lunges','Long step, back knee to 2 inches off the floor','3 x 10 each','3 x 10 each'],
   ['Leg extension','Pause 1 sec at the top','3 x 12-15','3 x 12-15'],
   ['Standing calf raise','Full stretch at the bottom, 2 sec hold at top','3 x 15','3 x 15'],
 ], foot:'Biggest calorie burn of the week. Eat your full dinner tonight. Legs are what drive the "lean fast" part.'},
 {day:3, name:'Shoulders and arms', sub:'', ex:[
   ['Seated dumbbell shoulder press','Elbows slightly forward, do not arch','4 x 8-10','3 x 10-12'],
   ['Dumbbell lateral raise','Lead with elbows, stop at shoulder height, light weight','4 x 12-15','3 x 12-15'],
   ['Rear delt fly (machine or bent over)','Small weight, squeeze the back of the shoulders','3 x 15','3 x 15'],
   ['EZ bar or dumbbell curl','Strict','3 x 10','3 x 12'],
   ['Overhead triceps extension','Elbows close to head, full stretch','3 x 12','3 x 12'],
   ['Cable or dumbbell shrug','Hold 1 sec at the top','2 x 15','2 x 15'],
 ], foot:'Lateral raises are what make the waist look smaller by comparison. Light weight, perfect form, every rep.'},
 {day:4, name:'Lower (hamstrings, glutes)', sub:'+ 10 min incline walk', ex:[
   ['Romanian deadlift (barbell or dumbbell)','Hips back, bar brushes the thighs, flat back, feel the hamstrings','4 x 8','3 x 10-12'],
   ['Hip thrust or glute bridge','Chin tucked, squeeze 2 sec at the top','3 x 10-12','4 x 12 (Person 2 priority)'],
   ['Lying or seated leg curl','2 sec down','3 x 12','3 x 12-15'],
   ['Bulgarian split squat','Rear foot on bench, torso slightly forward','3 x 8 each','2 x 10 each'],
 ], foot:'Posterior chain day. This plus Tuesday back is what fixes the back-fat and love-handle area, together with the deficit.'},
 {day:5, name:'Active rest', sub:'', ex:[['Brisk walk or hike','45 to 60 min, or 8,000+ steps across the day','','']], foot:'Non-gym day. Steps still count.'},
 {day:6, name:'Rest', sub:'', ex:[['Walk + stretching','30 min walk, 10 min stretch: hips, chest, hamstrings','','']], foot:'Sunday prep day for food. Weigh in Monday morning.'},
];
const CORE = {
  A:{name:'Core finisher A (Mon, Wed, Fri)', ex:[
    ['Plank','Glutes squeezed, ribs down, breathe','3 x 45 sec','3 x 30 sec'],
    ['Side plank (obliques, love handles)','Hips high, stack feet, hold each side','3 x 30 sec each','3 x 20 sec each'],
    ['Cable woodchop or band chop','High to low, rotate from the ribs, arms straight','3 x 12 each','3 x 12 each'],
    ['Dead bug','Lower back glued to the floor, slow','3 x 10 each','3 x 10 each'],
  ]},
  B:{name:'Core finisher B (Tue, Thu)', ex:[
    ['Hanging knee raise or lying leg raise','Slow down, no swinging','3 x 12','3 x 10'],
    ['Russian twist (obliques)','Feet down for Person 2, feet up for Person 1, touch the floor each side','3 x 15 each','3 x 12 each'],
    ['Bicycle crunch','Elbow to opposite knee, slow, exhale on the twist','3 x 15 each','3 x 12 each'],
    ['Suitcase carry (obliques, anti-lean)','Heavy dumbbell in one hand, walk tall 20 m, switch','3 x 20 m each','3 x 20 m each'],
  ]},
};
function renderWorkout(){
  const k=S.who==='p1';
  document.getElementById('woTitle').textContent=P().name+' · weekly split';
  document.getElementById('woSub').textContent = k ? 'Goal: build muscle while cutting. Heavy compound lifts, 6 to 10 reps, add weight every week you hit the top of the range. 60 min, 5 days.' : 'Goal: strong and toned. Same lifts, 10 to 15 reps, lighter weight, glutes and back as priority. 60 min, 5 days. If a week feels flat, drop one set from each exercise, do not skip the day.';
  const w=document.getElementById('woDays'); w.innerHTML='';
  const lg=document.createElement('div'); lg.className='legend'; lg.innerHTML=`<span class="lgsw"></span> Muscles worked (front and back figure). Tap "Form guide" for the Fitbod video, step-by-step cues and common mistakes before your first session with a lift.`; w.appendChild(lg);
  WORKOUTS.forEach(d=>{ const box=document.createElement('div'); box.className='wo'+(d.day===S.day?' today':'');
    let h=`<div class="hd"><b>${DAYS[d.day]} · ${d.name}</b><span>${d.sub}</span></div>`;
    d.ex.forEach(e=>{ const sr=k?e[2]:e[3]; h+=`<div class="ex">${muscleMap(MUSCLES[e[0]]||[])}<div class="exbody"><div class="nm">${e[0]}</div><div class="cue">${e[1]}</div>${demoHtml(e[0])}</div>${sr?`<div class="sr">${sr}</div>`:''}</div>`; });
    if(d.day<=4){ const c=(d.day===1||d.day===3)?CORE.B:CORE.A; h+=`<div class="corehd">${c.name} · 8 min</div>`; c.ex.forEach(e=>{ const sr=k?e[2]:e[3]; h+=`<div class="ex">${muscleMap(MUSCLES[e[0]]||[])}<div class="exbody"><div class="nm">${e[0]}</div><div class="cue">${e[1]}</div>${demoHtml(e[0])}</div><div class="sr">${sr}</div></div>`; }); }
    h+=`<div class="foot">${d.foot}</div>`; box.innerHTML=h; w.appendChild(box); });
  const gen=document.createElement('div'); gen.className='rules'; gen.innerHTML=`<h3>Rules for the gym</h3><ul>
    <li><b>Core every gym day, 8 min at the end.</b> Finisher A on Mon, Wed, Fri, finisher B on Tue, Thu. Side planks, chops, twists and carries are the oblique (love handle) work. Be clear on this: core training builds the muscle underneath, the calorie deficit is what removes the fat on top. Both together is what makes the waist change. No amount of crunches works without the deficit.</li>
    <li><b>Warm up 5 min</b> on the bike or incline walk, then 2 light sets of the first exercise before your working sets.</li>
    <li><b>Progressive overload:</b> write down the weight. When you hit the top of the rep range on all sets, add 2.5 kg (upper) or 5 kg (lower) next week. This is the whole muscle-building method, there is no other trick.</li>
    <li><b>Last rep should be hard</b> but with clean form. 1 or 2 reps left in the tank on most sets, go to failure only on the last set of isolation moves.</li>
    <li><b>Rest:</b> 90 sec on big lifts, 60 sec on the rest. Phone away, the hour is enough only if you move.</li>
    <li><b>Train together, different weights.</b> Same exercise order means one machine setup, swap the pin.</li>
    <li><b>Cardio:</b> 10 min incline walk after Mon and Fri lifting, plus 8,000 to 10,000 steps daily. No long cardio sessions, they eat recovery and muscle.</li>
    <li><b>Deload every 6th week:</b> same exercises, half the sets. You will come back stronger.</li>
    <li>Missed a day? Do it the next day and shift the week. Never double up two body parts to catch up.</li></ul>`;
  w.appendChild(gen);
}

// ================= STATE =================
let S={who:'p1', day:(new Date().getDay()+6)%7, view:'plan', people:{}};
try{ const o=JSON.parse(localStorage.getItem('kl-meal-v2')||'null'); if(o&&o.people){ S.people=o.people; S.who=o.who||'p1'; } }catch(e){}
loadAllCustoms();
let storeOK=true;
// ---------- CLOUD SYNC (api.php on your own hosting) ----------
const CLOUD={on:false, key:'', status:'local', rev:{}, timer:{}, busy:{}, dirty:{}};
function setStatus(t,c){ CLOUD.status=t; const el=document.getElementById('sync'); if(!el) return; el.textContent=t; el.className='sync '+(c||''); }
function apiUrl(){ return 'api.php'; }
async function api(a,who,body){ const r=await fetch(apiUrl()+'?a='+a+(who?'&who='+who:''),{method:body?'POST':'GET',headers:{'X-App-Key':CLOUD.key,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,cache:'no-store'}); if(r.status===401) throw new Error('auth'); if(r.status===429) throw new Error('locked'); if(!r.ok) throw new Error('http '+r.status); return r.json(); }
async function cloudInit(){
  if(!/^https?:/.test(location.protocol)) return;
  try{ CLOUD.key=localStorage.getItem('kl-key')||''; }catch(e){}
  let ping; try{ ping=await api('ping'); }catch(e){ return; }   // no api.php here -> stay local (e.g. the claude.ai copy)
  CLOUD.on=true;
  if(!ping.auth){ askKey(); return; }
  await cloudPull();
}
function askKey(msg){ const ov=document.getElementById('ovKey'); ov.classList.add('show'); document.getElementById('keyMsg').textContent=msg||''; setStatus('Not signed in','warn'); }
async function cloudPull(){
  setStatus('Syncing…');
  try{
    for(const who of ['p1','p2']){ const r=await api('get',who); if(r.data){ CLOUD.rev[who]=r.rev; if(!CLOUD.dirty[who]) S.people[who]=r.data; } else if(S.people[who]){ CLOUD.dirty[who]=true; schedulePush(who,0); } }
    loadAllCustoms(); saveLocal(); render(); setStatus('Synced','ok');
  }catch(e){ if(e.message==='auth'){ askKey('Wrong password. Try again.'); } else if(e.message==='locked'){ askKey('Too many wrong attempts. Wait 15 minutes.'); } else setStatus('Offline, saved on this device','warn'); }
}
function schedulePush(who,delay=700){ if(!CLOUD.on||!CLOUD.key) return; CLOUD.dirty[who]=true; clearTimeout(CLOUD.timer[who]); CLOUD.timer[who]=setTimeout(()=>cloudPush(who),delay); }
async function cloudPush(who){ if(CLOUD.busy[who]){ schedulePush(who,500); return; } CLOUD.busy[who]=true; setStatus('Saving…');
  try{ const r=await api('put',who,{data:S.people[who]}); CLOUD.rev[who]=r.rev; CLOUD.dirty[who]=false; setStatus('Synced','ok'); }
  catch(e){ if(e.message==='auth') askKey('Wrong password. Try again.'); else if(e.message==='locked') askKey('Too many wrong attempts. Wait 15 minutes.'); else { setStatus('Offline, will retry','warn'); setTimeout(()=>schedulePush(who,0),15000); } }
  finally{ CLOUD.busy[who]=false; } }
// refresh from the server when the app comes back to the foreground (other phone may have changed things)
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible'&&CLOUD.on&&CLOUD.key&&!Object.values(CLOUD.dirty).some(Boolean)) cloudPull(); });
function saveLocal(){ try{ localStorage.setItem('kl-meal-v2',JSON.stringify({people:S.people,who:S.who,savedAt:new Date().toISOString()})); storeOK=true; }catch(e){ storeOK=false; } }
function save(){ saveLocal(); schedulePush(S.who); }
try{ if(navigator.storage&&navigator.storage.persist) navigator.storage.persist().catch(()=>{}); }catch(e){}
function P(){ return PEOPLE[S.who]; }
function PS(){ if(!S.people[S.who]) S.people[S.who]={eggsVeg:P().eggsVegDefault, allVeg:false, days:{}, weights:[]}; const ps=S.people[S.who]; if(!ps.vegDays) ps.vegDays=[1,4,5]; if(!ps.m2){ ps.eggsVeg=false; ps.m2=1; } if(!ps.customs) ps.customs=[]; ps.customs.forEach(c=>{ if(!F[c.id]) F[c.id]=c; }); return ps; }
function loadAllCustoms(){ Object.values(S.people).forEach(ps=>(ps.customs||[]).forEach(c=>{ if(!F[c.id]) F[c.id]=c; })); }
function isVeg(d=S.day){ const ps=PS(); return ps.allVeg || (!ps.allNonVeg && ps.vegDays.includes(d)); }
function toggleVegDay(d){ const ps=PS(); if(ps.allVeg){ ps.allVeg=false; ps.vegDays=[0,1,2,3,4,5,6]; } if(ps.allNonVeg){ ps.allNonVeg=false; ps.vegDays=[]; } const i=ps.vegDays.indexOf(d); if(i>=0) ps.vegDays.splice(i,1); else ps.vegDays.push(d); save(); render(); }
const SEA=/fish|prawn|shrimp|basa|sardine|seafood/i;
function allowed(it, d=S.day){ if(SEA.test(it.n)&&!PS().seafood) return false; if(!isVeg(d)) return true; const t=it.t; if(t==='n'||t==='tn') return false; if(t==='e'||t==='te') return PS().eggsVeg; return true; }
function template(d){ const veg=isVeg(d); return P().meals.map(m=>{ let ids = veg ? ((!PS().eggsVeg && m.vNoEgg) ? m.vNoEgg : m.v) : m.nv; return {name:m.name,time:m.time,items:ids.map(x=>Array.isArray(x)?{id:x[0],q:x[1]}:{id:x,q:1})}; }); }
// A day starts empty (it is a log). Today starts from the plan template so there is something to follow.
function fresh(d){ const isToday=ymd(weekDate(d))===ymd(new Date()); return isToday ? template(d) : P().meals.map(m=>({name:m.name,time:m.time,items:[]})); }
function fillTemplate(d=S.day){ const ps=PS(); const plan=dayPlan(d); const t=template(d); plan.forEach((m,i)=>{ if(t[i]) m.items=t[i].items; }); ps.manual=ps.manual||{}; ps.manual[dayKeyFor(d)+(isVeg(d)?'v':'n')+(ps.eggsVeg?'e':'x')]=1; save(); render(); }
function dayKeyFor(d){ return ymd(weekDate(d)); }
function sameAsTemplate(plan,d){ const t=template(d); return JSON.stringify(plan.map(m=>m.items))===JSON.stringify(t.map(m=>m.items)); }
function pruneUntouched(ps){ if(ps.m6) return; const today=ymd(new Date()); const keep=ps.manual||{};
  Object.keys(ps.days).forEach(k=>{ const date=k.slice(0,10); if(date===today||!/^\d{4}-\d\d-\d\d$/.test(date)) return; const idx=(new Date(date+'T12:00').getDay()+6)%7; if(keep[k]) return; try{ if(sameAsTemplate(ps.days[k],idx)) delete ps.days[k]; }catch(e){} }); ps.m4=1; ps.m6=1; }
function fixUtcKeys(ps){ if(ps.m5) return; const vd=ps.vegDays||[]; const vegOf=(date)=>{ const i=(new Date(date+'T12:00').getDay()+6)%7; return ps.allVeg || (!ps.allNonVeg && vd.includes(i)); };
  if(!ps.allVeg&&!ps.allNonVeg&&vd.length&&vd.length<7){ Object.keys(ps.days).sort().forEach(k=>{ const m=k.match(/^(\d{4}-\d\d-\d\d)([vn])([ex])$/); if(!m) return; const flagVeg=m[2]==='v'; const d=new Date(m[1]+'T12:00'); const prev=new Date(d); prev.setDate(d.getDate()-1); const pk=ymd(prev)+m[2]+m[3];
      if(vegOf(m[1])!==flagVeg && vegOf(ymd(prev))===flagVeg && !ps.days[pk]){ ps.days[pk]=ps.days[k]; delete ps.days[k]; } }); }
  Object.keys(ps.log||{}).forEach(k=>{}); ps.m5=1; }
function migrateDays(ps){ if(ps.m3){ fixUtcKeys(ps); pruneUntouched(ps); return; } const todayIdx=(new Date().getDay()+6)%7; Object.keys(ps.days).forEach(k=>{ const m=k.match(/^([0-6])([vn])([ex])$/); if(m){ const nk=dayKeyFor(+m[1])+m[2]+m[3]; if(!ps.days[nk]) ps.days[nk]=ps.days[k]; delete ps.days[k]; } }); ps.m3=1; fixUtcKeys(ps); pruneUntouched(ps); }
function dayPlan(d=S.day){ const ps=PS(); migrateDays(ps); const key=dayKeyFor(d)+(isVeg(d)?'v':'n')+(PS().eggsVeg?'e':'x'); if(!ps.days[key]) ps.days[key]=fresh(d); return ps.days[key]; }
const MEAL_SHARE=[['breakfast',.18],['mid-morning',.12],['lunch',.28],['pre-gym',.15],['dinner',.27]];
function mealShare(name){ const n=name.toLowerCase(); const f=MEAL_SHARE.find(x=>n.includes(x[0])); return f?f[1]:0; }
function tot(items){ const t={k:0,p:0,c:0,f:0}; items.forEach(x=>{ const it=F[x.id]; if(!it) return; t.k+=it.k*x.q; t.p+=it.p*x.q; t.c+=it.c*x.q; t.f+=it.f*x.q; }); for(const k in t) t[k]=Math.round(t[k]); return t; }
function tagHtml(t){ return t==='v'?'<em>veg</em>':t==='e'?'<em class="e">egg</em>':t==='n'?'<em class="n">non-veg</em>':t==='t'?'<em data-s="s14">treat</em>':t==='tn'?'<em class="n">treat, non-veg</em>':'<em class="e">treat, egg</em>'; }
function pill(t){ return t==='v'?'v':t==='e'||t==='te'?'e':t==='n'||t==='tn'?'n':'t'; }
function baseOf(it){ if(!it.g) return null; let m=it.g.match(/(\d+(?:\.\d+)?)\s*(g|ml)\b/); if(m) return {n:+m[1],unit:m[2],step:m[2]==='ml'?50:10}; m=it.g.match(/^(\d+(?:\.\d+)?)\b/); if(m) return {n:+m[1],unit:'pcs',step:1}; if(/^half\b/i.test(it.g)) return {n:0.5,unit:'pcs',step:0.5}; return null; }
function fmtG(it,q){ if(!it.g) return q===1?'':q+' x'; if(q===1) return it.g; if(/\d+\s*(g|ml)\b/.test(it.g)) return it.g.replace(/(\d+(?:\.\d+)?)\s*(g|ml)\b/g,(m,a,u)=>Math.round(+a*q)+' '+u); const b=baseOf(it); if(b&&b.unit==='pcs') return it.g.replace(/^(\d+(?:\.\d+)?|half)\b/i,()=>String(+(b.n*q).toFixed(1))); return q+' x '+it.g; }

// ================= RENDER =================
let _lastView=null,_lastDay=null;
// Date of weekday i (0=Mon) in the current week
// Local calendar date as YYYY-MM-DD (never UTC: evenings in Eastern time are already tomorrow in UTC)
function ymd(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
S.week=S.week||0; // 0 = this week, -1 = last week, +1 = next week
function weekDate(i){ const t=new Date(); const dow=(t.getDay()+6)%7; const d=new Date(t); d.setDate(t.getDate()-dow+i+7*S.week); return d; }
function renderWeekNav(){ const a=weekDate(0), b=weekDate(6); const f=(d,o)=>d.toLocaleDateString(undefined,o); const same=a.getMonth()===b.getMonth();
  const lbl=document.getElementById('wkLbl'); lbl.textContent=(S.week===0?'This week · ':S.week===-1?'Last week · ':S.week===1?'Next week · ':'')+f(a,{day:'numeric',month:'short'})+' – '+f(b,same?{day:'numeric'}:{day:'numeric',month:'short'});
  document.getElementById('wkPrev').onclick=()=>{ S.week--; render(); }; document.getElementById('wkNext').onclick=()=>{ S.week++; render(); }; lbl.onclick=()=>{ S.week=0; S.day=(new Date().getDay()+6)%7; render(); }; }
function render(){
  const same=(_lastView===S.view&&_lastDay===S.day); const _sy=same?window.scrollY:0; _lastView=S.view; _lastDay=S.day;
  const ps=PS();
  document.querySelectorAll('.who').forEach(b=>b.classList.toggle('on',b.dataset.who===S.who));
  document.getElementById('whoName').textContent=P().name;
  const hh=new Date().getHours(); const greet=hh<12?'Good morning':hh<17?'Good afternoon':'Good evening';
  const gEl=document.getElementById('greet'); if(gEl){ gEl.textContent=(window.innerWidth<560?greet.replace('Good ','').replace(/^./,c=>c.toUpperCase()):greet)+', '+P().name; }
  const dEl=document.getElementById('today'); if(dEl){ dEl.textContent=new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'}); }
  document.getElementById('allVeg').checked=ps.allVeg; document.getElementById('allNonVeg').checked=!!ps.allNonVeg; document.getElementById('eggsVeg').checked=ps.eggsVeg; document.getElementById('seafood').checked=!!ps.seafood;
  const vd=document.getElementById('vegDays'); vd.innerHTML=''; DAYS.forEach((n,i)=>{ const b=document.createElement('button'); const v=isVeg(i); b.className='vd'+(v?' veg':''); b.innerHTML=`${n}<small>${v?'VEG':'NON'}</small>`; b.onclick=()=>toggleVegDay(i); vd.appendChild(b); });
  renderWeekNav(); const d=document.getElementById('days'); d.innerHTML='';
  DAYS.forEach((n,i)=>{ const b=document.createElement('div'); const todayIdx=(new Date().getDay()+6)%7; b.className='dayc'+(i===S.day?' on':'')+((S.week<0||(S.week===0&&i<todayIdx))?' past':'')+((S.week===0&&i===todayIdx)?' today':''); const v=isVeg(i);
    const dt=weekDate(i); b.innerHTML=`<small>${n}</small><b>${dt.getDate()}</b><i class="${v?'veg':''}" title="${v?'Veg day':'Non-veg day'}"></i>`; b.onclick=()=>{S.day=i;S.view='plan';render();}; d.appendChild(b); });
  document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.view===S.view));
  document.getElementById('vPlan').hidden=S.view!=='plan';
  document.getElementById('vWeek').hidden=S.view!=='week';
  document.getElementById('vWeight').hidden=S.view!=='weight';
  document.getElementById('vWorkout').hidden=S.view!=='workout';
  if(S.view==='plan') renderPlan(); else if(S.view==='week') renderWeek(); else if(S.view==='workout') renderWorkout(); else renderWeight();
  requestAnimationFrame(()=>window.scrollTo(0,_sy));
}
function renderPlan(){
  const ps=PS(); const plan=dayPlan();
  document.getElementById('title').textContent=P().name+' · '+FULL[S.day];
  const other=S.who==='p1'?'p2':'p1'; const cb=document.getElementById('copyDay'); cb.textContent='Copy to '+PEOPLE[other].name; cb.title='Give '+PEOPLE[other].name+' the same meals, scaled to their portions';
  cb.onclick=()=>{ if(!confirm(`Replace ${PEOPLE[other].name}'s ${FULL[S.day]} with what ${P().name} ate, portions scaled to ${PEOPLE[other].name}'s target? Non-veg and eggs are dropped on ${PEOPLE[other].name}'s veg days.`)) return; const n=copyDayTo(other); schedulePush(other); alert(`${n} items copied to ${PEOPLE[other].name}. Tap ${PEOPLE[other].name} at the top to review.`); };
  const sw=document.getElementById('daySwitch'); sw.className='daysw'+(isVeg()?' veg':''); sw.textContent = isVeg() ? 'Veg day · tap for non-veg' : 'Non-veg day · tap for veg'; sw.onclick=()=>toggleVegDay(S.day);
  document.getElementById('subtitle').textContent = isVeg() ? (ps.allVeg?'Veg month is on. ':'Veg day. ')+'Protein from paneer, pappu, Greek yogurt, soya, tofu and whey'+(ps.eggsVeg?' (eggs allowed).':' (no eggs).') : (ps.allNonVeg?'Non-veg every day is on. ':'Non-veg day. ')+'Chicken at lunch and dinner, same dishes as Person 2, bigger portions.';
  const n=document.getElementById('pnotes'); n.innerHTML=P().notes||''; n.style.display=P().notes?'block':'none';
  const wrap=document.getElementById('meals'); wrap.innerHTML=''; const all=[];
  const dayP=plan.reduce((n,m)=>n+tot(m.items).p,0); const dayOK=dayP>=P().target.p-10;
  plan.forEach((m,mi)=>{
    const mt=tot(m.items); all.push(...m.items);
    const box=document.createElement('div'); box.className='meal'+(/^gym$/i.test(m.name.trim())?' gym':'');
    const tshort=m.time.replace(' to ','–').replace(/:00/g,'').replace(/ (am|pm)/g,'$1');
    const wo=WORKOUTS.find(x=>x.day===S.day); const mname=/^gym$/i.test(m.name.trim())&&wo?`Gym · ${wo.name}`:m.name;
    const share=mealShare(m.name); const ptgt=share?Math.round(P().target.p*share):0; const pc = !ptgt?'var(--muted)':(dayOK||mt.p>=ptgt-3)?'var(--mint)':mt.p>=ptgt*0.7?'var(--amber)':'var(--rose)';
    const mcat=/gym/i.test(m.name)?'gym':/breakfast/i.test(m.name)?'bf':/waking/i.test(m.name)?'drink':/lunch|dinner/i.test(m.name)?'prot':'snack';
    let html=`<div class="hd"><span class="ico ${mcat} tile">${ICON[mcat]||ICON.mine}</span><div class="hdt"><b>${mname}</b><span><em>${tshort}</em> · ${mt.k} kcal${ptgt?` · <b class="pcol" data-c="${pc}">${mt.p} / ${ptgt} g protein</b>`:''}</span></div><button class="btn addr" data-a="add" data-mi="${mi}" title="Add food" aria-label="Add food to ${m.name}">+</button></div>`;
    m.items.forEach((x,ii)=>{ const it=F[x.id]; if(!it) return;
      html+=`<div class="item" data-cat="${it.cat}">${ic(it.cat)}<div><div class="n">${it.n}</div><div class="eat">Eat <b>${fmtG(it,x.q)||'as listed'}</b> · ${Math.round(it.k*x.q)} kcal</div><div class="chips"><span class="chip p">Protein ${Math.round(it.p*x.q)} g</span><span class="chip c">Carbs ${Math.round(it.c*x.q)} g</span><span class="chip f">Fat ${Math.round(it.f*x.q)} g</span>${tagHtml(it.t)}</div></div>
        <div class="ctl">${(it.cat==='gym'||it.cat==='drink')?'':(()=>{ const b=baseOf(it); return b ? `<button class="btn q" data-a="dec" data-mi="${mi}" data-ii="${ii}">−</button><input class="amt" type="number" inputmode="decimal" step="${b.step}" min="0" value="${+(b.n*x.q).toFixed(1)}" data-mi="${mi}" data-ii="${ii}"><span class="unit">${b.unit}</span><button class="btn q" data-a="inc" data-mi="${mi}" data-ii="${ii}">+</button>` : `<button class="btn q" data-a="dec" data-mi="${mi}" data-ii="${ii}">−</button><span class="qty">${x.q}x</span><button class="btn q" data-a="inc" data-mi="${mi}" data-ii="${ii}">+</button>`; })()}<button class="btn sw" data-a="swap" data-mi="${mi}" data-ii="${ii}">Swap</button><button class="btn x" data-a="del" data-mi="${mi}" data-ii="${ii}">×</button></div></div>`; });
    if(!m.items.length) html+=`<button class="btn add" data-a="add" data-mi="${mi}">+ Add food to ${m.name.toLowerCase().replace(/ \(.*\)/,'')}</button>`;
    box.innerHTML=html; wrap.appendChild(box);
  });
  wrap.querySelectorAll('button[data-a]').forEach(b=>b.onclick=()=>action(b.dataset.a,+b.dataset.mi,+b.dataset.ii));
  wrap.querySelectorAll('input.amt').forEach(inp=>{ inp.onchange=()=>{ const mi=+inp.dataset.mi, ii=+inp.dataset.ii; const x=plan[mi].items[ii]; const b=baseOf(F[x.id]); const v=parseFloat(inp.value); if(b&&v>0){ x.q=+(v/b.n).toFixed(3); save(); render(); } else render(); }; });
  wrap.querySelectorAll('.pcol').forEach(el=>{ el.style.color=el.dataset.c; });
  const T=tot(all); const rest=document.getElementById('rest').checked; const tk=P().target.k-(rest?P().restCut:0); const tp=P().target.p; const maint=P().maint;
  const pct=(a,b)=>Math.min(100,Math.round(a/b*100));
  const kcls=!all.length?'empty':T.k>tk?'over':T.k<tk-250?'low':'ok', pcls=T.p<P().pMin?'low':'ok';
  const ring=(val,tgt,color,size)=>{ const r=(size/2)-6, C=2*Math.PI*r, f=Math.min(1,Math.max(0,val/tgt)); return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle class="bgc" cx="${size/2}" cy="${size/2}" r="${r}"/><circle class="fg" cx="${size/2}" cy="${size/2}" r="${r}" stroke="${color}" stroke-dasharray="${(C*f).toFixed(1)} ${C.toFixed(1)}"/></svg>`; };
  const left=tk-T.k; const pLeft=Math.max(0,tp-T.p); const cMax=P().carbMax, fMax=P().fatMax;
  const kcol = kcls==='over'?'var(--rose)':kcls==='low'?'var(--amber)':'var(--ink)';
  const status = kcls==='empty' ? 'Nothing logged yet' : kcls==='over' ? `${Math.abs(left)} kcal over target${Math.abs(left)<=100?', close, stop here':''}` : kcls==='low' ? `${left} kcal under, eat a little more` : left>=0 ? `${left} kcal left to eat` : `${Math.abs(left)} kcal over target`;
  const gauge=(val,tgt,color)=>{ const size=180, r=74, cx=90, cy=92; const a0=135, sweep=270; const f=Math.min(1,Math.max(0,val/tgt));
    const pt=(a)=>{ const t=(a)*Math.PI/180; return [cx+r*Math.cos(t), cy+r*Math.sin(t)]; };
    const arc=(a1,a2)=>{ const [x1,y1]=pt(a1),[x2,y2]=pt(a2); const big=(a2-a1)>180?1:0; return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${big} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`; };
    const a2=a0+Math.max(0.01,sweep*f);
    const G={ok:['#30d158','#8ee6a4'],low:['#ff9500','#ffd60a'],over:['#ff2d55','#ff8a65'],empty:['#c7c7cc','#c7c7cc']}[kcls]||['#30d158','#8ee6a4'];
    return `<svg class="gauge" viewBox="0 0 ${size} ${size}"><defs><linearGradient id="gg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${G[0]}"/><stop offset="1" stop-color="${G[1]}"/></linearGradient></defs><path class="gbg" d="${arc(a0,a0+sweep)}"/><path class="gfg" d="${arc(a0,a2)}" stroke="url(#gg)"/><circle class="gdot" cx="${pt(a2)[0].toFixed(1)}" cy="${pt(a2)[1].toFixed(1)}" r="5"/></svg>`; };
  const gcol = kcls==='over'?'var(--red)':kcls==='low'?'var(--orange)':'var(--green)';
  const glabel = kcls==='empty' ? 'Budget for the day' : left>=0 ? 'Still can eat' : 'Over target by';
  const mini=(val,tgt,cls)=>{ const r=15,C=2*Math.PI*r,f=Math.min(1,Math.max(0,val/tgt)); return `<svg class="mini ${cls}" viewBox="0 0 40 40"><circle class="mbg" cx="20" cy="20" r="${r}"/><circle class="mfg" cx="20" cy="20" r="${r}" stroke-dasharray="${(C*f).toFixed(1)} ${C.toFixed(1)}"/></svg>`; };
  const bar=(cls,label,val,tgt,ic,over)=>{ const pc=Math.min(100,Math.round(val/tgt*100)); return `<div class="bar ${cls}${over?' over':''}"><span class="mwrap">${mini(val,tgt,cls)}<span class="ico ${ic} tile">${ICON[ic]}</span></span><div class="bart"><div class="barl"><b>${label}</b><span>${val} / ${tgt} g</span></div><div class="bartrack"><i data-w="${pc}"></i></div></div></div>`; };
  document.getElementById('totals').innerHTML = `
    <div class="hero">
      <div class="gcard">
        <div class="gwrap">${gauge(T.k,tk,gcol)}<div class="glab ${kcls}" data-l="${glabel}"><span>${glabel}</span><b>${Math.abs(left)}</b><small>kcal</small></div></div>
        <div class="gpill">${T.k} / ${tk} kcal</div>
      </div>
      <div class="bars">
        ${bar('p','Protein',T.p,tp,'prot',false)}
        ${bar('c','Carbs',T.c,cMax,'carb',T.c>cMax)}
        ${bar('f','Fat',T.f,fMax,'fat',T.f>fMax)}
      </div>
      <div class="pace">${status}. ${maint-T.k>0?'−':'+'}${Math.abs(maint-T.k)} kcal vs maintenance, about ${Math.abs((maint-T.k)*7/7700).toFixed(1)} kg a week at this pace.</div>
    </div>`;
  document.querySelectorAll('.bartrack i').forEach(i=>{ i.style.width=i.dataset.w+'%'; });
  renderWarnings(plan,T,tk,tp);
  renderCheckin();
}

// ---- Daily check-in: water, steps, sleep. Keyed by real date, per person ----
function dkey(){ return ymd(weekDate(S.day)); }
function dlog(){ const ps=PS(); if(!ps.log) ps.log={}; const k=dkey(); if(!ps.log[k]) ps.log[k]={water:0,steps:'',bed:'',wake:''}; return ps.log[k]; }
function toMin(t){ if(!t) return null; const [h,m]=t.split(':').map(Number); return h*60+m; }
function fmtT(min){ min=((min%1440)+1440)%1440; const h=Math.floor(min/60), m=min%60; const ap=h>=12?'pm':'am'; const hh=h%12||12; return `${hh}:${String(m).padStart(2,'0')} ${ap}`; }

// Apple-style time cell: value row + inline hour / minute / AM-PM wheels (native selects, so iOS shows its own picker wheel)
function timeCell(id,label,val){ const has=!!val; const mins=has?toMin(val):null; const h24=has?Math.floor(mins/60):22, m=has?mins%60:30; const ap=h24>=12?'PM':'AM'; const h12=(h24%12)||12;
  const opt=(arr,cur,fmt)=>arr.map(v=>`<option value="${v}"${v===cur?' selected':''}>${fmt?fmt(v):v}</option>`).join('');
  return `<button type="button" class="cell" id="${id}Cell" aria-expanded="false" aria-controls="${id}"><span class="cl">${label}</span><span class="cv"><b class="tv${has?'':' dim'}">${has?fmtT(mins):'Set'}</b></span></button>
  <div class="timepick" id="${id}" hidden><label><span>Hour</span><select class="th" aria-label="${label} hour">${opt([12,1,2,3,4,5,6,7,8,9,10,11],h12)}</select></label><label><span>Min</span><select class="tm" aria-label="${label} minutes">${opt([0,5,10,15,20,25,30,35,40,45,50,55],m,v=>String(v).padStart(2,'0'))}</select></label><label><span>&nbsp;</span><select class="tap" aria-label="${label} AM or PM">${opt(['AM','PM'],ap)}</select></label></div>`; }
function renderCheckin(){
  const el=document.getElementById('checkin'); if(!el) return; const L=dlog(); const cups=8;
  const stepsT=P().name==='Person 1'?9000:8000; const st=parseInt(L.steps)||0; const sPc=Math.min(100,Math.round(st/stepsT*100));
  let slp=null, bedSug='';
  const wake=toMin(L.wake||'06:30'); if(L.bed&&L.wake){ const b=toMin(L.bed); slp=((wake-b)+1440)%1440/60; }
  bedSug=fmtT(wake-7.5*60);
  const sleepTxt = slp===null ? `Aim 7 to 8 h. For a ${fmtT(wake)} wake-up, lights out by <b>${bedSug}</b>.` : slp<6.5 ? `<b>${slp.toFixed(1)} h</b>, short. Under 7 h the body drops muscle, not fat, on the same food. Tonight: bed by <b>${bedSug}</b>.` : slp>9 ? `<b>${slp.toFixed(1)} h</b>, more than needed. Keep wake-up fixed at ${fmtT(wake)}.` : `<b>${slp.toFixed(1)} h</b>, on target. Keep it.`;
  const fmtClock=(v)=>v?fmtT(toMin(v)):'Set';
  el.innerHTML=`<div class="ck">
    <div class="ckhd"><b>Day check-in</b><span>${weekDate(S.day).toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'})} · ${P().name}</span></div>
    <div class="ckrow"><div class="ckl"><span class="ico drink tile">${ICON.drink}</span><div><b>Water</b><span>${L.water*250>=1000?(L.water*0.25).toFixed(2).replace(/\.?0+$/,'')+' L':L.water*250+' ml'} of 2.5 L · tap a cup</span></div></div>
      <div class="cups">${Array.from({length:cups},(_,i)=>`<button class="cup${i<L.water?' on':''}" data-cup="${i+1}" aria-label="${(i+1)*250} ml"></button>`).join('')}</div></div>
    <div class="ckrow"><div class="ckl"><span class="ico gym tile">${ICON.steps}</span><div><b>Steps</b><span>${st?st.toLocaleString()+' of '+stepsT.toLocaleString()+(st>=stepsT?' · done':''):'Target '+stepsT.toLocaleString()}</span></div></div>
      <div class="cv"><input type="number" inputmode="numeric" pattern="[0-9]*" autocomplete="off" name="steps-count" id="ckSteps" placeholder="0" value="${L.steps||''}" aria-label="Steps today"><em>steps</em></div></div>
    <div class="ckbar"><div class="bartrack"><i data-w="${sPc}"></i></div></div>
    <div class="ckrow"><div class="ckl"><span class="ico snack tile">${ICON.sleep}</span><div><b>Sleep</b><span>${sleepTxt}</span></div></div></div>
    <div class="cells">
      ${timeCell('ckBed','Bedtime',L.bed)}
      ${timeCell('ckWake','Wake up',L.wake)}
    </div>
    <div class="cknote">Evening routine: gym 5 to 6, dinner by 7:30, 10 min walk, screens off 30 min before bed. Weigh in the morning after the bathroom, before water.</div>
  </div>`;
  el.querySelectorAll('.cup').forEach(b=>b.onclick=()=>{ const n=+b.dataset.cup; L.water = (L.water===n)? n-1 : n; save(); renderCheckin(); });
  el.querySelector('#ckSteps').onchange=e=>{ L.steps=e.target.value; save(); renderCheckin(); };
  [['ckBed','bed'],['ckWake','wake']].forEach(([id,k])=>{ const row=el.querySelector('#'+id); const cell=el.querySelector('#'+id+'Cell'); cell.onclick=()=>{ const open=row.hidden; el.querySelectorAll('.timepick').forEach(r=>r.hidden=true); row.hidden=!open; cell.setAttribute('aria-expanded',String(open)); };
    row.querySelectorAll('select').forEach(sel=>sel.onchange=()=>{ const h=+row.querySelector('.th').value, m=+row.querySelector('.tm').value, ap=row.querySelector('.tap').value; const H=(h%12)+(ap==='PM'?12:0); L[k]=String(H).padStart(2,'0')+':'+String(m).padStart(2,'0'); save(); renderCheckin(); el.querySelector('#'+id).hidden=false; }); });
  el.querySelectorAll('.bartrack i').forEach(i=>{ i.style.width=i.dataset.w+'%'; });
}

// Copy today's food to the other person, portions scaled to their calorie target (same dishes, their size)
function copyDayTo(other){
  const me=S.who; const src=dayPlan(); const ratio=PEOPLE[other].target.k/P().target.k;
  const items=src.map(m=>({name:m.name,items:m.items.map(x=>({id:x.id,q:Math.max(0.25,Math.round(x.q*ratio*4)/4)}))}));
  const customs=PS().customs;
  S.who=other; const ps=PS(); customs.forEach(c=>{ if(!ps.customs.find(k=>k.id===c.id)) ps.customs.push(c); F[c.id]=c; });
  const dst=dayPlan(); let n=0;
  items.forEach((m,i)=>{ const key=m.name.replace(/ \(.*\)/,'').toLowerCase(); let t=dst[i]&&dst[i].name.replace(/ \(.*\)/,'').toLowerCase()===key?dst[i]:dst.find(d=>d.name.replace(/ \(.*\)/,'').toLowerCase()===key); if(!t) t=dst[Math.min(i,dst.length-1)]; if(!t) return;
    const allowedHere=(id)=>{ const it=F[id]; if(!it) return false; if(isVeg()&&(it.t==='n'||it.t==='tn')) return false; if(isVeg()&&!ps.eggsVeg&&(it.t==='e'||it.t==='te')) return false; return true; };
    t.items=m.items.filter(x=>allowedHere(x.id)); n+=t.items.length; });
  save(); S.who=me; return n;
}
function treatCount(items){ return items.filter(x=>F[x.id]&&F[x.id].cat==='treat').length; }
function renderWarnings(plan,T,tk,tp){
  const p=P(); const out=[]; const red=(t)=>out.push({l:'red',t}), amb=(t)=>out.push({l:'amb',t});
  if(T.k<p.floor) red(`Eating too little: ${T.k} kcal is under your ${p.floor} floor. Below this you lose muscle and your metabolism slows, which is the opposite of lean. Add protein, not carbs.`);
  else if(T.k<tk-150) amb(`Under target by ${tk-T.k} kcal. Once in a while is fine, every day is a shortcut that costs muscle.`);
  if(T.k>tk+300) red(`Over by ${T.k-tk} kcal. At this level there is no deficit left. Cut the carb portion with −, swap the treat, or drop a snack.`);
  else if(T.k>tk+100) amb(`Over target by ${T.k-tk} kcal. Trim one portion with − and you're back on track.`);
  if(T.p<p.pMin) red(`Protein ${T.p} g is too low (target ${tp} g). This is the number that keeps muscle while fat drops. Add whey, Greek yogurt or egg whites now.`);
  else if(T.p<tp-10) amb(`Protein ${T.p} g, a little under the ${tp} g target. One more protein snack fixes it.`);
  if(T.f>p.fatMax) amb(`Fat ${T.f} g is above ${p.fatMax} g. Check oil in curries, nuts, cheese, chicken thigh, puri.`);
  if(T.c>p.carbMax) amb(`Carbs ${T.c} g is above ${p.carbMax} g for a cutting day. Shrink rice, roti or granola with −.`);
  plan.forEach(m=>{ if(/lunch|dinner/i.test(m.name)){ const mt=tot(m.items); if(mt.p<20) amb(`${m.name.replace(/ \(.*\)/,'')} has only ${mt.p} g protein. Every main meal needs a protein dish: chicken, fish, prawns, paneer, tofu, soya, pappu or eggs.`); } });
  const vegDishes=plan.reduce((n,m)=>n+m.items.filter(x=>F[x.id]&&((F[x.id].cat==='veg'&&!/salad/i.test(F[x.id].n))||/and veg|with veg|veg curry|veg stir|palak|bhendi|sorakaya|kale|spinach|mushroom|methi|gobi|cabbage/i.test(F[x.id].n))).length,0);
  if(vegDishes<2) amb(`Only ${vegDishes} vegetable dish today. Aim for 2 or more, they fill you up for almost no calories.`);
  const allItems=[]; plan.forEach(m=>allItems.push(...m.items)); const tToday=treatCount(allItems);
  let tWeek=0; for(let i=0;i<7;i++){ const it=[]; dayPlan(i).forEach(m=>it.push(...m.items)); tWeek+=treatCount(it); }
  if(tToday>1) red(`${tToday} treat meals today. One treat meal a week is the plan, not two in a day.`);
  else if(tWeek>1) amb(`${tWeek} treat meals this week across your 7 days. The plan allows one. Fast fat loss means the other ${tWeek-1} go back to normal meals.`);
  const hasWhey=allItems.some(x=>/whey|casein/i.test(F[x.id]&&F[x.id].n||''));
  if(!hasWhey && T.p<tp) amb(`No whey today. It's the easiest 24 g of protein you'll get, keep the 4 pm one.`);
  // ---- suggestions ----
  const fixes=[];
  const mainsShort=plan.map((m,mi)=>({m,mi,p:tot(m.items).p})).filter(x=>/lunch|dinner/i.test(x.m.name)&&x.p<20);
  if(T.p<tp-10||T.p<p.pMin||mainsShort.length||T.k<p.floor){ const gap=Math.max(tp-T.p, mainsShort.length?25:0, T.k<p.floor?20:0); const used=new Set(allItems.map(x=>x.id)); const usedNames=new Set(allItems.map(x=>F[x.id]&&F[x.id].n.toLowerCase().split(',')[0]));
    const mealIdx=(re)=>plan.findIndex(m=>re.test(m.name));
    const cands=Object.values(F).filter(it=>(it.cat==='prot'||it.cat==='snack')&&it.p>=10&&allowed(it)&&!used.has(it.id)&&!usedNames.has(it.n.toLowerCase().split(',')[0]))
      .map(it=>{ const snacky=/whey|yogurt|skyr|curd|milk|cottage|cheese|chana|peanut|nuts|bar|sprout|whites|eggs/i.test(it.n); let target;
        if(mainsShort.length&&!snacky) target=mainsShort[0].mi; else if(snacky) target=(gap>25?mealIdx(/mid-morning/i):mealIdx(/pre-gym|evening/i)); else target=mealIdx(/dinner/i); if(target<0) target=mealIdx(/lunch/i);
        const fit=Math.abs(it.p-gap); const score=(COST[it.id]||2)*10 + fit*0.6 + (it.k/it.p)*1.5 + (mainsShort.length&&snacky?15:0); return {it,target,score}; })
      .sort((a,b)=>a.score-b.score).filter((c,i,arr)=>arr.findIndex(o=>o.it.n===c.it.n)===i).slice(0,4);
    cands.forEach(c=>fixes.push({t:`${c.it.n} <span data-s="s15">(+${c.it.p} g protein, ${c.it.k} kcal${costTxt(c.it.id)?', '+costTxt(c.it.id):''})</span>`, label:'Add to '+plan[c.target].name.replace(/ \(.*\)/,''), run:()=>{ plan[c.target].items.push({id:c.it.id,q:1}); save(); render(); }}));
  }
  if(T.p<tp-10||T.p<p.pMin){ let weak=null; plan.forEach((m,mi)=>{ const sh=mealShare(m.name); if(!sh) return; const mt=tot(m.items); const def=Math.round(tp*sh)-mt.p; if(def>5){ let best=null; m.items.forEach((x,ii)=>{ const it=F[x.id]; if(it&&it.p>=12&&x.q<3&&(!best||it.p>F[best.id].p)) best={...x,ii}; }); if(best&&(!weak||def>weak.def)) weak={mi,ii:best.ii,def,it:F[best.id],q:best.q}; } });
    if(weak) fixes.unshift({t:`${weak.it.n} → ${weak.q+0.5}x <span data-s="s15">(+${Math.round(weak.it.p*0.5)} g protein, +${Math.round(weak.it.k*0.5)} kcal, ${plan[weak.mi].name.replace(/ \(.*\)/,'')} is ${weak.def} g short)</span>`, label:'Bigger portion', run:()=>{ plan[weak.mi].items[weak.ii].q+=0.5; save(); render(); }}); }
  if(T.c>p.carbMax||T.k>tk+100){ let big=null; plan.forEach((m,mi)=>m.items.forEach((x,ii)=>{ const it=F[x.id]; if(it&&(it.cat==='carb'||it.cat==='treat'||/rice|roti|granola|oats|pasta|puri|idli|dosa|pancake|toast/i.test(it.n))&&x.q>0.5){ const cv=it.c*x.q; if(!big||cv>big.cv) big={mi,ii,cv,it,x}; } }));
    if(big) fixes.push({t:`Shrink ${big.it.n} to ${big.x.q-0.5}x <span data-s="s15">(−${Math.round(big.it.c*0.5)} g carbs, −${Math.round(big.it.k*0.5)} kcal)</span>`, label:'Shrink', run:()=>{ plan[big.mi].items[big.ii].q-=0.5; save(); render(); }}); }
  if(T.f>p.fatMax){ let fat=null; plan.forEach((m,mi)=>m.items.forEach((x,ii)=>{ const it=F[x.id]; if(it&&it.f*x.q>=10&&it.cat!=='gym'){ const fv=it.f*x.q; if(!fat||fv>fat.fv) fat={mi,ii,fv,it}; } }));
    if(fat) fixes.push({t:`Biggest fat source is ${fat.it.n} <span data-s="s15">(${Math.round(fat.fv)} g fat). Swap it for a leaner option.</span>`, label:'Swap', run:()=>openSheet(fat.mi,fat.ii)}); }
  const w=document.getElementById('warn');
  const logged=plan.reduce((n,m)=>n+m.items.length,0);
  if(!logged){ w.style.display='block'; w.className='warn empty'; w.innerHTML=`<div class="emp"><b>Nothing logged for ${FULL[S.day]} yet.</b><span>Add what you eat with the + on each meal, or start from the plan and adjust.</span><button class="btn q" id="fillPlan">Start from the plan</button></div>`; w.querySelector('#fillPlan').onclick=()=>fillTemplate(S.day); return; }
  if(!out.length){ w.style.display='block'; w.className='warn ok'; w.innerHTML=`<b>On target.</b> ${T.k} kcal, ${T.p} g protein, ${maintDeficit(T.k)} kcal deficit. This is the day that gets you lean. Repeat it.`; return; }
  const hrNow=new Date().getHours(); if(T.k<tk-250&&hrNow>=15&&S.day===((new Date().getDay()+6)%7)) out.push({l:'amb',t:`It is after 3 pm and you are ${tk-T.k} kcal short. Put the gap into dinner or the evening snack: protein first (whey, Greek yogurt, paneer, soya, chicken), then a fist of rice. Do not skip it, under-eating today costs muscle, not fat.`});
  w.style.display='block'; w.className='warn'; w.innerHTML=out.map(o=>`<div class="wi ${o.l}"><span class="dot" aria-hidden="true">${o.l==="red"?"!":"•"}</span><span class="wt">${o.t}</span></div>`).join('')
    + (()=>{ const more=[],less=[]; fixes.forEach((f,i)=>{ (/^(Shrink|Swap)/.test(f.label)||/^Biggest fat/.test(f.t)?less:more).push(i); });
        const grp=(hd,ids)=>ids.length?`<div class="fixhd">${hd}</div>`+ids.map(i=>`<div class="fix"><span>${fixes[i].t}</span><button class="btn sw" data-fix="${i}">${fixes[i].label}</button></div>`).join(''):'';
        return grp('Eat more of this',more)+grp('Eat less of this',less); })();
  w.querySelectorAll('button[data-fix]').forEach(b=>b.onclick=()=>fixes[+b.dataset.fix].run());
}
function maintDeficit(k){ return P().maint-k; }
function renderWeek(){
  document.getElementById('wkTitle').textContent=P().name+' · this week';
  const b=document.getElementById('wkBody'); b.innerHTML='';
  let sk=0,sp=0;
  DAYS.forEach((n,i)=>{ const items=[]; dayPlan(i).forEach(m=>items.push(...m.items)); const t=tot(items); sk+=t.k; sp+=t.p;
    const tr=document.createElement('tr'); tr.style.cursor='pointer'; tr.onclick=()=>{S.day=i;S.view='plan';render();};
    const p=P(); const kc = t.k<p.floor||t.k>p.target.k+300?'var(--rose)':(t.k<p.target.k-150||t.k>p.target.k+100)?'var(--amber)':'var(--mint)'; const pc = t.p<p.pMin?'var(--rose)':t.p<p.target.p-10?'var(--amber)':'var(--mint)';
    tr.innerHTML=`<td><b>${DAYS[i]}</b></td><td><span class="pill ${isVeg(i)?'v':'n'}">${isVeg(i)?'Veg':'Non-veg'}</span></td><td class="wk" data-c="${kc}">${t.k}</td><td class="wk" data-c="${pc}">${t.p} g</td><td class="hide-m">${t.c} g</td><td class="hide-m">${t.f} g</td>`; b.appendChild(tr); tr.querySelectorAll('.wk').forEach(el=>{ el.style.color=el.dataset.c; el.style.fontWeight='700'; }); });
  const tr=document.createElement('tr'); tr.innerHTML=`<td><b>Avg</b></td><td></td><td><b>${Math.round(sk/7)}</b></td><td><b>${Math.round(sp/7)} g</b></td><td class="hide-m"></td><td class="hide-m"></td>`; b.appendChild(tr);
}
function renderWeight(){
  const ps=PS(); document.getElementById('wtTitle').textContent=P().name+' · weight log';
  if(!document.getElementById('wtDate').value) document.getElementById('wtDate').value=ymd(new Date());
  const _wd=document.getElementById('wtDate'); const _wl=document.getElementById('wtDateLbl'); const _fmtD=(v)=>{ const d=new Date(v+'T12:00'); const t=new Date(); return v===ymd(t)?'Today':d.toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'}); }; _wl.textContent=_fmtD(_wd.value); _wd.oninput=()=>{ _wl.textContent=_fmtD(_wd.value); };
  const ws=[...ps.weights].sort((a,b)=>a.d<b.d?-1:1);
  const avg7=(idx)=>{ const sl=ws.slice(Math.max(0,idx-6),idx+1); return (sl.reduce((s,x)=>s+x.w,0)/sl.length).toFixed(1); };
  const b=document.getElementById('wtBody'); b.innerHTML='';
  ws.slice().reverse().forEach((x,ri)=>{ const idx=ws.length-1-ri; const tr=document.createElement('tr'); tr.innerHTML=`<td>${x.d}</td><td><b>${x.w}</b></td><td>${avg7(idx)}</td><td><button class="btn x" data-d="${x.d}">×</button></td>`; b.appendChild(tr); });
  b.querySelectorAll('button[data-d]').forEach(bt=>bt.onclick=()=>{ ps.weights=ps.weights.filter(x=>x.d!==bt.dataset.d); save(); render(); });
  const st=document.getElementById('wtStats'); const start=S.who==='p1'?88:85;
  if(ws.length){ const last=ws[ws.length-1].w; const first=ws[0].w; st.innerHTML=`<div class="kpi"><div class="k">Latest</div><div class="v">${last}</div><div class="t">${ws[ws.length-1].d}</div></div><div class="kpi"><div class="k">7-day avg</div><div class="v">${avg7(ws.length-1)}</div><div class="t">judge by this</div></div><div class="kpi"><div class="k">Change</div><div class="v">${(last-first)>0?'+':''}${(last-first).toFixed(1)}</div><div class="t">since ${ws[0].d}</div></div>`; }
  else st.innerHTML=`<div class="kpi"><div class="k">Start</div><div class="v">${start}</div><div class="t">kg, Nov 2026</div></div><div class="kpi"><div class="k">Goal</div><div class="v">${S.who==='p1'?80:75}</div><div class="t">first milestone</div></div><div class="kpi"><div class="k">Pace</div><div class="v">0.5</div><div class="t">kg per week</div></div>`;
}

// ================= ACTIONS =================
function action(a,mi,ii){
  const plan=dayPlan();
  const it=F[plan[mi]?.items[ii]?.id]; const b=it?baseOf(it):null; const stepQ = b ? b.step/b.n : 0.5;
  if(a==='inc'){ plan[mi].items[ii].q=+Math.min(5,plan[mi].items[ii].q+stepQ).toFixed(3); }
  else if(a==='dec'){ plan[mi].items[ii].q=+Math.max(stepQ,plan[mi].items[ii].q-stepQ).toFixed(3); }
  else if(a==='del'){ plan[mi].items.splice(ii,1); }
  else if(a==='swap'){ openSheet(mi,ii); return; }
  else if(a==='add'){ openSheet(mi,null); return; }
  save(); render();
}
let sheet={mi:0,ii:null,cat:null};
function openSheet(mi,ii){
  const plan=dayPlan(); sheet={mi,ii,cat:null};
  if(ii!==null){ const cur=F[plan[mi].items[ii].id]; sheet.cat=cur.cat; document.getElementById('shTitle').textContent='Swap in '+plan[mi].name; document.getElementById('shSub').textContent='Current: '+cur.n+' ('+cur.p+' g protein). Sorted by closest protein.'; }
  else { sheet.cat='all';
    document.getElementById('shTitle').textContent='Add to '+plan[mi].name; document.getElementById('shSub').textContent='Search any food (rice, carrot fry, curd, mushroom curry...) or pick a group. Set the exact grams, ml or pieces after adding.'; }
  cRows=[]; sheet.cname=''; document.getElementById('search').value=''; renderSheet(); document.getElementById('ov').classList.add('show'); if(ii===null) setTimeout(()=>document.getElementById('search').focus(),50);
}
function renderSheet(){
  const plan=dayPlan(); const cur = sheet.ii!==null ? F[plan[sheet.mi].items[sheet.ii].id] : null;
  const cats=document.getElementById('cats'); cats.innerHTML='';
  Object.keys(CATS).filter(c=>(c!=='gym'||sheet.cat==='gym')&&(c!=='mine'||PS().customs.length)).forEach(c=>{ const b=document.createElement('button'); b.className='btn'+(c===sheet.cat?' on':''); b.textContent=CATS[c]; b.onclick=()=>{sheet.cat=c;renderSheet();}; cats.appendChild(b); });
  const q=document.getElementById('search').value.trim().toLowerCase();
  document.getElementById('search').style.display = sheet.cat==='custom' ? 'none' : 'block';
  if(sheet.cat==='custom'){ renderCustomForm(); return; }
  const foodSearch=(q)=>{ const words=q.split(/\s+/).filter(Boolean); const esc=w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); return Object.values(F).filter(x=>x.cat!=='gym').map(x=>{ const name=x.n.toLowerCase(), al=(ALIAS[x.id]||'').toLowerCase(); let sc=0; for(const w of words){ const ww=new RegExp('(^|[^a-z])'+esc(w)+'([^a-z]|$)'); if(ww.test(name)) sc+=8; else if(name.split(/[\s,/()+·-]+/).some(t=>t.startsWith(w))) sc+=5; else if(ww.test(al)) sc+=4; else if(al.split(/\s+/).some(t=>t.startsWith(w))) sc+=3; else if((name+' '+al).includes(w)) sc+=1; else return null; } return {x,sc}; }).filter(Boolean).sort((a,b)=>b.sc-a.sc||(REC.has(b.x.id)?1:0)-(REC.has(a.x.id)?1:0)||a.x.n.length-b.x.n.length).map(o=>o.x); };
  let list = q ? foodSearch(q) : (sheet.cat==='all' ? Object.values(F).filter(x=>x.cat!=='gym') : sheet.cat==='mine' ? PS().customs.slice().reverse() : RAW[sheet.cat].map(r=>F[r[0]]));
  list=list.filter(allowed);
  if(cur) list.sort((a,b)=>Math.abs(a.p-cur.p)-Math.abs(b.p-cur.p));
  if(!q) list.sort((a,b)=>(REC.has(b.id)?1:0)-(REC.has(a.id)?1:0));
  const o=document.getElementById('opts'); o.innerHTML='';
  if(!list.length) o.innerHTML='<div class="note">Nothing in this group fits today (veg day). Try Protein or Snacks.</div>';
  const recentIds=(()=>{ const ps=PS(); const m=new Map(); const cutoff=new Date(); cutoff.setDate(cutoff.getDate()-14); Object.keys(ps.days).sort().reverse().forEach(k=>{ if(!/^\d{4}/.test(k)||new Date(k.slice(0,10)+'T12:00')<cutoff) return; ps.days[k].forEach(mm=>mm.items.forEach(x=>{ if(!m.has(x.id)) m.set(x.id,1); })); }); return m; })();
  const hd=(t)=>{ const h=document.createElement('div'); h.className='chd'; h.textContent=t; o.appendChild(h); };
  const mealName=plan[sheet.mi].name.toLowerCase(); const fitCats = /breakfast/.test(mealName)?['bf','prot','fruit']:/waking/.test(mealName)?['drink','fruit']:/mid-morning|pre-gym|evening|snack/.test(mealName)?['snack','fruit','prot','drink']:['prot','carb','veg','side'];
  const recFor=(it)=>REC.has(it.id)&&fitCats.includes(it.cat);
  let lastGrp=null; const grpOf=(it)=>!q&&!cur&&sheet.cat==='all' ? (recFor(it)?'Recommended for '+plan[sheet.mi].name.replace(/ \(.*\)/,'').toLowerCase():recentIds.has(it.id)?'Eaten recently':'All foods') : null;
  if(!q&&!cur&&sheet.cat==='all') list.sort((a,b)=>{ const ga=recFor(a)?0:recentIds.has(a.id)?1:2, gb=recFor(b)?0:recentIds.has(b.id)?1:2; return ga-gb; });
  list.forEach(it=>{ const g=grpOf(it); if(g&&g!==lastGrp){ hd(g); lastGrp=g; } const d=document.createElement('div'); d.className='opt'+(cur&&it.id===cur.id?' cur':'');
    const diff=cur?it.p-cur.p:null; const lbl=cur?(it.id===cur.id?'current':(diff>=0?'+':'')+diff+' g protein'):(it.custom?'my food':it.t==='v'?'veg':it.t==='e'||it.t==='te'?'egg':it.t==='n'||it.t==='tn'?'non-veg':'treat');
    d.innerHTML=`<div><div class="n">${REC.has(it.id)?'<span data-s="s16">★</span> ':''}${it.n}${it.g?' · '+it.g:''}</div><div class="m">${it.k} kcal · ${it.p} g protein · ${it.c} c · ${it.f} f${costTxt(it.id)?' · <span data-s="s16">'+costTxt(it.id)+'</span>':''}</div></div><span class="pill ${pill(it.t)}">${lbl}</span>`;
    d.onclick=()=>{ if(sheet.ii!==null) plan[sheet.mi].items[sheet.ii]={id:it.id,q:1}; else plan[sheet.mi].items.push({id:it.id,q:1}); save(); closeSheet(); render(); };
    o.appendChild(d); });
}
let cRows=[];
function ingByName(n){ n=(n||'').trim().toLowerCase(); let i=ING.findIndex(x=>x[0].toLowerCase()===n); if(i<0) i=ING.findIndex(x=>x[0].toLowerCase().startsWith(n)); if(i<0&&n.length>=3) i=ING.findIndex(x=>x[0].toLowerCase().includes(n)); return i; }
function rowMac(r){ const x=ING[r.ing]; if(!x) return {k:0,p:0,c:0,f:0,g:0}; const g = r.unit==='pcs' ? r.amt*(x[5]||100) : r.amt; return {k:x[1]*g/100,p:x[2]*g/100,c:x[3]*g/100,f:x[4]*g/100,g}; }
function renderCustomForm(){
  const o=document.getElementById('opts'); if(!cRows.length) cRows=[{ing:-1,amt:100,unit:'g',txt:''}];
  o.innerHTML=`<div class="note" data-s="s17">Log exactly what you ate. Type to search an ingredient, enter grams, ml or pieces. Saved under "My foods" to reuse.</div>
    <input class="search" id="cname" placeholder="Name it, e.g. Granola with 6% milk and blueberries" value="${(sheet.cname||'').replace(/"/g,'&quot;')}">
        <div id="crows"></div>
    <button class="btn add" id="caddrow">+ Add ingredient</button>
    <div class="ctot" id="ctot"></div>
    <details data-s="s18"><summary class="note" data-s="s19">Or type the macros yourself (from a label)</summary><div class="crow4"><input type="number" inputmode="decimal" id="mk" placeholder="kcal"><input type="number" inputmode="decimal" id="mp" placeholder="protein g"><input type="number" inputmode="decimal" id="mc" placeholder="carbs g"><input type="number" inputmode="decimal" id="mf" placeholder="fat g"></div></details>
    <div class="row2"><button class="btn pri" id="csave">Save and add to ${dayPlan()[sheet.mi].name.replace(/ \(.*\)/,'')}</button></div>`;
  const rows=document.getElementById('crows');
  cRows.forEach((r,i)=>rows.appendChild(buildRow(r,i)));
  updTot();
  document.getElementById('cname').oninput=e=>{ sheet.cname=e.target.value; };
  document.getElementById('caddrow').onclick=()=>{ const r={ing:-1,amt:100,unit:'g',txt:''}; cRows.push(r); const el=buildRow(r,cRows.length-1); rows.appendChild(el); el.querySelector('.cing').focus(); updTot(); };
  document.getElementById('csave').onclick=saveCustom;
}
function ingSearch(q){ q=(q||'').trim().toLowerCase(); if(!q) return ING.map((x,i)=>i).slice(0,12); const words=q.split(/\s+/);
  const score=(x)=>{ const n=x[0].toLowerCase(), al=(x[6]||'').toLowerCase(); let sc=0; for(const w of words){ if(n.startsWith(w)) sc+=5; else if(n.split(/[\s,/()]+/).some(t=>t.startsWith(w))) sc+=4; else if(n.includes(w)) sc+=2; else if(al.split(/\s+/).some(t=>t.startsWith(w))) sc+=3; else return -1; } return sc; };
  return ING.map((x,i)=>({i,s:score(x)})).filter(o=>o.s>0).sort((a,b)=>b.s-a.s).slice(0,12).map(o=>o.i); }
function recentIng(){ const ps=PS(); const seen=new Map(); (ps.customs||[]).slice().reverse().forEach(c=>{ (c.g||'').split(' + ').forEach(part=>{ const n=part.replace(/^[\d.]+ (g|pcs) /,'').trim(); const i=ING.findIndex(x=>x[0].replace(/ \(.*\)/,'')===n); if(i>=0&&!seen.has(i)) seen.set(i,1); }); }); return [...seen.keys()].slice(0,8); }
function buildRow(r,i){
  const d=document.createElement('div'); d.className='crow';
  const chosen=r.ing>=0;
  d.innerHTML=`<div class="cingwrap">
      <div class="cfield${chosen?' hid':''}"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><input class="cing" placeholder="Search ingredient (milk, pista, atukulu…)" value="${(r.txt||'').replace(/"/g,'&quot;')}" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="Ingredient"></div>
      <div class="cres" hidden></div>
      <div class="cpicked${chosen?'':' hid'}"><span class="ico veg tile">${ICON.veg}</span><div><b class="cpn"></b><small class="cps"></small></div><button type="button" class="btn q cchg">Change</button></div>
    </div>
    <div class="camtrow"><input type="number" inputmode="decimal" class="camt" value="${r.amt}" min="0" step="1" aria-label="Amount"><div class="useg"><button type="button" data-u="g" class="${r.unit==='g'?'on':''}">g / ml</button><button type="button" data-u="pcs" class="${r.unit==='pcs'?'on':''}">pcs</button></div><button class="btn x crm" type="button" aria-label="Remove ingredient">×</button></div>
    <div class="cmac"></div>`;
  const ing=d.querySelector('.cing'), res=d.querySelector('.cres'), amt=d.querySelector('.camt'), mac=d.querySelector('.cmac'), field=d.querySelector('.cfield'), picked=d.querySelector('.cpicked'), pcsBtn=d.querySelector('[data-u=pcs]');
  const upd=()=>{ const x=ING[r.ing]; pcsBtn.disabled=!(x&&x[5]); if(!x){ mac.textContent='Pick an ingredient from the list'; mac.style.color='var(--orange)'; updTot(); return; } if(!x[5]&&r.unit==='pcs'){ r.unit='g'; } d.querySelectorAll('.useg button').forEach(b=>b.classList.toggle('on',b.dataset.u===r.unit)); const m=rowMac(r); mac.style.color=''; mac.textContent=`${Math.round(m.k)} kcal · ${m.p.toFixed(1)} g protein · ${m.c.toFixed(0)} g carbs · ${m.f.toFixed(0)} g fat${r.unit==='pcs'?' · '+Math.round(m.g)+' g':''}`; updTot(); };
  const showPicked=()=>{ const x=ING[r.ing]; d.querySelector('.cpn').textContent=x[0]; d.querySelector('.cps').textContent=`${x[1]} kcal · ${x[2]} g protein per 100 g${x[5]?' · '+x[5]+' g each':''}`; field.classList.add('hid'); picked.classList.remove('hid'); res.hidden=true; };
  const showRes=()=>{ const q=ing.value.trim(); const ids=q?ingSearch(q):recentIng().concat(ingSearch('')).filter((v,i,a)=>a.indexOf(v)===i).slice(0,10);
    res.hidden=false; if(!ids.length){ res.innerHTML='<div class="cnone">No match. Try another word, or type the macros below.</div>'; return; }
    res.innerHTML=(q?'':'<div class="chd">Recent and common</div>')+ids.map(k=>`<button type="button" class="copt" data-k="${k}"><span>${ING[k][0]}</span><small>${ING[k][1]} kcal · ${ING[k][2]} g protein per 100 g${ING[k][5]?' · '+ING[k][5]+' g each':''}</small></button>`).join('');
    res.querySelectorAll('.copt').forEach(el=>el.onclick=()=>{ r.ing=+el.dataset.k; r.txt=ING[r.ing][0]; ing.value=r.txt; showPicked(); upd(); setTimeout(()=>{ amt.focus(); amt.select(); },50); }); };
  ing.onfocus=()=>{ showRes(); setTimeout(()=>{ try{ d.scrollIntoView({block:'start',behavior:'smooth'}); }catch(e){} },250); };
  ing.oninput=()=>{ r.txt=ing.value; r.ing=-1; showRes(); upd(); };
  d.querySelector('.cchg').onclick=()=>{ picked.classList.add('hid'); field.classList.remove('hid'); r.ing=-1; ing.value=''; ing.focus(); upd(); };
  amt.oninput=()=>{ r.amt=+amt.value||0; upd(); };
  d.querySelectorAll('.useg button').forEach(b=>b.onclick=()=>{ if(b.disabled) return; r.unit=b.dataset.u; upd(); });
  d.querySelector('.crm').onclick=()=>{ const idx=cRows.indexOf(r); if(idx>=0) cRows.splice(idx,1); d.remove(); updTot(); };
  if(chosen) showPicked(); upd(); return d;
}
function updTot(){ const t={k:0,p:0,c:0,f:0}; cRows.forEach(r=>{ const m=rowMac(r); t.k+=m.k;t.p+=m.p;t.c+=m.c;t.f+=m.f; }); const el=document.getElementById('ctot'); if(el) el.innerHTML=`Total: <b>${Math.round(t.k)} kcal · ${Math.round(t.p)} g protein</b> · ${Math.round(t.c)} g carbs · ${Math.round(t.f)} g fat`; return t; }
function saveCustom(){
  const tot=updTot(); const valid=cRows.filter(r=>r.ing>=0); const mk=+document.getElementById('mk').value;
  if(!valid.length&&!mk){ document.getElementById('ctot').innerHTML='<span data-s="s9">Add at least one ingredient from the list, or type the macros.</span>'; return; }
  let k=tot.k,p=tot.p,c=tot.c,f=tot.f; if(mk){ k=mk; p=+document.getElementById('mp').value||0; c=+document.getElementById('mc').value||0; f=+document.getElementById('mf').value||0; }
  const parts=valid.map(r=>{ const x=ING[r.ing]; return (r.unit==='pcs'?r.amt+' pcs ':r.amt+' g ')+x[0].replace(/ \(.*\)/,''); }).join(' + ');
  const name=(sheet.cname||'').trim()||parts||'Custom food';
  const names=valid.map(r=>ING[r.ing][0]); const t = names.some(n=>/chicken|mutton/i.test(n))?'n':names.some(n=>/egg/i.test(n))?'e':'v';
  const item={id:'x_'+Date.now().toString(36),n:name,g:mk&&!parts?'as entered':parts,k:Math.round(k),p:Math.round(p),c:Math.round(c),f:Math.round(f),t,cat:'mine',custom:true};
  PS().customs.push(item); F[item.id]=item; const plan=dayPlan(); if(sheet.ii!==null) plan[sheet.mi].items[sheet.ii]={id:item.id,q:1}; else plan[sheet.mi].items.push({id:item.id,q:1}); cRows=[]; sheet.cname=''; save(); closeSheet(); render();
}
function closeSheet(){ document.getElementById('ov').classList.remove('show'); }
document.getElementById('search').oninput=renderSheet;
document.getElementById('shClose').onclick=closeSheet;
document.getElementById('ov').onclick=e=>{ if(e.target.id==='ov') closeSheet(); };
document.querySelectorAll('.who').forEach(b=>b.onclick=()=>{S.who=b.dataset.who; save(); render();});
document.querySelectorAll('.nav button[data-view]').forEach(b=>b.onclick=()=>{S.view=b.dataset.view; render();});

// ---- Appearance: system / light / dark ----
function applyTheme(t){ const h=document.documentElement; if(t==='light'||t==='dark') h.setAttribute('data-theme',t); else h.removeAttribute('data-theme');
  const dark = t==='dark' || (t!=='light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const mc=document.getElementById('themeColor'); if(mc) mc.content = dark ? '#000000' : '#f2f2f7';
  document.querySelectorAll('#themeSeg button').forEach(b=>b.classList.toggle('on',b.dataset.theme===t)); }
(function(){ let t='system'; try{ t=localStorage.getItem('kl-theme')||'system'; }catch(e){} applyTheme(t);
  document.querySelectorAll('#themeSeg button').forEach(b=>b.onclick=()=>{ try{ localStorage.setItem('kl-theme',b.dataset.theme); }catch(e){} applyTheme(b.dataset.theme); });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{ let t='system'; try{ t=localStorage.getItem('kl-theme')||'system'; }catch(e){} applyTheme(t); }); })();
const _fab=document.getElementById('fab'); if(_fab) _fab.onclick=()=>{ S.view='plan'; render(); const plan=dayPlan(); const h=new Date().getHours(); const order=[[7,/waking/i],[10,/breakfast/i],[12,/mid-morning/i],[15,/lunch/i],[17,/pre-gym/i],[21,/dinner/i],[24,/bed/i]]; let mi=plan.findIndex(m=>/lunch/i.test(m.name)); for(const [lim,re] of order){ if(h<lim){ const i=plan.findIndex(m=>re.test(m.name)); if(i>=0){ mi=i; break; } } } openSheet(mi,null); };
document.getElementById('openSettings').onclick=()=>document.getElementById('ovSet').classList.add('show');
document.getElementById('openGuide').onclick=()=>document.getElementById('ovGuide').classList.add('show');
document.getElementById('guideClose').onclick=()=>document.getElementById('ovGuide').classList.remove('show');
document.getElementById('ovGuide').onclick=e=>{ if(e.target.id==='ovGuide') document.getElementById('ovGuide').classList.remove('show'); };
document.getElementById('setClose').onclick=()=>document.getElementById('ovSet').classList.remove('show');
document.getElementById('ovSet').onclick=e=>{ if(e.target.id==='ovSet') e.target.classList.remove('show'); };
document.getElementById('allVeg').onchange=e=>{ PS().allVeg=e.target.checked; if(e.target.checked) PS().allNonVeg=false; save(); render(); };
document.getElementById('allNonVeg').onchange=e=>{ PS().allNonVeg=e.target.checked; if(e.target.checked) PS().allVeg=false; save(); render(); };
document.getElementById('eggsVeg').onchange=e=>{ PS().eggsVeg=e.target.checked; save(); render(); };
document.getElementById('seafood').onchange=e=>{ PS().seafood=e.target.checked; save(); render(); };
document.getElementById('rest').onchange=render;
document.getElementById('resetDay').onclick=()=>{ const ps=PS(); Object.keys(ps.days).forEach(k=>{ if(k.startsWith(dayKeyFor(S.day))) delete ps.days[k]; }); save(); render(); document.getElementById('ovSet').classList.remove('show'); };
document.getElementById('resetAll').onclick=()=>{ PS().days={}; save(); render(); document.getElementById('ovSet').classList.remove('show'); };
function bkString(){ return JSON.stringify({app:'kl-meal-v2',exported:new Date().toISOString(),people:S.people}); }
function bkMsg(t,ok){ const m=document.getElementById('bkMsg'); m.textContent=t; m.style.color=ok?'var(--green)':'var(--rose)'; }
// ---- Export: minimal XLSX writer (store-only zip, no library) ----
const CRC_T=(()=>{ const t=new Uint32Array(256); for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++) c=c&1?(0xEDB88320^(c>>>1)):(c>>>1); t[n]=c>>>0; } return t; })();
function crc32(u8){ let c=0xFFFFFFFF; for(let i=0;i<u8.length;i++) c=CRC_T[(c^u8[i])&0xFF]^(c>>>8); return (c^0xFFFFFFFF)>>>0; }
function zipStore(files){ const enc=new TextEncoder(); const parts=[]; const cd=[]; let off=0;
  const le16=(n)=>[n&255,(n>>8)&255], le32=(n)=>[n&255,(n>>8)&255,(n>>16)&255,(n>>>24)&255];
  files.forEach(f=>{ const name=enc.encode(f.name), data=typeof f.data==='string'?enc.encode(f.data):f.data; const crc=crc32(data);
    const loc=new Uint8Array([0x50,0x4b,3,4,20,0,0,0,0,0,0,0,0,0,...le32(crc),...le32(data.length),...le32(data.length),...le16(name.length),0,0,...name]);
    parts.push(loc,data);
    cd.push(new Uint8Array([0x50,0x4b,1,2,20,0,20,0,0,0,0,0,0,0,0,0,...le32(crc),...le32(data.length),...le32(data.length),...le16(name.length),0,0,0,0,0,0,0,0,0,0,0,0,...le32(off),...name]));
    off+=loc.length+data.length; });
  const cdLen=cd.reduce((n,c)=>n+c.length,0);
  const end=new Uint8Array([0x50,0x4b,5,6,0,0,0,0,...le16(files.length),...le16(files.length),...le32(cdLen),...le32(off),0,0]);
  return new Blob([...parts,...cd,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}); }
const xesc=(v)=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function sheetXml(rows){ const col=(i)=>{ let s=''; i++; while(i>0){ const m=(i-1)%26; s=String.fromCharCode(65+m)+s; i=Math.floor((i-1)/26); } return s; };
  const r=rows.map((row,ri)=>'<row r="'+(ri+1)+'">'+row.map((v,ci)=>{ const ref=col(ci)+(ri+1); if(typeof v==='number'&&isFinite(v)) return `<c r="${ref}"><v>${v}</v></c>`; if(v===''||v==null) return ''; return `<c r="${ref}" t="inlineStr"><is><t>${xesc(v)}</t></is></c>`; }).join('')+'</row>').join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${r}</sheetData></worksheet>`; }
function xlsx(sheets){ const files=[];
  files.push({name:'[Content_Types].xml',data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${sheets.map((s,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`});
  files.push({name:'_rels/.rels',data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`});
  files.push({name:'xl/workbook.xml',data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s,i)=>`<sheet name="${xesc(s.name)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')}</sheets></workbook>`});
  files.push({name:'xl/_rels/workbook.xml.rels',data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((s,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')}</Relationships>`});
  sheets.forEach((s,i)=>files.push({name:`xl/worksheets/sheet${i+1}.xml`,data:sheetXml(s.rows)}));
  return zipStore(files); }
function exportRows(){ const me=S.who; const food=[['Date','Day','Person','Veg day','Meal','Item','Eat','Qty x','kcal','Protein g','Carbs g','Fat g']];
  const ck=[['Date','Person','Water ml','Steps','Bedtime','Wake up','Sleep h']]; const wt=[['Date','Person','kg']];
  ['p1','p2'].forEach(who=>{ S.who=who; const ps=PS(); const name=PEOPLE[who].name;
    migrateDays(ps); Object.keys(ps.days).sort().forEach(k=>{ const date=k.slice(0,10); if(!/^\d{4}-\d\d-\d\d/.test(date)) return; const dn=new Date(date+'T12:00').toLocaleDateString(undefined,{weekday:'short'}); const veg=k[10]==='v';
      ps.days[k].forEach(m=>m.items.forEach(x=>{ const it=F[x.id]; if(!it) return; food.push([date,dn,name,veg?'Veg':'Non-veg',m.name,it.n,fmtG(it,x.q)||it.g,x.q,Math.round(it.k*x.q),Math.round(it.p*x.q),Math.round(it.c*x.q),Math.round(it.f*x.q)]); })); });
    Object.keys(ps.log||{}).sort().forEach(d=>{ const L=ps.log[d]; let h=''; if(L.bed&&L.wake){ h=+((((toMin(L.wake)-toMin(L.bed))+1440)%1440)/60).toFixed(1); } ck.push([d,name,(L.water||0)*250,L.steps?+L.steps:'',L.bed||'',L.wake||'',h]); });
    (ps.weights||[]).slice().sort((a,b)=>a.d<b.d?-1:1).forEach(w=>wt.push([w.d,name,w.w])); });
  S.who=me; return {food,ck,wt}; }
function dl(blob,name){ const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },1000); }
const stamp=()=>ymd(new Date());
document.getElementById('xlsExport').onclick=()=>{ const r=exportRows(); dl(xlsx([{name:'Food log',rows:r.food},{name:'Check-in',rows:r.ck},{name:'Weight',rows:r.wt}]),`meal-planner-${stamp()}.xlsx`); bkMsg('Excel file downloaded.',true); };
document.getElementById('csvExport').onclick=()=>{ const r=exportRows(); const csv=(rows)=>rows.map(row=>row.map(v=>{ v=String(v??''); return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v; }).join(',')).join('\n'); dl(new Blob(['﻿'+csv(r.food)+'\n\nCHECK-IN\n'+csv(r.ck)+'\n\nWEIGHT\n'+csv(r.wt)],{type:'text/csv'}),`meal-planner-${stamp()}.csv`); bkMsg('CSV downloaded.',true); };
// ---- Sheets: swipe down or tap outside to close ----
function closeAny(ov){ ov.classList.remove('show'); }
document.querySelectorAll('.ov').forEach(ov=>{ const sh=ov.querySelector('.sheet'); if(!sh) return; let y0=null, drag=false;
  if(ov.id!=='ovKey') ov.addEventListener('click',e=>{ if(e.target===ov) closeAny(ov); });
  sh.addEventListener('touchstart',e=>{ if(sh.scrollTop<=0){ y0=e.touches[0].clientY; drag=true; sh.style.transition='none'; } else y0=null; },{passive:true});
  sh.addEventListener('touchmove',e=>{ if(y0===null) return; const dy=e.touches[0].clientY-y0; if(dy>0&&sh.scrollTop<=0){ sh.style.transform=`translateY(${dy}px)`; } else { y0=null; sh.style.transform=''; } },{passive:true});
  sh.addEventListener('touchend',e=>{ if(y0===null) return; const dy=e.changedTouches[0].clientY-y0; sh.style.transition=''; sh.style.transform=''; y0=null; if(dy>90&&ov.id!=='ovKey') closeAny(ov); },{passive:true}); });
document.getElementById('syncNow').onclick=()=>{ if(!CLOUD.on) return; if(!CLOUD.key) askKey(); else { Object.keys(S.people).forEach(w=>{ if(CLOUD.dirty[w]) cloudPush(w); }); cloudPull(); } };
document.getElementById('syncOut').onclick=()=>{ CLOUD.key=''; try{ localStorage.removeItem('kl-key'); }catch(e){} setStatus('Not signed in','warn'); document.getElementById('ovSet').classList.remove('show'); askKey(); };
document.getElementById('openSettings').addEventListener('click',()=>{ document.getElementById('syncInfo').textContent = CLOUD.on ? (CLOUD.key?'Saving to your hosting (data folder on the server). Status: '+CLOUD.status+'. Both phones and any browser see the same data once signed in.':'Server found but not signed in. Tap Sync now to enter the password.') : 'No server on this address, data stays on this device only. Use the hosted copy for sync.'; const st=document.getElementById('storeStatus'); let when=''; try{ const o=JSON.parse(localStorage.getItem('kl-meal-v2')||'{}'); if(o.savedAt) when=' Last saved '+new Date(o.savedAt).toLocaleString()+'.'; }catch(e){} st.textContent=(storeOK?'Saved in this browser.':'Warning: this browser is blocking storage, changes will not survive closing the app.')+' Survives closing and app updates, not clearing browser data or switching browsers. Back up once a week.'+when; });
document.getElementById('wtAdd').onclick=()=>{ const d=document.getElementById('wtDate').value, w=parseFloat(document.getElementById('wtVal').value); if(!d||!w) return; const ps=PS(); ps.weights=ps.weights.filter(x=>x.d!==d); ps.weights.push({d,w}); document.getElementById('wtVal').value=''; save(); render(); };
document.getElementById('keyGo').onclick=async()=>{ CLOUD.key=document.getElementById('keyIn').value.trim(); try{ localStorage.setItem('kl-key',CLOUD.key); }catch(e){} try{ const p=await api('ping'); if(!p.auth){ document.getElementById('keyMsg').textContent='Wrong password.'; return; } }catch(e){ document.getElementById('keyMsg').textContent= e.message==='locked' ? 'Too many wrong attempts. Wait 15 minutes.' : 'Cannot reach the server.'; return; } document.getElementById('ovKey').classList.remove('show'); cloudPull(); };
document.getElementById('keySkip').onclick=()=>{ document.getElementById('ovKey').classList.remove('show'); setStatus('This device only','warn'); };
document.getElementById('keyIn').addEventListener('keydown',e=>{ if(e.key==='Enter') document.getElementById('keyGo').click(); });
render();
cloudInit();
