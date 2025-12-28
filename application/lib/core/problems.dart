class Problem {
  final String id;
  final String userId;

  final String title;
  final String description;
  final String category;

  final String locationText;
  final double latitude;
  final double longitude;

  final String status; 
  final DateTime createdAt;

  Problem({
    required this.id,
    required this.userId,
    required this.title,
    required this.description,
    required this.category,
    required this.locationText,
    required this.latitude,
    required this.longitude,
    required this.status,
    required this.createdAt,
  });
}

const List<String> categories = [
  'Roads',
  'Garbage',
  'Water',
  'Electricity',
  'Public Safety',
  'Other',
];

class ProblemStatus {
  static const String pending = 'pending';
  static const String resolved = 'resolved';
}
