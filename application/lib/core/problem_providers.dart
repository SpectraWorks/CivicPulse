import 'package:flutter/material.dart';
import 'problems.dart';

class ProblemsProvider extends ChangeNotifier {
  final List<Problem> _problems = [];

  List<Problem> get problems => List.unmodifiable(_problems);

  void addProblem(Problem problem) {
    _problems.add(problem);
    notifyListeners();
  }

  List<Problem> problemsByUser(String userId) {
    return _problems.where((p) => p.userId == userId).toList();
  }

  List<Problem> get pendingProblems {
    return _problems
        .where((p) => p.status == ProblemStatus.pending)
        .toList();
  }

  List<Problem> get resolvedProblems {
    return _problems
        .where((p) => p.status == ProblemStatus.resolved)
        .toList();
  }

  int countByCategory(String category) {
    return _problems.where((p) => p.category == category).length;
  }
}
