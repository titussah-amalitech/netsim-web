import { Shield, AlertTriangle, Settings, Trophy, Target } from 'lucide-react';
import { FaBolt, FaCrosshairs, FaChartLine } from 'react-icons/fa';

export const GameGuidelines = () => {
  return (
    <>
      {/* How It Works - Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-network-text-darker dark:text-network-lighter">
            How It Works
          </h2>
          <div className="w-24 h-1 bg-network-accent mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="group bg-gray-50 dark:bg-network-surface border-2 border-network-border-light dark:border-network-border rounded-lg p-6 hover:border-network-success dark:hover:border-network-success transition-all hover:shadow-lg">
            <div className="w-14 h-14 bg-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-network-text-darker dark:text-network-lighter">Monitor Status</h3>
            <p className="text-sm text-network-text-dark dark:text-network-text leading-relaxed">
              Watch device statuses in real-time. Green = Online, Yellow = High Latency, Red = Offline.
            </p>
          </div>

          <div className="group bg-gray-50 dark:bg-network-surface border-2 border-network-border-light dark:border-network-border rounded-lg p-6 hover:border-network-warning dark:hover:border-network-warning transition-all hover:shadow-lg">
            <div className="w-14 h-14 bg-network-warning rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-network-text-darker dark:text-network-lighter">Receive Alerts</h3>
            <p className="text-sm text-network-text-dark dark:text-network-text leading-relaxed">
              Get instant notifications when devices encounter issues. Sound and visual alerts keep you informed.
            </p>
          </div>

          <div className="group bg-gray-50 dark:bg-network-surface border-2 border-network-border-light dark:border-network-border rounded-lg p-6 hover:border-network-accent dark:hover:border-network-accent transition-all hover:shadow-lg">
            <div className="w-14 h-14 bg-network-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-network-text-darker dark:text-network-lighter">Fix Issues</h3>
            <p className="text-sm text-network-text-dark dark:text-network-text leading-relaxed">
              Click devices to adjust parameters: ping interval, latency, and failure probability.
            </p>
          </div>

          <div className="group bg-gray-50 dark:bg-network-surface border-2 border-network-border-light dark:border-network-border rounded-lg p-6 hover:border-network-primary dark:hover:border-network-primary-light transition-all hover:shadow-lg">
            <div className="w-14 h-14 bg-network-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-network-text-darker dark:text-network-lighter">Earn Points</h3>
            <p className="text-sm text-network-text-dark dark:text-network-text leading-relaxed">
              Score based on response time. Faster fixes = higher scores. Compete on the leaderboard!
            </p>
          </div>
        </div>
      </div>

      {/* Scoring System */}
      <div className="bg-gray-50 dark:bg-network-surface border-y-2 border-network-border-light dark:border-network-border py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-network-text-darker dark:text-network-lighter">
              Scoring System
            </h2>
            <div className="w-24 h-1 bg-network-accent mx-auto"></div>
          </div>

          <div className="bg-white dark:bg-network-darker border-2 border-network-border-light dark:border-network-border rounded-lg p-6 sm:p-8 shadow-lg">
            <div className="space-y-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-network-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">1</div>
                <div>
                  <h4 className="font-bold text-lg sm:text-xl mb-2 text-network-text-darker dark:text-network-lighter">Issue Detection</h4>
                  <p className="text-network-text-dark dark:text-network-text leading-relaxed">
                    When a device goes offline or experiences high latency, the timer starts. Base score: 1000 points.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-network-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">2</div>
                <div>
                  <h4 className="font-bold text-lg sm:text-xl mb-2 text-network-text-darker dark:text-network-lighter">Time Penalty</h4>
                  <p className="text-network-text-dark dark:text-network-text leading-relaxed">
                    Points decrease by 50 for every second the issue remains unresolved. Quick action is rewarded!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-network-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">3</div>
                <div>
                  <h4 className="font-bold text-lg sm:text-xl mb-2 text-network-text-darker dark:text-network-lighter">Resolution</h4>
                  <p className="text-network-text-dark dark:text-network-text leading-relaxed">
                    Adjust device parameters to optimal values: Ping ≤ 30ms, Latency ≤ 50ms, Failure Probability ≤ 0.5.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-network-success rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg sm:text-xl mb-2 text-network-text-darker dark:text-network-lighter">Score Added</h4>
                  <p className="text-network-text-dark dark:text-network-text leading-relaxed">
                    Your remaining points are added to your total score. Multiple fixes compound your success!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-network-text-darker dark:text-network-lighter">
            Tips
          </h2>
          <div className="w-24 h-1 bg-network-accent mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-network-primary/10 to-network-accent/10 dark:from-network-primary/20 dark:to-network-accent/20 border-2 border-network-primary dark:border-network-primary-light rounded-lg p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <FaBolt className="w-6 h-6 text-network-primary dark:text-network-primary-light" />
              <h4 className="font-bold text-lg text-network-text-darker dark:text-network-lighter">React Fast</h4>
            </div>
            <p className="text-sm text-network-text-dark dark:text-network-text leading-relaxed">
              The first 50 seconds are crucial. Respond immediately to maximize your points.
            </p>
          </div>

          <div className="bg-gradient-to-br from-network-success/10 to-network-info/10 dark:from-network-success/20 dark:to-network-info/20 border-2 border-network-success dark:border-network-success rounded-lg p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <FaCrosshairs className="w-6 h-6 text-network-success" />
              <h4 className="font-bold text-lg text-network-text-darker dark:text-network-lighter">Prioritize Critical</h4>
            </div>
            <p className="text-sm text-network-text-dark dark:text-network-text leading-relaxed">
              Red (offline) devices are more critical than yellow (high latency). Fix them first!
            </p>
          </div>

          <div className="bg-gradient-to-br from-network-warning/10 to-network-error/10 dark:from-network-warning/20 dark:to-network-error/20 border-2 border-network-warning dark:border-network-warning rounded-lg p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <FaChartLine className="w-6 h-6 text-network-warning" />
              <h4 className="font-bold text-lg text-network-text-darker dark:text-network-lighter">Monitor Logs</h4>
            </div>
            <p className="text-sm text-network-text-dark dark:text-network-text leading-relaxed">
              System logs provide real-time insights. Use them to track device behavior and patterns.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};