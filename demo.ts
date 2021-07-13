import Lang from "./src";

// new Lang(`age >= 45`);

const lang = new Lang();

lang.intDeclare(`int age = 45 + 3 + 4`);

lang.prog(`45 + 3 * 6 * 7`);
