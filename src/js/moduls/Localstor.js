export default class LocalStor {
  static getData() {}

  static removeData() {}

  static setCurrentLevel(level) {
    // localStorage.clear();
    localStorage.setItem('currentLevel', `${level}`);
  }

  static getCurrentLevel() {
    // localStorage.clear();
    return localStorage.getItem('currentLevel');
  }

  static setLevelResult(level, decided, help) {
    const data = {
      decided,
      help,
    };
    localStorage.setItem(`level_${level}`, JSON.stringify(data));
    console.log(localStorage);
    // localStorage.clear();
  }

  static getDicidedLevels() {
    const levels = [];
    for (let i = 1; i <= 20; i += 1) {
      const levelInfo = JSON.parse(localStorage.getItem(`level_${i}`));
      if (levelInfo !== null) levels.push({ levelInfo, level: i });
    }
    return levels;
  }
}
