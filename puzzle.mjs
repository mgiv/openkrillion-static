// Curated, independently assembled 42-category question bank for the static game.
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
    ],
    schooler: [
      ['Gnocchi', ['potato gnocchi']], ['Tater tots', ['tots']], ['Potato croquettes', ['croquettes']], ['Potato rösti', ['rosti', 'rösti']],
      ['Latkes', ['potato latkes']], ['Colcannon', []], ['Bubble and squeak', ['bubble & squeak']], ['Fondant potatoes', ['fondant potato']],
      ['Hasselback potatoes', ['hasselback potato']], ['Duchess potatoes', ['duchess potato']], ['Pommes Anna', ['pommes anna']],
      ['Potato curry', ['aloo curry']], ['Potato stew', ['stewed potatoes']], ['Potato casserole', ['potato bake']],
      ['Potato dumplings', ['kartoffelklöße', 'kartoffelkloesse']], ['Potato pierogi', ['pierogi with potato']], ['Potato bread', ['potato rolls']],
      ['Poutine', ['fries with cheese curds and gravy']], ['Pommes dauphine', ['dauphine potatoes']],
    ],
    rare: [
      ['Aligot', ['aligot potatoes']], ['Boxty', ['Irish potato pancake']], ['Pommes soufflées', ['pommes souffle', 'souffle potatoes']],
      ['Pommes boulangère', ['pommes boulangere', 'boulangere potatoes']], ['Tartiflette', ['potato tartiflette']],
      ['Potato pavé', ['potato pave']], ['Aloo gobi', ['potato and cauliflower curry']], ['Aloo paratha', ['potato paratha']],
      ['Aloo tikki', ['potato tikki']], ['Batata harra', ['spicy potatoes']], ['Kugel', ['potato kugel']],
    ],
    deepcut: [['Rumbledethumps', []], ['Stovies', ['Scottish stovies']], ['Cullen skink with tatties', ['tattie cullen skink']], ['Pommes de terre sarladaises', ['sarladaise potatoes']]],
    krillion: [['Kroppkakor', ['Swedish potato dumplings']]],
  }),
  q('p2', 'Name an animal whose name is exactly four letters long', {
    plankton: ['Lion', 'Bear', 'Wolf', 'Deer', 'Hare', 'Mole', 'Seal', 'Frog', 'Toad', 'Duck', 'Swan', 'Crow', 'Dove', 'Goat', 'Lamb', 'Boar', 'Moth', 'Crab', 'Clam', 'Slug'],
    schooler: ['Orca', 'Ibex', 'Tahr', 'Kiwi', 'Newt', 'Mink', 'Lynx', 'Wren', 'Gull', 'Hawk', 'Mule', 'Puma', 'Vole', 'Paca', 'Kudu'],
    rare: ['Tuna', 'Carp', 'Bass', 'Pike', 'Myna', 'Rhea', 'Saki', 'Goby'],
    krillion: ['Mara'],
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
      ['James Harden', ['Harden']], ['Derrick Rose', ['D Rose']], ['Kawhi Leonard', ['Kawhi']], ['Shai Gilgeous-Alexander', ['Shai', 'SGA']],
    ],
    deepcut: [['Bob Cousy', []]],
    krillion: [['Dave Cowens', []]],
  }),
  q('p4', 'Name a chemical element whose symbol is one letter', {
    plankton: ['Hydrogen', 'Carbon', 'Oxygen', 'Nitrogen', 'Fluorine', 'Phosphorus', 'Sulfur', 'Potassium'],
    schooler: ['Boron', 'Iodine', 'Tungsten'],
    rare: ['Vanadium'],
    deepcut: ['Yttrium'],
    krillion: [['Yttrium', ['Y']]],
  }),
  q('p5', 'Name a type of station', {
    plankton: [['Train station', ['railway station']], ['Bus station', ['bus terminal']], ['Police station', ['police headquarters']], ['Fire station', ['firehouse']], ['Radio station', ['radio']], ['Gas station', ['petrol station', 'filling station']], ['Space station', ['orbital station']]],
    schooler: ['Weather station', 'Power station', 'Charging station', 'Subway station', 'Railway station', 'Research station', 'Military station', 'Ranger station', 'Television station', 'Coast guard station'],
    rare: ['Ground station', 'Tracking station', 'Relay station', 'Base station', 'Way station', 'Service station', 'Lifeboat station', 'Whaling station'],
    deepcut: ['Ghost station', 'Polar research station', 'Listening station', 'Signal station'],
    krillion: ['Ghost station'],
  }),
  q('p6', 'Name a country whose English name ends in the letter E', {
    plankton: ['France', 'Greece', 'Chile', 'Belize', 'Ukraine', 'Singapore'],
    schooler: ['Zimbabwe', 'Suriname', 'Cabo Verde', 'Sierra Leone', 'Timor-Leste', 'Palestine'],
    rare: [['Côte d’Ivoire', ['Cote d Ivoire']], 'Timor-Leste'],
    deepcut: [],
    krillion: ['São Tomé and Príncipe'],
  }),
  q('p7', 'Name a superhero team', {
    plankton: [['Avengers', ['The Avengers']], ['Justice League', ['JLA']], ['X-Men', ['Xmen']], ['Fantastic Four', ['The Fantastic Four']], ['Teen Titans', ['Titans']]],
    schooler: ['Guardians of the Galaxy', 'Suicide Squad', 'Doom Patrol', 'The Defenders', 'Young Avengers', 'New Mutants', 'Birds of Prey', 'X-Force', 'Runaways', 'Thunderbolts'],
    rare: ['Alpha Flight', 'Great Lakes Avengers', 'Excalibur', 'Secret Six', 'The Outsiders', 'Champions', 'Legion of Super-Heroes', 'Howling Commandos'],
    deepcut: ['Freedom Force', 'Nextwave', 'The Authority', 'Sinister Six'],
    krillion: ['Great Lakes Avengers'],
  }),
  q('p8', 'Name a fruit', {
    plankton: ['Apple', 'Banana', 'Orange', 'Strawberry', 'Grape', 'Watermelon', 'Pear', 'Peach', 'Pineapple', 'Mango', 'Lemon', 'Lime', 'Cherry', 'Blueberry', 'Raspberry', 'Melon', 'Plum', 'Kiwi', 'Papaya', 'Coconut'],
    schooler: ['Pomegranate', 'Grapefruit', 'Cranberry', 'Apricot', 'Nectarine', 'Cantaloupe', 'Tangerine', 'Passion fruit', 'Guava', 'Persimmon', 'Dragon fruit', 'Blackberry'],
    rare: ['Quince', 'Feijoa', 'Cherimoya', 'Jackfruit', 'Longan', 'Rambutan', 'Physalis', 'Salak', 'Jabuticaba'],
    deepcut: ['Pawpaw', 'Medlar', 'Buddha’s hand', 'Miracle fruit'],
    krillion: ['Jabuticaba'],
  }),
  q('p9', 'Name a vegetable', {
    plankton: ['Carrot', 'Broccoli', 'Potato', 'Onion', 'Tomato', 'Cucumber', 'Lettuce', 'Spinach', 'Pea', 'Corn', 'Pepper', 'Celery', 'Cabbage', 'Cauliflower', 'Mushroom', 'Garlic', 'Pumpkin', 'Zucchini'],
    schooler: ['Aubergine', 'Eggplant', 'Kale', 'Beetroot', 'Turnip', 'Parsnip', 'Radish', 'Leek', 'Asparagus', 'Artichoke', 'Okra', 'Fennel', 'Rutabaga', 'Brussels sprouts'],
    rare: ['Kohlrabi', 'Celeriac', 'Salsify', 'Romanesco', 'Chayote', 'Daikon', 'Jicama', 'Bok choy', 'Watercress'],
    deepcut: ['Oca', 'Yardlong bean', 'Crosne', 'Cardoon'],
    krillion: ['Crosne'],
  }),
  q('p10', 'Name a bird', {
    plankton: ['Eagle', 'Owl', 'Crow', 'Raven', 'Robin', 'Sparrow', 'Pigeon', 'Dove', 'Duck', 'Swan', 'Goose', 'Parrot', 'Penguin', 'Flamingo', 'Peacock', 'Chicken', 'Turkey', 'Hawk'],
    schooler: ['Kingfisher', 'Woodpecker', 'Hummingbird', 'Albatross', 'Pelican', 'Puffin', 'Heron', 'Osprey', 'Magpie', 'Seagull', 'Toucan', 'Emu', 'Ostrich'],
    rare: ['Kakapo', 'Hoatzin', 'Shoebill', 'Secretary bird', 'Lyrebird', 'Bittern', 'Kookaburra', 'Cassowary'],
    deepcut: ['Kagu', 'Oilbird', 'Potoo', 'Takahē', 'Kakapo'],
    krillion: ['Kagu'],
  }),
  q('p11', 'Name a mammal', {
    plankton: ['Dog', 'Cat', 'Horse', 'Cow', 'Sheep', 'Goat', 'Pig', 'Lion', 'Tiger', 'Elephant', 'Giraffe', 'Zebra', 'Bear', 'Wolf', 'Fox', 'Deer', 'Rabbit', 'Monkey'],
    schooler: ['Dolphin', 'Whale', 'Bat', 'Hedgehog', 'Armadillo', 'Meerkat', 'Lemur', 'Wombat', 'Orangutan', 'Chimpanzee', 'Hippopotamus', 'Rhinoceros'],
    rare: ['Aardvark', 'Pangolin', 'Quokka', 'Fossa', 'Binturong', 'Numbat', 'Okapi', 'Saola', 'Narwhal'],
    deepcut: ['Solenodon', 'Dugong', 'Pika', 'Tenrec'],
    krillion: ['Saola'],
  }),
  q('p12', 'Name a marine animal', {
    plankton: ['Shark', 'Dolphin', 'Whale', 'Octopus', 'Squid', 'Seal', 'Sea lion', 'Turtle', 'Crab', 'Lobster', 'Jellyfish', 'Seahorse', 'Clownfish', 'Orca', 'Starfish', 'Seastar'],
    schooler: ['Manta ray', 'Moray eel', 'Sea otter', 'Nautilus', 'Cuttlefish', 'Sea cucumber', 'Walrus', 'Manatee', 'Barracuda', 'Anglerfish'],
    rare: ['Blue-ringed octopus', 'Mola mola', 'Leafy seadragon', 'Dumbo octopus', 'Horseshoe crab', 'Goblin shark', 'Ribbon eel'],
    deepcut: ['Vampire squid', 'Gulper eel', 'Yeti crab', 'Wobbegong'],
    krillion: ['Yeti crab'],
  }),
  q('p13', 'Name a dog breed', {
    plankton: ['Labrador Retriever', 'Golden Retriever', 'Poodle', 'Bulldog', 'Beagle', 'German Shepherd', 'Pug', 'Boxer', 'Dachshund', 'Chihuahua', 'Corgi', 'Border Collie'],
    schooler: ['Siberian Husky', 'Shih Tzu', 'Great Dane', 'Rottweiler', 'Doberman Pinscher', 'Australian Shepherd', 'Cocker Spaniel', 'Greyhound', 'Maltese', 'Akita'],
    rare: ['Basenji', 'Saluki', 'Borzoi', 'Xoloitzcuintli', 'Lagotto Romagnolo', 'Leonberger', 'Keeshond', 'Bedlington Terrier'],
    deepcut: ['Azawakh', 'Schipperke', 'Puli', 'Catalburun'],
    krillion: ['Catalburun'],
  }),
  q('p14', 'Name a musical instrument', {
    plankton: ['Piano', 'Guitar', 'Violin', 'Drums', 'Flute', 'Trumpet', 'Saxophone', 'Cello', 'Clarinet', 'Harp', 'Trombone', 'Ukulele'],
    schooler: ['Accordion', 'Banjo', 'Oboe', 'Bassoon', 'Mandolin', 'Xylophone', 'Harmonica', 'Tuba', 'Double bass', 'French horn', 'Marimba'],
    rare: ['Theremin', 'Sitar', 'Shamisen', 'Djembe', 'Erhu', 'Nyckelharpa', 'Didgeridoo', 'Glass armonica'],
    deepcut: ['Ondes Martenot', 'Hurdy-gurdy', 'Crwth', 'Serpent'],
    krillion: ['Crwth'],
  }),
  q('p15', 'Name a board game', {
    plankton: ['Chess', 'Checkers', 'Monopoly', 'Scrabble', 'Clue', 'Risk', 'Catan', 'Candy Land', 'Battleship', 'Guess Who?', 'Sorry!', 'Connect Four'],
    schooler: ['Ticket to Ride', 'Carcassonne', 'Azul', 'Pandemic', 'Codenames', 'Mancala', 'Stratego', 'Boggle', 'The Game of Life', 'Trivial Pursuit'],
    rare: ['Wingspan', 'Root', 'Everdell', 'Agricola', 'Diplomacy', 'Tigris and Euphrates', 'Hive', 'Quoridor'],
    deepcut: ['Go', 'Tak', 'Pax Pamir', 'Twilight Struggle'],
    krillion: ['Tak'],
  }),
  q('p16', 'Name a card game', {
    plankton: ['Poker', 'Blackjack', 'Bridge', 'Rummy', 'Go Fish', 'Solitaire', 'Hearts', 'Spades', 'Crazy Eights', 'War', 'Uno', 'Snap'],
    schooler: ['Euchre', 'Canasta', 'Pinochle', 'Gin Rummy', 'Cribbage', 'Old Maid', 'Whist', 'President', 'Baccarat'],
    rare: ['Skat', 'Bezique', 'Klondike', 'Mao', 'Durak', 'Scopa', 'Sheepshead', 'Tichu'],
    deepcut: ['Napoleon', 'Piquet', 'Kemps', 'Thirty-one'],
    krillion: ['Scopa'],
  }),
  q('p17', 'Name a sport', {
    plankton: ['Football', 'Soccer', 'Basketball', 'Baseball', 'Tennis', 'Swimming', 'Golf', 'Rugby', 'Cricket', 'Hockey', 'Volleyball', 'Boxing', 'Cycling', 'Running', 'Wrestling'],
    schooler: ['Badminton', 'Table tennis', 'Squash', 'Rowing', 'Fencing', 'Gymnastics', 'Skiing', 'Surfing', 'Lacrosse', 'Handball', 'Judo', 'Taekwondo'],
    rare: ['Curling', 'Biathlon', 'Polo', 'Kabaddi', 'Sepak takraw', 'Bandy', 'Skeleton', 'Bobsleigh'],
    deepcut: ['Hurling', 'Shinty', 'Pelota', 'Underwater hockey'],
    krillion: ['Sepak takraw'],
  }),
  q('p18', 'Name a planet, dwarf planet, or dwarf-planet candidate in our Solar System', {
    plankton: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    schooler: ['Pluto', 'Ceres', 'Eris'],
    rare: ['Haumea', 'Makemake'],
    deepcut: ['Gonggong', 'Quaoar', 'Sedna', 'Orcus'],
    krillion: ['Orcus'],
  }),
  q('p19', 'Name a moon in our Solar System', {
    plankton: [['The Moon', ['Earth’s Moon', 'Earth moon']], 'Io'],
    schooler: ['Europa', 'Ganymede', 'Callisto', 'Titan', 'Triton', 'Phobos', 'Deimos', 'Enceladus'],
    rare: ['Mimas', 'Iapetus', 'Rhea', 'Dione', 'Miranda', 'Ariel', 'Oberon', 'Charon', 'Tethys', 'Hyperion'],
    deepcut: ['Nereid', 'Proteus', 'Umbriel', 'Dysnomia', 'Kerberos', 'Styx'],
    krillion: ['Kerberos'],
  }),
  q('p20', 'Name a chemical element', {
    plankton: ['Iron', 'Gold', 'Silver', 'Copper', 'Carbon', 'Oxygen', 'Hydrogen', 'Nitrogen', 'Helium', 'Sodium', 'Calcium', 'Chlorine'],
    schooler: ['Cobalt', 'Nickel', 'Neon', 'Argon', 'Silicon', 'Phosphorus', 'Magnesium', ['Aluminium', ['Aluminum']], 'Uranium', 'Platinum'],
    rare: ['Gallium', 'Germanium', 'Ruthenium', 'Osmium', 'Tantalum', 'Tellurium', 'Bismuth', 'Technetium'],
    deepcut: ['Promethium', 'Rhenium', 'Hafnium', 'Dysprosium'],
    krillion: ['Promethium'],
  }),
  q('p21', 'Name a country in Europe', {
    plankton: ['France', 'Germany', 'Italy', 'Spain', 'Portugal', 'Greece', 'Ireland', 'Norway', 'Sweden', 'Poland', 'Ukraine', 'Netherlands', 'Switzerland', 'Austria', 'Belgium'],
    schooler: ['Croatia', 'Slovenia', 'Slovakia', 'Romania', 'Bulgaria', 'Albania', 'Iceland', 'Denmark', 'Finland', 'Estonia', 'Latvia', 'Lithuania'],
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
    plankton: ['London', 'Paris', 'Rome', 'Madrid', 'Tokyo', 'Beijing', 'Ottawa', 'Canberra', 'Washington, D.C.', 'Berlin', 'Athens', 'Cairo', 'Seoul', 'New Delhi', 'Mexico City'],
    schooler: ['Helsinki', 'Oslo', 'Stockholm', 'Lisbon', 'Dublin', 'Warsaw', 'Bangkok', 'Jakarta', 'Nairobi', 'Lima', 'Buenos Aires', 'Wellington', 'Ankara', 'Reykjavik'],
    rare: ['Thimphu', 'Nukuʻalofa', 'Funafuti', 'Asmara', 'Maseru', 'Lilongwe', 'Dili', 'Paramaribo', 'Yamoussoukro'],
    deepcut: ['Palikir', 'Ngerulmud', 'Bandar Seri Begawan', 'Porto-Novo'],
    krillion: ['Ngerulmud'],
  }),
  q('p24', 'Name a flower', {
    plankton: ['Rose', 'Tulip', 'Daisy', 'Sunflower', 'Lily', 'Daffodil', 'Orchid', 'Carnation', 'Poppy', 'Marigold', 'Violet', 'Peony', 'Iris', 'Lavender'],
    schooler: ['Chrysanthemum', 'Hydrangea', 'Magnolia', 'Foxglove', 'Bluebell', 'Crocus', 'Hibiscus', 'Zinnia', 'Freesia', 'Anemone'],
    rare: ['Protea', 'Bird of paradise', 'Corpse flower', 'Passionflower', 'Wisteria', 'Snapdragon', 'Gloriosa lily', 'Allium'],
    deepcut: ['Chocolate cosmos', 'Ghost orchid', 'Jade vine', 'Middlemist red'],
    krillion: ['Middlemist red'],
  }),
  q('p25', 'Name a tree', {
    plankton: ['Oak', 'Pine', 'Maple', 'Birch', 'Willow', 'Cedar', 'Ash', 'Elm', 'Apple tree', 'Cherry tree', 'Palm tree', 'Redwood', 'Sequoia'],
    schooler: ['Sycamore', 'Magnolia', 'Aspen', 'Beech', 'Spruce', 'Fir', 'Cypress', 'Baobab', 'Eucalyptus', 'Olive tree', 'Chestnut'],
    rare: ['Monkey puzzle tree', 'Ginkgo', 'Banyan', 'Jacaranda', 'Larch', 'Yew', 'Rowan', 'Catalpa'],
    deepcut: ['Wollemi pine', 'Dawn redwood', 'Dragon blood tree', 'Kauri'],
    krillion: ['Wollemi pine'],
  }),
  q('p26', 'Name a type of weather', {
    plankton: ['Rain', 'Snow', 'Sunshine', 'Wind', 'Thunderstorm', 'Hail', 'Fog', 'Sleet', 'Drizzle', 'Heatwave', 'Blizzard', 'Drought'],
    schooler: ['Hurricane', 'Tornado', 'Monsoon', 'Cyclone', 'Freezing rain', 'Dust storm', 'Ice storm', 'Sandstorm', 'Heat lightning', 'Graupel'],
    rare: ['Virga', 'Thundersnow', 'Derecho', 'Waterspout', 'Whiteout', 'Rime ice', 'Ball lightning'],
    deepcut: ['Frost flower', 'St. Elmo’s fire', 'Sprites', 'Diamond dust'],
    krillion: ['Diamond dust'],
  }),
  q('p27', 'Name a language', {
    plankton: ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Chinese', 'Arabic', 'Russian', 'Portuguese', 'Hindi', 'Korean'],
    schooler: ['Swahili', 'Turkish', 'Greek', 'Dutch', 'Polish', 'Thai', 'Vietnamese', 'Hebrew', 'Persian', 'Bengali', 'Ukrainian', 'Indonesian'],
    rare: ['Basque', 'Welsh', 'Quechua', 'Māori', 'Icelandic', 'Yoruba', 'Amharic', 'Cherokee'],
    deepcut: ['Ainu', 'Ladino', 'Klingon', 'Inuktitut'],
    krillion: ['Ainu'],
  }),
  q('p28', 'Name a mode of transport', {
    plankton: ['Car', 'Bus', 'Train', 'Bicycle', 'Airplane', 'Boat', 'Ship', 'Motorcycle', 'Taxi', 'Tram', 'Ferry', 'Truck'],
    schooler: ['Subway', 'Monorail', 'Cable car', 'Hot-air balloon', 'Helicopter', 'Canoe', 'Kayak', 'Rickshaw', 'Sailboat', 'Gondola'],
    rare: ['Funicular', 'Tuk-tuk', 'Snowmobile', 'Hovercraft', 'Zeppelin', 'Segway', 'Dog sled'],
    deepcut: ['Velocipede', 'Coracle', 'Wuppertal Schwebebahn'],
    krillion: ['Coracle'],
  }),
  q('p29', 'Name a breakfast food', {
    plankton: ['Pancakes', 'Waffles', 'Cereal', 'Oatmeal', 'Toast', 'Eggs', 'Bacon', 'Sausage', 'Yogurt', 'Bagel', 'Hash browns', 'French toast'],
    schooler: ['Porridge', 'Granola', 'Omelette', 'Avocado toast', 'Breakfast burrito', 'Muffin', 'Croissant', 'Congee', 'Eggs Benedict', 'Kippers'],
    rare: ['Shakshuka', 'Kedgeree', 'Menemen', 'Arepa de huevo', 'Dutch baby', 'Okonomiyaki'],
    deepcut: ['Welsh rarebit', 'Fårikål breakfast', 'Puttu'],
    krillion: ['Kedgeree'],
  }),
  q('p30', 'Name a dessert', {
    plankton: ['Cake', 'Ice cream', 'Brownie', 'Cookie', 'Pie', 'Donut', 'Pudding', 'Cheesecake', 'Apple crumble', 'Cupcake', 'Chocolate mousse', 'Sundae'],
    schooler: ['Tiramisu', 'Crème brûlée', 'Baklava', 'Pavlova', 'Churros', 'Éclair', 'Cannoli', 'Sticky toffee pudding', 'Trifle', 'Gelato'],
    rare: ['Knafeh', 'Kulfi', 'Sachertorte', 'Tres leches cake', 'Mochi', 'Basbousa', 'Baked Alaska', 'Clafoutis'],
    deepcut: ['Spotted dick', 'Kaiserschmarrn', 'Cranachan', 'Battenberg cake'],
    krillion: ['Cranachan'],
  }),
  q('p31', 'Name a soup', {
    plankton: ['Tomato soup', 'Chicken soup', 'Minestrone', 'Mushroom soup', 'Noodle soup', 'Lentil soup', 'Pea soup', 'Pumpkin soup', 'French onion soup', 'Clam chowder'],
    schooler: ['Borscht', 'Gazpacho', 'Miso soup', 'Pho', 'Ramen', 'Gumbo', 'Consommé', 'Tom yum', 'Sopa de lima', 'Avgolemono'],
    rare: ['Cullen skink', 'Salmorejo', 'Harira', 'Laksa', 'Caldo verde', 'Żurek', 'Ajiaco'],
    deepcut: ['Waterzooi', 'Vichyssoise', 'Bouneschlupp'],
    krillion: ['Waterzooi'],
  }),
  q('p32', 'Name a type of cheese', {
    plankton: ['Cheddar', 'Mozzarella', 'Brie', 'Feta', 'Parmesan', 'Gouda', 'Swiss cheese', 'Cream cheese', 'Blue cheese', 'Cottage cheese'],
    schooler: ['Camembert', 'Gruyère', 'Roquefort', 'Provolone', 'Manchego', 'Halloumi', 'Ricotta', 'Pecorino', 'Monterey Jack', 'Edam'],
    rare: ['Mimolette', 'Stilton', 'Taleggio', 'Époisses', 'Ossau-Iraty', 'Crottin de Chavignol', 'Mahon'],
    deepcut: ['Casu marzu', 'Vacherin Mont d’Or', 'Pule', 'Metsovone'],
    krillion: ['Pule'],
  }),
  q('p33', 'Name a body part', {
    plankton: ['Head', 'Arm', 'Leg', 'Hand', 'Foot', 'Eye', 'Ear', 'Nose', 'Mouth', 'Heart', 'Brain', 'Knee', 'Shoulder', 'Finger'],
    schooler: ['Ankle', 'Wrist', 'Elbow', 'Liver', 'Lung', 'Kidney', 'Pancreas', 'Spleen', 'Collarbone', 'Achilles tendon'],
    rare: ['Uvula', 'Patella', 'Coccyx', 'Scapula', 'Meniscus', 'Diaphragm', 'Phalanx'],
    deepcut: ['Stapes', 'Hyoid bone', 'Philtrum', 'Vomer'],
    krillion: ['Stapes'],
  }),
  q('p34', 'Name a common household tool', {
    plankton: ['Hammer', 'Screwdriver', 'Wrench', 'Pliers', 'Saw', 'Drill', 'Tape measure', 'Level', 'Scissors', 'Utility knife', 'Ladder', 'Flashlight'],
    schooler: ['Allen key', 'Hacksaw', 'Socket wrench', 'Chisel', 'Stud finder', 'Caulking gun', 'Wire strippers', 'Crowbar'],
    rare: ['Coping saw', 'Ratcheting spanner', 'Awl', 'Bradawl', 'Basin wrench', 'Multimeter'],
    deepcut: ['Shingle froe', 'Brace and bit', 'Spokeshave'],
    krillion: ['Spokeshave'],
  }),
  q('p35', 'Name a kitchen appliance', {
    plankton: ['Refrigerator', 'Oven', 'Microwave', 'Toaster', 'Blender', 'Dishwasher', 'Kettle', 'Coffee maker', 'Freezer', 'Rice cooker'],
    schooler: ['Air fryer', 'Slow cooker', 'Food processor', 'Stand mixer', 'Pressure cooker', 'Waffle iron', 'Bread maker', 'Induction hob'],
    rare: ['Sous-vide cooker', 'Dehydrator', 'Pasta machine', 'Soda maker', 'Yogurt maker'],
    deepcut: ['Salamander broiler', 'Combi oven'],
    krillion: ['Salamander broiler'],
  }),
  q('p36', 'Name a fictional superhero', {
    plankton: ['Superman', 'Batman', 'Wonder Woman', 'Spider-Man', 'Iron Man', 'Thor', 'Hulk', 'Captain America', 'Black Panther', 'The Flash', 'Aquaman', 'Wolverine'],
    schooler: ['Daredevil', 'Green Lantern', 'Storm', 'Captain Marvel', 'Black Widow', 'Ant-Man', 'Hawkeye', 'Cyclops', 'Nightcrawler', 'Doctor Strange'],
    rare: ['Moon Knight', 'Blue Beetle', 'Squirrel Girl', 'Booster Gold', 'The Question', 'Swamp Thing', 'Ragman'],
    deepcut: ['Doorman', 'Elsa Bloodstone', 'Man-Thing'],
    krillion: ['Mister Immortal'],
  }),
  q('p37', 'Name a mythological creature', {
    plankton: ['Dragon', 'Unicorn', 'Mermaid', 'Centaur', 'Phoenix', 'Minotaur', 'Griffin', 'Cyclops', 'Sphinx', 'Hydra', 'Kraken', 'Werewolf'],
    schooler: ['Basilisk', 'Chimera', 'Pegasus', 'Cerberus', 'Gorgon', 'Harpy', 'Siren', 'Golem', 'Banshee', 'Yeti'],
    rare: ['Kappa', 'Baku', 'Nuckelavee', 'Kelpie', 'Wendigo', 'Domovoi', 'Qilin', 'Manticore'],
    deepcut: ['Amphisbaena', 'Ahuizotl', 'Each-uisge', 'Taniwha'],
    krillion: ['Nuckelavee'],
  }),
  q('p38', 'Name a play written by William Shakespeare', {
    plankton: ['Hamlet', 'Macbeth', 'Romeo and Juliet', ['Romeo & Juliet', ['Romeo Juliet']], 'Othello', 'King Lear', 'A Midsummer Night’s Dream', 'The Tempest', 'Julius Caesar', 'Twelfth Night'],
    schooler: ['Much Ado About Nothing', 'The Merchant of Venice', 'Richard III', 'The Taming of the Shrew', 'As You Like It', 'The Winter’s Tale', 'Antony and Cleopatra'],
    rare: ['Cymbeline', 'Timon of Athens', 'Pericles, Prince of Tyre', 'Love’s Labour’s Lost', 'Coriolanus'],
    deepcut: ['The Two Noble Kinsmen', 'King John', 'Henry VIII'],
    krillion: ['Timon of Athens'],
  }),
  q('p39', 'Name a video game console', {
    plankton: ['PlayStation', 'Xbox', 'Nintendo Switch', 'Wii', 'Nintendo 64', 'Game Boy', 'PlayStation 2', 'Nintendo DS', 'Super Nintendo', 'Sega Genesis'],
    schooler: ['Atari 2600', 'Dreamcast', 'GameCube', 'PlayStation Portable', 'PlayStation Vita', 'Xbox 360', 'Nintendo 3DS', 'TurboGrafx-16'],
    rare: ['Neo Geo', 'Sega Saturn', 'Atari Jaguar', 'Vectrex', 'WonderSwan', 'Ouya', 'ColecoVision'],
    deepcut: ['Bandai Pippin', 'Amiga CD32', 'Casio Loopy', 'Nintendo Virtual Boy'],
    krillion: ['Casio Loopy'],
  }),
  q('p40', 'Name a country whose English name starts with B', {
    plankton: ['Brazil', 'Bahrain', 'Belgium', 'Bolivia', 'Bulgaria', 'Bahamas', 'Bangladesh', 'Barbados', 'Belarus', 'Belize', 'Benin'],
    schooler: ['Bhutan', 'Botswana', 'Burundi', 'Burkina Faso'],
    rare: ['Bosnia and Herzegovina'],
    krillion: ['Brunei'],
  }),
  q('p41', 'Name a pasta shape or type', {
    plankton: ['Spaghetti', 'Penne', 'Macaroni', 'Fusilli', 'Fettuccine', 'Linguine', 'Lasagna', 'Ravioli', 'Rigatoni', 'Tagliatelle', 'Orzo', 'Rotini'],
    schooler: ['Pappardelle', 'Orecchiette', 'Tortellini', 'Cavatappi', 'Bucatini', 'Farfalle', 'Gnocchi', 'Conchiglie', 'Cannelloni', 'Ditalini'],
    rare: ['Strozzapreti', 'Malloreddus', 'Culurgiones', 'Trofie', 'Cavatelli', 'Radiatori', 'Gemelli', 'Casarecce'],
    deepcut: ['Sagne ’ncannulate', 'Lorighittas', 'Pici', 'Busiate'],
    krillion: ['Lorighittas'],
  }),
  q('p42', 'Name a pizza topping', {
    plankton: ['Pepperoni', 'Mushrooms', 'Onions', 'Sausage', 'Olives', 'Peppers', 'Bacon', 'Ham', 'Pineapple', 'Extra cheese', 'Tomatoes', 'Basil'],
    schooler: ['Anchovies', 'Spinach', 'Artichoke hearts', 'Jalapeños', 'Chicken', 'Feta', 'Prosciutto', 'Sun-dried tomatoes', 'Meatballs'],
    rare: ['Capers', 'Gorgonzola', 'Truffle oil', 'Calabrian chili', 'Nduja', 'Potato', 'Radicchio'],
    deepcut: ['Bottarga', 'Stracciatella'],
    krillion: ['Bottarga'],
  }),
];

// The first seven are retained as a compact deterministic QA set and as a
// compatibility export for tools that used the original sample puzzle.
export const DEMO = { dayNumber: 1, source: 'OpenKrillion sample bank', prompts: BANK.slice(0, 7) };
export const QUESTION_COUNT = BANK.length;
export function questionById(id) { return BANK.find(prompt => prompt.id === id) || null; }
