// Curated, independently assembled 63-category question bank for the static game.
// Each prompt has a broad accepted-answer set and aliases; the daily dive
// selects seven questions locally, and practice draws a fresh seven-question set.
import { normalize } from './rules.mjs';

const entry = (answer, tier, aliases = []) => ({ answer, tier, ...(aliases.length ? { aliases } : {}) });
const group = (tier, items = []) => items.map(item => Array.isArray(item)
  ? entry(item[0], tier, item[1])
  : entry(item, tier));
const tierRank = { plankton:0, tooclever:1, schooler:2, rare:3, deepcut:4, krillion:5 };
const q = (id, text, tiers) => {
  const unique = new Map();
  for (const [tier, items] of Object.entries(tiers)) for (const item of group(tier, items)) {
    const key = normalize(item.answer), previous = unique.get(key);
    if (!previous) unique.set(key, item);
    else {
      const preferred = tierRank[item.tier] > tierRank[previous.tier] ? item : previous;
      unique.set(key, { ...preferred, aliases:[...(previous.aliases || []), ...(item.aliases || [])] });
    }
  }
  const canonical = new Set(unique.keys()), aliases = new Set(canonical);
  const answers = [...unique.values()].map(item => {
    const clean = (item.aliases || []).filter(alias => {
      const key = normalize(alias);
      if (!key || aliases.has(key)) return false;
      aliases.add(key);
      return true;
    });
    return { ...item, ...(clean.length ? { aliases:clean } : { aliases:undefined }) };
  }).map(({ aliases, ...item }) => ({ ...item, ...(aliases ? { aliases } : {}) }));
  return { id, text, answers };
};

export const BANK = [
  q('p1', 'Name a way to prepare potatoes', {
    plankton: [
      ['Mashed potatoes', ['mashed', 'mash']], ['French fries', ['fries', 'chips', 'fry', 'frying']], ['Baked potato', ['baked', 'bake', 'baking', 'jacket potato']],
      ['Boiled potatoes', ['boiled', 'boil', 'boiling']], ['Roasted potatoes', ['roasted', 'roast', 'roasting', 'roast potatoes']], ['Peeled potatoes', ['peeled', 'peel', 'peeling']],
      ['Steamed potatoes', ['steamed', 'steam', 'steaming']], ['Fried potatoes', ['fried potatoes', 'fried', 'fry up']], ['Microwaved potato', ['microwave', 'microwaved']],
      ['Smashed potatoes', ['smashed', 'smashed potato']], ['Potato chips', ['crisps', 'potato crisps']],
      ['Potato salad', ['potato salad']], ['Hash browns', ['hash brown']], ['Potato wedges', ['wedges']],
      ['Potato soup', ['cream of potato soup']], ['Potato pancakes', ['potato pancake']], ['Loaded baked potato', ['loaded potato']],
      ['Twice-baked potato', ['twice baked potatoes']], ['Scalloped potatoes', ['scalloped potato']], ['Potato gratin', ['potato au gratin', 'gratin']],
      ['Potato skins', ['loaded potato skins']], ['Home fries', ['homefries']], ['Curly fries', ['curly']], ['Sweet potato fries', ['sweet-potato fries']],
      ['Grilled potatoes', ['grilled potato']], ['Waffle fries', ['waffle cut fries']], ['Shoestring fries', ['shoestring potatoes']],
      ['Air-fried potatoes', ['air fryer potatoes']], ['Potato hash', ['hashed potatoes']], ['Crinkle-cut fries', ['crinkle cut fries']],
    ],
    schooler: [
      ['Gnocchi', ['potato gnocchi']], ['Tater tots', ['tots']], ['Potato croquettes', ['croquettes']], ['Potato rösti', ['rosti', 'rösti']],
      ['Latkes', ['potato latkes']], ['Colcannon', []], ['Bubble and squeak', ['bubble & squeak']], ['Fondant potatoes', ['fondant potato']],
      ['Hasselback potatoes', ['hasselback potato']], ['Duchess potatoes', ['duchess potato']], ['Pommes Anna', ['pommes anna']],
      ['Potato curry', ['aloo curry']], ['Potato stew', ['stewed potatoes']], ['Potato casserole', ['potato bake']],
      ['Potato dumplings', ['kartoffelklöße', 'kartoffelkloesse']], ['Potato pierogi', ['pierogi with potato']], ['Potato bread', ['potato rolls']],
      ['Poutine', ['fries with cheese curds and gravy']], ['Pommes dauphine', ['dauphine potatoes']],
      ['Patatas bravas', ['bravas', 'patatas bravas']], ['Papas arrugadas', ['wrinkled potatoes', 'canary potatoes']], ['Bombay potatoes', ['bombay potato']],
      ['Saag aloo', ['spinach and potato curry']], ['Aloo matar', ['potato and pea curry']], ['Dum aloo', ['dum aalu']],
      ['Potato fritters', ['aloo fritters']], ['Potato scones', ['tattie scones']], ['Potato waffles', ['waffled potatoes']],
      ['Potato dauphinoise', ['dauphinoise', 'potatoes dauphinoise']], ['Champ', ['champ mash']], ['Potato knish', ['knish']],
      ['Potato varenyky', ['varenyky']], ['Pommes parisienne', ['parisienne potatoes']], ['Potato and leek soup', ['leek and potato soup']],
    ],
    rare: [
      ['Aligot', ['aligot potatoes']], ['Boxty', ['Irish potato pancake']], ['Pommes soufflées', ['pommes souffle', 'souffle potatoes']],
      ['Pommes boulangère', ['pommes boulangere', 'boulangere potatoes']], ['Tartiflette', ['potato tartiflette']],
      ['Potato pavé', ['potato pave']], ['Aloo gobi', ['potato and cauliflower curry']], ['Aloo paratha', ['potato paratha']],
      ['Aloo tikki', ['potato tikki']], ['Batata harra', ['spicy potatoes']], ['Kugel', ['potato kugel']],
      ['Pommes noisette', ['noisette potatoes']], ['Pommes allumettes', ['matchstick fries', 'allumette potatoes']], ['Pommes gaufrettes', ['gaufrette potatoes']],
      ['Pommes pont-neuf', ['pont neuf potatoes']], ['Corned beef hash', ['potato and corned beef hash']], ['Red flannel hash', ['beetroot hash']],
      ['Patatas a la riojana', ['riojana potatoes']], ['Potato mille-feuille', ['mille feuille potatoes']], ['Potato soufflé', ['souffle potato']],
      ['Spanish tortilla', ['tortilla de patatas', 'tortilla española']], ['Pommes de terre lyonnaise', ['lyonnaise potatoes']],
    ],
    deepcut: [
      ['Rumbledethumps', []], ['Stovies', ['Scottish stovies']], ['Cullen skink with tatties', ['tattie cullen skink']], ['Pommes de terre sarladaises', ['sarladaise potatoes']],
      ['Pommes Macaire', ['macaire potatoes']], ['Aloo posto', ['potato with poppy seeds']], ['Batata vada', ['aloo vada']],
      ['Gratin savoyard', ['savoyard gratin']], ['Panackelty', ['pan haggerty', 'panhaggerty']],
    ],
    krillion: [['Kroppkakor', ['Swedish potato dumplings']]],
  }),
  q('p2', 'Name an animal whose name is exactly four letters long', {
    plankton: [
      'Lion', 'Bear', 'Wolf', 'Deer', 'Hare', 'Mole', 'Seal', 'Frog', 'Toad', 'Duck', 'Swan', 'Crow', 'Dove', 'Goat', 'Lamb', 'Boar', 'Moth', 'Crab', 'Clam', 'Slug',
      'Wasp', 'Flea', 'Tick', 'Worm', 'Mite', 'Kite', 'Lark', 'Tern', 'Coot', 'Teal', 'Calf', 'Foal', 'Grub',
    ],
    schooler: [
      'Orca', 'Ibex', 'Tahr', 'Kiwi', 'Newt', 'Mink', 'Lynx', 'Wren', 'Gull', 'Hawk', 'Mule', 'Puma', 'Vole', 'Paca', 'Kudu',
      'Loon', 'Shag', 'Rail', 'Ruff', 'Smew', 'Sora', 'Skua', 'Erne', 'Nene', 'Kaka', 'Titi', 'Uaru', 'Tegu', 'Anoa', 'Oryx', 'Puku', 'Zebu', 'Dhole', 'Fosa', 'Char',
      'Dace', 'Chub', 'Hake', 'Sole', 'Scad', 'Rudd', 'Tope', 'Barb', 'Cusk', 'Mako', 'Dory', 'Hoki', 'Ling', 'Opah',
    ],
    rare: ['Tuna', 'Carp', 'Bass', 'Pike', 'Myna', 'Rhea', 'Saki', 'Goby', 'Blenny', 'Tench', 'Ruffe', 'Anole', 'Skink', 'Krill', 'Scud', 'Boto', 'Suni', 'Urial'],
    deepcut: ['Pudu', 'Kagu', 'Fugu', 'Pika', 'Smelt'],
    krillion: [['Mara']],
  }),
  q('p3', 'Name someone who has won an NBA Most Valuable Player award', {
    plankton: [
      ['Michael Jordan', ['Jordan']], ['LeBron James', ['LeBron']], ['Kobe Bryant', ['Kobe']], ['Stephen Curry', ['Steph Curry', 'Steph']],
      ['Magic Johnson', ['Magic']], ['Larry Bird', ['Bird']], ['Shaquille O’Neal', ['Shaq', 'Shaquille ONeal']],
      ['Kareem Abdul-Jabbar', ['Kareem', 'Kareem Abdul Jabbar']], ['Kevin Durant', ['KD']], ['Giannis Antetokounmpo', ['Giannis']],
      ['Nikola Jokić', ['Nikola Jokic', 'Jokic']], ['Joel Embiid', ['Embiid']], ['Kevin Garnett', ['KG']],
    ],
    schooler: [
      ['Bob Pettit', []], ['Bill Russell', ['Russell']], ['Wilt Chamberlain', ['Wilt']], ['Oscar Robertson', ['Oscar']],
      ['Moses Malone', ['Moses']], ['Julius Erving', ['Dr J', 'Julius Erving']], ['Charles Barkley', ['Barkley']],
      ['Hakeem Olajuwon', ['Hakeem']], ['David Robinson', []], ['Karl Malone', []], ['Dirk Nowitzki', ['Dirk']],
      ['Steve Nash', ['Nash']], ['Allen Iverson', ['Iverson']], ['Tim Duncan', ['Duncan']], ['Russell Westbrook', ['Westbrook']],
    ],
    rare: [
      ['Willis Reed', []], ['Bob McAdoo', []], ['Wes Unseld', []], ['Bill Walton', []],
      ['James Harden', ['Harden']], ['Derrick Rose', ['D Rose']], ['Shai Gilgeous-Alexander', ['Shai', 'SGA']],
    ],
    deepcut: [['Bob Cousy', []]],
    krillion: [['Dave Cowens', []]],
  }),
  q('p4', 'Name a chemical element whose symbol is one letter', {
    plankton: ['Hydrogen', 'Carbon', 'Oxygen', 'Nitrogen', 'Fluorine', 'Phosphorus', 'Sulfur', 'Potassium'],
    schooler: ['Boron', 'Iodine', 'Tungsten', 'Uranium'],
    rare: ['Vanadium'],
    deepcut: ['Yttrium'],
    krillion: [['Yttrium', ['Y']]],
  }),
  q('p5', 'Name a type of station', {
    plankton: [
      ['Train station', ['railway station']], ['Bus station', ['bus terminal', 'coach station']], ['Police station', ['police headquarters']],
      ['Fire station', ['firehouse']], ['Radio station', ['radio']], ['Gas station', ['petrol station', 'filling station']], ['Space station', ['orbital station']],
      ['Television station', ['tv station']], 'Power station', ['Subway station', ['metro station', 'underground station']],
      'Charging station', 'Weather station', 'Service station',
    ],
    schooler: [
      'Research station', 'Military station', 'Ranger station', 'Ground station', 'Tracking station', 'Relay station', 'Base station', 'Way station',
      'Lifeboat station', 'Whaling station', 'Pumping station', 'Substation', 'Switching station', 'Ambulance station', 'Coast guard station',
      'Polling station', ['First aid station', ['medical station']], ['Aid station', ['feed station']], 'Field station', 'Polar research station',
      'Listening station', 'Signal station', 'Metro station', 'Tram station', 'Terminal station', 'Interchange station',
    ],
    rare: [
      'Compressor station', 'Converter station', 'Booster station', 'Metering station', 'Gathering station', 'Lift station', 'Regulating station',
      'Traction substation', 'Hydroelectric station', 'Nuclear power station', 'Geothermal station', 'Diesel power station', 'Early-warning station',
      'Radar station', 'Naval station', 'Recruiting station', 'Earth station', 'Deep space station', 'Telemetry station', 'Customs station',
      'Quarantine station', 'Weigh station', ['Dressing station', ['casualty clearing station']], 'Nursing station', 'Mine rescue station', 'Pilot station',
      'Cable car station', 'Funicular station',
    ],
    deepcut: [
      'Pigging station', 'Interlocking station', 'Block station', ['Repeater station', ['translator station']], 'Gauging station',
      'Radiosonde station', 'Monorail station', 'Ski lift station', 'Lunar station',
    ],
    krillion: [['Ghost station', ['abandoned station']]],
  }),
  q('p6', 'Name a country whose English name ends in the letter E', {
    plankton: ['France', 'Greece', 'Chile', 'Belize', 'Ukraine', 'Singapore'],
    schooler: ['Zimbabwe', 'Suriname', 'Cabo Verde', 'Sierra Leone', 'Timor-Leste', 'Palestine', 'Mozambique', 'Nigeria'],
    rare: [['Côte d’Ivoire', ['Cote d Ivoire']], 'Guinea', 'Equatorial Guinea', 'Papua New Guinea', ['Türkiye', ['Turkey']]],
    deepcut: ['São Tomé and Príncipe', 'Zaire', 'French Guinea', 'Portuguese Guinea'],
    krillion: ['São Tomé and Príncipe'],
  }),
  q('p7', 'Name a superhero team', {
    plankton: [
      ['Avengers', ['The Avengers']], ['Justice League', ['JLA']], ['X-Men', ['Xmen']], ['Fantastic Four', ['The Fantastic Four']],
      ['Teen Titans', ['Titans']], ['Power Rangers', ['Mighty Morphin Power Rangers']], ['Teenage Mutant Ninja Turtles', ['TMNT', 'Ninja Turtles']],
    ],
    schooler: [
      'Guardians of the Galaxy', 'Suicide Squad', 'Doom Patrol', 'The Defenders', 'Young Avengers', 'New Mutants', 'Birds of Prey', 'X-Force', 'Runaways', 'Thunderbolts',
      'X-Factor', 'New Warriors', 'Young Justice', 'Justice Society of America', 'Green Lantern Corps', 'Heroes for Hire', 'West Coast Avengers',
      'Dark Avengers', 'Secret Avengers', 'Mighty Avengers', 'A-Force', 'Squadron Supreme', 'The Umbrella Academy', 'Justice League Dark',
      'Justice League International', 'Guardians of the Globe', 'Big Hero 6',
    ],
    rare: [
      'Alpha Flight', 'Great Lakes Avengers', 'Excalibur', 'Secret Six', 'The Outsiders', 'Champions', 'Legion of Super-Heroes', 'Howling Commandos',
      'X-Statix', 'Generation X', 'Exiles', 'Power Pack', 'Invaders', 'Liberty Legion', 'All-Winners Squad', 'Beta Flight', 'Omega Flight',
      'Metal Men', 'Seven Soldiers of Victory', 'Creature Commandos', 'Shadowpact', 'Stormwatch', 'Gen13', 'WildC.A.T.s', 'DV8', 'Team 7',
      'Midnight Sons', 'Fearless Defenders', 'Secret Defenders', 'Force Works', 'Avengers Academy', 'Ultimates', 'Starjammers', 'Uncanny Avengers',
    ],
    deepcut: [
      'Freedom Force', 'Nextwave', 'The Authority', 'Great Lakes Initiative', 'Sentinels of Magic', 'Forgotten Heroes', 'L.E.G.I.O.N.',
      'Omega Men', 'Power Company', 'Justice League Task Force', 'Extreme Justice', 'Blood Syndicate', 'Shadow Cabinet', 'Primal Force', 'Atomic Knights',
    ],
    krillion: [['Section 8', ['Section Eight']]],
  }),
  q('p8', 'Name a fruit', {
    plankton: [
      'Apple', 'Banana', 'Orange', 'Strawberry', 'Grape', 'Watermelon', 'Pear', 'Peach', 'Pineapple', 'Mango', 'Lemon', 'Lime', 'Cherry', 'Blueberry', 'Raspberry', 'Melon', 'Plum', 'Kiwi', 'Papaya', 'Coconut',
      'Avocado', 'Fig', 'Date', 'Blackcurrant', 'Gooseberry', 'Clementine', 'Mandarin', 'Grapefruit', 'Apricot', 'Nectarine',
    ],
    schooler: [
      'Pomegranate', 'Cranberry', 'Cantaloupe', 'Tangerine', 'Passion fruit', 'Guava', 'Persimmon', 'Dragon fruit', 'Blackberry',
      'Honeydew melon', 'Pomelo', 'Kumquat', 'Mulberry', 'Elderberry', 'Redcurrant', 'Boysenberry', 'Loganberry', 'Plantain', 'Lychee', 'Starfruit',
      'Prickly pear', 'Mangosteen', 'Durian', 'Tamarind', 'Soursop', 'Custard apple', 'Sapodilla', 'Jujube', 'Breadfruit', 'Olive', 'Prune', 'Raisin',
      'Sloe', 'Damson', 'Greengage', 'Blood orange', 'Satsuma', 'Tangelo', 'Bilberry', 'Tayberry', 'Cloudberry', 'Lingonberry', 'Açai', 'Goji berry',
      ['Physalis', ['cape gooseberry']], 'Sugar apple',
    ],
    rare: [
      'Quince', 'Feijoa', 'Cherimoya', 'Jackfruit', 'Longan', 'Rambutan', 'Salak', 'Jabuticaba',
      'Yuzu', 'Bergamot', 'Citron', 'Sea buckthorn', 'Serviceberry', 'Acerola', 'Lucuma', 'Mamey sapote', 'Santol', 'Langsat', 'Cupuacu', 'Camu camu',
      ['Canary melon', ['yellow melon']], 'Charentais melon', 'Casaba melon', 'Hami melon', 'Pepino', ['Tomatillo', ['husk tomato']], 'Marang', 'Chempedak',
    ],
    deepcut: [
      'Pawpaw', 'Medlar', 'Buddha’s hand', 'Miracle fruit', 'Ugli fruit', 'White sapote', 'Black sapote', 'Grumichama', 'Abiu',
    ],
    krillion: ['Jabuticaba'],
  }),
  q('p9', 'Name a vegetable', {
    plankton: [
      'Carrot', 'Broccoli', 'Potato', 'Onion', 'Tomato', 'Cucumber', 'Lettuce', 'Spinach', 'Pea', 'Corn', 'Pepper', 'Celery', 'Cabbage', 'Cauliflower', 'Mushroom', 'Garlic', 'Pumpkin', ['Zucchini', ['courgette', 'courgettes']],
      'Sweet potato', 'Yam', 'Shallot', 'Spring onion', 'Green bean', 'Squash', 'Chilli', 'Bean',
    ],
    schooler: [
      ['Aubergine', ['eggplant']], 'Kale', ['Beetroot', ['beet']], 'Turnip', 'Parsnip', 'Radish', 'Leek', 'Asparagus', 'Artichoke', 'Okra', 'Fennel', 'Rutabaga', 'Brussels sprouts',
      'Savoy cabbage', 'Red cabbage', 'Napa cabbage', 'Collard greens', 'Swiss chard', 'Radicchio', 'Endive', 'Chicory', 'Escarole', ['Arugula', ['rocket']],
      'Broccolini', 'Rapini', 'Purple sprouting broccoli', 'Butternut squash', 'Acorn squash', 'Spaghetti squash', 'Pattypan squash', 'Marrow', 'Gherkin',
      'Snow pea', 'Snap pea', 'Runner bean', 'Broad bean', 'Lima bean', 'Edamame', 'Soybean', 'Chive', 'Horseradish', 'Wasabi',
      'Portobello', 'Shiitake', 'Oyster mushroom', 'Enoki', 'Chanterelle', 'Morel', 'Truffle', 'Porcini', 'Maitake', 'Jerusalem artichoke',
    ],
    rare: [
      'Kohlrabi', 'Celeriac', 'Salsify', 'Romanesco', 'Chayote', 'Daikon', 'Jicama', 'Bok choy', 'Watercress',
      'Cassava', 'Taro', 'Lotus root', 'Bamboo shoot', 'Water chestnut', 'Scorzonera', 'Burdock', 'Sea kale', 'Samphire', 'Cavolo nero',
      ['Bitter melon', ['bitter gourd']], 'Bottle gourd', 'Ivy gourd', 'Drumstick pods', 'Fiddlehead ferns', 'Ramps', 'Huitlacoche', 'Winged bean',
      'Parsley root', 'Eddoe', 'Konjac', 'Yacon', 'Mashua', 'Ulluco',
    ],
    deepcut: [
      'Oca', 'Yardlong bean', 'Crosne', 'Cardoon', 'Achocha', 'Callaloo', 'Amaranth greens', 'Orache', 'Sea beet',
    ],
    krillion: ['Crosne'],
  }),
  q('p10', 'Name a bird', {
    plankton: [
      'Eagle', 'Owl', 'Crow', 'Raven', 'Robin', 'Sparrow', 'Pigeon', 'Dove', 'Duck', 'Swan', 'Goose', 'Parrot', 'Penguin', 'Flamingo', 'Peacock', 'Chicken', 'Turkey', 'Hawk',
      'Blue tit', 'Great tit', 'Blackbird', 'Starling', 'Jay', 'Goldfinch', 'Chaffinch', 'Kestrel', 'Buzzard', 'Cuckoo', 'Mallard', 'Barn owl', 'Pheasant',
    ],
    schooler: [
      'Kingfisher', 'Woodpecker', 'Hummingbird', 'Albatross', 'Pelican', 'Puffin', 'Heron', 'Osprey', 'Magpie', 'Seagull', 'Toucan', 'Emu', 'Ostrich',
      'Coal tit', 'Long-tailed tit', 'Greenfinch', 'Bullfinch', 'Siskin', 'Nuthatch', 'Treecreeper', 'Redstart', 'Blackcap', 'Chiffchaff', 'Willow warbler',
      'Wren', 'Dunnock', 'Song thrush', 'Mistle thrush', 'Fieldfare', 'Redwing', 'Jackdaw', 'Rook', 'Skylark', 'Swift', 'Swallow', 'House martin',
      'Tawny owl', 'Sparrowhawk', 'Red kite', 'Peregrine falcon', 'Cormorant', 'Gannet', 'Guillemot', 'Razorbill', 'Kittiwake', 'Oystercatcher',
      'Lapwing', 'Moorhen', 'Coot', 'Little egret', 'Canada goose', 'Shelduck', 'Teal', 'Eider', 'Budgerigar', 'Cockatiel', 'Macaw', 'Cockatoo', 'Canary', 'Woodpigeon', 'Collared dove', 'Quail', 'Partridge',
    ],
    rare: [
      'Kakapo', 'Hoatzin', 'Shoebill', 'Secretary bird', 'Lyrebird', 'Bittern', 'Kookaburra', 'Cassowary',
      'Whinchat', 'Stonechat', 'Wheatear', 'Ring ouzel', 'Brambling', 'Linnet', 'Redpoll', 'Yellowhammer', 'Reed bunting', 'Chough', 'Nightjar',
      'Merlin', 'Hobby', 'Hen harrier', 'Goshawk', 'Golden eagle', 'White-tailed eagle', 'Fulmar', 'Shearwater', 'Storm petrel', 'Little tern',
      'Avocet', 'Godwit', 'Redshank', 'Snipe', 'Woodcock', 'Turnstone', 'Dunlin', 'Ringed plover', 'Spoonbill', 'Crane', 'Water rail',
      'Great crested grebe', 'Whooper swan', 'Barnacle goose', 'Wigeon', 'Shoveler', 'Goldeneye', 'Goosander', 'Zebra finch', 'Dodo', 'Hoopoe', 'Waxwing', 'Dipper',
    ],
    deepcut: [
      'Kagu', 'Oilbird', 'Potoo', 'Takahē', 'Bearded tit', 'Penduline tit', 'Dartford warbler', 'Bluethroat', 'Wryneck', 'Great grey shrike',
      'Rosefinch', 'Ortolan bunting', 'Yellow-browed warbler', 'Pallas’s warbler',
    ],
    krillion: ['Kagu'],
  }),
  q('p11', 'Name a mammal', {
    plankton: [
      'Dog', 'Cat', 'Horse', 'Cow', 'Sheep', 'Goat', 'Pig', 'Lion', 'Tiger', 'Elephant', 'Giraffe', 'Zebra', 'Bear', 'Wolf', 'Fox', 'Deer', 'Rabbit', 'Monkey',
      'Squirrel', 'Beaver', 'Otter', 'Badger', 'Kangaroo', 'Koala', 'Camel', 'Bison', 'Moose', 'Leopard', 'Cheetah', 'Raccoon',
    ],
    schooler: [
      'Dolphin', 'Whale', 'Bat', 'Hedgehog', 'Armadillo', 'Meerkat', 'Lemur', 'Wombat', 'Orangutan', 'Chimpanzee', 'Hippopotamus', 'Rhinoceros',
      'Gorilla', 'Gibbon', 'Baboon', 'Macaque', 'Sloth', 'Anteater', 'Tapir', 'Llama', 'Alpaca', 'Reindeer', 'Elk', 'Antelope', 'Gazelle', 'Impala',
      'Wildebeest', 'Hyena', 'Jackal', 'Coyote', 'Sea otter', 'Walrus', 'Porpoise', 'Stoat', 'Weasel', 'Ferret', 'Shrew', 'Hamster', 'Gerbil', 'Guinea pig',
      'Chinchilla', 'Capybara', 'Porcupine', 'Groundhog', 'Chipmunk', 'Skunk', 'Opossum', 'Wallaby', 'Tasmanian devil', 'Platypus', 'Echidna',
      'Giant panda', 'Red panda', 'Polar bear', 'Buffalo', 'Bighorn sheep', 'Musk ox', 'Warthog', 'Mongoose', 'Civet', 'Wolverine', 'Ocelot',
      'Lynx', 'Bobcat', 'Cougar', 'Jaguar', 'Snow leopard', 'Blue whale', 'Humpback whale', 'Sperm whale', 'Elephant seal', 'Leopard seal', 'Manatee',
    ],
    rare: [
      'Aardvark', 'Pangolin', 'Quokka', 'Fossa', 'Binturong', 'Numbat', 'Okapi', 'Saola', 'Narwhal',
      'Kinkajou', 'Coati', 'Tarsier', 'Loris', 'Galago', 'Aye-aye', 'Indri', 'Sifaka', 'Marmoset', 'Tamarin', 'Capuchin', 'Mandrill', 'Proboscis monkey',
      'Bongo', 'Kudu', 'Oryx', 'Sable antelope', 'Gerenuk', 'Dik-dik', 'Klipspringer', 'Ibex', 'Chamois', 'Markhor', 'Przewalski’s horse', 'Onager',
      'Vicuña', 'Guanaco', 'Dormouse', 'Desman', 'Muskrat', 'Hyrax', 'Elephant shrew', 'Golden mole',
    ],
    deepcut: [
      'Solenodon', 'Dugong', 'Pika', 'Tenrec', 'Vaquita', 'Baiji', 'Saiga', 'Bilby', 'Quoll', 'Bettong', 'Cuscus', 'Monito del monte',
    ],
    krillion: ['Saola'],
  }),
  q('p12', 'Name a marine animal', {
    plankton: [
      'Shark', 'Dolphin', 'Whale', 'Octopus', 'Squid', 'Seal', 'Sea lion', 'Turtle', 'Crab', 'Lobster', 'Jellyfish', 'Seahorse', 'Clownfish', 'Orca',
      ['Starfish', ['seastar', 'sea star']], 'Clam', 'Oyster', 'Mussel', 'Scallop', 'Shrimp', 'Prawn', 'Eel', 'Stingray', 'Cod', 'Salmon', 'Tuna', 'Herring',
    ],
    schooler: [
      'Manta ray', 'Moray eel', 'Sea otter', 'Nautilus', 'Cuttlefish', 'Sea cucumber', 'Walrus', 'Manatee', 'Barracuda', 'Anglerfish',
      'Sardine', 'Anchovy', 'Trout', 'Swordfish', 'Marlin', 'Mahi-mahi', 'Grouper', 'Snapper', 'Flounder', 'Haddock', 'Halibut', 'Plaice', 'Mackerel',
      'Pufferfish', 'Angelfish', 'Parrotfish', 'Sea urchin', 'Sea anemone', 'Coral', 'Sponge', 'Barnacle', 'Whelk', 'Conch', 'Hermit crab', 'King crab',
      'Mantis shrimp', 'Krill', 'Sea slug', 'Nudibranch', 'Sand dollar', 'Brittle star', 'Comb jelly', 'Hammerhead shark', 'Great white shark', 'Whale shark',
    ],
    rare: [
      'Blue-ringed octopus', 'Mola mola', 'Leafy seadragon', 'Dumbo octopus', 'Horseshoe crab', 'Goblin shark', 'Ribbon eel',
      'Lion’s mane jellyfish', 'Box jellyfish', 'Portuguese man o’ war', 'Coelacanth', 'Giant squid', 'Colossal squid', 'Barreleye', 'Viperfish',
      'Frogfish', 'Hatchetfish', 'Lanternfish', 'Sea angel', 'Giant isopod', 'Sea spider', 'Pompeii worm', 'Giant tube worm', 'Cookiecutter shark',
      'Megamouth shark', 'Frilled shark', 'Scaly-foot snail', 'Sea pig',
    ],
    deepcut: [
      'Vampire squid', 'Gulper eel', 'Yeti crab', 'Wobbegong', 'Handfish', 'Sarcastic fringehead', 'Stoplight loosejaw', 'Atolla jellyfish',
    ],
    krillion: ['Yeti crab'],
  }),
  q('p13', 'Name a dog breed', {
    plankton: [
      'Labrador Retriever', 'Golden Retriever', 'Poodle', 'Bulldog', 'Beagle', 'German Shepherd', 'Pug', 'Boxer', 'Dachshund', 'Chihuahua', 'Corgi', 'Border Collie',
      'Pomeranian', 'Pit bull', 'Dalmatian', 'Bernese Mountain Dog', 'Shetland Sheepdog', 'French Bulldog',
    ],
    schooler: [
      'Siberian Husky', 'Shih Tzu', 'Great Dane', 'Rottweiler', 'Doberman Pinscher', 'Australian Shepherd', 'Cocker Spaniel', 'Greyhound', 'Maltese', 'Akita',
      'English Setter', 'Irish Setter', 'Pointer', 'Weimaraner', 'Vizsla', 'Brittany', 'English Springer Spaniel', 'Cavalier King Charles Spaniel',
      'Bull Terrier', 'Jack Russell Terrier', 'West Highland Terrier', 'Cairn Terrier', 'Yorkshire Terrier', 'Schnauzer', 'Old English Sheepdog', 'Samoyed',
      'Newfoundland', 'Saint Bernard', 'Shiba Inu', 'Alaskan Malamute', 'Dogo Argentino', 'Cane Corso', 'Neapolitan Mastiff', 'Mastiff', 'Bullmastiff',
      'Boston Terrier', 'Bichon Frise', 'Cockapoo', 'Labradoodle', 'Goldendoodle', 'Rough Collie', 'Whippet', 'Italian Greyhound', 'Afghan Hound', 'Great Pyrenees',
    ],
    rare: [
      'Basenji', 'Saluki', 'Borzoi', 'Xoloitzcuintli', 'Lagotto Romagnolo', 'Leonberger', 'Keeshond', 'Bedlington Terrier',
      'Bloodhound', 'Foxhound', 'Otterhound', 'Irish Wolfhound', 'Scottish Deerhound', 'Lurcher', 'Sloughi', 'Nova Scotia Duck Tolling Retriever',
      'Chesapeake Bay Retriever', 'Curly-Coated Retriever', 'Flat-Coated Retriever', 'Clumber Spaniel', 'Kooikerhondje', 'Lundehund', 'Bergamasco',
      'Briard', 'Beauceron', 'Hovawart', 'Komondor', 'Kuvasz', 'Mudi', 'Pumi', 'Belgian Malinois', 'Groenendael', 'Cesky Terrier', 'Sealyham Terrier',
      'Norwich Terrier', 'Skye Terrier', 'Glen of Imaal Terrier', 'Kerry Blue Terrier', 'Soft Coated Wheaten Terrier', 'Portuguese Water Dog', 'Spinone',
    ],
    deepcut: [
      'Azawakh', 'Schipperke', 'Puli', 'Catalburun', 'Peruvian Inca Orchid', 'Thai Ridgeback', 'Carolina Dog', 'Catahoula Leopard Dog',
      'Black Mouth Cur', 'Plott Hound', 'Bluetick Coonhound', 'Norwegian Elkhound', 'Jämthund', 'Karelian Bear Dog',
    ],
    krillion: ['Catalburun'],
  }),
  q('p14', 'Name a musical instrument', {
    plankton: [
      'Piano', 'Guitar', 'Violin', 'Drums', 'Flute', 'Trumpet', 'Saxophone', 'Cello', 'Clarinet', 'Harp', 'Trombone', 'Ukulele',
      'Keyboard', 'Organ', 'Synthesizer', 'Recorder', 'Bugle', 'Tambourine', 'Cymbals', 'Gong', 'Bagpipes', 'Bass guitar',
    ],
    schooler: [
      'Accordion', 'Banjo', 'Oboe', 'Bassoon', 'Mandolin', 'Xylophone', 'Harmonica', 'Tuba', 'Double bass', 'French horn', 'Marimba',
      'Piccolo', 'English horn', 'Contrabassoon', 'Euphonium', 'Flugelhorn', 'Cornet', 'Alto saxophone', 'Tenor saxophone', 'Bass clarinet', 'Viola',
      'Concertina', 'Melodica', 'Kalimba', 'Vibraphone', 'Glockenspiel', 'Celesta', 'Steel drum', 'Cajon', 'Congas', 'Timpani', 'Snare drum', 'Bass drum',
      'Tabla', 'Taiko', 'Bodhrán', 'Castanets', 'Maracas', 'Cowbell', 'Triangle', 'Jaw harp', 'Autoharp', 'Lute', 'Oud', 'Balalaika', 'Bouzouki', 'Zither',
      'Dulcimer', 'Clavichord', 'Harpsichord', 'Bongo',
    ],
    rare: [
      'Theremin', 'Sitar', 'Shamisen', 'Djembe', 'Erhu', 'Nyckelharpa', 'Didgeridoo', ['Glass armonica', ['glass harmonica']],
      'Kora', 'Koto', 'Guzheng', 'Pipa', 'Sarangi', 'Tanpura', 'Bansuri', 'Shehnai', 'Ney', 'Qanun', 'Duduk', 'Zurna', 'Gaida', 'Kaval',
      'Bandoneon', 'Hardanger fiddle', 'Alphorn', 'Berimbau', 'Cuíca', 'Mbira', 'Balafon', 'Crotales', 'Waterphone',
    ],
    deepcut: [
      'Ondes Martenot', 'Hurdy-gurdy', 'Crwth', 'Serpent', 'Trautonium', 'Telharmonium', 'Basset horn', 'Ophicleide', 'Sackbut', 'Shawm', 'Krummhorn', 'Cornett', 'Carnyx', 'Aulos',
    ],
    krillion: ['Crwth'],
  }),
  q('p15', 'Name a board game', {
    plankton: [
      'Chess', 'Checkers', ['Monopoly'], 'Scrabble', ['Clue', ['cluedo']], 'Risk', 'Catan', 'Candy Land', 'Battleship', 'Guess Who?', 'Sorry!', 'Connect Four',
      'Pictionary', 'Yahtzee', 'Backgammon', 'Dominoes', 'Mahjong', 'Ludo', 'Snakes and Ladders', 'Jenga', 'Twister', 'Operation', ['Othello', ['reversi']], 'Trouble',
    ],
    schooler: [
      'Ticket to Ride', 'Carcassonne', 'Azul', 'Pandemic', 'Codenames', 'Mancala', 'Stratego', 'Boggle', 'The Game of Life', 'Trivial Pursuit', 'Go',
      'Dixit', 'Splendor', '7 Wonders', 'Dominion', 'Puerto Rico', 'Power Grid', 'Alhambra', 'Small World', 'Forbidden Island', 'Sushi Go', 'Kingdomino',
      'Love Letter', 'Coup', 'Citadels', 'Terraforming Mars', 'Gloomhaven', 'Sagrada', 'Patchwork', 'Jaipur', 'Munchkin', 'Rummikub', 'Bananagrams',
      'Balderdash', 'Taboo', 'Axis and Allies', 'Memoir 44', 'HeroQuest', 'Clank!', 'Spirit Island', 'Ark Nova',
    ],
    rare: [
      'Wingspan', 'Root', 'Everdell', 'Agricola', 'Diplomacy', 'Tigris and Euphrates', 'Hive', 'Quoridor',
      'Brass: Birmingham', 'Gaia Project', 'Terra Mystica', 'Barrage', 'Lisboa', 'Food Chain Magnate', 'Age of Steam', 'Caylus', 'Tzolk’in',
      'Viticulture', 'A Feast for Odin', 'Caverna', 'Le Havre', 'Great Western Trail', 'Concordia', 'Orléans', 'The Castles of Burgundy', 'Troyes',
      'Grand Austria Hotel', 'Underwater Cities', 'Res Arcana', 'Race for the Galaxy', 'Cosmic Encounter', 'Eclipse', 'Twilight Imperium', 'Space Hulk', 'Blood Bowl',
    ],
    deepcut: [
      'Tak', 'Pax Pamir', 'Twilight Struggle', 'Yinsh', 'Dvonn', 'Gipf', 'ZÈRTZ', 'Tzaar', 'Quarto', 'Gobblet', 'Hex', 'Havannah', 'TwixT', 'Onitama',
    ],
    krillion: ['Tak'],
  }),
  q('p16', 'Name a card game', {
    plankton: [
      'Poker', 'Blackjack', 'Bridge', 'Rummy', 'Go Fish', 'Solitaire', 'Hearts', 'Spades', 'Crazy Eights', 'War', 'Uno', 'Snap',
      'Cheat', 'Speed', 'Spoons', 'Slapjack', 'Old Maid', 'Cribbage', 'Euchre', 'Whist',
    ],
    schooler: [
      'Canasta', 'Pinochle', 'Gin Rummy', 'Old Maid', 'Whist', 'President', 'Baccarat',
      'Beggar My Neighbour', 'Pitch', 'Schnapsen', 'Doppelkopf', 'Mau Mau', 'Phase 10', 'Skip-Bo', 'Exploding Kittens', 'Cards Against Humanity',
      'Apples to Apples', 'Belote', 'Briscola', 'Truco', 'Mus', 'Preferans', 'Oh Hell', 'Big Two', 'Egyptian Ratscrew', 'Concentration', 'Pontoon',
      'Three-card brag', 'Teen patti', 'Casino', 'Spider Solitaire', 'FreeCell', 'Pyramid Solitaire', 'Hanafuda', 'Koi-Koi', 'Dou dizhu',
    ],
    rare: [
      'Skat', 'Bezique', 'Klondike', 'Mao', 'Durak', 'Scopa', 'Sheepshead', 'Tichu',
      'Napoleon', 'Piquet', 'Kemps', 'Thirty-one', 'Kaiser', 'Watten', 'Binokel', 'Tressette', 'Scopone',
      'Buraco', 'Biriba', 'Kozel', 'Rentz', 'Sheng ji', 'Tien len', 'Go-stop',
    ],
    deepcut: ['Zwicker', 'Mariage', 'Kopfeln', 'Basset', 'Ombre', 'Trappola', 'Karnöffel', 'Tarocchini'],
    krillion: ['Scopa'],
  }),
  q('p17', 'Name a sport', {
    plankton: [
      'Football', 'Soccer', 'Basketball', 'Baseball', 'Tennis', 'Swimming', 'Golf', 'Rugby', 'Cricket', 'Hockey', 'Volleyball', 'Boxing', 'Cycling', 'Running', 'Wrestling',
      'Athletics', 'Marathon', 'Triathlon', 'Gymnastics', 'Darts', 'Bowling', 'Snooker', 'Billiards', 'Diving', 'Skiing', 'Snowboarding', 'Skateboarding', 'Archery',
    ],
    schooler: [
      'Badminton', 'Table tennis', 'Squash', 'Rowing', 'Fencing', 'Skiing', 'Surfing', 'Lacrosse', 'Handball', 'Judo', 'Taekwondo',
      'Decathlon', 'Pentathlon', 'Hurdles', 'Long jump', 'High jump', 'Pole vault', 'Shot put', 'Discus', 'Javelin', 'Cross country', 'Duathlon',
      'Water polo', 'Synchronized swimming', 'Canoeing', 'Sailing', 'Windsurfing', 'Kitesurfing', 'Water skiing', 'Ice skating', 'Figure skating', 'Speed skating',
      'Luge', 'Ski jumping', 'Mountaineering', 'Rock climbing', 'Bouldering', 'Orienteering', 'Karate', 'Aikido', 'Kung fu', 'Muay Thai', 'Kickboxing',
      'Mixed martial arts', 'Sumo', 'Weightlifting', 'Powerlifting', 'Trampolining', 'Rhythmic gymnastics', 'Cheerleading', 'Netball', 'Korfball', 'Rounders',
      'Softball', 'Croquet', 'Bocce', 'Pétanque', 'Lawn bowls', 'Skydiving', 'Paragliding', 'Hang gliding', 'Ultimate frisbee', 'Disc golf', 'Pickleball', 'Padel',
      'Racquetball', 'Formula One', 'Karting', 'Drag racing', 'Horse racing', 'Show jumping', 'Dressage', 'Rodeo', 'Gaelic football', 'Floorball', 'Jai alai',
    ],
    rare: [
      'Curling', 'Biathlon', 'Polo', 'Kabaddi', 'Sepak takraw', 'Bandy', 'Skeleton', 'Bobsleigh',
      'Hammer throw', 'Racewalking', 'Trail running', 'Synchronized diving', 'Barefoot skiing',
      'Rafting', 'Coasteering', 'Base jumping', 'Bungee jumping', 'Roller derby', 'BMX', 'Mountain biking', 'Cyclocross', 'Rallying', 'Speedway',
      'Greyhound racing', 'Fly fishing', 'Freediving', 'Spearfishing', 'Bull riding', 'Sambo', 'Capoeira', 'Kendo', 'Kyudo',
      'Camogie', 'Fistball', 'Ringette', 'Underwater rugby', 'Kho kho', 'Mallakhamb',
    ],
    deepcut: [
      'Hurling', 'Shinty', 'Pelota', 'Underwater hockey', 'Real tennis', 'Paddleball', 'Buzkashi', 'Jorkyball', 'Bossaball',
    ],
    krillion: ['Sepak takraw'],
  }),
  q('p18', 'Name a planet, dwarf planet, or dwarf-planet candidate in our Solar System', {
    plankton: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    schooler: ['Pluto', 'Ceres', 'Eris'],
    rare: ['Haumea', 'Makemake', 'Hygiea', 'Vesta', 'Pallas'],
    deepcut: ['Gonggong', 'Quaoar', 'Sedna', 'Orcus', 'Salacia', 'Varda', 'Ixion', 'Varuna', 'Huya', 'Lempo', 'Altjira', 'Chaos', 'Deucalion', 'Rhadamanthus', 'Ceto', 'Typhon'],
    krillion: ['Orcus'],
  }),
  q('p19', 'Name a moon in our Solar System', {
    plankton: [['The Moon', ['Earth’s Moon', 'Earth moon']], 'Io', 'Europa', 'Ganymede', 'Callisto', 'Titan'],
    schooler: [
      'Triton', 'Phobos', 'Deimos', 'Enceladus', 'Mimas', 'Iapetus', 'Rhea', 'Dione', 'Miranda', 'Ariel', 'Oberon', 'Titania', 'Charon', 'Tethys', 'Hyperion',
      'Amalthea', 'Himalia', 'Elara', 'Pasiphae', 'Sinope', 'Lysithea', 'Carme', 'Ananke', 'Leda', 'Themisto', 'Pan', 'Daphnis', 'Atlas', 'Prometheus',
      'Pandora', 'Epimetheus', 'Janus', 'Phoebe', 'Telesto', 'Calypso', 'Helene', 'Puck', 'Nix', 'Hydra',
    ],
    rare: [
      'Umbriel', 'Dysnomia', 'Proteus', 'Nereid', 'Larissa', 'Galatea', 'Despina', 'Thalassa', 'Naiad', 'Ophelia', 'Cordelia', 'Bianca', 'Cressida',
      'Desdemona', 'Juliet', 'Portia', 'Rosalind', 'Belinda', 'Perdita', 'Mab', 'Cupid', 'Caliban', 'Sycorax', 'Prospero', 'Setebos', 'Stephano',
      'Trinculo', 'Francisco', 'Ferdinand', 'Margaret', 'Methone', 'Anthe', 'Pallene', 'Polydeuces', 'Adrastea', 'Metis', 'Thebe', 'Halimede', 'Psamathe', 'Neso',
    ],
    deepcut: [
      'Kerberos', 'Styx', 'Ymir', 'Siarnaq', 'Tarvos', 'Praxidike', 'Euanthe', 'Iocaste', 'Taygete', 'Callirrhoe', 'Autonoe', 'Thyone', 'Aegaeon', 'Fornjot', 'Hati', 'Skathi',
    ],
    krillion: ['Kerberos'],
  }),
  q('p20', 'Name a chemical element', {
    plankton: [
      'Iron', 'Gold', 'Silver', 'Copper', 'Carbon', 'Oxygen', 'Hydrogen', 'Nitrogen', 'Helium', 'Sodium', 'Calcium', 'Chlorine',
      'Lead', 'Tin', 'Zinc', 'Mercury', 'Krypton', 'Radon', 'Xenon',
    ],
    schooler: [
      'Cobalt', 'Nickel', 'Neon', 'Argon', 'Silicon', 'Phosphorus', 'Magnesium', ['Aluminium', ['Aluminum']], 'Uranium', 'Platinum',
      'Bromine', 'Beryllium', 'Lithium', 'Rubidium', 'Strontium', 'Barium', 'Caesium', 'Selenium', 'Arsenic', 'Antimony', 'Cadmium', 'Indium',
      'Scandium', 'Yttrium', 'Zirconium', 'Niobium', 'Molybdenum', 'Palladium', 'Rhodium', 'Iridium', 'Polonium', 'Astatine',
      'Francium', 'Radium', 'Actinium', 'Thorium', 'Plutonium', 'Neptunium', 'Curium', 'Americium', 'Californium', 'Cerium', 'Lanthanum', 'Neodymium',
      'Samarium', 'Europium', 'Gadolinium', 'Terbium', 'Holmium', 'Erbium', 'Thulium', 'Ytterbium', 'Lutetium', 'Praseodymium', 'Hafnium',
    ],
    rare: [
      'Gallium', 'Germanium', 'Ruthenium', 'Osmium', 'Tantalum', 'Tellurium', 'Bismuth', 'Technetium',
      'Protactinium', 'Rutherfordium', 'Dubnium', 'Seaborgium', 'Bohrium', 'Hassium', 'Meitnerium', 'Darmstadtium', 'Roentgenium', 'Copernicium',
      'Nihonium', 'Flerovium', 'Moscovium', 'Livermorium', 'Tennessine', 'Oganesson',
    ],
    deepcut: ['Promethium', 'Rhenium', 'Dysprosium', 'Berkelium', 'Einsteinium', 'Fermium', 'Mendelevium', 'Nobelium', 'Lawrencium'],
    krillion: ['Promethium'],
  }),
  q('p21', 'Name a country in Europe', {
    plankton: [
      'France', 'Germany', 'Italy', 'Spain', 'Portugal', 'Greece', 'Ireland', 'Norway', 'Sweden', 'Poland', 'Ukraine', 'Netherlands', 'Switzerland', 'Austria', 'Belgium',
      'Czechia', 'Hungary', 'Serbia', 'Russia',
    ],
    schooler: [
      'Croatia', 'Slovenia', 'Slovakia', 'Romania', 'Bulgaria', 'Albania', 'Iceland', 'Denmark', 'Finland', 'Estonia', 'Latvia', 'Lithuania',
      'Belarus', 'Malta', 'Cyprus', 'Turkey', 'Georgia', 'Armenia', 'Azerbaijan',
    ],
    rare: ['Andorra', 'San Marino', 'Montenegro', 'Moldova', 'North Macedonia', 'Liechtenstein', 'Luxembourg', 'Bosnia and Herzegovina'],
    deepcut: ['Vatican City', 'Kosovo', 'Monaco'],
    krillion: ['San Marino'],
  }),
  q('p22', 'Name a U.S. state', {
    plankton: ['California', 'Texas', 'Florida', 'New York', 'Alaska', 'Hawaii', 'Washington', 'Oregon', 'Nevada', 'Arizona', 'Colorado', 'Montana', 'Illinois', 'Ohio', 'Georgia', 'Virginia', 'Pennsylvania', 'Michigan', 'Massachusetts', 'Tennessee'],
    schooler: ['Wyoming', 'Vermont', 'Maine', 'Connecticut', 'New Hampshire', 'New Mexico', 'North Carolina', 'South Carolina', 'North Dakota', 'South Dakota', 'West Virginia', 'Arkansas', 'Louisiana', 'Mississippi', 'Alabama', 'Kentucky', 'Indiana', 'Missouri'],
    rare: ['Idaho', 'Iowa', 'Kansas', 'Maryland', 'Minnesota', 'Nebraska', 'New Jersey', 'Oklahoma', 'Utah', 'Wisconsin'],
    deepcut: ['Rhode Island'],
    krillion: ['Delaware'],
  }),
  q('p23', 'Name a national capital city', {
    plankton: [
      'London', 'Paris', 'Rome', 'Madrid', 'Tokyo', 'Beijing', 'Ottawa', 'Canberra', 'Washington, D.C.', 'Berlin', 'Athens', 'Cairo', 'Seoul', 'New Delhi', 'Mexico City',
      'Moscow', 'Amsterdam', 'Brussels', 'Vienna', 'Bern', 'Budapest', 'Prague', 'Copenhagen', 'Bogotá', 'Santiago', 'Caracas', 'Havana', 'Brasília',
    ],
    schooler: [
      'Helsinki', 'Oslo', 'Stockholm', 'Lisbon', 'Dublin', 'Warsaw', 'Bangkok', 'Jakarta', 'Nairobi', 'Lima', 'Buenos Aires', 'Wellington', 'Ankara', 'Reykjavik',
      'Hanoi', 'Manila', 'Kuala Lumpur', 'Dhaka', 'Islamabad', 'Kathmandu',       'Naypyidaw', 'Phnom Penh', 'Vientiane', 'Ulaanbaatar', 'Astana', 'Tashkent', 'Damascus', 'Amman', 'Beirut', 'Baghdad', 'Tehran', 'Riyadh',
      'Abu Dhabi', 'Doha', 'Jerusalem', 'Khartoum', 'Addis Ababa', 'Mogadishu', 'Kampala', 'Pretoria', 'Kinshasa', 'Abuja', 'Dakar', 'Accra',
      'Tallinn', 'Riga', 'Vilnius', 'Minsk', 'Kyiv', 'Bucharest', 'Sofia', 'Belgrade', 'Zagreb', 'Sarajevo', 'Skopje', 'Tirana', 'Valletta',
      'Nicosia', 'Andorra la Vella', 'Bratislava', 'Guatemala City', 'San Salvador', 'Tegucigalpa', 'Managua', 'San José', 'Panama City',
      'Nassau', 'Kingston', 'Port-au-Prince', 'Santo Domingo', 'Port of Spain', 'Georgetown', 'Quito', 'La Paz', 'Sucre', 'Asunción', 'Montevideo',
      'Port Moresby', 'Port Vila', 'Suva',
    ],
    rare: [
      'Thimphu', 'Nukuʻalofa', 'Funafuti', 'Asmara', 'Maseru', 'Lilongwe', 'Dili', 'Paramaribo', 'Yamoussoukro',
      'Sri Jayawardenepura Kotte', 'Colombo', 'Ramallah', 'Lobamba', 'Bloemfontein', 'Cape Town', 'N’Djamena', 'São Tomé', 'Saint George’s', 'Saint John’s', 'Yaren',
      'Bishkek', 'Dushanbe', 'Ashgabat', 'Baku', 'Tbilisi', 'Yerevan', 'Kuwait City', 'Manama', 'Muscat', 'Sanaa', 'Djibouti', 'Kigali', 'Dodoma',
      'Lusaka', 'Harare', 'Gaborone', 'Windhoek', 'Maputo', 'Antananarivo', 'Port Louis', 'Moroni', 'Mbabane', 'Brazzaville', 'Libreville', 'Yaoundé',
      'Bangui', 'Niamey', 'Ouagadougou', 'Bamako', 'Conakry', 'Freetown', 'Monrovia', 'Lomé', 'Banjul', 'Bissau', 'Praia', 'Malabo', 'Luanda', 'Gitega', 'Juba',
      'Chisinau', 'Ljubljana', 'Podgorica', 'Belmopan', 'Bridgetown', 'Castries', 'Kingstown', 'Basseterre', 'Roseau', 'Honiara', 'Apia', 'Tarawa', 'Majuro',
    ],
    deepcut: ['Palikir', 'Ngerulmud', 'Bandar Seri Begawan', 'Porto-Novo', 'Melekeok', 'Bujumbura', 'Alofi', 'Avarua'],
    krillion: ['Ngerulmud'],
  }),
  q('p24', 'Name a flower', {
    plankton: [
      'Rose', 'Tulip', 'Daisy', 'Sunflower', 'Lily', 'Daffodil', 'Orchid', 'Carnation', 'Poppy', 'Marigold', 'Violet', 'Peony', 'Iris', 'Lavender',
      'Snowdrop', 'Bluebell', 'Hyacinth', 'Primrose', 'Buttercup', 'Pansy', 'Dahlia',
    ],
    schooler: [
      'Chrysanthemum', 'Hydrangea', 'Magnolia', 'Foxglove', 'Bluebell', 'Crocus', 'Hibiscus', 'Zinnia', 'Freesia', 'Anemone',
      'Lily of the valley', 'Forget-me-not', 'Baby’s breath', 'Gypsophila', 'Sweet pea', 'Sweet William', 'Petunia', 'Begonia', 'Geranium', 'Impatiens',
      'Cosmos', 'Aster', 'Gladiolus', 'Ranunculus', 'Lisianthus', 'Larkspur', 'Delphinium', 'Hellebore', 'Narcissus', 'Amaryllis', 'Agapanthus',
      'Camellia', 'Gardenia', 'Jasmine', 'Honeysuckle', 'Clematis', 'Lilac', 'Buddleia', 'Rhododendron', 'Azalea', 'Cornflower', 'Calendula',
      'Chamomile', 'Echinacea', 'Rudbeckia', 'Coreopsis', 'Verbena', 'Lobelia', 'Salvia', 'Penstemon', 'Hollyhock', 'Stock', 'Alyssum', 'Candytuft',
      'Cowslip', 'Daylily', 'Canna', 'Crocosmia', 'Fritillaria', 'Crown imperial', 'Muscari', 'Columbine', 'Monkshood', 'Bleeding heart', 'Lupin',
      'Goldenrod', 'Yarrow', 'California poppy', 'Osteospermum', 'Scabious', 'Phlox', 'Aubrieta',
      'Campanula', 'Harebell', 'Alstroemeria', 'Waratah', 'Banksia', 'Kangaroo paw', 'Lotus', 'Water lily', 'Heliconia', 'Anthurium', 'Lady’s slipper',
      'Rafflesia', 'Morning glory', 'Nasturtium', 'Fuchsia', 'Lantana', 'Bougainvillea', 'Plumeria', 'Frangipani', 'Mallow',
    ],
    rare: [
      'Protea', 'Bird of paradise', 'Corpse flower', 'Passionflower', 'Wisteria', 'Snapdragon', 'Gloriosa lily', 'Allium',
      'Sea lavender', 'Astrantia', 'Nigella', 'Tiger lily', 'Peruvian lily', 'Hepatica', 'Pasqueflower', 'Winter aconite',
      'Wood anemone', 'Star of Bethlehem', 'Snowflake', 'Clivia', 'Hippeastrum', 'Aconitum', 'Borage',
    ],
    deepcut: ['Chocolate cosmos', 'Ghost orchid', 'Jade vine', 'Middlemist red', 'Titan arum', 'Kokia cookei', 'Crested iris', 'Slipper orchid'],
    krillion: ['Middlemist red'],
  }),
  q('p25', 'Name a tree', {
    plankton: [
      'Oak', 'Pine', 'Maple', 'Birch', 'Willow', 'Cedar', 'Ash', 'Elm', 'Apple tree', 'Cherry tree', 'Palm tree', 'Redwood', 'Sequoia',
      'Poplar', 'Alder', 'Horse chestnut', 'Walnut', 'Sycamore', 'Beech', 'Hawthorn', 'Holly', 'Hazel', 'Rowan', 'Yew', 'Fir', 'Spruce', 'Larch', 'Cypress',
    ],
    schooler: [
      'Magnolia', 'Aspen', 'Baobab', 'Eucalyptus', 'Olive tree', 'Chestnut', 'Linden', 'Plane tree', 'London plane', 'Hornbeam', 'Field maple', 'Hickory', 'Pecan',
      'Cork oak', 'Weeping willow', 'Blackthorn', 'Crab apple', 'Pear tree', 'Plum tree', 'Fig tree', 'Mulberry tree', 'Lemon tree', 'Orange tree', 'Date palm',
      'Coconut palm', 'Oil palm', 'Sago palm', 'Douglas fir', 'Scots pine', 'Stone pine', 'Juniper', 'Hemlock', 'Leyland cypress', 'Bald cypress', 'Tree fern',
      'Ginkgo', 'Giant sequoia', 'Coast redwood', 'Silver birch', 'Jarrah', 'Teak', 'Mahogany', 'Ebony', 'Rosewood', 'Sandalwood', 'Balsa', 'Boxwood', 'Tamarind tree',
      'Mango tree', 'Avocado tree', 'Cacao tree', 'Coffee tree', 'Brazil nut tree', 'Cashew tree', 'Almond tree', 'Neem', 'Moringa', 'Kapok', 'Joshua tree', 'Mesquite',
      'Bay tree', 'Laurel', 'Elder', 'Dogwood', 'Laburnum', 'Tree of heaven', 'Acacia', 'Tulip tree', 'Sweetgum', 'Bodhi tree', 'Rubber tree', 'Strangler fig',
    ],
    rare: [
      'Monkey puzzle tree', 'Banyan', 'Jacaranda', 'Catalpa',
      'Cottonwood', 'Sweet chestnut', 'Butternut', 'Pussy willow', 'Bird cherry', 'Service tree', 'Damson tree', 'Persimmon tree', 'Palmyra palm', 'Ponderosa pine',
      'Bristlecone pine', 'Cedar of Lebanon', 'Atlas cedar', 'Thuja', 'Monterey cypress', 'Norfolk Island pine', 'Araucaria', 'Copper beech', 'Wych elm', 'Liquidambar',
      'Paulownia', 'Peepal', 'Ficus', 'Ironbark', 'Tallowwood', 'Sapele', 'Iroko', 'Padauk', 'Wenge', 'Cocobolo', 'Zebrawood', 'Buckeye', 'Buckthorn', 'Myrtle',
      'Guelder rose', 'Redbud', 'Judas tree', 'Sumac', 'Osage orange', 'Osier', 'Quince tree', 'Cobnut',
    ],
    deepcut: [
      'Wollemi pine', 'Dawn redwood', 'Dragon blood tree', 'Kauri', 'Ramin', 'Obeche', 'Blackbutt',
      'Swamp cypress', 'Paper birch', 'Mountain ash', 'Yellowwood', 'Sassafras', 'Tupelo', 'Shagbark hickory', 'Monkey bread tree',
    ],
    krillion: ['Wollemi pine'],
  }),
  q('p26', 'Name a type of weather', {
    plankton: [
      ['Rain', ['rainy', 'raining']], ['Snow', ['snowy', 'snowing']], ['Clear', ['clear sky', 'clear skies']],
      ['Storm', ['stormy', 'stormy weather']], ['Sunny', ['sunny skies']], ['Cloudy', ['clouds', 'cloudy skies']],
      ['Wind', ['windy', 'breezy']], ['Thunderstorm', ['thunder storm']], 'Sunshine', 'Hail', 'Fog', 'Sleet',
      'Drizzle', 'Heatwave', 'Blizzard', 'Drought', 'Overcast', 'Showers', 'Downpour', 'Mist', 'Humid weather',
      'Thunder', 'Lightning', 'Frost', 'Haze', 'Rainbow', 'Snowstorm', 'Hailstorm',
    ],
    schooler: [
      'Hurricane', 'Tornado', 'Monsoon', 'Cyclone', 'Freezing rain', 'Dust storm', 'Ice storm', 'Sandstorm', 'Heat lightning', 'Graupel', 'Gale', 'Squall', 'Windstorm', 'Rainstorm', 'Freezing fog', 'Thick fog',
      'Typhoon', 'Tropical storm', 'Tropical depression', 'Nor’easter', 'Lake-effect snow', 'Sea fog', 'Radiation fog', 'Advection fog', 'Smog', 'Dust devil',
      'Funnel cloud', 'Wall cloud', 'Shelf cloud', 'Mammatus', 'Chinook wind', 'Foehn wind', 'Mistral', 'Sirocco', 'Bora', 'Harmattan', 'Trade winds', 'Cold snap',
      'Cold wave', 'Indian summer', 'Halo', 'Sun pillar', 'Microburst',
    ],
    rare: [
      'Virga', 'Thundersnow', 'Derecho', 'Waterspout', 'Whiteout', 'Rime ice', 'Ball lightning', 'Haboob', 'Sundog',
      'Ice pellets', 'Black ice', 'Freezing drizzle', 'Supercell', 'Mesocyclone', 'Roll cloud', 'Santa Ana winds', 'Fogbow', 'Glory', 'Corona',
      'Light pillar', 'Noctilucent clouds', 'Dust haze', 'Snow flurries', 'Gustnado',
    ],
    deepcut: ['Frost flower', 'St. Elmo’s fire', 'Sprites', 'Brocken spectre', 'Snow roller', 'Nacreous clouds', 'Polar stratospheric clouds', 'Fallstreak hole', 'Asperitas', 'Bishop’s ring'],
    krillion: ['Diamond dust'],
  }),
  q('p27', 'Name a language', {
    plankton: [
      'English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Chinese', 'Arabic', 'Russian', 'Portuguese', 'Hindi', 'Korean',
      'Latin', 'Mandarin', 'Cantonese', 'Tagalog',
    ],
    schooler: [
      'Swahili', 'Turkish', 'Greek', 'Dutch', 'Polish', 'Thai', 'Vietnamese', 'Hebrew', 'Persian', 'Bengali', 'Ukrainian', 'Indonesian',
      'Sanskrit', 'Urdu', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Punjabi', 'Nepali', 'Sinhala', 'Burmese',
      'Khmer', 'Lao', 'Malay', 'Javanese', 'Sundanese', 'Cebuano', 'Maltese', 'Georgian', 'Armenian', 'Azerbaijani', 'Kazakh', 'Uzbek',
      'Mongolian', 'Tibetan', 'Zulu', 'Xhosa', 'Afrikaans', 'Somali', 'Hausa', 'Igbo', 'Kurdish', 'Pashto', 'Yiddish', 'Romani',
      'Irish', 'Scottish Gaelic', 'Breton', 'Cornish', 'Manx', 'Esperanto', 'Catalan', 'Galician', 'Occitan', 'Sardinian', 'Sicilian',
      'Neapolitan', 'Romansh', 'Friulian', 'Luxembourgish', 'Frisian', 'Scots', 'Haitian Creole', 'Tok Pisin', 'Aymara', 'Guaraní',
      'Nahuatl', 'Greenlandic', 'Navajo', 'Cree', 'Lingala', 'Malagasy', 'Shona', 'Chichewa', 'Kinyarwanda', 'Luganda', 'Oromo', 'Tigrinya',
      'Wolof', 'Bambara', 'Fula', 'Sotho', 'Tswana', 'Tsonga', 'Kirundi', 'Papiamento',
    ],
    rare: [
      'Basque', 'Welsh', 'Quechua', 'Māori', 'Icelandic', 'Yoruba', 'Amharic', 'Cherokee',
      'Aramaic', 'Pali', 'Coptic', 'Rusyn', 'Sorbian', 'Kashubian', 'Silesian', 'Ulster Scots', 'Bislama', 'Chamorro', 'Rapanui', 'Mapudungun',
    ],
    deepcut: ['Ainu', 'Ladino', 'Klingon', 'Inuktitut', 'Lojban', 'Volapük', 'Dothraki', 'High Valyrian'],
    krillion: ['Ainu'],
  }),
  q('p28', 'Name a mode of transport', {
    plankton: [
      'Car', 'Bus', 'Train', 'Bicycle', 'Airplane', 'Boat', 'Ship', 'Motorcycle', 'Taxi', 'Tram', 'Ferry', 'Truck',
      'Van', 'Scooter', 'Moped', 'Coach', 'Trolleybus', 'Metro', 'Elevator', 'Rocket', 'Submarine', 'Yacht', 'Speedboat',
    ],
    schooler: [
      'Subway', 'Monorail', 'Cable car', 'Hot-air balloon', 'Helicopter', 'Canoe', 'Kayak', 'Rickshaw', 'Sailboat', 'Gondola',
      'Pickup truck', 'Lorry', 'Minibus', 'Light rail', 'High-speed train', 'Bullet train', 'Freight train', 'Steam train', 'Chairlift', 'Aerial tramway',
      'Catamaran', 'Rowboat', 'Dinghy', 'Barge', 'Canal boat', 'Narrowboat', 'Tanker', 'Container ship', 'Tugboat', 'Fishing boat', 'Jet ski', 'Pedalo',
      'Paddleboard', 'Glider', 'Seaplane', 'Private jet', 'Jumbo jet', 'Airship', 'Blimp', 'Drone', 'Spacecraft', 'Space shuttle', 'Ambulance', 'Fire engine',
      'Police car', 'Skateboard', 'Roller skates', 'Inline skates', 'E-bike', 'Tandem bicycle', 'Tricycle', 'Unicycle', 'Cargo bike', 'Mountain bike', 'Horse and cart', 'Carriage',
    ],
    rare: [
      'Funicular', 'Tuk-tuk', 'Snowmobile', 'Hovercraft', 'Zeppelin', 'Segway', 'Dog sled',
      'Rack railway', 'Escalator', 'Moving walkway', 'Hoverboard', 'Punt', 'Raft', 'Trimaran', 'Skiff', 'Stagecoach', 'Wagon', 'Jetpack', 'Hydrofoil',
      'Gyrocopter', 'Amphibious bus', 'Landau', 'Hansom cab', 'Sedan chair', 'Palanquin', 'Dogcart', 'Conestoga wagon', 'Ekranoplan',
    ],
    deepcut: ['Velocipede', 'Coracle', 'Wuppertal Schwebebahn', 'Penny-farthing', 'Jinrikisha', 'Aerotrain', 'Hoverbike', 'Autogyro'],
    krillion: ['Coracle'],
  }),
  q('p29', 'Name a breakfast food', {
    plankton: [
      'Pancakes', 'Waffles', 'Cereal', 'Oatmeal', 'Toast', 'Eggs', 'Bacon', 'Sausage', 'Yogurt', 'Bagel', 'Hash browns', 'French toast',
      'Scrambled eggs', 'Fried eggs', 'Poached eggs', 'Scone', 'Cinnamon roll', 'Doughnut', 'Muesli', 'Cornflakes', 'Crumpet',
    ],
    schooler: [
      'Porridge', 'Granola', 'Omelette', 'Avocado toast', 'Breakfast burrito', 'Muffin', 'Croissant', 'Congee', 'Eggs Benedict', 'Kippers',
      'Biscuits and gravy', 'Corned beef hash', 'Breakfast sandwich', 'Bacon roll', 'English muffin', 'Pain au chocolat', 'Danish pastry', 'Cinnamon toast',
      'Crepe', 'Blinis', 'Full English breakfast', 'Ulster fry', 'Irish breakfast', 'Overnight oats', 'Bircher muesli', 'Yogurt parfait', 'Banana bread',
      'Frittata', 'Huevos rancheros', 'Chilaquiles', 'Breakfast taco', 'Black pudding', 'White pudding', 'Soda bread', 'Oatcakes', 'Grits', 'Biscuit',
      'Beignet', 'Youtiao', 'Nasi lemak', 'Kaya toast', 'Idli', 'Dosa', 'Upma', 'Poha', 'Ful medames', 'Börek', 'Simit', 'Tamagoyaki', 'Onigiri', 'Natto', 'Takoyaki',
    ],
    rare: [
      'Shakshuka', 'Kedgeree', 'Menemen', 'Arepa de huevo', 'Dutch baby', 'Okonomiyaki',
      'Eggs Florentine', 'Eggs Royale', 'Bubble and squeak', 'Tattie scone', 'Haggis', 'Fried bread', 'Devilled kidneys', 'Arbroath smokie',
      'Pancetta and egg roll', 'Breakfast pizza', 'Chorizo hash', 'Rösti with egg', 'Huevos motuleños', 'Molletes', 'Tamal', 'Pandesal', 'Arroz caldo',
    ],
    deepcut: ['Welsh rarebit', 'Puttu', 'Appam', 'Vada', 'Kokonte', 'Labneh with za’atar', 'Smoked haddock with poached egg'],
    krillion: ['Kedgeree'],
  }),
  q('p30', 'Name a dessert', {
    plankton: [
      'Cake', 'Ice cream', 'Brownie', 'Cookie', 'Pie', 'Donut', 'Pudding', 'Cheesecake', 'Apple crumble', 'Cupcake', 'Chocolate mousse', 'Sundae',
      'Chocolate cake', 'Custard', 'Jelly', 'Fudge', 'Macaron', 'Lemon meringue pie', 'Carrot cake', 'Victoria sponge', 'Flapjack',
    ],
    schooler: [
      'Tiramisu', 'Crème brûlée', 'Baklava', 'Pavlova', 'Churros', 'Éclair', 'Cannoli', 'Sticky toffee pudding', 'Trifle', 'Gelato',
      'Key lime pie', 'Pecan pie', 'Pumpkin pie', 'Apple pie', 'Cherry pie', 'Banoffee pie', 'Treacle tart', 'Bakewell tart', 'Eton mess', 'Knickerbocker glory',
      'Rice pudding', 'Tapioca pudding', 'Bread and butter pudding', 'Summer pudding', 'Millionaire’s shortbread', 'Blondie', 'Swiss roll', 'Profiteroles',
      'Panna cotta', 'Semifreddo', 'Affogato', 'Cassata', 'Zabaglione', 'Sfogliatella', 'Babka', 'Strudel', 'Linzer torte', 'Black Forest gateau', 'Daifuku',
      'Dorayaki', 'Mango sticky rice', 'Halo-halo', 'Leche flan', 'Flan', 'Crème caramel', 'Tarte Tatin', 'Mille-feuille', 'Madeleine', 'Canelé', 'Halva',
      'Gulab jamun', 'Jalebi', 'Ras malai', 'Kheer', 'Ladoo', 'Barfi', 'Alfajores', 'Brigadeiro', 'Lamington', 'Golden syrup dumplings',
    ],
    rare: [
      'Knafeh', 'Kulfi', 'Sachertorte', 'Tres leches cake', 'Mochi', 'Basbousa', 'Baked Alaska', 'Clafoutis',
      'Mont blanc', 'Opera cake', 'Paris-Brest', 'Île flottante', 'Pot de crème', 'Beijinho', 'Buñuelo', 'Anzac biscuit', 'Fairy bread', 'Atholl brose',
      'Germknödel', 'Palatschinke', 'Bingsu', 'Gajar halwa', 'Rasgulla', 'Sandesh', 'Kouign-amann', 'Semla', 'Loukoumades', 'Galaktoboureko',
    ],
    deepcut: [
      'Spotted dick', 'Kaiserschmarrn', 'Cranachan', 'Battenberg cake', 'Ma’amoul', 'Tarta de Santiago', 'Pastéis de nata', 'Rum baba', 'Merveilleux', 'Pithiviers',
    ],
    krillion: ['Cranachan'],
  }),
  q('p31', 'Name a soup', {
    plankton: [
      'Tomato soup', 'Chicken soup', 'Minestrone', 'Mushroom soup', 'Noodle soup', 'Lentil soup', 'Pea soup', 'Pumpkin soup', 'French onion soup', 'Clam chowder',
      'Vegetable soup', 'Wonton soup', 'Egg drop soup', 'Hot and sour soup', 'Corn chowder', 'Broccoli soup', 'Carrot soup', 'Beef soup',
    ],
    schooler: [
      'Borscht', 'Gazpacho', 'Miso soup', 'Pho', 'Ramen', 'Gumbo', 'Consommé', 'Tom yum', 'Sopa de lima', 'Avgolemono',
      'Scotch broth', 'Cock-a-leekie', 'Oxtail soup', 'Bouillon', 'Chicken broth', 'Manhattan clam chowder', 'New England clam chowder', 'Bisque',
      'Lobster bisque', 'Bouillabaisse', 'Sopa de tortilla', 'Pozole', 'Black bean soup', 'Pasta e fagioli', 'Ribollita', 'Stracciatella soup',
      'Italian wedding soup', 'Tom kha gai', 'Udon soup', 'Soba soup', 'Dashi', 'Solyanka', 'Shchi', 'Okroshka', 'Ukha', 'Rassolnik', 'Chorba',
      'Mulligatawny', 'Rasam', 'Sambar', 'Soto ayam', 'Sinigang', 'Arroz caldo', 'Sweetcorn soup', 'Ham and bean soup', 'Bird’s nest soup',
      'Butternut squash soup', 'Leek and potato soup', 'Broccoli and stilton soup', 'Carrot and coriander soup',
    ],
    rare: [
      'Cullen skink', 'Salmorejo', 'Harira', 'Laksa', 'Caldo verde', 'Żurek', 'Ajiaco',
      'Cioppino', 'Sancocho', 'Locro', 'Chupe', 'Cazuela', 'Callaloo soup', 'Pepper pot', 'Sopa de mondongo', 'Bulalo', 'Batchoy', 'Rawon',
      'Sayur asem', 'Doenjang-guk', 'Kimchi jjigae', 'Sundubu-jjigae', 'Seolleongtang', 'Lablabi', 'Molokhia',
    ],
    deepcut: ['Waterzooi', 'Vichyssoise', 'Bouneschlupp', 'Krupnik', 'Sopa de ajo', 'Cacciucco', 'Olla podrida', 'Cawl', 'Lobscouse', 'Garbure'],
    krillion: ['Waterzooi'],
  }),
  q('p32', 'Name a type of cheese', {
    plankton: [
      'Cheddar', 'Mozzarella', 'Brie', 'Feta', 'Parmesan', 'Gouda', 'Swiss cheese', 'Cream cheese', 'Blue cheese', 'Cottage cheese',
      'Havarti', 'Jarlsberg', 'Emmental', 'Colby', 'American cheese', 'Pepper Jack', 'Red Leicester', 'Paneer',
    ],
    schooler: [
      'Camembert', 'Gruyère', 'Roquefort', 'Provolone', 'Manchego', 'Halloumi', 'Ricotta', 'Pecorino', 'Monterey Jack', 'Edam',
      'Comté', 'Beaufort', 'Reblochon', 'Munster', 'Appenzeller', 'Raclette', 'Cantal', 'Bleu d’Auvergne', 'Gorgonzola', 'Grana Padano',
      'Asiago', 'Fontina', 'Burrata', 'Scamorza', 'Caciocavallo', 'Kashkaval', 'Bryndza', 'Quark', 'Fromage frais', 'Neufchâtel', 'Coulommiers',
      'Pont-l’Évêque', 'Livarot', 'Sainte-Maure', 'Double Gloucester', 'Cheshire', 'Lancashire', 'Wensleydale', 'Caerphilly', 'Mascarpone', 'Boursin',
      'Cotija', 'Queso fresco', 'Idiazabal', 'Tetilla', 'Cabrales', 'Leerdammer', 'Muenster', 'Danish blue',
    ],
    rare: [
      'Mimolette', 'Stilton', 'Taleggio', 'Époisses', 'Ossau-Iraty', 'Crottin de Chavignol', 'Mahon',
      'Tilsit', 'Limburger', 'Fourme d’Ambert', 'Parmigiano Reggiano', 'Pecorino Romano', 'Ricotta salata', 'Kefalotyri', 'Manouri', 'Oscypek',
      'Chaource', 'Valençay', 'Rocamadour', 'Abondance', 'Stinking Bishop', 'Cornish Yarg', 'Sage Derby', 'Ashdown Foresters', 'Tunworth',
      'Wigmore', 'Colston Bassett', 'Stichelton', 'Blue Vinny', 'Zamorano', 'Maasdam', 'Rookkaas', 'Petit-suisse', 'Tomme de Savoie', 'Banon',
    ],
    deepcut: ['Casu marzu', 'Vacherin Mont d’Or', 'Pule', 'Metsovone', 'Serra da Estrela', 'Nabulsi', 'Shanklish', 'Ackawi', 'Queso Oaxaca', 'Bitto'],
    krillion: ['Pule'],
  }),
  q('p33', 'Name a body part', {
    plankton: [
      'Head', 'Arm', 'Leg', 'Hand', 'Foot', 'Eye', 'Ear', 'Nose', 'Mouth', 'Heart', 'Brain', 'Knee', 'Shoulder', 'Finger', ['Shoulder blade', ['scapula']],
      'Neck', 'Chest', 'Back', 'Hip', 'Thigh', 'Toe', 'Thumb', ['Jaw', ['jawbone']], 'Skin', 'Rib',
    ],
    schooler: [
      'Ankle', 'Wrist', 'Elbow', 'Liver', 'Lung', 'Kidney', 'Pancreas', 'Spleen', ['Collarbone', ['clavicle']], 'Achilles tendon',
      'Forearm', 'Bicep', 'Tricep', 'Shin', 'Calf', 'Heel', 'Palm', 'Chin', 'Cheek', 'Forehead', 'Eyebrow', 'Eyelash', 'Eyelid',
      'Abdomen', 'Waist', 'Buttock', 'Armpit', 'Navel', 'Stomach', 'Intestine', 'Colon', 'Gallbladder', 'Bladder', 'Thyroid',
      'Pituitary gland', 'Thymus', 'Esophagus', 'Trachea', 'Aorta', 'Spine', 'Pelvis', 'Sternum', 'Ribcage', 'Knuckle',
      'Fingernail', 'Tooth', 'Tongue', 'Lip', 'Gum', 'Vocal cord', 'Adam’s apple', 'Blood vessel',
    ],
    rare: [
      'Uvula', 'Patella', ['Coccyx', ['tailbone']], 'Meniscus', 'Diaphragm', 'Phalanx',
      'Appendix', 'Tonsil', 'Cerebellum', 'Brainstem', 'Hypothalamus', 'Adrenal gland', 'Pineal gland', 'Parathyroid',
      'Fallopian tube', 'Prostate', 'Ovary', 'Testicle', 'Uterus', 'Cervix', 'Cornea', 'Retina', 'Iris', 'Cochlea', 'Eardrum',
      'Olfactory bulb', 'Hippocampus', 'Amygdala', 'Medulla oblongata', 'Thalamus', 'Carotid artery', 'Jugular vein',
      'Trapezius', 'Deltoid', 'Pectoral muscle', 'Latissimus dorsi', 'Quadriceps', 'Hamstring', 'Sartorius', 'Gluteus maximus',
    ],
    deepcut: ['Stapes', 'Hyoid bone', 'Philtrum', 'Vomer', 'Malleus', 'Incus', 'Ethmoid', 'Sphenoid', 'Sesamoid bone'],
    krillion: ['Stapes'],
  }),
  q('p34', 'Name a common household tool', {
    plankton: [
      'Hammer', 'Screwdriver', 'Wrench', 'Pliers', 'Saw', 'Drill', 'Tape measure', 'Level', 'Scissors', 'Utility knife', 'Ladder', 'Flashlight',
      'Mallet', 'Sledgehammer', 'Ruler', 'Glue gun', 'Soldering iron', 'Pipe wrench', 'Adjustable spanner', 'Pickaxe', 'Shovel', 'Trowel', 'Wheelbarrow', 'Plunger', 'Clamp',
    ],
    schooler: [
      'Allen key', 'Hacksaw', 'Socket wrench', 'Chisel', 'Stud finder', 'Caulking gun', 'Wire strippers', 'Crowbar',
      'Nail gun', 'Staple gun', 'File', 'Hand plane', 'Hand drill', 'Impact driver', 'Angle grinder', 'Circular saw', 'Jigsaw', 'Reciprocating saw',
      'Miter saw', 'Pruning saw', 'Wire cutters', 'Pincers', 'Torque wrench', 'Strap wrench', 'Monkey wrench', 'Ratchet', 'Crimping tool',
      'Laser level', 'Chalk line', 'Plumb bob', 'Putty knife', 'Bench vice', 'Spade', 'Hoe', 'Rake', 'Garden fork', 'Secateurs', 'Loppers',
      'Shears', 'Mop', 'Broom', 'Dustpan', 'Toolbox',
    ],
    rare: [
      'Coping saw', 'Ratcheting spanner', 'Awl', 'Bradawl', 'Basin wrench', 'Multimeter',
      'Bow saw', 'Keyhole saw', 'Ball-peen hammer', 'Claw hammer', 'Tack hammer', 'Gouge', 'Rasp', 'Rotary tool', 'Voltage tester',
      'Nut driver', 'Moisture meter', 'Try square', 'Sawhorse', 'Workbench', 'Auger', 'Drain snake', 'Wallpaper scraper', 'C-clamp', 'Screw clamp',
    ],
    deepcut: ['Shingle froe', 'Brace and bit', 'Spokeshave', 'Drawknife', 'Adze', 'Froe', 'Yankee screwdriver', 'Slick'],
    krillion: ['Spokeshave'],
  }),
  q('p35', 'Name a kitchen appliance', {
    plankton: [
      'Refrigerator', 'Oven', 'Microwave', 'Toaster', 'Blender', 'Dishwasher', 'Kettle', 'Coffee maker', 'Freezer', 'Rice cooker',
      'Coffee grinder', 'Juicer', 'Sandwich maker', 'Toaster oven', 'Deep fryer', 'Food mixer', 'Ice maker', 'Wine fridge', 'Espresso machine', 'Griddle',
    ],
    schooler: [
      'Air fryer', 'Slow cooker', 'Food processor', 'Stand mixer', 'Pressure cooker', 'Waffle iron', 'Bread maker', 'Induction hob',
      'Immersion blender', 'Hand mixer', 'Citrus juicer', 'Smoothie maker', 'Ice cream maker', 'Panini press', 'Convection oven', 'Multi-cooker',
      'Steamer', 'Egg cooker', 'Meat grinder', 'Range hood', 'Gas hob', 'Hot plate', 'Chip pan', 'Milk frother', 'Vacuum sealer', 'Warming drawer',
      'Rotisserie', 'Pizza oven', 'Crepe maker', 'Popcorn maker', 'Quesadilla maker', 'Raclette grill', 'Fondue set', 'Electric grill', 'Coffee percolator',
      'Hot water dispenser', 'Baby bottle sterilizer', 'Deli slicer', 'Ice shaver',
    ],
    rare: [
      'Sous-vide cooker', 'Dehydrator', 'Pasta machine', 'Soda maker', 'Yogurt maker',
      'Garbage disposal', 'Electric wok', 'Electric smoker', 'Coffee roaster', 'Dough mixer', 'Slush machine', 'Hot dog roller',
    ],
    deepcut: ['Salamander broiler', 'Combi oven', 'Blast chiller', 'Rotary evaporator', 'Sous-vide bath'],
    krillion: ['Salamander broiler'],
  }),
  q('p36', 'Name a fictional superhero', {
    plankton: [
      'Superman', 'Batman', 'Wonder Woman', 'Spider-Man', 'Iron Man', 'Thor', 'Hulk', 'Captain America', 'Black Panther', 'The Flash', 'Aquaman', 'Wolverine',
      'Robin', 'Supergirl', 'Batgirl', 'Green Arrow', 'Deadpool', 'Scarlet Witch', 'Vision', 'Shazam',
    ],
    schooler: [
      'Daredevil', 'Green Lantern', 'Storm', 'Captain Marvel', 'Black Widow', 'Ant-Man', 'Hawkeye', 'Cyclops', 'Nightcrawler', 'Doctor Strange',
      'Plastic Man', 'Hawkman', 'Martian Manhunter', 'Zatanna', 'Doctor Fate', 'Quicksilver', 'War Machine', 'Falcon', 'Winter Soldier', 'Star-Lord',
      'Gamora', 'Rocket Raccoon', 'Groot', 'Drax', 'Nebula', 'Mantis', 'She-Hulk', 'Ms. Marvel', 'Valkyrie', 'Okoye', 'Shuri', 'Wasp',
      'Starfire', 'Raven', 'Cyborg', 'Beast Boy', 'Mera', 'Superboy', 'Kid Flash', 'Silver Surfer', 'Namor', 'Human Torch', 'Invisible Woman', 'The Thing', 'Mr. Fantastic',
    ],
    rare: [
      'Moon Knight', 'Blue Beetle', 'Squirrel Girl', 'Booster Gold', 'The Question', 'Swamp Thing', 'Ragman',
      'Dazzler', 'Forge', 'Magik', 'Domino', 'Cable', 'Bishop', 'Sunspot', 'Cannonball', 'Polaris', 'Banshee', 'Jubilee', 'Psylocke', 'Colossus',
      'Iceman', 'Beast', 'Rogue', 'Gambit', 'Jean Grey', 'Professor X', 'Mister Miracle', 'Big Barda', 'Orion', 'Donna Troy', 'Wally West', 'Kyle Rayner',
      'Guy Gardner', 'John Stewart', 'Jessica Cruz',
    ],
    deepcut: ['Doorman', 'Elsa Bloodstone', 'Man-Thing', 'Arm Fall Off Boy', 'Matter-Eater Lad', 'Bouncing Boy', 'Stone Boy', 'Color Kid', 'Invisible Kid', 'Ferro Lad'],
    krillion: ['Mister Immortal'],
  }),
  q('p37', 'Name a mythological creature', {
    plankton: [
      'Dragon', 'Unicorn', 'Mermaid', 'Centaur', 'Phoenix', 'Minotaur', 'Griffin', 'Cyclops', 'Sphinx', 'Hydra', 'Kraken', 'Werewolf',
      'Goblin', 'Troll', 'Ogre', 'Fairy', 'Vampire', 'Leprechaun', 'Satyr', 'Nymph', 'Medusa', 'Djinn', 'Bigfoot', 'Kitsune',
    ],
    schooler: [
      'Basilisk', 'Chimera', 'Pegasus', 'Cerberus', 'Gorgon', 'Harpy', 'Siren', 'Golem', 'Banshee', 'Yeti',
      'Gnome', 'Pixie', 'Imp', 'Ghoul', 'Incubus', 'Succubus', 'Brownie', 'Boggart', 'Hobgoblin', 'Selkie', 'Naga', 'Garuda', 'Rakshasa',
      'Tengu', 'Oni', 'Jörmungandr', 'Fenrir', 'Sleipnir', 'Valkyrie', 'Jotunn', 'Cockatrice', 'Wyvern', 'Hippogriff', 'Thunderbird',
      'Chupacabra', 'Sasquatch', 'Mothman', 'Jersey Devil', 'Jackalope', 'Roc', 'Ifrit', 'Faun', 'Dryad', 'Naiad', 'Scylla', 'Talos',
      'Rusalka', 'Baba Yaga', 'Aswang', 'Manananggal', 'Dullahan', 'Pooka', 'Barghest',
    ],
    rare: [
      'Kappa', 'Baku', 'Nuckelavee', 'Kelpie', 'Wendigo', 'Domovoi', 'Qilin', 'Manticore',
      'Alkonost', 'Sirin', 'Zmey', 'Draugr', 'Hulder', 'Nisse', 'Black Shuck', 'Catoblepas', 'Lindworm', 'Peryton', 'Leucrota', 'Yale',
      'Bonnacon', 'Bakunawa', 'Tikbalang', 'Penanggalan', 'Toyol', 'Nue', 'Kirin', 'Adze', 'Impundulu', 'Tokoloshe', 'Eloko', 'Anzu', 'Lamassu',
    ],
    deepcut: [
      'Amphisbaena', 'Ahuizotl', 'Each-uisge', 'Taniwha', 'Vegetable lamb', 'Crocotta', 'Aspidochelone', 'Peluda', 'Questing Beast', 'Bunyip', 'Hodag', 'Snallygaster',
    ],
    krillion: ['Nuckelavee'],
  }),
  q('p38', 'Name a play written by William Shakespeare', {
    plankton: ['Hamlet', 'Macbeth', 'Romeo and Juliet', ['Romeo & Juliet', ['Romeo Juliet']], 'Othello', 'King Lear', 'A Midsummer Night’s Dream', 'The Tempest', 'Julius Caesar', 'Twelfth Night'],
    schooler: ['Much Ado About Nothing', 'The Merchant of Venice', 'Richard III', 'The Taming of the Shrew', 'As You Like It', 'The Winter’s Tale', 'Antony and Cleopatra', 'Henry V', 'Richard II', 'The Comedy of Errors', 'The Merry Wives of Windsor', 'Measure for Measure', 'All’s Well That Ends Well', 'The Two Gentlemen of Verona'],
    rare: ['Cymbeline', 'Timon of Athens', 'Pericles, Prince of Tyre', 'Love’s Labour’s Lost', 'Coriolanus', 'Titus Andronicus', 'Troilus and Cressida', 'Henry IV, Part 1', 'Henry IV, Part 2', 'Henry VI, Part 1', 'Henry VI, Part 2', 'Henry VI, Part 3'],
    deepcut: ['The Two Noble Kinsmen', 'King John', 'Henry VIII', 'Edward III', 'Sir Thomas More'],
    krillion: ['Timon of Athens'],
  }),
  q('p39', 'Name a video game console', {
    plankton: [
      'PlayStation', 'Xbox', 'Nintendo Switch', 'Wii', 'Nintendo 64', 'Game Boy', 'PlayStation 2', 'Nintendo DS', 'Super Nintendo', 'Sega Genesis',
      'PlayStation 3', 'PlayStation 4', 'PlayStation 5', 'Xbox One', 'Wii U', 'Nintendo Entertainment System', 'Game Boy Advance', 'Sega Master System', 'Steam Deck', 'N-Gage',
    ],
    schooler: [
      'Atari 2600', 'Dreamcast', 'GameCube', 'PlayStation Portable', 'PlayStation Vita', 'Xbox 360', 'Nintendo 3DS', 'TurboGrafx-16',
      'Xbox Series X', 'Game Boy Color', 'Super Famicom', 'Famicom', 'Sega Game Gear', 'Atari 5200', 'Atari 7800', 'Atari Lynx', 'Intellivision',
      'Odyssey 2', 'Magnavox Odyssey', 'Fairchild Channel F', '3DO', 'CD-i', 'Neo Geo Pocket', 'Playdate', 'Evercade', 'Analogue Pocket', 'Sega 32X', 'Sega CD',
    ],
    rare: [
      'Neo Geo', 'Sega Saturn', 'Atari Jaguar', 'Vectrex', 'WonderSwan', 'Ouya', 'ColecoVision',
      'PC Engine', 'TurboGrafx-CD', 'SuperGrafx', 'PC-FX', 'FM Towns Marty', 'XaviX', 'Leapster', 'V.Smile', 'Game.com', 'R-Zone', 'Nintendo Switch 2', 'Sega Nomad',
    ],
    deepcut: ['Bandai Pippin', 'Amiga CD32', 'Casio Loopy', 'Nintendo Virtual Boy', 'Bally Astrocade', 'Emerson Arcadia 2001', 'RCA Studio II', 'Casio PV-1000'],
    krillion: ['Casio Loopy'],
  }),
  q('p40', 'Name a country whose English name starts with B', {
    plankton: ['Brazil', 'Bahrain', 'Belgium', 'Bolivia', 'Bulgaria', 'Bahamas', 'Bangladesh', 'Barbados', 'Belarus', 'Belize', 'Benin'],
    schooler: ['Bhutan', 'Botswana', 'Burundi', 'Burkina Faso'],
    rare: ['Bosnia and Herzegovina'],
    krillion: ['Brunei'],
  }),
  q('p41', 'Name a pasta shape or type', {
    plankton: [
      'Spaghetti', 'Penne', 'Macaroni', 'Fusilli', 'Fettuccine', 'Linguine', 'Lasagna', 'Ravioli', 'Rigatoni', 'Tagliatelle', 'Orzo', 'Rotini',
      'Vermicelli', 'Capellini', 'Ziti', 'Paccheri', 'Mafaldine', 'Tortelli', 'Agnolotti', 'Cappelletti', 'Calamarata',
    ],
    schooler: [
      'Pappardelle', 'Orecchiette', 'Tortellini', 'Cavatappi', 'Bucatini', 'Farfalle', 'Gnocchi', 'Conchiglie', 'Cannelloni', 'Ditalini',
      'Mezze maniche', 'Tortiglioni', 'Lumache', 'Pipe rigate', 'Stelline', 'Acini di pepe', 'Fregola', 'Fideo', 'Spaghettini', 'Cellentani',
      'Cencioni', 'Sagnarelli', 'Farfalline', 'Puntalette', 'Hilopites', 'Spätzle', 'Trahana', 'Kritharaki', 'Ditali', 'Tubetti',
    ],
    rare: [
      'Strozzapreti', 'Malloreddus', 'Culurgiones', 'Trofie', 'Cavatelli', 'Radiatori', 'Gemelli', 'Casarecce',
      'Spaghetti alla chitarra', 'Bavette', 'Testaroli', 'Lagane', 'Fagottini', 'Sacchetti', 'Panzerotti', 'Canneroni', 'Dischi volanti',
    ],
    deepcut: ['Sagne ’ncannulate', 'Lorighittas', 'Pici', 'Busiate', 'Filindeu', 'Corallini', 'Anellini', 'Quadrettini'],
    krillion: ['Lorighittas'],
  }),
  q('p42', 'Name a pizza topping', {
    plankton: [
      'Pepperoni', 'Mushrooms', 'Onions', 'Sausage', 'Olives', 'Peppers', 'Bacon', 'Ham', 'Pineapple', 'Extra cheese', 'Tomatoes', 'Basil',
      'Red onion', 'Cherry tomatoes', 'Sweetcorn', 'Garlic', 'Pesto', 'Salami', 'Chorizo', 'Egg', 'Pear',
    ],
    schooler: [
      'Anchovies', 'Spinach', 'Artichoke hearts', 'Jalapeños', 'Chicken', 'Feta', 'Prosciutto', 'Sun-dried tomatoes', 'Meatballs',
      'Pepperoncini', 'Banana peppers', 'Green peppers', 'Kalamata olives', 'Ricotta', 'Goat cheese', 'Burrata', 'Buffalo mozzarella', 'Fontina',
      'Pecorino', 'Hot honey', 'Hot sauce', 'Chilli flakes', 'Oregano', 'Roasted garlic', 'Leek', 'Zucchini', 'Eggplant', 'Broccoli', 'Arugula',
      'Asparagus', 'Corn', 'Butternut squash', 'Pumpkin', 'Sardines', 'Tuna', 'Smoked salmon', 'Shrimp', 'Prawns', 'Calamari', 'Mortadella',
      'Bresaola', 'Pancetta', 'Guanciale', 'Fig', 'Peach', 'Pistachio', 'Walnuts',
    ],
    rare: [
      'Capers', 'Gorgonzola', 'Truffle oil', 'Calabrian chili', 'Nduja', 'Potato', 'Radicchio',
      'Clams', 'Mussels', 'Octopus', 'Speck', 'Beef', 'Cranberry', 'Grape', 'Hazelnuts', 'Pumpkin seeds', 'Sesame seeds', 'Truffle',
      'Cheddar', 'Mascarpone', 'Kale', 'Cauliflower', 'Peas', 'Apple', 'Preserved lemon', 'Harissa',
    ],
    deepcut: ['Bottarga', 'Stracciatella', 'Nettle', 'Zucchini blossom', 'Squash blossom', 'Fiddlehead ferns'],
    krillion: ['Bottarga'],
  }),
  q('p43', 'Name a phone manufacturer', {
    plankton: [
      'Samsung', 'Apple', 'Huawei', 'Xiaomi', 'Nokia', 'Motorola', 'Sony', 'LG', 'Google', 'OnePlus', 'HTC', 'BlackBerry',
      'Oppo', 'Vivo', 'Honor', 'Asus', 'Lenovo', 'Realme',
    ],
    schooler: [
      'ZTE', 'TCL', 'Alcatel', 'Meizu', 'Nothing', 'Fairphone', 'Sharp', 'Panasonic', 'Kyocera', 'Tecno', 'Infinix', 'Itel', 'Redmi', 'Poco',
      'Nubia', 'Gionee', 'Coolpad', 'Micromax', 'Wiko', 'Blackview', 'Oukitel', 'Doogee', 'Umidigi', 'Cubot', 'AGM', 'Unihertz', 'Doro', 'Crosscall',
      'CAT', 'Gigaset', 'Vertu', 'Razer', 'Essential', 'Jolla', 'Siemens', 'Ericsson', 'Philips', 'Sanyo', 'Fujitsu', 'NEC', 'Acer', 'Casio',
      'Lava', 'BLU', 'Archos', 'Medion', 'Vestel',
    ],
    rare: [
      'Emporia', 'Hammer', 'BQ', 'LeEco', 'iQOO', 'Zopo', 'Ulefone', 'Hotwav', 'Karbonn', 'Spice', 'Intex', 'iBall', 'Celkon', 'Plum', 'Yezz',
      'Punkt', 'Purism', 'Pine64', 'Teracube', 'Shiftphone', 'Volla', 'Murena', 'Bosch', 'Grundig', 'Telefunken', 'Thomson',
    ],
    deepcut: ['Verykool', 'Wickedleak', 'Onida', 'Sansui', 'Kechaoda', 'Jio', 'Bittium'],
    krillion: ['Bittium'],
  }),
  q('p44', 'Name a technology company', {
    plankton: [
      'Apple', 'Microsoft', 'Google', 'Amazon', 'Meta', 'Samsung', 'Intel', 'IBM', 'Sony', 'Nvidia', 'Cisco', 'Oracle', 'Adobe', 'Dell', 'HP',
    ],
    schooler: [
      'AMD', 'Qualcomm', 'Broadcom', 'TSMC', 'ASML', 'Texas Instruments', 'Micron', 'Western Digital', 'Seagate', 'Lenovo', 'Asus', 'Acer',
      'Toshiba', 'Panasonic', 'LG', 'Philips', 'Nokia', 'Ericsson', 'Motorola', 'Huawei', 'Xiaomi', 'Alibaba', 'Tencent', 'Baidu', 'ByteDance',
      'JD.com', 'ZTE', 'Foxconn', 'Red Hat', 'VMware', 'Salesforce', 'SAP', 'ServiceNow', 'Workday', 'Atlassian', 'JetBrains', 'GitHub', 'GitLab',
      'MongoDB', 'Snowflake', 'Databricks', 'Palantir', 'Cloudflare', 'Akamai', 'DigitalOcean', 'Vercel', 'Netlify', 'Stripe', 'Block', 'PayPal',
      'Shopify', 'eBay', 'Uber', 'Airbnb', 'Spotify', 'Netflix', 'Twitter', 'Snap', 'Pinterest', 'Dropbox', 'Zoom', 'OpenAI', 'Anthropic', 'DeepMind',
      'Hugging Face', 'Valve', 'Epic Games', 'Activision Blizzard', 'Electronic Arts', 'Ubisoft', 'Rockstar Games', 'Nintendo', 'Square Enix', 'Sega',
      'DJI', 'Arm', 'MediaTek', 'Marvell', 'Analog Devices', 'Infineon', 'STMicroelectronics', 'NXP', 'Renesas', 'Microchip', 'SK Hynix', 'SMIC',
      'Pegatron', 'Flex', 'Canon', 'Nikon', 'Ricoh', 'Fujitsu', 'NEC', 'Hitachi', 'Sharp', 'Seiko Epson', 'NTT', 'Naver', 'Kakao', 'Yandex', 'Kaspersky',
      'Fortinet', 'Palo Alto Networks', 'CrowdStrike', 'Okta', 'Datadog', 'Splunk', 'Elastic', 'Twilio', 'Mailchimp', 'HubSpot', 'Zendesk', 'Box',
      'DocuSign', 'Intuit', 'Xero', 'Capgemini', 'Atos', 'Dassault Systèmes',
    ],
    rare: [
      'Lattice Semiconductor', 'Cerebras', 'Graphcore', 'Ampere Computing', 'Wistron', 'Jabil', 'Sanmina', 'Celestica',
      'Bandai Namco', 'Capcom', 'CD Projekt', 'Konami', 'Take-Two', 'Roblox', 'Unity', 'Autodesk', 'Bentley Systems', 'PTC',
      'Synopsys', 'Cadence', 'Ansys', 'Keysight', 'Teledyne', 'Zebra Technologies', 'Ciena', 'Juniper Networks', 'Arista Networks', 'F5', 'Citrix', 'HashiCorp',
    ],
    deepcut: ['Viasat', 'Iridium', 'Infinera', 'Lumentum', 'Coherent', 'GlobalFoundries', 'Tower Semiconductor', 'Skywater', 'Wolfspeed'],
    krillion: ['Tower Semiconductor'],
  }),
  q('p45', 'Name a programming language', {
    plankton: [
      'Python', 'Java', 'JavaScript', 'C', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TypeScript', 'SQL',
    ],
    schooler: [
      'Scratch', 'BASIC', 'Pascal', 'Fortran', 'COBOL', 'Lisp', 'Prolog', 'Haskell', 'Erlang', 'Elixir', 'Clojure', 'Scala', 'F#', 'OCaml', 'Scheme',
      'Julia', 'MATLAB', 'R', 'Perl', 'Lua', 'Dart', 'Objective-C', 'Assembly', 'Visual Basic', 'Delphi', 'Groovy', 'Bash', 'PowerShell', 'Awk', 'Tcl',
      'Smalltalk', 'Forth', 'Ada', 'D', 'Nim', 'Crystal', 'Zig', 'Solidity', 'Verilog', 'VHDL', 'Logo', 'Processing', 'ActionScript', 'CoffeeScript',
      'Elm', 'Hack', 'Haxe', 'Vala', 'ABAP', 'PL/SQL', 'T-SQL', 'LabVIEW', 'Mathematica', 'PostScript',
    ],
    rare: [
      'Racket', 'Mercury', 'Idris', 'Agda', 'Coq', 'Lean', 'Eiffel', 'Modula-2', 'Oberon', 'Simula', 'Algol', 'PL/I', 'Rexx', 'APL', 'J', 'Q',
      'BQN', 'Raku', 'MoonScript', 'Ballerina', 'Move', 'Vyper', 'Cairo', 'Odin', 'Gleam', 'PureScript', 'ReasonML', 'ReScript', 'Cython', 'MicroPython',
      'Icon', 'SNOBOL', 'TECO', 'Squeak',
    ],
    deepcut: ['Brainfuck', 'Befunge', 'INTERCAL', 'Whitespace', 'Malbolge', 'Piet', 'Chef', 'Shakespeare', 'LOLCODE', 'Cow', 'Ook!', 'JSFuck'],
    krillion: ['Malbolge'],
  }),
  q('p46', 'Name a web browser', {
    plankton: [
      'Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Internet Explorer', 'Brave', 'Vivaldi', 'Arc', 'Chromium', 'Tor Browser', 'DuckDuckGo Browser',
      'Samsung Internet', 'UC Browser', 'Yandex Browser',
    ],
    schooler: [
      'Netscape Navigator', 'NCSA Mosaic', 'Konqueror', 'Lynx', 'w3m', 'Links', 'Maxthon', 'SeaMonkey', 'Pale Moon', 'Waterfox', 'QQ Browser',
      '360 Secure Browser', 'Sogou Explorer', 'Naver Whale', 'Min', 'Falkon', 'Midori', 'GNOME Web', 'Epiphany', 'Camino', 'iCab', 'OmniWeb',
      'Shiira', 'Flock', 'Rockmelt', 'Avant Browser', 'SlimBrowser', 'Lunascape', 'Sleipnir', 'SRWare Iron', 'Comodo Dragon', 'Epic Privacy Browser',
      'Puffin', 'Dolphin', 'Aloha', 'Kiwi Browser', 'Bromite', 'Mull', 'LibreWolf', 'Floorp', 'Zen Browser', 'Ladybird', 'Beaker Browser', 'qutebrowser',
      'Nyxt', 'Amaya', 'Arachne', 'Dillo', 'NetSurf', 'surf', 'luakit', 'Browsh',
    ],
    rare: [
      'Cello', 'HotJava', 'AOL Explorer', 'Galeon', 'Iceweasel', 'GNU IceCat', 'Swiftfox', 'Stainless', 'Sunrise', 'Cyberdog', 'Chimera',
      'WebExplorer', 'Emissary', 'SlipKnot', 'Spyglass Mosaic', 'AirMosaic', 'NetPositive', 'Voyager', 'IBrowse', 'AWeb', 'OWB', 'Odyssey Web Browser', 'Basilisk',
    ],
    deepcut: ['ViolaWWW', 'WorldWideWeb', 'Line Mode Browser', 'Erwise', 'MidasWWW', 'tkWWW', 'Mothra', 'LibWWW'],
    krillion: ['ViolaWWW'],
  }),
  q('p47', 'Name an operating system', {
    plankton: [
      'Windows', 'macOS', 'Linux', 'Android', 'iOS', 'ChromeOS', 'Ubuntu', 'Unix', 'DOS', 'Windows Phone', 'Symbian', 'FreeBSD',
    ],
    schooler: [
      'Fedora', 'Debian', 'Linux Mint', 'Arch Linux', 'openSUSE', 'CentOS', 'Red Hat Enterprise Linux', 'Gentoo', 'Slackware', 'Manjaro',
      'elementary OS', 'Zorin OS', 'Pop!_OS', 'Kali Linux', 'Raspberry Pi OS', 'iPadOS', 'watchOS', 'tvOS', 'Wear OS', 'Chrome OS Flex',
      'OpenBSD', 'NetBSD', 'Solaris', 'AIX', 'HP-UX', 'IRIX', 'OpenVMS', 'z/OS', 'OS/2', 'BeOS', 'Haiku', 'AmigaOS', 'MorphOS', 'AROS', 'RISC OS',
      'Plan 9', 'QNX', 'VxWorks', 'FreeRTOS', 'Zephyr', 'ThreadX', 'Palm OS', 'webOS', 'Maemo', 'MeeGo', 'Sailfish OS', 'Tizen', 'Bada',
      'BlackBerry 10', 'Firefox OS', 'KaiOS', 'Ubuntu Touch', 'postmarketOS', 'HarmonyOS', 'Fuchsia', 'MS-DOS', 'FreeDOS', 'CP/M', 'MINIX',
      'ReactOS', 'Windows CE', 'SerenityOS', 'ArcaOS', 'DragonFly BSD', 'illumos', 'Classic Mac OS',
    ],
    rare: [
      'Xenix', 'SCO UNIX', 'Apple DOS', 'ProDOS', 'GS/OS', 'NeXTSTEP', 'OPENSTEP', 'Tru64', 'Inferno', 'TempleOS', 'Windows RT', 'SkyOS',
      'Syllable', 'KolibriOS', 'MenuetOS', 'Redox OS', 'HelenOS', 'Oberon System', 'eComStation', 'Rhapsody',
    ],
    deepcut: ['Akaros', 'ToaruOS', 'Sortix', 'Visopsys', 'NuttX', 'eCos', 'RTEMS', 'GNU Hurd'],
    krillion: ['TempleOS'],
  }),
  q('p48', 'Name a computer part or peripheral', {
    plankton: [
      'CPU', 'GPU', 'RAM', 'Motherboard', 'Hard drive', 'SSD', 'Monitor', 'Keyboard', 'Mouse', 'Power supply', 'Webcam', 'Printer', 'Headphones', 'Microphone', 'USB cable',
    ],
    schooler: [
      'NVMe drive', 'Optical drive', 'DVD drive', 'CD drive', 'Blu-ray drive', 'Floppy drive', 'Scanner', 'Speakers', 'Headset', 'Trackpad', 'Touchpad',
      'Drawing tablet', 'Joystick', 'Gamepad', 'Controller', 'Steering wheel', 'USB hub', 'Dock', 'KVM switch', 'Router', 'Modem', 'Network card',
      'Sound card', 'Graphics card', 'Capture card', 'TV tuner', 'Heatsink', 'Fan', 'Liquid cooler', 'Case', 'UPS', 'Surge protector', 'External drive',
      'Memory card reader', 'SD reader', 'Zip drive', 'Tape drive', 'Expansion card', 'Riser card', 'Power cable', 'ATX cable', 'Ethernet cable',
      'Display cable', 'Docking station', 'Stylus', 'Digital pen', 'Barcode scanner', 'Label printer', '3D printer', 'VR headset', 'Motion controller',
      'Flight stick', 'Pedals', 'MIDI keyboard', 'Audio interface', 'DAC',
    ],
    rare: [
      'PCIe card', 'Thunderbolt dock', 'TPM module', 'CMOS battery', 'Northbridge', 'Southbridge', 'Chipset', 'VRM', 'DIMM', 'SO-DIMM',
      'M.2 drive', 'SATA controller', 'HBA', 'NIC', 'TPU', 'NPU', 'FPGA', 'ASIC', 'Integrated circuit', 'Microchip', 'Capacitor', 'Resistor',
    ],
    deepcut: ['Peltier cooler', 'Water block', 'Phase-change cooler', 'Radiator', 'Reservoir', 'Riser cable', 'Thermal pad', 'Backplate'],
    krillion: ['Phase-change cooler'],
  }),
  q('p49', 'Name a file format', {
    plankton: [
      'PDF', 'DOCX', 'XLSX', 'PPTX', 'TXT', ['JPEG', ['JPG']], 'PNG', 'GIF', 'MP3', 'MP4', 'ZIP', 'CSV', 'HTML', 'JSON', 'SVG',
    ],
    schooler: [
      'DOC', 'RTF', 'ODT', 'ODS', 'ODP', 'TSV', 'XML', 'YAML', 'CSS', 'JS', 'TS', 'PY', 'MD', 'TEX', 'EPUB', 'MOBI', 'AZW', 'BMP', 'TIFF', 'WebP',
      'AVIF', 'HEIC', 'RAW', 'PSD', 'AI', 'INDD', 'RAR', '7z', 'TAR', 'GZ', 'BZ2', 'XZ', 'ISO', 'DMG', 'EXE', 'MSI', 'APK', 'IPA', 'DEB', 'RPM',
      'WAV', 'FLAC', 'AAC', 'OGG', 'M4A', 'WMA', 'AIFF', 'MOV', 'AVI', 'MKV', 'WMV', 'FLV', 'WebM', 'MPG', 'M4V', 'MIDI', 'SQL', 'DB', 'SQLite',
      'INI', 'LOG', 'BAT', 'SH', 'PS1', 'TTF', 'OTF', 'WOFF', 'WOFF2', 'EOT', 'ICO',
    ],
    rare: [
      'Parquet', 'Avro', 'ORC', 'Protobuf', 'BSON', 'HDF5', 'NetCDF', 'FITS', 'DICOM', 'NIfTI', 'STEP', 'STL', 'OBJ', 'FBX', 'GLTF', 'DWG', 'DXF',
      'SKP', 'BLEND', 'PSB', 'XCF', 'KRA', 'CR2', 'NEF', 'ARW', 'DNG', 'WebAssembly', 'CBZ', 'CBR', 'XPS', 'ARJ', 'LHA', 'CPIO', 'WIM', 'VHD', 'VMDK', 'QCOW2', 'OVA',
    ],
    deepcut: ['DjVu', 'UUE', 'Z88', 'ACE', 'PBM', 'XBM', 'TGA', 'DDS'],
    krillion: ['DjVu'],
  }),
  q('p50', 'Name an internet protocol', {
    plankton: [
      'HTTP', 'HTTPS', 'FTP', 'TCP', 'UDP', 'IP', 'DNS', 'DHCP', 'SMTP', 'IMAP', 'POP3', 'SSH', 'Telnet', 'Wi-Fi', 'Ethernet',
    ],
    schooler: [
      'IPv4', 'IPv6', 'ICMP', 'ARP', 'BGP', 'OSPF', 'RIP', 'EIGRP', 'IS-IS', 'MPLS', 'TLS', 'SSL', 'SNMP', 'NTP', 'Syslog', 'LDAP', 'Kerberos',
      'RADIUS', 'NFS', 'SMB', 'CIFS', 'WebDAV', 'SIP', 'RTP', 'RTCP', 'RTSP', 'HLS', 'DASH', 'WebRTC', 'WebSocket', 'MQTT', 'AMQP', 'CoAP', 'XMPP',
      'IRC', 'NNTP', 'Gopher', 'Finger', 'WHOIS', 'BOOTP', 'IGMP', 'GRE', 'IPsec', 'ESP', 'AH', 'PPTP', 'L2TP', 'WireGuard', 'QUIC', 'DoH', 'DoT',
      'HTTP/2', 'HTTP/3', 'gRPC', 'SOAP', 'OAuth', 'FTPS', 'SFTP', 'SCP', 'LoRaWAN', 'Modbus', 'PROFIBUS',
    ],
    rare: [
      'SCTP', 'DCCP', 'RSVP', 'LDP', 'PIM', 'VRRP', 'HSRP', 'EAP', 'PEAP', 'CHAP', 'PAP', 'OCSP', 'ACME', 'DNSSEC', 'mDNS', 'LLMNR', 'NetBIOS',
      'AppleTalk', 'IPX/SPX', 'DECnet', 'X.25', 'Frame Relay', 'ATM', 'SONET', 'SDH', 'VXLAN', 'Geneve', 'GTP', 'Diameter', 'SS7',
    ],
    deepcut: ['Chaosnet', 'UUCP', 'SLIP', 'PPP', 'Token Ring', 'ARCNET', 'LocalTalk', 'BEEP', 'TIPC'],
    krillion: ['Chaosnet'],
  }),
  q('p51', 'Name a unit of measurement', {
    plankton: [
      'Metre', 'Kilogram', 'Second', 'Litre', 'Kilometre', 'Mile', 'Foot', 'Inch', 'Pound', 'Gram', 'Hour', 'Minute', 'Degree Celsius',
      'Yard', 'Ounce', 'Tonne', 'Volt', 'Watt', 'Joule', 'Calorie',
    ],
    schooler: [
      'Ton', 'Stone', 'Fathom', 'Furlong', 'Nautical mile', 'Angstrom', 'Micron', 'Nanometre', 'Millimetre', 'Centimetre', 'Millilitre', 'Gallon',
      'Quart', 'Pint', 'Cup', 'Fluid ounce', 'Tablespoon', 'Teaspoon', 'Barrel', 'Bushel', 'Peck', 'Hectare', 'Acre', 'Square metre', 'Square foot',
      'Cubic metre', 'Kilocalorie', 'BTU', 'Kilowatt', 'Horsepower', 'Erg', 'Electronvolt', 'Pascal', 'Bar', 'Atmosphere', 'Torr', 'PSI',
      'Kelvin', 'Fahrenheit', 'Rankine', 'Mole', 'Candela', 'Ampere', 'Ohm', 'Farad', 'Henry', 'Tesla', 'Weber', 'Hertz', 'Newton', 'Dyne',
      'Radian', 'Steradian', 'Degree', 'Arcminute', 'Arcsecond', 'Gradian', 'Knot', 'Mph', 'Kph',
    ],
    rare: [
      'Barn', 'Gauss', 'Oersted', 'Maxwell', 'Sievert', 'Gray', 'Becquerel', 'Katal', 'Lumen', 'Lux', 'Coulomb', 'Siemens', 'Watt-hour',
      'Kilowatt-hour', 'Ampere-hour', 'Volt-ampere', 'Var', 'Light-year', 'Parsec', 'Astronomical unit', 'Chain', 'Rod', 'League', 'Hand',
      'Cubit', 'Carat', 'Grain', 'Dram', 'Slug', 'Poundal', 'Newton-metre', 'Foot-pound', 'Therm', 'Denier', 'Gill', 'Board foot', 'Cord',
    ],
    deepcut: ['Smoot', 'Hogshead', 'Firkin', 'Butt', 'Minim', 'Acre-foot', 'Stere', 'Fluid dram'],
    krillion: ['Smoot'],
  }),
  q('p52', 'Name a chemical compound', {
    plankton: [
      'Water', 'Salt', 'Sugar', 'Carbon dioxide', 'Ammonia', 'Methane', 'Ethanol', 'Baking soda', 'Hydrogen peroxide', 'Bleach', 'Rust', 'Soap', 'Aspirin', 'Caffeine',
    ],
    schooler: [
      'Sodium chloride', 'Carbon monoxide', 'Acetic acid', 'Sulfuric acid', 'Hydrochloric acid', 'Nitric acid', 'Phosphoric acid', 'Sodium hydroxide',
      'Potassium hydroxide', 'Calcium carbonate', 'Sodium bicarbonate', 'Glucose', 'Fructose', 'Sucrose', 'Lactose', 'Cellulose', 'Urea', 'Acetone',
      'Benzene', 'Toluene', 'Phenol', 'Glycerol', 'Ethylene glycol', 'Propane', 'Butane', 'Ethane', 'Ethene', 'Ethyne', 'Methanol', 'Propanol',
      'Butanol', 'Chloroform', 'DDT', 'TNT', 'Nitroglycerin', 'Calcium oxide', 'Calcium hydroxide', 'Sodium carbonate', 'Sodium hypochlorite',
      'Potassium permanganate', 'Copper sulfate', 'Iron oxide', 'Silicon dioxide', 'Titanium dioxide', 'Zinc oxide', 'Aluminium oxide', 'Magnesium oxide',
      'Silver nitrate', 'Borax', 'Boric acid', 'Alum', 'Gypsum', 'Sodium nitrate', 'Potassium nitrate', 'Ammonium nitrate', 'Ammonium chloride',
      'Calcium chloride', 'Magnesium sulfate', 'Sodium thiosulfate', 'Lithium carbonate', 'Sodium fluoride', 'Hydrogen cyanide', 'Nitrous oxide',
      'Sulfur dioxide', 'Hydrogen sulfide', 'Silicon carbide', 'Sodium cyanide', 'Barium sulfate', 'Calcium phosphate', 'Paracetamol', 'Ibuprofen',
    ],
    rare: [
      'Phosgene', 'Sodium azide', 'Potassium dichromate', 'Carbon disulfide', 'Sulfur trioxide', 'Phosphine', 'Silane', 'Diborane', 'Arsine', 'Germane',
      'Sulfur hexafluoride', 'Nitrogen trifluoride', 'Tetrafluoromethane', 'Ethylene oxide', 'Propylene oxide', 'Formaldehyde', 'Acetaldehyde',
      'Acrylonitrile', 'Styrene', 'Vinyl chloride', 'Bisphenol A', 'Citric acid', 'Lactic acid', 'Oxalic acid', 'Tannic acid', 'Salicylic acid',
      'Ascorbic acid', 'Uric acid', 'Nicotine', 'Morphine', 'Nitrocellulose',
    ],
    deepcut: ['Ferrocene', 'Buckminsterfullerene', 'Cadaverine', 'Putrescine', 'Thioacetone', 'Bakelite', 'Sodium silicate', 'Terephthalic acid'],
    krillion: ['Thioacetone'],
  }),
  q('p53', 'Name a metal', {
    plankton: [
      'Iron', 'Steel', 'Copper', 'Aluminium', 'Gold', 'Silver', 'Zinc', 'Lead', 'Tin', 'Nickel', 'Bronze', 'Brass', 'Titanium', 'Platinum', 'Pewter',
    ],
    schooler: [
      'Chromium', 'Cobalt', 'Manganese', 'Magnesium', 'Tungsten', 'Molybdenum', 'Vanadium', 'Zirconium', 'Niobium', 'Tantalum', 'Beryllium',
      'Lithium', 'Sodium', 'Potassium', 'Calcium', 'Scandium', 'Yttrium', 'Hafnium', 'Rhenium', 'Osmium', 'Iridium', 'Palladium', 'Rhodium',
      'Ruthenium', 'Cadmium', 'Mercury', 'Bismuth', 'Antimony', 'Arsenic', 'Gallium', 'Indium', 'Thallium', 'Germanium', 'Selenium', 'Tellurium',
      'Stainless steel', 'Cast iron', 'Wrought iron', 'Pig iron', 'Carbon steel', 'Tool steel', 'Spring steel', 'Damascus steel', 'Duralumin',
      'Inconel', 'Monel', 'Hastelloy', 'Invar', 'Kovar', 'Nichrome', 'Constantan', 'Manganin', 'Babbitt metal', 'Zamak', 'Electrum',
      'Sterling silver', 'White gold', 'Solder', 'Amalgam',
    ],
    rare: [
      'Alnico', 'Permalloy', 'Mu-metal', 'Stellite', 'Nitinol', 'Galinstan', 'Wood’s metal', 'Field’s metal', 'Rose’s metal', 'Britannia metal',
      'Pinchbeck', 'Tombac', 'Shakudo', 'Speculum metal', 'Gunmetal', 'Bell metal', 'Aluminium bronze', 'Phosphor bronze', 'Silicon bronze',
      'Cupronickel', 'Nickel silver', 'Raney nickel', 'Depleted uranium', 'Plutonium', 'Thorium', 'Neodymium', 'Samarium', 'Gadolinium', 'Europium',
    ],
    deepcut: ['Terne', 'Mischmetal', 'Ferrochrome', 'Ferromanganese', 'Spiegeleisen', 'Kanthal', 'Alumel', 'Chromel'],
    krillion: ['Galinstan'],
  }),
  q('p54', 'Name a mathematical shape', {
    plankton: [
      'Circle', 'Square', 'Triangle', 'Rectangle', 'Oval', 'Pentagon', 'Hexagon', 'Octagon', 'Cube', 'Sphere', 'Cone', 'Cylinder', 'Pyramid', 'Star',
    ],
    schooler: [
      'Rhombus', 'Trapezium', 'Trapezoid', 'Parallelogram', 'Kite', 'Heptagon', 'Nonagon', 'Decagon', 'Dodecagon', 'Heart', 'Cross', 'Crescent',
      'Ellipse', 'Sector', 'Segment', 'Quadrilateral', 'Polygon', 'Polyhedron', 'Prism', 'Cuboid', 'Tetrahedron', 'Octahedron', 'Dodecahedron',
      'Icosahedron', 'Torus', 'Hemisphere', 'Ellipsoid', 'Frustum', 'Paraboloid', 'Hyperboloid', 'Möbius strip', 'Klein bottle', 'Spiral', 'Helix',
      'Lemniscate', 'Isosceles triangle', 'Equilateral triangle', 'Scalene triangle', 'Right triangle',
    ],
    rare: [
      'Annulus', 'Cycloid', 'Catenary', 'Parabola', 'Hyperbola', 'Cardioid', 'Limaçon', 'Lissajous curve', 'Epicycloid', 'Hypocycloid', 'Astroid',
      'Deltoid', 'Nephroid', 'Folium of Descartes', 'Tractrix', 'Cissoid', 'Conchoid', 'Superellipse', 'Reuleaux triangle', 'Cuboctahedron',
      'Icosidodecahedron', 'Truncated icosahedron', 'Rhombic dodecahedron', 'Trapezohedron', 'Antiprism',
    ],
    deepcut: ['Szilassi polyhedron', 'Császár polyhedron', 'Sierpiński triangle', 'Koch snowflake', 'Menger sponge', 'Gabriel’s horn', 'Pseudosphere', 'Dini surface', 'Boy’s surface'],
    krillion: ['Szilassi polyhedron'],
  }),
  q('p55', 'Name a measuring instrument', {
    plankton: [
      'Ruler', 'Tape measure', 'Thermometer', 'Scale', 'Clock', 'Watch', 'Speedometer', 'Odometer', 'Barometer', 'Compass', 'Measuring cup', 'Stopwatch', 'Calendar',
    ],
    schooler: [
      'Protractor', 'Set square', 'Micrometer', 'Calipers', 'Vernier caliper', 'Spring scale', 'Balance scale', 'Kitchen scale', 'Bathroom scale',
      'Hourglass', 'Sundial', 'Pedometer', 'Altimeter', 'Anemometer', 'Hygrometer', 'Rain gauge', 'Seismograph', 'Geiger counter', 'Voltmeter',
      'Ammeter', 'Multimeter', 'Ohmmeter', 'Oscilloscope', 'Wattmeter', 'Manometer', 'Flow meter', 'Tachometer', 'Sound level meter', 'Light meter',
      'PH meter', 'Hydrometer', 'Refractometer', 'Spectrometer', 'Colorimeter', 'Calorimeter', 'Pyrometer', 'Theodolite', 'Sextant', 'Chronometer',
      'Inclinometer', 'Goniometer', 'Planimeter', 'Interferometer', 'Polarimeter', 'Radiometer', 'Dosimeter', 'Magnetometer', 'Accelerometer',
      'Tensiometer', 'Dynamometer', 'Potentiometer', 'Gyroscope', 'Bolometer',
    ],
    rare: [
      'Piezometer', 'Viscometer', 'Gravimeter', 'Cathetometer', 'Spherometer', 'Ellipsometer', 'Nephelometer', 'Turbidimeter', 'Optical flat',
      'Surface plate', 'Feeler gauge', 'Thread pitch gauge', 'Dividers', 'Anemograph', 'Clinometer', 'Wheatstone bridge',
    ],
    deepcut: ['Quadrant', 'Astrolabe', 'Dioptra', 'Chorobates', 'Groma', 'Ramsden eyepiece'],
    krillion: ['Chorobates'],
  }),
  q('p56', 'Name a constellation', {
    plankton: [
      'Orion', 'Ursa Major', 'Ursa Minor', 'Cassiopeia', 'Leo', 'Scorpius', 'Taurus', 'Gemini', 'Cancer', 'Virgo', 'Libra', 'Sagittarius',
      'Capricorn', 'Pisces', 'Aquarius', 'Aries', 'Draco', 'Cygnus', 'Pegasus', 'Andromeda', 'Perseus', 'Canis Major', 'Canis Minor', 'Aquila', 'Lyra',
      'Centaurus', 'Crux', 'Phoenix', 'Hydra', 'Corvus',
    ],
    schooler: [
      'Antlia', 'Apus', 'Ara', 'Auriga', 'Boötes', 'Caelum', 'Camelopardalis', 'Canes Venatici', 'Carina', 'Cepheus', 'Cetus', 'Chamaeleon',
      'Circinus', 'Columba', 'Coma Berenices', 'Corona Australis', 'Corona Borealis', 'Crater', 'Delphinus', 'Dorado', 'Equuleus', 'Eridanus',
      'Fornax', 'Grus', 'Hercules', 'Horologium', 'Hydrus', 'Indus', 'Lacerta', 'Leo Minor', 'Lepus', 'Lupus', 'Lynx', 'Mensa', 'Microscopium',
      'Monoceros', 'Musca', 'Norma', 'Octans', 'Ophiuchus', 'Pavo', 'Pictor', 'Piscis Austrinus', 'Puppis', 'Pyxis', 'Reticulum', 'Sagitta',
      'Sculptor', 'Scutum', 'Serpens', 'Sextans', 'Telescopium', 'Triangulum', 'Triangulum Australe', 'Tucana', 'Vela', 'Volans', 'Vulpecula',
    ],
    rare: ['Argo Navis', 'Quadrans Muralis', 'Antinous', 'Robur Carolinum', 'Globus Aerostaticus', 'Turdus Solitarius', 'Musca Borealis', 'Mons Maenalus', 'Rangifer', 'Felis', 'Noctua', 'Sceptrum Brandenburgicum'],
    deepcut: ['Testudo', 'Bufo', 'Vespa', 'Cochlea', 'Manis', 'Anguilla', 'Patella', 'Linum'],
    krillion: ['Robur Carolinum'],
  }),
  q('p57', 'Name a star', {
    plankton: [
      'Sun', 'Sirius', 'Polaris', 'Betelgeuse', 'Rigel', 'Vega', 'Proxima Centauri', 'Alpha Centauri', 'Arcturus', 'Aldebaran', 'Antares', 'Capella',
      'Altair', 'Deneb', 'Spica', 'Procyon', 'Canopus', 'Fomalhaut', 'Regulus',
    ],
    schooler: [
      'Castor', 'Pollux', 'Achernar', 'Bellatrix', 'Mintaka', 'Alnilam', 'Alnitak', 'Saiph', 'Mizar', 'Alcor', 'Dubhe', 'Merak', 'Phecda', 'Megrez',
      'Alioth', 'Alkaid', 'Kochab', 'Thuban', 'Schedar', 'Caph', 'Mira', 'Algol', 'Denebola', 'Algieba', 'Zubenelgenubi', 'Sadr', 'Albireo',
      'Rasalgethi', 'Izar', 'Alphecca', 'Unukalhai', 'Nunki', 'Kaus Australis', 'Ascella', 'Alnair', 'Hamal', 'Sheratan', 'Menkar', 'Diphda', 'Enif',
      'Markab', 'Scheat', 'Algenib', 'Alpheratz', 'Mirach', 'Almach', 'Acrux', 'Gacrux', 'Mimosa', 'Hadar', 'Toliman', 'Adhara', 'Wezen', 'Mirzam',
      'Aludra', 'Naos', 'Avior', 'Miaplacidus', 'Aspidiske', 'Suhail',
    ],
    rare: [
      'Tarazed', 'Alshain', 'Sadalsuud', 'Sadalmelik', 'Homam', 'Matar', 'Biham', 'Skat', 'Ancha', 'Situla', 'Deneb Kaitos', 'Ankaa', 'Ruchbah',
      'Achird', 'Tau Ceti', 'Epsilon Eridani', 'Barnard’s Star', 'Wolf 359', 'Lalande 21185', 'Ross 154', 'Tabby’s Star', 'VY Canis Majoris',
      'UY Scuti', 'Eta Carinae', 'R136a1', 'Pistol Star', 'Mu Cephei', 'La Superba', 'Zubeneschamali', 'Nekkar', 'Kornephoros', 'Cebalrai',
    ],
    deepcut: ['Zaurak', 'Cursa', 'Keid', 'Yed Prior', 'Yed Posterior', 'Sabik', 'Przybylski’s Star', 'TRAPPIST-1', 'Kepler-16', 'Gliese 581'],
    krillion: ['Przybylski’s Star'],
  }),
  q('p58', 'Name a type of rock', {
    plankton: [
      'Granite', 'Basalt', 'Limestone', 'Sandstone', 'Marble', 'Shale', 'Slate', 'Obsidian', 'Pumice', 'Chalk', 'Quartzite', 'Gneiss', 'Coal',
      'Igneous rock', 'Sedimentary rock', 'Metamorphic rock',
    ],
    schooler: [
      'Andesite', 'Rhyolite', 'Gabbro', 'Diorite', 'Peridotite', 'Dunite', 'Pegmatite', 'Conglomerate', 'Breccia', 'Mudstone', 'Siltstone', 'Dolomite',
      'Chert', 'Flint', 'Gypsum', 'Rock salt', 'Laterite', 'Greenschist', 'Amphibolite', 'Hornfels', 'Migmatite', 'Eclogite', 'Blueschist', 'Soapstone',
      'Serpentinite', 'Travertine', 'Coquina', 'Arkose', 'Greywacke', 'Tillite', 'Porphyry', 'Syenite', 'Monzonite', 'Anorthosite', 'Komatiite',
      'Carbonatite', 'Lamprophyre', 'Welded tuff', 'Scoria', 'Agglomerate', 'Oil shale', 'Ironstone', 'Banded iron formation', 'Novaculite', 'Phyllite',
      'Schist', 'Marl', 'Diatomite', 'Tufa',
    ],
    rare: [
      'Phonolite', 'Tephrite', 'Trachyte', 'Nephelinite', 'Jasper', 'Cataclasite', 'Mylonite', 'Pseudotachylite', 'Fuller’s earth', 'Bentonite',
      'Rhyodacite', 'Dacite', 'Picrite', 'Ignimbrite', 'Pitchstone', 'Tachylyte', 'Hyaloclastite', 'Peperite',
    ],
    deepcut: ['Impactite', 'Suevite', 'Tektite', 'Skarn', 'Unakite', 'Carbonado', 'Itacolumite'],
    krillion: ['Itacolumite'],
  }),
  q('p59', 'Name a branch of science', {
    plankton: [
      'Physics', 'Chemistry', 'Biology', 'Geology', 'Astronomy', 'Mathematics', 'Medicine', 'Ecology', 'Genetics', 'Zoology', 'Botany', 'Psychology',
      'Economics', 'Geography', 'Anatomy', 'Biochemistry', 'Microbiology', 'Neuroscience', 'Computer science',
    ],
    schooler: [
      'Physiology', 'Pathology', 'Pharmacology', 'Immunology', 'Virology', 'Bacteriology', 'Mycology', 'Parasitology', 'Histology', 'Cytology',
      'Embryology', 'Neurobiology', 'Endocrinology', 'Hematology', 'Toxicology', 'Epidemiology', 'Paleontology', 'Archaeology', 'Anthropology',
      'Sociology', 'Linguistics', 'Meteorology', 'Oceanography', 'Hydrology', 'Seismology', 'Volcanology', 'Mineralogy', 'Petrology', 'Geomorphology',
      'Geophysics', 'Geochemistry', 'Climatology', 'Glaciology', 'Limnology', 'Speleology', 'Entomology', 'Ornithology', 'Herpetology', 'Ichthyology',
      'Malacology', 'Arachnology', 'Ethology', 'Taxonomy', 'Systematics', 'Molecular biology', 'Cell biology', 'Developmental biology', 'Astrobiology',
      'Astrophysics', 'Cosmology', 'Particle physics', 'Nuclear physics', 'Thermodynamics', 'Optics', 'Acoustics', 'Mechanics', 'Electromagnetism',
      'Fluid dynamics', 'Materials science', 'Metallurgy', 'Statistics', 'Genomics', 'Proteomics', 'Bioinformatics', 'Evolutionary biology',
    ],
    rare: [
      'Aeronomy', 'Astrochemistry', 'Astrogeology', 'Cosmochemistry', 'Geodesy', 'Cartography', 'Photogrammetry', 'Dendrochronology', 'Palynology',
      'Conchology', 'Myrmecology', 'Lepidopterology', 'Helminthology', 'Protozoology', 'Phycology', 'Lichenology', 'Bryology', 'Pomology', 'Oenology',
      'Agronomy', 'Horticulture', 'Apiculture', 'Cetology', 'Primatology', 'Acarology', 'Nematology', 'Phenology', 'Metabolomics', 'Transcriptomics',
      'Epigenetics', 'Biostatistics',
    ],
    deepcut: ['Tribology', 'Rheology', 'Biomimetics', 'Ergonomics', 'Metrology', 'Semiotics', 'Ethnobotany', 'Archaeoastronomy', 'Pteridology', 'Karyology'],
    krillion: ['Pteridology'],
  }),
  q('p60', 'Name a branch of engineering', {
    plankton: [
      'Civil engineering', 'Mechanical engineering', 'Electrical engineering', 'Chemical engineering', 'Aerospace engineering', 'Software engineering',
      'Industrial engineering', 'Structural engineering', 'Computer engineering', 'Electronic engineering', 'Environmental engineering', 'Automotive engineering',
      'Agricultural engineering', 'Biomedical engineering',
    ],
    schooler: [
      'Aeronautical engineering', 'Astronautical engineering', 'Marine engineering', 'Naval architecture', 'Mining engineering', 'Metallurgical engineering',
      'Petroleum engineering', 'Nuclear engineering', 'Architectural engineering', 'Geotechnical engineering', 'Transportation engineering',
      'Water resources engineering', 'Hydraulic engineering', 'Manufacturing engineering', 'Mechatronics', 'Robotics engineering', 'Control engineering',
      'Systems engineering', 'Optical engineering', 'Materials engineering', 'Ceramic engineering', 'Polymer engineering', 'Textile engineering',
      'Food engineering', 'Energy engineering', 'Power engineering', 'Telecommunications engineering', 'Instrumentation engineering', 'Surveying',
      'Geomatic engineering', 'Safety engineering', 'Reliability engineering', 'Quality engineering', 'Welding engineering', 'Cryogenic engineering',
      'Vacuum engineering', 'Packaging engineering', 'Ordnance engineering', 'Pipeline engineering', 'Construction engineering', 'Urban engineering',
      'Railway engineering', 'Highway engineering', 'Sanitary engineering', 'Acoustical engineering', 'Fire protection engineering',
    ],
    rare: [
      'Corrosion engineering', 'Tissue engineering', 'Genetic engineering', 'Neural engineering', 'Biomechanical engineering', 'Building services engineering',
      'HVAC engineering', 'Facade engineering', 'Earthquake engineering', 'Wind engineering', 'Coastal engineering', 'Offshore engineering',
      'Reservoir engineering', 'Drilling engineering', 'Geological engineering', 'Mineral processing', 'Extractive metallurgy', 'Glass engineering',
      'Pharmaceutical engineering', 'Clinical engineering', 'Rehabilitation engineering', 'Forensic engineering',
    ],
    deepcut: ['Value engineering', 'Human factors engineering', 'Membrane engineering', 'Brewing engineering', 'Dairy engineering', 'Paper engineering', 'Space systems engineering'],
    krillion: ['Brewing engineering'],
  }),
  q('p61', 'Name a bone', {
    plankton: [
      ['Skull', ['cranium']], 'Spine', 'Rib', 'Femur', 'Tibia', 'Fibula', 'Pelvis', ['Shoulder blade', ['scapula']], ['Collarbone', ['clavicle']], 'Humerus', 'Radius', 'Ulna', 'Sternum', ['Jaw', ['mandible', 'jawbone']], 'Patella',
    ],
    schooler: [
      'Maxilla', 'Vertebra', 'Cervical vertebra', 'Thoracic vertebra', 'Lumbar vertebra', 'Sacrum', ['Coccyx', ['tailbone']], 'Manubrium',
      'Xiphoid process', 'Ilium', 'Ischium', 'Pubis', 'Acetabulum', 'Carpal', 'Metacarpal', 'Phalanx', 'Tarsal', 'Metatarsal', 'Calcaneus',
      'Talus', 'Navicular', 'Cuboid', 'Cuneiform', 'Zygomatic bone', 'Nasal bone', 'Lacrimal bone', 'Palatine bone', 'Vomer', 'Ethmoid',
      'Sphenoid', 'Temporal bone', 'Parietal bone', 'Frontal bone', 'Occipital bone', 'Hyoid', 'Malleus', 'Incus', 'Stapes', 'Sesamoid bone',
      'Atlas', 'Axis',
    ],
    rare: [
      'Scaphoid', 'Lunate', 'Triquetrum', 'Pisiform', 'Trapezium', 'Trapezoid', 'Capitate', 'Hamate', 'Medial cuneiform', 'Intermediate cuneiform',
      'Lateral cuneiform', 'Floating rib', 'Acromion', 'Coracoid process', 'Olecranon', 'Greater trochanter', 'Lesser trochanter', 'Iliac crest',
      'Ischial tuberosity', 'Mastoid process',
    ],
    deepcut: ['Odontoid process', 'Sella turcica', 'Foramen magnum', 'Pterygoid plate', 'Sustentaculum tali', 'Clivus', 'Zygomatic arch'],
    krillion: ['Sustentaculum tali'],
  }),
  q('p62', 'Name a type of engine', {
    plankton: [
      'Petrol engine', 'Diesel engine', 'Steam engine', 'Electric motor', 'Jet engine', 'Rocket engine', 'V8 engine', 'Hybrid engine',
      'Steam turbine', 'Gas turbine', 'Two-stroke engine', 'Four-stroke engine',
    ],
    schooler: [
      'Internal combustion engine', 'External combustion engine', 'Turbofan', 'Turbojet', 'Turboprop', 'Turboshaft', 'Ramjet', 'Scramjet',
      'Solid rocket', 'Liquid rocket', 'Ion thruster', 'Stirling engine', 'Wankel engine', 'Radial engine', 'Inline engine', 'V engine', 'Flat engine',
      'Boxer engine', 'Opposed-piston engine', 'Atkinson cycle engine', 'Miller cycle engine', 'Straight-six', 'V6', 'V12', 'V-twin', 'Inline-four',
      'Flat-four', 'Flat-six', 'Diesel-electric', 'Petrol-electric', 'Fuel cell', 'Hydrogen engine', 'Rotary engine', 'Reciprocating engine',
      'Beam engine', 'Cornish engine', 'Newcomen engine', 'Compound engine', 'Triple-expansion engine', 'Uniflow engine', 'Hydraulic motor', 'Pneumatic motor',
    ],
    rare: [
      'Pulsejet', 'Valveless pulsejet', 'Nuclear thermal rocket', 'Nuclear electric propulsion', 'Hall-effect thruster', 'Magnetoplasmadynamic thruster',
      'Solar thermal rocket', 'Hybrid rocket', 'Monopropellant rocket', 'Bipropellant rocket', 'Aerospike engine', 'Expander cycle', 'Gas-generator cycle',
      'Staged combustion cycle', 'Rotating detonation engine', 'Free-piston engine', 'Split-cycle engine', 'Six-stroke engine', 'Bourke engine',
      'Quasiturbine', 'Swing-piston engine', 'Orbital engine', 'Nutating engine', 'Cam engine',
    ],
    deepcut: ['Pulse detonation engine', 'Sabre engine', 'Liquid air cycle engine', 'Air turborocket', 'Fission-fragment rocket', 'Nuclear pulse propulsion', 'Antimatter rocket'],
    krillion: ['Quasiturbine'],
  }),
  q('p63', 'Name a gas', {
    plankton: [
      'Oxygen', 'Nitrogen', 'Hydrogen', 'Helium', 'Carbon dioxide', 'Neon', 'Argon', 'Chlorine', 'Methane', 'Propane', 'Steam', 'Ozone', 'Ammonia', 'Butane',
    ],
    schooler: [
      'Krypton', 'Xenon', 'Radon', 'Fluorine', 'Ethane', 'Carbon monoxide', 'Sulfur dioxide', 'Hydrogen sulfide', 'Nitrous oxide', 'Nitric oxide',
      'Nitrogen dioxide', 'Acetylene', 'Ethylene', 'Propene', 'Isobutane', 'Hydrogen chloride', 'Chlorine dioxide', 'Phosgene', 'Phosphine', 'Silane',
      'Diborane', 'Arsine', 'Germane', 'Sulfur hexafluoride', 'Nitrogen trifluoride', 'Tetrafluoromethane', 'Refrigerant R-134a', 'CFC', 'HCFC',
      'Dimethyl ether', 'Formaldehyde', 'Natural gas', 'Town gas', 'Coal gas', 'Producer gas', 'Water gas', 'Blast furnace gas', 'Landfill gas',
      'Biogas', 'Syngas', 'Flue gas', 'Exhaust gas', 'Laughing gas', 'Tear gas', 'Mustard gas',
    ],
    rare: [
      'Deuterium', 'Tritium', 'Stibine', 'Hydrogen selenide', 'Carbonyl sulfide', 'Octafluoropropane', 'Sulfuryl fluoride', 'Bromomethane',
      'Ethylene oxide', 'Propylene oxide', 'Vinyl chloride', 'Methanethiol', 'Tungsten hexafluoride', 'Uranium hexafluoride', 'Chlorine trifluoride',
      'Boron trifluoride', 'Hydrogen fluoride', 'Hydrogen bromide', 'Hydrogen iodide', 'Silicon tetrafluoride',
    ],
    deepcut: ['Sulfur tetrafluoride', 'Chlorine pentafluoride', 'Bromine pentafluoride', 'Iodine heptafluoride', 'Xenon tetrafluoride', 'Krypton difluoride', 'Phosphorus trifluoride'],
    krillion: ['Krypton difluoride'],
  }),
];

// The first seven are retained as a compact deterministic QA set and as a
// compatibility export for tools that used the original sample puzzle.
export const DEMO = { dayNumber: 1, source: 'OpenKrillion sample bank', prompts: BANK.slice(0, 7) };
export const QUESTION_COUNT = BANK.length;
export function questionById(id) { return BANK.find(prompt => prompt.id === id) || null; }
