import 'package:civic_pulse/core/map_mode.dart';
import 'package:civic_pulse/core/problem_providers.dart';
import 'package:civic_pulse/pages/analysis_page.dart';
import 'package:civic_pulse/pages/map_page.dart';
import 'package:civic_pulse/pages/my_complaints_page.dart';
import 'package:civic_pulse/pages/profile_page.dart';
import 'package:civic_pulse/pages/report_page.dart';
import 'package:civic_pulse/widgets/home_feature.dart';
import 'package:civic_pulse/widgets/primary_action_card.dart';
import 'package:civic_pulse/widgets/stat_card.dart';
import 'package:civic_pulse/widgets/title.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ProblemsProvider>();

    final totalReported = provider.problems.length;
    final resolved = provider.resolvedProblems.length;
    final hotspots =
        provider.problems.map((p) => p.category).toSet().length;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const AppBarTitle(),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ProfilePage()),
              );
            },
            icon: const Icon(Icons.account_circle, size: 28),
          ),
          const SizedBox(width: 12),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Welcome back!',
              style: TextStyle(color: Colors.white70, fontSize: 14),
            ),
            const SizedBox(height: 4),
            const Text(
              'Let’s improve your city',
              style: TextStyle(
                color: Colors.white,
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),

            PrimaryActionCard(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const ReportProblemPage(),
                  ),
                );
              },
            ),

            const SizedBox(height: 20),

            Row(
              children: [
                StatCard(
                  title: 'Reported',
                  value: totalReported.toString(),
                ),
                const SizedBox(width: 12),
                StatCard(
                  title: 'Resolved',
                  value: resolved.toString(),
                ),
                const SizedBox(width: 12),
                StatCard(
                  title: 'Hotspots',
                  value: hotspots.toString(),
                ),
              ],
            ),

            const SizedBox(height: 28),

            const Text(
              'Explore',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),

            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              children: [
                HomeFeature(
                  icon: Icons.map,
                  title: 'Live Map',
                  subtitle: 'View nearby issues',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const MapPage(mode: MapMode.view),
                      ),
                    );
                  },
                ),
                HomeFeature(
                  icon: Icons.analytics,
                  title: 'Analyze Problems',
                  subtitle: 'Trends & insights',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const AnalysePage(),
                      ),
                    );
                  },
                ),
                HomeFeature(
                  icon: Icons.history,
                  title: 'My Complaints',
                  subtitle: 'Track submissions',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const MyComplaintsPage(),
                      ),
                    );
                  },
                ),
                HomeFeature(
                  icon: Icons.person,
                  title: 'Profile',
                  subtitle: 'Karma & activity',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const ProfilePage(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
