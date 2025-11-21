import { localStorageService } from "../../../utils/localStorageService";

/**
 * Score Engine Service
 * Manages game scoring, issue tracking, and score storage
 */
class ScoreEngineService {
  constructor() {
    this.STORAGE_KEY = "currentGameSession";
    this.SCORES_KEY = "scores";
    this.BASE_POINTS = 1000;
    this.MIN_POINTS = 100;
    this.CRITICAL_MULTIPLIER = 1.5;
    
    // Difficulty settings
    this.DIFFICULTY_SETTINGS = {
      easy: {
        pointsPerSecond: 50,
        timerSpeed: 1.0
      },
      medium: {
        pointsPerSecond: 100,
        timerSpeed: 1.25
      },
      hard: {
        pointsPerSecond: 150,
        timerSpeed: 1.5
      }
    };
  }

  /**
   * Initialize a new game session
   * @param {string} scenarioId - The scenario ID
   * @param {string} userId - The current user ID
   * @param {string} scenarioName - The scenario name
   * @param {string} difficulty - The difficulty level ('easy', 'medium', 'hard')
   */
  initializeGame(scenarioId, userId, scenarioName, difficulty = 'easy') {
    // Clear any existing game session first
    localStorage.removeItem(this.STORAGE_KEY);
    
    // Validate difficulty
    const difficultyLevel = difficulty.toLowerCase();
    if (!this.DIFFICULTY_SETTINGS[difficultyLevel]) {
      console.warn(`Invalid difficulty "${difficulty}", defaulting to "easy"`);
      difficulty = 'easy';
    }

    const difficultyConfig = this.DIFFICULTY_SETTINGS[difficultyLevel];

    const gameSession = {
      scenarioId,
      userId,
      scenarioName,
      difficulty: difficultyLevel,
      pointsPerSecond: difficultyConfig.pointsPerSecond,
      timerSpeed: difficultyConfig.timerSpeed,
      score: 0,
      startTime: Date.now(),
      activeIssues: {}, // { deviceId: { issueType, startTime } }
      issuesFixed: 0,
      totalIssues: 0,
      lastPoints: 0,
      isActive: true,
    };


    // Force set to localStorage directly first
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gameSession));
    
    // Then update through the service
    localStorageService.set(this.STORAGE_KEY, gameSession);

    console.log("INITGame: ",gameSession)

    return gameSession;
  }

  /**
   * Get current game session
   */
  getCurrentGame() {
    return localStorageService.get(this.STORAGE_KEY, null);
  }

  /**
   * Record when a device issue starts (yellow/red state)
   * @param {string} deviceId - The device ID
   * @param {string} issueType - 'yellow' or 'red'
   */
  recordIssueStart(deviceId, issueType) {
    const gameSession = this.getCurrentGame();
    if (!gameSession || !gameSession.isActive) {
      console.warn("No active game session");
      return null;
    }

    // Only track if not already tracking this device
    if (!gameSession.activeIssues[deviceId]) {
      gameSession.activeIssues[deviceId] = {
        issueType,
        startTime: Date.now(),
      };
      gameSession.totalIssues++;

      localStorageService.set(this.STORAGE_KEY, gameSession);
    }

    return gameSession;
  }

  /**
   * Calculate points based on time taken to fix
   * @param {number} timeTakenMs - Time in milliseconds
   * @param {string} issueType - 'yellow' or 'red'
   * @param {number} pointsPerSecond - Points deducted per second (from difficulty)
   */
  calculatePoints(timeTakenMs, issueType, pointsPerSecond) {
    const timeTakenSeconds = Math.floor(timeTakenMs / 1000);
    let points = this.BASE_POINTS - timeTakenSeconds * pointsPerSecond;

    // Apply minimum points
    points = Math.max(points, this.MIN_POINTS);

    // Apply critical multiplier for red issues
    if (issueType === "red") {
      points = Math.floor(points * this.CRITICAL_MULTIPLIER);
    }

    return points;
  }

  /**
   * Record when a device is fixed (returns to green)
   * @param {string} deviceId - The device ID
   */
  recordIssueFix(deviceId) {
    const gameSession = this.getCurrentGame();
    if (!gameSession || !gameSession.isActive) {
      console.warn("No active game session");
      return null;
    }

    const issue = gameSession.activeIssues[deviceId];
    if (!issue) {
      console.warn(`No active issue found for device ${deviceId}`);
      return null;
    }

    // Calculate time taken and points using the session's difficulty settings
    const timeTaken = Date.now() - issue.startTime;
    const pointsAwarded = this.calculatePoints(
      timeTaken, 
      issue.issueType, 
      gameSession.pointsPerSecond
    );

    // Update game session
    gameSession.score += pointsAwarded;
    gameSession.issuesFixed++;
    gameSession.lastPoints = pointsAwarded;
    delete gameSession.activeIssues[deviceId];

    localStorageService.set(this.STORAGE_KEY, gameSession);

    return {
      pointsAwarded,
      timeTaken,
      totalScore: gameSession.score,
      issuesFixed: gameSession.issuesFixed,
    };
  }

  /**
   * Get game statistics
   */
  getGameStats() {
    const gameSession = this.getCurrentGame();
    if (!gameSession) return null;

    const activeIssuesCount = Object.keys(gameSession.activeIssues).length;
    const totalTime = Date.now() - gameSession.startTime;
    const avgFixTime =
      gameSession.issuesFixed > 0
        ? Math.floor(totalTime / gameSession.issuesFixed / 1000)
        : 0;

    return {
      score: gameSession.score,
      issuesFixed: gameSession.issuesFixed,
      totalIssues: gameSession.totalIssues,
      activeIssues: activeIssuesCount,
      avgFixTime,
      lastPoints: gameSession.lastPoints,
      elapsedTime: Math.floor(totalTime / 1000),
      difficulty: gameSession.difficulty,
      timerSpeed: gameSession.timerSpeed,
    };
  }

  /**
   * End the game and save score
   * @param {string} playerName - The player's name
   */
  endGame(playerName) {
    const gameSession = this.getCurrentGame();
    
    console.log("endGame: ",gameSession)

    // Return nothing if no game session or zero score
    if (!gameSession || gameSession.score === 0) {
      console.log("HAHAAAAAAA")
      this.clearGame()
      return null;
    }

    gameSession.isActive = false;
    gameSession.endTime = Date.now();

    const gameSummary = {
      name: playerName.trim(),
      score: gameSession.score,
      timestamp: new Date().toISOString(),
      scenarioName: gameSession.scenarioName,
      scenarioId: gameSession.scenarioId,
      difficulty: gameSession.difficulty,
      issuesFixed: gameSession.issuesFixed,
      totalIssues: gameSession.totalIssues,
      duration: Math.floor((gameSession.endTime - gameSession.startTime) / 1000),
      id: Date.now(),
    };

    // Get saved scores
    const scores = localStorageService.get(this.SCORES_KEY, []);

    // Check if this player already has a score for THIS specific scenario
    const existingIndex = scores.findIndex(
      (s) => 
        s.name.toLowerCase() === playerName.trim().toLowerCase() &&
        s.scenarioName === gameSession.scenarioName
    );

    if (existingIndex !== -1) {
      const existing = scores[existingIndex];

      // Keep the higher score only for this scenario
      if (gameSummary.score > existing.score) {
        scores[existingIndex] = gameSummary;
      }
    } else {
      // Add new score entry (new player or same player with different scenario)
      scores.push(gameSummary);
    }

    // Save updated list
    localStorageService.set(this.SCORES_KEY, scores);

    // Clear current game session
    localStorage.removeItem(this.STORAGE_KEY);

    console.log("REACHED")
    return null;
  }

  /**
   * Clear current game session
   */
  clearGame() {
    console.log("rREMOVED")
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Fetch all scores 
   */
  getScores() {
    return Promise.resolve(localStorageService.get(this.SCORES_KEY) || []);
  }
}

// Export singleton instance
export const scoreService = new ScoreEngineService();