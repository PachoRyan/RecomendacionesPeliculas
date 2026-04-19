const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

const TMDB_GENRES = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    science_fiction: 878,
    thriller: 53,
    war: 10752,
    western: 37,
};

const parseSearchQuery = async (userInput) => {
    const prompt =
        'Given this movie search request: "' +
        userInput +
        '". ' +
        'Return a JSON object with two fields: ' +
        '1. "genres": array of genre keys from this list: ' +
        Object.keys(TMDB_GENRES).join(', ') +
        '. Max 3 genres. ' +
        '2. "keywords": a short English search phrase of max 3 words. ' +
        'Respond ONLY with valid JSON, no markdown, no explanation. ' +
        'Example: {"genres":["horror","thriller"],"keywords":"psychological fear"}';

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);

    return {
        genreIds: parsed.genres.map((g) => TMDB_GENRES[g]).filter(Boolean),
        keywords: parsed.keywords,
    };
};

const getPersonalizedRecommendations = async (favorites) => {
    const titles = favorites.map((f) => f.title).join(', ');
    const prompt =
        'Based on these favorite movies: ' +
        titles +
        '. ' +
        'Suggest 3 genre combinations the user would enjoy. ' +
        'Return ONLY a JSON array of objects with keys "genres" (array of genre keys from: action, adventure, animation, comedy, crime, documentary, drama, family, fantasy, history, horror, music, mystery, romance, science_fiction, thriller, war, western) and "reason" (short Spanish explanation, max 8 words). ' +
        'Example: [{"genres":["thriller","mystery"],"reason":"Suspenso psicológico como tus favoritos"}]. No markdown, no extra text.';

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return JSON.parse(text);
};

const summarizeReviews = async (movieTitle, reviews) => {
    if (!reviews.length) return null;
    const reviewTexts = reviews.map((r, i) => i + 1 + '. ' + r.content.slice(0, 300)).join('\n');
    const prompt =
        'Summarize these reviews for the movie "' +
        movieTitle +
        '" in Spanish in 3 sentences max. ' +
        'Be direct and mention the general consensus. Reviews:\n' +
        reviewTexts +
        '\nRespond ONLY with the summary text.';

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
};

module.exports = {
    parseSearchQuery,
    getPersonalizedRecommendations,
    summarizeReviews,
    TMDB_GENRES,
};
