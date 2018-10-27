var AllTerms = [
    { word: 'blue', opposites: ['red'] },
    { word: 'red', opposites: ['blue'] },
    { word: 'yellow', opposites: ['red'] },
    { word: 'coarse', opposites: ['fine'] },
    { word: 'fine', opposites: ['coarse'] },
    { word: 'dark', opposites: ['light', ] },
    { word: 'light', opposites: ['dark', ] },
    { word: 'big', opposites: ['small', ] },
    { word: 'small', opposites: ['big', ] },
    { word: 'sharp', opposites: ['fuzzy', ] },
    { word: 'fuzzy', opposites: ['sharp', ] },
];

var items = [
    { item: 'blue_star_on_white.png', attribs: ['blue', 'sharp', 'bg'] },
    { item: 'red_stripes.png', attribs: ['red', 'bg'] },
    { item: 'eye_left.png', attribs: ['fg', 'fuzzy'] },
    { item: 'blue_suit.png', attribs: ['fg', 'blue', 'big'] },
    { item: 'flag_hanging.png', attribs: ['fg', 'blue', 'big', 'fuzzy'] },
];

function attributesMatch(attribSubset, attribSuperSet) {
    if (!attribSubset || attribSubset.length === 0) {
        return false;
    }
    for (let i=0; i < attribSubset.length; i++) {
        if (!attribSuperSet.includes(attribSubset[i])) {
            return false;
        }
    }
    return true;
}

function getItemsLike(attribs) {
    return items.filter(row => attributesMatch(attribs, row.attribs));
}

function getItemsNotLike(attribs) {
    const oppositeWords = getOppositeWords(attribs);
    return getItemsLike(oppositeWords);
}

function getOppositeWords(attribs) {
    const terms = attribs.map(attrib => AllTerms.find(row => row.word === attrib));
    const oppositeWords = [];
    terms.forEach(term => {
        term && term.opposites.forEach(opp => oppositeWords.push(opp));
    });
    return oppositeWords;
}
