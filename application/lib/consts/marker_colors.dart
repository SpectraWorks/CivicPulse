import 'package:flutter/material.dart';

class MarkerColors {
  static const Color roads = Colors.redAccent;
  static const Color garbage = Colors.greenAccent;
  static const Color water = Colors.blueAccent;
  static const Color electricity = Colors.yellowAccent;
  static const Color publicSafety = Colors.orangeAccent;
  static const Color other = Colors.purpleAccent;

  static Color fromCategory(String category) {
    switch (category.toLowerCase()) {
      case 'roads':
        return roads;
      case 'garbage':
        return garbage;
      case 'water':
        return water;
      case 'electricity':
        return electricity;
      case 'public safety':
        return publicSafety;
      default:
        return other;
    }
  }
}
