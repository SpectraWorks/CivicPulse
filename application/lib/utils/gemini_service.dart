import 'dart:convert';
import 'package:http/http.dart' as http;

class GeminiService {
  static const String _apiKey = 'Unavailable_API_Key';
  static const String _endpoint =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  static Future<String> analyzeProblems(String prompt) async {
    final response = await http.post(
      Uri.parse('$_endpoint?key=$_apiKey'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        "contents": [
          {
            "parts": [
              {"text": prompt}
            ]
          }
        ]
      }),
    );

    if (response.statusCode != 200) {
      return 'AI service unavailable. Please try again.';
    }

    final data = jsonDecode(response.body);

    final candidates = data['candidates'];

    if (candidates == null || candidates.isEmpty) {
      return 'No sufficient data to analyze yet. Add more reports.';
    }

    final parts = candidates[0]['content']?['parts'];

    if (parts == null || parts.isEmpty) {
      return 'Analysis could not be generated at this time.';
    }

    return parts[0]['text'] ?? 'No insights available.';
  }
}
