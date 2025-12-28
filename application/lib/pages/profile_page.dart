import 'package:civic_pulse/core/problem_providers.dart';
import 'package:civic_pulse/core/temp_user_data.dart';
import 'package:civic_pulse/pages/my_complaints_page.dart';
import 'package:civic_pulse/utils/auth_service.dart';
import 'package:civic_pulse/widgets/profile_item.dart';
import 'package:civic_pulse/widgets/profile_sections.dart';
import 'package:civic_pulse/widgets/profile_stats.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final problemsProvider = context.watch<ProblemsProvider>();
    final userProblems = problemsProvider.problemsByUser(
      TempUserData.currentUser.id,
    );

    final totalReports = userProblems.length;
    final resolvedReports = userProblems
        .where((p) => p.status == 'resolved')
        .length;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        leading: const BackButton(color: Colors.white),
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text('PROFILE', style: GoogleFonts.ptSerif(color: Colors.white)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const SizedBox(height: 12),

            const CircleAvatar(
              radius: 44,
              backgroundColor: Colors.blueAccent,
              child: Icon(Icons.person, size: 48, color: Colors.white),
            ),

            const SizedBox(height: 12),

            Text(
              TempUserData.currentUser.name,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 4),

            Text(
              TempUserData.currentUser.email,
              style: const TextStyle(color: Colors.white60, fontSize: 13),
            ),

            const SizedBox(height: 24),

            Row(
              children: [
                ProfileStat(title: 'Reports', value: totalReports.toString()),
                const SizedBox(width: 12),
                ProfileStat(
                  title: 'Resolved',
                  value: resolvedReports.toString(),
                ),
                const SizedBox(width: 12),
                ProfileStat(
                  title: 'Karma',
                  value: (totalReports * 20).toString(),
                ),
              ],
            ),

            const SizedBox(height: 28),

            ProfileSection(
              title: 'Activity',
              items: [
                ProfileItem(
                  icon: Icons.history,
                  label: 'My Complaints',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const MyComplaintsPage(),
                      ),
                    );
                  },
                ),
              ],
            ),

            const SizedBox(height: 20),

            ProfileSection(
              title: 'Account',
              items: [
                const ProfileItem(icon: Icons.edit, label: 'Edit Profile'),
                const ProfileItem(icon: Icons.settings, label: 'Settings'),
                ProfileItem(
                  icon: Icons.logout,
                  label: 'Logout',
                  isDestructive: true,
                  onTap: () async {
                    await AuthService.signOut();

                    if (!context.mounted) return;

                    Navigator.of(context).popUntil((route) => route.isFirst);
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
