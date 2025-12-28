import '../core/problems.dart';

String runLocalAnalysis(List<Problem> problems) {
  if (problems.isEmpty) {
    return 'No complaints have been reported yet. Once users start reporting issues, AI insights will appear here.';
  }

  final total = problems.length;
  final Map<String, int> categoryCount = {};

  for (final p in problems) {
    categoryCount[p.category] = (categoryCount[p.category] ?? 0) + 1;
  }

  final sorted = categoryCount.entries.toList()
    ..sort((a, b) => b.value.compareTo(a.value));

  final top = sorted.first.key;

  return '''
City Insights Summary

• Total complaints analyzed: $total
• Most affected category: $top

Breakdown:
${sorted.map((e) => '- ${e.key}: ${e.value} reports').join('\n')}

AI Recommendation:
Authorities should prioritize resolving $top-related issues to significantly improve city conditions.
''';
}
