export interface RealmGuide {
  guide: string;
  guideName: string;
  guideTitle: string;
  accent: string;
  landscape?: string;
  intro: string;
  dialogue: readonly string[];
}

export const REALM_GUIDES: Record<string, RealmGuide> = {
  artikel: {
    guide: '/guide-archivist.png', guideName: 'Lady Aurelia', guideTitle: 'High Archivist', accent: 'gold', landscape: '/territory-artikel.png',
    intro: 'Every noun seeks its rightful banner. Master A, An and The to keep the isles in perfect order.',
    dialogue: ['Commander, the Article Isles have been expecting you.', 'A, An and The may be small banners, but the wrong one can change the meaning of an entire sentence.'],
  },
  temporalia: {
    guide: '/guide-timekeeper.png', guideName: 'Master Caelum', guideTitle: 'Keeper of Hours', accent: 'blue', landscape: '/territory-temporalia.png',
    intro: 'Past, present and future flow through the great clock. Command every tense and restore the timeline.',
    dialogue: ['You have crossed into Temporalia, Commander. Here, every action leaves an echo in time.', 'Master the past, command the present, and the future path will reveal itself.'],
  },
  concordia: {
    guide: '/characters/concordia.png', guideName: 'Sir Valen', guideTitle: 'Accord Marshal', accent: 'purple',
    intro: 'The mountains stand together. Make every subject and verb march in agreement.',
    dialogue: ['Welcome to Concordia. I am Sir Valen, sworn to keep every sentence in accord.', 'Find the true subject before choosing its verb. A nearby noun can be a convincing decoy.'],
  },
  tagtown: {
    guide: '/characters/tagtown.png', guideName: 'Captain Rhea', guideTitle: 'Border Sentinel', accent: 'amber',
    intro: 'Every statement reaches a border. Give it the question tag that belongs at its gate.',
    dialogue: ['Halt at Tagtown, Commander. Even a confident statement deserves the right final question.', 'A positive statement usually takes a negative tag. Match its auxiliary and pronoun before you pass.'],
  },
  'position-point': {
    guide: '/characters/position-point.png', guideName: 'Warden Orion', guideTitle: 'Master Wayfinder', accent: 'amber',
    intro: 'Across the bridge, beneath the tower, before the bell: small words chart every journey.',
    dialogue: ['You have found Position Point. I am Orion, keeper of the routes between words.', 'Choose each preposition from its context. Place, direction and time all follow different paths.'],
  },
  substitia: {
    guide: '/characters/substitia.png', guideName: 'Lady Nyra', guideTitle: 'Envoy of the Many', accent: 'rose',
    intro: 'A name can wear many faces. Keep each pronoun faithful to the person it represents.',
    dialogue: ['I am Lady Nyra of Substitia. Here, identity survives even when a name is left unspoken.', 'Trace a pronoun to its antecedent. Its number, person and grammatical case must remain clear.'],
  },
  namesworth: {
    guide: '/characters/namesworth.png', guideName: 'Archivist Edric', guideTitle: 'Keeper of Names', accent: 'teal',
    intro: 'Every person, place and idea has a place in the great register of nouns.',
    dialogue: ['Enter Namesworth, Commander. I am Edric, guardian of the words that name our world.', 'Learn which nouns can be counted, how their plurals change, and when a name deserves a capital.'],
  },
  passaggia: {
    guide: '/characters/passaggia.png', guideName: 'Ranger Saira', guideTitle: 'Warden of Hidden Meaning', accent: 'amber',
    intro: 'Read the landscape of a passage. Its evidence reveals the path beyond the obvious.',
    dialogue: ['The canyon has more than one trail. I am Saira, and I read before I choose.', 'An inference must rest on evidence in the passage. Separate what the text supports from what you merely expect.'],
  },
  mannerton: {
    guide: '/characters/mannerton.png', guideName: 'Master Zephyr', guideTitle: 'The Golden Messenger', accent: 'gold',
    intro: 'Move carefully, strike precisely, travel swiftly. An adverb changes the manner of the deed.',
    dialogue: ['A swift welcome from Mannerton! Zephyr, at your service.', 'Ask how, when, where or to what degree. Then place the adverb where its meaning remains clear.'],
  },
  sequentia: {
    guide: '/characters/sequentia.png', guideName: 'Architect Ilyan', guideTitle: 'Keeper of the Ordered Path', accent: 'green',
    intro: 'A strong sentence is built in order. Set each part where its purpose becomes clear.',
    dialogue: ['I am Ilyan of Sequentia. Even good words need a sound structure.', 'Find the subject and main verb first. Then arrange the remaining phrases without breaking their relationships.'],
  },
  descriptia: {
    guide: '/characters/descriptia.png', guideName: 'Lady Vesper', guideTitle: 'Mistress of Attributes', accent: 'purple',
    intro: 'Notice the fine details. Choose adjectives whose form and order sharpen the picture.',
    dialogue: ['You see mountains. I see their shape, age and color. Welcome to Descriptia.', 'Build a clear description. Opinion usually comes before size, age, shape, color, origin and material.'],
  },
  'lexicon-city': {
    guide: '/characters/lexicon-city.png', guideName: 'Chancellor Lucian', guideTitle: 'The Wordsmith', accent: 'red',
    intro: 'In the city of words, precision is power. Choose meaning before ornament.',
    dialogue: ['Lucian welcomes you to Lexicon City. Every word has a history and a purpose.', 'Synonyms can differ in tone and context. Choose the word that fits the sentence, not only the nearest dictionary meaning.'],
  },
  voicelands: {
    guide: '/characters/voicelands.png', guideName: 'Herald Aelius', guideTitle: 'Voice of the Twin Cities', accent: 'gold',
    intro: 'A deed can be told from either side. Preserve its tense when changing its voice.',
    dialogue: ['The twin cities speak through me. I am Aelius, herald of Voicelands.', 'In the passive, the receiver becomes the subject. Use the right form of be and keep the past participle.'],
  },
  junctionia: {
    guide: '/characters/junctionia.png', guideName: 'Bridgekeeper Rowan', guideTitle: 'Binder of Paths', accent: 'green',
    intro: 'Build bridges between ideas. Let every conjunction express the right relationship.',
    dialogue: ['No sentence crosses Junctionia alone. Rowan keeps its bridges true.', 'Decide whether ideas add, contrast, explain a cause or set a condition. Then choose the connector that makes that link.'],
  },
  mayhaven: {
    guide: '/characters/mayhaven.png', guideName: 'Oracle Mira', guideTitle: 'Warden of Possibility', accent: 'teal',
    intro: 'Ability, duty and possibility are different powers. Give each modal its proper force.',
    dialogue: ['Mayhaven holds many possible paths. I am Mira, their watchful keeper.', 'Can, may, must and should do different work. Read the speaker\'s intention before choosing a modal.'],
  },
  ifshire: {
    guide: '/characters/ifshire.png', guideName: 'Seer Isolde', guideTitle: 'Guardian of Unwritten Futures', accent: 'blue',
    intro: 'Follow the branch between condition and consequence. Some futures remain possible; others never were.',
    dialogue: ['I am Isolde. In Ifshire, a single condition can change the shape of a future.', 'Distinguish real possibilities from unreal present or past situations. Keep both clauses on the same conditional path.'],
  },
  quotehaven: {
    guide: '/characters/quotehaven.png', guideName: 'Keeper Quill', guideTitle: 'Chronicler of Voices', accent: 'amber',
    intro: 'Carry another voice faithfully. Shift perspective without losing the speaker\'s meaning.',
    dialogue: ['Welcome to Quotehaven. Quill remembers what was said, and who said it.', 'When reporting speech, check tense, pronouns, and references to time and place. Preserve the original meaning.'],
  },
};
