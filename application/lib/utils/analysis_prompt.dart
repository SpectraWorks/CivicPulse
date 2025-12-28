import '../core/problems.dart';

String buildAnalysisPrompt(List<Problem> problems) {
  if (problems.isEmpty) {
    return 'No civic issues have been reported yet.';
  }

  final buffer = StringBuffer();

  buffer.writeln(
      'Analyze the following civic complaints and provide insights.');

  for (final p in problems) {
    buffer.writeln(
        '- Category: ${p.category}, Location: ${p.locationText}, Status: ${p.status}, Description: ${p.description}');
  }

  buffer.writeln(
      'Give a short summary, major problem types, and any trends.');

  return buffer.toString();
}
