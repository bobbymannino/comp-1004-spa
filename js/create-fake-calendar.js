/**
 * A list of random words
 * @type {string[]}
 */
const randomWords = [
    "banana",
    "elephant",
    "sunshine",
    "mountain",
    "ocean",
    "butterfly",
    "courage",
    "whisper",
    "laughter",
    "harmony",
    "vibrant",
    "rainbow",
    "serenity",
    "adventure",
    "wonder",
    "blossom",
    "sparkle",
    "dream",
    "mystery",
    "enchanted",
    "luminous",
    "joyful",
    "splendid",
    "glimmer",
    "radiant",
    "captivating",
    "delight",
    "inspire",
    "magic",
    "treasure",
    "soothing",
    "freedom",
    "tranquility",
    "celestial",
    "fantasy",
    "azure",
    "ethereal",
    "surreal",
    "rapture",
    "dazzle",
    "intrigue",
    "celebrate",
    "exquisite",
    "wanderlust",
    "graceful",
    "playful",
    "whimsical",
    "miracle",
    "euphoria",
    "charmed",
    "glow",
    "utopia",
    "velvet",
    "pure",
    "delicate",
    "fascinate",
    "serendipity",
    "enchant",
    "bliss",
    "marvel",
    "nova",
    "zenith",
    "infinity",
    "twilight",
    "paradise",
    "ethereal",
    "ecstasy",
    "secret",
    "starlight",
    "eternity",
    "ephemeral",
    "lullaby",
    "crystal",
    "divine",
    "arcadia",
    "harmonize",
    "pearl",
    "tranquil",
    "whisper",
    "cosmic",
    "radiance",
    "vision",
    "unity",
    "illuminate",
    "whirlwind",
    "sensation",
    "astonish",
    "nectar",
    "elusive",
    "serene",
    "infinity",
    "reverie",
    "enchantment",
    "zephyr",
];

/**
 * Given a number creates an amount of random events for the calendar.
 * It will be time bound to +- 1 month from creation time.
 * It will reset the current calendar so becareful with it.
 * @param {number} amount
 */
function createFakeCalendar(amount) {
    const newEvents = Array.from({ length: amount }, createRandomEvent);

    calendarData.events = newEvents;
}

/**
 * Creates a random event and returns it.
 * Dated +- 1 month from creation time.
 * @returns {CalendarEvent}
 */
function createRandomEvent() {
    const lorem = Array.from(
        { length: Math.floor(Math.random() * 10) + 10 },
        () => randomWords[Math.floor(Math.random() * randomWords.length)]
    ).join(" ");

    /** @type {CalendarEvent} */
    return {
        description: lorem,
        title: lorem.split(" ").slice(0, 2).join(" "),
        id: crypto.randomUUID(),
        hue: Math.floor(Math.random() * 360),
        priority: Math.floor(Math.random() * 4),
        begin: new Date(Date.now() - 5e9 + Math.floor(Math.random() * 10e9)).toISOString(),
        end: new Date(Date.now() - 5e9 + Math.floor(Math.random() * 10e9)).toISOString(),
    };
}
