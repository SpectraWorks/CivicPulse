import 'package:flutter/material.dart';

class InputLabel extends StatelessWidget {
  final String text;
  final double fontSize;

  const InputLabel(this.text, {this.fontSize = 14, super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(
        text,
        style: TextStyle(
          fontSize: fontSize,
          color: Colors.white70,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}