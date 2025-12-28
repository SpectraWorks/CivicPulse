import 'package:civic_pulse/consts/marker_colors.dart';
import 'package:civic_pulse/core/problem_providers.dart';
import 'package:civic_pulse/core/temp_user_data.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class MyComplaintsPage extends StatelessWidget {
  const MyComplaintsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ProblemsProvider>();
    final complaints =
        provider.problemsByUser(TempUserData.currentUser.id);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        leading: const BackButton(color: Colors.white),
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'My Complaints',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
      ),
      body: complaints.isEmpty
          ? const Center(
              child: Text(
                'No complaints submitted yet',
                style: TextStyle(color: Colors.white60),
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: complaints.length,
              separatorBuilder: (_, _) =>
                  const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final problem = complaints[index];

                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    // ignore: deprecated_member_use
                    color: Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: MarkerColors.fromCategory(problem.category),
                      width: 1.5,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 10,
                            height: 10,
                            decoration: BoxDecoration(
                              color: MarkerColors.fromCategory(
                                  problem.category),
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            problem.category,
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 13,
                            ),
                          ),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: problem.status == 'resolved'
                                  // ignore: deprecated_member_use
                                  ? Colors.green.withOpacity(0.2)
                                  // ignore: deprecated_member_use
                                  : Colors.orange.withOpacity(0.2),
                              borderRadius:
                                  BorderRadius.circular(20),
                            ),
                            child: Text(
                              problem.status.toUpperCase(),
                              style: TextStyle(
                                color: problem.status == 'resolved'
                                    ? Colors.greenAccent
                                    : Colors.orangeAccent,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        problem.title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        problem.description,
                        style: const TextStyle(
                          color: Colors.white60,
                          fontSize: 13,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        problem.locationText,
                        style: const TextStyle(
                          color: Colors.white38,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
