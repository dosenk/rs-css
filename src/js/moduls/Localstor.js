export default class LocalStor {
  static setCurrentLevel(level) {
    localStorage.setItem('currentLevel', `${level}`);
  }

  static getCurrentLevel() {
    return localStorage.getItem('currentLevel');
  }

  static setLevelResult(level, decided, help) {
    const data = {
      decided,
      help,
    };
    localStorage.setItem(`level_${level}`, JSON.stringify(data));
  }

  static getHelpInfo(level) {
    const levelInfo = JSON.parse(localStorage.getItem(`level_${level}`));
    return levelInfo;
  }

  static getDicidedLevels(notDecided = false) {
    const levelsDecided = [];
    const levelsNotDecided = [];
    for (let i = 1; i <= 20; i += 1) {
      const levelInfo = JSON.parse(localStorage.getItem(`level_${i}`));
      if (levelInfo !== null && levelInfo.decided === 1)
        levelsDecided.push({ levelInfo, level: i });
      else levelsNotDecided.push(i);
    }
    return notDecided ? levelsNotDecided : levelsDecided;
  }
}
