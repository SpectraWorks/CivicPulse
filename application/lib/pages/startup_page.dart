import 'package:civic_pulse/core/map_mode.dart';
import 'package:civic_pulse/pages/map_page.dart';
import 'package:civic_pulse/pages/registration_page.dart';
import 'package:civic_pulse/widgets/feature_card.dart';
import 'package:civic_pulse/widgets/title.dart';
import 'package:flutter/material.dart';

class StartupPage extends StatefulWidget {
  const StartupPage({super.key});

  @override
  State<StartupPage> createState() => _StartupPageState();
}

class _StartupPageState extends State<StartupPage> {
  bool showAuth = false;
  bool startInRegisterMode = false;

  @override
  Widget build(BuildContext context) {
    if (showAuth) {
      return LoginPage(
        startInRegisterMode: startInRegisterMode,
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const AppBarTitle(),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                showAuth = true;
                startInRegisterMode = false;
              });
            },
            child: const Text('Log in', style: TextStyle(color: Colors.white70)),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            onPressed: () {
              setState(() {
                showAuth = true;
                startInRegisterMode = true;
              });
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blueAccent,
              foregroundColor: Colors.white,
            ),
            child: const Text('Sign Up'),
          ),
          const SizedBox(width: 12),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              "Don't just complain.\nFix your neighborhood.",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 30,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'CivicPulse is the waze for civic issues.\nTrack problems like traffic, waste, and safety in real time.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white60, fontSize: 16),
            ),
            const SizedBox(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      showAuth = true;
                      startInRegisterMode = true;
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 14),
                  ),
                  child: const Text('Get Started'),
                ),
                const SizedBox(width: 16),
                OutlinedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) =>
                            const MapPage(mode: MapMode.view),
                      ),
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: Colors.white24),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 14),
                  ),
                  child: const Text('View Live Map'),
                ),
              ],
            ),
            const SizedBox(height: 48),
            Row(
              children: const [
                Expanded(
                  child: FeatureCard(
                    icon: Icons.radar,
                    title: 'Real-Time Radar',
                    subtitle:
                        'See what’s affecting your area right now with instant visual alerts.',
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: FeatureCard(
                    icon: Icons.auto_graph,
                    title: 'AI Heatmaps',
                    subtitle:
                        'Gemini-powered clustering to detect high-priority hotspots.',
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: FeatureCard(
                    icon: Icons.groups,
                    title: 'Crowd Powered',
                    subtitle:
                        'Earn karma for verified reports and help your city improve.',
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
